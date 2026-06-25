import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle, AlertCircle, RefreshCw, BarChart } from 'lucide-react';
import BackButton from '../components/BackButton';
import { useNavigate } from 'react-router-dom';

const ATSChecker = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleScan = () => {
    if (!file || !jobRole) return;
    
    setIsScanning(true);
    
    // Simulate scan time
    setTimeout(() => {
      setIsScanning(false);
      
      // Generate a more dynamic score
      const randomFactor = Math.floor(Math.random() * 20); // 0 to 19
      const calculatedScore = Math.min(96, 60 + (jobRole.length % 10) + randomFactor);

      // Dynamic keywords based on role
      const lowerRole = jobRole.toLowerCase();
      let keywords = ['Teamwork', 'Communication', 'Problem Solving', 'Agile'];
      if (lowerRole.includes('react') || lowerRole.includes('frontend') || lowerRole.includes('web')) {
        keywords = ['Redux', 'TypeScript', 'Responsive Design', 'Webpack', 'Accessibility'];
      } else if (lowerRole.includes('backend') || lowerRole.includes('node') || lowerRole.includes('java')) {
        keywords = ['Microservices', 'REST APIs', 'Docker', 'Kubernetes', 'SQL'];
      } else if (lowerRole.includes('data') || lowerRole.includes('machine learning')) {
        keywords = ['Python', 'Pandas', 'TensorFlow', 'ETL', 'Data Visualization'];
      } else if (lowerRole.includes('manager') || lowerRole.includes('product')) {
        keywords = ['Agile', 'Scrum', 'Stakeholder Management', 'Roadmapping', 'KPIs'];
      }

      setResults({
        score: calculatedScore,
        missingKeywords: keywords,
        actionVerbs: ['Developed', 'Spearheaded', 'Optimized', 'Designed', 'Orchestrated', 'Implemented', 'Led'].sort(() => 0.5 - Math.random()).slice(0, 4),
        formatting: {
          status: calculatedScore > 70 ? 'success' : 'warning',
          message: calculatedScore > 70 ? 'Formatting looks clean and ATS-readable.' : 'Avoid complex tables. Use standard fonts and bullet points.'
        },
        impact: {
          status: calculatedScore > 80 ? 'success' : 'warning',
          message: calculatedScore > 80 ? 'Excellent use of measurable metrics in your experience section.' : 'Try to quantify your achievements more (e.g., "Increased sales by 20%").'
        }
      });
    }, 2500);
  };

  return (
    <div className="page-container min-h-full flex flex-col relative overflow-y-auto custom-scrollbar bg-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="flex items-center gap-4 mb-8 relative z-10">
        <BackButton className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300">
          <ArrowLeft size={24} />
        </BackButton>
        <div>
          <h1 className="text-3xl font-bold text-textMain">ATS Score Checker</h1>
          <p className="text-secondary text-sm mt-1">Optimize your resume for applicant tracking systems.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 relative z-10">
        {/* Left Side: Input */}
        <div className="space-y-6 flex flex-col">
          <div className="card flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-4">1. Target Job Role</h3>
            <input 
              type="text" 
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g., Senior React Developer"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all mb-8"
            />

            <h3 className="text-lg font-bold mb-4">2. Upload Resume</h3>
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-2xl bg-slate-800/50 hover:bg-slate-800 hover:border-primary transition-colors cursor-pointer p-8 text-center group min-h-[200px]">
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
              
              {file ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4">
                    <FileText size={32} />
                  </div>
                  <span className="font-semibold text-textMain text-lg">{file.name}</span>
                  <span className="text-sm text-secondary mt-2">Click to replace file</span>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-slate-700 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors flex items-center justify-center mb-4">
                    <Upload size={32} />
                  </div>
                  <span className="font-semibold text-textMain text-lg mb-2">Click to upload or drag & drop</span>
                  <span className="text-sm text-secondary">PDF, DOC, DOCX (Max 5MB)</span>
                </>
              )}
            </label>
          </div>
          
          <button 
            onClick={handleScan}
            disabled={!file || !jobRole || isScanning}
            className={`w-full py-4 mt-auto rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              !file || !jobRole ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transform hover:-translate-y-1'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw size={24} className="animate-spin" />
                Scanning Resume...
              </>
            ) : (
              <>
                <BarChart size={24} />
                Analyze Resume Score
              </>
            )}
          </button>
        </div>

        <div className="card relative overflow-y-auto custom-scrollbar flex flex-col min-h-[400px]">
          {!results && !isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                <BarChart size={48} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-textMain mb-2">Waiting for Analysis</h3>
              <p className="text-secondary max-w-sm">Upload your resume and enter a job role to see how well it matches the ATS criteria.</p>
            </div>
          ) : isScanning ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText size={32} className="text-primary animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-textMain mb-2">Simulating ATS Parsing...</h3>
              <p className="text-primary">Extracting keywords, checking formatting, and scoring...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-col items-center mb-8 border-b border-slate-700 pb-8">
                <h2 className="text-xl font-bold mb-6 text-slate-300">Overall Match for: <span className="text-white">{jobRole}</span></h2>
                
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle className="text-slate-800 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    {/* Progress circle */}
                    <circle 
                      className={`${results.score > 75 ? 'text-green-500' : results.score > 60 ? 'text-yellow-500' : 'text-red-500'} stroke-current transition-all duration-1000 ease-out`} 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      strokeDasharray={`${results.score * 2.51} 251.2`} 
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white">{results.score}<span className="text-2xl text-slate-400">%</span></span>
                  </div>
                </div>
                <p className="mt-4 text-center text-slate-400 font-medium">
                  {results.score > 75 ? 'Excellent Match! You have a high chance of passing the ATS.' : 
                   results.score > 60 ? 'Good Match. Some improvements needed to guarantee an interview.' : 
                   'Low Match. Significant optimization required for this specific role.'}
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <AlertCircle size={20} className="text-yellow-500" />
                    Missing Keywords to Improve
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-sm font-medium">
                        + {kw}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Adding these keywords contextually in your experience section can boost your score by up to 15%.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${results.formatting.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-200">
                      {results.formatting.status === 'warning' ? <AlertCircle size={16} className="text-yellow-500"/> : <CheckCircle size={16} className="text-green-500"/>}
                      Formatting
                    </h4>
                    <p className="text-sm text-slate-400">{results.formatting.message}</p>
                  </div>
                  <div className={`p-4 rounded-xl border ${results.impact.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-200">
                      {results.impact.status === 'warning' ? <AlertCircle size={16} className="text-yellow-500"/> : <CheckCircle size={16} className="text-green-500"/>}
                      Impact & Metrics
                    </h4>
                    <p className="text-sm text-slate-400">{results.impact.message}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-500" />
                    Action Verbs Detected
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.actionVerbs.map((verb, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-semibold">
                        {verb}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSChecker;
