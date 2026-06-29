"use client";

import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Skip on mobile — the scroll listener + spring + composited bar
  // all add up on low-end devices; the indicator is not touch-native UX
  if (prefersReducedMotion || isMobile) return null;

  return (
    <div className={styles.track} aria-hidden>
      <div
        className={styles.bar}
        style={{
          transform: "scaleX(var(--scroll-progress-spring, 0))",
        }}
      />
    </div>
  );
}
