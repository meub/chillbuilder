import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Character,
  CipBudget,
  AbilityKey,
  Background,
  Spell,
  EquipmentItem,
  SkillLevel,
  SkillSystem,
} from '../models/types';
import { createDefaultCharacter } from '../utils/character-factory';
import { computeWoundBoxes } from '../utils/derived';

interface CharacterStore {
  characters: Character[];
  activeCharacterId: string | null;

  // Character CRUD
  createCharacter: (budget?: CipBudget) => void;
  deleteCharacter: (id: string) => void;
  selectCharacter: (id: string | null) => void;
  importCharacter: (character: Character) => void;

  // Updaters (all auto-set updatedAt)
  updateAbility: (key: AbilityKey, value: number) => void;
  updateBackground: (updates: Partial<Background>) => void;
  updateName: (name: string) => void;
  updateCurrentStamina: (value: number) => void;
  updateCurrentWillpower: (value: number) => void;
  updateSkillSystem: (system: SkillSystem) => void;

  // Skills
  addSkill: (skillId: string, isBroad: boolean, level: SkillLevel) => void;
  updateSkillLevel: (skillId: string, level: SkillLevel) => void;
  removeSkill: (skillId: string) => void;

  // Edges
  addEdge: (edgeId: string, purchases?: number, customCost?: number) => void;
  updateEdge: (edgeId: string, purchases: number, customCost?: number) => void;
  removeEdge: (edgeId: string) => void;

  // Drawbacks
  addDrawback: (drawbackId: string, purchases?: number, customBonus?: number) => void;
  updateDrawback: (drawbackId: string, purchases: number, customBonus?: number) => void;
  removeDrawback: (drawbackId: string) => void;

  // Disciplines
  addDiscipline: (disciplineId: string, level: SkillLevel) => void;
  updateDisciplineLevel: (disciplineId: string, level: SkillLevel) => void;
  removeDiscipline: (disciplineId: string) => void;

  // Spells
  addSpell: (spell: Spell) => void;
  updateSpell: (spellId: string, spell: Spell) => void;
  removeSpell: (spellId: string) => void;

  // Psionics
  addPsionic: (psionicId: string, level?: SkillLevel) => void;
  updatePsionic: (psionicId: string, level?: SkillLevel) => void;
  removePsionic: (psionicId: string) => void;

  // Wounds
  toggleWound: (index: number) => void;
  setWoundCount: (count: number) => void;

  // Equipment
  addEquipment: (item: EquipmentItem) => void;
  updateEquipment: (itemId: string, updates: Partial<EquipmentItem>) => void;
  removeEquipment: (itemId: string) => void;

  // Misc
  updateLuckPoints: (value: number) => void;
  updateCipBudget: (budget: CipBudget) => void;
  updateNotes: (notes: string) => void;
}

