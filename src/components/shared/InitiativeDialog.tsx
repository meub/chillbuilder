import { useState, useCallback, useRef, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { rollD10 } from '../../utils/roll';
import styles from './RollDialog.module.css';

interface InitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SPIN_DURATION = 600;
const SPIN_TICKS = 12;

export function InitiativeDialog({ open, onOpenChange }: InitiativeDialogProps) {
  const [result, setResult] = useState<{ roll: number; total: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const spinRef = useRef<number>(0);

  useEffect(() => {
    return () => { cancelAnimationFrame(spinRef.current); };
  }, []);

  const handleRoll = useCallback(() => {
    const finalRoll = rollD10();
    const finalTotal = 4 + finalRoll;

    setResult(null);
    setSpinning(true);

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);

      if (progress < 1) {
        const tickIndex = Math.floor(progress * SPIN_TICKS);
        const prevTickIndex = Math.floor(((now - 16) - startTime) / SPIN_DURATION * SPIN_TICKS);
        if (tickIndex !== prevTickIndex || elapsed < 20) {
          setDisplayValue(4 + rollD10());
        }
        spinRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(finalTotal);
        setSpinning(false);
        setResult({ roll: finalRoll, total: finalTotal });
      }
    }

    spinRef.current = requestAnimationFrame(tick);
  }, []);

  // Enter key to roll
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !spinning) {
        e.preventDefault();
        handleRoll();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, spinning, handleRoll]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setResult(null);
      setDisplayValue(null);
      setSpinning(false);
      cancelAnimationFrame(spinRef.current);
    }
    onOpenChange(next);
  };

  const showingResult = result && !spinning;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay}>
          <Dialog.Content className={styles.dialog}>
            <div className={styles.header}>
              <Dialog.Title className={styles.rollName}>Initiative</Dialog.Title>
              <div className={styles.rollTarget}>4 + 1D10 (range 5–14)</div>
            </div>

            <div className={styles.diceArea}>
              <div
                className={`${styles.diceValue} ${spinning ? styles.diceSpinning : ''} ${showingResult ? styles.diceLanded : ''}`}
                style={{ color: showingResult ? 'var(--text-primary)' : 'var(--text-muted)' }}
              >
                {displayValue ?? '—'}
              </div>
              <div
                className={styles.resultBadge}
                style={{
                  visibility: showingResult ? 'visible' : 'hidden',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  border: '2px solid #60a5fa',
                }}
              >
                {showingResult ? `4 + ${result.roll}` : 'Placeholder'}
              </div>
              <div
                className={styles.breakdown}
                style={{ visibility: showingResult ? 'visible' : 'hidden' }}
              >
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownValue}>5</div>
                  <div>Min</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownValue}>{showingResult ? result.total : '—'}</div>
                  <div>Result</div>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownValue}>14</div>
                  <div>Max</div>
                </div>
              </div>
            </div>

            <div className={styles.cryptoNote}>
              Uses cryptographic randomness (Web Crypto API)
            </div>

            <div className={styles.actions}>
              <button className={styles.rollButton} onClick={handleRoll} disabled={spinning}>
                {spinning ? 'Rolling...' : result ? 'Roll Again' : 'Roll 1D10'}
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
