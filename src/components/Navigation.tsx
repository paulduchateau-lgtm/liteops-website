"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type NavLink = {
  label: string;
  href: string;
};

const NAV_LINKS: NavLink[] = [
  { label: "Opérateurs", href: "/operateurs" },
  { label: "Agents", href: "/agents" },
  { label: "Systèmes", href: "/systemes" },
  { label: "Custom", href: "/custom" },
  { label: "À propos", href: "/a-propos" },
];

function Logo({ light }: { light: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-px select-none"
      aria-label="Lite Ops — accueil"
    >
      <span
        className={`font-medium uppercase tracking-[0.22em] leading-none transition-colors duration-300 ${light ? "text-architect-paper" : "text-ink"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        LITE
      </span>
      <span
        className="mx-[0.12em] text-signal-green leading-none"
        aria-hidden="true"
        style={{ fontSize: "0.55em", lineHeight: 1 }}
      >
        ●
      </span>
      <span
        className={`font-medium uppercase tracking-[0.22em] leading-none transition-colors duration-300 ${light ? "text-architect-paper" : "text-ink"}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        OPS
      </span>
    </Link>
  );
}

function NavLinkItem({
  href,
  label,
  isActive,
  light = false,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  light?: boolean;
  onClick?: () => void;
}) {
  const isHash = href.startsWith("#");

  const baseClasses =
    "relative text-sm font-medium transition-colors duration-300 group";

  // On dark background (transparent nav): architect-paper text
  // On light background (scrolled nav): ink/sage text
  const colorClasses = light
    ? isActive
      ? "text-architect-paper"
      : "text-architect-paper/70 hover:text-architect-paper"
    : isActive
      ? "text-ink"
      : "text-sage hover:text-ink";

  const inner = (
    <>
      {label}
      {isActive && (
        <motion.span
          layoutId="nav-active-dot"
          className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-signal-green"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </>
  );

  if (isHash) {
    return (
      <a href={href} onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={`${baseClasses} ${colorClasses}`}>
      {inner}
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // When nav is transparent (top of page), text must be light to be readable
  // over dark hero sections. Once scrolled, nav has paper background → dark text.
  const light = !scrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isLinkActive = (href: string) => {
    if (href.startsWith("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-architect-paper/85 backdrop-blur-md border-b border-chrome-light/70"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Logo light={light} />

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-8"
              aria-label="Navigation principale"
            >
              {NAV_LINKS.map((link) => (
                <NavLinkItem
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  isActive={isLinkActive(link.href)}
                  light={light}
                />
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center">
              <a
                href="https://calendly.com/paul-duchateau/30min"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "text-sm font-medium px-5 py-2 transition-all duration-300",
                  light
                    ? "border border-architect-paper/60 text-architect-paper hover:bg-architect-paper hover:text-system-green hover:border-architect-paper"
                    : "border border-chrome-dark text-ink hover:bg-system-green hover:text-architect-paper hover:border-system-green",
                ].join(" ")}
              >
                Demander une démo
              </a>
            </div>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className={`md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] ${light ? "text-architect-paper" : "text-ink"}`}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 7, scaleX: 1 }
                    : { rotate: 0, y: 0, scaleX: 1 }
                }
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className={`block w-5 h-px origin-center transition-colors duration-300 ${light ? "bg-architect-paper" : "bg-ink"}`}
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0.5 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className={`block w-5 h-px origin-center transition-colors duration-300 ${light ? "bg-architect-paper" : "bg-ink"}`}
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -7, scaleX: 1 }
                    : { rotate: 0, y: 0, scaleX: 1 }
                }
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className={`block w-5 h-px origin-center transition-colors duration-300 ${light ? "bg-architect-paper" : "bg-ink"}`}
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ink/10 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobileMenuRef}
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "fixed top-20 left-0 right-0 z-40 md:hidden",
              "bg-warm-paper border-b border-chrome-light/60",
              "px-8 pb-8 pt-4",
            ].join(" ")}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
            <nav
              className="flex flex-col gap-1"
              aria-label="Navigation mobile"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <NavLinkItem
                    href={link.href}
                    label={link.label}
                    isActive={isLinkActive(link.href)}
                    onClick={() => setMobileOpen(false)}
                  />
                  <div className="mt-1 mb-2 h-px bg-chrome-light/40" />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.2,
                  delay: NAV_LINKS.length * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4"
              >
                <a
                  href="https://calendly.com/paul-duchateau/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "block w-full text-center text-sm font-medium px-5 py-3",
                    "border border-chrome-dark text-ink",
                    "transition-all duration-200",
                    "hover:bg-system-green hover:text-architect-paper hover:border-system-green",
                  ].join(" ")}
                >
                  Demander une démo
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
