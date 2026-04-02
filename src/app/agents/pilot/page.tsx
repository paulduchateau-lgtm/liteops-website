"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OperatorId = "DATA_LAYER" | "TEXT_TO_SQL" | "LLM" | "GRAPH_GEN";
type LayerTabId = "TECHNIQUE" | "METIER" | "ADAPTATION";

interface PipelineOperator {
  id: OperatorId;
  code: string;
  label: string;
  description: string;
  role: string;
  inputs: string[];
  outputs: string[];
  preview: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface LayerTab {
  id: LayerTabId;
  label: string;
  description: string;
  annotations: string[];
}

interface Specialist {
  code: string;
  name: string;
  tagline: string;
  description: string;
  uses: string[];
}

interface PricingTier {
  code: string;
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  highlight: boolean;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const OPERATORS: PipelineOperator[] = [
  {
    id: "DATA_LAYER",
    code: "OP-01",
    label: "DATA LAYER",
    description: "Ingestion & normalisation",
    role: "Connecteur universel — ingère, normalise et indexe toute source structurée (SQL, CSV, Excel). Détecte les schémas, les relations, les clés primaires.",
    inputs: [
      "Base SQL (PostgreSQL, MySQL, SQLite)",
      "Fichiers CSV / Excel",
      "Contexte métier en langage naturel",
    ],
    outputs: [
      "Schéma normalisé + métadonnées",
      "Graphe de relations détecté",
      "Index des colonnes sémantiques",
    ],
    preview: "Analyse du schéma: 12 tables, 847 colonnes, 3 clés étrangères détectées.",
    x: 200, y: 130, w: 140, h: 68,
  },
  {
    id: "TEXT_TO_SQL",
    code: "OP-02",
    label: "TEXT TO SQL",
    description: "Traduction langage naturel → SQL",
    role: "Traduit les questions en langage naturel en requêtes SQL précises, en tenant compte du schéma et du contexte métier.",
    inputs: [
      "Question en langage naturel",
      "Schéma normalisé",
      "Métadonnées contextuelles",
    ],
    outputs: [
      "Requête SQL optimisée",
      "Plan d'exécution",
      "Score de confiance (0–100)",
    ],
    preview: "SELECT dept, AVG(salary) FROM employees WHERE... — CONFIANCE: 94%",
    x: 370, y: 130, w: 140, h: 68,
  },
  {
    id: "LLM",
    code: "OP-03",
    label: "LLM",
    description: "Modèle de langage",
    role: "Génère les analyses, interprétations et recommandations à partir des résultats de requêtes SQL.",
    inputs: [
      "Résultats SQL bruts",
      "Contexte métier",
      "Historique de conversation",
    ],
    outputs: [
      "Analyse textuelle structurée",
      "Insights clés hiérarchisés",
      "Recommandations actionnables",
    ],
    preview: "Analyse: Les ventes Q3 montrent une hausse de 18 % sur le segment PME…",
    x: 540, y: 130, w: 140, h: 68,
  },
  {
    id: "GRAPH_GEN",
    code: "OP-04",
    label: "GRAPH GEN",
    description: "Visualisation automatique",
    role: "Transforme les données en visualisations adaptées — sélectionne automatiquement le type de graphe optimal selon la nature des données.",
    inputs: [
      "Dataset structuré",
      "Type d'analyse détecté",
      "Préférences utilisateur",
    ],
    outputs: [
      "Graphiques SVG/PNG",
      "Tableaux interactifs",
      "Exports PDF",
    ],
    preview: "[BAR CHART] Ventes par région — 6 séries, 12 périodes, annotations auto",
    x: 710, y: 130, w: 140, h: 68,
  },
];

const LAYER_TABS: LayerTab[] = [
  {
    id: "TECHNIQUE",
    label: "Technique",
    description: "Pipeline SQL-aware complet — connecteurs natifs PostgreSQL/MySQL/SQLite, fine-tuning schema-aware pour le modèle Text-To-SQL (Mistral 3B local ou GPT-4o cloud), génération de graphes avec Recharts + D3.js. Chaque réponse est ancrée sur votre schéma réel.",
    annotations: [
      "Connecteurs: PostgreSQL, MySQL, SQLite, CSV, Excel",
      "Modèle schema-aware fine-tuned",
      "Local: Mistral 3B / Cloud: GPT-4o",
      "Recharts + D3.js, export SVG/PDF",
    ],
  },
  {
    id: "METIER",
    label: "Métier",
    description: "Calibré pour les directions RH, Finance et Supply Chain. Comprend le vocabulaire sectoriel, les KPI métier usuels, les hiérarchies organisationnelles. Vos équipes posent des questions en français et obtiennent des analyses immédiatement actionnables.",
    annotations: [
      "Ontologie risques: 40K points de données",
      "Vocabulaire RH, finance, supply chain",
      "Cartographie automatique des risques critiques",
      "Templates KPI sectoriels intégrés",
    ],
  },
  {
    id: "ADAPTATION",
    label: "Adaptation",
    description: "Déploiement en 5 jours. Connexion à vos schémas existants, ingestion du glossaire métier de votre organisation, calibration de la tonalité des rapports, personnalisation des exports.",
    annotations: [
      "Connexion à vos schémas existants",
      "Glossaire métier de votre organisation",
      "Tonalité et format de rapport custom",
      "Charte graphique et exports personnalisés",
    ],
  },
];

const SPECIALISTS: Specialist[] = [
  {
    code: "PA-01",
    name: "Pilot Analytics — Risques & RH",
    tagline: "Analyse RH structurée sans SQL",
    description: "Analyse de base RH structurée — effectifs, mouvements, absentéisme, masse salariale. Le DRH explore sa data sans SQL.",
    uses: [
      "Suivi des effectifs et mouvements sortants",
      "Analyse d'absentéisme par site et catégorie",
      "Exploration masse salariale en langage naturel",
      "Génération de rapports CE automatique",
    ],
  },
  {
    code: "PA-02",
    name: "Pilot Analytics — Data Employés",
    tagline: "Exploration RGPD-conforme des données RH",
    description: "Exploration des données individuelles de collaborateurs dans le respect RGPD. Anonymisation automatique, exports conformes.",
    uses: [
      "Profils compétences et historique de carrière",
      "Analyse des formations et certifications",
      "Suivi des entretiens annuels",
      "Exports anonymisés pour audits",
    ],
  },
];

const PRICING_TIERS: PricingTier[] = [
  {
    code: "PI-STARTER",
    name: "Starter",
    price: "490€",
    unit: "/mois",
    description: "1 base de données. 5 utilisateurs. Hébergement ZDR Scaleway.",
    features: [
      "1 source de données connectée",
      "Jusqu'à 5 utilisateurs",
      "50 requêtes / jour",
      "Exports PDF & Excel",
      "Support email",
    ],
    highlight: false,
  },
  {
    code: "PI-PRO",
    name: "Pro",
    price: "1 190€",
    unit: "/mois",
    description: "Bases illimitées. Équipe complète. API + Webhooks.",
    features: [
      "Sources de données illimitées",
      "Utilisateurs illimités",
      "Requêtes illimitées",
      "API REST + Webhooks",
      "Rapports planifiés",
      "Support prioritaire",
    ],
    highlight: true,
  },
  {
    code: "PI-DEPLOY",
    name: "Local Deploy",
    price: "Sur devis",
    unit: "",
    description: "Infrastructure on-premise. Modèles locaux. Données jamais hors site.",
    features: [
      "Modèles Mistral/Qwen on-premise",
      "Air-gap total possible",
      "Données jamais hors site",
      "Audit de sécurité inclus",
      "SLA personnalisé",
    ],
    highlight: false,
  },
];

const SCREENSHOTS = [
  {
    src: "/screenshots-pilot-hero.png",
    alt: "Interface principale Pilot",
    caption: "Interface de requêtage en langage naturel",
  },
  {
    src: "/screenshots-pilot-report1.png",
    alt: "Rapport effectifs par site",
    caption: "Rapport effectifs par site",
  },
  {
    src: "/screenshots-pilot-report2.jpg",
    alt: "Rapport mouvements sortants",
    caption: "Rapport mouvements sortants",
  },
  {
    src: "/screenshots-pilot-report3.jpg",
    alt: "Rapport absentéisme",
    caption: "Rapport absentéisme",
  },
];

// ---------------------------------------------------------------------------
// SVG Pipeline Diagram
// ---------------------------------------------------------------------------

function SvgDefs() {
  return (
    <defs>
      <pattern id="pilot-grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212,208,200,0.2)" strokeWidth="0.8" />
      </pattern>
      <pattern id="pilot-grid-lg" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#pilot-grid-sm)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(212,208,200,0.4)" strokeWidth="0.8" />
      </pattern>
      <marker id="pilot-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L6,3.5 z" fill="#B8B5AE" />
      </marker>
      <marker id="pilot-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L6,3.5 z" fill="#A5D900" />
      </marker>
    </defs>
  );
}

function PipelineDiagram({
  selectedOp,
  onSelectOp,
}: {
  selectedOp: OperatorId | null;
  onSelectOp: (id: OperatorId | null) => void;
}) {
  const inputItems = ["Base de données", "Tableurs", "Contexte NL"];
  const outputItems = ["Rapports graphiques", "Exploration chatbot", "Recommandations"];

  const connections: [OperatorId, OperatorId][] = [
    ["DATA_LAYER", "TEXT_TO_SQL"],
    ["TEXT_TO_SQL", "LLM"],
    ["LLM", "GRAPH_GEN"],
  ];

  return (
    <svg
      viewBox="0 0 960 300"
      className="w-full"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      aria-label="Diagramme pipeline AG001 PILOT"
      role="img"
    >
      <SvgDefs />
      <rect width="960" height="300" fill="url(#pilot-grid-lg)" />

      {/* Outer border */}
      <rect x="8" y="8" width="944" height="284" fill="none" stroke="#CDC9C2" strokeWidth="1" strokeDasharray="4 2" />

      {/* Corner marks */}
      {([[8,8],[952,8],[8,292],[952,292]] as [number,number][]).map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#CDC9C2" strokeWidth="1" />
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#CDC9C2" strokeWidth="1" />
        </g>
      ))}

