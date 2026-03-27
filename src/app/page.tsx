"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];
// Inline shorthand for JSX transition props
const ES = EASE_SPRING;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE_SPRING },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ---------------------------------------------------------------------------
// Utility: scroll-reveal wrapper
// ---------------------------------------------------------------------------

function Reveal({
  children,
  className,
  delay = 0,
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Arrow link component
// ---------------------------------------------------------------------------

function ArrowLink({
  href,
  children,
  className = "",
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  const base = light
    ? "text-architect-paper/80 hover:text-architect-paper"
    : "text-steel hover:text-ink";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest transition-colors duration-200 ${base} ${className}`}
    >
      {children}
      <span
        className="inline-block transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// 1. HERO SECTION
// ---------------------------------------------------------------------------

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex overflow-hidden blueprint-grid"
      aria-label="Hero"
    >
      {/* Left column */}
      <div className="relative z-10 flex flex-col justify-between w-full lg:w-1/2 px-8 lg:px-20 pt-36 pb-16">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-2 mb-12"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal-green">
            STATUT
          </span>
          <span className="text-signal-green text-[10px]" aria-hidden="true">
            ●
          </span>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal-green">
            ACTIF
          </span>
        </motion.div>

        {/* Headline */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ES, delay: 0.1 }}
            className="font-sans font-light text-system-green leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            Intelligent
            <br />
            Systems
            <br />
            and
            <br />
            Operations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ES, delay: 0.35 }}
            className="mt-8 text-lg text-ink/60 font-sans max-w-sm leading-relaxed"
          >
            Des systèmes conçus pour opérer.
            <br />
            Pas pour impressionner.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-12"
          >
            <ArrowLink href="/agents/pilot">Explorer les agents</ArrowLink>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.7, ease: ES }}
          className="origin-left h-px bg-chrome mt-16 hidden lg:block"
        />
      </div>

      {/* Right column — parallax photo */}
      <div className="hidden lg:block absolute right-0 top-0 w-1/2 h-full overflow-hidden">
        <motion.div
          style={{ y: photoY }}
          className="absolute inset-0 scale-110"
        >
          <Image
            src="/photos/photo-1566502877985-e4f1bcaf0ecc.avif"
            alt="Engineering workshop — morning light"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
          {/* Gradient blend to left */}
          <div className="absolute inset-0 bg-gradient-to-r from-architect-paper via-architect-paper/30 to-transparent" />
        </motion.div>
      </div>

      {/* Mobile photo strip */}
      <div className="lg:hidden absolute inset-0 -z-10">
        <Image
          src="/photos/photo-1566502877985-e4f1bcaf0ecc.avif"
          alt="Engineering workshop"
          fill
          className="object-cover object-center opacity-15"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 2. ORIGINS SECTION
// ---------------------------------------------------------------------------

function OriginsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <section
      ref={ref}
      id="about"
      className="bg-warm-paper py-32 lg:py-40"
      aria-label="Nos origines"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: ES }}
          className="relative aspect-[4/5] overflow-hidden"
        >
          <Image
            src="/photos/photo-1616272963049-da2d8efc0c57.avif"
            alt="Engineers at work"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          {/* Frame overlay */}
          <div className="absolute inset-0 border border-chrome/30 pointer-events-none" />
          {/* Label */}
          <div className="absolute bottom-4 left-4 bg-system-green/80 backdrop-blur-sm px-3 py-1.5">
            <span className="font-mono text-xs text-chrome-light tracking-widest uppercase">
              Fig. 01 — Fabrication
            </span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
          className="flex flex-col gap-8"
        >
          <motion.span
            variants={fadeUp}
            className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark"
          >
            Nos origines
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-sans font-light text-system-green leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            Nous concevons des
            <br />
            systèmes intelligents
          </motion.h2>

          <motion.div variants={fadeUp} className="h-px bg-chrome w-12" />

          <motion.p
            variants={fadeUp}
            className="text-ink/65 leading-relaxed max-w-lg"
          >
            Il y a des ingénieurs qui fabriquent des choses dont ils sont fiers.
            Des gens qui testent avant de livrer, qui mesurent avant d&apos;affirmer.
            Lite Ops est né de cet esprit-là.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-sage leading-relaxed max-w-lg text-sm"
          >
            Le savoir-faire acquis. Le stylo derrière l&apos;oreille. Une rigueur
            d&apos;atelier appliquée à l&apos;intelligence artificielle.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-4">
            <ArrowLink href="/custom">À propos de nous</ArrowLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 3. TRANSITION BANNER
// ---------------------------------------------------------------------------

function TransitionBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <div
      ref={ref}
      className="bg-fog border-y border-rule py-16 lg:py-20 text-center px-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: ES }}
        className="font-sans font-light text-system-green text-2xl lg:text-3xl tracking-tight"
      >
        De la conception a l&apos;utilisation quotidienne
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: ES }}
        className="mt-3 font-mono text-sm text-sage tracking-widest uppercase"
      >
        La structure ouvre l&apos;opportunite.
      </motion.p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. THREE LEVELS — Interactive hierarchy diagram
// ---------------------------------------------------------------------------

type DiagramNode = {
  id: string;
  label: string;
  sublabel?: string;
};

const OPERATEURS: DiagramNode[] = [
  { id: "data", label: "DATA" },
  { id: "llm", label: "LLM" },
  { id: "rag", label: "RAG" },
  { id: "ocr", label: "OCR" },
  { id: "doc", label: "DOC", sublabel: "UNDERSTANDING" },
  { id: "sql", label: "TEXT", sublabel: "TO SQL" },
  { id: "graph", label: "GRAPH", sublabel: "GENERATION" },
];

const AGENTS: DiagramNode[] = [
  { id: "ag001", label: "AG001", sublabel: "PILOT" },
  { id: "ag002", label: "AG002", sublabel: "SAILOR" },
];

const SYSTEMS: DiagramNode[] = [
  { id: "namibia", label: "NAMIBIA", sublabel: "HUB" },
  { id: "recrutement", label: "Recrutement" },
  { id: "acquisition", label: "Acquisition" },
];

function DiagramBlock({
  node,
  isHighlighted,
  onHover,
  isSecondary = false,
}: {
  node: DiagramNode;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
  isSecondary?: boolean;
}) {
  return (
    <motion.div
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
      tabIndex={0}
      role="listitem"
      animate={{
        borderColor: isHighlighted ? "#A5D900" : "#D4D0C8",
        backgroundColor: isHighlighted ? "#EFF5E6" : "transparent",
      }}
      transition={{ duration: 0.18 }}
      className={`relative px-3 py-2 border cursor-default focus:outline-none ${
        isSecondary ? "min-w-[72px]" : "min-w-[60px]"
      }`}
    >
      <p
        className={`font-mono leading-none text-center ${
          isHighlighted ? "text-moss" : "text-ink/70"
        } ${isSecondary ? "text-[10px]" : "text-[9px]"} font-medium tracking-wider uppercase transition-colors duration-150`}
      >
        {node.label}
      </p>
      {node.sublabel && (
        <p
          className={`font-mono leading-none text-center mt-0.5 ${
            isHighlighted ? "text-chrome" : "text-ink/40"
          } text-[8px] tracking-wider uppercase transition-colors duration-150`}
        >
          {node.sublabel}
        </p>
      )}
      {isHighlighted && (
        <motion.div
          layoutId="block-indicator"
          className="absolute -top-px left-0 right-0 h-[2px] bg-signal-green"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.div>
  );
}

function HierarchyDiagram() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  // SVG dimensions (approximate, diagram is 720 wide × 300 tall internal coords)
  // We draw lines from Operateurs row → Agents row → Systems row
  // Using rough center positions based on flex layout
  const svgLines = [
    // Operateurs center → AG001 center
    { x1: 180, y1: 0, x2: 260, y2: 100 },
    // Operateurs center → AG002 center
    { x1: 180, y1: 0, x2: 460, y2: 100 },
    // AG001 → NAMIBIA
    { x1: 260, y1: 100, x2: 260, y2: 200 },
    // AG002 → NAMIBIA
    { x1: 460, y1: 100, x2: 260, y2: 200 },
    // NAMIBIA → Recrutement
    { x1: 260, y1: 200, x2: 440, y2: 200 },
    // NAMIBIA → Acquisition
    { x1: 260, y1: 200, x2: 580, y2: 200 },
  ];

  return (
    <section
      className="relative py-32 lg:py-40 bg-architect-paper blueprint-grid topo-lines overflow-hidden"
      aria-label="Hiérarchie système"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">
        {/* Header */}
        <Reveal className="mb-16">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">
            Architecture
          </span>
          <h2
            className="mt-3 font-sans font-light text-system-green leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            Trois niveaux. Une logique.
          </h2>
        </Reveal>

        {/* Diagram */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: ES }}
          className="relative"
        >
          {/* Three rows */}
          <div className="flex flex-col gap-0">
            {/* Row: OPERATEURS */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-steel w-24 shrink-0">
                  Opérateurs
                </span>
                <div className="h-px flex-1 bg-chrome-light/60" />
              </div>
              <div
                role="list"
                aria-label="Opérateurs"
                className="flex flex-wrap gap-2 pl-28"
              >
                {OPERATEURS.map((node) => (
                  <DiagramBlock
                    key={node.id}
                    node={node}
                    isHighlighted={hoveredId === node.id}
                    onHover={setHoveredId}
                  />
                ))}
              </div>
            </div>

            {/* Connector lines SVG (decorative) */}
            <div className="pl-28 my-4 h-12 relative overflow-visible">
              <svg
                className="absolute left-28 top-0 w-full h-12 overflow-visible"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Two lines down from operateur cluster to agents */}
                <line
                  x1="20%"
                  y1="0"
                  x2="12%"
                  y2="100%"
                  stroke="#D4D0C8"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
                <line
                  x1="20%"
                  y1="0"
                  x2="52%"
                  y2="100%"
                  stroke="#D4D0C8"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Row: AGENTS */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-steel w-24 shrink-0">
                  Agents
                </span>
                <div className="h-px flex-1 bg-chrome-light/60" />
              </div>
              <div
                role="list"
                aria-label="Agents"
                className="flex flex-wrap gap-3 pl-28"
              >
                {AGENTS.map((node) => (
                  <DiagramBlock
                    key={node.id}
                    node={node}
                    isHighlighted={hoveredId === node.id}
                    onHover={setHoveredId}
                    isSecondary
                  />
                ))}
              </div>
            </div>

            {/* Connector lines SVG (decorative) */}
            <div className="pl-28 my-4 h-12 relative overflow-visible">
              <svg
                className="absolute left-28 top-0 w-full h-12 overflow-visible"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="12%"
                  y1="0"
                  x2="4%"
                  y2="100%"
                  stroke="#D4D0C8"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
                <line
                  x1="52%"
                  y1="0"
                  x2="4%"
                  y2="100%"
                  stroke="#D4D0C8"
                  strokeWidth="0.75"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Row: SYSTEMES */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-steel w-24 shrink-0">
                  Systèmes
                </span>
                <div className="h-px flex-1 bg-chrome-light/60" />
              </div>
              <div
                role="list"
                aria-label="Systèmes"
                className="flex flex-wrap gap-3 pl-28 items-center"
              >
                {/* NAMIBIA HUB — primary node */}
                <DiagramBlock
                  node={SYSTEMS[0]}
                  isHighlighted={hoveredId === SYSTEMS[0].id}
                  onHover={setHoveredId}
                  isSecondary
                />
                {/* Arrow connecting to sub-systems */}
                <span
                  className="font-mono text-rule text-xs mx-1"
                  aria-hidden="true"
                >
                  →
                </span>
                {/* Sub-system tags */}
                {SYSTEMS.slice(1).map((node) => (
                  <motion.div
                    key={node.id}
                    onMouseEnter={() => setHoveredId(node.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    animate={{
                      backgroundColor:
                        hoveredId === node.id ? "#EFF5E6" : "transparent",
                    }}
                    className="px-3 py-1.5 border border-rule/50 cursor-default"
                  >
                    <span
                      className={`font-mono text-[9px] tracking-wider uppercase transition-colors duration-150 ${
                        hoveredId === node.id ? "text-moss" : "text-ink/50"
                      }`}
                    >
                      {node.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom caption */}
          <div className="mt-12 pt-6 border-t border-chrome-light/50 pl-28 flex items-center gap-4">
            <span className="font-mono text-[10px] text-steel/70 uppercase tracking-widest">
              Note:
            </span>
            <p className="font-mono text-[10px] text-ink/50 leading-relaxed max-w-xl">
              Un système est un module dans vos opérations. Les opérateurs sont
              les briques, les agents sont les spécialistes, les systèmes sont
              les produits déployés.
            </p>
          </div>

          {/* SVG decorative corner marks */}
          <svg
            className="absolute top-0 left-0 w-6 h-6 text-chrome"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 12 L0 0 L12 0" stroke="currentColor" strokeWidth="0.75" />
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-6 h-6 text-chrome"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path d="M24 12 L24 24 L12 24" stroke="currentColor" strokeWidth="0.75" />
          </svg>
        </motion.div>
      </div>

      {/* Hidden accessible summary */}
      <div className="sr-only">
        <p>
          Hiérarchie technique: les Opérateurs (DATA, LLM, RAG, OCR, DOC
          UNDERSTANDING, TEXT TO SQL, GRAPH GENERATION) alimentent les Agents
          (AG001 PILOT, AG002 SAILOR) qui composent les Systèmes (NAMIBIA HUB,
          incluant Recrutement et Acquisition).
        </p>
      </div>

      {/* Unused svgLines variable acknowledged — kept for future interactive SVG overlay */}
      {svgLines.length > 0 && null}
    </section>
  );
}

// ---------------------------------------------------------------------------
// 5. AGENTS PREVIEW
// ---------------------------------------------------------------------------

type SubCard = {
  code: string;
  label: string;
};

type AgentCard = {
  code: string;
  name: string;
  description: string;
  photo: string;
  href: string;
  subCards: SubCard[];
};

const AGENT_CARDS: AgentCard[] = [
  {
    code: "AG001",
    name: "PILOT",
    description:
      "Uploader une base. Analyser. Générer des rapports via chatbot.",
    photo: "/photos/photo-1679587246899-8b9172fc78e2.avif",
    href: "/agents/pilot",
    subCards: [
      { code: "AG001-RI", label: "Risques" },
      { code: "AG001-RH", label: "Data employés" },
    ],
  },
  {
    code: "AG002",
    name: "SAILOR",
    description:
      "Intégrer une base documentaire. Trouver via chatbot. Sources citées.",
    photo: "/photos/photo-1553748024-dd3fd69ab116.avif",
    href: "/agents/sailor",
    subCards: [],
  },
];

function AgentPreviewCard({ agent }: { agent: AgentCard }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={agent.href}
      className="group block relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-green"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`${agent.code} ${agent.name} — ${agent.description}`}
    >
      {/* Background photo */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={agent.photo}
          alt={`${agent.name} agent visual`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-system-green/90 via-system-green/30 to-transparent" />

        {/* Glass overlay on hover */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 bg-system-green/20 backdrop-blur-[2px]"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          {/* Code badge */}
          <div className="mb-4 flex items-center gap-2">
            <span className="font-mono text-xs text-chrome-dark tracking-widest uppercase">
              {agent.code}
            </span>
            <motion.span
              animate={{ width: hovered ? "2rem" : "0.5rem" }}
              transition={{ duration: 0.3, ease: ES }}
              className="block h-px bg-chrome"
              aria-hidden="true"
            />
          </div>

          <h3 className="font-sans font-light text-architect-paper text-3xl leading-tight mb-3">
            {agent.name}
          </h3>

          <p className="font-mono text-sm text-architect-paper/70 leading-relaxed mb-6">
            {agent.description}
          </p>

          {/* Sub-cards */}
          {agent.subCards.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {agent.subCards.map((sub) => (
                <div
                  key={sub.code}
                  className="px-2 py-1 border border-architect-paper/20 bg-architect-paper/10 backdrop-blur-sm"
                >
                  <span className="font-mono text-[10px] text-architect-paper/60 tracking-wider uppercase">
                    {sub.code}
                  </span>
                  <span className="font-mono text-[10px] text-architect-paper/40 ml-1 tracking-wider">
                    {sub.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Arrow */}
          <div className="flex items-center gap-2 text-signal-green font-mono text-xs tracking-widest uppercase">
            <span>Voir l&apos;agent</span>
            <motion.span
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ duration: 0.2 }}
              aria-hidden="true"
            >
              →
            </motion.span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function AgentsPreviewSection() {
  return (
    <section
      className="bg-warm-paper py-32 lg:py-40"
      aria-label="Aperçu des agents"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">
        <Reveal className="mb-16 flex flex-col gap-3">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">
            Agents actifs
          </span>
          <h2
            className="font-sans font-light text-system-green leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            Deux agents.
            <br />
            Un but.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
          {AGENT_CARDS.map((agent, i) => (
            <Reveal key={agent.code} delay={i * 0.12}>
              <AgentPreviewCard agent={agent} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 6. QUOTE SECTION
// ---------------------------------------------------------------------------

function QuoteSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.18, 0.18, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-system-green py-28 lg:py-40 overflow-hidden"
      aria-label="Citation"
    >
      {/* Parallax photo background */}
      <motion.div
        style={{ opacity: photoOpacity }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <Image
          src="/photos/premium_photo-1670897797006-81cbbb1bfc7b.avif"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Blueprint grid tint */}
      <div className="absolute inset-0 blueprint-grid opacity-10" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-8 lg:px-20 text-center">
        <Reveal variants={fadeIn}>
          <span className="font-mono text-chrome text-4xl leading-none" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="font-sans font-light italic text-architect-paper/90 leading-relaxed mt-2 mb-6"
            style={{ fontSize: "clamp(1.3rem, 3vw, 2.2rem)" }}
          >
            Nos agents, nos systèmes, sont ceux que les utilisateurs adoptent
            sans qu&apos;on leur explique. Simple, efficace, mesurable.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-chrome/40" />
            <span className="font-mono text-xs text-chrome-dark tracking-widest uppercase">
              Lite Ops
            </span>
            <div className="h-px w-12 bg-chrome/40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 7. LAYERS SECTION
// ---------------------------------------------------------------------------

type Layer = {
  id: string;
  label: string;
  number: string;
  content: string;
};

const LAYERS: Layer[] = [
  {
    id: "technique",
    number: "L.01",
    label: "Layer Technique",
    content:
      "Les fondations: LLM, RAG, OCR, pipelines de traitement des données. Choix des modèles, fine-tuning, évaluation continue. Nous choisissons la bonne technologie, pas la plus en vue.",
  },
  {
    id: "metier",
    number: "L.02",
    label: "Layer Métier",
    content:
      "La connaissance sectorielle intégrée dans les agents. Comprendre le vocabulaire, les contraintes, les workflows spécifiques à votre domaine pour que l'agent soit immédiatement pertinent.",
  },
  {
    id: "organisationnel",
    number: "L.03",
    label: "Layer Organisationnel",
    content:
      "L'intégration dans vos processus existants. API, permissions, audit trail, SSO. Un système qui se glisse dans votre organisation sans la remodeler.",
  },
  {
    id: "change",
    number: "L.04",
    label: "Layer Change Management",
    content:
      "L'adoption réelle. Formation, documentation, retours terrain. Parce qu'un outil non utilisé n'a aucune valeur, nous accompagnons jusqu'à l'autonomie complète.",
  },
];

function AccordionItem({ layer }: { layer: Layer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-chrome-light">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between py-5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-chrome"
        aria-expanded={open}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-chrome tracking-wider">{layer.number}</span>
          <span
            className={`font-sans font-medium transition-colors duration-200 ${
              open ? "text-moss" : "text-ink/80 group-hover:text-ink"
            }`}
          >
            {layer.label}
          </span>
        </div>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className={`font-mono text-lg leading-none transition-colors duration-200 ${
            open ? "text-moss" : "text-chrome-light"
          }`}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: ES }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-ink/60 leading-relaxed max-w-sm">
          {layer.content}
        </p>
      </motion.div>
    </div>
  );
}

function LayersSection() {
  return (
    <section
      className="bg-architect-paper py-32 lg:py-40"
      aria-label="Layers d'expertise"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        {/* Left: accordion */}
        <div>
          <Reveal>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">
              Expertise
            </span>
            <h2
              className="mt-3 mb-10 font-sans font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              L&apos;expertise qui fait
              <br />
              la différence
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border-t border-chrome-light">
              {LAYERS.map((layer) => (
                <AccordionItem key={layer.id} layer={layer} />
              ))}
            </div>
          </Reveal>

          {/* Callout box */}
          <Reveal delay={0.2}>
            <div className="mt-10 p-6 border border-chrome-light bg-fog">
              <p className="font-sans text-sm text-ink/70 leading-relaxed italic">
                Comme des calques d&apos;architecte qu&apos;on empile — nos layers font
                que nos opérateurs sont plus efficaces, nos agents deviennent
                des spécialistes, et nos systèmes sont orientés ROI.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Right: photo stack */}
        <Reveal variants={fadeIn} delay={0.15}>
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/photos/photo-1616785640127-6250fb9f7cb4.avif"
                alt="Workshop detail — layers of craft"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 border border-chrome/30 pointer-events-none" />
            </div>

            {/* Floating label */}
            <div className="absolute -bottom-4 -left-4 bg-warm-paper border border-chrome-light px-4 py-3 shadow-sm">
              <span className="font-mono text-[10px] text-steel uppercase tracking-widest block">
                Layers
              </span>
              <span className="font-mono text-xs text-ink mt-0.5 block">
                04 niveaux d&apos;intégration
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 8. SOVEREIGNTY SECTION
// ---------------------------------------------------------------------------

function SovereigntySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const props = [
    { label: "Hébergement", local: "On-premise ou Scaleway", saas: "Mutualisé, hors UE" },
    { label: "Données", local: "Restent en France", saas: "Transit international" },
    { label: "Modèles", local: "Déployés localement", saas: "API tierce" },
    { label: "Souveraineté", local: "Totale", saas: "Dépendance vendor" },
  ];

  return (
    <section
      ref={ref}
      className="bg-green-tint py-32 lg:py-40 border-y border-chrome-light/50"
      aria-label="Souveraineté"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Text */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark"
            >
              Souveraineté
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: ES }}
              className="mt-3 mb-6 font-sans font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Français, souverains,
              <br />
              locaux.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-ink/65 leading-relaxed max-w-md mb-8"
            >
              Nos modèles tournent chez vous ou chez Scaleway. Vos données ne
              quittent pas le territoire. Pas de dépendance à un vendor américain,
              pas de flux hors RGPD.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ArrowLink href="/custom">En savoir plus</ArrowLink>
            </motion.div>
          </div>

          {/* Comparison grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Header row */}
            <div className="grid grid-cols-3 gap-0 mb-2">
              <div />
              <div className="px-3 py-2 bg-system-green text-center">
                <span className="font-mono text-[10px] text-signal-green tracking-widest uppercase">
                  Lite Ops
                </span>
              </div>
              <div className="px-3 py-2 bg-fog text-center border border-chrome-light">
                <span className="font-mono text-[10px] text-ink/40 tracking-widest uppercase">
                  SaaS
                </span>
              </div>
            </div>
            {/* Rows */}
            {props.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 gap-0 border-b border-chrome-light/50 ${
                  i === 0 ? "border-t" : ""
                }`}
              >
                <div className="py-3 pr-3">
                  <span className="font-mono text-[10px] text-steel uppercase tracking-wider">
                    {row.label}
                  </span>
                </div>
                <div className="px-3 py-3 bg-system-green/5 border-x border-chrome-light/30">
                  <span className="font-sans text-xs text-moss font-medium">
                    {row.local}
                  </span>
                </div>
                <div className="px-3 py-3">
                  <span className="font-sans text-xs text-ink/40">
                    {row.saas}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 9. NEWS SECTION
// ---------------------------------------------------------------------------

type NewsItem = {
  tag: string;
  title: string;
  excerpt: string;
  photo: string;
};

const NEWS_ITEMS: NewsItem[] = [
  {
    tag: "Souveraineté",
    title: "IA locale et souveraineté des données",
    excerpt:
      "Pourquoi exécuter ses modèles en France n'est plus une contrainte mais un avantage compétitif.",
    photo: "/photos/photo-1739086759198-b99a6e3f8599.avif",
  },
  {
    tag: "Production",
    title: "Standards de securite en production",
    excerpt:
      "Les pratiques qui séparent un proof-of-concept d'un système en production: audit, rollback, observabilité.",
    photo: "/photos/photo-1761495623285-22c46934ed13.avif",
  },
  {
    tag: "Architecture",
    title: "Percées en modularité",
    excerpt:
      "Comment la modularité change la manière de déployer, tester et maintenir des systèmes IA sur le long terme.",
    photo: "/photos/premium_photo-1675705721263-0bbeec261c49.avif",
  },
];

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <Reveal delay={index * 0.1}>
      <article className="group cursor-pointer flex flex-col h-full">
        <div className="relative aspect-[16/10] overflow-hidden mb-4">
          <Image
            src={item.photo}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-system-green/40 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="font-mono text-[9px] text-chrome-light tracking-widest uppercase bg-system-green/80 px-2 py-1 backdrop-blur-sm">
              {item.tag}
            </span>
          </div>
        </div>
        <h3 className="font-sans font-medium text-system-green text-base mb-2 group-hover:text-moss transition-colors duration-200">
          {item.title}
        </h3>
        <p className="text-sm text-ink/60 leading-relaxed flex-1">{item.excerpt}</p>
        <div className="mt-4">
          <ArrowLink href="#">Lire la suite</ArrowLink>
        </div>
      </article>
    </Reveal>
  );
}

function NewsSection() {
  return (
    <section
      className="bg-warm-paper py-32 lg:py-40"
      aria-label="Actualites"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-3">
              Ressources
            </span>
            <h2
              className="font-sans font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Perspectives
            </h2>
          </div>
          <ArrowLink href="#" className="shrink-0 hidden md:inline-flex">
            Voir tout
          </ArrowLink>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {NEWS_ITEMS.map((item, i) => (
            <NewsCard key={item.title} item={item} index={i} />
          ))}
        </div>

        <div className="mt-10 md:hidden">
          <ArrowLink href="#">Voir toutes les ressources</ArrowLink>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// 10. FINAL CTA
// ---------------------------------------------------------------------------

function FinalCTA() {
  return (
    <section
      className="bg-fog border-t border-chrome-light py-32 lg:py-40"
      aria-label="Contact"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <Reveal>
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-3">
            Démarrer
          </span>
          <h2
            className="font-sans font-light text-system-green leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
          >
            Un projet.
            <br />
            Une conversation.
          </h2>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-system-green text-architect-paper font-mono text-sm tracking-widest uppercase transition-all duration-200 hover:bg-moss focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-green"
          >
            Demander une démo
          </Link>
          <ArrowLink href="/agents/pilot">Explorer les agents</ArrowLink>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PAGE ROOT
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <div className="page-enter">
      <HeroSection />
      <OriginsSection />
      <TransitionBanner />
      <HierarchyDiagram />
      <AgentsPreviewSection />
      <QuoteSection />
      <LayersSection />
      <SovereigntySection />
      <NewsSection />
      <FinalCTA />
    </div>
  );
}
