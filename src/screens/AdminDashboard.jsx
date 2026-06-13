import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  FileQuestion,
  UploadCloud,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  Building2,
  CalendarDays,
  Bell,
  FileText,
  ClipboardList
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('students');
  const [dashboard, setDashboard] = useState(null);
  const [applications, setApplications] = useState([]);
  const [resources, setResources] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [mockTests, setMockTests] = useState([]);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showMockForm, setShowMockForm] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
    category: 'Aptitude',
    topic: '',
    difficulty: 'Easy',
    explanation: ''
  });

  const [newMockTest, setNewMockTest] = useState({
    title: '',
    category: 'Aptitude',
    durationMinutes: 30,
    selectedQuestions: []
  });

  useEffect(() => {
    fetchDashboard();
    fetchApplications();
    fetchResources();
    fetchQuestions();
    fetchMockTests();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await fetch('http://10.141.95.184:5000/dashboard');
      const data = await res.json();
      if (data.success) setDashboard(data.data);
    } catch (error) {
      console.error('Dashboard error:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://10.141.95.184:5000/applications');
      const data = await res.json();
      if (data.success) setApplications(data.data);
    } catch (error) {
      console.error('Applications error:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch('http://10.141.95.184:5000/resources');
      const data = await res.json();
      if (data.success) setResources(data.data);
    } catch (error) {
      console.error('Resources error:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch('http://10.141.95.184:5000/questions');
      const data = await res.json();
      if (data.success) setQuestions(data.data);
    } catch (error) {
      console.error('Questions error:', error);
    }
  };

  const fetchMockTests = async () => {
    try {
      const res = await fetch('http://10.141.95.184:5000/mocktests');
      const data = await res.json();
      if (data.success) setMockTests(data.data);
    } catch (error) {
      console.error('Mock tests error:', error);
    }
  };

  const handleQuestionChange = (e) => {
    setNewQuestion({ ...newQuestion, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    const payload = {
      question: newQuestion.question,
      options: [newQuestion.option1, newQuestion.option2, newQuestion.option3, newQuestion.option4],
      answer: newQuestion.answer,
      category: newQuestion.category,
      topic: newQuestion.topic,
      difficulty: newQuestion.difficulty,
      explanation: newQuestion.explanation
    };

    try {
      const res = await fetch('http://10.141.95.184:5000/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert('Question added successfully');
        setShowQuestionForm(false);
        setNewQuestion({
          question: '',
          option1: '',
          option2: '',
          option3: '',
          option4: '',
          answer: '',
          category: 'Aptitude',
          topic: '',
          difficulty: 'Easy',
          explanation: ''
        });
        fetchQuestions();
      } else {
        alert(data.message || 'Failed to add question');
      }
    } catch (error) {
      console.error('Add question error:', error);
      alert('Backend error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;

    try {
      const res = await fetch(`http://10.141.95.184:5000/questions/${id}`, {
        method: 'DELETE'
      });

      const data = await res.json();

      if (data.success) {
        alert('Question deleted');
        fetchQuestions();
      }
    } catch (error) {
      console.error('Delete question error:', error);
    }
  };

  const handleMockChange = (e) => {
    setNewMockTest({
      ...newMockTest,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionSelect = (questionId) => {
    const exists = newMockTest.selectedQuestions.includes(questionId);

    setNewMockTest({
      ...newMockTest,
      selectedQuestions: exists
        ? newMockTest.selectedQuestions.filter((id) => id !== questionId)
        : [...newMockTest.selectedQuestions, questionId]
    });
  };

  const handleCreateMockTest = async (e) => {
    e.preventDefault();

    if (newMockTest.selectedQuestions.length === 0) {
      alert('Select at least one question');
      return;
    }

    const payload = {
      title: newMockTest.title,
      category: newMockTest.category,
      durationMinutes: Number(newMockTest.durationMinutes),
      questions: newMockTest.selectedQuestions,
      totalMarks: newMockTest.selectedQuestions.length
    };

    try {
      const res = await fetch('http://10.141.95.184:5000/mocktests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        alert('Mock Test created successfully');
        setShowMockForm(false);
        setNewMockTest({
          title: '',
          category: 'Aptitude',
          durationMinutes: 30,
          selectedQuestions: []
        });
        fetchMockTests();
      } else {
        alert(data.message || 'Failed to create mock test');
      }
    } catch (error) {
      console.error('Create mock test error:', error);
      alert('Backend error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="w-full md:w-64 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 border-b border-slate-700 pb-4">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">PlacementPro</h1>
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button className={`flex items-center gap-3 p-3 rounded-lg font-medium ${activeTab === 'students' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('students')}>
            <Users size={20} /> Manage Students
          </button>

          <button className={`flex items-center gap-3 p-3 rounded-lg font-medium ${activeTab === 'questions' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('questions')}>
            <FileQuestion size={20} /> Manage Questions
          </button>

          <button className={`flex items-center gap-3 p-3 rounded-lg font-medium ${activeTab === 'mocktests' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('mocktests')}>
            <ClipboardList size={20} /> Manage Mock Tests
          </button>

          <button className={`flex items-center gap-3 p-3 rounded-lg font-medium ${activeTab === 'content' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-800 hover:text-white'}`} onClick={() => setActiveTab('content')}>
            <UploadCloud size={20} /> Upload Content
          </button>
        </nav>

        <button className="flex items-center gap-3 p-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10 mt-auto" onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="card border-t-4 border-blue-500">
              <Users className="text-blue-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Users</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalUsers ?? 0}</h3>
            </div>

            <div className="card border-t-4 border-green-500">
              <Building2 className="text-green-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Companies</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalCompanies ?? 0}</h3>
            </div>

            <div className="card border-t-4 border-purple-500">
              <FileText className="text-purple-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Applications</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalApplications ?? 0}</h3>
            </div>

            <div className="card border-t-4 border-yellow-500">
              <FileQuestion className="text-yellow-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Resources</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalResources ?? 0}</h3>
            </div>

            <div className="card border-t-4 border-red-500">
              <Bell className="text-red-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Notifications</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalNotifications ?? 0}</h3>
            </div>

            <div className="card border-t-4 border-cyan-500">
              <CalendarDays className="text-cyan-400 mb-2" size={24} />
              <p className="text-secondary text-sm">Events</p>
              <h3 className="text-2xl font-bold">{dashboard?.totalEvents ?? 0}</h3>
            </div>
          </div>
        </div>

        {activeTab === 'students' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-1">Manage Students</h2>
            <p className="text-secondary mb-8">View registered students and their applications.</p>

            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 text-secondary text-sm">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr><td colSpan="5" className="p-4 text-center text-secondary">No applications found.</td></tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app._id} className="border-b border-slate-700/50">
                          <td className="p-4">{app.userId?.name || 'N/A'}</td>
                          <td className="p-4 text-secondary">{app.userId?.email || 'N/A'}</td>
                          <td className="p-4">{app.companyId?.companyName || 'N/A'}</td>
                          <td className="p-4">{app.companyId?.role || 'N/A'}</td>
                          <td className="p-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded font-bold">{app.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Question Bank</h2>
                <p className="text-secondary">Questions are loaded from MongoDB.</p>
              </div>

              <button className="btn-primary flex items-center gap-2" onClick={() => setShowQuestionForm(!showQuestionForm)}>
                <Plus size={18} /> {showQuestionForm ? 'Close Form' : 'Add New Question'}
              </button>
            </div>

            {showQuestionForm && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4">Add Question</h3>

                <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
                  <textarea name="question" value={newQuestion.question} onChange={handleQuestionChange} className="form-input" placeholder="Enter question" required />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="option1" value={newQuestion.option1} onChange={handleQuestionChange} className="form-input" placeholder="Option 1" required />
                    <input name="option2" value={newQuestion.option2} onChange={handleQuestionChange} className="form-input" placeholder="Option 2" required />
                    <input name="option3" value={newQuestion.option3} onChange={handleQuestionChange} className="form-input" placeholder="Option 3" required />
                    <input name="option4" value={newQuestion.option4} onChange={handleQuestionChange} className="form-input" placeholder="Option 4" required />
                  </div>

                  <input name="answer" value={newQuestion.answer} onChange={handleQuestionChange} className="form-input" placeholder="Correct answer exactly as option" required />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="category" value={newQuestion.category} onChange={handleQuestionChange} className="form-input bg-slate-800/50">
                      <option>Aptitude</option>
                      <option>Logical</option>
                      <option>Verbal</option>
                      <option>Technical</option>
                      <option>Coding</option>
                    </select>

                    <input name="topic" value={newQuestion.topic} onChange={handleQuestionChange} className="form-input" placeholder="Topic" required />

                    <select name="difficulty" value={newQuestion.difficulty} onChange={handleQuestionChange} className="form-input bg-slate-800/50">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>

                  <textarea name="explanation" value={newQuestion.explanation} onChange={handleQuestionChange} className="form-input" placeholder="Explanation" />

                  <button type="submit" className="btn-primary">Save Question</button>
                </form>
              </div>
            )}

            <div className="card p-4 flex flex-col gap-4">
              {questions.length === 0 ? (
                <p className="text-secondary">No questions found.</p>
              ) : (
                questions.map((question) => (
                  <div key={question._id} className="p-4 border border-slate-700 rounded-lg">
                    <p className="font-medium mb-2">{question.question}</p>

                    <div className="flex gap-2 text-xs flex-wrap mb-3">
                      <span className="px-2 py-1 bg-slate-700 rounded text-secondary">{question.category}</span>
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded font-bold">{question.topic}</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded font-bold">{question.difficulty}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-secondary">
                      {question.options?.map((option, index) => (
                        <div key={index} className="bg-slate-800/50 border border-slate-700 rounded p-2">
                          {index + 1}. {option}
                        </div>
                      ))}
                    </div>

                    <p className="text-sm mt-3 text-green-400">Answer: {question.answer}</p>

                    <div className="flex gap-2 mt-3">
                      <button className="btn-outline px-3 py-1 text-xs"><Edit2 size={14} /></button>
                      <button className="btn-outline px-3 py-1 text-xs text-red-400 border-red-500/30" onClick={() => handleDeleteQuestion(question._id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'mocktests' && (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-1">Mock Tests</h2>
                <p className="text-secondary">Create mock tests using selected questions.</p>
              </div>

              <button className="btn-primary flex items-center gap-2" onClick={() => setShowMockForm(!showMockForm)}>
                <Plus size={18} /> {showMockForm ? 'Close Form' : 'Create Mock Test'}
              </button>
            </div>

            {showMockForm && (
              <div className="card mb-6">
                <h3 className="text-xl font-bold mb-4">Create Mock Test</h3>

                <form onSubmit={handleCreateMockTest} className="flex flex-col gap-4">
                  <input name="title" value={newMockTest.title} onChange={handleMockChange} className="form-input" placeholder="Mock Test Title" required />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="category" value={newMockTest.category} onChange={handleMockChange} className="form-input bg-slate-800/50">
                      <option>Aptitude</option>
                      <option>Logical</option>
                      <option>Verbal</option>
                      <option>Technical</option>
                      <option>Coding</option>
                    </select>

                    <input name="durationMinutes" type="number" value={newMockTest.durationMinutes} onChange={handleMockChange} className="form-input" placeholder="Duration in minutes" required />
                  </div>

                  <div className="border border-slate-700 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <h4 className="font-bold mb-3">Select Questions</h4>

                    {questions.length === 0 ? (
                      <p className="text-secondary">No questions available.</p>
                    ) : (
                      questions.map((q) => (
                        <label key={q._id} className="flex gap-3 items-start p-3 border-b border-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newMockTest.selectedQuestions.includes(q._id)}
                            onChange={() => handleQuestionSelect(q._id)}
                          />
                          <span>
                            <p className="font-medium">{q.question}</p>
                            <p className="text-xs text-secondary">{q.category} • {q.topic} • {q.difficulty}</p>
                          </span>
                        </label>
                      ))
                    )}
                  </div>

                  <p className="text-sm text-secondary">
                    Selected Questions: {newMockTest.selectedQuestions.length}
                  </p>

                  <button type="submit" className="btn-primary">Save Mock Test</button>
                </form>
              </div>
            )}

            <div className="card p-4 flex flex-col gap-4">
              {mockTests.length === 0 ? (
                <p className="text-secondary">No mock tests created.</p>
              ) : (
                mockTests.map((test) => (
                  <div key={test._id} className="p-4 border border-slate-700 rounded-lg">
                    <h3 className="font-bold">{test.title}</h3>
                    <p className="text-secondary text-sm">
                      {test.category} • {test.durationMinutes} minutes • {test.questions?.length || 0} questions • {test.totalMarks} marks
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-1">Upload Learning Content</h2>
            <p className="text-secondary mb-8">Add concepts, notes, and roadmaps to the learning module.</p>

            <div className="card">
              <form className="flex flex-col gap-6">
                <input type="text" className="form-input" placeholder="e.g. Introduction to Dynamic Programming" />

                <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                  <UploadCloud size={40} className="text-secondary mb-4" />
                  <p className="font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-secondary">SVG, PNG, JPG, MP4 or PDF</p>
                </div>

                <button type="button" className="btn-primary">Upload Content</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;