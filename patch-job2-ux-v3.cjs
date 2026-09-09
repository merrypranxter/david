const fs = require('fs');

function replaceOnce(content, from, to, label) {
  if (!content.includes(from)) {
    console.warn(`[job2-ux-v3] ${label} marker not found; skipping`);
    return content;
  }
  return content.replace(from, to);
}

function patchWorkbench() {
  const path = 'src/components/DavidAppWorkbench.tsx';
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('JOB2_UX_V3')) {
    console.log('[job2-ux-v3] workbench already patched');
    return;
  }

  content = replaceOnce(
    content,
    '  Wand2,\n} from \'lucide-react\';',
    '  Wand2,\n  Maximize2,\n  X,\n  Layers3,\n} from \'lucide-react\';',
    'workbench icons'
  );

  content = replaceOnce(
    content,
    "type LockKey = 'palette' | 'density' | 'energy' | 'vibe' | 'identity' | 'medium';",
    "type MobileTab = 'prompt' | 'locks' | 'david' | 'notes';\n\n// JOB2_UX_V3: local staging is visible, but never calls DAVID until APPLY.\ntype LockKey = 'palette' | 'density' | 'energy' | 'vibe' | 'identity' | 'medium';",
    'mobile tab type'
  );

  content = replaceOnce(
    content,
    "};\n\nfunction loadLocks(): LockState {",
    `};\n\nconst LOCK_QUICK_VALUES: Partial<Record<LockKey, string[]>> = {\n  palette: [\n    'acid candy spectrum',\n    'hot pink + cyan + lime + ultraviolet',\n    'toxic tropical fluorescence',\n    'prismatic diffraction / opalescent chrome',\n  ],\n  density: ['maximalist', 'dense but readable', 'medium density', 'sparse'],\n  energy: ['feral / explosive', 'hypnotic / recursive', 'tense / uncanny', 'calm / clinical'],\n  vibe: ['1980s practical SFX', 'psychedelic analog signal damage', 'bright fantasy body-horror', 'clinical mathematical weirdness'],\n};\n\nfunction loadLocks(): LockState {`,
    'lock quick values'
  );

  content = replaceOnce(
    content,
    "  const [lastApplied, setLastApplied] = useState<string>('');",
    "  const [lastApplied, setLastApplied] = useState<string>('');\n  const [mobileTab, setMobileTab] = useState<MobileTab>('prompt');\n  const [notepadDetached, setNotepadDetached] = useState(false);\n  const [pendingSources, setPendingSources] = useState<Record<string, DavidWorkbenchIntent>>({});",
    'workbench UX state'
  );

  content = replaceOnce(
    content,
    "  useEffect(() => {\n    localStorage.setItem(NOTE_STORAGE, notepad);\n  }, [notepad]);",
    `  useEffect(() => {\n    localStorage.setItem(NOTE_STORAGE, notepad);\n  }, [notepad]);\n\n  useEffect(() => {\n    const openWorkbench = () => {\n      setCollapsed(false);\n      setMobileTab('david');\n    };\n    window.addEventListener('david:open-workbench', openWorkbench);\n    return () => window.removeEventListener('david:open-workbench', openWorkbench);\n  }, []);`,
    'open workbench event'
  );

  content = replaceOnce(
    content,
    "    [locks]\n  );\n\n  const recordAndApplyPrompt",
    `    [locks]\n  );\n\n  const pendingItems = useMemo(() => Object.values(pendingSources), [pendingSources]);\n  const workbenchStatus = loading\n    ? 'DAVID THINKING'\n    : pendingItems.length\n      ? \`LOCAL STAGED \${pendingItems.length}\`\n      : 'PROMPT COMMITTED';\n\n  const recordAndApplyPrompt`,
    'pending status derivation'
  );

  content = replaceOnce(
    content,
    "      if (intent.committed === false) return;\n      intentQueueRef.current.push(intent);",
    `      if (intent.committed === false) {\n        const isPending = (intent.changes as any)?.pending !== false;\n        setPendingSources((previous) => {\n          const next = { ...previous };\n          if (isPending) next[intent.source] = intent;\n          else delete next[intent.source];\n          return next;\n        });\n        return;\n      }\n\n      setPendingSources((previous) => {\n        if (!previous[intent.source]) return previous;\n        const next = { ...previous };\n        delete next[intent.source];\n        return next;\n      });\n      intentQueueRef.current.push(intent);`,
    'staged intent listener'
  );

  content = replaceOnce(
    content,
    "    <aside className={`david-app-workbench ${collapsed ? 'is-collapsed' : ''}`} aria-label=\"DAVID application workbench\">",
    "    <aside className={`david-app-workbench ${collapsed ? 'is-collapsed' : ''} mobile-tab-${mobileTab}`} aria-label=\"DAVID application workbench\">",
    'workbench mobile class'
  );

  content = replaceOnce(
    content,
    '<div className="text-[9px] opacity-55 uppercase tracking-[0.12em] truncate">ONE WRITER · APPLY-ONLY RECONCILIATION</div>',
    '<div className="text-[9px] opacity-55 uppercase tracking-[0.12em] truncate">ONE WRITER · LOCAL FIRST · APPLY THROUGH DAVID</div>',
    'workbench subtitle'
  );

  const oldHeaderButton = `        <button type="button" className="david-app-workbench__icon" onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Open workbench' : 'Collapse workbench'}>\n          {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}\n        </button>`;
  const newHeaderButton = `        <div className="david-app-workbench__header-actions">\n          <span className={\`david-app-workbench__status \${loading ? 'is-working' : pendingItems.length ? 'is-staged' : 'is-committed'}\`}>\n            {workbenchStatus}\n          </span>\n          <button type="button" className="david-app-workbench__icon" onClick={() => setCollapsed((value) => !value)} title={collapsed ? 'Open workbench' : 'Collapse workbench'}>\n            {collapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}\n          </button>\n        </div>`;
  content = replaceOnce(content, oldHeaderButton, newHeaderButton, 'workbench header status');

  content = replaceOnce(
    content,
    '        <div className="david-app-workbench__body">',
    `        <div className="david-app-workbench__body">\n          <nav className="david-app-workbench__mobile-tabs" aria-label="Workbench sections">\n            {([\n              ['prompt', 'PROMPT'],\n              ['locks', 'LOCKS'],\n              ['david', 'DAVID'],\n              ['notes', 'NOTES'],\n            ] as [MobileTab, string][]).map(([tab, label]) => (\n              <button\n                key={tab}\n                type="button"\n                className={mobileTab === tab ? 'is-active' : ''}\n                onClick={() => setMobileTab(tab)}\n              >\n                {label}\n                {tab === 'prompt' && pendingItems.length > 0 && <span>{pendingItems.length}</span>}\n              </button>\n            ))}\n          </nav>\n\n          {pendingItems.length > 0 && (\n            <section data-mobile-panel="prompt" className="david-app-workbench__section david-app-workbench__pending">\n              <div className="david-app-workbench__section-title">\n                <span className="flex items-center gap-1.5"><Layers3 size={12} /> LOCAL STAGING</span>\n                <span className="david-app-workbench__staged-badge">DAVID HAS NOT SEEN THIS</span>\n              </div>\n              <div className="david-app-workbench__pending-list">\n                {pendingItems.map((intent) => (\n                  <div key={intent.source}>\n                    <strong>{intent.label}</strong>\n                    <span>{intent.summary || 'Local changes are staged inside this section. Press that section’s APPLY button when finished.'}</span>\n                  </div>\n                ))}\n              </div>\n            </section>\n          )}`,
    'mobile nav and pending panel'
  );

  content = replaceOnce(
    content,
    '<section className="david-app-workbench__section david-app-workbench__main-prompt">',
    '<section data-mobile-panel="prompt" className="david-app-workbench__section david-app-workbench__main-prompt">',
    'main prompt mobile panel'
  );

  content = replaceOnce(
    content,
    '<span className="opacity-45">{mainPrompt.length} CH</span>',
    '<span className="david-app-workbench__committed-badge">{mainPrompt.length} CH · COMMITTED</span>',
    'committed prompt badge'
  );

  content = replaceOnce(
    content,
    `          <section className="david-app-workbench__section">\n            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Lock size={12} /> GLOBAL LOCKS</span></div>`,
    `          <section data-mobile-panel="locks" className="david-app-workbench__section">\n            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Lock size={12} /> GLOBAL LOCKS</span><span className="opacity-45">LOCAL UNTIL APPLY</span></div>`,
    'lock mobile panel'
  );

  content = replaceOnce(
    content,
    `            <div className="text-[9px] opacity-45 mt-2">{Object.keys(activeLocks).length || 0} active · locks are sent with every David reconciliation.</div>`,
    `            <div className="text-[9px] opacity-45 mt-2">{Object.keys(activeLocks).length || 0} active · editing locks is local/free. David sees them only when reconciling or synthesizing.</div>\n            <div className="david-app-workbench__lock-shortcuts">\n              {(['palette', 'density', 'energy', 'vibe'] as const).map((key) => (\n                <div key={key}>\n                  <span>{LOCK_LABELS[key]}</span>\n                  <div>\n                    {(LOCK_QUICK_VALUES[key] || []).map((value) => (\n                      <button\n                        type="button"\n                        key={value}\n                        onClick={() => setLocks((state) => ({\n                          ...state,\n                          [key]: { enabled: true, value },\n                        }))}\n                      >\n                        {value}\n                      </button>\n                    ))}\n                  </div>\n                </div>\n              ))}\n            </div>`,
    'lock shortcut controls'
  );

  content = replaceOnce(
    content,
    `          <section className="david-app-workbench__section">\n            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Sparkles size={12} /> DAVID SUGGESTS</span></div>`,
    `          <section data-mobile-panel="david" className="david-app-workbench__section">\n            <div className="david-app-workbench__section-title"><span className="flex items-center gap-1.5"><Sparkles size={12} /> DAVID SUGGESTS</span></div>`,
    'suggestions mobile panel'
  );

  content = replaceOnce(
    content,
    '<section className="david-app-workbench__section david-app-workbench__chat">',
    '<section data-mobile-panel="david" className="david-app-workbench__section david-app-workbench__chat">',
    'chat mobile panel'
  );

  const oldNotepadHeader = `          <section className="david-app-workbench__section">\n            <button type="button" className="david-app-workbench__section-title w-full" onClick={() => setNotepadOpen((value) => !value)}>\n              <span className="flex items-center gap-1.5"><NotebookPen size={12} /> MERRY'S NOTEPAD</span><span className="opacity-45">{notepadOpen ? 'HIDE' : 'POP OPEN'}</span>\n            </button>`;
  const newNotepadHeader = `          <section data-mobile-panel="notes" className="david-app-workbench__section">\n            <div className="david-app-workbench__notepad-head">\n              <button type="button" className="david-app-workbench__section-title" onClick={() => setNotepadOpen((value) => !value)}>\n                <span className="flex items-center gap-1.5"><NotebookPen size={12} /> MERRY'S NOTEPAD</span><span className="opacity-45">{notepadOpen ? 'HIDE INLINE' : 'OPEN INLINE'}</span>\n              </button>\n              <button type="button" className="david-app-workbench__icon" onClick={() => setNotepadDetached(true)} title="Pop notepad out into a floating scratch window">\n                <Maximize2 size={13} />\n              </button>\n            </div>`;
  content = replaceOnce(content, oldNotepadHeader, newNotepadHeader, 'notepad popout header');

  const asideTail = `      )}\n    </aside>`;
  const popout = `      )}\n\n      {notepadDetached && (\n        <div className="david-app-notepad-popout" role="dialog" aria-label="Merry's floating notepad">\n          <div className="david-app-notepad-popout__header">\n            <span><NotebookPen size={13} /> MERRY'S NOTEPAD // PRIVATE LOCAL SCRATCH</span>\n            <button type="button" className="david-app-workbench__icon" onClick={() => setNotepadDetached(false)} title="Dock / close floating notepad"><X size={14} /></button>\n          </div>\n          <textarea\n            value={notepad}\n            onChange={(event) => setNotepad(event.target.value)}\n            placeholder="Private scratchpad. David ignores this unless you explicitly send it."\n          />\n          <div className="david-app-notepad-popout__footer">\n            <span>LOCAL ONLY · AUTOSAVED</span>\n            <button type="button" className="david-app-workbench__button" disabled={!notepad.trim() || loading} onClick={() => void sendMessage(\`Read this note and use only what is relevant: \${notepad}\`)}>\n              <Send size={11} /> SEND NOTE TO DAVID\n            </button>\n          </div>\n        </div>\n      )}\n    </aside>`;
  content = replaceOnce(content, asideTail, popout, 'floating notepad');

  fs.writeFileSync(path, content, 'utf8');
  console.log('[job2-ux-v3] upgraded workbench UX');
}

