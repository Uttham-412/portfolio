"use client";

import { useEffect, useRef, useState } from "react";

export function useStatCounter(target: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current) {
            animated.current = true;
            const duration = 2500;
            const startTime = performance.now();
            let rafId = 0;

            const tick = (now: number) => {
              const elapsed = Math.min(now - startTime, duration);
              // Ease-out cubic
              const progress = 1 - Math.pow(1 - elapsed / duration, 3);
              const current = Math.floor(progress * target);
              setValue(current);
              if (elapsed < duration) {
                rafId = requestAnimationFrame(tick);
              } else {
                setValue(target);
              }
            };

            rafId = requestAnimationFrame(tick);

            // Cleanup if component unmounts mid-animation
            return () => cancelAnimationFrame(rafId);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const display =
    value >= target && target >= 5 ? `${target}+` : String(value);

  return { ref, display };
}
