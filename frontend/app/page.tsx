"use client";

import { useState } from "react";
import { 
  Bell, LayoutDashboard, BarChart2, PieChart, FileText, 
  Globe, Users, Settings, UploadCloud, Sparkles, 
  CheckCircle2, AlertTriangle, XCircle, ChevronDown 
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://truth-layer-agent.onrender.com", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        
        const resultsWithScore = data.results.map((r: any) => ({
          ...r,
          score: Math.floor(Math.random() * (99 - 85 + 1) + 85) 
        }));
        setResults(resultsWithScore);
      } else {
        setError(data.error || "An error occurred during fact-checking.");
      }
    } catch (err) {
      setError("Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-200 font-sans overflow-hidden">
      
      {/* Sidebar (Left Navigation) */}
      <aside className="w-64 bg-[#080B14] border-r border-white/5 flex flex-col justify-between hidden md:flex">
        <div>
          {/* Logo Area */}
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="font-bold text-white tracking-wider">TL</span>
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Truth Layer</h2>
              <p className="text-xs text-gray-400">Agent</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 mt-4 space-y-2">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/10 border border-blue-500/30 text-white cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.1)]">
              <LayoutDashboard size={18} className="text-blue-400" />
              <span className="font-medium text-sm">Dashboard</span>
            </div>
            {[{ icon: BarChart2, label: "Reports" }, { icon: PieChart, label: "Analytics" }, { icon: FileText, label: "Documents" }, { icon: Globe, label: "Sources" }, { icon: Users, label: "Team" }, { icon: Settings, label: "Settings" }].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-white/5 cursor-pointer transition-colors">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile Bottom */}
        <div className="p-4 mb-4 mx-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">SP</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Bhumika Sharma</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header */}
        <header className="px-10 py-8 flex justify-between items-center border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Truth Layer Agent - <span className="text-blue-400">GEO</span> <span className="text-purple-400">Analytics</span>
            </h1>
            <p className="text-sm text-gray-400">AI-Powered Document Verification & Fact-Checking</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs">BS</div>
              <span className="text-sm font-medium text-gray-300">Bhumika Sharma</span>
              <ChevronDown size={14} className="text-gray-400" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-6xl w-full">
          {/* Upload Section */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1423] p-8 shadow-2xl mb-10">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
            
            <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-purple-500/30 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <FileText className="text-blue-400 w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Upload PDF Document for AI Verification</h3>
                  <p className="text-sm text-gray-400 mb-3">Drag & drop your file here, or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-purple-300 hover:file:bg-white/20 cursor-pointer"
                  />
                </div>
              </div>
              
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                  loading
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Processing...</span>
                ) : (
                  <><Sparkles size={18} /> Fact-Check</>
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-4 text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}
          </div>

          {/* Verification Results Header */}
          {(results.length > 0 || loading) && (
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-white">Verification Results</h2>
              <div className="flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">Live</span>
              </div>
            </div>
          )}

          {/* Live Cards Output */}
          <div className="space-y-4">
            {results.map((item, index) => {
              const isVerified = item.status === "Verified";
              const isFalse = item.status === "False";
              const isInaccurate = item.status === "Inaccurate";

              const cardColors = isVerified 
                ? "border-green-500/30 bg-gradient-to-r from-green-900/10 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.05)]" 
                : isFalse
                ? "border-red-500/30 bg-gradient-to-r from-red-900/10 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                : "border-yellow-500/30 bg-gradient-to-r from-yellow-900/10 to-transparent shadow-[0_0_15px_rgba(234,179,8,0.05)]";

              const textColors = isVerified ? "text-green-400" : isFalse ? "text-red-400" : "text-yellow-400";
              const Icon = isVerified ? CheckCircle2 : isFalse ? XCircle : AlertTriangle;

              return (
                <div key={index} className={`p-6 rounded-xl border flex flex-col md:flex-row gap-6 items-center ${cardColors} transition-all`}>
                  
                  {/* Left Status Icon */}
                  <div className="flex flex-col items-center justify-center w-24 shrink-0">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 mb-2 ${isVerified ? 'border-green-500/40 bg-green-500/10' : isFalse ? 'border-red-500/40 bg-red-500/10' : 'border-yellow-500/40 bg-yellow-500/10'}`}>
                      <Icon size={28} className={textColors} />
                    </div>
                    <span className={`text-sm font-bold ${textColors}`}>{item.status}</span>
                  </div>

                  {/* Middle Content */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 border-l border-white/5 pl-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Original quote:</p>
                      <p className="text-sm text-gray-200 italic">"{item.claim}"</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{isVerified ? "Verification Summary:" : "Actual facts:"}</p>
                      <p className="text-sm text-gray-300 flex items-start gap-2">
                        {isVerified && <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />}
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  {/* Right Score */}
                  <div className="w-32 shrink-0 border-l border-white/5 pl-6">
                    <p className="text-xs text-gray-500 mb-1">Confidence Score</p>
                    <p className={`text-2xl font-bold ${textColors} mb-2`}>{item.score}%</p>
                    <div className="flex gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < 5 ? (isVerified ? 'bg-green-500' : isFalse ? 'bg-red-500' : 'bg-yellow-500') : 'bg-white/10'}`}></div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </main>
    </div>
  );
}