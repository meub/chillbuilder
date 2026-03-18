import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCipCalculation } from '../../hooks/useCipCalculation';
import { computeAllDerived } from '../../utils/derived';
import { computeBaseScore, computeSkillScore } from '../../utils/skills';
import { narrowSkills } from '../../data/skills-narrow';
import { broadSkills } from '../../data/skills-broad';
import { edges } from '../../data/edges';
import { drawbacks } from '../../data/drawbacks';
import { disciplines } from '../../data/disciplines';
import { psionicDisciplines } from '../../data/psionics';
import {
  ritualDurationTable,
  materialsCostTable,
  assistantsTable,
  rangeTable,
  durationTable,
  areaOfEffectTable,
  fatigueTable,
  endResults,
} from '../../data/spells';
import type { AbilityKey } from '../../models/types';
import styles from './PrintSheet.module.css';

const ABILITY_KEYS: AbilityKey[] = ['AGL', 'DEX', 'LCK', 'PCN', 'PER', 'STA', 'STR', 'WPR'];

const LEVEL_LABELS: Record<string, string> = {
  S: 'Student',
  T: 'Teacher',
  M: 'Master',
};

export function PrintSheet() {
  const character = useActiveCharacter();
  const cipBreakdown = useCipCalculation(character);

  if (!character) return null;

  const derived = computeAllDerived(character);
  const isOverBudget = cipBreakdown.total > character.cipBudget;

  // Build skill rows with computed scores
  const skillRows = character.skills.map(cs => {
    if (cs.isBroad) {
      const def = broadSkills.find(s => s.id === cs.skillId);
      if (!def) return null;
      const baseScore = computeBaseScore(character.abilities, def.formula);
      const skillScore = computeSkillScore(baseScore, cs.level);
      return {
        name: def.name,
        type: 'Broad',
        base: baseScore,
        level: cs.level,
        score: skillScore,
      };
    }
    const def = narrowSkills.find(s => s.id === cs.skillId);
    if (!def) return null;
    const baseScore = computeBaseScore(character.abilities, def.formula);
    const skillScore = computeSkillScore(baseScore, cs.level);
    return {
      name: def.name,
      type: 'Narrow',
      base: baseScore,
      level: cs.level,
      score: skillScore,
    };
  }).filter(Boolean);

  // Build edge rows
  const edgeRows = character.edges.map(ce => {
    const def = edges.find(e => e.id === ce.edgeId);
    if (!def) return null;
    return {
      name: def.name,
      purchases: ce.purchases,
      description: def.description,
    };
  }).filter(Boolean);

  // Build drawback rows
  const drawbackRows = character.drawbacks.map(cd => {
    const def = drawbacks.find(d => d.id === cd.drawbackId);
    if (!def) return null;
    return {
      name: def.name,
      purchases: cd.purchases,
      description: def.description,
    };
  }).filter(Boolean);

  // Build discipline rows
  const disciplineRows = character.disciplines.map(cd => {
    const def = disciplines.find(d => d.id === cd.disciplineId);
    if (!def) return null;
    return {
      name: def.name,
      school: def.school.charAt(0).toUpperCase() + def.school.slice(1),
      level: cd.level,
      wpCost: def.wpCost,
      range: def.range,
    };
  }).filter(Boolean);

  // Build psionic rows
  const psionicRows = character.psionicDisciplines.map(cp => {
    const def = psionicDisciplines.find(p => p.id === cp.psionicId);
    if (!def) return null;
    return {
      name: def.name,
      level: cp.level,
      description: def.description,
    };
  }).filter(Boolean);

  // Build spell summaries
  const spellRows = character.spells.map(spell => {
    const endResult = endResults.find(er => er.id === spell.effects.endResultId);
    return {
      name: spell.name,
      causes: {
        ritual: ritualDurationTable[spell.causes.ritualDuration] ?? `P${spell.causes.ritualDuration}`,
        materials: materialsCostTable[spell.causes.materialsCost] ?? `P${spell.causes.materialsCost}`,
        assistants: assistantsTable[spell.causes.assistants] ?? `P${spell.causes.assistants}`,
      },
      effects: {
        range: rangeTable[spell.effects.range] ?? `P${spell.effects.range}`,
        duration: durationTable[spell.effects.duration] ?? `P${spell.effects.duration}`,
        area: areaOfEffectTable[spell.effects.areaOfEffect] ?? `P${spell.effects.areaOfEffect}`,
        fatigue: fatigueTable[spell.effects.fatigue] ?? `P${spell.effects.fatigue}`,
        endResult: endResult?.name ?? spell.effects.endResultId,
      },
    };
  });

  const hasArt = disciplineRows.length > 0 || spellRows.length > 0 || psionicRows.length > 0;

  return (
    <div className={styles.printSheet}>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.characterName}>
          {character.background.name || character.name || 'Unnamed Character'}
        </div>
        <div className={styles.headerRow}>
          {character.background.profession && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Profession: </span>
              {character.background.profession}
            </span>
          )}
          {character.background.age > 0 && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Age: </span>
              {character.background.age}
            </span>
          )}
          {character.background.height && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Height: </span>
              {character.background.height}
            </span>
          )}
          {character.background.weight && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Weight: </span>
              {character.background.weight}
            </span>
          )}
          <span className={styles.headerField}>
            <span className={styles.headerLabel}>Hand: </span>
            {character.background.handedness.charAt(0).toUpperCase() +
              character.background.handedness.slice(1)}
          </span>
          {character.background.education && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Education: </span>
              {character.background.education}
            </span>
          )}
          {character.background.socialStatus && (
            <span className={styles.headerField}>
              <span className={styles.headerLabel}>Status: </span>
              {character.background.socialStatus}
            </span>
          )}
        </div>
        <div className={styles.cipSummary}>
          <span className={isOverBudget ? styles.cipOver : undefined}>
            CIPs: {cipBreakdown.total} / {character.cipBudget}
          </span>
          {' '}(Abilities {cipBreakdown.abilities} | Skills {cipBreakdown.skills} | Edges {cipBreakdown.edges} | Drawbacks -{cipBreakdown.drawbacks} | Art {cipBreakdown.disciplines} | Spells {cipBreakdown.spells} | Psionics {cipBreakdown.psionics})
        </div>
      </div>

      {/* ─── ABILITIES ───────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Abilities</div>
        <div className={styles.abilitiesGrid}>
          {ABILITY_KEYS.map(key => {
            const score = character.abilities[key];
            const cip = Math.floor(score / 5);
            return (
              <div key={key} className={styles.abilityBox}>
                <span className={styles.abilityAbbr}>{key}</span>
                <span className={styles.abilityScore}>{score}</span>
                <span className={styles.abilityCip}>{cip} CIP</span>
              </div>
            );
          })}
        </div>
        <div className={styles.currentValues}>
          <span className={styles.currentValueItem}>
            <span className={styles.currentValueLabel}>Current STA: </span>
            {character.currentStamina} / {character.abilities.STA}
          </span>
          <span className={styles.currentValueItem}>
            <span className={styles.currentValueLabel}>Current WPR: </span>
            {character.currentWillpower} / {character.abilities.WPR}
          </span>
        </div>
      </div>

      {/* ─── DERIVED STATS ───────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Derived Stats</div>
        <div className={styles.derivedGrid}>
          <div className={styles.derivedBox}>
            <span className={styles.derivedLabel}>Movement</span>
            <span className={styles.derivedValue}>{derived.movement}</span>
          </div>
          <div className={styles.derivedBox}>
            <span className={styles.derivedLabel}>Sprinting</span>
            <span className={styles.derivedValue}>{derived.sprintingSpeed}</span>
          </div>
          <div className={styles.derivedBox}>
            <span className={styles.derivedLabel}>Unskilled Melee</span>
            <span className={styles.derivedValue}>{derived.unskilledMelee}</span>
          </div>
          <div className={styles.derivedBox}>
            <span className={styles.derivedLabel}>Sensing Unknown</span>
            <span className={styles.derivedValue}>{derived.sensingTheUnknown}</span>
          </div>
          <div className={styles.derivedBox}>
            <span className={styles.derivedLabel}>Luck Points</span>
            <span className={styles.derivedValue}>{derived.luckPoints}</span>
          </div>
        </div>
        <div className={styles.woundsRow}>
          <span className={styles.woundsLabel}>Wounds ({derived.woundBoxes}):</span>
          {character.wounds.map((filled, i) => (
            <span
              key={i}
              className={filled ? styles.woundBoxFilled : styles.woundBox}
            />
          ))}
          {/* If character wounds array is shorter than derived, show extra empty boxes */}
          {character.wounds.length < derived.woundBoxes &&
            Array.from({ length: derived.woundBoxes - character.wounds.length }).map((_, i) => (
              <span key={`extra-${i}`} className={styles.woundBox} />
            ))}
        </div>
      </div>

      {/* ─── SKILLS ──────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Skills ({character.skillSystem})</div>
        {skillRows.length > 0 ? (
          <table className={styles.skillsTable}>
            <thead>
              <tr>
                <th>Skill</th>
                <th>Base</th>
                <th style={{ textAlign: 'center' }}>Level</th>
                <th style={{ textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {skillRows.map((row, i) => (
                <tr key={i}>
                  <td>
                    {row!.name}{' '}
                    <span className={styles.skillType}>{row!.type}</span>
                  </td>
                  <td className={styles.skillBase}>{row!.base}</td>
                  <td className={styles.skillLevel}>{LEVEL_LABELS[row!.level]}</td>
                  <td className={styles.skillScore}>{row!.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyMessage}>No skills purchased.</div>
        )}
      </div>

      {/* ─── EDGES & DRAWBACKS ───────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.twoColumns}>
          <div className={styles.column}>
            <div className={styles.sectionTitle}>Edges</div>
            {edgeRows.length > 0 ? (
              <ul className={styles.edgeList}>
                {edgeRows.map((row, i) => (
                  <li key={i}>
                    <span className={styles.edgeName}>{row!.name}</span>
                    {row!.purchases > 1 && (
                      <span className={styles.edgePurchases}> x{row!.purchases}</span>
                    )}
                    {' '}<span className={styles.edgeDesc}>-- {row!.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyMessage}>No edges selected.</div>
            )}
          </div>
          <div className={styles.column}>
            <div className={styles.sectionTitle}>Drawbacks</div>
            {drawbackRows.length > 0 ? (
              <ul className={styles.edgeList}>
                {drawbackRows.map((row, i) => (
                  <li key={i}>
                    <span className={styles.edgeName}>{row!.name}</span>
                    {row!.purchases > 1 && (
                      <span className={styles.edgePurchases}> x{row!.purchases}</span>
                    )}
                    {' '}<span className={styles.edgeDesc}>-- {row!.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyMessage}>No drawbacks selected.</div>
            )}
          </div>
        </div>
      </div>

      {/* ─── THE ART ─────────────────────────────────────────────── */}
      {hasArt && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>The Art</div>

          {/* Disciplines */}
          {disciplineRows.length > 0 && (
            <>
              <table className={styles.disciplineTable}>
                <thead>
                  <tr>
                    <th>Discipline</th>
                    <th>School</th>
                    <th style={{ textAlign: 'center' }}>Level</th>
                    <th>WP Cost</th>
                    <th>Range</th>
                  </tr>
                </thead>
                <tbody>
                  {disciplineRows.map((row, i) => (
                    <tr key={i}>
                      <td>{row!.name}</td>
                      <td>{row!.school}</td>
                      <td style={{ textAlign: 'center' }}>{LEVEL_LABELS[row!.level]}</td>
                      <td>{row!.wpCost}</td>
                      <td>{row!.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* Companion Spells */}
          {spellRows.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '2pt', marginTop: '4pt' }}>
                Companion Spells
              </div>
              {spellRows.map((spell, i) => (
                <div key={i} className={styles.spellBlock}>
                  <div className={styles.spellName}>{spell.name}</div>
                  <div className={styles.spellDetail}>
                    <strong>Causes:</strong> Ritual {spell.causes.ritual} | Materials {spell.causes.materials} | Assistants {spell.causes.assistants}
                  </div>
                  <div className={styles.spellDetail}>
                    <strong>Effects:</strong> {spell.effects.endResult} | Range {spell.effects.range} | Duration {spell.effects.duration} | Area {spell.effects.area} | Fatigue {spell.effects.fatigue}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Psionics */}
          {psionicRows.length > 0 && (
            <>
              <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '2pt', marginTop: '4pt' }}>
                Psionic Disciplines
              </div>
              {psionicRows.map((row, i) => (
                <div key={i} className={styles.psionicItem}>
                  <span className={styles.psionicName}>{row!.name}</span>
                  {row!.level && (
                    <span className={styles.psionicLevel}> ({LEVEL_LABELS[row!.level]})</span>
                  )}
                  {' '}<span className={styles.edgeDesc}>-- {row!.description}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ─── EQUIPMENT ───────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Equipment</div>
        {character.equipment.length > 0 ? (
          <ul className={styles.equipmentList}>
            {character.equipment.map(item => (
              <li key={item.id}>
                {item.name}
                {item.notes && (
                  <span className={styles.equipmentNotes}> -- {item.notes}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyMessage}>No equipment listed.</div>
        )}
      </div>

      {/* ─── BACKGROUND & NOTES ──────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Background</div>
        {character.background.personalHistory ? (
          <div className={styles.backgroundText}>
            {character.background.personalHistory}
          </div>
        ) : (
          <div className={styles.emptyMessage}>No personal history written.</div>
        )}
        {character.notes && (
          <>
            <div className={styles.sectionTitle} style={{ marginTop: '6pt' }}>Notes</div>
            <div className={styles.notesText}>{character.notes}</div>
          </>
        )}
      </div>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <div className={styles.footer}>
        Chill 2nd Edition Character Sheet -- Generated by Chillbuilder
      </div>
    </div>
  );
}
