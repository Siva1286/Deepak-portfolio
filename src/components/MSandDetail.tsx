'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ArrowLeft, Github, ExternalLink, Cpu, HardDrive, Wifi, 
  Database, Battery, AlertTriangle, CheckCircle2, Award, 
  Activity, Play, RefreshCw, Sliders, Layers, Server, Clock, 
  ArrowRight, Shield, Zap, Terminal, Check
} from 'lucide-react';

interface MSandDetailProps {
  onClose: () => void;
}

export default function MSandDetail({ onClose }: MSandDetailProps) {
  const [moisture, setMoisture] = useState(8.5);
  const [temperature, setTemperature] = useState(26.4);
  const [analysisResult, setAnalysisResult] = useState<{
    status: 'OPTIMAL' | 'WARNING_HIGH' | 'WARNING_LOW' | 'WARNING_TEMP';
    title: string;
    message: string;
    color: string;
    glow: string;
  }>({
    status: 'OPTIMAL',
    title: 'Optimal Construction Grade',
    message: 'Material characteristics meet structural regulations. Ideal for concrete compounding.',
    color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
    glow: 'shadow-[0_0_15px_rgba(52,211,153,0.2)] border-emerald-500/30'
  });

  const [serialLogs, setSerialLogs] = useState<string[]>([
    '[SYS_INIT] ESP32 Core booting (Revision 3)...',
    '[SYS_INIT] Internal Flash: 4MB // PSRAM: 8MB',
    '[WIFI_NET] Scanning access points...',
    '[WIFI_NET] Connected to: MSand_Gateway_04 (IP: 192.168.1.108)',
    '[SENS_CAL] Calibrating DHT22 & Capacitive Moisture sensors...',
    '[SENS_CAL] Sensors calibrated. Offset margin: ±1.2%',
    '[SYS_RUN] Ready. Telemetry loops active.'
  ]);

  const [flowStep, setFlowStep] = useState(0);
  const [isPlayingFlow, setIsPlayingFlow] = useState(false);
  const [logTrigger, setLogTrigger] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  // Re-run quality analysis when sliders change
  useEffect(() => {
    let resultStatus: 'OPTIMAL' | 'WARNING_HIGH' | 'WARNING_LOW' | 'WARNING_TEMP' = 'OPTIMAL';
    let title = 'Optimal Construction Grade';
    let message = 'Material characteristics meet structural regulations. Ideal for concrete compounding.';
    let color = 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
    let glow = 'shadow-[0_0_15px_rgba(52,211,153,0.2)] border-emerald-500/30';

    if (moisture > 12) {
      resultStatus = 'WARNING_HIGH';
      title = 'EXCESS MOISTURE DETECTED';
      message = 'Risk of concrete segregation, loss of workability, and strength compromise.';
      color = 'text-red-400 border-red-500/20 bg-red-500/10';
      glow = 'shadow-[0_0_15px_rgba(248,113,113,0.2)] border-red-500/30';
    } else if (moisture < 5) {
      resultStatus = 'WARNING_LOW';
      title = 'LOW MOISTURE WARNING';
      message = 'Sand contains high dry dust ratios, resulting in rapid moisture absorption during mixing.';
      color = 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      glow = 'shadow-[0_0_15px_rgba(251,191,36,0.2)] border-amber-500/30';
    } else if (temperature > 38 || temperature < 18) {
      resultStatus = 'WARNING_TEMP';
      title = 'THERMAL VARIATION WARNING';
      message = 'Temperature exceeds safe curing bounds. High risk of thermal stress cracks.';
      color = 'text-blue-400 border-blue-500/20 bg-blue-500/10';
      glow = 'shadow-[0_0_15px_rgba(96,165,250,0.2)] border-blue-500/30';
    }

    setAnalysisResult({ status: resultStatus, title, message, color, glow });

    // Append logs to simulated monitor
    const timestamp = new Date().toLocaleTimeString();
    const newLog = `[${timestamp}] READ -> Moisture: ${moisture.toFixed(1)}% | Temp: ${temperature.toFixed(1)}°C // EVAL: ${resultStatus}`;
    setSerialLogs(prev => {
      const updated = [...prev, newLog];
      if (updated.length > 9) updated.shift(); // Keep logs clean
      return updated;
    });

  }, [moisture, temperature]);

  // Auto pipeline flow loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingFlow) {
      interval = setInterval(() => {
        setFlowStep((prev) => (prev + 1) % 4);
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

  const hardwareNodes = [
    { title: 'IoT Sensors', desc: 'DHT22 for ambient temp & capacitive soil probe for moisture tracking', icon: HardDrive, color: 'text-primary' },
    { title: 'ESP32 NodeMCU', desc: 'Embedded processing core evaluating sensor calibration and parameters', icon: Cpu, color: 'text-secondary' },
    { title: 'WiFi Gateway', desc: 'Forwards telemetry streams securely to cloud endpoints', icon: Wifi, color: 'text-accent' },
    { title: 'Worker Terminal', desc: 'Logs displayed in real time for immediate concrete adjustments', icon: Terminal, color: 'text-emerald-400' }
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
          <span className="text-sm font-display font-black tracking-widest text-white">M-SAND QA SYSTEM</span>
          <span className="text-[9px] font-mono text-accent uppercase tracking-wider">CASE_STUDY // EMBEDDED_IOT</span>
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
              <span>🥈 2nd Prize Ideathon (Excel Engineering College)</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight text-white mt-4">
              IoT-Based M-Sand<br/>Quality Assurance System<span className="text-accent">.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gradient-secondary font-display font-bold max-w-2xl mt-2 leading-normal">
              Smart Construction Material Quality Monitoring
            </p>

            <div className="flex gap-2.5 mt-2 flex-wrap justify-center">
              <span className="px-3 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/5 text-white/70">
                IoT
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-white/5 text-white/70">
                Embedded Systems
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-mono bg-primary/10 border border-primary/20 text-primary">
                Artificial Intelligence
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
                href="#iot-simulator"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('iot-simulator');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-gradient-to-r from-primary to-accent text-background hover:shadow-neon-cyan transition-all transform hover:-translate-y-0.5"
              >
                <Sliders size={14} /> Launch Sensor Simulator
              </a>
            </div>
          </motion.div>

          {/* Floating ESP32 Circuit Simulation Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full max-w-[650px] aspect-[16/10] mt-16 relative flex flex-col items-center justify-center"
          >
            {/* Embedded Microchip Simulation Panel */}
            <div className="w-[90%] aspect-[16/10] glass-panel-glow rounded-3xl p-6 border border-white/15 relative overflow-hidden flex flex-col justify-between font-mono">
              {/* Circuit Grid Background lines */}
              <div className="absolute inset-0 grid-overlay opacity-30 -z-10" />
              
              {/* LED connection nodes */}
              <div className="flex justify-between items-center text-[9px] text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>ESP32 // POWER_ACTIVE</span>
                </div>
                <span>NODE_MCU_ESP32_WROOM_32D</span>
              </div>

              {/* Hardware Microchip Visual Mockup */}
              <div className="flex-1 flex items-center justify-center my-6 relative">
                {/* Microchip Body */}
                <div className="w-48 h-32 bg-[#1E293B] rounded-xl border-2 border-white/10 relative flex flex-col items-center justify-center shadow-lg group hover:border-primary/40 transition-colors">
                  {/* Metal Pins Left */}
                  <div className="absolute left-[-10px] top-4 bottom-4 flex flex-col justify-between h-24">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2.5 h-1.5 bg-[#94A3B8] rounded-l border border-black/45" />
                    ))}
                  </div>
                  {/* Metal Pins Right */}
                  <div className="absolute right-[-10px] top-4 bottom-4 flex flex-col justify-between h-24">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2.5 h-1.5 bg-[#94A3B8] rounded-r border border-black/45" />
                    ))}
                  </div>

                  {/* Metal Shield Core */}
                  <div className="w-32 h-20 bg-[#64748B] rounded border border-white/10 flex flex-col items-center justify-center p-2 relative shadow-inner">
                    <span className="text-[10px] text-white font-bold tracking-widest">ESP32</span>
                    <span className="text-[7px] text-white/55 mt-1">2.4GHz Wi-Fi + BT</span>
                    {/* Tiny WiFi Antenna */}
                    <div className="absolute top-1 right-1 flex flex-col gap-0.5 opacity-55">
                      <div className="w-3 h-0.5 bg-[#1E293B]" />
                      <div className="w-2.5 h-0.5 bg-[#1E293B]" />
                      <div className="w-2 h-0.5 bg-[#1E293B]" />
                    </div>
                  </div>
                </div>

                {/* Floating Sensor modules */}
                {/* 1. Temp DHT22 */}
                <div className="absolute left-4 top-0 glass-panel p-2.5 rounded-xl border border-primary/20 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                  <span className="text-[7px] text-white/40 block">DHT22</span>
                  <HardDrive size={14} className="text-primary animate-pulse" />
                  <span className="text-[8px] text-white font-bold">{temperature.toFixed(1)}°C</span>
                </div>

                {/* 2. Soil Moisture Probe */}
                <div className="absolute right-4 bottom-0 glass-panel p-2.5 rounded-xl border border-accent/20 flex flex-col items-center gap-1 hover:scale-105 transition-transform">
                  <span className="text-[7px] text-white/40 block">MOIST_PROBE</span>
                  <Sliders size={14} className="text-accent" />
                  <span className="text-[8px] text-white font-bold">{moisture.toFixed(1)}%</span>
                </div>
              </div>

              {/* Status display footer */}
              <div className="flex justify-between items-center text-[8px] border-t border-white/5 pt-3">
                <span className="text-primary/70">COM_PORT: COM3 // BAUD: 115200</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold flex items-center gap-0.5">
                  <Check size={8} /> TELEMETRY_OK
                </span>
              </div>
            </div>

            {/* Glowing reflection under hardware */}
            <div className="absolute bottom-4 left-24 right-24 h-6 bg-accent/10 rounded-full filter blur-xl -z-10 animate-pulse" />
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
                Intelligent Concrete Material Assessor<span className="text-accent">.</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                The IoT-Based M-Sand Quality Assurance System is an intelligent monitoring solution developed to improve the quality assessment process of Manufactured Sand (M-Sand) used in construction. M-Sand requires precise quality verification since organic dust percentages and excess moisture severely degrade compressive strength in structural concrete.
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                The system integrates ESP32 microcontrollers with environmental and soil moisture sensors to monitor important parameters such as temperature and moisture, enabling real-time quality evaluation directly at construction sites. This prevents delay anomalies and guarantees material integrity prior to consolidation.
              </p>
            </div>

            {/* Overview Stats Right */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="glass-panel-glow p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">±1.2%</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Calibration Margin</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-105 transition-transform">
                  <Battery size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">48 Hours</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Battery Autonomy</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-105 transition-transform">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">&lt; 3 Secs</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Instant Assessment</div>
                </div>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display font-black text-white">12ms</div>
                  <div className="text-[10px] font-mono text-white/50 uppercase mt-1 tracking-wider">Transmit Latency</div>
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
              From Laboratory Bottlenecks to Real-Time Site Auditing
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
              {/* Glowing Alert Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/10 transition-colors" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <AlertTriangle size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">Problem Statement</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                Conventional Manufactured Sand verification depends heavily on laboratory sieve testing and drying protocols. This introduces several bottlenecks:
              </p>
              
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Time-Consuming Audits:</strong> Processing results takes 24–48 hours, delaying concrete pour decisions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Lack of Portability:</strong> Construction crews cannot evaluate moisture or composition on-site prior to hydration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span><strong>Quality Risks:</strong> Incorrect moisture levels weaken concrete aggregates, resulting in structural cracking.</span>
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
              {/* Glowing Cyan Background Glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CheckCircle2 size={18} />
                </div>
                <h3 className="text-xl font-display font-bold text-white">The IoT Solution</h3>
              </div>

              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-4">
                We engineered a portable testing terminal utilizing micro-processing cores to run instant, localized checks:
              </p>

              <ul className="flex flex-col gap-3 font-mono text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>ESP32 Processing:</strong> Collects moisture and ambient metrics directly on the material heap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Low-Power Efficiency:</strong> Optimized battery loops support continuous field usage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span><strong>Instant Results:</strong> Provides instant material evaluations to decide if the batch is ready for mixing.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= INTERACTIVE SENSOR SIMULATOR ================= */}
        <section id="iot-simulator" className="py-16 px-6 md:px-16 max-w-6xl mx-auto scroll-mt-20">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-secondary tracking-widest uppercase">
              [ 03 // LIVE_HARDWARE_SIMULATOR ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Interactive ESP32 Sensor & Analysis Terminal
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Use the sliders below to adjust moisture and temperature levels. Observe the ESP32 Serial Terminal logging and outputting quality assessments in real time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Sliders and dials */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between gap-6">
              <h4 className="text-sm font-display font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-primary rounded-full" /> Sensor Input Tuning
              </h4>

              {/* Slider 1: Moisture */}
              <div className="flex flex-col gap-2 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Moisture Content</span>
                  <span className="text-primary font-bold">{moisture.toFixed(1)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.5"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[8px] text-white/30">
                  <span>0% (Dry)</span>
                  <span>Optimal (5% - 12%)</span>
                  <span>30% (Saturated)</span>
                </div>
              </div>

              {/* Slider 2: Temp */}
              <div className="flex flex-col gap-2 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Ambient Temp</span>
                  <span className="text-accent font-bold">{temperature.toFixed(1)}°C</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  step="0.5"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[8px] text-white/30">
                  <span>10°C</span>
                  <span>Optimal (20°C - 38°C)</span>
                  <span>60°C</span>
                </div>
              </div>

              {/* Readout stats */}
              <div className="p-4 rounded-xl border border-white/5 bg-white/5 flex flex-col gap-2 font-mono text-[9px] text-white/50">
                <div className="font-bold text-white mb-1">CONCRETE COMPRESSED SPECIFICATIONS:</div>
                <div className="flex justify-between">
                  <span>Standard Sand Index:</span>
                  <span className="text-white">IS 383 Code Compliant</span>
                </div>
                <div className="flex justify-between">
                  <span>Purity Index Target:</span>
                  <span className="text-white">&gt; 92.5%</span>
                </div>
              </div>
            </div>

            {/* Right Column: Serial terminal logs and analysis display */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Output analysis display */}
              <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col gap-2 ${analysisResult.glow} bg-[#0D1222]`}>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase">ALGORITHM_EVALUATION</span>
                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded ${analysisResult.color}`}>
                    {analysisResult.status}
                  </span>
                </div>
                <h4 className="text-base font-display font-black text-white mt-1">
                  {analysisResult.title}
                </h4>
                <p className="text-xs text-white/70 font-mono leading-relaxed">
                  {analysisResult.message}
                </p>
              </div>

              {/* Serial Monitor console */}
              <div className="flex-1 bg-black/80 rounded-2xl border border-white/10 p-4 font-mono text-[10px] text-emerald-400/80 flex flex-col justify-between overflow-hidden shadow-inner min-h-[180px]">
                <div className="flex justify-between items-center text-white/30 text-[8px] border-b border-white/5 pb-2 mb-2">
                  <span className="flex items-center gap-1.5"><Terminal size={10} /> SERIAL MONITOR // ESP32_STREAM</span>
                  <span>9600 BAUD</span>
                </div>

                <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[140px] scrollbar-none font-bold">
                  {serialLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('EVAL: OPTIMAL') ? 'text-emerald-400' : log.includes('EVAL:') ? 'text-red-400' : 'text-white/60'}>
                      {log}
                    </div>
                  ))}
                </div>

                <div className="text-right text-[8px] text-white/20 pt-2 border-t border-white/5 mt-2">
                  Auto-scrolling active
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-white/5 my-10 max-w-6xl mx-auto" />

        {/* ================= HARDWARE ARCHITECTURE FLOW ================= */}
        <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4 text-center items-center mb-12"
          >
            <div className="text-xs font-mono text-accent tracking-widest uppercase">
              [ 04 // PIPELINE_FLOW ]
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white">
              Hardware Architecture & Telemetry Pipeline
            </h2>
            <p className="text-white/60 text-xs md:text-sm max-w-xl leading-relaxed">
              Understand how environmental telemetry transitions from sensors to worker interfaces. Click below to simulate data routing.
            </p>
            <button
              onClick={() => {
                setIsPlayingFlow(!isPlayingFlow);
                if (!isPlayingFlow) setFlowStep(0);
              }}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 text-white transition-all"
            >
              <Play size={12} className={isPlayingFlow ? "animate-ping text-primary" : "text-white"} />
              <span>{isPlayingFlow ? 'PAUSE TELEMETRY' : 'RUN TELEMETRY SIMULATION'}</span>
            </button>
          </motion.div>

          {/* Workflow Pipeline Display */}
          <div className="relative mt-8 select-none">
            {/* Progress line background */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 hidden lg:block" />
            
            {/* Animated active flow line */}
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-accent -translate-y-1/2 hidden lg:block transition-all duration-700" 
              style={{ width: `${(flowStep / 3) * 100}%` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {hardwareNodes.map((node, idx) => {
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
                    className={`glass-panel p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center cursor-pointer relative ${
                      isCurrent 
                        ? 'border-primary shadow-neon-cyan scale-105 bg-[#0F1424]' 
                        : isPassed 
                          ? 'border-accent/40 bg-white/5' 
                          : 'border-white/5 opacity-55 hover:opacity-85'
                    }`}
                  >
                    {/* Glowing index tag */}
                    <span className={`text-[8px] font-mono mb-3 px-2 py-0.5 rounded ${
                      isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/40'
                    }`}>
                      NODE_0{idx + 1}
                    </span>

                    {/* Step Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                      isCurrent 
                        ? 'bg-primary/10 text-primary scale-110 transition-transform' 
                        : isPassed 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-white/5 text-white/40'
                    }`}>
                      <Icon size={20} />
                    </div>

                    {/* Step Title */}
                    <h4 className="text-xs font-bold text-white tracking-wide">{node.title}</h4>
                    
                    {/* Step Description */}
                    <p className="text-[10px] text-white/50 leading-relaxed mt-2.5 font-mono">
                      {node.desc}
                    </p>

                    {/* Connector Icon */}
                    {idx < 3 && (
                      <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 text-white/10 hidden lg:block">
                        <ArrowRight size={16} className={isPassed ? "text-accent/60" : ""} />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* ESP32 */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-primary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Controller</h4>
                <div className="text-sm font-display font-bold text-white mt-1">ESP32 SoC</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Controls the main firmware execution, interfacing sensors with analog/digital lines.
                </p>
              </div>
            </div>

            {/* Temp Sensor */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-secondary/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                <HardDrive size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Temperature</h4>
                <div className="text-sm font-display font-bold text-white mt-1">DHT22 Module</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Measures ambient heat indices. Calibrated to guarantee concrete curing thermal bounds.
                </p>
              </div>
            </div>

            {/* Moisture Sensor */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-accent/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:scale-110 transition-transform">
                <Sliders size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Moisture</h4>
                <div className="text-sm font-display font-bold text-white mt-1">Soil Probe</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Measures volume water ratios inside sand piles via relative capacitive changes.
                </p>
              </div>
            </div>

            {/* Embedded C */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Language</h4>
                <div className="text-sm font-display font-bold text-white mt-1">Embedded C</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Main firmware logic compiled inside Arduino environments, optimized for resource constraints.
                </p>
              </div>
            </div>

            {/* IoT Architecture */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-amber-400/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Wifi size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Protocols</h4>
                <div className="text-sm font-display font-bold text-white mt-1">IoT / Wi-Fi</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Configures local station nodes, transmitting JSON streams via HTTP post APIs.
                </p>
              </div>
            </div>

            {/* Cloud Monitoring */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-blue-500/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Server size={20} />
              </div>
              <div>
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">Cloud</h4>
                <div className="text-sm font-display font-bold text-white mt-1">Cloud Monitor</div>
                <p className="text-[9px] font-mono text-white/40 mt-2 leading-relaxed">
                  Visualizes long term sand metrics, running validation routines for construction audits.
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
                    <strong>Sensor calibration:</strong> Addressing sensor drifts caused by environmental variables and dust contamination inside M-Sand heaps.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Power optimization:</strong> Implementing Deep Sleep cycles to reduce current draw and extend battery autonomy.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Real-time data accuracy:</strong> Implementing smoothing algorithms (Moving Average Filters) to remove signal spikes.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Hardware integration:</strong> Packaging fragile soil probes and chips into a rugged, dust-proof shell for site safety.
                  </div>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <div>
                    <strong>Environmental testing:</strong> Simulating varying ambient conditions inside construction locations to verify operational stability.
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
                <h3 className="text-sm font-display uppercase tracking-wider">Future Improvements</h3>
              </div>
              <ul className="flex flex-col gap-3 font-mono text-xs text-white/70">
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>AI-based Quality Prediction</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">DESIGNING</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Mobile Application Integration</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>Cloud Analytics Dashboard</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PLANNED</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span>GPS Tracking Node</span>
                  <span className="text-[7px] px-1 rounded bg-secondary/20 text-secondary">PROTOTYPING</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Predictive Analytics Framework</span>
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
              Successfully developed a portable IoT quality monitoring system that improves construction efficiency and enables faster decision-making through real-time environmental analysis. The device reduces reliance on traditional laboratory-based preliminary testing, preventing delays on structural aggregates.
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
