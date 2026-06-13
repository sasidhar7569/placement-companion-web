import React, { useState } from 'react';
import { Briefcase, Building2, Calendar, Users, ChevronRight, CheckCircle2, ChevronLeft, FileText, Code, Map } from 'lucide-react';

const Roadmap = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  const roadmaps = [
    { 
      id: 1, company: 'Google', role: 'Software Engineer', location: 'Bangalore / Remote', type: 'Full Time', 
      deadline: 'Oct 15, 2026', applicants: '2.4k', logo: 'G', color: '#ea4335',
      rounds: [
        { name: 'Online Assessment', desc: '2 Coding questions, 90 mins.', icon: Code },
        { name: 'Technical Interview 1', desc: 'Data Structures & Algorithms.', icon: FileText },
        { name: 'Technical Interview 2', desc: 'System Design & Problem Solving.', icon: FileText },
        { name: 'Googlyness Round', desc: 'Behavioral and Cultural Fit.', icon: Users }
      ],
      topics: ['Graphs & Trees', 'Dynamic Programming', 'System Design Basics', 'Operating Systems']
    },
    { 
      id: 2, company: 'Infosys', role: 'Specialist Programmer', location: 'Multiple Locations', type: 'Full Time', 
      deadline: 'Nov 01, 2026', applicants: '12k', logo: 'I', color: '#10b981',
      rounds: [
        { name: 'Aptitude Test', desc: 'Quants, Logical, Verbal.', icon: FileText },
        { name: 'Coding Round', desc: '3 Medium-Hard level questions.', icon: Code },
        { name: 'Technical + HR Interview', desc: 'Project discussions and HR questions.', icon: Users }
      ],
      topics: ['DBMS', 'Arrays & Strings', 'Object Oriented Programming', 'Aptitude Basics']
    },
    { 
      id: 3, company: 'TCS', role: 'Digital Profile', location: 'Pan India', type: 'Full Time', 
      deadline: 'Oct 28, 2026', applicants: '45k', logo: 'T', color: '#3b82f6',
      rounds: [
        { name: 'TCS NQT', desc: 'Cognitive skills and 2 Coding questions.', icon: Code },
        { name: 'Technical Interview', desc: 'Core subjects and latest tech stack.', icon: FileText },
        { name: 'MR & HR Round', desc: 'Managerial and HR questions.', icon: Users }
      ],
      topics: ['Advanced Coding', 'SQL Queries', 'Computer Networks', 'Java/Python Basics']
    }
  ];

  if (selectedCompany) {
    return (
      <div className="page-container animate-fade-in">
        <button 
          className="flex items-center gap-2 text-textMuted hover:text-textMain mb-6 transition-colors"
          onClick={() => setSelectedCompany(null)}
        >
          <ChevronLeft size={20} /> Back to Roadmaps
        </button>

        <div className="card mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border-t-4 relative overflow-hidden" style={{ borderTopColor: selectedCompany.color }}>
          <div className="absolute right-[-10%] top-[-20%] opacity-10 pointer-events-none">
             <Map size={250} color={selectedCompany.color} />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg" style={{ background: `${selectedCompany.color}20`, color: selectedCompany.color }}>
                {selectedCompany.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-textMain">{selectedCompany.company} Master Roadmap</h1>
                <p className="text-xl text-textMuted flex items-center gap-2 mt-1">
                  <Briefcase size={20} /> Target Role: {selectedCompany.role}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Hiring Process Timeline */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-textMain">Selection Timeline ({selectedCompany.rounds.length} Steps)</h2>
            <div className="relative border-l-2 border-slate-700 ml-4 space-y-8 pb-4">
              {selectedCompany.rounds.map((round, idx) => {
                const Icon = round.icon;
                return (
                  <div key={idx} className="relative pl-8 group">
                    <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-secondary shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:border-secondary transition-colors">
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <div className="card p-5 hover:border-secondary/50 transition-all hover:-translate-y-1">
                      <h3 className="font-bold text-lg text-textMain mb-1 flex items-center gap-2">
                        <Icon size={18} className="text-primary" /> {round.name}
                      </h3>
                      <p className="text-sm text-textMuted">{round.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Topics to Prepare */}
          <div>
            <h2 className="text-xl font-bold mb-6 text-textMain">Key Focus Areas</h2>
            <div className="card bg-slate-800/50">
              <p className="text-sm text-textMuted mb-6">Based on previous year patterns, you must master these concepts to pass the roadmap:</p>
              <div className="flex flex-col gap-4">
                {selectedCompany.topics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 border border-slate-700 hover:border-primary/50 transition-colors">
                    <CheckCircle2 className="text-secondary" size={20} />
                    <span className="font-medium text-textMain">{topic}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-primary/10 text-primary border border-primary/30 rounded-xl font-bold hover:bg-primary/20 transition-colors">
                Start Topic Preparation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Placement Roadmaps</h1>
        <p className="text-textMuted text-lg">Follow structured, company-specific roadmaps to systematically conquer your placements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {roadmaps.map(companyData => (
          <div key={companyData.id} className="card p-6 hover:border-slate-500 cursor-pointer flex flex-col justify-between group transition-all hover:-translate-y-1" onClick={() => setSelectedCompany(companyData)}>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md" style={{ background: `${companyData.color}20`, color: companyData.color }}>
                  {companyData.logo}
                </div>
                <div className="bg-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 font-medium">
                  {companyData.rounds.length} Steps
                </div>
              </div>
              
              <h3 className="font-bold text-2xl text-textMain group-hover:text-secondary transition-colors mb-2">{companyData.company}</h3>
              <p className="text-textMuted font-medium mb-4 flex items-center gap-2"><Briefcase size={16}/>{companyData.role}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <span className="text-sm text-textMuted">Structured Path</span>
              <div className="flex items-center gap-1 text-primary font-bold group-hover:underline">
                Explore <ChevronRight size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
