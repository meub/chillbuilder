import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { rollD100, resolveRoll, DIFFICULTY_MODIFIERS, type RollResult, type ResultLevel } from '../../utils/roll';
import styles from './RollDialog.module.css';

interface RollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  baseTarget: number;
}

const RESULT_CLASSES: Record<ResultLevel, string> = {
  C: styles.resultC,
  H: styles.resultH,
  M: styles.resultM,
  L: styles.resultL,
  F: styles.resultF,
  B: styles.resultB,
};

const SPIN_DURATION = 800; // ms total
const SPIN_TICKS = 16;    // number of random numbers shown

export function RollDialog({ open, onOpenChange, name, baseTarget }: RollDialogProps) {
  const [modifier, setModifier] = useState(0);
  const [result, setResult] = useState<RollResult | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const spinRef = useRef<number>(0);

  // Clean up animation on unmount / close
  useEffect(() => {
    return () => { cancelAnimationFrame(spinRef.current); };
  }, []);

  const handleRoll = useCallback(() => {
    const finalRoll = rollD100();
    const finalResult = resolveRoll(finalRoll, baseTarget, modifier);

    setResult(null);
    setSpinning(true);

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);

      if (progress < 1) {
        // Show random numbers, slowing down as we approach the end
        // Interval increases with easeOutQuad
        const tickIndex = Math.floor(progress * SPIN_TICKS);
        const prevTickIndex = Math.floor(((now - 16) - startTime) / SPIN_DURATION * SPIN_TICKS);

        if (tickIndex !== prevTickIndex || elapsed < 20) {
          setDisplayValue(Math.floor(Math.random() * 100) + 1);
        }

        spinRef.current = requestAnimationFrame(tick);
      } else {
        // Animation done — show final result
        setDisplayValue(finalRoll);
        setSpinning(false);
        setResult(finalResult);
      }
    }

    spinRef.current = requestAnimationFrame(tick);
  }, [baseTarget, modifier]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setResult(null);
      setDisplayValue(null);
      setSpinning(false);
      cancelAnimationFrame(spinRef.current);
    }
    onOpenChange(next);
  };

  const effectiveTarget = Math.max(1, baseTarget + modifier);

  const showingResult = result && !spinning;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content className={styles.dialog}>
            <div className={styles.header}>
              <Dialog.Title className={styles.rollName}>{name}</Dialog.Title>
              <div className={styles.rollTarget}>
                Target: {effectiveTarget}
                {modifier !== 0 && (
                  <span> ({baseTarget} {modifier > 0 ? '+' : ''}{modifier})</span>
                )}
              </div>
            </div>

            {/* Difficulty modifier */}
            <div className={styles.modifierRow}>
              <span className={styles.modifierLabel}>Difficulty:</span>
              <div className={styles.modifierGroup}>
                {DIFFICULTY_MODIFIERS.map(dm => (
                  <button
                    key={dm.value}
                    className={`${styles.modifierOption} ${modifier === dm.value ? styles.modifierOptionActive : ''}`}
                    onClick={() => {
                      setModifier(dm.value);
                      setResult(null);
                      setDisplayValue(null);
                    }}
                    disabled={spinning}
                  >
                    {dm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dice result area */}
            <div className={styles.diceArea}>
              {displayValue !== null ? (
                <>
                  <div
                    className={`${styles.diceValue} ${spinning ? styles.diceSpinning : ''} ${showingResult ? styles.diceLanded : ''}`}
                    style={{
                      color: showingResult
                        ? (result.result === 'B' || result.result === 'F' ? 'var(--danger)' : 'var(--text-primary)')
                        : 'var(--text-muted)',
                    }}
                  >
                    {displayValue}
                  </div>
                  {showingResult && (
                    <div className={`${styles.resultBadge} ${RESULT_CLASSES[result.result]} ${styles.resultReveal}`}>
                      {result.label}
                    </div>
                  )}
                  {showingResult && (
                    <div className={`${styles.breakdown} ${styles.breakdownReveal}`}>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownValue}>{Math.floor(effectiveTarget / 4)}</div>
                        <div>C</div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownValue}>{Math.floor(effectiveTarget / 2)}</div>
                        <div>H</div>
                      </div>
                      <div className={styles.breakdownItem}>
                        <div className={styles.breakdownValue}>{effectiveTarget}</div>
                        <div>Target</div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.diceValue} style={{ color: 'var(--text-muted)' }}>
                  —
                </div>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={styles.rollButton} onClick={handleRoll} disabled={spinning}>
                {spinning ? 'Rolling...' : result ? 'Roll Again' : 'Roll d100'}
              </button>
              <Dialog.Close asChild>
                <button className={styles.closeButton} disabled={spinning}>Close</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
