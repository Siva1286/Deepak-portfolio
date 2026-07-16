'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = (fieldName: string) => setFocusedField(fieldName);
  const handleBlur = (fieldName: string) => {
    if (!formState[fieldName as keyof typeof formState]) {
      setFocusedField(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick Validation
    if (!formState.name || !formState.email || !formState.message) {
      setStatus('error');
      setErrorMessage('Please fill out all fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formState.email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
      setFocusedField(null);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#8B5CF6', '#38BDF8']
      });

    } catch (err) {
      setStatus('error');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <section 
      id="contact" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
    >
      {/* Background spotlights */}
      <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Section Title */}
        <div className="mb-16 md:mb-20 text-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-primary tracking-widest uppercase mb-2"
          >
            [ 07 // COMMUNICATION ]
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-black text-white"
          >
            Get In Touch<span className="text-primary">.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Direct channels (col 5) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="lg:col-span-5 flex flex-col justify-between glass-panel p-8 rounded-3xl border border-white/10 shadow-glass"
          >
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Let&apos;s Connect</h3>
                <p className="text-xs font-mono text-accent uppercase tracking-wider mt-1">Ready for new opportunities</p>
              </div>

              <p className="text-white/60 text-sm leading-relaxed font-sans">
                I am always open to discussing data analytics roles, AI engineering research, full-stack pipelines, or academic collaborations. Reach out via email or any of my social profiles.
              </p>

              {/* Channels List */}
              <div className="flex flex-col gap-4 mt-4 font-mono text-xs">
                {/* Email */}
                <a 
                  href="mailto:deepaksiva641@gmail.com"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
                >
                  <Mail size={16} className="text-primary" />
                  <span>deepaksiva641@gmail.com</span>
                </a>

                {/* Github */}
                <a 
                  href="https://github.com/Siva1286"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
                >
                  <Github size={16} className="text-secondary" />
                  <span>github.com/Siva1286</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="#"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
                >
                  <Linkedin size={16} className="text-accent" />
                  <span>linkedin.com/in/deepak-p (placeholder)</span>
                </a>

                {/* Location */}
                <div 
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 text-white/80"
                >
                  <MapPin size={16} className="text-primary" />
                  <span>Erode, Tamil Nadu, India</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-8 flex justify-between items-center text-[8px] font-mono text-white/40">
              <span>PING_RESPONSE //</span>
              <span>LISTENING</span>
            </div>
          </motion.div>

          {/* Right Column: Glassmorphic form (col 7) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 shadow-glass relative flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">Message Transmitted!</h3>
                  <p className="text-white/60 text-sm max-w-sm font-sans">
                    Thank you for reaching out, Deepak P has received your message pipeline and will respond shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono hover:bg-white/5 text-white transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Form Error Tag */}
                  {status === 'error' && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
                      <AlertCircle size={14} className="flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name field */}
                  <div className="relative w-full">
                    <label
                      htmlFor="name"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                        focusedField === 'name' || formState.name
                          ? 'top-[-8px] text-[9px] text-primary bg-[#0E1322] px-2 border border-primary/20 rounded'
                          : 'top-4 text-white/40'
                      }`}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {/* Email field */}
                  <div className="relative w-full">
                    <label
                      htmlFor="email"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                        focusedField === 'email' || formState.email
                          ? 'top-[-8px] text-[9px] text-secondary bg-[#0E1322] px-2 border border-secondary/20 rounded'
                          : 'top-4 text-white/40'
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:border-secondary/50 focus:bg-white/[0.07] transition-all"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {/* Message field */}
                  <div className="relative w-full">
                    <label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                        focusedField === 'message' || formState.message
                          ? 'top-[-8px] text-[9px] text-accent bg-[#0E1322] px-2 border border-accent/20 rounded'
                          : 'top-4 text-white/40'
                      }`}
                    >
                      Write your message here...
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onFocus={() => handleFocus('message')}
                      onBlur={() => handleBlur('message')}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all resize-none"
                      disabled={status === 'submitting'}
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group relative px-6 py-3.5 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-bold font-display text-xs tracking-wider flex items-center justify-center gap-2 overflow-hidden shadow-glass transition-all hover:shadow-neon-cyan duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Transmitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
