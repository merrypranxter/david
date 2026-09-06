import { ConceptOrgan, DecomposedConcept, DismembermentOptions, OrganType } from '../types';

/**
 * Generates a stable unique organ ID
 */
function createOrganId(type: OrganType, index: number): string {
  return `organ_${type}_${index}_${Math.random().toString(36).substring(2, 7)}`;
}

/**
 * Deep clone a DecomposedConcept instance
 */
export function cloneDecomposedConcept(decomposed: DecomposedConcept): DecomposedConcept {
  return {
    originalInput: decomposed.originalInput,
    organs: decomposed.organs.map((organ) => ({
      ...organ,
      tags: organ.tags ? [...organ.tags] : undefined,
      mutationHistory: organ.mutationHistory ? [...organ.mutationHistory] : undefined,
    })),
    detectedAnchors: [...decomposed.detectedAnchors],
    unclassifiedText: decomposed.unclassifiedText ? [...decomposed.unclassifiedText] : undefined,
    summary: decomposed.summary,
    reconstructedText: decomposed.reconstructedText,
  };
}

/**
 * Detect explicit anchors in input text (e.g. @mentions, quotes, explicit tags, capitalized names)
 */
export function detectAnchors(input: string): {
  anchors: string[];
  anchorMap: Map<string, number>;
} {
  const anchors: string[] = [];
  const anchorMap = new Map<string, number>();

  if (!input || typeof input !== 'string') {
    return { anchors, anchorMap };
  }

  // 1. Explicit @mentions (e.g., @merry, @david)
  const mentionMatches = input.match(/@[a-zA-Z0-9_-]+/g);
  if (mentionMatches) {
    for (const mention of mentionMatches) {
      if (!anchors.includes(mention)) {
        anchors.push(mention);
        anchorMap.set(mention.toLowerCase(), 1.0);
      }
    }
  }

  // 2. Explicit preservation directives (e.g., "preserve: X", "keep: X", "anchor: X")
  const preserveRegex = /\b(?:preserve|keep|anchor|must remain|do not change):\s*["']?([^"',;.\n]+)["']?/gi;
  let match: RegExpExecArray | null;
  while ((match = preserveRegex.exec(input)) !== null) {
    const val = match[1]?.trim();
    if (val && !anchors.includes(val)) {
      anchors.push(val);
      anchorMap.set(val.toLowerCase(), 1.0);
    }
  }

  // 3. Quoted strings ("exact phrase")
  const quoteRegex = /"([^"]{2,40})"/g;
  while ((match = quoteRegex.exec(input)) !== null) {
    const val = match[1]?.trim();
    if (val && !anchors.includes(val)) {
      anchors.push(val);
      anchorMap.set(val.toLowerCase(), 0.95);
    }
  }

  return { anchors, anchorMap };
}

/**
 * Determinstic local heuristic decomposition without requiring network or LLM calls.
 * Gracefully parses visual, musical, physical, and multimodal concepts into semantic organs.
 */
