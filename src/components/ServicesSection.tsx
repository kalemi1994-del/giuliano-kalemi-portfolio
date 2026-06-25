import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Box, Film, GraduationCap, Sparkles, ArrowRight, Bot, Code2 } from 'lucide-react';

interface ServicesSectionProps {
  scrollToSection: (id: string) => void;
}

export function ServicesSection({ scrollToSection }: ServicesSectionProps) {
  const services = [
    {
      id: 'strat',
      icon: <Cpu className="text-indigo-400" size={24} />,
      title: 'Strategia marketing AI',
      desc: 'Integro l\'AI nei processi di marketing con metodo: workflow, automazioni e gli strumenti giusti, adottati nei flussi reali dell\'azienda. Prima capisco l\'obiettivo, poi scelgo la tecnologia — mai il contrario. Sviluppiamo anche la strategia social media: piano editoriale, tono di voce e contenuti coerenti con gli obiettivi di business.',
      badge: 'Strategia'
    },
    {
      id: 'render',
      icon: <Box className="text-cyan-400" size={24} />,
      title: 'Rendering 3D',
      desc: 'Visualizzazioni architettoniche e render 3D fotorealistici per il settore immobiliare e non solo: immobili da vendere, ristrutturazioni, progetti ancora su carta. Spazi che convincono prima ancora di esistere.',
      badge: 'Visual 3D'
    },
    {
      id: 'content',
      icon: <Film className="text-purple-400" size={24} />,
      title: 'Contenuti AI & video cinematografici',
      desc: 'Video cinematografici, visual e copy generati o assistiti con strumenti all\'avanguardia come Veo 3, Higgsfield e altri tool AI di ultima generazione. Storytelling immersivo ed emozionante (come il racconto delle Due Torri di Bologna), sempre rifinito dall\'occhio e dalla sensibilità umana.',
      badge: 'Produzione & Veo 3'
    },
    {
      id: 'automation-claude',
      icon: <Bot className="text-emerald-400" size={24} />,
      title: 'Automazione con Claude Code',
      desc: 'Automazione con Claude Code attraverso lClaude per le piccole imprese all\'interno di Claude Cowork. Collega gli strumenti che già utilizzi e scegli l\'incarico: Claude si occupa del lavoro e tu approvi prima che qualsiasi cosa venga inviata, pubblicata o pagata. Il sistema include 15 flussi di lavoro agentici pronti all\'uso per finanza, operazioni, vendite, marketing, risorse umane e assistenza clienti, oltre a 15 competenze basate sulle attività ripetitive che ti rallentano maggiormente.',
      badge: 'Claude Cowork'
    },
    {
      id: 'training',
      icon: <GraduationCap className="text-amber-400" size={24} />,
      title: 'Formazione & divulgazione AI',
      desc: 'Workshop e percorsi su misura per aziende, team e professionisti: l\'AI applicata davvero agli strumenti e ai flussi quotidiani, con un\'attenzione costante al pensiero critico e all\'uso consapevole.',
      badge: 'Workshop'
    },
    {
      id: 'webapp',
      icon: <Code2 className="text-rose-400" size={24} />,
      title: 'Sviluppo siti web & app',
      desc: 'Progetto e realizzo siti web e applicazioni su misura, dal portfolio personale alle piattaforme con funzionalità AI integrate (form intelligenti, automazioni, chatbot). Codice pulito, performance reali e un design che comunica chi sei senza fronzoli inutili.',
      badge: 'Web & App'
    },
    {
      id: 'audit-card',
      icon: <Sparkles className="text-indigo-400" size={24} />,
      title: 'Audit gratuito',
      desc: 'Un\'analisi gratuita e approfondita dei tuoi processi, per individuare dove l\'AI può portare valore concreto e immediato al tuo marketing e alla tua operatività aziendale. Il punto di partenza, senza alcun impegno.',
      badge: 'Analisi Gratis',
      isSpecial: true
    },
  ];

  return (
    <section id="services" className="py-28 px-6 bg-slate-950/40 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            Cosa Faccio
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            I Servizi
          </h2>
          <p className="text-gray-400 font-light leading-relaxed">
            Metto l'intelligenza artificiale, l'automazione agentica con Claude Code e la progettazione 3D al servizio della tua attività, ponendo al centro la competenza umana e l'etica professionale.
          </p>
        </div>

        {/* Services Grid (Bento style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`rounded-2xl border p-8 shadow-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                s.isSpecial
                  ? 'bg-gradient-to-b from-indigo-950/50 to-slate-950 border-indigo-500/30 shadow-indigo-500/5 hover:border-indigo-500/60 lg:col-span-3'
                  : 'bg-slate-950/60 border-slate-900/80 hover:border-slate-800 shadow-slate-950/50'
              }`}
            >
              <div className="space-y-6">
                {/* Top Badge & Icon */}
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-xl ${s.isSpecial ? 'bg-indigo-500/15' : 'bg-slate-900/80'} border border-white/5`}>
                    {s.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-gray-400">
                    {s.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {s.desc}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {s.isSpecial ? (
                  <button
                    onClick={() => scrollToSection('audit')}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors duration-300 group/btn cursor-pointer"
                  >
                    Ottieni il tuo audit gratuito ora
                    <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors duration-300 group/btn cursor-pointer"
                  >
                    Chiedi info
                    <ArrowRight size={14} className="transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
