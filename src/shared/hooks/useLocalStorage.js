import { useState, useCallback } from 'react';

/**
 * @param {string} key
 * @param {string|null} initialValue
 * @returns {[string|null, (value: string|null) => void]}
 */
export function useLocalStorage(key, initialValue = null) {
  const [stored, setStored] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item != null ? item : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        setStored(value);
        if (value == null) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('useLocalStorage setItem error', e);
      }
    },
    [key]
  );

  return [stored, setValue];
}