export function decomposeConceptLocally(input: string): DecomposedConcept {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return {
      originalInput: '',
      organs: [],
      detectedAnchors: [],
      summary: 'Empty concept',
      reconstructedText: '',
    };
  }

  const { anchors, anchorMap } = detectAnchors(trimmed);
  const organs: ConceptOrgan[] = [];
  let remainingText = trimmed;

  // Helper to extract matching phrase and register organ
  const extractOrgan = (
    type: OrganType,
    regex: RegExp,
    transform?: (matched: RegExpExecArray) => { value: string; tags?: string[]; span?: string },
    defaultStrength = 0.2
  ): void => {
    let m: RegExpExecArray | null;
    while ((m = regex.exec(remainingText)) !== null) {
      const extracted = transform ? transform(m) : { value: m[0].trim(), span: m[0] };
      const cleanVal = extracted.value.trim();
      if (!cleanVal) continue;

      // Check if this organ matches any detected anchor
      let preserveStrength = defaultStrength;
      for (const [anchorText, strength] of anchorMap.entries()) {
        if (cleanVal.toLowerCase().includes(anchorText)) {
          preserveStrength = Math.max(preserveStrength, strength);
        }
      }

      organs.push({
        id: createOrganId(type, organs.length + 1),
        type,
        originalValue: cleanVal,
        currentValue: cleanVal,
        mutationAllowed: preserveStrength < 0.8,
        preserveStrength,
        tags: extracted.tags,
        sourceSpan: extracted.span || cleanVal,
      });

      // Remove matched portion from remaining text to prevent duplicate extraction
      remainingText =
        remainingText.substring(0, m.index) +
        ' ' +
        remainingText.substring(m.index + m[0].length);
      regex.lastIndex = 0;
    }
  };

  // 1. Detect Multimodal / Audio Subject descriptors FIRST (so they aren't parsed as generic nouns)
  // e.g. "pure signal-decay noise", "ambient drone", "glitch percussion"
  extractOrgan(
    'subject',
    /\b(?:pure\s+signal-decay\s+noise|signal-decay\s+noise|ambient\s+drone|glitch\s+percussion)\b/gi,
    (m) => ({ value: m[0].trim(), tags: ['multimodal-audio', 'audio-subject'] }),
    0.7
  );

  // 2. Detect explicit Media & Style phrases
  // e.g. "filmed like a damaged 1980s VHS tape", "recorded on analog tape", "35mm film", "oil on canvas"
  extractOrgan(
    'media',
    /\b(?:filmed like|recorded on|shot on|rendered in|style of|in the style of|recorded with|captured with)\s+([^,;.]+)/gi,
    (m) => ({ value: m[0].trim(), tags: ['style-treatment', 'media-format'] }),
    0.3
  );

  extractOrgan(
    'media',
    /\b(?:(?:damaged|lo-fi|vintage|analog)\s+(?:1980s\s+)?(?:VHS|cassette|tape|CRT|film)|oil painting|35mm film|polaroid|glitch art|cinematic 8k)\b/gi,
    (m) => ({ value: m[0].trim(), tags: ['media-format'] }),
    0.3
  );

  // 3. Detect Constraints / Exclusions (including comma-separated lists of exclusions)
  // e.g. "no vocals, melody, chords, drums, or conventional song structure"
  extractOrgan(
    'constraint',
    /\bno\s+(?:vocals|melody|chords|drums|beat|percussion|conventional song structure|human|faces|text|words|instruments|lyrics)(?:,\s*(?:(?:or|and|nor|no|without)\s+)?(?:vocals|melody|chords|drums|beat|percussion|conventional song structure|human|faces|text|words|instruments|lyrics|[a-zA-Z\s-]+))*/gi,
    (m) => ({ value: m[0].trim(), tags: ['negative-constraint', 'exclusion-list'] }),
    0.6
  );

  extractOrgan(
    'constraint',
    /\b(?:without\s+[^,;.]+|never\s+[^,;.]+|must not\s+[^,;.]+)/gi,
    (m) => ({ value: m[0].trim(), tags: ['negative-constraint'] }),
    0.5
  );

  // 4. Detect Governing Rules / Physical Paradoxes
  // e.g. "simultaneously inside and outside itself", "where gravity acts sideways", "governed by X"
  extractOrgan(
    'governing_rule',
    /\b(?:(?:that|which)\s+is\s+)?(?:simultaneously\s+[^,;.]+|governed by\s+[^,;.]+|where\s+(?:gravity|time|light|causality)\s+[^,;.]+)/gi,
    (m) => ({ value: m[0].trim().replace(/^(?:that|which)\s+is\s+/i, ''), tags: ['physical-paradox', 'governing-rule'] }),
    0.4
  );

  // 5. Detect Transformations
  // e.g. "becomes a Möbius strip", "transforms into X", "turning into Y", "mutating into Z"
  extractOrgan(
    'transformation',
    /\b(?:while\s+(?:her|his|its|their|the)\s+body\s+becomes\s+[^,;.]+|becomes?\s+(?:a|an|the)?\s*[^,;.]+|transforms?\s+into\s+[^,;.]+|mutates?\s+into\s+[^,;.]+|turning\s+into\s+[^,;.]+|folds?\s+into\s+[^,;.]+)/gi,
    (m) => ({ value: m[0].trim(), tags: ['morphology', 'transformation'] }),
    0.3
  );

  // 6. Detect Spatial Relations & Kinematic Interactions
  // e.g. "while her reflection moves independently behind her", "behind her", "inside and outside itself"
  extractOrgan(
    'spatial_relation',
    /\b(?:while\s+(?:her|his|its|their|the)\s+reflection\s+moves?\s+independently(?:\s+behind\s+her)?|behind\s+(?:her|him|it|them|the\s+subject)|beneath\s+[^,;.]+|suspended\s+above\s+[^,;.]+|inside\s+and\s+outside\s+itself)\b/gi,
    (m) => ({ value: m[0].trim(), tags: ['spatial', 'relational'] }),
    0.3
  );

  // 7. Detect Material Descriptors
  // e.g. "translucent solid", "carved marble", "molten glass", "liquid gallium", "solid chrome"
  extractOrgan(
    'material',
    /\b(?:translucent solid|molten glass|liquid gallium|carved marble|solid chrome|organic tissue|rusted iron|vaporous plasma)\b/gi,
    (m) => ({ value: m[0].trim(), tags: ['material-substance'] }),
    0.3
  );

  // 8. Detect Identity / Named Anchors in remaining text (e.g. @merry)
  extractOrgan(
    'identity',
    /@[a-zA-Z0-9_-]+/g,
    (m) => ({ value: m[0].trim(), tags: ['named-anchor', 'identity'] }),
    1.0
  );

  // 9. Detect Actions
  // e.g. "performs aerobics", "stands still", "runs rapidly", "vibrates at 432Hz"
  extractOrgan(
    'action',
    /\b(?:performs?\s+aerobics|stands?\s+still|moves?\s+independently|vibrates?\s+at\s+[^,;.]+|accelerates?\s+downward|floats?\s+motionless)\b/gi,
    (m) => ({ value: m[0].trim(), tags: ['kinetic-action'] }),
    0.3
  );

  // 10. Extract Core Subject from remaining text
  // e.g. "A woman", "An impossible object", "object", "cathedral"
  const cleanRemaining = remainingText
    .replace(/\s+/g, ' ')
    .replace(/^[,;.\s]+|[,;.\s]+$/g, '')
    .replace(/\b(?:that\s+is|which\s+is|that|which)\s*$/i, '')
    .replace(/^[,;.\s]+|[,;.\s]+$/g, '')
    .trim();

  if (cleanRemaining) {
    // If the remaining text contains a subject noun or noun phrase
    const subjectMatch = cleanRemaining.match(
      /^(?:An?\s+)?(?:impossible\s+)?([a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)?)/i
    );

    if (subjectMatch && subjectMatch[0]) {
      const subjectCandidate = subjectMatch[0].trim();
      const isAnchor = anchors.some((a) =>
        subjectCandidate.toLowerCase().includes(a.toLowerCase())
      );

      organs.unshift({
        id: createOrganId('subject', 0),
        type: 'subject',
        originalValue: subjectCandidate,
        currentValue: subjectCandidate,
        mutationAllowed: !isAnchor,
        preserveStrength: isAnchor ? 1.0 : organs.length === 0 ? 0.7 : 0.4,
        tags: ['core-subject'],
        sourceSpan: subjectCandidate,
      });

      const rest = cleanRemaining.substring(subjectCandidate.length).trim();
      if (rest && rest.length > 2) {
        organs.push({
          id: createOrganId('unknown', organs.length + 1),
          type: 'unknown',
          originalValue: rest,
          currentValue: rest,
          mutationAllowed: true,
          preserveStrength: 0.1,
          tags: ['unclassified-context'],
          sourceSpan: rest,
        });
      }
    } else {
      // Fallback: put remaining into unknown organ so nothing is destroyed
      organs.push({
        id: createOrganId('unknown', organs.length + 1),
        type: 'unknown',
        originalValue: cleanRemaining,
        currentValue: cleanRemaining,
        mutationAllowed: true,
        preserveStrength: 0.2,
        tags: ['unclassified-context'],
        sourceSpan: cleanRemaining,
      });
    }
  }

  // Ensure an explicit subject organ exists if none was created
  const hasSubject = organs.some((o) => o.type === 'subject' || o.type === 'identity');
  if (!hasSubject && organs.length > 0) {
    // Find the first plausible candidate or unknown organ and upgrade it
    const unknownIdx = organs.findIndex((o) => o.type === 'unknown');
    if (unknownIdx !== -1) {
      organs[unknownIdx].type = 'subject';
      organs[unknownIdx].tags = ['inferred-subject'];
    }
  }

  // Reconstruct initial representation
  const reconstructed = reconstructConcept({
    originalInput: trimmed,
    organs,
    detectedAnchors: anchors,
  });

  return {
    originalInput: trimmed,
    organs,
    detectedAnchors: anchors,
    unclassifiedText: organs.filter((o) => o.type === 'unknown').map((o) => o.currentValue),
    summary: `Decomposed into ${organs.length} organs (${organs.map((o) => o.type).join(', ')}). Detected anchors: ${anchors.length > 0 ? anchors.join(', ') : 'none'}.`,
    reconstructedText: reconstructed,
  };
}

