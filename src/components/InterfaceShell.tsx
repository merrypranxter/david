import React, { useEffect, useMemo, useState } from 'react';

type ThemeOption = {
  id: string;
  short: string;
  label: string;
  swatch: string;
};

type ModuleItem = {
  id: string;
  glyph: string;
  label: string;
  detail: string;
  action: () => void;
};

const THEMES: ThemeOption[] = [
  { id: 'theme-mother-green', short: 'GRN', label: 'Mother Green', swatch: '#78FF77' },
  { id: 'theme-merry-magenta', short: 'MAG', label: 'Merry Magenta', swatch: '#FF4FD8' },
  { id: 'theme-synthetic-violet', short: 'VIO', label: 'Synthetic Violet', swatch: '#B875FF' },
  { id: 'theme-acid-yellow', short: 'YEL', label: 'Acid Yellow', swatch: '#EFFF52' },
  { id: 'theme-cryo-cyan', short: 'CYN', label: 'Cryo Cyan', swatch: '#43F5FF' },
  { id: 'theme-solar-orange', short: 'ORG', label: 'Solar Orange', swatch: '#FF8A3D' },
];

const CRT_MODES = [
  { id: 'crt-off', short: 'OFF', label: 'CRT Off' },
  { id: 'crt-clean', short: 'CLN', label: 'Clean CRT' },
  { id: 'crt-aged', short: 'AGD', label: 'Aged CRT' },
];

function dispatchHeaderSelectValue(value: string) {
  const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('header select'));
  const target = selects.find((select) => Array.from(select.options).some((option) => option.value === value));
  if (!target) return;
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
  setter?.call(target, value);
  target.dispatchEvent(new Event('change', { bubbles: true }));
}

function clickExistingButton(id: string) {
  window.setTimeout(() => {
    document.getElementById(id)?.click();
  }, 30);
}

function clickConsultButton() {
  window.setTimeout(() => {
    const button = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((item) =>
      item.textContent?.toUpperCase().includes('CONSULT DAVID')
    );
    button?.click();
  }, 30);
}

