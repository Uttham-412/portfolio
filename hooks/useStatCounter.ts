"use client";

import { useEffect, useRef, useState } from "react";
import { globalAnimationEngine } from "@/lib/animationEngine";

export function useStatCounter(target: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const animated = useRef(false);
  const counterId = useRef(`counter-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animated.current && globalAnimationEngine) {
            animated.current = true;
            const duration = 2500;
            const startTime = performance.now();

            const tick = () => {
              const elapsed = Math.min(performance.now() - startTime, duration);
              // Ease-out cubic
              const progress = 1 - Math.pow(1 - elapsed / duration, 3);
              const current = Math.floor(progress * target);
              setValue(current);

              if (elapsed >= duration) {
                setValue(target);
                globalAnimationEngine.unregisterTick(counterId.current);
              }
            };

            globalAnimationEngine.registerTick(counterId.current, tick);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (globalAnimationEngine) {
        globalAnimationEngine.unregisterTick(counterId.current);
      }
    };
  }, [target]);

  const display =
    value >= target && target >= 5 ? `${target}+` : String(value);

  return { ref, display };
}
