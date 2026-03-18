import type { BroadSkillDefinition } from '../models/types';

export const broadSkills: BroadSkillDefinition[] = [
  { id: 'art', name: 'Art', formula: ['PCN', 'PER'], costs: [2, 6, 14], encompasses: ['acting', 'dance', 'painting', 'sculpting', 'creative-writing', 'journalism', 'filmmaking', 'musicianship', 'singing', 'poetry', 'calligraphy'] },
  { id: 'athletics', name: 'Athletics', formula: ['PCN', 'WPR'], costs: [2, 6, 14], encompasses: ['acrobatics', 'running', 'sports', 'swimming', 'skating', 'climbing'] },
  { id: 'business', name: 'Business', formula: ['LCK', 'PCN', 'PER'], costs: [2, 6, 14], encompasses: ['accounting', 'administration'] },
  { id: 'charisma', name: 'Charisma', formula: ['PER'], costs: [3, 9, 21], encompasses: ['charm', 'intimidation', 'persuasion'] },
  { id: 'detective', name: 'Detective', formula: ['LCK', 'PER', 'STA'], costs: [3, 9, 21], encompasses: ['investigation', 'law', 'police-procedures'] },
  { id: 'exotic-weapons', name: 'Exotic Weapons', formula: ['AGL', 'DEX', 'STR'], costs: [2, 6, 14], encompasses: ['bola', 'boomerang', 'lasso', 'whip'] },
  { id: 'medicine', name: 'Medicine', formula: ['DEX', 'PCN'], costs: [5, 15, 35], encompasses: ['first-aid', 'psychiatry', 'surgery', 'general-practice', 'veterinary-medicine', 'acupuncture', 'chiropractic'] },
  { id: 'melee-combat', name: 'Melee Combat', formula: ['AGL', 'STR'], costs: [2, 6, 14], encompasses: ['blackjack-club-mace', 'boxing', 'dagger-knife', 'machete', 'polearm', 'rapier', 'spear', 'sword-one-handed', 'sword-two-handed', 'wrestling'] },
  { id: 'military-science', name: 'Military Science', formula: ['DEX', 'PCN'], costs: [2, 6, 14], encompasses: ['cartography-geography', 'explosives', 'heavy-weapons'] },
  { id: 'missile-weapons', name: 'Missile Weapons', formula: ['DEX', 'PCN'], costs: [2, 6, 14], encompasses: ['axe-tomahawk-thrown', 'bow-long-short', 'spear-thrown'] },
  { id: 'nature-lore', name: 'Nature Lore', formula: ['LCK', 'PCN', 'STA'], costs: [3, 9, 21], encompasses: ['animal-training', 'beast-riding', 'survival', 'tracking', 'hunting', 'fishing', 'farming'] },
  { id: 'scholar', name: 'Scholar', formula: ['PCN'], costs: [6, 18, 42], encompasses: ['anthropology-archaeology', 'antiques', 'history', 'legend-lore', 'occult-lore', 'ancient-language', 'contemporary-language', 'comparative-religion'] },
  { id: 'science', name: 'Science', formula: ['PCN'], costs: [4, 12, 28], encompasses: ['biology', 'botany', 'chemistry', 'computer', 'electronics', 'forensics', 'geology', 'mechanics', 'physics', 'zoology'] },
  { id: 'thievery', name: 'Thievery', formula: ['DEX', 'PCN'], costs: [3, 9, 21], encompasses: ['filching', 'forgery-graphology', 'lockpicking', 'stealth'] },
  { id: 'vehicles', name: 'Vehicles', formula: ['DEX', 'PCN'], costs: [2, 6, 14], encompasses: ['driving', 'seafaring', 'spacecraft', 'bicycle'] },
];
