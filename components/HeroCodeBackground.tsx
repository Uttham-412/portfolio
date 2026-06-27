"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import styles from "./HeroCodeBackground.module.css";

type TokenClass = "kw" | "ty" | "str" | "fn" | "cm" | "op" | "num" | "plain";

type Token = {
  text: string;
  className?: TokenClass;
  highlight?: boolean;
};

type CodeLine = Token[];

type SnippetConfig = {
  id: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  fontSize: number;
  baseOpacity: number;
  blur: number;
  rotate: number;
  floatDuration: number;
  floatDelay: number;
  driftY: number;
  lines: CodeLine[];
  typingLineIndex?: number;
  showCursor?: boolean;
  particles?: boolean;
  hideBelow?: "md" | "sm";
};

const CODE_SNIPPETS: SnippetConfig[] = [
  {
    id: "pytorch",
    top: "7%",
    left: "2%",
    fontSize: 11,
    baseOpacity: 0.09,
    blur: 0.6,
    rotate: -2,
    floatDuration: 28,
    floatDelay: 0,
    driftY: 18,
    showCursor: true,
    particles: true,
    lines: [
      [{ text: "import ", className: "kw" }, { text: "torch", className: "fn" }],
      [{ text: "import ", className: "kw" }, { text: "torch.nn", className: "fn" }, { text: " as ", className: "kw" }, { text: "nn", className: "ty" }],
      [],
      [{ text: "class ", className: "kw" }, { text: "CareerPathModel", className: "ty" }, { text: "(", className: "plain" }, { text: "nn.Module", className: "ty" }, { text: "):", className: "plain" }],
      [{ text: "  def ", className: "kw" }, { text: "__init__", className: "fn" }, { text: "(", className: "plain" }, { text: "self", className: "kw" }, { text: ", dim):", className: "plain" }],
      [{ text: "    self.encoder = ", className: "plain" }, { text: "nn.Linear", className: "fn" }, { text: "(dim, ", className: "plain" }, { text: "512", className: "num" }, { text: ")", className: "plain" }],
      [{ text: "    self.head = ", className: "plain" }, { text: "nn.Sequential", className: "fn" }, { text: "(", className: "plain" }],
      [{ text: "      nn.ReLU(), ", className: "plain" }, { text: "nn.Linear", className: "fn" }, { text: "(", className: "plain" }, { text: "512", className: "num" }, { text: ", ", className: "plain" }, { text: "128", className: "num" }, { text: "))", className: "plain" }],
      [],
      [{ text: "  def ", className: "kw" }, { text: "forward", className: "fn" }, { text: "(", className: "plain" }, { text: "self", className: "kw" }, { text: ", x):", className: "plain" }],
      [{ text: "    z = ", className: "plain" }, { text: "self.encoder", className: "fn" }, { text: "(x)", className: "plain" }],
      [{ text: "    return ", className: "kw" }, { text: "self.head", className: "fn" }, { text: "(z)", className: "plain" }],
    ],
  },
  {
    id: "react",
    top: "10%",
    right: "1.5%",
    fontSize: 10,
    baseOpacity: 0.08,
    blur: 0.4,
    rotate: 1.5,
    floatDuration: 32,
    floatDelay: 2,
    driftY: 14,
    typingLineIndex: 8,
    lines: [
      [{ text: "'use client'", className: "str" }, { text: ";", className: "plain" }],
      [],
      [{ text: "import ", className: "kw" }, { text: "{ useMemo }", className: "plain" }, { text: " from ", className: "kw" }, { text: "'react'", className: "str" }],
      [{ text: "import ", className: "kw" }, { text: "type ", className: "kw" }, { text: "{ Project }", className: "ty" }, { text: " from ", className: "kw" }, { text: "'@/types'", className: "str" }],
      [],
      [{ text: "export function ", className: "kw" }, { text: "ProjectCard", className: "fn" }, { text: "({", className: "plain" }],
      [{ text: "  project,", className: "plain" }],
      [{ text: "}: { project: ", className: "plain" }, { text: "Project", className: "ty" }, { text: " }) {", className: "plain" }],
      [{ text: "  const ", className: "kw" }, { text: "tags", className: "plain" }, { text: " = ", className: "op" }, { text: "useMemo", className: "fn" }, { text: "(() =>", className: "plain" }],
      [{ text: "    project.stack.filter(Boolean)", className: "plain" }],
      [{ text: "  , [project]);", className: "plain" }],
      [],
      [{ text: "  return (", className: "kw" }],
      [{ text: "    <article className=", className: "plain" }, { text: "'glass-card'", className: "str" }, { text: ">", className: "plain" }],
      [{ text: "      <h3>{project.name}</h3>", className: "plain" }],
      [{ text: "    </article>", className: "plain" }],
      [{ text: "  );", className: "plain" }],
      [{ text: "}", className: "plain" }],
    ],
  },
  {
    id: "fastapi",
    top: "36%",
    left: "0.5%",
    fontSize: 10,
    baseOpacity: 0.07,
    blur: 1.2,
    rotate: -1,
    floatDuration: 36,
    floatDelay: 1,
    driftY: 22,
    lines: [
      [{ text: "from ", className: "kw" }, { text: "fastapi", className: "fn" }, { text: " import ", className: "kw" }, { text: "FastAPI", className: "ty" }],
      [{ text: "from ", className: "kw" }, { text: "pydantic", className: "fn" }, { text: " import ", className: "kw" }, { text: "BaseModel", className: "ty" }],
      [],
      [{ text: "app = ", className: "plain" }, { text: "FastAPI", className: "ty" }, { text: "()", className: "plain" }],
      [],
      [{ text: "class ", className: "kw" }, { text: "InferenceRequest", className: "ty" }, { text: "(", className: "plain" }, { text: "BaseModel", className: "ty" }, { text: "):", className: "plain" }],
      [{ text: "  prompt: ", className: "plain" }, { text: "str", className: "ty" }],
      [{ text: "  temperature: ", className: "plain" }, { text: "float", className: "ty" }, { text: " = ", className: "op" }, { text: "0.2", className: "num" }],
      [],
      [{ text: "@app.post", className: "fn" }, { text: "(", className: "plain" }, { text: "'/predict'", className: "str" }, { text: ")", className: "plain" }],
      [{ text: "async def ", className: "kw" }, { text: "predict", className: "fn", highlight: true }, { text: "(body: ", className: "plain" }, { text: "InferenceRequest", className: "ty" }, { text: "):", className: "plain" }],
      [{ text: "  embedding = ", className: "plain" }, { text: "await", className: "kw" }, { text: " encode(body.prompt)", className: "plain" }],
      [{ text: "  return ", className: "kw" }, { text: "{ ", className: "plain" }, { text: "'vector'", className: "str" }, { text: ": embedding }", className: "plain" }],
    ],
  },
  {
    id: "mongodb",
    top: "34%",
    right: "0.5%",
    fontSize: 11,
    baseOpacity: 0.1,
    blur: 0.5,
    rotate: 2,
    floatDuration: 30,
    floatDelay: 3,
    driftY: 16,
    showCursor: true,
    particles: true,
    lines: [
      [{ text: "// MongoDB aggregation pipeline", className: "cm" }],
      [{ text: "db.projects.aggregate([", className: "plain" }],
      [{ text: "  { ", className: "plain" }, { text: "$match", className: "fn" }, { text: ": { status: ", className: "plain" }, { text: "'active'", className: "str" }, { text: " } },", className: "plain" }],
      [{ text: "  { ", className: "plain" }, { text: "$lookup", className: "fn" }, { text: ": {", className: "plain" }],
      [{ text: "      from: ", className: "plain" }, { text: "'skills'", className: "str" }, { text: ",", className: "plain" }],
      [{ text: "      localField: ", className: "plain" }, { text: "'stack'", className: "str" }, { text: ",", className: "plain" }],
      [{ text: "      foreignField: ", className: "plain" }, { text: "'name'", className: "str" }, { text: ",", className: "plain" }],
      [{ text: "      as: ", className: "plain" }, { text: "'matchedSkills'", className: "str" }],
      [{ text: "  }},", className: "plain" }],
      [{ text: "  { ", className: "plain" }, { text: "$project", className: "fn" }, { text: ": {", className: "plain" }],
      [{ text: "      name: ", className: "plain" }, { text: "1", className: "num" }, { text: ",", className: "plain" }],
      [{ text: "      score: { ", className: "plain" }, { text: "$size", className: "fn" }, { text: ": ", className: "plain" }, { text: "'$matchedSkills'", className: "str" }, { text: " }", className: "plain" }],
      [{ text: "  }}", className: "plain" }],
      [{ text: "]);", className: "plain" }],
    ],
  },
  {
    id: "tensorflow",
    bottom: "20%",
    left: "2%",
    fontSize: 10,
    baseOpacity: 0.06,
    blur: 1.4,
    rotate: 1,
    floatDuration: 34,
    floatDelay: 4,
    driftY: 20,
    lines: [
      [{ text: "import ", className: "kw" }, { text: "tensorflow", className: "fn" }, { text: " as ", className: "kw" }, { text: "tf", className: "ty" }],
      [],
      [{ text: "model = ", className: "plain" }, { text: "tf.keras.Sequential", className: "fn" }, { text: "([", className: "plain" }],
      [{ text: "  tf.keras.layers.Dense(", className: "plain" }, { text: "256", className: "num" }, { text: ", activation=", className: "plain" }, { text: "'relu'", className: "str" }, { text: "),", className: "plain" }],
      [{ text: "  tf.keras.layers.Dropout(", className: "plain" }, { text: "0.3", className: "num" }, { text: "),", className: "plain" }],
      [{ text: "  tf.keras.layers.Dense(", className: "plain" }, { text: "64", className: "num" }, { text: ", activation=", className: "plain" }, { text: "'relu'", className: "str" }, { text: "),", className: "plain" }],
      [{ text: "  tf.keras.layers.Dense(", className: "plain" }, { text: "1", className: "num" }, { text: ", activation=", className: "plain" }, { text: "'sigmoid'", className: "str" }, { text: ")", className: "plain" }],
      [{ text: "])", className: "plain" }],
      [],
      [{ text: "model.compile(", className: "plain" }],
      [{ text: "  optimizer=", className: "plain" }, { text: "tf.keras.optimizers.Adam", className: "fn", highlight: true }, { text: "(", className: "plain" }, { text: "1e-3", className: "num" }, { text: "),", className: "plain" }],
      [{ text: "  loss=", className: "plain" }, { text: "'binary_crossentropy'", className: "str" }],
      [{ text: ")", className: "plain" }],
    ],
  },
  {
    id: "langchain",
    bottom: "16%",
    right: "2%",
    fontSize: 11,
    baseOpacity: 0.08,
    blur: 0.8,
    rotate: -1.5,
    floatDuration: 26,
    floatDelay: 1.5,
    driftY: 12,
    typingLineIndex: 5,
    lines: [
      [{ text: "from ", className: "kw" }, { text: "langchain_openai", className: "fn" }, { text: " import ", className: "kw" }, { text: "ChatOpenAI", className: "ty" }],
      [{ text: "from ", className: "kw" }, { text: "langchain.chains", className: "fn" }, { text: " import ", className: "kw" }, { text: "RetrievalQA", className: "ty" }],
      [],
      [{ text: "llm = ", className: "plain" }, { text: "ChatOpenAI", className: "ty" }, { text: "(model=", className: "plain" }, { text: "'gpt-4o-mini'", className: "str" }, { text: ")", className: "plain" }],
      [{ text: "retriever = ", className: "plain" }, { text: "vector_store", className: "fn" }, { text: ".as_retriever(k=", className: "plain" }, { text: "6", className: "num" }, { text: ")", className: "plain" }],
      [],
      [{ text: "chain = ", className: "plain" }, { text: "RetrievalQA", className: "ty" }, { text: ".from_chain_type(", className: "plain" }],
      [{ text: "  llm=llm,", className: "plain" }],
      [{ text: "  retriever=retriever,", className: "plain" }],
      [{ text: "  chain_type=", className: "plain" }, { text: "'stuff'", className: "str" }],
      [{ text: ")", className: "plain" }],
      [],
      [{ text: "answer = ", className: "plain" }, { text: "chain.invoke", className: "fn" }, { text: "({ ", className: "plain" }, { text: "'query'", className: "str" }, { text: ": user_prompt })", className: "plain" }],
    ],
  },
  {
    id: "typescript",
    top: "62%",
    left: "3%",
    fontSize: 10,
    baseOpacity: 0.07,
    blur: 1,
    rotate: 2.5,
    floatDuration: 38,
    floatDelay: 2.5,
    driftY: 24,
    hideBelow: "md",
    lines: [
      [{ text: "type ", className: "kw" }, { text: "SkillVector", className: "ty" }, { text: " = {", className: "plain" }],
      [{ text: "  name: ", className: "plain" }, { text: "string", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "  weight: ", className: "plain" }, { text: "number", className: "ty" }, { text: ";", className: "plain" }],
      [{ text: "};", className: "plain" }],
      [],
      [{ text: "async function ", className: "kw" }, { text: "rankCandidates", className: "fn", highlight: true }, { text: "(", className: "plain" }],
      [{ text: "  skills: ", className: "plain" }, { text: "SkillVector", className: "ty" }, { text: "[]", className: "plain" }],
      [{ text: "): ", className: "plain" }, { text: "Promise", className: "ty" }, { text: "<number[]> {", className: "plain" }],
      [{ text: "  return ", className: "kw" }, { text: "skills", className: "plain" }],
      [{ text: "    .map(s => s.weight)", className: "plain" }],
      [{ text: "    .sort((a, b) => b - a);", className: "plain" }],
      [{ text: "}", className: "plain" }],
    ],
  },
  {
    id: "ml-algo",
    bottom: "8%",
    right: "3%",
    fontSize: 10,
    baseOpacity: 0.09,
    blur: 0.3,
    rotate: -2.5,
    floatDuration: 29,
    floatDelay: 0.8,
    driftY: 15,
    hideBelow: "sm",
    showCursor: true,
    lines: [
      [{ text: "# cosine similarity — RAG retrieval", className: "cm" }],
      [{ text: "def ", className: "kw" }, { text: "cosine_sim", className: "fn" }, { text: "(a, b):", className: "plain" }],
      [{ text: "  dot = ", className: "plain" }, { text: "np.dot", className: "fn" }, { text: "(a, b)", className: "plain" }],
      [{ text: "  norm = ", className: "plain" }, { text: "np.linalg.norm", className: "fn" }, { text: "(a) * ", className: "plain" }, { text: "np.linalg.norm", className: "fn" }, { text: "(b)", className: "plain" }],
      [{ text: "  return ", className: "kw" }, { text: "dot / ", className: "plain" }, { text: "max", className: "fn" }, { text: "(norm, ", className: "plain" }, { text: "1e-9", className: "num" }, { text: ")", className: "plain" }],
      [],
      [{ text: "scores = [", className: "plain" }],
      [{ text: "  cosine_sim(query_vec, doc)", className: "plain" }],
      [{ text: "  for doc in ", className: "kw" }, { text: "corpus_embeddings", className: "fn", highlight: true }],
      [{ text: "]", className: "plain" }],
      [{ text: "top_k = ", className: "plain" }, { text: "np.argsort", className: "fn" }, { text: "(scores)[::-", className: "plain" }, { text: "1", className: "num" }, { text: "][:", className: "plain" }, { text: "5", className: "num" }, { text: "]", className: "plain" }],
    ],
  },
];

