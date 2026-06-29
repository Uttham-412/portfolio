"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useMouse } from "@/context/MouseContext";
import { globalAnimationEngine } from "@/lib/animationEngine";

type TiltCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  maxTilt?: number;
  glare?: boolean;
};

export default function TiltCard({
  children,
  className,
  maxTilt = 8,
  glare = true,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isPointerFine } = useMouse();

  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion || !isPointerFine || !el || !globalAnimationEngine) return;

    const deregister = globalAnimationEngine.registerInteractive(el, "tilt", { maxTilt, glare });
    return deregister;
  }, [prefersReducedMotion, isPointerFine, maxTilt, glare]);

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${glare ? "tilt-card-glare" : ""} ${className ?? ""}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
