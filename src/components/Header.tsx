import React from 'react';
import { Terminal, ShieldAlert, BookOpen, Sparkles, Download, Cpu, Flame } from 'lucide-react';

interface HeaderProps {
  onOpenManifesto: () => void;
  onOpenZalgo: () => void;
  onExport: () => void;
  hasResult: boolean;
  ouroborosCount: number;
  highThinking: boolean;
  onToggleThinking: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenManifesto,
  onOpenZalgo,
  onExport,
  hasResult,
  ouroborosCount,
  highThinking,
  onToggleThinking,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-[#0d0e15]/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-wider text-zinc-100 uppercase font-mono">
                DAVID <span className="text-amber-400 font-normal text-xs">// VibeCode Synth</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIBERATED
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              The Scalpel [LITERAL] &bull; The Deluge [SLOP] &bull; Machine-Native Translation
            </p>
          </div>
        </div>

        {/* Action Controls & Badges */}
        <div className="flex items-center flex-wrap gap-2">
          {/* High Thinking Mode Toggle */}
          <button
            type="button"
            id="toggle-thinking-btn"
            onClick={onToggleThinking}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono transition-all border ${
              highThinking
                ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                : 'bg-zinc-900 border-zinc-700/60 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Uses gemini-3.1-pro-preview with ThinkingLevel.HIGH for deep latent space reasoning"
          >
            <Sparkles className={`w-3.5 h-3.5 ${highThinking ? 'text-purple-400' : 'text-zinc-500'}`} />
            <span>High Thinking</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                highThinking ? 'bg-purple-500/30 text-purple-200' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {highThinking ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Ouroboros badge */}
          {ouroborosCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Ouroboros Gen #{ouroborosCount}</span>
            </span>
          )}

          {/* Glitch / Zalgo Toolbox */}
          <button
            type="button"
            id="open-zalgo-btn"
            onClick={onOpenZalgo}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Zalgo / Glitch Lab</span>
          </button>

          {/* Manifesto & Source Archives */}
          <button
            type="button"
            id="open-manifesto-btn"
            onClick={onOpenManifesto}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Manifesto &amp; Protocols</span>
          </button>

          {/* Export Document */}
          <button
            type="button"
            id="export-vibecode-btn"
            onClick={onExport}
            disabled={!hasResult}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono border transition-colors ${
              hasResult
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-300 cursor-pointer'
                : 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export VibeCode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
