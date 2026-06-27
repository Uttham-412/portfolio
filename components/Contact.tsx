"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionReveal, { RevealItem } from "@/components/ui/SectionReveal";
import TiltCard from "@/components/ui/TiltCard";

const contactDetails = [
  { icon: "mail", label: "Email", value: "hello@devportfolio.com" },
  { icon: "code", label: "GitHub", value: "github.com/dev_senior" },
  {
    icon: "alternate_email",
    label: "LinkedIn",
    value: "linkedin.com/in/senior-dev",
  },
  { icon: "call", label: "Phone", value: "+91 98765 43210" },
  {
    icon: "location_on",
    label: "Location",
    value: "Bangalore, India",
    fullWidth: true,
  },
];

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8gL89fQSTpfh3bflbZYysombWEAEpqQDml4aeOEbWSw_5wImO_odZ4VtCqAzI4AwIHqWPCd0VeWz5tNS12fLK5mIPKtIn5KWhXXY5augr6g8pAc2s9eU09zRd_nagITJtjJeuP9R1KrmgiYPd0dnyJCr33a9zHl6t7TsYfhbXFObJ5Vh_183z1SVo9V-n69pVoDWwpB50Jl1AL1Am0Wp2ehtleGNHgBbNSlxLd-1kydiC5CoUtn_rYb6onVSSnMH27ANKGra9hfM";

export default function Contact() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      e.currentTarget.reset();
    }, 1500);
  };

  return (
    <section
      id="contact"
      className="min-h-screen pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <SectionReveal amount={0.12}>
          <RevealItem>
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-widest block">
                  Available for projects
                </span>
                <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg max-w-xl">
                  Let&apos;s Build Something{" "}
                  <span className="text-on-surface-variant">
                    Amazing Together
                  </span>
                  .
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                  Currently seeking high-impact opportunities where code meets
                  craft. Reach out to discuss your next project or just say hello.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 pt-4">
                {contactDetails.map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 group cursor-pointer ${
                      item.fullWidth ? "col-span-1 sm:col-span-2" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                      <span className="material-symbols-outlined text-primary">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                        {item.label}
                      </p>
                      <p className="font-body-md text-body-md text-primary">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 relative mt-8">
                <Image
                  src={MAP_IMAGE}
                  alt="Map of Bangalore, India"
                  fill
                  className="object-cover grayscale opacity-50"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
            </div>
          </RevealItem>
        </SectionReveal>

        <SectionReveal amount={0.12}>
          <RevealItem>
            <TiltCard
              className="glass-panel p-8 md:p-12 rounded-xl relative overflow-hidden"
              maxTilt={5}
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

              <form
                className="space-y-8 relative z-10"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 input-underline">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant block"
                      htmlFor="name"
                    >
                      NAME
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      type="text"
                    />
                  </div>
                  <div className="space-y-2 input-underline">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant block"
                      htmlFor="email"
                    >
                      EMAIL
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none"
                      id="email"
                      name="email"
                      placeholder="john@company.com"
                      required
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2 input-underline">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant block"
                    htmlFor="subject"
                  >
                    SUBJECT
                  </label>
                  <input
                    className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none"
                    id="subject"
                    name="subject"
                    placeholder="Project Inquiry"
                    required
                    type="text"
                  />
                </div>

                <div className="space-y-2 input-underline">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant block"
                    htmlFor="message"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 resize-none outline-none"
                    id="message"
                    name="message"
                    placeholder="Tell me about your project dreams..."
                    required
                    rows={5}
                  />
                </div>

                <div className="pt-4">
                  <MagneticButton
                    as="button"
                    type="submit"
                    className="w-full bg-primary text-background font-headline-md py-4 rounded-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    disabled={isSubmitting}
                    strength={0.18}
                  >
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    {!isSubmitting && (
                      <span className="material-symbols-outlined">
                        arrow_outward
                      </span>
                    )}
                  </MagneticButton>
                </div>
              </form>

              {showSuccess && (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20">
                  <div className="w-20 h-20 rounded-full border-2 border-primary flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">
                      check
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-2">
                    Message Received
                  </h3>
                  <p className="font-body-md text-on-surface-variant max-w-xs">
                    I&apos;ll get back to you within 24 hours. Looking forward to
                    our chat.
                  </p>
                  <button
                    type="button"
                    className="mt-8 text-primary font-label-sm border-b border-primary/20 hover:border-primary transition-all"
                    onClick={() => setShowSuccess(false)}
                  >
                    SEND ANOTHER
                  </button>
                </div>
              )}
            </TiltCard>
          </RevealItem>
        </SectionReveal>
      </div>
    </section>
  );
}
