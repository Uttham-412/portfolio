const footerLinks = [
  { href: "#", label: "LinkedIn" },
  { href: "#", label: "GitHub" },
  { href: "#", label: "Source" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 w-full py-20 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto gap-10">
        <div className="font-label-sm text-[11px] text-on-surface-variant/40">
          © 2024 Uttham Poojary. Built with precision and intent.
        </div>
        <div className="flex gap-12 items-center">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-label-sm text-[11px] text-on-surface-variant/60 hover:text-primary transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
