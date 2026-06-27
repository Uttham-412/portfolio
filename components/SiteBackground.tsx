"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion } from "framer-motion";
import { useMouse } from "@/context/MouseContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./SiteBackground.module.css";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
};

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId = 0;
    let paused = false;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Mobile: max 8 particles. Desktop: max 32.
      const max = isMobile ? 8 : 32;
      const count = Math.min(max, Math.floor(window.innerWidth / 55));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.4,
        speedX: (Math.random() - 0.5) * (isMobile ? 0.08 : 0.15),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.08 : 0.15),
        opacity: Math.random() * 0.3 + 0.07,
      }));
    };

    const draw = () => {
      if (paused) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    // Pause when tab is hidden — saves GPU + battery on mobile
    const handleVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();
    draw();
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearTimeout(resizeTimer);
    };
  }, [prefersReducedMotion, isMobile]);

  if (prefersReducedMotion) return null;

  return (
    <canvas ref={canvasRef} className={styles.particles} aria-hidden />
  );
}

function MouseSpotlight() {
  const prefersReducedMotion = useReducedMotion();
  const { springX, springY, isPointerFine } = useMouse();

  const spotlight = useMotionTemplate`radial-gradient(
    clamp(420px, 58vw, 760px) circle at ${springX}px ${springY}px,
    rgba(255, 255, 255, 0.055) 0%,
    rgba(255, 255, 255, 0.018) 34%,
    transparent 64%
  )`;

  // isPointerFine=false on mobile — this component simply doesn't render
  if (prefersReducedMotion || !isPointerFine) return null;

  return (
    <motion.div
      className={styles.spotlight}
      style={{ background: spotlight }}
      aria-hidden
    />
  );
}

export default function SiteBackground() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.base} />
      <div className={styles.aurora}>
        <div className={styles.auroraBand1} />
        <div className={styles.auroraBand2} />
        <div className={styles.auroraBand3} />
        <div className={styles.auroraBand4} />
      </div>
      <div className={styles.grid} />
      <div className={styles.gridGlow} />
      <MouseSpotlight />
      <FloatingParticles />
      <div className={styles.radialGlow} />
      <div className={styles.orbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={`${styles.orb} ${styles.orb4}`} />
      </div>
      <div className={styles.noise} />
      <div className={styles.vignette} />
    </div>
  );
}
