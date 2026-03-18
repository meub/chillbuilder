import { useMemo } from 'react';
import type { Character } from '../models/types';
import type { ArtSchool } from '../models/types';
import { computeCipBreakdown, type CipBreakdown } from '../utils/cip';
import { disciplines } from '../data/disciplines';

// Build a lookup from discipline ID to school
const disciplineSchoolMap: Record<string, ArtSchool> = {};
for (const d of disciplines) {
  disciplineSchoolMap[d.id] = d.school;
}

export function useCipCalculation(character: Character | null): CipBreakdown {
  return useMemo(() => {
    if (!character) {
      return { abilities: 0, skills: 0, edges: 0, drawbacks: 0, disciplines: 0, spells: 0, psionics: 0, total: 0 };
    }
    return computeCipBreakdown(character, disciplineSchoolMap);
  }, [character]);
}
