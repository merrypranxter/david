import { MediaProfile } from '../types';

export const MEDIA_PROFILES: Record<string, MediaProfile> = {
  image: {
    id: 'image',
    name: 'Image',
    primaryDimensions: ['spatial', 'static', 'topological', 'material'],
    strongFailureSurfaces: [
      'anatomy', 'material', 'topology', 'spatial relationships', 
      'boundary logic', 'figure/ground', 'observer relationships', 
      'scale', 'perspective', 'local/global geometry', 'negative volume', 
      'classification', 'spatial compensation', 'simultaneous incompatible states'
    ],
    weakFailureSurfaces: [
      'motion', 'causality', 'history', 'latency' // Can only be represented statically
    ],
    preferredConstraintTypes: [
      'Ontology Shear', 'Recursive Boundary Re-entry', 'Mereotopological Inversion',
      'Negative Volume', 'Coordinate Collision', 'Local Correctness / Global Impossibility',
      'Barycentric Space', 'Volumetric Intersection', 'Scale-Dependent Ontology',
      'Unit Collapse', 'Conserve the Wrong Thing', 'Figure-Ground Information Inversion',
      'Umwelt Collision', 'Boundary Condition Generation', 'Remove the Noun'
    ],
    preferredVariables: [
      'spatial curvature', 'surface complexity', 'observer proximity', 'luminance ratio', 'topological genus'
    ],
    preferredGraphRelations: [
      'spatial compensation', 'evidence of history', 'simultaneous manifestation', 'scale shift'
    ],
    translationRules: {
      'TEMPORAL_MECHANISM': 'Represent history as static evidence: scars, residues, stratified states, path-dependent texture, accumulated deformation, topology evidence, or simultaneous incompatible state traces.',
      'DEBT': 'Translate temporal debt into spatial compensation across body regions, foreground/background, scales, material layers, or positive/negative space.',
      'FUTURE_DEPENDENCY': 'Represent future constraints through anticipatory structure: vestigial organs, anticipatory joints, unused structural supports, scars from unoccurred events, or topology suggesting later states.',
      'FEEDBACK': 'Show the morphology produced by a feedback system at one unstable equilibrium point.',
      'NEGATIVE_VOLUME': 'Define missing space as an active void, cavity, or structural participant rather than mere absence.',
      'NONCOMMUTATIVE_HISTORY': 'The surface bears static visible evidence of operation order.'
    },
    antiPatterns: [
      'visible equations', 'graphs', 'grids', 'HUDs', 'scientific diagrams', 
      'split-screen', 'half-one-thing / half-another', 'generic fractals', 
      'psychedelic overlays', 'transparent ghosting', 'cosmic backgrounds', 
      'random melting', 'simple collage'
    ],
    promptStructureGuidance: [
      'Emphasize subject/reference anchor',
      'Define structural conditions and material/spatial consequences',
      'Include composition and visual rendering behavior',
      'Explicitly include easy-solution blockers'
    ]
  },
  video: {
    id: 'video',
    name: 'Video',
    primaryDimensions: ['temporal', 'spatial', 'causal', 'trajectory'],
    strongFailureSurfaces: [
      'OBJECT PERMANENCE', 'IDENTITY ACROSS FRAMES', 'TOPOLOGY ACROSS FRAMES', 
      'TEMPORAL CORRESPONDENCE', 'OCCLUSION / REAPPEARANCE', 'MOTION TRAJECTORY', 
      'CAUSE / EFFECT', 'HISTORY', 'LATENCY', 'PATH DEPENDENCY', 'TEMPORAL SCALE', 
      'CAMERA VS WORLD MOTION', 'MATERIAL PERSISTENCE', 'FRAME-LOCAL VS SEQUENCE-GLOBAL CONSISTENCY'
    ],
    weakFailureSurfaces: [
      'static compositional perfection'
    ],
    preferredConstraintTypes: [
      'Temporal Topology Debt', 'Hysteresis', 'Noncommutative History',
      'Future-Frame Anatomy', 'Homeostatic Morphology', 'Coordinate Drift',
      'Local Correctness / Global Impossibility', 'Scale/Temporal Renormalization',
      'Variable Constant', 'Shock/Caustic Formation', 'Mereological Parasite',
      'Environmental-Organism Phase Symbiosis', 'Negative Volume',
      'Observer/Observed Re-entry', 'Wrong Simulator'
    ],
    preferredVariables: [
      'kinetic velocity', 'acceleration vectors', 'contact friction', 'temporal frame index', 'movement unpredictability'
    ],
    preferredGraphRelations: [
      'lagged consequence', 'occlusion reassignment', 'camera-dependent state', 'hysteresis'
    ],
    translationRules: {
      'MAKE_TIME_CAUSAL': 'Motion must change the system. E.g., "Each increase in velocity creates a new opening in the body topology."',
      'USE_LAG': 'Consequences appear later (1 frame, 3 frames, after occlusion, on re-entry, after camera movement, after threshold crossing).',
      'USE_OCCLUSION': 'When subject leaves view, do not assume reappearance preserves identity, material, topology, scale, or part count (unless anchored).',
      'USE_CAMERA_MOVEMENT': 'Camera changes ontology, dimensionality, scale law, observer-dependent states, or background weighting.',
      'FRAME_LOCAL_GLOBAL_CONFLICT': 'Every frame locally plausible, but sequence globally impossible (e.g., topology maps inconsistently across frames).',
      'IDENTITY_ANCHORING': 'Separate WHO remains the same from WHAT structural properties remain the same. Face/identity may hold while topology destabilizes.',
      'NEGATIVE_VOLUME': 'Define missing structure as a moving absence or a delayed missing component.',
      'NONCOMMUTATIVE_HISTORY': 'A -> B differs visibly from B -> A over time.'
    },
    antiPatterns: [
      'morphing', 'melting', 'dissolving', 'datamosh wording', 
      'generic glitch effects', 'reverse playback', 'simple time-lapse', 
      'motion blur', 'camera shake', 'duplicated limbs for no reason'
    ],
    promptStructureGuidance: [
      'Establish initial state and driving variable',
      'Define trigger, motion rule, and temporal consequences',
      'Include lag/state memory and identity anchors',
      'Describe camera relationship',
      'Explicitly forbid easy transition patterns'
    ]
  },
  audio: {
    id: 'audio',
    name: 'Audio',
    primaryDimensions: ['spectral', 'rhythmic', 'timbral', 'formal'],
    strongFailureSurfaces: [
      'RHYTHM', 'METER', 'TEMPO', 'MICROTIMING', 'PITCH', 'TUNING', 'HARMONY', 
      'TIMBRE', 'SPECTRAL DENSITY', 'INSTRUMENT IDENTITY', 'VOICE', 'PHONETICS', 
      'LANGUAGE', 'NOISE', 'SIGNAL CORRUPTION', 'FORM', 'REPETITION', 'DYNAMICS', 
      'ACOUSTIC SPACE', 'PROCESSING ORDER'
    ],
    weakFailureSurfaces: [
      'visual geometry', 'spatial orientation' // Requires cross-media transduction
    ],
    preferredConstraintTypes: [
      'Rhythmic Debt', 'Spectral Voids', 'Phrase Topology', 'Timbral Shear'
    ],
    preferredVariables: [
      'spectral density', 'rhythmic complexity', 'tempo', 'signal-to-noise ratio', 'harmonic dissonance'
    ],
    preferredGraphRelations: [
      'rhythmic compensation', 'spectral consequence', 'hierarchical scale', 'processing memory'
    ],
    translationRules: {
      'GEOMETRY': 'Translate into rhythmic/formal organization. Symmetry -> mirrored phrase structure. Topology -> recurring connections between phrases.',
      'SCALE': 'Hierarchical form: micro-scale (grain/transient), meso-scale (beat/phrase), macro-scale (section).',
      'ONTOLOGY_SHEAR': 'Source-identity conflict. A sonic event behaves simultaneously as voice, percussion, and codec failure, with one behavior determining another.',
      'INVARIANT': 'Changes in tempo/timbre must preserve an analogous structural quantity such as phrase contour or spectral complexity. E.g. tempo increases but total rhythmic info remains constant by dropping note density.',
      'HYSTERESIS': 'Processing memory. E.g. crossing a distortion threshold makes voice granular; dropping below leaves spectral scars.',
      'TEMPORAL_DEBT': 'Phrase debt. Meter loses a beat in phrase A; it reappears as displaced accent energy in phrase B.',
      'FUTURE_DEPENDENCY': 'Anticipatory form. Early phrases contain structural features required by the final section.',
      'NEGATIVE_VOLUME': 'Active silence. Missing frequency bands, rhythmic gaps, muted transients, spectral voids act as active structural forces.',
      'WRONG_SIMULATOR': 'Cross-domain musical governance. E.g. rhythm governed by reaction-diffusion, instrument entrances governed by predator-prey oscillation.',
      'NONCOMMUTATIVE_HISTORY': 'Effect processing order changes resulting sound identity.'
    },
    antiPatterns: [
      'random genre soup', 'pure visual metaphors', 'fractal music with no structural explanation', 
      'quantum sound', 'surreal audio', 'generic glitch', 'generic experimental', 
      'sound-effect collage', 'random noise', 'simple filter sweep', 'plain tempo automation'
    ],
    promptStructureGuidance: [
      'Emphasize source identity',
      'Define rhythmic/formal rule and timbre/spectral rule',
      'Include temporal dependency and invariants/debt',
      'Describe processing behavior and signal boundary'
    ]
  }
};
