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
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setValue(target);
                clearInterval(timer);
              } else {
                setValue(Math.floor(current));
              }
            }, stepTime);
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
