'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Core coordinates (will be updated instantly on mouse move)
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Damped coordinates for the outer ring using spring physics
  const springConfig = { damping: 35, stiffness: 280, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Bind event listeners
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Track hovered elements for resizing effects
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive-cursor') ||
        target.getAttribute('role') === 'button';

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Trailing Glow Ring */}
      <motion.div
        className={`custom-cursor ${isHovered ? 'custom-cursor-hover' : ''}`}
        style={{
          x: ringX,
          y: ringY,
        }}
      />
      {/* Inner Glowing Center Dot */}
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
    </>
  );
}
