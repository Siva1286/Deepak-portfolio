'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Briefcase, Code2, Database, MapPin } from 'lucide-react';

// Counter component for animated statistics
function StatCounter({ target, suffix = '', duration = 1.5 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    const totalFrames = Math.round(duration * 60);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const currentVal = Math.round(end * (progress * (2 - progress)));
      setCount(currentVal);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-5xl font-display font-bold text-gradient-primary">
      {count}
      {suffix}
    </div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', damping: 20, stiffness: 100 } 
    },
  };

  return (
    <section 
      id="about" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Background radial spotlight */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
          >
            [ 01 // IDENTITY ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            About Me<span className="text-secondary">.</span>
          </motion.h2>
        </div>

        {/* Dashboard Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          {/* Left: Graphic Holographic tech-orb Profile card (col 5) */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col justify-between glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group shadow-glass"
          >
            {/* Holographic scanner line animation */}
            <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent top-0 animate-[scan-line_4s_linear_infinite]" />
            <style jsx global>{`
              @keyframes scan-line {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>

            <div className="flex flex-col items-center py-6">
              {/* Profile Hologram Visualizer */}
              <div className="relative w-48 h-48 rounded-full flex items-center justify-center mb-6">
                {/* Outer spin ring */}
                <div className="absolute inset-0 rounded-full border border-dashed border-primary/30 animate-[spin_30s_linear_infinite]" />
                {/* Secondary reverse spin ring */}
                <div className="absolute inset-2 rounded-full border border-dashed border-secondary/40 animate-[spin_20s_linear_infinite_reverse]" />
                {/* Third ring */}
                <div className="absolute inset-6 rounded-full border border-accent/20 animate-pulse" />
                
                {/* Central glowing core orb */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/30 to-secondary/30 flex flex-col items-center justify-center border border-white/15 shadow-neon-cyan relative overflow-hidden backdrop-blur-sm">
                  <Database size={36} className="text-primary animate-bounce mb-1" />
                  <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">DATA_CORE</span>
                </div>
              </div>

              {/* Bio Details */}
              <h3 className="text-xl font-display font-bold text-white text-center">Deepak P</h3>
              <p className="text-xs font-mono text-accent mt-1 text-center">AI & DATA SCIENCE SPECIALIST</p>
              
              <div className="flex items-center gap-2 text-white/55 text-xs font-mono mt-4 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <MapPin size={12} className="text-secondary" />
                Erode, Tamil Nadu
              </div>
            </div>

            {/* Bottom Tech Signoff */}
            <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center text-[10px] font-mono text-white/40">
              <span>STATUS: COMPILED_SUCCESS</span>
              <span>VER: 2026.07</span>
            </div>
          </motion.div>

          {/* Right: Bio Details & Achievements Stats (col 7) */}
          <div className="lg:col-span-7 flex flex-col gap-8 justify-between">
            {/* Bio Card */}
            <motion.div 
              variants={itemVariants}
              className="glass-panel p-8 rounded-3xl border border-white/10 shadow-glass flex flex-col gap-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Code2 size={16} className="text-primary" />
                </div>
                <h4 className="text-base md:text-lg font-display font-semibold text-white">Turning Data into Decisions</h4>
              </div>

              <p className="text-white/70 text-sm leading-relaxed font-sans">
                I am a B.Tech Artificial Intelligence and Data Science student passionate about Data Analytics, Machine Learning, and Full Stack Development. I enjoy solving real-world problems using Python, AI, and modern web technologies. My goal is to become a Data Analyst who transforms complex data into meaningful business insights while continuously learning and building impactful products.
              </p>

              <p className="text-white/70 text-sm leading-relaxed font-sans">
                I enjoy building software solutions that simplify everyday problems. My interests include Python programming, Machine Learning, Data Visualization, and Full Stack Web Development. I continuously improve my skills through internships, projects, and competitive coding.
              </p>
            </motion.div>

            {/* Statistics Counters */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Stat 1 */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative group hover:border-primary/30 transition-all duration-300">
                <StatCounter target={12} suffix="+" />
                <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mt-2">
                  Projects Done
                </div>
              </div>

              {/* Stat 2 */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative group hover:border-secondary/30 transition-all duration-300">
                <StatCounter target={1} />
                <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mt-2">
                  Internships
                </div>
              </div>

              {/* Stat 3 */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative group hover:border-accent/30 transition-all duration-300">
                <StatCounter target={5} suffix="+" />
                <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mt-2">
                  Certifications
                </div>
              </div>

              {/* Stat 4 */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center relative group hover:border-primary/30 transition-all duration-300">
                <StatCounter target={250} suffix="+" />
                <div className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-wider mt-2">
                  LeetCode Solved
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
