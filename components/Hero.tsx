"use client";

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import styles from "./Hero.module.css";

const PROFILE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBDWzwNygYjOi-JQfm4nIXBVphiJhlHUVgcju_vpg4cthB_twAK3XqOvGj95peRFhhfBTZyJMDjPwE9EE26e3p3sWExsjSdMG2-rh08lNlFNr5bFmHWxi3o_FsLWIbblCHwm0UfcYb4i5K43skyREpcjrgq6CzH1eE9HfWZ0YIUEA4zp80P8TEidFlMNrcOUcIDwVtw7K-yd9KjwhT8sbCgoNGTCmkgvWom2-y1RXr-mK0noD1k0lQm-QZ4AJupteCZ2yWammtRfAs";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.11,
    },
  },
};

const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.85,
      ease: EASE,
    },
  },
};

const profileVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: EASE,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: "110%",
  },
  visible: (index: number) => ({
    opacity: 1,
    y: "0%",
    transition: {
      duration: 0.9,
      ease: EASE,
      delay: index * 0.08,
    },
  }),
};

const actionsVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: EASE,
      delay: 0.05,
    },
  },
};

const TITLE_WORDS = ["Uttham", "Poojary"];

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const floatTransition = prefersReducedMotion
    ? undefined
    : {
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut" as const,
      };

  const scrollDotTransition = prefersReducedMotion
    ? undefined
    : {
        duration: 2.6,
        repeat: Infinity,
        ease: [0.45, 0, 0.55, 1] as const,
        times: [0, 0.15, 0.85, 1],
      };

  return (
    <motion.section
      id="hero"
      className={styles.hero}
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      <div className={styles.background} aria-hidden="true">
        <div className={styles.aurora}>
          <div className={styles.auroraLayer1} />
          <div className={styles.auroraLayer2} />
          <div className={styles.auroraLayer3} />
        </div>
        <div className={styles.orbs}>
          <div className={`${styles.orb} ${styles.orb1}`} />
          <div className={`${styles.orb} ${styles.orb2}`} />
          <div className={`${styles.orb} ${styles.orb3}`} />
        </div>
        <div className={styles.noise} />
        <div className={styles.vignette} />
      </div>

      <motion.div
        className={styles.content}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.profileBlock} variants={profileVariants}>
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { y: [0, -7, 0] }
            }
            transition={floatTransition}
          >
            <motion.div
              className={styles.profileGlow}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.65, 1, 0.65], scale: [1, 1.05, 1] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <div className={styles.profileRing}>
              <div className={styles.profileInner}>
                <Image
                  src={PROFILE_IMAGE}
                  alt="Uttham Poojary — professional portrait"
                  fill
                  className="object-cover grayscale contrast-[1.1] brightness-90 hover:grayscale-0 transition-all duration-700 ease-in-out"
                  priority
                  sizes="(max-width: 768px) 120px, 176px"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p className={styles.eyebrow} variants={revealVariants}>
          AI &amp; Machine Learning Engineer
          <span className="hidden sm:inline"> · </span>
          <span className="block sm:inline">Full Stack Developer</span>
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

        <motion.p className={styles.description} variants={revealVariants}>
          Building intelligent software, AI-powered applications, and scalable
          digital experiences with precision and architectural excellence.
        </motion.p>

        <motion.div className={styles.actions} variants={actionsVariants}>
          <motion.a
            href="#projects"
            className={styles.ctaPrimary}
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    scale: 1.02,
                    y: -2,
                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.12)",
                  }
            }
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            View Projects
          </motion.a>
          <motion.a
            href="#contact"
            className={styles.ctaSecondary}
            whileHover={
              prefersReducedMotion
                ? undefined
                : {
                    scale: 1.02,
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.07)",
                    borderColor: "rgba(255, 255, 255, 0.22)",
                  }
            }
            whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scrollIndicator}
        aria-label="Scroll to about section"
        style={{ x: "-50%" }}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.15, duration: 0.8, ease: EASE }}
      >
        <span className={styles.scrollLabel}>Explore</span>
        <div className={styles.scrollTrack}>
          <motion.span
            className={styles.scrollDot}
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, 52, 0], opacity: [0, 1, 1, 0] }
            }
            transition={scrollDotTransition}
          />
        </div>
      </motion.a>
    </motion.section>
  );
}
