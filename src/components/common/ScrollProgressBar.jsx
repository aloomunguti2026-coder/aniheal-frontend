import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollProgressBar Component
 * Renders a high-precision green progress indicator at the top of the viewport
 * showing exact page scroll position with glow effects.
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const isPublicPage = !location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  if (!isPublicPage) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3.5px] z-[9999] pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-emerald-500 to-teal-400 transition-all duration-150 ease-out rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.85)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
