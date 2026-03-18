import { useCharacterStore } from '../store/useCharacterStore';
import type { Character } from '../models/types';

export function useActiveCharacter(): Character | null {
  return useCharacterStore(state =>
    state.characters.find(c => c.id === state.activeCharacterId) ?? null
  );
}
