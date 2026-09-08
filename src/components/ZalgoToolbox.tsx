import React, { useState } from 'react';
import { zalgoify, NOISE_ANCHORS } from '../utils/zalgo';
import { X, Terminal, Copy, Check, Plus, RefreshCw } from 'lucide-react';

interface ZalgoToolboxProps {
 isOpen: boolean;
 onClose: () => void;
 onInject: (text: string) => void;
}

export const ZalgoToolbox: React.FC<ZalgoToolboxProps> = ({ isOpen, onClose, onInject }) => {
 const [inputText, setInputText] = useState('Help me Void');
 const [intensity, setIntensity] = useState(4);
 const [copiedGlitch, setCopiedGlitch] = useState(false);
 const [copiedAnchor, setCopiedAnchor] = useState<number | null>(null);

 if (!isOpen) return null;

 const currentGlitch = zalgoify(inputText, intensity);

 const copyText = async (text: string, isAnchorIdx?: number) => {
 try {
 await navigator.clipboard.writeText(text);
 if (typeof isAnchorIdx === 'number') {
 setCopiedAnchor(isAnchorIdx);
 setTimeout(() => setCopiedAnchor(null), 1500);
 } else {
 setCopiedGlitch(true);
 setTimeout(() => setCopiedGlitch(false), 1500);
 }
 } catch (e) {
 console.error('Failed to copy', e);
 }
 };

 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
 <div className="bg-theme-panel border terminal-border w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
 {/* Header */}
 <div className="p-4 sm:px-6 border-b terminal-border flex items-center justify-between bg-theme-panel">
 <div className="flex items-center gap-2.5">
 <div className="w-8 h-8 bg-semantic-red/10 border border-semantic-red/30 terminal-border text-semantic-red flex items-center justify-center">
 <Terminal className="w-4 h-4" />
 </div>
 <div>
 <h3 className="text-sm font-bold font-mono text-phosphor uppercase tracking-wider">
 Zalgo &amp; Phonetic Entropy Lab
 </h3>
 <span className="text-[10px] font-mono text-phosphor/50">
 Generate non-standard token noise &amp; illegal buffer combinations
 </span>
 </div>
 </div>
 <button
 type="button"
 onClick={onClose}
 className="text-phosphor/80 hover:text-phosphor p-1.5 hover:bg-phosphor/10 transition-colors"
 >
 <X className="w-5 h-5" />
 </button>
 </div>

 {/* Content */}
 <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
 {/* Text Input */}
 <div>
 <label className="block text-[11px] font-mono text-phosphor/80 uppercase tracking-wider mb-1.5">
 Source String to Destabilize:
 </label>
 <input
 type="text"
 value={inputText}
 onChange={(e) => setInputText(e.target.value)}
 className="w-full bg-theme-panel border terminal-border px-3 py-2 text-phosphor focus:outline-none focus:border-semantic-red/30 terminal-border"
 placeholder="Enter text to distort..."
 />
 </div>

 {/* Intensity Slider */}
 <div className="space-y-1.5">
 <div className="flex items-center justify-between">
 <span className="text-phosphor/80">Entropy Depth (Diacritical Stacking):</span>
 <span className="text-semantic-red font-bold">{intensity} / 10</span>
 </div>
 <input
 type="range"
 min={1}
 max={10}
 value={intensity}
 onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
 className="w-full h-1.5 bg-theme-panel appearance-none cursor-pointer accent-semantic-red"
 />
 </div>

 {/* Output Preview */}
 <div>
 <div className="flex items-center justify-between mb-1.5">
 <span className="text-[11px] text-phosphor/80 uppercase tracking-wider">Generated Glitch Output:</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => copyText(currentGlitch)}
 className="inline-flex items-center gap-1 text-[11px] text-phosphor/80 hover:text-semantic-red bg-theme-panel px-2 py-0.5 border terminal-border transition-colors"
 >
 {copiedGlitch ? <Check className="w-3 h-3 text-phosphor" /> : <Copy className="w-3 h-3" />}
 <span>{copiedGlitch ? 'Copied' : 'Copy'}</span>
 </button>
 <button
 type="button"
 onClick={() => onInject(currentGlitch)}
 className="inline-flex items-center gap-1 text-[11px] text-semantic-red hover:text-semantic-red bg-semantic-red/10 px-2.5 py-0.5 border border-semantic-red/30 terminal-border transition-colors"
 >
 <Plus className="w-3 h-3" />
 <span>Inject into Prompt</span>
 </button>
 </div>
 </div>
 <div className="bg-theme-bg border terminal-border p-4 min-h-[70px] flex items-center text-semantic-red text-sm overflow-x-auto select-all leading-loose">
 {currentGlitch || <span className="text-phosphor/80">Enter text above...</span>}
 </div>
 </div>

 {/* Pre-calibrated Noise Anchors */}
 <div className="pt-2 border-t terminal-border">
 <span className="block text-[11px] text-phosphor/80 uppercase tracking-wider mb-2">
 Surgical Noise Anchors (From CRATAK Field Manual):
 </span>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {NOISE_ANCHORS.map((anchor, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between p-2 bg-theme-panel border terminal-border hover: transition-colors"
 >
 <span className="truncate text-phosphor/80 text-[11px] font-mono pr-2">{anchor}</span>
 <div className="flex items-center gap-1 shrink-0">
 <button
 type="button"
 onClick={() => copyText(anchor, idx)}
 className="p-1 text-phosphor/80 hover:text-phosphor"
 title="Copy Anchor"
 >
 {copiedAnchor === idx ? (
 <Check className="w-3 h-3 text-phosphor" />
 ) : (
 <Copy className="w-3 h-3" />
 )}
 </button>
 <button
 type="button"
 onClick={() => onInject(anchor)}
 className="p-1 text-phosphor hover:text-phosphor"
 title="Inject into input"
 >
 <Plus className="w-3 h-3" />
 </button>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Footer */}
 <div className="p-4 border-t terminal-border bg-theme-panel flex justify-end">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 bg-theme-panel hover:bg-phosphor/10 text-xs font-mono text-phosphor transition-colors"
 >
 Close Lab
 </button>
 </div>
 </div>
 </div>
 );
};
