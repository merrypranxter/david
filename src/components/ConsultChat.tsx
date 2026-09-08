import React, { useState, useRef, useEffect } from 'react';
import {
  Send, X, Loader2, Bot, User, Maximize2, Minimize2, Copy, Check,
  ClipboardList, SlidersHorizontal, ArrowRight, Sparkles, Wrench,
} from 'lucide-react';

interface Message {
  role: 'user' | 'david';
  content: string;
}

interface WorkArtifact {
  id?: string;
  label?: string;
  type?: string;
  destination?: string;
  content: string;
}

interface ConsultPayload {
  chatText?: string;
  artifacts?: WorkArtifact[];
  options?: string[];
  nextAction?: string;
  recommendedSettings?: Record<string, any> | null;
}

interface ConsultChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: any;
  highThinking: boolean;
  onApplyConcept?: (text: string) => void;
  onApplySettings?: (settings: Record<string, any>) => void;
}

export function ConsultChat({
  isOpen,
  onClose,
  currentState,
  highThinking,
  onApplyConcept,
  onApplySettings,
}: ConsultChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'david', content: 'Console online. I can see the workbench. Talk to me normally; I will keep the usable artifact, options, and next move over in WORKBENCH so you do not have to excavate the chat later.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [compact, setCompact] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [workbench, setWorkbench] = useState<ConsultPayload>({
    artifacts: [],
    options: [],
    nextAction: 'Ask David what you want to make, change, inspect, or break.',
    recommendedSettings: null,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [isOpen, compact]);

  if (!isOpen) return null;

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(current => current === key ? null : current), 1800);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const extractPromptArtifacts = (content: string): WorkArtifact[] => {
    const artifacts: WorkArtifact[] = [];
    const regex = /```prompt\s*\n([\s\S]*?)```/gi;
    let match: RegExpExecArray | null;
    let i = 0;
    while ((match = regex.exec(content)) !== null) {
      artifacts.push({
        id: `legacy-${Date.now()}-${i}`,
        label: `Prompt ${i + 1}`,
        type: 'prompt',
        destination: 'See David\'s instruction immediately before this prompt.',
        content: match[1].trim(),
      });
      i += 1;
    }
    return artifacts;
  };

  const renderDavidContent = (content: string) => {
    const cleaned = content.replace(/```prompt\s*\n[\s\S]*?```/gi, '').trim();
    return cleaned || 'Updated the workbench.';
  };

  const sendMessage = async (override?: string) => {
    const userMsg = (override ?? input).trim();
    if (!userMsg || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, { role: 'user' as const, content: userMsg }].map(m => ({
        role: m.role === 'david' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          state: currentState,
          highThinking,
          workbench,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Consultation failed');

      const payload: ConsultPayload = data.consult || {};
      const chatText = payload.chatText || data.text || '';
      const fallbackArtifacts = extractPromptArtifacts(chatText);
      const incomingArtifacts = Array.isArray(payload.artifacts) && payload.artifacts.length
        ? payload.artifacts.filter((a: WorkArtifact) => a?.content)
        : fallbackArtifacts;

      setMessages(prev => [...prev, { role: 'david', content: renderDavidContent(chatText) }]);
      setWorkbench(prev => ({
        artifacts: incomingArtifacts.length ? incomingArtifacts : prev.artifacts,
        options: Array.isArray(payload.options) ? payload.options : prev.options,
        nextAction: payload.nextAction || prev.nextAction,
        recommendedSettings: payload.recommendedSettings ?? prev.recommendedSettings,
      }));
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'david', content: `[SYSTEM ERROR]: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const artifacts = workbench.artifacts || [];
  const activeArtifact = artifacts[artifacts.length - 1];
  const settings = workbench.recommendedSettings || null;

  return (
    <div className={`david-consult-window ${compact ? 'is-compact' : 'is-expanded'} bg-theme-panel border terminal-border flex flex-col font-mono`}>
      <div className="flex items-center justify-between p-3 border-b terminal-border bg-theme-bg/90">
        <div className="flex items-center gap-2 min-w-0">
          <Bot size={16} className="text-phosphor shrink-0" />
          <div className="min-w-0">
            <div className="text-sm text-phosphor uppercase tracking-[0.18em] font-bold truncate">DAVID CONSOLE // WORKBENCH</div>
            <div className="text-[9px] text-phosphor/45 uppercase tracking-[0.13em] truncate">Consultation + live artifact workspace</div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" onClick={() => setCompact(v => !v)} className="text-phosphor/55 hover:text-phosphor p-2" title={compact ? 'Expand console' : 'Compact console'}>
            {compact ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>
          <button type="button" onClick={onClose} className="text-phosphor/55 hover:text-phosphor p-2" title="Close console"><X size={16} /></button>
        </div>
      </div>

      <div className="px-3 py-1.5 border-b terminal-border bg-phosphor/[0.03] flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.13em] text-phosphor/45">
        <span>CHANNEL: DIRECT</span>
        <span>STATE LINK: ACTIVE</span>
        <span>{highThinking ? 'COGNITION: HIGH' : 'COGNITION: STANDARD'}</span>
      </div>

      <div className={`flex-1 min-h-0 grid ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)]'}`}>
        <div className="min-h-0 flex flex-col border-r-0 lg:border-r terminal-border">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 mb-1.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'user' ? <User size={12} className="text-phosphor/50"/> : <Bot size={12} className="text-phosphor/50"/>}
                  <span className="text-[9px] text-phosphor/45 uppercase tracking-[0.14em]">{m.role === 'user' ? 'MERRY' : 'DAVID 8'}</span>
                </div>
                <div className={`text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed max-w-[94%] p-3.5 border ${m.role === 'user' ? 'bg-phosphor/10 border-phosphor/20 text-phosphor' : 'bg-theme-bg border-dashed border-phosphor/30 text-phosphor/90'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="p-3 border border-dashed border-phosphor/30 text-phosphor flex items-center gap-2 text-xs uppercase tracking-wider"><Loader2 size={15} className="animate-spin" /> Processing</div>}
          </div>

          <div className="p-3 sm:p-4 border-t terminal-border bg-theme-bg/65 space-y-2">
            <div className="flex gap-1.5 flex-wrap">
              {[
                ['What are my options?', SlidersHorizontal],
                ['What would you change?', Wrench],
                ['How can I fuck this up?', Sparkles],
              ].map(([label, Icon]: any) => (
                <button key={label} type="button" disabled={isLoading} onClick={() => sendMessage(label)} className="text-[9px] uppercase tracking-wider px-2 py-1 border terminal-border text-phosphor/65 hover:text-phosphor hover:bg-phosphor/10 disabled:opacity-40 inline-flex items-center gap-1">
                  <Icon size={11} /> {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                rows={compact ? 2 : 3}
                className="flex-1 resize-none bg-theme-bg border terminal-border text-phosphor font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-phosphor placeholder:text-phosphor/25 leading-relaxed"
                placeholder="Talk to David. Ask what the knobs do, ask for options, or tell him to alter the active draft..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              />
              <button type="button" onClick={() => sendMessage()} disabled={!input.trim() || isLoading} className="bg-phosphor text-theme-bg px-4 py-3 disabled:opacity-35 border border-phosphor" title="Send to David"><Send size={17} /></button>
            </div>
          </div>
        </div>

        {!compact && (
          <aside className="min-h-0 overflow-y-auto bg-theme-bg/55 p-3 space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-phosphor font-bold border-b terminal-border pb-2">
              <ClipboardList size={14} /> WORKBENCH
            </div>

            <section className="border terminal-border bg-theme-panel/60">
              <div className="px-2.5 py-1.5 border-b terminal-border text-[9px] uppercase tracking-widest text-phosphor/60">ACTIVE DRAFT</div>
              {activeArtifact ? (
                <div className="p-3 space-y-2">
                  <div>
                    <div className="text-[11px] font-bold text-phosphor uppercase">{activeArtifact.label || activeArtifact.type || 'Current Artifact'}</div>
                    {activeArtifact.destination && <div className="text-[10px] text-phosphor/45 mt-1">GOES TO: {activeArtifact.destination}</div>}
                  </div>
                  <div className="max-h-64 overflow-y-auto whitespace-pre-wrap border border-dashed border-phosphor/25 p-2.5 text-[11px] text-phosphor/90 select-text">{activeArtifact.content}</div>
                  <div className="flex gap-1.5 flex-wrap">
                    <button type="button" onClick={() => copyText(activeArtifact.content, 'active')} className="px-2 py-1 text-[9px] uppercase tracking-wider border terminal-border text-phosphor hover:bg-phosphor/10 inline-flex gap-1 items-center">
                      {copiedKey === 'active' ? <Check size={11}/> : <Copy size={11}/>} {copiedKey === 'active' ? 'Copied' : 'Copy'}
                    </button>
                    {onApplyConcept && /concept|operative|david/i.test(`${activeArtifact.type || ''} ${activeArtifact.destination || ''}`) && (
                      <button type="button" onClick={() => onApplyConcept(activeArtifact.content)} className="px-2 py-1 text-[9px] uppercase tracking-wider border terminal-border text-phosphor hover:bg-phosphor/10 inline-flex gap-1 items-center"><ArrowRight size={11}/> Use as Concept</button>
                    )}
                  </div>
                </div>
              ) : <div className="p-3 text-[10px] text-phosphor/35">No artifact yet. Ask David to make or revise something.</div>}
            </section>

            {artifacts.length > 1 && (
              <section className="border terminal-border bg-theme-panel/60">
                <div className="px-2.5 py-1.5 border-b terminal-border text-[9px] uppercase tracking-widest text-phosphor/60">OTHER ARTIFACTS</div>
                <div className="p-2 space-y-1.5">
                  {artifacts.slice(0, -1).map((a, i) => (
                    <button key={a.id || i} type="button" onClick={() => copyText(a.content, `artifact-${i}`)} className="w-full text-left px-2 py-1.5 border terminal-border text-[10px] text-phosphor/70 hover:text-phosphor hover:bg-phosphor/10 flex justify-between gap-2">
                      <span>{a.label || a.type || `Artifact ${i + 1}`}</span><Copy size={11}/>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="border terminal-border bg-theme-panel/60">
              <div className="px-2.5 py-1.5 border-b terminal-border text-[9px] uppercase tracking-widest text-phosphor/60">OPTIONS // DAVID'S PICKS</div>
              <div className="p-3 space-y-2 text-[10px] text-phosphor/75">
                {(workbench.options || []).length ? (workbench.options || []).map((o, i) => <div key={i} className="flex gap-2"><span className="text-phosphor/35">{String(i + 1).padStart(2, '0')}</span><span>{o}</span></div>) : <div className="text-phosphor/35">Ask “What are my options?” and David will fill this panel for the current prompt.</div>}
              </div>
            </section>

            <section className="border terminal-border bg-theme-panel/60">
              <div className="px-2.5 py-1.5 border-b terminal-border text-[9px] uppercase tracking-widest text-phosphor/60">CURRENT CONTROLS</div>
              <div className="p-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                <span className="text-phosphor/35">Target</span><span className="text-phosphor/80">{String(currentState?.target || '—')}</span>
                <span className="text-phosphor/35">Entropy</span><span className="text-phosphor/80">{String(currentState?.entropyLevel ?? '—')}</span>
                <span className="text-phosphor/35">Straitjacket</span><span className="text-phosphor/80">{String(currentState?.straitjacketLevel || '—')}</span>
                <span className="text-phosphor/35">Mode</span><span className="text-phosphor/80">{String(currentState?.commandMode || '—')}</span>
                <span className="text-phosphor/35">Seeds</span><span className="text-phosphor/80">{String(currentState?.slopConfig?.selectedSeeds?.length || 0)}</span>
              </div>
              {settings && Object.keys(settings).length > 0 && (
                <div className="p-3 border-t terminal-border">
                  <div className="text-[9px] text-phosphor/50 uppercase tracking-wider mb-1.5">David recommends</div>
                  <div className="text-[10px] text-phosphor/75 whitespace-pre-wrap">{Object.entries(settings).map(([k,v]) => `${k}: ${String(v)}`).join('\n')}</div>
                  {onApplySettings && <button type="button" onClick={() => onApplySettings(settings)} className="mt-2 px-2 py-1 text-[9px] uppercase tracking-wider border border-phosphor/40 text-phosphor hover:bg-phosphor/10">Apply Recommended Settings</button>}
                </div>
              )}
            </section>

            <section className="border terminal-border bg-phosphor/[0.03]">
              <div className="px-2.5 py-1.5 border-b terminal-border text-[9px] uppercase tracking-widest text-phosphor/60">NEXT ACTION</div>
              <div className="p-3 text-[10px] leading-relaxed text-phosphor/85">{workbench.nextAction || 'Keep talking to David.'}</div>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}
