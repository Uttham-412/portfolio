"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMouse } from "@/context/MouseContext";

type BaseProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

function useMagneticHandlers(strength: number) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isPointerFine } = useMouse();

  const handleMove = (event: React.MouseEvent) => {
    const element = ref.current;
    if (prefersReducedMotion || !isPointerFine || !element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;
    element.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  return { ref, handleMove, handleLeave, prefersReducedMotion };
}

type MagneticAnchorProps = BaseProps &
  Omit<HTMLMotionProps<"a">, "children"> & {
    as?: "a";
  };

type MagneticButtonElementProps = BaseProps &
  Omit<HTMLMotionProps<"button">, "children"> & {
    as: "button";
  };

type MagneticButtonProps = MagneticAnchorProps | MagneticButtonElementProps;

export default function MagneticButton(props: MagneticButtonProps) {
  const {
    children,
    strength = 0.32,
    className,
    as = "a",
    ...rest
  } = props;

  const { ref, handleMove, handleLeave, prefersReducedMotion } =
    useMagneticHandlers(strength);

  if (as === "button") {
    const buttonProps = rest as Omit<MagneticButtonElementProps, keyof BaseProps | "as">;
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        {...buttonProps}
      >
        {children}
      </motion.button>
    );
  }

  const anchorProps = rest as Omit<MagneticAnchorProps, keyof BaseProps | "as">;
  return (
    <motion.a
      ref={ref as React.Ref<HTMLAnchorElement>}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      {...anchorProps}
    >
      {children}
    </motion.a>
  );
}
