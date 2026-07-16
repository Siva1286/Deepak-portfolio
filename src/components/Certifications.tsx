'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Terminal, Code2, Cpu, ExternalLink } from 'lucide-react';

interface Certification {
  title: string;
  category: string;
  host: string;
  description: string;
  competencies: string[];
  icon: React.ReactNode;
  borderClass: string;
  badgeColor: string;
}

const certifications: Certification[] = [
  {
    title: 'Python Programming Certification',
    category: 'Advanced Technical Training',
    host: 'IIT Madras Research Park',
    description: 'Completed comprehensive technical workshop training at IIT Madras, mastering advanced scripting, Object-Oriented Programming (OOP) paradigms, and Python data pipelines.',
    competencies: ['Advanced Scripting', 'OOP Paradigms', 'Data Pipelines'],
    icon: <Terminal className="text-secondary" size={20} />,
    borderClass: 'hover:border-secondary/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.06)]',
    badgeColor: 'bg-secondary/10 border-secondary/20 text-secondary'
  },
  {
    title: 'C++ Programming Certification',
    category: 'Object-Oriented Design & DSA',
    host: 'Professional Coding Certificate',
    description: 'Earned professional certification in C++ programming. Developed core applications focusing on memory management, pointers, and custom implementations of data structures.',
    competencies: ['Memory Management', 'OOP in C++', 'DSA Implementations'],
    icon: <Code2 className="text-primary" size={20} />,
    borderClass: 'hover:border-primary/30 hover:shadow-[0_0_20px_rgba(0,229,255,0.06)]',
    badgeColor: 'bg-primary/10 border-primary/20 text-primary'
  },
  {
    title: 'Basics of Java Certification',
    category: 'Core OOP & Java Ecosystem',
    host: 'Software Engineering Fundamentals',
    description: 'Acquired fundamental certification in Java. Focused on exception handling, the collections framework, control flows, and basic syntax for platform-independent programming.',
    competencies: ['Exception Handling', 'Collections Framework', 'Java Syntax & Loops'],
    icon: <Cpu className="text-accent" size={20} />,
    borderClass: 'hover:border-accent/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.06)]',
    badgeColor: 'bg-accent/10 border-accent/20 text-accent'
  }
];

export default function Certifications() {
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
      id="certifications" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden border-t border-white/5"
    >
      {/* Background glowing blob */}
      <div className="absolute top-[30%] left-[10%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-6xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
          >
            [ 07 // CREDENTIALS ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Certifications<span className="text-primary">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.6 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs md:text-sm font-mono text-white mt-4 max-w-md mx-auto"
          >
            Professional credentials validating core programming architectures and language proficiencies.
          </motion.p>
        </div>

        {/* Certifications Card Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              variants={cardVariants}
              className={`glass-panel p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1.5 group select-none ${cert.borderClass}`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    {cert.icon}
                  </div>
                  
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-white/5 border border-white/5 text-white/40 uppercase tracking-widest">
                    ID: verified //
                  </span>
                </div>

                {/* Body info */}
                <h3 className="text-lg md:text-xl font-display font-black text-white group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                
                <p className="text-xs font-mono text-white/40 uppercase tracking-wide mt-1">
                  {cert.category}
                </p>

                <p className="text-white/60 text-xs leading-relaxed font-sans mt-5">
                  {cert.description}
                </p>

                {/* Competencies Tags */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {cert.competencies.map((comp) => (
                    <span 
                      key={comp}
                      className={`px-2 py-0.5 rounded text-[8px] font-mono border ${cert.badgeColor}`}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer details */}
              <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-xs font-mono text-white/50">
                <span className="flex items-center gap-1.5 text-[10px]">
                  <Award size={14} className="text-primary/70" />
                  {cert.host}
                </span>
                
                <span className="opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-300 flex items-center gap-0.5 text-[10px]">
                  Certificate <ExternalLink size={10} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
