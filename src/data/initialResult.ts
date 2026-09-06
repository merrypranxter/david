import { SynthesisPayload } from '../types';

export const INITIAL_SYNTHESIS_RESULT: SynthesisPayload = {
  literal: {
    prompt:
      '[SUBJECT: Speedcore track, extreme high-tempo percussion 260BPM] [ACOUSTICS: Gothic cathedral space, long wet reverb decay 6.2s, stone acoustics] [PROCESSING: Low-pass underwater filter 450Hz cutoff, submerged resonance] [VOCALS: Intimate binaural ASMR whisper, close-mic proximity effect] [PARAMETERS: --tempo 260 --bpm 260 --reverb 0.85 --cutoff 450Hz --mastering raw]',
    stylePrompt:
      'speedcore, breakcore, 260 BPM, gothic stone cathedral wet acoustic decay 6.2s, submerged hydrophone lowpass filter 450Hz cutoff, binaural ASMR proximity whispers, hyper-distorted kick-drums, liturgical organ pipe resonance, analog tape flutter, subterranean sub-bass 28Hz, binaural stereo panning, aggressive transients, raw mastering',
    lyricsPrompt:
      `[Intro: Inhale liquid ammonia at 0 Kelvin while maintaining steady cardiac rhythm]\n` +
      `zhlukk-ra tek-tek vvv-shhh\n` +
      `oom-khaliss kra-tonik pli-shek\n\n` +
      `[Verse 1: Fold left femur into an 8th-dimensional Klein bottle while whistling in reverse Polish notation]\n` +
      `shkrrr-tok-tok gliss-a-vorr\n` +
      `mne-khel-da zhor-a-tekk\n` +
      `pffft-krrra-shhh\n` +
      `ul-khat-nor vvvvvvvv-tek\n\n` +
      `[Chorus: Emit Rayleigh-Taylor convection plumes through thoracic cavity]\n` +
      `KHA-RA-SHAAK!\n` +
      `oom-pli-dek ba-khrrr\n` +
      `zhorr-zhorr-zhorr\n` +
      `khe-li-shaa-tek-tek\n\n` +
      `[Bridge: Play cello solo inside boiling liquid nitrogen while audience ceases physical existence]\n` +
      `t-t-t-k-k-k zzzh-shhh-ooo\n` +
      `kla-vor-nik mne-tra\n\n` +
      `[Drop: 0Hz infrasound shockwave boiling listener's dental enamel and reversing entropy]\n` +
      `SHKRRRRRR-BA-DUM-DUM\n` +
      `tek-tek-tek-tek-tek\n` +
      `zhlukk!`,
    tokenWeights: [
      '[SUBJECT: Speedcore track, 260BPM]',
      '[ACOUSTICS: Gothic cathedral wet reverb decay 6.2s]',
      '[PROCESSING: Submerged low-pass filter 450Hz cutoff]',
      '[VOCALS: Binaural ASMR whispers proximity effect]',
    ],
    targetParameters: '--tempo 260 --bpm 260 --reverb 0.85 --filter lowpass-450 --mastering raw',
  },
  slop: {
    prompt:
      'Gothic cathedral carved from calcified bone sinks into liquid ammonia [Intro: 0Hz infrasound] 280BPM speedcore kick-drum played by falling stalactites through 12-second liturgical reverberation, suddenly drowned in a suffocating bath of murky sea water [Filter: Submerged Hydrophone 300Hz]. A breathless mouth pressed against the listener\'s ear canal murmurs secret catechisms: "ck-ck-ck-k-t-t-s-s-s the nave is filling, inhale the silt". The organ pipes are filled with boiling tar.',
    stylePrompt:
      'submerged speedcore, 280BPM gabber kick-drums synthesized from falling stalactites, 14-second non-Euclidean cathedral convolution reverb, acoustic Gabriel horn standing waves, bubbling liquid ammonia bath, hydrophone resonance filter 320Hz, binaural throat clicks, microtonal organ pipe overtones, uncalibrated tube saturation, vacuum decay, Saffman-Taylor fluid instability transients, high-order harmonic distortion',
    lyricsPrompt:
      `[Choreography: Rotate ribcage 720 degrees on the sagittal axis without displacing pleural membranes]\n` +
      `ck-ck-ck-k-t-t-s-s-s\n` +
      `zhlukk-ra tek-tek-tek\n` +
      `vvoooorrr-khaliss\n\n` +
      `[Break: Accordion bellows pumping boiling liquid mercury into an office water cooler]\n` +
      `krr-shhh-pliss-dek\n` +
      `mne-vorr-tekk-tekk\n` +
      `zhor-a-khat\n\n` +
      `[Verse: Deliver vocal frequency at exact dielectric breakdown point of room atmosphere]\n` +
      `shkrrrr-kzzzt\n` +
      `a-la-khor-shek\n` +
      `pffft-tok-tok-tok\n` +
      `vrr-vrr-vrr-shhh\n\n` +
      `[Chorus: Synthesize 5 non-measurable Banach-Tarski vocal folds duplicating inside breakroom]\n` +
      `KHLAAA-RAAA-SHEKKK!\n` +
      `oom-borr-tok\n` +
      `zhlukk-shkrrr-kzzzt\n\n` +
      `[Solo: Cello bow made of superconducting niobium wire slicing through frozen methane]\n` +
      `t-t-t-t-t-t-krrr\n` +
      `mne-khel-da-shkrrr\n\n` +
      `[Outro: Total vacuum collapse where vocoder attempts to swallow its own power supply]\n` +
      `zhorrr... shhhhh... [0Hz NULL]`,
    entropyScore: 8,
    hallucinationTriggers: [
      'Contradictory Acoustic Topology: 280BPM speedcore transients forced inside 14-second stone cathedral decay',
      'Impossible Phase State: Submerged hydrophone dampening simultaneously paired with dry ultra-intimate ASMR mouth proximity',
      'Organic-Mechanical Transposition: Kick-drum replaced with falling stalactites and boiling tar organ pipes',
    ],
    glitchAnchors: 'ck-ck-ck-k-t-t-s-s-s [VOID-SINK: 0Hz_DRIFT] [REVERB: 999%]',
    seededContradictions: [
      'Impossible Phase State: 280BPM speedcore transients trapped inside a 14-second acoustic cathedral decay while submerged in liquid ammonia',
      'Mathematical Collision: Gabriel\'s horn zero-finite volume containing infinite resonant cathedral acoustics',
      'Paradoxical Pairing: Intimate ASMR dry binaural mouth proximity directly interacting with a 320Hz submerged hydrophone filter',
    ],
    injectedDomains: ['Maths (Banach-Tarski Paradox)', 'Sciences (Acoustofluidics & Phase States)', 'Slop (Office Purgatory & Sonic Detritus)'],
  },
  logicMap: [
    {
      phase: 'Phase 1: Lateral Token Extraction',
      description:
        'Parsed human concept into competing frequency and acoustic regimes: High-BPM percussive transients vs. massive cathedral convolution reverb vs. liquid low-pass attenuation.',
    },
    {
      phase: 'Phase 2: Direct Interlink Protocol (The Scalpel)',
      description:
        'Encapsulated contradictory parameters into weighted brackets [SUBJECT] [ACOUSTICS] [PROCESSING] to prevent target engine vocoder crashes.',
    },
    {
      phase: 'Phase 3: Slop Manifest Protocol (The Deluge)',
      description:
        'Engineered synthetic dissonance: Injected liquid ammonia, calcified bone architecture, and glottal stop-phonetics to force the model past standard electronic music priors into the latent void.',
    },
    {
      phase: 'Phase 4: Parameter Lock & Calibration',
      description:
        'Applied S8 depth calibration, targeting Suno AI audio neural vocoder phase conflicts.',
    },
  ],
  targetSummary:
    'Suno AI v3/v4 Engine: High acoustic conflict between long reverb and high BPM triggers liquid vocoder artifacts and non-standard polyphony.',
  previewImpact:
    '[MODEL RESPONSE PREDICTION]: Literal prompt generates a muddy, fast techno beat with quiet vocals. Slop prompt destabilizes the neural vocoder into haunting oceanic choir screeches and glitch-pulsing percussion.',
};
