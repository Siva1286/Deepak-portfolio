'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Github, 
  Linkedin, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Phone, 
  Tag 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Contact() {
  // 1. Form state
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website_url: '' // Honeypot field for spam prevention
  });

  // 2. Real-time validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  // 3. UI states
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mountTime, setMountTime] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Record mount time for bot submission speed threshold checks
  useEffect(() => {
    setMountTime(Date.now());
  }, []);

  const handleFocus = (fieldName: string) => setFocusedField(fieldName);
  const handleBlur = (fieldName: string) => {
    if (!formState[fieldName as keyof typeof formState]) {
      setFocusedField(null);
    }
    validateField(fieldName, formState[fieldName as keyof typeof formState]);
  };

  /**
   * Validate fields on keystroke/blur
   */
  const validateField = (fieldName: string, value: string) => {
    let errorMsg = '';
    
    if (fieldName === 'name') {
      if (!value.trim()) {
        errorMsg = 'Name is required.';
      }
    } else if (fieldName === 'email') {
      if (!value.trim()) {
        errorMsg = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errorMsg = 'Please enter a valid email address.';
      }
    } else if (fieldName === 'message') {
      if (!value.trim()) {
        errorMsg = 'Message content is required.';
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    return errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error as user corrects the text
    if (['name', 'email', 'message'].includes(name)) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submissions while in process
    if (status === 'submitting') return;

    // Validate fields
    const nameErr = validateField('name', formState.name);
    const emailErr = validateField('email', formState.email);
    const messageErr = validateField('message', formState.message);

    if (nameErr || emailErr || messageErr) {
      const firstError = nameErr ? 'name' : emailErr ? 'email' : 'message';
      document.getElementById(firstError)?.focus();
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Honeypot spam check
    if (formState.website_url) {
      console.warn('[Spam Shield] Honeypot field was filled.');
      setTimeout(() => {
        setStatus('success');
      }, 1000);
      return;
    }

    // Bot quick-submission speed threshold check (e.g. less than 2.0s to fill form)
    if (Date.now() - mountTime < 2000) {
      console.warn('[Spam Shield] Quick-submission detected.');
      setTimeout(() => {
        setStatus('success');
      }, 1000);
      return;
    }

    // Retrieve environment variables
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Check if EmailJS credentials are fully set up
    const isEmailJSConfigured = serviceId && templateId && publicKey && 
                                !serviceId.startsWith('your_emailjs') && 
                                !templateId.startsWith('your_emailjs') && 
                                !publicKey.startsWith('your_emailjs');

    // Try fetching the client IP address (optional)
    let clientIp = 'Unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        clientIp = ipData.ip;
      }
    } catch (ipError) {
      // Fail silently and use fallback IP
    }

    const cleanName = formState.name.trim();
    const cleanEmail = formState.email.trim();
    const cleanPhone = formState.phone.trim() || 'Not Provided';
    const cleanSubject = formState.subject.trim() || 'No Subject';
    const cleanMessage = formState.message.trim();

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' });
    const formattedTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata' });

    try {
      if (!isEmailJSConfigured) {
        // Fallback to local serverless API route to save to contacts.json and mock success
        // This prevents blocking development or local testing before credentials are pasted
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formState,
            timestamp: mountTime,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Mock submission failed.');
        }

        console.log('[Mock Submission Success] Saved locally to contacts.json. Note: Configure EmailJS in .env.local to receive actual emails.');
      } else {
        // 1. Submit to EmailJS API directly
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              from_name: cleanName,
              from_email: cleanEmail,
              phone: cleanPhone,
              subject: cleanSubject,
              message: cleanMessage,
              date: formattedDate,
              time: formattedTime,
              ip: clientIp,
              to_email: 'deepaksiva641@gmail.com'
            }
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || 'Failed to dispatch email.');
        }

        // 2. Also append submission locally in contacts.json
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formState,
            timestamp: mountTime,
          }),
        }).catch(() => {
          // Ignore local storage errors if email dispatch succeeded
        });
      }

      setStatus('success');

      // Clear input fields on successful submission
      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        website_url: ''
      });
      setErrors({
        name: '',
        email: '',
        message: ''
      });
      setFocusedField(null);

      // Confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#8B5CF6', '#38BDF8']
      });

    } catch (err: any) {
      console.error('Submit error:', err);
      setStatus('error');
      setErrorMessage(
        err.message || 'An error occurred while transmitting your message. Please check your connection and try again.'
      );
    }
  };

  return (
    <section 
      id="contact" 
      className="relative py-28 px-6 md:px-16 bg-[#0B0F19] overflow-hidden"
      aria-labelledby="contact-heading"
    >
      {/* Visual background spotlights */}
      <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <div 
        ref={containerRef}
        className="max-w-5xl mx-auto relative z-10"
      >
        {/* Header Title */}
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
            id="contact-heading"
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
          {/* Left Column: Direct channels (col-5) */}
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
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  aria-label="Send email to deepaksiva641@gmail.com"
                >
                  <Mail size={16} className="text-primary" />
                  <span>deepaksiva641@gmail.com</span>
                </a>

                {/* Github */}
                <a 
                  href="https://github.com/Siva1286"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-secondary/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-secondary/50"
                  aria-label="Visit Siva1286 GitHub Profile"
                >
                  <Github size={16} className="text-secondary" />
                  <span>github.com/Siva1286</span>
                </a>

                {/* LinkedIn */}
                <a 
                  href="#"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent/30 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-accent/50"
                  aria-label="Visit LinkedIn Profile"
                >
                  <Linkedin size={16} className="text-accent" />
                  <span>linkedin.com/in/deepak-p (placeholder)</span>
                </a>

                {/* Location */}
                <div 
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 text-white/80"
                  role="presentation"
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

          {/* Right Column: Glassmorphic form (col-7) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 shadow-glass relative flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                /* Success Toast View State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 flex flex-col items-center gap-4"
                  role="status"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">✅ Message Sent Successfully</h3>
                  <p className="text-white/60 text-sm max-w-sm font-sans">
                    Thank you for reaching out! Your message has been sent successfully. An automatic confirmation email has been dispatched to your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="mt-4 px-6 py-2 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono hover:bg-white/5 text-white transition-all focus:outline-none focus:ring-1 focus:ring-primary/50"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                /* Standard Contact Form */
                <motion.form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                >
                  {/* Honeypot Spam Bot Trap */}
                  <div className="absolute left-[-9999px] top-[-9999px] opacity-0 pointer-events-none" aria-hidden="true">
                    <label htmlFor="website_url">Do not fill this field if you are human</label>
                    <input
                      type="text"
                      id="website_url"
                      name="website_url"
                      value={formState.website_url}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Submission Fail/Error Warnings */}
                  {status === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex flex-col gap-2 font-mono"
                      role="alert"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="flex-shrink-0" />
                        <span>Transmission Error</span>
                      </div>
                      <p className="text-[11px] text-white/70 pl-5">{errorMessage}</p>
                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="self-start text-[10px] underline text-red-400 hover:text-red-300 font-bold focus:outline-none mt-1 pl-5"
                      >
                        Retry Submission
                      </button>
                    </motion.div>
                  )}

                  {/* Input Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="relative w-full">
                      <label
                        htmlFor="name"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                          focusedField === 'name' || formState.name
                            ? 'top-[-8px] text-[9px] text-primary bg-[#0B0F19] px-2 border border-primary/20 rounded'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onFocus={() => handleFocus('name')}
                        onBlur={() => handleBlur('name')}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:bg-white/[0.07] transition-all ${
                          errors.name 
                            ? 'border-red-500/40 focus:border-red-500' 
                            : 'border-white/10 focus:border-primary/50'
                        }`}
                        disabled={status === 'submitting'}
                        aria-required="true"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <AnimatePresence>
                        {errors.name && (
                          <motion.p
                            id="name-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-red-400 font-mono mt-1 pl-2 flex items-center gap-1"
                          >
                            <AlertCircle size={9} />
                            <span>{errors.name}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div className="relative w-full">
                      <label
                        htmlFor="email"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                          focusedField === 'email' || formState.email
                            ? 'top-[-8px] text-[9px] text-secondary bg-[#0B0F19] px-2 border border-secondary/20 rounded'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        onChange={handleChange}
                        className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:bg-white/[0.07] transition-all ${
                          errors.email 
                            ? 'border-red-500/40 focus:border-red-500' 
                            : 'border-white/10 focus:border-secondary/50'
                        }`}
                        disabled={status === 'submitting'}
                        aria-required="true"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            id="email-error"
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[9px] text-red-400 font-mono mt-1 pl-2 flex items-center gap-1"
                          >
                            <AlertCircle size={9} />
                            <span>{errors.email}</span>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Input Row 2: Phone and Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Phone Number */}
                    <div className="relative w-full">
                      <label
                        htmlFor="phone"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                          focusedField === 'phone' || formState.phone
                            ? 'top-[-8px] text-[9px] text-accent bg-[#0B0F19] px-2 border border-accent/20 rounded'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Phone Number (Optional)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formState.phone}
                          onFocus={() => handleFocus('phone')}
                          onBlur={() => handleBlur('phone')}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:border-accent/50 focus:bg-white/[0.07] transition-all"
                          disabled={status === 'submitting'}
                          aria-required="false"
                        />
                        <Phone size={12} className="absolute right-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative w-full">
                      <label
                        htmlFor="subject"
                        className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                          focusedField === 'subject' || formState.subject
                            ? 'top-[-8px] text-[9px] text-primary bg-[#0B0F19] px-2 border border-primary/20 rounded'
                            : 'top-4 text-white/40'
                        }`}
                      >
                        Subject (Optional)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onFocus={() => handleFocus('subject')}
                          onBlur={() => handleBlur('subject')}
                          onChange={handleChange}
                          className="w-full pl-4 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:bg-white/[0.07] transition-all"
                          disabled={status === 'submitting'}
                          aria-required="false"
                        />
                        <Tag size={12} className="absolute right-4 text-white/20 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="relative w-full">
                    <label
                      htmlFor="message"
                      className={`absolute left-4 transition-all duration-300 pointer-events-none font-mono text-xs ${
                        focusedField === 'message' || formState.message
                          ? 'top-[-8px] text-[9px] text-accent bg-[#0B0F19] px-2 border border-accent/20 rounded'
                          : 'top-4 text-white/40'
                      }`}
                    >
                      Write your message here... *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formState.message}
                      onFocus={() => handleFocus('message')}
                      onBlur={() => handleBlur('message')}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl font-sans text-xs text-white placeholder-transparent focus:outline-none focus:bg-white/[0.07] transition-all resize-none ${
                        errors.message 
                          ? 'border-red-500/40 focus:border-red-500' 
                          : 'border-white/10 focus:border-accent/50'
                      }`}
                      disabled={status === 'submitting'}
                      aria-required="true"
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.p
                          id="message-error"
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[9px] text-red-400 font-mono mt-1 pl-2 flex items-center gap-1"
                        >
                          <AlertCircle size={9} />
                          <span>{errors.message}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group relative px-6 py-3.5 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-bold font-display text-xs tracking-wider flex items-center justify-center gap-2 overflow-hidden shadow-glass transition-all hover:shadow-neon-cyan duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 size={14} className="animate-spin text-background" />
                        <span>TRANSMITTING DATA...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-background" />
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
