"use client";

import { useReducedMotion } from "framer-motion";
import { useMouse } from "@/context/MouseContext";
import styles from "./CursorGlow.module.css";

export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const { isPointerFine } = useMouse();

  if (prefersReducedMotion || !isPointerFine) return null;

  return (
    <div
      className={styles.glow}
      style={{
        background: `radial-gradient(
          280px circle at var(--spring-mouse-x) var(--spring-mouse-y),
          rgba(255, 255, 255, 0.07) 0%,
          rgba(185, 200, 222, 0.03) 35%,
          transparent 70%
        )`,
      }}
      aria-hidden
    />
  );
}
