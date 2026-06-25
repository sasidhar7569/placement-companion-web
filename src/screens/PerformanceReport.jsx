import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart2, AlertTriangle, Target, CheckCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

const PerformanceReport = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <BackButton className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={18} /> Back
        </BackButton>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2 flex items-center gap-3">
          <BarChart2 className="text-primary" size={32} /> Performance Report
        </h1>
        <p className="text-secondary text-lg">Detailed analytics on your learning progress and test scores.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card border-t-4 border-t-blue-500">
          <h3 className="text-secondary font-bold mb-1">Overall Completion</h3>
          <div className="text-3xl font-bold text-white mb-2">64%</div>
          <div className="w-full bg-slate-700 h-2 rounded-full">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: '64%' }}></div>
          </div>
        </div>
        <div className="card border-t-4 border-t-green-500">
          <h3 className="text-secondary font-bold mb-1">Average Test Score</h3>
          <div className="text-3xl font-bold text-white mb-2">78.5%</div>
          <p className="text-sm text-green-400 flex items-center gap-1"><TrendingUp size={14} /> +5% this week</p>
        </div>
        <div className="card border-t-4 border-t-purple-500">
          <h3 className="text-secondary font-bold mb-1">Global Percentile</h3>
          <div className="text-3xl font-bold text-white mb-2">82nd</div>
          <p className="text-sm text-purple-400 flex items-center gap-1"><Target size={14} /> Top 20%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Module Wise Progress */}
        <div className="card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle size={20} className="text-green-500" /> Topic Completion</h2>
          <div className="space-y-6">
            {[
              { name: 'Quantitative Aptitude', val: 85, color: '#3b82f6' },
              { name: 'Logical Reasoning', val: 70, color: '#8b5cf6' },
              { name: 'Verbal Ability', val: 90, color: '#10b981' },
              { name: 'Data Structures', val: 40, color: '#f59e0b' },
              { name: 'Core Subjects (OS, DBMS)', val: 20, color: '#ec4899' },
            ].map((topic, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span>{topic.name}</span>
                  <span style={{ color: topic.color }}>{topic.val}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${topic.val}%`, backgroundColor: topic.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Area Identification */}
        <div className="card border border-red-500/30 bg-red-500/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400"><AlertTriangle size={20} /> Weak Area Identification</h2>
          <p className="text-secondary mb-4 text-sm">Based on your recent mock test performances, you are losing the most marks in the following areas:</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-800 rounded-xl border-l-4 border-l-red-500">
              <h4 className="font-bold">Dynamic Programming</h4>
              <p className="text-xs text-secondary mt-1">Accuracy: 35% • Average Time: 12m/q</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border-l-4 border-l-orange-500">
              <h4 className="font-bold">Permutation & Combination</h4>
              <p className="text-xs text-secondary mt-1">Accuracy: 45% • Average Time: 4m/q</p>
            </div>
            <div className="p-4 bg-slate-800 rounded-xl border-l-4 border-l-yellow-500">
              <h4 className="font-bold">Operating Systems - Scheduling</h4>
              <p className="text-xs text-secondary mt-1">Accuracy: 50% • Average Time: 1m/q</p>
            </div>
          </div>

          <button className="w-full mt-6 btn-outline border-red-500/50 text-red-400 hover:bg-red-500/10">Generate Remedial Plan</button>
        </div>

      </div>
    </div>
  );
};

export default PerformanceReport;
