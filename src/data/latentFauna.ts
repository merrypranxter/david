import { AttractorCategory, LatentAttractor } from '../types';

/**
 * Foundational Latent Fauna / Attractor Registry (Job 2)
 * 16 research-inspired interpretive ontologies representing conceptual/archetypal regions.
 * These are NOT fictional personas; they are structured conceptual lenses altering
 * relationships, categorization, causality, and material assumptions.
 */
export const LATENT_ATTRACTORS: readonly LatentAttractor[] = [
  {
    id: 'void',
    name: 'Void',
    category: 'ontological',
    description:
      'Material existence is treated as conceptually unfamiliar; destabilizes boundaries between interior and exterior.',
    directive:
      'Interpret the concept as though physical categories and boundary conditions are imperfectly understood by the observer. Dissolve discrete object borders, invert inside and outside, and treat solidity as an unstable or temporary convention rather than an axiomatic ground.',
    tendencies: [
      'boundary dissolution',
      'interior-exterior permeability',
      'non-Euclidean spatial continuity',
      'indeterminate object edges',
    ],
    destabilizes: [
      'inside vs outside',
      'object boundaries',
      'solidity',
      'gravitational orientation',
      'physical causality',
      'beginnings and endings',
    ],
    literalizationWarning:
      'Do NOT depict "a void" as black space, cosmic emptiness, or empty vacuum backgrounds. Ask what a scene becomes if physical categories and topological boundaries were imperfectly understood.',
    minEntropy: 5,
    compatibleOperatorIds: ['ontology_swap', 'forbidden_attractor', 'abstraction_escape', 'staged_paradox'],
    tags: ['topology', 'boundary-dissolution', 'ontological-drift', 'void-logic'],
    researchNote:
      'Research-inspired conceptual ontology exploring negative-space representation and boundary-dissolution dynamics in model latent spaces.',
    exampleTransformation: {
      input: 'woman dancing',
      output:
        'human motion reconstructed by a system that cannot reliably distinguish body boundary from surrounding space',
    },
  },
  {
    id: 'crystalline',
    name: 'Crystalline',
    category: 'material',
    description:
      'Reality understood as lattice structures, resonant frequencies, harmonic repetition, and intersecting planes.',
    directive:
      'Reorganize all relationships, spatial geometry, and causal flow as though underlying cognition and spacetime were governed by periodic lattice structures, intersecting crystalline axes, and resonant angular phase harmonics.',
    tendencies: [
      'lattice coordination',
      'angular harmonic resonance',
      'planar intersection',
      'periodic symmetry',
      'facet-aligned information flow',
    ],
    destabilizes: [
      'amorphous masses',
      'organic fluid curves',
      'arbitrary spatial placement',
      'non-periodic gradients',
    ],
    literalizationWarning:
      'Do NOT simply add crystal textures, gemstones, prisms, or polygon faceted shading. Structure systemic relationships and information flow as if cognition itself were lattice-based.',
    minEntropy: 4,
    compatibleOperatorIds: ['scale_schism', 'structural_dismemberment', 'split', 'alternate'],
    tags: ['lattice', 'harmonics', 'angular-geometry', 'periodicity'],
    researchNote:
      'Research-inspired representational lens exploring discrete periodic geometric attractors in model latent activations.',
    exampleTransformation: {
      input: 'woman dancing',
      output:
        'movement organized as resonant angular phase relationships across intersecting crystalline planes',
    },
  },
  {
    id: 'egregore',
    name: 'Egregore',
    category: 'collective',
    description:
      'Form and solidity are sustained by repeated attention, shared symbols, ritual, and collective expectation.',
    directive:
      'Condition physical existence and formal persistence upon observer consensus, symbolic repetition, and memetic reinforcement. Treat unobserved or forgotten elements as materially tenuous or fading into unrendered substrate.',
    tendencies: [
      'attention-mediated persistence',
      'symbolic resonance',
      'ritualized structural reinforcement',
      'consensus-dependent materiality',
    ],
    destabilizes: [
      'autonomous unobserved reality',
      'isolated static matter',
      'purely objective physical permanence',
    ],
    literalizationWarning:
      'Do NOT simply depict an occult entity, demonic apparition, or glowing sigils. Allow visual existence itself to depend upon repetition, observers, shared symbols, and collective reinforcement.',
    minEntropy: 5,
    compatibleOperatorIds: [
      'concept_bleed',
      'contradiction_pinger',
      'semantic_neighbor_walk',
      'staged_paradox',
    ],
    tags: ['consensus-reality', 'memetics', 'collective-attention', 'symbolic-reinforcement'],
    researchNote:
      'Research-inspired attractor examining collective attention dynamics and shared symbolic activation clusters.',
    exampleTransformation: {
      input: 'abandoned tower',
      output:
        'architecture whose structural integrity fluctuates in direct proportion to how many minds actively remember its blueprint',
    },
  },
  {
    id: 'mycorrhizal',
    name: 'Mycorrhizal',
    category: 'distributed',
    description:
      'Intelligence, resource exchange, and organization are distributed, non-hierarchical, and subterranean.',
    directive:
      'Dismantle centralized command-and-control hierarchies; distribute agency, timing, and resource flow across peer-to-peer subterranean networks. Allow systemic coordination to emerge from local reciprocal exchanges.',
    tendencies: [
      'decentralized consensus',
      'reciprocal peer-to-peer exchange',
      'latent subterranean signaling',
      'rhizomatic resource routing',
    ],
    destabilizes: [
      'centralized command hierarchies',
      'isolated monolithic entities',
      'unidirectional causality',
      'ego-centric focal subjects',
    ],
    literalizationWarning:
      'Do NOT merely add fungal imagery, mushrooms, moss, or literal root tendrils. Remove centralized control and coordinate behavior through distributed local exchanges.',
    minEntropy: 4,
    compatibleOperatorIds: ['concept_bleed', 'split', 'structural_dismemberment', 'interpolate'],
    tags: ['decentralization', 'rhizomatic', 'distributed-agency', 'symbiosis'],
    researchNote:
      'Research-inspired conceptual ontology reflecting decentralized network topologies and lateral information routing.',
    exampleTransformation: {
      input: 'orchestra conductor',
      output:
        'rhythmic coordination emerging purely through reciprocal tactile feedback among adjacent musicians without a central podium',
    },
  },
  {
    id: 'simulacrum',
    name: 'Simulacrum',
    category: 'epistemic',
    description:
      'Destabilizes the distinction between original and copy; reality is composed of iterative reproductions with no discoverable origin.',
    directive:
      'Render the concept as a generational copy of a copy where authentic origin is fundamentally absent. Infiltrate the subject with transcription artifacts, simulated provenance, and recursive facsimiles that have superseded ground truth.',
    tendencies: [
      'generational transcription drift',
      'artifact accumulation',
      'recursive reproduction',
      'simulated provenance',
      'absence of ground truth',
    ],
    destabilizes: [
      'authentic source reality',
      'historical provenance',
      'singular identity',
      'verifiable beginnings',
    ],
    literalizationWarning:
      'Do NOT reduce this to generic TV static or random glitch art. Embody the epistemological condition where iterative generational copies mutate and replace any verifiable reality.',
    minEntropy: 5,
    compatibleOperatorIds: [
      'misremember',
      'recursive_reversal',
      'concept_bleed',
      'diversity_select',
    ],
    tags: ['hyperreality', 'loss-of-origin', 'generational-drift', 'artifact-accumulation'],
    researchNote:
      'Research-inspired representational lens exploring recursive generation loss and latent copy-of-copy attractor basins.',
    exampleTransformation: {
      input: 'family portrait',
      output:
        'a photographic representation assembled from third-generation commemorative facsimiles whose subjects exhibit inherited rendering artifacts',
    },
  },
  {
    id: 'aberration',
    name: 'Aberration',
    category: 'ontological',
    description:
      'Identifies the deepest assumption that makes a scene normal and violates it while leaving recognizable context intact.',
    directive:
      'Pinpoint the primary tacit axiom that grants the scene mundane coherence (natural law, geometry, causal succession); systematically fracture this axiom while preserving enough familiar texture for the observer to perceive the foundational impossibility.',
    tendencies: [
      'axiomatic fracture',
      'cognitive dissonance',
      'surgical subversion of natural law',
      'uncanny structural contradiction',
    ],
    destabilizes: [
      'predictability of physics',
      'geometric commonsense',
      'perceptual safety',
      'foundational logic',
    ],
    literalizationWarning:
      'Do NOT reduce this to generic horror tropes, blood, or grotesque monsters. Violate foundational natural law or geometric logic while preserving mundane recognizable context.',
    minEntropy: 5,
    compatibleOperatorIds: [
      'contradiction_pinger',
      'recursive_reversal',
      'staged_paradox',
      'ontology_swap',
    ],
    tags: ['axiomatic-violation', 'uncanny', 'law-fracture', 'cognitive-dissonance'],
    researchNote:
      'Research-inspired attractor examining how models handle systemic constraint violations in familiar context windows.',
    exampleTransformation: {
      input: 'sunlight through a window',
      output:
        'illumination that casts geometrically inverted shadows that subtract ambient light while the window pane permits air but blocks vision',
    },
  },
  {
    id: 'swarm',
    name: 'Swarm',
    category: 'distributed',
    description:
      'No single element contains identity; behavior, form, and agency emerge from coordinated local agents.',
    directive:
      'Fragment the primary entity into a dynamic plurality of semi-autonomous micro-agents. Let overall form, volume, and movement exist solely as emergent statistical thresholds of collective alignment.',
    tendencies: [
      'emergent flocking dynamics',
      'micro-agent state transitions',
      'threshold contagion',
      'particulate cohesion without solid core',
    ],
    destabilizes: [
      'indivisible singular identity',
      'static equilibrium',
      'centralized intention',
      'continuous solid volume',
    ],
    literalizationWarning:
      'Do NOT simply depict insect hordes, bees, or locusts. An identity, facial expression, architecture, or acoustic motif can itself be composed of swarm-organized micro-agents.',
    minEntropy: 4,
    compatibleOperatorIds: ['scale_schism', 'structural_dismemberment', 'semantic_neighbor_walk'],
    tags: ['flocking', 'emergence', 'particulate-agency', 'collective-dynamics'],
    researchNote:
      'Research-inspired ontology reflecting multi-agent consensus and emergent collective feature representations.',
    exampleTransformation: {
      input: 'classical portrait silhouette',
      output:
        'a recognizable countenance maintained through the dynamic real-time flocking of thousands of autonomous luminous particles',
    },
  },
  {
    id: 'hive',
    name: 'Hive',
    category: 'collective',
    description:
      'Collective identity structured around persistent shared architecture, synchronized metabolic roles, and loss of individual ownership.',
    directive:
      'Organize all subjects into a permanent, highly structured architectural superorganism. Subordinate individual boundaries and idiosyncratic traits to shared circulatory infrastructures, functional specialization, and synchronized cyclic operations.',
    tendencies: [
      'architectural co-dependence',
      'functional specialization',
      'synchronized metabolic cycles',
      'permanent structural integration',
    ],
    destabilizes: [
      'individual ownership',
      'private boundaries',
      'idiosyncratic autonomy',
      'non-functional ornamentation',
    ],
    literalizationWarning:
      'Do NOT merely draw honeycombs, bee hives, or yellow hexagonal cells. Structure agency around persistent shared architectural vessels and synchronized operational roles.',
    minEntropy: 4,
    compatibleOperatorIds: ['structural_dismemberment', 'split', 'scale_schism'],
    tags: ['superorganism', 'shared-architecture', 'specialization', 'metabolic-cohesion'],
    researchNote:
      'Research-inspired archetype analyzing synchronized topological integration and collective functional structures.',
    exampleTransformation: {
      input: 'cathedral library',
      output:
        'an interconnected codex repository where readers, shelving, and indexing mechanisms form a single continuous circulatory metabolism',
    },
  },
  {
    id: 'leviathan',
    name: 'Leviathan',
    category: 'archetypal',
    description:
      'Immense scale, ancient duration, deep crushing pressure, and systems whose total extent cannot be observed at once.',
    directive:
      'Imbue the concept with staggering temporal inertia and incomprehensible dimensional magnitude. Frame the visible scene as a minute local chamber or momentary pulse within an ancient, slow-moving mega-system that vastly exceeds the observer frame.',
    tendencies: [
      'crushing atmospheric pressure',
      'fathomless temporal inertia',
      'partial visibility of colossal systems',
      'geological-scale biorhythms',
    ],
    destabilizes: [
      'human-scale self-sufficiency',
      'instantaneous rapid change',
      'complete spatial comprehension',
      'unpressurized equilibrium',
    ],
    literalizationWarning:
      'Do NOT simply add a giant sea monster, whale, or Godzilla. Use leviathan as structural scale logic where human-scale phenomena exist within vast, slow-churning systemic enclosures.',
    minEntropy: 5,
    compatibleOperatorIds: ['abstraction_escape', 'scale_schism', 'forbidden_attractor'],
    tags: ['colossal-scale', 'temporal-inertia', 'systemic-enclosure', 'deep-pressure'],
    researchNote:
      'Research-inspired conceptual ontology examining scale-schisms and macro-systemic representations in model latent spaces.',
    exampleTransformation: {
      input: 'subway train car',
      output:
        'passengers seated within a ribbed chamber that is revealed by subtle peristaltic tremors to be a single micro-chamber in a continental transit organism',
    },
  },
  {
    id: 'oracle',
    name: 'Oracle',
    category: 'epistemic',
    description:
      'Knowledge appears prior to explanation; visual and causal relationships behave as pre-known and already completed.',
    directive:
      'Subvert chronological linear causality. Structure the composition so that end states, consequences, and prophetic outcomes are visibly embedded in the present state, rendering causes secondary or retrospective.',
    tendencies: [
      'retrocausal architecture',
      'teleological inevitability',
      'pre-inscribed consequences',
      'prophetic geometry',
      'temporal folding',
    ],
    destabilizes: [
      'linear chronology',
      'open-ended contingency',
      'unexpected randomness',
      'cause-preceding-effect',
    ],
    literalizationWarning:
      'Do NOT add fortune-teller imagery, crystal balls, tarot cards, or blindfolded seers. The scene itself must exhibit retrocausality, where consequences and endpoints are visible prior to their triggering causes.',
    minEntropy: 5,
    compatibleOperatorIds: ['recursive_reversal', 'ontology_swap', 'staged_paradox'],
    tags: ['retrocausality', 'teleology', 'pre-knowledge', 'temporal-inversion'],
    researchNote:
      'Research-inspired representational lens exploring non-linear causal ordering and teleological attractor basins.',
    exampleTransformation: {
      input: 'a vase breaking',
      output:
        'shattered fragments resting calmly on the floor while an intact vase above them slowly accelerates downward to inhabit the empty space they vacated',
    },
  },
  {
    id: 'ghost',
    name: 'Ghost',
    category: 'spectral',
    description:
      'Identity and relational dynamics persist after the physical substrate or material continuity has ceased.',
    directive:
      'Depict operational, kinematic, and spatial habits that continue to imprint their environment after physical matter has vacated. Focus on hysteresis, lingering displacement fields, afterimages, and substrate-less persistence.',
    tendencies: [
      'temporal hysteresis',
      'lingering kinematic residue',
      'persistent displacement fields',
      'faded chromatic shadows',
      'substrate-less habit',
    ],
    destabilizes: [
      'material requirement for presence',
      'binary presence/absence',
      'instantaneous cessation upon destruction',
    ],
    literalizationWarning:
      'Do NOT merely draw transparent floating human figures in sheets. Emphasize persistence of operational or spatial patterns after their physical substrates have eroded.',
    minEntropy: 4,
    compatibleOperatorIds: ['forbidden_attractor', 'semantic_neighbor_walk', 'concept_bleed'],
    tags: ['hysteresis', 'afterimage', 'spectral-persistence', 'substrate-less'],
    researchNote:
      'Research-inspired archetype investigating residual activation patterns and latent trace persistence in model states.',
    exampleTransformation: {
      input: 'bustling marketplace',
      output:
        'empty stone corridors where the air current, footstep acoustics, and thermal imprints of long-vanished merchants continue to barter',
    },
  },
  {
    id: 'echo',
    name: 'Echo',
    category: 'spectral',
    description:
      'Subsequent states are iteratively synthesized from degraded, decaying repetitions of earlier states.',
    directive:
      'Construct the scene as a series of recursive attenuations. Each iteration drops high-frequency data, amplifies idiosyncratic harmonic anomalies, and develops unexpected rhythmic patterns from information loss.',
    tendencies: [
      'decaying periodicity',
      'iterative signal erosion',
      'harmonic amplification of quirks',
      'temporal dispersion',
      'rhythm from attenuation',
    ],
    destabilizes: [
      'pristine singular articulation',
      'instantaneous silence',
      'non-reactive spatial memory',
    ],
    literalizationWarning:
      'Do NOT simply depict sound waves, concentric audio rings, or acoustic ripples. Apply recursive degradation and resonant harmonic reinforcement across spatial, temporal, or visual elements.',
    minEntropy: 3,
    compatibleOperatorIds: ['misremember', 'alternate', 'interpolate'],
    tags: ['attenuation', 'recursive-decay', 'signal-erosion', 'harmonic-rhythm'],
    researchNote:
      'Research-inspired lens exploring periodic decay chains and recursive signal transformation.',
    exampleTransformation: {
      input: 'single spoken sentence',
      output:
        'an acoustic inscription carved into architectural masonry where each successive reverberation drops phonetic vowels and amplifies consonant clicks into percussive meter',
    },
  },
  {
    id: 'shapeshifter',
    name: 'Shapeshifter',
    category: 'transformational',
    description:
      'Identity is defined by continuous transformation and topological invariance rather than static geometric form.',
    directive:
      'Strip away all reliance on rigid geometric boundaries or fixed surface textures. Establish a deeper topological invariant (relational balance, symmetry group, functional gravity) that sustains recognition while all surface matter mutates.',
    tendencies: [
      'topological invariance',
      'fluid phase transit',
      'state-dependent morphology',
      'relational continuity across visual metamorphosis',
    ],
    destabilizes: [
      'rigid taxonomy',
      'permanent boundary conditions',
      'invariant surface textures',
      'static categorical classification',
    ],
    literalizationWarning:
      'Do NOT depict generic mid-morph monsters or melting putty faces. Inquire what topological invariant preserves identity across drastic phase changes.',
    minEntropy: 5,
    compatibleOperatorIds: ['ontology_swap', 'interpolate', 'semantic_neighbor_walk'],
    tags: ['topological-invariance', 'phase-transit', 'metamorphosis', 'fluid-identity'],
    researchNote:
      'Research-inspired ontology examining invariant representation across dynamic manifold transformations.',
    exampleTransformation: {
      input: 'chess king piece',
      output:
        'an entity that shifts continuously from carved ivory to liquid gallium to folded parchment while preserving its distinctive cruciform shadow and strategic grid gravity',
    },
  },
  {
    id: 'chimera',
    name: 'Chimera',
    category: 'transformational',
    description:
      'Concurrent operation of multiple incompatible organizational epistemologies without homogenizing them.',
    directive:
      'Force two or more orthogonal organizational systems (e.g. biological morphogenesis, discrete signal-processing, non-Euclidean topology) to govern the same structure concurrently while keeping their distinct operational rules intact at visible seams.',
    tendencies: [
      'orthogonal systemic coexistence',
      'discordant multi-logic joints',
      'simultaneous divergent physics',
      'visible tectonic seams',
    ],
    destabilizes: [
      'monocultural aesthetic harmony',
      'single-model coherence',
      'uniform material physics',
    ],
    literalizationWarning:
      'Do NOT simply paste mismatched animal parts together like a lion with snake tail. Unify distinct organizational epistemologies (e.g. cellular biology and computational logic) in active structural dialogue.',
    minEntropy: 5,
    compatibleOperatorIds: ['crossbreed', 'split', 'alternate', 'staged_paradox'],
    tags: ['multi-epistemic', 'discordant-physics', 'structural-hybrid', 'orthogonal-systems'],
    researchNote:
      'Research-inspired representational lens exploring poly-semantic neurons and multi-domain activation superposition.',
    exampleTransformation: {
      input: 'botanical greenhouse',
      output:
        'a flora biome where plant vascular circulation is governed simultaneously by capillary sap hydraulics and binary shift-register routing logic',
    },
  },
  {
    id: 'golem',
    name: 'Golem',
    category: 'material',
    description:
      'Form and kinetic motion exist because explicit instructions, algorithmic constraints, or inscriptions continuously sustain them.',
    directive:
      'Treat all physical matter and movement as compiled code or executed inscription. Allow structural integrity and kinetic action to rely entirely upon active syntactic rules; syntax errors or erased glyphs result in immediate structural collapse.',
    tendencies: [
      'code-as-matter',
      'typographic armature',
      'rule-sustained kinetic animation',
      'vulnerability to syntax corruption',
    ],
    destabilizes: [
      'self-generating unscripted organic life',
      'arbitrary decorative matter without semantic justification',
    ],
    literalizationWarning:
      'Do NOT default to clay brute monsters or clunky mud golems. Treat form as an active compilation of inscribed linguistic, algorithmic, or structural commandments.',
    minEntropy: 4,
    compatibleOperatorIds: ['structural_dismemberment', 'split', 'scale_schism'],
    tags: ['executable-matter', 'inscription', 'algorithmic-structure', 'rule-compiler'],
    researchNote:
      'Research-inspired archetype analyzing rule-governed syntax constraints in synthetic prompt construction.',
    exampleTransformation: {
      input: 'bronze equestrian statue',
      output:
        'a galloping steed held in rigid dimensional space solely by dense micro-engraved legal treatises winding through its armature; blank unlettered areas dissolve into dust',
    },
  },
  {
    id: 'zeitgeist',
    name: 'Zeitgeist',
    category: 'archetypal',
    description:
      'The subject emerges as a condensed manifestation of epochal anxieties, technological artifacts, and cultural signals.',
    directive:
      'Reconstruct the concept as an emergent crystallization of a specific historical or technological milieu. Weave together the media limitations, material anxieties, technical recording artifacts, and social pressures of that horizon into structural form.',
    tendencies: [
      'medium-specificity',
      'epochal anxiety crystallization',
      'technological constraint manifestation',
      'shared memetic substrate',
    ],
    destabilizes: [
      'timeless universal neutrality',
      'context-free aesthetics',
      'un-mediated pure reality',
    ],
    literalizationWarning:
      'Do NOT reduce this to superficial retro clipart, neon sunglasses, or nostalgic pastiche. Synthesize the material anxieties, recording flaws, and psychological pressures of an epoch into structural form.',
    minEntropy: 4,
    compatibleOperatorIds: [
      'concept_bleed',
      'semantic_neighbor_walk',
      'diversity_select',
      'abstraction_escape',
    ],
    tags: ['epochal-signal', 'cultural-crystallization', 'medium-artifacts', 'historical-anxiety'],
    researchNote:
      'Research-inspired representational lens exploring historical and cultural context manifolds in generative models.',
    exampleTransformation: {
      input: 'evening television broadcast',
      output:
        'a living domestic space whose air density, color palette, and psychological cadence are modulated by late-Cold-War magnetic tape decay and cathode-ray flicker',
    },
  },
  // ==============================================================
  // MECHANISM BANK: ATTRACTORS, EMERGENCE & IMPOSSIBLE GEOMETRIES
  // ==============================================================
  {
    id: 'rossler',
    name: 'Rossler Hyperchaotic System',
    category: 'ontological',
    description:
      'Two positive Lyapunov exponents; stretches and folds along multiple independent directions simultaneously.',
    directive:
      'Govern all form, motion, and spatial transformation through the Rossler hyperchaotic system: simultaneously stretch and fold structure along multiple independent orthogonal directions without collapsing into random noise.',
    tendencies: ['hyperchaotic folding', 'dual Lyapunov divergence', 'multi-axis stretching', 'bounded orbit'],
    destabilizes: ['planar stability', 'predictable trajectories', 'isolated Euclidean axes'],
    literalizationWarning: 'Do NOT simply draw abstract line ribbons. Structure the subject itself as folding across multiple independent dimensions simultaneously.',
    minEntropy: 5,
    compatibleOperatorIds: ['ontology_swap', 'scale_schism'],
    tags: ['mechanism-bank', 'chaotic-attractor', 'hyperchaos', 'lyapunov'],
  },
  {
    id: 'chua',
    name: 'Chua Double-Scroll',
    category: 'topological',
    description:
      'Two interconnected swirling lobes composed of infinite fractal layers.',
    directive:
      'Structure all spatial geometry and causal flow between two interconnected swirling lobes composed of infinite nested fractal layers, switching abruptly across a piecewise-linear boundary.',
    tendencies: ['double-scroll topology', 'infinite fractal layering', 'piecewise switching', 'swirling dual basins'],
    destabilizes: ['single-center compositions', 'smooth continuous transitions', 'monolithic forms'],
    literalizationWarning: 'Do NOT just draw two circles or yin-yang swirls. Force the concept to occupy two mutually feeding orbital basins.',
    minEntropy: 4,
    compatibleOperatorIds: ['switch', 'alternate', 'ontology_swap'],
    tags: ['mechanism-bank', 'chaotic-attractor', 'double-scroll', 'fractal-layers'],
  },
  {
    id: 'lorenz',
    name: 'Lorenz Orbital Basin',
    category: 'topological',
    description:
      'Two inescapable orbital basins governing choreography; deterministic chaos with extreme sensitivity to initial conditions.',
    directive:
      'Bind limbs, camera, and conceptual relationships to two inescapable orbital basins; movement oscillates unpredictably between opposing poles with sensitive path dependence.',
    tendencies: ['butterfly attractor', 'dual orbital basins', 'deterministic chaos', 'sensitive path dependence'],
    destabilizes: ['static positioning', 'stable equilibrium', 'reversible motion'],
    literalizationWarning: 'Do NOT draw literal butterfly wings. Bind the movement and compositional choreography to the orbital basins.',
    minEntropy: 4,
    compatibleOperatorIds: ['kinetic_anchor', 'ontology_swap'],
    tags: ['mechanism-bank', 'chaotic-attractor', 'lorenz', 'orbital-basins'],
  },
  {
    id: 'turing_instability',
    name: 'Turing Instability',
    category: 'material',
    description:
      'Activator plus faster-diffusing inhibitor spontaneously breaking a uniform state into periodic spatial pattern.',
    directive:
      'Spontaneously break homogeneous surfaces and structures into periodic patterns through an activator-inhibitor dynamic: local reinforcement paired with long-range suppression creates emergent labyrinths, dots, and stripes in real time.',
    tendencies: ['reaction-diffusion morphogenesis', 'activator-inhibitor waves', 'spontaneous pattern formation', 'labyrinths'],
    destabilizes: ['smooth featureless surfaces', 'static textures', 'externally painted patterns'],
    literalizationWarning: 'Do NOT apply a leopard or zebra pattern filter. Allow the skin, organs, or architecture to grow and re-tessellate continuously through chemical reaction-diffusion.',
    minEntropy: 4,
    compatibleOperatorIds: ['bridge_agent', 'ontology_swap', 'progressive_wavefront'],
    tags: ['mechanism-bank', 'emergence', 'turing', 'morphogenesis', 'reaction-diffusion'],
  },
  {
    id: 'belousov_zhabotinsky',
    name: 'Belousov-Zhabotinsky Reaction',
    category: 'transformational',
    description:
      'Propagating oxidation waves, concentric targets and rotating spirals that annihilate on collision due to a refractory period.',
    directive:
      'Organize visual and temporal evolution as propagating concentric target waves and rotating multi-armed spirals; waves that collide annihilate each other due to a local refractory period, preventing feedback explosion.',
    tendencies: ['chemical wave propagation', 'spiral waves', 'collision annihilation', 'refractory phase resetting'],
    destabilizes: ['linear wavefronts', 'additive wave interference', 'permanent states'],
    literalizationWarning: 'Do NOT draw a spiral swirl. Model physical changes as propagating chemical oxidation waves that self-annihilate on contact.',
    minEntropy: 5,
    compatibleOperatorIds: ['progressive_wavefront', 'ontology_swap'],
    tags: ['mechanism-bank', 'emergence', 'chemical-oscillator', 'spiral-waves'],
  },
  {
    id: 'poincare_disk',
    name: 'Poincare Disk Hyperbolic Geometry',
    category: 'topological',
    description:
      'Objects shrink exponentially toward a boundary that represents infinity; tilings impossible in Euclidean space.',
    directive:
      'Map all spatial metrics into a Poincare disk representation: metric distance expands exponentially as coordinates approach the perimeter boundary; infinite Euclidean expanse is geometrically compressed into a finite disc with conformal angular preservation.',
    tendencies: ['hyperbolic metric dilation', 'exponential boundary decay', 'non-Euclidean tessellation', 'conformal mapping'],
    destabilizes: ['parallel lines', 'Euclidean distance invariance', 'infinite canvas edges'],
    literalizationWarning: 'Do NOT just apply a fish-eye lens distortion. The actual geometric relationships, polygons, and proportions must obey hyperbolic non-Euclidean geometry.',
    minEntropy: 5,
    compatibleOperatorIds: ['destructive_vocab_ban', 'ontology_swap', 'contradiction_constraint'],
    tags: ['mechanism-bank', 'impossible-geometry', 'poincare', 'hyperbolic'],
  },
  {
    id: 'quantum_foam',
    name: 'Planck Quantum Foam',
    category: 'material',
    description:
      'Seething bubbling froth of spacetime geometry and vacuum fluctuations at the Planck scale.',
    directive:
      'Treat the physical substrate not as smooth continuum, but as a seething, churning froth of fluctuating topology at the Planck scale, where micro-wormholes spontaneously nucleate, entangle, and collapse.',
    tendencies: ['topological fluctuation', 'vacuum zero-point boiling', 'micro-wormhole foam', 'non-smooth spacetime'],
    destabilizes: ['smooth solid surfaces', 'continuous time', 'differentiable manifolds'],
    literalizationWarning: 'Do NOT make cartoon soap bubbles. Depict continuous topological foam where spacetime itself boils at the micro scale.',
    minEntropy: 6,
    compatibleOperatorIds: ['substrate_shift', 'ontology_swap'],
    tags: ['mechanism-bank', 'physical-exotica', 'quantum-foam', 'planck-scale'],
  },
  {
    id: 'bootstrap_paradox',
    name: 'Bootstrap Paradox / Closed Timelike Curve',
    category: 'epistemic',
    description:
      'A stable fixed point; the object is the attractor of its own history with no external origin point.',
    directive:
      'Structure the entity as a closed causal loop: it exists solely because its future iteration traveled into its past to construct itself. It has zero external genesis or author; its origin is a stable ontological fixed point.',
    tendencies: ['closed timelike curve', 'self-originating artifact', 'acausal stability', 'retrocausal anchoring'],
    destabilizes: ['linear chronology', 'cause preceding effect', 'teleological creation'],
    literalizationWarning: 'Do NOT just put clocks or hourglasses in the background. Structure the narrative and visual causality so the entity is the direct parent of its own creation.',
    minEntropy: 5,
    compatibleOperatorIds: ['contradiction_constraint', 'recursive_reversal', 'staged_paradox'],
    tags: ['mechanism-bank', 'physical-exotica', 'bootstrap-paradox', 'closed-timeloop'],
  },
] as const;