      {/* Header label */}
      <text x="20" y="26" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill="#9A968E" letterSpacing="0.12em">
        LITE OPS / AG001-PILOT / PIPELINE SCHEMA / REV.5
      </text>
      <text x="940" y="26" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill="#B8B5AE" letterSpacing="0.08em" textAnchor="end">
        2026-03-28
      </text>
      <line x1="20" y1="33" x2="940" y2="33" stroke="#CDC9C2" strokeWidth="0.8" />

      {/* INPUTS block */}
      <rect x="20" y="90" width="148" height="135" fill="#F0EEEB" stroke="#9A968E" strokeWidth="1" />
      <rect x="20" y="90" width="148" height="15" fill="#9A968E" />
      <text x="26" y="101" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#F0EEEB" letterSpacing="0.1em" fontWeight="500">
        INPUTS
      </text>
      {inputItems.map((item, i) => (
        <g key={item}>
          <rect x="28" y={113 + i * 34} width="132" height="26" fill="#F6F4F0" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x="94" y={130 + i * 34} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#1C1C1A" letterSpacing="0.04em" textAnchor="middle">
            {item}
          </text>
        </g>
      ))}

      {/* Input → DATA LAYER arrow */}
      <line
        x1="168" y1="158"
        x2="196" y2="164"
        stroke={selectedOp === "DATA_LAYER" ? "#A5D900" : "#B8B5AE"}
        strokeWidth="0.8"
        markerEnd={selectedOp === "DATA_LAYER" ? "url(#pilot-arrow-active)" : "url(#pilot-arrow)"}
      />

