import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Settings, CheckCircle, Maximize, Minimize } from 'lucide-react';

const CodeEditor = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('class Solution {\\n    public int[] twoSum(int[] nums, int target) {\\n        \\n    }\\n}');
  const [language, setLanguage] = useState('Java');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [output, setOutput] = useState(null);

  const handleRun = () => {
    setOutput({ status: 'Running...', time: '-', memory: '-' });
    setTimeout(() => {
      setOutput({ 
        status: 'Accepted', 
        time: '1ms', 
        memory: '42.1 MB',
        stdout: 'Output: [0, 1]\\nExpected: [0, 1]'
      });
    }, 1500);
  };

  return (
    <div className={`flex flex-col bg-slate-800/80 ${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'}`}>
      <div className="bg-slate-800/50 border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-700 rounded-lg text-secondary transition-colors" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-textMain hidden md:block">1. Two Sum</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            className="bg-slate-700 border-none rounded-lg text-sm px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>Java</option>
            <option>Python3</option>
            <option>C++</option>
            <option>JavaScript</option>
          </select>
          <button className="p-2 hover:bg-slate-700 rounded-lg text-secondary transition-colors">
            <Settings size={18} />
          </button>
          <button 
            className="p-2 hover:bg-slate-700 rounded-lg text-secondary transition-colors"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        
        {/* Left Panel: Problem Description */}
        <div className="w-full md:w-5/12 bg-slate-800/50 border-r overflow-y-auto p-6 hide-scrollbar flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">1. Two Sum</h1>
            <div className="flex gap-2">
              <span className="bg-green-100 text-green-400 text-xs font-bold px-2 py-1 rounded">Easy</span>
              <span className="bg-slate-700 text-textMuted text-xs font-bold px-2 py-1 rounded">Array</span>
              <span className="bg-slate-700 text-textMuted text-xs font-bold px-2 py-1 rounded">Hash Table</span>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none text-textMuted space-y-4">
            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
            <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
            <p>You can return the answer in any order.</p>

            <div>
              <p className="font-bold mb-2">Example 1:</p>
              <pre className="bg-slate-800/80 p-3 rounded-lg border text-xs">
                <strong>Input:</strong> nums = [2,7,11,15], target = 9<br/>
                <strong>Output:</strong> [0,1]<br/>
                <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
              </pre>
            </div>
          </div>
        </div>

        {/* Right Panel: Code Editor and Output */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
          <div className="flex-1 relative">
            <textarea 
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm text-gray-300 bg-transparent resize-none outline-none hide-scrollbar"
              style={{ tabSize: 4 }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
          
          {/* Console / Output Panel */}
          <div className="h-64 border-t border-gray-700 bg-[#1e1e1e] flex flex-col">
            <div className="flex items-center px-4 py-2 border-b border-gray-700 bg-[#2d2d2d] gap-4">
              <button className="text-gray-300 text-sm hover:text-white font-medium">Testcase</button>
              <button className="text-green-500 text-sm font-medium border-b-2 border-green-500">Test Result</button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto text-gray-300 font-mono text-sm hide-scrollbar">
              {!output && <div className="text-slate-400 italic">Run code to see results...</div>}
              {output && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${output.status === 'Accepted' ? 'text-green-500' : 'text-gray-300'}`}>{output.status}</span>
                    {output.time !== '-' && <span className="text-gray-400 text-xs mt-1">Runtime: {output.time}</span>}
                  </div>
                  {output.stdout && (
                    <div className="bg-[#2d2d2d] p-3 rounded text-green-400 whitespace-pre-wrap">
                      {output.stdout}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="p-3 border-t border-gray-700 bg-[#1e1e1e] flex justify-end gap-3">
              <button className="px-6 py-1.5 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded transition-colors text-sm" onClick={handleRun}>
                Run Code
              </button>
              <button className="px-6 py-1.5 bg-green-600 hover:bg-green-500 text-white font-medium rounded transition-colors text-sm flex items-center gap-2">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
