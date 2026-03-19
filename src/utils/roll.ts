export type ResultLevel = 'C' | 'H' | 'M' | 'L' | 'F' | 'B';

export interface RollResult {
  roll: number;
  target: number;
  modifier: number;
  effectiveTarget: number;
  result: ResultLevel;
  label: string;
}

const RESULT_LABELS: Record<ResultLevel, string> = {
  C: 'Colossal',
  H: 'High',
  M: 'Medium',
  L: 'Low',
  F: 'Failure',
  B: 'Botch',
};

/**
 * Cryptographically random integer in range [1, max].
 * Uses crypto.getRandomValues() for uniform distribution
 * with rejection sampling to eliminate modulo bias.
 */
function secureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max; // rejection threshold
  let value: number;
  do {
    crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return (value % max) + 1;
}

export function rollD100(): number {
  return secureRandomInt(100);
}

export function rollD10(): number {
  return secureRandomInt(10);
}

/**
 * Determine result level for a specific check (with result bands).
 * Roll 100 = always Botch regardless of target.
 */
export function resolveRoll(roll: number, target: number, modifier: number = 0): RollResult {
  const effectiveTarget = Math.max(1, target + modifier);

  let result: ResultLevel;
  if (roll === 100) {
    result = 'B';
  } else if (roll > effectiveTarget) {
    result = 'F';
  } else if (roll <= Math.floor(effectiveTarget / 4)) {
    result = 'C';
  } else if (roll <= Math.floor(effectiveTarget / 2)) {
    result = 'H';
  } else {
    // Roll is ≤ target. Chill doesn't have a strict L vs M band distinction
    // in the core rules for specific checks — L is the lowest success.
    // We'll treat the upper half of the success range as L, lower half as M.
    const midpoint = Math.floor(effectiveTarget * 3 / 4);
    result = roll <= midpoint ? 'M' : 'L';
  }

  return {
    roll,
    target,
    modifier,
    effectiveTarget,
    result,
    label: RESULT_LABELS[result],
  };
}

export const DIFFICULTY_MODIFIERS = [
  { label: 'Easy', value: 15 },
  { label: 'Average', value: 0 },
  { label: 'Difficult', value: -15 },
  { label: 'Very Difficult', value: -25 },
] as const;