      {/* Connections between operators */}
      {connections.map(([from, to]) => {
        const fromOp = OPERATORS.find(o => o.id === from)!;
        const toOp = OPERATORS.find(o => o.id === to)!;
        const active = selectedOp === from || selectedOp === to;
        return (
          <line
            key={`${from}-${to}`}
            x1={fromOp.x + fromOp.w}
            y1={fromOp.y + fromOp.h / 2}
            x2={toOp.x}
            y2={toOp.y + toOp.h / 2}
            stroke={active ? "#A5D900" : "#B8B5AE"}
            strokeWidth="0.8"
            markerEnd={active ? "url(#pilot-arrow-active)" : "url(#pilot-arrow)"}
          />
        );
      })}

      {/* GRAPH_GEN → OUTPUTS arrow */}
      {(() => {
        const last = OPERATORS[OPERATORS.length - 1]!;
        const active = selectedOp === "GRAPH_GEN";
        return (
          <line
            x1={last.x + last.w}
            y1={last.y + last.h / 2}
            x2="810"
            y2="164"
            stroke={active ? "#A5D900" : "#B8B5AE"}
            strokeWidth="0.8"
            markerEnd={active ? "url(#pilot-arrow-active)" : "url(#pilot-arrow)"}
          />
        );
      })()}

