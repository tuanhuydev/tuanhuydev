import { useCallback, useEffect, useRef } from "react";

/**
 * Debounce hook that prevents stale closures
 * Uses ref pattern to always call the latest callback version
 */
export function useDebounce<T extends unknown[]>(callback: (...args: T) => void, delay: number): (...args: T) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args); // Always uses latest callback
      }, delay);
    },
    [delay], // Only recreate if delay changes
  );
}
