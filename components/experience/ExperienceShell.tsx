"use client";

import { type ReactNode } from "react";
import { MouseProvider } from "@/context/MouseContext";
import CursorGlow from "@/components/effects/CursorGlow";
import LoadingScreen from "@/components/effects/LoadingScreen";
import ScrollProgress from "@/components/effects/ScrollProgress";
import SiteBackground from "@/components/SiteBackground";

export default function ExperienceShell({ children }: { children: ReactNode }) {
  return (
    <MouseProvider>
      <LoadingScreen />
      <SiteBackground />
      <CursorGlow />
      <ScrollProgress />
      <div className="site-shell">{children}</div>
    </MouseProvider>
  );
}
