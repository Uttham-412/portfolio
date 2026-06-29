// Global Animation Engine
// Centralizes requestAnimationFrame loop, mouse move, scroll, and resize handlers.
// Implements custom Spring physics matching Framer Motion's behaviors exactly.

export class Spring {
  value: number;
  velocity: number;
  target: number;
  stiffness: number;
  damping: number;
  mass: number;

  constructor(initialValue: number, config: { stiffness: number; damping: number; mass?: number }) {
    this.value = initialValue;
    this.velocity = 0;
    this.target = initialValue;
    this.stiffness = config.stiffness;
    this.damping = config.damping;
    this.mass = config.mass ?? 1.0;
  }

  update(dt: number) {
    // Clamp delta time to avoid instability on long pauses or frame drops
    const elapsed = Math.min(dt, 0.032);
    const steps = Math.ceil(elapsed / 0.002); // Sub-stepping for physics stability
    const subDt = elapsed / steps;

    for (let i = 0; i < steps; i++) {
      const springForce = -this.stiffness * (this.value - this.target);
      const dampingForce = -this.damping * this.velocity;
      const acceleration = (springForce + dampingForce) / this.mass;
      this.velocity += acceleration * subDt;
      this.value += this.velocity * subDt;
    }

    return this.value;
  }

  set(target: number) {
    this.target = target;
  }

  reset(val: number) {
    this.value = val;
    this.target = val;
    this.velocity = 0;
  }
}

export function interpolate(value: number, inputRange: number[], outputRange: number[]): number {
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1];

  let i = 0;
  while (i < inputRange.length - 1 && value > inputRange[i + 1]) {
    i++;
  }

  const minInput = inputRange[i];
  const maxInput = inputRange[i + 1];
  const minOutput = outputRange[i];
  const maxOutput = outputRange[i + 1];

  const progress = (value - minInput) / (maxInput - minInput);
  return minOutput + progress * (maxOutput - minOutput);
}

export interface InteractiveItem {
  element: HTMLElement;
  type: "magnetic" | "tilt";
  options: {
    strength?: number;
    maxTilt?: number;
    glare?: boolean;
  };
  pageLeft: number;
  pageTop: number;
  width: number;
  height: number;
  active: boolean;
}

export interface SnippetLine {
  lineIndex: number;
  el: HTMLElement | null;
  cursorEl: HTMLElement | null;
  fullText: string;
  isTyping: boolean;
}

export interface SnippetItem {
  id: string;
  outerEl: HTMLElement;
  innerEl: HTMLElement;
  lines: SnippetLine[];
  options: {
    x: number;
    y: number;
    rotate: number;
    floatDuration: number;
    driftY: number;
    parallaxFactor: number;
    baseOpacity: number;
    blur: number;
    spawnDelay: number;
  };
  phase: "waiting" | "fadeIn" | "typing" | "pause" | "fadeOut";
  elapsedTime: number;
  pauseDuration: number;
  onCycleComplete: () => void;
}

class GlobalAnimationEngine {
  private lastTime = 0;
  private globalTime = 0;
  private running = false;
  private rafId = 0;

  // Event States
  private mouseX = 0;
  private mouseY = 0;
  private scrollY = 0;
  private scrollYProgress = 0;

  // Springs
  public mouseSpringX!: Spring;
  public mouseSpringY!: Spring;
  public scrollSpringProgress!: Spring;

  // Registry lists
  private tickCallbacks: Map<string, (time: number, dt: number) => void> = new Map();
  private interactives: InteractiveItem[] = [];
  private snippets: SnippetItem[] = [];
  private scrollCallbacks: Set<(scrollY: number) => void> = new Set();

  public isPointerFine = false;
  public prefersReducedMotion = false;

  constructor() {
    if (typeof window === "undefined") return;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight * 0.38;

    this.mouseSpringX = new Spring(this.mouseX, { stiffness: 55, damping: 24, mass: 0.9 });
    this.mouseSpringY = new Spring(this.mouseY, { stiffness: 55, damping: 24, mass: 0.9 });
    this.scrollSpringProgress = new Spring(0, { stiffness: 120, damping: 28, mass: 1.0 });

    const media = window.matchMedia("(pointer: fine)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.isPointerFine = media.matches;
    this.prefersReducedMotion = motionMedia.matches;

    media.addEventListener("change", (e) => {
      this.isPointerFine = e.matches;
    });

    motionMedia.addEventListener("change", (e) => {
      this.prefersReducedMotion = e.matches;
    });

    // Single global listeners
    window.addEventListener("mousemove", this.handleMouseMove, { passive: true });
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });

