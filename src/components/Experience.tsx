'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Briefcase, Building } from 'lucide-react';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'Data Analytics Intern',
    company: 'SAN Technovation',
    duration: 'December 2024 - January 2025',
    description: 'Worked on data analytics concepts, Python programming, and practical business data analysis techniques to translate raw inputs into digestible insights.',
    achievements: [
      'Gained hands-on experience utilizing Python libraries (Pandas, NumPy) for raw data preprocessing.',
      'Studied business case problems to map statistical indicators onto management KPIs.',
      'Developed data visualization scripts to present analytics findings to executive teams.'
    ]
  }
];

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section 
      id="experience" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Decorative gradient light */}
      <div className="absolute top-[30%] left-[5%] w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-4xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
          >
            [ 04 // CAREER_TRACK ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Professional Experience<span className="text-secondary">.</span>
          </motion.h2>
        </div>

        {/* Vertical Timeline Tree */}
        <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 flex flex-col gap-12">
          {experiences.map((exp, index) => (
            <motion.div 
              key={exp.company}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: index * 0.1 }}
              className="relative pl-8 md:pl-10 group"
            >
              {/* Pulsing Timeline Node */}
              <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-[#0B0F19] border-2 border-primary group-hover:scale-125 transition-transform duration-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
              </div>

              {/* Experience Card */}
              <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/10 hover:border-primary/30 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.04)] transition-all duration-300">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                      <Briefcase size={18} className="text-primary" /> {exp.role}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-accent mt-1 uppercase">
                      <Building size={12} /> {exp.company}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono text-white/50">
                    <Calendar size={12} className="text-secondary" />
                    {exp.duration}
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-6 font-sans">
                  {exp.description}
                </p>

                {/* Achievements Bullet Points */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">KEY ACCOMPLISHMENTS //</span>
                  <ul className="flex flex-col gap-2">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx} className="flex items-start gap-2.5 text-xs text-white/60 font-sans leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
