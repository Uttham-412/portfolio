"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import HeroCodeBackground from "@/components/HeroCodeBackground";
import MagneticButton from "@/components/ui/MagneticButton";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Hero.module.css";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.15,
      staggerChildren: 0.1,
    },
  },
};

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: EASE,
    },
  },
};

const lineRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "105%",
  },
  visible: {
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.85,
      ease: EASE,
    },
  },
};

const profileVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 28,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.05,
      ease: EASE,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "115%",
    rotateX: 28,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: {
      duration: 0.95,
      ease: EASE,
      delay: index * 0.09,
    },
  }),
};

const actionsVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
    },
  },
};

const TITLE_WORDS = ["Uttham", "Poojary"];

const DESCRIPTION_LINES = [
  "Full-Stack Developer and AI enthusiast passionate about building intelligent, scalable, and impactful digital experiences that solve real-world problems through modern technology.",
];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // Treat mobile same as reduced-motion for expensive infinite animations
  const skipAnimation = prefersReducedMotion || isMobile;

  const floatTransition = skipAnimation
    ? undefined
    : {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut" as const,
      };

  const orbitTransition = skipAnimation
    ? undefined
    : {
        duration: 24,
        repeat: Infinity,
        ease: "linear" as const,
      };

  const borderSpinTransition = skipAnimation
    ? undefined
    : {
        duration: 5,
        repeat: Infinity,
        ease: "linear" as const,
      };

  const scrollDotTransition = skipAnimation
    ? undefined
    : {
        duration: 2.4,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1] as const,
        times: [0, 0.12, 0.88, 1],
      };

  const scrollPulseTransition = skipAnimation
    ? undefined
    : {
        duration: 2.4,
        repeat: Infinity,
        ease: "easeInOut" as const,
      };

  return (
    <motion.section
      id="hero"
      className={styles.hero}
      initial={skipAnimation ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <HeroCodeBackground reducedMotion={prefersReducedMotion} />

      <motion.div
        className={styles.content}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.profileBlock} variants={profileVariants}>
          <motion.div
            className={styles.orbitRing}
            animate={skipAnimation ? undefined : { rotate: 360 }}
            transition={orbitTransition}
            aria-hidden
          >
            <svg viewBox="0 0 200 200" className={styles.orbitSvg}>
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="url(#orbitGradient)"
                strokeWidth="1"
                strokeDasharray="12 18"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                  <stop offset="50%" stopColor="rgba(185,200,222,0.2)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          <motion.div
            className={styles.profileFloat}
            animate={
              skipAnimation
                ? undefined
                : {
                    y: [0, -11, -3, -13, 0],
                    rotate: [0, 0.6, -0.4, 0.5, 0],
                  }
            }
            transition={floatTransition}
          >
            <motion.div
              className={styles.profileGlow}
              animate={
                skipAnimation
                  ? undefined
                  : { opacity: [0.55, 1, 0.6, 0.95, 0.55], scale: [1, 1.08, 1.02, 1.06, 1] }
              }
              transition={
                skipAnimation
                  ? undefined
                  : { duration: 7, repeat: Infinity, ease: "easeInOut" }
              }
              aria-hidden
            />

            <div className={styles.profileRing}>
              <motion.div
                className={styles.profileBorderSpin}
                animate={skipAnimation ? undefined : { rotate: 360 }}
                transition={borderSpinTransition}
                aria-hidden
              />
              <motion.div
                className={styles.profileBorderGlow}
                animate={
                  skipAnimation
                    ? undefined
                    : { opacity: [0.4, 0.85, 0.5, 0.75, 0.4] }
                }
                transition={
                  skipAnimation
                    ? undefined
                    : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }
                aria-hidden
              />
              <div className={styles.profileInner}>
                <Image
                  src="/profile.png"
                  alt="Uttham Poojary"
                  fill
                  sizes="(max-width: 768px) 30vw, 176px"
                  className={styles.profileImage}
                  priority
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p className={styles.eyebrow} variants={revealVariants}>
          Full Stack Developer
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">AI &amp; Machine Learning Engineer</span>
        </motion.p>

        <h1 className={styles.title} aria-label="Uttham Poojary">
          {TITLE_WORDS.map((word, index) => (
            <span key={word} className={styles.titleWord}>
              <motion.span
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={styles.titleWordInner}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div className={styles.description} variants={revealVariants}>
          {DESCRIPTION_LINES.map((line) => (
            <span key={line} className={styles.descriptionLine}>
              <motion.span
                className={styles.descriptionLineInner}
                variants={lineRevealVariants}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.div>

        <motion.div className={styles.actions} variants={actionsVariants}>
          <MagneticButton
            href="#projects"
            className={styles.ctaPrimary}
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.12)",
                  }
            }
          >
            View My Work
          </MagneticButton>
          <MagneticButton href="#contact" className={styles.ctaSecondary}>
            Let&apos;s Connect
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scrollIndicator}
        aria-label="Scroll to about section"
        style={{ x: "-50%" }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.85, ease: EASE }}
      >
        <motion.span
          className={styles.scrollChevron}
          animate={skipAnimation ? undefined : { y: [0, 5, 0] }}
          transition={
            skipAnimation
              ? undefined
              : { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }
          aria-hidden
        >
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
        <span className={styles.scrollLabel}>Explore</span>
        <div className={styles.scrollTrack}>
          <motion.span
            className={styles.scrollPulse}
            animate={
              skipAnimation
                ? undefined
                : { scaleY: [0, 1, 0], opacity: [0, 0.5, 0], y: [0, 0, 0] }
            }
            transition={scrollPulseTransition}
            aria-hidden
          />
          <motion.span
            className={styles.scrollDot}
            animate={
              skipAnimation
                ? undefined
                : { y: [0, 52, 0], opacity: [0, 1, 1, 0] }
            }
            transition={scrollDotTransition}
            aria-hidden
          />
        </div>
      </motion.a>
    </motion.section>
  );
}
