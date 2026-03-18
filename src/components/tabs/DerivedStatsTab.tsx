import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { computeAllDerived } from '../../utils/derived';
import { useCharacterStore } from '../../store/useCharacterStore';
import styles from '../shared/shared.module.css';

export function DerivedStatsTab() {
  const character = useActiveCharacter();
  const toggleWound = useCharacterStore(s => s.toggleWound);
  const updateLuckPoints = useCharacterStore(s => s.updateLuckPoints);

  if (!character) return null;

  const derived = computeAllDerived(character);

  // Ensure wound array matches computed boxes
  const woundBoxCount = derived.woundBoxes;
  const wounds = Array.from({ length: woundBoxCount }, (_, i) => character.wounds[i] ?? false);

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Derived Stats</h2>
      <p className={styles.tabDescription}>
        Auto-calculated from your abilities. These update when you change ability scores.
      </p>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Movement</span>
          <span className={styles.statCardValue}>{derived.movement}</span>
          <span className={styles.statCardFormula}>floor(AGL/3) + 20</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Sprinting Speed</span>
          <span className={styles.statCardValue}>{derived.sprintingSpeed} ft/rnd</span>
          <span className={styles.statCardFormula}>AGL + 50</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Unskilled Melee</span>
          <span className={styles.statCardValue}>{derived.unskilledMelee}</span>
          <span className={styles.statCardFormula}>(AGL+STR)/2 + 4</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Sensing the Unknown</span>
          <span className={styles.statCardValue}>{derived.sensingTheUnknown}</span>
          <span className={styles.statCardFormula}>
            floor(PCN/{character.edges.some(e => e.edgeId === 'evil-sense') ? '4' : '5'}) + 20
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Luck Points</span>
          <span className={styles.statCardValue}>
            <input
              type="number"
              className={styles.inlineNumber}
              value={character.luckPoints}
              onChange={e => updateLuckPoints(Number(e.target.value))}
              min={0}
              style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, width: 80 }}
            />
          </span>
          <span className={styles.statCardFormula}>Base: LCK = {character.abilities.LCK}</span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statCardLabel}>Wound Boxes ({woundBoxCount})</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {wounds.map((wounded, i) => (
              <button
                key={i}
                onClick={() => toggleWound(i)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 4,
                  border: `2px solid ${wounded ? 'var(--danger)' : 'var(--border-strong)'}`,
                  background: wounded ? 'var(--danger)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                title={`Wound ${i + 1}: ${wounded ? 'Wounded' : 'Healthy'}`}
              />
            ))}
          </div>
          <span className={styles.statCardFormula}>floor((STR+STA)/2/10)</span>
        </div>
      </div>
    </div>
  );
}
