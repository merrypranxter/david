const fs = require('fs');

const vaultPath = 'src/components/SlopVaultModal.tsx';
const workbenchPath = 'src/components/DavidAppWorkbench.tsx';

function patchMutationLabPaletteBridge() {
  let content = fs.readFileSync(vaultPath, 'utf8');
  if (content.includes('PALETTE_LOCK_BRIDGE_V1')) {
    console.log('[palette-lock-bridge] Mutation Lab already patched');
    return;
  }

  const entriesMarker = ` const allDnaEntries = useMemo(() => {\n return [\n ...MATH_LEXICON.map((e) => ({ ...e, domainLabel: 'Maths' })),\n ...SCIENCE_LEXICON.map((e) => ({ ...e, domainLabel: 'Sciences' })),\n ...getMerryDnaLexicon(dnaBank).map((e) => ({ ...e, domainLabel: 'Merry DNA' })),\n ];\n }, [dnaBank]);`;

  const entriesReplacement = `${entriesMarker}\n\n // PALETTE_LOCK_BRIDGE_V1\n const selectedPaletteSeeds = useMemo(() => {\n  const paletteEntry = getMerryDnaLexicon(dnaBank).find((entry) => entry.id === 'color_palettes');\n  const paletteKeywords = new Set(paletteEntry?.keywords || []);\n  return selectedSeeds.filter((seed) => paletteKeywords.has(seed));\n }, [dnaBank, selectedSeeds]);\n\n const promoteSelectedPaletteToGlobalLock = () => {\n  if (!selectedPaletteSeeds.length) return;\n  window.dispatchEvent(new CustomEvent('david:set-global-lock', {\n   detail: {\n    key: 'palette',\n    value: selectedPaletteSeeds.join(' + '),\n    enabled: true,\n    source: 'mutation-lab-palette',\n   },\n  }));\n };`;

  if (!content.includes(entriesMarker)) {
    console.error('[palette-lock-bridge] Merry DNA entry block not found');
    process.exitCode = 1;
    return;
  }
  content = content.replace(entriesMarker, entriesReplacement);

  const cycleMarker = `  CYCLE BANK {dnaBank + 1}/4 → {((dnaBank + 1) % 4) + 1}/4\n </button>`;
  const cycleReplacement = `${cycleMarker}\n {selectedPaletteSeeds.length > 0 && (\n  <button\n   type=\"button\"\n   onClick={promoteSelectedPaletteToGlobalLock}\n   className=\"px-3 py-1 bg-theme-panel text-phosphor border border-phosphor text-[11px] font-mono font-bold whitespace-nowrap\"\n   title=\"Promote the currently selected Color Palette DNA seed(s) into the app-wide Palette lock without calling David yet\"\n  >\n   LOCK PALETTE ({selectedPaletteSeeds.length})\n  </button>\n )}`;

  if (!content.includes(cycleMarker)) {
    console.error('[palette-lock-bridge] cycle bank button marker not found');
    process.exitCode = 1;
    return;
  }
  content = content.replace(cycleMarker, cycleReplacement);

  fs.writeFileSync(vaultPath, content, 'utf8');
  console.log('[palette-lock-bridge] selected Merry DNA palettes can promote directly to the global Palette lock');
}

function patchWorkbenchLockReceiver() {
  let content = fs.readFileSync(workbenchPath, 'utf8');
  if (content.includes('GLOBAL_LOCK_RECEIVER_V1')) {
    console.log('[palette-lock-bridge] workbench already patched');
    return;
  }

  const marker = `  useEffect(() => {\n    localStorage.setItem(NOTE_STORAGE, notepad);\n  }, [notepad]);`;
  const replacement = `${marker}\n\n  // GLOBAL_LOCK_RECEIVER_V1\n  // Local bridge only: other app sections can promote a value into a lock\n  // without making an AI call or touching MAIN PROMPT.\n  useEffect(() => {\n    const receiveLock = (event: Event) => {\n      const detail = (event as CustomEvent<{ key?: LockKey; value?: string; enabled?: boolean }>).detail;\n      if (!detail?.key || !(detail.key in DEFAULT_LOCKS)) return;\n      const value = String(detail.value || '').trim();\n      setLocksDirty(true);\n      setLocks((state) => ({\n        ...state,\n        [detail.key as LockKey]: {\n          enabled: detail.enabled !== false,\n          value,\n        },\n      }));\n      setCollapsed(false);\n      if (typeof setMobileTab === 'function') setMobileTab('locks');\n    };\n    window.addEventListener('david:set-global-lock', receiveLock);\n    return () => window.removeEventListener('david:set-global-lock', receiveLock);\n  }, []);`;

  if (!content.includes(marker)) {
    console.error('[palette-lock-bridge] notepad effect marker not found in workbench');
    process.exitCode = 1;
    return;
  }
  content = content.replace(marker, replacement);

  fs.writeFileSync(workbenchPath, content, 'utf8');
  console.log('[palette-lock-bridge] workbench now accepts local global-lock promotions');
}

patchMutationLabPaletteBridge();
patchWorkbenchLockReceiver();
