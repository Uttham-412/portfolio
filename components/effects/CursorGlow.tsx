"use client";

import { motion, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useMouse } from "@/context/MouseContext";
import styles from "./CursorGlow.module.css";

export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const { springX, springY, isPointerFine } = useMouse();

  const glow = useMotionTemplate`radial-gradient(
    280px circle at ${springX}px ${springY}px,
    rgba(255, 255, 255, 0.07) 0%,
    rgba(185, 200, 222, 0.03) 35%,
    transparent 70%
  )`;

  if (prefersReducedMotion || !isPointerFine) return null;

  return (
    <motion.div
      className={styles.glow}
      style={{ background: glow }}
      aria-hidden
    />
  );
}
