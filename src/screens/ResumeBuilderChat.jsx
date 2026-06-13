import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, ArrowLeft, Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeBuilderChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState('initial'); // initial -> role_company -> generating -> done
  const [userData, setUserData] = useState({ name: 'User', role: '', company: '' });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial greeting based on time
    const hour = new Date().getHours();
    let greeting = 'Good evening';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';

    // Simulate fetching user name from context/local storage (hardcoded to 'User' for now)
    const userName = 'User'; 
    setUserData(prev => ({ ...prev, name: userName }));

    const initialMsg = `${greeting}, ${userName}! I'm your AI Resume Assistant. I can help you build an ATS-optimized resume. To get started, what role and company are you targeting? (e.g., "Software Engineer at Google")`;
    
    setMessages([{ id: 1, sender: 'bot', text: initialMsg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
  }, []);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let botResponse = '';
      
      if (stage === 'initial') {
        botResponse = `Great choice! Building a resume for "${newUserMsg.text}". To boost your ATS score for this position, you should definitely include keywords like: "Scalable Architecture", "Agile Methodologies", "Cross-functional Team Leadership", and "Data-Driven Decision Making". \n\nShall I generate a tailored professional summary for you using these keywords? (Reply Yes or No)`;
        setStage('role_company');
      } else if (stage === 'role_company') {
        if (newUserMsg.text.toLowerCase().includes('yes') || newUserMsg.text.toLowerCase().includes('y')) {
          botResponse = `Here is a strong, ATS-friendly summary:\n\n"Results-driven professional with expertise in scalable architecture and agile methodologies. Proven track record in cross-functional team leadership, consistently delivering data-driven decision making to align technical solutions with business goals."\n\nYou can copy this to your clipboard! What section should we work on next? Skills, Experience, or Education?`;
          setStage('generating');
        } else {
          botResponse = `No problem! Let me know what specific section of your resume you'd like to work on (e.g., Skills, Experience, Education).`;
          setStage('generating');
        }
      } else {
        botResponse = `I can certainly help with that. Since this is a prototype, I have limited sections available, but in the full version I will guide you step-by-step to fill out your "${newUserMsg.text}" section with high-impact bullet points!`;
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 absolute inset-0 z-50">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">AI Resume Builder</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                <span className="text-xs text-slate-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary/30 transition flex items-center gap-2">
            <FileText size={16} />
            View Resume
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                  msg.sender === 'bot' ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-300'
                }`}>
                  {msg.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                </div>
                
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-5 py-3 rounded-2xl whitespace-pre-wrap ${
                    msg.sender === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.3)]' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%] flex-row">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex-shrink-0 flex items-center justify-center mt-1">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-slate-800 rounded-tl-none border border-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-slate-800/50 border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto relative">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-5 pr-14 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            disabled={isTyping}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
        <div className="text-center mt-3">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} className="text-green-500" />
            AI-powered keyword optimization active
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ResumeBuilderChat;
