import React from 'react';
import { SynthesisHistoryItem } from '../types';
import { Flame, History, ArrowRight, RotateCw, Trash2 } from 'lucide-react';

interface OuroborosChainProps {
  history: SynthesisHistoryItem[];
  onSelectGeneration: (item: SynthesisHistoryItem) => void;
  onClearHistory: () => void;
}

export const OuroborosChain: React.FC<OuroborosChainProps> = ({
  history,
  onSelectGeneration,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-[#12141d] border border-amber-500/20 rounded-xl p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <span>Recursive Ouroboros Chain</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
              {history.length} Generations Logged
            </span>
          </h4>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-[11px] font-mono text-zinc-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
          title="Clear history"
        >
          <Trash2 className="w-3 h-3" />
          <span>Reset Chain</span>
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
        {history.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => onSelectGeneration(item)}
            className="shrink-0 w-64 bg-[#0a0b10] hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-lg p-3 cursor-pointer transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-amber-400 font-bold">Gen #{history.length - idx}</span>
              <span className="text-zinc-500">{new Date(item.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs font-mono text-zinc-300 truncate group-hover:text-amber-200">
              "{item.concept}"
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="uppercase text-emerald-400/80">{item.target}</span>
              <span className="text-rose-400">S{item.entropyLevel} Depth</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
