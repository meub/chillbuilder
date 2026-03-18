import type { Abilities, Character } from '../models/types';

export function computeMovement(abilities: Abilities): number {
  return Math.floor(abilities.AGL / 3) + 20;
}

export function computeSprintingSpeed(abilities: Abilities): number {
  return abilities.AGL + 50;
}

export function computeUnskilledMelee(abilities: Abilities): number {
  return Math.floor((abilities.AGL + abilities.STR) / 2) + 4;
}

export function computeSensingTheUnknown(abilities: Abilities, hasEvilSense: boolean): number {
  const divisor = hasEvilSense ? 4 : 5;
  return Math.floor(abilities.PCN / divisor) + 20;
}

export function computeWoundBoxes(abilities: Abilities): number {
  return Math.floor((abilities.STR + abilities.STA) / 2 / 10);
}

export interface DerivedStats {
  movement: number;
  sprintingSpeed: number;
  unskilledMelee: number;
  sensingTheUnknown: number;
  woundBoxes: number;
  luckPoints: number;
}

export function computeAllDerived(character: Character): DerivedStats {
  const hasEvilSense = character.edges.some(e => e.edgeId === 'evil-sense');
  return {
    movement: computeMovement(character.abilities),
    sprintingSpeed: computeSprintingSpeed(character.abilities),
    unskilledMelee: computeUnskilledMelee(character.abilities),
    sensingTheUnknown: computeSensingTheUnknown(character.abilities, hasEvilSense),
    woundBoxes: computeWoundBoxes(character.abilities),
    luckPoints: character.abilities.LCK,
  };
}
