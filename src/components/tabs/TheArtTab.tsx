import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import { disciplines, schoolPrerequisites, schoolScoreAbilities } from '../../data/disciplines';
import { psionicDisciplines } from '../../data/psionics';
import {
  ritualDurationTable, materialsCostTable, assistantsTable, subsidiaryActivityTable,
  rangeTable, durationTable, areaOfEffectTable, fatigueTable,
  endResults, computeCastingModifier,
} from '../../data/spells';
import { computeBaseScore } from '../../utils/skills';
import type { SkillLevel, ArtSchool, Spell, SpellCause, SpellEffect } from '../../models/types';
import styles from '../shared/shared.module.css';

type SubTab = 'disciplines' | 'spells' | 'psionics';

const SKILL_LEVELS: SkillLevel[] = ['S', 'T', 'M'];

function defaultSpell(): Spell {
  return {
    id: nanoid(),
    name: 'New Spell',
    causes: { ritualDuration: 1, materialsCost: 1, assistants: 1, subsidiaryActivity: 1 },
    effects: { range: 1, duration: 1, areaOfEffect: 1, fatigue: 5, endResultId: endResults[0]?.id ?? '', endResultPotency: endResults[0]?.potency ?? 3 },
  };
}

export function TheArtTab() {
  const character = useActiveCharacter();
  const addDiscipline = useCharacterStore(s => s.addDiscipline);
  const updateDisciplineLevel = useCharacterStore(s => s.updateDisciplineLevel);
  const removeDiscipline = useCharacterStore(s => s.removeDiscipline);
  const addPsionic = useCharacterStore(s => s.addPsionic);
  const removePsionic = useCharacterStore(s => s.removePsionic);
  const addSpell = useCharacterStore(s => s.addSpell);
  const updateSpell = useCharacterStore(s => s.updateSpell);
  const removeSpell = useCharacterStore(s => s.removeSpell);
  const [subTab, setSubTab] = useState<SubTab>('disciplines');

  if (!character) return null;

  const ownedDisciplineIds = new Set(character.disciplines.map(d => d.disciplineId));
  const ownedPsionicIds = new Set(character.psionicDisciplines.map(p => p.psionicId));
  const hasPsionicEdge = character.edges.some(e => e.edgeId === 'psionic-ability');

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>The Art</h2>

      <div className={styles.toggleGroup}>
        {(['disciplines', 'spells', 'psionics'] as SubTab[]).map(tab => (
          <button
            key={tab}
            className={`${styles.toggleOption} ${subTab === tab ? styles.toggleOptionActive : ''}`}
            onClick={() => setSubTab(tab)}
          >
            {tab === 'disciplines' ? 'SAVE Disciplines' : tab === 'spells' ? 'Companion Spells' : 'Psionics'}
          </button>
        ))}
      </div>

      {subTab === 'disciplines' && (
        <DisciplinesSection
          character={character}
          ownedIds={ownedDisciplineIds}
          addDiscipline={addDiscipline}
          updateDisciplineLevel={updateDisciplineLevel}
          removeDiscipline={removeDiscipline}
        />
      )}

      {subTab === 'spells' && (
        <SpellsSection
          character={character}
          addSpell={addSpell}
          updateSpell={updateSpell}
          removeSpell={removeSpell}
        />
      )}

      {subTab === 'psionics' && (
        <PsionicsSection
          character={character}
          hasPsionicEdge={hasPsionicEdge}
          ownedIds={ownedPsionicIds}
          addPsionic={addPsionic}
          removePsionic={removePsionic}
        />
      )}
    </div>
  );
}

