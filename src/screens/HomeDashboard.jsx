import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, BookOpen, PenTool, TrendingUp, PlayCircle, Plus, X, Building } from 'lucide-react';
import { companiesData } from './CodingDashboard';
import { API_BASE_URL, syncFetch } from '../assets/api';
import { connectSocket, subscribeToEvent } from '../services/socket';

const HomeDashboard = () => {
  const navigate = useNavigate();

  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  const [userName, setUserName] = useState('John');
  const [readinessScore, setReadinessScore] = useState(isNewUser ? 0 : 68);
  const [aptitudeScore, setAptitudeScore] = useState(85);
  const [codingScore, setCodingScore] = useState(60);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEventDay, setNewEventDay] = useState('Mon');
  const [newEventTitle, setNewEventTitle] = useState('');

  const [targetCompanies, setTargetCompanies] = useState([]);
  const [scheduleEvents, setScheduleEvents] = useState({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  const dDate = new Date();
  const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = daysArr[dDate.getDay()];

  const getInitialTasks = () => {
    return isNewUser 
      ? [
          { id: 1, title: 'Set up your Profile', type: 'Learning', duration: '5 mins', completed: false, link: '/profile' },
          { id: 2, title: 'Watch Intro to Placement Prep', type: 'Learning', duration: '15 mins', completed: false, link: '/topic/1' },
        ]
      : [
          { id: 1, title: `Complete ${todayName} Practice Module`, type: 'Learning', duration: '45 mins', completed: false, link: '/topic/1' },
          { id: 2, title: 'Solve 2 Medium Leetcode questions', type: 'Coding', duration: '60 mins', completed: false, link: '/coding' }
        ];
  };

  const [dailyTasks, setDailyTasks] = useState(getInitialTasks);

  const generateDynamicSchedule = (events = null) => {
    const storedEvents = events || scheduleEvents || {};
    const dynamicSchedule = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dName = daysArr[d.getDay()];
      dynamicSchedule.push({
        dayName: dName,
        dateNum: d.getDate(),
        active: !!storedEvents[dName],
        current: i === 0,
        day: dName
      });
    }
    return dynamicSchedule;
  };

  const [schedule, setSchedule] = useState(generateDynamicSchedule());

  // 1. Fetch latest data on load to avoid stale data
  useEffect(() => {
    const fetchAllData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/sync/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await res.json();
        if (result.success) {
          const { dailyTasks: backendTasks, scheduleEvents: backendEvents, profile, bookmarks, prepCompleted, codingProgress, targetCompanies: backendTargets } = result.data;
          
          if (profile && profile.name) {
            localStorage.setItem('userName', profile.name);
            setUserName(profile.name);
          }
          if (profile && profile.phone) {
            localStorage.setItem('phone', profile.phone);
          }
          if (profile && profile.profilePic) {
            localStorage.setItem('profilePic', profile.profilePic);
          }

          if (backendTasks && backendTasks[todayName]) {
            setDailyTasks(backendTasks[todayName]);
          } else {
            // Fallback to default tasks
            const defaultTasks = isNewUser 
              ? [
                  { id: 1, title: 'Set up your Profile', type: 'Learning', duration: '5 mins', completed: false, link: '/profile' },
                  { id: 2, title: 'Watch Intro to Placement Prep', type: 'Learning', duration: '15 mins', completed: false, link: '/topic/1' },
                ]
              : [
                  { id: 1, title: `Complete ${todayName} Practice Module`, type: 'Learning', duration: '45 mins', completed: false, link: '/topic/1' },
                  { id: 2, title: 'Solve 2 Medium Leetcode questions', type: 'Coding', duration: '60 mins', completed: false, link: '/coding' }
                ];
            setDailyTasks(defaultTasks);
          }

          if (backendEvents) {
            setScheduleEvents(backendEvents);
            setSchedule(generateDynamicSchedule(backendEvents));
          }

          if (bookmarks) {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
          }

          if (prepCompleted) {
            localStorage.setItem('prepCompleted', JSON.stringify(prepCompleted));
          }

          if (backendTargets) {
            localStorage.setItem('targetCompanies', JSON.stringify(backendTargets));
            setTargetCompanies(backendTargets);
          }

          if (codingProgress) {
            localStorage.setItem('codingProgress', JSON.stringify(codingProgress));
          }

          setUpdateTrigger(p => p + 1);
        }
      } catch (err) {
        console.error('Error fetching sync data:', err);
      }
    };

    fetchAllData();
  }, [todayName, isNewUser]);

  // 2. Initialize Socket.IO connection and register real-time updates
  useEffect(() => {
    connectSocket();

    const unsubscribeTask = subscribeToEvent('taskUpdated', (backendTasksObj) => {
      console.log('Real-time task update:', backendTasksObj);
      if (backendTasksObj && backendTasksObj[todayName]) {
        setDailyTasks(backendTasksObj[todayName]);
      }
    });

    const unsubscribePlanner = subscribeToEvent('plannerUpdated', (backendPlanner) => {
      console.log('Real-time planner update:', backendPlanner);
      if (backendPlanner) {
        setScheduleEvents(backendPlanner);
        setSchedule(generateDynamicSchedule(backendPlanner));
      }
    });

    const unsubscribeProfile = subscribeToEvent('profileUpdated', (backendProfile) => {
      console.log('Real-time profile update:', backendProfile);
      if (backendProfile && backendProfile.name) {
        localStorage.setItem('userName', backendProfile.name);
        setUserName(backendProfile.name);
        setUpdateTrigger(p => p + 1);
      }
    });

    const unsubscribeProgress = subscribeToEvent('progressUpdated', (backendProgress) => {
      console.log('Real-time progress update:', backendProgress);
      if (backendProgress) {
        const storedName = localStorage.getItem('userName') || 'John';
        if (backendProgress.prepCompleted) {
          localStorage.setItem('prepCompleted', JSON.stringify(backendProgress.prepCompleted));
        }
        if (backendProgress.targetCompanies) {
          localStorage.setItem('targetCompanies', JSON.stringify(backendProgress.targetCompanies));
          setTargetCompanies(backendProgress.targetCompanies);
        }
        if (backendProgress.codingProgress) {
          localStorage.setItem('codingProgress', JSON.stringify(backendProgress.codingProgress));
        }
        setUpdateTrigger(p => p + 1);
      }
    });

    return () => {
      unsubscribeTask();
      unsubscribePlanner();
      unsubscribeProfile();
      unsubscribeProgress();
    };
  }, [todayName]);

  useEffect(() => {
    const todayEventTitle = scheduleEvents[todayName];
    if (todayEventTitle) {
      setDailyTasks(prev => {
        let tasks = [...prev];
        const hasScheduleTask = tasks.find(t => t.id === 'schedule_task');
        if (!hasScheduleTask) {
          tasks.push({ id: 'schedule_task', title: `${todayEventTitle}`, type: 'Weekly Schedule Task Assigned', duration: 'Custom', completed: false, link: '/home' });
          const token = localStorage.getItem('token');
          if (token) {
            syncFetch(`${API_BASE_URL}/api/sync/all`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }).then(r => r.json()).then(allData => {
              const fullTasksObj = (allData.success && allData.data.dailyTasks) ? allData.data.dailyTasks : {};
              fullTasksObj[todayName] = tasks;
              syncFetch(`${API_BASE_URL}/api/sync/tasks`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ dailyTasks: fullTasksObj })
              });
            });
          }
        }
        return tasks;
      });
    }
  }, [scheduleEvents, todayName]);

  // Calculate dynamic scores from actual progress data
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'John';
    setUserName(storedName);

    const targets = JSON.parse(localStorage.getItem('targetCompanies') || '[]');
    setTargetCompanies(targets);

    // 1. Calculate Aptitude Score (12 topics)
    const prepCompleted = JSON.parse(localStorage.getItem('prepCompleted') || '{}');
    const aptCompletedCount = Object.keys(prepCompleted).filter(id => id.startsWith('apt-') && prepCompleted[id]).length;
    const aptScore = Math.round((aptCompletedCount / 12) * 100) || 0;
    setAptitudeScore(aptScore);

    // 2. Calculate Coding Score across all companies
    let totalCodingTopics = 0;
    let completedCodingTopics = 0;
    const codProgress = JSON.parse(localStorage.getItem('codingProgress') || '{}');
    companiesData.forEach(company => {
      Object.values(company.topics).forEach(difficultyList => {
        totalCodingTopics += difficultyList.length;
        difficultyList.forEach(t => {
          if (codProgress[t.id]) completedCodingTopics++;
        });
      });
    });
    
    const codScore = Math.round((completedCodingTopics / totalCodingTopics) * 100) || 0;
    setCodingScore(codScore);

    // 3. Readiness Score is the average + daily tasks completion bonus
    const completedDaily = dailyTasks.filter(t => t.completed).length;
    const taskBonus = dailyTasks.length > 0 ? Math.round((completedDaily / dailyTasks.length) * 10) : 0;
    
    const overallReadiness = Math.min(100, Math.round((aptScore + codScore) / 2) + taskBonus);
    setReadinessScore(overallReadiness);
  }, [isNewUser, dailyTasks, updateTrigger]);

  const toggleTaskComplete = async (taskId) => {
    const updatedTasks = dailyTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setDailyTasks(updatedTasks);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const resAll = await fetch(`${API_BASE_URL}/api/sync/all`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const allData = await resAll.json();
        const fullTasksObj = (allData.success && allData.data.dailyTasks) ? allData.data.dailyTasks : {};
        fullTasksObj[todayName] = updatedTasks;

        await syncFetch(`${API_BASE_URL}/api/sync/tasks`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ dailyTasks: fullTasksObj })
        });
      } catch (err) {
        console.error('Error toggling task:', err);
      }
    }
  };

  const handleTakeTask = (task) => {
    navigate(task.link);
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const updatedEvents = { ...scheduleEvents, [newEventDay]: newEventTitle };
    setScheduleEvents(updatedEvents);
    setSchedule(prev => prev.map(s => s.day === newEventDay ? { ...s, active: true } : s));
    setShowEventModal(false);
    setNewEventTitle('');

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await syncFetch(`${API_BASE_URL}/api/sync/planner`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ scheduleEvents: updatedEvents })
        });
      } catch (err) {
        console.error('Error adding event:', err);
      }
    }
  };

  const completedTasksCount = dailyTasks.filter(t => t.completed).length;

  return (
    <div className="page-container relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Welcome back, {userName}! 👋</h1>
          <p className="text-secondary text-lg">Here's your SDE placement preparation plan for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Readiness Score Card */}
          <div 
            className="card bg-slate-800/50 p-6 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-primary transition-shadow" 
            style={{ borderLeftColor: 'var(--primary-color)' }}
          >
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-color)" strokeWidth="3" strokeDasharray={`${readinessScore}, 100`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-textMain">{readinessScore}%</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Placement Readiness</h2>
              <p className="text-secondary mb-4 text-sm">
                {isNewUser 
                  ? "Complete topics in the Preparation module to increase your initial readiness score."
                  : "Keep practicing to improve your scores. Focus on identifying and strengthening your weak areas."
                }
              </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Aptitude: {aptitudeScore}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">Coding: {codingScore}%</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Daily Tasks */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2"><CheckCircle className="text-primary" /> Today's Tasks</h3>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{completedTasksCount}/{dailyTasks.length} Completed</span>
            </div>
            <div className="flex flex-col gap-3">
              {dailyTasks.map(task => (
                <div key={task.id} className={`p-4 border rounded-xl flex items-center justify-between gap-4 transition-colors ${task.completed ? 'bg-slate-800/80 opacity-60' : 'hover:border-primary'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 cursor-pointer" onClick={() => toggleTaskComplete(task.id)}>
                      {task.completed ? <CheckCircle className="text-green-500" /> : <div className="w-6 h-6 border-2 border-slate-600 rounded-full"></div>}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-textMain ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-secondary font-medium">
                        <span className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                          {task.type === 'Learning' && <BookOpen size={12} />}
                          {task.type === 'Coding' && <PenTool size={12} />}
                          {task.type === 'Mock Test' && <Clock size={12} />}
                          {task.type === 'Weekly Schedule Task Assigned' && <Calendar size={12} />}
                          {task.type}
                        </span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {task.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {task.completed ? (
                      <span className="text-green-500 font-bold text-sm px-3 py-1 bg-green-500/10 rounded-full">Completed</span>
                    ) : (
                      <button className="btn-primary py-1.5 px-4 text-sm" onClick={() => toggleTaskComplete(task.id)}>Mark Complete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Companies */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Building size={20} className="text-primary" /> Target Companies</h3>
            <div className="flex flex-wrap gap-3">
              {targetCompanies.length > 0 ? targetCompanies.map(c => (
                <div key={c} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                   <Building size={16} className="text-secondary" /> {c}
                </div>
              )) : <span className="text-sm text-secondary">No target companies selected yet. Update in your Profile.</span>}
            </div>
          </div>

        </div>

        {/* Right Column - Side widgets */}
        <div className="flex flex-col gap-8">
          
          {/* Weekly Schedule */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2"><Calendar className="text-primary" /> Weekly Schedule</h3>
            </div>
            <div className="flex justify-between items-center mb-6">
              {schedule.map((dayObj, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-secondary">{dayObj.dayName}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    dayObj.current ? 'bg-primary text-white' : 
                    dayObj.active ? 'bg-blue-100 text-primary' : 'bg-slate-700 text-gray-400'
                  }`}>
                    {dayObj.dateNum}
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-sm font-semibold text-secondary hover:bg-slate-800/80 hover:text-white transition-colors"
              onClick={() => setShowEventModal(true)}
            >
              + Add Event
            </button>
          </div>

          {/* Upcoming Tests widget removed */}
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card w-full max-w-sm relative">
            <button className="absolute top-4 right-4 text-secondary hover:text-white" onClick={() => setShowEventModal(false)}>
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">Add Schedule Event</h3>
            <form onSubmit={handleAddEvent}>
              <div className="form-group">
                <label className="form-label">Event Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Study System Design" 
                  required 
                  value={newEventTitle} 
                  onChange={e => setNewEventTitle(e.target.value)}
                />
              </div>
              <div className="form-group mb-6">
                <label className="form-label">Day</label>
                <select className="form-input bg-slate-800" value={newEventDay} onChange={e => setNewEventDay(e.target.value)}>
                  {schedule.map(s => <option key={s.day} value={s.day}>{s.day}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Save Event</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomeDashboard;
