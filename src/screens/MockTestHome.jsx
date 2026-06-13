import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, PlayCircle, TrendingUp, RefreshCw } from 'lucide-react';

const MockTestHome = () => {
  const navigate = useNavigate();

  const [mockTests, setMockTests] = useState([]);
  const [pastTests, setPastTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);

  useEffect(() => {
    fetchMockTests();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user?._id) {
      fetchStudentResults(user._id);
    } else {
      setResultsLoading(false);
    }
  }, []);

  const fetchMockTests = async () => {
    try {
      setLoading(true);

      const response = await fetch('http://10.141.95.184:5000/mocktests');
      const data = await response.json();

      if (data.success) {
        setMockTests(data.data);
      } else {
        setMockTests([]);
      }
    } catch (error) {
      console.error('Mock tests error:', error);
      setMockTests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentResults = async (userId) => {
    try {
      setResultsLoading(true);

      const response = await fetch(`http://10.141.95.184:5000/test-results/${userId}`);
      const data = await response.json();

      if (data.success) {
        setPastTests(data.data);
      } else {
        setPastTests([]);
      }
    } catch (error) {
      console.error('Test results error:', error);
      setPastTests([]);
    } finally {
      setResultsLoading(false);
    }
  };

  const refreshData = () => {
    fetchMockTests();

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?._id) {
      fetchStudentResults(user._id);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const calculateAverage = () => {
    if (pastTests.length === 0) return 0;

    const total = pastTests.reduce((acc, test) => acc + Number(test.percentage || 0), 0);
    return Math.round(total / pastTests.length);
  };

  const avgScore = calculateAverage();
  const recentTests = [...pastTests].slice(0, 3);

  return (
    <div className="page-container">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textMain mb-2">Mock Tests</h1>
          <p className="text-secondary text-lg">
            Simulate real exam environments and track your performance.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshData}
          className="btn-outline flex items-center gap-2 px-4 py-2"
        >
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Available Mock Tests</h2>

          {loading ? (
            <div className="card p-6 text-center text-secondary">
              Loading mock tests...
            </div>
          ) : mockTests.length === 0 ? (
            <div className="card p-6 text-center text-secondary">
              No mock tests available yet. Ask admin to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockTests.map((test) => (
                <div
                  key={test._id}
                  className="card p-6 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors border-2 border-transparent bg-slate-800/80"
                  onClick={() => navigate(`/quiz/${test._id}`)}
                >
                  <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                    <PlayCircle size={30} className="text-primary" />
                  </div>

                  <h4 className="font-bold text-sm text-textMain text-center">
                    {test.title}
                  </h4>

                  <p className="text-xs text-secondary mt-2 text-center">
                    {test.category}
                  </p>

                  <div className="flex justify-center items-center gap-2 mt-3 text-xs text-secondary">
                    <Clock size={14} />
                    <span>{test.durationMinutes || 30} Mins</span>
                  </div>

                  <p className="text-xs text-secondary mt-2 text-center">
                    {test.questions?.length || 0} Questions • {test.totalMarks || 0} Marks
                  </p>

                  <button
                    type="button"
                    className="btn-primary w-full mt-4 py-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/quiz/${test._id}`);
                    }}
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="card mb-6 bg-slate-900 text-white border-t-4 border-t-primary">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <TrendingUp className="text-primary" /> Performance Analytics
            </h3>

            <p className="text-sm text-gray-400 mb-6">
              Based on your recent mock test attempts.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-sm">Average Score</span>
                <span className={`font-bold text-xl ${getScoreColor(avgScore)}`}>
                  {pastTests.length > 0 ? `${avgScore}%` : 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                <span className="text-sm">Tests Taken</span>
                <span className="font-bold text-xl text-white">
                  {resultsLoading ? '...' : pastTests.length}
                </span>
              </div>
            </div>

            {pastTests.length > 0 && (
              <button
                className="w-full mt-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors text-sm font-semibold"
                onClick={() => navigate('/performance')}
              >
                View Detailed Analytics
              </button>
            )}
          </div>

          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold">Recent Tests</h2>
          </div>

          <div className="flex flex-col gap-3">
            {resultsLoading ? (
              <div className="p-6 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 text-center text-secondary text-sm">
                Loading results...
              </div>
            ) : recentTests.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-700 rounded-xl bg-slate-800/30 text-center text-secondary text-sm">
                No past tests recorded yet. Start a test to see your history!
              </div>
            ) : (
              recentTests.map((test) => (
                <div
                  key={test._id}
                  className="p-4 border border-slate-700 rounded-xl bg-slate-800/50 hover:bg-slate-800/80 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm text-textMain">
                      {test.mockTestId?.title || 'Mock Test'}
                    </h4>

                    <span className={`font-bold text-sm ${getScoreColor(test.percentage)}`}>
                      {test.percentage}%
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-secondary">
                    <span>
                      {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                    <span>
                      {test.score}/{test.totalQuestions} Correct
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestHome;