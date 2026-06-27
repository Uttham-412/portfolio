"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useScrollNav } from "@/hooks/useScrollNav";
import MagneticButton from "@/components/ui/MagneticButton";
import styles from "./Navbar.module.css";

const navLinks = [
  { href: "#about", label: "About", id: "about" },
  { href: "#projects", label: "Projects", id: "projects" },
  { href: "#contact", label: "Contact", id: "contact" },
];

const sectionIds = navLinks.map((link) => link.id);

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants: Variants = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 32 },
  },
  exit: {
    x: "100%",
    opacity: 0.8,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.08 + i * 0.06,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const { scrolled, compact, activeSection } = useScrollNav(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const headerClass = [
    styles.header,
    scrolled ? styles.headerScrolled : "",
  ]
    .filter(Boolean)
    .join(" ");

  const navClass = [
    styles.nav,
    compact ? styles.navCompact : styles.navExpanded,
  ].join(" ");

  return (
    <>
      <header className={headerClass}>
        <nav className={navClass}>
          <a href="#" className={styles.logo}>
            Uttham{" "}
            <span className="serif-italic font-normal">Poojary</span>
          </a>

          <div className={styles.desktopLinks}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={[
                  styles.navLink,
                  activeSection === link.id ? styles.navLinkActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/Uttham_Resume.pdf"
              download="Uttham_Poojary_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
            >
              Download Resume
            </a>
          </div>

          <button
            type="button"
            className={styles.menuToggle}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={[
                styles.hamburger,
                menuOpen ? styles.hamburgerOpen : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden
            >
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              aria-hidden
            />
            <motion.div
              className={styles.mobilePanel}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={[
                    styles.mobileLink,
                    activeSection === link.id ? styles.mobileLinkActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={closeMenu}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="/Uttham_Resume.pdf"
                download="Uttham_Poojary_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                custom={navLinks.length}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={styles.mobileResume}
                onClick={closeMenu}
              >
                Download Resume
              </motion.a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
