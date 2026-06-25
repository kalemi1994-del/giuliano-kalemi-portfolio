/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CosmicCanvas } from './components/CosmicCanvas';
import { useGameStore } from './store/useGameStore';
import { Header } from './components/Header';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { MethodSection } from './components/MethodSection';
import { AuditSection } from './components/AuditSection';
import { ContactSection } from './components/ContactSection';
import { CanvasControls } from './components/CanvasControls';
import { RobotAssistant } from './components/RobotAssistant';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

export default function App() {
  const connect = useGameStore((state) => state.connect);
  const disconnect = useGameStore((state) => state.disconnect);
  const players = useGameStore((state) => state.players);
  const myColor = useGameStore((state) => state.myColor);

  const [activeSection, setActiveSection] = useState('hero');
  const [isCanvasEnabled, setIsCanvasEnabled] = useState(true);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const playerCount = Object.keys(players).length + 1;

  // Scroll spy to active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250; // offset for triggers
      const sections = ['hero', 'about', 'services', 'method', 'audit', 'contact'];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      
      {/* Dynamic 3D Particle Canvas Background */}
      {isCanvasEnabled ? (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
          <CosmicCanvas />
          {/* Subtle vignette layer */}
          <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#020208_95%] pointer-events-none" />
        </div>
      ) : (
        <div className="fixed inset-0 w-full h-full bg-[#030308] z-0" />
      )}

      {/* Shared Nav Header */}
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      {/* Scrollable Content Container */}
      <main className="relative z-10 w-full pointer-events-none">
        
        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-screen flex flex-col justify-center items-center px-6 text-center pt-24 pb-12 relative"
        >
          <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center">
            
            {/* Animated Ochhiello Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="flex items-center gap-2 bg-indigo-500/15 border border-indigo-500/20 px-4 py-2 rounded-full shadow-lg shadow-indigo-500/5 pointer-events-auto"
            >
              <Sparkles size={14} className="text-indigo-400 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                AI & Marketing Strategist · Bologna
              </span>
            </motion.div>

            {/* Main Title Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none text-white max-w-3xl"
            >
              Intelligenza artificiale al servizio del marketing.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
                Con la parte umana al centro.
              </span>
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="text-base sm:text-lg md:text-xl text-gray-300 font-light max-w-2xl leading-relaxed"
            >
              Strategia, contenuti, rendering 3D e formazione — potenziati dall'AI, curati da chi sa ancora perché lo fa.
            </motion.p>

            {/* Call To Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4 pointer-events-auto"
            >
              <button
                onClick={() => scrollToSection('audit')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                Inizia l'Audit Gratuito
                <ArrowRight size={16} />
              </button>
              
              <button
                onClick={() => scrollToSection('services')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-white font-bold text-sm tracking-wide shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Guarda i Servizi
              </button>
            </motion.div>

          </div>

          {/* Scroll Down Indicator */}
          <motion.button
            onClick={() => scrollToSection('about')}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 text-gray-400 hover:text-white pointer-events-auto transition-colors cursor-pointer flex flex-col items-center gap-1"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Scopri di più</span>
            <ChevronDown size={18} />
          </motion.button>
        </section>

        {/* Dynamic Inner Page Sections */}
        <div className="pointer-events-auto relative z-10 w-full space-y-0">
          <AboutSection />
          <ServicesSection scrollToSection={scrollToSection} />
          <MethodSection />
          <AuditSection />
          <ContactSection />
        </div>

        {/* Footer */}
        <footer className="py-12 bg-black border-t border-slate-950 text-center text-gray-500 text-xs pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left">
              <p className="font-bold text-white text-sm">Giuliano Kalemi</p>
              <p className="text-xs text-gray-400 mt-1">Bologna, Italia · AI & Marketing Strategy</p>
            </div>
            <p className="font-mono text-[10px] tracking-wider text-gray-600">
              © {new Date().getFullYear()} GIULIANO KALEMI. TUTTI I DIRITTI RISERVATI.
            </p>
          </div>
        </footer>

      </main>

      {/* Floating Canvas controls */}
      <CanvasControls
        isCanvasEnabled={isCanvasEnabled}
        setIsCanvasEnabled={setIsCanvasEnabled}
        playerCount={playerCount}
        myColor={myColor}
      />

      {/* Interactive Umanoide AI Robot Assistant */}
      <RobotAssistant />

    </div>
  );
}
