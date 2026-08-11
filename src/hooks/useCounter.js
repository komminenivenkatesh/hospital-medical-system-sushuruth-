import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

// Smooth count-up to a numeric target using framer-motion's animate().
export default function useCounter(target, { duration = 0.9, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(decimals ? Number(v.toFixed(decimals)) : Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration, decimals]);

  return display;
}
