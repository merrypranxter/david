const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

content = content.replace(/interface HeaderProps \{[\s\S]*?\}/, `interface HeaderProps {
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
}`);

content = content.replace(/export const Header: React\.FC<HeaderProps> = \(\{[\s\S]*?\}\) => \{/, `export const Header: React.FC<HeaderProps> = ({
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
    'SYNTHESIZING': 'text-semantic-yellow bg-semantic-yellow/20 border-semantic-yellow/40',
    'COMPLETE': 'text-semantic-cyan bg-semantic-cyan/20 border-semantic-cyan/40',
    'ERROR': 'text-semantic-red bg-semantic-red/20 border-semantic-red/40'
  };
`);

content = content.replace(/\{\/\* Brand & Identity \*\/\}.*?\{\/\* Action Controls/s, `{/* Brand & Identity */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <div className={\`w-10 h-10 terminal-border flex items-center justify-center shadow-inner transition-colors duration-500 \${stateColors[davidState] || 'bg-theme-panel text-phosphor'}\`}>
              <Cpu className={\`w-5 h-5 \${davidState === 'SYNTHESIZING' ? 'animate-pulse' : ''}\`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-widest text-phosphor uppercase flex items-center gap-2 phosphor-glow">
                  <span>DAVID 8</span>
                </h1>
                <span className={\`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 uppercase terminal-border transition-colors duration-500 \${stateColors[davidState] || 'bg-theme-panel text-phosphor/50'}\`}>
                  {davidState === 'SYNTHESIZING' && <span className="w-1.5 h-1.5 bg-semantic-yellow animate-ping" />}
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
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-semantic-cyan/10 border terminal-border border-semantic-cyan/30 text-semantic-cyan whitespace-nowrap">
                IDN // REF LOCKED
              </span>
            )}
            {isTransforming && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-semantic-magenta/10 border terminal-border border-semantic-magenta/30 text-semantic-magenta whitespace-nowrap">
                TRN // ACTIVE
              </span>
            )}
            {hasOperators && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-semantic-violet/10 border terminal-border border-semantic-violet/30 text-semantic-violet whitespace-nowrap">
                OPS // LINKED
              </span>
            )}
            {davidState === 'COMPLETE' && (
              <span className="text-[9px] font-mono px-1.5 py-0.5 bg-phosphor/10 border terminal-border border-phosphor/40 text-phosphor whitespace-nowrap">
                OUT // COMPILED
              </span>
            )}
          </div>
        </div>

        {/* Action Controls`);

fs.writeFileSync('src/components/Header.tsx', content, 'utf8');
