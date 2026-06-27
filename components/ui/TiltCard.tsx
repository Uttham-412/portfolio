"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMouse } from "@/context/MouseContext";

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

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !isPointerFine || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = -y * maxTilt;
    const rotateY = x * maxTilt;

    ref.current.style.setProperty("--tilt-x", `${rotateX}deg`);
    ref.current.style.setProperty("--tilt-y", `${rotateY}deg`);
    ref.current.style.setProperty("--glare-x", `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty("--glare-y", `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--tilt-x", "0deg");
    ref.current.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${glare ? "tilt-card-glare" : ""} ${className ?? ""}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...props}
    >
      {children}
    </motion.div>
  );
}
