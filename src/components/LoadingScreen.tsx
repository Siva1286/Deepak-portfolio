'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const loadingTexts = [
  'SYSTEM.INITIALIZE()',
  'DATA_PIPELINE.CONNECTING...',
  'ANALYTICS_MODEL.TRAINING...',
  'ACCURACY_CHECK: 99.78% (SUCCESS)',
  'AI_AGENT.DEEP_LEARNING.LOADED()',
  'DEEPAK_P.PORTFOLIO.COMPILING()',
  'READY_TO_LAUNCH()'
];

export default function LoadingScreen({ finishLoading }: { finishLoading: () => void }) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Disable body scroll during loading
    document.body.style.overflow = 'hidden';

    // Fast loading progress timer
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 8) + 2;
        return Math.min(100, prev + diff);
      });
    }, 60);

    // Text cycler
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 320);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        document.body.style.overflow = '';
        finishLoading();
      }, 700); // Delay at 100% for smooth user pacing
      return () => clearTimeout(delay);
    }
  }, [progress, finishLoading]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#0B0F19] z-[99999] flex flex-col justify-between p-8 md:p-16 font-display select-none"
      initial={{ opacity: 1 }}
      exit={{ 
        y: '-100%', 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-primary font-bold text-sm md:text-base tracking-wider font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          DEEPAK_P_OS v2.6.0
        </div>
        <div className="text-white/40 text-xs font-mono">
          [ SYS_STATUS: INITIALIZING ]
        </div>
      </div>

      {/* Center Typing / Status Text */}
      <div className="my-auto max-w-xl font-mono">
        <motion.div
          key={textIndex}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-3xl font-bold text-white tracking-wide leading-relaxed min-h-[60px]"
        >
          &gt; <span className="text-gradient-primary">{loadingTexts[textIndex]}</span>
          <span className="typing-cursor"></span>
        </motion.div>
        <div className="text-white/40 text-[10px] md:text-xs mt-3 tracking-widest uppercase">
          establishing secure visualization layer via webgl & canvas pipelines
        </div>
      </div>

      {/* Bottom Progress Counter */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end font-mono">
          <span className="text-white/40 text-xs tracking-wider">COMPILING ASSETS</span>
          <span className="text-primary text-5xl md:text-7xl font-bold font-display leading-none">
            {progress}%
          </span>
        </div>
        
        {/* Loading Progress Bar */}
        <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
