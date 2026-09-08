const fs = require('fs');

function replaceBetween(content, startMarker, endMarker, replacement, label) {
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    console.warn(`[suno-dual] ${label}: markers not found; skipping.`);
    return content;
  }
  return content.slice(0, start) + replacement + '\n\n' + content.slice(end);
}

// ---------------------------------------------------------------------------
// 1) PromptInputArea: give Suno two genuinely separate editable input buffers.
// ---------------------------------------------------------------------------
const inputPath = 'src/components/PromptInputArea.tsx';
let input = fs.readFileSync(inputPath, 'utf8');

if (!input.includes('SUNO_STYLE_SEED_START')) {
  const helperAnchor = " const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {";
  const helpers = ` const parseSunoBuffers = (raw: string) => {\n const styleMatch = raw.match(/<<<SUNO_STYLE_SEED_START>>>\\n?([\\s\\S]*?)\\n?<<<SUNO_STYLE_SEED_END>>>/);\n const lyricsMatch = raw.match(/<<<SUNO_LYRICS_SEED_START>>>\\n?([\\s\\S]*?)\\n?<<<SUNO_LYRICS_SEED_END>>>/);\n if (styleMatch || lyricsMatch) {\n return { style: styleMatch?.[1] || '', lyrics: lyricsMatch?.[1] || '' };\n }\n return { style: raw || '', lyrics: '' };\n };\n\n const encodeSunoBuffers = (style: string, lyrics: string) =>\n \`<<<SUNO_STYLE_SEED_START>>>\\n\${style}\\n<<<SUNO_STYLE_SEED_END>>>\\n<<<SUNO_LYRICS_SEED_START>>>\\n\${lyrics}\\n<<<SUNO_LYRICS_SEED_END>>>\`;\n\n const sunoBuffers = parseSunoBuffers(concept);\n const setSunoBuffer = (buffer: 'style' | 'lyrics', value: string) => {\n const nextStyle = buffer === 'style' ? value : sunoBuffers.style;\n const nextLyrics = buffer === 'lyrics' ? value : sunoBuffers.lyrics;\n setConcept(encodeSunoBuffers(nextStyle, nextLyrics));\n };\n\n`;
  input = input.replace(helperAnchor, helpers + helperAnchor);
}

// Make injection chips affect only the Suno style buffer, never the lyrics buffer.
input = input.replace(
  " const handleInsertTag = (tag: string) => {\n setConcept(concept ? `${concept.trim()} ${tag}` : tag);\n };",
  " const handleInsertTag = (tag: string) => {\n if (target === 'suno') {\n const next = sunoBuffers.style ? `${sunoBuffers.style.trim()} ${tag}` : tag;\n setSunoBuffer('style', next.slice(0, 999));\n return;\n }\n setConcept(concept ? `${concept.trim()} ${tag}` : tag);\n };"
);

