import { useState, useMemo } from 'react';
import { Search, Plus, X, Dices, ChevronUp, ChevronDown } from 'lucide-react';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useRollDialog } from '../../hooks/useRollDialog';
import { useUndoToast } from '../../hooks/useUndoToast';
import { RollDialog } from '../shared/RollDialog';
import { UndoToast } from '../shared/UndoToast';
import { Tooltip } from '../shared/Tooltip';
import { narrowSkills } from '../../data/skills-narrow';
import { broadSkills } from '../../data/skills-broad';
import { computeBaseScore, computeSkillScore } from '../../utils/skills';
import { computeSkillCip } from '../../utils/cip';
import type { SkillLevel, SkillSystem, SkillDefinition, BroadSkillDefinition } from '../../models/types';
import styles from '../shared/shared.module.css';
import rollStyles from '../shared/RollDialog.module.css';

const SKILL_LEVELS: SkillLevel[] = ['S', 'T', 'M'];
const LEVEL_LABELS: Record<SkillLevel, string> = { S: 'Student', T: 'Teacher', M: 'Master' };

// Lookup narrow skill names by ID for broad skill sub-skill display
const narrowSkillNameMap: Record<string, string> = {};
for (const s of narrowSkills) narrowSkillNameMap[s.id] = s.name;

export function SkillsTab() {
  const character = useActiveCharacter();
  const updateSkillSystem = useCharacterStore(s => s.updateSkillSystem);
  const addSkill = useCharacterStore(s => s.addSkill);
  const updateSkillLevel = useCharacterStore(s => s.updateSkillLevel);
  const removeSkill = useCharacterStore(s => s.removeSkill);
  const toggleEncouraged = useCharacterStore(s => s.toggleEncouraged);
  const toggleDiscouraged = useCharacterStore(s => s.toggleDiscouraged);
  const roll = useRollDialog();
  const undoToast = useUndoToast();
  const [search, setSearch] = useState('');
  const [mixedView, setMixedView] = useState<'broad' | 'narrow'>('narrow');

  if (!character) return null;

  const system = character.skillSystem;
  const showBroad = system === 'broad' || (system === 'mixed' && mixedView === 'broad');
  const showNarrow = system === 'narrow' || (system === 'mixed' && mixedView === 'narrow');

  const ownedIds = new Set(character.skills.map(s => s.skillId));
  const query = search.toLowerCase();

  const availableBroadSkills = useMemo(() => {
    if (!showBroad) return [];
    return broadSkills.filter(s => !ownedIds.has(s.id) && s.name.toLowerCase().includes(query));
  }, [character.skills, search, showBroad]);

  const availableNarrowSkills = useMemo(() => {
    if (!showNarrow) return [];
    return narrowSkills.filter(s => !ownedIds.has(s.id) && s.name.toLowerCase().includes(query));
  }, [character.skills, search, showNarrow]);

  const groupedNarrow = useMemo(() => {
    if (!showNarrow) return null;
    const groups: Record<string, SkillDefinition[]> = {};
    for (const skill of availableNarrowSkills) {
      const cat = skill.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(skill);
    }
    return groups;
  }, [availableNarrowSkills, showNarrow]);

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Skills</h2>

      {/* Skill system toggle */}
      <div className={styles.toggleGroup}>
        {(['narrow', 'broad', 'mixed'] as SkillSystem[]).map(sys => (
          <button
            key={sys}
            className={`${styles.toggleOption} ${system === sys ? styles.toggleOptionActive : ''}`}
            onClick={() => {
              if (sys !== system && character.skills.length > 0) {
                const clearNeeded =
                  (system === 'broad' && sys === 'narrow') ||
                  (system === 'narrow' && sys === 'broad');
                if (clearNeeded && !confirm('Switching between broad and narrow will clear all current skills. Continue?')) return;
              }
              updateSkillSystem(sys);
            }}
          >
            {sys.charAt(0).toUpperCase() + sys.slice(1)}
          </button>
        ))}
      </div>

      {/* Owned skills */}
      <OwnedSkills character={character} updateSkillLevel={updateSkillLevel} removeSkill={removeSkill} addSkill={addSkill} openRoll={roll.openRoll} showUndo={undoToast.show} toggleEncouraged={toggleEncouraged} toggleDiscouraged={toggleDiscouraged} />

      {/* Add skills */}
      <div className={styles.categoryHeader} style={{ marginTop: 24 }}>Add Skills</div>

      {/* Mixed mode: sub-toggle for broad vs narrow catalog */}
      {system === 'mixed' && (
        <div className={styles.toggleGroup} style={{ marginTop: 12, marginBottom: 12 }}>
          <button
            className={`${styles.toggleOption} ${mixedView === 'narrow' ? styles.toggleOptionActive : ''}`}
            onClick={() => setMixedView('narrow')}
          >
            Narrow Skills
          </button>
          <button
            className={`${styles.toggleOption} ${mixedView === 'broad' ? styles.toggleOptionActive : ''}`}
            onClick={() => setMixedView('broad')}
          >
            Broad Skills
          </button>
        </div>
      )}

      <div className={styles.searchWrapper}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {showBroad && (
        <BroadSkillCatalog skills={availableBroadSkills} character={character} addSkill={addSkill} />
      )}

      {showNarrow && groupedNarrow && (
        <NarrowSkillCatalog groups={groupedNarrow} character={character} addSkill={addSkill} />
      )}

      <RollDialog
        open={roll.open}
        onOpenChange={roll.setOpen}
        name={roll.name}
        baseTarget={roll.target}
      />

      {undoToast.visible && (
        <UndoToast
          message={undoToast.message}
          onUndo={undoToast.undo}
          onDismiss={undoToast.dismiss}
        />
      )}
    </div>
  );
}

