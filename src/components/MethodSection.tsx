import React from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Compass, Layers, Milestone } from 'lucide-react';

export function MethodSection() {
  const steps = [
    {
      num: '01',
      icon: <ClipboardList className="text-indigo-400" size={20} />,
      title: 'Audit',
      desc: 'Analizzo gratuitamente i tuoi processi aziendali e i tuoi obiettivi di business per capire dove e come l\'AI può portare valore reale e immediato.',
      details: 'Senza fuffa: se l\'AI non serve, te lo dico chiaramente.'
    },
    {
      num: '02',
      icon: <Compass className="text-cyan-400" size={20} />,
      title: 'Strategia',
      desc: 'Definisco le priorità, scelgo gli strumenti più idonei e progetto flussi di lavoro su misura per le tue reali esigenze quotidiane.',
      details: 'Prima strutturiamo il pensiero, poi tocchiamo la tecnologia.'
    },
    {
      num: '03',
      icon: <Layers className="text-purple-400" size={20} />,
      title: 'Produzione',
      desc: 'Sviluppo i contenuti, i rendering 3D o i sistemi di automazione pianificati, curandoli con massima attenzione ai minimi dettagli.',
      details: 'Finitura artigianale guidata da una costante supervisione umana.'
    },
    {
      num: '04',
      icon: <Milestone className="text-emerald-400" size={20} />,
      title: 'Trasferimento',
      desc: 'Formo te e il tuo team attraverso percorsi dedicati affinché possiate gestire e continuare a far evolvere i nuovi flussi in completa autonomia.',
      details: 'Massima indipendenza operativa, senza vincoli.'
    },
  ];

  return (
    <section id="method" className="py-28 px-6 bg-slate-950/20 backdrop-blur-[1px] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            Come Lavoro
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Il Metodo
          </h2>
          <p className="text-gray-400 font-light leading-relaxed">
            Un percorso chiaro, strutturato e trasparente per integrare innovazione strategica e digitale nel tuo business.
          </p>
        </div>

        {/* Horizontal/Vertical Steps Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Background Connecting Line (for desktop) */}
          <div className="hidden lg:block absolute top-[120px] left-8 right-8 h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-emerald-500/20 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-slate-950/60 border border-slate-900/80 p-8 rounded-3xl relative z-10 shadow-xl flex flex-col justify-between h-full group hover:border-slate-800 transition-colors duration-300"
            >
              <div className="space-y-6">
                
                {/* Step Top Section */}
                <div className="flex justify-between items-center relative">
                  {/* Step Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 relative z-10">
                    {step.icon}
                  </div>
                  
                  {/* Step Number */}
                  <span className="text-4xl font-mono font-black text-slate-900 group-hover:text-indigo-950/40 transition-colors duration-500 select-none">
                    {step.num}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </div>

              {/* Sub-details note */}
              <div className="mt-6 pt-4 border-t border-slate-900/60">
                <p className="text-[11px] font-mono text-gray-500 italic">
                  {step.details}
                </p>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
