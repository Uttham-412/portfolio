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
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./Projects.module.css";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
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
    name: "CareerPath AI",
    tagline: "AI-powered career recommendation platform.",
    badge: "Featured Project",
    badgeVariant: "ai" as const,
    description:
      "Analyzes resumes using NLP, identifies skill gaps, and recommends personalized career paths.",
    features: [
      "Resume Parsing",
      "Skill Gap Analysis",
      "AI Recommendations",
      "Personalized Career Paths",
    ],
    stack: [
      "React",
      "FastAPI",
      "Python",
      "NLP",
      "Machine Learning",
      "MongoDB",
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgzTfwDpP3Y-4eV8AqwCT2L88d3vA8WnpyPCiBOZdQjAis1kyY_7Y7MX-oelIzVvWz5vjzwxcTxrVeXVVgfTPn1TspW3IIwOZYriW_z8KtC2qeCdisK8vxnngOVhgilHIHFs8i8PPRduFieCjVVbJ2kfzS5zpbkbMlSWjMbQ4Uw-g3d1GLTvAAe79d3s90-HMtLvQZolwNIcFRmgiUkzf43E9by7_CE6ekFGNIMRdtzXIxJvTZWaQKFLNPbO8I8RoM9Qle8dw7Cbo",
    alt: "CareerPath AI platform interface",
    reversed: false,
    featured: true,
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    name: "Digital Twin Wildfire Detection",
    badge: "AI • Computer Vision • Deep Learning",
    badgeVariant: "safety" as const,
    description:
      "An AI-powered wildfire detection system that uses satellite imagery and deep learning to detect and predict wildfire spread in real time.",
    features: [
      "Wildfire Detection",
      "Satellite Image Analysis",
      "Fire Spread Prediction",
      "Real-time Monitoring",
    ],
    stack: ["Python", "TensorFlow", "OpenCV", "U-Net", "Deep Learning"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMErynLrh_Q3Un1oGj8rip_g6KlTom_aRYkaEOT5FOjq0fN-Whr25vzRnax9pVZUTSCHpkBcmH0yR6ffmR2zz7lFgYmy4jfF8tNVSQ31lEngF9PJdIjYiYssna8gfd5nQIoEhBk_VT2MqJEq0Cbw4xNY9c1gJujj4t0qqAWSoxEa5r8cqsDEWIEZKwHYQKCoz4XC2_bilJ6MnHNv-PU6yD-4UYi4Jh7pQ6shKdnBBWGH3z8ONZm4i8seFwCZSJKhdCMVZn_H9fLoo",
    alt: "Digital Twin Wildfire Detection dashboard",
    reversed: true,
    muted: true,
    primaryAction: { label: "GitHub", href: "#", icon: "code" },
    secondaryAction: { label: "Research", href: "#", icon: "science" },
  },
  {
    name: "Whiteboard",
    badge: "Full Stack • Real-Time Collaboration",
    badgeVariant: "collab" as const,
    description:
      "A collaborative online whiteboard that enables multiple users to draw, brainstorm, and collaborate together in real time.",
    features: [
      "Live Collaboration",
      "Shared Whiteboard",
      "Real-time Drawing Sync",
      "Responsive Design",
    ],
    stack: ["React", "Node.js", "Socket.IO", "MongoDB"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAe_R4F0C3-mhhCHT5VUPV_hdklhsgnYG-2bPNK6pTUY4rJ3R8QLOBDDRzJmTdYVqQgzxtpmYtVJ8C8iia2fonAszELkdLllxQaG5n4aeoeI0XWs7r8SB76hHf5kgDiv5ROlJNHIVbT9Y0YAM63-zoM4G002iF0O6Aj_a6vr7wnStGnUvsNjXlSQZNt8l2xGMCSOmikqfYKuuZ-J3N95sjGDN1Xfm7Z6LVUUImng3ODl_OG7sIgs0dvymxkVsTLYOv1vmVtxyJ-5Es",
    alt: "Collaborative online whiteboard interface",
    reversed: false,
    primaryAction: { label: "GitHub", href: "#", icon: "code" },
    secondaryAction: { label: "Live Demo", href: "#", icon: "open_in_new" },
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
  const isMobile = useIsMobile();
  // Smaller slide on mobile avoids horizontal overflow flashes
  const slideX = project.reversed
    ? (isMobile ? 20 : 48)
    : (isMobile ? -20 : -48);

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
                  priority={project.featured === true}
                />
              </div>
            </TiltCard>
          </motion.div>

          <motion.div
            className={styles.contentColumn}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, x: slideX, y: 20 }
            }
            animate={
              isInView
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, x: slideX, y: 20 }
            }
            transition={{ duration: 0.75, ease: EASE, delay: 0.08 }}
          >
            <span
              className={`${styles.badge} ${
                badgeClassMap[project.badgeVariant]
              }`}
            >
              {project.badge}
            </span>

            <h3 className={styles.projectName}>{project.name}</h3>

            {"tagline" in project && project.tagline ? (
              <p className={styles.tagline}>{project.tagline}</p>
            ) : null}

            <p className={styles.overview}>{project.description}</p>

            {"problem" in project &&
            typeof project.problem === "string" &&
            "solution" in project &&
            typeof project.solution === "string" ? (
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
            ) : null}

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
              <MagneticButton
                href={
                  "primaryAction" in project && project.primaryAction
                    ? project.primaryAction.href
                    : project.demoUrl
                }
                className={styles.btnPrimary}
              >
                <span
                  className={`material-symbols-outlined ${styles.btnIcon}`}
                >
                  {"primaryAction" in project && project.primaryAction
                    ? project.primaryAction.icon
                    : "open_in_new"}
                </span>
                {"primaryAction" in project && project.primaryAction
                  ? project.primaryAction.label
                  : "Live Demo"}
              </MagneticButton>
              <MagneticButton
                href={
                  "secondaryAction" in project && project.secondaryAction
                    ? project.secondaryAction.href
                    : project.githubUrl
                }
                className={styles.btnSecondary}
              >
                <span
                  className={`material-symbols-outlined ${styles.btnIcon}`}
                >
                  {"secondaryAction" in project && project.secondaryAction
                    ? project.secondaryAction.icon
                    : "code"}
                </span>
                {"secondaryAction" in project && project.secondaryAction
                  ? project.secondaryAction.label
                  : "GitHub"}
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
