# 🧠 Autonomous Insurance Claims Processing Agent

This project is an implementation of an **Autonomous Insurance Claims Processing Agent** developed as part of the **Synapx assignment**.  
The agent processes **FNOL (First Notice of Loss)** documents, extracts key information, identifies missing fields, and intelligently routes claims based on predefined business rules with clear reasoning.
Realy enjoyed making this agent.

---

## 🔗 Project Links

- **GitHub Repository**  
  https://github.com/Dheerajaldak/synapx-claims-agent-js.git

- **Frontend (Live on Vercel)**  
  https://synapx-claims-agent-dheeraj.vercel.app

- **Backend API (Live on Render)**  
  https://testing-deployment-b8qa.onrender.com

- **Demo Video (Google Drive)**  
  https://drive.google.com/file/d/1bZalGb3fMW20hcXVcPDTbOmzzM8RMCq_/view

---

## 📌 Problem Statement

Build a lightweight autonomous agent that:

- Extracts key fields from FNOL documents (PDF/TXT)
- Identifies missing or inconsistent mandatory fields
- Classifies and routes claims based on defined rules
- Provides a clear explanation for the routing decision
- Outputs structured JSON data

---

## 🧾 Extracted Fields

### Policy Information
- Policy Number  
- Policyholder Name  
- Policy Effective Dates  

### Incident Information
- Incident Date  
- Incident Time  
- Incident Location  
- Incident Description  

### Involved Parties
- Claimant  
- Third Parties  
- Contact Details  

### Asset Details
- Asset Type  
- Asset ID  
- Estimated Damage  

### Other Mandatory Fields
- Claim Type  
- Attachments  
- Initial Estimate  

---

## 🔀 Claim Routing Rules

| Condition | Route |
|--------|------|
| Estimated damage < ₹25,000 | Fast-track |
| Any mandatory field missing | Manual Review |
| Description contains `fraud`, `inconsistent`, `staged` | Investigation Flag |
| Claim type = `injury` | Specialist Queue |

---

## 📤 Output JSON Format

```json
{
  "extractedFields": {},
  "missingFields": [],
  "recommendedRoute": "",
  "reasoning": ""
}
