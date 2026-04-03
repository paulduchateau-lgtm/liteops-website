"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ES: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LayerKey = "technique" | "metier" | "conduite";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const DEPLOYMENT_LEVELS = [
  {
    number: "01",
    title: "Local. Immédiat.",
    description:
      "Nos agents vivent en local sur les postes. Sans internet, sans friction d'installation, sans nécessiter de formation. Commencez demain. Sur votre poste. Sans rien changer.",
    status: "DÉPLOIEMENT < 24H",
  },
  {
    number: "02",
    title: "Connecté. Souverain.",
    description:
      "Version hébergée en France, sécurisée. La plateforme Namibia concentre et unifie la data. Vos agents communiquent entre eux. Vos données restent en France.",
    status: "HÉBERGEMENT SCALEWAY — FRANCE",
  },
  {
    number: "03",
    title: "Intégré. Sur mesure.",
    description:
      "Un agent ou une série d'agents intégrés dans votre écosystème métier. Connexion avec vos outils et bases existantes. Mise en place de processus complémentaires. L'IA qui s'intègre dans vos systèmes, pas l'inverse.",
    status: "INTÉGRATION COMPLÈTE",
  },
];

const APPLICATION_EXAMPLES = [
  {
    id: "risque",
    title: "Système Risque",
    description:
      "Cartographie, évaluation et monitoring des risques opérationnels.",
    agents: ["Pilot", "Sailor"],
  },
  {
    id: "rh",
    title: "Système RH",
    description:
      "Gestion intelligente des talents, compétences et mobilité interne.",
    agents: ["Pilot", "Matchmaker"],
  },
  {
    id: "changement",
    title: "Système Pilotage du changement",
    description:
      "Accompagnement et suivi des transformations organisationnelles.",
    agents: ["Sailor", "Pilot"],
  },
  {
    id: "qualite",
    title: "Système Qualité données",
    description:
      "Audit, nettoyage et enrichissement continu de la donnée métier.",
    agents: ["Pilot"],
  },
  {
    id: "recrutement",
    title: "Système Recrutement",
    description:
      "Matching candidats-postes avec scoring structuré et analyse multi-critères.",
    agents: ["Matchmaker", "Sailor"],
  },
  {
    id: "acquisition",
    title: "Système Acquisition",
    description:
      "Qualification de leads et optimisation du pipeline commercial.",
    agents: ["Matchmaker", "Pilot"],
  },
];

const LAYERS: Record<LayerKey, { label: string; description: string; items: string[] }> = {
  technique: {
    label: "Couche technique",
    description: "L'infrastructure qui fait tenir le tout ensemble.",
    items: [
      "Orchestration multi-agents via Namibia",
      "Flux de données sécurisés entre agents",
      "Chiffrement de bout en bout",
      "Rate limiting et circuit breakers",
      "Observabilité et tracing distribué",
    ],
  },
  metier: {
    label: "Couche métier",
    description: "L'expertise domaine embarquée dans chaque système.",
    items: [
      "Logique métier encapsulée par agent",
      "Workflows spécifiques à votre secteur",
      "Règles de validation domaine",
      "Ontologies métier partagées",
      "Capitalisation sur la mémoire organisationnelle",
    ],
  },
  conduite: {
    label: "Conduite du changement",
    description: "L'adoption ne s'improvise pas.",
    items: [
      "Stratégie d'onboarding progressive",
      "Tableaux de bord de suivi adoption",
      "Formation opérateurs et utilisateurs",
      "Documentation co-construite",
      "Retours terrain intégrés au cycle produit",
    ],
  },
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: ES },
  }),
};

// ---------------------------------------------------------------------------
// Reveal component
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

// ---------------------------------------------------------------------------
// Namibia Hub SVG Diagram
// ---------------------------------------------------------------------------

