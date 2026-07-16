'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, Github, Monitor, Filter, Settings, ShieldAlert, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import DormfixDetail from './DormfixDetail';
import MSandDetail from './MSandDetail';
import SpeechToTextDetail from './SpeechToTextDetail';

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  category: 'web' | 'ai' | 'data';
  features: string[];
  featured: boolean;
  github?: string;
  demo?: string;
}

const projectsData: Project[] = [
  {
    id: 'dormfix',
    title: 'DORMFIX',
    subtitle: 'Smart Hostel Maintenance Workflow Management System',
    description: 'Developed a full-stack MERN application that streamlines hostel maintenance requests through complaint tracking, automated assignment, administrative dashboards, and real-time status updates.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    category: 'web',
    features: ['Complaint Tracking', 'Role-based Login', 'Admin Dashboard', 'Real-time Updates', 'Responsive Design'],
    featured: true,
    github: 'https://github.com/Siva1286',
    demo: '#',
  },
  {
    id: 'm-sand-qa',
    title: 'M-sand Quality Assurance System',
    subtitle: 'IoT-Enabled Quality Verification & Analytical Model',
    description: 'Developed an automated IoT system for Manufactured Sand quality inspection. Implemented sensors to measure density, moisture, and fine particle purity, reporting real-time results via analytical pipelines. Awarded 2nd Prize at Excel College of Engineering.',
    technologies: ['IoT Sensors', 'Python', 'Arduino', 'Raspberry Pi', 'Data Analytics'],
    category: 'ai',
    features: ['IoT Sensor Interfacing', 'Purity Assessment Logic', 'Real-time Data Logs', 'Winner: 2nd Prize (Ideathon)'],
    featured: false,
    github: 'https://github.com/Siva1286',
  },
  {
    id: 'speech-to-text',
    title: 'Speech to Text Web App',
    subtitle: 'High-Precision Multilingual Transcription System',
    description: 'Built a web application that records audio inputs and transcribes them into editable text format in real-time. Features translation modules and speech pacing analysis. Awarded 2nd Prize at Nandha College of Engineering.',
    technologies: ['React', 'Node.js', 'Express', 'Web Speech API', 'Hugging Face'],
    category: 'web',
    features: ['Real-time Audio Stream', 'Acoustic Processing', 'Text Export Formats', 'Winner: 2nd Prize (Expo)'],
    featured: false,
    github: 'https://github.com/Siva1286',
  },
  {
    id: 'churn-analytics',
    title: 'Customer Churn Predictor',
    subtitle: 'ML-Powered Retention Analytics Pipeline',
    description: 'Designed a machine learning workflow that analyzes customer behaviors, extracts SQL datasets, and predicts business churn metrics with 89% precision using Python and Scikit-learn.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'PostgreSQL', 'Seaborn'],
    category: 'ai',
    features: ['Predictive Modeling', 'Feature Engineering', 'Automated SQL ETL', 'Correlation Matrix'],
    featured: false,
    github: 'https://github.com/Siva1286',
  },
  {
    id: 'insight-dashboard',
    title: 'InsightVision Analytics',
    subtitle: 'Interactive Tableau Business Intelligence Platform',
    description: 'Built a multi-layered Tableau dashboard mapping corporate revenue streams, region performance metrics, and operations bottlenecks linked directly to a live PostgreSQL store.',
    technologies: ['Tableau', 'SQL', 'Python', 'MS Excel'],
    category: 'data',
    features: ['Interactive Filters', 'Direct SQL Triggers', 'Trend Forecasting', 'Operations Mapping'],
    featured: false,
    github: 'https://github.com/Siva1286',
  }
];

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'web' | 'ai' | 'data'>('all');
  const [showDormfixDetail, setShowDormfixDetail] = useState(false);
  const [showMSandDetail, setShowMSandDetail] = useState(false);
  const [showSpeechToTextDetail, setShowSpeechToTextDetail] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const filteredProjects = projectsData.filter(project => {
    if (filter === 'all') return true;
    return project.category === filter;
  });

  return (
    <section 
      id="projects" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Background blobs */}
      <div className="absolute top-[20%] left-[5%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
            >
              [ 03 // PORTFOLIO_SAMPLES ]
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-5xl font-display font-black text-white"
            >
              Featured Works<span className="text-accent">.</span>
            </motion.h2>
          </div>

          {/* Filters controls */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/5 border border-white/10"
          >
            {(['all', 'web', 'ai', 'data'] as const).map((category) => {
              const labelMap = { all: 'All', web: 'Web Dev', ai: 'AI / ML', data: 'Data Analytics' };
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                    isActive 
                      ? 'bg-primary text-background font-bold shadow-neon-cyan' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {labelMap[category]}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Projects Render Arena */}
        <div className="flex flex-col gap-16">
          {/* 1. FEATURED PROJECT (DORMFIX Showcase) */}
          <AnimatePresence mode="wait">
            {(filter === 'all' || filter === 'web') && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6 }}
                onClick={() => setShowDormfixDetail(true)}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer p-6 md:p-8 rounded-3xl border border-white/5 hover:border-primary/30 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
              >
                {/* Info Column (col 5) */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary uppercase tracking-widest">
                      Featured Project
                    </span>
                    <span className="text-[9px] font-mono text-primary/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 translate-x-2 group-hover:translate-x-0">
                      Explore Case Study <ArrowRight size={10} />
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-display font-black text-white tracking-wide group-hover:text-primary transition-colors">
                      {projectsData[0].title}
                    </h3>
                    <p className="text-xs font-mono text-accent uppercase tracking-wider mt-1">
                      {projectsData[0].subtitle}
                    </p>
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed font-sans">
                    {projectsData[0].description}
                  </p>

                  {/* Features Bullet List */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-white/60">
                    {projectsData[0].features.map((feat) => (
                      <div key={feat} className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-primary" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {projectsData[0].technologies.map((tech) => (
                      <span 
                        key={tech} 
                        className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/5 border border-white/5 text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-4 pt-3">
                    <a
                      href={projectsData[0].github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all transform hover:-translate-y-0.5"
                    >
                      <Github size={14} /> Github
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDormfixDetail(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
                    >
                      <ExternalLink size={14} /> View Case Study
                    </button>
                  </div>
                </div>

                {/* Laptop Mockup Column (col 7) */}
                <div className="lg:col-span-7 flex justify-center py-6 select-none">
                  {/* Laptop Mockup Wrapper */}
                  <div className="relative w-full max-w-[550px] aspect-[16/10] flex flex-col items-center">
                    {/* Screen Outer Bezel */}
                    <div className="w-[90%] aspect-[16/10] bg-[#1E293B] rounded-2xl p-3 border-2 border-white/10 shadow-[0_20px_50px_rgba(0,229,255,0.06)] relative overflow-hidden flex flex-col">
                      
                      {/* Screen Notch/Camera */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3.5 bg-black rounded-b-lg flex items-center justify-center gap-1 z-20">
                        <div className="w-1 h-1 rounded-full bg-blue-500/80" />
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                      </div>

                      {/* Screen Content Arena (DORMFIX dashboard simulation) */}
                      <div className="flex-1 bg-[#0A0D14] rounded-lg border border-white/5 overflow-hidden flex flex-col font-mono text-[9px] relative group-hover:scale-[1.01] transition-transform duration-300">
                        {/* Mock App Header */}
                        <div className="bg-[#101524] px-3 py-2 border-b border-white/5 flex items-center justify-between text-white/50">
                          <div className="flex items-center gap-1.5">
                            <Settings size={9} className="animate-spin text-primary" />
                            <span className="font-bold text-white tracking-wider">DORMFIX // SYSTEM_PORTAL</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[7px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-0.5">
                              <ShieldAlert size={8} /> Admin Mode
                            </span>
                          </div>
                        </div>

                        {/* Mock App Body */}
                        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto max-h-[190px] scrollbar-thin">
                          {/* Stats Grid */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/5 p-1.5 rounded border border-white/5">
                              <div className="text-white/40 text-[7px] uppercase">Pending Logs</div>
                              <div className="text-lg font-bold text-gradient-primary">04</div>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded border border-white/5">
                              <div className="text-white/40 text-[7px] uppercase">Assigned</div>
                              <div className="text-lg font-bold text-gradient-secondary">08</div>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded border border-white/5">
                              <div className="text-white/40 text-[7px] uppercase">Completed</div>
                              <div className="text-lg font-bold text-emerald-400">42</div>
                            </div>
                          </div>

                          {/* Complaints List Container */}
                          <div className="flex flex-col gap-1.5">
                            <div className="text-white/40 text-[7px] uppercase flex justify-between">
                              <span>Active Work Order Streams</span>
                              <span className="text-primary flex items-center gap-0.5"><RefreshCw size={8} className="animate-spin" /> Auto Syncing</span>
                            </div>

                            {/* Complaint 1 */}
                            <div className="bg-white/5 p-2 rounded border-l-2 border-primary flex justify-between items-center">
                              <div>
                                <div className="text-white font-bold">Room 304 - Electrical Shortage</div>
                                <div className="text-[8px] text-white/40">Registered by: user_student_04</div>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-bold">IN_PROGRESS</span>
                            </div>

                            {/* Complaint 2 */}
                            <div className="bg-white/5 p-2 rounded border-l-2 border-amber-500 flex justify-between items-center">
                              <div>
                                <div className="text-white font-bold">Block B - Water Leakage</div>
                                <div className="text-[8px] text-white/40">Registered by: user_student_12</div>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-bold">PENDING_REVIEW</span>
                            </div>

                            {/* Complaint 3 */}
                            <div className="bg-white/5 p-2 rounded border-l-2 border-emerald-500 flex justify-between items-center opacity-70">
                              <div>
                                <div className="text-white font-bold">Room 102 - Door Lock Damaged</div>
                                <div className="text-[8px] text-white/40">Solved in: 1.5 hours</div>
                              </div>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">COMPLETED</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Laptop Bottom Bezel/Platform */}
                    <div className="w-[100%] h-3 bg-[#334155] rounded-b-xl border-t border-white/20 relative shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
                      {/* Keyboard Lid groove indent */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-black/40 rounded-b-md" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 2. SECONDARY PROJECTS GRID */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => {
                // Skip rendering the featured project here to avoid duplication
                if (project.id === 'dormfix') return null;

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => {
                      if (project.id === 'm-sand-qa') {
                        setShowMSandDetail(true);
                      } else if (project.id === 'speech-to-text') {
                        setShowSpeechToTextDetail(true);
                      }
                    }}
                    className={`glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between transition-all duration-300 ${
                      project.id === 'm-sand-qa' || project.id === 'speech-to-text'
                        ? 'cursor-pointer hover:border-primary/40 hover:bg-white/[0.015] hover:shadow-neon-cyan/5 group' 
                        : 'hover:border-accent/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded text-[8px] font-mono bg-white/5 border border-white/5 text-white/50 uppercase tracking-widest">
                            {project.category === 'ai' ? 'AI / ML' : project.category === 'web' ? 'Web Dev' : 'Data Science'}
                          </span>
                          {(project.id === 'm-sand-qa' || project.id === 'speech-to-text') && (
                            <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-primary/10 border border-primary/20 text-primary uppercase tracking-widest animate-pulse">
                              Interactive Case Study
                            </span>
                          )}
                        </div>
                        
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white/40 hover:text-accent transition-colors"
                          aria-label="GitHub Repo"
                        >
                          <Github size={16} />
                        </a>
                      </div>

                      <h3 className="text-xl font-display font-bold text-white group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-wide mt-0.5">
                        {project.subtitle}
                      </p>

                      <p className="text-white/60 text-xs leading-relaxed font-sans mt-4">
                        {project.description}
                      </p>

                      {/* Bullet Features */}
                      <ul className="mt-4 flex flex-col gap-1 text-[10px] font-mono text-white/50">
                        {project.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-accent rounded-full" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <span 
                          key={t}
                          className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 text-white/60 border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* DORMFIX case study modal */}
      <AnimatePresence>
        {showDormfixDetail && (
          <DormfixDetail onClose={() => setShowDormfixDetail(false)} />
        )}
      </AnimatePresence>

      {/* M-SAND QA case study modal */}
      <AnimatePresence>
        {showMSandDetail && (
          <MSandDetail onClose={() => setShowMSandDetail(false)} />
        )}
      </AnimatePresence>

      {/* Speech-to-Text case study modal */}
      <AnimatePresence>
        {showSpeechToTextDetail && (
          <SpeechToTextDetail onClose={() => setShowSpeechToTextDetail(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
