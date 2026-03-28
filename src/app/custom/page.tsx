"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const PROCESS_STEPS = [
  {
    id: "01",
    label: "AUDIT",
    description:
      "Diagnostic de maturité données, process cibles, opportunités d'automatisation",
  },
  {
    id: "02",
    label: "DESIGN",
    description:
      "Conception de l'architecture: opérateurs, agents, layers, intégrations",
  },
  {
    id: "03",
    label: "DEPLOY",
    description:
      "Déploiement itératif, calibration métier, tests en conditions réelles",
  },
  {
    id: "04",
    label: "MEASURE",
    description:
      "Mesure d'impact, optimisation continue, formation des équipes",
  },
] as const;

const SERVICES = [
  {
    code: "SVC-01",
    title: "Audit",
    description:
      "Diagnostic de maturité données, process cibles, opportunités d'automatisation",
  },
  {
    code: "SVC-02",
    title: "Intégration Métier",
    description:
      "Calibration des layers sur votre domaine — nos opérateurs deviennent spécialistes",
  },
  {
    code: "SVC-03",
    title: "Intégration SI",
    description:
      "Connexion de nos agents à vos systèmes (ERP, CRM, bases documentaires, APIs)",
  },
  {
    code: "SVC-04",
    title: "Financement",
    description:
      "Identification et montage des dispositifs publics (BPI, régions, crédit d'impôt)",
  },
] as const;

const PRICING_LINES = [
  {
    label: "Budget fixe de setup",
    type: "One-time",
    note: "Frais de cadrage, architecture et déploiement initial",
    recurring: false,
  },
  {
    label: "Licence mensuelle",
    type: "Mensuel",
    note: "Par agent ou système déployé — arrêt possible à tout moment",
    recurring: true,
  },
  {
    label: "Fees custom",
    type: "Conditionnel",
    note: "Uniquement pour des développements spécifiques hors catalogue",
    recurring: false,
  },
] as const;

const TRUST_POINTS = [
  {
    keyword: "Sans risque",
    description: "Déploiement local ou ZDR — aucune donnée ne quitte votre périmètre",
  },
  {
    keyword: "Sans investissement lourd",
    description: "Licence mensuelle, sans engagement pluriannuel",
  },
  {
    keyword: "Sans boite noire",
    description: "Architecture documentée, logique exposée, tout est lisible",
  },
  {
    keyword: "Souverain",
    description: "Données hébergées en France, conformité RGPD native",
  },
  {
    keyword: "Modulaire",
    description: "Rien n'est jetable — chaque brique évolue avec votre organisation",
  },
] as const;

const ROADMAP_FEATURES = [
  { id: "F-041", title: "Export PDF des rapports", votes: 14, voted: false },
  { id: "F-038", title: "Webhook sortant configurable", votes: 9, voted: false },
  { id: "F-035", title: "Tableau de bord multi-agents", votes: 21, voted: true },
  { id: "F-029", title: "Mode offline partiel", votes: 7, voted: false },
] as const;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Breadcrumb() {
  return (
    <nav
      aria-label="Fil d'ariane"
      className="flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] uppercase"
    >
      <Link href="/" className="text-chrome-dark hover:text-ink transition-colors duration-150">
        Accueil
      </Link>
      <span className="text-chrome-dark" aria-hidden="true">
        /
      </span>
      <span className="text-ink">Missions Custom</span>
    </nav>
  );
}

