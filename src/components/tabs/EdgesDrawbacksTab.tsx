import { useState } from 'react';
import { Search, Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useActiveCharacter } from '../../hooks/useActiveCharacter';
import { useCharacterStore } from '../../store/useCharacterStore';
import { useUndoToast } from '../../hooks/useUndoToast';
import { Tooltip } from '../shared/Tooltip';
import { UndoToast } from '../shared/UndoToast';
import { edges } from '../../data/edges';
import { drawbacks } from '../../data/drawbacks';
import styles from '../shared/shared.module.css';

export function EdgesDrawbacksTab() {
  const character = useActiveCharacter();
  const addEdge = useCharacterStore(s => s.addEdge);
  const updateEdge = useCharacterStore(s => s.updateEdge);
  const removeEdge = useCharacterStore(s => s.removeEdge);
  const addDrawback = useCharacterStore(s => s.addDrawback);
  const updateDrawback = useCharacterStore(s => s.updateDrawback);
  const removeDrawback = useCharacterStore(s => s.removeDrawback);
  const [edgeSearch, setEdgeSearch] = useState('');
  const [drawbackSearch, setDrawbackSearch] = useState('');
  const undoToast = useUndoToast();

  if (!character) return null;

  const ownedEdgeIds = new Set(character.edges.map(e => e.edgeId));
  const ownedDrawbackIds = new Set(character.drawbacks.map(d => d.drawbackId));

  const filteredEdges = edges.filter(e =>
    !ownedEdgeIds.has(e.id) && e.name.toLowerCase().includes(edgeSearch.toLowerCase())
  );
  const filteredDrawbacks = drawbacks.filter(d =>
    !ownedDrawbackIds.has(d.id) && d.name.toLowerCase().includes(drawbackSearch.toLowerCase())
  );

  return (
    <div className={styles.tabPage}>
      <h2 className={styles.tabTitle}>Edges & Drawbacks</h2>

      {/* Owned Edges */}
      {character.edges.length > 0 && (
        <>
          <div className={styles.categoryHeader}>Your Edges</div>
          {character.edges.map(charEdge => {
            const def = edges.find(e => e.id === charEdge.edgeId);
            if (!def) return null;
            const cost = charEdge.customCost ?? def.cost * charEdge.purchases;
            return (
              <div key={charEdge.edgeId} className={styles.skillRow}>
                <div>
                  <Tooltip content={def.description} side="right">
                    <div className={styles.skillName}>{def.name}</div>
                  </Tooltip>
                  <div className={styles.skillBase}>{def.description}</div>
                </div>
                {(def.maxPurchases === 0 || def.maxPurchases > 1) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      className={styles.removeButton}
                      onClick={() => {
                        if (charEdge.purchases > 1) updateEdge(charEdge.edgeId, charEdge.purchases - 1);
                        else removeEdge(charEdge.edgeId);
                      }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
                      {charEdge.purchases}x
                    </span>
                    <button
                      className={styles.removeButton}
                      onClick={() => {
                        if (def.maxPurchases === 0 || charEdge.purchases < def.maxPurchases) {
                          updateEdge(charEdge.edgeId, charEdge.purchases + 1);
                        }
                      }}
                    >
                      <ChevronUp size={14} />
                    </button>
                  </div>
                )}
                {def.variableCost && (
                  <input
                    type="number"
                    className={styles.inlineNumber}
                    value={charEdge.customCost ?? def.cost}
                    onChange={e => updateEdge(charEdge.edgeId, charEdge.purchases, Number(e.target.value))}
                    min={1}
                    max={10}
                  />
                )}
                <div className={styles.skillCip}>{cost} CIP</div>
                <button className={styles.removeButton} onClick={() => {
                  const saved = { ...charEdge };
                  removeEdge(charEdge.edgeId);
                  undoToast.show(`Removed ${def.name}`, () => addEdge(saved.edgeId, saved.purchases, saved.customCost));
                }}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* Add Edges */}
      <div className={styles.categoryHeader} style={{ marginTop: 24 }}>Add Edges</div>
      <div className={styles.searchWrapper} style={{ marginTop: 12 }}>
        <Search size={16} className={styles.searchIcon} />
        <input className={styles.searchInput} placeholder="Search edges..." value={edgeSearch} onChange={e => setEdgeSearch(e.target.value)} />
      </div>
      {filteredEdges.map(edge => (
        <div key={edge.id} className={styles.catalogItem}>
          <div>
            <div className={styles.catalogItemName}>
              {edge.name}
              {edge.maxPurchases === 0 && <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: '0.7rem' }}>stackable</span>}
            </div>
            <div className={styles.catalogItemDesc}>{edge.description}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={styles.catalogItemCost}>{edge.variableCost ? '1-10' : edge.cost} CIP</span>
            <button className={styles.addButton} onClick={() => addEdge(edge.id, 1, edge.variableCost ? edge.cost : undefined)}>
              <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Add
            </button>
          </div>
        </div>
      ))}

      {/* Owned Drawbacks */}
      {character.drawbacks.length > 0 && (
        <>
          <div className={styles.categoryHeader} style={{ marginTop: 32 }}>Your Drawbacks</div>
          {character.drawbacks.map(charDb => {
            const def = drawbacks.find(d => d.id === charDb.drawbackId);
            if (!def) return null;
            const bonus = charDb.customBonus ?? def.cipBonus * charDb.purchases;
            return (
              <div key={charDb.drawbackId} className={styles.skillRow}>
                <div>
                  <Tooltip content={def.description} side="right">
                    <div className={styles.skillName}>{def.name}</div>
                  </Tooltip>
                  <div className={styles.skillBase}>{def.description}</div>
                </div>
                {(def.maxPurchases === 0 || def.maxPurchases > 1) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      className={styles.removeButton}
                      onClick={() => {
                        if (charDb.purchases > 1) updateDrawback(charDb.drawbackId, charDb.purchases - 1);
                        else removeDrawback(charDb.drawbackId);
                      }}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <span style={{ minWidth: 20, textAlign: 'center', fontSize: 'var(--font-size-sm)' }}>
                      {charDb.purchases}x
                    </span>
                    <button
                      className={styles.removeButton}
                      onClick={() => {
                        if (def.maxPurchases === 0 || charDb.purchases < def.maxPurchases) {
                          updateDrawback(charDb.drawbackId, charDb.purchases + 1);
                        }
                      }}
                    >
                      <ChevronUp size={14} />
                    </button>
                  </div>
                )}
                {def.variableBonus && (
                  <input
                    type="number"
                    className={styles.inlineNumber}
                    value={charDb.customBonus ?? def.cipBonus}
                    onChange={e => updateDrawback(charDb.drawbackId, charDb.purchases, Number(e.target.value))}
                    min={1}
                    max={10}
                  />
                )}
                <div className={styles.skillCip}>+{bonus} CIP</div>
                <button className={styles.removeButton} onClick={() => {
                  const saved = { ...charDb };
                  removeDrawback(charDb.drawbackId);
                  undoToast.show(`Removed ${def.name}`, () => addDrawback(saved.drawbackId, saved.purchases, saved.customBonus));
                }}>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </>
      )}

      {/* Add Drawbacks */}
      <div className={styles.categoryHeader} style={{ marginTop: 24 }}>Add Drawbacks</div>
      <div className={styles.searchWrapper} style={{ marginTop: 12 }}>
        <Search size={16} className={styles.searchIcon} />
        <input className={styles.searchInput} placeholder="Search drawbacks..." value={drawbackSearch} onChange={e => setDrawbackSearch(e.target.value)} />
      </div>
      {filteredDrawbacks.map(db => (
        <div key={db.id} className={styles.catalogItem}>
          <div>
            <div className={styles.catalogItemName}>
              {db.name}
              {db.maxPurchases === 0 && <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: '0.7rem' }}>stackable</span>}
            </div>
            <div className={styles.catalogItemDesc}>{db.description}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={styles.catalogItemCost}>+{db.variableBonus ? 'var' : db.cipBonus} CIP</span>
            <button className={styles.addButton} onClick={() => addDrawback(db.id, 1, db.variableBonus ? db.cipBonus : undefined)}>
              <Plus size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
              Add
            </button>
          </div>
        </div>
      ))}

      {undoToast.visible && (
        <UndoToast message={undoToast.message} onUndo={undoToast.undo} onDismiss={undoToast.dismiss} />
      )}
    </div>
  );
}