function OwnedSkills({
  character,
  updateSkillLevel,
  removeSkill,
  addSkill,
  openRoll,
  showUndo,
  toggleEncouraged,
  toggleDiscouraged,
}: {
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  updateSkillLevel: (id: string, level: SkillLevel) => void;
  removeSkill: (id: string) => void;
  addSkill: (skillId: string, isBroad: boolean, level: SkillLevel) => void;
  openRoll: (name: string, target: number) => void;
  showUndo: (message: string, undoAction: () => void) => void;
  toggleEncouraged: (skillId: string) => void;
  toggleDiscouraged: (skillId: string) => void;
}) {
  const encouraged = character.encouragedSkills ?? [];
  const discouraged = character.discouragedSkills ?? [];
  if (character.skills.length === 0) return null;

  return (
    <>
      <div className={styles.categoryHeader}>Your Skills</div>
      {character.skills.map(charSkill => {
        const def: SkillDefinition | BroadSkillDefinition | undefined = charSkill.isBroad
          ? broadSkills.find(s => s.id === charSkill.skillId)
          : narrowSkills.find(s => s.id === charSkill.skillId);
        if (!def) return null;

        const baseScore = computeBaseScore(character.abilities, def.formula);
        const skillScore = computeSkillScore(baseScore, charSkill.level);
        const cost = computeSkillCip(charSkill, encouraged, discouraged);
        const isEncouraged = encouraged.includes(charSkill.skillId);
        const isDiscouraged = discouraged.includes(charSkill.skillId);
        const notes: string[] = [];
        if ('usesCurrentSta' in def && def.usesCurrentSta) notes.push('Uses Current STA');
        if ('isInfo' in def && def.isInfo) notes.push('Information skill');
        if ('unskilled' in def && def.unskilled !== undefined) notes.push(`Unskilled: +${def.unskilled}`);
        if ('isMartialArts' in def && def.isMartialArts) notes.push('Martial Arts (higher CIP cost)');
        const specialNote = notes.length > 0 ? notes.join(' · ') : null;
        const subSkillNames = charSkill.isBroad && 'encompasses' in def
          ? (def as BroadSkillDefinition).encompasses.map(id => narrowSkillNameMap[id] || id)
          : [];

        return (
          <div key={charSkill.skillId} className={styles.skillRow}>
            <div className={styles.skillInfo}>
              <Tooltip content={
                <>
                  Formula: {def.formula.length === 1 ? def.formula[0] : `(${def.formula.join(' + ')}) / ${def.formula.length}`}
                  {specialNote && <><br />{specialNote}</>}
                  {subSkillNames.length > 0 && (
                    <><br /><strong>Covers:</strong> {subSkillNames.join(', ')}</>
                  )}
                </>
              }>
                <div className={styles.skillName}>
                  {def.name}
                  {charSkill.isBroad && <span style={{ color: 'var(--info)', marginLeft: 6, fontSize: '0.7rem' }}>BROAD</span>}
                  {isEncouraged && <span style={{ color: 'var(--success)', marginLeft: 6, fontSize: '0.7rem' }}>½ CIP</span>}
                  {isDiscouraged && <span style={{ color: 'var(--danger)', marginLeft: 6, fontSize: '0.7rem' }}>2× CIP</span>}
                </div>
              </Tooltip>
              <div className={styles.skillBase}>Base: {baseScore}{specialNote ? ` — ${specialNote}` : ''}</div>
              {subSkillNames.length > 0 && (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                  {subSkillNames.join(', ')}
                </div>
              )}
            </div>
            <div className={styles.levelSelector}>
              {SKILL_LEVELS.map(lvl => (
                <button
                  key={lvl}
                  className={`${styles.levelButton} ${charSkill.level === lvl ? styles.levelButtonActive : ''}`}
                  onClick={() => updateSkillLevel(charSkill.skillId, lvl)}
                  title={LEVEL_LABELS[lvl]}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <div className={styles.skillScore}>{skillScore}</div>
            <button
              className={rollStyles.diceButton}
              onClick={() => openRoll(def.name, skillScore)}
              title={`Roll ${def.name}`}
            >
              <Dices size={16} />
              <span className={rollStyles.diceLabel}>Roll</span>
            </button>
            <div className={styles.skillCip}>{cost} CIP</div>
            <Tooltip content="Toggle encouraged (half CIP cost)">
              <button
                className={styles.removeButton}
                onClick={() => toggleEncouraged(charSkill.skillId)}
                style={{ color: isEncouraged ? 'var(--success)' : undefined }}
              >
                <ChevronUp size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Toggle discouraged (double CIP cost)">
              <button
                className={styles.removeButton}
                onClick={() => toggleDiscouraged(charSkill.skillId)}
                style={{ color: isDiscouraged ? 'var(--danger)' : undefined }}
              >
                <ChevronDown size={14} />
              </button>
            </Tooltip>
            <button
              className={styles.removeButton}
              onClick={() => {
                const { skillId, isBroad, level } = charSkill;
                removeSkill(skillId);
                showUndo(`Removed ${def.name}`, () => addSkill(skillId, isBroad, level));
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </>
  );
}

function BroadSkillCatalog({
  skills,
  character,
  addSkill,
}: {
  skills: BroadSkillDefinition[];
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  addSkill: (id: string, isBroad: boolean, level: SkillLevel) => void;
}) {
  const ownedNarrowIds = new Set(character.skills.filter(s => !s.isBroad).map(s => s.skillId));

  return (
    <>
      {skills.map(def => {
        const baseScore = computeBaseScore(character.abilities, def.formula);
        const overlapping = def.encompasses.filter(id => ownedNarrowIds.has(id));
        return (
          <div key={def.id} className={styles.catalogItem}>
            <div>
              <div className={styles.catalogItemName}>{def.name}</div>
              <div className={styles.catalogItemDesc}>
                Base: {baseScore} — Costs: {def.costs.join('/')} CIP (S/T/M)
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                {def.encompasses.map(id => narrowSkillNameMap[id] || id).join(', ')}
              </div>
              {overlapping.length > 0 && (
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--warning)', marginTop: 2 }}>
                  Overlaps with {overlapping.length} owned narrow skill{overlapping.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <button className={styles.addButton} onClick={() => addSkill(def.id, true, 'S')}>
              <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Add
            </button>
          </div>
        );
      })}
    </>
  );
}

function NarrowSkillCatalog({
  groups,
  character,
  addSkill,
}: {
  groups: Record<string, SkillDefinition[]>;
  character: NonNullable<ReturnType<typeof useActiveCharacter>>;
  addSkill: (id: string, isBroad: boolean, level: SkillLevel) => void;
}) {
  return (
    <>
      {Object.entries(groups).map(([category, skills]) => (
        <div key={category}>
          <div className={styles.categoryHeader}>{category.replace('-', ' ')}</div>
          {skills.map(skill => {
            const baseScore = computeBaseScore(character.abilities, skill.formula);
            return (
              <div key={skill.id} className={styles.catalogItem}>
                <div>
                  <div className={styles.catalogItemName}>
                    {skill.name}
                    {skill.isInfo && <span style={{ color: 'var(--info)', marginLeft: 6, fontSize: '0.7rem' }}>[I]</span>}
                    {skill.isNew && <span style={{ color: 'var(--success)', marginLeft: 6, fontSize: '0.7rem' }}>NEW</span>}
                  </div>
                  <div className={styles.catalogItemDesc}>
                    Base: {baseScore}
                    {skill.unskilled !== undefined && ` — Unskilled: +${skill.unskilled}`}
                  </div>
                </div>
                <button className={styles.addButton} onClick={() => addSkill(skill.id, false, 'S')}>
                  <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Add
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
