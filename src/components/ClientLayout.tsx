'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';
import CustomCursor from '@/components/CustomCursor';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  // Synchronize Scroll Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollProgress = document.getElementById('scroll-progress');
      if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SmoothScroll>
      <div className="relative min-h-screen bg-background text-white selection:bg-primary/30 selection:text-white">
        {/* Scroll Progress Bar */}
        <div id="scroll-progress" className="scroll-progress-bar" />

        {/* Preloader Screen */}
        <AnimatePresence mode="wait">
          {loading && (
            <LoadingScreen finishLoading={() => setLoading(false)} />
          )}
        </AnimatePresence>

        {/* Global Cursor Glow */}
        <CustomCursor />

        {/* Background Glowing Mesh Blobs (Pure CSS driven) */}
        <div className="blob-container select-none">
          <div 
            className="blob w-[35vw] h-[35vw] bg-primary/20 top-[10%] left-[-5%]" 
            style={{ animationDelay: '0s' }}
          />
          <div 
            className="blob w-[40vw] h-[40vw] bg-secondary/15 top-[40%] right-[-10%]" 
            style={{ animationDelay: '-5s' }}
          />
          <div 
            className="blob w-[30vw] h-[30vw] bg-accent/20 bottom-[10%] left-[15%]" 
            style={{ animationDelay: '-10s' }}
          />
        </div>

        {/* Core Layout Assembly */}
        {!loading && (
          <>
            <Navbar />
            <main className="w-full">{children}</main>
            <Footer />
            <BackToTop />
          </>
        )}
      </div>
    </SmoothScroll>
  );
}
