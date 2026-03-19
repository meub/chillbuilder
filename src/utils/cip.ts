import type { Abilities, Character, CharacterSkill, CharacterEdge, CharacterDrawback, CharacterDiscipline, CharacterPsionic, ArtSchool } from '../models/types';
import { narrowSkillCost, broadSkillCost } from './skills';
import { narrowSkills } from '../data/skills-narrow';
import { broadSkills } from '../data/skills-broad';
import { edges as edgeDefs } from '../data/edges';
import { drawbacks as drawbackDefs } from '../data/drawbacks';

/** CIP cost for abilities: each ability score / 5 (rounded down) */
export function computeAbilitiesCip(abilities: Abilities): number {
  return Object.values(abilities).reduce((sum, score) => sum + Math.floor(score / 5), 0);
}

/** CIP cost for a single skill, with optional encouraged/discouraged modifier */
export function computeSkillCip(
  skill: CharacterSkill,
  encouraged: string[] = [],
  discouraged: string[] = [],
): number {
  let baseCost: number;
  if (skill.isBroad) {
    const def = broadSkills.find(s => s.id === skill.skillId);
    if (!def) return 0;
    baseCost = broadSkillCost(def.costs, skill.level);
  } else {
    const def = narrowSkills.find(s => s.id === skill.skillId);
    if (!def) return 0;
    baseCost = narrowSkillCost(skill.level, !!def.isMartialArts);
  }
  if (encouraged.includes(skill.skillId)) return Math.ceil(baseCost / 2);
  if (discouraged.includes(skill.skillId)) return baseCost * 2;
  return baseCost;
}

/** Total CIP cost for all skills */
export function computeSkillsCip(
  skills: CharacterSkill[],
  encouraged: string[] = [],
  discouraged: string[] = [],
): number {
  return skills.reduce((sum, skill) => sum + computeSkillCip(skill, encouraged, discouraged), 0);
}

/** Total CIP cost for edges */
export function computeEdgesCip(charEdges: CharacterEdge[]): number {
  return charEdges.reduce((sum, edge) => {
    if (edge.customCost !== undefined) return sum + edge.customCost;
    const def = edgeDefs.find(e => e.id === edge.edgeId);
    if (!def) return sum;
    return sum + def.cost * edge.purchases;
  }, 0);
}

/** Total CIP bonus from drawbacks (subtracted from total) */
export function computeDrawbacksBonus(charDrawbacks: CharacterDrawback[]): number {
  return charDrawbacks.reduce((sum, db) => {
    if (db.customBonus !== undefined) return sum + db.customBonus;
    const def = drawbackDefs.find(d => d.id === db.drawbackId);
    if (!def) return sum;
    return sum + def.cipBonus * db.purchases;
  }, 0);
}

/** CIP cost for Art disciplines, accounting for multi-school multiplier */
export function computeDisciplinesCip(disciplines: CharacterDiscipline[]): number {
  // Group by school
  // Need to import discipline definitions to find school
  // Lazy import to avoid circular - we pass disciplines data in
  return disciplines.reduce((sum, _disc) => {
    // Base costs: S=1, T=3 (1+2), M=7 (1+2+4)
    // For now, simplified: first school = normal, each additional school multiplies
    // This requires knowing which schools are active
    return sum;
  }, 0);
}

/** Compute discipline CIPs with school multiplier */
export function computeDisciplinesCipFull(
  disciplines: CharacterDiscipline[],
  disciplineSchoolMap: Record<string, ArtSchool>
): number {
  // Count unique schools
  const schoolSet = new Set<ArtSchool>();
  disciplines.forEach(d => {
    const school = disciplineSchoolMap[d.disciplineId];
    if (school) schoolSet.add(school);
  });

  // Order schools by when they first appear
  const schoolOrder: ArtSchool[] = [];
  disciplines.forEach(d => {
    const school = disciplineSchoolMap[d.disciplineId];
    if (school && !schoolOrder.includes(school)) {
      schoolOrder.push(school);
    }
  });

  // Compute cost with multipliers
  let total = 0;
  for (const disc of disciplines) {
    const school = disciplineSchoolMap[disc.disciplineId];
    if (!school) continue;
    const schoolIndex = schoolOrder.indexOf(school);
    const multiplier = schoolIndex + 1; // 1st school = 1x, 2nd = 2x, etc.

    const baseCost = disc.level === 'S' ? 1 : disc.level === 'T' ? 3 : 7;
    total += baseCost * multiplier;
  }
  return total;
}

/** CIP cost for Companion spells: 3 each */
export function computeSpellsCip(spellCount: number): number {
  return spellCount * 3;
}

/** CIP cost for psionic disciplines */
export function computePsionicsCip(psionics: CharacterPsionic[]): number {
  return psionics.reduce((sum, p) => {
    // Leveled: S=4, T=6, M=8. Flat: 6
    if (p.level) {
      return sum + (p.level === 'S' ? 4 : p.level === 'T' ? 6 : 8);
    }
    return sum + 6;
  }, 0);
}

export interface CipBreakdown {
  abilities: number;
  skills: number;
  edges: number;
  drawbacks: number; // negative (bonus)
  disciplines: number;
  spells: number;
  psionics: number;
  total: number;
}

export function computeCipBreakdown(character: Character, disciplineSchoolMap: Record<string, ArtSchool>): CipBreakdown {
  const abilitiesCip = computeAbilitiesCip(character.abilities);
  const skillsCip = computeSkillsCip(character.skills, character.encouragedSkills ?? [], character.discouragedSkills ?? []);
  const edgesCip = computeEdgesCip(character.edges);
  const drawbacksBonus = computeDrawbacksBonus(character.drawbacks);
  const disciplinesCip = computeDisciplinesCipFull(character.disciplines, disciplineSchoolMap);
  const spellsCip = computeSpellsCip(character.spells.length);
  const psionicsCip = computePsionicsCip(character.psionicDisciplines);

  return {
    abilities: abilitiesCip,
    skills: skillsCip,
    edges: edgesCip,
    drawbacks: drawbacksBonus,
    disciplines: disciplinesCip,
    spells: spellsCip,
    psionics: psionicsCip,
    total: abilitiesCip + skillsCip + edgesCip - drawbacksBonus + disciplinesCip + spellsCip + psionicsCip,
  };
}
