"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionReveal, { RevealItem } from "@/components/ui/SectionReveal";
import TiltCard from "@/components/ui/TiltCard";
import {
  hasContactFormErrors,
  validateContactForm,
  type ContactFormErrors,
} from "@/lib/contact-form";

const contactDetails = [
  {
    icon: "mail",
    label: "Email",
    value: "uttham188@gmail.com",
    href: "mailto:uttham188@gmail.com",
  },
  {
    icon: "call",
    label: "Phone",
    value: "+91 7411231249",
    href: "tel:+917411231249",
  },
  {
    icon: "location_on",
    label: "Location",
    value: "Mangalore, Karnataka, India",
    fullWidth: true,
  },
  {
    icon: "code",
    label: "GitHub",
    value: "github.com/Uttham-412",
    href: "https://github.com/Uttham-412",
    external: true,
  },
  {
    icon: "alternate_email",
    label: "LinkedIn",
    value: "linkedin.com/in/uttham-poojary-809986302",
    href: "https://linkedin.com/in/uttham-poojary-809986302",
    external: true,
  },
  {
    icon: "description",
    label: "Resume",
    value: "Download Resume",
    href: "/Uttham_Poojary_Resume.pdf",
    download: true,
  },
];

const MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB8gL89fQSTpfh3bflbZYysombWEAEpqQDml4aeOEbWSw_5wImO_odZ4VtCqAzI4AwIHqWPCd0VeWz5tNS12fLK5mIPKtIn5KWhXXY5augr6g8pAc2s9eU09zRd_nagITJtjJeuP9R1KrmgiYPd0dnyJCr33a9zHl6t7TsYfhbXFObJ5Vh_183z1SVo9V-n69pVoDWwpB50Jl1AL1Am0Wp2ehtleGNHgBbNSlxLd-1kydiC5CoUtn_rYb6onVSSnMH27ANKGra9hfM";

function ContactDetail({
  item,
}: {
  item: (typeof contactDetails)[number];
}) {
  const content = (
    <>
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
        <span className="material-symbols-outlined text-primary">{item.icon}</span>
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
          {item.label}
        </p>
        <p className="font-body-md text-body-md text-primary group-hover:text-primary/90 transition-colors">
          {item.value}
        </p>
      </div>
    </>
  );

  const className = `flex items-center gap-4 group ${
    item.fullWidth ? "col-span-1 sm:col-span-2" : ""
  } ${item.href ? "cursor-pointer" : ""}`;

  if (item.href) {
    return (
      <a
        href={item.href}
        className={className}
        {...(item.external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...(item.download ? { download: true } : {})}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ContactFormErrors>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const errors = validateContactForm(payload);
    if (hasContactFormErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        error?: string;
        fieldErrors?: ContactFormErrors;
      };

      if (!response.ok) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        setSubmitError(
          result.error || "Something went wrong. Please try again.",
        );
        return;
      }

      setShowSuccess(true);
      formRef.current?.reset();
    } catch {
      setSubmitError(
        "Unable to send your message. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  I&apos;m currently looking for Full Stack Developer
                  opportunities, AI projects, internships, and freelance
                  collaborations. Feel free to connect with me.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-8 pt-4">
                {contactDetails.map((item) => (
                  <ContactDetail key={item.label} item={item} />
                ))}
              </div>

              <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 relative mt-8">
                <Image
                  src={MAP_IMAGE}
                  alt="Map of Mangalore, Karnataka, India"
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
                ref={formRef}
                className="space-y-8 relative z-10"
                onSubmit={handleSubmit}
                noValidate
              >
                {submitError && (
                  <div
                    className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 flex items-start gap-3"
                    role="alert"
                  >
                    <span className="material-symbols-outlined text-red-300 text-xl mt-0.5">
                      error
                    </span>
                    <div className="flex-1">
                      <p className="font-body-md text-red-100">{submitError}</p>
                    </div>
                    <button
                      type="button"
                      className="text-red-200/80 hover:text-red-100 transition-colors"
                      aria-label="Dismiss error"
                      onClick={() => setSubmitError(null)}
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 input-underline">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant block"
                      htmlFor="name"
                    >
                      NAME
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none aria-invalid:border-red-400/60"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      type="text"
                      aria-invalid={Boolean(fieldErrors.name)}
                      aria-describedby={fieldErrors.name ? "name-error" : undefined}
                      onChange={() =>
                        setFieldErrors((prev) => ({ ...prev, name: undefined }))
                      }
                    />
                    {fieldErrors.name && (
                      <p
                        id="name-error"
                        className="text-sm text-red-300/90 pt-1"
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 input-underline">
                    <label
                      className="font-label-sm text-label-sm text-on-surface-variant block"
                      htmlFor="email"
                    >
                      EMAIL
                    </label>
                    <input
                      className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none aria-invalid:border-red-400/60"
                      id="email"
                      name="email"
                      placeholder="john@company.com"
                      required
                      type="email"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={
                        fieldErrors.email ? "email-error" : undefined
                      }
                      onChange={() =>
                        setFieldErrors((prev) => ({ ...prev, email: undefined }))
                      }
                    />
                    {fieldErrors.email && (
                      <p
                        id="email-error"
                        className="text-sm text-red-300/90 pt-1"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
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
                    className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 outline-none aria-invalid:border-red-400/60"
                    id="subject"
                    name="subject"
                    placeholder="Project Inquiry"
                    required
                    type="text"
                    aria-invalid={Boolean(fieldErrors.subject)}
                    aria-describedby={
                      fieldErrors.subject ? "subject-error" : undefined
                    }
                    onChange={() =>
                      setFieldErrors((prev) => ({ ...prev, subject: undefined }))
                    }
                  />
                  {fieldErrors.subject && (
                    <p
                      id="subject-error"
                      className="text-sm text-red-300/90 pt-1"
                    >
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2 input-underline">
                  <label
                    className="font-label-sm text-label-sm text-on-surface-variant block"
                    htmlFor="message"
                  >
                    MESSAGE
                  </label>
                  <textarea
                    className="w-full bg-transparent border-0 border-b border-white/10 py-3 text-primary font-body-md focus:ring-0 focus:border-white transition-all placeholder:text-white/10 resize-none outline-none aria-invalid:border-red-400/60"
                    id="message"
                    name="message"
                    placeholder="Tell me about your project dreams..."
                    required
                    rows={5}
                    aria-invalid={Boolean(fieldErrors.message)}
                    aria-describedby={
                      fieldErrors.message ? "message-error" : undefined
                    }
                    onChange={() =>
                      setFieldErrors((prev) => ({ ...prev, message: undefined }))
                    }
                  />
                  {fieldErrors.message && (
                    <p
                      id="message-error"
                      className="text-sm text-red-300/90 pt-1"
                    >
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                <div className="pt-4">
                  <MagneticButton
                    as="button"
                    type="submit"
                    className="w-full bg-primary text-background font-headline-md py-4 rounded-lg font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
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
                <div
                  className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20"
                  role="status"
                  aria-live="polite"
                >
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
                    onClick={() => {
                      setShowSuccess(false);
                      setSubmitError(null);
                      setFieldErrors({});
                    }}
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
