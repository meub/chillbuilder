import type { PsionicDefinition } from '../models/types';

export const psionicDisciplines: PsionicDefinition[] = [
  {
    id: 'change-temperature',
    name: 'Change Temperature',
    cost: 6,
    leveled: false,
    description: 'Alter temperature in the surrounding area',
  },
  {
    id: 'psionic-clairvoyant-prescient-dream',
    name: 'Clairvoyant/Prescient Dream',
    cost: 4,
    leveled: true,
    description: 'Receive prophetic or clairvoyant dreams (S: 4 CIP, T: 6 CIP, M: 8 CIP)',
  },
  {
    id: 'psionic-empathy',
    name: 'Empathy',
    cost: 6,
    leveled: false,
    description: 'Sense and read the emotions of others',
  },
  {
    id: 'psionic-restore-stamina',
    name: 'Restore Stamina',
    cost: 4,
    leveled: true,
    description: 'Psionically heal STA damage (S: 4 CIP, T: 6 CIP, M: 8 CIP)',
  },
  {
    id: 'psionic-restore-willpower',
    name: 'Restore Willpower',
    cost: 4,
    leveled: true,
    description: 'Psionically restore WPR (S: 4 CIP, T: 6 CIP, M: 8 CIP)',
  },
  {
    id: 'telekinesis',
    name: 'Telekinesis',
    cost: 6,
    leveled: false,
    description: 'Move objects with the power of the mind',
  },
  {
    id: 'telepathy',
    name: 'Telepathy',
    cost: 6,
    leveled: false,
    description: 'Read thoughts and communicate mentally',
  },
  {
    id: 'white-heat',
    name: 'White Heat',
    cost: 6,
    leveled: false,
    description: 'Generate intense heat through psionic focus',
  },
];
