"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

import { useRef } from "react";
import { globalAnimationEngine, type SnippetLine } from "@/lib/animationEngine";

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
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const cursorRefs = useRef<Record<number, HTMLSpanElement | null>>({});

  useEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    if (reducedMotion || isMobile || !outerEl || !innerEl || !globalAnimationEngine) return;

    const snippetLines: SnippetLine[] = instance.template.lines.map((line, lineIndex) => {
      const isTyping = instance.template.typingLines.includes(lineIndex);
      return {
        lineIndex,
        el: lineRefs.current[lineIndex] as HTMLElement,
        cursorEl: cursorRefs.current[lineIndex],
        fullText: lineToText(line),
        isTyping,
      };
    });

    const deregister = globalAnimationEngine.registerSnippet({
      id: instance.instanceId,
      outerEl,
      innerEl,
      lines: snippetLines,
      options: {
        x: instance.x,
        y: instance.y,
        rotate: instance.rotate,
        floatDuration: instance.floatDuration,
        driftY: instance.driftY,
        parallaxFactor: instance.parallaxFactor,
        baseOpacity: instance.baseOpacity,
        blur: instance.blur,
        spawnDelay: instance.spawnDelay,
      },
      phase: instance.spawnDelay > 0 ? "waiting" : "fadeIn",
      elapsedTime: 0,
      pauseDuration: 1.8 + Math.random() * 1.4, // in seconds
      onCycleComplete: () => {
        onCycleComplete(instance.instanceId);
      },
    });

    return deregister;
  }, [instance, reducedMotion, isMobile, onCycleComplete]);

  return (
    <div
      ref={outerRef}
      className={styles.parallaxWrap}
      style={{
        left: `${instance.x}%`,
        top: `${instance.y}%`,
        transform: reducedMotion || isMobile ? undefined : `translate3d(0, 0, 0)`,
      }}
      aria-hidden
    >
      <div
        ref={innerRef}
        className={styles.snippet}
        style={{
          transform: `rotate(${instance.rotate}deg)`,
          opacity: reducedMotion || isMobile ? instance.baseOpacity : 0,
          filter: !isMobile && instance.blur > 0.5 ? `blur(0.5px)` : undefined,
        }}
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
              const showText = reducedMotion || isMobile ? fullText : (isTypingLine ? "" : fullText);

              return (
                <div key={lineIndex} className={styles.line}>
                  {line.length === 0 ? (
                    "\u00A0"
                  ) : isTypingLine ? (
                    <>
                      <span
                        ref={(el) => {
                          lineRefs.current[lineIndex] = el;
                        }}
                        className={styles.plain}
                      >
                        {showText}
                      </span>
                      {(!reducedMotion && !isMobile) && (
                        <span
                          ref={(el) => {
                            cursorRefs.current[lineIndex] = el;
                          }}
                          className={styles.cursor}
                          style={{ display: "none" }}
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
      </div>
    </div>
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
