"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { globalAnimationEngine } from "@/lib/animationEngine";
import styles from "./LoadingScreen.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LoadingScreen() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(!prefersReducedMotion);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(false);
      return;
    }

    if (!globalAnimationEngine) return;

    const start = performance.now();
    const duration = 1800;

    const tick = () => {
      const elapsed = performance.now() - start;
      const next = Math.min(100, (elapsed / duration) * 100);
      setProgress(next);
      if (elapsed >= duration) {
        globalAnimationEngine.unregisterTick("loading-screen");
      }
    };

    globalAnimationEngine.registerTick("loading-screen", tick);

    const hideTimer = window.setTimeout(() => setVisible(false), 2100);

    return () => {
      if (globalAnimationEngine) {
        globalAnimationEngine.unregisterTick("loading-screen");
      }
      window.clearTimeout(hideTimer);
    };
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.screen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: EASE }}
          aria-hidden={!visible}
        >
          <div className={styles.inner}>
            <motion.div
              className={styles.logoMark}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <span className={styles.logoInitial}>U</span>
              <span className={styles.logoRing} aria-hidden />
            </motion.div>

            <motion.p
              className={styles.name}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              Uttham Poojary
            </motion.p>

            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            >
              AI & Full Stack Developer
            </motion.p>

            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressBar}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
