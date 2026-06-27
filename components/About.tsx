"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import styles from "./About.module.css";

const techStack = ["Python", "React", "PyTorch", "Node.js", "Docker"];

const stats = [
  { target: 8.28, icon: "school", label: "CGPA", kind: "decimal" as const },
  { target: 4, icon: "rocket_launch", label: "Projects", kind: "counter" as const, suffix: "+" },
  { target: 1, icon: "work", label: "Internship", kind: "counter" as const },
  { target: 2027, icon: "history_edu", label: "Graduation", kind: "counter" as const },
];

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(4px)",
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const statContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

function useAnimatedStat(
  target: number,
  kind: "counter" | "decimal",
  suffix = "",
) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });
  const [value, setValue] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const startValue = kind === "counter" && target > 100 ? target - 30 : 0;

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setValue(target);
      return;
    }

    const controls = animate(startValue, target, {
      duration: kind === "decimal" ? 2.4 : target > 100 ? 1.8 : 2.2,
      ease: EASE,
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [isInView, target, prefersReducedMotion, kind, startValue]);

  const display =
    kind === "decimal"
      ? value.toFixed(2)
      : value >= target
        ? `${target}${suffix}`
        : String(Math.round(value));

  return { ref, display };
}

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  return (
    <AnimatedStatCard
      icon={stat.icon}
      label={stat.label}
      target={stat.target}
      kind={stat.kind}
      suffix={stat.suffix ?? ""}
    />
  );
}

function AnimatedStatCard({
  icon,
  label,
  target,
  kind,
  suffix,
}: {
  icon: string;
  label: string;
  target: number;
  kind: "counter" | "decimal";
  suffix: string;
}) {
  const { ref, display } = useAnimatedStat(target, kind, suffix);

  return (
    <TiltCard
      className={`${styles.glassCard} ${styles.statCard}`}
      variants={fadeUpVariants}
      maxTilt={6}
    >
      <div className={styles.statIconWrap}>
        <span className={`material-symbols-outlined ${styles.statIcon}`}>
          {icon}
        </span>
      </div>
      <div className={styles.statNumberSlot}>
        <span ref={ref} className={styles.statNumber}>
          {display}
        </span>
      </div>
      <p className={styles.statLabel}>{label}</p>
    </TiltCard>
  );
}

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: prefersReducedMotion ? 0 : 0.08,
  });

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`${styles.section} section-gradient`}
    >
      <div className={styles.container}>
        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className={styles.biography}>
            <motion.div className={styles.introBlock} variants={fadeUpVariants}>
              <div className={styles.headerGroup}>
                <span className={styles.eyebrow}>Introduction</span>
                <h2 className={styles.title}>
                  Who I <span className="serif-italic">Am</span>
                </h2>
              </div>
              <p className={styles.introText}>
                <span className={styles.introHighlight}>Full Stack Developer</span>{" "}
                passionate about building AI-powered web applications with clean UI,
                scalable backend systems, and modern technologies.
              </p>
            </motion.div>

            <motion.div
              className={styles.educationBlock}
              variants={fadeUpVariants}
            >
              <div className={styles.sectionHeadingRow}>
                <h3 className={styles.sectionHeading}>Education</h3>
                <div className={styles.sectionRule} />
              </div>
              <TiltCard
                className={`${styles.glassCard} ${styles.educationCard}`}
                maxTilt={5}
              >
                <div className={styles.educationInner}>
                  <div className={styles.educationIcon}>
                    <span
                      className={`material-symbols-outlined ${styles.educationIconSymbol}`}
                    >
                      school
                    </span>
                  </div>
                  <div className={styles.educationContent}>
                    <h4 className={styles.schoolName}>
                      Canara Engineering College
                    </h4>
                    <div className={styles.degreeMeta}>
                      <span className={styles.degreeLabel}>
                        B.E. in AI &amp; Machine Learning
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </div>

          <TiltCard
            className={`${styles.glassCard} ${styles.techPanel}`}
            variants={fadeUpVariants}
            maxTilt={5}
          >
            <div className={styles.techGlow}>
              <div className={styles.techGlowPrimary} />
              <div className={styles.techGlowSecondary} />
            </div>
            <div className={styles.techContent}>
              <div className={styles.techIconRing}>
                <span
                  className={`material-symbols-outlined ${styles.techIcon}`}
                >
                  terminal
                </span>
              </div>
              <p className={styles.techLabel}>Specialized Tech Stack</p>
              <div className={styles.techTags}>
                {techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className={styles.techTag}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 12, scale: 0.96 }
                    }
                    animate={
                      isInView
                        ? { opacity: 1, y: 0, scale: 1 }
                        : { opacity: 0, y: 12, scale: 0.96 }
                    }
                    transition={{
                      duration: 0.55,
                      ease: EASE,
                      delay: prefersReducedMotion ? 0 : 0.45 + index * 0.07,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div
          className={styles.statsGrid}
          variants={statContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
