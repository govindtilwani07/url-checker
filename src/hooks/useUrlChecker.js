import { useState, useCallback } from 'react';
import { analyzeUrl } from '../utils/urlAnalyzer';

export function useUrlChecker() {
  const [state, setState] = useState({
    status: 'idle',   // idle | loading | success | error
    result: null,
    error: null,
  });

  const checkUrl = useCallback(async (rawInput) => {
    const url = rawInput.trim();
    if (!url) return;

    setState({ status: 'loading', result: null, error: null });

    try {
      const result = await analyzeUrl(url);
      setState({ status: 'success', result, error: null });
    } catch (err) {
      setState({ status: 'error', result: null, error: err.message });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', result: null, error: null });
  }, []);

  return { ...state, checkUrl, reset };
}
