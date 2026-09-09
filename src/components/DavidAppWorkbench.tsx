import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  Lock,
  LockOpen,
  NotebookPen,
  RotateCcw,
  Send,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { apiFetch } from '../cloudRunFetchGuard';
import {
  DavidWorkbenchIntent,
  subscribeDavidIntents,
} from '../utils/davidWorkbenchBus';

type LockKey = 'palette' | 'density' | 'energy' | 'vibe' | 'identity' | 'medium';

type LockState = Record<LockKey, { enabled: boolean; value: string }>;

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

interface PromptSnapshot {
  prompt: string;
  reason: string;
  timestamp: number;
}

interface DavidAppWorkbenchProps {
  mainPrompt: string;
  currentState: any;
  highThinking: boolean;
  onMainPromptUpdate: (prompt: string) => void;
  onSynthesize: () => void;
  onApplySettings?: (settings: Record<string, any>) => void;
}

const LOCK_STORAGE = 'david_workbench_locks_v2';
const NOTE_STORAGE = 'david_workbench_notepad_v2';
const HISTORY_LIMIT = 30;

const DEFAULT_LOCKS: LockState = {
  palette: { enabled: false, value: '' },
  density: { enabled: false, value: '' },
  energy: { enabled: false, value: '' },
  vibe: { enabled: false, value: '' },
  identity: { enabled: false, value: '' },
  medium: { enabled: false, value: '' },
};

const LOCK_LABELS: Record<LockKey, string> = {
  palette: 'Palette',
  density: 'Density',
  energy: 'Energy',
  vibe: 'Vibe',
  identity: 'Identity',
  medium: 'Medium',
};

