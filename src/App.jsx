import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import WebLayout from './components/WebLayout';
import { API_BASE_URL } from './assets/api';
import AppBackHandler from './components/AppBackHandler';

// Screens
import HomeDashboard from './screens/HomeDashboard';
import PreparationModule from './screens/PreparationModule';
import CodingDashboard from './screens/CodingDashboard';
import CodeEditor from './screens/CodeEditor';
import CompanyBrowser from './screens/CompanyBrowser';
import CareerTools from './screens/CareerTools';
import EvergreenJobs from './screens/EvergreenJobs';
import UserProfile from './screens/UserProfile';
import Login from './screens/Login';

// New Screens
import TopicDetail from './screens/TopicDetail';
import CompanyDetail from './screens/CompanyDetail';
import PerformanceReport from './screens/PerformanceReport';
import AdminDashboard from './screens/AdminDashboard';
import ResumeBuilderChat from './screens/ResumeBuilderChat';
import ATSChecker from './screens/ATSChecker';
import Bookmarks from './screens/Bookmarks';

const App = () => {
  useEffect(() => {
    const isLightMode = localStorage.getItem('theme') === 'light';
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    // Backend test connection
    fetch(`${API_BASE_URL}/`)
      .then(res => res.text())
      .then(data => console.log("Backend Response:", data))
      .catch(err => console.log("Backend Error:", err));

  }, []);

  return (
    <HashRouter>
      <AppBackHandler />
      <Routes>
        {/* Onboarding & Login Flow */}
        <Route path="/login" element={<Login />} />

        {/* Full Screen / Special Layouts */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* Main Web App */}
        <Route element={<WebLayout />}>
          <Route path="/home" element={<HomeDashboard />} />
          <Route path="/performance" element={<PerformanceReport />} />
          <Route path="/preparation" element={<PreparationModule />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/coding" element={<CodingDashboard />} />
          <Route path="/coding/editor/:id" element={<CodeEditor />} />
          <Route path="/companies" element={<CompanyBrowser />} />
          <Route path="/company/:id" element={<CompanyDetail />} />
          <Route path="/career-tools" element={<CareerTools />} />
          <Route path="/career-tools/resume-builder" element={<ResumeBuilderChat />} />
          <Route path="/career-tools/ats-checker" element={<ATSChecker />} />
          <Route path="/evergreen-jobs" element={<EvergreenJobs />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;