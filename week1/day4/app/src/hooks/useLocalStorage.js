import { useCallback, useState } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = localStorage.getItem(key);

      return storedValue !== null
        ? JSON.parse(storedValue)
        : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      setValue((currentValue) => {
        const valueToStore =
          typeof newValue === 'function'
            ? newValue(currentValue)
            : newValue;

        try {
          localStorage.setItem(
            key,
            JSON.stringify(valueToStore)
          );
        } catch {
          // Ignore localStorage errors.
        }

        return valueToStore;
      });
    },
    [key]
  );

  return [value, setStoredValue];
}