      {/* Operator blocks */}
      {OPERATORS.map((op) => {
        const sel = selectedOp === op.id;
        return (
          <g
            key={op.id}
            onClick={() => onSelectOp(sel ? null : op.id)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-label={`Opérateur ${op.label}`}
            aria-pressed={sel}
          >
            {sel && (
              <rect x={op.x - 2} y={op.y - 2} width={op.w + 4} height={op.h + 4} fill="none" stroke="#A5D900" strokeWidth="1.5" />
            )}
            <rect
              x={op.x} y={op.y} width={op.w} height={op.h}
              fill={sel ? "#EFF5E6" : "#EFEFEF"}
              stroke={sel ? "#A5D900" : "#9A968E"}
              strokeWidth="1"
            />
            <rect
              x={op.x} y={op.y} width={op.w} height={18}
              fill={sel ? "#A5D900" : "#9A968E"}
            />
            <text x={op.x + 5} y={op.y + 12} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill={sel ? "#1E1D1B" : "#F0EEEB"} fontWeight="500" letterSpacing="0.08em">
              {op.code}
            </text>
            <text x={op.x + op.w / 2} y={op.y + 33} fontFamily="'JetBrains Mono', monospace" fontSize="8" fill={sel ? "#1E1D1B" : "#1C1C1A"} fontWeight="500" letterSpacing="0.05em" textAnchor="middle">
              {op.label}
            </text>
            <text x={op.x + op.w / 2} y={op.y + 48} fontFamily="'JetBrains Mono', monospace" fontSize="6.5" fill="#908E85" letterSpacing="0.03em" textAnchor="middle">
              {op.description}
            </text>
            <text x={op.x + op.w / 2} y={op.y + op.h + 14} fontFamily="'JetBrains Mono', monospace" fontSize="6" fill="#B8B5AE" letterSpacing="0.06em" textAnchor="middle">
              {op.code}
            </text>
          </g>
        );
      })}

      {/* OUTPUTS block */}
      <rect x="810" y="90" width="130" height="135" fill="#F0EEEB" stroke="#9A968E" strokeWidth="1" />
      <rect x="810" y="90" width="130" height="15" fill="#9A968E" />
      <text x="816" y="101" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#F0EEEB" letterSpacing="0.1em" fontWeight="500">
        OUTPUTS
      </text>
      {outputItems.map((item, i) => (
        <g key={item}>
          <rect x="818" y={113 + i * 34} width="114" height="26" fill="#F6F4F0" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x="875" y={130 + i * 34} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#1C1C1A" letterSpacing="0.04em" textAnchor="middle">
            {item}
          </text>
        </g>
      ))}

      {/* Click hint */}
      <text x="940" y="290" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" fill="#B8B5AE" letterSpacing="0.06em" textAnchor="end">
        Cliquer sur un opérateur pour les détails
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Operator Detail Panel
// ---------------------------------------------------------------------------

function OperatorPanel({
  op,
  onClose,
}: {
  op: PipelineOperator;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="border border-rule bg-warm-paper"
      role="complementary"
      aria-label={`Détails opérateur ${op.label}`}
    >
      <div className="flex items-center justify-between border-b border-rule bg-system-green px-5 py-3">
        <div>
          <span className="font-mono text-[11px] tracking-[0.14em] text-chrome block">{op.code}</span>
          <h3 className="font-mono text-sm font-medium tracking-widest text-architect-paper">{op.label}</h3>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-xs text-chrome-dark transition-colors hover:text-architect-paper"
          aria-label="Fermer le panneau"
        >
          [X]
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <p className="mb-1.5 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">Rôle</p>
          <p className="font-sans text-sm leading-relaxed text-ink/75">{op.role}</p>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">Entrées</p>
          <ul className="space-y-1">
            {op.inputs.map((inp) => (
              <li key={inp} className="flex items-center gap-2 font-mono text-xs text-ink/75">
                <span className="text-chrome-dark shrink-0">→</span>
                {inp}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">Sorties</p>
          <ul className="space-y-1">
            {op.outputs.map((out) => (
              <li key={out} className="flex items-center gap-2 font-mono text-xs text-ink/75">
                <span className="text-chrome-dark shrink-0">←</span>
                {out}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-sage uppercase">Aperçu sortie</p>
          <div className="border border-rule bg-architect-paper p-3">
            <p className="font-mono text-[11px] leading-relaxed text-steel">{op.preview}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper with scroll reveal
// ---------------------------------------------------------------------------

function SectionReveal({
  children,
  className = "",
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
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function PilotPage() {
  const [selectedOp, setSelectedOp] = useState<OperatorId | null>(null);
  const [activeTab, setActiveTab] = useState<LayerTabId>("TECHNIQUE");

  const selectedOperator = selectedOp ? OPERATORS.find(o => o.id === selectedOp) ?? null : null;
  const currentTab = LAYER_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen">

      {/* ================================================================ */}
      {/* SECTION 1 — AGENT HERO (dark bg-system-green)                   */}
      {/* ================================================================ */}
      <section
        className="relative min-h-screen bg-system-green blueprint-grid flex flex-col"
        aria-label="Présentation AG001 PILOT"
      >
        <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto px-8 lg:px-20 pt-40 pb-24 flex-1">

          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-green" />
            </span>
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-signal-green">ACTIF</span>
          </motion.div>

          {/* Agent code */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-chrome mb-4"
          >
            AG001
          </motion.span>

          {/* Agent name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="font-sans font-normal md:font-light text-architect-paper leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            PILOT
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="font-sans font-normal md:font-light text-architect-paper/70 max-w-xl leading-relaxed mb-12"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
          >
            Requêtez votre base de données en langage naturel. Analysez, explorez, décidez.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mb-14"
          >
            {["4 opérateurs", "2 variantes spécialisées", "< 5 jours de déploiement"].map((m) => (
              <div key={m} className="flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-[0.15em] text-chrome uppercase">—</span>
                <span className="font-mono text-sm text-architect-paper/80 tracking-widest">{m}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <a
              href="mailto:contact@lite-ops.com?subject=Démo PILOT AG001"
              className="group inline-flex items-center gap-3 border border-architect-paper/30 px-8 py-4 font-mono text-sm text-architect-paper/80 tracking-widest uppercase transition-all duration-300 hover:border-signal-green hover:text-signal-green hover:bg-signal-green/5"
            >
              Demander une démo
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-architect-paper/10 max-w-7xl mx-auto px-8 lg:px-20 w-full py-6 flex items-center justify-between">
          <span className="font-mono text-[11px] text-chrome tracking-widest">LITE OPS / AG001</span>
          <Link
            href="/operateurs"
            className="font-mono text-[11px] text-chrome-dark hover:text-architect-paper transition-colors tracking-widest uppercase"
          >
            Voir les opérateurs →
          </Link>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2 — PIPELINE                                             */}
      {/* ================================================================ */}
      <section
        className="bg-architect-paper blueprint-grid py-24 lg:py-32"
        aria-labelledby="pipeline-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-10">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">
              Pipeline de traitement
            </span>
            <h2
              id="pipeline-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Quatre opérateurs. Un flux continu.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            {/* SVG diagram */}
            <div className="border border-rule bg-warm-paper p-6 lg:p-10 mb-6">
              <PipelineDiagram selectedOp={selectedOp} onSelectOp={setSelectedOp} />
            </div>

            {/* Operator pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {OPERATORS.map(op => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelectedOp(prev => prev === op.id ? null : op.id)}
                  aria-pressed={selectedOp === op.id}
                  className={[
                    "font-mono text-[11px] tracking-[0.15em] px-3 py-1.5 border transition-all duration-200",
                    selectedOp === op.id
                      ? "border-signal-green-text bg-signal-green/10 text-signal-green-text"
                      : "border-chrome text-steel hover:border-chrome-dark hover:text-ink",
                  ].join(" ")}
                >
                  {op.code} {op.label}
                </button>
              ))}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              {selectedOperator ? (
                <OperatorPanel
                  key={selectedOperator.id}
                  op={selectedOperator}
                  onClose={() => setSelectedOp(null)}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-20 items-center justify-center border border-dashed border-rule"
                >
                  <p className="font-mono text-[11px] tracking-[0.1em] text-chrome">
                    Sélectionnez un opérateur pour voir les détails
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3 — OPERATORS DETAIL                                     */}
      {/* ================================================================ */}
      <section
        className="bg-warm-paper py-24 lg:py-32"
        aria-labelledby="operators-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">
              Les opérateurs
            </span>
            <h2
              id="operators-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Chaque brique, documentée.
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPERATORS.map((op, i) => (
              <SectionReveal key={op.id} delay={i * 0.08}>
                <div className="border border-rule bg-architect-paper p-8 hover:border-chrome-dark transition-colors duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] tracking-widest text-signal-green bg-system-green px-2 py-0.5">
                      {op.code}
                    </span>
                    <span className="font-mono text-xs text-steel tracking-widest">{op.label}</span>
                  </div>

                  <h3 className="font-sans font-light text-ink text-lg mb-2">{op.description}</h3>
                  <p className="font-sans text-sm leading-relaxed text-ink/70 mb-6">{op.role}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="font-mono text-[11px] tracking-widest text-chrome-dark uppercase mb-2">Entrées</p>
                      <ul className="space-y-1">
                        {op.inputs.map(inp => (
                          <li key={inp} className="font-mono text-[11px] text-steel flex items-start gap-1.5">
                            <span className="text-chrome-dark shrink-0 mt-0.5">→</span>
                            {inp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono text-[11px] tracking-widest text-chrome-dark uppercase mb-2">Sorties</p>
                      <ul className="space-y-1">
                        {op.outputs.map(out => (
                          <li key={out} className="font-mono text-[11px] text-steel flex items-start gap-1.5">
                            <span className="text-chrome-dark shrink-0 mt-0.5">←</span>
                            {out}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-rule pt-4">
                    <p className="font-mono text-[11px] tracking-widest text-chrome-dark uppercase mb-1">Aperçu</p>
                    <p className="font-mono text-[11px] text-steel leading-relaxed">{op.preview}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4 — LAYERS                                               */}
      {/* ================================================================ */}
      <section
        className="bg-architect-paper py-24 lg:py-32"
        aria-labelledby="layers-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">Expertise</span>
            <h2
              id="layers-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Trois couches d'intégration
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            {/* Tab switcher */}
            <div className="flex flex-wrap gap-0 border border-rule mb-8">
              {LAYER_TABS.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={activeTab === tab.id}
                  className={[
                    "flex-1 px-6 py-4 font-mono text-xs tracking-widest uppercase text-left border-r border-rule last:border-r-0 transition-all duration-200",
                    activeTab === tab.id
                      ? "bg-system-green text-architect-paper"
                      : "bg-warm-paper text-steel hover:bg-fog hover:text-ink",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                <div>
                  <p className="font-sans leading-relaxed text-ink/75 mb-8">
                    {currentTab.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentTab.annotations.map((ann, i) => (
                    <div key={i} className="border border-rule bg-fog px-4 py-3">
                      <span className="font-mono text-[11px] tracking-widest text-chrome-dark block mb-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-mono text-[11px] text-ink/70 leading-relaxed">{ann}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </SectionReveal>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 5 — SCREENSHOTS                                          */}
      {/* ================================================================ */}
      <section
        className="bg-fog py-24 lg:py-32"
        aria-labelledby="screenshots-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">Aperçu produit</span>
            <h2
              id="screenshots-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Le produit, en contexte.
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SCREENSHOTS.map((shot, i) => (
              <SectionReveal key={shot.src} delay={i * 0.1}>
                {/* Browser chrome mock */}
                <div className="border border-rule overflow-hidden">
                  {/* Browser bar */}
                  <div className="bg-system-green flex items-center gap-2 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="flex-1 mx-4 h-4 bg-architect-paper/10 rounded-none border border-architect-paper/10 font-mono text-[11px] text-chrome-light text-center leading-4 tracking-wider">
                      pilot.liteops.fr
                    </span>
                  </div>
                  {/* Screenshot */}
                  <div className="relative aspect-[16/10] bg-warm-paper">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <p className="mt-3 font-mono text-[11px] tracking-widest text-steel uppercase">
                  — {shot.caption}
                </p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 6 — SPECIALISTS                                          */}
      {/* ================================================================ */}
      <section
        className="bg-warm-paper py-24 lg:py-32"
        aria-labelledby="specialists-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">Variantes</span>
            <h2
              id="specialists-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Pour chaque contexte.
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SPECIALISTS.map((spec, i) => (
              <SectionReveal key={spec.code} delay={i * 0.1}>
                <div className="border border-rule bg-architect-paper p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-[11px] tracking-widest text-signal-green bg-system-green px-2 py-0.5">
                      {spec.code}
                    </span>
                  </div>

                  <h3
                    className="font-sans font-light text-system-green mb-1"
                    style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.4rem)" }}
                  >
                    {spec.name}
                  </h3>
                  <p className="font-mono text-xs text-chrome-dark tracking-widest uppercase mb-4">{spec.tagline}</p>
                  <p className="font-sans text-sm leading-relaxed text-ink/75 mb-6">{spec.description}</p>

                  <div className="border-t border-rule pt-6">
                    <p className="font-mono text-[11px] tracking-widest text-chrome-dark uppercase mb-3">Cas d'usage</p>
                    <ul className="space-y-2">
                      {spec.uses.map(use => (
                        <li key={use} className="flex items-start gap-2 font-mono text-[11px] text-ink/75">
                          <span className="text-chrome-dark shrink-0 mt-0.5">—</span>
                          {use}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 7 — PRICING                                              */}
      {/* ================================================================ */}
      <section
        className="bg-architect-paper py-24 lg:py-32"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark">Tarification</span>
            <h2
              id="pricing-heading"
              className="mt-3 font-sans font-normal md:font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
            >
              Simple et transparent.
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <SectionReveal key={tier.code} delay={i * 0.1}>
                <div
                  className={[
                    "border p-8 h-full flex flex-col",
                    tier.highlight
                      ? "border-signal-green bg-signal-green/5"
                      : "border-rule bg-warm-paper",
                  ].join(" ")}
                >
                  {tier.highlight && (
                    <div className="mb-4">
                      <span className="font-mono text-[11px] tracking-widest text-signal-green-text uppercase border border-signal-green-text px-2 py-0.5">
                        Recommandé
                      </span>
                    </div>
                  )}

                  <span className="font-mono text-[11px] tracking-widest text-chrome-dark block mb-2">{tier.code}</span>
                  <h3 className="font-sans font-normal md:font-light text-system-green text-2xl mb-1">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span
                      className={[
                        "font-mono font-medium text-2xl",
                        tier.highlight ? "text-signal-green-text" : "text-ink",
                      ].join(" ")}
                    >
                      {tier.price}
                    </span>
                    {tier.unit && (
                      <span className="font-mono text-xs text-steel">{tier.unit}</span>
                    )}
                  </div>

                  <p className="font-sans text-sm text-ink/70 leading-relaxed mb-6">{tier.description}</p>

                  <div className="border-t border-rule pt-6 flex-1">
                    <ul className="space-y-2">
                      {tier.features.map(feat => (
                        <li key={feat} className="flex items-start gap-2 font-mono text-[11px] text-ink/75">
                          <span className="text-signal-green-text shrink-0 mt-0.5">✓</span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <a
                      href="mailto:contact@lite-ops.com?subject=PILOT - Offre {tier.name}"
                      className={[
                        "group inline-flex items-center gap-2 w-full justify-center border px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-200",
                        tier.highlight
                          ? "border-signal-green-text text-signal-green-text hover:bg-signal-green hover:text-system-green"
                          : "border-rule text-steel hover:border-chrome-dark hover:text-ink",
                      ].join(" ")}
                    >
                      Commencer
                      <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 8 — AGENT NAV                                            */}
      {/* ================================================================ */}
      <section
        className="bg-system-green blueprint-grid py-24 lg:py-32"
        aria-label="Autres agents"
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <SectionReveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome">Autres agents</span>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SAILOR */}
            <SectionReveal delay={0.05}>
              <Link
                href="/agents/sailor"
                className="group flex flex-col justify-between border border-architect-paper/30 p-8 hover:border-architect-paper/50 transition-all duration-300 min-h-[180px]"
              >
                <div>
                  <span className="font-mono text-[11px] tracking-widest text-chrome block mb-2">AG002</span>
                  <h3
                    className="font-sans font-normal md:font-light text-architect-paper mb-3"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
                  >
                    SAILOR
                  </h3>
                  <p className="font-mono text-xs text-chrome-light/70 leading-relaxed">
                    Transformez votre base documentaire en chatbot à sources citées.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs text-chrome-dark uppercase tracking-widest">
                  <span>Voir l'agent</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </Link>
            </SectionReveal>

            {/* MATCHMAKER */}
            <SectionReveal delay={0.1}>
              <Link
                href="/agents/matchmaker"
                className="group flex flex-col justify-between border border-architect-paper/30 p-8 hover:border-architect-paper/50 transition-all duration-300 min-h-[180px]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[11px] tracking-widest text-chrome">AG003</span>
                    <span className="font-mono text-[11px] tracking-widest text-steel border border-steel/40 px-1.5 py-0.5">EN DÉVELOPPEMENT</span>
                  </div>
                  <h3
                    className="font-sans font-normal md:font-light text-architect-paper mb-3"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
                  >
                    MATCHMAKER
                  </h3>
                  <p className="font-mono text-xs text-chrome-light/70 leading-relaxed">
                    Faites correspondre vos ressources aux besoins. Score radar expliqué.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-mono text-xs text-chrome-dark uppercase tracking-widest">
                  <span>Voir l'agent</span>
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

    </div>
  );
}
