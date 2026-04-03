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
  const textFill = light ? "#F0EEEB" : "#1C1C1A";
  return (
    <Link href="/" aria-label="Lite Ops — accueil" className="select-none flex items-center">
      <svg
        viewBox="219 344 752 104"
        height="18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{ display: "block" }}
      >
        {/* LITE */}
        <path d="M219.6 443V353.4H230.352V434.424H272.08V443H219.6Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        <path d="M315.26 443V353.4H326.012V443H315.26Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        <path d="M394.412 443V362.232H367.66V353.4H431.916V362.232H405.164V443H394.412Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        <path d="M473.33 443V353.4H528.754V362.232H484.082V393.464H524.914V402.168H484.082V434.168H528.754V443H473.33Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        {/* Dot */}
        <circle cx="602" cy="397" r="30" fill="#A5D900" />
        {/* OPS */}
        <path d="M716.536 441.536C707.917 441.536 700.323 439.616 693.752 435.776C687.267 431.851 682.189 426.432 678.52 419.52C674.936 412.523 673.144 404.416 673.144 395.2C673.144 386.069 674.936 378.048 678.52 371.136C682.189 364.139 687.267 358.677 693.752 354.752C700.323 350.827 707.917 348.864 716.536 348.864C725.325 348.864 732.963 350.827 739.448 354.752C745.933 358.677 750.968 364.139 754.552 371.136C758.221 378.048 760.056 386.069 760.056 395.2C760.056 404.416 758.221 412.523 754.552 419.52C750.968 426.432 745.933 431.851 739.448 435.776C732.963 439.616 725.325 441.536 716.536 441.536ZM716.536 432.064C723.021 432.064 728.696 430.613 733.56 427.712C738.509 424.725 742.307 420.501 744.952 415.04C747.683 409.493 749.048 402.88 749.048 395.2C749.048 387.52 747.683 380.949 744.952 375.488C742.307 369.941 738.509 365.717 733.56 362.816C728.696 359.915 723.021 358.464 716.536 358.464C710.136 358.464 704.461 359.915 699.512 362.816C694.648 365.717 690.851 369.941 688.12 375.488C685.475 380.949 684.152 387.52 684.152 395.2C684.152 402.88 685.475 409.493 688.12 415.04C690.851 420.501 694.648 424.725 699.512 427.712C704.461 430.613 710.136 432.064 716.536 432.064Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        <path d="M803.885 440V350.4H833.069C840.152 350.4 845.954 351.595 850.477 353.984C855.085 356.288 858.456 359.403 860.589 363.328C862.808 367.253 863.917 371.733 863.917 376.768C863.917 381.632 862.808 386.069 860.589 390.08C858.456 394.005 855.128 397.163 850.605 399.552C846.082 401.941 840.237 403.136 833.069 403.136H814.637V440H803.885ZM814.637 394.048H832.941C840.109 394.048 845.229 392.469 848.301 389.312C851.373 386.155 852.909 381.973 852.909 376.768C852.909 371.221 851.373 366.955 848.301 363.968C845.229 360.896 840.109 359.36 832.941 359.36H814.637V394.048Z" fill={textFill} style={{ transition: "fill 300ms" }} />
        <path d="M934.839 441.536C928.268 441.536 922.551 440.341 917.687 437.952C912.823 435.563 909.068 432.235 906.423 427.968C903.778 423.701 902.455 418.752 902.455 413.12H913.719C913.719 416.619 914.53 419.861 916.151 422.848C917.772 425.749 920.119 428.096 923.191 429.888C926.348 431.595 930.231 432.448 934.839 432.448C938.85 432.448 942.263 431.808 945.079 430.528C947.98 429.163 950.156 427.328 951.607 425.024C953.143 422.72 953.911 420.117 953.911 417.216C953.911 413.717 953.143 410.901 951.607 408.768C950.156 406.549 948.151 404.757 945.591 403.392C943.031 402.027 940.044 400.832 936.631 399.808C933.303 398.699 929.804 397.547 926.135 396.352C919.052 393.963 913.847 390.976 910.519 387.392C907.191 383.808 905.527 379.157 905.527 373.44C905.527 368.576 906.636 364.309 908.855 360.64C911.159 356.971 914.402 354.112 918.583 352.064C922.85 349.931 927.884 348.864 933.687 348.864C939.404 348.864 944.354 349.931 948.535 352.064C952.802 354.197 956.13 357.141 958.519 360.896C960.908 364.565 962.103 368.832 962.103 373.696H950.839C950.839 371.221 950.199 368.789 948.919 366.4C947.639 364.011 945.676 362.048 943.031 360.512C940.471 358.891 937.228 358.08 933.303 358.08C930.06 357.995 927.159 358.549 924.599 359.744C922.124 360.853 920.162 362.475 918.711 364.608C917.346 366.741 916.663 369.344 916.663 372.416C916.663 375.317 917.26 377.664 918.455 379.456C919.735 381.248 921.527 382.784 923.831 384.064C926.22 385.259 928.994 386.368 932.151 387.392C935.308 388.416 938.807 389.568 942.647 390.848C946.999 392.299 950.839 394.091 954.167 396.224C957.58 398.272 960.226 400.917 962.103 404.16C964.066 407.403 965.047 411.541 965.047 416.576C965.047 420.843 963.895 424.896 961.591 428.736C959.372 432.491 956.044 435.563 951.607 437.952C947.17 440.341 941.58 441.536 934.839 441.536Z" fill={textFill} style={{ transition: "fill 300ms" }} />
      </svg>
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

  // Reset scroll state immediately on route change to avoid stale state
  useEffect(() => {
    setScrolled(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Only pages with a genuinely dark hero get white nav text when not scrolled.
  const darkHeroPages = ["/agents", "/systemes", "/a-propos"];
  const hasDarkHero = darkHeroPages.some((p) => pathname.startsWith(p));
  const light = !scrolled && hasDarkHero;

  const logoLight = light;

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
            <Logo light={logoLight} />

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
