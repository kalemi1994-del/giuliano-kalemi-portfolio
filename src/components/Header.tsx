import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

export function Header({ activeSection, scrollToSection }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'Chi Sono' },
    { id: 'services', label: 'Servizi' },
    { id: 'method', label: 'Metodo' },
    { id: 'audit', label: 'Audit AI' },
    { id: 'contact', label: 'Contatti' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/70 backdrop-blur-md border-b border-slate-900/80 py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo / Name */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 text-left cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Sparkles size={18} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-none">
              Giuliano Kalemi
            </span>
            <span className="text-[10px] text-gray-400 font-mono tracking-wider uppercase block mt-0.5">
              AI & Marketing Strategist
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/40 p-1 rounded-full border border-slate-900/60 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-xs font-semibold rounded-full transition-colors duration-300 cursor-pointer ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-full z-[-1]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => scrollToSection('audit')}
            className="relative px-5 py-2.5 rounded-full overflow-hidden text-xs font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-1.5"
          >
            Audit Gratuito AI
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-b border-slate-900 bg-slate-950/95 backdrop-blur-lg w-full absolute top-full left-0 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'bg-indigo-600/10 border-l-2 border-indigo-500 text-white pl-4'
                      : 'text-gray-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  scrollToSection('audit');
                  setIsOpen(false);
                }}
                className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 text-center text-xs font-bold text-white shadow-lg shadow-indigo-500/15"
              >
                Inizia Audit Gratuito
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
