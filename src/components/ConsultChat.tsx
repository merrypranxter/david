import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Bot, User, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  role: 'user' | 'david';
  content: string;
}

interface ConsultChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: any;
  highThinking: boolean;
}

export function ConsultChat({ isOpen, onClose, currentState, highThinking }: ConsultChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'david', content: 'Console online. I can see your current target, prompt state, mutation settings and model configuration. What are we making?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [compact, setCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(id);
  }, [isOpen, compact]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, { role: 'user' as const, content: userMsg }].map(m => ({
        role: m.role === 'david' ? 'model' : 'user',
        content: m.content
      }));

      const res = await fetch('/api/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          state: currentState,
          highThinking
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Consultation failed');
      }

      setMessages(prev => [...prev, { role: 'david', content: data.text }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'david', content: `[SYSTEM ERROR]: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`david-consult-window ${compact ? 'is-compact' : 'is-expanded'} bg-theme-panel border terminal-border flex flex-col font-mono`}>
      <div className="flex items-center justify-between p-3 border-b terminal-border bg-theme-bg/90">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] opacity-50 hidden sm:inline">[ &gt;_ ]</span>
          <Bot size={16} className="text-phosphor shrink-0" />
          <div className="min-w-0">
            <div className="text-sm text-phosphor uppercase tracking-[0.18em] font-bold truncate">DAVID CONSOLE</div>
            <div className="text-[9px] text-phosphor/45 uppercase tracking-[0.13em] truncate">Primary consultation channel // synthetic cognition unit 08</div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setCompact(value => !value)}
            className="text-phosphor/55 hover:text-phosphor p-2 border border-transparent hover:border-phosphor/20 transition-colors"
            title={compact ? 'Expand console' : 'Compact console'}
          >
            {compact ? <Maximize2 size={15} /> : <Minimize2 size={15} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-phosphor/55 hover:text-phosphor p-2 border border-transparent hover:border-phosphor/20 transition-colors"
            title="Close console"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="px-3 py-1.5 border-b terminal-border bg-phosphor/[0.03] flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.13em] text-phosphor/45">
        <span>CHANNEL: DIRECT</span>
        <span className="hidden sm:inline">STATE LINK: ACTIVE</span>
        <span>{highThinking ? 'COGNITION: HIGH' : 'COGNITION: STANDARD'}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'user' ? <User size={12} className="text-phosphor/50"/> : <Bot size={12} className="text-phosphor/50"/>}
              <span className="text-[9px] text-phosphor/45 uppercase tracking-[0.14em]">{m.role === 'user' ? 'MERRY' : 'DAVID 8'}</span>
            </div>
            <div className={`text-[13px] sm:text-sm whitespace-pre-wrap leading-relaxed max-w-[92%] sm:max-w-[86%] p-3.5 border ${m.role === 'user' ? 'bg-phosphor/10 border-phosphor/20 text-phosphor' : 'bg-theme-bg border-dashed border-phosphor/30 text-phosphor/90'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1.5">
              <Bot size={12} className="text-phosphor/50"/>
              <span className="text-[9px] text-phosphor/45 uppercase tracking-[0.14em]">DAVID 8</span>
            </div>
            <div className="p-3.5 border bg-theme-bg border-dashed border-phosphor/30 text-phosphor flex items-center gap-2 text-xs uppercase tracking-wider">
              <Loader2 size={15} className="animate-spin" />
              <span>Processing</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 border-t terminal-border bg-theme-bg/65">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <div className="text-[9px] uppercase tracking-[0.14em] text-phosphor/40 mb-1.5">OPERATOR INPUT</div>
            <textarea
              ref={inputRef}
              rows={compact ? 2 : 3}
              className="w-full resize-none bg-theme-bg border terminal-border text-phosphor font-mono text-sm px-3 py-2.5 focus:outline-none focus:border-phosphor transition-colors placeholder:text-phosphor/25 leading-relaxed"
              placeholder="Tell David what you want to make, change, inspect, or break..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-phosphor text-theme-bg px-4 py-3 disabled:opacity-35 hover:opacity-90 transition-opacity border border-phosphor"
            title="Send to David"
          >
            <Send size={17} />
          </button>
        </div>
        <div className="mt-1.5 text-[9px] text-phosphor/30 uppercase tracking-wider">Enter to send // Shift+Enter for new line</div>
      </div>
    </div>
  );
}
