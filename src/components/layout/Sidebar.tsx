import { ArrowLeft, Pencil, Printer } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCipCalculation } from '../../hooks/useCipCalculation';
import { useCharacterStore } from '../../store/useCharacterStore';
import { computeAllDerived } from '../../utils/derived';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const character = useActiveCharacter();
  const cip = useCipCalculation(character);
  const selectCharacter = useCharacterStore(s => s.selectCharacter);

  const updateName = useCharacterStore(s => s.updateName);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (!character) return null;

  const derived = computeAllDerived(character);
  const remaining = character.cipBudget - cip.total;
  const budgetClass = remaining < 0 ? styles.budgetOver : remaining < 5 ? styles.budgetWarn : styles.budgetOk;

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.logo}>Chillbuilder</div>
        <div className={styles.logoSub}>Chill 2nd Edition</div>
      </div>

      <button className={styles.backButton} onClick={() => selectCharacter(null)}>
        <ArrowLeft size={16} />
        Character List
      </button>

      <div className={styles.divider} />

      {editing ? (
        <input
          ref={inputRef}
          className={styles.characterNameInput}
          value={character.name}
          onChange={e => updateName(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={e => { if (e.key === 'Enter') setEditing(false); }}
          placeholder="Character name..."
        />
      ) : (
        <button className={styles.characterNameButton} onClick={() => setEditing(true)}>
          <span className={styles.characterName}>{character.name || 'Unnamed'}</span>
          <Pencil size={14} className={styles.editIcon} />
        </button>
      )}

      <div className={styles.section}>
        <div className={styles.sectionTitle}>CIP Budget</div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Abilities</span>
          <span className={styles.budgetValue}>{cip.abilities}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Skills</span>
          <span className={styles.budgetValue}>{cip.skills}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Edges</span>
          <span className={styles.budgetValue}>{cip.edges}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Drawbacks</span>
          <span className={styles.budgetValue}>−{cip.drawbacks}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Disciplines</span>
          <span className={styles.budgetValue}>{cip.disciplines}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Spells</span>
          <span className={styles.budgetValue}>{cip.spells}</span>
        </div>
        <div className={styles.budgetRow}>
          <span className={styles.budgetLabel}>Psionics</span>
          <span className={styles.budgetValue}>{cip.psionics}</span>
        </div>
        <div className={styles.budgetTotal}>
          <span className={styles.budgetTotalLabel}>Spent / Budget</span>
          <span className={budgetClass}>{cip.total} / {character.cipBudget}</span>
        </div>
        {remaining < 0 && (
          <div className={styles.budgetBannerOver}>
            {Math.abs(remaining)} CIP over budget
          </div>
        )}
        {remaining > 0 && remaining <= 5 && (
          <div className={styles.budgetBannerWarn}>
            {remaining} CIP remaining
          </div>
        )}
        {remaining === 0 && (
          <div className={styles.budgetBannerExact}>
            Budget spent exactly
          </div>
        )}
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Quick Stats</div>
        <div className={styles.statRow}>
          <span>Current STA</span>
          <span className={styles.statValue}>{character.currentStamina}</span>
        </div>
        <div className={styles.statRow}>
          <span>Current WPR</span>
          <span className={styles.statValue}>{character.currentWillpower}</span>
        </div>
        <div className={styles.statRow}>
          <span>Movement</span>
          <span className={styles.statValue}>{derived.movement}</span>
        </div>
        <div className={styles.statRow}>
          <span>Unskilled Melee</span>
          <span className={styles.statValue}>{derived.unskilledMelee}</span>
        </div>
        <div className={styles.statRow}>
          <span>Sensing</span>
          <span className={styles.statValue}>{derived.sensingTheUnknown}</span>
        </div>
        <div className={styles.statRow}>
          <span>Wound Boxes</span>
          <span className={styles.statValue}>{derived.woundBoxes}</span>
        </div>
      </div>

      <div className={styles.divider} />

      <button className={styles.printButton} onClick={() => window.print()}>
        <Printer size={14} />
        Print Character Sheet
      </button>
    </aside>
  );
}
