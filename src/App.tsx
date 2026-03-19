import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useCharacterStore } from './store/useCharacterStore';
import { AppShell } from './components/layout/AppShell';
import { CharacterList } from './components/character-list/CharacterList';

export default function App() {
  const activeCharacterId = useCharacterStore(s => s.activeCharacterId);
  return (
    <RadixTooltip.Provider delayDuration={300}>
      {activeCharacterId ? <AppShell /> : <CharacterList />}
    </RadixTooltip.Provider>
  );
}
