import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTopButton Component
 * Floating action button that appears after scrolling down, displaying a circular green progress
 * indicator ring and smooth-scrolling the user back to the top of the page.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  const isPublicPage = !location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isPublicPage) return null;

  // SVG circular progress calculation
  const size = 48;
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
        visible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        title="Scroll to top"
        className="relative w-12 h-12 rounded-full bg-surface-clinical text-primary shadow-lg border border-border-hairline hover:bg-surface-tinted hover:shadow-xl transition-all flex items-center justify-center group cursor-pointer"
      >
        {/* SVG Circular Progress Ring */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-surface-container"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active Green Indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-primary transition-all duration-150"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Arrow Up Icon */}
        <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:-translate-y-0.5">
          keyboard_arrow_up
        </span>
      </button>
    </div>
  );
}
