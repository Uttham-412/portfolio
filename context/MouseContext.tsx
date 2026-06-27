"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";

type MouseContextValue = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  isPointerFine: boolean;
};

const MouseContext = createContext<MouseContextValue | null>(null);

export function MouseProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  // isPointerFine stays false on touch devices — all pointer-dependent effects
  // (magnetic, tilt, cursor glow, parallax) bail out via this flag.
  const [isPointerFine, setIsPointerFine] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring values are only consumed by pointer-fine effects.
  // On mobile these motion values sit idle, costing nothing.
  const springX = useSpring(x, { stiffness: 55, damping: 24, mass: 0.9 });
  const springY = useSpring(y, { stiffness: 55, damping: 24, mass: 0.9 });

  const centerPointer = useCallback(() => {
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight * 0.38);
  }, [x, y]);

  // RAF ref for throttling mousemove — keeps listener cost near zero
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const updatePointer = () => setIsPointerFine(media.matches);
    updatePointer();
    media.addEventListener("change", updatePointer);

    centerPointer();

    const onMove = (event: MouseEvent) => {
      // On touch devices media.matches is false — early return, zero work
      if (!media.matches || prefersReducedMotion) return;
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        x.set(event.clientX);
        y.set(event.clientY);
        rafRef.current = 0;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    // Resize only matters for re-centering the spring origin — cheap
    window.addEventListener("resize", centerPointer, { passive: true });

    return () => {
      media.removeEventListener("change", updatePointer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", centerPointer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [centerPointer, prefersReducedMotion, x, y]);

  const value = useMemo(
    () => ({ x, y, springX, springY, isPointerFine }),
    [x, y, springX, springY, isPointerFine],
  );

  return (
    <MouseContext.Provider value={value}>{children}</MouseContext.Provider>
  );
}

export function useMouse() {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error("useMouse must be used within MouseProvider");
  }
  return context;
}
