import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Loader2, Bot, User } from 'lucide-react';

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
    { role: 'david', content: 'Workbench online. I can see your raw inputs, mode, and target model. What are we dissecting?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const apiMessages = [...messages, { role: 'user', content: userMsg }].map(m => ({
        role: m.role === 'david' ? 'model' : 'user',
        content: m.content
      }));
      // Remove the hardcoded initial message from API history to save tokens if desired, but let's keep it.

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
    <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[400px] h-[500px] max-h-[80vh] bg-theme-panel border terminal-border flex flex-col z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b terminal-border bg-theme-bg/80">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-phosphor" />
          <span className="text-sm font-mono text-phosphor uppercase tracking-widest font-bold">DAVID CONSULT</span>
        </div>
        <button onClick={onClose} className="text-phosphor/60 hover:text-phosphor">
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-1 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {m.role === 'user' ? <User size={12} className="text-phosphor/60"/> : <Bot size={12} className="text-phosphor/60"/>}
              <span className="text-[10px] font-mono text-phosphor/60 uppercase">{m.role === 'user' ? 'MERRY' : 'DAVID 8'}</span>
            </div>
            <div className={`text-sm font-mono whitespace-pre-wrap leading-relaxed max-w-[85%] p-3 border ${m.role === 'user' ? 'bg-phosphor/10 border-phosphor/20 text-phosphor' : 'bg-theme-bg border-dashed border-phosphor/30 text-phosphor/90'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-1">
              <Bot size={12} className="text-phosphor/60"/>
              <span className="text-[10px] font-mono text-phosphor/60 uppercase">DAVID 8</span>
            </div>
            <div className="p-3 border bg-theme-bg border-dashed border-phosphor/30 text-phosphor">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t terminal-border bg-theme-bg/50">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 bg-theme-bg border terminal-border text-phosphor font-mono text-sm px-3 py-2 focus:outline-none focus:border-phosphor transition-colors placeholder:text-phosphor/30"
            placeholder="What's dead weight here?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-phosphor text-theme-bg px-3 py-2 disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
