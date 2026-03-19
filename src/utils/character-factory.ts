import { nanoid } from 'nanoid';
import type { Character, CipBudget, Abilities, Background } from '../models/types';

const defaultAbilities: Abilities = {
  AGL: 50,
  DEX: 50,
  LCK: 50,
  PCN: 50,
  PER: 50,
  STA: 50,
  STR: 50,
  WPR: 50,
};

const defaultBackground: Background = {
  name: '',
  age: 25,
  height: '',
  weight: '',
  education: '',
  profession: '',
  socialStatus: '',
  personalHistory: '',
  handedness: 'right',
};

export function createDefaultCharacter(budget: CipBudget = 100): Character {
  const now = Date.now();
  return {
    id: nanoid(),
    name: 'New Character',
    background: { ...defaultBackground },
    abilities: { ...defaultAbilities },
    currentStamina: defaultAbilities.STA,
    currentWillpower: defaultAbilities.WPR,
    skills: [],
    skillSystem: 'narrow',
    edges: [],
    drawbacks: [],
    disciplines: [],
    spells: [],
    psionicDisciplines: [],
    wounds: [],
    equipment: [],
    luckPoints: defaultAbilities.LCK,
    luckMode: 'standard',
    cipBudget: budget,
    encouragedSkills: [],
    discouragedSkills: [],
    notes: '',
    createdAt: now,
    updatedAt: now,
  };
}
