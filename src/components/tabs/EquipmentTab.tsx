import { Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import { downloadCharacter } from '../../utils/export-import';
import styles from '../shared/shared.module.css';

export function EquipmentTab() {
  const character = useActiveCharacter();
  const addEquipment = useCharacterStore(s => s.addEquipment);
  const updateEquipment = useCharacterStore(s => s.updateEquipment);
  const removeEquipment = useCharacterStore(s => s.removeEquipment);
  const updateCipBudget = useCharacterStore(s => s.updateCipBudget);

  if (!character) return null;

  const handleAdd = () => {
    addEquipment({ id: nanoid(), name: '', notes: '' });
  };

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Equipment</h2>

      {character.equipment.length === 0 && (
        <p className={styles.tabDescription}>No equipment added yet.</p>
      )}

      {character.equipment.map(item => (
        <div key={item.id} className={styles.equipmentRow}>
          <input
            className={`${styles.formInput} ${styles.equipmentName}`}
            value={item.name}
            onChange={e => updateEquipment(item.id, { name: e.target.value })}
            placeholder="Item name..."
          />
          <input
            className={`${styles.formInput} ${styles.equipmentNotes}`}
            value={item.notes}
            onChange={e => updateEquipment(item.id, { notes: e.target.value })}
            placeholder="Notes (weight, special properties, etc.)"
          />
          <button className={styles.removeButton} onClick={() => removeEquipment(item.id)}>
            <X size={14} />
          </button>
        </div>
      ))}

      <button className={styles.addButton} onClick={handleAdd} style={{ marginTop: 16 }}>
        <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        Add Equipment
      </button>

      {/* Utilities section */}
      <div className={styles.categoryHeader} style={{ marginTop: 48 }}>Character Utilities</div>

      <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>CIP Budget</label>
          <div className={styles.toggleGroup}>
            {([85, 100, 125] as const).map(budget => (
              <button
                key={budget}
                className={`${styles.toggleOption} ${character.cipBudget === budget ? styles.toggleOptionActive : ''}`}
                onClick={() => updateCipBudget(budget)}
              >
                {budget}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Export</label>
          <button className={styles.addButton} onClick={() => downloadCharacter(character)}>
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
}
