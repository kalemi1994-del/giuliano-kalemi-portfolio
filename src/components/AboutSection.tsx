import React from 'react';
import { motion } from 'motion/react';
import { Coffee, ShieldCheck, Heart, Eye } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 px-6 bg-slate-950/20 backdrop-blur-[1px]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
                Chi Sono
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Vengo dal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">mondo digitale</span>.
              </h2>
            </div>

            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">
              Oggi aiuto aziende e professionisti a usare l'intelligenza artificiale nel marketing{' '}
              <strong className="text-white font-semibold underline decoration-indigo-500 decoration-2 underline-offset-4">
                senza perdere la parte umana
              </strong>. Unisco strategia, creatività e tecnologia: dalla consulenza alla produzione di contenuti, fino alla formazione.
            </p>

            <div className="space-y-6">
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Mi interessa soprattutto la <strong className="text-gray-200 font-medium">dimensione etica dell'AI</strong> — tenere insieme strumenti potenti e responsabilità — e portare <strong className="text-gray-200 font-medium">pensiero critico</strong> dove di solito c'è solo hype. Non vendo la tecnologia: la spiego, la metto alla prova e la uso solo quando serve davvero.
              </p>
              
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Il mio approccio è <strong className="text-indigo-400 font-semibold">"come davanti a un caffè"</strong>: informale, concreto, curioso. Prima la strategia, poi la tecnologia.
              </p>
            </div>

            {/* Core Values Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div className="bg-slate-950/50 border border-slate-900/60 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-white font-bold text-sm">Etica & Trasparenza</h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Usare strumenti potenti con senso di responsabilità e massima chiarezza.
                </p>
              </div>

              <div className="bg-slate-950/50 border border-slate-900/60 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Eye size={20} />
                </div>
                <h3 className="text-white font-bold text-sm">Pensiero Critico</h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Superare l'hype. Testare l'AI nel concreto e integrarla solo dove serve davvero.
                </p>
              </div>

              <div className="bg-slate-950/50 border border-slate-900/60 p-5 rounded-2xl space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Heart size={20} />
                </div>
                <h3 className="text-white font-bold text-sm">Approccio Umano</h3>
                <p className="text-xs text-gray-400 leading-normal">
                  Sviluppare legami informali, leali e trasparenti, davanti a un caffè.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Beautiful Illustration (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 rounded-3xl blur-3xl z-[-1]" />
              
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center text-center">
                
                {/* SVG Smoking Coffee Cup representation of "Davanti a un Caffè" */}
                <div className="w-40 h-40 relative flex items-center justify-center mb-6">
                  {/* Digital Steam drifts up */}
                  <div className="absolute top-2 flex justify-center gap-6 w-full h-12">
                    <motion.div
                      animate={{ y: [-10, -40], opacity: [0, 0.8, 0], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                      className="text-[10px] font-mono text-indigo-400/60"
                    >
                      &lt;AI&gt;
                    </motion.div>
                    <motion.div
                      animate={{ y: [-15, -45], opacity: [0, 1, 0], scale: [0.9, 1.3, 0.9] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.8 }}
                      className="text-[10px] font-mono text-cyan-400/60"
                    >
                      0101
                    </motion.div>
                    <motion.div
                      animate={{ y: [-10, -35], opacity: [0, 0.7, 0], scale: [0.8, 1.1, 0.8] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
                      className="text-[10px] font-mono text-purple-400/60"
                    >
                      &#123;human&#125;
                    </motion.div>
                  </div>

                  <svg viewBox="0 0 100 100" className="w-32 h-32 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {/* Steam Lines */}
                    <path d="M40 30 Q45 20 40 10 M50 30 Q55 18 50 10 M60 30 Q65 22 60 10" stroke="url(#steamGrad)" strokeLinecap="round" strokeWidth="2">
                      <animate attributeName="stroke-dashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
                    </path>
                    
                    {/* Coffee Cup Body */}
                    <path d="M25 40 L30 75 Q32 85 50 85 Q68 85 70 75 L75 40 Z" fill="rgba(15, 23, 42, 0.8)" stroke="currentColor" />
                    
                    {/* Cup Handle */}
                    <path d="M74 48 C83 48 83 66 71 66" stroke="currentColor" strokeLinecap="round" />
                    
                    {/* Dish / Saucer */}
                    <path d="M15 90 L85 90 Q90 90 90 92 L10 92 Q10 90 15 90 Z" fill="rgba(99, 102, 241, 0.1)" stroke="currentColor" />
                    
                    {/* Gradient Definitions */}
                    <defs>
                      <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className="absolute bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-mono text-[10px] text-cyan-400 shadow-inner bottom-4 animate-bounce">
                    100% HumAI-n
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <p className="text-white font-bold text-lg flex items-center justify-center gap-2">
                    <Coffee size={18} className="text-indigo-400" />
                    Davanti a un Caffè
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Il mio approccio preferito: ascolto, curiosità, concretezza. Niente barriere, prima parliamo di obiettivi e poi degli strumenti ideali.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
