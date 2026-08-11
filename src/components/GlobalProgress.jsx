import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * GlobalProgress — YouTube / GitHub style route progress bar
 * Appears at the very top of the viewport on every route change.
 * Uses CSS classes for performance (no React state re-renders during animation).
 */
export default function GlobalProgress() {
  const { pathname } = useLocation();
  const barRef = useRef(null);
  const timerRef = useRef(null);
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    const bar = barRef.current;
    if (!bar) return;

    // Clear any pending timer
    clearTimeout(timerRef.current);

    // Start loading
    bar.classList.remove('done');
    bar.classList.add('loading');

    // Complete after 350ms (simulates route resolution)
    timerRef.current = setTimeout(() => {
      bar.classList.remove('loading');
      bar.classList.add('done');

      // Clean up "done" class after fade-out
      timerRef.current = setTimeout(() => {
        bar.classList.remove('done');
      }, 700);
    }, 350);

    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  return <div id="route-progress" ref={barRef} aria-hidden="true" />;
}
