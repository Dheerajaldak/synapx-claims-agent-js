const express = require('express');
const multer = require('multer');
const PDFParser = require("pdf2json");
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const upload = multer({ dest: 'uploads/' });

/**
 * Enhanced Extraction Logic 
 * Designed to ignore form instructions and capture only user-filled data.
 */
const extractFields = (text) => {
    const cleanText = text.includes('%') ? decodeURIComponent(text) : text;

    const getVal = (regex, blacklist = []) => {
        const match = cleanText.match(regex);
        if (!match) return null;
        const value = match[1].trim();
        
        // Validation: If the value is just a form instruction, return null
        const isInstruction = blacklist.some(item => value.includes(item));
        return isInstruction || value.length < 2 ? null : value;
    };

    const damageStr = getVal(/Estimated\s*Damage[:\s]*\$?([\d,]+)/i);
    const estimatedDamage = damageStr ? parseFloat(damageStr.replace(/,/g, '')) : 0;

    // Common form noise to filter out
    const noise = ["(First, Middle, Last)", "INSURED'S MAILING ADDRESS", "ACORD 101", "AND TIMEAM", "IF NOT AT SPECIFIC"];

    return {
        // Policy Information [cite: 14-17]
        policyNumber: getVal(/Policy\s*Number[:\s]+([^\n\r]+)/i, ["OTHER INSURANCE"]),
        policyholderName: getVal(/Name\s*of\s*Insured[:\s]+([^\n\r]+)/i, noise),
        effectiveDates: getVal(/Effective\s*Dates[:\s]+([^\n\r]+)/i),
        
        // Incident Information [cite: 18-22]
        incidentDate: getVal(/Date\s*of\s*Loss[:\s]+([^\n\r\s]+)/i, ["AND TIME"]),
        incidentTime: getVal(/Time[:\s]+([^\n\r]+)/i, ["OF THE ACCIDENT"]),
        location: getVal(/Location\s*of\s*Loss[:\s]+([^\n\r]+)/i, noise),
        description: getVal(/Description\s*of\s*Accident[:\s]+([\s\S]*?)(?=\r?\n\r?\n|INSURED VEHICLE|$)/i, noise) || "",
        
        // Involved Parties [cite: 23-26]
        claimant: getVal(/Claimant[:\s]+([^\n\r]+)/i, ["for the purpose of"]),
        thirdParties: getVal(/Third\s*Parties[:\s]+([^\n\r]+)/i),
        contactDetails: getVal(/Contact[:\s]+([^\n\r]+)/i, ["(A/C, No, Ext)"]),
        
        // Asset Details [cite: 27-30]
        assetType: getVal(/Asset\s*Type[:\s]+([^\n\r]+)/i),
        assetId: getVal(/Asset\s*ID[:\s]+([^\n\r]+)/i) || getVal(/V\.I\.N\.[:\s]+([^\n\r]+)/i),
        estimatedDamage: estimatedDamage,
        
        // Other Mandatory Fields [cite: 31-34]
        claimType: cleanText.toLowerCase().includes('injury') ? 'injury' : 'property',
        attachments: cleanText.toLowerCase().includes('attachments: yes') ? "Yes" : "No",
        initialEstimate: estimatedDamage 
    };
};

/**
 * Routing Engine [cite: 35-40]
 */
const applyRouting = (extracted) => {
    let recommendedRoute = "Standard Queue";
    let reasoning = "All mandatory fields validated.";
    let missingFields = [];

    // Mandatory Field Check 
    const mandatory = ['policyNumber', 'policyholderName', 'incidentDate', 'location', 'description', 'estimatedDamage'];
    mandatory.forEach(field => {
        if (!extracted[field] || extracted[field] === 0 || extracted[field] === "") {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        recommendedRoute = "Manual review";
        reasoning = `Missing mandatory fields: ${missingFields.join(', ')}.`;
    } 
    // Fraud Rule [cite: 38]
    else if (extracted.description.toLowerCase().match(/fraud|inconsistent|staged/)) {
        recommendedRoute = "Investigation Flag";
        reasoning = "Potential fraud indicators detected in claim description.";
    }
    // Injury Rule [cite: 39]
    else if (extracted.claimType === 'injury') {
        recommendedRoute = "Specialist Queue";
        reasoning = "Claim involves personal injury, routing to specialist.";
    } 
    // Damage Threshold [cite: 36]
    else if (extracted.estimatedDamage < 25000) {
        recommendedRoute = "Fast-track";
        reasoning = "Estimate below $25,000 threshold.";
    }

    return { extractedFields: extracted, missingFields, recommendedRoute, reasoning };
};

app.post('/process-claim', upload.single('fnol'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const handleResult = (text) => {
        const result = applyRouting(extractFields(text));
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.json(result);
    };

    if (req.file.mimetype === 'text/plain') {
        handleResult(fs.readFileSync(req.file.path, 'utf8'));
    } else {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on("pdfParser_dataReady", () => handleResult(pdfParser.getRawTextContent()));
        pdfParser.on("pdfParser_dataError", () => res.status(500).json({ error: "Parsing Error" }));
        pdfParser.loadPDF(req.file.path);
    }
});

app.listen(5000, () => console.log('Backend running on port 5000'));