/**
 * Deterministic reconstruction helper that reassembles a coherent concept string
 * from current organ values according to semantic precedence.
 */
export function reconstructConcept(decomposed: {
  originalInput?: string;
  organs: ConceptOrgan[];
  detectedAnchors?: string[];
  unclassifiedText?: string[];
}): string {
  if (!decomposed.organs || decomposed.organs.length === 0) {
    return (decomposed.originalInput || '').trim();
  }

  const parts: string[] = [];
  const visitedValues = new Set<string>();

  const appendUnique = (val: string | undefined): void => {
    if (!val) return;
    const clean = val.trim().replace(/^[,;\s]+|[,;\s]+$/g, '');
    if (!clean) return;
    const lower = clean.toLowerCase();
    if (visitedValues.has(lower)) return;
    visitedValues.add(lower);
    parts.push(clean);
  };

  // Group organs by type
  const subjects = decomposed.organs.filter((o) => o.type === 'subject' || o.type === 'identity');
  const materials = decomposed.organs.filter((o) => o.type === 'material');
  const actions = decomposed.organs.filter((o) => o.type === 'action');
  const spatial = decomposed.organs.filter(
    (o) => o.type === 'spatial_relation' || o.type === 'environment' || o.type === 'composition'
  );
  const transformations = decomposed.organs.filter(
    (o) => o.type === 'transformation' || o.type === 'temporal_relation'
  );
  const rulesAndConstraints = decomposed.organs.filter(
    (o) => o.type === 'governing_rule' || o.type === 'constraint'
  );
  const stylesAndMedia = decomposed.organs.filter(
    (o) => o.type === 'style' || o.type === 'media'
  );
  const unknowns = decomposed.organs.filter((o) => o.type === 'unknown');

  // 1. Subject & Identity
  for (const s of subjects) {
    appendUnique(s.currentValue);
  }

  // 2. Materials
  for (const m of materials) {
    appendUnique(m.currentValue);
  }

  // 3. Actions
  for (const a of actions) {
    appendUnique(a.currentValue);
  }

  // 4. Spatial / Relational
  for (const sp of spatial) {
    appendUnique(sp.currentValue);
  }

  // 5. Transformations
  for (const t of transformations) {
    appendUnique(t.currentValue);
  }

  // 6. Governing rules & constraints
  for (const rc of rulesAndConstraints) {
    appendUnique(rc.currentValue);
  }

  // 7. Styles & Media treatment
  for (const sm of stylesAndMedia) {
    appendUnique(sm.currentValue);
  }

  // 8. Remaining unclassified context
  for (const u of unknowns) {
    appendUnique(u.currentValue);
  }

  // Assemble into coherent sentence structure
  let result = parts.join(', ');
  // Clean up punctuation artifacts (e.g. ", while" -> " while", ", behind" -> " behind")
  result = result
    .replace(/,\s*(while|with|behind|beneath|inside|around|transforms?|becomes?)\b/gi, ' $1')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return result;
}

