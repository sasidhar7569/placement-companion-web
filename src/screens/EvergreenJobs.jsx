import React, { useState } from 'react';
import { Target, ArrowRight, ChevronRight, Briefcase, Code, Brain, Shield, Cloud, Database, Cpu, PenTool, Zap, Activity } from 'lucide-react';

const evergreenJobs = [
  {
    title: "Artificial Intelligence Engineer",
    icon: Brain,
    color: "#8b5cf6",
    roadmap: ["Learn Python", "Data structures", "Machine learning", "Deep learning (PyTorch/TensorFlow)", "Build AI projects", "Specialize in LLMs or computer vision"]
  },
  {
    title: "Data Scientist",
    icon: Database,
    color: "#3b82f6",
    roadmap: ["Python or R", "Statistics", "SQL", "Data visualization", "Machine learning", "Real-world datasets and Kaggle projects"]
  },
  {
    title: "Cybersecurity Analyst",
    icon: Shield,
    color: "#ef4444",
    roadmap: ["Networking basics", "Linux", "Security fundamentals", "Ethical hacking basics", "Certifications (CompTIA Security+, CEH)", "Practice labs"]
  },
  {
    title: "Cloud Engineer",
    icon: Cloud,
    color: "#0ea5e9",
    roadmap: ["Basics of networking", "Linux", "AWS/Azure/GCP fundamentals", "DevOps tools", "Deploy cloud projects", "Certification"]
  },
  {
    title: "Full Stack Developer",
    icon: Code,
    color: "#10b981",
    roadmap: ["HTML, CSS, JavaScript", "Frontend framework (React)", "Backend (Node/Django)", "Databases", "Build full projects"]
  },
  {
    title: "DevOps Engineer",
    icon: Cpu,
    color: "#f59e0b",
    roadmap: ["Linux", "Git", "CI/CD pipelines", "Docker", "Kubernetes", "Cloud platforms", "Automation scripting"]
  },
  {
    title: "AI Product Manager",
    icon: Target,
    color: "#ec4899",
    roadmap: ["Basic programming awareness", "Product management skills", "AI fundamentals", "Analytics", "Work on AI-driven product case studies"]
  },
  {
    title: "Robotics Engineer",
    icon: Cpu,
    color: "#6366f1",
    roadmap: ["Physics + math", "C++/Python", "Embedded systems", "Control systems", "ROS (Robot Operating System)", "Robotics projects"]
  },
  {
    title: "Blockchain Developer",
    icon: Database,
    color: "#eab308",
    roadmap: ["JavaScript/Solidity", "Smart contracts", "Ethereum basics", "DApps development", "Security of blockchain systems"]
  },
  {
    title: "UI/UX Designer",
    icon: PenTool,
    color: "#f43f5e",
    roadmap: ["Design basics", "Figma/Adobe XD", "User research", "Prototyping", "Portfolio of real app designs", "Usability testing"]
  },
  {
    title: "Renewable Energy Engineer",
    icon: Zap,
    color: "#22c55e",
    roadmap: ["Electrical engineering basics", "Solar/wind systems", "Energy storage tech", "Sustainability studies", "Project internships"]
  },
  {
    title: "Bioinformatics Scientist",
    icon: Activity,
    color: "#14b8a6",
    roadmap: ["Biology basics", "Python", "Data analysis", "Genetics", "Machine learning for biology", "Research projects"]
  },
  {
    title: "AI Healthcare Specialist",
    icon: Activity,
    color: "#06b6d4",
    roadmap: ["Biology/medicine basics", "Data science", "AI in healthcare tools", "Medical datasets", "Regulatory knowledge"]
  },
  {
    title: "Semiconductor Engineer",
    icon: Cpu,
    color: "#8b5cf6",
    roadmap: ["Electronics fundamentals", "VLSI design", "Chip design tools", "Fabrication processes", "Advanced microelectronics"]
  },
  {
    title: "Prompt Engineer / AI Automation",
    icon: Brain,
    color: "#f97316",
    roadmap: ["Learn AI tools", "NLP basics", "Automation tools (Zapier, APIs)", "LLM usage", "Workflow optimization projects"]
  }
];

const EvergreenJobs = () => {
  const [selectedJob, setSelectedJob] = useState(evergreenJobs[0]);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textMain mb-2">Evergreen Jobs</h1>
        <p className="text-secondary text-lg">Explore high-demand careers and their definitive step-by-step roadmaps.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Job List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          {evergreenJobs.map((job, idx) => {
            const Icon = job.icon;
            const isActive = selectedJob.title === job.title;
            return (
              <button
                key={idx}
                className={`p-4 rounded-xl flex items-center justify-between transition-all border ${
                  isActive 
                  ? 'bg-slate-800 border-primary shadow-lg shadow-primary/10' 
                  : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
                }`}
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${job.color}20`, color: job.color }}>
                    <Icon size={20} />
                  </div>
                  <span className={`font-semibold text-left text-sm md:text-base ${isActive ? 'text-primary' : 'text-textMain'}`}>
                    {job.title}
                  </span>
                </div>
                {isActive && <ChevronRight size={20} className="text-primary" />}
              </button>
            );
          })}
        </div>

        {/* Right Side: Roadmap Visualization */}
        <div className="w-full lg:w-2/3">
          <div className="card sticky top-20 border-t-4 border-slate-700" style={{ borderTopColor: selectedJob.color }}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${selectedJob.color}20`, color: selectedJob.color }}>
                <selectedJob.icon size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedJob.title} Roadmap</h2>
                <p className="text-secondary mt-1">Master these skills sequentially to become a {selectedJob.title}.</p>
              </div>
            </div>

            <div className="relative pl-4 md:pl-8 py-4">
              {/* Vertical line connecting steps */}
              <div className="absolute top-8 bottom-8 left-[31px] md:left-[47px] w-1 bg-slate-700/50 rounded-full"></div>
              
              {selectedJob.roadmap.map((step, index) => (
                <div key={index} className="relative flex items-start gap-6 mb-10 last:mb-0 group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  {/* Node Circle */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 shrink-0 transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: selectedJob.color, color: '#fff', boxShadow: `0 0 15px ${selectedJob.color}40` }}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Content Box */}
                  <div className="flex-1 bg-slate-800/40 border border-slate-700/50 p-4 rounded-xl group-hover:bg-slate-800/80 group-hover:border-slate-600 transition-all">
                    <h3 className="font-bold text-lg text-white mb-1">{step}</h3>
                    <p className="text-sm text-secondary">Step {index + 1} of the {selectedJob.title} journey.</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EvergreenJobs;
