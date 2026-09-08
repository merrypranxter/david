const fs = require('fs');
const path = 'lib/david.ts';
let content = fs.readFileSync(path, 'utf8');

if (content.includes('RETIRED_LEGACY_LIMINAL_SLOP_V2')) {
  console.log('[retire-liminal-slop-v2] already applied');
  process.exit(0);
}

content = content.replace(
  '`- INJECT INTERNET SLOP & UNSTABLE VOCABULARY HOARDING: Specifically weave in internet detritus, YTP brainrot, mundane surrealism, and unstable glitch verbs (${slopCategory || \'weirdcore appliances like sentient vending machines & emotional CRT displays, office cubicle purgatory, YTP datamosh seizures, GeoCities ruins, CRT phosphor ghosts, mallsoft liminality, videodrome theology, and unstable adjectives like suppurating, bismuthine, peristaltic, glossolalic\'}).`',
  '`- INJECT SIGNAL DAMAGE & GENERATIVE FAILURE PHENOMENA: Specifically weave in physically legible corruption, temporal reassignment, codec damage, optical/perceptual instability, and data-glitch behavior (${slopCategory || \'VHS head-switching noise, datamosh motion-vector inheritance, corrupted P/B-frame carryover, bitcrush quantization, CRT raster drift, chromatic aberration, Moiré interference, pixel sorting, feedback trails, scan displacement, packet-loss blocks, and temporal smear\'}). /* RETIRED_LEGACY_LIMINAL_SLOP_V2 */`'
);

content = content.replace(
  'conscious office appliances arguing Gödel incompleteness',
  'a bacterial colony whose growth front is constrained by Gödel-incomplete local rules'
);
content = content.replace(
  'corporate microwave prophecy running inside an 8th-dimensional quasicrystal',
  'a datamoshed bacterial growth front propagating through an 8th-dimensional quasicrystal projection'
);
content = content.replace(
  '1 sphere cut into 5 non-measurable parts duplicated in an office breakroom',
  'one sphere cut into non-measurable parts that reassemble as two incompatible biological boundaries'
);
content = content.replace(
  'Radical clashes between high-brow mathematics/sciences and low-brow internet trash.',
  'Radical clashes between mathematical/scientific structure and damaged signal behavior, codec failure, perceptual artifacts, or biological growth.'
);

fs.writeFileSync(path, content, 'utf8');
console.log('[retire-liminal-slop-v2] removed appliance/office/liminal fallback slop from synthesis');
