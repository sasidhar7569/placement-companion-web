import React, { useState, useEffect } from 'react';
import { Bookmark, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, syncFetch } from '../assets/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

const Bookmarks = () => {
  const navigate = useNavigate();
  const [savedBookmarks, setSavedBookmarks] = useState([]);
  const [activeCategoryTab, setActiveCategoryTab] = useState('Aptitude');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    connectSocket();

    const fetchSyncData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        const loadedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setSavedBookmarks(loadedBookmarks);
        return;
      }
      try {
        const res = await syncFetch(`${API_BASE_URL}/api/sync/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success && result.data.bookmarks) {
          setSavedBookmarks(result.data.bookmarks);
          localStorage.setItem('bookmarks', JSON.stringify(result.data.bookmarks));
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        const loadedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setSavedBookmarks(loadedBookmarks);
      }
    };
    fetchSyncData();

    const unsubscribe = subscribeToEvent('dataUpdated', (backendData) => {
      console.log('Real-time bookmarks data update:', backendData);
      if (backendData && backendData.bookmarks) {
        setSavedBookmarks(backendData.bookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(backendData.bookmarks));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const removeBookmark = async (id, e) => {
    e.stopPropagation();
    const newBookmarks = savedBookmarks.filter(b => b.id !== id);
    setSavedBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    
    setToastMessage('Removed from bookmarks');
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
        console.error('Error syncing bookmark removal:', err);
      }
    }
  };

  const handleCardClick = (bookmark) => {
    if (bookmark.category === 'Coding Prep') {
      navigate('/coding');
    } else {
      navigate(`/topic/${bookmark.id}`);
    }
  };

  // 1. Filter by category tab
  const categoryFiltered = savedBookmarks.filter(bookmark => {
    if (activeCategoryTab === 'Aptitude') {
      // Aptitude tab includes Aptitude, Logical Reasoning, Verbal Ability, Core Subjects (anything except Coding Prep)
      return bookmark.category !== 'Coding Prep';
    } else {
      // Topics tab includes only Coding Prep
      return bookmark.category === 'Coding Prep';
    }
  });

  // 2. Filter by search query (match title or category)
  const finalFiltered = categoryFiltered.filter(bookmark => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (bookmark.title && bookmark.title.toLowerCase().includes(query)) ||
      (bookmark.category && bookmark.category.toLowerCase().includes(query))
    );
  });

  return (
    <div className="page-container min-h-screen pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Bookmark className="text-primary" size={32} />
          My Bookmarks
        </h1>
        <p className="text-slate-400 text-lg">Quick access to your saved topics and resources.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        <div className="flex gap-2">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeCategoryTab === 'Aptitude' 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            onClick={() => setActiveCategoryTab('Aptitude')}
          >
            Aptitude
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeCategoryTab === 'Topics' 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
            onClick={() => setActiveCategoryTab('Topics')}
          >
            Topics
          </button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search bookmarks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 h-full py-2 bg-slate-800/50 w-full" 
            />
          </div>
        </div>
      </div>

      {savedBookmarks.length > 0 ? (
        <>
          {finalFiltered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {finalFiltered.map((bookmark, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={bookmark.id} 
                  onClick={() => handleCardClick(bookmark)}
                  className="bg-slate-800/50 border border-slate-700 hover:border-slate-500 rounded-xl p-5 transition-all hover:shadow-lg group cursor-pointer flex flex-col"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-700 rounded text-slate-300">{bookmark.category}</span>
                    <button onClick={(e) => removeBookmark(bookmark.id, e)} className="focus:outline-none">
                      <Bookmark size={18} className="text-primary fill-primary hover:text-slate-500 hover:fill-transparent transition-colors" />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-4 group-hover:text-primary transition-colors">{bookmark.title}</h3>
                  
                  <div className="mt-auto flex justify-between items-center text-xs text-slate-400">
                    <span>{bookmark.time || '15 mins'} read</span>
                    <span>Saved on {bookmark.date || new Date().toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="col-span-full py-16 text-center flex flex-col items-center border border-dashed border-slate-700 rounded-2xl bg-slate-800/10">
              <Search size={48} className="text-slate-550 mb-4" />
              <h3 className="text-xl font-bold text-white">No Results Found</h3>
            </div>
          )}
        </>
      ) : (
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-12 text-center flex flex-col items-center">
          <div className="bg-slate-800 p-4 rounded-full mb-4">
            <Bookmark size={32} className="text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Bookmarks Yet</h3>
          <p className="text-slate-400 max-w-md">
            You haven't saved any topics or resources yet. Explore the preparation module and click the bookmark icon to save items here.
          </p>
          <button onClick={() => navigate('/preparation')} className="btn-primary mt-6">Explore Topics</button>
        </div>
      )}

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

export default Bookmarks;
