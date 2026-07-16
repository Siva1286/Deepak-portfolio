'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowLeft, Github, ExternalLink, User, Shield, Wrench, 
  CheckCircle2, AlertTriangle, Server, Database, Layers, Cpu, 
  Check, Clock, Activity, FileText, Layout, 
  Smartphone, Bell, QrCode, ArrowRight, Play, RefreshCw, Send, 
  Award, Zap
} from 'lucide-react';

interface DormfixDetailProps {
  onClose: () => void;
}

export default function DormfixDetail({ onClose }: DormfixDetailProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'admin' | 'worker'>('student');
  const [flowStep, setFlowStep] = useState(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const [studentComplaints, setStudentComplaints] = useState([
    { id: '1', title: 'Water Leakage in Bathroom', status: 'Assigned', time: '10 mins ago', priority: 'High' },
    { id: '2', title: 'WiFi router not working', status: 'Completed', time: '2 hours ago', priority: 'Medium' }
  ]);
  const [newComplaintTitle, setNewComplaintTitle] = useState('');
  const [newComplaintRoom, setNewComplaintRoom] = useState('304');
  const [newComplaintCat, setNewComplaintCat] = useState('Plumbing');
  
  const [adminComplaints, setAdminComplaints] = useState([
    { id: '101', title: 'Broken Window Glass', student: 'Amit R. (Room 102)', priority: 'High', worker: 'Unassigned', status: 'Pending' },
    { id: '102', title: 'Ceiling Fan Regulator Broken', student: 'Siddharth S. (Room 214)', priority: 'Medium', worker: 'Ramesh Kumar', status: 'Assigned' }
  ]);
  
  const [workerTasks, setWorkerTasks] = useState([
    { id: '201', task: 'Fix AC Leaking - Room 405', status: 'In Progress', note: 'Waiting for backup filters' },
    { id: '202', task: 'Replace Bulb - Corridor B', status: 'Completed', note: 'Done in 10 minutes' }
  ]);

  // Handle scroll lock on mount/unmount
  useEffect(() => {
    // Stop Lenis smooth scroll
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
    
    // Hide body scrollbar
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Re-enable Lenis scroll
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      // Restore body scrollbar
      document.body.style.overflow = '';
    };
  }, []);

  // Modal Scroll Progress Bar
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalHeight = container.scrollHeight - container.clientHeight;
      const progress = totalHeight > 0 ? (container.scrollTop / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  // Simulating Student Complaint Submission
  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintTitle.trim()) return;

    const newObj = {
      id: String(studentComplaints.length + 1),
      title: `${newComplaintCat}: ${newComplaintTitle} (Room ${newComplaintRoom})`,
      status: 'Pending',
      time: 'Just now',
      priority: newComplaintCat === 'Plumbing' || newComplaintCat === 'Electrical' ? 'High' : 'Medium'
    };

    setStudentComplaints([newObj, ...studentComplaints]);
    
    // Also push to admin queue
    const adminObj = {
      id: String(100 + adminComplaints.length + 1),
      title: `${newComplaintCat}: ${newComplaintTitle}`,
      student: `Self (Room ${newComplaintRoom})`,
      priority: newObj.priority,
      worker: 'Unassigned',
      status: 'Pending'
    };
    setAdminComplaints([adminObj, ...adminComplaints]);

    setNewComplaintTitle('');
  };

  // Simulating Admin Assignment
  const handleAssignWorker = (id: string) => {
    setAdminComplaints(prev => prev.map(c => {
      if (c.id === id) {
        // Assign to a worker
        const updated = { ...c, worker: 'Rohan Sharma (Electrician)', status: 'Assigned' };
        
        // Also simulate worker side task creation
        const workerObj = {
          id: String(200 + workerTasks.length + 1),
          task: `${c.title} - ${c.student}`,
          status: 'In Progress',
          note: 'Assigned by Admin'
        };
        setWorkerTasks([workerObj, ...workerTasks]);
        
        return updated;
      }
      return c;
    }));
  };

  // Simulating Worker Task completion
  const handleCompleteTask = (id: string) => {
    setWorkerTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Completed', note: 'Task resolved successfully' };
      }
      return t;
    }));
    
    // Also update student and admin status
    setStudentComplaints(prev => prev.map(c => {
      // Simplistic matches
      if (c.id === '1') {
        return { ...c, status: 'Completed' };
      }
      return c;
    }));
  };

  // Auto architecture flow player
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingFlow) {
      interval = setInterval(() => {
        setFlowStep((prev) => (prev + 1) % 8);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlayingFlow]);

  // Framer Motion scroll animation configs
  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const architectureSteps = [
    { title: 'Student', desc: 'Identifies issue & logs into portal', icon: User, color: 'text-primary' },
    { title: 'Complaint Submission', desc: 'Registers details, categories, & uploads photo', icon: FileText, color: 'text-accent' },
    { title: 'Admin Verification', desc: 'Reviews request details & priority classification', icon: Shield, color: 'text-secondary' },
    { title: 'Worker Assignment', desc: 'Assigns complaint to specialized technician', icon: Wrench, color: 'text-amber-400' },
    { title: 'Repair Process', desc: 'Technician receives task & works on fix', icon: Activity, color: 'text-blue-400' },
    { title: 'Status Update', desc: 'Updates task progress in real time via dashboard', icon: RefreshCw, color: 'text-purple-400' },
    { title: 'Complaint Completion', desc: 'Technician marks work as completed', icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Student Confirmation', desc: 'Student reviews fix and closes case', icon: Award, color: 'text-emerald-300' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0A0D14] flex flex-col font-sans"
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-75 z-50 shadow-neon-cyan" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Case Study Header Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-[#0F1424]/85 backdrop-blur-xl border-b border-white/5 relative z-40">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-white/70 hover:text-primary transition-all group py-1.5"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>[ BACK_TO_PROJECTS ]</span>
        </button>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-sm font-display font-black tracking-widest text-white">DORMFIX</span>
          <span className="text-[9px] font-mono text-accent uppercase tracking-wider">CASE_STUDY // FULL_STREAM</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white hover:border-primary/40 hover:scale-105 transition-all shadow-md"
          aria-label="Close Case Study"
        >
          <X size={16} />
        </button>
      </header>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin select-text bg-[#0B0F19] grid-overlay"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        {/* ================= HERO HEADER ================= */}
        <section className="relative pt-16 pb-20 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <span className="px-4 py-1.5 rounded-full text-xs font-mono bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary uppercase tracking-widest">
              Project Case Study
            </span>
            
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight text-white mt-2">
              DORMFIX<span className="text-primary">.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-gradient-secondary font-display font-bold max-w-2xl mt-1 leading-normal">
              Smart Hostel Maintenance Workflow Management System
            </p>

            <div className="flex gap-3 mt-2">
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-white/5 border border-white/5 text-white/70">
                Full Stack Web Application
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-mono bg-primary/10 border border-primary/20 text-primary">
                MERN Stack
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/Siva1286"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all transform hover:-translate-y-0.5"
              >
                <Github size={14} /> GitHub Repository
              </a>
              <a
                href="#live-demo"
                onClick={(e) => {
                  e.preventDefault();
                  // scroll to live simulator
                  const element = document.getElementById('interactive-dashboard');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
              >
                <Play size={14} /> Run Live Simulator
              </a>
            </div>
          </motion.div>

          {/* Large Hero Laptop Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[850px] aspect-[16/10] mt-16 relative flex flex-col items-center px-4"
          >
            {/* Screen bezel */}
            <div className="w-[92%] aspect-[16/10] bg-[#1E293B] rounded-t-3xl p-4 border-[3px] border-white/15 shadow-[0_30px_70px_rgba(0,229,255,0.08)] relative overflow-hidden flex flex-col">
              
              {/* Notch camera */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-4 bg-black rounded-b-xl flex items-center justify-center gap-1.5 z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/90 shadow-[0_0_8px_#3b82f6]" />
                <div className="w-1 h-1 rounded-full bg-white/10" />
              </div>

              {/* Mock Web Dashboard Content */}
              <div className="flex-1 bg-[#0A0D14] rounded-xl border border-white/5 overflow-hidden flex flex-col relative text-left">
                {/* Fake browser bar */}
                <div className="bg-[#101524] px-4 py-2.5 border-b border-white/5 flex items-center justify-between text-white/50 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    <span className="ml-3 text-white/30">https://dormfix.net/admin/dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded">SYSTEM_ONLINE</span>
                  </div>
                </div>

                {/* Dashboard simulation layout */}
                <div className="flex-1 grid grid-cols-12 overflow-hidden">
                  {/* Side menu */}
                  <div className="col-span-3 bg-[#0D1220] border-r border-white/5 p-3 flex flex-col gap-2 font-mono text-[8px] text-white/55">
                    <div className="text-white font-bold mb-2 pb-1.5 border-b border-white/5 flex items-center gap-1.5 text-[9px]">
                      <Shield size={10} className="text-primary" /> Admin Portal
                    </div>
                    <div className="p-1.5 rounded bg-primary/10 text-primary border border-primary/20 flex items-center gap-1 font-bold">
                      <Layout size={9} /> General Dashboard
                    </div>
                    <div className="p-1.5 rounded hover:bg-white/5 transition-all flex items-center gap-1">
                      <FileText size={9} /> Complaints Queue (24)
                    </div>
                    <div className="p-1.5 rounded hover:bg-white/5 transition-all flex items-center gap-1">
                      <User size={9} /> Student Database
                    </div>
                    <div className="p-1.5 rounded hover:bg-white/5 transition-all flex items-center gap-1">
                      <Wrench size={9} /> Worker Assignments
                    </div>
                    <div className="mt-auto p-1.5 bg-secondary/10 border border-secondary/15 rounded flex flex-col gap-1 text-[7px] text-secondary">
                      <div className="font-bold flex items-center gap-1"><Zap size={8} /> Sync Server</div>
                      <div>Latency: 12ms</div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="col-span-9 p-4 overflow-y-auto flex flex-col gap-4 font-mono">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <div>
                        <h4 className="text-xs text-white font-bold">Dashboard Overview</h4>
                        <p className="text-[7px] text-white/40">Real-time status updates from MERN server</p>
                      </div>
                      <span className="text-[8px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">All Nodes Active</span>
                    </div>

                    {/* Stats counters */}
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white/5 border border-white/5 p-2 rounded relative overflow-hidden group">
                        <div className="text-white/40 text-[7px]">TOTAL LOGS</div>
                        <div className="text-sm font-black text-white mt-1">1,248</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/5 rounded-full blur-md" />
                      </div>
                      <div className="bg-white/5 border border-white/5 p-2 rounded relative overflow-hidden">
                        <div className="text-white/40 text-[7px]">UNASSIGNED</div>
                        <div className="text-sm font-black text-red-400 mt-1">04</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-red-500/5 rounded-full blur-md" />
                      </div>
                      <div className="bg-white/5 border border-white/5 p-2 rounded relative overflow-hidden">
                        <div className="text-white/40 text-[7px]">RESOLVING</div>
                        <div className="text-sm font-black text-amber-400 mt-1">18</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-amber-500/5 rounded-full blur-md" />
                      </div>
                      <div className="bg-white/5 border border-white/5 p-2 rounded relative overflow-hidden">
                        <div className="text-white/40 text-[7px]">COMPLETED</div>
                        <div className="text-sm font-black text-emerald-400 mt-1">1,226</div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500/5 rounded-full blur-md" />
                      </div>
                    </div>

                    {/* Visual graph / logs preview */}
                    <div className="bg-white/5 border border-white/5 rounded p-3 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[7px] text-white/50 pb-1 border-b border-white/5">
                        <span>LIVE COMPLAINTS ACTION LOG</span>
                        <span className="text-primary flex items-center gap-0.5"><Clock size={7} /> Updates every 5s</span>
                      </div>
                      <div className="flex flex-col gap-1.5 text-[7px]">
                        <div className="flex justify-between items-center p-1.5 rounded bg-white/5 border-l border-red-500">
                          <span className="text-white">Water leakage in Block C, Bathroom 2</span>
                          <span className="px-1 py-0.2 bg-red-500/10 text-red-400 rounded">HIGH PRIORITY</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 rounded bg-white/5 border-l border-primary">
                          <span className="text-white">Room 302: Light bulb replacement required</span>
                          <span className="px-1 py-0.2 bg-primary/10 text-primary rounded">ASSIGNED - TECHNICIAN_04</span>
                        </div>
                        <div className="flex justify-between items-center p-1.5 rounded bg-white/5 border-l border-emerald-500 opacity-60">
                          <span className="text-white">Room 114: Door latch repair completed</span>
                          <span className="px-1 py-0.2 bg-emerald-500/10 text-emerald-400 rounded">SOLVED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Laptop Base */}
            <div className="w-[100%] h-4 bg-[#334155] rounded-b-2xl border-t border-white/20 relative shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex justify-center">
              <div className="absolute top-0 w-24 h-1.5 bg-black/40 rounded-b-md" />
            </div>
            
            {/* Soft reflective glow under laptop */}
            <div className="absolute bottom-2 left-12 right-12 h-6 bg-primary/10 rounded-full filter blur-xl -z-10 animate-pulse" />
          </motion.div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= PROJECT OVERVIEW & STATS ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Overview Left */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="text-xs font-mono text-primary tracking-widest uppercase">
                [ 01 // OVERVIEW_STATEMENT ]
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white">
                Digitizing Hostel Operations<span className="text-primary">.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                DORMFIX is a full-stack hostel maintenance management system developed to simplify and digitize the complaint resolution process inside college hostels. The application connects students, administrators, and maintenance workers through a centralized platform where maintenance requests can be registered, assigned, tracked, and resolved efficiently.
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                The platform eliminates manual complaint registers and improves communication by providing real-time updates throughout the maintenance lifecycle. By streamlining communication pathways, DORMFIX ensures that issues are resolved in order of urgency and availability of skilled personnel.
              </p>
            </div>

            {/* Overview Stats Right */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass-panel-glow p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">98.4%</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Resolution Rate</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">&lt; 2 Hrs</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Avg Turnaround</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                  <Activity size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">1.2K+</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Logs Managed</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <User size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">4.9/5</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Student Rating</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= PROBLEM & SOLUTION ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-6 mb-12 text-center items-center"
          >
            <div className="text-xs font-mono text-secondary tracking-widest uppercase">
              [ 02 // PARADIGM_SHIFT ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white max-w-xl">
              From Manual Registers to Automated Pipelines
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden hover:border-red-500/20 group transition-all"
            >
              {/* Glowing Alert Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Problem Statement</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                In many colleges, hostel maintenance complaints are handled manually through physical registers or phone calls. This legacy system introduces critical points of failure:
              </p>
              
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Delayed Responses:</strong> Complaints sit in books without active alerting protocols.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Lost Claims:</strong> Pages get misplaced, phone logs are deleted, causing untracked leaks or structural damage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Broken Communication:</strong> Students remain in the dark about completion times, and admins struggle with technician scheduling.</span>
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel-glow p-8 rounded-3xl border border-primary/20 relative overflow-hidden hover:border-primary/40 group transition-all"
            >
              {/* Glowing Cyan Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">The Digital Solution</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                DORMFIX replaces analog protocols with an end-to-end cloud-based workflow:
              </p>

              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Online Submission:</strong> Students submit maintenance tickets online with specific categories and details.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Role-Based Delegation:</strong> Admins filter and assign complaints to relevant workers (plumbers, electricians, carpenters).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Real-time Telemetry:</strong> Live dashboard states sync across all three user groups, enforcing transparency and resolving complaints rapidly.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= ARCHITECTURE PIPELINE ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-accent tracking-widest uppercase">
              [ 03 // PIPELINE_LIFECYCLE ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              System Architecture & Workflow Lifecycle
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Trace how complaints travel through the MERN architecture stack. Click the play button to simulate a complaint ticket's journey.
            </p>
            <button
              onClick={() => {
                setIsPlayingFlow(!isPlayingFlow);
                if (!isPlayingFlow) setFlowStep(0);
              }}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 text-white transition-all"
            >
              <Play size={12} className={isPlayingFlow ? "animate-ping text-primary" : "text-white"} />
              <span>{isPlayingFlow ? 'PAUSE AUTOMATION' : 'PLAY LIFECYCLE PIPELINE'}</span>
            </button>
          </motion.div>

          {/* Workflow Pipeline Display */}
          <div className="relative mt-8 select-none">
            {/* Progress line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 hidden xl:block" />
            
            {/* Animated active flow line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-accent -translate-y-1/2 hidden xl:block transition-all duration-700" 
              style={{ width: `${(flowStep / 7) * 100}%` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 relative z-10">
              {architectureSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCurrent = flowStep === idx;
                const isPassed = flowStep > idx;

                return (
                  <div 
                    key={step.title}
                    onClick={() => {
                      setIsPlayingFlow(false);
                      setFlowStep(idx);
                    }}
                    className={`glass-panel p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative ${
                      isCurrent 
                        ? 'border-primary shadow-neon-cyan scale-105 bg-[#0F1424]' 
                        : isPassed 
                          ? 'border-accent/40 bg-white/5' 
                          : 'border-white/5 opacity-55 hover:opacity-85'
                    }`}
                  >
                    {/* Glowing index tag */}
                    <span className={`text-[8px] font-mono mb-2 px-1.5 py-0.2 rounded ${
                      isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                    }`}>
                      STAGE_0{idx + 1}
                    </span>

                    {/* Step Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      isCurrent 
                        ? 'bg-primary/10 text-primary scale-110 transition-transform' 
                        : isPassed 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-white/5 text-white/40'
                    }`}>
                      <Icon size={18} />
                    </div>

                    {/* Step Title */}
                    <h4 className="text-xs font-bold text-white tracking-wide">{step.title}</h4>
                    
                    {/* Step Description */}
                    <p className="text-[9px] text-white/50 leading-relaxed mt-2 font-mono">
                      {step.desc}
                    </p>

                    {/* Chevron Connector on small viewports */}
                    {idx < 7 && (
                      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 text-white/10 hidden xl:block">
                        <ArrowRight size={14} className={isPassed ? "text-accent/60" : ""} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= INTERACTIVE DASHBOARD SIMULATOR ================= */}
        <section id="interactive-dashboard" className="py-16 px-6 md:px-16 max-w-6xl mx-auto scroll-mt-20">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-secondary tracking-widest uppercase">
              [ 04 // LIVE_APPLICATION_SIMULATOR ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Experience the Role-Based Workflows
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              DORMFIX features isolated dashboards tailored for Students, Administrators, and Maintenance Workers. Toggle tabs below to try out interactive mockups of each interface!
            </p>
          </motion.div>

          {/* Simulator Tabs Container */}
          <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-glass relative">
            
            {/* Tabs Header */}
            <div className="flex border-b border-white/5 p-2 bg-[#0E1322]/90 flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono transition-all font-bold ${
                  activeTab === 'student' 
                    ? 'bg-primary text-background shadow-neon-cyan' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <User size={14} /> Student Portal
              </button>
              
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono transition-all font-bold ${
                  activeTab === 'admin' 
                    ? 'bg-secondary text-white shadow-neon-purple' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield size={14} /> Admin Workspace
              </button>
              
              <button
                onClick={() => setActiveTab('worker')}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-mono transition-all font-bold ${
                  activeTab === 'worker' 
                    ? 'bg-accent text-background shadow-[0_0_15px_rgba(56,189,248,0.3)]' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wrench size={14} /> Worker Workspace
              </button>
            </div>

            {/* Tabs Content */}
            <div className="p-6 bg-[#0A0D15]/85 min-h-[350px] flex flex-col">
              <AnimatePresence mode="wait">
                {activeTab === 'student' && (
                  <motion.div
                    key="student-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    {/* Left: submit complaint */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-primary rounded-full" /> Submitting a maintenance ticket
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                        Fill in complaint category, room details, and issue description to publish a ticket to the admin work pool.
                      </p>

                      <form onSubmit={handleAddComplaint} className="flex flex-col gap-3 font-mono text-[10px]">
                        <div>
                          <label className="text-white/40 block mb-1">Issue Category</label>
                          <select 
                            value={newComplaintCat} 
                            onChange={(e) => setNewComplaintCat(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white/80 focus:border-primary/50 outline-none"
                          >
                            <option value="Plumbing" className="bg-[#0B0F19]">Plumbing (Leakage, Blocks)</option>
                            <option value="Electrical" className="bg-[#0B0F19]">Electrical (Fittings, Wiring)</option>
                            <option value="Carpentry" className="bg-[#0B0F19]">Carpentry (Doors, Locks)</option>
                            <option value="Network" className="bg-[#0B0F19]">Network / WiFi</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1">
                            <label className="text-white/40 block mb-1">Room No.</label>
                            <input 
                              type="text" 
                              value={newComplaintRoom} 
                              onChange={(e) => setNewComplaintRoom(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white focus:border-primary/50 outline-none"
                              placeholder="304"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-white/40 block mb-1">File Attachment</label>
                            <div className="bg-white/5 border border-dashed border-white/10 rounded px-2 py-1 text-center text-white/30 cursor-pointer hover:border-primary/30 hover:bg-white/10 transition-colors">
                              📎 Select file...
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-white/40 block mb-1">Issue Description</label>
                          <input 
                            type="text" 
                            required
                            value={newComplaintTitle}
                            onChange={(e) => setNewComplaintTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-2 text-white focus:border-primary/50 outline-none"
                            placeholder="Describe what is broken (e.g. Wash basin tap leaking)"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-primary text-background font-bold rounded flex items-center justify-center gap-1.5 hover:shadow-neon-cyan transition-all mt-1"
                        >
                          <Send size={10} /> Submit Ticket
                        </button>
                      </form>
                    </div>

                    {/* Right: student complaints tracking */}
                    <div className="lg:col-span-7 flex flex-col gap-4 font-mono">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-3 bg-primary rounded-full" /> Student Complaint History
                        </h4>
                        <span className="text-[8px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded">
                          Logged in: deepak_stu
                        </span>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {studentComplaints.map(sc => (
                          <div 
                            key={sc.id}
                            className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center hover:border-white/10 transition-all"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-white font-bold text-[11px]">{sc.title}</span>
                              <div className="flex gap-2 text-[8px] text-white/40">
                                <span>Logged: {sc.time}</span>
                                <span>•</span>
                                <span className={sc.priority === 'High' ? 'text-red-400 font-bold' : 'text-amber-400'}>
                                  {sc.priority} Priority
                                </span>
                              </div>
                            </div>

                            <span className={`px-2 py-0.5 rounded font-bold text-[8px] border ${
                              sc.status === 'Completed'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : sc.status === 'Assigned'
                                  ? 'bg-accent/10 border-accent/20 text-accent'
                                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                            }`}>
                              {sc.status.toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'admin' && (
                  <motion.div
                    key="admin-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-3 bg-secondary rounded-full" /> Administrator Operations Panel
                        </h4>
                        <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                          Review incoming complaints and click "Assign specialized worker" to forward to available staff.
                        </p>
                      </div>
                      <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">
                        Security Clearance: Admin Level_1
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
                      {adminComplaints.map(ac => (
                        <div 
                          key={ac.id}
                          className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col justify-between gap-3 hover:border-white/10 transition-all relative overflow-hidden"
                        >
                          {/* Top bar info */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] px-1 rounded bg-white/5 text-white/40 block w-max mb-1">
                                TICKET_ID: #{ac.id}
                              </span>
                              <h5 className="text-[11px] font-bold text-white leading-normal">{ac.title}</h5>
                            </div>
                            <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold ${
                              ac.priority === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-500'
                            }`}>
                              {ac.priority}
                            </span>
                          </div>

                          {/* Student identity */}
                          <div className="text-[8px] text-white/40 flex justify-between border-b border-white/5 pb-2">
                            <span>Student: {ac.student}</span>
                            <span>Status: {ac.status}</span>
                          </div>

                          {/* Assign CTA or worker assigned */}
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] text-white/50">
                              Assigned Staff: <strong className="text-white">{ac.worker}</strong>
                            </span>
                            
                            {ac.status === 'Pending' ? (
                              <button
                                onClick={() => handleAssignWorker(ac.id)}
                                className="px-3 py-1 bg-secondary text-white text-[9px] font-bold rounded hover:shadow-neon-purple transition-all flex items-center gap-1"
                              >
                                <Wrench size={8} /> Assign Technician
                              </button>
                            ) : (
                              <span className="text-[8px] text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 size={10} /> Dispatched
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'worker' && (
                  <motion.div
                    key="worker-tab"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                  >
                    {/* Left details */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-accent rounded-full" /> Technician Tasks Queue
                      </h4>
                      <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                        Maintenance workers receive assignments automatically. They update statuses in the field, which mirrors changes to students and administrators instantly.
                      </p>

                      <div className="p-4 bg-white/5 border border-white/5 rounded-xl font-mono text-[9px] text-white/60">
                        <div className="font-bold text-white mb-2 flex items-center gap-1"><Smartphone size={10} /> FIELD TERMINAL SYSTEM</div>
                        <div>Device status: <span className="text-emerald-400 font-bold">ONLINE</span></div>
                        <div>GPS location: Hostel Block C</div>
                        <div>Sync telemetry: 100% complete</div>
                      </div>
                    </div>

                    {/* Right jobs queue */}
                    <div className="lg:col-span-7 flex flex-col gap-3 font-mono">
                      {workerTasks.map(wt => (
                        <div 
                          key={wt.id}
                          className="bg-[#0E1322] p-4 rounded-xl border border-white/5 flex flex-col gap-3 justify-between hover:border-white/10 transition-all"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h5 className="text-[11px] font-bold text-white">{wt.task}</h5>
                              <p className="text-[9px] text-white/40 mt-1">Logs/Notes: {wt.note}</p>
                            </div>
                            <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${
                              wt.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            }`}>
                              {wt.status.toUpperCase()}
                            </span>
                          </div>

                          {wt.status === 'In Progress' && (
                            <button
                              onClick={() => handleCompleteTask(wt.id)}
                              className="w-max px-4 py-1.5 bg-accent text-background font-bold text-[9px] rounded hover:shadow-[0_0_12px_rgba(56,189,248,0.4)] transition-all flex items-center gap-1"
                            >
                              <Check size={10} /> Mark Completed
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= TECHNOLOGY STACK ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-primary tracking-widest uppercase">
              [ 05 // TECHNOLOGY_STACK ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              The Architecture Stack
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              MERN framework engineered with secure session auth protocols to support multiple hostel roles simultaneously.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* React */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Frontend</h4>
                <div className="text-lg font-display font-bold text-white mt-1">React.js</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Drives dynamic component states, dashboard layouts, client router structures, and interactive forms.
                </p>
              </div>
            </div>

            {/* Express */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Backend</h4>
                <div className="text-lg font-display font-bold text-white mt-1">Express.js</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Acts as web application framework layer, routing requests, running logic controllers, and querying datasets.
                </p>
              </div>
            </div>

            {/* Node */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Server size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Server Environment</h4>
                <div className="text-lg font-display font-bold text-white mt-1">Node.js</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Handles server runtime executing APIs and coordinating system sockets.
                </p>
              </div>
            </div>

            {/* MongoDB */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Database size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Database</h4>
                <div className="text-lg font-display font-bold text-white mt-1">MongoDB</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Houses collections representing students, complaints lists, assignments profiles, and workers datasets.
                </p>
              </div>
            </div>

            {/* JWT */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-400/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Authentication</h4>
                <div className="text-lg font-display font-bold text-white mt-1">JWT Tokens</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Enforces session integrity, cryptographically encrypting user credentials and verifying permissions.
                </p>
              </div>
            </div>
          </div>

          {/* Development Tools Row */}
          <div className="mt-8 flex justify-center gap-4 flex-wrap text-white/40 text-[9px] font-mono">
            <span>DEVELOPMENT ENVIRONMENT TOOLS:</span>
            <span className="text-white/60">VS Code</span>
            <span>•</span>
            <span className="text-white/60">Git Control</span>
            <span>•</span>
            <span className="text-white/60">GitHub Remote</span>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= CHALLENGES, CONTRIBUTIONS, FUTURE ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Challenges Faced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/25 transition-all group"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold mb-4">
                <AlertTriangle size={16} />
                <h3 className="text-sm font-display uppercase tracking-wider">Challenges Faced</h3>
              </div>
              <ul className="flex flex-col gap-4 font-mono text-xs text-white/70">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Designing role-based authentication:</strong> Restricting router and API endpoints correctly based on tokens and JWT payloads.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Managing complaint workflow:</strong> Handling transitions between logged, assigned, and completed orders asynchronously.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Database schema design:</strong> Formulating flexible schemas in MongoDB to accommodate custom technician skills and student logs.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>State management:</strong> Syncing states across multiple simulated logins on responsive viewport terminals.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>API integration:</strong> Establishing robust API connection interfaces between client panels and server actions.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Responsive UI development:</strong> Guaranteeing operational fidelity across desktop dashboards and worker smartphones.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* My Contributions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-primary/25 transition-all group"
            >
              <div className="flex items-center gap-2 text-primary font-bold mb-4">
                <Award size={16} />
                <h3 className="text-sm font-display uppercase tracking-wider">My Contributions</h3>
              </div>
              <ul className="flex flex-col gap-4 font-mono text-xs text-white/70">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Designed complete frontend interface:</strong> Designed the complete layout, responsive panels, status boards, and interactive UI dashboards.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Developed backend APIs:</strong> Developed complete REST controllers, routing arrays, error middlewares, and database triggers.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Created MongoDB database:</strong> Structured the MongoDB collections, references arrays, and query filters.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Implemented authentication:</strong> Implemented cryptographed user registrations and role validation gates.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Built complaint workflow:</strong> Assembled state-switching systems handling requests validation, worker dispatches, and confirmation scopes.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <div>
                    <strong>Tested complete application:</strong> Validated systems integrity, security credentials, database queries, and dashboard responsive alignments.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Future Enhancements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-secondary/25 transition-all group"
            >
              <div className="flex items-center gap-2 text-secondary font-bold mb-4">
                <Zap size={16} />
                <h3 className="text-sm font-display uppercase tracking-wider">Future Enhancements</h3>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/70">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>AI-based complaint prioritization</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">COMING SOON</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Email notifications</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>SMS alerts</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Chatbot support</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>QR Code complaint registration</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">DESIGNING</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Analytics Dashboard</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Mobile Application (iOS/Android)</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">DRAFT</span>
                </li>
              </ul>
            </motion.div>

          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= OUTCOME & FINAL CTA ================= */}
        <section className="py-16 pb-24 px-6 md:px-16 max-w-4xl mx-auto text-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-panel-glow p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-4">
              Project Outcome
            </h3>
            
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-mono">
              Successfully developed a scalable MERN stack application capable of streamlining hostel maintenance operations while improving transparency, efficiency, and user experience. Tested across simulated student batches and worker assignments to guarantee structural resilience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://github.com/Siva1286"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all transform hover:-translate-y-0.5"
              >
                <Github size={14} /> View on GitHub
              </a>
              
              <a
                href="https://github.com/Siva1286"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
              >
                <ExternalLink size={14} /> Live Demo
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-all transform hover:-translate-y-0.5"
              >
                Back to Projects
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
