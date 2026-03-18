import type { AbilityKey } from '../models/types';

export interface AbilityDefinition {
  key: AbilityKey;
  name: string;
  abbr: string;
  description: string;
}

export const abilities: AbilityDefinition[] = [
  { key: 'AGL', name: 'Agility', abbr: 'AGL', description: 'Movement, climbing, dodging, combat positioning' },
  { key: 'DEX', name: 'Dexterity', abbr: 'DEX', description: 'Hand-eye coordination, ranged combat, fine manipulation' },
  { key: 'LCK', name: 'Luck', abbr: 'LCK', description: 'Random fortune, avoiding death' },
  { key: 'PCN', name: 'Perception', abbr: 'PCN', description: 'Noticing details, sensing danger, awareness' },
  { key: 'PER', name: 'Personality', abbr: 'PER', description: 'Social impression, persuasion, intimidation' },
  { key: 'STA', name: 'Stamina', abbr: 'STA', description: 'Physical endurance, hit points, damage resistance' },
  { key: 'STR', name: 'Strength', abbr: 'STR', description: 'Physical power, melee damage, carrying capacity' },
  { key: 'WPR', name: 'Willpower', abbr: 'WPR', description: 'Mental resilience, resist fear, power the Art' },
];