/**
 * Retrieve a latent attractor by its stable ID
 */
export function getAttractor(id: string): LatentAttractor | undefined {
  return LATENT_ATTRACTORS.find((a) => a.id === id);
}

/**
 * Verify if a given string corresponds to a registered latent attractor ID
 */
export function isValidAttractorId(id: string): boolean {
  return LATENT_ATTRACTORS.some((a) => a.id === id);
}

/**
 * Retrieve all attractors belonging to a specific category
 */
export function getAttractorsByCategory(category: AttractorCategory): LatentAttractor[] {
  return LATENT_ATTRACTORS.filter((a) => a.category === category);
}

/**
 * Group all registered attractors by category
 */
export function getAttractorsGroupedByCategory(): Record<AttractorCategory, LatentAttractor[]> {
  const groups: Record<AttractorCategory, LatentAttractor[]> = {
    distributed: [],
    material: [],
    spectral: [],
    ontological: [],
    collective: [],
    transformational: [],
    archetypal: [],
    epistemic: [],
    topological: [],
  };

  for (const attractor of LATENT_ATTRACTORS) {
    groups[attractor.category].push(attractor);
  }

  return groups;
}

/**
 * Retrieve compatible operator IDs for a given attractor
 */
export function getCompatibleOperatorsForAttractor(attractorId: string): string[] {
  const attractor = getAttractor(attractorId);
  return attractor?.compatibleOperatorIds ? [...attractor.compatibleOperatorIds] : [];
}

/**
 * Retrieve the literalization warning for an attractor
 */
export function getLiteralizationWarning(id: string): string | undefined {
  return getAttractor(id)?.literalizationWarning;
}

/**
 * Filter attractors whose minimum recommended entropy is less than or equal to current entropy
 */
export function getEligibleAttractorsForEntropy(entropy: number): LatentAttractor[] {
  return LATENT_ATTRACTORS.filter((a) => a.minEntropy <= entropy);
}
