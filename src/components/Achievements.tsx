'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Trophy, Terminal, ArrowUpRight } from 'lucide-react';

interface Achievement {
  title: string;
  category: string;
  host: string;
  description: string;
  icon: React.ReactNode;
  borderClass: string;
}

const achievements: Achievement[] = [
  {
    title: '2nd Prize Winner',
    category: 'M-sand Quality Assurance System with IoT',
    host: 'Excel College of Engineering',
    description: 'Secured the runner-up position in a major college event for designing and demonstrating an IoT-enabled system for M-Sand density & purity quality checks.',
    icon: <Trophy className="text-primary" size={20} />,
    borderClass: 'hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]'
  },
  {
    title: '2nd Prize Winner',
    category: 'Speech to Text Web Application',
    host: 'Nandha College of Engineering',
    description: 'Awarded 2nd Prize for building a high-precision, web-native multilingual transcription and translation platform running on smart speech API models.',
    icon: <Trophy className="text-accent" size={20} />,
    borderClass: 'hover:border-accent/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.06)]'
  }
];

export default function Achievements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <section 
      id="achievements" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Decorative background radial spotlight */}
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

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
            [ 06 // MILESTONES ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Key Achievements<span className="text-secondary">.</span>
          </motion.h2>
        </div>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {achievements.map((ach) => (
            <motion.div
              key={ach.title}
              variants={cardVariants}
              className={`glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 group select-none ${ach.borderClass}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {ach.icon}
                  </div>
                  
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-white/5 border border-white/5 text-white/40 uppercase tracking-widest">
                    Verified Award //
                  </span>
                </div>

                {/* Info */}
                <h3 className="text-xl md:text-2xl font-display font-black text-white group-hover:text-primary transition-colors">
                  {ach.title}
                </h3>
                
                <p className="text-xs font-mono text-accent uppercase tracking-wider mt-0.5">
                  {ach.category}
                </p>

                <p className="text-white/60 text-sm leading-relaxed font-sans mt-5">
                  {ach.description}
                </p>
              </div>

              {/* Footer details */}
              <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/50">
                <span className="flex items-center gap-1">
                  <Award size={14} className="text-secondary" />
                  {ach.host}
                </span>
                
                <span className="opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-300 flex items-center gap-0.5">
                  View <ArrowUpRight size={12} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
