import { Type } from '@google/genai';
import { getGenAI, resolveApiKey } from './david';
import {
  ConceptOrgan,
  DecomposedConcept,
  DismembermentOptions,
  OrganType,
} from '../src/types';
import {
  decomposeConceptLocally,
  detectAnchors,
  reconstructConcept,
} from '../src/utils/conceptDismemberment';

const VALID_ORGAN_TYPES: Set<OrganType> = new Set([
  'subject',
  'identity',
  'action',
  'transformation',
  'material',
  'environment',
  'spatial_relation',
  'temporal_relation',
  'composition',
  'constraint',
  'governing_rule',
  'style',
  'media',
  'unknown',
]);

/**
 * System instruction strictly enforcing semantic extraction without creative rewrites or editorializing
 */
const DECOMPOSITION_SYSTEM_INSTRUCTION = `You are a precision semantic extraction module for structured concept decomposition.
TASK:
Separate the provided multimodal concept into its constituent semantic organs.
STRICT OPERATIONAL DIRECTIVES:
1. Extract structure ONLY.
2. DO NOT creatively rewrite, embellish, or improve the concept.
3. DO NOT add new concepts, themes, or adjectives not present in the input.
4. Preserve exact named subjects, tokens (e.g. @names), and quoted expressions.
5. Avoid interpretation unless strictly required to classify the organ type.
6. Support multimodal inputs: visual, musical, physical, architectural, video, and abstract.
7. Return strictly valid JSON conforming to the requested schema.`;

/**
 * Calls the configured Gemini model to extract semantic organs in structured JSON format
 */
export async function decomposeConceptWithGemini(
  input: string,
  options?: DismembermentOptions
): Promise<DecomposedConcept> {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return decomposeConceptLocally(input);
  }

  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.warn('[Decomposition] No Gemini API key detected. Falling back to local heuristic decomposition.');
    return decomposeConceptLocally(trimmed);
  }

  const ai = getGenAI();
  const modelName = options?.modelPreference || 'gemini-3.1-flash-lite';

  const userPrompt = `INPUT CONCEPT TO DECOMPOSE:
"${trimmed}"

INSTRUCTIONS:
Classify phrases into organ types:
- subject (core nouns, subjects)
- identity (specific named people, entities, @tags)
- action (motion, verbs, kinetic states)
- transformation (becomes, transforms into, morphs)
- material (substances, physical matter)
- environment (setting, backdrop, surrounding)
- spatial_relation (inside/outside, behind, suspended above)
- temporal_relation (duration, sequence, while, before/after)
- composition (framing, perspective, focal arrangement)
- constraint (exclusions, negative constraints, "no vocals", "without X")
- governing_rule (underlying physical/conceptual axioms, paradoxes)
- style (artistic style, lighting, aesthetic treatments)
- media (recording medium: VHS, 35mm film, audio format, canvas)
- unknown (unclassified fragments)

Identify all explicit anchors (e.g. @mentions, proper names, quoted phrases). Assign preserveStrength between 0.0 (free to mutate) and 1.0 (strongly anchored).`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: userPrompt,
      config: {
        systemInstruction: DECOMPOSITION_SYSTEM_INSTRUCTION,
        temperature: 0.1, // Near-zero temperature for deterministic structural extraction
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            organs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'One of the valid organ types' },
                  value: { type: Type.STRING, description: 'The exact or extracted text phrase' },
                  preserveStrength: {
                    type: Type.NUMBER,
                    description: '0.0 to 1.0 score indicating preservation priority',
                  },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Descriptive semantic tags',
                  },
                },
                required: ['type', 'value', 'preserveStrength'],
              },
            },
            anchors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Explicit anchor terms detected',
            },
            unclassified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Unresolved or unclassified text fragments',
            },
            summary: {
              type: Type.STRING,
              description: 'Concise summary of decomposition',
            },
          },
          required: ['organs'],
        },
      },
    });

    const rawText = response.text || '';
    const parsed = JSON.parse(rawText);

    if (!parsed || !Array.isArray(parsed.organs) || parsed.organs.length === 0) {
      console.warn('[Decomposition] Gemini response did not contain a valid organs array. Falling back to local heuristic.');
      return decomposeConceptLocally(trimmed);
    }

    const { anchors: localAnchors, anchorMap } = detectAnchors(trimmed);
    const combinedAnchors = Array.from(
      new Set([...(Array.isArray(parsed.anchors) ? parsed.anchors : []), ...localAnchors])
    );

    const organs: ConceptOrgan[] = parsed.organs.map((rawOrgan: any, idx: number) => {
      const rawType = String(rawOrgan.type || 'unknown').toLowerCase();
      const organType: OrganType = VALID_ORGAN_TYPES.has(rawType as OrganType)
        ? (rawType as OrganType)
        : 'unknown';

      const val = String(rawOrgan.value || '').trim();
      let preserve = typeof rawOrgan.preserveStrength === 'number' ? rawOrgan.preserveStrength : 0.3;

      // Ensure local anchors are enforced
      for (const [anchorText, strength] of anchorMap.entries()) {
        if (val.toLowerCase().includes(anchorText)) {
          preserve = Math.max(preserve, strength);
        }
      }

      return {
        id: `organ_${organType}_${idx + 1}_${Math.random().toString(36).substring(2, 7)}`,
        type: organType,
        originalValue: val,
        currentValue: val,
        mutationAllowed: preserve < (options?.anchorThreshold ?? 0.8),
        preserveStrength: preserve,
        tags: Array.isArray(rawOrgan.tags) ? rawOrgan.tags : undefined,
        sourceSpan: val,
      };
    });

    const unclassified = Array.isArray(parsed.unclassified) ? parsed.unclassified : [];

    const reconstructed = reconstructConcept({
      originalInput: trimmed,
      organs,
      detectedAnchors: combinedAnchors,
      unclassifiedText: unclassified,
    });

    return {
      originalInput: trimmed,
      organs,
      detectedAnchors: combinedAnchors,
      unclassifiedText: unclassified,
      summary: parsed.summary || `Extracted ${organs.length} semantic organs via ${modelName}.`,
      reconstructedText: reconstructed,
    };
  } catch (err) {
    console.warn('[Decomposition] Gemini decomposition encountered an error, falling back cleanly to local:', err);
    return decomposeConceptLocally(trimmed);
  }
}

/**
 * Universal decomposition entrypoint:
 * 1. Accepts source concept
 * 2. Runs local heuristic decomposition
 * 3. Runs Gemini LLM-assisted decomposition if options.useLLM is true
 * 4. Validates returned structure
 * 5. Fails softly to local decomposition if LLM fails or is unavailable
 * 6. Never throws or breaks the host application
 */
export async function decomposeConcept(
  input: string,
  options?: DismembermentOptions
): Promise<DecomposedConcept> {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    return decomposeConceptLocally('');
  }

  if (options?.useLLM) {
    return await decomposeConceptWithGemini(trimmed, options);
  }

  return decomposeConceptLocally(trimmed);
}
