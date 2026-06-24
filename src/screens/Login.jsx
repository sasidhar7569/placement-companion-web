import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, LogIn, Settings } from 'lucide-react';
import { API_BASE_URL } from '../assets/api';

// Temporary flag for testing APK without login
const SKIP_LOGIN = false;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (SKIP_LOGIN) {
      localStorage.setItem('token', 'test_token');
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: 'test@example.com' }));
      localStorage.setItem('userName', 'Test User');
      localStorage.setItem('role', 'student');
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showServerSettings, setShowServerSettings] = useState(false);
  const [serverUrlInput, setServerUrlInput] = useState(API_BASE_URL);

  const handleSaveServerUrl = () => {
    let url = serverUrlInput.trim();
    if (!url) {
      alert('Please enter a valid URL');
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    localStorage.setItem('custom_backend_url', url);
    alert(`Backend URL updated to: ${url}\nReloading app...`);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMode === 'forgot') {
      alert('Password reset link sent to your email.');
      setAuthMode('login');
      return;
    }

    setIsLoading(true);
    try {
      const url =
        authMode === 'login'
          ? `${API_BASE_URL}/login`
          : `${API_BASE_URL}/register`;

      const body =
        authMode === 'login'
          ? {
            email,
            password
          }
          : {
            name: fullName,
            email,
            password,
            role,
            college: role === 'student' ? 'ABC College' : '',
            department: role === 'student' ? 'CSE' : '',
            year: role === 'student' ? 4 : undefined,
            cgpa: role === 'student' ? 8.5 : undefined,
            skills: role === 'student' ? ['Java', 'React'] : []
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || 'Something went wrong');
        return;
      }

      if (authMode === 'login') {
        // Store core auth data first
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        localStorage.setItem('userName', data.data.name);
        localStorage.setItem('email', data.data.email);
        localStorage.setItem('role', data.role);

        // Restore all persisted user data from backend (profile + targetCompanies)
        try {
          const syncRes = await fetch(`${API_BASE_URL}/api/sync/all`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          const syncData = await syncRes.json();
          if (syncData.success && syncData.data) {
            const profile = syncData.data.profile || {};
            const nameParts = (profile.name || data.data.name || '').trim().split(' ');
            localStorage.setItem('firstName', nameParts[0] || '');
            localStorage.setItem('lastName', nameParts.slice(1).join(' ') || '');
            if (profile.phone) localStorage.setItem('phone', profile.phone);
            if (profile.profilePic) localStorage.setItem('profilePic', profile.profilePic);
            if (profile.college) localStorage.setItem('college', profile.college);
            if (profile.department) localStorage.setItem('department', profile.department);
            if (profile.year) localStorage.setItem('year', String(profile.year));
            if (profile.cgpa) localStorage.setItem('cgpa', String(profile.cgpa));

            if (syncData.data.targetCompanies && syncData.data.targetCompanies.length > 0) {
              localStorage.setItem('targetCompanies', JSON.stringify(syncData.data.targetCompanies));
              window.dispatchEvent(new Event('targetCompaniesUpdated'));
            }
          }
        } catch (syncErr) {
          // Sync failed — fall back to login response data
          console.warn('Sync after login failed, using login data:', syncErr);
          const nameParts = (data.data.name || '').trim().split(' ');
          localStorage.setItem('firstName', nameParts[0] || '');
          localStorage.setItem('lastName', nameParts.slice(1).join(' ') || '');
          if (data.data.phone) localStorage.setItem('phone', data.data.phone);
          if (data.data.profilePic) localStorage.setItem('profilePic', data.data.profilePic);
          if (data.data.college) localStorage.setItem('college', data.data.college);
          if (data.data.department) localStorage.setItem('department', data.data.department);
          if (data.data.year) localStorage.setItem('year', String(data.data.year));
          if (data.data.cgpa) localStorage.setItem('cgpa', String(data.data.cgpa));
          if (data.data.targetCompanies && data.data.targetCompanies.length > 0) {
            localStorage.setItem('targetCompanies', JSON.stringify(data.data.targetCompanies));
            window.dispatchEvent(new Event('targetCompaniesUpdated'));
          }
        }

        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      } else {
        alert('Registration successful. Please login now.');
        setAuthMode('login');
        setPassword('');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ background: 'var(--background-color)' }}>
      <div className="card w-full max-w-md p-8 shadow-xl bg-slate-800/80 border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">PlacementPro</h1>
          <p className="text-secondary text-sm">
            {authMode === 'login'
              ? 'Welcome back! Please login to continue.'
              : authMode === 'register'
                ? 'Create an account to start your journey.'
                : 'Reset your password.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {authMode === 'register' && (
            <div className="form-group mb-0 relative">
              <label className="form-label text-sm text-secondary mb-1 block">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group mb-0 relative">
            <label className="form-label text-sm text-secondary mb-1 block">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div className="form-group mb-0 relative">
              <label className="form-label text-sm text-secondary mb-1 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="form-input pl-10 w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {authMode !== 'forgot' && (
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  className="accent-primary"
                />
                <span className="text-sm">Student</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="accent-primary"
                />
                <span className="text-sm">Admin</span>
              </label>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 mt-4 flex justify-center items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Please wait...
              </>
            ) : authMode === 'login' ? (
              <>
                <LogIn size={20} /> Login
              </>
            ) : authMode === 'register' ? (
              <>
                <UserPlus size={20} /> Sign Up
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {authMode === 'login' ? (
            <>
              <p className="text-secondary mb-2">
                Don&apos;t have an account?{' '}
                <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('register')}>
                  Register
                </span>
              </p>
              <p>
                <span className="text-secondary cursor-pointer hover:underline hover:text-white" onClick={() => setAuthMode('forgot')}>
                  Forgot Password?
                </span>
              </p>
            </>
          ) : authMode === 'register' ? (
            <p className="text-secondary">
              Already have an account?{' '}
              <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('login')}>
                Login
              </span>
            </p>
          ) : (
            <p className="text-secondary">
              Remember your password?{' '}
              <span className="text-primary cursor-pointer hover:underline text-blue-400" onClick={() => setAuthMode('login')}>
                Login
              </span>
            </p>
          )}
        </div>

        {/* Connection Settings */}
        <div className="mt-8 pt-6 border-t border-slate-700/50 text-center">
          <button
            type="button"
            onClick={() => setShowServerSettings(!showServerSettings)}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5 focus:outline-none"
          >
            <Settings size={14} className="animate-[spin_10s_linear_infinite]" />
            Connection Settings
          </button>
          
          {showServerSettings && (
            <div className="mt-4 p-4 rounded-lg bg-slate-900/60 border border-slate-700 text-left">
              <label className="text-xs font-semibold text-slate-300 block mb-1">Backend Server URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serverUrlInput}
                  onChange={(e) => setServerUrlInput(e.target.value)}
                  className="form-input flex-1 text-xs bg-slate-950/80 border border-slate-600 rounded px-2 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  placeholder="https://placement-companion-backend.onrender.com"
                />
                <button
                  type="button"
                  onClick={handleSaveServerUrl}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">
                Current API Base: <code className="text-blue-400 font-mono">{API_BASE_URL}</code>
              </p>
              <div className="mt-2 flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem('custom_backend_url');
                    alert('Reset to default. Reloading...');
                    window.location.reload();
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-red-950 text-slate-300 rounded text-[10px] transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;