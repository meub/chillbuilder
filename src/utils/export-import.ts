import type { Character } from '../models/types';

export function exportCharacter(character: Character): string {
  return JSON.stringify(character, null, 2);
}

export function downloadCharacter(character: Character): void {
  const json = exportCharacter(character);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || 'character'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importCharacter(json: string): Character {
  const parsed = JSON.parse(json);
  // Basic shape validation
  if (!parsed.id || !parsed.abilities || !parsed.background) {
    throw new Error('Invalid character file: missing required fields');
  }
  return parsed as Character;
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
