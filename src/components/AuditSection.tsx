import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Send, Copy, RotateCcw, AlertCircle, Coffee, Check, Mail, ArrowUpRight, Upload, FileText, X } from 'lucide-react';
import { gmailComposeUrl } from '../utils/gmail';

export function AuditSection() {
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  const [website, setWebsite] = useState('');
  const [challenges, setChallenges] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingTexts = [
    ...(file ? ['Leggendo il documento caricato...'] : []),
    'Analizzando il tuo posizionamento di mercato...',
    'Rimuovendo l\'hype tecnologico inutile...',
    'Integrando la filosofia strategica di Giuliano...',
    'Curando i dettagli con occhio umano...',
    'Pronto, ti aspetto davanti a un caffè virtuale...',
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingTexts.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !sector || !challenges) return;

    setIsLoading(true);
    setError(null);
    setAuditResult(null);

    try {
      const formData = new FormData();
      formData.append('companyName', companyName);
      formData.append('sector', sector);
      formData.append('website', website);
      formData.append('challenges', challenges);
      formData.append('email', email);
      if (file) formData.append('document', file);

      const response = await fetch('/api/audit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Qualcosa è andato storto nella generazione dell\'audit.');
      }

      setAuditResult(data.audit);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Errore di connessione al server.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(auditResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setAuditResult(null);
    setCompanyName('');
    setSector('');
    setWebsite('');
    setChallenges('');
    setEmail('');
    setFile(null);
    setError(null);
  };

  const MAX_FILE_SIZE = 8 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_SIZE) {
      setError('Il documento è troppo grande (massimo 8MB).');
      e.target.value = '';
      return;
    }
    setError(null);
    setFile(selected);
  };

  return (
    <section id="audit" className="py-28 px-6 bg-slate-950/40 relative">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/5 via-transparent to-cyan-950/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            AI Simulator
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Audit Gratuito AI
          </h2>
          <p className="text-gray-400 font-light leading-relaxed">
            Invia i tuoi dati di business per ricevere un'analisi strategica preliminare immediata, elaborata secondo il mio modello strategico umano ed etico.
          </p>
        </div>

        {/* Dual Panel Workspace Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Panel: Form (5 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-950/80 border border-slate-900/80 p-8 rounded-3xl shadow-2xl h-full flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl z-[-1]" />
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Dati dell'attività</h3>
                    <p className="text-xs text-gray-400">I campi con l'asterisco (*) sono richiesti.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left interactive-portfolio">
                  
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Nome Azienda / Professionista *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="es. Studio Immobiliare Bologna o Giuliano S.r.l."
                      value={companyName}
                      disabled={isLoading || !!auditResult}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-indigo-500/50 text-white text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Settore di attività *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="es. Immobiliare, E-commerce, Consulenza..."
                      value={sector}
                      disabled={isLoading || !!auditResult}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-indigo-500/50 text-white text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Sito Web / Canale Social Principale
                    </label>
                    <input
                      type="text"
                      placeholder="es. www.azienda.it o instagram.com/..."
                      value={website}
                      disabled={isLoading || !!auditResult}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-indigo-500/50 text-white text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Qual è la tua sfida o obiettivo di marketing? *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="es. Voglio integrare l'AI per velocizzare la scrittura dei copy o ho bisogno di render 3D fotorealistici per vendere immobili sulla carta."
                      value={challenges}
                      disabled={isLoading || !!auditResult}
                      onChange={(e) => setChallenges(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-indigo-500/50 text-white text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50 resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Tua Email (opzionale)
                    </label>
                    <input
                      type="email"
                      placeholder="es. nome@email.it (per contatti futuri)"
                      value={email}
                      disabled={isLoading || !!auditResult}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-indigo-500/50 text-white text-sm focus:outline-none transition-colors duration-300 disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
                      Carica un documento (opzionale)
                    </label>
                    {file ? (
                      <div className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm text-white truncate">
                          <FileText size={16} className="text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </span>
                        {!isLoading && !auditResult && (
                          <button
                            type="button"
                            onClick={() => setFile(null)}
                            className="text-gray-500 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <label className={`w-full px-4 py-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 hover:border-indigo-500/50 text-gray-400 hover:text-indigo-300 text-sm flex items-center justify-center gap-2 transition-colors duration-300 cursor-pointer ${isLoading || !!auditResult ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload size={15} />
                        Carica PDF o DOCX per un'analisi personalizzata
                        <input
                          type="file"
                          accept=".pdf,.docx"
                          disabled={isLoading || !!auditResult}
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {!auditResult && (
                    <button
                      type="submit"
                      disabled={isLoading || !companyName || !sector || !challenges}
                      className="w-full py-4 mt-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={14} />
                      Genera Report di Audit AI
                    </button>
                  )}
                </form>
              </div>

              {auditResult && (
                <button
                  onClick={handleReset}
                  className="w-full py-3.5 mt-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  Fai un altro audit
                </button>
              )}
            </div>
          </div>

          {/* Right Panel: Live Output Terminal (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-950/80 border border-slate-900/80 rounded-3xl h-full flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md relative min-h-[480px]">
              
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-slate-900 bg-slate-950 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-gray-500 ml-2">audit_terminal.md</span>
                </div>

                {auditResult && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors duration-300 cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      {copied ? 'Copiato' : 'Copia'}
                    </button>
                  </div>
                )}
              </div>

              {/* Content Panel */}
              <div className="flex-1 p-8 overflow-y-auto max-h-[550px] relative">
                <AnimatePresence mode="wait">
                  {/* Scenario 1: Idle state */}
                  {!isLoading && !auditResult && !error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16"
                    >
                      <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 text-indigo-400 animate-pulse">
                        <Coffee size={28} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-white font-bold">Pronto all'analisi</h4>
                        <p className="text-gray-400 text-xs max-w-sm leading-relaxed">
                          Compila il modulo a sinistra per avviare il mio consulente strategico virtuale. In pochi secondi riceverai un audit strutturato ed etico.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Scenario 2: Loading state */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
                    >
                      {/* Interactive Loading Rings */}
                      <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/10" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 animate-spin" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-white font-mono font-medium text-xs tracking-widest uppercase">
                          Elaborazione in corso...
                        </h4>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={loadingStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-indigo-400 font-mono text-xs"
                          >
                            {loadingTexts[loadingStep]}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  {/* Scenario 3: Error state */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
                    >
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <AlertCircle size={24} />
                      </div>
                      <div className="space-y-1 max-w-md">
                        <h4 className="text-white font-bold">Errore di Generazione</h4>
                        <p className="text-red-400/80 text-xs leading-relaxed">
                          {error}
                        </p>
                      </div>
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-white hover:bg-slate-850 transition-colors cursor-pointer"
                      >
                        Riprova
                      </button>
                    </motion.div>
                  )}

                  {/* Scenario 4: Output Rendering */}
                  {auditResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-left prose prose-invert max-w-none text-slate-300 font-sans"
                    >
                      <ReactMarkdown
                        components={{
                          h1: ({ node, ...props }) => <h1 className="text-xl font-black text-white mt-6 mb-4 border-b border-slate-900 pb-2 flex items-center gap-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-indigo-400 mt-6 mb-2 uppercase tracking-wide" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-cyan-400 mt-4 mb-2" {...props} />,
                          p: ({ node, ...props }) => <p className="text-sm text-gray-300 leading-relaxed mb-4" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-xs text-gray-300" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-xs text-gray-300" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-0.5" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-white bg-indigo-500/5 px-1 py-0.5 rounded border border-indigo-500/10" {...props} />,
                          a: ({ node, ...props }) => <a className="text-cyan-400 hover:underline hover:text-cyan-300 font-medium inline-flex items-center gap-0.5" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {auditResult}
                      </ReactMarkdown>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Banner for Result */}
              {auditResult && (
                <div className="p-6 border-t border-slate-900 bg-slate-950/90 backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
                  <div className="text-left">
                    <p className="text-white text-xs font-bold flex items-center gap-1.5">
                      <Coffee size={14} className="text-indigo-400" />
                      Parliamone davanti a un caffè?
                    </p>
                    <p className="text-gray-400 text-[10px] leading-normal">
                      Questo report è preliminare. Creiamo insieme una strategia d'azione reale.
                    </p>
                  </div>
                  <a
                    href={gmailComposeUrl('Richiesta Audit Approfondito')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 flex items-center gap-1.5 transition-all duration-300 hover:scale-105 cursor-pointer no-underline"
                  >
                    <Mail size={12} />
                    Scrivimi Ora
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
