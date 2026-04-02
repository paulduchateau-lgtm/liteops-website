"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OperatorId = "DATA_LAYER" | "OCR" | "DOC_UNDERSTANDING" | "EMBEDDING_RAG" | "LLM";
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
    description: "Ingestion documentaire",
    role: "Connecteur multi-format — ingère tout type de document (PDF, DOCX, HTML, images), normalise, déduplique, versionne.",
    inputs: [
      "PDF, DOCX, XLSX, HTML, TXT",
      "Images (PNG, JPG)",
      "URLs et pages web",
    ],
    outputs: [
      "Texte structuré extrait",
      "Métadonnées préservées",
      "Corpus versionné",
    ],
    preview: "847 documents ingérés. 0 doublons. Version: 2026-03-28T09:14Z",
    x: 80, y: 130, w: 130, h: 68,
  },
  {
    id: "OCR",
    code: "OP-02",
    label: "OCR",
    description: "Extraction texte — docs scannés",
    role: "Tesseract 5 + modèles spécialisés. Post-correction LLM. Score de confiance par bloc. Support tableaux multi-colonnes.",
    inputs: [
      "Documents scannés (PDF)",
      "Images (photos, fax, captures)",
    ],
    outputs: [
      "Texte extrait avec score confiance",
      "Blocs structurés (titres, tableaux, listes)",
    ],
    preview: "OCR confiance: 97.3 %. Post-correction appliquée sur 12 blocs. 0 erreurs résiduelles.",
    x: 240, y: 130, w: 130, h: 68,
  },
  {
    id: "DOC_UNDERSTANDING",
    code: "OP-03",
    label: "DOC UNDERSTANDING",
    description: "Compréhension sémantique",
    role: "Détecte la structure des documents (titres, sections, annexes), extrait les tableaux, identifie les relations inter-documents.",
    inputs: [
      "Texte normalisé",
      "Métadonnées format",
    ],
    outputs: [
      "Arborescence documentaire",
      "Tableaux extraits structurés",
      "Graph de relations inter-docs",
    ],
    preview: "Structure détectée: 4 niveaux, 23 sections, 7 tableaux, 3 références croisées.",
    x: 400, y: 130, w: 130, h: 68,
  },
  {
    id: "EMBEDDING_RAG",
    code: "OP-04",
    label: "EMBEDDING + RAG",
    description: "Indexation sémantique & retrieval",
    role: "Embeddings multilingues (FR/EN), hybrid search dense + sparse, reranking contextuel, filtrage par metadata. Top-k avec score de pertinence.",
    inputs: [
      "Corpus indexé",
      "Question utilisateur",
      "Filtres metadata",
    ],
    outputs: [
      "Top-k extraits pertinents",
      "Scores de pertinence",
      "Sources avec numéro de page",
    ],
    preview: "Retrieval: 5/847 docs. Score max: 0.94. Latence: 180 ms.",
    x: 560, y: 130, w: 130, h: 68,
  },
  {
    id: "LLM",
    code: "OP-05",
    label: "LLM",
    description: "Génération contrainte & sourcée",
    role: "Génération de réponses strictement ancrée au corpus. Citations avec numéro de page. Refus explicite si hors corpus. Verbatim à la demande.",
    inputs: [
      "Top-k extraits",
      "Question originale",
      "Historique conversation",
    ],
    outputs: [
      "Réponse sourcée avec citations",
      "Verbatim extrait",
      "Refus documenté si hors corpus",
    ],
    preview: 'Réponse: "Selon §3.2 (page 12): la procédure exige 48h de délai minimum." [Source: RH-2024-V3.pdf]',
    x: 720, y: 130, w: 130, h: 68,
  },
];