function NamibiaHubDiagram() {
  const cx = 200;
  const cy = 200;
  const hubR = 32;
  const orbitR = 120;

  const peripheralNodes = [
    { label: "AUTH", angle: -90 },
    { label: "LOG", angle: -30 },
    { label: "API", angle: 30 },
    { label: "MON", angle: 90 },
    { label: "MEM", angle: 150 },
    { label: "AGG", angle: 210 },
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full max-w-sm mx-auto"
      aria-label="Namibia — diagramme réseau hub central"
      role="img"
    >
      <defs>
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A5D900" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#A5D900" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        cx={cx}
        cy={cy}
        r={orbitR}
        fill="none"
        stroke="#CDC9C2"
        strokeWidth="0.8"
        strokeDasharray="3 4"
      />

      <circle cx={cx} cy={cy} r={hubR + 20} fill="url(#hub-glow)" />

      {peripheralNodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const x2 = cx + orbitR * Math.cos(rad);
        const y2 = cy + orbitR * Math.sin(rad);
        return (
          <line
            key={node.label}
            x1={cx}
            y1={cy}
            x2={x2}
            y2={y2}
            stroke="#B8B5AE"
            strokeWidth="1"
            strokeOpacity="0.7"
          />
        );
      })}

      {peripheralNodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = cx + orbitR * Math.cos(rad);
        const y = cy + orbitR * Math.sin(rad);
        return (
          <g key={node.label}>
            <circle cx={x} cy={y} r={18} fill="#EFEFEF" stroke="#9A968E" strokeWidth="1" />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="7"
              fontFamily="'JetBrains Mono', monospace"
              fill="#9A968E"
              fontWeight="500"
            >
              {node.label}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={hubR} fill="#2F3427" stroke="#A5D900" strokeWidth="1.5" />
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontFamily="'JetBrains Mono', monospace"
        fill="#A5D900"
        fontWeight="500"
        letterSpacing="1"
      >
        NAMIBIA
      </text>
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6"
        fontFamily="'JetBrains Mono', monospace"
        fill="#9A968E"
      >
        HUB
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Layer Toggles
// ---------------------------------------------------------------------------

function LayerToggles() {
  const [active, setActive] = useState<LayerKey>("technique");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Couches du système">
        {(Object.keys(LAYERS) as LayerKey[]).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={active === key}
            aria-controls={`layer-panel-${key}`}
            id={`layer-tab-${key}`}
            onClick={() => setActive(key)}
            className={[
              "font-mono text-[11px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-200",
              active === key
                ? "bg-system-green border-signal-green text-signal-green"
                : "bg-transparent border-chrome text-steel hover:border-chrome-dark hover:text-ink",
            ].join(" ")}
          >
            {LAYERS[key].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id={`layer-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`layer-tab-${active}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: ES }}
          className="border border-chrome-light/60 bg-warm-paper p-6 space-y-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel mb-1">
              {LAYERS[active].label}
            </p>
            <p className="text-sm text-ink">{LAYERS[active].description}</p>
          </div>
          <ul className="space-y-2" role="list">
            {LAYERS[active].items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-chrome-dark" aria-hidden="true" />
                <span className="text-sm text-ink/75 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contact Form
// ---------------------------------------------------------------------------

function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm text-signal-green-text"
        role="status"
        aria-live="polite"
      >
        Demande enregistrée. Nous reviendrons vers vous sous 48h.
      </motion.p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block font-mono text-[11px] uppercase tracking-[0.15em] text-steel mb-1.5"
          >
            Nom
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            required
            placeholder="Marie Dupont"
            className="w-full border border-rule bg-architect-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-chrome outline-none transition-colors focus:border-chrome-dark"
          />
        </div>
        <div>
          <label
            htmlFor="contact-org"
            className="block font-mono text-[11px] uppercase tracking-[0.15em] text-steel mb-1.5"
          >
            Organisation
          </label>
          <input
            id="contact-org"
            type="text"
            autoComplete="organization"
            placeholder="Acme SAS"
            className="w-full border border-rule bg-architect-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-chrome outline-none transition-colors focus:border-chrome-dark"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block font-mono text-[11px] uppercase tracking-[0.15em] text-steel mb-1.5"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@organisation.fr"
          className="w-full border border-rule bg-architect-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-chrome outline-none transition-colors focus:border-chrome-dark"
        />
      </div>

      <div>
        <label
          htmlFor="contact-context"
          className="block font-mono text-[11px] uppercase tracking-[0.15em] text-steel mb-1.5"
        >
          Contexte
        </label>
        <textarea
          id="contact-context"
          rows={4}
          placeholder="Décrivez l'objectif macro de votre système, les agents impliqués, les contraintes..."
          className="w-full resize-none border border-rule bg-architect-paper px-3 py-2 font-mono text-sm text-ink placeholder:text-chrome outline-none transition-colors focus:border-chrome-dark"
        />
      </div>

      <button
        type="submit"
        className="bg-signal-green px-6 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-system-green transition-colors duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-green"
      >
        Envoyer la demande
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SystemesPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — HERO                                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-system-green pt-32 pb-20 lg:pt-40 lg:pb-28 blueprint-grid">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ES }}
            className="max-w-3xl"
          >
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-chrome-dark block mb-4">
              SYSTÈMES
            </span>
            <h1
              className="font-sans font-normal md:font-light text-architect-paper leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
            >
              L&apos;IA qui s&apos;adapte.
              <br />
              Pas l&apos;inverse.
            </h1>
            <p className="text-lg text-architect-paper/70 font-sans max-w-xl leading-relaxed">
              Nos systèmes s&apos;intègrent progressivement dans vos opérations.
              Sans détruire l&apos;existant. Sans friction.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — THREE DEPLOYMENT LEVELS                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-architect-paper blueprint-grid py-24 lg:py-32" aria-labelledby="deployment-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <Reveal className="mb-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-steel block mb-3">
              Philosophie de déploiement
            </span>
            <h2
              id="deployment-heading"
              className="font-sans font-normal md:font-light text-system-green leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Un déploiement progressif.
              <br />
              Trois niveaux d&apos;intégration.
            </h2>
            <p className="text-base text-ink/70 max-w-2xl leading-relaxed">
              Nous n&apos;allons pas détruire l&apos;existant pour imposer notre savoir.
              La puissance de l&apos;IA aujourd&apos;hui réside dans sa capacité à s&apos;intégrer
              en limitant les efforts.
            </p>
          </Reveal>

          {/* Cards stack with vertical connector line */}
          <div className="relative max-w-3xl">
            {/* Vertical connector line */}
            <div
              className="absolute left-[1.75rem] top-12 bottom-12 w-px bg-chrome-light/60"
              aria-hidden="true"
            />

            <div className="space-y-0">
              {DEPLOYMENT_LEVELS.map((level, i) => (
                <Reveal key={level.number} delay={i * 0.12}>
                  <div className="relative flex gap-8 lg:gap-12 pb-0">
                    {/* Number column */}
                    <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "3.5rem" }}>
                      <div className="relative z-10 w-14 h-14 flex items-center justify-center bg-architect-paper border border-chrome-light/60">
                        <span
                          className="font-mono font-medium text-chrome-dark leading-none"
                          style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
                        >
                          {level.number}
                        </span>
                      </div>
                    </div>

                    {/* Card content */}
                    <div
                      className={[
                        "flex-1 border border-chrome-light/60 bg-warm-paper p-8 lg:p-10",
                        i < DEPLOYMENT_LEVELS.length - 1 ? "mb-6" : "",
                      ].join(" ")}
                    >
                      <h3
                        className="font-sans font-normal md:font-light text-ink leading-tight mb-4"
                        style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
                      >
                        {level.title}
                      </h3>
                      <p className="text-sm text-ink/70 leading-relaxed mb-6 max-w-lg">
                        {level.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-signal-green flex-shrink-0" aria-hidden="true" />
                        <span className="badge-signal">{level.status}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — NAMIBIA PLATFORM                                       */}
      {/* ------------------------------------------------------------------ */}
      <section
        id="namibia"
        className="bg-warm-paper border-t border-chrome-light/60 border-b border-chrome-light/60"
        aria-labelledby="namibia-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={0}
              className="space-y-8"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-steel mb-3">
                  Plateforme centrale
                </p>
                <h2
                  id="namibia-heading"
                  className="font-sans font-normal md:font-light text-system-green leading-tight mb-5"
                  style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
                >
                  Namibia — Le concentrateur de services
                </h2>
                <p className="text-base text-ink/75 leading-relaxed">
                  Namibia est la plateforme centrale de Lite Ops. Elle agrège les données issues de
                  l&apos;ensemble des agents d&apos;un client, gère la mémoire partagée entre agents,
                  et offre un hub de services communs.
                </p>
              </div>

              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-steel mb-4">
                  Services communs
                </p>
                <ul className="grid grid-cols-2 gap-3" role="list">
                  {[
                    "Authentification",
                    "Logging",
                    "Monitoring",
                    "APIs",
                    "Mémoire partagée",
                    "Agrégation multi-agents",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <span className="shrink-0 w-1 h-1 rounded-full bg-chrome" aria-hidden="true" />
                      <span className="font-mono text-xs text-ink/75">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative h-40 overflow-hidden border border-chrome-light/60">
                <Image
                  src="/photos/photo-1506773090264-ac0b07293a64.avif"
                  alt="Vallée désertique — Namibia et systèmes"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-system-green/40" aria-hidden="true" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-chrome-light">
                    NAMIBIA / v1.0 / ACTIF
                  </span>
                </div>
              </div>
            </motion.div>

            {/* SVG diagram */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={1}
              className="flex flex-col items-center gap-6"
            >
              <NamibiaHubDiagram />

              <div className="w-full border border-chrome-light/60 bg-architect-paper p-4 space-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel mb-3">Légende</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-system-green border border-signal-green flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] text-chrome-dark">Hub Namibia — concentrateur central</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full bg-architect-paper border border-chrome-light flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] text-chrome-dark">Service commun exposé</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-px flex-shrink-0"
                    style={{ background: "#B8B5AE", opacity: 0.8 }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] text-chrome-dark">Canal de communication</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — SYSTEM LAYERS                                          */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-architect-paper border-b border-chrome-light/60" aria-labelledby="layers-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <Reveal className="mb-12 max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-steel mb-3">
              Architecture en couches
            </p>
            <h2
              id="layers-heading"
              className="font-sans font-normal md:font-light text-system-green leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Les couches d&apos;un système
            </h2>
            <p className="text-base text-ink/75 leading-relaxed">
              Chaque système Lite Ops intègre trois couches superposées qui travaillent de concert
              pour assurer performance technique, pertinence métier et adoption durable.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <LayerToggles />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — EXAMPLES OF APPLICATION                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-warm-paper border-b border-chrome-light/60" aria-labelledby="examples-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <Reveal className="mb-12">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-steel block mb-3">
              EXEMPLES D&apos;APPLICATION
            </span>
            <h2
              id="examples-heading"
              className="font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Des systèmes pour chaque métier.
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {APPLICATION_EXAMPLES.map((example, i) => (
              <Reveal key={example.id} delay={i * 0.08}>
                <div className="border border-chrome-light bg-architect-paper p-6 flex flex-col gap-4 h-full hover:border-chrome-dark transition-colors duration-200">
                  <div className="flex-1">
                    <h3 className="font-sans font-medium text-ink mb-2 text-base">
                      {example.title}
                    </h3>
                    <p className="text-sm text-ink/70 leading-relaxed">
                      {example.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-chrome-light/60">
                    {example.agents.map((agent) => (
                      <span
                        key={agent}
                        className="font-mono text-[11px] uppercase tracking-[0.12em] text-steel border border-chrome px-2 py-1 bg-warm-paper"
                      >
                        {agent}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 6 — CONTACT CTA                                           */}
      {/* ------------------------------------------------------------------ */}
      <section id="contact" className="bg-system-green" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left — copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={0}
              className="space-y-6"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-chrome-light/70 mb-3">
                  Passons à l&apos;action
                </p>
                <h2
                  id="cta-heading"
                  className="font-sans font-normal md:font-light text-architect-paper leading-tight"
                  style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
                >
                  Construisons votre système
                </h2>
              </div>
              <p className="text-base text-architect-paper/80 leading-relaxed">
                Chaque système Lite Ops est conçu sur mesure autour de votre objectif métier.
                Décrivez-nous votre besoin — nous revenons vers vous avec une proposition
                d&apos;architecture en 48h.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-architect-paper/10">
                {[
                  { value: "48h", label: "Première réponse" },
                  { value: "100%", label: "Souverain FR" },
                  { value: "< 2 sem", label: "Premier agent live" },
                  { value: "3", label: "Couches intégrées" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="font-mono text-xl font-medium text-architect-paper">{stat.value}</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-chrome-light">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={1}
              className="bg-architect-paper p-8 lg:p-10"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
