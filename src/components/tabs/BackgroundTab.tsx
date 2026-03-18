import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import styles from '../shared/shared.module.css';

export function BackgroundTab() {
  const character = useActiveCharacter();
  const updateName = useCharacterStore(s => s.updateName);
  const updateBackground = useCharacterStore(s => s.updateBackground);
  const updateNotes = useCharacterStore(s => s.updateNotes);

  if (!character) return null;

  const bg = character.background;

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Background</h2>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Character Name</label>
        <input
          className={styles.formInput}
          value={character.name}
          onChange={e => updateName(e.target.value)}
          placeholder="Enter character name..."
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Age</label>
          <input
            className={styles.formInput}
            type="number"
            value={bg.age}
            onChange={e => updateBackground({ age: Number(e.target.value) })}
            min={12}
            max={85}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Handedness</label>
          <select
            className={styles.formSelect}
            value={bg.handedness}
            onChange={e => updateBackground({ handedness: e.target.value as 'right' | 'left' | 'ambidextrous' })}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
            <option value="ambidextrous">Ambidextrous</option>
          </select>
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Height</label>
          <input
            className={styles.formInput}
            value={bg.height}
            onChange={e => updateBackground({ height: e.target.value })}
            placeholder={`e.g., 5'10"`}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Weight</label>
          <input
            className={styles.formInput}
            value={bg.weight}
            onChange={e => updateBackground({ weight: e.target.value })}
            placeholder="e.g., 165 lbs"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Education</label>
          <input
            className={styles.formInput}
            value={bg.education}
            onChange={e => updateBackground({ education: e.target.value })}
            placeholder="e.g., College graduate"
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Profession</label>
          <input
            className={styles.formInput}
            value={bg.profession}
            onChange={e => updateBackground({ profession: e.target.value })}
            placeholder="e.g., Private Investigator"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Social / Economic Status</label>
        <input
          className={styles.formInput}
          value={bg.socialStatus}
          onChange={e => updateBackground({ socialStatus: e.target.value })}
          placeholder="e.g., Middle class"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Personal History</label>
        <textarea
          className={styles.formTextarea}
          value={bg.personalHistory}
          onChange={e => updateBackground({ personalHistory: e.target.value })}
          placeholder="Describe the character's backstory, motivations, and personality..."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Notes</label>
        <textarea
          className={styles.formTextarea}
          value={character.notes}
          onChange={e => updateNotes(e.target.value)}
          placeholder="Additional notes..."
        />
      </div>
    </div>
  );
}