function DisciplinesSection({
  character, ownedIds, addDiscipline, updateDisciplineLevel, removeDiscipline,
}: {
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  ownedIds: Set<string>;
  addDiscipline: (id: string, level: SkillLevel) => void;
  updateDisciplineLevel: (id: string, level: SkillLevel) => void;
  removeDiscipline: (id: string) => void;
}) {
  const schools: ArtSchool[] = ['communicative', 'incorporeal', 'protective', 'restorative'];

  return (
    <>
      {character.disciplines.length > 0 && (
        <>
          <div className={styles.categoryHeader}>Your Disciplines</div>
          {character.disciplines.map(charDisc => {
            const def = disciplines.find(d => d.id === charDisc.disciplineId);
            if (!def) return null;
            const scoreAbilities = schoolScoreAbilities[def.school];
            const score = computeBaseScore(character.abilities, scoreAbilities as never);
            return (
              <div key={charDisc.disciplineId} className={styles.skillRow}>
                <div>
                  <div className={styles.skillName}>{def.name}</div>
                  <div className={styles.skillBase}>{def.school} — Score: {score}</div>
                </div>
                <div className={styles.levelSelector}>
                  {SKILL_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      className={`${styles.levelButton} ${charDisc.level === lvl ? styles.levelButtonActive : ''}`}
                      onClick={() => updateDisciplineLevel(charDisc.disciplineId, lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button className={styles.removeButton} onClick={() => removeDiscipline(charDisc.disciplineId)}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </>
      )}

      {schools.map(school => {
        const prereq = schoolPrerequisites[school];
        const meetsPrereq = character.abilities[prereq.ability as keyof typeof character.abilities] >= prereq.minimum;
        const schoolDiscs = disciplines.filter(d => d.school === school && !ownedIds.has(d.id));

        return (
          <div key={school}>
            <div className={styles.categoryHeader}>
              {school.charAt(0).toUpperCase() + school.slice(1)} School
              {!meetsPrereq && (
                <span style={{ color: 'var(--danger)', marginLeft: 8, fontSize: '0.75rem', textTransform: 'none' }}>
                  Requires {prereq.ability} ≥ {prereq.minimum} (current: {character.abilities[prereq.ability as keyof typeof character.abilities]})
                </span>
              )}
            </div>
            {schoolDiscs.map(disc => (
              <div key={disc.id} className={styles.catalogItem} style={{ opacity: meetsPrereq ? 1 : 0.5 }}>
                <div>
                  <div className={styles.catalogItemName}>{disc.name}</div>
                  <div className={styles.catalogItemDesc}>
                    WP Cost: {disc.wpCost} — Range: {disc.range}
                  </div>
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => addDiscipline(disc.id, 'S')}
                  disabled={!meetsPrereq}
                >
                  <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Add
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
}

function SpellsSection({
  character, addSpell, updateSpell, removeSpell,
}: {
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  addSpell: (spell: Spell) => void;
  updateSpell: (id: string, spell: Spell) => void;
  removeSpell: (id: string) => void;
}) {
  const handleAddSpell = () => addSpell(defaultSpell());

  const handleUpdateCause = (spell: Spell, key: keyof SpellCause, value: number) => {
    updateSpell(spell.id, { ...spell, causes: { ...spell.causes, [key]: value } });
  };

  const handleUpdateEffect = (spell: Spell, key: keyof SpellEffect, value: number | string) => {
    updateSpell(spell.id, { ...spell, effects: { ...spell.effects, [key]: value } });
  };

  return (
    <>
      <p className={styles.tabDescription}>
        Build custom spells using causes and effects. Each spell costs 3 CIPs. Requires Ritual Magic skill.
      </p>

      {character.spells.map(spell => {
        const totalCause = spell.causes.ritualDuration + spell.causes.materialsCost + spell.causes.assistants + spell.causes.subsidiaryActivity;
        const endResult = endResults.find(e => e.id === spell.effects.endResultId);
        const totalEffect = spell.effects.range + spell.effects.duration + spell.effects.areaOfEffect + (10 - spell.effects.fatigue) + (endResult?.potency ?? 0);
        const castingMod = computeCastingModifier(totalCause, totalEffect, 5);

        return (
          <div key={spell.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <input
                className={styles.formInput}
                value={spell.name}
                onChange={e => updateSpell(spell.id, { ...spell, name: e.target.value })}
                style={{ fontWeight: 600, maxWidth: 300 }}
              />
              <button className={styles.removeButton} onClick={() => removeSpell(spell.id)}><X size={16} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div className={styles.categoryHeader}>Causes</div>
                <PotencySlider label="Ritual Duration" value={spell.causes.ritualDuration} table={ritualDurationTable} onChange={v => handleUpdateCause(spell, 'ritualDuration', v)} />
                <PotencySlider label="Materials Cost" value={spell.causes.materialsCost} table={materialsCostTable} onChange={v => handleUpdateCause(spell, 'materialsCost', v)} />
                <PotencySlider label="Assistants" value={spell.causes.assistants} table={assistantsTable} onChange={v => handleUpdateCause(spell, 'assistants', v)} />
                <PotencySlider label="Subsidiary Activity" value={spell.causes.subsidiaryActivity} table={subsidiaryActivityTable} onChange={v => handleUpdateCause(spell, 'subsidiaryActivity', v)} />
              </div>
              <div>
                <div className={styles.categoryHeader}>Effects</div>
                <PotencySlider label="Range" value={spell.effects.range} table={rangeTable} onChange={v => handleUpdateEffect(spell, 'range', v)} />
                <PotencySlider label="Duration" value={spell.effects.duration} table={durationTable} onChange={v => handleUpdateEffect(spell, 'duration', v)} />
                <PotencySlider label="Area of Effect" value={spell.effects.areaOfEffect} table={areaOfEffectTable} onChange={v => handleUpdateEffect(spell, 'areaOfEffect', v)} />
                <PotencySlider label="Fatigue" value={spell.effects.fatigue} table={fatigueTable} onChange={v => handleUpdateEffect(spell, 'fatigue', v)} />
                <div className={styles.formGroup} style={{ marginTop: 12 }}>
                  <label className={styles.formLabel}>End Result</label>
                  <select
                    className={styles.formSelect}
                    value={spell.effects.endResultId}
                    onChange={e => handleUpdateEffect(spell, 'endResultId', e.target.value)}
                  >
                    {endResults.map(er => (
                      <option key={er.id} value={er.id}>{er.name} (Potency {er.potency})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: '8px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Cause Potency: {totalCause} — Effect Potency: {totalEffect}
              </span>
              <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                Casting Modifier: {castingMod >= 0 ? '+' : ''}{castingMod}
              </span>
            </div>
          </div>
        );
      })}

      <button className={styles.addButton} onClick={handleAddSpell} style={{ marginTop: 16 }}>
        <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
        Add Spell (3 CIP)
      </button>
    </>
  );
}

function PotencySlider({ label, value, table, onChange }: { label: string; value: number; table: Record<number, string>; onChange: (v: number) => void }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)' }}
      />
      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
        {table[value]}
      </div>
    </div>
  );
}

function PsionicsSection({
  character, hasPsionicEdge, ownedIds, addPsionic, removePsionic,
}: {
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  hasPsionicEdge: boolean;
  ownedIds: Set<string>;
  addPsionic: (id: string, level?: SkillLevel) => void;
  removePsionic: (id: string) => void;
}) {
  if (!hasPsionicEdge) {
    return (
      <p className={styles.tabDescription} style={{ color: 'var(--warning)' }}>
        Requires the Psionic Ability edge (8 CIPs) to access psionic disciplines.
      </p>
    );
  }

  return (
    <>
      <p className={styles.tabDescription}>
        Each use costs 5 WPR per round. All psionics also gain Psionic Attack (2D10 STA + 1 wound, 100yd range).
      </p>

      {character.psionicDisciplines.length > 0 && (
        <>
          <div className={styles.categoryHeader}>Your Psionic Disciplines</div>
          {character.psionicDisciplines.map(charPsi => {
            const def = psionicDisciplines.find(p => p.id === charPsi.psionicId);
            if (!def) return null;
            return (
              <div key={charPsi.psionicId} className={styles.skillRow}>
                <div className={styles.skillName}>{def.name}</div>
                <div className={styles.skillCip}>
                  {def.leveled && charPsi.level
                    ? `${charPsi.level === 'S' ? 4 : charPsi.level === 'T' ? 6 : 8} CIP`
                    : `${def.cost} CIP`}
                </div>
                <button className={styles.removeButton} onClick={() => removePsionic(charPsi.psionicId)}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </>
      )}

      <div className={styles.categoryHeader}>Available Disciplines</div>
      {psionicDisciplines.filter(p => !ownedIds.has(p.id)).map(disc => (
        <div key={disc.id} className={styles.catalogItem}>
          <div>
            <div className={styles.catalogItemName}>{disc.name}</div>
            <div className={styles.catalogItemDesc}>
              {disc.leveled ? 'Leveled (S/T/M): 4/6/8 CIP' : `Flat: ${disc.cost} CIP`}
            </div>
          </div>
          <button className={styles.addButton} onClick={() => addPsionic(disc.id, disc.leveled ? 'S' : undefined)}>
            <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Add
          </button>
        </div>
      ))}
    </>
  );
}