function updateActive(state: CharacterStore, updater: (char: Character) => Partial<Character>): Partial<CharacterStore> {
  return {
    characters: state.characters.map(c =>
      c.id === state.activeCharacterId
        ? { ...c, ...updater(c), updatedAt: Date.now() }
        : c
    ),
  };
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      characters: [],
      activeCharacterId: null,

      createCharacter: (budget = 100) => {
        const char = createDefaultCharacter(budget);
        set(state => ({
          characters: [...state.characters, char],
          activeCharacterId: char.id,
        }));
      },

      deleteCharacter: (id) => set(state => ({
        characters: state.characters.filter(c => c.id !== id),
        activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId,
      })),

      selectCharacter: (id) => set({ activeCharacterId: id }),

      importCharacter: (character) => set(state => {
        const exists = state.characters.some(c => c.id === character.id);
        return {
          characters: exists
            ? state.characters.map(c => c.id === character.id ? character : c)
            : [...state.characters, character],
          activeCharacterId: character.id,
        };
      }),

      updateAbility: (key, value) => set(state => updateActive(state, (c) => {
        const newAbilities = {
          ...c.abilities,
          [key]: Math.max(10, Math.min(90, value)),
        };
        const newWoundCount = computeWoundBoxes(newAbilities);
        const wounds = Array(newWoundCount).fill(false);
        c.wounds.forEach((w, i) => { if (i < newWoundCount) wounds[i] = w; });
        return { abilities: newAbilities, wounds };
      })),

      updateBackground: (updates) => set(state => updateActive(state, (c) => ({
        background: { ...c.background, ...updates },
      }))),

      updateName: (name) => set(state => updateActive(state, () => ({ name }))),

      updateCurrentStamina: (value) => set(state => updateActive(state, () => ({ currentStamina: Math.max(0, value) }))),

      updateCurrentWillpower: (value) => set(state => updateActive(state, () => ({ currentWillpower: Math.max(0, value) }))),

      updateSkillSystem: (system) => set(state => updateActive(state, (c) => {
        // When switching to/from mixed, keep skills if possible
        // Only clear if going broad<->narrow (incompatible)
        const prev = c.skillSystem;
        const clearNeeded =
          (prev === 'broad' && system === 'narrow') ||
          (prev === 'narrow' && system === 'broad');
        return {
          skillSystem: system,
          skills: clearNeeded ? [] : c.skills,
        };
      })),

      addSkill: (skillId, isBroad, level) => set(state => updateActive(state, (c) => ({
        skills: [...c.skills, { skillId, isBroad, level }],
      }))),

      updateSkillLevel: (skillId, level) => set(state => updateActive(state, (c) => ({
        skills: c.skills.map(s => s.skillId === skillId ? { ...s, level } : s),
      }))),

      removeSkill: (skillId) => set(state => updateActive(state, (c) => ({
        skills: c.skills.filter(s => s.skillId !== skillId),
      }))),

      addEdge: (edgeId, purchases = 1, customCost) => set(state => updateActive(state, (c) => ({
        edges: [...c.edges, { edgeId, purchases, customCost }],
      }))),

      updateEdge: (edgeId, purchases, customCost) => set(state => updateActive(state, (c) => ({
        edges: c.edges.map(e => e.edgeId === edgeId ? { ...e, purchases, customCost } : e),
      }))),

      removeEdge: (edgeId) => set(state => updateActive(state, (c) => ({
        edges: c.edges.filter(e => e.edgeId !== edgeId),
      }))),

      addDrawback: (drawbackId, purchases = 1, customBonus) => set(state => updateActive(state, (c) => ({
        drawbacks: [...c.drawbacks, { drawbackId, purchases, customBonus }],
      }))),

      updateDrawback: (drawbackId, purchases, customBonus) => set(state => updateActive(state, (c) => ({
        drawbacks: c.drawbacks.map(d => d.drawbackId === drawbackId ? { ...d, purchases, customBonus } : d),
      }))),

      removeDrawback: (drawbackId) => set(state => updateActive(state, (c) => ({
        drawbacks: c.drawbacks.filter(d => d.drawbackId !== drawbackId),
      }))),

      addDiscipline: (disciplineId, level) => set(state => updateActive(state, (c) => ({
        disciplines: [...c.disciplines, { disciplineId, level }],
      }))),

      updateDisciplineLevel: (disciplineId, level) => set(state => updateActive(state, (c) => ({
        disciplines: c.disciplines.map(d => d.disciplineId === disciplineId ? { ...d, level } : d),
      }))),

      removeDiscipline: (disciplineId) => set(state => updateActive(state, (c) => ({
        disciplines: c.disciplines.filter(d => d.disciplineId !== disciplineId),
      }))),

      addSpell: (spell) => set(state => updateActive(state, (c) => ({
        spells: [...c.spells, spell],
      }))),

      updateSpell: (spellId, spell) => set(state => updateActive(state, (c) => ({
        spells: c.spells.map(s => s.id === spellId ? spell : s),
      }))),

      removeSpell: (spellId) => set(state => updateActive(state, (c) => ({
        spells: c.spells.filter(s => s.id !== spellId),
      }))),

      addPsionic: (psionicId, level) => set(state => updateActive(state, (c) => ({
        psionicDisciplines: [...c.psionicDisciplines, { psionicId, level }],
      }))),

      updatePsionic: (psionicId, level) => set(state => updateActive(state, (c) => ({
        psionicDisciplines: c.psionicDisciplines.map(p => p.psionicId === psionicId ? { ...p, level } : p),
      }))),

      removePsionic: (psionicId) => set(state => updateActive(state, (c) => ({
        psionicDisciplines: c.psionicDisciplines.filter(p => p.psionicId !== psionicId),
      }))),

      toggleWound: (index) => set(state => updateActive(state, (c) => ({
        wounds: c.wounds.map((w, i) => i === index ? !w : w),
      }))),

      setWoundCount: (count) => set(state => updateActive(state, (c) => {
        const wounds = Array(count).fill(false);
        // Preserve existing wound states
        c.wounds.forEach((w, i) => {
          if (i < count) wounds[i] = w;
        });
        return { wounds };
      })),

      addEquipment: (item) => set(state => updateActive(state, (c) => ({
        equipment: [...c.equipment, item],
      }))),

      updateEquipment: (itemId, updates) => set(state => updateActive(state, (c) => ({
        equipment: c.equipment.map(e => e.id === itemId ? { ...e, ...updates } : e),
      }))),

      removeEquipment: (itemId) => set(state => updateActive(state, (c) => ({
        equipment: c.equipment.filter(e => e.id !== itemId),
      }))),

      updateLuckPoints: (value) => set(state => updateActive(state, () => ({ luckPoints: Math.max(0, value) }))),

      updateCipBudget: (budget) => set(state => updateActive(state, () => ({ cipBudget: budget }))),

      updateNotes: (notes) => set(state => updateActive(state, () => ({ notes }))),
    }),
    {
      name: 'chillbuilder-characters',
    }
  )
);
