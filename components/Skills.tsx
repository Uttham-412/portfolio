"use client";

import {
  motion,
  useInView,
  type Transition,
  type Variants,
} from "framer-motion";
import { useRef } from "react";
import TiltCard from "@/components/ui/TiltCard";
import SectionReveal, { RevealItem } from "@/components/ui/SectionReveal";

const skillCategories = [
  {
    title: "Programming",
    skills: ["Python", "C++", "JavaScript", "Java"],
    span: 1,
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    span: 1,
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "FastAPI", "Django"],
    span: 1,
  },
  {
    title: "AI & Machine Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "LangChain",
      "HuggingFace",
    ],
    span: 2,
    large: true,
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Pinecone", "Redis"],
    span: 1,
  },
  {
    title: "Tools",
    skills: ["Docker", "Git", "AWS", "Linux"],
    span: 1,
  },
];

const ARCHITECTURE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACAgMesnpFSTgmYGKzRnc5eXDC_aacQRv0IkqbU3LuO_HdD1RFmzMIqMYE09zevywvvfiDzQq_9-wu5Z_NxIuD_e3EMy3SdaWEfwkD3Bjd3N9HAoyhWZRu3GRmTgbr6xxoSCuWEwzm7dNxqbxJQ6Y5zIMTDV8XHg_moD3Rv7vDnoik-pdL2I2Q5FTavLIslSnrsI8z1nHzSXoDSMYV9PKiJsteSdn9M7BtFBj1z1clTgwZdGJKZ_r0F5Fn5xB4Dqjfy60rH_4ilbc";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const tagVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE, delay: index * 0.04 },
  }),
};

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} id="skills" className="relative pt-32 pb-section-gap">
      <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <SectionReveal amount={0.15}>
          <RevealItem>
            <div className="flex flex-col gap-unit mb-20">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/40">
                Expertise &amp; Stack
              </span>
              <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary max-w-3xl leading-[1.1] font-semibold">
                Crafting digital experiences with technical precision.
              </h2>
            </div>
          </RevealItem>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <RevealItem key={category.title}>
                <TiltCard
                  className={`glass-card-skills p-10 rounded-xl flex flex-col justify-between min-h-[260px] relative overflow-hidden ${
                    category.span === 2 ? "md:col-span-2" : ""
                  }`}
                  maxTilt={7}
                >
                  <div>
                    {category.large ? (
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="font-headline-md text-[24px] font-semibold text-primary/90 tracking-tight">
                          {category.title}
                        </h3>
                        <div className="hidden md:block">
                          <div className="w-16 h-px bg-white/10" />
                        </div>
                      </div>
                    ) : (
                      <h3 className="font-headline-md text-[24px] font-semibold text-primary/90 mb-8 tracking-tight">
                        {category.title}
                      </h3>
                    )}
                    <div
                      className={`flex flex-wrap ${category.large ? "gap-3" : "gap-2.5"}`}
                    >
                      {category.skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          custom={index}
                          variants={tagVariants}
                          initial="hidden"
                          animate={isInView ? "visible" : "hidden"}
                          className={`skill-chip font-label-sm text-[11px] rounded uppercase tracking-wider text-on-surface-variant/80 ${
                            category.large ? "px-4 py-2" : "px-3 py-1.5"
                          }`}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}

            <RevealItem>
              <TiltCard className="glass-card-skills p-1 rounded-xl md:col-span-2 overflow-hidden relative group cursor-pointer h-[260px]">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-surface-container-low">
                  <div
                    className="bg-cover bg-center w-full h-full opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000"
                    style={{ backgroundImage: `url('${ARCHITECTURE_IMAGE}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent p-10 flex flex-col justify-end">
                    <h4 className="font-headline-md text-[28px] font-bold text-primary tracking-tight">
                      Advanced System Architecture
                    </h4>
                    <p className="text-on-surface-variant/70 font-body-md mt-3 max-w-lg leading-relaxed">
                      Applying the full stack to build scalable, high-performance
                      distributed systems.
                    </p>
                  </div>
                </div>
              </TiltCard>
            </RevealItem>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
