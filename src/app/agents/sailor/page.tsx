"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OperatorId = "data-layer" | "ocr" | "doc-understanding" | "rag" | "llm";
type LayerId = "technical" | "business" | "adaptation";
type SpecialistId = "acquisition" | "process";

interface Operator {
  id: OperatorId;
  label: string;
  x: number;
  y: number;
  description: string;
  technical: string;
  details: string[];
}

interface Layer {
  id: LayerId;
  label: string;
  description: string;
  color: string;
}

interface Specialist {
  id: SpecialistId;
  code: string;
  name: string;
  tagline: string;
  description: string;
  useCases: string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const OPERATORS: Operator[] = [
  {
    id: "data-layer",
    label: "DATA LAYER",
    x: 80,
    y: 120,
    description: "Ingestion et indexation de la base documentaire",
    technical: "Connecteurs PDF, DOCX, HTML, images. Chunking adaptatif. Vector store persistant.",
    details: [
      "Formats: PDF, DOCX, XLSX, HTML, TXT, images",
      "Chunking sémantique par section",
      "Déduplication et versionning",
      "Metadata preservation",
    ],
  },
  {
    id: "ocr",
    label: "OCR",
    x: 230,
    y: 120,
    description: "Extraction de texte depuis documents scannés et images",
    technical: "Tesseract + modèles spécialisés. Post-correction LLM. Confidence scoring.",
    details: [
      "Tesseract 5 + modèles custom",
      "Post-correction par LLM leger",
      "Score de confiance par bloc",
      "Support multi-colonnes et tableaux",
    ],
  },
  {
    id: "doc-understanding",
    label: "DOC UNDERSTANDING",
    x: 400,
    y: 120,
    description: "Compréhension sémantique de la structure documentaire",
    technical: "Détection de structure: titres, paragraphes, tableaux, annexes. Graph de relations inter-documents.",
    details: [
      "Détection hiérarchique des sections",
      "Extraction de tableaux et listes",
      "Relations inter-documents",
      "Classification automatique",
    ],
  },
  {
    id: "rag",
    label: "RAG",
    x: 570,
    y: 120,
    description: "Retrieval Augmented Generation — recherche semantique precise",
    technical: "Embeddings bilingues. Reranking contextuel. Hybrid search (dense + sparse). Top-k filtering.",
    details: [
      "Embeddings multilingues (FR/EN)",
      "Hybrid search dense + sparse",
      "Reranking par pertinence contextuelle",
      "Filtrages par metadata",
    ],
  },
  {
    id: "llm",
    label: "LLM",
    x: 720,
    y: 120,
    description: "Génération de réponses sourcées avec citations exactes",
    technical: "Mistral / Qwen local ou GPT-4o SaaS. Prompt engineering contraint. Refus systématique hors corpus.",
    details: [
      "Génération contrainte au corpus",
      "Citations avec numéro de page",
      "Refus explicite si hors corpus",
      "Verbatim extrait à la demande",
    ],
  },
];

const LAYERS: Layer[] = [
  {
    id: "technical",
    label: "Technique",
    description:
      "Pipeline RAG complet — Data Layer, OCR, Doc Understanding, semantic search, génération contrainte. Chaque réponse est ancrée dans le corpus. Aucune hallucination tolérable.",
    color: "text-ink",
  },
  {
    id: "business",
    label: "Business",
    description:
      "Calibré pour l'acquisition de prospects — comprend votre offre et votre marché. Vos commerciaux et vos prospects obtiennent des réponses précisées en quelques secondes, sans chercher dans des dossiers.",
    color: "text-ink",
  },
  {
    id: "adaptation",
    label: "Adaptation",
    description:
      "Déploiement en 5 jours. Ingestion de votre corpus existant, calibration des seuils de confiance, test de couverture documentaire. Mise à jour incrémentale sans ré-indexation complète.",
    color: "text-ink",
  },
];

const SPECIALISTS: Specialist[] = [
  {
    id: "acquisition",
    code: "SA-01",
    name: "Sailor Acquisition",
    tagline: "Navigation commerciale documentaire",
    description:
      "Navigation dans vos documents commerciaux. Vos prospects comprennent directement via chatbot ce que vous leur apporterez.",
    useCases: [
      "Fiches produit et tarifs accessibles en langage naturel",
      "Questions-réponses sur vos offres et conditions",
      "Synthese de propositions commerciales a la demande",
      "Qualification prospect par le document",
    ],
  },
  {
    id: "process",
    code: "SA-02",
    name: "Sailor Process / Gestion",
    tagline: "Navigation opérationnelle interne",
    description:
      "Navigation dans la documentation process pour équipes de gestion. Procédures, règlements, modes opératoires — tout accessible en une question.",
    useCases: [
      "Procédures RH et règlements intérieurs",
      "Modes opératoires techniques et de sécurité",
      "Conformité et documentation réglementaire",
      "Onboarding par le corpus interne",
    ],
  },
];

const PRICING_TIERS = [
  {
    code: "SA-STARTER",
    name: "Starter",
    price: "390",
    unit: "/ mois",
    description: "Corpus jusqu'à 500 documents. 1 chatbot. Hébergement SaaS ZDR.",
    features: [
      "Jusqu'à 500 documents indexés",
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
    price: "890",
    unit: "/ mois",
    description: "Corpus illimité. Multi-chatbots. Webhook et API.",
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
    description: "Installation sur site. Modèles locaux. Zéro réseau.",
    features: [
      "Modèles Mistral 3B / Qwen 3.5",
      "Données jamais hors site",
      "Air-gap complet possible",
      "Audit de sécurité inclus",
      "SLA personnalise",
    ],
    highlight: false,
  },
];

// ---------------------------------------------------------------------------
// SVG Pipeline Diagram
// ---------------------------------------------------------------------------

function PipelineDiagram({
  selectedOperator,
  onSelectOperator,
}: {
  selectedOperator: OperatorId | null;
  onSelectOperator: (id: OperatorId | null) => void;
}) {
  const inputNodes = [
    { label: "Documents", x: 60, y: 30 },
    { label: "Base documentaire", x: 200, y: 30 },
    { label: "Question NL", x: 360, y: 30 },
  ];

  const outputNodes = [
    { label: "Réponses sourcées", x: 80, y: 240 },
    { label: "Citations exactes", x: 260, y: 240 },
    { label: "Navigation documentaire", x: 480, y: 240 },
  ];

  return (
    <svg
      viewBox="0 0 820 280"
      className="w-full"
      aria-label="Pipeline Sailor — schéma de traitement documentaire"
      role="img"
    >
      {/* Blueprint grid */}
      <defs>
        <pattern id="sailor-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(212,208,200,0.25)"
            strokeWidth="0.5"
          />
        </pattern>
        {/* Default arrow — chrome */}
        <marker id="sailor-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="rgba(184,181,174,0.8)" />
        </marker>
        {/* Active arrow — signal-green */}
        <marker id="sailor-arrow-green" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#A5D900" />
        </marker>
      </defs>

      {/* Grid background */}
      <rect width="820" height="280" fill="url(#sailor-grid)" />
      <rect width="820" height="280" fill="rgba(239,245,230,0.04)" />

      {/* Section labels */}
      <text x="12" y="14" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(154,150,142,0.8)" letterSpacing="0.15em">
        INPUTS
      </text>
      <text x="12" y="212" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="rgba(154,150,142,0.8)" letterSpacing="0.15em">
        OUTPUTS
      </text>

      {/* Input nodes */}
      {inputNodes.map((node) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y={node.y}
            width={node.label.length * 6.2 + 16}
            height={20}
            fill="rgba(239,245,230,0.6)"
            stroke="rgba(205,201,194,0.8)"
            strokeWidth="0.8"
          />
          <text
            x={node.x + 8}
            y={node.y + 13}
            fontFamily="JetBrains Mono, monospace"
            fontSize="7.5"
            fill="rgba(154,150,142,1)"
            letterSpacing="0.08em"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Input flow lines to operator row — chrome default */}
      <line x1="80" y1="50" x2="80" y2="88" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />
      <line x1="220" y1="50" x2="220" y2="88" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />
      <line x1="380" y1="50" x2="380" y2="88" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />

      {/* Main pipeline line */}
      <line x1="30" y1="130" x2="790" y2="130" stroke="rgba(205,201,194,0.5)" strokeWidth="0.8" strokeDasharray="4 4" />

      {/* Operator nodes */}
      {OPERATORS.map((op, i) => {
        const isSelected = selectedOperator === op.id;
        const boxWidth = 110;
        const boxHeight = 32;

        return (
          <g
            key={op.id}
            onClick={() => onSelectOperator(isSelected ? null : op.id)}
            style={{ cursor: "pointer" }}
            role="button"
            aria-pressed={isSelected}
            aria-label={`Opérateur ${op.label}`}
          >
            {/* Connector arrows between operators */}
            {i < OPERATORS.length - 1 && (
              <line
                x1={op.x + boxWidth}
                y1={op.y + boxHeight / 2}
                x2={OPERATORS[i + 1].x}
                y2={OPERATORS[i + 1].y + boxHeight / 2}
                stroke={isSelected ? "#A5D900" : "rgba(184,181,174,0.7)"}
                strokeWidth="0.8"
                markerEnd={isSelected ? "url(#sailor-arrow-green)" : "url(#sailor-arrow)"}
              />
            )}

            {/* Operator box */}
            <rect
              x={op.x}
              y={op.y}
              width={boxWidth}
              height={boxHeight}
              fill={isSelected ? "rgba(165,217,0,0.12)" : "rgba(239,239,239,0.85)"}
              stroke={isSelected ? "#A5D900" : "rgba(205,201,194,0.9)"}
              strokeWidth={isSelected ? 1.2 : 0.8}
            />

            {/* Corner mark */}
            <rect
              x={op.x}
              y={op.y}
              width={4}
              height={4}
              fill={isSelected ? "#A5D900" : "rgba(154,150,142,0.5)"}
            />

            <text
              x={op.x + boxWidth / 2}
              y={op.y + 13}
              fontFamily="JetBrains Mono, monospace"
              fontSize="7"
              fill={isSelected ? "#2F3427" : "rgba(154,150,142,1)"}
              textAnchor="middle"
              letterSpacing="0.12em"
              fontWeight={isSelected ? "500" : "400"}
            >
              {op.label}
            </text>

            {/* Index number */}
            <text
              x={op.x + boxWidth - 6}
              y={op.y + boxHeight - 5}
              fontFamily="JetBrains Mono, monospace"
              fontSize="6"
              fill="rgba(184,181,174,0.7)"
              textAnchor="end"
            >
              {String(i + 1).padStart(2, "0")}
            </text>
          </g>
        );
      })}

      {/* Output flow lines from operator row — chrome default */}
      <line x1="135" y1="152" x2="105" y2="220" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />
      <line x1="455" y1="152" x2="280" y2="220" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />
      <line x1="775" y1="152" x2="545" y2="220" stroke="rgba(184,181,174,0.6)" strokeWidth="0.8" markerEnd="url(#sailor-arrow)" />

      {/* Output nodes */}
      {outputNodes.map((node) => (
        <g key={node.label}>
          <rect
            x={node.x}
            y={node.y}
            width={node.label.length * 6.2 + 16}
            height={20}
            fill="rgba(239,245,230,0.5)"
            stroke="rgba(205,201,194,0.7)"
            strokeWidth="0.8"
          />
          <text
            x={node.x + 8}
            y={node.y + 13}
            fontFamily="JetBrains Mono, monospace"
            fontSize="7.5"
            fill="rgba(154,150,142,1)"
            letterSpacing="0.08em"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Click hint */}
      <text x="808" y="274" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="rgba(184,181,174,0.6)" textAnchor="end">
        CLIQUER UN OPÉRATEUR
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Operator Detail Panel
// ---------------------------------------------------------------------------

function OperatorDetailPanel({ operator }: { operator: Operator }) {
  return (
    <motion.div
      key={operator.id}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="border border-chrome-light/60 bg-warm-paper p-6 lg:p-8"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-steel mb-1">OPÉRATEUR</p>
          <h3 className="font-mono text-sm font-medium text-ink tracking-widest">
            {operator.label}
          </h3>
        </div>
        <span className="font-mono text-[10px] text-signal-green bg-system-green px-2 py-0.5">
          ● ACTIF
        </span>
      </div>

      <p className="font-sans text-sm text-ink/65 mb-3 leading-relaxed">
        {operator.description}
      </p>

      <p className="font-mono text-[10px] text-steel mb-4 leading-relaxed">
        {operator.technical}
      </p>

      <div className="border-t border-chrome-light/60 pt-4">
        <p className="font-mono text-[9px] tracking-[0.15em] text-steel mb-2">
          SPECIFICATIONS
        </p>
        <ul className="space-y-1.5">
          {operator.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2">
              <span className="font-mono text-chrome-dark text-[10px] mt-0.5 shrink-0">—</span>
              <span className="font-mono text-[10px] text-ink/65">{detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Layer Toggle
// ---------------------------------------------------------------------------

function LayerToggle({
  layers,
  active,
  onToggle,
}: {
  layers: Layer[];
  active: LayerId | null;
  onToggle: (id: LayerId) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {layers.map((layer) => (
        <button
          key={layer.id}
          type="button"
          onClick={() => onToggle(layer.id)}
          aria-pressed={active === layer.id}
          className={[
            "font-mono text-[10px] tracking-[0.15em] uppercase px-4 py-2",
            "border transition-all duration-200",
            active === layer.id
              ? "border-signal-green text-signal-green bg-signal-green/10"
              : "border-chrome text-steel hover:border-chrome-dark hover:text-ink",
          ].join(" ")}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section divider
// ---------------------------------------------------------------------------

function SectionLabel({ code, label }: { code: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="font-mono text-[10px] tracking-[0.2em] text-chrome font-mono">{code}</span>
      <div className="flex-1 h-px bg-chrome-light" />
      <span className="font-mono text-[10px] tracking-[0.18em] text-steel uppercase">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function SailorPage() {
  const [selectedOperator, setSelectedOperator] = useState<OperatorId | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);
  const [activeSpecialist, setActiveSpecialist] = useState<SpecialistId>("acquisition");

  const currentLayer = LAYERS.find((l) => l.id === activeLayer) ?? null;
  const currentOperator = OPERATORS.find((op) => op.id === selectedOperator) ?? null;

  function handleLayerToggle(id: LayerId) {
    setActiveLayer((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-architect-paper pt-28 lg:pt-32">

      {/* ------------------------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------------------------ */}
      <header className="border-b border-chrome-light/40 bg-warm-paper">
        <div className="mx-auto max-w-7xl px-8 lg:px-20">

          {/* Breadcrumb */}
          <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 py-4 border-b border-chrome-light/40">
            <Link
              href="/"
              className="font-mono text-[10px] tracking-[0.15em] text-chrome-dark hover:text-ink transition-colors"
            >
              Accueil
            </Link>
            <span className="font-mono text-[10px] text-chrome">/</span>
            <Link
              href="/agents/pilot"
              className="font-mono text-[10px] tracking-[0.15em] text-chrome-dark hover:text-ink transition-colors"
            >
              Agents
            </Link>
            <span className="font-mono text-[10px] text-chrome">/</span>
            <span className="font-mono text-[10px] tracking-[0.15em] text-ink">Sailor</span>
          </nav>

          <div className="py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* Left — Identity */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Code tag */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-steel">AG002</span>
                  <div className="h-px w-8 bg-chrome-light" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-steel">AGENT</span>
                </div>

                <h1 className="font-mono text-4xl lg:text-5xl font-medium tracking-[0.06em] text-ink mb-2">
                  SAILOR
                </h1>
                <p className="font-mono text-sm tracking-[0.14em] text-steel mb-6">
                  Assisted Document Navigation
                </p>

                {/* Status badge */}
                <div className="flex items-center gap-2 mb-8">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.18em] text-signal-green">
                    ACTIF
                  </span>
                </div>

                <p className="font-sans text-base leading-relaxed text-ink/65 max-w-md">
                  Sailor intègre votre base documentaire et vous permet de naviguer dedans via
                  un chatbot simple. Chaque réponse cite ses sources. Toujours.
                </p>
              </motion.div>

              {/* Right — Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src="/photos/photo-1566502877985-e4f1bcaf0ecc.avif"
                  alt="Navigation documentaire — interface Sailor"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Blueprint overlay */}
                <div className="absolute inset-0 blueprint-grid opacity-30 mix-blend-multiply" />
                {/* Corner marks */}
                <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-chrome/60" />
                <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-chrome/60" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-chrome/60" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-chrome/60" />
                {/* Overlay label */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-ink/80 px-3 py-1.5">
                  <span className="font-mono text-[9px] tracking-[0.18em] text-chrome-light">
                    SAILOR — DOCUMENT NAV
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main content */}
      {/* ------------------------------------------------------------------ */}
      <div className="mx-auto max-w-7xl px-8 lg:px-20 py-20 space-y-0">

        {/* ================================================================ */}
        {/* ZONE 1 — PIPELINE DIAGRAM */}
        {/* ================================================================ */}
        <section aria-labelledby="schema-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-01" label="Schema Pipeline" />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

            {/* Diagram */}
            <div className="xl:col-span-2">
              <div className="border border-chrome-light/60 bg-warm-paper p-8 lg:p-12 blueprint-grid relative overflow-hidden">
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-chrome/60" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-chrome/60" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-chrome/60" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-chrome/60" />

                <PipelineDiagram
                  selectedOperator={selectedOperator}
                  onSelectOperator={setSelectedOperator}
                />
              </div>

              {/* Operator pill list */}
              <div className="flex flex-wrap gap-2 mt-4">
                {OPERATORS.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() =>
                      setSelectedOperator((prev) => (prev === op.id ? null : op.id))
                    }
                    aria-pressed={selectedOperator === op.id}
                    className={[
                      "font-mono text-[9px] tracking-[0.15em] px-3 py-1.5 border transition-all duration-200",
                      selectedOperator === op.id
                        ? "border-signal-green bg-signal-green/10 text-signal-green"
                        : "border-chrome text-steel hover:border-chrome-dark hover:text-ink",
                    ].join(" ")}
                  >
                    {op.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {currentOperator ? (
                  <OperatorDetailPanel key={currentOperator.id} operator={currentOperator} />
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-chrome-light/60 border-dashed p-6 h-full flex flex-col justify-center items-center text-center"
                  >
                    <p className="font-mono text-[10px] tracking-[0.15em] text-steel mb-2">
                      DETAIL OPÉRATEUR
                    </p>
                    <p className="font-sans text-sm text-ink/65">
                      Sélectionnez un opérateur dans le schéma pour voir ses spécifications.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ZONE 2 — OPERATOR DETAILS (inline doc) */}
        {/* ================================================================ */}
        <section aria-labelledby="operators-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-02" label="Reference Operateurs" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-px bg-chrome-light/40">
            {OPERATORS.map((op, i) => (
              <motion.button
                key={op.id}
                type="button"
                onClick={() =>
                  setSelectedOperator((prev) => (prev === op.id ? null : op.id))
                }
                aria-pressed={selectedOperator === op.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  "group text-left p-5 transition-colors duration-200",
                  selectedOperator === op.id
                    ? "bg-signal-green/10"
                    : "bg-warm-paper hover:bg-fog",
                ].join(" ")}
              >
                <p
                  className={[
                    "font-mono text-[9px] tracking-[0.18em] mb-3",
                    selectedOperator === op.id ? "text-signal-green" : "text-steel",
                  ].join(" ")}
                >
                  {String(i + 1).padStart(2, "0")} / {OPERATORS.length.toString().padStart(2, "0")}
                </p>
                <p
                  className={[
                    "font-mono text-[10px] tracking-[0.14em] font-medium mb-2",
                    selectedOperator === op.id ? "text-signal-green" : "text-ink",
                  ].join(" ")}
                >
                  {op.label}
                </p>
                <p
                  className={[
                    "font-sans text-xs leading-relaxed",
                    selectedOperator === op.id ? "text-signal-green/70" : "text-ink/65",
                  ].join(" ")}
                >
                  {op.description}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* ZONE 3 — LAYERS TOGGLE */}
        {/* ================================================================ */}
        <section aria-labelledby="layers-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-03" label="Couches de Lecture" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

            {/* Controls + description */}
            <div className="lg:col-span-2">
              <p className="font-sans text-sm text-ink/65 mb-6 leading-relaxed">
                Trois niveaux de lecture du même système. Sélectionnez une couche pour
                comprendre Sailor sous l'angle qui vous correspond.
              </p>

              <LayerToggle
                layers={LAYERS}
                active={activeLayer}
                onToggle={handleLayerToggle}
              />

              <AnimatePresence mode="wait">
                {currentLayer ? (
                  <motion.div
                    key={currentLayer.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="border border-chrome-light/60 bg-fog p-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[9px] tracking-[0.18em] text-steel uppercase">
                        Couche
                      </span>
                      <div className="h-px flex-1 bg-chrome-light" />
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink">
                        {currentLayer.label}
                      </span>
                    </div>
                    <p className="font-sans text-sm leading-relaxed text-ink/65">
                      {currentLayer.description}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="layer-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-chrome-light/40 border-dashed p-6"
                  >
                    <p className="font-sans text-sm text-ink/65 text-center">
                      Selectionnez une couche pour afficher sa description.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/photos/photo-1505521377774-103a8cc2f735.avif"
                alt="Documentation et navigation — Sailor"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-mono text-[9px] tracking-[0.15em] text-chrome-light mb-1">
                  DOCTRINE
                </p>
                <p className="font-sans text-xs text-chrome-light/80 leading-relaxed">
                  Chaque réponse est ancrée dans le corpus. Si la réponse n'est pas dans
                  les documents, Sailor le dit explicitement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ZONE 4 — SPECIALISTS */}
        {/* ================================================================ */}
        <section aria-labelledby="specialists-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-04" label="Specialistes" />

          {/* Tab selector */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {SPECIALISTS.map((sp) => (
              <button
                key={sp.id}
                type="button"
                onClick={() => setActiveSpecialist(sp.id)}
                aria-pressed={activeSpecialist === sp.id}
                className={[
                  "font-mono text-[10px] tracking-[0.15em] px-5 py-2.5 transition-all duration-200",
                  "border",
                  activeSpecialist === sp.id
                    ? "border-signal-green text-signal-green bg-signal-green/10"
                    : "border-chrome text-steel hover:border-chrome-dark hover:text-ink",
                ].join(" ")}
              >
                {sp.code}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {SPECIALISTS.filter((sp) => sp.id === activeSpecialist).map((sp) => (
              <motion.div
                key={sp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Info */}
                  <div className="border border-chrome-light/60 bg-warm-paper p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-steel mb-1">
                          {sp.code}
                        </p>
                        <h3 className="font-mono text-lg font-medium tracking-[0.08em] text-ink">
                          {sp.name}
                        </h3>
                        <p className="font-sans text-sm text-ink/65 mt-1">{sp.tagline}</p>
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.15em] text-signal-green bg-system-green px-2 py-1 shrink-0">
                        ● ACTIF
                      </span>
                    </div>

                    <p className="font-sans text-sm leading-relaxed text-ink/65 mb-6">
                      {sp.description}
                    </p>

                    <div className="border-t border-chrome-light/60 pt-5">
                      <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-3">
                        CAS D'USAGE
                      </p>
                      <ul className="space-y-2">
                        {sp.useCases.map((uc) => (
                          <li key={uc} className="flex items-start gap-3">
                            <span className="font-mono text-steel text-xs mt-0.5 shrink-0 hover:text-ink transition-colors">
                              →
                            </span>
                            <span className="font-sans text-sm text-ink/65">{uc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Metrics / specs */}
                  <div className="space-y-4">
                    <div className="border border-chrome-light/60 bg-warm-paper p-6">
                      <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-4">
                        METRIQUES CLES
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Precision citation", value: ">98%" },
                          { label: "Temps de réponse", value: "<2s" },
                          { label: "Couverture corpus", value: "100%" },
                          { label: "Formats supportes", value: "12+" },
                        ].map((metric) => (
                          <div key={metric.label} className="border border-chrome-light/60 p-3">
                            <p className="font-mono text-lg font-medium text-ink leading-none mb-1">
                              {metric.value}
                            </p>
                            <p className="font-mono text-[9px] tracking-[0.12em] text-steel">
                              {metric.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-chrome-light/60 bg-fog p-6">
                      <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-2">
                        PRINCIPE FONDATEUR
                      </p>
                      <p className="font-sans text-sm leading-relaxed text-ink/65">
                        Si la réponse n'est pas dans les documents, Sailor l'indique
                        explicitement. Zéro invention. Zéro confiance mal placée.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>

        {/* ================================================================ */}
        {/* ZONE 5 — DEPLOYMENT */}
        {/* ================================================================ */}
        <section aria-labelledby="deployment-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-05" label="Modes de Deploiement" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Version Locale */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-warm-paper border border-chrome-light/60 p-8 lg:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-steel mb-1">
                    MODE 01
                  </p>
                  <h3 className="font-mono text-sm font-medium tracking-[0.1em] text-ink">
                    VERSION LOCALE
                  </h3>
                </div>
                <span className="font-mono text-[9px] bg-fog border border-chrome-light/60 text-steel px-2 py-1">
                  AIR-GAP
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Mistral 3B ou Qwen 3.5 — modèles souverains",
                  "Zéro réseau — données jamais hors site",
                  "Installation sur infrastructure client",
                  "Air-gap complet sur demande",
                  "Audit de sécurité inclus",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="font-mono text-chrome-dark text-xs shrink-0 mt-0.5">—</span>
                    <span className="font-sans text-sm text-ink/65">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-chrome-light/60 pt-4">
                <p className="font-mono text-[9px] tracking-[0.15em] text-steel">
                  MODELES COMPATIBLES
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Mistral 3B", "Qwen 3.5", "Phi-3 Mini"].map((m) => (
                    <span
                      key={m}
                      className="font-mono text-[9px] border border-chrome-light/60 px-2 py-0.5 text-steel"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Version SaaS */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-warm-paper border border-chrome-light/60 p-8 lg:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.2em] text-steel mb-1">
                    MODE 02
                  </p>
                  <h3 className="font-mono text-sm font-medium tracking-[0.1em] text-ink">
                    VERSION SAAS
                  </h3>
                </div>
                <span className="font-mono text-[9px] bg-signal-green/10 border border-signal-green/30 text-signal-green px-2 py-1">
                  ZDR
                </span>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Scaleway ZDR — Zero Data Retention garanti",
                  "Hébergement France — données RGPD",
                  "Namibia — infrastructure souveraine Lite Ops",
                  "Multi-tenant isole par organisation",
                  "Disponibilite 99.9% — SLA documente",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="font-mono text-chrome-dark text-xs shrink-0 mt-0.5">—</span>
                    <span className="font-sans text-sm text-ink/65">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-chrome-light/60 pt-4">
                <p className="font-mono text-[9px] tracking-[0.15em] text-steel">
                  INFRASTRUCTURE
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Scaleway ZDR", "Namibia", "France"].map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[9px] border border-chrome-light/60 px-2 py-0.5 text-steel"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ZONE 6 — ECOSYSTEM */}
        {/* ================================================================ */}
        <section aria-labelledby="ecosystem-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-06" label="Ecosysteme" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Link to Pilot */}
            <Link
              href="/agents/pilot"
              className="group bg-warm-paper border border-chrome-light/60 p-8 transition-colors duration-200 hover:bg-fog"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-1">AG001</p>
                  <h3 className="font-mono text-sm font-medium tracking-[0.1em] text-ink group-hover:text-ink transition-colors">
                    PILOT
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-steel group-hover:text-ink transition-colors">
                  →
                </span>
              </div>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">
                Agent de monitoring opérationnel. Pilot surveille vos systèmes et alerte en
                temps réel. Complément naturel de Sailor.
              </p>
              <p className="font-mono text-[9px] tracking-[0.15em] text-steel mt-4 group-hover:text-ink transition-colors group-hover:underline">
                Voir Pilot
              </p>
            </Link>

            {/* Systeme Acquisition */}
            <div className="bg-warm-paper border border-chrome-light/60 p-8">
              <div className="mb-4">
                <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-1">SYSTEME</p>
                <h3 className="font-mono text-sm font-medium tracking-[0.1em] text-ink">
                  ACQUISITION
                </h3>
              </div>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">
                Sailor Acquisition s'intègre dans le Système Acquisition Lite Ops —
                qualification prospect, onboarding client, navigation commerciale unifiée.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Sailor SA-01", "Pilot AG001", "Namibia"].map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] border border-chrome-light/60 px-2 py-0.5 text-steel"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-fog border border-chrome-light/60 p-8 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[9px] tracking-[0.18em] text-steel mb-1">
                  PROCHAINE ÉTAPE
                </p>
                <h3 className="font-mono text-sm font-medium tracking-[0.1em] text-ink mb-4">
                  DÉMARRER AVEC SAILOR
                </h3>
                <p className="font-sans text-sm text-ink/65 leading-relaxed mb-6">
                  Apportez vos documents. Sailor est configuré et opérationnel en 5 jours.
                </p>
              </div>
              <Link
                href="#contact"
                className={[
                  "font-mono text-[10px] tracking-[0.15em] uppercase",
                  "bg-signal-green text-system-green",
                  "px-5 py-3 text-center",
                  "transition-all duration-200 hover:bg-signal-green/85",
                  "block",
                ].join(" ")}
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ZONE 7 — PRICING */}
        {/* ================================================================ */}
        <section aria-labelledby="pricing-heading" className="py-20 lg:py-24 border-t border-chrome-light/40">
          <SectionLabel code="Z-07" label="Tarification" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.code}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  "flex flex-col p-8",
                  tier.highlight
                    ? "bg-warm-paper border-2 border-signal-green"
                    : "bg-warm-paper border border-chrome-light/60",
                ].join(" ")}
              >
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-steel">
                      {tier.code}
                    </p>
                    {tier.highlight && (
                      <span className="font-mono text-[9px] tracking-[0.15em] text-signal-green bg-signal-green/10 border border-signal-green/30 px-2 py-0.5">
                        RECOMMANDE
                      </span>
                    )}
                  </div>

                  <h3 className="font-mono text-lg font-medium tracking-[0.08em] mb-1 text-ink">
                    {tier.name}
                  </h3>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="font-mono text-2xl font-medium text-ink">
                      {tier.price}
                    </span>
                    {tier.unit && (
                      <span className="font-mono text-[10px] text-steel">
                        {tier.unit}
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-sm leading-relaxed text-ink/65">
                    {tier.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-8">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs shrink-0 mt-0.5 text-chrome-dark">
                        ✓
                      </span>
                      <span className="font-sans text-sm text-ink/65">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="#contact"
                  className={[
                    "font-mono text-[10px] tracking-[0.15em] uppercase px-5 py-3 text-center",
                    "border transition-all duration-200",
                    tier.highlight
                      ? "border-signal-green bg-signal-green text-system-green hover:bg-signal-green/85"
                      : "border-chrome-dark text-ink hover:bg-fog",
                  ].join(" ")}
                >
                  {tier.price === "Sur devis" ? "Nous contacter" : "Démarrer"}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pricing footnote */}
          <div className="mt-6 flex items-start gap-3 border border-chrome-light/40 border-dashed p-4">
            <span className="font-mono text-[10px] text-steel shrink-0">NOTE</span>
            <p className="font-sans text-xs text-ink/65 leading-relaxed">
              Tous les prix sont HT. Les tarifs Local Deploy sont calculés selon l'infrastructure
              cible et le volume documentaire. Un audit gratuit est inclus dans chaque engagement.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
