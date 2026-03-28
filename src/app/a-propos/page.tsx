"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ES = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Cofounder = {
  initials: string;
  layer: string;
  name: string;
  bio: string;
  tags: string[];
  quote: string;
};

const COFOUNDERS: Cofounder[] = [
  {
    initials: "C",
    layer: "LAYER MÉTIER",
    name: "Cyril",
    bio: "Fondateur d'Oxea et de Willing — deux cabinets vendus. Continue d'accompagner des clients en stratégie et change management. Sa mission : transformer le conseil pour qu'il apporte sa vraie valeur — du conseil augmenté par l'IA, hyper efficace et transparent.",
    tags: ["Risques", "Legal/Compliance", "Excellence opérationnelle", "Optimisation des ressources"],
    quote: "Il transforme nos orchestrateurs en champions du métier.",
  },
  {
    initials: "PD",
    layer: "LAYER PRODUIT & STRATÉGIE",
    name: "Paul D.",
    bio: "Ingénieur entrepreneur, toujours à la croisée IT Product/Project Manager et Business Strategist. Sa mission : comprendre un métier et penser comment l'améliorer, le rendre plus efficace, plus agréable. Chez LiteOps, il met tout en musique.",
    tags: ["Product", "Stratégie", "UX métier", "Architecture système"],
    quote: "Paul met en musique la cohérence entre la tech, le produit et le client.",
  },
  {
    initials: "PB",
    layer: "LAYER TECHNIQUE & DATA",
    name: "Paul B.",
    bio: "Ingénieur architecte Data/IA, plus de 150 use cases IA déployés depuis 10 ans. Architecte de Namibia, la plateforme d'agrégation de data et concentrateur de services. Sa vision : transposer le métier en organisation de la donnée.",
    tags: ["Data/IA", "Architecture", "Namibia", "MLOps"],
    quote: "Paul construit la plateforme qui fera que chaque client bénéficiera des meilleures pratiques de son métier.",
  },
];

type Conviction = {
  index: string;
  title: string;
  body: string;
};

const CONVICTIONS: Conviction[] = [
  {
    index: "01",
    title: "Souveraineté d'abord",
    body: "Nos modèles tournent en France. Vos données ne quittent pas le territoire.",
  },
  {
    index: "02",
    title: "Quick wins mesurables",
    body: "Pas de POC à rallonge. Des résultats en semaines, pas en trimestres.",
  },
  {
    index: "03",
    title: "Craft, pas factory",
    body: "Chaque déploiement est artisanal. Pas de template, pas de one-size-fits-all.",
  },
  {
    index: "04",
    title: "Adoption réelle",
    body: "Un outil non utilisé n'a aucune valeur. Nous accompagnons jusqu'à l'autonomie.",
  },
];

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.72, ease: ES, delay }}
    >
      {children}
    </motion.div>
  );
}

function CofounderCard({ person, index }: { person: Cofounder; index: number }) {
  return (
    <Reveal delay={index * 0.12}>
      <div className="flex flex-col h-full">
        {/* Avatar placeholder */}
        <div className="aspect-square bg-fog border border-chrome-light flex items-center justify-center mb-6">
          <span
            className="font-mono text-chrome-dark select-none"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            aria-hidden="true"
          >
            {person.initials}
          </span>
        </div>

        {/* Layer badge */}
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-signal-green block mb-3">
          {person.layer}
        </span>

        {/* Name */}
        <h3
          className="font-sans font-normal md:font-light text-system-green leading-tight mb-4"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
        >
          {person.name}
        </h3>

        {/* Bio */}
        <p className="font-sans text-sm text-ink/70 leading-relaxed mb-5 flex-grow">
          {person.bio}
        </p>

        {/* Expertise tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {person.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[11px] tracking-wider uppercase px-2 py-1 border border-chrome-light text-steel"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quote */}
        <p className="font-sans text-sm text-chrome-dark italic leading-relaxed border-l-2 border-chrome pl-4">
          {person.quote}
        </p>
      </div>
    </Reveal>
  );
}

function ConvictionItem({ item, index }: { item: Conviction; index: number }) {
  return (
    <Reveal delay={index * 0.1}>
      <div className="flex gap-6 py-8 border-b border-chrome-light/70 last:border-b-0">
        {/* Index */}
        <span className="font-mono text-[11px] tracking-[0.2em] text-chrome-dark shrink-0 pt-1">
          {item.index}
        </span>

        {/* Content */}
        <div>
          <h3
            className="font-sans font-normal md:font-light text-system-green leading-tight mb-2"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}
          >
            {item.title}
          </h3>
          <p className="font-sans text-sm text-ink/65 leading-relaxed max-w-lg">
            {item.body}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AProposPage() {
  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section className="bg-system-green pt-32 pb-20 lg:pt-40 lg:pb-28 blueprint-grid">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ES }}
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-4">
              À PROPOS
            </span>
            <h1
              className="font-sans font-normal md:font-light text-architect-paper leading-[0.95] tracking-tight mb-8"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
            >
              Nous ne théorisons pas l&apos;IA.
              <br />
              Nous la déployons.
            </h1>
            <p className="text-lg text-architect-paper/70 font-sans max-w-2xl leading-relaxed">
              LiteOps est né de la conviction que la France a les moyens de prendre les devants sur
              l&apos;application concrète de l&apos;IA au business. Pas demain. Maintenant. En cochant les
              exigences de souveraineté, de fluidité des opérations, de sobriété et de développement
              local — tout en rendant le business radicalement plus efficace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Cofounders ── */}
      <section className="bg-architect-paper py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          {/* Section header */}
          <Reveal className="mb-16">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-3">
              FONDATEURS
            </span>
            <h2
              className="font-sans font-normal md:font-light text-system-green leading-tight mb-4"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Trois profils. Une complémentarité.
            </h2>
            <p className="font-sans text-base text-ink/60 max-w-xl leading-relaxed">
              Comme nos produits ont des layers — technique, métier, produit — nos fondateurs
              incarnent chacun une de ces couches.
            </p>
          </Reveal>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {COFOUNDERS.map((person, i) => (
              <CofounderCard key={person.name} person={person} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Convictions ── */}
      <section className="bg-warm-paper py-32 lg:py-40 border-t border-chrome-light/70">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left: label + title */}
            <Reveal>
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-3">
                CONVICTIONS
              </span>
              <h2
                className="font-sans font-normal md:font-light text-system-green leading-tight"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
              >
                Ce en quoi
                <br />
                nous croyons.
              </h2>
            </Reveal>

            {/* Right: conviction list */}
            <div>
              {CONVICTIONS.map((item, i) => (
                <ConvictionItem key={item.index} item={item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: CTA ── */}
      <section className="bg-system-green py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto px-8 lg:px-20">
          <Reveal>
            <p
              className="font-sans font-normal md:font-light text-architect-paper/90 leading-tight mb-8"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
            >
              Un projet ?
              <br />
              Une conversation.
            </p>
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase text-signal-green hover:text-architect-paper transition-colors duration-200"
            >
              Démarrer un projet
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
