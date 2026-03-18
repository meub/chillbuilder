/** Eight basic abilities */
export type AbilityKey = 'AGL' | 'DEX' | 'LCK' | 'PCN' | 'PER' | 'STA' | 'STR' | 'WPR';

export interface Abilities {
  AGL: number;
  DEX: number;
  LCK: number;
  PCN: number;
  PER: number;
  STA: number;
  STR: number;
  WPR: number;
}

export type SkillLevel = 'S' | 'T' | 'M'; // Student / Teacher / Master

export type SkillSystem = 'broad' | 'narrow' | 'mixed';

export type SkillCategory =
  | 'melee'
  | 'firearms'
  | 'bow'
  | 'entangler'
  | 'thrown'
  | 'ranged'
  | 'combat'
  | 'non-combat';

export interface SkillDefinition {
  id: string;
  name: string;
  formula: AbilityKey[]; // averaged to compute base score
  category: SkillCategory;
  isInfo?: boolean;       // [I] information skill
  isNew?: boolean;        // New in Companion
  isMartialArts?: boolean;
  unskilled?: number;     // unskilled bonus (e.g. +4), undefined = cannot use unskilled
  usesCurrentSta?: boolean; // Running, Swimming use current STA
}

export interface BroadSkillDefinition {
  id: string;
  name: string;
  formula: AbilityKey[];
  costs: [number, number, number]; // [Student, Teacher, Master] CIP costs
  encompasses: string[];           // narrow skill IDs this covers
}

export interface CharacterSkill {
  skillId: string;
  level: SkillLevel;
  isBroad: boolean;
}

/** Edges */
export interface EdgeDefinition {
  id: string;
  name: string;
  cost: number;         // CIP cost per purchase
  maxPurchases: number; // 0 = unlimited
  description: string;
  variableCost?: boolean; // e.g. Pet (1-10)
}

export interface CharacterEdge {
  edgeId: string;
  purchases: number;
  customCost?: number;  // for variable-cost edges like Pet
}

/** Drawbacks */
export interface DrawbackDefinition {
  id: string;
  name: string;
  cipBonus: number;        // CIPs granted
  maxPurchases: number;    // 0 = unlimited
  description: string;
  variableBonus?: boolean; // e.g. Addiction (2/3/4/5), Phobia (1/2/3/5)
}

export interface CharacterDrawback {
  drawbackId: string;
  purchases: number;
  customBonus?: number; // for variable-bonus drawbacks
}

/** The Art — SAVE Disciplines */
export type ArtSchool = 'communicative' | 'incorporeal' | 'protective' | 'restorative';

export interface DisciplineDefinition {
  id: string;
  name: string;
  school: ArtSchool;
  description: string;
  wpCost: string;        // e.g. "1D10 WPR"
  rollReq: string;       // e.g. "G", "Spec", "—"
  range: string;
}

export interface CharacterDiscipline {
  disciplineId: string;
  level: SkillLevel;
}

/** Companion Spells */
export interface SpellCause {
  ritualDuration: number;    // potency 1-10
  materialsCost: number;     // potency 1-10
  assistants: number;        // potency 1-10
  subsidiaryActivity: number; // potency 1-10
}

export interface SpellEffect {
  range: number;         // potency 1-10
  duration: number;      // potency 1-10
  areaOfEffect: number;  // potency 1-10
  fatigue: number;       // potency 1-10
  endResultId: string;
  endResultPotency: number;
}

export interface Spell {
  id: string;
  name: string;
  causes: SpellCause;
  effects: SpellEffect;
}

/** Psionics */
export interface PsionicDefinition {
  id: string;
  name: string;
  cost: number;      // CIP cost (flat)
  leveled: boolean;  // true = S/T/M (4/6/8), false = flat 6
  description: string;
}

export interface CharacterPsionic {
  psionicId: string;
  level?: SkillLevel; // only for leveled disciplines
}

/** Equipment */
export interface EquipmentItem {
  id: string;
  name: string;
  notes: string;
}

/** Background */
export interface Background {
  name: string;
  age: number;
  height: string;
  weight: string;
  education: string;
  profession: string;
  socialStatus: string;
  personalHistory: string;
  handedness: 'right' | 'left' | 'ambidextrous';
}

/** CIP budget tier */
export type CipBudget = 85 | 100 | 125;

/** Full character */
export interface Character {
  id: string;
  name: string;
  background: Background;
  abilities: Abilities;
  currentStamina: number;
  currentWillpower: number;
  skills: CharacterSkill[];
  skillSystem: SkillSystem;
  edges: CharacterEdge[];
  drawbacks: CharacterDrawback[];
  disciplines: CharacterDiscipline[];
  spells: Spell[];
  psionicDisciplines: CharacterPsionic[];
  wounds: boolean[];
  equipment: EquipmentItem[];
  luckPoints: number;
  cipBudget: CipBudget;
  notes: string;
  createdAt: number;
  updatedAt: number;
}
