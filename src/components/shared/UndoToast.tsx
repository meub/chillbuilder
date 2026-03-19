import { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import styles from './UndoToast.module.css';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: UndoToastProps) {
  const [leaving, setLeaving] = useState(false);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(onDismiss, 150);
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  const handleUndo = () => {
    onUndo();
    setLeaving(true);
    setTimeout(onDismiss, 150);
  };

  return (
    <div className={styles.toast} data-leaving={leaving}>
      <span className={styles.message}>{message}</span>
      <button className={styles.undoButton} onClick={handleUndo}>Undo</button>
      <button className={styles.dismissButton} onClick={dismiss}><X size={14} /></button>
    </div>
  );
}
