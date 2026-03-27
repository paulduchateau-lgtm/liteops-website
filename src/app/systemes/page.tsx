"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LayerKey = "technique" | "metier" | "conduite";

interface Capability {
  id: string;
  label: string;
  description: string;
}

interface AgentNode {
  id: string;
  label: string;
  sublabel: string;
  angle: number;
}

interface SystemDiagramProps {
  title: string;
  status?: string;
  objective: string;
  agents: AgentNode[];
  flow: string[];
  connectedSystems?: string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const LAYERS: Record<LayerKey, { label: string; description: string; items: string[] }> = {
  technique: {
    label: "Couche technique",
    description: "L'infrastructure qui fait tenir le tout ensemble.",
    items: [
      "Orchestration multi-agents via Namibia",
      "Flux de données sécurisés entre agents",
      "Chiffrement de bout en bout",
      "Rate limiting et circuit breakers",
      "Observabilite et tracing distribue",
    ],
  },
  metier: {
    label: "Couche métier",
    description: "L'expertise domaine embarquée dans chaque système.",
    items: [
      "Logique métier encapsulée par agent",
      "Workflows spécifiques à votre secteur",
      "Regles de validation domaine",
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

const CAPABILITIES: Capability[] = [
  {
    id: "orchestration",
    label: "Orchestration multi-agents",
    description: "Coordination fluide entre agents specialises autour de Namibia.",
  },
  {
    id: "memory",
    label: "Memoire partagee",
    description: "Contexte commun persistant entre tous les agents du système.",
  },
  {
    id: "monitoring",
    label: "Monitoring temps reel",
    description: "Observabilite complete des flux, etats et performances.",
  },
  {
    id: "hosting",
    label: "Scaleway ZDR",
    description: "Hébergement français zone de disponibilité redondante.",
  },
  {
    id: "api",
    label: "Architecture API-first",
    description: "Chaque agent expose une interface standardisée et documentée.",
  },
  {
    id: "sovereign",
    label: "100% souverain",
    description: "Aucune donnee ne quitte le territoire national.",
  },
];

const RECRUITMENT_AGENTS: AgentNode[] = [
  { id: "ag001-rh", label: "AG001-RH", sublabel: "Pilot RH", angle: -90 },
  { id: "ag002", label: "AG002", sublabel: "Sailor — docs RH", angle: 30 },
  { id: "custom-scoring", label: "CUSTOM", sublabel: "Scoring candidats", angle: 150 },
];

const ACQUISITION_AGENTS: AgentNode[] = [
  { id: "ag001", label: "AG001", sublabel: "Pilot — data prospects", angle: -90 },
  { id: "ag002-acq", label: "AG002-ACQ", sublabel: "Sailor Acquisition", angle: 30 },
  { id: "custom-acq", label: "CUSTOM", sublabel: "Scoring prospects", angle: 150 },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE_OUT },
  }),
};

// ---------------------------------------------------------------------------
// SVG Network Diagram — Namibia central hub
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
        {/* Hub glow stays signal-green — hub is "active/live" */}
        <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A5D900" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#A5D900" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Orbit ring — chrome-light dashed */}
      <circle
        cx={cx}
        cy={cy}
        r={orbitR}
        fill="none"
        stroke="#CDC9C2"
        strokeWidth="0.5"
        strokeDasharray="3 4"
      />

      {/* Glow behind hub */}
      <circle cx={cx} cy={cy} r={hubR + 20} fill="url(#hub-glow)" />

      {/* Spoke lines — chrome by default */}
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
            strokeWidth="0.75"
            strokeOpacity="0.7"
          />
        );
      })}

      {/* Peripheral nodes — chrome-dark border */}
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

      {/* Hub center — stays signal-green (active/live) */}
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
// System Network Diagram — reusable for example systems
// ---------------------------------------------------------------------------