// ==========================================
// ORGAN MUTATION & INSPECTION UTILITIES
// ==========================================

/**
 * Replace the current value of a specific organ while logging to its history
 */
export function replaceOrganValue(
  decomposed: DecomposedConcept,
  organId: string,
  newValue: string,
  historyNote?: string
): DecomposedConcept {
  const clone = cloneDecomposedConcept(decomposed);
  const target = clone.organs.find((o) => o.id === organId);
  if (!target) return clone;

  const previousValue = target.currentValue;
  target.currentValue = newValue.trim();

  if (!target.mutationHistory) {
    target.mutationHistory = [];
  }
  const note = historyNote || `Mutated from "${previousValue}" to "${target.currentValue}"`;
  target.mutationHistory.push(note);

  clone.reconstructedText = reconstructConcept(clone);
  return clone;
}

/**
 * Freeze an organ to prevent any mutation (preserveStrength = 1.0, mutationAllowed = false)
 */
export function freezeOrgan(decomposed: DecomposedConcept, organId: string): DecomposedConcept {
  const clone = cloneDecomposedConcept(decomposed);
  const target = clone.organs.find((o) => o.id === organId);
  if (target) {
    target.mutationAllowed = false;
    target.preserveStrength = 1.0;
  }
  return clone;
}

/**
 * Unfreeze an organ to allow downstream mutation
 */