export function InterfaceShell({ children }: { children: React.ReactNode }) {
  const [homeOpen, setHomeOpen] = useState(true);
  const [displayOpen, setDisplayOpen] = useState(false);
  const [helpId, setHelpId] = useState<string | null>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('david_phosphor_theme') || 'theme-mother-green');
  const [crt, setCrt] = useState(() => localStorage.getItem('david_crt_mode') || 'crt-clean');

  useEffect(() => {
    document.body.classList.toggle('david-home-active', homeOpen);
    return () => document.body.classList.remove('david-home-active');
  }, [homeOpen]);

  const applyTheme = (next: string) => {
    setTheme(next);
    localStorage.setItem('david_phosphor_theme', next);
    document.body.classList.remove(...THEMES.map((item) => item.id));
    document.body.classList.add(next);
    dispatchHeaderSelectValue(next);
  };

  const applyCrt = (next: string) => {
    setCrt(next);
    localStorage.setItem('david_crt_mode', next);
    document.body.classList.remove(...CRT_MODES.map((item) => item.id));
    document.body.classList.add(next);
    dispatchHeaderSelectValue(next);
  };

  const openModule = (id: string) => {
    setHomeOpen(false);
    clickExistingButton(id);
  };

  const modules = useMemo<ModuleItem[]>(
    () => [
      {
        id: 'manual',
        glyph: '[>_]',
        label: 'Manual Synthesis Console',
        detail: 'Open the full cockpit: targets, prompt seed, entropy, operators, pipelines, outputs and diagnostics.',
        action: () => setHomeOpen(false),
      },
      {
        id: 'mutation',
        glyph: '[◇]',
        label: 'Mutation Lab + Vault',
        detail: 'Open mutation operators, attractors, slop seeds and the weirdness machinery without hunting through the page.',
        action: () => openModule('open-slop-vault-btn'),
      },
      {
        id: 'discovery',
        glyph: '[⌁]',
        label: 'Discovery Engine',
        detail: 'Jump to experimental recipe discovery and model-behavior exploration.',
        action: () => openModule('open-discovery-lab-btn'),
      },
      {
        id: 'memory',
        glyph: '[≡]',
        label: 'Experiment Memory',
        detail: 'Open empirical run history, saved observations and experiment memory.',
        action: () => openModule('open-experiment-memory-btn'),
      },
      {
        id: 'recipes',
        glyph: '[▣]',
        label: 'Saved Recipes',
        detail: 'Load or manage preserved DAVID configurations and mutation recipes.',
        action: () => openModule('open-recipes-btn'),
      },
      {
        id: 'zalgo',
        glyph: '[∿]',
        label: 'Zalgo / Serialization Tool',
        detail: 'Open the glitch-text injector and serialization-oriented text mutations.',
        action: () => openModule('open-zalgo-btn'),
      },
      {
        id: 'archives',
        glyph: '[::]',
        label: 'Synthetic Archives',
        detail: 'Open the manifesto, source notes and DAVID archive material.',
        action: () => openModule('open-manifesto-btn'),
      },
      {
        id: 'display',
        glyph: '[▤]',
        label: 'Display / Phosphor',
        detail: 'Change phosphor color and CRT treatment. This changes the whole terminal, not just the decoration.',
        action: () => setDisplayOpen((value) => !value),
      },
    ],
    []
  );

  return (
    <div className="david-shell-root">
      <div className="david-shell-app">{children}</div>

      {!homeOpen && (
        <button
          type="button"
          className="wy-home-return"
          onClick={() => setHomeOpen(true)}
          title="Return to DAVID system directory"
        >
          <span aria-hidden="true">[⌂]</span>
          <span>HOME</span>
        </button>
      )}

      {homeOpen && (
        <section className="wy-home" aria-label="DAVID system directory">
          <div className="wy-home-noise" aria-hidden="true" />
          <div className="wy-home-frame">
            <header className="wy-corp-header">
              <div className="wy-corp-id">
                <div className="wy-mark" aria-hidden="true">W-Y</div>
                <div>
                  <div className="wy-kicker">WEYLAND-YUTANI CORPORATION // SYNTHETIC SYSTEMS DIVISION</div>
                  <div className="wy-subkicker">SPECIAL PROJECTS TERMINAL // AUTHORIZED OPERATOR: MERRY</div>
                </div>
              </div>
              <div className="wy-display-readout">
                <span>PHOSPHOR {THEMES.find((item) => item.id === theme)?.short}</span>
                <span>CRT {CRT_MODES.find((item) => item.id === crt)?.short}</span>
              </div>
            </header>

            <div className="wy-signal-line" aria-hidden="true">
              <span className="wy-signal-a">[ · - - ]</span>
              <span>==============================================================</span>
              <span className="wy-signal-b">[ - - · ]</span>
            </div>

            <main className="wy-home-main">
              <section className="wy-identity-block">
                <div className="wy-system-index">SYNTHETIC COGNITION UNIT // 08</div>
                <div className="wy-david-title">DAVID 8</div>
                <div className="wy-david-subtitle">CREATIVE COGNITION TERMINAL</div>
                <div className="wy-status-row">
                  <span className="wy-live-dot" aria-hidden="true" />
                  <span>SYSTEM NOMINAL</span>
                  <span>//</span>
                  <span>CONSULTATION CHANNEL READY</span>
                </div>
              </section>

              <section className="wy-console-entry">
                <button
                  type="button"
                  className="wy-console-button"
                  onClick={() => {
                    setHomeOpen(false);
                    clickConsultButton();
                  }}
                >
                  <span className="wy-console-glyph" aria-hidden="true">&gt;_</span>
                  <span className="wy-console-copy">
                    <strong>ENTER DAVID CONSOLE</strong>
                    <small>Primary interface // talk to David</small>
                  </span>
                  <span className="wy-console-cursor" aria-hidden="true">█</span>
                </button>
                <p>
                  You do not need the cockpit for ordinary work. Tell David what you want. Open the machinery only when you want to touch it.
                </p>
              </section>

              <section className="wy-directory" aria-label="System modules">
                <div className="wy-directory-heading">
                  <span>SYSTEM DIRECTORY</span>
                  <span>SELECT MODULE // [?] FOR DESCRIPTION</span>
                </div>

                <div className="wy-directory-grid">
                  {modules.map((module, index) => {
                    const helpOpen = helpId === module.id;
                    return (
                      <div className={`wy-module ${helpOpen ? 'is-help-open' : ''}`} key={module.id}>
                        <button type="button" className="wy-module-main" onClick={module.action}>
                          <span className="wy-module-number">{String(index + 1).padStart(2, '0')}</span>
                          <span className="wy-module-glyph" aria-hidden="true">{module.glyph}</span>
                          <span className="wy-module-label">{module.label}</span>
                        </button>
                        <button
                          type="button"
                          className="wy-help-button"
                          onClick={() => setHelpId(helpOpen ? null : module.id)}
                          aria-expanded={helpOpen}
                          aria-label={`Explain ${module.label}`}
                        >
                          [?]
                        </button>
                        {helpOpen && <div className="wy-module-help">{module.detail}</div>}
                      </div>
                    );
                  })}
                </div>

                {displayOpen && (
                  <div className="wy-display-panel">
                    <div className="wy-display-title">DISPLAY CONTROL // LOCAL TERMINAL PROFILE</div>
                    <div className="wy-display-group">
                      <span className="wy-display-label">PHOSPHOR</span>
                      <div className="wy-display-options">
                        {THEMES.map((option) => (
                          <button
                            type="button"
                            key={option.id}
                            className={theme === option.id ? 'is-active' : ''}
                            onClick={() => applyTheme(option.id)}
                            title={option.label}
                          >
                            <span className="wy-swatch" style={{ background: option.swatch }} aria-hidden="true" />
                            {option.short}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="wy-display-group">
                      <span className="wy-display-label">CRT</span>
                      <div className="wy-display-options">
                        {CRT_MODES.map((option) => (
                          <button
                            type="button"
                            key={option.id}
                            className={crt === option.id ? 'is-active' : ''}
                            onClick={() => applyCrt(option.id)}
                          >
                            {option.short}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </main>

            <footer className="wy-home-footer">
              <span>WY-SYS/DAVID-08</span>
              <span className="wy-footer-center">BUILD FOR STRANGE WORK // MANUAL OVERRIDE AVAILABLE</span>
              <span>READY_</span>
            </footer>
          </div>
        </section>
      )}
    </div>
  );
}
