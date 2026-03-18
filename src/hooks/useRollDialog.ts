import { useState, useCallback } from 'react';

interface RollDialogState {
  open: boolean;
  name: string;
  target: number;
}

export function useRollDialog() {
  const [state, setState] = useState<RollDialogState>({
    open: false,
    name: '',
    target: 0,
  });

  const openRoll = useCallback((name: string, target: number) => {
    setState({ open: true, name, target });
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setState(prev => ({ ...prev, open }));
  }, []);

  return { ...state, openRoll, setOpen };
}