function lineToText(line: CodeLine) {
  return line.map((token) => token.text).join("");
}

function CodeToken({
  token,
  pulseHighlight,
}: {
  token: Token;
  pulseHighlight: boolean;
}) {
  const classNames = [
    styles.token,
    token.className ? styles[token.className] : styles.plain,
    token.highlight ? styles.highlightWord : "",
    token.highlight && pulseHighlight ? styles.highlightActive : "",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={classNames}>{token.text}</span>;
}

function TypingLine({ text, startDelay }: { text: string; startDelay: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(prefersReducedMotion ? text.length : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisible(text.length);
      return;
    }

    let intervalId = 0;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setVisible((current) => {
          if (current >= text.length) {
            window.clearInterval(intervalId);
            return current;
          }
          return current + 1;
        });
      }, 38);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [prefersReducedMotion, startDelay, text]);

  return <span className={styles.plain}>{text.slice(0, visible)}</span>;
}

function SnippetParticles({ count = 4 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        top: `${12 + index * 18}%`,
        left: `${index % 2 === 0 ? -8 : 92}%`,
        size: 2 + (index % 2),
        duration: 3.5 + index * 0.6,
        delay: index * 0.4,
      })),
    [count],
  );

  return (
    <>
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={styles.particle}
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            opacity: [0.15, 0.55, 0.2],
            y: [0, -6, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
          aria-hidden
        />
      ))}
    </>
  );
}

