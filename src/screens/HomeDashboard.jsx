import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, BookOpen, PenTool, TrendingUp, PlayCircle, Plus, X } from 'lucide-react';

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

  // Load Name and Simulated User Data from LocalStorage
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'John';
    setUserName(storedName);

    if (!isNewUser) {
      let score = localStorage.getItem(`readinessScore_${storedName}`);
      let apt = localStorage.getItem(`aptitudeScore_${storedName}`);
      let cod = localStorage.getItem(`codingScore_${storedName}`);
      
      if (!score) {
        // Generate consistent pseudo-random numbers based on username to simulate a database
        const base = storedName.charCodeAt(0) + storedName.length;
        score = 50 + (base % 40); 
        apt = Math.min(100, score + 12);
        cod = Math.max(20, score - 8);
        
        localStorage.setItem(`readinessScore_${storedName}`, score);
        localStorage.setItem(`aptitudeScore_${storedName}`, apt);
        localStorage.setItem(`codingScore_${storedName}`, cod);
      }
      setReadinessScore(parseInt(score));
      setAptitudeScore(parseInt(apt));
      setCodingScore(parseInt(cod));
    }
  }, [isNewUser]);

  const [dailyTasks, setDailyTasks] = useState(
    isNewUser 
    ? [
        { id: 1, title: 'Take Diagnostic Mock Test', type: 'Mock Test', duration: '60 mins', completed: false, link: '/tests' },
        { id: 2, title: 'Watch Intro to Placement Prep', type: 'Learning', duration: '15 mins', completed: false, link: '/topic/1' },
      ]
    : [
        { id: 1, title: 'Complete Arrays & Strings module', type: 'Learning', duration: '45 mins', completed: true, link: '/topic/1' },
        { id: 2, title: 'Solve 2 Medium Leetcode questions', type: 'Coding', duration: '60 mins', completed: false, link: '/coding' },
        { id: 3, title: 'Take TCS NQT Mock Test 1', type: 'Mock Test', duration: '90 mins', completed: false, link: '/tests' },
      ]
  );

  const generateDynamicSchedule = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dynamicSchedule = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dynamicSchedule.push({
        dayName: days[d.getDay()],
        dateNum: d.getDate(),
        active: false,
        current: i === 0,
        day: days[d.getDay()]
      });
    }
    return dynamicSchedule;
  };

  const [schedule, setSchedule] = useState(generateDynamicSchedule());

  const handleTakeTask = (task) => {
    // If we want to simulate marking it complete upon clicking:
    // setDailyTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: true } : t));
    navigate(task.link);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setSchedule(prev => prev.map(s => s.day === newEventDay ? { ...s, active: true } : s));
    setShowEventModal(false);
    setNewEventTitle('');
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
            className="card bg-slate-800/50 p-6 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-primary cursor-pointer hover:shadow-lg transition-shadow" 
            style={{ borderLeftColor: 'var(--primary-color)' }}
            onClick={() => navigate('/performance')}
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
                  ? "Take your first diagnostic mock test to calculate your initial readiness score."
                  : "Keep practicing to improve your scores. Focus on identifying and strengthening your weak areas."
                }
              </p>
              {!isNewUser && (
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
              )}
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
                    <div className="mt-1 cursor-pointer" onClick={() => setDailyTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))}>
                      {task.completed ? <CheckCircle className="text-green-500" /> : <div className="w-6 h-6 border-2 border-slate-600 rounded-full"></div>}
                    </div>
                    <div>
                      <h4 className={`font-semibold text-textMain ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-secondary font-medium">
                        <span className="flex items-center gap-1 bg-slate-700 px-2 py-1 rounded">
                          {task.type === 'Learning' && <BookOpen size={12} />}
                          {task.type === 'Coding' && <PenTool size={12} />}
                          {task.type === 'Mock Test' && <Clock size={12} />}
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
                      <button className="btn-primary py-1.5 px-4 text-sm" onClick={() => handleTakeTask(task)}>Take Task</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Learning */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Continue Learning</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-xl p-4 cursor-pointer hover:bg-slate-800/80 hover:border-primary/50 transition-colors flex gap-4 items-center" onClick={() => navigate('/topic/3')}>
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-primary">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Dynamic Programming</h4>
                  <p className="text-xs text-secondary mb-2">Core Engineering • Concept 4 of 12</p>
                  <div className="w-full bg-slate-600 h-1.5 rounded-full"><div className="bg-primary h-1.5 rounded-full" style={{ width: '30%' }}></div></div>
                </div>
              </div>
              <div className="border rounded-xl p-4 cursor-pointer hover:bg-slate-800/80 hover:border-primary/50 transition-colors flex gap-4 items-center" onClick={() => navigate('/topic/1')}>
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-orange-400">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1">Time & Work</h4>
                  <p className="text-xs text-secondary mb-2">Aptitude • Practice Quiz</p>
                  <div className="w-full bg-slate-600 h-1.5 rounded-full"><div className="bg-primary h-1.5 rounded-full" style={{ width: '80%' }}></div></div>
                </div>
              </div>
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

          {/* Upcoming Tests */}
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Upcoming Mock Tests</h3>
            <div className="flex flex-col gap-4">
              <div className="p-3 border rounded-lg bg-slate-800/80">
                <h4 className="font-bold text-sm">TCS NQT Full Length</h4>
                <p className="text-xs text-secondary mt-1 flex items-center gap-1"><Clock size={12}/> Today, 4:00 PM</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-bold text-sm">Infosys Pattern Mock</h4>
                <p className="text-xs text-secondary mt-1 flex items-center gap-1"><Calendar size={12}/> Friday, 10:00 AM</p>
              </div>
            </div>
            <button className="w-full mt-4 text-primary text-sm font-semibold hover:underline" onClick={() => navigate('/tests')}>View All Tests</button>
          </div>

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
