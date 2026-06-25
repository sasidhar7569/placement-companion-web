import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { ChevronLeft, Search, User, Menu, X, Home, BookOpen, Code, Briefcase, Target, Bookmark } from 'lucide-react';
import Sidebar from './Sidebar';
import BackButton from './BackButton';
import BottomNav from './BottomNav';
import { API_BASE_URL } from '../assets/api';

const WebLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState('');
  const [initials, setInitials] = useState('JD');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileNavItems = [
    { path: '/home', icon: Home, label: 'Dashboard' },
    { path: '/preparation', icon: BookOpen, label: 'Preparation' },
    { path: '/coding', icon: Code, label: 'Topics Preparation' },
    { path: '/companies', icon: Briefcase, label: 'Company Prep' },
    { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { path: '/career-tools', icon: Briefcase, label: 'Career Tools' },
    { path: '/evergreen-jobs', icon: Target, label: 'Evergreen Jobs' }
  ];

  useEffect(() => {
    const loadProfileData = () => {
      const savedPic = localStorage.getItem('profilePic');
      if (savedPic) setProfilePic(savedPic);

      const fName = localStorage.getItem('firstName');
      const lName = localStorage.getItem('lastName');
      const uName = localStorage.getItem('userName');
      
      let init = '';
      if (fName) {
        init = fName[0];
      } else if (uName) {
        const parts = uName.trim().split(' ');
        if (parts.length > 0 && parts[0]) init = parts[0][0];
      }
      
      setInitials(init ? init.toUpperCase() : 'U');

      // Sync latest from backend
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        if (u && u._id) {
          fetch(`${API_BASE_URL}/users/${u._id}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.data) {
                localStorage.setItem('user', JSON.stringify(data.data));
                localStorage.setItem('userName', data.data.name);
                localStorage.setItem('email', data.data.email);
                if (data.data.phone) localStorage.setItem('phone', data.data.phone);
                if (data.data.profilePic) {
                  localStorage.setItem('profilePic', data.data.profilePic);
                  setProfilePic(data.data.profilePic);
                }
                
                const parts = data.data.name.trim().split(' ');
                if (parts.length > 0) {
                  localStorage.setItem('firstName', parts[0]);
                  setInitials(parts[0][0].toUpperCase());
                  if (parts.length > 1) {
                    localStorage.setItem('lastName', parts.slice(1).join(' '));
                  }
                }
              }
            })
            .catch(e => console.error("Error syncing profile:", e));
        }
      } catch(e) {}
    };

    // Initial load
    loadProfileData();

    // Listen for updates from other components
    window.addEventListener('profilePicUpdated', loadProfileData);
    return () => window.removeEventListener('profilePicUpdated', loadProfileData);
  }, []);
  
  // Hide TopBar and BottomNav for intensive screens like Active Test or Code Editor
  const isFullScreenMode = location.pathname.includes('/coding/editor');

  if (isFullScreenMode) {
    return <Outlet />;
  }

  // Get Page Title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/home')) return 'Dashboard';
    if (path.includes('/preparation')) return 'Preparation';
    if (path.includes('/coding')) return 'Topics Preparation';
    if (path.includes('/companies')) return 'Company Prep';
    if (path.includes('/career-tools')) return 'Career Tools';
    if (path.includes('/evergreen-jobs')) return 'Evergreen Jobs';
    if (path.includes('/profile')) return 'Profile';
    return 'PlacementPro';
  };

  return (
    <div className="app-container">
      <Sidebar />
      
      <div className="main-content">
        <header className="top-bar flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden icon-btn" onClick={() => setIsMobileMenuOpen(true)} style={{ padding: '8px' }}>
              <Menu size={24} />
            </button>
            <BackButton className="icon-btn" style={{ padding: '8px' }} />
            <h2 className="text-xl hidden sm:block">{getPageTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={18} className="text-secondary absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-700 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ width: '250px' }}
              />
            </div>
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
              style={{ background: profilePic ? 'transparent' : 'var(--gradient-primary)' }}
              onClick={() => navigate('/profile')}
            >
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{initials}</span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-800/80 hide-scrollbar" style={{ background: 'var(--background-color)' }}>
          <Outlet />
        </main>
        
        <BottomNav />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-sm bg-slate-900 h-full flex flex-col border-r border-slate-800 shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-textMain">Menu</h2>
              <button className="p-2 text-secondary hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-2 flex flex-col gap-1 hide-scrollbar">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-textMuted hover:bg-white/5 hover:text-textMain'
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebLayout;
