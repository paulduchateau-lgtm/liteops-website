"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: NavLink[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const columns: FooterColumn[] = [
  {
    heading: "Produit",
    links: [
      { label: "Opérateurs", href: "/operateurs" },
      { label: "Pilot", href: "/agents/pilot" },
      { label: "Sailor", href: "/agents/sailor" },
      { label: "Matchmaker", href: "/agents/matchmaker" },
      { label: "Systèmes", href: "/systemes" },
      { label: "Namibia", href: "/systemes#namibia" },
    ],
  },
  {
    heading: "Société",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Méthode", href: "/methode" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Ressources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "Blog", href: "/blog" },
      { label: "Sécurité", href: "/securite" },
      { label: "Statut", href: "/statut" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-px font-mono text-sm font-medium tracking-widest text-ink select-none"
      aria-label="Lite Ops — accueil"
    >
      <span>LITE</span>
      <span className="text-signal-green leading-none" aria-hidden="true">
        ●
      </span>
      <span>OPS</span>
    </Link>
  );
}

function FooterNav({ column }: { column: FooterColumn }) {
  return (
    <nav aria-labelledby={`footer-nav-${column.heading.toLowerCase()}`}>
      <p
        id={`footer-nav-${column.heading.toLowerCase()}`}
        className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-steel"
      >
        {column.heading}
      </p>
      <ul className="space-y-2.5" role="list">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-sm text-sage transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    // Submission hook — wire to backend when ready
    setStatus("submitted");
    setEmail("");
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-b border-chrome-light/60 bg-warm-paper"
    >
      <div className="mx-auto max-w-7xl px-8 py-16 lg:px-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          {/* Label block */}
          <div className="space-y-1.5">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-steel">
              Newsletter
            </p>
            <h2
              id="newsletter-heading"
              className="font-sans text-base font-medium text-ink"
            >
              Rejoignez notre newsletter
            </h2>
            <p className="font-sans text-sm text-sage">
              Mises à jour système, nouvelles releases, perspectives terrain.
            </p>
          </div>

          {/* Form */}
          {status === "idle" ? (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse email
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                required
                placeholder="vous@organisation.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-none border border-chrome bg-architect-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-chrome outline-none transition-colors duration-150 focus:border-chrome-dark focus:ring-0"
              />
              <button
                type="submit"
                className="shrink-0 rounded-none border border-system-green bg-system-green px-4 py-2 font-mono text-xs font-medium uppercase tracking-widest text-architect-paper transition-colors duration-150 hover:bg-moss hover:border-moss focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss"
              >
                S&apos;inscrire
              </button>
            </form>
          ) : (
            <p className="font-mono text-sm text-moss" role="status" aria-live="polite">
              ✓&nbsp; Inscription enregistrée.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

export function Footer() {
  return (
    <footer className="font-sans" role="contentinfo">
      <NewsletterSection />

      {/* Main footer body */}
      <div className="border-b border-chrome-light/60 bg-warm-paper">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1 — About */}
            <div className="space-y-4">
              <Logo />
              <p className="font-sans text-sm leading-relaxed text-sage">
                Lite Ops conçoit et déploie des systèmes intelligents pour les
                organisations françaises. Modulaires, souverains, transparents
                &mdash; conçus pour durer.
              </p>
            </div>

            {/* Columns 2-4 — Navigation */}
            {columns.map((col) => (
              <FooterNav key={col.heading} column={col} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-warm-paper">
        <div className="mx-auto max-w-7xl px-8 py-4 lg:px-20">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
            <p className="font-mono text-[11px] text-chrome-dark">
              &copy; 2026 Lite Ops &mdash; Intelligent Systems &amp; Operations
            </p>
            <p className="font-mono text-[11px] tracking-wide text-chrome">
              Craft. Assemble. Deploy.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
