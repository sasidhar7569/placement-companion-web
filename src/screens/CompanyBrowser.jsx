import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, ChevronRight, Target } from 'lucide-react';

const CompanyBrowser = () => {
  const navigate = useNavigate();
  const [targetCompanies, setTargetCompanies] = useState([]);

  useEffect(() => {
    const loadTargets = () => {
      const saved = localStorage.getItem('targetCompanies');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTargetCompanies(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setTargetCompanies([]);
        }
      }
    };
    loadTargets();
    window.addEventListener('targetCompaniesUpdated', loadTargets);
    return () => window.removeEventListener('targetCompaniesUpdated', loadTargets);
  }, []);

  const companies = [
    { id: 'google', name: 'Google', logo: 'G', color: '#ef4444', roles: ['SWE', 'Cloud Engineer'], tags: ['Product Based', 'FAANG'] },
    { id: 'microsoft', name: 'Microsoft', logo: 'M', color: '#0ea5e9', roles: ['SDE', 'PM'], tags: ['Product Based', 'MNC'] },
    { id: 'amazon', name: 'Amazon', logo: 'A', color: '#f59e0b', roles: ['SDE-1', 'SDE-2'], tags: ['Product Based', 'FAANG'] },
    { id: 'meta', name: 'Meta', logo: 'M', color: '#0668e1', roles: ['Software Engineer', 'Product Manager'], tags: ['Product Based', 'FAANG'] },
    { id: 'apple', name: 'Apple', logo: 'A', color: '#94a3b8', roles: ['ICT', 'Hardware'], tags: ['Product Based', 'FAANG'] },
    { id: 'tcs', name: 'TCS', fullName: 'Tata Consultancy Services', logo: 'T', color: '#3b82f6', roles: ['Ninja', 'Digital'], tags: ['Service Based', 'MNC'] },
    { id: 'infy', name: 'Infosys', logo: 'I', color: '#10b981', roles: ['System Engineer', 'Specialist Programmer'], tags: ['Service Based', 'MNC'] },
    { id: 'wipro', name: 'Wipro', logo: 'W', color: '#9c27b0', roles: ['Elite', 'Turbo'], tags: ['Service Based', 'MNC'] },
    { id: 'cogni', name: 'Cognizant', logo: 'C', color: '#8b5cf6', roles: ['GenC', 'GenC Elevate'], tags: ['Service Based', 'MNC'] },
    { id: 'accenture', name: 'Accenture', logo: 'A', color: '#a100ff', roles: ['Associate Software Engineer', 'Advanced ASE'], tags: ['Service Based', 'MNC'] },
    { id: 'goldmansachs', name: 'Goldman Sachs', logo: 'GS', color: '#005a9c', roles: ['Analyst', 'Summer Analyst'], tags: ['Product Based', 'Finance'] },
    { id: 'morganstanley', name: 'Morgan Stanley', logo: 'MS', color: '#003366', roles: ['Technology Analyst', 'Associate'], tags: ['Product Based', 'Finance'] },
    { id: 'jpmorgan', name: 'JPMorgan', logo: 'J', color: '#16a34a', roles: ['Analyst', 'Associate'], tags: ['Product Based', 'Finance'] },
    { id: 'bloomberg', name: 'Bloomberg', logo: 'B', color: '#ff8c00', roles: ['Software Engineer', 'Data Specialist'], tags: ['Product Based', 'Finance'] }
  ];

  const filteredCompanies = companies.filter(c => {
    return Array.isArray(targetCompanies) && targetCompanies.includes(c.name);
  });

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Company Prep</h1>
        <p className="text-secondary text-lg">Role-specific learning paths and preparation roadmaps.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredCompanies.length > 0 ? filteredCompanies.map(c => (
          <div key={c.id} className="card hover:shadow-md cursor-pointer transition-shadow flex flex-col h-full hover:border-primary/50" onClick={() => navigate(`/company/${c.id}`)}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl" style={{ background: `${c.color}15`, color: c.color }}>
                  {c.logo}
                </div>
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-xs text-secondary mt-1">{c.tags.join(' • ')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-2">
              <h4 className="text-xs text-secondary font-semibold uppercase mb-2">Target Roles</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {c.roles.map(role => (
                  <span key={role} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/30">{role}</span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t mt-auto flex justify-between items-center text-sm">
              <span className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View Role Roadmaps <ChevronRight size={16} />
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full card text-center py-12 flex flex-col items-center border-dashed border-2 border-slate-700 bg-transparent">
            <Target size={48} className="text-slate-600 mb-4" />
            <h2 className="text-xl font-bold mb-2">No Target Companies Selected</h2>
            <p className="text-secondary max-w-md mb-6">You haven't selected any dream companies yet. Choose your target companies in your Profile to view custom learning paths.</p>
            <button onClick={() => navigate('/profile')} className="btn-primary">
              Select Target Companies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBrowser;
