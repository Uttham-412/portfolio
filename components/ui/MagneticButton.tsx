"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { useMouse } from "@/context/MouseContext";
import { globalAnimationEngine } from "@/lib/animationEngine";

type BaseProps = {
  children: ReactNode;
  strength?: number;
  className?: string;
};

function useMagneticHandlers(strength: number) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { isPointerFine } = useMouse();

  useEffect(() => {
    const el = ref.current;
    if (prefersReducedMotion || !isPointerFine || !el || !globalAnimationEngine) return;

    const deregister = globalAnimationEngine.registerInteractive(el, "magnetic", { strength });
    return deregister;
  }, [prefersReducedMotion, isPointerFine, strength]);

  return { ref, prefersReducedMotion, isPointerFine };
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

  const { ref, prefersReducedMotion, isPointerFine } =
    useMagneticHandlers(strength);

  if (as === "button") {
    const buttonProps = rest as Omit<MagneticButtonElementProps, keyof BaseProps | "as">;
    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        // whileTap spring only fires on pointer-fine devices (desktop)
        whileTap={prefersReducedMotion || !isPointerFine ? undefined : { scale: 0.97 }}
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
      whileTap={prefersReducedMotion || !isPointerFine ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      {...anchorProps}
    >
      {children}
    </motion.a>
  );
}
