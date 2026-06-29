"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { globalAnimationEngine } from "@/lib/animationEngine";

type MouseContextValue = {
  isPointerFine: boolean;
};

const MouseContext = createContext<MouseContextValue | null>(null);

export function MouseProvider({ children }: { children: ReactNode }) {
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    if (!globalAnimationEngine) return;
    setIsPointerFine(globalAnimationEngine.isPointerFine);

    const media = window.matchMedia("(pointer: fine)");
    const updatePointer = () => setIsPointerFine(media.matches);
    media.addEventListener("change", updatePointer);
    return () => {
      media.removeEventListener("change", updatePointer);
    };
  }, []);

  const value = { isPointerFine };

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
