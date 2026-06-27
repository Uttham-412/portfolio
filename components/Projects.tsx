"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import TiltCard from "@/components/ui/TiltCard";
import styles from "./Projects.module.css";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: EASE },
  },
};

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const projects = [
  {
    name: "CareerPath",
    badge: "AI & Career Mapping",
    badgeVariant: "ai" as const,
    description:
      "AI-driven career trajectory mapping. An LLM-powered platform that analyzes industry trends and skills to define long-term professional growth paths.",
    problem:
      "Generic job boards lack future-proofing guidance, leaving users stagnant.",
    solution:
      "Intelligent mapping that predicts future role requirements based on current skills.",
    features: [
      "LLM-powered career trajectory mapping",
      "Real-time industry trend analysis",
      "Skills-to-role requirement prediction",
      "Personalized long-term growth paths",
    ],
    stack: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind CSS"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgzTfwDpP3Y-4eV8AqwCT2L88d3vA8WnpyPCiBOZdQjAis1kyY_7Y7MX-oelIzVvWz5vjzwxcTxrVeXVVgfTPn1TspW3IIwOZYriW_z8KtC2qeCdisK8vxnngOVhgilHIHFs8i8PPRduFieCjVVbJ2kfzS5zpbkbMlSWjMbQ4Uw-g3d1GLTvAAe79d3s90-HMtLvQZolwNIcFRmgiUkzf43E9by7_CE6ekFGNIMRdtzXIxJvTZWaQKFLNPbO8I8RoM9Qle8dw7Cbo",
    alt: "CareerPath Interface",
    reversed: false,
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    name: "Wildfire Monitor",
    badge: "Safety & IoT",
    badgeVariant: "safety" as const,
    description:
      "Real-time 3D monitoring for forest safety. A digital twin dashboard integrating satellite and sensor data for predictive wildfire modeling.",
    problem:
      "Delayed response times due to legacy reporting systems costing lives and acres.",
    solution:
      "Sub-second sensor latency combined with 3D terrain visualization for immediate action.",
    features: [
      "Real-time 3D terrain visualization",
      "Satellite and sensor data integration",
      "Sub-second sensor latency alerts",
      "Predictive wildfire modeling engine",
    ],
    stack: ["Python", "WebGL", "IoT / Edge", "FastAPI"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMErynLrh_Q3Un1oGj8rip_g6KlTom_aRYkaEOT5FOjq0fN-Whr25vzRnax9pVZUTSCHpkBcmH0yR6ffmR2zz7lFgYmy4jfF8tNVSQ31lEngF9PJdIjYiYssna8gfd5nQIoEhBk_VT2MqJEq0Cbw4xNY9c1gJujj4t0qqAWSoxEa5r8cqsDEWIEZKwHYQKCoz4XC2_bilJ6MnHNv-PU6yD-4UYi4Jh7pQ6shKdnBBWGH3z8ONZm4i8seFwCZSJKhdCMVZn_H9fLoo",
    alt: "Forest Digital Twin Dashboard",
    reversed: true,
    muted: true,
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    name: "CollabBoard",
    badge: "Real-time Collaboration",
    badgeVariant: "collab" as const,
    description:
      "Minimalist real-time brainstorming tool. A high-performance, low-latency collaboration tool with proprietary vector rendering.",
    problem:
      "Existing tools are bloated and slow down the creative flow during live sessions.",
    solution:
      "A custom-built Canvas engine providing 60fps interaction regardless of node count.",
    features: [
      "60fps proprietary canvas engine",
      "Real-time WebSocket synchronization",
      "Minimalist live brainstorming UX",
      "Scalable vector rendering pipeline",
    ],
    stack: ["React", "WebSockets", "Canvas API", "Node.js"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAe_R4F0C3-mhhCHT5VUPV_hdklhsgnYG-2bPNK6pTUY4rJ3R8QLOBDDRzJmTdYVqQgzxtpmYtVJ8C8iia2fonAszELkdLllxQaG5n4aeoeI0XWs7r8SB76hHf5kgDiv5ROlJNHIVbT9Y0YAM63-zoM4G002iF0O6Aj_a6vr7wnStGnUvsNjXlSQZNt8l2xGMCSOmikqfYKuuZ-J3N95sjGDN1Xfm7Z6LVUUImng3ODl_OG7sIgs0dvymxkVsTLYOv1vmVtxyJ-5Es",
    alt: "Whiteboard Collaboration Tool",
    reversed: false,
    demoUrl: "#",
    githubUrl: "#",
  },
];

const highlights = [
  {
    icon: "bolt",
    title: "Performance",
    description:
      "Achieved 95+ Lighthouse scores across all deployments using edge computing and asset optimization.",
  },
  {
    icon: "security",
    title: "Security",
    description:
      "End-to-end encryption for all real-time data streams and strictly typed backend schemas.",
  },
  {
    icon: "analytics",
    title: "Impact",
    description:
      "Reduced user onboarding friction by 40% through minimalist UX and automated workflows.",
  },
];

const badgeClassMap = {
  ai: styles.badgeAi,
  safety: styles.badgeSafety,
  collab: styles.badgeCollab,
};

function CaseStudy({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });
  const prefersReducedMotion = useReducedMotion();
  const slideX = project.reversed ? 48 : -48;

  return (
    <article
      ref={ref}
      className={`${styles.caseStudy} ${
        project.muted ? styles.caseStudyMuted : ""
      }`}
    >
      <div className={styles.caseInner}>
        <div
          className={`${styles.caseGrid} ${
            project.reversed ? styles.caseGridReversed : ""
          }`}
        >
          <motion.div
            className={styles.mediaColumn}
            variants={imageVariants}
            initial={prefersReducedMotion ? false : "hidden"}
            animate={isInView ? "visible" : "hidden"}
          >
            <TiltCard className={styles.imageFrame} maxTilt={7}>
              <div className={styles.imageWrap}>
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={styles.image}
                  priority={project.name === "CareerPath"}
                />
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            className={styles.contentColumn}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: slideX, y: 24, filter: "blur(6px)" }
            }
            animate={
              isInView
                ? { opacity: 1, x: 0, y: 0, filter: "blur(0px)" }
                : { opacity: 0, x: slideX, y: 24, filter: "blur(6px)" }
            }
            transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
          >
            <span
              className={`${styles.badge} ${
                badgeClassMap[project.badgeVariant]
              }`}
            >
              {project.badge}
            </span>

            <h3 className={styles.projectName}>{project.name}</h3>

            <p className={styles.overview}>{project.description}</p>

            <div className={styles.detailGrid}>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Problem</span>
                <p className={styles.detailText}>{project.problem}</p>
              </div>
              <div className={styles.detailBlock}>
                <span className={styles.detailLabel}>Solution</span>
                <p className={styles.detailText}>{project.solution}</p>
              </div>
            </div>

            <div>
              <span className={styles.blockTitle}>Technology Stack</span>
              <div className={styles.stackList}>
                {project.stack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className={styles.stackChip}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 10 }
                    }
                    animate={
                      isInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 10 }
                    }
                    transition={{
                      duration: 0.45,
                      ease: EASE,
                      delay: prefersReducedMotion ? 0 : 0.2 + index * 0.05,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <span className={styles.blockTitle}>Key Features</span>
              <ul className={styles.featuresList}>
                {project.features.map((feature, index) => (
                  <motion.li
                    key={feature}
                    className={styles.featureItem}
                    initial={
                      prefersReducedMotion
                        ? false
                        : { opacity: 0, y: 12 }
                    }
                    animate={
                      isInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 12 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: prefersReducedMotion ? 0 : 0.28 + index * 0.06,
                    }}
                  >
                    <span
                      className={`material-symbols-outlined ${styles.featureIcon}`}
                    >
                      check_circle
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className={styles.actions}>
              <MagneticButton href={project.demoUrl} className={styles.btnPrimary}>
                <span
                  className={`material-symbols-outlined ${styles.btnIcon}`}
                >
                  open_in_new
                </span>
                Live Demo
              </MagneticButton>
              <MagneticButton
                href={project.githubUrl}
                className={styles.btnSecondary}
              >
                <span
                  className={`material-symbols-outlined ${styles.btnIcon}`}
                >
                  code
                </span>
                GitHub
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const summaryInView = useInView(summaryRef, { once: true, amount: 0.15 });

  return (
    <section ref={sectionRef} id="projects" className={styles.section}>
      <header className={styles.header}>
        <motion.div
          className={styles.headerInner}
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          <motion.span className={styles.eyebrow} variants={fadeUpVariants}>
            Selected Work
          </motion.span>
          <motion.h2 className={styles.title} variants={fadeUpVariants}>
            Featured Projects
          </motion.h2>
          <motion.p className={styles.subtitle} variants={fadeUpVariants}>
            A selection of high-performance technical solutions bridging AI,
            real-time data, and collaborative ecosystems.
          </motion.p>
        </motion.div>
      </header>

      {projects.map((project) => (
        <CaseStudy key={project.name} project={project} />
      ))}

      <div className={styles.summary}>
        <div ref={summaryRef} className={styles.summaryInner}>
          <motion.div
            className={styles.summaryGrid}
            initial="hidden"
            animate={summaryInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.12, delayChildren: 0.05 },
              },
            }}
          >
            {highlights.map((item) => (
              <TiltCard
                key={item.title}
                className={styles.summaryCard}
                variants={fadeUpVariants}
                maxTilt={6}
              >
                <span
                  className={`material-symbols-outlined ${styles.summaryIcon}`}
                >
                  {item.icon}
                </span>
                <h3 className={styles.summaryTitle}>{item.title}</h3>
                <p className={styles.summaryText}>{item.description}</p>
              </TiltCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