function patchMutationLabStagingStatus() {
  const path = 'src/components/SlopVaultModal.tsx';
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes('MUTATION LAB STAGING V2')) {
    console.warn('[job2-ux-v3] Mutation Lab staging patch has not run yet; skipping pending-state UX');
    return;
  }
  if (content.includes('JOB2_MUTATION_PENDING_V3')) return;

  content = replaceOnce(
    content,
    " const [stagedPromptFragments, setStagedPromptFragments] = useState<string[]>([]);",
    ` const [stagedPromptFragments, setStagedPromptFragments] = useState<string[]>([]);\n // JOB2_MUTATION_PENDING_V3\n const committedFingerprint = JSON.stringify({ ...committedSlopConfig, selectedSeeds: committedSelectedSeeds });\n const draftFingerprint = JSON.stringify({ ...slopConfig, selectedSeeds });\n const hasLocalChanges = committedFingerprint !== draftFingerprint || stagedPromptFragments.length > 0;`,
    'mutation dirty fingerprint'
  );

  const resetEffect = ` useEffect(() => {\n  if (!isOpen) return;\n  setDraftSlopConfig(committedSlopConfig);\n  setDraftSelectedSeeds(committedSelectedSeeds);\n  setStagedPromptFragments([]);\n }, [isOpen]);`;
  const resetWithPending = ` useEffect(() => {\n  if (!isOpen) return;\n  setDraftSlopConfig(committedSlopConfig);\n  setDraftSelectedSeeds(committedSelectedSeeds);\n  setStagedPromptFragments([]);\n }, [isOpen]);\n\n useEffect(() => {\n  dispatchDavidIntent({\n   source: 'mutation-lab',\n   label: 'Mutation Lab',\n   summary: hasLocalChanges\n    ? \`\${selectedSeeds.length} DNA · \${slopConfig.selectedOperators?.length || 0} operators · \${slopConfig.selectedAttractors?.length || 0} fauna · \${stagedPromptFragments.length} engaged fragments staged locally.\`\n    : 'Mutation Lab has no unapplied local changes.',\n   committed: false,\n   changes: {\n    pending: isOpen && hasLocalChanges,\n    selectedSeedCount: selectedSeeds.length,\n    operatorCount: slopConfig.selectedOperators?.length || 0,\n    faunaCount: slopConfig.selectedAttractors?.length || 0,\n    pressureCount: slopConfig.selectedPressures?.length || 0,\n    fragmentCount: stagedPromptFragments.length,\n   },\n  });\n }, [isOpen, hasLocalChanges, selectedSeeds.length, slopConfig.selectedOperators?.length, slopConfig.selectedAttractors?.length, slopConfig.selectedPressures?.length, stagedPromptFragments.length]);`;
  content = replaceOnce(content, resetEffect, resetWithPending, 'mutation pending effect');

  content = replaceOnce(
    content,
    " const handleApplyLab = () => {\n  const finalizedConfig: SlopSeedingConfig = {",
    " const handleApplyLab = () => {\n  if (!hasLocalChanges) {\n   onClose();\n   return;\n  }\n  const finalizedConfig: SlopSeedingConfig = {",
    'mutation apply dirty guard'
  );

  content = replaceOnce(
    content,
    'className="flex items-center gap-1.5 px-3 py-1.5 bg-phosphor text-theme-bg border border-phosphor text-xs font-mono font-bold transition-opacity hover:opacity-90"',
    "disabled={!hasLocalChanges}\n className={`flex items-center gap-1.5 px-3 py-1.5 border text-xs font-mono font-bold transition-opacity ${hasLocalChanges ? 'bg-phosphor text-theme-bg border-phosphor hover:opacity-90' : 'bg-theme-panel text-phosphor/35 border-phosphor/20 cursor-not-allowed'}`}",
    'mutation apply disabled state'
  );

  content = replaceOnce(
    content,
    '<span>APPLY LAB → DAVID</span>',
    "<span>{hasLocalChanges ? 'APPLY LAB → DAVID' : 'NO LOCAL CHANGES'}</span>",
    'mutation apply button text'
  );

  content = replaceOnce(
    content,
    ` {stagedPromptFragments.length > 0 && (\n  <span className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">\n   {stagedPromptFragments.length} staged prompt fragment{stagedPromptFragments.length === 1 ? '' : 's'}\n  </span>\n )}`,
    ` {hasLocalChanges && (\n  <span className="text-[10px] font-mono px-2 py-0.5 bg-phosphor/10 text-phosphor border border-phosphor/30 terminal-border">\n   LOCAL STAGED · {selectedSeeds.length} DNA · {slopConfig.selectedOperators?.length || 0} OPS · {slopConfig.selectedAttractors?.length || 0} FAUNA · {stagedPromptFragments.length} FRAGMENTS\n  </span>\n )}`,
    'mutation staged summary'
  );

  content = content.replace(
    'LOCAL STAGING · nothing reaches MAIN PROMPT until APPLY LAB',
    'LOCAL STAGING · DAVID HAS NOT SEEN THESE CHANGES · APPLY LAB WHEN FINISHED'
  );

  fs.writeFileSync(path, content, 'utf8');
  console.log('[job2-ux-v3] Mutation Lab now broadcasts UI-only staged status');
}

