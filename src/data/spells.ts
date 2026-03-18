export interface EndResultDefinition {
  id: string;
  name: string;
  type: 'general' | 'specific';
  potency: number;
  description: string;
}

// ─── CAUSE POTENCY TABLES ──────────────────────────────────────────

export const ritualDurationTable: Record<number, string> = {
  1: 'None/Immediate',
  2: '15 minutes',
  3: '1 hour',
  4: '12 hours',
  5: '1 day',
  6: '1 week',
  7: '1 month',
  8: '1 year',
  9: '1 decade',
  10: 'A lifetime (70+ years)',
};

export const materialsCostTable: Record<number, string> = {
  1: 'None',
  2: '$10',
  3: '$100',
  4: '$1,000',
  5: '$10,000',
  6: '$100,000',
  7: '$1,000,000',
  8: '$10,000,000',
  9: '$100,000,000',
  10: '$1,000,000,000',
};

export const assistantsTable: Record<number, string> = {
  1: 'None',
  2: '1',
  3: '2',
  4: '5',
  5: '10',
  6: '50',
  7: '100',
  8: '500',
  9: '1,000',
  10: '10,000',
};

export const subsidiaryActivityTable: Record<number, string> = {
  1: 'None',
  2: 'General, +10',
  3: 'General',
  4: '-15, L result',
  5: 'M result',
  6: '-15, M result',
  7: 'H result',
  8: '-15, H result',
  9: 'C result',
  10: '-15, C result',
};

// ─── EFFECT POTENCY TABLES ─────────────────────────────────────────

export const rangeTable: Record<number, string> = {
  1: 'Same Room',
  2: 'Same City Block',
  3: 'Same City',
  4: 'Same County',
  5: 'Same State',
  6: 'Same Country',
  7: 'Same Continent',
  8: 'Same Hemisphere',
  9: 'Same Planet',
  10: 'Interstellar',
};

export const durationTable: Record<number, string> = {
  1: 'Immediate',
  2: '1 Minute',
  3: '15 Minutes',
  4: '1 Hour',
  5: '1 Day',
  6: '1 Month',
  7: '1 Year',
  8: '1 Decade',
  9: 'A Lifetime',
  10: 'Permanent',
};

export const areaOfEffectTable: Record<number, string> = {
  1: 'Single Individual',
  2: 'Small Room (2)',
  3: 'Large Room (5)',
  4: 'City Block (10)',
  5: 'City (50)',
  6: 'County (100)',
  7: 'State (1,000)',
  8: 'Country (10,000)',
  9: 'Continent (1,000,000)',
  10: 'Planet (1,000,000,000)',
};

export const fatigueTable: Record<number, string> = {
  1: '5D10 STA/WPR + 2D10 wounds',
  2: '4D10 + 1D5 wounds',
  3: '3D10 + 1 wound',
  4: '2D10',
  5: '1D10',
  6: '1D5',
  7: '2 points',
  8: '1 point',
  9: 'Confusion (dazed 5 rounds)',
  10: 'None',
};

// ─── END RESULTS ───────────────────────────────────────────────────

