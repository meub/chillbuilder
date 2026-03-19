import { useRef } from 'react';
import { Plus, Trash2, Upload, Copy } from 'lucide-react';
import { useCharacterStore } from '../../store/useCharacterStore';
import { importCharacter, readFileAsText } from '../../utils/export-import';
import { computeAbilitiesCip } from '../../utils/cip';
import type { CipBudget } from '../../models/types';
import styles from './CharacterList.module.css';

export function CharacterList() {
  const characters = useCharacterStore(s => s.characters);
  const selectCharacter = useCharacterStore(s => s.selectCharacter);
  const createCharacter = useCharacterStore(s => s.createCharacter);
  const deleteCharacter = useCharacterStore(s => s.deleteCharacter);
  const duplicateCharacter = useCharacterStore(s => s.duplicateCharacter);
  const importChar = useCharacterStore(s => s.importCharacter);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = (budget: CipBudget) => {
    createCharacter(budget);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this character? This cannot be undone.')) {
      deleteCharacter(id);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const character = importCharacter(text);
      importChar(character);
    } catch {
      alert('Failed to import character. Please check the file format.');
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Chillbuilder</h1>
        <p className={styles.subtitle}>Chill 2nd Edition Character Creator</p>
      </div>

      <div className={styles.list}>
        {characters.length === 0 && (
          <div className={styles.emptyState}>No characters yet. Create one below.</div>
        )}

        {characters.map(char => (
          <div
            key={char.id}
            className={styles.card}
            onClick={() => selectCharacter(char.id)}
          >
            <div className={styles.cardInfo}>
              <div className={styles.cardName}>{char.name || 'Unnamed'}</div>
              <div className={styles.cardMeta}>
                {char.background.profession || 'No profession'} — {char.skillSystem} skills
                — {char.skills.length} skill{char.skills.length !== 1 ? 's' : ''}
                — Abilities: {computeAbilitiesCip(char.abilities)} CIP
              </div>
            </div>
            <span className={styles.cardBudget}>{char.cipBudget} CIP</span>
            <button
              className={styles.deleteButton}
              onClick={(e) => { e.stopPropagation(); duplicateCharacter(char.id); }}
              title="Duplicate character"
            >
              <Copy size={16} />
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => handleDelete(e, char.id)}
              title="Delete character"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.createRow}>
        <button className={styles.createButton} onClick={() => handleCreate(100)}>
          <Plus size={16} />
          New Character
        </button>
      </div>

      <div className={styles.importRow}>
        <button className={styles.importButton} onClick={() => fileInputRef.current?.click()}>
          <Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
          Import Character
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
