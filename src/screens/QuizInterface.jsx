import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';

const QuizInterface = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mockTest, setMockTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    fetchMockTest();
  }, [id]);

  const fetchMockTest = async () => {
    try {
      const response = await fetch(`http://10.141.95.184:5000/mocktests/${id}`);
      const data = await response.json();

      if (data.success) {
        setMockTest(data.data);
        setQuestions(data.data.questions || []);
        setTimeLeft((data.data.durationMinutes || 30) * 60);
      } else {
        alert(data.message || 'Mock test not found');
      }
    } catch (error) {
      console.error('Mock test error:', error);
      alert('Backend is not running');
    }
  };

  useEffect(() => {
    if (isSubmitted || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitFinal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, questions, selectedAnswers]);

  const handleOptionSelect = (questionId, option) => {
    if (isSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));

    setShowWarning(false);
  };

  const calculateResult = () => {
    let score = 0;

    const answers = questions.map((q) => {
      const selectedAnswer = selectedAnswers[q._id] || '';
      const correctAnswer = q.answer;
      const isCorrect = selectedAnswer === correctAnswer;

      if (isCorrect) score++;

      return {
        questionId: q._id,
        selectedAnswer,
        correctAnswer,
        isCorrect
      };
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return {
      score,
      totalQuestions,
      percentage,
      answers
    };
  };

  const handleSubmitFinal = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user?._id) {
      alert('User not found. Please login again.');
      navigate('/login');
      return;
    }

    const result = calculateResult();

    try {
      await fetch('http://10.141.95.184:5000/test-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          mockTestId: id,
          answers: result.answers,
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage
        })
      });

      setFinalScore(result);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submit result error:', error);
      alert('Result not saved. Check backend.');
    }
  };

  const handleAttemptSubmit = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setShowWarning(true);
    } else {
      handleSubmitFinal();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return <div className="p-6 text-center">Loading test...</div>;
  }

  if (isSubmitted && finalScore) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4">
        <div className="card w-full max-w-3xl animate-fade-in border-t-4 border-t-primary">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${finalScore.percentage >= 70 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {finalScore.percentage >= 70 ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
            </div>

            <h1 className="text-3xl font-bold text-textMain mb-2">Evaluation Complete</h1>
            <p className="text-secondary">
              You scored {finalScore.score} out of {finalScore.totalQuestions}
            </p>
          </div>

          <div className="flex justify-center mb-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-700" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * finalScore.percentage) / 100}
                />
              </svg>
              <div className="absolute text-3xl font-bold">{finalScore.percentage}%</div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-slate-700 pb-2">Detailed Analysis</h3>

            {questions.map((q, i) => {
              const selectedAnswer = selectedAnswers[q._id];
              const isCorrect = selectedAnswer === q.answer;
              const isUnanswered = selectedAnswer === undefined;

              return (
                <div key={q._id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-500/10 border-green-500/30' : isUnanswered ? 'bg-slate-800/50 border-slate-700' : 'bg-red-500/10 border-red-500/30'}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCorrect ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                    </div>

                    <div>
                      <p className="font-semibold mb-2">Q{i + 1}. {q.question}</p>

                      <div className="text-sm space-y-1">
                        <p>
                          Your Answer:{' '}
                          <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                            {isUnanswered ? 'Not Attempted' : selectedAnswer}
                          </span>
                        </p>

                        {!isCorrect && (
                          <p>
                            Correct Answer: <span className="text-green-400">{q.answer}</span>
                          </p>
                        )}

                        {q.explanation && (
                          <p className="text-secondary">
                            Explanation: {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <button className="btn-outline flex items-center gap-2" onClick={() => window.location.reload()}>
              <AlertTriangle size={18} /> Retake Test
            </button>

            <button className="btn-primary flex items-center gap-2" onClick={() => navigate('/tests')}>
              <Home size={18} /> Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="font-bold text-lg text-white capitalize">
          {mockTest?.title || 'Mock Test'}
        </div>

        <div className="flex items-center gap-3 text-red-400 font-mono font-bold text-lg bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
          <Clock size={20} /> {formatTime(timeLeft)}
        </div>

        <button
          className="btn-primary text-sm px-4 py-1.5"
          onClick={handleAttemptSubmit}
        >
          Submit Test
        </button>
      </header>

      {showWarning && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <AlertTriangle size={20} />
          <span className="font-bold">
            You have {questions.length - answeredCount} unanswered questions.
          </span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-center text-sm font-bold text-secondary">
              <span>Question {currentQIndex + 1} of {questions.length}</span>
            </div>

            <h2 className="text-2xl font-bold mb-8 leading-relaxed">
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    selectedAnswers[currentQ._id] === opt
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                  }`}
                  onClick={() => handleOptionSelect(currentQ._id, opt)}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswers[currentQ._id] === opt ? 'border-primary' : 'border-slate-500'}`}>
                    {selectedAnswers[currentQ._id] === opt && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                  </div>

                  <span className="text-lg">{opt}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-between">
              <button
                className="btn-outline px-6 py-2"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                style={{ opacity: currentQIndex === 0 ? 0.5 : 1 }}
              >
                Previous
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  className="btn-primary px-6 py-2 flex items-center gap-2"
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                >
                  Next <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  className="px-6 py-2 font-bold rounded-lg bg-green-500 text-white hover:bg-green-600"
                  onClick={handleAttemptSubmit}
                >
                  Submit Final Test
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-80 border-l border-slate-800 bg-slate-900/30 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Question Palette</h3>
            <span className="text-sm font-bold text-primary">
              {answeredCount}/{questions.length}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = selectedAnswers[q._id] !== undefined;
              const isCurrent = currentQIndex === idx;

              return (
                <button
                  key={q._id}
                  className={`w-10 h-10 rounded-md font-bold text-sm flex items-center justify-center transition-all ${
                    isCurrent ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  } ${
                    isAnswered ? 'bg-primary text-white' : 'bg-slate-800 text-secondary hover:bg-slate-700 border border-slate-700'
                  }`}
                  onClick={() => setCurrentQIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-4 text-sm bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-primary"></div>
              <span className="font-semibold text-white">Answered ({answeredCount})</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-slate-800 border border-slate-500"></div>
              <span className="font-semibold text-secondary">
                Not Answered ({questions.length - answeredCount})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;