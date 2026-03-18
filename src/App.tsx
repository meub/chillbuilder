import { useCharacterStore } from './store/useCharacterStore';
import { AppShell } from './components/layout/AppShell';
import { CharacterList } from './components/character-list/CharacterList';

export default function App() {
  const activeCharacterId = useCharacterStore(s => s.activeCharacterId);
  return activeCharacterId ? <AppShell /> : <CharacterList />;
}