function patchInterfaceShell() {
  const path = 'src/components/InterfaceShell.tsx';
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('JOB2_OPEN_WORKBENCH_V3')) return;

  const oldHelper = `function clickConsultButton() {\n  window.setTimeout(() => {\n    const button = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((item) =>\n      item.textContent?.toUpperCase().includes('CONSULT DAVID')\n    );\n    button?.click();\n  }, 30);\n}`;
  const newHelper = `// JOB2_OPEN_WORKBENCH_V3\nfunction openDavidWorkbench() {\n  window.setTimeout(() => {\n    window.dispatchEvent(new Event('david:open-workbench'));\n  }, 30);\n}`;
  content = replaceOnce(content, oldHelper, newHelper, 'InterfaceShell workbench opener');
  content = content.replace('                    clickConsultButton();', '                    openDavidWorkbench();');
  fs.writeFileSync(path, content, 'utf8');
  console.log('[job2-ux-v3] landing console now opens the real app workbench');
}

function patchApplyLanguage() {
  const replacements = [
    ['src/components/GuidanceGeometryPanel.tsx', [['Apply to Prompt Canvas', 'APPLY SECTION → DAVID']]],
    ['src/components/StructuralRelationalPanel.tsx', [['Apply Relational Sequence to Main Prompt', 'APPLY SECTION → DAVID']]],
    ['src/components/ContextDiagnosticsPanel.tsx', [['Apply Rendered Sequence to Main Prompt', 'APPLY SECTION → DAVID']]],
    ['src/components/SerializationDiagnosticsPanel.tsx', [['Use in Prompt', 'APPLY SECTION → DAVID']]],
    ['src/components/DiscoveryLabPanel.tsx', [
      ['Apply to Input', 'APPLY SECTION → DAVID'],
      ['Applied Control Prompt to Synthesis Input', 'Sent Control Prompt to DAVID for reconciliation'],
      ['Applied Variant Prompt to Synthesis Input', 'Sent Variant Prompt to DAVID for reconciliation'],
    ]],
  ];

  for (const [path, pairs] of replacements) {
    let content = fs.readFileSync(path, 'utf8');
    for (const [from, to] of pairs) content = content.split(from).join(to);
    fs.writeFileSync(path, content, 'utf8');
  }
  console.log('[job2-ux-v3] normalized APPLY language across technical sections');
}

