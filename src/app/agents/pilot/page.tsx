"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OperatorId = "DATA_LAYER" | "TEXT_TO_SQL" | "LLM" | "GRAPH_GENERATOR";
type LayerId = "TECHNIQUE" | "METIER" | "ADAPTATION";

interface Operator {
  id: OperatorId;
  label: string;
  code: string;
  description: string;
  role: string;
  inputs: string[];
  outputs: string[];
  preview: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayerAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  fillOpacity: number;
}

interface Layer {
  id: LayerId;
  label: string;
  description: string;
  color: string;
  annotations: LayerAnnotation[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const OPERATORS: Operator[] = [
  {
    id: "DATA_LAYER",
    label: "DATA LAYER",
    code: "OP-01",
    description: "Ingestion & normalisation",
    role: "Connecteur universel de données — ingère, normalise et indexe toute source structurée.",
    inputs: ["Base de données SQL", "Fichiers CSV/Excel", "Contexte métier NL"],
    outputs: ["Schéma normalisé", "Métadonnées indexées", "Graphe de relations"],
    preview: "Analyse du schéma: 12 tables, 847 colonnes, 3 relations détectées.",
    x: 200,
    y: 140,
    width: 130,
    height: 64,
  },
  {
    id: "TEXT_TO_SQL",
    label: "TEXT TO SQL",
    code: "OP-02",
    description: "Traduction langage naturel",
    role: "Traduit les questions en langage naturel en requêtes SQL optimisées pour votre schéma.",
    inputs: ["Question NL", "Schéma normalisé", "Métadonnées contextuelles"],
    outputs: ["Requete SQL", "Plan d'execution", "Score de confiance"],
    preview: 'SELECT dept, AVG(salary) FROM employees WHERE... [CONFIANCE: 94%]',
    x: 370,
    y: 140,
    width: 130,
    height: 64,
  },
  {
    id: "LLM",
    label: "LLM",
    code: "OP-03",
    description: "Modèle de langage",
    role: "Modèle de langage — génère les analyses, interprétations et recommandations à partir des résultats de requêtes.",
    inputs: ["Résultats SQL", "Contexte métier", "Historique conversation"],
    outputs: ["Analyse textuelle", "Insights clés", "Recommandations"],
    preview: "Analyse: Les ventes Q3 montrent une hausse de 18% sur le segment PME, portée par...",
    x: 540,
    y: 140,
    width: 130,
    height: 64,
  },
  {
    id: "GRAPH_GENERATOR",
    label: "GRAPH GEN",
    code: "OP-04",
    description: "Visualisation automatique",
    role: "Transforme les données en visualisations claires — sélectionne automatiquement le type de graphe optimal.",
    inputs: ["Dataset structuré", "Type d'analyse", "Préférences utilisateur"],
    outputs: ["Graphiques SVG/PNG", "Tableaux interactifs", "Exports PDF"],
    preview: "[BAR CHART] Ventes par région — 6 séries, 12 périodes, annotations automatiques",
    x: 710,
    y: 140,
    width: 130,
    height: 64,
  },
];

const LAYERS: Layer[] = [
  {
    id: "TECHNIQUE",
    label: "TECHNIQUE",
    description: "Assemblage technique — modèles, connecteurs, infra",
    color: "#2F3427",
    annotations: [
      {
        id: "t1",
        x: 188,
        y: 128,
        width: 154,
        height: 88,
        text: "Connecteurs: PostgreSQL, MySQL, SQLite, CSV, Excel",
        color: "#2F3427",
        fillOpacity: 0.07,
      },
      {
        id: "t2",
        x: 358,
        y: 128,
        width: 154,
        height: 88,
        text: "Modèle: schema-aware fine-tuning",
        color: "#2F3427",
        fillOpacity: 0.07,
      },
      {
        id: "t3",
        x: 528,
        y: 128,
        width: 154,
        height: 88,
        text: "Local: Mistral 3B / Cloud: GPT-4o",
        color: "#2F3427",
        fillOpacity: 0.07,
      },
      {
        id: "t4",
        x: 698,
        y: 128,
        width: 154,
        height: 88,
        text: "Recharts, D3.js, export SVG/PDF",
        color: "#2F3427",
        fillOpacity: 0.07,
      },
    ],
  },
  {
    id: "METIER",
    label: "METIER",
    description: "Spécialisation métier — entraînement domaine spécifique",
    color: "#5A6B4A",
    annotations: [
      {
        id: "m1",
        x: 188,
        y: 128,
        width: 154,
        height: 88,
        text: "Ontologie risques: 40K points de données",
        color: "#5A6B4A",
        fillOpacity: 0.1,
      },
      {
        id: "m2",
        x: 358,
        y: 128,
        width: 154,
        height: 88,
        text: "Vocabulaire RH, finance, supply chain",
        color: "#5A6B4A",
        fillOpacity: 0.1,
      },
      {
        id: "m3",
        x: 528,
        y: 128,
        width: 154,
        height: 88,
        text: "Entraine pour cartographier les risques critiques",
        color: "#5A6B4A",
        fillOpacity: 0.1,
      },
      {
        id: "m4",
        x: 698,
        y: 128,
        width: 154,
        height: 88,
        text: "Templates KPI sectoriels integres",
        color: "#5A6B4A",
        fillOpacity: 0.1,
      },
    ],
  },
  {
    id: "ADAPTATION",
    label: "ADAPTATION",
    description: "Personnalisation organisation — contexte, glossaire, workflows",
    color: "#A5D900",
    annotations: [
      {
        id: "a1",
        x: 188,
        y: 128,
        width: 154,
        height: 88,
        text: "Connexion à vos schémas existants",
        color: "#6B8F00",
        fillOpacity: 0.12,
      },
      {
        id: "a2",
        x: 358,
        y: 128,
        width: 154,
        height: 88,
        text: "Glossaire métier de votre organisation",
        color: "#6B8F00",
        fillOpacity: 0.12,
      },
      {
        id: "a3",
        x: 528,
        y: 128,
        width: 154,
        height: 88,
        text: "Tonalité, format de rapport, langue",
        color: "#6B8F00",
        fillOpacity: 0.12,
      },
      {
        id: "a4",
        x: 698,
        y: 128,
        width: 154,
        height: 88,
        text: "Charte graphique, couleurs, exports",
        color: "#6B8F00",
        fillOpacity: 0.12,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// SVG Diagram
// ---------------------------------------------------------------------------

function BlueprintGrid() {
  return (
    <defs>
      <pattern
        id="grid-small"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="rgba(212,208,200,0.25)"
          strokeWidth="0.5"
        />
      </pattern>
      <pattern
        id="grid-large"
        width="100"
        height="100"
        patternUnits="userSpaceOnUse"
      >
        <rect width="100" height="100" fill="url(#grid-small)" />
        <path
          d="M 100 0 L 0 0 0 100"
          fill="none"
          stroke="rgba(212,208,200,0.5)"
          strokeWidth="0.5"
        />
      </pattern>
      <marker
        id="arrow"
        markerWidth="6"
        markerHeight="6"
        refX="5"
        refY="3"
        orient="auto"
      >
        <path d="M0,0.5 L0,5.5 L5.5,3 z" fill="#B8B5AE" />
      </marker>
      <marker
        id="arrow-active"
        markerWidth="6"
        markerHeight="6"
        refX="5"
        refY="3"
        orient="auto"
      >
        <path d="M0,0.5 L0,5.5 L5.5,3 z" fill="#A5D900" />
      </marker>
    </defs>
  );
}

function OperatorBlock({
  op,
  isSelected,
  onClick,
}: {
  op: Operator;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <g
      onClick={onClick}
      style={{ cursor: "pointer" }}
      role="button"
      aria-label={`Opérateur ${op.label}`}
    >
      {/* Shadow / active glow */}
      {isSelected && (
        <rect
          x={op.x - 2}
          y={op.y - 2}
          width={op.width + 4}
          height={op.height + 4}
          fill="none"
          stroke="#A5D900"
          strokeWidth="1.5"
        />
      )}
      {/* Main block */}
      <rect
        x={op.x}
        y={op.y}
        width={op.width}
        height={op.height}
        fill={isSelected ? "#F0F5E6" : "#EFEFEF"}
        stroke={isSelected ? "#A5D900" : "#9A968E"}
        strokeWidth="1"
      />
      {/* Top label bar */}
      <rect
        x={op.x}
        y={op.y}
        width={op.width}
        height={18}
        fill={isSelected ? "#A5D900" : "#9A968E"}
      />
      {/* Code label */}
      <text
        x={op.x + 5}
        y={op.y + 12}
        fontFamily="'JetBrains Mono', monospace"
        fontSize="7"
        fill={isSelected ? "#2F3427" : "#F0EEEB"}
        fontWeight="500"
        letterSpacing="0.08em"
      >
        {op.code}
      </text>
      {/* Operator name */}
      <text
        x={op.x + op.width / 2}
        y={op.y + 34}
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8.5"
        fill={isSelected ? "#2F3427" : "#1A1A1A"}
        fontWeight="500"
        letterSpacing="0.05em"
        textAnchor="middle"
      >
        {op.label}
      </text>
      {/* Description */}
      <text
        x={op.x + op.width / 2}
        y={op.y + 48}
        fontFamily="'JetBrains Mono', monospace"
        fontSize="6.5"
        fill="#908E85"
        letterSpacing="0.03em"
        textAnchor="middle"
      >
        {op.description}
      </text>
      {/* Corner crosshairs */}
      <line
        x1={op.x + 3}
        y1={op.y + 22}
        x2={op.x + 7}
        y2={op.y + 22}
        stroke="#CDC9C2"
        strokeWidth="0.5"
      />
      <line
        x1={op.x + 5}
        y1={op.y + 20}
        x2={op.x + 5}
        y2={op.y + 24}
        stroke="#CDC9C2"
        strokeWidth="0.5"
      />
    </g>
  );
}

function PipelineDiagram({
  selectedOp,
  onSelectOp,
  activeLayer,
}: {
  selectedOp: OperatorId | null;
  onSelectOp: (id: OperatorId | null) => void;
  activeLayer: LayerId | null;
}) {
  const layer = activeLayer ? LAYERS.find((l) => l.id === activeLayer) : null;

  const inputItems = ["Base de données", "Tableurs", "Contexte NL"];
  const outputItems = ["Rapports graphiques", "Exploration chatbot", "Recommandations"];

  return (
    <svg
      viewBox="0 0 980 320"
      className="w-full"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      aria-label="Diagramme pipeline Pilot AG001"
      role="img"
    >
      <BlueprintGrid />

      {/* Background grid */}
      <rect width="980" height="320" fill="url(#grid-large)" />

      {/* Outer border with corner marks */}
      <rect
        x="8"
        y="8"
        width="964"
        height="304"
        fill="none"
        stroke="#CDC9C2"
        strokeWidth="0.75"
        strokeDasharray="4 2"
      />
      {/* Corner crosses */}
      {[
        [8, 8],
        [972, 8],
        [8, 312],
        [972, 312],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <line
            x1={(cx ?? 0) - 4}
            y1={cy ?? 0}
            x2={(cx ?? 0) + 4}
            y2={cy ?? 0}
            stroke="#CDC9C2"
            strokeWidth="0.75"
          />
          <line
            x1={cx ?? 0}
            y1={(cy ?? 0) - 4}
            x2={cx ?? 0}
            y2={(cy ?? 0) + 4}
            stroke="#CDC9C2"
            strokeWidth="0.75"
          />
        </g>
      ))}

      {/* Title block */}
      <text
        x="20"
        y="28"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8"
        fill="#9A968E"
        letterSpacing="0.12em"
      >
        LITE OPS / AG001-PILOT / PIPELINE SCHEMA / REV.4
      </text>
      <text
        x="960"
        y="28"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8"
        fill="#B8B5AE"
        letterSpacing="0.08em"
        textAnchor="end"
      >
        2026-03-27
      </text>

      {/* Horizontal rule */}
      <line
        x1="20"
        y1="36"
        x2="960"
        y2="36"
        stroke="#CDC9C2"
        strokeWidth="0.5"
      />

      {/* ── INPUTS BLOCK ── */}
      <rect
        x="20"
        y="100"
        width="140"
        height="140"
        fill="#EFEFEF"
        stroke="#9A968E"
        strokeWidth="0.75"
      />
      <rect x="20" y="100" width="140" height="14" fill="#9A968E" />
      <text
        x="25"
        y="111"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="7"
        fill="#F0EEEB"
        letterSpacing="0.1em"
        fontWeight="500"
      >
        INPUTS
      </text>
      {inputItems.map((item, i) => (
        <g key={item}>
          <rect
            x="28"
            y={122 + i * 34}
            width="124"
            height="26"
            fill="#F5F2ED"
            stroke="#D4D0C8"
            strokeWidth="0.5"
          />
          <text
            x="90"
            y={139 + i * 34}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill="#1A1A1A"
            letterSpacing="0.04em"
            textAnchor="middle"
          >
            {item}
          </text>
        </g>
      ))}

      {/* Input → Data Layer arrow */}
      <line
        x1="160"
        y1="172"
        x2="196"
        y2="172"
        stroke={selectedOp === "DATA_LAYER" ? "#A5D900" : "#B8B5AE"}
        strokeWidth="0.75"
        markerEnd={
          selectedOp === "DATA_LAYER" ? "url(#arrow-active)" : "url(#arrow)"
        }
      />

      {/* Pipeline connections between operators */}
      {(
        [
          ["DATA_LAYER", "TEXT_TO_SQL"],
          ["TEXT_TO_SQL", "LLM"],
          ["LLM", "GRAPH_GENERATOR"],
        ] as [OperatorId, OperatorId][]
      ).map(([from, to]) => {
        const fromOp = OPERATORS.find((o) => o.id === from)!;
        const toOp = OPERATORS.find((o) => o.id === to)!;
        const isActive = selectedOp === from || selectedOp === to;
        return (
          <line
            key={`${from}-${to}`}
            x1={fromOp.x + fromOp.width}
            y1={fromOp.y + fromOp.height / 2}
            x2={toOp.x}
            y2={toOp.y + toOp.height / 2}
            stroke={isActive ? "#A5D900" : "#B8B5AE"}
            strokeWidth="0.75"
            markerEnd={isActive ? "url(#arrow-active)" : "url(#arrow)"}
          />
        );
      })}

      {/* Graph Generator → Outputs arrow */}
      {(() => {
        const last = OPERATORS[OPERATORS.length - 1]!;
        return (
          <line
            x1={last.x + last.width}
            y1={last.y + last.height / 2}
            x2="820"
            y2="172"
            stroke={selectedOp === "GRAPH_GENERATOR" ? "#A5D900" : "#B8B5AE"}
            strokeWidth="0.75"
            markerEnd={
              selectedOp === "GRAPH_GENERATOR"
                ? "url(#arrow-active)"
                : "url(#arrow)"
            }
          />
        );
      })()}

      {/* ── OPERATOR BLOCKS ── */}
      {OPERATORS.map((op) => (
        <OperatorBlock
          key={op.id}
          op={op}
          isSelected={selectedOp === op.id}
          onClick={() => onSelectOp(selectedOp === op.id ? null : op.id)}
        />
      ))}

      {/* ── OUTPUTS BLOCK ── */}
      <rect
        x="820"
        y="100"
        width="140"
        height="140"
        fill="#EFEFEF"
        stroke="#9A968E"
        strokeWidth="0.75"
      />
      <rect x="820" y="100" width="140" height="14" fill="#9A968E" />
      <text
        x="825"
        y="111"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="7"
        fill="#F0EEEB"
        letterSpacing="0.1em"
        fontWeight="500"
      >
        OUTPUTS
      </text>
      {outputItems.map((item, i) => (
        <g key={item}>
          <rect
            x="828"
            y={122 + i * 34}
            width="124"
            height="26"
            fill="#F5F2ED"
            stroke="#D4D0C8"
            strokeWidth="0.5"
          />
          <text
            x="890"
            y={139 + i * 34}
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill="#1A1A1A"
            letterSpacing="0.04em"
            textAnchor="middle"
          >
            {item}
          </text>
        </g>
      ))}

      {/* Pipeline spine labels */}
      {OPERATORS.map((op) => (
        <text
          key={`label-${op.id}`}
          x={op.x + op.width / 2}
          y={op.y + op.height + 16}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="6"
          fill="#B8B5AE"
          letterSpacing="0.06em"
          textAnchor="middle"
        >
          {op.code}
        </text>
      ))}

      {/* ── LAYER OVERLAYS ── */}
      {layer &&
        layer.annotations.map((ann) => (
          <g key={ann.id}>
            <rect
              x={ann.x}
              y={ann.y}
              width={ann.width}
              height={ann.height}
              fill={ann.color}
              fillOpacity={ann.fillOpacity}
              stroke={ann.color}
              strokeWidth="0.75"
              strokeDasharray="3 2"
            />
            <foreignObject
              x={ann.x + 4}
              y={ann.y + ann.height + 2}
              width={ann.width - 8}
              height="32"
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "6px",
                  color: ann.color,
                  lineHeight: "1.4",
                  letterSpacing: "0.03em",
                }}
              >
                {ann.text}
              </div>
            </foreignObject>
          </g>
        ))}

      {/* Layer badge */}
      {layer && (
        <g>
          <rect x="20" y="260" width="140" height="20" fill={layer.color} fillOpacity="0.12" stroke={layer.color} strokeWidth="0.75" />
          <text
            x="90"
            y="273"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="7"
            fill={layer.color}
            letterSpacing="0.1em"
            textAnchor="middle"
            fontWeight="600"
          >
            CALQUE: {layer.label}
          </text>
        </g>
      )}

      {/* Bottom legend */}
      <text
        x="960"
        y="300"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="6.5"
        fill="#B8B5AE"
        letterSpacing="0.06em"
        textAnchor="end"
      >
        Cliquez sur un opérateur pour les détails
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
  op: Operator;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="border border-rule bg-warm-paper"
      role="complementary"
      aria-label={`Détails opérateur ${op.label}`}
    >
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-rule bg-system-green px-5 py-3">
        <div>
          <span className="font-mono text-[9px] tracking-[0.14em] text-chrome">
            {op.code}
          </span>
          <h3 className="font-mono text-sm font-medium tracking-widest text-architect-paper">
            {op.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="font-mono text-xs text-chrome-dark transition-colors hover:text-architect-paper"
          aria-label="Fermer"
        >
          [X]
        </button>
      </div>

      <div className="p-6 lg:p-8 space-y-5">
        {/* Role */}
        <div>
          <p className="mb-1.5 font-mono text-[9px] tracking-[0.14em] text-sage uppercase">
            Role
          </p>
          <p className="font-sans text-sm leading-relaxed text-ink/65">
            {op.role}
          </p>
        </div>

        {/* Inputs */}
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.14em] text-sage uppercase">
            Entrees
          </p>
          <ul className="space-y-1">
            {op.inputs.map((inp) => (
              <li
                key={inp}
                className="flex items-center gap-2 font-mono text-xs text-ink/65"
              >
                <span className="text-chrome-dark">→</span>
                {inp}
              </li>
            ))}
          </ul>
        </div>

        {/* Outputs */}
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.14em] text-sage uppercase">
            Sorties
          </p>
          <ul className="space-y-1">
            {op.outputs.map((out) => (
              <li
                key={out}
                className="flex items-center gap-2 font-mono text-xs text-ink/65"
              >
                <span className="text-chrome-dark">←</span>
                {out}
              </li>
            ))}
          </ul>
        </div>

        {/* UI Preview */}
        <div>
          <p className="mb-2 font-mono text-[9px] tracking-[0.14em] text-sage uppercase">
            Apercu sortie
          </p>
          <div className="border border-rule bg-architect-paper p-3">
            <p className="font-mono text-[10px] leading-relaxed text-steel">
              {op.preview}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Specialist Card
// ---------------------------------------------------------------------------

interface Specialist {
  id: string;
  name: string;
  description: string;
  datapoints?: string;
}

const SPECIALISTS: Specialist[] = [
  {
    id: "AG001-RI",
    name: "Pilot — Risques",
    description:
      "Cartographie des risques, visualisation des risques critiques. Identifie et classe les expositions en temps réel.",
    datapoints: "40 000 points de données risque",
  },
  {
    id: "AG001-RH",
    name: "Pilot — Ressources Humaines",
    description:
      "Analyse data employés, optimisation des ressources, tableaux de bord RH. Turnover, absentéisme, performance.",
    datapoints: undefined,
  },
];

function SpecialistCard({ spec }: { spec: Specialist }) {
  return (
    <motion.div
      whileHover={{ borderColor: "#9A968E" }}
      transition={{ duration: 0.18 }}
      className="group border border-rule bg-warm-paper p-8 cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-[9px] tracking-[0.16em] text-steel">
          {spec.id}
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-chrome transition-colors duration-200 group-hover:bg-chrome-dark" />
      </div>
      <h3 className="font-sans text-base font-medium text-ink mb-2">
        {spec.name}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-sage mb-4">
        {spec.description}
      </p>
      {spec.datapoints && (
        <div className="border-t border-rule pt-3">
          <p className="font-mono text-[10px] tracking-[0.06em] text-steel">
            Entraîné sur {spec.datapoints}.
          </p>
        </div>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PilotPage() {
  const [selectedOp, setSelectedOp] = useState<OperatorId | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);

  const selectedOperator = selectedOp
    ? OPERATORS.find((o) => o.id === selectedOp) ?? null
    : null;

  function toggleLayer(id: LayerId) {
    setActiveLayer((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-screen bg-architect-paper">
      {/* Top spacer for fixed nav */}
      <div className="pt-28 lg:pt-32" />

      {/* ── HEADER ── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="border-b border-rule bg-warm-paper"
      >
        <div className="mx-auto max-w-7xl px-8 py-12 lg:px-20">
          {/* Breadcrumb */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-8 flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] text-chrome-dark"
          >
            <Link href="/" className="transition-colors hover:text-ink">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/agents/pilot" className="transition-colors hover:text-ink">
              Agents
            </Link>
            <span>/</span>
            <span className="text-ink">Pilot</span>
          </nav>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 max-w-2xl">
              {/* Agent ID */}
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.18em] text-steel">
                  AG001 — PILOT
                </span>
                {/* Status badge */}
                <span className="inline-flex items-center gap-1.5 border border-signal-green px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-signal-green">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-green opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-green" />
                  </span>
                  ACTIF
                </span>
              </div>

              <h1 className="font-sans text-4xl font-semibold tracking-tight text-ink lg:text-5xl">
                Assisted Data Analysis
              </h1>

              <p className="font-sans text-base leading-relaxed text-ink/65">
                Pilot prend votre base de données en entrée, comprend son
                contexte en langage naturel, et génère les rapports les plus
                pertinents. Vous explorez ensuite vos données comme vous
                poseriez une question à un collègue.
              </p>
            </div>

            {/* Hero photo */}
            <div className="relative w-full lg:w-80 xl:w-96 shrink-0">
              <div className="relative aspect-[4/3] overflow-hidden border border-rule">
                <Image
                  src="/photos/photo-1616272963049-da2d8efc0c57.avif"
                  alt="Data analysis interface"
                  fill
                  className="object-cover grayscale"
                  priority
                  sizes="(max-width: 1024px) 100vw, 384px"
                />
                <div className="absolute inset-0 bg-system-green/20 mix-blend-multiply" />
                <div className="absolute bottom-0 left-0 right-0 border-t border-rule/50 bg-system-green/80 px-3 py-1.5">
                  <p className="font-mono text-[8px] tracking-[0.1em] text-chrome-light">
                    AG001 / PILOT / DATA INTERFACE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── ZONE 1 — SCHEMA ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule" aria-labelledby="schema-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
                01 / SCHEMA
              </p>
              <h2
                id="schema-heading"
                className="font-sans text-xl font-medium text-ink"
              >
                Pipeline AG001
              </h2>
            </div>
            <p className="hidden font-mono text-[9px] tracking-[0.1em] text-chrome sm:block">
              Cliquez sur un opérateur pour les détails
            </p>
          </div>

          {/* Diagram + panel layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* SVG Diagram */}
            <div className="border border-rule bg-warm-paper p-8 lg:p-12">
              <PipelineDiagram
                selectedOp={selectedOp}
                onSelectOp={setSelectedOp}
                activeLayer={activeLayer}
              />
            </div>

            {/* Operator detail panel */}
            <div className="min-h-[200px]">
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
                    className="flex h-full min-h-[200px] items-center justify-center border border-rule border-dashed"
                  >
                    <p className="font-mono text-[10px] tracking-[0.1em] text-rule">
                      Sélectionnez un opérateur
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONE 3 — LAYERS TOGGLE ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule bg-warm-paper" aria-labelledby="layers-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-6">
            <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
              02 / CALQUES
            </p>
            <h2
              id="layers-heading"
              className="font-sans text-xl font-medium text-ink"
            >
              Layers
            </h2>
            <p className="mt-1 font-sans text-sm text-sage">
              Superposez les calques sur le schéma pour explorer chaque
              dimension du système.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {LAYERS.map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={[
                    "group flex flex-col gap-1 border px-5 py-4 text-left transition-all duration-200",
                    isActive
                      ? "border-signal-green bg-signal-green/10 text-signal-green"
                      : "border-chrome text-steel hover:border-chrome-dark",
                  ].join(" ")}
                  aria-pressed={isActive}
                  aria-label={`Calque ${layer.label}: ${layer.description}`}
                >
                  <span
                    className={[
                      "font-mono text-[9px] tracking-[0.16em] font-medium",
                      isActive ? "text-signal-green" : "text-steel",
                    ].join(" ")}
                  >
                    {isActive ? "● " : "○ "}
                    {layer.label}
                  </span>
                  <span
                    className={[
                      "font-sans text-xs",
                      isActive ? "text-signal-green/70" : "text-sage",
                    ].join(" ")}
                  >
                    {layer.description}
                  </span>
                </button>
              );
            })}
          </div>

          {activeLayer && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border border-rule bg-architect-paper px-4 py-3"
            >
              <p className="font-mono text-[10px] tracking-[0.1em] text-moss">
                Calque actif: {LAYERS.find((l) => l.id === activeLayer)?.label} — Overlay visible sur le schéma ci-dessus.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── ZONE 4 — SPECIALISTS ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule" aria-labelledby="specialists-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-8">
            <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
              03 / SPECIALISTES
            </p>
            <h2
              id="specialists-heading"
              className="font-sans text-xl font-medium text-ink"
            >
              Versions spécialisées
            </h2>
            <p className="mt-1 font-sans text-sm text-sage">
              Pilot déployé avec un entraînement métier spécifique.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {SPECIALISTS.map((spec) => (
              <SpecialistCard key={spec.id} spec={spec} />
            ))}
          </div>
        </div>
      </section>

      {/* ── ZONE 5 — DEPLOYMENT ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule bg-warm-paper" aria-labelledby="deployment-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-8">
            <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
              04 / DÉPLOIEMENT
            </p>
            <h2
              id="deployment-heading"
              className="font-sans text-xl font-medium text-ink"
            >
              Options de déploiement
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Version Locale */}
            <div className="border border-rule bg-architect-paper">
              <div className="border-b border-rule bg-system-green px-5 py-3">
                <span className="font-mono text-[9px] tracking-[0.16em] text-chrome">
                  DEPLOY-01
                </span>
                <h3 className="font-sans text-base font-medium text-architect-paper">
                  Version Locale
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="font-sans text-sm leading-relaxed text-ink/65">
                  100% sur votre poste. Mini-modèles (Mistral 3B, Qwen 3.5).
                  Zéro sortie réseau. Immédiat.
                </p>
                <ul className="space-y-2">
                  {[
                    "Données jamais quittent vos serveurs",
                    "Modèles compacts et rapides",
                    "Installation en quelques minutes",
                    "Fonctionne sans connexion internet",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 font-mono text-[11px] text-ink"
                    >
                      <span className="mt-px shrink-0 text-moss">+</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-rule pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Modèle", value: "Mistral 3B / Qwen 3.5" },
                      { label: "Réseau", value: "Zéro" },
                      { label: "Setup", value: "< 30 min" },
                      { label: "Souveraineté", value: "Totale" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="font-mono text-[8px] tracking-[0.1em] text-sage">
                          {item.label}
                        </p>
                        <p className="font-mono text-xs font-medium text-ink">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Version SaaS */}
            <div className="border border-rule bg-architect-paper">
              <div className="border-b border-rule bg-system-green px-5 py-3">
                <span className="font-mono text-[9px] tracking-[0.16em] text-chrome">
                  DEPLOY-02
                </span>
                <h3 className="font-sans text-base font-medium text-architect-paper">
                  Version SaaS
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <p className="font-sans text-sm leading-relaxed text-ink/65">
                  Cloud Scaleway ZDR. Modèles puissants. Plateforme Namibia
                  disponible. Clé en main.
                </p>
                <ul className="space-y-2">
                  {[
                    "Hébergement Scaleway Zone de Données Régulées",
                    "GPT-4o, Claude 3.5 Sonnet et plus",
                    "Plateforme Namibia intégrée",
                    "Mises à jour automatiques",
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 font-mono text-[11px] text-ink"
                    >
                      <span className="mt-px shrink-0 text-chrome-dark">+</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-rule pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Infra", value: "Scaleway ZDR" },
                      { label: "Conformité", value: "RGPD / HDS" },
                      { label: "Setup", value: "Clé en main" },
                      { label: "SLA", value: "99.9%" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="font-mono text-[8px] tracking-[0.1em] text-sage">
                          {item.label}
                        </p>
                        <p className="font-mono text-xs font-medium text-ink">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONE 6 — ECOSYSTEM ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule" aria-labelledby="ecosystem-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-8">
            <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
              05 / ECOSYSTEME
            </p>
            <h2
              id="ecosystem-heading"
              className="font-sans text-xl font-medium text-ink"
            >
              Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Agents lies */}
            <div className="space-y-4">
              <p className="font-mono text-[9px] tracking-[0.16em] text-sage uppercase">
                Agents associés
              </p>
              <Link
                href="/agents/sailor"
                className="group flex items-center justify-between border border-rule bg-warm-paper px-4 py-3 transition-colors hover:border-ink"
              >
                <div>
                  <span className="font-mono text-[8px] tracking-[0.1em] text-sage">
                    AG002
                  </span>
                  <p className="font-sans text-sm font-medium text-ink">
                    Sailor
                  </p>
                  <p className="font-sans text-xs text-sage">
                    Process Automation
                  </p>
                </div>
                <span className="font-mono text-xs text-steel transition-colors group-hover:text-ink">
                  →
                </span>
              </Link>
            </div>

            {/* Systemes qui utilisent Pilot */}
            <div className="space-y-4">
              <p className="font-mono text-[9px] tracking-[0.16em] text-sage uppercase">
                Systèmes intégrant Pilot
              </p>
              <div className="space-y-2">
                {[
                  { label: "Système Risque", desc: "Cartographie et monitoring" },
                  { label: "Système Recrutement", desc: "Analyse candidats & RH" },
                ].map((sys) => (
                  <div
                    key={sys.label}
                    className="flex items-center justify-between border border-rule bg-warm-paper px-4 py-3"
                  >
                    <div>
                      <p className="font-sans text-sm font-medium text-ink">
                        {sys.label}
                      </p>
                      <p className="font-sans text-xs text-sage">{sys.desc}</p>
                    </div>
                    <span className="font-mono text-[9px] tracking-[0.1em] text-rule">
                      AG001
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo + CTA */}
            <div className="space-y-4">
              <p className="font-mono text-[9px] tracking-[0.16em] text-sage uppercase">
                Mise en œuvre
              </p>
              <div className="relative aspect-video overflow-hidden border border-rule">
                <Image
                  src="/photos/photo-1739086759198-b99a6e3f8599.avif"
                  alt="Pilot deployment"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-system-green/30 mix-blend-multiply" />
              </div>
              <Link
                href="#contact"
                className="block border border-signal-green bg-signal-green px-5 py-3 text-center font-mono text-xs font-medium tracking-[0.14em] text-system-green transition-all duration-200 hover:bg-signal-green/80 hover:border-signal-green/80"
              >
                Demander une démo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONE 7 — PRICING ── */}
      <section className="border-t border-chrome-light/40 border-b border-rule bg-warm-paper" aria-labelledby="pricing-heading">
        <div className="mx-auto max-w-7xl px-8 py-20 lg:px-20 lg:py-24">
          <div className="mb-8">
            <p className="mb-1 font-mono text-[9px] tracking-[0.18em] text-chrome">
              06 / BUDGET
            </p>
            <h2
              id="pricing-heading"
              className="font-sans text-xl font-medium text-ink"
            >
              Tarification
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Pricing model */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {[
                  {
                    code: "FEE-01",
                    label: "Budget fixe de setup",
                    desc: "Déploiement, intégration, configuration initiale. Budget défini avant démarrage.",
                  },
                  {
                    code: "FEE-02",
                    label: "Licence mensuelle",
                    desc: "Utilisation continue de Pilot, mises à jour incluses, support technique.",
                  },
                  {
                    code: "FEE-03",
                    label: "Fees custom si besoin",
                    desc: "Développements spécifiques, intégrateurs tiers, formations avancées.",
                  },
                ].map((fee) => (
                  <div
                    key={fee.code}
                    className="flex gap-4 border border-rule bg-architect-paper px-5 py-4"
                  >
                    <span className="shrink-0 font-mono text-[9px] tracking-[0.1em] text-steel mt-0.5">
                      {fee.code}
                    </span>
                    <div>
                      <p className="font-sans text-sm font-medium text-ink">
                        {fee.label}
                      </p>
                      <p className="font-sans text-xs leading-relaxed text-sage mt-0.5">
                        {fee.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financement + photo */}
            <div className="space-y-4">
              <div className="border border-rule bg-green-tint p-6 space-y-3">
                <p className="font-mono text-[9px] tracking-[0.16em] text-moss uppercase">
                  Aide au financement
                </p>
                <p className="font-sans text-sm leading-relaxed text-ink/65">
                  Nous aidons au financement : BPI France, dispositifs
                  regionaux, credit d&apos;impot innovation (CII).
                </p>
                <ul className="space-y-1.5">
                  {[
                    "BPI France — subventions et prêts innovants",
                    "Crédit d'impôt innovation (CII)",
                    "Dispositifs régionaux et européens",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 font-mono text-[10px] text-moss"
                    >
                      <span>→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative aspect-video overflow-hidden border border-rule">
                <Image
                  src="/photos/photo-1553748024-dd3fd69ab116.avif"
                  alt="Lite Ops team"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-system-green/25 mix-blend-multiply" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="bg-system-green" aria-labelledby="cta-heading">
        <div className="mx-auto max-w-7xl px-8 py-16 lg:px-20">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <span className="font-mono text-[9px] tracking-[0.16em] text-chrome">
                AG001 — PILOT
              </span>
              <h2
                id="cta-heading"
                className="font-sans text-2xl font-semibold text-architect-paper lg:text-3xl"
              >
                Prêt à analyser vos données autrement ?
              </h2>
              <p className="font-sans text-sm leading-relaxed text-sage max-w-lg">
                Démonstration en contexte réel sur vos données. Mise en œuvre
                en quelques semaines.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="#contact"
                className="border border-signal-green bg-signal-green px-6 py-3 font-mono text-xs font-medium tracking-[0.14em] text-system-green transition-all duration-200 hover:bg-signal-green/80 hover:border-signal-green/80"
              >
                Demander une démo
              </Link>
              <Link
                href="/agents/sailor"
                className="border border-chrome-dark px-6 py-3 font-mono text-xs font-medium tracking-[0.14em] text-architect-paper transition-all duration-200 hover:border-architect-paper"
              >
                Voir Sailor →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
