"use client";

import { useEffect, useRef, useState } from "react";
import { globalAnimationEngine } from "@/lib/animationEngine";

export function useScrollNav(sectionIds: string[] = []) {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!globalAnimationEngine) return;

    const unsubscribe = globalAnimationEngine.registerScrollListener((scrollY) => {
      setScrolled(scrollY > 20);
      setCompact(scrollY > 20);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const visibleSections = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.set(entry.target.id, entry.intersectionRatio);
          } else {
            visibleSections.delete(entry.target.id);
          }
        });

        if (visibleSections.size === 0) {
          setActiveSection("");
          return;
        }

        let bestId = "";
        let bestRatio = 0;
        visibleSections.forEach((ratio, id) => {
          if (ratio >= bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        setActiveSection(bestId);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return { scrolled, compact, activeSection };
}
