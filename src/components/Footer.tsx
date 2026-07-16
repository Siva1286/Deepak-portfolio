'use client';

import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
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
    <footer className="relative bg-[#070A11] border-t border-white/5 py-12 px-6 md:px-16 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
        {/* Left: Branding */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <a
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="font-display font-bold text-white text-lg tracking-wider hover:text-primary transition-colors"
          >
            DEEPAK P<span className="text-primary font-mono">.</span>
          </a>
          <p className="text-white/40 text-xs tracking-wider">
            AI & Data Science Student // Aspiring Data Analyst
          </p>
        </div>

        {/* Center: Internal Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-white/50">
          <a href="#about" onClick={(e) => handleScrollTo(e, '#about')} className="hover:text-primary transition-colors">About</a>
          <a href="#skills" onClick={(e) => handleScrollTo(e, '#skills')} className="hover:text-primary transition-colors">Skills</a>
          <a href="#projects" onClick={(e) => handleScrollTo(e, '#projects')} className="hover:text-primary transition-colors">Projects</a>
          <a href="#experience" onClick={(e) => handleScrollTo(e, '#experience')} className="hover:text-primary transition-colors">Experience</a>
          <a href="#contact" onClick={(e) => handleScrollTo(e, '#contact')} className="hover:text-primary transition-colors">Contact</a>
        </div>

        {/* Right: Social & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4">
            <a
              href="https://github.com/Siva1286"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="text-white/60 hover:text-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
            <a
              href="mailto:deepaksiva641@gmail.com"
              className="text-white/60 hover:text-accent transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
          <p className="text-[10px] md:text-xs text-white/30 tracking-wider">
            Designed and Developed by Deepak P &copy; 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
