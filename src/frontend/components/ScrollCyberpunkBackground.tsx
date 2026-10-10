'use client';

import { useEffect, useRef } from 'react';

export default function ScrollCyberpunkBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const background = backgroundRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!background) return;

    let frame = 0;

    const updateBackgroundPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = reducedMotion.matches ? 0 : Math.min(window.scrollY * 0.12, 520);
        background.style.setProperty('--scroll-offset', `${offset}px`);
      });
    };

    updateBackgroundPosition();
    window.addEventListener('scroll', updateBackgroundPosition, { passive: true });
    reducedMotion.addEventListener('change', updateBackgroundPosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateBackgroundPosition);
      reducedMotion.removeEventListener('change', updateBackgroundPosition);
    };
  }, []);

  return (
    <div aria-hidden="true" className="xp-scroll-background" ref={backgroundRef}>
      <div className="xp-scroll-background-image" />
    </div>
  );
}