const primaryStart = ' {/* Primary Concept Textarea */}';
const primaryEnd = ' {/* AI SLOP SEEDING & CONTRADICTION MATRIX */}';
const dualInputBlock = ` {/* Primary Concept / Suno Dual Buffers */}\n {target === 'suno' ? (\n <div className=\"relative pt-2 space-y-3\">\n <div className=\"absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[10px] font-display font-bold uppercase tracking-widest z-10\">04 // SUNO DUAL INPUT</div>\n <div className=\"grid grid-cols-1 lg:grid-cols-2 gap-3 pt-3\">\n <div className=\"bg-theme-bg terminal-border p-3 space-y-2\">\n <div className=\"flex items-center justify-between gap-2\">\n <label className=\"text-[11px] font-display text-phosphor uppercase tracking-widest flex items-center gap-1.5\">\n <Music className=\"w-3.5 h-3.5\" /> SUNO STYLE\n </label>\n <span className={\`text-[10px] font-mono \${sunoBuffers.style.length > 999 ? 'text-semantic-red' : 'text-phosphor/60'}\`}>\n {sunoBuffers.style.length}/999\n </span>\n </div>\n <textarea\n id=\"suno-style-seed-input\"\n value={sunoBuffers.style}\n maxLength={999}\n onChange={(e) => setSunoBuffer('style', e.target.value)}\n onKeyDown={handleKeyDown}\n rows={5}\n placeholder=\"Music only: genre collisions, instrumentation, rhythm, production, timbre, acoustic space, vocal character, signal behavior...\"\n className=\"w-full bg-theme-panel terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed\"\n />\n <p className=\"text-[10px] font-mono text-phosphor/45 leading-relaxed\">\n Style is its own organism. Hard ceiling: 999 characters. No lyric lines in this buffer.\n </p>\n </div>\n\n <div className=\"bg-theme-bg terminal-border p-3 space-y-2\">\n <div className=\"flex items-center justify-between gap-2\">\n <label className=\"text-[11px] font-display text-phosphor uppercase tracking-widest flex items-center gap-1.5\">\n <FileText className=\"w-3.5 h-3.5\" /> SUNO LYRICS\n </label>\n <span className={\`text-[10px] font-mono \${sunoBuffers.lyrics.length > 3000 ? 'text-semantic-red' : 'text-phosphor/60'}\`}>\n {sunoBuffers.lyrics.length}/3000\n </span>\n </div>\n <textarea\n id=\"suno-lyrics-seed-input\"\n value={sunoBuffers.lyrics}\n maxLength={3000}\n onChange={(e) => setSunoBuffer('lyrics', e.target.value)}\n onKeyDown={handleKeyDown}\n rows={9}\n placeholder=\"Paste a poem, gibberish, phonetics, equations, Unicode, Zalgo-ready text, or actual lyrics here. David mutates THIS separately from the style.\"\n className=\"w-full bg-theme-panel terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed\"\n />\n <div className=\"text-[10px] font-mono text-phosphor/45 leading-relaxed space-y-1\">\n <p><span className=\"text-phosphor\">BRACKET LAW:</span> anything not meant to be sung belongs in [square brackets].</p>\n <p>Examples: [Verse], [Chorus], [Whispered], [Instrumental], [Breakdown: voice fractures into granular static]. Text outside brackets is vocal content.</p>\n </div>\n </div>\n </div>\n </div>\n ) : (\n <div className=\"relative pt-2\">\n <div className=\"absolute top-0 right-0 px-2 py-0.5 bg-phosphor text-theme-bg text-[10px] font-display font-bold uppercase tracking-widest z-10\">04 // CONCEPT SEED</div>\n <div className=\"flex items-center justify-between mb-1.5 flex-wrap gap-2\">\n <label className=\"text-[11px] font-display text-phosphor/60 uppercase tracking-widest flex items-center gap-1.5\">\n <span>Operative Concept:</span>\n <span className={\`px-1.5 py-0.5 text-[10px] font-mono font-bold \${concept.length > 1000 ? 'bg-phosphor/20 text-phosphor border border-phosphor/30' : 'bg-theme-bg text-phosphor/40'}\`}>\n {concept.length} chars\n </span>\n </label>\n <div className=\"flex items-center gap-2\">\n <span className=\"text-[10px] font-mono text-phosphor bg-phosphor/10 px-2 py-0.5 border terminal-border\">\n Target Output: ~{targetLength} chars (90–95% budget)\n </span>\n <span className=\"text-[10px] font-mono text-phosphor/40 hidden sm:inline\">Ctrl/Cmd + Enter to compile</span>\n </div>\n </div>\n <textarea\n id=\"operative-concept-input\"\n value={concept}\n onChange={(e) => {\n const val = e.target.value;\n setConcept(val);\n if (val.length > targetLength && val.length > 1200) {\n const ceiling = target === 'openart' ? 3100 : target === 'midjourney_flux' || target === 'grok' ? 1900 : 3800;\n setTargetLength(Math.min(ceiling, Math.max(targetLength, Math.floor(val.length * 1.1))));\n }\n }}\n onKeyDown={handleKeyDown}\n rows={3}\n placeholder=\"Describe your desired sensory output, acoustic paradox, or visual topology...\"\n className=\"w-full bg-theme-bg terminal-border focus:border-phosphor p-3 text-xs sm:text-sm font-mono text-phosphor placeholder-phosphor/30 focus:outline-none shadow-inner leading-relaxed\"\n />\n <div className=\"flex flex-wrap items-center gap-1.5 mt-2\">\n <span className=\"text-[10px] font-display text-phosphor/50 uppercase tracking-widest\">INJECTIONS:</span>\n {[\n '0Hz infrasound',\n 'calcified bone',\n 'hydrophone filter',\n 'glottal overflow',\n 'non-Euclidean fold',\n 'dielectric breakdown',\n 'catastrophe optics',\n ].map((tag) => (\n <button\n key={tag}\n type=\"button\"\n onClick={() => handleInsertTag(tag)}\n className=\"text-[10px] font-mono bg-theme-bg/70 hover:bg-phosphor/20 text-phosphor/70 hover:text-phosphor px-2 py-0.5 border terminal-border hover:border-phosphor transition-colors\"\n >\n +{tag}\n </button>\n ))}\n </div>\n </div>\n )}`;
input = replaceBetween(input, primaryStart, primaryEnd, dualInputBlock, 'PromptInputArea dual buffer block');
fs.writeFileSync(inputPath, input, 'utf8');

