import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Users, Sparkles, Sliders, Info, HelpCircle } from 'lucide-react';

interface CanvasControlsProps {
  isCanvasEnabled: boolean;
  setIsCanvasEnabled: (enabled: boolean) => void;
  playerCount: number;
  myColor: string | null;
}

export function CanvasControls({
  isCanvasEnabled,
  setIsCanvasEnabled,
  playerCount,
  myColor,
}: CanvasControlsProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Help Tooltip Panel */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="bg-slate-950/90 backdrop-blur-md border border-slate-900/80 p-5 rounded-2xl shadow-2xl max-w-xs text-left pointer-events-auto space-y-3"
          >
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles size={16} />
              <h4 className="text-xs font-bold uppercase tracking-wider">Arte Collaborativa</h4>
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Lo sfondo è un’opera d’arte interattiva in tempo reale condivisa con tutti i visitatori connessi sul sito.
            </p>
            <ul className="text-[10px] text-gray-400 space-y-1.5 list-disc pl-4 font-sans leading-relaxed">
              <li><strong className="text-white">Muovi il cursore</strong> per generare flussi di particelle nel vuoto.</li>
              <li><strong className="text-white">Clicca con il mouse</strong> per generare un campo di attrazione gravitazionale.</li>
              <li><strong className="text-white">Premi Barra Spaziatrice</strong> per posizionare un repulsore di particelle.</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Controls Panel */}
      <div className="bg-slate-950/60 hover:bg-slate-950/80 border border-slate-900/80 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-auto flex items-center gap-4 transition-all duration-300">
        
        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-full border border-white/5">
            <Users size={12} className="text-cyan-400" />
            <span className="text-[10px] font-bold font-mono text-cyan-400">
              {playerCount} {playerCount === 1 ? 'LIVE' : 'LIVE'}
            </span>
          </div>
        </div>

        {/* User Color representation */}
        {myColor && isCanvasEnabled && (
          <div className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: myColor, color: myColor }}
            />
            <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
              Tu
            </span>
          </div>
        )}

        <div className="h-4 w-[1px] bg-slate-900" />

        {/* Interactive Controls */}
        <div className="flex items-center gap-2.5">
          {/* Info toggle */}
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showTooltip
                ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400'
                : 'bg-slate-900 hover:bg-slate-850 border-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle size={14} />
          </button>

          {/* Canvas enable/disable toggle */}
          <button
            onClick={() => setIsCanvasEnabled(!isCanvasEnabled)}
            className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              isCanvasEnabled
                ? 'bg-slate-900 border-white/5 text-gray-400 hover:text-white'
                : 'bg-indigo-600/25 border-indigo-500/40 text-indigo-300'
            }`}
          >
            {isCanvasEnabled ? 'Disattiva Sfondo 3D' : 'Attiva Sfondo 3D'}
          </button>
        </div>

      </div>
    </div>
  );
}
