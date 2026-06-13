import React from 'react';
import { FileText, Search, Briefcase, ChevronRight, Upload, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CareerTools = () => {
  const navigate = useNavigate();

  const tools = [
    { id: 'resume', title: 'Resume Builder', desc: 'Create ATS-friendly resumes from scratch or use templates.', icon: FileText, color: '#f59e0b', action: 'Build Resume', path: '/career-tools/resume-builder' },
    { id: 'ats', title: 'ATS Score Checker', desc: 'Upload your resume and a JD to get a compatibility score.', icon: Search, color: '#8b5cf6', action: 'Check Score', path: '/career-tools/ats-checker' },
    { id: 'hr', title: 'HR Interview Prep', desc: 'Practice top behavioral questions with AI feedback.', icon: Briefcase, color: '#10b981', action: 'Start Practicing', path: '/preparation' },
  ];

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Career Tools</h1>
        <p className="text-secondary text-lg">Build a standout profile and prepare for the final rounds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {tools.map(tool => {
          const Icon = tool.icon;
          return (
            <div key={tool.id} className="card hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${tool.color}15`, color: tool.color }}>
                <Icon size={32} />
              </div>
              <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
              <p className="text-secondary text-sm mb-6 flex-1">{tool.desc}</p>
              <button 
                className="btn-outline w-full"
                onClick={() => tool.path && navigate(tool.path)}
              >
                {tool.action}
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-primary/30">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-lg text-indigo-900 mb-1">Quick ATS Check</h3>
              <p className="text-sm text-indigo-700">Upload your PDF resume to instantly check formatting.</p>
            </div>
            <Award size={24} className="text-indigo-500" />
          </div>
          <div 
            className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-800/50 cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 group transition-all"
            onClick={() => navigate('/career-tools/ats-checker')}
          >
            <Upload size={32} className="text-indigo-400 mb-2" />
            <span className="font-semibold text-indigo-900">Click to upload or drag and drop</span>
            <span className="text-xs text-indigo-500 mt-1">PDF only (Max 5MB)</span>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Resume Templates</h3>
            <button className="text-primary text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg overflow-hidden group cursor-pointer">
              <div className="h-40 bg-slate-700 flex items-center justify-center relative">
                <FileText size={48} className="text-gray-300" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-slate-800/50 text-textMain px-4 py-2 rounded font-semibold text-sm">Use Template</span>
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 text-center font-medium text-sm border-t">Modern Classic</div>
            </div>
            <div className="border rounded-lg overflow-hidden group cursor-pointer">
              <div className="h-40 bg-slate-700 flex items-center justify-center relative">
                <FileText size={48} className="text-gray-300" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-slate-800/50 text-textMain px-4 py-2 rounded font-semibold text-sm">Use Template</span>
                </div>
              </div>
              <div className="p-3 bg-slate-800/50 text-center font-medium text-sm border-t">Tech Focused</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerTools;
