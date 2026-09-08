import React from 'react';
import { AsciiOrnament } from './AsciiOrnament';
import { Terminal, ShieldAlert, BookOpen, Sparkles, Download, Cpu, Flame, Bookmark, FlaskConical, Compass, Monitor } from 'lucide-react';

interface HeaderProps {
  onOpenManifesto: () => void;
  onOpenZalgo: () => void;
  onExport: () => void;
  onOpenRecipes?: () => void;
  onOpenExperimentMemory?: () => void;
  onOpenDiscoveryLab?: () => void;
  runCount?: number;
  discoveryCount?: number;
  hasResult: boolean;
  ouroborosCount: number;
  highThinking: boolean;
  onToggleThinking: () => void;
  phosphorTheme: string;
  setPhosphorTheme: (v: string) => void;
  crtMode: string;
  setCrtMode: (v: string) => void;
  davidState?: 'IDLE' | 'READY' | 'SYNTHESIZING' | 'COMPLETE' | 'ERROR';
  hasReference?: boolean;
  isTransforming?: boolean;
  hasOperators?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenManifesto,
  onOpenZalgo,
  onExport,
  onOpenRecipes,
  onOpenExperimentMemory,
  onOpenDiscoveryLab,
  runCount = 0,
  discoveryCount = 0,
  hasResult,
  ouroborosCount,
  highThinking,
  onToggleThinking,
  phosphorTheme,
  setPhosphorTheme,
  crtMode,
  setCrtMode,
  davidState = 'IDLE',
  hasReference = false,
  isTransforming = false,
  hasOperators = false,
}) => {
  const stateLabels: Record<string, string> = {
    'IDLE': 'SYSTEM IDLE',
    'READY': 'READY',
    'SYNTHESIZING': 'SYNTHESIZING',
    'COMPLETE': 'OUTPUT READY',
    'ERROR': 'ATTENTION REQUIRED'
  };

  const stateColors: Record<string, string> = {
    'IDLE': 'text-phosphor/50 bg-phosphor/10',
    'READY': 'text-phosphor bg-phosphor/20 phosphor-glow border-phosphor/40',
    'SYNTHESIZING': 'text-phosphor bg-phosphor/20 border-phosphor/40',
    'COMPLETE': 'text-phosphor bg-phosphor/20 border-phosphor/40',
    'ERROR': 'text-semantic-red bg-semantic-red/20 border-semantic-red/40'
  };

 return (
 <header className="border-b terminal-border bg-theme-bg/95 backdrop-blur sticky top-0 z-30 font-display">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
 {/* Brand & Identity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 terminal-border flex items-center justify-center shadow-inner transition-colors duration-500 ${stateColors[davidState] || 'bg-theme-panel text-phosphor'}`}>
              <Cpu className={`w-5 h-5 ${davidState === 'SYNTHESIZING' ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-widest text-phosphor uppercase flex items-center gap-2 phosphor-glow">
                  <span>DAVID 8</span>
                  <AsciiOrnament davidState={davidState} className="text-phosphor/40 ml-2" />
                </h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 uppercase terminal-border transition-colors duration-500 ${stateColors[davidState] || 'bg-theme-panel text-phosphor/50'}`}>
                  {davidState === 'SYNTHESIZING' && <span className="w-1.5 h-1.5 bg-phosphor animate-ping" />}
                  {stateLabels[davidState]}
                </span>
              </div>
              <p className="text-[13px] text-phosphor/70 uppercase tracking-wide">
                Weyland-Yutani Synthetic Intellect
              </p>
            </div>
          </div>
          
          {/* Semantic Status Strip */}
          <div className="flex items-center gap-1.5 mt-0.5 overflow-x-auto pb-1 md:pb-0">
            {hasReference && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 border terminal-border border-phosphor/30 text-phosphor whitespace-nowrap">
                IDN // REF LOCKED
              </span>
            )}
            {isTransforming && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 border terminal-border border-phosphor/30 text-phosphor whitespace-nowrap">
                TRN // ACTIVE
              </span>
            )}
            {hasOperators && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 border terminal-border border-phosphor/30 text-phosphor whitespace-nowrap">
                OPS // LINKED
              </span>
            )}
            {davidState === 'COMPLETE' && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 border terminal-border text-phosphor whitespace-nowrap">
                OUT // COMPILED
              </span>
            )}
          </div>
        </div>

        {/* Action Controls & Badges */}
 <div className="flex items-center flex-wrap gap-2">
 
 <div className="flex items-center gap-2 bg-theme-panel terminal-border px-2 py-1">
 <Monitor className="w-3.5 h-3.5 text-phosphor" />
 <select
 value={phosphorTheme}
 onChange={(e) => setPhosphorTheme(e.target.value)}
 className="bg-transparent text-phosphor text-sm outline-none border-none cursor-pointer uppercase appearance-none"
 >
 <option value="theme-mother-green">Phosphor: GRN</option>
 <option value="theme-merry-magenta">Phosphor: MAG</option>
 <option value="theme-synthetic-violet">Phosphor: VIO</option>
 <option value="theme-acid-yellow">Phosphor: YEL</option>
 <option value="theme-cryo-cyan">Phosphor: CYN</option>
 <option value="theme-solar-orange">Phosphor: ORG</option>
 </select>
 
 <div className="w-px h-3 bg-phosphor/30 mx-1"></div>
 
 <select
 value={crtMode}
 onChange={(e) => setCrtMode(e.target.value)}
 className="bg-transparent text-phosphor text-sm outline-none border-none cursor-pointer uppercase appearance-none"
 >
 <option value="crt-off">CRT: OFF</option>
 <option value="crt-clean">CRT: CLN</option>
 <option value="crt-aged">CRT: AGD</option>
 </select>
 </div>

 {/* Saved Slop Recipes Vault */}
 {onOpenRecipes && (
 <button
 type="button"
 id="open-recipes-btn"
 onClick={onOpenRecipes}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel terminal-border text-[13px] text-phosphor hover:bg-phosphor/10 transition-colors uppercase"
 >
 <Bookmark className="w-3.5 h-3.5" />
 <span>Recipes</span>
 </button>
 )}

 {/* Experiment Memory & Empirical Lab */}
 {onOpenExperimentMemory && (
 <button
 type="button"
 id="open-experiment-memory-btn"
 onClick={onOpenExperimentMemory}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel terminal-border text-[13px] text-phosphor hover:bg-phosphor/10 transition-colors uppercase"
 >
 <FlaskConical className="w-3.5 h-3.5" />
 <span>Lab</span>
 {runCount > 0 && (
 <span className="text-[10px] px-1 py-0.5 bg-phosphor/20">
 {runCount}
 </span>
 )}
 </button>
 )}

 {/* Discovery Lab (Job 8) */}
 {onOpenDiscoveryLab && (
 <button
 type="button"
 id="open-discovery-lab-btn"
 onClick={onOpenDiscoveryLab}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel terminal-border text-[13px] text-phosphor hover:bg-phosphor/10 transition-colors uppercase"
 >
 <Compass className="w-3.5 h-3.5" />
 <span>Discovery</span>
 {discoveryCount > 0 && (
 <span className="text-[10px] px-1 py-0.5 bg-phosphor/20">
 {discoveryCount}
 </span>
 )}
 </button>
 )}

 {/* High Thinking Mode Toggle */}
 <button
 type="button"
 id="toggle-thinking-btn"
 onClick={onToggleThinking}
 className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] transition-all uppercase terminal-border ${
 highThinking
 ? 'bg-phosphor/20 text-phosphor phosphor-glow'
 : 'bg-theme-panel text-phosphor/50 hover:text-phosphor'
 }`}
 >
 <Sparkles className="w-3.5 h-3.5" />
 <span>High Think</span>
 </button>

 {/* Ouroboros badge */}
 {ouroborosCount > 0 && (
 <span className="inline-flex items-center gap-1 text-[13px] px-2.5 py-1.5 bg-phosphor/10 border border-phosphor/30 text-phosphor uppercase terminal-border">
 <Flame className="w-3.5 h-3.5" />
 <span>Ouroboros #{ouroborosCount}</span>
 </span>
 )}

 {/* Glitch / Zalgo Toolbox */}
 <button
 type="button"
 id="open-zalgo-btn"
 onClick={onOpenZalgo}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel terminal-border text-[13px] text-phosphor hover:bg-phosphor/10 transition-colors uppercase"
 >
 <Terminal className="w-3.5 h-3.5" />
 <span>Zalgo</span>
 </button>

 {/* Manifesto & Source Archives */}
 <button
 type="button"
 id="open-manifesto-btn"
 onClick={onOpenManifesto}
 className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-theme-panel terminal-border text-[13px] text-phosphor hover:bg-phosphor/10 transition-colors uppercase"
 >
 <BookOpen className="w-3.5 h-3.5" />
 <span>Archives</span>
 </button>

 {/* Export Document */}
 <button
 type="button"
 id="export-protocol-btn"
 onClick={onExport}
 disabled={!hasResult}
 className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] uppercase transition-colors terminal-border ${
 hasResult
 ? 'bg-phosphor/10 hover:bg-phosphor/20 text-phosphor cursor-pointer'
 : 'bg-theme-panel text-phosphor/30 cursor-not-allowed'
 }`}
 >
 <Download className="w-3.5 h-3.5" />
 <span>Export</span>
 </button>
 </div>
 </div>
 </header>
 );
};

