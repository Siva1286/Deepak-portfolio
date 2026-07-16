'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, BookOpen, GraduationCap, MapPin, Milestone, Calendar, Code2, Cpu, Sparkles } from 'lucide-react';

interface JourneyStep {
  year: string;
  phase: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  borderClass: string;
  glowClass: string;
}

export default function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Core Coursework Highlights
  const courses = [
    'Probability & Statistics',
    'Data Warehousing & Mining',
    'Design & Analysis of Algorithms',
    'Machine Learning Models',
    'Database Management (DBMS)',
    'Object-Oriented Programming (Java)',
  ];

  // College Life Journey steps
  const journeySteps: JourneyStep[] = [
    {
      year: '2023',
      phase: 'Year 01',
      title: 'Joining the College',
      description: 'Enrolled in B.Tech Artificial Intelligence and Data Science at Nandha Engineering College. Established fundamentals in computational math and programming environments.',
      icon: <GraduationCap size={16} className="text-primary" />,
      borderClass: 'hover:border-primary/40',
      glowClass: 'group-hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]'
    },
    {
      year: '2024',
      phase: 'Year 02',
      title: 'Learning the Basics',
      description: 'Mastered core programming in Python and Java. Explored critical engineering structures like Object-Oriented Analysis, Data Structures, and basic database tools.',
      icon: <Code2 size={16} className="text-secondary" />,
      borderClass: 'hover:border-secondary/40',
      glowClass: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.06)]'
    },
    {
      year: '2025 - 2026',
      phase: 'Year 03',
      title: 'Projects & LeetCode',
      description: 'Engineered complex systems (DORMFIX, Speech-to-Text, M-Sand QA). Solved 250+ programming problems on platforms like LeetCode and completed a Data Analytics Internship.',
      icon: <Cpu size={16} className="text-accent" />,
      borderClass: 'hover:border-accent/40',
      glowClass: 'group-hover:shadow-[0_0_20px_rgba(56,189,248,0.06)]'
    },
    {
      year: '2026 - 2027',
      phase: 'Year 04 (Final)',
      title: 'Real World Solutions',
      description: 'Building and scaling production-level web apps and analytical machine learning solutions. Bridging academic theories with industry requirements.',
      icon: <Sparkles size={16} className="text-primary" />,
      borderClass: 'hover:border-primary/40',
      glowClass: 'group-hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]'
    }
  ];

  return (
    <section 
      id="education" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Decorative gradient spot */}
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
          >
            [ 05 // ACADEMICS_&_PATH ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Education & Journey<span className="text-accent">.</span>
          </motion.h2>
        </div>

        {/* 1. Academic Credentials Dossier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.04)] transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 grid-overlay opacity-[0.07] pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between gap-8 relative z-10">
            {/* Left Column: Institute info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                  <GraduationCap size={24} className="text-accent" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-display font-black text-white">
                  Nandha Engineering College
                </h3>
                
                <p className="text-sm font-mono text-white/50 mt-1 uppercase flex items-center gap-1.5">
                  <MapPin size={12} className="text-secondary" /> Erode, Tamil Nadu
                </p>

                <p className="text-base font-display font-bold text-gradient-primary mt-4">
                  B.Tech Artificial Intelligence and Data Science
                </p>
              </div>

              {/* Graduation Progress Timeline */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-white/40">EXPECTED GRADUATION:</span>
                  <span className="text-accent font-bold">2027</span>
                </div>
                {/* Horizontal Progress Bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-secondary rounded-full w-[50%]" />
                </div>
                <div className="flex justify-between text-[9px] font-mono text-white/30 mt-1">
                  <span>START (2023)</span>
                  <span>CURRENT (YEAR 3)</span>
                  <span>END (2027)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Curriculum & Coursework */}
            <div className="flex-1 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-primary" />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                    Core Coursework
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <div 
                      key={course}
                      className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/70 font-sans flex items-center gap-2 hover:bg-white/10 transition-colors"
                    >
                      <Milestone size={10} className="text-primary" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 lg:mt-0 flex gap-2 items-center text-[10px] font-mono text-white/35">
                <Award size={12} className="text-secondary" />
                <span>AFFILIATED TO ANNA UNIVERSITY // AICTE APPROVED</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. My College Journey Sub-section */}
        <div className="mt-20">
          <div className="mb-10 text-center lg:text-left">
            <span className="text-xs font-mono text-secondary tracking-widest uppercase mb-1 block">
              [ STAGES_OF_GROWTH ]
            </span>
            <h3 className="text-xl md:text-3xl font-display font-black text-white">
              My College Journey Timeline<span className="text-secondary">.</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeySteps.map((step, idx) => (
              <motion.div
                key={step.phase}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 20, stiffness: 100, delay: idx * 0.1 }}
                className={`glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-accent/30 group transition-all duration-300 select-none ${step.borderClass} ${step.glowClass}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-white/5 border border-white/5 text-white/40 uppercase tracking-widest">
                      {step.phase}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>

                  <h4 className="text-sm font-mono text-accent font-bold tracking-wide flex items-center gap-1">
                    <Calendar size={12} /> {step.year}
                  </h4>
                  
                  <h5 className="text-base font-display font-bold text-white mt-1 group-hover:text-primary transition-colors">
                    {step.title}
                  </h5>

                  <p className="text-white/60 text-xs leading-relaxed font-sans mt-3">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5 text-[8px] font-mono text-white/20">
                  STAGE_{idx + 1} // COMMITTED
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
