import { useState, useCallback } from 'react';

interface UndoState {
  visible: boolean;
  message: string;
  undoAction: (() => void) | null;
}

export function useUndoToast() {
  const [state, setState] = useState<UndoState>({
    visible: false,
    message: '',
    undoAction: null,
  });

  const show = useCallback((message: string, undoAction: () => void) => {
    setState({ visible: true, message, undoAction });
  }, []);

  const dismiss = useCallback(() => {
    setState({ visible: false, message: '', undoAction: null });
  }, []);

  const undo = useCallback(() => {
    state.undoAction?.();
  }, [state.undoAction]);

  return { ...state, show, dismiss, undo };
}
