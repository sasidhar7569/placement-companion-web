import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, Map, ChevronRight, ArrowLeft, Brain, Code, Terminal, Server, Star, Users, ExternalLink, Bookmark, CheckCircle, MessageSquare, Clock, MapPin } from 'lucide-react';
import BackButton from '../components/BackButton';

const companiesData = {
  google: {
    name: 'Google',
    logo: 'G',
    color: '#ef4444',
    industry: 'Product Based • FAANG',
    description: 'A global technology leader focused on search, cloud, AI, and advertising.',
    roles: {
      'SWE': [
        { step: 1, title: 'Advanced DSA & Problem Solving', desc: 'Solve medium to hard LeetCode questions focusing on Dynamic Programming, Graphs (DFS/BFS), Trees, and Tries.', icon: Code },
        { step: 2, title: 'Google-Specific Googlyness', desc: 'Understand Google culture, behavioral standards, and value alignment using the STAR method.', icon: Users },
        { step: 3, title: 'System Design & Scalability', desc: 'Design large-scale distributed systems, database replication, caching layers, and load balancing.', icon: Server }
      ],
      'Cloud Engineer': [
        { step: 1, title: 'Networking & OS Fundamentals', desc: 'Deep dive into TCP/IP, DNS, Linux systems, virtualization, and containers.', icon: Terminal },
        { step: 2, title: 'Google Cloud Platform (GCP)', desc: 'Learn core GCP services: Compute Engine, GKE, BigQuery, IAM, and networking.', icon: Server },
        { step: 3, title: 'Infrastructure as Code & Scripting', desc: 'Master Terraform, Bash/Python scripting, and automated deployment pipelines.', icon: Code }
      ]
    }
  },
  microsoft: {
    name: 'Microsoft',
    logo: 'M',
    color: '#0ea5e9',
    industry: 'Product Based • MNC',
    description: 'Empowering every person and organization on the planet to achieve more.',
    roles: {
      'SDE': [
        { step: 1, title: 'Data Structures & Algorithms', desc: 'Master arrays, linked lists, trees, and backtracking questions from past Microsoft interviews.', icon: Code },
        { step: 2, title: 'Object-Oriented Design (OOD)', desc: 'Learn SOLID design principles, design patterns, and low-level code structure.', icon: Terminal },
        { step: 3, title: 'System Design & CS Core', desc: 'Understand operating systems (threading, memory management) and system architecture basics.', icon: Server }
      ],
      'PM': [
        { step: 1, title: 'Product Sense & Strategy', desc: 'Learn how to design products, analyze product metrics, and build feature roadmaps.', icon: Brain },
        { step: 2, title: 'Analytical & Technical MCQs', desc: 'Understand basic technical architectures and metric tracking concepts.', icon: Server },
        { step: 3, title: 'Communication & Leadership', desc: 'Excel in stakeholder management, product design questions, and team alignment.', icon: Users }
      ]
    }
  },
  amazon: {
    name: 'Amazon',
    logo: 'A',
    color: '#f59e0b',
    industry: 'Product Based • FAANG',
    description: 'Multinational technology company focusing on e-commerce, cloud computing, and AI.',
    roles: {
      'SDE-1': [
        { step: 1, title: 'Data Structures & Algorithms', desc: 'LeetCode Medium/Hard. Focus on Trees, Graphs, DP, and Sliding Window.', icon: Code },
        { step: 2, title: 'CS Fundamentals', desc: 'In-depth OS (threads, locks, deadlocks) and Networking protocols.', icon: Server },
        { step: 3, title: 'Amazon Leadership Principles', desc: 'Prepare STAR method stories for all 16 leadership principles.', icon: Users }
      ],
      'SDE-2': [
        { step: 1, title: 'High-Level System Design (HLD)', desc: 'Design distributed systems, load balancing, caching, and database sharding.', icon: Map },
        { step: 2, title: 'Low-Level Design (LLD)', desc: 'Design patterns, SOLID principles, and object-oriented design.', icon: Terminal },
        { step: 3, title: 'Advanced DSA', desc: 'Complex algorithmic optimization and time-complexity limits.', icon: Code },
        { step: 4, title: 'Deep Dive Leadership', desc: 'Handling conflict, delivering results under pressure, and mentoring.', icon: Users }
      ]
    }
  },
  meta: {
    name: 'Meta',
    logo: 'M',
    color: '#0668e1',
    industry: 'Product Based • FAANG',
    description: 'Building technologies that help people connect, find communities, and grow businesses.',
    roles: {
      'Software Engineer': [
        { step: 1, title: 'High-Speed Coding & DSA', desc: 'Practice solving 2 LeetCode medium questions in 45 minutes perfectly, focusing on arrays, strings, and trees.', icon: Code },
        { step: 2, title: 'System Design (HLD)', desc: 'Practice scale-out designs, feed generation, messaging architectures, and distributed caching.', icon: Server },
        { step: 3, title: 'Behavioral & Meta Values', desc: 'Prepare answers showing impact, execution, and meta-focused core values.', icon: Users }
      ],
      'Product Manager': [
        { step: 1, title: 'Product Design & Creativity', desc: 'Answer design prompts like "Design a refrigerator for kids" or new Meta features.', icon: Brain },
        { step: 2, title: 'Execution & Analytical Metrics', desc: 'Formulate metrics for measuring success, debugging declines, and prioritization.', icon: Terminal },
        { step: 3, title: 'Leadership & Teamwork', desc: 'Excel in cross-functional collaboration and managing competing engineering priorities.', icon: Users }
      ]
    }
  },
  apple: {
    name: 'Apple',
    logo: 'A',
    color: '#94a3b8',
    industry: 'Product Based • FAANG',
    description: 'A pioneer in personal technology, manufacturing premium hardware, software, and services.',
    roles: {
      'ICT': [
        { step: 1, title: 'Core Algorithms & Complexity', desc: 'Focus on pointers, graph theory, trees, and time/space complexity optimization.', icon: Code },
        { step: 2, title: 'Memory Management & Low-Level', desc: 'Learn pointers, manual memory allocation, stack vs heap, and low-level debugging.', icon: Terminal },
        { step: 3, title: 'Embedded Systems Integration', desc: 'Learn system calls, OS concepts, hardware drivers, and compiler basics.', icon: Server }
      ],
      'Hardware': [
        { step: 1, title: 'Circuit Design & Analysis', desc: 'Master basic electrical engineering circuits, filters, transistor level logic, and layout.', icon: Brain },
        { step: 2, title: 'Computer Architecture Fundamentals', desc: 'Deeply understand ALU, CPU registers, caches, pipelining, and memory bus.', icon: Server },
        { step: 3, title: 'Signal Integrity & Verification', desc: 'Perform timing analysis, signal noise checks, and validation methodology.', icon: Terminal }
      ]
    }
  },
  tcs: {
    name: 'Tata Consultancy Services',
    logo: 'T',
    color: '#3b82f6',
    industry: 'Service Based • MNC',
    description: 'A global leader in IT services, consulting & business solutions.',
    roles: {
      'Ninja': [
        { step: 1, title: 'Basic Aptitude & Logical Reasoning', desc: 'Focus heavily on quantitative aptitude, percentages, profit & loss, and basic logical deductions.', icon: Brain },
        { step: 2, title: 'Core Subjects (Fundamentals)', desc: 'Brush up on basic DBMS (SQL queries), Operating Systems, and Computer Networks.', icon: Server },
        { step: 3, title: 'Basic Programming', desc: 'Learn standard algorithms: arrays, strings, basic sorting. Languages: C, C++, or Java.', icon: Code },
        { step: 4, title: 'Verbal Ability', desc: 'Practice sentence correction, reading comprehension, and vocabulary.', icon: Users }
      ],
      'Digital': [
        { step: 1, title: 'Advanced Coding (DSA)', desc: 'Master dynamic programming, graphs, trees, and advanced data structures.', icon: Code },
        { step: 2, title: 'New Age Technologies', desc: 'Understanding of Cloud, IoT, AI/ML basics, or Data Analytics is highly preferred.', icon: Terminal },
        { step: 3, title: 'System Design Basics', desc: 'Understand scalability, microservices vs monolith, and basic architecture.', icon: Server },
        { step: 4, title: 'Complex Aptitude', desc: 'High-level puzzle solving and complex reasoning questions.', icon: Brain }
      ]
    }
  },
  infy: {
    name: 'Infosys',
    logo: 'I',
    color: '#10b981',
    industry: 'Service Based • MNC',
    description: 'A global leader in next-generation digital services and consulting.',
    roles: {
      'System Engineer': [
        { step: 1, title: 'Mathematical & Logical Reasoning', desc: 'Cryptarithmetic puzzles, syllogisms, and data sufficiency.', icon: Brain },
        { step: 2, title: 'Pseudocode & Basics', desc: 'Tracing loops, conditional statements, and bitwise operations.', icon: Terminal },
        { step: 3, title: 'Easy Level Coding', desc: 'String manipulation, array traversal, and basic pattern printing.', icon: Code }
      ],
      'Specialist Programmer': [
        { step: 1, title: 'Competitive Programming', desc: 'Focus on CodeChef/Codeforces medium level problems. Heavy emphasis on optimization.', icon: Code },
        { step: 2, title: 'Advanced DBMS', desc: 'Complex SQL queries, normalization, indexing, and transaction management.', icon: Server },
        { step: 3, title: 'Full Stack Knowledge', desc: 'Basic understanding of frontend and backend integration.', icon: Terminal }
      ]
    }
  },
  wipro: {
    name: 'Wipro',
    logo: 'W',
    color: '#9c27b0',
    industry: 'Service Based • MNC',
    description: 'A leading technology services and consulting company, driving digital transformation.',
    roles: {
      'Elite': [
        { step: 1, title: 'Aptitude & Verbal Skills', desc: 'Solve math reasoning, logical puzzles, and english vocabulary/grammar questions.', icon: Brain },
        { step: 2, title: 'Basic Coding & Debugging', desc: 'Solve simple array or string manipulation exercises and fix simple code snippets.', icon: Code },
        { step: 3, title: 'General Technical & HR', desc: 'Be ready for core questions from college projects, basic OOPs, and behavioral answers.', icon: Users }
      ],
      'Turbo': [
        { step: 1, title: 'Advanced DSA & Coding', desc: 'Master dynamic programming, searching algorithms, trees, and hash tables.', icon: Code },
        { step: 2, title: 'DBMS, OS & Networks', desc: 'Brush up on computer fundamentals, SQL keys, schemas, process states, and protocols.', icon: Server },
        { step: 3, title: 'Technical Interview', desc: 'Explain complex project architectures, live coding tasks, and design considerations.', icon: Terminal }
      ]
    }
  },
  cogni: {
    name: 'Cognizant',
    logo: 'C',
    color: '#8b5cf6',
    industry: 'Service Based • MNC',
    description: 'Leading provider of IT services, digital transformation, and consulting.',
    roles: {
      'GenC': [
        { step: 1, title: 'Quantitative Aptitude', desc: 'Time & work, speed & distance, profit & loss.', icon: Brain },
        { step: 2, title: 'Automata Fix', desc: 'Debugging existing code, fixing syntax errors, and completing missing logic.', icon: Terminal },
        { step: 3, title: 'Basic SQL', desc: 'Joins, group by, and basic data retrieval.', icon: Server }
      ],
      'GenC Elevate': [
        { step: 1, title: 'Skill Based Coding', desc: 'Java/Python specific coding questions requiring language deep knowledge.', icon: Code },
        { step: 2, title: 'DBMS & Query Optimization', desc: 'Writing optimal queries and understanding database relationships.', icon: Server },
        { step: 3, title: 'Technical HR', desc: 'Project discussions, role-playing, and technical scenario questions.', icon: Users }
      ]
    }
  },
  accenture: {
    name: 'Accenture',
    logo: 'A',
    color: '#a100ff',
    industry: 'Service Based • MNC',
    description: 'A leading global professional services company, providing a broad range of services.',
    roles: {
      'Associate Software Engineer': [
        { step: 1, title: 'Cognitive & Technical MCQ', desc: 'Aptitude, analytical, MS Office suite basics, networking, and security concepts.', icon: Brain },
        { step: 2, title: 'Basic Coding Assessment', desc: 'Solve 2 basic coding questions, mostly on strings, arrays, or loops.', icon: Code },
        { step: 3, title: 'HR & Communication Round', desc: 'Automated speaking assessment followed by a conversational interview.', icon: Users }
      ],
      'Advanced ASE': [
        { step: 1, title: 'Advanced Coding Assessment', desc: 'Master data structures, graph traversals, greedy choice, and sorting optimization.', icon: Code },
        { step: 2, title: 'CS Core Concepts & Cloud', desc: 'Deep dive into database normal forms, cloud computing terminology, and OS paging.', icon: Server },
        { step: 3, title: 'Technical Panel Interview', desc: 'Focuses on final-year projects, complex algorithms, and system architecture.', icon: Terminal }
      ]
    }
  },
  goldmansachs: {
    name: 'Goldman Sachs',
    logo: 'GS',
    color: '#005a9c',
    industry: 'Product Based • Finance',
    description: 'A leading global financial institution that delivers services in investment banking, securities, and investment management.',
    roles: {
      'Analyst': [
        { step: 1, title: 'Quantitative Aptitude & Math MCQ', desc: 'High-level probability, statistics, linear algebra, permutations, and combinations.', icon: Brain },
        { step: 2, title: 'Coding & DSA Rounds', desc: 'Solve medium to hard DSA problems focusing on arrays, strings, trees, and DP.', icon: Code },
        { step: 3, title: 'CS Fundamentals & OOPs', desc: 'In-depth questions on garbage collection, heap vs stack, OS scheduling, and DB indexing.', icon: Server }
      ],
      'Summer Analyst': [
        { step: 1, title: 'Math & Logical Assessment', desc: 'Solve analytical puzzles, probability, logic deductions, and basic programming MCQs.', icon: Brain },
        { step: 2, title: 'Easy-Medium Coding Test', desc: 'Apply array searching, sorting, string tokenization, and recursion.', icon: Code },
        { step: 3, title: 'Technical Interview', desc: 'Review projects, simple data structures, OOP concepts, and academic details.', icon: Users }
      ]
    }
  },
  morganstanley: {
    name: 'Morgan Stanley',
    logo: 'MS',
    color: '#003366',
    industry: 'Product Based • Finance',
    description: 'A global financial services leader providing investment banking, securities, and wealth management.',
    roles: {
      'Technology Analyst': [
        { step: 1, title: 'Aptitude & Technical MCQ', desc: 'Solve questions on basic computer science, OOPs concepts, Java foundations, and data structures.', icon: Brain },
        { step: 2, title: 'DSA & Coding Rounds', desc: 'Focus on Linked Lists, Trees, Graph traversals, and dynamic programming.', icon: Code },
        { step: 3, title: 'CS Core & System Design', desc: 'Study OS concepts, multithreading, garbage collection, and basic high-level system design.', icon: Server }
      ],
      'Associate': [
        { step: 1, title: 'System Design & Architecture', desc: 'Design microservices, API endpoints, caching, message queues, and replication systems.', icon: Map },
        { step: 2, title: 'Advanced OOP & Design Patterns', desc: 'Master creational, structural, and behavioral design patterns in code.', icon: Terminal },
        { step: 3, title: 'Technical & Managerial Rounds', desc: 'Demonstrate scalability awareness, handling engineering conflicts, and project delivery.', icon: Users }
      ]
    }
  },
  jpmorgan: {
    name: 'JPMorgan',
    logo: 'J',
    color: '#16a34a',
    industry: 'Product Based • Finance',
    description: 'A premier global financial services firm and one of the largest banking institutions.',
    roles: {
      'Analyst': [
        { step: 1, title: 'Code For Good Hackathon / Coding Test', desc: 'Collaborate to build social impact projects, showing coding, design, and collaboration.', icon: Code },
        { step: 2, title: 'CS Core Subjects (OOP, DBMS)', desc: 'Understand encapsulation, inheritance, SQL queries, joins, and normal forms.', icon: Server },
        { step: 3, title: 'Technical & Fit Interviews', desc: 'Walkthrough project details, solve coding problems, and demonstrate value alignment.', icon: Users }
      ],
      'Associate': [
        { step: 1, title: 'System Design & High Concurrency', desc: 'Design transaction-safe banking systems, load balancers, caching, and SQL replication.', icon: Map },
        { step: 2, title: 'Concurrency & Databases', desc: 'Deep dive database transactions (ACID, isolation levels) and multithreaded execution.', icon: Server },
        { step: 3, title: 'Managerial & Behavioral', desc: 'Address project execution, leadership, compliance, and handling difficult situations.', icon: Users }
      ]
    }
  },
  bloomberg: {
    name: 'Bloomberg',
    logo: 'B',
    color: '#ff8c00',
    industry: 'Product Based • Finance',
    description: 'The global leader in business and financial data, news, and insights.',
    roles: {
      'Software Engineer': [
        { step: 1, title: 'Phone Screen (DSA & OOP)', desc: 'Solve Leetcode Medium problems on hash tables, stacks, queues, and explain OOP details.', icon: Code },
        { step: 2, title: 'Onsite Technical Rounds', desc: 'Design data structures on-the-fly, master pointer manipulation, and solve complex algorithms.', icon: Terminal },
        { step: 3, title: 'System Design & Value Match', desc: 'Design financial ticker systems or distributed pub-sub layers, showing passion for performance.', icon: Server }
      ],
      'Data Specialist': [
        { step: 1, title: 'Financial & Data Concepts MCQ', desc: 'Understand basics of stock markets, data formats, schema structures, and stats.', icon: Brain },
        { step: 2, title: 'SQL & Python Data Manipulation', desc: 'Retrieve, clean, and analyze complex datasets using SQL queries and Python code.', icon: Code },
        { step: 3, title: 'Domain Interview', desc: 'Discuss financial terminology, data processing pipelines, and client communication.', icon: Users }
      ]
    }
  }
};

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const company = companiesData[id];
  const roleKeys = company ? Object.keys(company.roles) : [];
  
  const [activeRole, setActiveRole] = useState(roleKeys[0]);

  useEffect(() => {
    if (roleKeys.length > 0) {
      setActiveRole(roleKeys[0]);
    }
  }, [id]);

  if (!company) {
    return <div className="page-container text-white">Company not found.</div>;
  }

  const currentRoadmap = company.roles[activeRole] || [];

  return (
    <div className="page-container">
      <div className="mb-6">
        <BackButton className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-4">
          <ArrowLeft size={18} /> Back to Companies
        </BackButton>
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg font-bold text-4xl" style={{ background: `${company.color}20`, color: company.color, border: `1px solid ${company.color}40` }}>
            {company.logo}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-textMain mb-2">{company.name}</h1>
            <p className="text-secondary mb-3 max-w-2xl">{company.description}</p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold text-textMuted">
              <span className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full"><Building size={14} /> {company.industry}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-8">
        <h2 className="text-xl font-bold mb-4">Select Target Role</h2>
        <div className="flex flex-wrap gap-4 border-b border-slate-700 pb-2">
          {roleKeys.map(role => (
            <button 
              key={role}
              className={`pb-3 font-semibold text-lg px-4 border-b-2 transition-all ${activeRole === role ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-white'}`}
              onClick={() => setActiveRole(role)}
            >
              {role} Role
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in">
        <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-2">Learning Path for {activeRole}</h3>
          <p className="text-secondary text-sm">Follow this roadmap strictly to clear the {activeRole} profile assessment at {company.name}.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-slate-700/50 transform -translate-x-1/2 rounded-full"></div>
          
          {currentRoadmap.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className={`card border border-slate-700/50 hover:border-primary/50 transition-colors relative ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:col-start-2 md:pl-12'}`}>
                <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-800 border-4 border-primary items-center justify-center text-xs font-bold text-primary z-10 ${index % 2 === 0 ? '-right-4' : '-left-4'}`}>
                  {item.step}
                </div>
                
                <div className={`flex items-start gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="p-3 bg-primary/10 text-primary rounded-xl shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-secondary">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CompanyDetail;
