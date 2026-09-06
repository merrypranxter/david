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
      <div className="bg-[#12141e] border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 uppercase tracking-wider">
                Zalgo &amp; Phonetic Entropy Lab
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                Generate non-standard token noise &amp; illegal buffer combinations
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {/* Text Input */}
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
              Source String to Destabilize:
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#0a0b10] border border-zinc-700/80 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-rose-500"
              placeholder="Enter text to distort..."
            />
          </div>

          {/* Intensity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Entropy Depth (Diacritical Stacking):</span>
              <span className="text-rose-400 font-bold">{intensity} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>

          {/* Output Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-zinc-400 uppercase tracking-wider">Generated Glitch Output:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyText(currentGlitch)}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-300 hover:text-rose-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700 transition-colors"
                >
                  {copiedGlitch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedGlitch ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onInject(currentGlitch)}
                  className="inline-flex items-center gap-1 text-[11px] text-rose-300 hover:text-rose-200 bg-rose-500/20 px-2.5 py-0.5 rounded border border-rose-500/40 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Inject into Prompt</span>
                </button>
              </div>
            </div>
            <div className="bg-[#08090e] border border-zinc-800 rounded-lg p-4 min-h-[70px] flex items-center text-rose-300 text-sm overflow-x-auto select-all leading-loose">
              {currentGlitch || <span className="text-zinc-600">Enter text above...</span>}
            </div>
          </div>

          {/* Pre-calibrated Noise Anchors */}
          <div className="pt-2 border-t border-zinc-800">
            <span className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-2">
              Surgical Noise Anchors (From CRATAK Field Manual):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {NOISE_ANCHORS.map((anchor, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-colors"
                >
                  <span className="truncate text-zinc-300 text-[11px] font-mono pr-2">{anchor}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => copyText(anchor, idx)}
                      className="p-1 text-zinc-400 hover:text-zinc-200"
                      title="Copy Anchor"
                    >
                      {copiedAnchor === idx ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onInject(anchor)}
                      className="p-1 text-amber-400 hover:text-amber-300"
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
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
