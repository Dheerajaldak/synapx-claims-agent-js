// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     // UPDATED: Changed alert message to include TXT files
//     if (!file) return alert("Please select a PDF or TXT file first.");

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('fnol', file);

//     try {
//       const response = await axios.post('http://localhost:5000/process-claim', formData);
//       setResult(response.data);
//     } catch (error) {
//       console.error("Error processing claim:", error);
//       alert("Failed to process document.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
//       <div className="max-w-4xl mx-auto">
//         <header className="mb-10">
//           <h1 className="text-3xl font-extrabold text-blue-900">Synapx Claims Agent</h1>
//           <p className="text-slate-600">Autonomous FNOL Extraction & Routing</p>
//         </header>

//         <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-slate-200">
//           {/* UPDATED: Title reflects supported types */}
//           <h2 className="text-lg font-semibold mb-4">Upload Loss Notice (PDF or TXT)</h2>
//           <div className="flex items-center gap-4">
//             <input
//               type="file"
//               // UPDATED: Added .txt to the accepted file types
//               accept=".pdf,.txt"
//               onChange={handleFileChange}
//               className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             <button
//               onClick={handleUpload}
//               disabled={loading || !file}
//               className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition disabled:bg-slate-300"
//             >
//               {loading ? "Processing..." : "Process Claim"}
//             </button>
//           </div>
//         </div>

//         {result && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
//             {/* Routing Card */}
//             <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-600">
//               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Recommended Route</h3>
//               <div className="text-2xl font-bold text-blue-900 mb-3">{result.recommendedRoute}</div>
//               <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded">{result.reasoning}</p>
//             </div>

//             {/* JSON Output Card */}
//             <div className="bg-slate-900 p-6 rounded-xl shadow-md overflow-hidden">
//               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Extracted JSON Data</h3>
//               <pre className="text-xs text-green-400 overflow-auto max-h-60 custom-scrollbar">
//                 {JSON.stringify(result, null, 2)}
//               </pre>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Zap,
  AlertTriangle,
  UserSearch,
  FileText,
  Upload,
  Database,
  CheckCircle,
  Loader2,
} from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("fnol", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/process-claim",
        formData,
      );
      setResult(response.data);
    } catch (error) {
      alert("Processing failed. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getRouteTheme = (route) => {
    switch (route) {
      case "Fast-track":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: <Zap />,
        };
      case "Specialist Queue":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: <ShieldCheck />,
        };
      case "Investigation Flag":
        return {
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: <AlertTriangle />,
        };
      case "Manual review":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: <UserSearch />,
        };
      default:
        return {
          color: "text-slate-600",
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: <FileText />,
        };
    }
  };

  const theme = result ? getRouteTheme(result.recommendedRoute) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header: Responsive flex-col on mobile, flex-row on desktop */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Synapx Agent
            </h1>
            <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-widest">
              Autonomous Claims Intelligence Platform
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <label className="flex items-center justify-center gap-2 cursor-pointer px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent sm:border-none">
              <Upload size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-600 truncate max-w-[200px]">
                {file ? file.name : "Choose FNOL..."}
              </span>
              <input
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2.5 rounded-xl font-bold transition-all disabled:bg-slate-100 disabled:text-slate-400 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {loading ? "Analyzing..." : "Process Claim"}
            </button>
          </div>
        </header>

        {result ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Main Content: Spans 8 columns on desktop */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              {/* Decision Hero Card [cite: 296, 297] */}
              <div
                className={`${theme.bg} ${theme.border} border-2 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`p-1.5 rounded-lg bg-white shadow-sm ${theme.color}`}
                    >
                      {theme.icon}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${theme.color}`}
                    >
                      System Recommendation [cite: 287]
                    </span>
                  </div>
                  <h2
                    className={`text-3xl md:text-4xl font-black mb-4 ${theme.color}`}
                  >
                    {result.recommendedRoute}
                  </h2>
                  <div className="bg-white/60 backdrop-blur-md p-4 rounded-xl md:rounded-2xl border border-white/80 text-slate-800 text-sm leading-relaxed shadow-sm">
                    <strong>Reasoning:</strong> "{result.reasoning}" [cite: 262]
                  </div>
                </div>
              </div>

              {/* Extraction Grid [cite: 265, 286, 294] */}
              <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6 md:mb-8">
                  <Database className="text-blue-600" size={20} />
                  <h3 className="font-black text-xl text-slate-800">
                    Extracted Intelligence
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
                  {Object.entries(result.extractedFields).map(([key, val]) => (
                    <div
                      key={key}
                      className="group border-b border-slate-50 sm:border-none pb-4 sm:pb-0"
                    >
                      <div className="text-[10px] text-slate-400 font-black uppercase mb-1 tracking-tighter group-hover:text-blue-500 transition-colors">
                        {key.replace(/([A-Z])/g, " $1")}
                      </div>
                      <div
                        className={`text-sm font-bold break-words ${val ? "text-slate-700" : "text-red-400 italic"}`}
                      >
                        {val || "Missing Field"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technical Sidebar: Spans 4 columns on desktop [cite: 292, 298] */}
            <div className="lg:col-span-4 h-full">
              <div className="bg-[#0F172A] rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    Raw API Output [cite: 293]
                  </h3>
                </div>
                <pre className="text-[10px] md:text-[11px] text-emerald-400/90 font-mono leading-relaxed overflow-x-auto custom-scrollbar max-h-[400px] lg:max-h-[600px]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[300px] md:h-[400px] border-2 border-dashed border-slate-200 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center justify-center text-slate-400 px-4 text-center">
            <Upload size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm md:text-base">
              Waiting for FNOL document upload...
            </p>
            <p className="text-[10px] uppercase tracking-widest mt-2 opacity-60">
              PDF and TXT supported [cite: 264]
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
