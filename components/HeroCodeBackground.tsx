"use client";

import { motion, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMouse } from "@/context/MouseContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import styles from "./HeroCodeBackground.module.css";

type TokenClass = "kw" | "ty" | "str" | "fn" | "cm" | "op" | "num" | "plain";

type Token = {
  text: string;
  className?: TokenClass;
};

type CodeLine = Token[];

type SnippetTemplate = {
  id: string;
  tech: string;
  lines: CodeLine[];
  typingLines: number[];
};

type SnippetInstance = {
  instanceId: string;
  template: SnippetTemplate;
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

const MAX_SNIPPETS = 5;
const MAX_SNIPPETS_MOBILE = 2;  // mobile: keep GPU load minimal
const EDGE_MARGIN = 11;
const EXCLUSION = { cx: 50, cy: 46, rx: 24, ry: 30 };
const MIN_SNIPPET_DISTANCE = 14;

const SNIPPET_TEMPLATES: SnippetTemplate[] = [
  {
    id: "react-1",
    tech: "React",
    typingLines: [3],
    lines: [
      [{ text: "'use client'", className: "str" }, { text: ";", className: "plain" }],
      [{ text: "import ", className: "kw" }, { text: "{ useMemo }", className: "plain" }, { text: " from ", className: "kw" }, { text: "'react'", className: "str" }],
      [],
      [{ text: "export function ", className: "kw" }, { text: "ProjectCard", className: "fn" }, { text: "({ project }) {", className: "plain" }],
      [{ text: "  const ", className: "kw" }, { text: "tags", className: "plain" }, { text: " = ", className: "op" }, { text: "useMemo", className: "fn" }, { text: "(() =>", className: "plain" }],
      [{ text: "    project.stack.filter(Boolean)", className: "plain" }],
    ],
  },
  {
    id: "react-2",
    tech: "React",
    typingLines: [2, 3],
    lines: [
      [{ text: "const ", className: "kw" }, { text: "[open, setOpen]", className: "plain" }, { text: " = ", className: "op" }, { text: "useState", className: "fn" }, { text: "(", className: "plain" }, { text: "false", className: "kw" }, { text: ");", className: "plain" }],
      [],
      [{ text: "return (", className: "kw" }],
      [{ text: "  <button onClick={() => setOpen(v => !v)}>", className: "plain" }],
      [{ text: "    {open ? ", className: "plain" }, { text: "'Close'", className: "str" }, { text: " : ", className: "plain" }, { text: "'Open'", className: "str" }, { text: "}", className: "plain" }],
      [{ text: "  </button>", className: "plain" }],
    ],
  },
  {
    id: "typescript-1",
    tech: "TypeScript",
    typingLines: [1],
    lines: [
      [{ text: "type ", className: "kw" }, { text: "SkillVector", className: "ty" }, { text: " = {", className: "plain" }],
      [{ text: "  name: ", className: "plain" }, { text: "string", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "  weight: ", className: "plain" }, { text: "number", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "};", className: "plain" }],
    ],
  },
  {
    id: "typescript-2",
    tech: "TypeScript",
    typingLines: [2],
    lines: [
      [{ text: "interface ", className: "kw" }, { text: "ApiResponse", className: "ty" }, { text: "<T> {", className: "plain" }],
      [{ text: "  data: ", className: "plain" }, { text: "T", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "  status: ", className: "plain" }, { text: "number", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "}", className: "plain" }],
      [],
      [{ text: "const ", className: "kw" }, { text: "res", className: "plain" }, { text: ": ", className: "op" }, { text: "ApiResponse", className: "ty" }, { text: "<User>", className: "plain" }],
    ],
  },
  {
    id: "python-1",
    tech: "Python",
    typingLines: [1, 2],
    lines: [
      [{ text: "def ", className: "kw" }, { text: "embed_text", className: "fn" }, { text: "(text: ", className: "plain" }, { text: "str", className: "ty" }, { text: ") -> ", className: "plain" }, { text: "np.ndarray", className: "ty" }, { text: ":", className: "plain" }],
      [{ text: "    vector = ", className: "plain" }, { text: "model.encode", className: "fn" }, { text: "(text)", className: "plain" }],
      [{ text: "    return ", className: "kw" }, { text: "vector / ", className: "plain" }, { text: "np.linalg.norm", className: "fn" }, { text: "(vector)", className: "plain" }],
    ],
  },
  {
    id: "python-2",
    tech: "Python",
    typingLines: [3],
    lines: [
      [{ text: "from ", className: "kw" }, { text: "sklearn.pipeline", className: "fn" }, { text: " import ", className: "kw" }, { text: "Pipeline", className: "ty" }],
      [],
      [{ text: "pipe = ", className: "plain" }, { text: "Pipeline", className: "ty" }, { text: "([", className: "plain" }],
      [{ text: '  ("scale", StandardScaler()),', className: "plain" }],
      [{ text: '  ("clf", LogisticRegression()),', className: "plain" }],
      [{ text: "])", className: "plain" }],
    ],
  },
  {
    id: "fastapi-1",
    tech: "FastAPI",
    typingLines: [2, 3],
    lines: [
      [{ text: "from ", className: "kw" }, { text: "fastapi", className: "fn" }, { text: " import ", className: "kw" }, { text: "FastAPI", className: "ty" }],
      [{ text: "app = ", className: "plain" }, { text: "FastAPI", className: "ty" }, { text: "()", className: "plain" }],
      [],
      [{ text: "@app.post", className: "fn" }, { text: "(", className: "plain" }, { text: "'/predict'", className: "str" }, { text: ")", className: "plain" }],
      [{ text: "async def ", className: "kw" }, { text: "predict", className: "fn" }, { text: "(body: ", className: "plain" }, { text: "Request", className: "ty" }, { text: "):", className: "plain" }],
      [{ text: "  return ", className: "kw" }, { text: "await", className: "kw" }, { text: " model.infer(body)", className: "plain" }],
    ],
  },
  {
    id: "fastapi-2",
    tech: "FastAPI",
    typingLines: [1],
    lines: [
      [{ text: "@app.get", className: "fn" }, { text: "(", className: "plain" }, { text: "'/health'", className: "str" }, { text: ")", className: "plain" }],
      [{ text: "async def ", className: "kw" }, { text: "health", className: "fn" }, { text: "():", className: "plain" }],
      [{ text: "  return ", className: "kw" }, { text: "{ ", className: "plain" }, { text: '"status"', className: "str" }, { text: ": ", className: "plain" }, { text: '"ok"', className: "str" }, { text: " }", className: "plain" }],
    ],
  },
  {
    id: "tensorflow-1",
    tech: "TensorFlow",
    typingLines: [1],
    lines: [
      [{ text: "import ", className: "kw" }, { text: "tensorflow", className: "fn" }, { text: " as ", className: "kw" }, { text: "tf", className: "ty" }],
      [],
      [{ text: "model = ", className: "plain" }, { text: "tf.keras.Sequential", className: "fn" }, { text: "([", className: "plain" }],
      [{ text: "  tf.keras.layers.Dense(", className: "plain" }, { text: "128", className: "num" }, { text: ", activation=", className: "plain" }, { text: "'relu'", className: "str" }, { text: "),", className: "plain" }],
      [{ text: "  tf.keras.layers.Dropout(", className: "plain" }, { text: "0.2", className: "num" }, { text: "),", className: "plain" }],
      [{ text: "])", className: "plain" }],
    ],
  },
  {
    id: "tensorflow-2",
    tech: "TensorFlow",
    typingLines: [2],
    lines: [
      [{ text: "model.compile(", className: "plain" }],
      [{ text: "  optimizer=", className: "plain" }, { text: "tf.keras.optimizers.Adam", className: "fn" }, { text: "(", className: "plain" }, { text: "1e-3", className: "num" }, { text: "),", className: "plain" }],
      [{ text: "  loss=", className: "plain" }, { text: "'binary_crossentropy'", className: "str" }, { text: ",", className: "plain" }],
      [{ text: "  metrics=[", className: "plain" }, { text: "'accuracy'", className: "str" }, { text: "]", className: "plain" }],
      [{ text: ")", className: "plain" }],
    ],
  },
  {
    id: "mongodb-1",
    tech: "MongoDB",
    typingLines: [1, 2],
    lines: [
      [{ text: "// aggregation pipeline", className: "cm" }],
      [{ text: "db.projects.aggregate([", className: "plain" }],
      [{ text: "  { ", className: "plain" }, { text: "$match", className: "fn" }, { text: ": { status: ", className: "plain" }, { text: "'active'", className: "str" }, { text: " } },", className: "plain" }],
      [{ text: "  { ", className: "plain" }, { text: "$sort", className: "fn" }, { text: ": { score: ", className: "plain" }, { text: "-1", className: "num" }, { text: " } }", className: "plain" }],
      [{ text: "]);", className: "plain" }],
    ],
  },
  {
    id: "mongodb-2",
    tech: "MongoDB",
    typingLines: [1],
    lines: [
      [{ text: "db.users.find({", className: "plain" }],
      [{ text: "  skills: { ", className: "plain" }, { text: "$in", className: "fn" }, { text: ": [", className: "plain" }, { text: "'React'", className: "str" }, { text: ", ", className: "plain" }, { text: "'Python'", className: "str" }, { text: "] }", className: "plain" }],
      [{ text: "}).limit(", className: "plain" }, { text: "10", className: "num" }, { text: ");", className: "plain" }],
    ],
  },
];

function lineToText(line: CodeLine) {
  return line.map((token) => token.text).join("");
}

function isInExclusionZone(x: number, y: number) {
  const dx = (x - EXCLUSION.cx) / EXCLUSION.rx;
  const dy = (y - EXCLUSION.cy) / EXCLUSION.ry;
  return dx * dx + dy * dy < 1;
}

function isTooCloseToEdge(x: number, y: number) {
  return (
    x < EDGE_MARGIN ||
    x > 100 - EDGE_MARGIN ||
    y < EDGE_MARGIN ||
    y > 100 - EDGE_MARGIN
  );
}

function isValidPosition(x: number, y: number, occupied: { x: number; y: number }[]) {
  if (isTooCloseToEdge(x, y) || isInExclusionZone(x, y)) return false;
  return !occupied.some((point) => {
    const dx = x - point.x;
    const dy = y - point.y;
    return Math.hypot(dx, dy) < MIN_SNIPPET_DISTANCE;
  });
}

function pickRandomPosition(occupied: { x: number; y: number }[]) {
  const zones = [
    { xMin: 12, xMax: 26, yMin: 14, yMax: 26 },
    { xMin: 74, xMax: 88, yMin: 14, yMax: 26 },
    { xMin: 10, xMax: 22, yMin: 30, yMax: 44 },
    { xMin: 78, xMax: 90, yMin: 30, yMax: 44 },
    { xMin: 14, xMax: 28, yMin: 52, yMax: 66 },
    { xMin: 72, xMax: 86, yMin: 52, yMax: 66 },
    { xMin: 16, xMax: 30, yMin: 70, yMax: 82 },
    { xMin: 70, xMax: 84, yMin: 70, yMax: 82 },
  ];

  const shuffled = [...zones].sort(() => Math.random() - 0.5);

  for (const zone of shuffled) {
    for (let attempt = 0; attempt < 12; attempt++) {
      const x = zone.xMin + Math.random() * (zone.xMax - zone.xMin);
      const y = zone.yMin + Math.random() * (zone.yMax - zone.yMin);
      if (isValidPosition(x, y, occupied)) return { x, y };
    }
  }

  for (let attempt = 0; attempt < 40; attempt++) {
    const x = EDGE_MARGIN + Math.random() * (100 - EDGE_MARGIN * 2);
    const y = EDGE_MARGIN + Math.random() * (100 - EDGE_MARGIN * 2);
    if (isValidPosition(x, y, occupied)) return { x, y };
  }

  return {
    x: 15 + Math.random() * 70,
    y: 15 + Math.random() * 70,
  };
}

function pickRandomTemplate(excludeIds: string[] = []) {
  const available = SNIPPET_TEMPLATES.filter((t) => !excludeIds.includes(t.id));
  const pool = available.length > 0 ? available : SNIPPET_TEMPLATES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function createSnippetInstance(
  occupied: { x: number; y: number }[],
  excludeTemplateIds: string[] = [],
  spawnDelay = 0,
): SnippetInstance {
  const { x, y } = pickRandomPosition(occupied);
  const template = pickRandomTemplate(excludeTemplateIds);

  return {
    instanceId: `${template.id}-${Math.random().toString(36).slice(2, 9)}`,
    template,
    x,
    y,
    rotate: (Math.random() - 0.5) * 4,
    floatDuration: 22 + Math.random() * 16,
    driftY: 8 + Math.random() * 14,
    parallaxFactor: 0.4 + Math.random() * 0.9,
    baseOpacity: 0.2 + Math.random() * 0.1,
    blur: 0.4 + Math.random() * 0.6,
    spawnDelay,
  };
}

function createInitialSnippets(count: number): SnippetInstance[] {
  const snippets: SnippetInstance[] = [];
  const occupied: { x: number; y: number }[] = [];
  const usedTemplates: string[] = [];

  for (let i = 0; i < count; i++) {
    const instance = createSnippetInstance(occupied, usedTemplates, i * 0.9);
    snippets.push(instance);
    occupied.push({ x: instance.x, y: instance.y });
    usedTemplates.push(instance.template.id);
  }

  return snippets;
}

function CodeToken({ token }: { token: Token }) {
  const classNames = [
    styles.token,
    token.className ? styles[token.className] : styles.plain,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{token.text}</span>;
}

type LifecyclePhase = "waiting" | "fadeIn" | "typing" | "pause" | "fadeOut";

function FloatingSnippet({
  instance,
  reducedMotion,
  isMobile,
  onCycleComplete,
}: {
  instance: SnippetInstance;
  reducedMotion: boolean | null;
  isMobile: boolean;
  onCycleComplete: (instanceId: string) => void;
}) {
  const { springX, springY, isPointerFine } = useMouse();
  const [phase, setPhase] = useState<LifecyclePhase>(
    reducedMotion ? "pause" : instance.spawnDelay > 0 ? "waiting" : "fadeIn",
  );
  const [typedChars, setTypedChars] = useState<Record<number, number>>({});

  // Parallax is pointer-only — returns 0 on mobile/touch automatically
  const parallaxX = useTransform(springX, (value) => {
    if (!isPointerFine || reducedMotion || isMobile) return 0;
    return (value / window.innerWidth - 0.5) * instance.parallaxFactor * 18;
  });

  const parallaxY = useTransform(springY, (value) => {
    if (!isPointerFine || reducedMotion || isMobile) return 0;
    return (value / window.innerHeight - 0.5) * instance.parallaxFactor * 14;
  });

  const typingTargets = useMemo(() => {
    return instance.template.typingLines.map((lineIndex) => ({
      lineIndex,
      text: lineToText(instance.template.lines[lineIndex] ?? []),
    }));
  }, [instance.template]);

  useEffect(() => {
    // On mobile skip the full typing lifecycle — just fade in and stay static.
    // This eliminates dozens of setTimeout calls per snippet.
    if (reducedMotion || isMobile) return;

    const timers: number[] = [];

    if (phase === "waiting") {
      timers.push(
        window.setTimeout(() => setPhase("fadeIn"), instance.spawnDelay * 1000),
      );
    }

    if (phase === "fadeIn") {
      timers.push(window.setTimeout(() => setPhase("typing"), 700));
    }

    if (phase === "typing") {
      let delay = 0;
      typingTargets.forEach(({ lineIndex, text }) => {
        for (let char = 1; char <= text.length; char++) {
          delay += 28 + Math.random() * 18;
          timers.push(
            window.setTimeout(() => {
              setTypedChars((prev) => ({ ...prev, [lineIndex]: char }));
            }, delay),
          );
        }
        delay += 120;
      });
      timers.push(window.setTimeout(() => setPhase("pause"), delay + 200));
    }

    if (phase === "pause") {
      timers.push(
        window.setTimeout(() => setPhase("fadeOut"), 1800 + Math.random() * 1400),
      );
    }

    if (phase === "fadeOut") {
      timers.push(
        window.setTimeout(() => onCycleComplete(instance.instanceId), 900),
      );
    }

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [
    phase,
    reducedMotion,
    isMobile,
    instance.spawnDelay,
    instance.instanceId,
    typingTargets,
    onCycleComplete,
  ]);

  const opacity =
    phase === "waiting"
      ? 0
      : phase === "fadeIn"
        ? instance.baseOpacity
        : phase === "fadeOut"
          ? 0
          : instance.baseOpacity;

  const showCursor =
    !reducedMotion &&
    !isMobile &&
    (phase === "typing" || phase === "pause") &&
    typingTargets.some(
      ({ lineIndex, text }) => (typedChars[lineIndex] ?? 0) < text.length,
    );

  const activeTypingLine = typingTargets.find(
    ({ lineIndex, text }) => (typedChars[lineIndex] ?? 0) < text.length,
  )?.lineIndex;

  return (
    <motion.div
      className={styles.parallaxWrap}
      style={{
        left: `${instance.x}%`,
        top: `${instance.y}%`,
        x: parallaxX,
        y: parallaxY,
      }}
      aria-hidden
    >
      <motion.div
        className={styles.snippet}
        style={{
          rotate: instance.rotate,
          // No blur on mobile — even 0.5px blur creates a stacking context
          filter: !isMobile && instance.blur > 0.5 ? `blur(0.5px)` : undefined,
        }}
        initial={{ opacity: 0 }}
        animate={
          reducedMotion || isMobile
            ? { opacity: instance.baseOpacity, y: 0 }
            : {
                opacity,
                y: [0, -instance.driftY, instance.driftY * 0.4, -instance.driftY * 0.6, 0],
              }
        }
        transition={
          reducedMotion || isMobile
            ? { duration: 0.6, ease: "easeOut" }
            : phase === "fadeIn" || phase === "fadeOut"
              ? { opacity: { duration: phase === "fadeIn" ? 0.7 : 0.9, ease: "easeOut" } }
              : {
                  opacity: { duration: 0.6 },
                  y: {
                    // Slow float down on mobile to reduce compositor work
                    duration: instance.floatDuration * (isMobile ? 1.8 : 1),
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
        }
      >
      <div className={styles.windowChrome}>
        <span className={styles.windowDot} />
        <span className={styles.windowDot} />
        <span className={styles.windowDot} />
        <span className={styles.windowLabel}>{instance.template.tech}</span>
      </div>

      <pre className={styles.pre}>
        <code>
          {instance.template.lines.map((line, lineIndex) => {
            const isTypingLine = instance.template.typingLines.includes(lineIndex);
            const fullText = lineToText(line);
            // On mobile show all text immediately — no character-by-character state
            const visibleCount = reducedMotion || isMobile
              ? fullText.length
              : isTypingLine
                ? typedChars[lineIndex] ?? 0
                : phase === "waiting" || phase === "fadeIn"
                  ? 0
                  : fullText.length;

            const showLine =
              reducedMotion ||
              isMobile ||
              !isTypingLine ||
              visibleCount > 0 ||
              phase === "pause" ||
              phase === "fadeOut";

            if (!showLine && line.length === 0) {
              return (
                <div key={lineIndex} className={styles.line}>
                  {"\u00A0"}
                </div>
              );
            }

            if (!showLine) return null;

            return (
              <div key={lineIndex} className={styles.line}>
                {line.length === 0 ? (
                  "\u00A0"
                ) : isTypingLine ? (
                  <>
                    <span className={styles.plain}>{fullText.slice(0, visibleCount)}</span>
                    {showCursor && activeTypingLine === lineIndex && (
                      <motion.span
                        className={styles.cursor}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </>
                ) : (
                  line.map((token, tokenIndex) => (
                    <CodeToken key={tokenIndex} token={token} />
                  ))
                )}
              </div>
            );
          })}
        </code>
      </pre>
      </motion.div>
    </motion.div>
  );
}

export default function HeroCodeBackground({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  const [mounted, setMounted] = useState(false);
  const [snippets, setSnippets] = useState<SnippetInstance[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const resolveCount = () => {
      if (window.innerWidth < 640) return MAX_SNIPPETS_MOBILE;
      if (window.innerWidth < 900) return 4;
      return MAX_SNIPPETS;
    };

    const syncSnippets = () => {
      const nextCount = resolveCount();
      setSnippets((prev) => {
        if (prev.length === 0) {
          return createInitialSnippets(nextCount);
        }
        if (prev.length === nextCount) return prev;
        if (prev.length < nextCount) {
          const occupied = prev.map((s) => ({ x: s.x, y: s.y }));
          const usedTemplates = prev.map((s) => s.template.id);
          const added = Array.from({ length: nextCount - prev.length }, (_, i) => {
            const instance = createSnippetInstance(occupied, usedTemplates, i * 0.6);
            occupied.push({ x: instance.x, y: instance.y });
            usedTemplates.push(instance.template.id);
            return instance;
          });
          return [...prev, ...added];
        }
        return prev.slice(0, nextCount);
      });
    };

    syncSnippets();
    setMounted(true);

    // Debounce resize to avoid thrashing snippet state
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(syncSnippets, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  const handleCycleComplete = useCallback((instanceId: string) => {
    // On mobile snippets don't cycle — they stay static, so this is never called
    setSnippets((prev) => {
      const occupied = prev
        .filter((s) => s.instanceId !== instanceId)
        .map((s) => ({ x: s.x, y: s.y }));
      const usedTemplates = prev
        .filter((s) => s.instanceId !== instanceId)
        .map((s) => s.template.id);

      return prev.map((snippet) =>
        snippet.instanceId === instanceId
          ? createSnippetInstance(occupied, usedTemplates, 0.2)
          : snippet,
      );
    });
  }, []);

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.contentMask} />
      {mounted &&
        snippets.map((snippet) => (
          <FloatingSnippet
            key={snippet.instanceId}
            instance={snippet}
            reducedMotion={reducedMotion}
            isMobile={isMobile}
            onCycleComplete={handleCycleComplete}
          />
        ))}
    </div>
  );
}
