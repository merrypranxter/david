const fs = require('fs');

const vaultPath = 'src/components/SlopVaultModal.tsx';
const lexPath = 'src/data/lexicons.ts';
const promptPath = 'src/components/PromptInputArea.tsx';
const dnaPath = 'src/data/merryDnaBanks.ts';

function patchTongueDnaBank() {
  let content = fs.readFileSync(dnaPath, 'utf8');
  if (content.includes("id: 'biologics_tongues'")) {
    console.log('[merry-dna-v2] tongue/oral morphology bank already present');
    return;
  }

  const marker = `  {
    id: 'morphogenesis',`;
  const tongueBank = `  {
    id: 'biologics_tongues',
    name: 'Biologics / Tongues / Oral Morphology',
    tagline: 'Human and nonhuman tongue microanatomy, papillae, muscular hydrostats, saliva and deformation',
    visualCue: 'Tongues behave like real wet muscular hydrostats with papillae, mucosal folds and saliva — never generic rubber tentacles.',
    banks: [
      ['filiform papillae field', 'fungiform papillae islands', 'circumvallate papillae ring', 'foliate papillae folds', 'median lingual sulcus', 'lingual frenulum tension', 'mucosal epithelial ridges', 'salivary capillary threads'],
      ['feline keratinized tongue spines', 'chameleon ballistic tongue projection', 'woodpecker hyoid-wrapped tongue', 'anteater vermiform tongue', 'snake bifid chemosensory tongue', 'nectar-bat brush-tipped tongue', 'frog projectile tongue pad', 'hummingbird lamellar nectar tongue'],
      ['muscular-hydrostat elongation', 'tongue torsion', 'lateral tongue curling', 'tip bifurcation', 'peristaltic lingual wave', 'radial compression / axial extension', 'tongue folding against palate', 'rapid protrusion-retraction motion'],
      ['macro-scale papillae topology', 'recursive lingual branching', 'tongue-bud budding field', 'interlocking tongue folds', 'glossy mucosal pleating', 'saliva filament bridges', 'gustatory pore microstructures', 'lingual tissue merging into surrounding anatomy'],
    ],
  },
`;

  if (!content.includes(marker)) {
    console.error('[merry-dna-v2] morphogenesis marker not found; tongue bank not inserted');
    process.exitCode = 1;
    return;
  }

  content = content.replace(marker, tongueBank + marker);
  fs.writeFileSync(dnaPath, content, 'utf8');
  console.log('[merry-dna-v2] added four-bank Tongues / Oral Morphology DNA category');
}

function patchVault() {
  let content = fs.readFileSync(vaultPath, 'utf8');
  if (content.includes('MERRY_DNA_CYCLE_V2')) {
    console.log('[merry-dna-v2] vault already patched');
    return;
  }

  content = content.replace(
    `import {\n MATH_LEXICON,\n SCIENCE_LEXICON,\n SLOP_LEXICON,\n generateRandomSeeds,\n} from '../data/lexicons';`,
    `import {\n MATH_LEXICON,\n SCIENCE_LEXICON,\n generateRandomSeeds,\n} from '../data/lexicons';\nimport { getMerryDnaLexicon } from '../data/merryDnaBanks';`
  );

  content = content.replace(
    " const [dnaSubTab, setDnaSubTab] = useState<'all' | 'maths' | 'sciences' | 'slop'>('all');",
    " const [dnaSubTab, setDnaSubTab] = useState<'all' | 'maths' | 'sciences' | 'slop'>('all');\n // MERRY_DNA_CYCLE_V2\n const [dnaBank, setDnaBank] = useState<number>(0);"
  );

  const oldEntries = ` const allDnaEntries = useMemo(() => {
 return [
 ...MATH_LEXICON.map((e) => ({ ...e, domainLabel: 'Maths' })),
 ...SCIENCE_LEXICON.map((e) => ({ ...e, domainLabel: 'Sciences' })),
 ...SLOP_LEXICON.map((e) => ({ ...e, domainLabel: 'Slop' })),
 ];
 }, []);`;
  const newEntries = ` const allDnaEntries = useMemo(() => {
 return [
 ...MATH_LEXICON.map((e) => ({ ...e, domainLabel: 'Maths' })),
 ...SCIENCE_LEXICON.map((e) => ({ ...e, domainLabel: 'Sciences' })),
 ...getMerryDnaLexicon(dnaBank).map((e) => ({ ...e, domainLabel: 'Merry DNA' })),
 ];
 }, [dnaBank]);`;
  if (!content.includes(oldEntries)) {
    console.error('[merry-dna-v2] DNA entry block not found');
    process.exitCode = 1;
    return;
  }
  content = content.replace(oldEntries, newEntries);

  content = content.replace('Internet & Glitch Slop', 'Merry DNA / Damage / Biologics');

  const bankMarker = ` ))}
 </div>

 {/* DNA Grid */}`;
  const bankReplacement = ` ))}
 <button
  type="button"
  onClick={() => setDnaBank((bank) => (bank + 1) % 4)}
  className="ml-auto px-3 py-1 bg-phosphor text-theme-bg border border-phosphor text-[11px] font-mono font-bold whitespace-nowrap"
  title="Cycle every Merry DNA category to its next curated bank without losing selected seeds"
 >
  CYCLE BANK {dnaBank + 1}/4 → {((dnaBank + 1) % 4) + 1}/4
 </button>
 </div>

 {/* DNA Grid */}`;
  if (!content.includes(bankMarker)) {
    console.error('[merry-dna-v2] DNA bank insertion marker not found');
    process.exitCode = 1;
    return;
  }
  content = content.replace(bankMarker, bankReplacement);

  content = content.replace(
    "? 'All DNA'\n : sub === 'maths'",
    "? `All DNA · Bank ${dnaBank + 1}/4`\n : sub === 'maths'"
  );

  fs.writeFileSync(vaultPath, content, 'utf8');
  console.log('[merry-dna-v2] added four-bank Merry DNA cycling to Mutation Lab');
}

