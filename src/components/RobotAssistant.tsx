import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Folder, Play, Mail, FileText, ChevronRight, Maximize2, ExternalLink } from 'lucide-react';
import { gmailComposeUrl } from '../utils/gmail';

interface Project {
  id: string;
  title: string;
  type: 'video' | 'image';
  src: string;
  desc: string;
  category: string;
}

export function RobotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [animPhase, setAnimPhase] = useState<'idle' | 'walking_in' | 'stopped' | 'waving' | 'speaking' | 'walking_out'>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [chatHistory, setChatHistory] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [speakingProgress, setSpeakingProgress] = useState(0); // for mouth animation
  const [showFolder, setShowFolder] = useState(false);
  const [activeLightboxProject, setActiveLightboxProject] = useState<Project | null>(null);
  const [quickPreviewProject, setQuickPreviewProject] = useState<Project | null>(null);
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());

  const markVideoLoaded = (id: string) => {
    setLoadedVideos((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Monitor prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Viewport tracking for precise relative translations
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute the target translation to center the robot
  const isMobile = viewportSize.width < 768;
  const robotWidth = isOpen ? 220 : 75;
  const paddingRight = isMobile ? 12 : 32;
  const paddingBottom = isMobile ? 12 : 32;

  // Center coordinates relative to the bottom-right corner anchor
  const targetX = -(viewportSize.width / 2) + paddingRight + (robotWidth / 2);
  const targetY = -(viewportSize.height / 2.3) + paddingBottom + (robotWidth / 2);

  const projects: Project[] = [
    {
      id: 'render3d',
      title: 'Rendering 3D Fotorealistico',
      type: 'video',
      src: '/render3d.mp4',
      category: 'Progettazione 3D',
      desc: 'Visualizzazioni tridimensionali e render architettonici fotorealistici per agenzie immobiliari, costruttori e designer. Perfetti per vendere o promuovere immobili sulla carta prima ancora di costruirli.'
    },
    {
      id: 'veo3',
      title: 'Due Torri di Bologna — Veo 3',
      type: 'video',
      src: '/veo3.mp4',
      category: 'Video AI Cinematografici',
      desc: 'Un racconto cinematografico immersivo generato interamente con Google Veo 3 e Higgsfield, rifinito da un occhio artistico umano per unire potenza tecnologica e autenticità narrativa.'
    },
    {
      id: 'strategy',
      title: 'Strategia AI & Marketing',
      type: 'video',
      src: '/strategia.mp4',
      category: 'Strategia Digitale',
      desc: 'Progettazione di flussi operativi automatizzati integrando i migliori strumenti di Intelligenza Artificiale per ottimizzare le campagne e moltiplicare i risultati operativi reali.'
    },
    {
      id: 'training',
      title: 'Formazione & Divulgazione AI',
      type: 'video',
      src: '/public/formazione.mp4',
      category: 'Cultura & Workshop',
      desc: 'Workshop interattivi e percorsi di formazione per team aziendali e professionisti, mirati a sviluppare competenze AI pratiche mantenendo sempre elevato il senso critico.'
    },
    {
      id: 'freeaudit',
      title: 'Audit Strategico Gratuito',
      type: 'image',
      src: '/public/audit.jpg',
      category: 'Analisi Strategica',
      desc: 'Un esame iniziale e approfondito dei flussi di lavoro aziendali per individuare colli di bottiglia e aree chiave in cui l\'automazione intelligente e l\'AI generativa possono fare la differenza.'
    }
  ];

  const quickReplies = [
    {
      q: 'Vedi i progetti 📁',
      a: 'Ecco i lavori e i progetti di Giuliano! Puoi cliccare su ciascuna anteprima per esplorare i dettagli di ogni produzione.',
      action: () => setShowFolder(true)
    },
    {
      q: 'Cosa fai esattamente?',
      a: 'Aiuto aziende e professionisti a usare l\'AI nel marketing: strategia, automazione, rendering 3D, contenuti e video AI (con Veo e Higgsfield) e formazione. Sempre con attenzione all\'etica e al pensiero critico.',
    },
    {
      q: 'Cosa intendi per automazione?',
      a: 'Automatizzo i processi ripetitivi del marketing con l\'AI: flussi di lavoro, integrazione tra strumenti e attività che prima richiedevano ore di lavoro manuale. Così il team si concentra su strategia e creatività.',
    },
    {
      q: 'Come funziona l\'audit gratuito?',
      a: 'È un\'analisi gratuita e senza impegno dei tuoi processi: guardo dove l\'AI e l\'automazione possono portarti valore concreto e immediato.',
    },
    {
      q: 'Che video AI fai?',
      a: 'Contenuti cinematografici e per i social, generati con l\'AI e rifiniti a mano — uso Veo e Higgsfield.',
    },
    {
      q: 'Come ti contatto?',
      a: 'Scrivi a kalemi1994@gmail.com, oppure su LinkedIn, Instagram (@iosonojulian_) o TikTok (@giuliano.kalemi).',
    },
    {
      q: 'Scrivi a Giuliano ✉️',
      a: 'Apri il client mail per scrivermi direttamente a kalemi1994@gmail.com.',
      action: () => {
        window.open(gmailComposeUrl('Richiesta dal sito'), '_blank');
      }
    }
  ];

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Walking animation logic helper
  useEffect(() => {
    let animId: NodeJS.Timeout;
    if (isSpeaking) {
      animId = setInterval(() => {
        setSpeakingProgress((prev) => (prev === 0 ? 1 : prev === 1 ? 2 : 0));
      }, 120);
    } else {
      setSpeakingProgress(0);
    }
    return () => clearInterval(animId);
  }, [isSpeaking]);

  // Clean emoji/symbols before TTS
  const cleanSpeechText = (text: string) => {
    return text
      .replace(/👋/g, '')
      .replace(/👇/g, '')
      .replace(/✉️/g, '')
      .replace(/😊/g, '')
      .replace(/🤖/g, '')
      .replace(/📁/g, '')
      .replace(/@/g, 'at')
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, ""); // strip all emojis
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    if (!speechEnabled) return;

    const cleaned = cleanSpeechText(text);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    speechUtteranceRef.current = utterance;

    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find((v) => v.lang.startsWith('it-IT')) || voices.find((v) => v.lang.startsWith('it'));
    if (italianVoice) {
      utterance.voice = italianVoice;
    }
    utterance.lang = 'it-IT';
    utterance.rate = 1.05;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Click Outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // SEQUENCE ACTION TRIGGERS
  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setShowNotification(false);

    if (prefersReducedMotion) {
      setAnimPhase('speaking');
      triggerConversationSequence();
    } else {
      // 1) CAMMINATA START
      setAnimPhase('walking_in');
      setTimeout(() => {
        // 2) STOP AL CENTRO
        setAnimPhase('stopped');
        
        setTimeout(() => {
          // 3) SALUTO CON LA MANO
          setAnimPhase('waving');
          
          setTimeout(() => {
            // 4) PARLA
            setAnimPhase('speaking');
            triggerConversationSequence();
          }, 1200); // waving duration

        }, 400); // settle duration

      }, 1500); // walking duration
    }
  };

  const triggerConversationSequence = () => {
    const greeting = 'Ciao! Come posso aiutarti?';
    setChatHistory([{ sender: 'bot', text: greeting }]);
    speakText(greeting);

    // Second speech bubble after a brief pause
    setTimeout(() => {
      const secondGreeting = 'Se vuoi vedere i progetti di Giuliano, te li mando qui 👇';
      setChatHistory((prev) => [...prev, { sender: 'bot', text: secondGreeting }]);
      speakText(secondGreeting);
      
      // Open projects folder with pop effect
      setShowFolder(true);
    }, 3000);
  };

  const handleClose = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setShowFolder(false);
    setActiveLightboxProject(null);
    setQuickPreviewProject(null);

    if (prefersReducedMotion) {
      setIsOpen(false);
      setAnimPhase('idle');
    } else {
      // Wave goodbye, then walk out
      setAnimPhase('waving');
      setTimeout(() => {
        setAnimPhase('walking_out');
        setTimeout(() => {
          setIsOpen(false);
          setAnimPhase('idle');
        }, 1500);
      }, 1000);
    }
  };

  const handleReplyClick = (reply: typeof quickReplies[0]) => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    setChatHistory((prev) => [...prev, { sender: 'user', text: reply.q }]);
    
    if (reply.action) {
      reply.action();
    }

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatHistory((prev) => [...prev, { sender: 'bot', text: reply.a }]);
      speakText(reply.a);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 right-0 z-50 flex flex-col items-center justify-end p-3 sm:p-8 pointer-events-none w-screen h-screen"
    >
      <div className="w-full h-full relative flex flex-col items-center justify-end pointer-events-none">
        
        {/* INTERACTIVE WORKSPACE GRID (Folder & Chat Dialogue) */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-stretch justify-center gap-6 mb-32 z-40 pointer-events-auto">
          
          {/* macOS STYLE PROJECT FOLDER CONTAINER */}
          <AnimatePresence>
            {showFolder && isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="flex-1 min-w-[300px] md:min-w-[450px] bg-slate-950/95 border border-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
              >
                {/* macOS Titlebar */}
                <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center select-none">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setShowFolder(false)} className="w-3 h-3 rounded-full bg-red-500 hover:brightness-75 transition-all cursor-pointer" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-gray-400 ml-2.5 flex items-center gap-1.5 font-bold">
                      <Folder size={12} className="text-[#5FA98E]" />
                      Lavori di Giuliano
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5FA98E] bg-[#5FA98E]/10 px-2 py-0.5 rounded-md border border-[#5FA98E]/20">
                    Progetti AI & 3D
                  </span>
                </div>

                {/* macOS File Grid */}
                <div className="p-6 overflow-y-auto max-h-[350px] grid grid-cols-2 gap-4 scrollbar-thin">
                  {projects.map((proj) => (
                    <motion.div
                      key={proj.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveLightboxProject(proj)}
                      className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 hover:border-[#5FA98E]/30 rounded-2xl p-3 flex flex-col gap-3 transition-all duration-300 cursor-pointer text-left overflow-hidden relative"
                    >
                      {/* Media container or placeholder */}
                      <div className="aspect-video w-full rounded-xl bg-gradient-to-tr from-slate-950 to-slate-900 border border-white/5 flex items-center justify-center overflow-hidden relative">
                        {/* Fallback dark/tech gradient — hides once the real video has loaded */}
                        {!loadedVideos.has(proj.id) && (
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 flex flex-col items-center justify-center p-2 text-center">
                            {proj.type === 'video' ? (
                              <Play size={18} className="text-[#5FA98E]/80 group-hover:scale-110 transition-transform mb-1.5" />
                            ) : (
                              <FileText size={18} className="text-[#5FA98E]/80 group-hover:scale-110 transition-transform mb-1.5" />
                            )}
                            <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">{proj.category}</span>
                          </div>
                        )}

                        {/* Attempting video loading anyway */}
                        {proj.type === 'video' && (
                          <video
                            src={proj.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            onLoadedData={() => markVideoLoaded(proj.id)}
                          />
                        )}
                      </div>

                      {/* Info label */}
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <p className="text-[11px] font-bold text-white group-hover:text-[#5FA98E] transition-colors leading-tight">
                            {proj.title}
                          </p>
                          <span className="text-[9px] text-gray-500 font-mono block mt-0.5">
                            {proj.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {proj.type === 'video' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickPreviewProject(quickPreviewProject?.id === proj.id ? null : proj);
                              }}
                              title="Guarda video"
                              className="p-1 rounded-md bg-[#5FA98E]/10 hover:bg-[#5FA98E]/20 border border-[#5FA98E]/20 text-[#5FA98E] transition-colors cursor-pointer"
                            >
                              <Play size={10} />
                            </button>
                          )}
                          <ChevronRight size={12} className="text-gray-600 group-hover:text-[#5FA98E] transition-colors mt-0.5 flex-shrink-0" />
                        </div>
                      </div>

                      {/* Mobile inline quick preview — appears under this card */}
                      {quickPreviewProject?.id === proj.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="md:hidden aspect-video w-full rounded-xl overflow-hidden border border-[#5FA98E]/30 relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <video
                            src={proj.src}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="auto"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuickPreviewProject(null);
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white"
                          >
                            <X size={10} />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DESKTOP QUICK VIDEO PREVIEW — opens beside the project folder */}
          <AnimatePresence>
            {quickPreviewProject && showFolder && isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -15 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -15 }}
                className="hidden md:flex flex-col w-[260px] bg-slate-950/95 border border-[#5FA98E]/30 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl self-start"
              >
                <div className="px-4 py-3 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono text-[#5FA98E] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Play size={11} /> Guarda video
                  </span>
                  <button
                    onClick={() => setQuickPreviewProject(null)}
                    className="p-1 rounded-md bg-slate-900 hover:bg-slate-850 text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </div>
                <div className="aspect-video w-full relative bg-slate-900">
                  <video
                    src={quickPreviewProject.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-bold text-white leading-tight">{quickPreviewProject.title}</p>
                  <span className="text-[9px] text-gray-500 font-mono block mt-0.5">{quickPreviewProject.category}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CHAT SPEECH BUBBLE & DIALOGUE */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="w-full md:w-[380px] bg-slate-950/95 border border-slate-900 shadow-2xl rounded-3xl overflow-hidden flex flex-col backdrop-blur-xl"
              >
                {/* Dialogue Header */}
                <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5FA98E] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5FA98E]"></span>
                    </span>
                    <span className="text-xs font-mono text-[#5FA98E] font-bold uppercase tracking-wider">
                      Umanoide AI Strategist
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Speech Toggle Button */}
                    <button
                      onClick={() => {
                        if (speechEnabled) {
                          setSpeechEnabled(false);
                          if (window.speechSynthesis) window.speechSynthesis.cancel();
                          setIsSpeaking(false);
                        } else {
                          setSpeechEnabled(true);
                        }
                      }}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        speechEnabled
                          ? 'bg-[#5FA98E]/10 border-[#5FA98E]/20 text-[#5FA98E]'
                          : 'bg-slate-900 border-white/5 text-gray-500 hover:text-white'
                      }`}
                      title={speechEnabled ? 'Disattiva Sintesi Vocale' : 'Attiva Sintesi Vocale'}
                    >
                      {speechEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    </button>

                    {/* Close button */}
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Dialog Screens */}
                <div className="p-5 space-y-4 max-h-[220px] overflow-y-auto flex flex-col scrollbar-thin">
                  {chatHistory.map((msg, index) => {
                    const isBot = msg.sender === 'bot';
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[90%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                            isBot
                              ? 'bg-slate-900 border border-slate-800 text-gray-100 rounded-tl-sm'
                              : 'bg-[#5FA98E]/20 border border-[#5FA98E]/30 text-white rounded-tr-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Typing status */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start items-center gap-1.5 text-xs text-[#5FA98E]/70 font-mono pl-2"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5FA98E] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5FA98E]"></span>
                      </span>
                      Il robot sta elaborando...
                    </motion.div>
                  )}
                </div>

                {/* Quick Replies Panel */}
                <div className="p-5 border-t border-slate-900 bg-slate-950/60">
                  <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-3 text-left">
                    Scegli cosa chiedermi:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-start max-h-[140px] overflow-y-auto scrollbar-thin">
                    {quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        disabled={isTyping}
                        onClick={() => handleReplyClick(reply)}
                        className="px-3 py-1.5 rounded-full bg-[#5FA98E]/10 hover:bg-[#5FA98E]/20 border border-[#5FA98E]/20 hover:border-[#5FA98E]/40 text-[#5FA98E] text-[11px] font-bold tracking-tight transition-all duration-300 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                      >
                        {reply.q}
                      </button>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ROBOT CHARACTER GRAPHIC */}
        <div className="absolute bottom-0 right-0 z-50 flex flex-col items-center pointer-events-auto">
          
          {/* Peeking bubble invitation */}
          {showNotification && !isOpen && (
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              onClick={handleOpen}
              className="absolute -top-12 right-12 bg-[#5FA98E] text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg shadow-[#5FA98E]/30 flex items-center gap-1.5 border border-white/10 cursor-pointer select-none whitespace-nowrap"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Parla Con Me!
            </motion.div>
          )}

          {/* Core SVG Robot Element with responsive positioning and walk cycles */}
          <motion.button
            onClick={isOpen ? handleClose : handleOpen}
            animate={
              isOpen
                ? {
                    x: targetX,
                    y: targetY,
                    scale: 1,
                    width: isMobile ? 180 : 250,
                    height: isMobile ? 180 : 250,
                  }
                : {
                    x: isMobile ? 10 : 30,
                    y: isMobile ? 5 : 20,
                    scale: 1,
                    width: isMobile ? 70 : 90,
                    height: isMobile ? 70 : 90,
                  }
            }
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 80,
              mass: 0.9,
            }}
            className={`cursor-pointer hover:brightness-110 transition-all duration-200 focus:outline-none select-none relative flex justify-center items-center ${
              !isOpen ? 'animate-bounce' : ''
            }`}
            style={{
              animationDuration: '3s',
            }}
          >
            {/* Soft Shadow below Robot */}
            {isOpen && (
              <motion.div
                animate={{
                  scale: [0.95, 1.05, 0.95],
                  opacity: [0.2, 0.35, 0.2],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-2 w-28 h-2 bg-black/40 rounded-full blur-sm"
              />
            )}

            {/* SVG Robot Artwork containing body, animatable arms, legs and glowing visor */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-2xl"
              fill="none"
              strokeWidth="2.5"
            >
              <defs>
                <linearGradient id="roboBody" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5FA98E" />
                  <stop offset="40%" stopColor="#4c8c74" />
                  <stop offset="100%" stopColor="#1e3e33" />
                </linearGradient>
                <radialGradient id="eyeVisor" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="antennaBeacon" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* MAIN ROBOT WRAPPER */}
              <g>
                
                {/* 1. LEFT LEG (Walk Animable) */}
                <motion.g
                  animate={
                    animPhase === 'walking_in' || animPhase === 'walking_out'
                      ? { rotate: [-22, 22, -22] }
                      : { rotate: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{ transformOrigin: '42px 75px' }}
                >
                  <rect x="39" y="72" width="6" height="15" rx="3" fill="#2d5e4d" stroke="#102a1e" strokeWidth="1.5" />
                  <rect x="36" y="84" width="10" height="5" rx="2" fill="#1e3e33" stroke="#102a1e" strokeWidth="1.5" />
                </motion.g>

                {/* 2. RIGHT LEG (Walk Animable) */}
                <motion.g
                  animate={
                    animPhase === 'walking_in' || animPhase === 'walking_out'
                      ? { rotate: [22, -22, 22] }
                      : { rotate: 0 }
                  }
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{ transformOrigin: '58px 75px' }}
                >
                  <rect x="55" y="72" width="6" height="15" rx="3" fill="#2d5e4d" stroke="#102a1e" strokeWidth="1.5" />
                  <rect x="54" y="84" width="10" height="5" rx="2" fill="#1e3e33" stroke="#102a1e" strokeWidth="1.5" />
                </motion.g>

                {/* 3. LEFT ARM (Waving/Indicating) */}
                <motion.g
                  animate={
                    animPhase === 'waving'
                      ? { rotate: [0, -110, -90, -110, -90, -110, 0] }
                      : animPhase === 'speaking' && showFolder
                      ? { rotate: -65 } // indicating to the folder window
                      : { rotate: 0 }
                  }
                  transition={{
                    duration: animPhase === 'waving' ? 1.2 : 0.5,
                    repeat: animPhase === 'waving' ? 1 : 0,
                    ease: 'easeInOut'
                  }}
                  style={{ transformOrigin: '28px 48px' }}
                >
                  {/* Shoulder */}
                  <circle cx="26" cy="48" r="4.5" fill="#1e3e33" stroke="#102a1e" strokeWidth="1.5" />
                  {/* Arm segment */}
                  <rect x="18" y="44" width="10" height="22" rx="4" fill="url(#roboBody)" stroke="#102a1e" strokeWidth="1.5" />
                  {/* Hand / Claw */}
                  <path d="M 18 64 Q 23 71 28 64" fill="none" stroke="#1e3e33" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>

                {/* 4. RIGHT ARM (Idle / Sidelong) */}
                <motion.g
                  animate={
                    animPhase === 'walking_in' || animPhase === 'walking_out'
                      ? { rotate: [-10, 15, -10] }
                      : { rotate: 0 }
                  }
                  transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: '72px 48px' }}
                >
                  {/* Shoulder */}
                  <circle cx="74" cy="48" r="4.5" fill="#1e3e33" stroke="#102a1e" strokeWidth="1.5" />
                  {/* Arm segment */}
                  <rect x="72" y="44" width="10" height="22" rx="4" fill="url(#roboBody)" stroke="#102a1e" strokeWidth="1.5" />
                  {/* Hand */}
                  <path d="M 72 64 Q 77 71 82 64" fill="none" stroke="#1e3e33" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>

                {/* 5. MAIN HEAD & BODY */}
                <motion.g
                  animate={
                    animPhase === 'walking_in' || animPhase === 'walking_out'
                      ? { y: [0, -3, 0] }
                      : { y: [0, -1.5, 0] }
                  }
                  transition={{
                    duration: animPhase === 'walking_in' || animPhase === 'walking_out' ? 0.3 : 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  {/* Neck connector */}
                  <rect x="46" y="38" width="8" height="6" rx="1.5" fill="#2d5e4d" stroke="#102a1e" strokeWidth="1.5" />

                  {/* Robot Torso / Chassis */}
                  <rect x="30" y="42" width="40" height="32" rx="12" fill="url(#roboBody)" stroke="#102a1e" strokeWidth="2.5" />
                  
                  {/* Small Energy Heart Core */}
                  <circle cx="50" cy="54" r="5" fill="#0d241a" stroke="#102a1e" strokeWidth="1" />
                  <circle
                    cx="50"
                    cy="54"
                    r="2"
                    fill="#22d3ee"
                    className="animate-pulse"
                    style={{ animationDuration: '1.2s' }}
                  />

                  {/* ANTENNA & BEACON LIGHT */}
                  <g>
                    <line x1="50" y1="18" x2="50" y2="6" stroke="#2d5e4d" strokeWidth="3" strokeLinecap="round" />
                    {(isSpeaking || !isOpen) && (
                      <circle
                        cx="50"
                        cy="5"
                        r={isSpeaking ? "12" : "6"}
                        fill="url(#antennaBeacon)"
                        className="animate-ping"
                        style={{ transformOrigin: '50px 5px', animationDuration: isSpeaking ? '0.5s' : '1.8s' }}
                      />
                    )}
                    <circle cx="50" cy="5" r="4.5" fill="#f59e0b" />
                  </g>

                  {/* HEAD PANEL */}
                  <rect x="32" y="16" width="36" height="26" rx="10" fill="url(#roboBody)" stroke="#102a1e" strokeWidth="2.5" />

                  {/* GLASS VISOR PANEL */}
                  <rect x="36" y="21" width="28" height="12" rx="5" fill="#0c1d16" stroke="#1a4736" strokeWidth="1.5" />

                  {/* LED GLOWING EYES */}
                  <g>
                    <circle cx="44" cy="27" r="3.5" fill="#0f2b20" />
                    <circle
                      cx="44"
                      cy="27"
                      r={isSpeaking ? "3" : "2"}
                      fill="url(#eyeVisor)"
                      className={isOpen ? 'animate-pulse' : ''}
                      style={{ animationDuration: '0.8s' }}
                    />
                    
                    <circle cx="56" cy="27" r="3.5" fill="#0f2b20" />
                    <circle
                      cx="56"
                      cy="27"
                      r={isSpeaking ? "3" : "2"}
                      fill="url(#eyeVisor)"
                      className={isOpen ? 'animate-pulse' : ''}
                      style={{ animationDuration: '0.8s' }}
                    />
                  </g>

                  {/* TALKING MOUTH SPEAKER BAR */}
                  <g>
                    <rect x="44" y="35.5" width="12" height="3" rx="1.5" fill="#0c1d16" />
                    {isSpeaking ? (
                      <motion.rect
                        x="46"
                        y={speakingProgress === 1 ? "36.5" : "36"}
                        width="8"
                        height={speakingProgress === 0 ? "1" : speakingProgress === 1 ? "2.5" : "1.8"}
                        rx="0.5"
                        fill="#22d3ee"
                        transition={{ duration: 0.1 }}
                      />
                    ) : (
                      <line x1="47" y1="37" x2="53" y2="37" stroke="#1a4736" strokeWidth="1" strokeLinecap="round" />
                    )}
                  </g>
                </motion.g>

              </g>
            </svg>
          </motion.button>
        </div>

      </div>

      {/* MAC OS LIGHTBOX COMPONENT FOR FULL RESOLUTION PREVIEW */}
      <AnimatePresence>
        {activeLightboxProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 pointer-events-auto"
            onClick={() => setActiveLightboxProject(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative"
            >
              {/* Lightbox macOS Bar */}
              <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/80 flex justify-between items-center select-none">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setActiveLightboxProject(null)} className="w-3 h-3 rounded-full bg-red-500 hover:brightness-75 transition-all cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-gray-400 ml-2.5 font-bold flex items-center gap-1.5">
                    <Maximize2 size={12} className="text-[#5FA98E]" />
                    Esplora Progetto
                  </span>
                </div>
              </div>

              {/* Lightbox Media */}
              <div className="aspect-video bg-gradient-to-tr from-slate-950 to-slate-900 border-b border-slate-900 flex items-center justify-center overflow-hidden relative">
                {!loadedVideos.has(activeLightboxProject.id) && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
                    {activeLightboxProject.type === 'video' ? <Play size={36} className="text-[#5FA98E] opacity-75 mb-3" /> : <FileText size={36} className="text-[#5FA98E] opacity-75 mb-3" />}
                    <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">{activeLightboxProject.category}</span>
                  </div>
                )}

                {activeLightboxProject.type === 'video' && (
                  <video
                    src={activeLightboxProject.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover opacity-100"
                    onLoadedData={() => markVideoLoaded(activeLightboxProject.id)}
                  />
                )}
              </div>

              {/* Lightbox Description */}
              <div className="p-6 space-y-4 text-left">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h3 className="text-lg font-black text-white">{activeLightboxProject.title}</h3>
                    <span className="text-xs font-mono text-[#5FA98E] uppercase tracking-wider block mt-0.5">{activeLightboxProject.category}</span>
                  </div>
                  <a
                    href={gmailComposeUrl('Richiesta Info Progetto')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-[#5FA98E]/10 hover:bg-[#5FA98E]/20 border border-[#5FA98E]/20 hover:border-[#5FA98E]/40 text-[#5FA98E] text-[11px] font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer no-underline"
                  >
                    Chiedi Info <ExternalLink size={11} />
                  </a>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {activeLightboxProject.desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
