"use client";

import { useEffect, useState } from 'react';
import { Moon, Sun, ArrowUp, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-gray-200 dark:border-gray-700"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6 text-gray-800 dark:text-yellow-400" />
      ) : (
        <Sun className="w-6 h-6 text-yellow-500" />
      )}
    </button>
  );
}

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-orange-300/20 to-purple-300/20 dark:from-orange-500/10 dark:to-purple-500/10 rounded-full animate-float blur-xl"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-teal-300/20 to-blue-300/20 dark:from-teal-500/10 dark:to-blue-500/10 rounded-full animate-float-delayed blur-xl"></div>
      <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-300/20 to-orange-300/20 dark:from-pink-500/10 dark:to-orange-500/10 rounded-full animate-float-slow blur-xl"></div>
      <div className="absolute top-1/2 right-1/4 w-28 h-28 bg-gradient-to-br from-purple-300/20 to-pink-300/20 dark:from-purple-500/10 dark:to-pink-500/10 rounded-full animate-float blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-500/10 dark:to-orange-500/10 rounded-full animate-float-delayed blur-xl"></div>
      
      {/* Sparkles */}
      <div className="absolute top-1/3 left-1/3 animate-pulse-slow">
        <Sparkles className="w-8 h-8 text-orange-400/30 dark:text-orange-400/20" />
      </div>
      <div className="absolute top-2/3 right-1/3 animate-pulse-slower">
        <Sparkles className="w-6 h-6 text-purple-400/30 dark:text-purple-400/20" />
      </div>
      <div className="absolute top-1/4 right-1/2 animate-pulse">
        <Sparkles className="w-5 h-5 text-teal-400/30 dark:text-teal-400/20" />
      </div>
    </div>
  );
}

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-50/20 to-purple-50/20 dark:via-orange-950/10 dark:to-purple-950/10"></div>
    </div>
  );
}
