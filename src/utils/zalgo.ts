// Zalgo diacritical mark arrays for injecting controlled typographic entropy
const zalgoUp = [
  '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
  '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
  '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350',
];

const zalgoDown = [
  '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
  '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c',
  '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
];

const zalgoMid = [
  '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
  '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e',
];

export function zalgoify(text: string, intensity: number = 3): string {
  // intensity 1 to 10
  const normalizedIntensity = Math.max(1, Math.min(10, intensity));
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    result += char;

    if (char === ' ' || char === '\n') continue;

    const count = Math.floor(normalizedIntensity * 0.8) + (i % 2 === 0 ? 1 : 0);
    for (let j = 0; j < count; j++) {
      const type = j % 3;
      if (type === 0) {
        result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
      } else if (type === 1) {
        result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
      } else {
        result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
      }
    }
  }

  return result;
}

export const NOISE_ANCHORS = [
  '01010110 01101111 01101001 01100100',
  '[VOID-SINK: 0Hz_DRIFT]',
  '[BUFFER_OVERFLOW: 0xDEADBEEF]',
  'ck-ck-ck-k-t-t-s-s-s',
  '((((((((((((((((((((((((((((((',
  '[ERROR 404: REALITY_NOT_FOUND]',
  'Möbius: [Phase: 180° Inversion]',
  '[Vocalist turns into hydraulic press mid-sentence]',
  '[Tone: 444Hz] [Distortion: Maximum]',
];