function patchLegacyConsultDebris() {
  const path = 'src/App.tsx';
  let content = fs.readFileSync(path, 'utf8');

  // patch-workbench-v2 has already swapped ConsultChat for DavidAppWorkbench.
  // Remove only the obsolete launcher/state that otherwise becomes a dead glowing button.
  content = content.replace(/\n\s*const \[consultChatOpen, setConsultChatOpen\] = useState<boolean>\(false\);/, '');
  content = content.replace(/\n\s*\/\*\*? MASSIVE GLOWING CONSULT BUTTON \*\/\s*\n\s*\{!consultChatOpen && \([\s\S]*?\n\s*\)\}\s*/m, '\n');
  content = content.replace(/\n\s*\/\* MASSIVE GLOWING CONSULT BUTTON \*\/\s*\n\s*\{!consultChatOpen && \([\s\S]*?\n\s*\)\}\s*/m, '\n');
  content = content.replace(/, MessageSquare\s*\}/, ' }');
  content = content.replace(/,\s*MessageSquare\s*}/, ' }');

  fs.writeFileSync(path, content, 'utf8');
  console.log('[job2-ux-v3] removed obsolete Consult launcher debris from built App');
}

function patchWorkbenchCss() {
  const path = 'src/workbench.css';
  let content = fs.readFileSync(path, 'utf8');
  if (content.includes('JOB2_UX_V3_CSS')) return;

  content += `\n\n/* JOB2_UX_V3_CSS */\n.david-app-workbench__header-actions {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.david-app-workbench__status,\n.david-app-workbench__staged-badge,\n.david-app-workbench__committed-badge {\n  font-size: 7px;\n  line-height: 1;\n  letter-spacing: .08em;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n\n.david-app-workbench__status {\n  padding: 4px 5px;\n  border: 1px solid color-mix(in srgb, var(--phosphor) 22%, transparent);\n  opacity: .66;\n}\n\n.david-app-workbench__status.is-staged {\n  opacity: 1;\n  background: color-mix(in srgb, var(--phosphor) 10%, transparent);\n  border-color: color-mix(in srgb, var(--phosphor) 58%, transparent);\n  animation: davidStagePulse 1.8s ease-in-out infinite;\n}\n\n.david-app-workbench__status.is-working {\n  opacity: 1;\n  background: var(--phosphor);\n  color: var(--bg-dark);\n}\n\n@keyframes davidStagePulse {\n  0%, 100% { opacity: .55; }\n  50% { opacity: 1; }\n}\n\n.david-app-workbench__mobile-tabs { display: none; }\n\n.david-app-workbench__pending {\n  border-style: dashed;\n  background: color-mix(in srgb, var(--phosphor) 6%, transparent);\n}\n\n.david-app-workbench__staged-badge {\n  padding: 3px 4px;\n  border: 1px solid color-mix(in srgb, var(--phosphor) 45%, transparent);\n}\n\n.david-app-workbench__committed-badge {\n  opacity: .55;\n}\n\n.david-app-workbench__pending-list {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n\n.david-app-workbench__pending-list > div {\n  display: grid;\n  grid-template-columns: 92px minmax(0, 1fr);\n  gap: 7px;\n  padding: 5px 0;\n  border-top: 1px dashed color-mix(in srgb, var(--phosphor) 16%, transparent);\n  font-size: 8px;\n  line-height: 1.35;\n}\n\n.david-app-workbench__pending-list strong {\n  text-transform: uppercase;\n  letter-spacing: .05em;\n}\n\n.david-app-workbench__pending-list span { opacity: .62; }\n\n.david-app-workbench__lock-shortcuts {\n  margin-top: 9px;\n  padding-top: 8px;\n  border-top: 1px dashed color-mix(in srgb, var(--phosphor) 18%, transparent);\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.david-app-workbench__lock-shortcuts > div > span {\n  display: block;\n  margin-bottom: 4px;\n  font-size: 7px;\n  text-transform: uppercase;\n  letter-spacing: .08em;\n  opacity: .45;\n}\n\n.david-app-workbench__lock-shortcuts > div > div {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n}\n\n.david-app-workbench__lock-shortcuts button {\n  border: 1px solid color-mix(in srgb, var(--phosphor) 18%, transparent);\n  background: transparent;\n  color: inherit;\n  padding: 3px 5px;\n  font: inherit;\n  font-size: 7px;\n  opacity: .62;\n}\n\n.david-app-workbench__lock-shortcuts button:hover {\n  opacity: 1;\n  background: color-mix(in srgb, var(--phosphor) 10%, transparent);\n}\n\n.david-app-workbench__notepad-head {\n  display: grid;\n  grid-template-columns: 1fr auto;\n  gap: 6px;\n  align-items: start;\n}\n\n.david-app-workbench__notepad-head .david-app-workbench__section-title {\n  width: 100%;\n  margin: 0 0 7px;\n}\n\n.david-app-notepad-popout {\n  position: fixed;\n  z-index: 74;\n  left: 18px;\n  top: 82px;\n  width: min(520px, calc(100vw - 440px));\n  min-width: 330px;\n  height: 430px;\n  min-height: 260px;\n  resize: both;\n  overflow: hidden;\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  border: 1px solid color-mix(in srgb, var(--phosphor) 58%, transparent);\n  background: color-mix(in srgb, var(--panel-dark) 97%, black);\n  box-shadow: 0 20px 70px rgba(0,0,0,.64);\n  color: var(--phosphor);\n}\n\n.david-app-notepad-popout__header,\n.david-app-notepad-popout__footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 8px;\n  padding: 8px 9px;\n  border-bottom: 1px solid color-mix(in srgb, var(--phosphor) 24%, transparent);\n  font-size: 8px;\n  text-transform: uppercase;\n  letter-spacing: .08em;\n}\n\n.david-app-notepad-popout__header > span {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.david-app-notepad-popout__footer {\n  border-bottom: 0;\n  border-top: 1px solid color-mix(in srgb, var(--phosphor) 24%, transparent);\n}\n\n.david-app-notepad-popout__footer > span { opacity: .45; }\n\n.david-app-notepad-popout textarea {\n  width: 100%;\n  height: 100%;\n  resize: none;\n  border: 0;\n  outline: 0;\n  padding: 12px;\n  background: rgba(0,0,0,.32);\n  color: var(--phosphor);\n  font: inherit;\n  font-size: 11px;\n  line-height: 1.55;\n}\n\n@media (max-width: 1179px) {\n  .david-app-workbench {\n    max-height: min(76vh, 700px);\n  }\n\n  .david-app-workbench__header-actions .david-app-workbench__status {\n    max-width: 94px;\n    overflow: hidden;\n    text-overflow: ellipsis;\n  }\n\n  .david-app-workbench__mobile-tabs {\n    position: sticky;\n    top: -10px;\n    z-index: 4;\n    display: grid;\n    grid-template-columns: repeat(4, 1fr);\n    gap: 3px;\n    padding: 4px 0 8px;\n    background: color-mix(in srgb, var(--panel-dark) 97%, transparent);\n    border-bottom: 1px solid color-mix(in srgb, var(--phosphor) 16%, transparent);\n  }\n\n  .david-app-workbench__mobile-tabs button {\n    min-height: 30px;\n    border: 1px solid color-mix(in srgb, var(--phosphor) 18%, transparent);\n    background: transparent;\n    color: var(--phosphor);\n    font: inherit;\n    font-size: 8px;\n    letter-spacing: .07em;\n  }\n\n  .david-app-workbench__mobile-tabs button.is-active {\n    background: var(--phosphor);\n    color: var(--bg-dark);\n    border-color: var(--phosphor);\n    font-weight: 800;\n  }\n\n  .david-app-workbench__mobile-tabs button span {\n    display: inline-grid;\n    place-items: center;\n    min-width: 14px;\n    height: 14px;\n    margin-left: 4px;\n    border: 1px solid currentColor;\n  }\n\n  .david-app-workbench.mobile-tab-prompt [data-mobile-panel]:not([data-mobile-panel=\"prompt\"]),\n  .david-app-workbench.mobile-tab-locks [data-mobile-panel]:not([data-mobile-panel=\"locks\"]),\n  .david-app-workbench.mobile-tab-david [data-mobile-panel]:not([data-mobile-panel=\"david\"]),\n  .david-app-workbench.mobile-tab-notes [data-mobile-panel]:not([data-mobile-panel=\"notes\"]) {\n    display: none;\n  }\n\n  .david-app-workbench__prompt {\n    min-height: 190px;\n    max-height: 42vh;\n  }\n\n  .david-app-workbench__messages { max-height: 32vh; }\n\n  .david-app-notepad-popout {\n    inset: max(8px, env(safe-area-inset-top)) 8px max(8px, env(safe-area-inset-bottom));\n    width: auto;\n    height: auto;\n    min-width: 0;\n    min-height: 0;\n    resize: none;\n  }\n}\n`;

  fs.writeFileSync(path, content, 'utf8');
  console.log('[job2-ux-v3] appended workbench UX CSS');
}

patchWorkbench();
patchMutationLabStagingStatus();
patchInterfaceShell();
patchApplyLanguage();
patchLegacyConsultDebris();
patchWorkbenchCss();
