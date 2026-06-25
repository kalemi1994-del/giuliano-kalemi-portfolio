import React from 'react';
import { motion } from 'motion/react';
import { Mail, Linkedin, Instagram, MapPin, Coffee, ArrowUpRight, MessageSquare, Sparkles } from 'lucide-react';
import { gmailComposeUrl } from '../utils/gmail';

export function ContactSection() {
  const contactInfo = [
    {
      id: 'email',
      icon: <Mail size={20} className="text-indigo-400" />,
      label: 'Email',
      value: 'kalemi1994@gmail.com',
      link: gmailComposeUrl('Richiesta dal sito'),
      action: 'Scrivi un messaggio'
    },
    {
      id: 'linkedin',
      icon: <Linkedin size={20} className="text-cyan-400" />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/giulianokalemi',
      link: 'https://linkedin.com/in/giulianokalemi',
      action: 'Connettiti'
    },
    {
      id: 'instagram',
      icon: <Instagram size={20} className="text-purple-400" />,
      label: 'Instagram',
      value: '@iosonojulian_',
      link: 'https://instagram.com/iosonojulian_',
      action: 'Seguimi'
    },
    {
      id: 'tiktok',
      icon: <MessageSquare size={20} className="text-emerald-400" />,
      label: 'TikTok',
      value: '@giuliano.kalemi',
      link: 'https://tiktok.com/@giuliano.kalemi',
      action: 'Guarda i video'
    }
  ];

  return (
    <section id="contact" className="py-28 px-6 bg-slate-950/20 backdrop-blur-[1px] relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            Parliamone
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Contatti
          </h2>
          <p className="text-gray-400 font-light leading-relaxed">
            Parliamone come davanti a un caffè. Raccontami le tue sfide e scopriamo insieme come valorizzare il tuo marketing con metodo, etica e tecnologia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Direct info (7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.id}
                href={info.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-950/60 border border-slate-900/80 p-6 rounded-2xl flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 shadow-xl group relative overflow-hidden cursor-pointer no-underline"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-xl transition-all group-hover:bg-indigo-500/[0.03] z-[-1]" />
                
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                    {info.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block mb-0.5">
                      {info.label}
                    </span>
                    <span className="text-sm font-bold text-white block truncate group-hover:text-indigo-300 transition-colors">
                      {info.value}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 group-hover:text-white transition-colors mt-6 pt-4 border-t border-slate-900/40">
                  {info.action}
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Right Column: Coffee Cup / City Location Map (5 cols on lg) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-slate-950/60 border border-slate-900/80 p-8 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden shadow-2xl backdrop-blur-sm"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl z-[-1]" />
              
              <div className="space-y-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <MapPin size={20} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Sede & Operatività</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Ho base a <strong className="text-white font-medium">Bologna, Italia</strong>, ma collaboro con aziende, professionisti e agenzie digitali su tutto il territorio nazionale ed europeo.
                  </p>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Coffee size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Disponibile</h4>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      In presenza a Bologna o da remoto ovunque.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-900/60 space-y-2">
                <p className="text-[11px] font-mono text-gray-500">
                  “L'AI non sostituisce il pensiero: lo amplifica. Il mio lavoro è tenere insieme la potenza degli strumenti e la responsabilità di chi li usa.”
                </p>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                  — Giuliano Kalemi
                </span>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
