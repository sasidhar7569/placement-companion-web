import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, HelpCircle, ArrowLeft, ChevronRight, Calculator, CheckCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { practiceData } from '../data/practiceData';

const topicDataMap = {
  '1': {
    title: 'Time & Work, Pipes & Cisterns',
    category: 'Aptitude',
    progress: 80,
    concepts: [
      { title: "Basic Concept", content: "The concept of Time and Work is based on the unitary method. If a person can complete a piece of work in 'n' days, then the work done in 1 day is 1/n." },
      { title: "Key Formulas", type: "formula", items: ["Work Done = Time Taken × Rate of Work", "If A takes X days and B takes Y days, together they take (X * Y) / (X + Y) days.", "Total time to fill tank = (X * Y) / (Y - X) for one filling, one emptying."] }
    ],
    practice: [
      { id: 1, question: "A can do a work in 10 days, B in 15 days. Time taken together?", options: ["6 days", "5 days", "8 days", "9 days"], answer: 0, explanation: "(10*15)/(10+15) = 150/25 = 6 days." },
      { id: 2, question: "Pipe A fills in 4h, Pipe B empties in 6h. Time to fill?", options: ["10h", "12h", "14h", "24h"], answer: 1, explanation: "(4*6)/(6-4) = 24/2 = 12h." }
    ]
  },
  '2': {
    title: 'Percentages, Profit & Loss',
    category: 'Aptitude',
    progress: 45,
    concepts: [
      { title: "Percentage Concepts", content: "Percentage means 'per hundred'. x% = x/100. To find a percentage of a number, multiply the number by the percentage fraction." },
      { title: "Profit & Loss Formulas", type: "formula", items: ["Profit % = (Profit / CP) * 100", "Loss % = (Loss / CP) * 100", "SP = CP * (100 + Profit%) / 100"] }
    ],
    practice: [
      { id: 1, question: "CP = 500, SP = 600. Find Profit %.", options: ["10%", "15%", "20%", "25%"], answer: 2, explanation: "Profit = 600 - 500 = 100. % = (100/500)*100 = 20%." },
      { id: 2, question: "20% of a number is 40. What is the number?", options: ["100", "200", "150", "250"], answer: 1, explanation: "0.2 * x = 40 => x = 40 / 0.2 = 200." }
    ]
  },
  '3': {
    title: 'Number Systems & Algebra',
    category: 'Aptitude',
    progress: 10,
    concepts: [
      { title: "Divisibility Rules", content: "Rule of 3: Sum of digits is divisible by 3. Rule of 4: Last two digits divisible by 4. Rule of 8: Last three digits divisible by 8." },
      { title: "Algebraic Identities", type: "formula", items: ["(a+b)² = a² + 2ab + b²", "a² - b² = (a-b)(a+b)", "a³ - b³ = (a-b)(a² + ab + b²)"] }
    ],
    practice: [
      { id: 1, question: "Find the unit digit of 2^5.", options: ["2", "4", "8", "6"], answer: 0, explanation: "2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5 ends in 2." },
      { id: 2, question: "If x + 1/x = 3, find x² + 1/x².", options: ["7", "9", "8", "10"], answer: 0, explanation: "(x + 1/x)² = 9 => x² + 1/x² + 2 = 9 => 7." }
    ]
  },
  '4': {
    title: 'Syllogisms & Logical Deductions',
    category: 'Reasoning',
    progress: 60,
    concepts: [
      { title: "Venn Diagrams", content: "Syllogisms are best solved using Venn diagrams to represent logical relations between sets like 'All A are B'." },
      { title: "Key Rules", type: "formula", items: ["If 'All A are B' and 'All B are C', then 'All A are C'.", "Some A are B implies Some B are A.", "No A is B means A intersection B is null."] }
    ],
    practice: [
      { id: 1, question: "Statements: All cats are dogs. Some dogs are birds. Conclusion: Some cats are birds.", options: ["True", "False", "Cannot be determined", "None"], answer: 2, explanation: "No direct link between cats and birds is established." },
      { id: 2, question: "Statements: No A is B. All B are C. Conclusion: Some C are not A.", options: ["True", "False", "Cannot be determined", "None"], answer: 0, explanation: "Since all B are C, and no B is A, the C's that are B cannot be A." }
    ]
  },
  '5': {
    title: 'Blood Relations & Direction Sense',
    category: 'Reasoning',
    progress: 30,
    concepts: [
      { title: "Family Tree", content: "Use symbols to denote gender (Square = Male, Circle = Female) and lines to denote relationships (Horizontal = Sibling/Spouse, Vertical = Parent/Child)." },
      { title: "Direction Basics", type: "formula", items: ["Four main directions: N, S, E, W.", "Pythagoras theorem is often used to find shortest distance: h² = p² + b²"] }
    ],
    practice: [
      { id: 1, question: "A is B's brother. C is A's mother. D is C's father. How is B related to D?", options: ["Grandson", "Granddaughter", "Grandchild", "Son"], answer: 2, explanation: "B is the child of C, who is the child of D. Since B's gender is unknown, Grandchild." },
      { id: 2, question: "A man walks 3km North, then 4km East. Shortest distance from start?", options: ["5km", "7km", "1km", "6km"], answer: 0, explanation: "√(3² + 4²) = √25 = 5km." }
    ]
  },
  '6': {
    title: 'Complex Seating Arrangements',
    category: 'Reasoning',
    progress: 0,
    concepts: [
      { title: "Circular Seating", content: "If people are facing the center, 'Left' means clockwise and 'Right' means anti-clockwise. If facing outwards, it is reversed." },
      { title: "Linear Seating", type: "formula", items: ["Always start with the most definite piece of information.", "Track 'Left/Right' based on whether they face North or South."] }
    ],
    practice: [
      { id: 1, question: "In a circle of 5 facing center, A is between B and C. D is immediate right of C. Who is immediate left of B?", options: ["A", "C", "D", "E"], answer: 3, explanation: "Arrangement: E, B, A, C, D (clockwise)." },
      { id: 2, question: "Five people in a row facing North. A is at an extreme end. B is second to right of A. Where is A?", options: ["Left End", "Right End", "Middle", "Cannot determine"], answer: 0, explanation: "If B is to the right of A, A must be at the Left End." }
    ]
  },
  '7': {
    title: 'Operating Systems & Concurrency',
    category: 'Core Subjects',
    progress: 15,
    concepts: [
      { title: "Deadlock", content: "A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process." },
      { title: "Conditions for Deadlock", type: "formula", items: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "Circular Wait"] }
    ],
    practice: [
      { id: 1, question: "Which scheduling algorithm suffers from starvation?", options: ["Round Robin", "SJF", "FCFS", "Both SJF and Priority"], answer: 3, explanation: "Shortest Job First and Priority scheduling can starve long/low priority processes." },
      { id: 2, question: "What resolves the critical section problem?", options: ["Mutex Locks", "Semaphores", "Monitors", "All of the above"], answer: 3, explanation: "Mutexes, Semaphores, and Monitors are all synchronization tools." }
    ]
  },
  '8': {
    title: 'Database Management Systems (DBMS)',
    category: 'Core Subjects',
    progress: 5,
    concepts: [
      { title: "ACID Properties", content: "Transactions must guarantee Atomicity, Consistency, Isolation, and Durability." },
      { title: "Normalization", type: "formula", items: ["1NF: Atomic values", "2NF: 1NF + No partial dependency", "3NF: 2NF + No transitive dependency", "BCNF: Every determinant is a candidate key"] }
    ],
    practice: [
      { id: 1, question: "Which normal form removes transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 2, explanation: "Third Normal Form deals with transitive dependencies." },
      { id: 2, question: "In SQL, which command is used to remove a table entirely?", options: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], answer: 2, explanation: "DROP deletes the table structure and data." }
    ]
  },
  '9': {
    title: 'Computer Networks Architecture',
    category: 'Core Subjects',
    progress: 0,
    concepts: [
      { title: "OSI Model", content: "A conceptual framework used to understand and implement network protocols in 7 layers." },
      { title: "Layers of OSI", type: "formula", items: ["Physical, Data Link, Network", "Transport, Session, Presentation, Application"] }
    ],
    practice: [
      { id: 1, question: "At which layer does a Router operate?", options: ["Data Link", "Network", "Transport", "Physical"], answer: 1, explanation: "Routers forward packets based on IP addresses at the Network layer." },
      { id: 2, question: "Which protocol provides reliable, connection-oriented service?", options: ["UDP", "IP", "TCP", "ICMP"], answer: 2, explanation: "Transmission Control Protocol (TCP) ensures reliable delivery." }
    ]
  },
  '10': {
    title: 'Object Oriented Programming (OOP)',
    category: 'Core Subjects',
    progress: 50,
    concepts: [
      { title: "Pillars of OOP", content: "The four main principles of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism." },
      { title: "Polymorphism Types", type: "formula", items: ["Compile-time: Method Overloading", "Run-time: Method Overriding"] }
    ],
    practice: [
      { id: 1, question: "Hiding internal state and requiring all interaction to be performed through an object's methods is:", options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"], answer: 1, explanation: "Encapsulation bundles data and methods and hides internal representation." },
      { id: 2, question: "Multiple inheritance in Java is supported through:", options: ["Classes", "Interfaces", "Abstract Classes", "It is not supported at all"], answer: 1, explanation: "Java allows multiple inheritance of type via Interfaces." }
    ]
  },
  '11': {
    title: 'Advanced Reading Comprehension',
    category: 'Verbal',
    progress: 90,
    concepts: [
      { title: "Skimming and Scanning", content: "Skim for the main idea and structure. Scan for specific keywords or data points when answering detail questions." },
      { title: "Question Types", type: "formula", items: ["Main Idea / Primary Purpose", "Inference / Implied Meaning", "Fact / Detail Retrieval", "Tone / Attitude of Author"] }
    ],
    practice: [
      { id: 1, question: "If the author uses words like 'ridiculous' and 'absurd', the tone is:", options: ["Objective", "Laudatory", "Derisive/Mocking", "Sorrowful"], answer: 2, explanation: "These words indicate scorn or mockery." },
      { id: 2, question: "An inference question asks for:", options: ["Explicit facts", "The main title", "Conclusions drawn from evidence", "Grammar corrections"], answer: 2, explanation: "Inferences are logical deductions not explicitly stated." }
    ]
  },
  '12': {
    title: 'Sentence Correction & Core Grammar',
    category: 'Verbal',
    progress: 100,
    concepts: [
      { title: "Subject-Verb Agreement", content: "A singular subject takes a singular verb, and a plural subject takes a plural verb. Watch out for prepositional phrases in between." },
      { title: "Modifiers", type: "formula", items: ["A modifier should be placed as close as possible to the word it modifies.", "Dangling modifiers have no subject to modify."] }
    ],
    practice: [
      { id: 1, question: "Identify the error: 'The bouquet of red roses smell incredibly sweet.'", options: ["bouquet", "of red roses", "smell", "incredibly"], answer: 2, explanation: "'bouquet' is singular, so the verb should be 'smells'." },
      { id: 2, question: "Choose the correct sentence:", options: ["Walking down the street, the trees were beautiful.", "Walking down the street, I saw beautiful trees.", "The trees, walking down the street, were beautiful.", "Beautiful trees walking down the street, I saw."], answer: 1, explanation: "Dangling modifier rule: the person 'walking' must be the subject 'I'." }
    ]
  }
};

