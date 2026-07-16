'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Request Animation Frame loop for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animFrame = requestAnimationFrame(raf);

    // Save lenis to window object for global scroll operations if needed
    (window as any).lenis = lenis;

    return () => {
      cancelAnimationFrame(animFrame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
