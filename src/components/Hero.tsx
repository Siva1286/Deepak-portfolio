'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import HeroCanvas from './HeroCanvas';

const roles = ['Python Developer', 'Data Analyst', 'AI Enthusiast', 'Full Stack Learner'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [subText, setSubText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Typist effect loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentFullText = roles[roleIndex];

    const handleType = () => {
      if (!isDeleting) {
        // Typing characters
        setSubText(currentFullText.substring(0, subText.length + 1));
        setTypingSpeed(100);

        if (subText === currentFullText) {
          // Pause at complete text
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        // Deleting characters
        setSubText(currentFullText.substring(0, subText.length - 1));
        setTypingSpeed(50);

        if (subText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
          return;
        }
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [subText, isDeleting, roleIndex, typingSpeed]);

  // Track mouse coordinates for background lighting spotlight
  useEffect(() => {
    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePos);
    return () => window.removeEventListener('mousemove', updateMousePos);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -80 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Text Reveal animations
  const titleContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const titleItem = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', damping: 15, stiffness: 100 } 
    },
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
    >
      {/* 3D WebGL Background Canvas */}
      <HeroCanvas />

      {/* Mouse Spot Light overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen hidden md:block"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.15), transparent 85%)`
        }}
      />

      {/* Subtle grid line overlay */}
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Subtitle pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono tracking-widest uppercase flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
          AVAILABLE FOR HIRE / COLLABORATION
        </motion.div>

        {/* Big Header Texts */}
        <motion.div 
          variants={titleContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 md:gap-4 select-none"
        >
          <motion.h3 
            variants={titleItem}
            className="text-white/60 font-mono text-base md:text-xl tracking-wider"
          >
            Hello, I&apos;m
          </motion.h3>

          <motion.h1 
            variants={titleItem}
            className="text-5xl md:text-8xl font-display font-black tracking-tight text-white"
          >
            Deepak P<span className="text-primary">.</span>
          </motion.h1>

          <motion.h2 
            variants={titleItem}
            className="text-2xl md:text-4xl font-poppins font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary"
          >
            AI & Data Science Student
          </motion.h2>

          <motion.h3
            variants={titleItem}
            className="text-white/60 font-mono text-sm md:text-lg tracking-wide uppercase mt-1"
          >
            Aspiring Data Analyst
          </motion.h3>
        </motion.div>

        {/* Dynamic Typing Subheading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-6 font-mono text-lg md:text-2xl h-10 flex items-center justify-center text-accent"
        >
          <span>&gt;&nbsp;</span>
          <span className="typing-cursor text-white font-bold">{subText}</span>
        </motion.div>

        {/* Short Headline Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-6 text-white/50 text-sm md:text-base max-w-xl leading-relaxed font-sans"
        >
          Turning Data into Decisions. Building Intelligent Solutions.<br />
          Bridging the gap between statistical analytics and cognitive AI.
        </motion.p>

        {/* Action Button Triggers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
        >
          {/* View Projects */}
          <button
            onClick={(e) => handleScrollTo(e, 'projects')}
            className="group relative px-8 py-3.5 w-full sm:w-auto rounded-full bg-gradient-to-r from-primary to-secondary text-background font-bold font-display text-sm tracking-wider flex items-center justify-center gap-2 overflow-hidden shadow-glass transition-all hover:shadow-neon-cyan duration-300 transform hover:-translate-y-0.5"
          >
            <span>View Projects</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          {/* Download Resume */}
          <a
            href="/resume.pdf"
            download
            className="group px-8 py-3.5 w-full sm:w-auto rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-bold font-display text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>Download Resume</span>
            <Download size={16} className="group-hover:translate-y-0.5 transition-transform duration-300" />
          </a>
        </motion.div>

        {/* Bottom scroll down indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 2.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer select-none"
          onClick={(e) => {
            const about = document.getElementById('about');
            if (about && (window as any).lenis) (window as any).lenis.scrollTo(about, { offset: -80 });
          }}
        >
          <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">SCROLL DOWN</span>
          <div className="w-5 h-9 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
