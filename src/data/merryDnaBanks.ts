export interface MerryDnaBankCategory {
  id: string;
  name: string;
  tagline: string;
  visualCue: string;
  banks: [string[], string[], string[], string[]];
}

/**
 * MERRY DNA is intentionally mechanism-heavy and object-light.
 * No mascots, sad appliances, office liminality, gears, generic machinery,
 * or novelty-toaster filler. Each category has four deterministic banks so
 * the Mutation Lab can CYCLE rather than showing the same pile forever.
 */
export const MERRY_DNA_BANKS: MerryDnaBankCategory[] = [
  {
    id: 'damage_analog',
    name: 'Analog Tape / Film Damage',
    tagline: 'Physical signal injury, generational decay, transport errors and damaged recording media',
    visualCue: 'The image behaves like wounded magnetic tape or chemically abused film rather than a clean digital render.',
    banks: [
      ['VHS head-switching noise', 'tracking loss bands', 'tape stretch warping', 'dropout streaks', 'chroma crawl', 'color-under bleed', 'RF snow', 'vertical hold roll'],
      ['time-base instability', 'horizontal sync tearing', 'ghosted field echo', 'interlace combing', 'head-clog streaking', 'generational VHS decay', 'tape crease flutter', 'CTL pulse instability'],
      ['16mm gate weave', '35mm emulsion scratches', 'film-burn edge bloom', 'dust-and-hair contamination', 'chemical reticulation', 'halation bloom', 'light-leak fogging', 'splice-jump discontinuity'],
      ['magnetic print-through', 'drop-frame tape chew', 'luma/chroma misregistration', 'wow-and-flutter geometry', 'field dominance error', 'analog smear trails', 'sync-tip collapse', 'multi-generation dubbing scars'],
    ],
  },
  {
    id: 'damage_digital',
    name: 'Digital / Codec Damage',
    tagline: 'Compression, prediction, packet and quantization failures used as structure',
    visualCue: 'Compression errors stop being surface dirt and become architecture, anatomy and continuity.',
    banks: [
      ['macroblock breakup', 'DCT ringing', 'mosquito noise', '4:2:0 chroma bleed', 'quantization banding', 'packet-loss holes', 'corrupted keyframe', 'frozen prediction blocks'],
      ['P-frame inheritance error', 'B-frame temporal substitution', 'decoder concealment smear', 'motion-compensation residue', 'bitplane corruption', 'wrong-reference-frame carryover', 'GOP collapse', 'codec drift'],
      ['JPEG generation loss', 'wavelet ringing', 'palette quantization', 'ordered-dither scars', 'nearest-neighbor resampling alias', 'subpixel phase error', 'alpha-premultiplication fringe', 'color-channel truncation'],
      ['CRC-like corruption texture', 'partial frame decode', 'tile-boundary discontinuity', 'variable-block prediction fracture', 'temporal error propagation', 'quantizer pumping', 'chroma-plane displacement', 'corrupt metadata interpreted as image structure'],
    ],
  },
  {
    id: 'glitch_motion_data',
    name: 'Glitch / Datamosh / Buffer Abuse',
    tagline: 'Temporal reassignment, displacement, feedback and data corruption',
    visualCue: 'Motion and identity smear into one another as if buffers and motion vectors became compositional tools.',
    banks: [
      ['datamosh motion-vector hijack', 'I-frame removal smear', 'pixel sorting', 'RGB channel desynchronization', 'feedback trails', 'scan displacement', 'buffer echo', 'temporal smear'],
      ['frame hold infection', 'motion-vector inheritance', 'recursive framebuffer feedback', 'displacement-map corruption', 'slit-scan time shear', 'line-by-line time offset', 'frame echo accumulation', 'optical-flow misassignment'],
      ['bitcrush image quantization', 'data bending', 'address-offset pixel shift', 'row-stride corruption', 'channel swap cascade', 'rolling buffer overwrite', 'memory smear', 'recursive resampling damage'],
      ['glitch topology carryover', 'motion field inversion', 'prediction residue anatomy', 'temporal block liquefaction', 'interframe identity leakage', 'feedback attractor scars', 'buffer underflow holes', 'stochastic frame reassignment'],
    ],
  },
  {
    id: 'display_signal',
    name: 'Display / Signal Physics',
    tagline: 'Raster, phosphor, scan, sync and display-device behavior',
    visualCue: 'The final image behaves like an electrical display signal, not a texture pasted over the frame.',
    banks: [
      ['CRT scanlines', 'phosphor persistence', 'shadow-mask triads', 'aperture-grille stripes', 'raster bowing', 'beam bloom', 'convergence error', 'scanline moiré'],
      ['horizontal oscillator drift', 'vertical retrace band', 'sync loss', 'rolling raster', 'overscan crop', 'flyback-line ghosts', 'luma bloom', 'black-level crush'],
      ['vector-display persistence trails', 'oscilloscope Lissajous trace', 'XY monitor deflection', 'phosphor burn-in', 'dot crawl', 'composite-video cross-color', 'cross-luminance artifacts', 'NTSC hue phase error'],
      ['LCD sample-and-hold smear', 'subpixel fringing', 'rolling-shutter skew', 'PWM banding', 'dead-pixel constellations', 'OLED near-black smear', 'scanout tearing', 'refresh-rate beat interference'],
    ],
  },
  {
    id: 'optical_illusions',
    name: 'Optical Illusions / Perceptual Failure',
    tagline: 'Color, depth, motion and contour illusions including obscure perception traps',
    visualCue: 'Perception itself becomes unstable: depth, contour, motion or color refuses to stay assigned to one place.',
    banks: [
      ['Moiré interference', 'Fraser spiral illusion', 'Café wall illusion', 'Poggendorff displacement', 'Zöllner tilt illusion', 'Hering curvature illusion', 'Ponzo depth illusion', 'Ebbinghaus size illusion'],
      ['peripheral drift illusion', 'Rotating Snakes motion illusion', 'reverse-phi motion', 'wagon-wheel alias motion', 'motion aftereffect field', 'stroboscopic apparent motion', 'motion-induced blindness', 'aperture problem ambiguity'],
      ['chromostereopsis', 'simultaneous contrast', 'Mach bands', 'neon color spreading', 'watercolor illusion', 'Bezold assimilation', 'Munker-White illusion', 'Craik-O’Brien-Cornsweet edge illusion'],
      ['Kanizsa illusory contours', 'scintillating grid', 'Hermann grid', 'Troxler fading', 'binocular rivalry', 'autostereogram depth', 'structure-from-motion ambiguity', 'impossible figure multistability'],
    ],
  },
  {
    id: 'optics_light',
    name: 'Optics / Light Physics',
    tagline: 'Interference, diffraction, polarization, caustics and physically weird light',
    visualCue: 'Color and brightness arise from wave behavior, material microstructure and optical geometry.',
    banks: [
      ['thin-film interference', 'Newton rings', 'diffraction grating spectrum', 'Fraunhofer diffraction', 'Fresnel diffraction', 'Airy disk structure', 'optical caustics', 'total internal reflection'],
      ['birefringent stress colors', 'cross-polarized crystal interference', 'dichroism', 'pleochroism', 'Brewster-angle extinction', 'optical vortex', 'Bessel beam', 'speckle interference'],
      ['rainbow dispersion prismatics', 'iridescent structural color', 'Bragg reflection', 'photonic bandgap color', 'opalescence', 'Tyndall scattering', 'Rayleigh scattering', 'Mie scattering'],
      ['fluorescence', 'phosphorescence', 'triboluminescence', 'sonoluminescence', 'Cherenkov glow', 'Raman-shift spectral ghosts', 'evanescent-wave glow', 'surface-plasmon color'],
    ],
  },
  {
    id: 'color_palettes',
    name: 'Color Palettes / Chromatic Systems',
    tagline: 'Palette systems that can be used as DNA or locked globally in the workbench',
    visualCue: 'Color behaves as a coherent system with a recognizable spectral logic rather than random rainbow seasoning.',
    banks: [
      ['radioactive candy: hot pink + cyan + lime + ultraviolet + tangerine', 'fluorescent toy-plastic spectrum', 'acid blacklight poster palette', 'highlighter CMYK collision', 'electric sherbet spectrum', 'neon aquarium palette', 'synthetic fruit-candy chroma', 'laser-printer impossible spot colors'],
      ['bismuth oxidation rainbow', 'oil-slick thin-film palette', 'peacock-feather structural color', 'Morpho blue photonic palette', 'opal diffraction palette', 'dichroic glass spectrum', 'abalone nacre iridescence', 'beetle-shell jewel chroma'],
      ['CRT phosphor green + amber + cyan', 'NTSC color-bar corruption', 'VHS chroma-bleed pastels', 'faded Ektachrome cyan-magenta cast', 'cross-processed slide film', 'bleach-bypass neon contamination', 'expired Polaroid chemistry', 'thermal-camera false color'],
      ['poison-dart frog warning colors', 'nudibranch aposematic palette', 'mantis shrimp spectral palette', 'bioluminescent deep-sea cyan', 'fluorescent coral proteins', 'orchid-mantis candy camouflage', 'jewel beetle metallic spectrum', 'tropical reef ultraviolet fluorescence'],
    ],
  },
  {
    id: 'biologics_microbes',
    name: 'Biologics / Bacteria / Colonies',
    tagline: 'Microbial colony geometry, biofilms, swarming fronts and living textures',
    visualCue: 'Growth behaves like a microbial ecology with edges, colonies, fronts and transport networks.',
    banks: [
      ['dendritic bacterial colony', 'rhizoid colony edge', 'filamentous colony', 'lobate colony margin', 'erose colony margin', 'concentric colony rings', 'punctiform microcolonies', 'spreading biofilm mat'],
      ['Bacillus-like branching swarm', 'Paenibacillus fractal colony', 'myxobacterial rippling', 'quorum-sensing wavefront', 'sliding motility sheet', 'twitching-motility fingers', 'extracellular polymeric biofilm matrix', 'wrinkled pellicle architecture'],
      ['cyanobacterial mat laminations', 'microbial streamer filaments', 'Streptomyces radial mycelium', 'actinomycete branching network', 'yeast colony sectoring', 'petri-dish inhibition halo', 'microbial competition boundary', 'colony-merger front'],
      ['chemotactic aggregation', 'nutrient-depletion rings', 'reaction-diffusion colony zoning', 'buckling biofilm ridges', 'osmotic colony channels', 'sporulation texture gradient', 'swarm-vortex phase', 'collective bacterial turbulence'],
    ],
  },
  {
    id: 'biologics_fungi_slime',
    name: 'Biologics / Fungi / Slime Mold',
    tagline: 'Hyphae, mycelia, spores, plasmodial networks and distributed living intelligence',
    visualCue: 'The form grows by branching, fusing, transporting and fruiting instead of by mechanical assembly.',
    banks: [
      ['mycelial hyphal network', 'hyphal tip branching', 'anastomosing fungal network', 'rhizomorphic cords', 'mycorrhizal exchange web', 'mushroom gill lamellae', 'pore-surface hymenium', 'spore-print radial geometry'],
      ['Physarum plasmodial veins', 'slime-mold nutrient network', 'plasmodial fan front', 'fruiting sporangia forest', 'Dictyostelium aggregation streams', 'slug-stage collective migration', 'sclerotium crust', 'protoplasmic shuttle-flow network'],
      ['lichen symbiotic crust', 'foliose lichen lobes', 'fruticose lichen branching', 'fungal fairy-ring growth', 'cordyceps-like stromata', 'earthstar peridium folds', 'stinkhorn lattice fungus', 'bird’s-nest peridiole cups'],
      ['hyphal fusion scar', 'spore-burst cloud', 'mycelial edge searching', 'fungal zonation rings', 'lamellar splitting gills', 'poroid maze hymenophore', 'gelatinous tremella folds', 'microfungal conidiophore branching'],
    ],
  },
  {
    id: 'biologics_insect_anatomy',
    name: 'Biologics / Insect / Anatomy',
    tagline: 'Ommatidia, chitin, venation, living microstructures and strange anatomical systems',
    visualCue: 'Anatomy borrows real biological construction rules at macro and micro scales.',
    banks: [
      ['compound-eye ommatidia', 'insect cuticle Bouligand helicoids', 'wing venation network', 'beetle elytra microtexture', 'butterfly scale shingles', 'setae arrays', 'spiracle openings', 'segmented arthropod joints'],
      ['moth-eye anti-reflective nipple array', 'dragonfly nodus venation', 'lacewing reticulate wings', 'cicada wing nanopillars', 'jewel-beetle chiral cuticle', 'weevil scale photonic crystals', 'mantis raptorial segmentation', 'bee comb sensory hairs'],
      ['trabecular bone lattice', 'osteon concentric canals', 'alveolar foam tissue', 'intestinal villi field', 'glomerular capillary tuft', 'neural dendritic arbor', 'retinal layer stack', 'cochlear spiral microanatomy'],
      ['branching bronchioles', 'capillary anastomosis', 'muscle fascicle bundles', 'dermal ridge fields', 'collagen crimp waves', 'fascia fiber sheets', 'lymphatic branching', 'papillary tissue microfolds'],
    ],
  },
  {
    id: 'morphogenesis',
    name: 'Morphogenesis / Development',
    tagline: 'Developmental rules that force form to grow, fold, segment and differentiate',
    visualCue: 'Do not paste biology onto the subject; make the subject arrive through a developmental process.',
    banks: [
      ['gastrulation invagination', 'epithelial folding', 'neurulation tube closure', 'somite segmentation', 'branching morphogenesis', 'budding morphogenesis', 'differential growth buckling', 'apical constriction'],
      ['Turing activator-inhibitor patterning', 'lateral inhibition spacing', 'morphogen concentration gradient', 'positional information field', 'reaction-diffusion stripe-to-spot transition', 'mechanochemical pattern formation', 'cell sorting by adhesion', 'contact inhibition boundary'],
      ['cleavage-plane iteration', 'blastula shell formation', 'embryonic axis breaking', 'left-right symmetry breaking', 'limb-bud branching', 'digit condensation pattern', 'vascular sprouting angiogenesis', 'neural crest migration'],
      ['phyllotactic organ initiation', 'meristem growth field', 'leaf venation canalization', 'shell accretion growth', 'allometric differential scaling', 'tissue eversion', 'lumen formation', 'programmed perforation / fenestration'],
    ],
  },
  {
    id: 'tilings',
    name: 'Tilings / Tessellations',
    tagline: 'Periodic, aperiodic, substitution, hyperbolic and computational tilings',
    visualCue: 'Space is partitioned by a rule system rather than decorated with a repeated pattern.',
    banks: [
      ['triangular tiling', 'square tiling', 'hexagonal tiling', 'trihexagonal tiling', 'rhombitrihexagonal tiling', 'snub square tiling', 'truncated hexagonal tiling', 'Cairo pentagonal tiling'],
      ['Penrose P2 kite-dart tiling', 'Penrose P3 rhomb tiling', 'Ammann-Beenker octagonal tiling', 'chair substitution tiling', 'sphinx tiling', 'pinwheel tiling', 'Robinson tiling', 'Hat monotile aperiodic tiling'],
      ['Wang tile constraint field', 'Truchet tile flow', 'Girih quasi-periodic strapwork', 'Islamic decagonal quasi-periodicity', 'Voronoi tessellation', 'centroidal Voronoi tessellation', 'Delaunay dual mesh', 'power diagram weighted cells'],
      ['hyperbolic {7,3} tiling', 'Poincaré disk tessellation', 'Escher-like hyperbolic subdivision', 'spherical geodesic tiling', 'Penrose inflation-deflation', 'cut-and-project tiling', 'multigrid quasicrystal tiling', 'random substitution tiling'],
    ],
  },
  {
    id: 'symmetries',
    name: 'Symmetries / Symmetry Breaking',
    tagline: 'Reflection, rotational, crystallographic and broken symmetry systems',
    visualCue: 'Symmetry acts as a governing transformation group, including controlled violations and defects.',
    banks: [
      ['bilateral reflection symmetry', 'radial symmetry', 'threefold rotational symmetry', 'fivefold rotational symmetry', 'dihedral D4 symmetry', 'dihedral D6 symmetry', 'glide reflection', 'helical symmetry'],
      ['seven frieze-group behaviors', 'wallpaper group p4m', 'wallpaper group p6m', 'wallpaper group p3m1', 'wallpaper group pgg', 'wallpaper group p4g', 'wallpaper group cm', 'wallpaper group p31m'],
      ['icosahedral symmetry', 'tetrahedral symmetry', 'octahedral symmetry', 'cubic point-group symmetry', 'quasicrystalline fivefold order', 'chiral symmetry', 'screw-axis symmetry', 'rotoinversion symmetry'],
      ['spontaneous symmetry breaking', 'domain-wall defect', 'dislocation breaking translational symmetry', 'grain-boundary mismatch', 'topological defect winding', 'frustrated symmetry', 'symmetry-breaking bifurcation', 'local symmetry preserved / global symmetry broken'],
    ],
  },
  {
    id: 'quasicrystal_aperiodic',
    name: 'Quasicrystals / Aperiodic Order',
    tagline: 'Long-range order without ordinary repetition',
    visualCue: 'The image feels rigorously ordered but refuses to settle into a repeating unit cell.',
    banks: [
      ['icosahedral quasicrystal order', 'decagonal quasicrystal order', 'dodecagonal quasicrystal order', 'fivefold diffraction symmetry', 'phason strain field', 'phason flip defect', 'aperiodic long-range order', 'forbidden crystallographic rotation'],
      ['cut-and-project from 5D lattice', 'cut-and-project from 6D lattice', 'acceptance-window geometry', 'Ammann bars', 'de Bruijn pentagrid', 'quasilattice inflation', 'local isomorphism class', 'matching-rule enforcement'],
      ['Shechtman-like diffraction pattern', 'icosahedral reciprocal-space stars', 'quasiperiodic density wave', 'Fibonacci chain spacing', 'silver-ratio substitution order', 'octagonal Ammann order', 'Penrose vertex stars', 'aperiodic defect propagation'],
      ['soft-matter quasicrystal domains', 'photonic quasicrystal lattice', 'colloidal quasicrystal self-assembly', 'dodecagonal tiling domains', 'quasicrystal grain boundary', 'phasonic rearrangement', 'approximant crystal patches', 'quasiperiodic moiré superstructure'],
    ],
  },
  {
    id: 'topology_tpms',
    name: 'Topology / Minimal Surfaces / TPMS',
    tagline: 'Non-orientable surfaces, knots, singularities and triply periodic minimal surfaces',
    visualCue: 'Inside/outside, continuity, genus and connectivity become material rules.',
    banks: [
      ['Möbius strip', 'Klein bottle', 'Boy’s surface', 'Roman surface', 'Whitney umbrella', 'projective plane immersion', 'Alexander horned sphere', 'Seifert surface'],
      ['trefoil knot complement', 'Hopf link', 'Borromean rings', 'Hopf fibration fibers', 'torus knot field', 'wild knot embedding', 'handlebody genus transition', 'topological surgery seam'],
      ['gyroid TPMS', 'Schwarz P surface', 'Schwarz D surface', 'Neovius surface', 'Lidinoid surface', 'I-WP surface', 'Fischer-Koch S surface', 'Scherk minimal surface'],
      ['Enneper surface', 'Costa minimal surface', 'helicoid-catenoid deformation', 'minimal-surface neck pinch', 'genus-changing singularity', 'non-orientable tissue continuity', 'inside-outside boundary identification', 'self-intersection locus'],
    ],
  },
  {
    id: 'crystals_minerals',
    name: 'Crystal Growth / Mineral Structure',
    tagline: 'Crystal habits, inclusions, fractures and mineral growth morphologies',
    visualCue: 'Material structure grows according to crystallographic habit and defect instead of generic sparkle.',
    banks: [
      ['dendritic crystal growth', 'hopper skeletal crystal', 'acicular crystal habit', 'bladed aggregate', 'botryoidal aggregate', 'radiating aggregate', 'rosette aggregate', 'stalactitic crystal habit'],
      ['tabular crystal habit', 'prismatic habit', 'fibrous aggregate', 'capillary crystal habit', 'reticulated crystal aggregate', 'reniform texture', 'mammillary texture', 'colloform texture'],
      ['trapiche radial growth', 'sagenitic needle inclusions', 'horsetail inclusions', 'rutile needle inclusions', 'chlorite phantom inclusions', 'faden thread inclusion', 'fenster growth windows', 'enhydro fluid inclusion'],
      ['conchoidal fracture', 'hackly fracture', 'brecciated mineral healing', 'agate banding', 'Liesegang mineral rings', 'geode cavity lining', 'oolitic accretion', 'pisolitic accretion'],
    ],
  },
  {
    id: 'soft_matter_fluid',
    name: 'Soft Matter / Fluid Instabilities',
    tagline: 'Foams, gels, phase separation, fingering, vortices and unstable interfaces',
    visualCue: 'Matter deforms through interfacial physics, flow, jamming and phase behavior.',
    banks: [
      ['Plateau foam borders', 'Weaire-Phelan foam cells', 'soap-film minimal surfaces', 'emulsion droplets', 'colloidal packing', 'gel network', 'granular jamming', 'spinodal decomposition'],
      ['Rayleigh-Taylor plumes', 'Kelvin-Helmholtz billows', 'Saffman-Taylor viscous fingering', 'Richtmyer-Meshkov shock mixing', 'Plateau-Rayleigh droplet breakup', 'Marangoni surface flow', 'Taylor-Couette vortices', 'von Kármán vortex street'],
      ['Faraday-wave lattice', 'Bénard convection cells', 'double-diffusive salt fingers', 'cavitation bubble collapse', 'Leidenfrost vapor film', 'capillary-wave interference', 'coalescence neck growth', 'contact-line pinning'],
      ['phase-separation coarsening', 'liquid-crystal schlieren defects', 'ferrofluid Rosensweig spikes', 'shear-thickening jam front', 'yield-stress fracture', 'viscoelastic filament thinning', 'active-matter turbulence', 'foam T1 neighbor swap'],
    ],
  },
  {
    id: 'plasma_electrical',
    name: 'Plasma / Electrical Phenomena',
    tagline: 'Breakdown, filamentation, discharges and field-driven luminous structures',
    visualCue: 'Electrical fields carve branching, filamentary and unstable luminous matter.',
    banks: [
      ['Lichtenberg dielectric tree', 'corona discharge', 'arc discharge', 'streamer discharge', 'plasma filament', 'dielectric barrier discharge', 'St. Elmo-like corona', 'surface tracking discharge'],
      ['Birkeland current filaments', 'magnetohydrodynamic kink instability', 'sausage instability', 'plasma double layer', 'magnetic reconnection', 'tokamak edge-localized mode', 'plasma sheath glow', 'pinch-effect filament'],
      ['mesospheric sprite', 'blue jet', 'ELVE ring', 'terrestrial gamma-flash geometry', 'auroral curtain filaments', 'ionospheric plasma irregularity', 'lightning leader branching', 'return-stroke channel'],
      ['electrowetting contact-line motion', 'electrohydrodynamic cone-jet', 'Taylor cone', 'dielectrophoretic particle chains', 'electroconvection rolls', 'electroluminescent breakdown', 'field emission glow', 'electrostatic dust branching'],
    ],
  },
  {
    id: 'fractals_attractors',
    name: 'Fractals / Strange Attractors',
    tagline: 'Recursive boundary geometry, dynamical attractors and scale-dependent structure',
    visualCue: 'Complexity comes from an iterative rule or dynamical system rather than generic fractal decoration.',
    banks: [
      ['Mandelbrot boundary filaments', 'Julia set dendrites', 'Burning Ship fractal', 'Tricorn fractal', 'Newton basin fractal', 'Apollonian gasket', 'Menger sponge', 'Sierpiński tetrahedron'],
      ['Lorenz strange attractor', 'Rössler attractor', 'Aizawa attractor', 'Thomas cyclically symmetric attractor', 'Hénon map', 'Ikeda map', 'Chua double-scroll attractor', 'Duffing attractor'],
      ['space-filling Hilbert curve', 'Peano curve', 'Heighway dragon', 'Lévy C curve', 'Gosper curve', 'Barnsley fern IFS', 'random fractal interpolation', 'multifractal cascade'],
      ['logistic-map bifurcation cascade', 'Feigenbaum self-similarity', 'strange nonchaotic attractor', 'Smale-Williams solenoid', 'chaotic saddle', 'basin-boundary fractalization', 'self-organized critical avalanche', 'fractal dimension gradient'],
    ],
  },
  {
    id: 'waves_cymatics',
    name: 'Waves / Cymatics / Resonance',
    tagline: 'Standing waves, nodal sets, interference and spectral geometry',
    visualCue: 'Geometry is generated by oscillation, phase and resonance rather than ornament.',
    banks: [
      ['Chladni nodal figure', 'cymatic liquid lattice', 'standing-wave nodes', 'Lissajous figure', 'Bessel mode pattern', 'drumhead eigenmode', 'membrane nodal lines', 'acoustic levitation nodes'],
      ['wave interference fringes', 'phase cancellation nodes', 'beat-frequency envelope', 'soliton train', 'KdV solitary wave', 'wave-packet dispersion', 'group-velocity shear', 'phase singularity vortex'],
      ['Faraday parametric resonance', 'mode locking', 'subharmonic response', 'Arnold tongue resonance region', 'frequency comb spacing', 'quasiperiodic beating', 'coupled-oscillator synchronization', 'chimera-state oscillators'],
      ['isospectral drum geometry', 'spectral graph mode', 'eigenfunction nodal domains', 'resonant cavity mode', 'Helmholtz resonance field', 'whispering-gallery mode', 'phononic bandgap pattern', 'acoustic metamaterial phase field'],
    ],
  },
];

export function getMerryDnaLexicon(bankIndex: number) {
  const bank = ((bankIndex % 4) + 4) % 4;
  return MERRY_DNA_BANKS.map((entry) => ({
    id: entry.id,
    name: entry.name,
    domain: 'slop' as const,
    category: 'Merry DNA',
    tagline: `${entry.tagline} · BANK ${bank + 1}/4`,
    keywords: entry.banks[bank],
    visualCue: entry.visualCue,
    paradoxPairing: '',
  }));
}

export const MERRY_DNA_ALL_KEYWORDS = Array.from(
  new Set(MERRY_DNA_BANKS.flatMap((entry) => entry.banks.flat()))
);
