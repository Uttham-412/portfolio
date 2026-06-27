"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

// Animate only transform + opacity — no blur, no layout triggers
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
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

// Lighter variant for mobile — shorter distance, faster duration
const itemVariantsMobile: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE,
    },
  },
};

// Mobile container: less stagger to avoid long animation queues
const containerVariantsMobile: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
  amount?: number;
  id?: string;
};

export default function SectionReveal({
  children,
  className,
  amount = 0.12,
  id,
}: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isInView = useInView(ref, {
    once: true,
    amount: prefersReducedMotion ? 0 : amount,
  });

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      variants={isMobile ? containerVariantsMobile : containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const isMobile = useIsMobile();
  return (
    <motion.div
      className={className}
      variants={isMobile ? itemVariantsMobile : itemVariants}
    >
      {children}
    </motion.div>
  );
}
