"use client";

import { useEffect, useRef } from "react";

type RevealVariant = "default" | "sm" | "projects" | "animation";

const variantClass: Record<RevealVariant, string> = {
  default: "reveal",
  sm: "reveal-sm",
  projects: "reveal-projects",
  animation: "reveal-animation",
};

export function useReveal<T extends HTMLElement = HTMLDivElement>(
  variant: RevealVariant = "default",
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px",
        ...options,
      },
    );

    el.classList.add(variantClass[variant]);
    observer.observe(el);

    return () => observer.disconnect();
  }, [variant, options]);

  return ref;
}

export function useRevealGroup(
  selector: string,
  options?: IntersectionObserverInit,
) {
  useEffect(() => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        ...options,
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, options]);
}
