const fs = require('fs');
const path = 'src/components/DavidAppWorkbench.tsx';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('LOCK_PREFLIGHT_V2')) {
  console.log('[lock-preflight-v2] already applied');
  process.exit(0);
}

content = content.replace(
  '  onSynthesize: () => void;',
  '  onSynthesize: (prompt?: string) => void;'
);

content = content.replace(
  "  const [locks, setLocks] = useState<LockState>(() => loadLocks());",
  "  const [locks, setLocks] = useState<LockState>(() => loadLocks());\n  // LOCK_PREFLIGHT_V2: locks are local/cheap until another Apply or Synthesize needs them.\n  const [locksDirty, setLocksDirty] = useState<boolean>(() =>\n    Object.values(loadLocks()).some((item) => item.enabled && item.value.trim().length > 0)\n  );"
);

content = content.replace(
  `    promptRef.current = clean;
    onMainPromptUpdate(clean);
    setLastApplied(reason);`,
  `    promptRef.current = clean;
    onMainPromptUpdate(clean);
    setLastApplied(reason);
    setLocksDirty(false);`
);

const copyMarker = `  const copyPrompt = async () => {
    if (!mainPrompt.trim()) return;
    await navigator.clipboard.writeText(mainPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (`;

const replacement = `  const copyPrompt = async () => {
    if (!mainPrompt.trim()) return;
    await navigator.clipboard.writeText(mainPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const handleWorkbenchSynthesize = async () => {
    if (!promptRef.current.trim() || loading) return;

    // A lock edit is intentionally FREE/local while Merry is typing. Only here,
    // or on a later section APPLY, does David get one cheap reconciliation call.
    if (locksDirty) {
      setLoading(true);
      try {
        await callDavid({
          userText: 'Final preflight: reconcile the current global lock set into MAIN PROMPT before synthesis.',
          automatic: true,
          intentBatch: [
            {
              source: 'global-locks',
              label: 'Global Locks Preflight',
              committed: true,
              priority: 'standard',
              changes: {
                activeLocks: Object.entries(locksRef.current)
                  .filter(([, value]) => value.enabled && value.value.trim())
                  .reduce<Record<string, string>>((acc, [key, value]) => {
                    acc[key] = value.value.trim();
                    return acc;
                  }, {}),
                instruction:
                  'Preserve active locks as global finished-piece constraints. If a previously locked property is now absent, it is no longer mandatory and may be relaxed where appropriate.',
              },
            },
          ],
        });
      } catch (error: any) {
        setMessages((items) => [
          ...items,
          { role: 'david', content: \`[WORKBENCH ERROR] Lock preflight failed: \${error?.message || 'unknown error'}\` },
        ]);
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    onSynthesize(promptRef.current);
  };

  return (`;

if (!content.includes(copyMarker)) {
  console.error('[lock-preflight-v2] synthesize insertion marker not found');
  process.exit(1);
}
content = content.replace(copyMarker, replacement);

content = content.replace(
  `onClick={onSynthesize} disabled={!mainPrompt.trim() || loading}`,
  `onClick={() => void handleWorkbenchSynthesize()} disabled={!mainPrompt.trim() || loading}`
);

content = content.replace(
  `onClick={() => setLocks((state) => ({ ...state, [key]: { ...state[key], enabled: !state[key].enabled } }))}`,
  `onClick={() => {
                        setLocksDirty(true);
                        setLocks((state) => ({ ...state, [key]: { ...state[key], enabled: !state[key].enabled } }));
                      }}`
);

content = content.replace(
  `onChange={(event) => setLocks((state) => ({ ...state, [key]: { ...state[key], value: event.target.value } }))}`,
  `onChange={(event) => {
                        setLocksDirty(true);
                        setLocks((state) => ({ ...state, [key]: { ...state[key], value: event.target.value } }));
                      }}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('[lock-preflight-v2] global locks now stay local until Apply/Synthesize, then reconcile once');
