"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is narrower than 768px.
 * Initialises to false (SSR-safe) and updates after mount.
 * Uses matchMedia so it only triggers on breakpoint crossing,
 * not on every resize tick.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
