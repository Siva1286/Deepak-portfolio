'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // scrolling down
      } else {
        setIsVisible(true); // scrolling up
      }
      
      setLastScrollY(currentScrollY);
      
      // Determine active section
      for (const item of navItems) {
        const sectionId = item.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Handle smooth scroll using Lenis
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    
    if (element) {
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(element, { offset: -80 });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <nav className="w-full max-w-5xl glass-panel px-6 py-3 rounded-full flex items-center justify-between shadow-glass relative">
          {/* Logo */}
          <a 
            href="#home" 
            onClick={(e) => handleScrollTo(e, '#home')}
            className="flex items-center gap-2 font-display text-white font-bold tracking-wider hover:text-primary transition-colors"
          >
            <span className="text-primary font-mono">&lt;</span>
            <span>DEEPAK_P</span>
            <span className="text-secondary font-mono">/&gt;</span>
          </a>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all relative ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Connect Action Button */}
          <a
            href="#contact"
            onClick={(e) => handleScrollTo(e, '#contact')}
            className="hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-primary to-secondary text-background hover:shadow-neon-cyan transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Connect <ArrowUpRight size={14} />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-primary transition-colors p-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col justify-center p-8 lg:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="flex flex-col gap-6 text-center">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="text-2xl font-display font-medium text-white/80 hover:text-primary transition-colors"
                  >
                    {item.name}
                  </a>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
                className="mt-6 flex justify-center"
              >
                <a
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, '#contact')}
                  className="px-8 py-3 rounded-full text-base font-bold bg-gradient-to-r from-primary to-secondary text-background inline-flex items-center gap-2 hover:shadow-neon-cyan transition-all"
                >
                  Get In Touch <ArrowUpRight size={18} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
