import React, { useState, useEffect } from 'react';
import { CheckCircle, Code2, AlertCircle, Building2, Bookmark } from 'lucide-react';
import { API_BASE_URL, syncFetch } from '../assets/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

export const companiesData = [
  {
    name: 'Apple',
    domain: 'apple.com',
    topics: {
      Easy: [
        { id: 'app-e1', name: 'Arrays & Strings' },
        { id: 'app-e2', name: 'Two Pointers' },
        { id: 'app-e3', name: 'Linked Lists' },
        { id: 'app-e4', name: 'Math & Geometry' }
      ],
      Medium: [
        { id: 'app-m1', name: 'Trees & Graphs' },
        { id: 'app-m2', name: 'Sliding Window' },
        { id: 'app-m3', name: 'Intervals' },
        { id: 'app-m4', name: 'Matrix' }
      ],
      Hard: [
        { id: 'app-h1', name: 'Advanced DP' },
        { id: 'app-h2', name: 'Hard Graphs' },
        { id: 'app-h3', name: 'Tries' }
      ]
    }
  },
  {
    name: 'Google',
    domain: 'google.com',
    topics: {
      Easy: [
        { id: 'goo-e1', name: 'Hash Maps' },
        { id: 'goo-e2', name: 'Binary Search' },
        { id: 'goo-e3', name: 'Bit Manipulation' }
      ],
      Medium: [
        { id: 'goo-m1', name: 'Dynamic Programming' },
        { id: 'goo-m2', name: 'Graph Traversal (BFS/DFS)' },
        { id: 'goo-m3', name: 'Tries & Strings' },
        { id: 'goo-m4', name: 'Heaps & Priority Queues' }
      ],
      Hard: [
        { id: 'goo-h1', name: 'Segment Trees' },
        { id: 'goo-h2', name: 'Binary Lifting' },
        { id: 'goo-h3', name: 'Advanced Math' }
      ]
    }
  },
  {
    name: 'Microsoft',
    domain: 'microsoft.com',
    topics: {
      Easy: [
        { id: 'ms-e1', name: 'Linked Lists' },
        { id: 'ms-e2', name: 'Trees (Basic)' },
        { id: 'ms-e3', name: 'Strings' }
      ],
      Medium: [
        { id: 'ms-m1', name: 'System Design Basics' },
        { id: 'ms-m2', name: 'Binary Search Trees' },
        { id: 'ms-m3', name: 'Backtracking' },
        { id: 'ms-m4', name: 'Greedy Algorithms' }
      ],
      Hard: [
        { id: 'ms-h1', name: 'Advanced System Design' },
        { id: 'ms-h2', name: 'Tries' },
        { id: 'ms-h3', name: 'Hard DP' }
      ]
    }
  },
  {
    name: 'IBM',
    domain: 'ibm.com',
    topics: {
      Easy: [
        { id: 'ibm-e1', name: 'Loops & Conditions' },
        { id: 'ibm-e2', name: 'Basic SQL' },
        { id: 'ibm-e3', name: 'Arrays' }
      ],
      Medium: [
        { id: 'ibm-m1', name: 'Queues & Stacks' },
        { id: 'ibm-m2', name: 'Object Oriented Programming' },
        { id: 'ibm-m3', name: 'Database Normalization' }
      ],
      Hard: [
        { id: 'ibm-h1', name: 'Cloud Architecture Basics' },
        { id: 'ibm-h2', name: 'Complex SQL Queries' }
      ]
    }
  },
  {
    name: 'JPMorgan',
    domain: 'jpmorganchase.com',
    topics: {
      Easy: [
        { id: 'jpm-e1', name: 'Basic Math' },
        { id: 'jpm-e2', name: 'String Manipulation' },
        { id: 'jpm-e3', name: 'Sorting' }
      ],
      Medium: [
        { id: 'jpm-m1', name: 'Hash Tables' },
        { id: 'jpm-m2', name: 'Financial Algorithms' },
        { id: 'jpm-m3', name: 'Data Structures' }
      ],
      Hard: [
        { id: 'jpm-h1', name: 'Dynamic Programming' },
        { id: 'jpm-h2', name: 'Graph Algorithms' },
        { id: 'jpm-h3', name: 'Concurrency & Multithreading' }
      ]
    }
  },
  {
    name: 'Amazon',
    domain: 'amazon.com',
    topics: {
      Easy: [
        { id: 'amz-e1', name: 'Arrays & Hashing' },
        { id: 'amz-e2', name: 'Linked Lists' },
        { id: 'amz-e3', name: 'Binary Search' }
      ],
      Medium: [
        { id: 'amz-m1', name: 'Trees & Graphs' },
        { id: 'amz-m2', name: 'Dynamic Programming' },
        { id: 'amz-m3', name: 'Sliding Window' },
        { id: 'amz-m4', name: 'Two Pointers' }
      ],
      Hard: [
        { id: 'amz-h1', name: 'Advanced Graphs' },
        { id: 'amz-h2', name: 'LRU Cache' },
        { id: 'amz-h3', name: 'Hard DP' }
      ]
    }
  },
  {
    name: 'Meta',
    domain: 'meta.com',
    topics: {
      Easy: [
        { id: 'meta-e1', name: 'Array Manipulation' },
        { id: 'meta-e2', name: 'Binary Tree Path' },
        { id: 'meta-e3', name: 'Valid Palindrome' }
      ],
      Medium: [
        { id: 'meta-m1', name: 'Subarray Sum' },
        { id: 'meta-m2', name: 'Binary Tree Right Side View' },
        { id: 'meta-m3', name: 'Simplify Path' },
        { id: 'meta-m4', name: 'K Closest Points' }
      ],
      Hard: [
        { id: 'meta-h1', name: 'Binary Tree Maximum Path Sum' },
        { id: 'meta-h2', name: 'Serialize and Deserialize Binary Tree' },
        { id: 'meta-h3', name: 'Minimum Window Substring' }
      ]
    }
  },
  {
    name: 'TCS',
    domain: 'tcs.com',
    topics: {
      Easy: [
        { id: 'tcs-e1', name: 'Numerical Ability' },
        { id: 'tcs-e2', name: 'Logical Reasoning' },
        { id: 'tcs-e3', name: 'Basic Coding (Arrays/Strings)' }
      ],
      Medium: [
        { id: 'tcs-m1', name: 'Data Structures (Stacks/Queues)' },
        { id: 'tcs-m2', name: 'DBMS & SQL Queries' },
        { id: 'tcs-m3', name: 'Operating Systems basics' }
      ],
      Hard: [
        { id: 'tcs-h1', name: 'Advanced Coding (Graphs/DP)' },
        { id: 'tcs-h2', name: 'System Design Fundamentals' }
      ]
    }
  },
  {
    name: 'Infosys',
    domain: 'infosys.com',
    topics: {
      Easy: [
        { id: 'infy-e1', name: 'Mathematical Ability' },
        { id: 'infy-e2', name: 'Verbal Ability' },
        { id: 'infy-e3', name: 'Pseudocode Solving' }
      ],
      Medium: [
        { id: 'infy-m1', name: 'Data Structures (Trees/Linked Lists)' },
        { id: 'infy-m2', name: 'OOP Concepts' },
        { id: 'infy-m3', name: 'DBMS Normalization' }
      ],
      Hard: [
        { id: 'infy-h1', name: 'Competitive Programming' },
        { id: 'infy-h2', name: 'SQL Query Optimization' }
      ]
    }
  },
  {
    name: 'Wipro',
    domain: 'wipro.com',
    topics: {
      Easy: [
        { id: 'wip-e1', name: 'Aptitude & Verbal' },
        { id: 'wip-e2', name: 'Basic Programming' }
      ],
      Medium: [
        { id: 'wip-m1', name: 'Searching & Sorting' },
        { id: 'wip-m2', name: 'Object-Oriented Programming' },
        { id: 'wip-m3', name: 'Database Fundamentals' }
      ],
      Hard: [
        { id: 'wip-h1', name: 'Intermediate Data Structures' },
        { id: 'wip-h2', name: 'Computer Networks' }
      ]
    }
  },
  {
    name: 'Cognizant',
    domain: 'cognizant.com',
    topics: {
      Easy: [
        { id: 'cts-e1', name: 'Quantitative Aptitude' },
        { id: 'cts-e2', name: 'Automata Debugging' }
      ],
      Medium: [
        { id: 'cts-m1', name: 'Data Structures fundamentals' },
        { id: 'cts-m2', name: 'SQL Queries' },
        { id: 'cts-m3', name: 'Behavioral prep' }
      ],
      Hard: [
        { id: 'cts-h1', name: 'Coding & Algorithm design' },
        { id: 'cts-h2', name: 'Web development basics' }
      ]
    }
  },
  {
    name: 'Accenture',
    domain: 'accenture.com',
    topics: {
      Easy: [
        { id: 'acn-e1', name: 'Cognitive Ability' },
        { id: 'acn-e2', name: 'English Ability' }
      ],
      Medium: [
        { id: 'acn-m1', name: 'Pseudocode & Common Applications' },
        { id: 'acn-m2', name: 'Network Security basics' },
        { id: 'acn-m3', name: 'Coding Assessment' }
      ],
      Hard: [
        { id: 'acn-h1', name: 'Advanced Algorithms' },
        { id: 'acn-h2', name: 'Cloud Computing Concepts' }
      ]
    }
  },
  {
    name: 'Goldman Sachs',
    domain: 'goldmansachs.com',
    topics: {
      Easy: [
        { id: 'gs-e1', name: 'Numerical Aptitude' },
        { id: 'gs-e2', name: 'Probability & Statistics' }
      ],
      Medium: [
        { id: 'gs-m1', name: 'DSA (Stack, Queue, Map)' },
        { id: 'gs-m2', name: 'OOPs & C++ / Java concepts' },
        { id: 'gs-m3', name: 'Operating Systems' }
      ],
      Hard: [
        { id: 'gs-h1', name: 'Advanced Dynamic Programming' },
        { id: 'gs-h2', name: 'System Scalability' }
      ]
    }
  },
  {
    name: 'Morgan Stanley',
    domain: 'morganstanley.com',
    topics: {
      Easy: [
        { id: 'msy-e1', name: 'Mathematical Aptitude' },
        { id: 'msy-e2', name: 'Basic CS Concepts' }
      ],
      Medium: [
        { id: 'msy-m1', name: 'Algorithms (Trees/Sorting)' },
        { id: 'msy-m2', name: 'Java Multithreading' },
        { id: 'msy-m3', name: 'Database Management' }
      ],
      Hard: [
        { id: 'msy-h1', name: 'System Design basics' },
        { id: 'msy-h2', name: 'Advanced Algorithmic Design' }
      ]
    }
  },
  {
    name: 'Bloomberg',
    domain: 'bloomberg.com',
    topics: {
      Easy: [
        { id: 'bb-e1', name: 'Basic DSA (Arrays/Lists)' },
        { id: 'bb-e2', name: 'Financial Concepts basics' }
      ],
      Medium: [
        { id: 'bb-m1', name: 'Hash Maps & Heap' },
        { id: 'bb-m2', name: 'Low-Level Design Patterns' },
        { id: 'bb-m3', name: 'Process Scheduling' }
      ],
      Hard: [
        { id: 'bb-h1', name: 'Distributed Caching' },
        { id: 'bb-h2', name: 'Memory Efficient Algorithms' }
      ]
    }
  }
];