const LAYER_TABS: LayerTab[] = [
  {
    id: "TECHNIQUE",
    label: "Technique",
    description: "Pipeline RAG complet — Data Layer, OCR, Doc Understanding, semantic search, génération contrainte. Hybrid search dense + sparse. Embeddings multilingues. Zéro hallucination par conception architecturale.",
    annotations: [
      "Connecteurs: PDF, DOCX, HTML, images, URLs",
      "OCR: Tesseract 5 + post-correction LLM",
      "Embeddings multilingues FR/EN",
      "Mistral / Qwen local ou GPT-4o SaaS",
    ],
  },
  {
    id: "METIER",
    label: "Métier",
    description: "Calibré pour l'acquisition commerciale et la gestion documentaire interne. Comprend votre offre, vos procédures, vos produits. Vos équipes et prospects obtiennent des réponses précises en secondes.",
    annotations: [
      "Ontologie commerciale intégrée",
      "Vocabulaire procédures RH et conformité",
      "Qualif prospect par la documentation",
      "Réponse en langage du métier",
    ],
  },
  {
    id: "ADAPTATION",
    label: "Adaptation",
    description: "Déploiement en 5 jours. Ingestion de votre corpus existant, calibration des seuils de confiance, test de couverture. Mise à jour incrémentale sans ré-indexation complète.",
    annotations: [
      "Ingestion corpus existant (< 2h)",
      "Calibration seuils de confiance",
      "Test de couverture documentaire",
      "Mise à jour incrémentale",
    ],
  },
];

const SPECIALISTS: Specialist[] = [
  {
    code: "SA-01",
    name: "Sailor Acquisition — Navigation commerciale",
    tagline: "Qualification prospect par la documentation",
    description: "Vos prospects naviguent dans vos offres, tarifs et propositions en langage naturel. Qualification automatique par la documentation.",
    uses: [
      "Fiches produit et tarifs accessibles en NL",
      "Questions/réponses sur conditions commerciales",
      "Synthèse de propositions à la demande",
      "Qualification prospect par le document",
    ],
  },
  {
    code: "SA-02",
    name: "Sailor Process — Navigation opérationnelle",
    tagline: "Conformité et onboarding documentaire",
    description: "Procédures, règlements, modes opératoires — tout accessible en une question. Conformité et onboarding facilitées.",
    uses: [
      "Procédures RH et règlements intérieurs",
      "Modes opératoires techniques et sécurité",
      "Documentation réglementaire et conformité",
      "Onboarding par le corpus interne",
    ],
  },
];

const PRICING_TIERS: PricingTier[] = [
  {
    code: "SA-STARTER",
    name: "Starter",
    price: "390€",
    unit: "/mois",
    description: "Corpus jusqu'à 500 documents. 1 chatbot. ZDR.",
    features: [
      "500 documents max",
      "1 interface chatbot",
      "Citations avec source et page",
      "Mise à jour hebdomadaire",
      "Support email",
    ],
    highlight: false,
  },
  {
    code: "SA-PRO",
    name: "Pro",
    price: "890€",
    unit: "/mois",
    description: "Corpus illimité. Multi-chatbots. API & Webhooks.",
    features: [
      "Documents illimités",
      "Multi-chatbots par segment",
      "API REST + Webhooks",
      "Mise à jour temps réel",
      "Rapports de couverture",
      "Support prioritaire",
    ],
    highlight: true,
  },
  {
    code: "SA-DEPLOY",
    name: "Local Deploy",
    price: "Sur devis",
    unit: "",
    description: "On-premise. Modèles locaux. Zéro transit réseau.",
    features: [
      "Modèles Mistral 3B / Qwen",
      "Données jamais hors site",
      "Air-gap total possible",
      "Audit de sécurité inclus",
      "SLA personnalisé",
    ],
    highlight: false,
  },
];

// ---------------------------------------------------------------------------
// SVG Pipeline Diagram
// ---------------------------------------------------------------------------