function CodeSnippet({
  snippet,
  reducedMotion,
}: {
  snippet: SnippetConfig;
  reducedMotion: boolean | null;
}) {
  const [highlightPulse, setHighlightPulse] = useState(false);
  const typingText =
    snippet.typingLineIndex !== undefined
      ? lineToText(snippet.lines[snippet.typingLineIndex] ?? [])
      : "";

  useEffect(() => {
    if (reducedMotion) return;

    const hasHighlight = snippet.lines.some((line) =>
      line.some((token) => token.highlight),
    );
    if (!hasHighlight) return;

    let timeoutId = 0;
    const pulse = () => {
      setHighlightPulse(true);
      timeoutId = window.setTimeout(() => {
        setHighlightPulse(false);
        timeoutId = window.setTimeout(pulse, 4200 + Math.random() * 3000);
      }, 900);
    };

    timeoutId = window.setTimeout(pulse, 2000 + snippet.floatDelay * 400);
    return () => window.clearTimeout(timeoutId);
  }, [reducedMotion, snippet.floatDelay, snippet.lines]);

  const opacityRange = [
    snippet.baseOpacity * 0.75,
    snippet.baseOpacity,
    snippet.baseOpacity * 0.85,
    snippet.baseOpacity * 0.95,
    snippet.baseOpacity * 0.75,
  ];

  return (
    <motion.div
      className={[
        styles.snippet,
        snippet.hideBelow === "md" ? styles.hideMd : "",
        snippet.hideBelow === "sm" ? styles.hideSm : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        top: snippet.top,
        left: snippet.left,
        right: snippet.right,
        bottom: snippet.bottom,
        fontSize: snippet.fontSize,
        filter: `blur(${snippet.blur}px)`,
        rotate: snippet.rotate,
      }}
      initial={{ opacity: 0 }}
      animate={
        reducedMotion
          ? { opacity: snippet.baseOpacity, y: 0 }
          : {
              opacity: opacityRange,
              y: [0, -snippet.driftY, snippet.driftY * 0.35, -snippet.driftY * 0.65, 0],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.6 }
          : {
              duration: snippet.floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: snippet.floatDelay,
            }
      }
      aria-hidden
    >
      {snippet.particles && <SnippetParticles />}

      <pre className={styles.pre}>
        <code>
          {snippet.lines.map((line, lineIndex) => (
            <div key={`${snippet.id}-${lineIndex}`} className={styles.line}>
              {line.length === 0 ? (
                "\u00A0"
              ) : snippet.typingLineIndex === lineIndex ? (
                <>
                  <TypingLine
                    text={typingText}
                    startDelay={1800 + snippet.floatDelay * 500}
                  />
                  {snippet.showCursor && (
                    <motion.span
                      className={styles.cursor}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{
                        duration: 1.05,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                </>
              ) : (
                line.map((token, tokenIndex) => (
                  <CodeToken
                    key={`${snippet.id}-${lineIndex}-${tokenIndex}`}
                    token={token}
                    pulseHighlight={highlightPulse}
                  />
                ))
              )}
              {snippet.showCursor &&
                snippet.typingLineIndex !== lineIndex &&
                lineIndex === snippet.lines.length - 1 && (
                  <motion.span
                    className={styles.cursor}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 1.05,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.4,
                    }}
                  />
                )}
            </div>
          ))}
        </code>
      </pre>
    </motion.div>
  );
}

export default function HeroCodeBackground({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.contentMask} />
      {CODE_SNIPPETS.map((snippet) => (
        <CodeSnippet
          key={snippet.id}
          snippet={snippet}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