// ---------------------------------------------------------------------------
// 2) Target translator: understand the hidden dual-buffer envelope and keep
//    lyrics out of style / style out of lyrics even in deterministic fallback.
// ---------------------------------------------------------------------------
const translatorPath = 'src/utils/targetTranslator.ts';
let translator = fs.readFileSync(translatorPath, 'utf8');
if (!translator.includes('sunoStyleSeedMatch')) {
  translator = translator.replace(
    "    const audioData = translateToAudioPhenotype(recipe, concept, entropyLevel, effectiveInstrumental);\n\n    const styleParts: string[] = [];",
    "    const audioData = translateToAudioPhenotype(recipe, concept, entropyLevel, effectiveInstrumental);\n\n    const sunoStyleSeedMatch = concept.match(/<<<SUNO_STYLE_SEED_START>>>\\n?([\\s\\S]*?)\\n?<<<SUNO_STYLE_SEED_END>>>/);\n    const sunoLyricsSeedMatch = concept.match(/<<<SUNO_LYRICS_SEED_START>>>\\n?([\\s\\S]*?)\\n?<<<SUNO_LYRICS_SEED_END>>>/);\n    const sunoStyleCore = (sunoStyleSeedMatch?.[1] || baseCore || '').trim();\n    const sunoLyricsCore = (sunoLyricsSeedMatch?.[1] || '').trim();\n\n    const styleParts: string[] = [];"
  );
  translator = translator.replace('    styleParts.push(baseCore);', '    styleParts.push(sunoStyleCore);');
  translator = translator.replace(
    "      if (audioData.lyricsDirectives.length > 0) {\n        lyricsParts.push(audioData.lyricsDirectives.join('\\n'));\n      }\n      lyricsParts.push('[Verse: Phonetic syllables]');\n      lyricsParts.push('vel-sha tohr khrat-no va-zeem');\n      lyricsParts.push('[Chorus: Rhythmic acoustic drive]');\n      lyricsParts.push('soh-ren khla-vek oom-plih dah-khrr');\n      lyricsParts.push('[Outro: Harmonic dissolution]');",
    "      if (audioData.lyricsDirectives.length > 0) {\n        lyricsParts.push(audioData.lyricsDirectives.join('\\n'));\n      }\n      if (sunoLyricsCore) {\n        lyricsParts.push(sunoLyricsCore);\n      } else {\n        lyricsParts.push('[Verse: Phonetic syllables]');\n        lyricsParts.push('vel-sha tohr khrat-no va-zeem');\n        lyricsParts.push('[Chorus: Rhythmic acoustic drive]');\n        lyricsParts.push('soh-ren khla-vek oom-plih dah-khrr');\n        lyricsParts.push('[Outro: Harmonic dissolution]');\n      }"
  );
}
fs.writeFileSync(translatorPath, translator, 'utf8');

// ---------------------------------------------------------------------------
// 3) David system instructions: make the Suno bracket grammar a first-class law.
// ---------------------------------------------------------------------------
const davidPath = 'lib/david.ts';
let david = fs.readFileSync(davidPath, 'utf8');
const protocol = `\nSUNO DUAL-BUFFER PROTOCOL (NON-NEGOTIABLE):\nWhen target is Suno, STYLE and LYRICS are separate artifacts and must never be merged.\nSUNO STYLE hard ceiling = 999 characters. It describes music only: genre, instrumentation, rhythm, meter, tempo behavior, production, timbre, acoustic space, vocal character, signal behavior, structural musical dynamics. Never place actual lyric lines in STYLE.\nSUNO LYRICS hard ceiling = 3000 characters. It may contain ordinary lyrics, poems, gibberish, phonetics, Unicode, Zalgo-ready text, equations, repetitions, deliberate misspellings, and structural/performance directives.\nBRACKET LAW: Anything that is an instruction and should NOT be sung must be enclosed in square brackets. Examples: [Intro], [Verse], [Chorus], [Bridge], [Outro], [Instrumental], [Whispered], [Vocal: glottal fry], [Breakdown: voice fractures into granular static]. Text outside brackets is intended vocal content. Do not put sung lyric lines inside brackets unless the user explicitly wants the bracketed words vocalized.\nIf the input contains <<<SUNO_STYLE_SEED_START>>> / <<<SUNO_STYLE_SEED_END>>> and <<<SUNO_LYRICS_SEED_START>>> / <<<SUNO_LYRICS_SEED_END>>>, treat them as physically separate source buffers. Mutate them independently. Never leak lyric content into style or style prose into lyrics. Preserve intentional gibberish, Unicode, punctuation, Zalgo, equations, repetition, and malformed spelling unless the user requests cleanup.\n`;
if (!david.includes('SUNO DUAL-BUFFER PROTOCOL (NON-NEGOTIABLE)')) {
  david = david.replace('${DAVID_CONSULT_MODE_MODULE}\n', '${DAVID_CONSULT_MODE_MODULE}\n' + protocol + '\n');
}
fs.writeFileSync(davidPath, david, 'utf8');

// ---------------------------------------------------------------------------
// 4) Caps & labels: 999 style, 3000 lyrics.
// ---------------------------------------------------------------------------
const capsPath = 'src/utils/targetCapabilities.ts';
let caps = fs.readFileSync(capsPath, 'utf8');
caps = caps.replace(/styleMax: 1000/g, 'styleMax: 999');
caps = caps.replace(/~900-950 chars to style/g, '~900-950 chars to style (hard ceiling 999)');
fs.writeFileSync(capsPath, caps, 'utf8');

const outputPath = 'src/components/DualOutputView.tsx';
let output = fs.readFileSync(outputPath, 'utf8');
output = output.replace(/1,000 CAP/g, '999 CAP').replace(/1,000 Cap/g, '999 Cap');
fs.writeFileSync(outputPath, output, 'utf8');

console.log('[suno-dual] Suno style/lyrics separation patch applied.');
