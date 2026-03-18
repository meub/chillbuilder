import type { DisciplineDefinition, ArtSchool } from '../models/types';

export const schoolPrerequisites: Record<ArtSchool, { ability: string; minimum: number }> = {
  communicative: { ability: 'PER', minimum: 60 },
  incorporeal: { ability: 'STA', minimum: 60 },
  protective: { ability: 'LCK', minimum: 60 },
  restorative: { ability: 'STR', minimum: 60 },
};

export const schoolScoreAbilities: Record<ArtSchool, [string, string]> = {
  communicative: ['PCN', 'PER'],
  incorporeal: ['PCN', 'PER'],
  protective: ['PCN', 'LCK'],
  restorative: ['PCN', 'STR'],
};

export const disciplines: DisciplineDefinition[] = [
  // ─── COMMUNICATIVE SCHOOL ──────────────────────────────────────────
  {
    id: 'clairvoyant-prescient-dream',
    name: 'Clairvoyant/Prescient Dream',
    school: 'communicative',
    description: 'See dreams about current situation',
    wpCost: '1D10 WPR',
    rollReq: '—',
    range: 'Self',
  },
  {
    id: 'sensing-the-unknown',
    name: 'Sensing the Unknown',
    school: 'communicative',
    description: 'Sense presence of the Unknown',
    wpCost: 'N/A',
    rollReq: 'PCN-based',
    range: 'Area',
  },
  {
    id: 'telepathic-empathy',
    name: 'Telepathic Empathy',
    school: 'communicative',
    description: 'Read emotions of another',
    wpCost: '1D10 WPR',
    rollReq: 'G',
    range: 'Sight',
  },
  {
    id: 'telepathic-sending',
    name: 'Telepathic Sending',
    school: 'communicative',
    description: 'Send mental message',
    wpCost: '2D10 WPR',
    rollReq: 'G',
    range: '1 Mind',
  },

  // ─── INCORPOREAL SCHOOL ────────────────────────────────────────────
  {
    id: 'incorporeal-attack',
    name: 'Incorporeal Attack',
    school: 'incorporeal',
    description: 'Attack incorporeal creatures',
    wpCost: '1D10 WPR',
    rollReq: 'Spec',
    range: 'Area',
  },
  {
    id: 'leave-the-body',
    name: 'Leave the Body',
    school: 'incorporeal',
    description: 'Astral projection',
    wpCost: '1D10 + 1D10 WPR',
    rollReq: 'G',
    range: 'Self',
  },
  {
    id: 'seance',
    name: 'Seance',
    school: 'incorporeal',
    description: 'Contact the dead',
    wpCost: '1D10 WPR',
    rollReq: '—',
    range: 'Touch',
  },
  {
    id: 'mental-shield',
    name: 'Mental Shield',
    school: 'incorporeal',
    description: 'Shield from Evil Way disciplines',
    wpCost: '—',
    rollReq: '—',
    range: 'Sight',
  },

  // ─── PROTECTIVE SCHOOL ─────────────────────────────────────────────
  {
    id: 'raise-perception',
    name: 'Raise Perception',
    school: 'protective',
    description: 'Boost Perception of others',
    wpCost: '2D10 WPR',
    rollReq: 'G',
    range: 'Sight',
  },
  {
    id: 'sphere-of-protection',
    name: 'Sphere of Protection',
    school: 'protective',
    description: 'Protective barrier',
    wpCost: '2D10 WPR',
    rollReq: 'G',
    range: '10-20ft radius',
  },

  // ─── RESTORATIVE SCHOOL ────────────────────────────────────────────
  {
    id: 'feat-of-strength',
    name: 'Feat of Strength',
    school: 'restorative',
    description: 'Superhuman strength temporarily',
    wpCost: '1D10 WPR',
    rollReq: 'G',
    range: 'Self',
  },
  {
    id: 'restore-stamina',
    name: 'Restore Stamina',
    school: 'restorative',
    description: 'Heal STA damage',
    wpCost: '1D10 WPR',
    rollReq: 'G',
    range: 'Touch',
  },
  {
    id: 'restore-willpower',
    name: 'Restore Willpower',
    school: 'restorative',
    description: 'Restore WPR',
    wpCost: '1D10 WPR',
    rollReq: 'G',
    range: 'Touch',
  },
];