const CodingDashboard = () => {
  const userName = localStorage.getItem('userName') || 'John';
  const [filteredCompaniesData, setFilteredCompaniesData] = useState(companiesData);
  const [activeCompanyObj, setActiveCompanyObj] = useState(companiesData[0]);
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('codingProgress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const isBookmarked = (topicId) => {
    return Array.isArray(bookmarks) && bookmarks.some(b => b.id === topicId);
  };

  const toggleBookmark = async (topic, e) => {
    e.stopPropagation();
    const topicId = topic.id;
    const currentlyBookmarked = isBookmarked(topicId);
    let newBookmarks;
    if (currentlyBookmarked) {
      newBookmarks = bookmarks.filter(b => b.id !== topicId);
    } else {
      const newBookmark = {
        id: topicId,
        title: topic.name,
        category: 'Coding Prep',
        time: '15 mins',
        date: new Date().toLocaleDateString()
      };
      newBookmarks = [...bookmarks, newBookmark];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await syncFetch(`${API_BASE_URL}/api/sync/bookmarks`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ bookmarks: newBookmarks })
        });
      } catch (err) {
        console.error('Error saving bookmarks:', err);
      }
    }
  };

  useEffect(() => {
    connectSocket();

    const fetchSyncData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await syncFetch(`${API_BASE_URL}/api/sync/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          if (result.data.codingProgress) {
            setCompletedTopics(result.data.codingProgress);
            localStorage.setItem('codingProgress', JSON.stringify(result.data.codingProgress));
          }
          if (result.data.bookmarks) {
            setBookmarks(result.data.bookmarks);
            localStorage.setItem('bookmarks', JSON.stringify(result.data.bookmarks));
          }
          if (result.data.targetCompanies) {
            localStorage.setItem('targetCompanies', JSON.stringify(result.data.targetCompanies));
            window.dispatchEvent(new Event('targetCompaniesUpdated'));
          }
        }
      } catch (err) {
        console.error('Error loading coding sync data:', err);
      }
    };
    fetchSyncData();

    const unsubscribeProgress = subscribeToEvent('progressUpdated', (backendProgress) => {
      console.log('Real-time coding progress update:', backendProgress);
      if (backendProgress) {
        if (backendProgress.codingProgress) {
          setCompletedTopics(backendProgress.codingProgress);
          localStorage.setItem('codingProgress', JSON.stringify(backendProgress.codingProgress));
        }
        if (backendProgress.targetCompanies) {
          localStorage.setItem('targetCompanies', JSON.stringify(backendProgress.targetCompanies));
          window.dispatchEvent(new Event('targetCompaniesUpdated'));
        }
      }
    });

    const unsubscribeData = subscribeToEvent('dataUpdated', (backendData) => {
      console.log('Real-time coding data update:', backendData);
      if (backendData && backendData.bookmarks) {
        setBookmarks(backendData.bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(backendData.bookmarks));
      }
    });

    return () => {
      unsubscribeProgress();
      unsubscribeData();
    };
  }, []);

  useEffect(() => {
    const loadTargets = () => {
      const saved = localStorage.getItem('targetCompanies');
      let targets = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            targets = parsed;
          }
        } catch (e) {}
      }
      
      if (targets.length > 0) {
        const filtered = companiesData.filter(c => targets.includes(c.name));
        if (filtered.length > 0) {
          setFilteredCompaniesData(filtered);
          setActiveCompanyObj(prev => {
            if (filtered.find(f => f.name === prev?.name)) return prev;
            return filtered[0];
          });
        } else {
          setFilteredCompaniesData([]);
        }
      } else {
        setFilteredCompaniesData([]);
      }
    };
    loadTargets();
    window.addEventListener('targetCompaniesUpdated', loadTargets);
    return () => window.removeEventListener('targetCompaniesUpdated', loadTargets);
  }, []);

  const toggleTopic = async (topicId) => {
    const newStatus = !completedTopics[topicId];
    const updated = { ...completedTopics, [topicId]: newStatus };
    setCompletedTopics(updated);
    localStorage.setItem('codingProgress', JSON.stringify(updated));

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await syncFetch(`${API_BASE_URL}/api/sync/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ codingProgress: updated })
        });
      } catch (err) {
        console.error('Error saving coding progress:', err);
      }
    }
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;
    Object.values(activeCompanyObj.topics).forEach(difficultyList => {
      total += difficultyList.length;
      difficultyList.forEach(t => {
        if (completedTopics[t.id]) completed++;
      });
    });
    return Math.round((completed / total) * 100) || 0;
  };

  const getCompanyLogoUrl = (domain) => {
    return `https://logo.clearbit.com/${domain}`;
  };

  if (!activeCompanyObj) {
    return (
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textMain mb-2">Topics Preparation</h1>
          <p className="text-secondary text-lg">Track your preparation progress for your targeted topics.</p>
        </div>
        <div className="card text-center py-16 flex flex-col items-center border-dashed border-2 border-slate-700 bg-transparent">
          <Building2 size={64} className="text-slate-600 mb-6" />
          <h2 className="text-2xl font-bold mb-3">No Target Companies Selected</h2>
          <p className="text-secondary max-w-md">You haven't selected any dream companies yet. Please update your profile to see tailored preparation paths.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Topics Preparation</h1>
          <p className="text-secondary text-lg">Track your preparation progress for your targeted topics.</p>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Completion</span>
          <span className="text-2xl font-bold text-primary">{calculateProgress()}%</span>
        </div>
      </div>

      {/* 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Easy Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Easy Topics</h3>
          </div>
          {activeCompanyObj.topics.Easy.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-green-500/10 border-green-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold flex-1 pr-2 ${completedTopics[topic.id] ? 'text-green-400' : 'text-textMain'}`}>{topic.name}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleBookmark(topic, e)}
                  className={`p-1 rounded transition-colors ${isBookmarked(topic.id) ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                >
                  <Bookmark size={18} fill={isBookmarked(topic.id) ? 'currentColor' : 'none'} />
                </button>
                <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  completedTopics[topic.id] ? 'bg-green-500 border-green-500 text-white' : 'border-slate-500 text-transparent'
                }`}>
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Medium Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Medium Topics</h3>
          </div>
          {activeCompanyObj.topics.Medium.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold flex-1 pr-2 ${completedTopics[topic.id] ? 'text-yellow-400' : 'text-textMain'}`}>{topic.name}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleBookmark(topic, e)}
                  className={`p-1 rounded transition-colors ${isBookmarked(topic.id) ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                >
                  <Bookmark size={18} fill={isBookmarked(topic.id) ? 'currentColor' : 'none'} />
                </button>
                <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  completedTopics[topic.id] ? 'bg-yellow-500 border-yellow-500 text-white' : 'border-slate-500 text-transparent'
                }`}>
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hard Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            <h3 className="text-lg font-bold text-white">Hard Topics</h3>
          </div>
          {activeCompanyObj.topics.Hard.map(topic => (
            <div 
              key={topic.id} 
              className={`p-4 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                completedTopics[topic.id] ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-800/50 border-slate-700 hover:border-primary/50'
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              <span className={`font-semibold flex-1 pr-2 ${completedTopics[topic.id] ? 'text-red-400' : 'text-textMain'}`}>{topic.name}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => toggleBookmark(topic, e)}
                  className={`p-1 rounded transition-colors ${isBookmarked(topic.id) ? 'text-primary' : 'text-slate-500 hover:text-white'}`}
                >
                  <Bookmark size={18} fill={isBookmarked(topic.id) ? 'currentColor' : 'none'} />
                </button>
                <button className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  completedTopics[topic.id] ? 'bg-red-500 border-red-500 text-white' : 'border-slate-500 text-transparent'
                }`}>
                  <CheckCircle size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default CodingDashboard;