function SvgDefs() {
  return (
    <defs>
      <pattern id="sailor-grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212,208,200,0.2)" strokeWidth="0.8" />
      </pattern>
      <pattern id="sailor-grid-lg" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#sailor-grid-sm)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(212,208,200,0.4)" strokeWidth="0.8" />
      </pattern>
      <marker id="sailor-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L6,3.5 z" fill="#B8B5AE" />
      </marker>
      <marker id="sailor-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
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
  const inputItems = ["Documents", "Base documentaire", "Question NL"];
  const outputItems = ["Réponses sourcées", "Citations exactes", "Navigation docs"];

  const connections: [OperatorId, OperatorId][] = [
    ["DATA_LAYER", "OCR"],
    ["OCR", "DOC_UNDERSTANDING"],
    ["DOC_UNDERSTANDING", "EMBEDDING_RAG"],
    ["EMBEDDING_RAG", "LLM"],
  ];

  return (
    <svg
      viewBox="0 0 960 300"
      className="w-full"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      aria-label="Diagramme pipeline AG002 SAILOR"
      role="img"
    >
      <SvgDefs />
      <rect width="960" height="300" fill="url(#sailor-grid-lg)" />

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
        LITE OPS / AG002-SAILOR / PIPELINE SCHEMA / REV.5
      </text>
      <text x="940" y="26" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill="#B8B5AE" letterSpacing="0.08em" textAnchor="end">
        2026-03-28
      </text>
      <line x1="20" y1="33" x2="940" y2="33" stroke="#CDC9C2" strokeWidth="0.8" />

      {/* Input nodes */}
      <text x="20" y="90" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#9A968E" letterSpacing="0.12em">INPUTS</text>
      {inputItems.map((item, i) => (
        <g key={item}>
          <rect x={20 + i * 140} y="98" width={item.length * 6 + 16} height="22" fill="#F6F4F0" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x={20 + i * 140 + 8} y="113" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#6B6B60" letterSpacing="0.06em">
            {item}
          </text>
        </g>
      ))}

      {/* Input flow arrows */}
      <line x1="60" y1="120" x2="115" y2="132" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />
      <line x1="200" y1="120" x2="175" y2="132" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />
      <line x1="440" y1="120" x2="530" y2="132" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />

      {/* Pipeline connections */}
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
            markerEnd={active ? "url(#sailor-arrow-active)" : "url(#sailor-arrow)"}
          />
        );
      })}

      {/* LLM → OUTPUTS arrow */}
      {(() => {
        const last = OPERATORS[OPERATORS.length - 1]!;
        const active = selectedOp === "LLM";
        return (
          <line
            x1={last.x + last.w}
            y1={last.y + last.h / 2}
            x2="900"
            y2="164"
            stroke={active ? "#A5D900" : "#B8B5AE"}
            strokeWidth="0.8"
            markerEnd={active ? "url(#sailor-arrow-active)" : "url(#sailor-arrow)"}
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
            <rect x={op.x} y={op.y} width={op.w} height={18} fill={sel ? "#A5D900" : "#9A968E"} />
            <text x={op.x + 5} y={op.y + 12} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill={sel ? "#2C2F26" : "#F0EEEB"} fontWeight="500" letterSpacing="0.08em">
              {op.code}
            </text>
            <text x={op.x + op.w / 2} y={op.y + 33} fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill={sel ? "#2C2F26" : "#1C1C1A"} fontWeight="500" letterSpacing="0.04em" textAnchor="middle">
              {op.label}
            </text>
            <text x={op.x + op.w / 2} y={op.y + 48} fontFamily="'JetBrains Mono', monospace" fontSize="6" fill="#908E85" letterSpacing="0.03em" textAnchor="middle">
              {op.description}
            </text>
            <text x={op.x + op.w / 2} y={op.y + op.h + 14} fontFamily="'JetBrains Mono', monospace" fontSize="6" fill="#B8B5AE" letterSpacing="0.06em" textAnchor="middle">
              {op.code}
            </text>
          </g>
        );
      })}

      {/* Output nodes */}
      <text x="20" y="252" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#9A968E" letterSpacing="0.12em">OUTPUTS</text>
      {outputItems.map((item, i) => (
        <g key={item}>
          <rect x={20 + i * 200} y="258" width={item.length * 6 + 16} height="22" fill="#EFF5E6" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x={20 + i * 200 + 8} y="273" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#6B6B60" letterSpacing="0.06em">
            {item}
          </text>
        </g>
      ))}

      {/* Output flow arrows */}
      <line x1="145" y1="198" x2="60" y2="256" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />
      <line x1="625" y1="198" x2="265" y2="256" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />
      <line x1="850" y1="164" x2="465" y2="256" stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#sailor-arrow)" />

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
// Scroll reveal wrapper
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
// Page
// ---------------------------------------------------------------------------

