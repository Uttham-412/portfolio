"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  const [isPointerFine, setIsPointerFine] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 55, damping: 24, mass: 0.9 });
  const springY = useSpring(y, { stiffness: 55, damping: 24, mass: 0.9 });

  const centerPointer = useCallback(() => {
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight * 0.38);
  }, [x, y]);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const updatePointer = () => setIsPointerFine(media.matches);
    updatePointer();
    media.addEventListener("change", updatePointer);

    centerPointer();

    const onMove = (event: MouseEvent) => {
      if (!media.matches || prefersReducedMotion) return;
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", centerPointer);

    return () => {
      media.removeEventListener("change", updatePointer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", centerPointer);
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
