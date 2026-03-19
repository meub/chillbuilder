import { Dices } from 'lucide-react';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { computeAllDerived } from '../../utils/derived';
import { computeBaseScore, computeSkillScore, computeStrikeRank } from '../../utils/skills';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useRollDialog } from '../../hooks/useRollDialog';
import { RollDialog } from '../shared/RollDialog';
import { narrowSkills } from '../../data/skills-narrow';
import { broadSkills } from '../../data/skills-broad';
import type { LuckMode } from '../../models/types';
import styles from '../shared/shared.module.css';
import rollStyles from '../shared/RollDialog.module.css';

const LUCK_MODES: { mode: LuckMode; label: string; desc: string }[] = [
  { mode: 'gritty', label: 'Gritty', desc: 'Half LCK' },
  { mode: 'standard', label: 'Standard', desc: 'Full LCK' },
  { mode: 'wild', label: 'Wild', desc: 'Double LCK' },
];

function computeStartingLuck(lck: number, mode: LuckMode): number {
  if (mode === 'gritty') return Math.floor(lck / 2);
  if (mode === 'wild') return lck * 2;
  return lck;
}

export function DerivedStatsTab() {
  const character = useActiveCharacter();
  const toggleWound = useCharacterStore(s => s.toggleWound);
  const updateLuckPoints = useCharacterStore(s => s.updateLuckPoints);
  const updateLuckMode = useCharacterStore(s => s.updateLuckMode);
  const roll = useRollDialog();

  if (!character) return null;

  const derived = computeAllDerived(character);
  const luckMode = character.luckMode ?? 'standard';
  const startingLuck = computeStartingLuck(character.abilities.LCK, luckMode);

  // Compute good fortune / misfortune modifiers
  const goodFortuneCount = character.edges.filter(e => e.edgeId === 'good-fortune').reduce((s, e) => s + e.purchases, 0);
  const misfortuneCount = character.drawbacks.filter(d => d.drawbackId === 'misfortune').reduce((s, d) => s + d.purchases, 0);
  const luckModifier = (goodFortuneCount * 10) - (misfortuneCount * 10);

  // Wound boxes
  const woundBoxCount = derived.woundBoxes;
  const wounds = Array.from({ length: woundBoxCount }, (_, i) => character.wounds[i] ?? false);

  // Combat skills for strike rank
  const combatSkills = character.skills.map(cs => {
    const def = cs.isBroad
      ? broadSkills.find(s => s.id === cs.skillId)
      : narrowSkills.find(s => s.id === cs.skillId);
    if (!def) return null;
    const cat = 'category' in def ? def.category : null;
    if (!cat || cat === 'non-combat') return null;
    const baseScore = computeBaseScore(character.abilities, def.formula);
    const skillScore = computeSkillScore(baseScore, cs.level);
    const sr = computeStrikeRank(skillScore);
    return { name: def.name, score: skillScore, sr, category: cat };
  }).filter(Boolean);

  const handleInitiativeRoll = () => {
    const rollVal = Math.floor(Math.random() * 10) + 1;
    const initiative = 4 + rollVal;
    roll.openRoll(`Initiative (4 + ${rollVal})`, initiative);
  };

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
          <span className={styles.statCardLabel}>Initiative</span>
          <span className={styles.statCardValue}>
            4 + 1D10
          </span>
          <button
            className={rollStyles.diceButton}
            onClick={handleInitiativeRoll}
            style={{ marginTop: 4 }}
          >
            <Dices size={16} />
            <span className={rollStyles.diceLabel}>Roll Initiative</span>
          </button>
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
          <div className={styles.toggleGroup} style={{ marginTop: 8 }}>
            {LUCK_MODES.map(lm => (
              <button
                key={lm.mode}
                className={`${styles.toggleOption} ${luckMode === lm.mode ? styles.toggleOptionActive : ''}`}
                onClick={() => updateLuckMode(lm.mode)}
                title={lm.desc}
              >
                {lm.label}
              </button>
            ))}
          </div>
          <span className={styles.statCardFormula}>
            Starting: {startingLuck}{luckModifier !== 0 ? ` (${luckModifier > 0 ? '+' : ''}${luckModifier} edges/drawbacks)` : ''}
          </span>
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

      {/* Strike Rank Table */}
      {combatSkills.length > 0 && (
        <>
          <h3 className={styles.tabTitle} style={{ marginTop: 32, fontSize: 'var(--font-size-lg)' }}>
            Strike Ranks
          </h3>
          <p className={styles.tabDescription}>
            Pre-calculated result bands for combat skills.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-strong)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skill</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#facc15', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>L</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#60a5fa', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>H</th>
                  <th style={{ textAlign: 'center', padding: '8px 12px', color: '#a855f7', fontWeight: 600, fontSize: 'var(--font-size-xs)' }}>C</th>
                </tr>
              </thead>
              <tbody>
                {combatSkills.map((skill, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '6px 12px', fontWeight: 500 }}>{skill!.name}</td>
                    <td style={{ textAlign: 'center', padding: '6px 12px', fontVariantNumeric: 'tabular-nums' }}>{skill!.score}</td>
                    <td style={{ textAlign: 'center', padding: '6px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>≤ {skill!.sr.l}</td>
                    <td style={{ textAlign: 'center', padding: '6px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>≤ {skill!.sr.h}</td>
                    <td style={{ textAlign: 'center', padding: '6px 12px', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>≤ {skill!.sr.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <RollDialog
        open={roll.open}
        onOpenChange={roll.setOpen}
        name={roll.name}
        baseTarget={roll.target}
      />
    </div>
  );
}
