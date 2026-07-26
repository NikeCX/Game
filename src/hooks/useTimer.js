import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(totalSeconds, { onExpire, autoStart = true } = {}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!running) return undefined;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const pause = useCallback(() => setRunning(false), []);
  const resume = useCallback(() => setRunning(true), []);
  const reset = useCallback(
    (newTotal = totalSeconds) => {
      setRemaining(newTotal);
    },
    [totalSeconds]
  );

  return { remaining, running, pause, resume, reset };
}