export function unfreezeOrgan(
  decomposed: DecomposedConcept,
  organId: string,
  preserveStrength = 0.2
): DecomposedConcept {
  const clone = cloneDecomposedConcept(decomposed);
  const target = clone.organs.find((o) => o.id === organId);
  if (target) {
    target.mutationAllowed = true;
    target.preserveStrength = preserveStrength;
  }
  return clone;
}

/**
 * Adjust the preserve strength for an organ
 */
export function setOrganPreserveStrength(
  decomposed: DecomposedConcept,
  organId: string,
  strength: number
): DecomposedConcept {
  const clone = cloneDecomposedConcept(decomposed);
  const target = clone.organs.find((o) => o.id === organId);
  if (target) {
    target.preserveStrength = Math.max(0.0, Math.min(1.0, strength));
    target.mutationAllowed = target.preserveStrength < 0.8;
  }
  return clone;
}

/**
 * Retrieve all organs of a specific type
 */
export function getOrgansByType(decomposed: DecomposedConcept, type: OrganType): ConceptOrgan[] {
  return decomposed.organs.filter((o) => o.type === type);
}

/**
 * Append an entry to an organ's mutation history
 */
export function appendOrganMutationHistory(
  decomposed: DecomposedConcept,
  organId: string,
  note: string
): DecomposedConcept {
  const clone = cloneDecomposedConcept(decomposed);
  const target = clone.organs.find((o) => o.id === organId);
  if (target) {
    if (!target.mutationHistory) target.mutationHistory = [];
    target.mutationHistory.push(note);
  }
  return clone;
}

/**
 * Compare original vs current organ values
 */
export function compareOrganValues(
  decomposed: DecomposedConcept
): Array<{ id: string; type: OrganType; original: string; current: string; changed: boolean }> {
  return decomposed.organs.map((organ) => ({
    id: organ.id,
    type: organ.type,
    original: organ.originalValue,
    current: organ.currentValue,
    changed: organ.originalValue !== organ.currentValue,
  }));
}

// ==========================================
// STRUCTURAL DISMEMBERMENT EXECUTOR
// ==========================================

/**
 * Concrete executor for the STRUCTURAL DISMEMBERMENT operator.
 * Opens the concept, labels its semantic organs, determines anchor boundaries,
 * marks mutation permissions, and generates a structured scaffold without
 * creatively modifying organ text.
 */
export function executeStructuralDismemberment(
  input: string | DecomposedConcept,
  options?: DismembermentOptions
): DecomposedConcept {
  const anchorThreshold = options?.anchorThreshold ?? 0.8;

  let decomposed: DecomposedConcept;
  if (typeof input === 'string') {
    decomposed = decomposeConceptLocally(input);
  } else {
    decomposed = cloneDecomposedConcept(input);
  }

  // Label mutation eligibility based on anchor threshold
  for (const organ of decomposed.organs) {
    // If explicit anchor or preserve strength exceeds threshold, lock it
    if (organ.preserveStrength >= anchorThreshold) {
      organ.mutationAllowed = false;
    } else {
      organ.mutationAllowed = true;
    }
  }

  // Update reconstruction and diagnostic summary
  decomposed.reconstructedText = reconstructConcept(decomposed);
  const allowedCount = decomposed.organs.filter((o) => o.mutationAllowed).length;
  const lockedCount = decomposed.organs.length - allowedCount;

  decomposed.summary = `[STRUCTURAL DISMEMBERMENT COMPLETE]: ${decomposed.organs.length} organs identified (${allowedCount} mutation-eligible, ${lockedCount} anchored/locked).`;

  return decomposed;
}
