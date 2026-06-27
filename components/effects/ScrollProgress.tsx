"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Skip on mobile — the scroll listener + spring + composited bar
  // all add up on low-end devices; the indicator is not touch-native UX
  if (prefersReducedMotion || isMobile) return null;

  return (
    <div className={styles.track} aria-hidden>
      <motion.div className={styles.bar} style={{ scaleX }} />
    </div>
  );
}