// Pipeline SVG — Teenage Engineering-style horizontal flow
function PipelineDiagram() {
  const stepCount = PROCESS_STEPS.length;
  const W = 800;
  const H = 140;
  const padX = 60;
  const stepW = (W - padX * 2) / stepCount;
  const nodeY = 52;
  const r = 6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-3xl mx-auto"
      aria-hidden="true"
      role="img"
    >
      {/* Connector lines */}
      {PROCESS_STEPS.map((_, i) => {
        if (i === stepCount - 1) return null;
        const x1 = padX + i * stepW + stepW / 2 + r;
        const x2 = padX + (i + 1) * stepW + stepW / 2 - r;
        const midX = (x1 + x2) / 2;
        return (
          <g key={`conn-${i}`}>
            <line
              x1={x1}
              y1={nodeY}
              x2={x2}
              y2={nodeY}
              stroke="#B8B5AE"
              strokeWidth="1"
            />
            {/* Arrow head */}
            <polygon
              points={`${x2},${nodeY} ${x2 - 7},${nodeY - 4} ${x2 - 7},${nodeY + 4}`}
              fill="#B8B5AE"
            />
            {/* Tick mark at midpoint */}
            <line
              x1={midX}
              y1={nodeY - 4}
              x2={midX}
              y2={nodeY + 4}
              stroke="#B8B5AE"
              strokeWidth="0.6"
            />
          </g>
        );
      })}

      {/* Nodes + labels */}
      {PROCESS_STEPS.map((step, i) => {
        const cx = padX + i * stepW + stepW / 2;
        return (
          <g key={step.id}>
            {/* Step index */}
            <text
              x={cx}
              y={nodeY - 18}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="9"
              fill="#7D7A73"
              letterSpacing="0.12em"
            >
              {step.id}
            </text>

            {/* Circle node — chrome-dark border, no fill */}
            <circle cx={cx} cy={nodeY} r={r} fill="none" stroke="#9A968E" strokeWidth="1.5" />
            <circle cx={cx} cy={nodeY} r={r - 2} fill="#9A968E" />

            {/* Step label */}
            <text
              x={cx}
              y={nodeY + 22}
              textAnchor="middle"
              fontFamily="'JetBrains Mono', monospace"
              fontSize="10"
              fontWeight="500"
              fill="#1A1A1A"
              letterSpacing="0.18em"
            >
              {step.label}
            </text>

            {/* Description — wrapped manually across 2 lines */}
            {wrapText(step.description, 22).map((line, li) => (
              <text
                key={li}
                x={cx}
                y={nodeY + 40 + li * 13}
                textAnchor="middle"
                fontFamily="'DM Sans', sans-serif"
                fontSize="8.5"
                fill="#7D7A73"
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** Naive word-wrap for SVG text into chunks of ~maxChars */
function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + (current ? " " : "") + word).length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3); // max 3 lines
}

function ServiceCard({
  code,
  title,
  description,
  index,
}: {
  code: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.08}
      className="border border-chrome-light/60 bg-warm-paper p-8 flex flex-col gap-3 group hover:border-chrome-dark transition-colors duration-200"
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-chrome uppercase">
        {code}
      </p>
      <h3 className="font-sans text-base font-medium text-ink">{title}</h3>
      <p className="font-sans text-sm leading-relaxed text-ink/75">{description}</p>
      <div className="mt-auto pt-2">
        <span className="inline-block w-4 h-px bg-chrome-light group-hover:bg-chrome-dark group-hover:w-6 transition-all duration-300" />
      </div>
    </motion.div>
  );
}

function PricingRow({
  label,
  type,
  note,
  recurring,
  index,
}: {
  label: string;
  type: string;
  note: string;
  recurring: boolean;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.07}
      className="grid grid-cols-[1fr_auto] gap-4 items-start border-b border-chrome-light/60 py-5 last:border-none"
    >
      <div className="space-y-1">
        <p className="font-sans text-base font-medium text-ink">{label}</p>
        <p className="font-sans text-sm text-ink/75">{note}</p>
      </div>
      <span
        className={[
          "shrink-0 self-start font-mono text-[11px] uppercase tracking-[0.14em] px-2 py-1",
          "bg-fog text-steel border border-chrome-light/60",
        ].join(" ")}
      >
        {type}
      </span>
    </motion.div>
  );
}

function VoteCard({
  id,
  title,
  initialVotes,
  initialVoted,
}: {
  id: string;
  title: string;
  initialVotes: number;
  initialVoted: boolean;
}) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(initialVoted);

  function handleVote() {
    if (voted) {
      setVotes((v) => v - 1);
      setVoted(false);
    } else {
      setVotes((v) => v + 1);
      setVoted(true);
    }
  }

  return (
    <div
      className={[
        "border p-6 flex items-center justify-between gap-4 transition-colors duration-200",
        voted ? "border-signal-green bg-warm-paper" : "border-chrome bg-warm-paper",
      ].join(" ")}
    >
      <div className="space-y-0.5 min-w-0">
        <p className="font-mono text-[11px] tracking-[0.14em] text-steel uppercase">
          {id}
        </p>
        <p className="font-sans text-sm font-medium text-ink truncate">{title}</p>
      </div>
      <button
        type="button"
        onClick={handleVote}
        aria-pressed={voted}
        aria-label={`${voted ? "Retirer mon vote pour" : "Voter pour"}: ${title}`}
        className={[
          "shrink-0 flex items-center gap-2 px-3 py-1.5 font-mono text-xs",
          "border transition-all duration-200",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-green",
          voted
            ? "border-signal-green text-signal-green bg-architect-paper"
            : "border-chrome text-chrome-dark bg-architect-paper hover:border-chrome-dark hover:text-ink",
        ].join(" ")}
      >
        <span aria-hidden="true">{voted ? "▲" : "△"}</span>
        <span>{votes}</span>
      </button>
    </div>
  );
}

function TrustPoint({
  keyword,
  description,
  index,
}: {
  keyword: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.07}
      className="flex items-start gap-4 py-4 border-b border-chrome-light/60 last:border-none"
    >
      <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-chrome-dark" aria-hidden="true" />
      <div className="space-y-0.5">
        <p className="font-sans text-sm font-semibold text-ink">{keyword}</p>
        <p className="font-sans text-sm text-ink/75">{description}</p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section label
// ---------------------------------------------------------------------------

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-steel mb-3">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CustomPage() {
  return (
    <div className="bg-architect-paper min-h-screen">

      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden border-b border-rule">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/photos/photo-1499988921418-b7df40ff03f9.avif"
            alt="Dune abstraite — sobriété et craft"
            fill
            priority
            className="object-cover object-center opacity-[0.08]"
            sizes="100vw"
          />
        </div>

        {/* Blueprint grid overlay */}
        <div className="absolute inset-0 z-0 blueprint-grid opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-20 pt-32 pb-20 lg:pt-40 lg:pb-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-2xl space-y-6"
          >
            <motion.div variants={fadeUp} custom={0}>
              <Breadcrumb />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={0.08}
              className="font-sans text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
            >
              Missions Custom
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={0.16}
              className="font-sans text-lg leading-relaxed text-ink/75 max-w-xl"
            >
              Chaque organisation a ses spécificités. Nous construisons des
              agents et des systèmes sur-mesure, adaptés à votre réalité.
            </motion.p>

            <motion.div variants={fadeUp} custom={0.24} className="flex gap-3 pt-2">
              <a
                href="#contact"
                className={[
                  "inline-flex items-center gap-2 px-6 py-3",
                  "bg-signal-green text-system-green",
                  "font-mono text-xs uppercase tracking-[0.16em]",
                  "border border-signal-green",
                  "hover:bg-signal-green/90 transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-green",
                ].join(" ")}
              >
                Discutons de votre projet
              </a>
              <a
                href="#methode"
                className={[
                  "inline-flex items-center gap-2 px-6 py-3",
                  "border border-chrome-dark text-ink",
                  "font-mono text-xs uppercase tracking-[0.16em]",
                  "hover:bg-fog transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chrome-dark",
                ].join(" ")}
              >
                Voir la méthode
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — METHOD / PIPELINE                                        */}
      {/* ------------------------------------------------------------------ */}
      <section id="methode" className="border-b border-chrome-light/60">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-12">
              <SectionLabel>Méthode</SectionLabel>
              <h2 className="font-sans text-2xl font-semibold text-ink tracking-tight">
                Un processus en quatre phases
              </h2>
            </motion.div>

            {/* Desktop: SVG pipeline */}
            <motion.div
              variants={fadeUp}
              custom={0.1}
              className="hidden sm:block py-4"
            >
              <PipelineDiagram />
            </motion.div>

            {/* Mobile: vertical list */}
            <ol className="sm:hidden space-y-6" aria-label="Étapes du processus">
              {PROCESS_STEPS.map((step, i) => (
                <motion.li
                  key={step.id}
                  variants={fadeUp}
                  custom={i * 0.08}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-[11px] text-steel">{step.id}</span>
                    <div className="w-3 h-3 rounded-full border-2 border-chrome-dark bg-chrome-dark shrink-0" />
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="flex-1 w-px bg-chrome-light/80 min-h-[24px]" />
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink mb-1">
                      {step.label}
                    </p>
                    <p className="font-sans text-sm text-ink/75 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — COMPLEMENTARY SERVICES                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-chrome-light/60 bg-warm-paper">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.div variants={fadeUp} custom={0} className="mb-12">
              <SectionLabel>Services complémentaires</SectionLabel>
              <h2 className="font-sans text-2xl font-semibold text-ink tracking-tight">
                Au-delà du déploiement
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {SERVICES.map((svc, i) => (
                <ServiceCard key={svc.code} {...svc} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 — PRICING                                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-chrome-light/60">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
              <motion.div variants={fadeUp} custom={0} className="space-y-4">
                <SectionLabel>Tarification</SectionLabel>
                <h2 className="font-sans text-2xl font-semibold text-ink tracking-tight">
                  Transparent par design
                </h2>
                <p className="font-sans text-sm leading-relaxed text-ink/75">
                  Aucune surprise. Chaque composant du coût est expliqué avant
                  engagement.
                </p>
                <div className="mt-6 p-4 border border-chrome-light/60 bg-fog">
                  <p className="font-sans text-sm text-steel leading-relaxed">
                    Nous aidons à mobiliser les financements publics disponibles
                    — BPI, régions, crédit d&apos;impôt innovation.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={0.1}
                className="border border-chrome-light/60 bg-warm-paper divide-y divide-chrome-light/40"
              >
                {/* Header row */}
                <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 bg-fog">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                    Composant
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                    Type
                  </p>
                </div>

                <div className="px-6">
                  {PRICING_LINES.map((line, i) => (
                    <PricingRow key={line.label} {...line} index={i} />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4 — ROADMAP PARTICIPATIVE                                   */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-chrome-light/60 bg-warm-paper">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">
              {/* Copy */}
              <div className="space-y-6">
                <motion.div variants={fadeUp} custom={0}>
                  <SectionLabel>Roadmap participative</SectionLabel>
                  <h2 className="font-sans text-2xl font-semibold text-ink tracking-tight">
                    Vous participez aux décisions produit
                  </h2>
                </motion.div>

                <motion.ul
                  variants={fadeUp}
                  custom={0.1}
                  className="space-y-4 font-sans text-sm text-ink/75 leading-relaxed"
                  role="list"
                >
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-chrome-dark" aria-hidden="true" />
                    Les clients Lite Ops ont accès aux roadmaps produits et
                    peuvent voter sur les features
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-chrome-dark" aria-hidden="true" />
                    Les votes remontent directement dans nos priorités
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-chrome-dark" aria-hidden="true" />
                    La transparence s&apos;applique aussi à notre développement
                  </li>
                </motion.ul>

                {/* Second photo accent */}
                <motion.div
                  variants={fadeUp}
                  custom={0.18}
                  className="relative h-36 overflow-hidden border border-chrome-light/60"
                >
                  <Image
                    src="/photos/photo-1772136590973-535e4e007f02.avif"
                    alt="Désert rouge — terre et précision"
                    fill
                    className="object-cover object-center opacity-80"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-[11px] text-chrome-light tracking-[0.14em] uppercase">
                    Sessions de travail collaboratif
                  </span>
                </motion.div>
              </div>

              {/* Interactive vote mockup */}
              <motion.div variants={fadeUp} custom={0.12} className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-steel">
                    Backlog — features en vote
                  </p>
                  <span className="font-mono text-[11px] text-chrome-dark">
                    {ROADMAP_FEATURES.length} features
                  </span>
                </div>

                <div className="space-y-3">
                  {ROADMAP_FEATURES.map((feature) => (
                    <VoteCard
                      key={feature.id}
                      id={feature.id}
                      title={feature.title}
                      initialVotes={feature.votes}
                      initialVoted={feature.voted}
                    />
                  ))}
                </div>

                <p className="pt-3 font-mono text-[11px] text-chrome-dark text-right">
                  Accès complet après signature
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — CTA                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section id="contact" className="border-b border-chrome-light/60 bg-system-green">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-xl"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-chrome-light">
                Contact
              </p>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={0.08}
              className="font-sans text-3xl font-semibold text-architect-paper/90 tracking-tight mb-4 sm:text-4xl"
            >
              Discutons de votre projet
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={0.16}
              className="font-sans text-base text-chrome-light mb-10 leading-relaxed"
            >
              Un premier échange sans engagement pour qualifier votre besoin,
              estimer le périmètre et identifier les financements disponibles.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={0.24}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <a
                href="mailto:contact@liteops.fr"
                className={[
                  "inline-flex items-center justify-center gap-2 px-7 py-4",
                  "bg-signal-green text-system-green",
                  "font-mono text-xs uppercase tracking-[0.16em] font-medium",
                  "hover:bg-architect-paper transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-green",
                ].join(" ")}
              >
                contact@liteops.fr
              </a>

              <a
                href="https://cal.com/liteops"
                target="_blank"
                rel="noopener noreferrer"
                className={[
                  "inline-flex items-center justify-center gap-2 px-7 py-4",
                  "border border-chrome-dark text-architect-paper/90",
                  "font-mono text-xs uppercase tracking-[0.16em]",
                  "hover:bg-fog/10 hover:border-chrome transition-colors duration-200",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal-green",
                ].join(" ")}
              >
                Réserver un créneau
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 6 — WHY LITE OPS                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-chrome-light/60">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 py-24 lg:py-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">
              <motion.div variants={fadeUp} custom={0}>
                <SectionLabel>Pourquoi Lite Ops</SectionLabel>
                <h2 className="font-sans text-2xl font-semibold text-ink tracking-tight mb-4">
                  Conçu pour les organisations qui n&apos;ont pas le droit à
                  l&apos;erreur
                </h2>
                <p className="font-sans text-sm text-ink/75 leading-relaxed">
                  Chaque décision d&apos;architecture répond à une contrainte
                  opérationnelle réelle — pas à une mode technologique.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={0.1}
                className="border border-chrome-light/60 bg-warm-paper divide-y divide-chrome-light/40 px-6"
              >
                {TRUST_POINTS.map((point, i) => (
                  <TrustPoint key={point.keyword} {...point} index={i} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom rule — breathing room before footer */}
      <div className="h-px bg-chrome-light/40" />
    </div>
  );
}
