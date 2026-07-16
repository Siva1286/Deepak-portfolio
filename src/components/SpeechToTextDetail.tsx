'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowLeft, Github, ExternalLink, Mic, Volume2, 
  CheckCircle2, AlertTriangle, Cpu, Layers, Play, Clock, 
  ArrowRight, Shield, Zap, Terminal, Check, Award, Copy, Trash2, Download
} from 'lucide-react';

interface SpeechToTextDetailProps {
  onClose: () => void;
}

export default function SpeechToTextDetail({ onClose }: SpeechToTextDetailProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prompts = [
    "Hostel room three zero four electrical fan speed regulator is malfunctioning. Please dispatch a technician.",
    "The artificial intelligence algorithms process acoustic streams in real time with high precision.",
    "Sustainable concrete compounding requires manufactured sand to be dry and clean."
  ];

  // Handle scroll lock on mount/unmount
  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.stop();
    }
    document.body.style.overflow = 'hidden';
    
    return () => {
      if ((window as any).lenis) {
        (window as any).lenis.start();
      }
      document.body.style.overflow = '';
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const totalHeight = container.scrollHeight - container.clientHeight;
      const progress = totalHeight > 0 ? (container.scrollTop / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  // Simulating Voice Recording and Transcription typing effect
  const startSimulatedDictation = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      return;
    }

    setIsListening(true);
    setTranscribedText('');
    
    const targetText = prompts[selectedPrompt];
    const words = targetText.split(' ');
    let currentWordIdx = 0;
    
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);

    typingTimerRef.current = setInterval(() => {
      if (currentWordIdx < words.length) {
        setTranscribedText(prev => {
          const space = prev ? ' ' : '';
          return prev + space + words[currentWordIdx];
        });
        currentWordIdx++;
      } else {
        setIsListening(false);
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      }
    }, 450); // Types one word every 450ms
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcribedText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "speech_transcription.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Auto pipeline flow loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingFlow) {
      interval = setInterval(() => {
        setFlowStep((prev) => (prev + 1) % 5);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlayingFlow]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const processingNodes = [
    { title: 'Mic Capture', desc: 'Captures continuous high-fidelity audio streams via browser interfaces', icon: Mic, color: 'text-primary' },
    { title: 'DSP Filtering', desc: 'Removes environmental noise and normalizes waveform frequencies', icon: Volume2, color: 'text-secondary' },
    { title: 'Acoustic Processing', desc: 'Analyzes phoneme spectral signatures against acoustic indices', icon: Cpu, color: 'text-accent' },
    { title: 'Language Model', desc: 'Assembles phoneme blocks into grammatical word structures in real time', icon: Layers, color: 'text-purple-400' },
    { title: 'Text Editor Output', desc: 'Pushes complete text to editable notepad frames with clipboard triggers', icon: Terminal, color: 'text-emerald-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 overflow-hidden bg-[#0A0D14] flex flex-col font-sans"
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-75 z-50 shadow-neon-cyan" 
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Case Study Header Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-[#0F1424]/85 backdrop-blur-xl border-b border-white/5 relative z-40">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-mono text-white/70 hover:text-primary transition-all group py-1.5"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          <span>[ BACK_TO_PROJECTS ]</span>
        </button>

        <div className="hidden md:flex flex-col items-center">
          <span className="text-sm font-display font-black tracking-widest text-white">SPEECH TO TEXT</span>
          <span className="text-[9px] font-mono text-accent uppercase tracking-wider">CASE_STUDY // AI_VOICE</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white/75 hover:bg-white/10 hover:text-white hover:border-primary/40 hover:scale-105 transition-all shadow-md"
          aria-label="Close Case Study"
        >
          <X size={16} />
        </button>
      </header>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scrollbar-thin select-text bg-[#0B0F19] grid-overlay"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        {/* ================= HERO HEADER ================= */}
        <section className="relative pt-16 pb-20 px-6 md:px-16 max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Award Spotlight Badge */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
              <Award size={14} />
              <span>🥈 2nd Prize Innovation Day (Nandha Engineering College)</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight text-white mt-4">
              Speech-to-Text<br/>Web Application<span className="text-primary">.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gradient-secondary font-display font-bold max-w-2xl mt-2 leading-normal">
              AI-Powered Voice Recognition System
            </p>

            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <span className="px-3 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/5 text-white/70">
                Artificial Intelligence
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-mono bg-primary/10 border border-primary/20 text-primary">
                Web Development
              </span>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com/Siva1286"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all transform hover:-translate-y-0.5"
              >
                <Github size={14} /> GitHub Repository
              </a>
              <a
                href="#speech-simulator"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('speech-simulator');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
              >
                <Mic size={14} /> Run Dictation Simulator
              </a>
            </div>
          </motion.div>

          {/* Floating UI Screenshot / Audio Panel Simulation */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[650px] aspect-[16/10] mt-16 relative flex flex-col items-center justify-center"
          >
            {/* Audio Panel Mockup */}
            <div className="w-[90%] aspect-[16/10] glass-panel-glow rounded-3xl p-6 border border-white/15 relative overflow-hidden flex flex-col justify-between font-mono">
              <div className="absolute inset-0 grid-overlay opacity-30 -z-10" />

              <div className="flex justify-between items-center text-[9px] text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>VOICE_ENGINE // RUNNING</span>
                </div>
                <span>BROWSER_WEB_SPEECH_API</span>
              </div>

              {/* Central Waveform Graphic */}
              <div className="flex-1 flex flex-col items-center justify-center my-6 gap-4">
                <div className="flex items-end justify-center gap-1.5 h-16 w-full px-12">
                  {[...Array(24)].map((_, i) => {
                    const animDelay = `${i * 0.05}s`;
                    const activeHeight = [12, 40, 60, 20, 48, 16, 56, 32][i % 8];
                    return (
                      <div 
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300"
                        style={{ 
                          height: isListening ? `${activeHeight}px` : '4px',
                          animation: isListening ? `wave-pulse 1s ease-in-out infinite alternate` : 'none',
                          animationDelay: animDelay
                        }} 
                      />
                    );
                  })}
                </div>
                <div className="text-[10px] text-white/60 tracking-wider">
                  {isListening ? 'CAPTURING AUDIO SIGNAL STREAMS...' : 'MIC STANDBY // READY FOR CAPTURE'}
                </div>
              </div>

              {/* Waveform keyframes */}
              <style jsx global>{`
                @keyframes wave-pulse {
                  0% { transform: scaleY(0.4); }
                  100% { transform: scaleY(1.2); }
                }
              `}</style>

              <div className="flex justify-between items-center text-[8px] border-t border-white/5 pt-3">
                <span className="text-accent">AUDIO_INPUT: DEFAULT_MIC (48KHz)</span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  98.2% ACCURACY
                </span>
              </div>
            </div>

            {/* Glowing background bubble */}
            <div className="absolute bottom-4 left-24 right-24 h-6 bg-primary/10 rounded-full filter blur-xl -z-10 animate-pulse" />
          </motion.div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= PROJECT OVERVIEW & STATS ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Overview Left */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="text-xs font-mono text-primary tracking-widest uppercase">
                [ 01 // OVERVIEW_STATEMENT ]
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white">
                Real-Time Vocal Transcription<span className="text-primary">.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                The Speech-to-Text Web Application is an AI-powered web platform that converts spoken language into accurate text in real time. Dictating commands or documentation saves time and improves productivity compared to typing out long paragraphs manually.
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                The application improves accessibility and productivity by enabling users to dictate content instead of typing. Structured inside a React framework, it captures audio signals, filters ambient noise, maps phonemes, and outputs clean text instantly.
              </p>
            </div>

            {/* Overview Stats Right */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass-panel-glow p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">98.2%</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Word Accuracy</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">&lt; 250ms</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Stream Latency</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                  <Cpu size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">15+</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Dialects Supported</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">100%</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Client-Side Ready</div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= PROBLEM & SOLUTION ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-6 mb-12 text-center items-center"
          >
            <div className="text-xs font-mono text-secondary tracking-widest uppercase">
              [ 02 // PARADIGM_SHIFT ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white max-w-xl">
              From Manual Keystrokes to Fluid Voice Capture
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden hover:border-red-500/20 group transition-all"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Problem Statement</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                Typing large amounts of text is time-consuming, especially for users with accessibility needs. Keyboard inputs also pose several productivity bottlenecks:
              </p>
              
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Workload Latency:</strong> Users spend hours logging descriptions, emails, and code notes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Accessibility Barriers:</strong> Visually or physically impaired operators lack direct, fluid ways to record thoughts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Complexity:</strong> Legacy transcription tools require expensive external processing servers or run with heavy delays.</span>
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel-glow p-8 rounded-3xl border border-primary/20 relative overflow-hidden hover:border-primary/40 group transition-all"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">The Web Solution</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                Built a responsive web application that captures voice input, processes it using speech recognition technology, and instantly converts it into editable text:
              </p>

              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Continuous Recognition:</strong> Dictation operates uninterrupted, logging voice inputs directly to the screen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Universal Web Accessibility:</strong> Runs directly inside standard browser environments without requiring custom software.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Instant Exporting:</strong> One-click functions allow users to copy text to clipboard or download as raw files.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= INTERACTIVE DICTATION SIMULATOR ================= */}
        <section id="speech-simulator" className="py-16 px-6 md:px-16 max-w-6xl mx-auto scroll-mt-20">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-secondary tracking-widest uppercase">
              [ 03 // LIVE_AI_SIMULATOR ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Interactive Speech Dictation Simulator
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Select one of the prompts below. Then click the microphone button to simulate real-time speech dictation and text conversion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Prompt select */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between gap-6">
              <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-primary rounded-full" /> Select Dictation Speech
              </h4>

              <div className="flex flex-col gap-3 font-mono text-xs">
                {prompts.map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!isListening) {
                        setSelectedPrompt(idx);
                        setTranscribedText('');
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedPrompt === idx
                        ? 'border-primary bg-primary/5 text-white'
                        : 'border-white/5 text-white/55 hover:border-white/15'
                    } ${isListening ? 'pointer-events-none opacity-50' : ''}`}
                  >
                    <div className="font-bold text-[10px] uppercase text-primary/80 mb-1">PROMPT 0{idx + 1}</div>
                    "{p}"
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Audio Waveform and Editor */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center justify-between gap-6 flex-wrap bg-[#0D1222]">
                {/* Audio Waves pulsing */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={startSimulatedDictation}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse'
                        : 'bg-primary text-background hover:scale-105 shadow-neon-cyan'
                    }`}
                  >
                    <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
                  </button>
                  <div>
                    <div className="text-xs text-white font-bold">
                      {isListening ? 'DICTATING SIGNAL...' : 'CLICK MIC TO START DICTATING'}
                    </div>
                    <p className="text-[9px] font-mono text-white/40 mt-1">
                      {isListening ? 'Simulating speech synthesis stream...' : 'Microphone terminal in standby mode'}
                    </p>
                  </div>
                </div>

                {/* Waveform visualization */}
                <div className="flex items-end gap-1 h-8">
                  {[...Array(12)].map((_, i) => {
                    const h = isListening ? [10, 24, 32, 16, 28, 8][i % 6] : 4;
                    return (
                      <div 
                        key={i} 
                        className={`w-1 rounded-full transition-all duration-300 ${isListening ? 'bg-red-400' : 'bg-white/15'}`}
                        style={{ height: `${h}px` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Text editor box */}
              <div className="flex-1 bg-black/85 rounded-2xl border border-white/10 p-5 font-mono text-xs text-white/80 flex flex-col justify-between min-h-[220px]">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-4">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">TRANSCRIBED_NOTEPAD // OUTPUT</span>
                  
                  <div className="flex gap-2">
                    {copied && <span className="text-primary text-[9px] animate-pulse">Copied!</span>}
                    <button 
                      onClick={handleCopy}
                      disabled={!transcribedText}
                      className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-all disabled:opacity-40"
                      title="Copy to Clipboard"
                    >
                      <Copy size={12} />
                    </button>
                    <button 
                      onClick={handleDownload}
                      disabled={!transcribedText}
                      className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-all disabled:opacity-40"
                      title="Download file"
                    >
                      <Download size={12} />
                    </button>
                    <button 
                      onClick={() => setTranscribedText('')}
                      disabled={!transcribedText || isListening}
                      className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-red-400 transition-all disabled:opacity-40"
                      title="Clear editor"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Transcribing area */}
                <div className="flex-1 min-h-[120px] text-white/95 leading-relaxed text-sm font-sans relative">
                  {transcribedText ? (
                    <span>
                      {transcribedText}
                      {isListening && <span className="w-1.5 h-4 ml-1 inline-block bg-primary animate-pulse" />}
                    </span>
                  ) : (
                    <span className="text-white/30 italic text-xs font-mono">
                      {isListening ? 'Initializing speech engine...' : 'Dictate using the prompt pane on the left.'}
                    </span>
                  )}
                </div>

                <div className="text-[8px] text-white/30 border-t border-white/5 pt-3 mt-4 flex justify-between">
                  <span>WORDS: {transcribedText ? transcribedText.split(' ').length : 0}</span>
                  <span>STATUS: {isListening ? 'LOGGING_TELEMETRY' : 'IDLE'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= AUDIO ARCHITECTURE PIPELINE ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-accent tracking-widest uppercase">
              [ 04 // PIPELINE_LIFECYCLE ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Speech Processing Pipeline
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Trace how audio signals convert to semantic characters inside the Web Speech system. Click below to simulate telemetry flow.
            </p>
            <button
              onClick={() => {
                setIsPlayingFlow(!isPlayingFlow);
                if (!isPlayingFlow) setFlowStep(0);
              }}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 text-white transition-all"
            >
              <Play size={12} className={isPlayingFlow ? "animate-ping text-primary" : "text-white"} />
              <span>{isPlayingFlow ? 'PAUSE PIPELINE' : 'RUN WAVE PIPELINE'}</span>
            </button>
          </motion.div>

          {/* Workflow Pipeline Display */}
          <div className="relative mt-8 select-none">
            {/* Progress line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 hidden xl:block" />
            
            {/* Animated active flow line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-accent -translate-y-1/2 hidden xl:block transition-all duration-700" 
              style={{ width: `${(flowStep / 4) * 100}%` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
              {processingNodes.map((node, idx) => {
                const Icon = node.icon;
                const isCurrent = flowStep === idx;
                const isPassed = flowStep > idx;

                return (
                  <div 
                    key={node.title}
                    onClick={() => {
                      setIsPlayingFlow(false);
                      setFlowStep(idx);
                    }}
                    className={`glass-panel p-4 rounded-xl border transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative ${
                      isCurrent 
                        ? 'border-primary shadow-neon-cyan scale-105 bg-[#0F1424]' 
                        : isPassed 
                          ? 'border-accent/40 bg-white/5' 
                          : 'border-white/5 opacity-55 hover:opacity-85'
                    }`}
                  >
                    {/* Glowing index tag */}
                    <span className={`text-[8px] font-mono mb-2 px-1.5 py-0.2 rounded ${
                      isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                    }`}>
                      STAGE_0{idx + 1}
                    </span>

                    {/* Step Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                      isCurrent 
                        ? 'bg-primary/10 text-primary scale-110 transition-transform' 
                        : isPassed 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-white/5 text-white/40'
                    }`}>
                      <Icon size={18} />
                    </div>

                    {/* Step Title */}
                    <h4 className="text-xs font-bold text-white tracking-wide">{node.title}</h4>
                    
                    {/* Step Description */}
                    <p className="text-[9px] text-white/50 leading-relaxed mt-2 font-mono">
                      {node.desc}
                    </p>

                    {/* Chevron Connector on large viewports */}
                    {idx < 4 && (
                      <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 text-white/10 hidden xl:block">
                        <ArrowRight size={14} className={isPassed ? "text-accent/60" : ""} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= TECHNOLOGY STACK ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-primary tracking-widest uppercase">
              [ 05 // SYSTEM_INTEGRATION ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              System Technology Stack
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* React */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Framework</h4>
                <div className="text-sm font-display font-bold text-white mt-1">React.js</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Manages virtual UI states, key values, transcription text components, and clipboard bindings.
                </p>
              </div>
            </div>

            {/* JS */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Logic Layer</h4>
                <div className="text-sm font-display font-bold text-white mt-1">JavaScript ES6</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Coordinates browser speech APIs, audio capture intervals, and text formatting algorithms.
                </p>
              </div>
            </div>

            {/* Speech API */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Mic size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Speech Engine</h4>
                <div className="text-sm font-display font-bold text-white mt-1">Speech Recognition API</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Native browser engine processing acoustic signatures, phoneme indexing, and parsing grammar metrics.
                </p>
              </div>
            </div>

            {/* HTML5 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Volume2 size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Markup</h4>
                <div className="text-sm font-display font-bold text-white mt-1">HTML5 Audio</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Provides audio capture streams, requesting microphone permissions via browser authorization gates.
                </p>
              </div>
            </div>

            {/* CSS3 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-400/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Sliders size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Styling</h4>
                <div className="text-sm font-display font-bold text-white mt-1">CSS3 Modules</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Styles the waveform ripples, visual overlays, audio panels, and glassmorphic card grids.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= CHALLENGES & FUTURE IMPROVEMENTS ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/25 transition-all group"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold mb-4">
                <AlertTriangle size={16} />
                <h3 className="text-sm font-display uppercase tracking-wider">Challenges Faced</h3>
              </div>
              <ul className="flex flex-col gap-4 font-mono text-xs text-white/70">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Handling different accents:</strong> Optimizing language settings to parse phonetic dialects and regional pronunciation variations.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Background noise reduction:</strong> Implementing digital signal filters to prevent room reverberations and static from contaminating vocal feeds.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Browser compatibility:</strong> Resolving discrepancies between Web Speech standards across different browser cores.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Speech accuracy:</strong> Tuning continuous recognition parameters to prevent vocabulary drops during brief pauses.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Real-time processing:</strong> Buffering capture sequences efficiently to prevent UI thread blocks during long recording sessions.
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Future Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-secondary/25 transition-all group"
            >
              <div className="flex items-center gap-2 text-secondary font-bold mb-4">
                <Zap size={16} />
                <h3 className="text-sm font-display uppercase tracking-wider">Future Enhancements</h3>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/70">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Multiple Language Support</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">DESIGNING</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Voice Commands & Macro Triggers</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>AI Summarization Modules</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PROTOTYPING</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Speech Translation Interface</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Offline Recognition Engine</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">DRAFT</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= OUTCOME & FINAL CTA ================= */}
        <section className="py-16 pb-24 px-6 md:px-16 max-w-4xl mx-auto text-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-panel-glow p-8 md:p-12 rounded-3xl border border-primary/20 relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-4">
              Project Outcome
            </h3>
            
            <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-mono">
              Successfully developed an AI-powered web application that enhances accessibility and demonstrates the practical use of speech recognition technology in modern web applications. Restructured components to operate completely within client runtimes, guaranteeing instant, secure text transformations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://github.com/Siva1286"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white transition-all transform hover:-translate-y-0.5"
              >
                <Github size={14} /> View on GitHub
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
              >
                Back to Projects
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
