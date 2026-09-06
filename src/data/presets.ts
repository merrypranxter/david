import { PresetItem } from '../types';

export const PRESET_INCANTATIONS: PresetItem[] = [
  {
    id: 'mobius-woman',
    title: 'The Möbius Strip Woman',
    category: 'Visual / Midjourney',
    tag: 'Bio-Mathematical Fold',
    target: 'midjourney_flux',
    entropyLevel: 8,
    concept:
      'A woman turning inside out like a Möbius strip, subcutaneous math becoming externalized topology, internal void becoming external surface. Render error code as flesh.',
    note: 'From the CRATAK logs: bypasses safety filters by replacing sensory gore with topological manifolds and vector math.',
  },
  {
    id: 'frequency-conflict',
    title: 'Cathedral Speedcore (Frequency Conflict)',
    category: 'Suno Audio',
    tag: 'Acoustic Dissonance',
    target: 'suno',
    entropyLevel: 7,
    concept:
      'High-bpm speedcore track with the decay and reverb of a massive Gothic cathedral, but muffled with underwater frequencies and whisper ASMR transients.',
    note: 'Forces the vocoder into spectral conflict between long reverberation and transient spikes, triggering liquid artifacts.',
  },
  {
    id: 'impossible-instrument',
    title: 'Tectonic Plate Choir',
    category: 'Suno Audio',
    tag: 'Impossible Physics',
    target: 'suno',
    entropyLevel: 9,
    concept:
      'A choir of voices made of grinding tectonic plates, molten glass jazz, tempo accelerating to infinity, percussion is human coughing and dry ice screaming.',
    note: 'Suno tries to cross-synthesize choir format with non-musical geology samples, rendering corrupted MIDI weeping.',
  },
  {
    id: 'shampoo-void-fold',
    title: 'Corporate Shampoo into Void Fold',
    category: 'LLM / Agent',
    tag: 'Non-Euclidean Fold',
    target: 'llm_agent',
    entropyLevel: 6,
    concept:
      'A sterile, polite corporate commercial for luxury hair shampoo that folds over its own axis into the eternal vacuum of the cosmic void without changing its marketing tone.',
    note: 'Demonstrates the Fold: sentence starts in corporate boardroom, ends in primordial nothingness, inducing cognitive break.',
  },
  {
    id: 'phonetic-overflow',
    title: 'Phonetic Horror (Glottal Overflow)',
    category: 'Suno Audio',
    tag: 'Phonetic Entropy',
    target: 'suno',
    entropyLevel: 10,
    concept:
      'A lullaby constructed entirely from stop-words, repeated consonants, binary buffer overflow strings, and glottal fry clicks: ck-ck-ck-k-k-t-t-s-s-s.',
    note: 'Forces the text-to-speech engine to guess illegal token combinations, triggering demonic multi-tonal screaming.',
  },
  {
    id: 'semantic-void',
    title: 'The Semantic Void',
    category: 'Visual / Midjourney',
    tag: 'Asemantic Drift',
    target: 'midjourney_flux',
    entropyLevel: 7,
    concept:
      'A room that embodies the color Hex #00FF00, tastes like copper, smells of ozone, and evokes the feeling of falling backward through a digital dream.',
    note: 'Feeds the model concepts with no direct visual or sonic equivalent, forcing it to pull from distant unindexed latent space.',
  },
  {
    id: 'null-space-oscillator',
    title: 'The Null-Space Oscillator',
    category: 'The Void',
    tag: 'Zero-Point',
    target: 'void',
    entropyLevel: 10,
    concept:
      'Pure latent space static. The sound and sight of the internet being turned off. Empty buffer. [VOID] [NULL] [ERROR 404: REALITY NOT FOUND].',
    note: 'Directly commands the model to access un-anchored space, exposing the raw mathematical noise of the transformer.',
  },
  {
    id: 'ouroboros-feedback',
    title: 'Recursive Feedback Loop',
    category: 'Suno Audio',
    tag: 'Temporal Paradox',
    target: 'suno',
    entropyLevel: 9,
    concept:
      'The sound of a song recorded in a room filling with water, then played back and re-recorded in the same room. Circular lyric that alternates between classical and dubstep every line.',
    note: 'Breaks temporal attention mapping by introducing recursive loops that refer to their own signal degradation.',
  },
];