export const endResults: EndResultDefinition[] = [
  {
    id: 'animal-control',
    name: 'Animal Control',
    type: 'general',
    potency: 3,
    description: 'Control nearby animals',
  },
  {
    id: 'animate-dead',
    name: 'Animate Dead',
    type: 'general',
    potency: 7,
    description: 'Create skeletons/zombies',
  },
  {
    id: 'anti-magic',
    name: 'Anti-Magic',
    type: 'specific',
    potency: 5,
    description: 'Nullify other spells',
  },
  {
    id: 'armor-light',
    name: 'Armor (Light)',
    type: 'general',
    potency: 4,
    description: 'Lower Strike Rank of attacks by 2',
  },
  {
    id: 'armor-medium',
    name: 'Armor (Medium)',
    type: 'general',
    potency: 6,
    description: 'Lower Strike Rank of attacks by 4',
  },
  {
    id: 'armor-heavy',
    name: 'Armor (Heavy)',
    type: 'general',
    potency: 8,
    description: 'Lower Strike Rank of attacks by 6',
  },
  {
    id: 'bind-portal',
    name: 'Bind (Portal)',
    type: 'general',
    potency: 3,
    description: 'Secure a door or portal',
  },
  {
    id: 'bind-creature',
    name: 'Bind (Creature)',
    type: 'specific',
    potency: 8,
    description: 'Restrain a living creature',
  },
  {
    id: 'communication',
    name: 'Communication',
    type: 'general',
    potency: 3,
    description: 'Communicate over distance',
  },
  {
    id: 'control',
    name: 'Control',
    type: 'specific',
    potency: 6,
    description: 'Control another intelligent being',
  },
  {
    id: 'cure-1d10-sta',
    name: 'Cure (1D10 STA)',
    type: 'general',
    potency: 2,
    description: 'Heal 1D10 STA',
  },
  {
    id: 'cure-3d10-wounds',
    name: 'Cure (3D10 + 1D5 wounds)',
    type: 'general',
    potency: 3,
    description: 'Heal 3D10 STA + 1D5 wounds',
  },
  {
    id: 'cure-all-physical',
    name: 'Cure (All Physical)',
    type: 'general',
    potency: 4,
    description: 'Heal all physical damage',
  },
  {
    id: 'cure-all-ailments',
    name: 'Cure (All Ailments)',
    type: 'general',
    potency: 5,
    description: 'Heal all ailments',
  },
  {
    id: 'damage-1d5',
    name: 'Damage (1D5)',
    type: 'general',
    potency: 4,
    description: '1D5 STA damage',
  },
  {
    id: 'damage-1d10',
    name: 'Damage (1D10)',
    type: 'general',
    potency: 5,
    description: '1D10 STA damage',
  },
  {
    id: 'damage-3d10',
    name: 'Damage (3D10)',
    type: 'general',
    potency: 6,
    description: '3D10 STA damage',
  },
  {
    id: 'damage-4d10-1d10w',
    name: 'Damage (4D10 + 1D10 wounds)',
    type: 'general',
    potency: 7,
    description: '4D10 STA + 1D10 wound damage',
  },
  {
    id: 'damage-5d10-2d10w',
    name: 'Damage (5D10 + 2D10 wounds)',
    type: 'general',
    potency: 8,
    description: '5D10 STA + 2D10 wound damage',
  },
  {
    id: 'darkness',
    name: 'Darkness',
    type: 'general',
    potency: 3,
    description: 'Blanket area in darkness',
  },
  {
    id: 'destroy-soft',
    name: 'Destroy (Soft Objects)',
    type: 'general',
    potency: 5,
    description: 'Destroy soft objects',
  },
  {
    id: 'destroy-hard',
    name: 'Destroy (Hard Objects)',
    type: 'general',
    potency: 6,
    description: 'Destroy hard objects',
  },
  {
    id: 'destroy-any',
    name: 'Destroy (Any Objects)',
    type: 'general',
    potency: 7,
    description: 'Destroy any objects',
  },
  {
    id: 'detect',
    name: 'Detect',
    type: 'general',
    potency: 3,
    description: 'Detect specified item/presence/quality',
  },
  {
    id: 'enchant-2d10',
    name: 'Enchant (+2D10)',
    type: 'general',
    potency: 3,
    description: 'Add 2D10 to attributes/skills',
  },
  {
    id: 'enchant-4d10',
    name: 'Enchant (+4D10)',
    type: 'general',
    potency: 4,
    description: 'Add 4D10 to attributes/skills',
  },
  {
    id: 'enchant-6d10',
    name: 'Enchant (+6D10)',
    type: 'general',
    potency: 5,
    description: 'Add 6D10 to attributes/skills',
  },
  {
    id: 'enchant-8d10',
    name: 'Enchant (+8D10)',
    type: 'general',
    potency: 6,
    description: 'Add 8D10 to attributes/skills',
  },
  {
    id: 'exorcism',
    name: 'Exorcism',
    type: 'specific',
    potency: 5,
    description: 'Free target from possession',
  },
  {
    id: 'extradimensional-travel',
    name: 'Extradimensional Travel',
    type: 'general',
    potency: 6,
    description: 'Travel to another plane',
  },
  {
    id: 'flight',
    name: 'Flight',
    type: 'general',
    potency: 4,
    description: 'Grant flight',
  },
  {
    id: 'free-portal',
    name: 'Free (Portal)',
    type: 'general',
    potency: 2,
    description: 'Open a Bound portal',
  },
  {
    id: 'free-creature',
    name: 'Free (Creature)',
    type: 'specific',
    potency: 7,
    description: 'Release a Bound creature',
  },
  {
    id: 'grow',
    name: 'Grow',
    type: 'general',
    potency: 6,
    description: 'Expand size',
  },
  {
    id: 'history',
    name: 'History',
    type: 'specific',
    potency: 2,
    description: 'Learn history of item/area',
  },
  {
    id: 'illusion',
    name: 'Illusion',
    type: 'specific',
    potency: 6,
    description: 'Alter appearance of reality',
  },
  {
    id: 'incorporeal-shift',
    name: 'Incorporeal Shift',
    type: 'general',
    potency: 3,
    description: 'Become incorporeal',
  },
  {
    id: 'invisibility',
    name: 'Invisibility',
    type: 'general',
    potency: 3,
    description: 'Become invisible',
  },
  {
    id: 'item',
    name: 'Item',
    type: 'general',
    potency: 3,
    description: 'Bind spell effects into a physical item',
  },
  {
    id: 'longevity',
    name: 'Longevity',
    type: 'general',
    potency: 4,
    description: 'Prevent aging',
  },
  {
    id: 'magic-crystal-thin',
    name: 'Magic Crystal (Thin)',
    type: 'general',
    potency: 3,
    description: 'Create thin ice/crystal barrier',
  },
  {
    id: 'magic-crystal-thick',
    name: 'Magic Crystal (Thick)',
    type: 'general',
    potency: 4,
    description: 'Create thick ice/crystal barrier',
  },
  {
    id: 'magic-flame',
    name: 'Magic Flame',
    type: 'general',
    potency: 5,
    description: 'Blanket area in flames',
  },
  {
    id: 'mind-reading',
    name: 'Mind Reading',
    type: 'specific',
    potency: 7,
    description: 'Read thoughts/emotions',
  },
  {
    id: 'mystic-barrier',
    name: 'Mystic Barrier',
    type: 'general',
    potency: 6,
    description: 'Create impenetrable barrier',
  },
  {
    id: 'plant-growth',
    name: 'Plant Growth',
    type: 'general',
    potency: 4,
    description: 'Expand plant life',
  },
  {
    id: 'possession',
    name: 'Possession',
    type: 'specific',
    potency: 6,
    description: 'Possess another being',
  },
  {
    id: 'remote-sensing',
    name: 'Remote Sensing',
    type: 'general',
    potency: 5,
    description: 'View distant region with all senses',
  },
  {
    id: 'shrink',
    name: 'Shrink',
    type: 'general',
    potency: 6,
    description: 'Reduce size',
  },
  {
    id: 'summon',
    name: 'Summon',
    type: 'general',
    potency: 6,
    description: 'Transport creatures to caster',
  },
  {
    id: 'teleport',
    name: 'Teleport',
    type: 'general',
    potency: 7,
    description: 'Transport to remote destination',
  },
  {
    id: 'transform',
    name: 'Transform',
    type: 'general',
    potency: 7,
    description: 'Transform creature/item into another',
  },
  {
    id: 'willpower-attack-1d5',
    name: 'Willpower Attack (1D5)',
    type: 'general',
    potency: 4,
    description: '1D5 WPR damage',
  },
  {
    id: 'willpower-attack-1d10',
    name: 'Willpower Attack (1D10)',
    type: 'general',
    potency: 5,
    description: '1D10 WPR damage',
  },
  {
    id: 'willpower-attack-3d10',
    name: 'Willpower Attack (3D10)',
    type: 'general',
    potency: 6,
    description: '3D10 WPR damage',
  },
  {
    id: 'willpower-attack-4d10',
    name: 'Willpower Attack (4D10)',
    type: 'general',
    potency: 7,
    description: '4D10 WPR damage',
  },
  {
    id: 'willpower-attack-5d10',
    name: 'Willpower Attack (5D10)',
    type: 'general',
    potency: 8,
    description: '5D10 WPR damage',
  },
];

// ─── CASTING CHECK MODIFIER ────────────────────────────────────────

/**
 * Compute the casting check modifier for a Companion spell.
 *
 * @param totalCausePotency - Sum of all cause potency values (Pc)
 * @param totalEffectPotency - Sum of all effect potency values (Pe, treated as negative)
 * @param magicFactor - Setting magic factor 1-10 (Pm)
 * @returns The modifier to apply to the casting check
 */
export function computeCastingModifier(
  totalCausePotency: number,
  totalEffectPotency: number,
  magicFactor: number,
): number {
  const sum = totalCausePotency - totalEffectPotency + magicFactor;
  if (sum > 0) return 0;
  if (sum >= -2) return -5;
  if (sum >= -5) return -15;
  if (sum >= -10) return -25;
  if (sum >= -15) return -40;
  if (sum >= -20) return -55;
  if (sum >= -25) return -70;
  return -90;
}