export default function SailorPage() {
  const [selectedOp, setSelectedOp] = useState<OperatorId | null>(null);
  const [activeTab, setActiveTab] = useState<LayerTabId>("TECHNIQUE");

  const selectedOperator = selectedOp ? OPERATORS.find(o => o.id === selectedOp) ?? null : null;
  const currentTab = LAYER_TABS.find(t => t.id === activeTab)!;

  return (
    <div className="min-h-screen">

      {/* ================================================================ */}
      {/* SECTION 1 — AGENT HERO                                           */}
      {/* ================================================================ */}
      <section
        className="relative min-h-screen bg-system-green blueprint-grid flex flex-col"
        aria-label="Présentation AG002 SAILOR"
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
            AG002
          </motion.span>

          {/* Agent name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="font-sans font-normal md:font-light text-architect-paper leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            SAILOR
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="font-sans font-normal md:font-light text-architect-paper/70 max-w-xl leading-relaxed mb-12"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
          >
            Transformez votre base documentaire en chatbot à sources citées. Zéro hallucination.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mb-14"
          >
            {["5 opérateurs", "2 variantes spécialisées", "< 5 jours de déploiement"].map((m) => (
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
              href="mailto:contact@lite-ops.com?subject=Démo SAILOR AG002"
              className="group inline-flex items-center gap-3 border border-architect-paper/30 px-8 py-4 font-mono text-sm text-architect-paper/80 tracking-widest uppercase transition-all duration-300 hover:border-signal-green hover:text-signal-green hover:bg-signal-green/5"
            >
              Demander une démo
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-architect-paper/10 max-w-7xl mx-auto px-8 lg:px-20 w-full py-6 flex items-center justify-between">
          <span className="font-mono text-[11px] text-chrome tracking-widest">LITE OPS / AG002</span>
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
              Cinq opérateurs. Zéro hallucination.
            </h2>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="border border-rule bg-warm-paper p-6 lg:p-10 mb-6">
              <PipelineDiagram selectedOp={selectedOp} onSelectOp={setSelectedOp} />
            </div>

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
      {/* SECTION 5 — SCREENSHOTS (placeholders)                           */}
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
            {[
              {
                src: "/photos/premium_photo-1728882427558-ea1bef1ba75b.avif",
                alt: "Désert ambré — chaleur et profondeur",
                caption: "Interface en cours de finalisation",
              },
              {
                src: "/photos/photo-1651936020104-60665f796d7b.avif",
                alt: "Désert vaste — horizon et clarté",
                caption: "Interface en cours de finalisation",
              },
            ].map((shot, i) => (
              <SectionReveal key={shot.src} delay={i * 0.1}>
                <div className="border border-rule overflow-hidden">
                  <div className="bg-system-green flex items-center gap-2 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                    <span className="flex-1 mx-4 h-4 bg-architect-paper/15 border border-architect-paper/10 font-mono text-[11px] text-chrome-light text-center leading-4 tracking-wider">
                      sailor.liteops.fr
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] bg-warm-paper">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      className="object-cover grayscale opacity-60"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-system-green/80 backdrop-blur-sm px-6 py-3 border border-architect-paper/30">
                        <p className="font-mono text-xs text-chrome-light tracking-widest text-center">Interface en cours de finalisation</p>
                      </div>
                    </div>
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
                      href="mailto:contact@lite-ops.com?subject=SAILOR - Demande tarif"
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
            {/* PILOT */}
            <SectionReveal delay={0.05}>
              <Link
                href="/agents/pilot"
                className="group flex flex-col justify-between border border-architect-paper/30 p-8 hover:border-architect-paper/50 transition-all duration-300 min-h-[180px]"
              >
                <div>
                  <span className="font-mono text-[11px] tracking-widest text-chrome block mb-2">AG001</span>
                  <h3
                    className="font-sans font-normal md:font-light text-architect-paper mb-3"
                    style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.5rem)" }}
                  >
                    PILOT
                  </h3>
                  <p className="font-mono text-xs text-chrome-light/70 leading-relaxed">
                    Requêtez votre base de données en langage naturel.
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