// Fallback topic data if ID doesn't exist
const fallbackTopic = {
  title: 'Topic Not Found',
  category: 'General',
  progress: 0,
  concepts: [{ title: 'Content Unavailable', content: 'We could not find specific content for this topic.' }],
  practice: []
};

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('concepts');
  const [revealedAnswers, setRevealedAnswers] = useState({});

  const topicData = topicDataMap[id] || fallbackTopic;

  const topic = {
    id,
    ...topicData,
    practice: practiceData[id] || topicData.practice || []
  };

  const toggleAnswer = (qId) => {
    setRevealedAnswers(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Topics
        </button>
        <div className="flex justify-between items-end">
          <div>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold mb-3 inline-block">
              {topic.category}
            </span>
            <h1 className="text-3xl font-bold text-textMain">{topic.title}</h1>
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-primary mb-1">{topic.progress}% Completed</div>
            <div className="w-32 bg-slate-700 h-2 rounded-full">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${topic.progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-700 mb-8">
        <button 
          className={`pb-3 font-semibold text-lg px-2 border-b-2 transition-all ${activeTab === 'concepts' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-white'}`}
          onClick={() => setActiveTab('concepts')}
        >
          <div className="flex items-center gap-2"><BookOpen size={20} /> Concepts & Formulas</div>
        </button>
        <button 
          className={`pb-3 font-semibold text-lg px-2 border-b-2 transition-all ${activeTab === 'practice' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-white'}`}
          onClick={() => setActiveTab('practice')}
        >
          <div className="flex items-center gap-2"><HelpCircle size={20} /> Practice Examples</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          
          {activeTab === 'concepts' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {topic.concepts.map((concept, idx) => (
                <div key={idx} className="card bg-slate-800/30 border-slate-700 border">
                  <h3 className="text-xl font-bold mb-3 text-white flex items-center gap-2">
                    {concept.type === 'formula' ? <Calculator className="text-blue-400" size={20}/> : <Lightbulb className="text-yellow-400" size={20}/>}
                    {concept.title}
                  </h3>
                  
                  {concept.content && <p className="text-secondary leading-relaxed mb-4">{concept.content}</p>}
                  
                  {concept.type === 'formula' && (
                    <ul className="space-y-3">
                      {concept.items.map((item, i) => (
                        <li key={i} className="flex gap-3 text-secondary p-3 bg-slate-800 rounded-lg border border-slate-700">
                          <CheckCircle size={18} className="text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {concept.type === 'highlight' && (
                    <div className="p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg my-4">
                      <p className="font-mono text-lg font-bold text-primary">{concept.highlightText}</p>
                    </div>
                  )}

                  {concept.subContent && <p className="text-sm text-secondary mt-2 italic">{concept.subContent}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3 text-blue-400">
                <AlertTriangle size={20} className="flex-shrink-0" />
                <p className="text-sm">Try to solve these questions on your own before checking the explanation. This builds real problem-solving intuition!</p>
              </div>

              {topic.practice.map((q, idx) => (
                <div key={q.id} className="card border-slate-700">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-secondary flex-shrink-0">
                      {idx + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white leading-relaxed">{q.question}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 pl-12">
                    {q.options.map((opt, i) => (
                      <div key={i} className={`p-3 rounded-lg border border-slate-700 bg-slate-800/50 flex items-center gap-3 transition-colors ${revealedAnswers[q.id] && i === q.answer ? 'border-green-500 bg-green-500/10' : ''}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${revealedAnswers[q.id] && i === q.answer ? 'border-green-500 bg-green-500' : 'border-slate-500'}`}>
                          {revealedAnswers[q.id] && i === q.answer && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <span className={revealedAnswers[q.id] && i === q.answer ? 'text-green-400 font-bold' : 'text-secondary'}>{opt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pl-12">
                    <button 
                      className="text-primary text-sm font-bold hover:underline mb-4 transition-all"
                      onClick={() => toggleAnswer(q.id)}
                    >
                      {revealedAnswers[q.id] ? 'Hide Explanation' : 'View Answer & Explanation'}
                    </button>
                    
                    {revealedAnswers[q.id] && (
                      <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 animate-fade-in text-secondary text-sm leading-relaxed">
                        <span className="font-bold text-white block mb-2">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {topic.practice.length === 0 && (
                <p className="text-secondary p-4 bg-slate-800/30 rounded-xl">No practice questions available for this topic yet.</p>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20 border-slate-700">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" /> Topic Summary
            </h3>
            <p className="text-sm text-secondary mb-6 leading-relaxed">
              Master the concepts of <strong className="text-white">{topic.title}</strong> to improve your speed and accuracy. This topic is frequently requested in major technical and aptitude assessments.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-700/50">
                <span className="text-secondary">Key Formulas/Rules</span>
                <span className="font-bold text-white">{topic.concepts.find(c => c.type === 'formula')?.items?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2 border-b border-slate-700/50">
                <span className="text-secondary">Core Concepts</span>
                <span className="font-bold text-white">{topic.concepts.filter(c => c.type !== 'formula').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-secondary">Practice Examples</span>
                <span className="font-bold text-white">{topic.practice.length}</span>
              </div>
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2" onClick={() => navigate('/tests')}>
              Take Related Mock Test <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TopicDetail;
