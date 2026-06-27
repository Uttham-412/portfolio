"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import styles from "./ScrollProgress.module.css";

export default function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <div className={styles.track} aria-hidden>
      <motion.div className={styles.bar} style={{ scaleX }} />
    </div>
  );
}
