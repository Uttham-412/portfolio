"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Experience.module.css";

const timelineItems = [
  {
    year: "2023",
    side: "left" as const,
    step: "01 / Foundations",
    title: "Started B.E. AI & ML",
    description:
      "Initiated a deep dive into the mathematical foundations of neural networks and algorithmic efficiency. Focused on establishing a rigorous technical baseline.",
    tags: ["Calculus", "Python"],
    activeNode: true,
  },
  {
    year: "2025",
    side: "right" as const,
    step: "02 / Entrepreneurship",
    title: "Built CareerPath AI",
    description:
      "Launched a scalable LLM-driven platform helping developers navigate personalized career trajectories through real-time industry analysis.",
    tags: ["OpenAI", "Next.js"],
    activeNode: false,
  },
  {
    year: "2026",
    side: "left" as const,
    step: "03 / Professional",
    title: "IBM SkillsBuild AI Internship",
    description:
      "Collaborated with enterprise-grade teams to refine large-scale data pipelines and implement ethical AI frameworks for public sector projects.",
    tags: ["WatsonX", "Governance"],
    activeNode: false,
  },
  {
    year: "2026",
    side: "right" as const,
    step: "04 / Achievement",
    title: "Forensic Analyser Award",
    description:
      "Recognized for engineering a high-precision computer vision tool used to detect manipulated digital evidence in high-stakes investigations.",
    tags: ["Vision", "Deep Learning"],
    activeNode: false,
  },
];

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

function TimelineCard({
  step,
  title,
  description,
  tags,
  highlight,
}: {
  step: string;
  title: string;
  description: string;
  tags: string[];
  highlight?: boolean;
}) {
  return (
    <TiltCard
      className={`${styles.card} ${highlight ? styles.cardHighlight : ""}`}
      maxTilt={6}
    >
      <span
        className={`${styles.step} ${
          highlight ? styles.stepHighlight : ""
        }`}
      >
        {highlight && <span className={styles.stepDot} aria-hidden />}
        {step}
      </span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span
            key={tag}
            className={`${styles.tag} ${
              highlight ? styles.tagHighlight : ""
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </TiltCard>
  );
}

function TimelineEntry({
  item,
}: {
  item: (typeof timelineItems)[number];
}) {
  const entryRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(entryRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  // On mobile use a smaller slide distance — large x-translations can
  // cause horizontal overflow flashes on narrow screens
  const slideFrom = item.side === "left"
    ? (isMobile ? -24 : -56)
    : (isMobile ? 24 : 56);

  return (
    <div
      ref={entryRef}
      className={`${styles.entry} ${
        item.side === "left" ? styles.entryLeft : styles.entryRight
      }`}
    >
      <motion.div
        className={styles.cardWrap}
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: slideFrom, y: 24 }
        }
        animate={
          isInView
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: slideFrom, y: 24 }
        }
        transition={{ duration: 0.75, ease: EASE }}
      >
        <TimelineCard
          step={item.step}
          title={item.title}
          description={item.description}
          tags={item.tags}
        />
      </motion.div>

      <motion.div
        className={styles.nodeWrap}
        initial={
          prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }
        }
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
        }
        transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
      >
        <div
          className={`${styles.node} ${
            item.activeNode ? styles.nodeActive : ""
          }`}
        />
        {item.activeNode && <span className={styles.nodeRing} aria-hidden />}
        <div className={styles.year}>{item.year}</div>
      </motion.div>
    </div>
  );
}

function PresentEntry() {
  const entryRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(entryRef, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  return (
    <div ref={entryRef} className={`${styles.entry} ${styles.entryLeft}`}>
      <motion.div
        className={styles.cardWrap}
        initial={
          prefersReducedMotion
            ? false
            : { opacity: 0, x: isMobile ? -24 : -56, y: 24 }
        }
        animate={
          isInView
            ? { opacity: 1, x: 0, y: 0 }
            : { opacity: 0, x: -56, y: 24 }
        }
        transition={{ duration: 0.75, ease: EASE }}
      >
        <TimelineCard
          step="Current Focus"
          title="Building AI Products"
          description="Full-stack development of autonomous agent systems and RAG architectures for next-generation enterprise productivity."
          tags={["LangChain", "Vector DBs"]}
          highlight
        />
      </motion.div>

      <motion.div
        className={styles.nodeWrap}
        initial={
          prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }
        }
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
        }
        transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
      >
        <div className={`${styles.node} ${styles.nodePresent}`}>
          <span
            className={`material-symbols-outlined ${styles.nodePresentIcon}`}
          >
            bolt
          </span>
        </div>
        <div className={`${styles.year} ${styles.yearPresent}`}>PRESENT</div>
      </motion.div>
    </div>
  );
}

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  // Skip scroll-driven line animation on mobile — useScroll attaches a
  // passive scroll listener and runs transform calculations on every frame
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} id="experience" className={styles.section}>
      <div className={styles.container}>
        <motion.header
          className={styles.header}
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          <span className={styles.eyebrow}>Product Roadmap</span>
          <h2 className={styles.title}>Experience Path</h2>
          <p className={styles.subtitle}>
            A chronicle of my journey through Artificial Intelligence, Machine
            Learning, and building high-performance digital products.
          </p>
        </motion.header>

        <div ref={timelineRef} className={styles.timeline}>
          <div className={styles.lineTrack} aria-hidden />
          <motion.div
            className={styles.lineProgress}
            aria-hidden
            style={{
              height: (prefersReducedMotion || isMobile) ? "100%" : lineHeight,
            }}
          />

          <div className={styles.entries}>
            {timelineItems.map((item) => (
              <TimelineEntry key={`${item.year}-${item.title}`} item={item} />
            ))}
            <PresentEntry />
          </div>
        </div>
      </div>
    </section>
  );
}
