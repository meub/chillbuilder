import { Dices } from 'lucide-react';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useRollDialog } from '../../hooks/useRollDialog';
import { RollDialog } from '../shared/RollDialog';
import { abilities } from '../../data/abilities';
import type { AbilityKey } from '../../models/types';
import styles from '../shared/shared.module.css';
import rollStyles from '../shared/RollDialog.module.css';

export function AbilitiesTab() {
  const character = useActiveCharacter();
  const updateAbility = useCharacterStore(s => s.updateAbility);
  const updateCurrentStamina = useCharacterStore(s => s.updateCurrentStamina);
  const updateCurrentWillpower = useCharacterStore(s => s.updateCurrentWillpower);
  const roll = useRollDialog();

  if (!character) return null;

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Abilities</h2>
      <p className={styles.tabDescription}>
        Scores range 10–90. Cost: 1 CIP per 5 points of ability score. Click the dice to roll.
      </p>

      <div>
        {abilities.map(ability => {
          const value = character.abilities[ability.key];
          const cipCost = Math.floor(value / 5);
          return (
            <div key={ability.key} className={styles.abilityRow}>
              <div className={styles.abilityLabel}>
                <span className={styles.abilityAbbr}>{ability.abbr}</span>
                <span className={styles.abilityName}>{ability.name}</span>
              </div>
              <input
                type="range"
                className={styles.abilitySlider}
                min={10}
                max={90}
                step={5}
                value={value}
                onChange={e => updateAbility(ability.key as AbilityKey, Number(e.target.value))}
              />
              <input
                type="number"
                className={styles.abilityInput}
                min={10}
                max={90}
                step={5}
                value={value}
                onChange={e => updateAbility(ability.key as AbilityKey, Number(e.target.value))}
              />
              <div className={styles.abilityCip}>{cipCost} CIP</div>
              <button
                className={rollStyles.diceButton}
                onClick={() => roll.openRoll(`${ability.name} Check`, value)}
                title={`Roll ${ability.name}`}
              >
                <Dices size={16} />
                <span className={rollStyles.diceLabel}>Roll</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.categoryHeader} style={{ marginTop: 32 }}>
        Current Values (Play Tracking)
      </div>
      <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel}>Current Stamina</label>
          <input
            type="number"
            className={styles.abilityInput}
            value={character.currentStamina}
            onChange={e => updateCurrentStamina(Number(e.target.value))}
            min={0}
            max={character.abilities.STA}
          />
        </div>
        <div className={styles.formGroup} style={{ marginBottom: 0 }}>
          <label className={styles.formLabel}>Current Willpower</label>
          <input
            type="number"
            className={styles.abilityInput}
            value={character.currentWillpower}
            onChange={e => updateCurrentWillpower(Number(e.target.value))}
            min={0}
            max={character.abilities.WPR}
          />
        </div>
      </div>

      <RollDialog
        open={roll.open}
        onOpenChange={roll.setOpen}
        name={roll.name}
        baseTarget={roll.target}
      />
    </div>
  );
}
