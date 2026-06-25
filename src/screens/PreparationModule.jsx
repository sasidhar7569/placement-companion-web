import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Brain, Terminal, MessageCircle, X, ChevronRight, 
  Flame, TrendingUp, Clock, Bookmark, CheckCircle, Lock,
  PlayCircle, FileText, Target
} from 'lucide-react';
import { API_BASE_URL, syncFetch } from '../assets/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

const PreparationModule = () => {
  const navigate = useNavigate();
  // States
  const [showExploreTopics, setShowExploreTopics] = useState(false);
  const [showCompleteKit, setShowCompleteKit] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [topicsData, setTopicsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('bookmarks');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });
  const [completedTopics, setCompletedTopics] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  // Load initial data and subscribe to sockets
  useEffect(() => {
    connectSocket();

    const fetchSyncData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        try {
          const loadedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
          setBookmarks(loadedBookmarks);
        } catch (e) {}
        return;
      }
      try {
        const res = await syncFetch(`${API_BASE_URL}/api/sync/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          if (result.data.prepCompleted) {
            setCompletedTopics(result.data.prepCompleted);
            localStorage.setItem('prepCompleted', JSON.stringify(result.data.prepCompleted));
          }
          if (result.data.bookmarks) {
            setBookmarks(result.data.bookmarks);
            localStorage.setItem('bookmarks', JSON.stringify(result.data.bookmarks));
          }
        }
      } catch (err) {
        console.error('Error loading prep module sync data:', err);
        try {
          const loadedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
          setBookmarks(loadedBookmarks);
        } catch (e) {}
      }
    };
    fetchSyncData();

    const unsubscribeProgress = subscribeToEvent('progressUpdated', (backendProgress) => {
      console.log('Real-time prep progress update:', backendProgress);
      if (backendProgress && backendProgress.prepCompleted) {
        setCompletedTopics(backendProgress.prepCompleted);
        localStorage.setItem('prepCompleted', JSON.stringify(backendProgress.prepCompleted));
      }
    });

    const unsubscribeData = subscribeToEvent('dataUpdated', (backendData) => {
      console.log('Real-time prep data update:', backendData);
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

  // Calculate category progress from completed topics
  const getCategoryProgress = (categoryId) => {
    try {
      const stored = localStorage.getItem('prepCompleted');
      const completed = stored ? JSON.parse(stored) : {};
      const keys = Object.keys(completed).filter(k => k.startsWith(categoryId) || k.includes(categoryId));
      if (keys.length === 0) return 0;
      const completedCount = keys.filter(k => completed[k]).length;
      return Math.round((completedCount / keys.length) * 100);
    } catch {
      return 0;
    }
  };

  const toggleComplete = async (topic, e) => {
    e.stopPropagation();
    const newStatus = !completedTopics[topic.id];
    const newCompleted = { ...completedTopics, [topic.id]: newStatus };
    setCompletedTopics(newCompleted);
    localStorage.setItem('prepCompleted', JSON.stringify(newCompleted));
    setToastMessage(newStatus ? 'Marked as completed' : 'Marked as incomplete');
    setTimeout(() => setToastMessage(''), 3000);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await syncFetch(`${API_BASE_URL}/api/sync/progress`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ prepCompleted: newCompleted })
        });
      } catch (err) {
        console.error('Error saving prep progress:', err);
      }
    }
  };

  const toggleBookmark = async (topic, e) => {
    e.stopPropagation();
    const existing = bookmarks.find(b => b.id === topic.id);
    let newBookmarks;
    if (existing) {
      newBookmarks = bookmarks.filter(b => b.id !== topic.id);
      setToastMessage('Removed from bookmarks');
    } else {
      const newBookmark = {
        id: topic.id,
        title: topic.title,
        category: activeCategory.title,
        time: topic.time || '10 mins',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      newBookmarks = [...bookmarks, newBookmark];
      setToastMessage('Added to bookmarks');
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setTimeout(() => setToastMessage(''), 3000);

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

  const categories = [
    {
      id: 'aptitude',
      title: 'Aptitude',
      description: 'Master quantitative aptitude with a structured learning roadmap.',
      icon: BookOpen,
      color: '#3b82f6',
      progress: getCategoryProgress('aptitude'),
      time: '40 Hours',
      jsonFile: `${import.meta.env.BASE_URL}data/aptitude.json`,
      zipFile: `${import.meta.env.BASE_URL}materials/aptitude-kit.zip`
    },
    {
      id: 'reasoning',
      title: 'Logical Reasoning',
      description: 'Build logical thinking and analytical problem-solving skills.',
      icon: Brain,
      color: '#8b5cf6',
      progress: getCategoryProgress('reasoning'),
      time: '30 Hours',
      jsonFile: `${import.meta.env.BASE_URL}data/reasoning.json`,
      zipFile: `${import.meta.env.BASE_URL}materials/reasoning-kit.zip`
    },
    {
      id: 'verbal',
      title: 'Verbal Ability',
      description: 'Improve communication, grammar, and reading comprehension.',
      icon: MessageCircle,
      color: '#ec4899',
      progress: getCategoryProgress('verbal'),
      time: '25 Hours',
      jsonFile: `${import.meta.env.BASE_URL}data/verbal.json`,
      zipFile: `${import.meta.env.BASE_URL}materials/verbal-kit.zip`
    },
    {
      id: 'core-subjects',
      title: 'Core Subjects',
      description: 'Revise essential computer science concepts for technical interviews.',
      icon: Terminal,
      color: '#10b981',
      progress: getCategoryProgress('core-subjects'),
      time: '50 Hours',
      jsonFile: `${import.meta.env.BASE_URL}data/core-subjects.json`,
      zipFile: `${import.meta.env.BASE_URL}materials/core-subjects-kit.zip`
    }
  ];

  const fetchTopics = async (category) => {
    setIsLoading(true);
    try {
      const response = await fetch(category.jsonFile);
      const data = await response.json();
      setTopicsData(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopicsData([]);
    }
    setIsLoading(false);
  };

  const handleExplore = (category) => {
    setActiveCategory(category);
    fetchTopics(category);
    setShowExploreTopics(true);
  };

  const handleCompleteKit = (category) => {
    setActiveCategory(category);
    setShowCompleteKit(true);
  };

  const closeModal = () => {
    setShowExploreTopics(false);
    setShowCompleteKit(false);
    setTimeout(() => {
      setActiveCategory(null);
      setTopicsData([]);
    }, 300);
  };

  // Components for Modals
  const renderExploreTopicsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-800" style={{ borderBottomColor: `${activeCategory.color}40` }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${activeCategory.color}20`, color: activeCategory.color }}>
              <activeCategory.icon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{activeCategory.title} Topics</h2>
              <p className="text-slate-400 text-sm">Select a topic to start learning</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topicsData.map((topic, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={topic.id} 
                  className="bg-slate-800/50 border border-slate-700 hover:border-slate-500 rounded-xl p-5 transition-all hover:shadow-lg group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{topic.title}</h3>
                    <div className="flex gap-2">
                      <button onClick={(e) => toggleComplete(topic, e)} className="focus:outline-none" title="Mark as Complete">
                        <CheckCircle size={18} className={completedTopics[topic.id] ? "text-green-500 fill-green-500/20" : "text-slate-500 hover:text-green-400 transition-colors"} />
                      </button>
                      <button onClick={(e) => toggleBookmark(topic, e)} className="focus:outline-none" title="Bookmark">
                        <Bookmark size={18} className={bookmarks.find(b => b.id === topic.id) ? "text-primary fill-primary" : "text-slate-500 hover:text-white transition-colors"} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 min-h-[40px]">{topic.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-3 text-xs font-medium">
                      <span className={`px-2 py-1 rounded-md flex items-center gap-1
                        ${topic.importance === 'High' ? 'bg-red-500/10 text-red-400' : 
                          topic.importance === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 
                          'bg-green-500/10 text-green-400'}`}>
                        <Target size={12} /> {topic.importance}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md flex items-center gap-1">
                        <Clock size={12} /> {topic.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const handleDownloadKit = async () => {
    if (!activeCategory || !activeCategory.zipFile) return;
    
    const categoryId = activeCategory.id;
    const categoryTitle = activeCategory.title;
    
    setToastMessage(`Downloading ${categoryTitle} Kit...`);

    try {
      // Determine the absolute file URL
      let fileUrl = activeCategory.zipFile;
      if (!fileUrl.startsWith('http')) {
        let cleanPath = activeCategory.zipFile;
        if (cleanPath.startsWith('./')) {
          cleanPath = cleanPath.slice(1); // slice off '.' to keep '/materials/...'
        }
        if (!cleanPath.startsWith('/')) {
          cleanPath = '/' + cleanPath;
        }
        fileUrl = window.location.origin + cleanPath;
      }

      // Check if running in Capacitor Native environment
      if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        
        // Fetch the file to get its content as blob
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Convert blob to base64 with a promise to avoid race condition
        const base64data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = (e) => reject(e);
        });
        
        try {
          await Filesystem.writeFile({
            path: `Download/${categoryId}-kit.zip`,
            data: base64data,
            directory: Directory.ExternalStorage, // usually /storage/emulated/0
          });
          setToastMessage(`${categoryTitle} Kit saved to Downloads!`);
        } catch (writeErr) {
          console.error('Filesystem write error to ExternalStorage, trying Documents:', writeErr);
          // Fallback to Documents
          await Filesystem.writeFile({
            path: `${categoryId}-kit.zip`,
            data: base64data,
            directory: Directory.Documents,
          });
          setToastMessage(`${categoryTitle} Kit saved to Documents!`);
        }
      } else {
        // Standard Web Download
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', `${categoryId}-kit.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setToastMessage(`${categoryTitle} Kit download started!`);
      }
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      console.error("Download failed:", error);
      setToastMessage("Failed to download kit. Please try again.");
    }
    
    closeModal();
  };

  const renderCompleteKitModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-2xl p-6 text-center"
      >
        <div className="mx-auto mb-4 p-4 rounded-full" style={{ backgroundColor: `${activeCategory.color}20`, color: activeCategory.color }}>
          <activeCategory.icon size={48} />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Download Complete Kit</h2>
        <p className="text-slate-400 mb-6">
          Are you sure you want to download the complete {activeCategory.title} study material kit?
        </p>
        
        <div className="flex gap-3 mt-2">
          <button 
            onClick={closeModal}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700"
          >
            Cancel
          </button>
          <button 
            onClick={handleDownloadKit}
            className="flex-1 py-2.5 px-4 rounded-xl text-white font-semibold transition-all shadow-lg border border-transparent hover:brightness-110"
            style={{ backgroundColor: activeCategory.color, boxShadow: `0 4px 14px 0 ${activeCategory.color}40` }}
          >
            Download
          </button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="page-container min-h-screen pb-12" style={{ backgroundColor: 'var(--background-color)' }}>


      {/* Main Categories Grid */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Preparation Modules</h2>
          <p className="text-slate-400">Select a category to view the roadmap and topics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={category.id}
            className="group relative bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-slate-500 transition-all duration-300 flex flex-col h-full overflow-hidden"
          >
            {/* Soft Glow Background on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" 
                 style={{ background: `radial-gradient(circle at top right, ${category.color}, transparent 70%)` }}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 rounded-2xl shadow-inner" style={{ backgroundColor: `${category.color}15`, color: category.color }}>
                  <category.icon size={32} />
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-300 flex items-center gap-1 justify-end">
                    <Clock size={14} /> Est. {category.time}
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 transition-colors duration-300"
                  style={{ color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = category.color}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}>
                {category.title}
              </h3>
              <p className="text-slate-400 mb-6 flex-1">{category.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-300">Completion</span>
                  <span style={{ color: category.color }}>{category.progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full rounded-full transition-all duration-1000 ease-out" 
                       style={{ width: `${category.progress}%`, backgroundColor: category.color }}></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                <button 
                  onClick={() => handleExplore(category)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors text-sm border border-slate-600"
                >
                  Explore Topics
                </button>
                <button 
                  onClick={() => handleCompleteKit(category)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-white font-semibold transition-all shadow-lg text-sm border border-transparent hover:brightness-110"
                  style={{ backgroundColor: category.color, boxShadow: `0 4px 14px 0 ${category.color}40` }}
                >
                  Complete Kit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showExploreTopics && activeCategory && renderExploreTopicsModal()}
        {showCompleteKit && activeCategory && renderCompleteKitModal()}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3"
          >
            <CheckCircle className="text-green-500" size={20} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PreparationModule;
