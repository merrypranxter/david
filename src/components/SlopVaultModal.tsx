import React, { useState, useMemo } from 'react';
import { MATH_LEXICON, SCIENCE_LEXICON, SLOP_LEXICON, LexiconEntry } from '../data/lexicons';
import { Search, X, Plus, Check, Sparkles, Binary, Atom, Zap, RefreshCw } from 'lucide-react';

interface SlopVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeeds: string[];
  onToggleSeed: (seed: string) => void;
  onSelectMultipleSeeds: (seeds: string[]) => void;
}

export const SlopVaultModal: React.FC<SlopVaultModalProps> = ({
  isOpen,
  onClose,
  selectedSeeds,
  onToggleSeed,
  onSelectMultipleSeeds,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'maths' | 'sciences' | 'slop'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allEntries = useMemo(() => {
    return [
      ...MATH_LEXICON.map((e) => ({ ...e, domainLabel: 'Maths' })),
      ...SCIENCE_LEXICON.map((e) => ({ ...e, domainLabel: 'Sciences' })),
      ...SLOP_LEXICON.map((e) => ({ ...e, domainLabel: 'Slop' })),
    ];
  }, []);

  const filteredEntries = useMemo(() => {
    let list = allEntries;
    if (activeTab !== 'all') {
      list = list.filter((e) => e.domain === activeTab);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.tagline.toLowerCase().includes(q) ||
          e.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allEntries, activeTab, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f111a] border border-zinc-700/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#141724]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider">
                Vocabulary Hoarding Vault &bull; Slop Archive
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                Topological manifolds, fluid physics, internet brainrot, and impossible paradoxes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Search */}
        <div className="p-4 border-b border-zinc-800/80 bg-[#11131f] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Domain tabs */}
          <div className="flex items-center gap-1.5 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800 self-start sm:self-auto overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All Domains
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('maths')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'maths' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Binary className="w-3.5 h-3.5" />
              <span>Maths</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sciences')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'sciences' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Sciences</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('slop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono transition-colors ${
                activeTab === 'slop' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Slop & Internet</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search 300+ concepts or terms..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Selected Tokens Status Bar */}
        {selectedSeeds.length > 0 && (
          <div className="px-5 py-2.5 bg-amber-950/20 border-b border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              <span className="text-amber-400 font-bold shrink-0">Active Seeds ({selectedSeeds.length}):</span>
              {selectedSeeds.map((seed) => (
                <span
                  key={seed}
                  className="inline-flex items-center gap-1 bg-amber-500/15 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[11px] whitespace-nowrap"
                >
                  {seed}
                  <button
                    type="button"
                    onClick={() => onToggleSeed(seed)}
                    className="hover:text-rose-400 ml-0.5"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onSelectMultipleSeeds([])}
              className="text-zinc-400 hover:text-rose-300 underline shrink-0 text-[11px]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Categories & Tokens List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {filteredEntries.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              No concepts or terms matched "{searchTerm}". Try another search.
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#131622] border border-zinc-800 rounded-xl p-4 sm:p-5 space-y-3"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        entry.domain === 'maths'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : entry.domain === 'sciences'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {entry.domain}
                    </span>
                    <h3 className="text-sm font-bold font-mono text-zinc-200">{entry.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-zinc-400 italic">{entry.tagline}</span>
                </div>

                {/* Visual / Paradox Note */}
                <div className="text-xs font-mono text-zinc-400 space-y-1 bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/60">
                  <div className="text-zinc-300">
                    <strong className="text-zinc-400">Imagery:</strong> {entry.visualCue}
                  </div>
                  {entry.paradoxPairing && (
                    <div className="text-amber-400/90">
                      <strong className="text-amber-500">Contradiction / Paradox:</strong> {entry.paradoxPairing}
                    </div>
                  )}
                </div>

                {/* Keyword Pills */}
                <div>
                  <div className="text-[11px] font-mono text-zinc-500 mb-2 uppercase tracking-wider">
                    Vocabulary Hoard (Click to inject as active seed):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.keywords.map((kw) => {
                      const isSelected = selectedSeeds.includes(kw);
                      return (
                        <button
                          key={kw}
                          type="button"
                          onClick={() => onToggleSeed(kw)}
                          className={`text-xs font-mono px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-amber-500 text-zinc-950 font-bold border border-amber-400 shadow-md'
                              : 'bg-zinc-900/90 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-700/70'
                          }`}
                        >
                          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-zinc-500" />}
                          <span>{kw}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-[#12141f] flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">
            Selected seeds will be embedded directly into the [SLOP] Deluge prompt.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg transition-colors"
          >
            Done Selecting
          </button>
        </div>
      </div>
    </div>
  );
};