function SystemDiagram({ title, status, objective, agents, flow, connectedSystems }: SystemDiagramProps) {
  const cx = 160;
  const cy = 140;
  const hubR = 26;
  const orbitR = 90;

  return (
    <div className="border border-chrome-light/40 bg-warm-paper space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-8 lg:px-10 pt-8 lg:pt-10">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel mb-1">Système</p>
          <h3 className="font-mono text-sm font-medium text-ink">{title}</h3>
        </div>
        {status && (
          <span className="flex items-center gap-1.5 font-mono text-[9px] text-signal-green whitespace-nowrap">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal-green" aria-hidden="true" />
            {status}
          </span>
        )}
      </div>

      <p className="text-xs text-ink/65 leading-relaxed px-8 lg:px-10">{objective}</p>

      {/* SVG */}
      <div className="px-8 lg:px-12">
        <svg
          viewBox="0 0 320 280"
          className="w-full"
          aria-label={`Diagramme réseau — ${title}`}
          role="img"
        >
          <defs>
            {/* Hub glow stays signal-green — hub is "active/live" */}
            <radialGradient id={`glow-${title}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A5D900" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A5D900" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbit ring — chrome-light dashed */}
          <circle
            cx={cx}
            cy={cy}
            r={orbitR}
            fill="none"
            stroke="#CDC9C2"
            strokeWidth="0.5"
            strokeDasharray="3 4"
          />

          {/* Glow */}
          <circle cx={cx} cy={cy} r={hubR + 18} fill={`url(#glow-${title})`} />

          {/* Spokes — chrome by default */}
          {agents.map((agent) => {
            const rad = (agent.angle * Math.PI) / 180;
            const x2 = cx + orbitR * Math.cos(rad);
            const y2 = cy + orbitR * Math.sin(rad);
            return (
              <line
                key={agent.id}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#B8B5AE"
                strokeWidth="0.75"
                strokeOpacity="0.7"
              />
            );
          })}

          {/* Agent nodes — chrome-dark border */}
          {agents.map((agent) => {
            const rad = (agent.angle * Math.PI) / 180;
            const x = cx + orbitR * Math.cos(rad);
            const y = cy + orbitR * Math.sin(rad);
            return (
              <g key={agent.id}>
                <circle cx={x} cy={y} r={20} fill="#EFEFEF" stroke="#9A968E" strokeWidth="1" />
                <text
                  x={x}
                  y={y - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5.5"
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#2F3427"
                  fontWeight="500"
                >
                  {agent.label}
                </text>
                <text
                  x={x}
                  y={y + 6}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="4.5"
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#9A968E"
                >
                  {agent.sublabel.length > 10 ? agent.sublabel.slice(0, 10) + "…" : agent.sublabel}
                </text>
              </g>
            );
          })}

          {/* Hub — stays signal-green (active/live) */}
          <circle cx={cx} cy={cy} r={hubR} fill="#2F3427" stroke="#A5D900" strokeWidth="1.5" />
          <text
            x={cx}
            y={cy - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            fill="#A5D900"
            fontWeight="500"
            letterSpacing="0.5"
          >
            NAMIBIA
          </text>
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="5"
            fontFamily="'JetBrains Mono', monospace"
            fill="#9A968E"
          >
            HUB
          </text>

          {/* Connected systems on the right — chrome borders */}
          {connectedSystems && connectedSystems.map((sys, i) => {
            const y = 60 + i * 50;
            const x = 260;
            return (
              <g key={sys}>
                <line
                  x1={cx + orbitR + 5}
                  y1={cy}
                  x2={x - 30}
                  y2={y + 8}
                  stroke="#B8B5AE"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />
                <rect x={x - 28} y={y} width={60} height={18} fill="#F5F2ED" stroke="#B8B5AE" strokeWidth="0.75" />
                <text
                  x={x - 28 + 30}
                  y={y + 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="5"
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#7D7A73"
                >
                  {sys}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Process flow */}
      <div className="px-8 lg:px-10 pb-8 lg:pb-10">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-chrome-dark mb-2">Flux</p>
        <div className="flex items-center gap-0" role="list" aria-label="Étapes du processus">
          {flow.map((step, i) => (
            <div key={step} className="flex items-center" role="listitem">
              <span className="font-mono text-[9px] font-medium tracking-wider text-steel bg-green-tint border border-chrome-light/40 px-2 py-1">
                {step}
              </span>
              {i < flow.length - 1 && (
                <span className="font-mono text-[8px] text-chrome-dark px-1" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layer Toggle
// ---------------------------------------------------------------------------

function LayerToggles() {
  const [active, setActive] = useState<LayerKey>("technique");

  return (
    <div className="space-y-6">
      {/* Toggle buttons */}
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
              "font-mono text-[10px] uppercase tracking-[0.15em] px-4 py-2 border transition-all duration-200",
              active === key
                ? "bg-system-green border-signal-green text-signal-green"
                : "bg-transparent border-chrome text-steel hover:border-chrome-dark hover:text-ink",
            ].join(" ")}
          >
            {LAYERS[key].label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id={`layer-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`layer-tab-${active}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="border border-chrome-light/40 bg-warm-paper p-6 space-y-4"
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel mb-1">
              {LAYERS[active].label}
            </p>
            <p className="text-sm text-ink">{LAYERS[active].description}</p>
          </div>
          <ul className="space-y-2" role="list">
            {LAYERS[active].items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-chrome-dark" aria-hidden="true" />
                <span className="text-sm text-ink/65 leading-relaxed">{item}</span>
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
    // Wire to backend when ready
    setSent(true);
  }

  if (sent) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm text-signal-green"
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
          <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-steel mb-1.5">
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
          <label htmlFor="contact-org" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-steel mb-1.5">
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
        <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-steel mb-1.5">
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
        <label htmlFor="contact-context" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-steel mb-1.5">
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
    <div className="pt-16">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-system-green">
        {/* Background photo */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/photos/premium_photo-1670897797006-81cbbb1bfc7b.avif"
            alt=""
            fill
            className="object-cover object-center"
            priority
            aria-hidden="true"
          />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(#A5D900 1px, transparent 1px), linear-gradient(90deg, #A5D900 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-8 lg:px-20 py-32 lg:py-40">
          {/* Breadcrumb */}
          <nav aria-label="Fil d'ariane" className="mb-8">
            <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-chrome-light/70">
              <li>
                <Link href="/" className="hover:text-chrome-light transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-chrome-light" aria-current="page">
                Systèmes
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-chrome mb-4">
              Infrastructure intelligente
            </p>
            <h1 className="font-sans text-4xl lg:text-5xl font-medium text-architect-paper leading-tight mb-6">
              Les Systèmes
            </h1>
            <p className="font-sans text-base lg:text-lg text-architect-paper/70 leading-relaxed max-w-2xl">
              Un système est un ensemble d&apos;agents orchestrés, connectés à une plateforme commune.
              Il répond à un objectif macro de votre organisation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — NAMIBIA HUB                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="namibia" className="bg-architect-paper border-b border-chrome-light/40" aria-labelledby="namibia-heading">
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
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel mb-3">
                  Plateforme centrale
                </p>
                <h2 id="namibia-heading" className="font-sans text-3xl font-medium text-ink mb-5">
                  Namibia — Le concentrateur de services
                </h2>
                <p className="text-base text-ink/65 leading-relaxed">
                  Namibia est la plateforme centrale de Lite Ops. Elle agrège les données issues de
                  l&apos;ensemble des agents d&apos;un client, gère la mémoire partagée entre agents,
                  et offre un hub de services communs.
                </p>
              </div>

              {/* Feature list */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-steel mb-4">
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
                      <span className="font-mono text-xs text-ink/65">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Photo accent */}
              <div className="relative h-40 overflow-hidden border border-chrome-light/40">
                <Image
                  src="/photos/photo-1679587246899-8b9172fc78e2.avif"
                  alt="Infrastructure Namibia — plateforme centrale Lite Ops"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-system-green/40" aria-hidden="true" />
                <div className="absolute bottom-3 left-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-chrome-light">
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

              {/* Legend */}
              <div className="w-full border border-chrome-light/40 bg-warm-paper p-4 space-y-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel mb-3">Legende</p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-system-green border border-signal-green flex-shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[10px] text-chrome-dark">Hub Namibia — concentrateur central</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-architect-paper border border-chrome-light flex-shrink-0" aria-hidden="true" />
                  <span className="font-mono text-[10px] text-chrome-dark">Service commun expose</span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-px flex-shrink-0"
                    style={{ background: "#B8B5AE", opacity: 0.8 }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] text-chrome-dark">Canal de communication</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — SYSTEM EXAMPLES                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-warm-paper border-t border-chrome-light/40 border-b border-chrome-light/40" aria-labelledby="exemples-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="mb-12"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel mb-3">
              Exemples concrets
            </p>
            <h2 id="exemples-heading" className="font-sans text-3xl font-medium text-ink">
              Systèmes en production
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={1}
            >
              <SystemDiagram
                title="SYSTÈME RECRUTEMENT"
                status="ACTIF"
                objective="Sourcer, contacter et sélectionner les meilleurs candidats pour un poste interne."
                agents={RECRUITMENT_AGENTS}
                flow={["SOURCE", "CONTACT", "QUALIFY", "SELECT"]}
                connectedSystems={["Outils RH", "Docs internes", "Bases de données"]}
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={2}
            >
              <SystemDiagram
                title="SYSTÈME ACQUISITION"
                objective="Identifier, approcher et qualifier des prospects à fort potentiel."
                agents={ACQUISITION_AGENTS}
                flow={["IDENTIFY", "APPROACH", "QUALIFY", "CONVERT"]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — LAYERS                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-architect-paper border-b border-chrome-light/40" aria-labelledby="layers-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="mb-12 max-w-2xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel mb-3">
              Architecture en couches
            </p>
            <h2 id="layers-heading" className="font-sans text-3xl font-medium text-ink mb-4">
              Les couches d&apos;un système
            </h2>
            <p className="text-base text-ink/65 leading-relaxed">
              Chaque système Lite Ops intègre trois couches superposées qui travaillent de concert
              pour assurer performance technique, pertinence métier et adoption durable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={1}
          >
            <LayerToggles />
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — TECHNICAL CAPABILITIES                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-warm-paper border-b border-chrome-light/40" aria-labelledby="capabilities-heading">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-20 lg:py-28">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
            className="mb-12"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-steel mb-3">
              Sous le capot
            </p>
            <h2 id="capabilities-heading" className="font-sans text-3xl font-medium text-ink">
              Capacites techniques
            </h2>
          </motion.div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i}
                className="border border-chrome-light/40 bg-architect-paper p-5 group hover:border-chrome-dark transition-colors duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-chrome-dark flex-shrink-0" aria-hidden="true" />
                  <dt className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink font-medium">
                    {cap.label}
                  </dt>
                </div>
                <dd className="text-sm text-ink/65 leading-relaxed">{cap.description}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — CTA                                                    */}
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
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-chrome-light/70 mb-3">
                  Passons à l&apos;action
                </p>
                <h2 id="cta-heading" className="font-sans text-3xl lg:text-4xl font-medium text-architect-paper leading-tight">
                  Construisons votre système
                </h2>
              </div>
              <p className="text-base text-architect-paper/70 leading-relaxed">
                Chaque système Lite Ops est conçu sur mesure autour de votre objectif métier.
                Décrivez-nous votre besoin — nous revenons vers vous avec une proposition d&apos;architecture
                en 48h.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-architect-paper/10">
                {[
                  { value: "48h", label: "Première réponse" },
                  { value: "100%", label: "Souverain FR" },
                  { value: "< 2 sem", label: "Premier agent live" },
                  { value: "3", label: "Couches integrees" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="font-mono text-xl font-medium text-architect-paper">{stat.value}</p>
                    <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-chrome-light">
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
    </div>
  );
}
