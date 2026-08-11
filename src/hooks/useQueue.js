import { useEffect, useState } from 'react';

// Simulates a live queue that decrements over time + a countdown to call start.
export default function useQueue({ startPosition = 4, total = 8, secondsToStart = 2 * 3600 + 34 * 60 } = {}) {
  const [position, setPosition] = useState(startPosition);
  const [secondsLeft, setSecondsLeft] = useState(secondsToStart);

  useEffect(() => {
    if (position <= 1) return undefined;
    const id = setInterval(() => {
      setPosition((p) => (p > 1 ? p - 1 : p));
    }, 8000);
    return () => clearInterval(id);
  }, [position]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const estMinutes = Math.max(0, (position - 1) * 7);
  const canJoin = secondsLeft <= 10 * 60;
  const fmt = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m ${sec}s`;
  };

  return { position, total, secondsLeft, estMinutes, canJoin, countdown: fmt(secondsLeft) };
}
