import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Shield, Building, LogOut, Edit3, Bell, X } from 'lucide-react';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profilePic, setProfilePic] = useState('');
  const fileInputRef = useRef(null);

  // Form State
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('+91 9876543210');

  const [tempFirstName, setTempFirstName] = useState(firstName);
  const [tempLastName, setTempLastName] = useState(lastName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPhone, setTempPhone] = useState(phone);
  
  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedPic = localStorage.getItem('profilePic');
    if (savedPic) setProfilePic(savedPic);

    const savedFirstName = localStorage.getItem('firstName');
    const savedLastName = localStorage.getItem('lastName');
    const savedEmail = localStorage.getItem('email');
    const savedPhone = localStorage.getItem('phone');

    if (savedFirstName) {
      setFirstName(savedFirstName);
      setTempFirstName(savedFirstName);
    }
    if (savedLastName) {
      setLastName(savedLastName);
      setTempLastName(savedLastName);
    }
    if (savedEmail) {
      setEmail(savedEmail);
      setTempEmail(savedEmail);
    }
    if (savedPhone) {
      setPhone(savedPhone);
      setTempPhone(savedPhone);
    }
    
    setIsLightMode(localStorage.getItem('theme') === 'light');
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String);
        localStorage.setItem('profilePic', base64String);
        window.dispatchEvent(new Event('profilePicUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePersonalSave = () => {
    if (tempEmail !== email || tempPhone !== phone) {
      setShowOtpModal(true);
    } else {
      // Just save other details like Name
      setFirstName(tempFirstName);
      setLastName(tempLastName);
      localStorage.setItem('firstName', tempFirstName);
      localStorage.setItem('lastName', tempLastName);
      window.dispatchEvent(new Event('profilePicUpdated'));
      alert('Profile updated successfully!');
    }
  };

  const handleOtpVerify = () => {
    // Mock OTP verification - any 4 digit code works
    if (otp.join('').length === 4) {
      setFirstName(tempFirstName);
      setLastName(tempLastName);
      setEmail(tempEmail);
      setPhone(tempPhone);
      
      localStorage.setItem('firstName', tempFirstName);
      localStorage.setItem('lastName', tempLastName);
      localStorage.setItem('email', tempEmail);
      localStorage.setItem('phone', tempPhone);
      window.dispatchEvent(new Event('profilePicUpdated'));

      setShowOtpModal(false);
      setOtp(['', '', '', '']);
      alert('Profile details updated successfully!');
    } else {
      alert('Please enter a 4-digit OTP.');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="page-container relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Profile & Settings</h1>
        <p className="text-secondary text-lg">Manage your account and update preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar for Profile Navigation */}
        <div className="lg:col-span-1">
          <div className="card p-6 flex flex-col items-center text-center mb-6">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-primary/20" />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-sm" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                  JD
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="text-white" size={24} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </div>
            <h2 className="text-xl font-bold mb-1">{firstName} {lastName}</h2>
            <p className="text-sm text-secondary mb-3">{email}</p>
            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-bold">
              B.Tech CS • 2025
            </span>
          </div>

          <div className="card p-2 flex flex-col gap-1">
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'personal' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('personal')}
            >
              <User size={18} /> Personal Details
            </button>
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'academic' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('academic')}
            >
              <Shield size={18} /> Academic Info
            </button>
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'companies' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('companies')}
            >
              <Building size={18} /> Target Companies
            </button>
            <hr className="my-2 border-slate-700" />
            <button 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-textMuted hover:bg-slate-800/80'}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> App Settings
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <div className="card h-full">
            
            {activeTab === 'personal' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempFirstName} 
                      onChange={(e) => setTempFirstName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={tempLastName} 
                      onChange={(e) => setTempLastName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address (OTP Required for change)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={tempEmail} 
                      onChange={(e) => setTempEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number (OTP Required for change)</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={tempPhone} 
                      onChange={(e) => setTempPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="form-label">Bio</label>
                    <textarea className="form-input h-24 resize-none" defaultValue="Passionate software engineering student looking for exciting opportunities." />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary" onClick={handlePersonalSave}>Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group md:col-span-2">
                    <label className="form-label">University / College</label>
                    <input type="text" className="form-input" defaultValue="National Institute of Technology" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <select className="form-input bg-slate-800/50 appearance-auto">
                      <option>B.Tech</option>
                      <option>M.Tech</option>
                      <option>MCA</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input type="text" className="form-input" defaultValue="Computer Science" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Graduation Year</label>
                    <input type="number" className="form-input" defaultValue="2025" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Current CGPA</label>
                    <input type="number" step="0.01" className="form-input" defaultValue="8.75" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}

            {activeTab === 'companies' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">Target Companies</h3>
                <p className="text-secondary mb-6">Manage the list of companies you are focusing on for placements. This will tailor your mock tests and study materials.</p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Google', 'Microsoft', 'Amazon'].map(comp => (
                    <div key={comp} className="px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary flex items-center gap-2">
                      <Building size={16} /> {comp}
                    </div>
                  ))}
                  {['TCS', 'Infosys'].map(comp => (
                    <div key={comp} className="px-4 py-2 rounded-full bg-slate-800 text-textMuted border border-slate-700 flex items-center gap-2">
                      <Building size={16} /> {comp}
                    </div>
                  ))}
                  <button className="px-4 py-2 rounded-full border border-dashed border-slate-600 text-secondary hover:text-textMain hover:border-slate-400 transition-colors">
                    + Add Company
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold mb-6 border-b border-slate-700 pb-4">App Settings</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-4 border border-slate-700 rounded-xl">
                    <div>
                      <h4 className="font-bold mb-1 flex items-center gap-2"><Bell size={18} /> Email Notifications</h4>
                      <p className="text-sm text-secondary">Receive daily task reminders and test alerts.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 border border-slate-700 rounded-xl">
                    <div>
                      <h4 className="font-bold mb-1">Light Mode</h4>
                      <p className="text-sm text-secondary">Switch between light and dark themes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={isLightMode}
                        onChange={toggleTheme}
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full animate-fade-in relative">
            <button 
              className="absolute top-4 right-4 text-secondary hover:text-textMain"
              onClick={() => setShowOtpModal(false)}
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-2">Verify Changes</h3>
            <p className="text-secondary text-sm mb-6">Enter the 4-digit OTP sent to your new email/phone number to confirm these changes.</p>
            
            <div className="flex justify-center gap-3 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-14 h-14 text-center text-2xl font-bold bg-slate-800/80 border border-slate-600 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-textMain"
                  value={otp[index]}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/[0-9]/.test(val) || val === '') {
                      const newOtp = [...otp];
                      newOtp[index] = val;
                      setOtp(newOtp);
                      // Auto-focus next input (basic implementation)
                      if (val !== '' && e.target.nextSibling) {
                        e.target.nextSibling.focus();
                      }
                    }
                  }}
                />
              ))}
            </div>
            
            <button className="btn-primary w-full" onClick={handleOtpVerify}>
              Verify & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
