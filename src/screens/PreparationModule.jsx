import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Terminal, Brain, Search, Filter } from 'lucide-react';

const PreparationModule = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Aptitude', 'Reasoning', 'Verbal', 'Core Subjects'];

  const topics = [
    // Aptitude
    { id: 1, title: 'Time & Work, Pipes & Cisterns', category: 'Aptitude', progress: 80, concepts: 12, questions: 150, icon: BookOpen, color: '#3b82f6' },
    { id: 2, title: 'Percentages, Profit & Loss', category: 'Aptitude', progress: 45, concepts: 15, questions: 200, icon: BookOpen, color: '#3b82f6' },
    { id: 3, title: 'Number Systems & Algebra', category: 'Aptitude', progress: 10, concepts: 22, questions: 350, icon: BookOpen, color: '#3b82f6' },
    
    // Reasoning
    { id: 4, title: 'Syllogisms & Logical Deductions', category: 'Reasoning', progress: 60, concepts: 8, questions: 120, icon: Brain, color: '#8b5cf6' },
    { id: 5, title: 'Blood Relations & Direction Sense', category: 'Reasoning', progress: 30, concepts: 6, questions: 90, icon: Brain, color: '#8b5cf6' },
    { id: 6, title: 'Complex Seating Arrangements', category: 'Reasoning', progress: 0, concepts: 10, questions: 140, icon: Brain, color: '#8b5cf6' },
    
    // Core Subjects
    { id: 7, title: 'Operating Systems & Concurrency', category: 'Core Subjects', progress: 15, concepts: 28, questions: 400, icon: Terminal, color: '#10b981' },
    { id: 8, title: 'Database Management Systems (DBMS)', category: 'Core Subjects', progress: 5, concepts: 35, questions: 450, icon: Code, color: '#f59e0b' },
    { id: 9, title: 'Computer Networks Architecture', category: 'Core Subjects', progress: 0, concepts: 32, questions: 380, icon: Terminal, color: '#10b981' },
    { id: 10, title: 'Object Oriented Programming (OOP)', category: 'Core Subjects', progress: 50, concepts: 20, questions: 280, icon: Code, color: '#f59e0b' },
    
    // Verbal
    { id: 11, title: 'Advanced Reading Comprehension', category: 'Verbal', progress: 90, concepts: 6, questions: 180, icon: BookOpen, color: '#ec4899' },
    { id: 12, title: 'Sentence Correction & Core Grammar', category: 'Verbal', progress: 100, concepts: 18, questions: 250, icon: BookOpen, color: '#ec4899' },
  ];

  const filteredTopics = activeTab === 'All' ? topics : topics.filter(t => t.category === activeTab);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Learning & Preparation</h1>
        <p className="text-secondary text-lg">Master the core concepts before jumping into mock tests.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 md:pb-0">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
                activeTab === cat ? 'bg-primary text-white' : 'bg-slate-800/50 border text-textMuted hover:bg-slate-800/80'
              }`}
              style={{ background: activeTab === cat ? 'var(--primary-color)' : '' }}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={18} className="text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search topics..." className="form-input pl-10 h-full py-2" />
          </div>
          <button className="btn-outline px-3 py-2"><Filter size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => {
          const Icon = topic.icon;
          return (
            <div 
              key={topic.id} 
              className="card hover:shadow-md transition-shadow cursor-pointer border-t-4" 
              style={{ borderTopColor: topic.color }}
              onClick={() => navigate(`/topic/${topic.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl" style={{ background: `${topic.color}15`, color: topic.color }}>
                  <Icon size={24} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-700 rounded text-secondary">{topic.category}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{topic.title}</h3>
              <div className="flex gap-4 text-sm text-secondary mb-4">
                <span className="flex items-center gap-1"><BookOpen size={14} /> {topic.concepts} Concepts</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} /> {topic.questions} Questions</span>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Progress</span>
                  <span style={{ color: topic.color }}>{topic.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${topic.progress}%`, background: topic.color }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple mock icons to prevent missing imports
const PlayCircle = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>;
const CheckCircle = ({size}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

export default PreparationModule;