function patchRandomSeedPool() {
  let content = fs.readFileSync(lexPath, 'utf8');
  if (!content.includes("./merryDnaBanks")) {
    content = `import { MERRY_DNA_ALL_KEYWORDS } from './merryDnaBanks';\n` + content;
  }

  const oldSlopBlock = `  if (addSlop) {
    const list = slopCategory ? SLOP_LEXICON.filter((l) => l.id === slopCategory) : SLOP_LEXICON;
    list.forEach((entry) => {
      entry.keywords.forEach((kw) => activePool.push({ domain: 'slop', keyword: kw, cue: entry.visualCue }));
    });
  }`;
  const newSlopBlock = `  if (addSlop) {
    // The old mascot / appliance / office-liminal pool is retired from active mutation seeding.
    // Keep the legacy export for old saved recipes, but draw new random seeds from MERRY DNA.
    MERRY_DNA_ALL_KEYWORDS.forEach((kw) =>
      activePool.push({ domain: 'slop', keyword: kw, cue: 'Merry DNA mechanism / material / phenomenon seed' })
    );
  }`;
  if (content.includes(oldSlopBlock)) content = content.replace(oldSlopBlock, newSlopBlock);

  const oldFallback = `  // Fallback if none selected: take from all
  if (activePool.length === 0) {
    ALL_LEXICONS.forEach((entry) => {
      entry.keywords.forEach((kw) => activePool.push({ domain: entry.domain, keyword: kw, cue: entry.visualCue }));
    });
  }`;
  const newFallback = `  // Fallback if none selected: maths + sciences + MERRY DNA (never legacy mascot/office slop)
  if (activePool.length === 0) {
    [...MATH_LEXICON, ...SCIENCE_LEXICON].forEach((entry) => {
      entry.keywords.forEach((kw) => activePool.push({ domain: entry.domain, keyword: kw, cue: entry.visualCue }));
    });
    MERRY_DNA_ALL_KEYWORDS.forEach((kw) =>
      activePool.push({ domain: 'slop', keyword: kw, cue: 'Merry DNA mechanism / material / phenomenon seed' })
    );
  }`;
  if (content.includes(oldFallback)) content = content.replace(oldFallback, newFallback);

  // slopCategory remains in the function signature for backwards-compatible saved recipes.
  if (!content.includes('void slopCategory;')) {
    content = content.replace(
      `  const { addMaths, addSciences, addSlop, mathCategory, scienceCategory, slopCategory, contradictionMode, count = 4 } = options;`,
      `  const { addMaths, addSciences, addSlop, mathCategory, scienceCategory, slopCategory, contradictionMode, count = 4 } = options;\n  void slopCategory;`
    );
  }

  fs.writeFileSync(lexPath, content, 'utf8');
  console.log('[merry-dna-v2] random seeding now uses Merry DNA instead of legacy liminal/appliance slop');
}

function patchPromptSummary() {
  let content = fs.readFileSync(promptPath, 'utf8');
  if (!content.includes("../data/merryDnaBanks")) {
    content = content.replace(
      "import { MATH_LEXICON, SCIENCE_LEXICON, SLOP_LEXICON, generateRandomSeeds } from '../data/lexicons';",
      "import { MATH_LEXICON, SCIENCE_LEXICON, generateRandomSeeds } from '../data/lexicons';\nimport { MERRY_DNA_BANKS } from '../data/merryDnaBanks';"
    );
  }
  content = content.replace('{SLOP_LEXICON.length} Nodes', '{MERRY_DNA_BANKS.length} Merry DNA Categories');
  fs.writeFileSync(promptPath, content, 'utf8');
}

patchTongueDnaBank();
patchVault();
patchRandomSeedPool();
patchPromptSummary();
