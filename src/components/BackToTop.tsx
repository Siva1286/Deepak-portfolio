'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (totalHeight > 0) {
        setScrollPercent(scrollY / totalHeight);
      }
      
      if (scrollY > 300) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // SVG Circle stroke parameters
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollPercent * circumference;

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-primary border border-white/10 hover:border-primary/50 shadow-glass cursor-pointer transition-colors duration-300 hover:text-white group"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          {/* SVG Scroll Progress Circle */}
          <svg className="absolute -rotate-90 w-full h-full p-1" viewBox="0 0 50 50">
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="2"
              fill="transparent"
            />
            <circle
              cx="25"
              cy="25"
              r={radius}
              stroke="#00E5FF"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          
          <ArrowUp size={18} className="z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
