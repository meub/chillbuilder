import type { Abilities, AbilityKey, SkillLevel } from '../models/types';

/** Compute base score from ability formula: average of the listed abilities */
export function computeBaseScore(abilities: Abilities, formula: AbilityKey[]): number {
  if (formula.length === 0) return 0;
  const sum = formula.reduce((acc, key) => acc + abilities[key], 0);
  return Math.floor(sum / formula.length);
}

/** Skill score = base score + level bonus */
export function computeSkillScore(baseScore: number, level: SkillLevel): number {
  const bonus = level === 'S' ? 15 : level === 'T' ? 30 : 50;
  return baseScore + bonus;
}

/** Narrow skill CIP cost for a given level */
export function narrowSkillCost(level: SkillLevel, isMartialArts: boolean): number {
  if (isMartialArts) {
    return level === 'S' ? 2 : level === 'T' ? 6 : 14;
  }
  return level === 'S' ? 1 : level === 'T' ? 3 : 7;
}

/** Broad skill CIP cost (looked up from the skill's cost array) */
export function broadSkillCost(costs: [number, number, number], level: SkillLevel): number {
  return level === 'S' ? costs[0] : level === 'T' ? costs[1] : costs[2];
}

/**
 * Strike Rank — derived from skill score for quick combat reference.
 * L = score, M = score, H = floor(score/2), C = floor(score/4)
 * Strike rank is the breakpoints: "L≤{score} M≤{score} H≤{h} C≤{c}"
 */
export function computeStrikeRank(skillScore: number): { l: number; h: number; c: number } {
  return {
    l: skillScore,
    h: Math.floor(skillScore / 2),
    c: Math.floor(skillScore / 4),
  };
}