function loadLocks(): LockState {
  try {
    const raw = localStorage.getItem(LOCK_STORAGE);
    if (!raw) return DEFAULT_LOCKS;
    return { ...DEFAULT_LOCKS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_LOCKS;
  }
}

function extractPromptArtifact(payload: ConsultPayload): WorkArtifact | null {
  const artifacts = Array.isArray(payload.artifacts) ? payload.artifacts.filter((a) => a?.content?.trim()) : [];
  if (!artifacts.length) return null;
  const explicit = [...artifacts].reverse().find((artifact) =>
    /main.?prompt|prompt|operative|draft/i.test(
      `${artifact.type || ''} ${artifact.label || ''} ${artifact.destination || ''}`
    )
  );
  return explicit || artifacts[artifacts.length - 1];
}

async function parseWorkbenchResponse(res: Response): Promise<any> {
  const raw = await res.text();
  const trimmed = raw.trim();

  // AI Studio / Cloud Run preview pages are HTML. Never feed those to JSON.parse
  // and never pretend a prompt was committed when the API was never reached.
  if (/^<!doctype\s+html|^<html|^<head/i.test(trimmed)) {
    throw new Error('AI Studio preview intercepted DAVID\'s API request with an HTML page. The prompt was NOT committed. Retry once after the preview finishes loading.');
  }

  if (!trimmed) {
    throw new Error(`DAVID workbench returned an empty response (${res.status}).`);
  }

  let data: any;
  try {
    data = JSON.parse(trimmed);
  } catch {
    throw new Error(`DAVID workbench returned a non-JSON response (${res.status}). The prompt was NOT committed.`);
  }

  if (!res.ok) throw new Error(data?.error || `David workbench request failed (${res.status})`);
  return data;
}

export function DavidAppWorkbench({
  mainPrompt,
  currentState,
  highThinking,
  onMainPromptUpdate,
  onSynthesize,
  onApplySettings,
}: DavidAppWorkbenchProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'david',
      content:
        'Workbench online. I own MAIN PROMPT. Finish a section, press APPLY, and I will integrate the staged changes instead of blindly appending tags.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [locks, setLocks] = useState<LockState>(() => loadLocks());
  const [notepadOpen, setNotepadOpen] = useState(false);
  const [notepad, setNotepad] = useState(() => localStorage.getItem(NOTE_STORAGE) || '');
  const [options, setOptions] = useState<string[]>([]);
  const [nextAction, setNextAction] = useState('Finish a section and press APPLY, or talk to David here.');
  const [history, setHistory] = useState<PromptSnapshot[]>([]);
  const [copied, setCopied] = useState(false);
  const [lastApplied, setLastApplied] = useState<string>('');

  const promptRef = useRef(mainPrompt);
  const stateRef = useRef(currentState);
  const locksRef = useRef(locks);
  const messagesRef = useRef(messages);
  const processingRef = useRef(false);
  const intentQueueRef = useRef<DavidWorkbenchIntent[]>([]);
  const flushTimerRef = useRef<number | null>(null);

  useEffect(() => {
    promptRef.current = mainPrompt;
  }, [mainPrompt]);

  useEffect(() => {
    stateRef.current = currentState;
  }, [currentState]);

  useEffect(() => {
    locksRef.current = locks;
    localStorage.setItem(LOCK_STORAGE, JSON.stringify(locks));
  }, [locks]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(NOTE_STORAGE, notepad);
  }, [notepad]);

  const activeLocks = useMemo(
    () =>
      Object.entries(locks)
        .filter(([, item]) => item.enabled && item.value.trim())
        .reduce<Record<string, string>>((acc, [key, item]) => {
          acc[key] = item.value.trim();
          return acc;
        }, {}),
    [locks]
  );

  const recordAndApplyPrompt = (nextPrompt: string, reason: string) => {
    const clean = nextPrompt.trim();
    if (!clean || clean === promptRef.current.trim()) return;
    const previous = promptRef.current;
    if (previous.trim()) {
      setHistory((items) => [
        { prompt: previous, reason, timestamp: Date.now() },
        ...items,
      ].slice(0, HISTORY_LIMIT));
    }
    promptRef.current = clean;
    onMainPromptUpdate(clean);
    setLastApplied(reason);
  };

  const callDavid = async ({
    userText,
    automatic = false,
    intentBatch = [],
  }: {
    userText: string;
    automatic?: boolean;
    intentBatch?: DavidWorkbenchIntent[];
  }) => {
    const currentPrompt = promptRef.current.trim();
    const lockPayload = Object.entries(locksRef.current)
      .filter(([, value]) => value.enabled && value.value.trim())
      .reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value.value.trim();
        return acc;
      }, {});

    const integrationInstruction = automatic
      ? `\n\nDAVID WORKBENCH RULES:\n- You are the ONLY writer of MAIN PROMPT.\n- The user has finished editing a section and explicitly pressed APPLY.\n- Consider the staged changes as a whole. Do NOT merely paste tags onto the end. Decide what belongs, how strongly it belongs, where it belongs, and how it interacts with the existing prompt.\n- Preserve every active global lock unless the user explicitly asks to unlock or replace it.\n- Return the fully reconciled MAIN PROMPT as ONE artifact. Use type \"main_prompt\", label \"MAIN PROMPT\", destination \"APP SIDEBAR // MAIN PROMPT\".\n- Keep useful existing prompt content unless a staged change logically supersedes it.\n- If the staged change would damage a locked requirement, adapt the change rather than dropping the lock.\n\nCURRENT MAIN PROMPT:\n${currentPrompt || '[blank]'}\n\nACTIVE GLOBAL LOCKS:\n${JSON.stringify(lockPayload, null, 2)}\n\nSTAGED SECTION APPLY:\n${JSON.stringify(intentBatch, null, 2)}`
      : `\n\nCURRENT MAIN PROMPT:\n${currentPrompt || '[blank]'}\n\nACTIVE GLOBAL LOCKS:\n${JSON.stringify(lockPayload, null, 2)}\n\nIf your response changes the working prompt, return the complete revised prompt as an artifact with type \"main_prompt\". If the user is merely asking a question or asking for options, do not change the prompt unless that is actually useful.`;

    const apiMessages = automatic
      ? [{ role: 'user', content: `${userText}${integrationInstruction}` }]
      : [
          ...messagesRef.current.map((message) => ({
            role: message.role === 'david' ? 'model' : 'user',
            content: message.content,
          })),
          { role: 'user', content: `${userText}${integrationInstruction}` },
        ];

    const res = await apiFetch('/api/consult', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        messages: apiMessages,
        state: {
          ...stateRef.current,
          mainPrompt: currentPrompt,
          globalLocks: lockPayload,
          workbenchMode: 'single-writer',
        },
        highThinking: automatic ? false : highThinking,
        workbench: {
          locks: lockPayload,
          mainPrompt: currentPrompt,
          mode: 'single-writer',
        },
      }),
    });

    const data = await parseWorkbenchResponse(res);

    // Structured consult is preferred. Legacy text is accepted as David's chat,
    // but it is NOT allowed to masquerade as a committed MAIN PROMPT.
    let payload: ConsultPayload = data?.consult || {};
    if (!data?.consult && typeof data?.text === 'string' && data.text.trim()) {
      payload = {
        chatText: data.text.trim(),
        artifacts: [],
        options: [],
        nextAction: 'Keep talking to David.',
        recommendedSettings: null,
      };
    }

    const artifact = extractPromptArtifact(payload);
    if (artifact?.content) {
      const reason = automatic
        ? `Applied ${intentBatch.map((intent) => intent.label).join(' + ')}`
        : 'David revised MAIN PROMPT from chat';
      recordAndApplyPrompt(artifact.content, reason);
    }
    if (Array.isArray(payload.options)) setOptions(payload.options);
    if (payload.nextAction) setNextAction(payload.nextAction);
    if (payload.recommendedSettings && onApplySettings) {
      onApplySettings(payload.recommendedSettings);
    }
    return payload;
  };

  const flushIntentQueue = async () => {
    if (processingRef.current) return;
    const batch = intentQueueRef.current.splice(0);
    if (!batch.length) return;
    processingRef.current = true;
    setLoading(true);
    try {
      const payload = await callDavid({
        userText: `Apply the completed app-section changes: ${batch.map((item) => item.label).join('; ')}`,
        automatic: true,
        intentBatch: batch,
      });
      const chatText = payload.chatText?.trim();
      setMessages((items) => [
        ...items,
        {
          role: 'david',
          content:
            chatText ||
            `Integrated ${batch.length === 1 ? batch[0].label : `${batch.length} staged changes`} into MAIN PROMPT.`,
        },
      ]);
    } catch (error: any) {
      setMessages((items) => [
        ...items,
        { role: 'david', content: `[WORKBENCH ERROR] ${error?.message || 'Could not reconcile staged changes.'}` },
      ]);
    } finally {
      processingRef.current = false;
      setLoading(false);
      if (intentQueueRef.current.length) {
        window.setTimeout(() => void flushIntentQueue(), 120);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeDavidIntents((intent) => {
      if (intent.committed === false) return;
      intentQueueRef.current.push(intent);
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
      flushTimerRef.current = window.setTimeout(() => {
        void flushIntentQueue();
      }, 450);
    });
    return () => {
      unsubscribe();
      if (flushTimerRef.current) window.clearTimeout(flushTimerRef.current);
    };
  }, []);

  const sendMessage = async (override?: string) => {
    const clean = (override ?? input).trim();
    if (!clean || loading) return;
    setInput('');
    setMessages((items) => [...items, { role: 'user', content: clean }]);
    setLoading(true);
    try {
      const payload = await callDavid({ userText: clean });
      setMessages((items) => [
        ...items,
        { role: 'david', content: payload.chatText?.trim() || 'Workbench updated.' },
      ]);
    } catch (error: any) {
      setMessages((items) => [
        ...items,
        { role: 'david', content: `[WORKBENCH ERROR] ${error?.message || 'Request failed.'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const undo = () => {
    const previous = history[0];
    if (!previous) return;
    const current = promptRef.current;
    promptRef.current = previous.prompt;
    onMainPromptUpdate(previous.prompt);
    setHistory((items) => [
      ...(current.trim()
        ? [{ prompt: current, reason: 'Redo point before undo', timestamp: Date.now() }]
        : []),
      ...items.slice(1),
    ].slice(0, HISTORY_LIMIT));
    setLastApplied(`Undo: ${previous.reason}`);
  };

  const copyPrompt = async () => {
    if (!mainPrompt.trim()) return;
    await navigator.clipboard.writeText(mainPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <aside className={`david-app-workbench ${collapsed ? 'is-collapsed' : ''}`} aria-label="DAVID application workbench">
      <div className="david-app-workbench__header">
        <div className="flex items-center gap-2 min-w-0">
          <Bot size={16} className="shrink-0" />
          <div className="min-w-0">
            <div className="font-bold uppercase tracking-[0.16em] text-[11px] truncate">DAVID // APP WORKBENCH</div>
            <div className="text-[9px] opacity-55 uppercase tracking-[0.12em] truncate">ONE WRITER · APPLY-ONLY RECONCILIATION</div>
          </div>
        </div>
        <button type="button" className="david-app-workbench__icon" onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Open workbench' : 'Collapse workbench'}>
          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {!collapsed && (
        <div className="david-app-workbench__body">
          <section className="david-app-workbench__section david-app-workbench__main-prompt">
            <div className="david-app-workbench__section-title">
              <span className="flex items-center gap-1.5"><ClipboardList size={12} /> MAIN PROMPT // DAVID OWNED</span>
              <span className="opacity-45">{mainPrompt.length} CH</span>
            </div>
            <textarea
              value={mainPrompt}
              readOnly
              rows={8}
              placeholder="Talk to David, then MAIN PROMPT will live here. App sections only reach it after you press APPLY."
              className="david-app-workbench__prompt"
            />
            <div className="flex flex-wrap gap-1.5 items-center">
              <button type="button" className="david-app-workbench__button" onClick={copyPrompt} disabled={!mainPrompt.trim()}>
                {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? 'COPIED' : 'COPY'}
              </button>
              <button type="button" className="david-app-workbench__button" onClick={undo} disabled={!history.length}>
                <RotateCcw size={11} /> UNDO DAVID
              </button>
              <button type="button" className="david-app-workbench__button david-app-workbench__button--primary" onClick={onSynthesize} disabled={!mainPrompt.trim() || loading}>
                <Wand2 size={11} /> SYNTHESIZE THIS
              </button>
              {lastApplied && <span className="text-[9px] opacity-45">LAST: {lastApplied}</span>}
            </div>
          </section>

          <section className="david-app-workbench__section">
            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Lock size={12} /> GLOBAL LOCKS</span></div>
            <div className="david-app-workbench__locks">
              {(Object.keys(locks) as LockKey[]).map((key) => (
                <div key={key} className="david-app-workbench__lock-row">
                  <button
                    type="button"
                    onClick={() => setLocks((state) => ({
                      ...state,
                      [key]: { ...state[key], enabled: !state[key].enabled },
                    }))}
                    className={`david-app-workbench__lock-toggle ${locks[key].enabled ? 'is-on' : ''}`}
                    title={`${locks[key].enabled ? 'Unlock' : 'Lock'} ${LOCK_LABELS[key]}`}
                  >
                    {locks[key].enabled ? <Lock size={10} /> : <LockOpen size={10} />}
                    {LOCK_LABELS[key]}
                  </button>
                  <input
                    value={locks[key].value}
                    onChange={(event) =>
                      setLocks((state) => ({
                        ...state,
                        [key]: { ...state[key], value: event.target.value },
                      }))
                    }
                    placeholder={`Lock ${LOCK_LABELS[key].toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
            <div className="text-[9px] opacity-45 mt-2">{Object.keys(activeLocks).length || 0} active · locks are sent with every David reconciliation.</div>
          </section>

          <section className="david-app-workbench__section">
            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Sparkles size={12} /> DAVID SUGGESTS</span></div>
            {options.length ? (
              <div className="david-app-workbench__suggestions">
                {options.map((option, index) => (
                  <button key={`${option}-${index}`} type="button" onClick={() => void sendMessage(option)}>
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-[10px] opacity-55">Ask “What are my options?” or apply a section and David will leave useful next moves here.</div>
            )}
            <div className="text-[10px] mt-2"><span className="opacity-45">NEXT:</span> {nextAction}</div>
          </section>

          <section className="david-app-workbench__section david-app-workbench__chat">
            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Bot size={12} /> TALK TO DAVID</span></div>
            <div className="david-app-workbench__messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`david-app-workbench__message is-${message.role}`}>
                  <span>{message.role === 'david' ? 'D8' : 'YOU'}</span>
                  <p>{message.content}</p>
                </div>
              ))}
              {loading && <div className="david-app-workbench__thinking">DAVID IS RECONCILING…</div>}
            </div>
            <div className="david-app-workbench__composer">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Tell David what to preserve, change, add, remove, or sabotage…"
                rows={3}
              />
              <button type="button" onClick={() => void sendMessage()} disabled={!input.trim() || loading} title="Send to David">
                <Send size={13} />
              </button>
            </div>
            <div className="david-app-workbench__quick-actions">
              <button type="button" onClick={() => void sendMessage('What are my options? Give me several useful directions without changing MAIN PROMPT yet.')}>What are my options?</button>
              <button type="button" onClick={() => void sendMessage('What would you change here and why? Do not change MAIN PROMPT until I choose.')}>What would you change?</button>
              <button type="button" onClick={() => void sendMessage('Tell me several ways I can fuck this up productively. Explain the consequences. Do not change MAIN PROMPT until I choose.')}>How can I fuck this up?</button>
            </div>
          </section>

          <section className="david-app-workbench__section">
            <button type="button" className="david-app-workbench__section-title w-full" onClick={() => setNotepadOpen((value) => !value)}>
              <span className="flex items-center gap-1.5"><NotebookPen size={12} /> MERRY'S NOTEPAD</span><span className="opacity-45">{notepadOpen ? 'HIDE' : 'POP OPEN'}</span>
            </button>
            {notepadOpen && (
              <>
                <textarea
                  className="david-app-workbench__notepad"
                  value={notepad}
                  onChange={(event) => setNotepad(event.target.value)}
                  placeholder="Private scratchpad. David ignores this unless you explicitly send it."
                  rows={6}
                />
                <button type="button" className="david-app-workbench__button mt-2" disabled={!notepad.trim() || loading} onClick={() => void sendMessage(`Read this note and use only what is relevant: ${notepad}`)}>
                  <Send size={11} /> SEND NOTE TO DAVID
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </aside>
  );
}