    this.start();
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isPointerFine || this.prefersReducedMotion) return;
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  };

  private handleScroll = () => {
    this.scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollYProgress = maxScroll > 0 ? this.scrollY / maxScroll : 0;

    // Trigger scroll listeners synchronously/in batch
    for (const cb of this.scrollCallbacks) {
      cb(this.scrollY);
    }
  };

  private handleResize = () => {
    this.measureAll();
  };

  public registerTick(id: string, cb: (time: number, dt: number) => void) {
    this.tickCallbacks.set(id, cb);
  }

  public unregisterTick(id: string) {
    this.tickCallbacks.delete(id);
  }

  public registerScrollListener(cb: (scrollY: number) => void) {
    this.scrollCallbacks.add(cb);
    cb(this.scrollY);
    return () => {
      this.scrollCallbacks.delete(cb);
    };
  }

  public registerInteractive(element: HTMLElement, type: "magnetic" | "tilt", options: any) {
    const item: InteractiveItem = {
      element,
      type,
      options,
      pageLeft: 0,
      pageTop: 0,
      width: 0,
      height: 0,
      active: false,
    };
    this.measureItem(item);
    this.interactives.push(item);

    return () => {
      this.interactives = this.interactives.filter((i) => i.element !== element);
    };
  }

  public registerSnippet(item: SnippetItem) {
    this.snippets.push(item);
    return () => {
      this.snippets = this.snippets.filter((s) => s.id !== item.id);
    };
  }

  public measureItem(item: InteractiveItem) {
    const rect = item.element.getBoundingClientRect();
    item.pageLeft = rect.left + window.scrollX;
    item.pageTop = rect.top + window.scrollY;
    item.width = rect.width;
    item.height = rect.height;
  }

  public measureAll() {
    if (typeof window === "undefined") return;
    for (const item of this.interactives) {
      this.measureItem(item);
    }
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  public stop() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  private tick = (now: number) => {
    if (!this.running) return;

    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Only progress global time if tab active
    if (!document.hidden) {
      this.globalTime += dt;
    }

    // Solve Spring values
    if (this.isPointerFine && !this.prefersReducedMotion) {
      this.mouseSpringX.set(this.mouseX);
      this.mouseSpringY.set(this.mouseY);
      this.mouseSpringX.update(dt);
      this.mouseSpringY.update(dt);
    } else {
      this.mouseSpringX.reset(this.mouseX);
      this.mouseSpringY.reset(this.mouseY);
    }

    this.scrollSpringProgress.set(this.scrollYProgress);
    this.scrollSpringProgress.update(dt);

    // BATCH DOM WRITES: CSS variables on root
    const root = document.documentElement;
    root.style.setProperty("--mouse-x", `${this.mouseX}px`);
    root.style.setProperty("--mouse-y", `${this.mouseY}px`);
    root.style.setProperty("--spring-mouse-x", `${this.mouseSpringX.value}px`);
    root.style.setProperty("--spring-mouse-y", `${this.mouseSpringY.value}px`);
    root.style.setProperty("--scroll-y", `${this.scrollY}px`);
    root.style.setProperty("--scroll-progress", `${this.scrollYProgress}`);
    root.style.setProperty("--scroll-progress-spring", `${this.scrollSpringProgress.value}`);
    root.style.setProperty("--global-time", `${this.globalTime}`);

    // Update Aurora timings driven from the single loop
    this.updateAuroraCSSVariables();

    // Update floating profile and scroll indicators in Hero section
    this.updateHeroCSSVariables();

    // Run registered ticks (particles canvas drawing, loading progress, counters)
    this.tickCallbacks.forEach((cb) => {
      try {
        cb(this.globalTime, dt);
      } catch (err) {
        console.error("Tick error:", err);
      }
    });

    // Update registered interactive elements (magnetic, tilt)
    this.updateInteractives();

    // Update registered code snippets
    this.updateSnippets(dt);

    this.rafId = requestAnimationFrame(this.tick);
  };

  private updateAuroraCSSVariables() {
    const t = this.globalTime;
    const root = document.documentElement;

    // Aurora Band 1
    const p1 = (Math.sin(t * 2 * Math.PI / 22) + 1) / 2;
    root.style.setProperty("--aurora-band1-transform", `translate(${p1 * 4}%, ${p1 * -3}%) scale(${1 + p1 * 0.06}) rotate(${p1 * 2}deg)`);
    root.style.setProperty("--aurora-band1-opacity", `${0.6 + p1 * 0.4}`);

    // Aurora Band 2
    const p2 = (Math.sin(t * 2 * Math.PI / 28) + 1) / 2;
    root.style.setProperty("--aurora-band2-transform", `translate(${p2 * -5}%, ${p2 * 4}%) scale(${1 + p2 * 0.08})`);
    root.style.setProperty("--aurora-band2-opacity", `${0.45 + p2 * 0.4}`);

    // Aurora Band 3
    const p3 = (Math.sin(t * 2 * Math.PI / 26) + 1) / 2;
    root.style.setProperty("--aurora-band3-transform", `translate(${p3 * 3}%, ${p3 * 5}%) scale(${1 + p3 * 0.05})`);
    root.style.setProperty("--aurora-band3-opacity", `${0.4 + p3 * 0.35}`);

    // Aurora Band 4
    const p4 = (Math.sin(t * 2 * Math.PI / 32) + 1) / 2;
    root.style.setProperty("--aurora-band4-transform", `translate(${p4 * -3}%, ${p4 * -4}%) scale(${1 + p4 * 0.04})`);
    root.style.setProperty("--aurora-band4-opacity", `${0.35 + p4 * 0.3}`);

    // Radial Glow Pulse
    const pg = (Math.sin(t * 2 * Math.PI / 18) + 1) / 2;
    root.style.setProperty("--radial-glow-transform", `scale(${1 + pg * 0.02})`);
    root.style.setProperty("--radial-glow-opacity", `${0.82 + pg * 0.18}`);

    // Orb drifts
    const o1 = (Math.sin(t * 2 * Math.PI / 26) + 1) / 2;
    root.style.setProperty("--orb1-transform", `translate(${o1 * 32}px, ${o1 * -40}px)`);

    const o2 = (Math.sin(t * 2 * Math.PI / 32) + 1) / 2;
    root.style.setProperty("--orb2-transform", `translate(${o2 * -36}px, ${o2 * 28}px)`);

    const o3 = (Math.sin(t * 2 * Math.PI / 22) + 1) / 2;
    root.style.setProperty("--orb3-transform", `translate(${o3 * 24}px, ${o3 * -20}px)`);

    const o4 = (Math.sin(t * 2 * Math.PI / 34) + 1) / 2;
    root.style.setProperty("--orb4-transform", `translate(${o4 * -20}px, ${o4 * -32}px)`);

    // Noise drift
    const nd = (t % 10) / 10;
    root.style.setProperty("--noise-transform", `translate(${nd * -4}%, ${nd * -4}%)`);
  }

  private updateHeroCSSVariables() {
    const t = this.globalTime;
    const root = document.documentElement;

    // Profile floating keyframe mapping
    const t_mod7 = (t % 7) / 7;
    const floatY = interpolate(t_mod7, [0, 0.25, 0.5, 0.75, 1.0], [0, -11, -3, -13, 0]);
    const floatRotate = interpolate(t_mod7, [0, 0.25, 0.5, 0.75, 1.0], [0, 0.6, -0.4, 0.5, 0]);
    root.style.setProperty("--profile-float-y", `${floatY}px`);
    root.style.setProperty("--profile-float-rotate", `${floatRotate}deg`);

    // Profile glow pulse
    const glowOpacity = interpolate(t_mod7, [0, 0.25, 0.5, 0.75, 1.0], [0.55, 1, 0.6, 0.95, 0.55]);
    const glowScale = interpolate(t_mod7, [0, 0.25, 0.5, 0.75, 1.0], [1, 1.08, 1.02, 1.06, 1]);
    root.style.setProperty("--profile-glow-opacity", `${glowOpacity}`);
    root.style.setProperty("--profile-glow-scale", `${glowScale}`);

    // Profile border glow
    const t_mod4 = (t % 4) / 4;
    const borderGlowOpacity = interpolate(t_mod4, [0, 0.25, 0.5, 0.75, 1.0], [0.4, 0.85, 0.5, 0.75, 0.4]);
    root.style.setProperty("--profile-border-glow-opacity", `${borderGlowOpacity}`);

    // Profile border spin (duration 5s)
    const spinRotate = ((t % 5) / 5) * 360;
    root.style.setProperty("--profile-border-spin-rotate", `${spinRotate}deg`);

    // Orbit ring spin (duration 24s)
    const orbitRotate = ((t % 24) / 24) * 360;
    root.style.setProperty("--orbit-ring-rotate", `${orbitRotate}deg`);

    // Scroll Indicator Chevron Bounce (duration 2s)
    const t_mod2 = (t % 2) / 2;
    const chevronY = interpolate(t_mod2, [0, 0.5, 1.0], [0, 5, 0]);
    root.style.setProperty("--scroll-chevron-y", `${chevronY}px`);

    // Scroll Indicator Pulse (duration 2.4s)
    const t_mod24 = (t % 2.4) / 2.4;
    const pulseScaleY = interpolate(t_mod24, [0, 0.5, 1.0], [0, 1, 0]);
    const pulseOpacity = interpolate(t_mod24, [0, 0.5, 1.0], [0, 0.5, 0]);
    root.style.setProperty("--scroll-pulse-scale-y", `${pulseScaleY}`);
    root.style.setProperty("--scroll-pulse-opacity", `${pulseOpacity}`);

    // Scroll Indicator Dot (duration 2.4s, custom keyframe times [0, 0.12, 0.88, 1])
    const dotY = interpolate(t_mod24, [0, 0.12, 0.88, 1.0], [0, 52, 52, 0]);
    const dotOpacity = interpolate(t_mod24, [0, 0.12, 0.88, 1.0], [0, 1, 1, 0]);
    root.style.setProperty("--scroll-dot-y", `${dotY}px`);
    root.style.setProperty("--scroll-dot-opacity", `${dotOpacity}`);
  }

  private updateInteractives() {
    if (this.prefersReducedMotion) return;

    const mx = this.mouseX;
    const my = this.mouseY;
    const sx = window.scrollX;
    const sy = window.scrollY;

    for (const item of this.interactives) {
      // Calculate viewport-relative bounding box using page-relative cached values
      const left = item.pageLeft - sx;
      const top = item.pageTop - sy;
      const right = left + item.width;
      const bottom = top + item.height;

      const hovered = mx >= left && mx <= right && my >= top && my <= bottom;

      if (hovered && this.isPointerFine) {
        item.active = true;

        if (item.type === "magnetic") {
          const cx = left + item.width / 2;
          const cy = top + item.height / 2;
          const strength = item.options.strength ?? 0.32;
          const tx = (mx - cx) * strength;
          const ty = (my - cy) * strength;
          item.element.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        } else if (item.type === "tilt") {
          const maxTilt = item.options.maxTilt ?? 8;
          const px = (mx - left) / item.width - 0.5;
          const py = (my - top) / item.height - 0.5;
          item.element.style.setProperty("--tilt-x", `${-py * maxTilt}deg`);
          item.element.style.setProperty("--tilt-y", `${px * maxTilt}deg`);
          item.element.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`);
          item.element.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`);
        }
      } else if (item.active) {
        // Reset when mouse leaves
        item.active = false;
        if (item.type === "magnetic") {
          item.element.style.transform = "";
        } else if (item.type === "tilt") {
          item.element.style.setProperty("--tilt-x", "0deg");
          item.element.style.setProperty("--tilt-y", "0deg");
        }
      }
    }
  }

  private updateSnippets(dt: number) {
    const t = this.globalTime;

    for (const s of this.snippets) {
      if (this.prefersReducedMotion) continue;

      s.elapsedTime += dt;

      // 1. Calculate floating y offset (Linear interpolate keyframes: [0, -driftY, driftY*0.4, -driftY*0.6, 0])
      const t_modFloat = (t % s.options.floatDuration) / s.options.floatDuration;
      const floatY = interpolate(
        t_modFloat,
        [0, 0.25, 0.5, 0.75, 1.0],
        [0, -s.options.driftY, s.options.driftY * 0.4, -s.options.driftY * 0.6, 0]
      );

      // 2. Parallax calculations
      let px = 0;
      let py = 0;
      if (this.isPointerFine) {
        // Use smooth springed mouse values relative to window center
        const nx = this.mouseSpringX.value / window.innerWidth - 0.5;
        const ny = this.mouseSpringY.value / window.innerHeight - 0.5;
        px = nx * s.options.parallaxFactor * 18;
        py = ny * s.options.parallaxFactor * 14;
      }

      // Update outer container position
      s.outerEl.style.transform = `translate3d(calc(${s.options.x}% + ${px}px), calc(${s.options.y}% + ${py}px), 0)`;

      // 3. Phase State Machine
      let opacity = s.options.baseOpacity;

      if (s.phase === "waiting") {
        opacity = 0;
        if (s.elapsedTime >= s.options.spawnDelay) {
          s.phase = "fadeIn";
          s.elapsedTime = 0;
        }
      } else if (s.phase === "fadeIn") {
        const progress = Math.min(1, s.elapsedTime / 0.7);
        opacity = progress * s.options.baseOpacity;
        if (progress >= 1) {
          s.phase = "typing";
          s.elapsedTime = 0;
        }
      } else if (s.phase === "typing") {
        opacity = s.options.baseOpacity;
        // Total chars to type (speed: ~37ms per character)
        const charRate = 27; // chars per second
        const totalCharsTyped = Math.floor(s.elapsedTime * charRate);

        let consumed = 0;
        let allCompleted = true;

        for (const line of s.lines) {
          if (!line.isTyping) continue;
          const targetLen = line.fullText.length;
          const charsForThisLine = Math.min(targetLen, Math.max(0, totalCharsTyped - consumed));
          consumed += targetLen;

          // Direct DOM Text Content update (Batched)
          const typedText = line.fullText.slice(0, charsForThisLine);
          if (line.el && line.el.textContent !== typedText) {
            line.el.textContent = typedText;
          }

          const lineCompleted = charsForThisLine >= targetLen;
          if (!lineCompleted) {
            allCompleted = false;
          }

          // Blinking cursor update
          const isCurrentTypingLine = !lineCompleted && totalCharsTyped >= (consumed - targetLen);
          if (line.cursorEl) {
            const showCursor = isCurrentTypingLine || (lineCompleted && !allCompleted);
            line.cursorEl.style.display = showCursor ? "inline-block" : "none";
          }
        }

        if (allCompleted && s.elapsedTime > (consumed / charRate) + 0.2) {
          s.phase = "pause";
          s.elapsedTime = 0;
        }
      } else if (s.phase === "pause") {
        opacity = s.options.baseOpacity;
        // Hide all cursors during pause
        for (const line of s.lines) {
          if (line.cursorEl) line.cursorEl.style.display = "none";
        }
        if (s.elapsedTime >= s.pauseDuration) {
          s.phase = "fadeOut";
          s.elapsedTime = 0;
        }
      } else if (s.phase === "fadeOut") {
        const progress = Math.min(1, s.elapsedTime / 0.9);
        opacity = (1 - progress) * s.options.baseOpacity;
        if (progress >= 1) {
          // Reset lines text content to empty for next loop typing before swap
          for (const line of s.lines) {
            if (line.isTyping && line.el) line.el.textContent = "";
          }
          s.onCycleComplete();
        }
      }

      // Apply inner transforms
      s.innerEl.style.opacity = `${opacity}`;
      s.innerEl.style.transform = `rotate(${s.options.rotate}deg) translate3d(0, ${floatY}px, 0)`;
    }
  }
}

// Export singleton instance for app-wide use
export const globalAnimationEngine = typeof window !== "undefined"
  ? new GlobalAnimationEngine()
  : (null as unknown as GlobalAnimationEngine);
