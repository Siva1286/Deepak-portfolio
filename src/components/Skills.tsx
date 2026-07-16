'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Code, Database, Layout, Terminal } from 'lucide-react';

interface Skill {
  name: string;
  level: number; // percentage
  status?: string; // learning, advanced, etc.
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  colorClass: string; // cyan, purple, accent
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Programming',
    icon: <Code className="text-primary" size={20} />,
    colorClass: 'group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'Java', level: 80 },
    ],
  },
  {
    title: 'Data Analytics',
    icon: <Database className="text-secondary" size={20} />,
    colorClass: 'group-hover:border-secondary/40 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
    skills: [
      { name: 'SQL', level: 85 },
      { name: 'Pandas', level: 90 },
      { name: 'NumPy', level: 85 },
      { name: 'Tableau', level: 75 },
    ],
  },
  {
    title: 'Machine Learning',
    icon: <Brain className="text-accent" size={20} />,
    colorClass: 'group-hover:border-accent/40 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.08)]',
    skills: [
      { name: 'Scikit-learn', level: 80 },
      { name: 'TensorFlow', level: 50, status: 'Learning' },
    ],
  },
  {
    title: 'Web Development',
    icon: <Layout className="text-primary" size={20} />,
    colorClass: 'group-hover:border-primary/40 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.08)]',
    skills: [
      { name: 'React (Next.js)', level: 85 },
      { name: 'Node.js', level: 75 },
      { name: 'Express.js', level: 75 },
      { name: 'MongoDB', level: 80 },
    ],
  },
  {
    title: 'Tools & Utilities',
    icon: <Terminal className="text-secondary" size={20} />,
    colorClass: 'group-hover:border-secondary/40 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
    skills: [
      { name: 'Git & GitHub', level: 85 },
      { name: 'VS Code', level: 90 },
      { name: 'Figma', level: 70 },
    ],
  },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', damping: 20, stiffness: 100 } 
    },
  };

  return (
    <section 
      id="skills" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Grid overlay background */}
      <div className="absolute inset-0 grid-overlay opacity-15 pointer-events-none" />

      {/* Decorative gradient spot */}
      <div className="absolute top-[30%] right-[5%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

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
            [ 02 // CAPABILITIES ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Technical Stack<span className="text-primary">.</span>
          </motion.h2>
        </div>

        {/* Skills Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={cardVariants}
              className={`glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between transition-all duration-500 transform hover:-translate-y-1.5 group select-none ${category.colorClass}`}
            >
              {/* Category Header */}
              <div>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-display text-white font-bold text-base md:text-lg tracking-wide">
                    {category.title}
                  </h3>
                </div>

                {/* Skills Progress list */}
                <div className="flex flex-col gap-5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="text-white/80 font-medium font-sans flex items-center gap-2">
                          {skill.name}
                          {skill.status && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-accent/20 text-accent uppercase tracking-wider">
                              {skill.status}
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-white/40">{skill.level}%</span>
                      </div>
                      
                      {/* Progress Track */}
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Decoration Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20">
                <span>INTEL_CAT //</span>
                <span>COMPILED</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
