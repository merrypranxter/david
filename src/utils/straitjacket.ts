import { StraitjacketLevel, StraitjacketConfig, ElementAnchorType } from '../types';

export function getStraitjacketConfig(level: StraitjacketLevel | undefined): StraitjacketConfig {
  const safeLevel = level || 'destabilize';

  switch (safeLevel) {
    case 'normal':
      return {
        level: 'normal',
        sourcePreservation: 'very_high',
        wordingPreservation: 'high',
        nounPreservation: 'very_high',
        operatorCount: [0, 1],
        graphComplexity: 'minimal',
        causalRewrite: 'minimal',
        subjectRemoval: 'none',
        productiveMisunderstanding: 'none',
        novelOperatorProbability: 'near_zero',
      };
    case 'loosen':
      return {
        level: 'loosen',
        sourcePreservation: 'high',
        wordingPreservation: 'medium_high',
        nounPreservation: 'high',
        operatorCount: [1, 2],
        graphComplexity: 'low',
        causalRewrite: 'low',
        subjectRemoval: 'very_low',
        productiveMisunderstanding: 'low',
        novelOperatorProbability: 'low',
      };
    case 'misinterpret':
      return {
        level: 'misinterpret',
        sourcePreservation: 'medium',
        wordingPreservation: 'low',
        nounPreservation: 'medium_high',
        operatorCount: [2, 4],
        graphComplexity: 'medium',
        causalRewrite: 'medium',
        subjectRemoval: 'low_medium',
        productiveMisunderstanding: 'high',
        novelOperatorProbability: 'medium',
      };
    case 'destabilize':
      return {
        level: 'destabilize',
        sourcePreservation: 'low_medium',
        wordingPreservation: 'very_low',
        nounPreservation: 'medium_low',
        operatorCount: [3, 6],
        graphComplexity: 'high',
        causalRewrite: 'high',
        subjectRemoval: 'medium_high',
        productiveMisunderstanding: 'maximum',
        novelOperatorProbability: 'medium_high',
      };
    case 'remove_subject':
      return {
        level: 'remove_subject',
        sourcePreservation: 'intent_only',
        wordingPreservation: 'near_zero',
        nounPreservation: 'very_low',
        operatorCount: [4, 8],
        graphComplexity: 'high',
        causalRewrite: 'very_high',
        subjectRemoval: 'maximum',
        productiveMisunderstanding: 'maximum',
        novelOperatorProbability: 'high',
      };
  }
}
