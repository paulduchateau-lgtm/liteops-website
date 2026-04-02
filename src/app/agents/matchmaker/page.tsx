"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OperatorId = "DATA_LAYER" | "EMBEDDING" | "NLP_PARSER" | "MATCH_ENGINE" | "SCORER" | "CONV_AGENT";
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
    description: "Catalogue de ressources",
    role: "Ingère et indexe le catalogue de ressources — humaines, matérielles, services, produits. Chaque ressource possède des caractéristiques structurées (nom, description, compétences, prix, références avec KPIs).",
    inputs: [
      "Profils humains (DRH)",
      "Catalogues produits/services",
      "Fiches matériels",
      "Références et KPIs historiques",
    ],
    outputs: [
      "Catalogue normalisé",
      "Graphe de relations ressources",
      "Index structuré multi-type",
    ],
    preview: "1 247 ressources indexées — 340 humaines, 512 produits, 395 services. Dernière MAJ: il y a 3h.",
    x: 60, y: 130, w: 120, h: 68,
  },
  {
    id: "EMBEDDING",
    code: "OP-02",
    label: "EMBEDDING",
    description: "Représentation sémantique",
    role: "Vectorise les ressources ET la demande entrante dans un espace sémantique partagé. Embeddings multilingues tenant compte des nuances métier, des compétences et des contraintes.",
    inputs: [
      "Catalogue normalisé",
      "Demande / fiche de poste / AO",
    ],
    outputs: [
      "Vecteurs ressources",
      "Vecteur demande",
      "Matrice de similarité",
    ],
    preview: "Embedding demande: 1536 dims. Similarité max détectée: 0.89 (Consultant SAP S4/HANA Senior).",
    x: 210, y: 90, w: 120, h: 68,
  },
  {
    id: "NLP_PARSER",
    code: "OP-03",
    label: "NLP PARSER",
    description: "Extraction des critères",
    role: "Analyse la demande (texte libre, PDF, AO) et en extrait les éléments principaux en format structuré: compétences requises, contraintes, budgets, délais, localisation.",
    inputs: [
      "Demande / fiche de poste / AO en texte libre",
    ],
    outputs: [
      "Critères structurés (must-have / nice-to-have)",
      "Contraintes détectées",
      "Poids relatifs des critères",
    ],
    preview: "Extrait: 8 critères (3 must-have, 5 nice-to-have). Budget: 600-800€/j. Durée: 6 mois min.",
    x: 210, y: 190, w: 120, h: 68,
  },
  {
    id: "MATCH_ENGINE",
    code: "OP-04",
    label: "MATCH ENGINE",
    description: "Moteur de correspondance",
    role: "Calcule la correspondance entre les critères extraits et les ressources vectorisées. Gère les combinaisons de ressources complémentaires. Filtre par contraintes budgétaires et temporelles.",
    inputs: [
      "Critères structurés",
      "Catalogue vectorisé",
      "Contraintes (budget, délai, localisation)",
    ],
    outputs: [
      "Top ressources candidates",
      "Combinaisons optimales",
      "Scores par critère",
    ],
    preview: "Top 5 identifiées. Meilleure combinaison: [Dupont M. + Consultant AMOA] — Score: 91/100.",
    x: 380, y: 130, w: 120, h: 68,
  },
  {
    id: "SCORER",
    code: "OP-05",
    label: "SCORER",
    description: "Scoring & visualisation",
    role: "Quantifie les raisons des choix. Génère un score global (0-100) et des scores par dimension (compétences, disponibilité, budget, références, localisation). Produit un diagramme radar structuré.",
    inputs: [
      "Ressources candidates avec scores bruts",
      "Pondération des critères",
    ],
    outputs: [
      "Score pondéré 0-100 par ressource",
      "Diagramme radar par dimension",
      "Classement final",
    ],
    preview: "Score Dupont M.: 91/100 — Compétences: 95, Budget: 88, Références: 94, Dispo: 87.",
    x: 540, y: 130, w: 120, h: 68,
  },
  {
    id: "CONV_AGENT",
    code: "OP-06",
    label: "CONV AGENT",
    description: "Raffinement conversationnel",
    role: "Boucle de dialogue permettant à l'utilisateur de préciser ses critères, commenter les propositions, et affiner la sélection. Met à jour dynamiquement le classement selon les retours.",
    inputs: [
      "Résultats classés",
      "Retour utilisateur (texte libre)",
    ],
    outputs: [
      "Proposition affinée",
      "Classement mis à jour",
      "Rapport de sélection final",
    ],
    preview: 'Utilisateur: "Trop cher, cherche < 600€/j." → Recalcul: 3 nouvelles ressources identifiées.',
    x: 700, y: 130, w: 120, h: 68,
  },
];

const LAYER_TABS: LayerTab[] = [
  {
    id: "TECHNIQUE",
    label: "Technique",
    description: "Pipeline de matching sémantique complet — embedding multilingue (1536 dims), hybrid search, scoring pondéré multi-critères, boucle conversationnelle. Chaque proposition est expliquée et quantifiée. Radar chart calculé à la volée.",
    annotations: [
      "Embeddings multilingues 1536 dims",
      "Hybrid search dense + sparse",
      "Scoring pondéré multi-critères",
      "Radar chart D3.js généré à la volée",
    ],
  },
  {
    id: "METIER",
    label: "Métier",
    description: "Conçu pour DRH (ressources humaines), directeurs métier (logiciels, consultants), sociétés de conseil (portfolio de consultants), directeurs commerciaux (catalogue produits/services). Comprend les codes métier de chaque verticale.",
    annotations: [
      "Ontologie compétences RH (ROME, ESCO)",
      "Taxonomie produits et services B2B",
      "Scoring références et KPIs projets",
      "Contraintes réglementaires (GDPR, appels d'offres)",
    ],
  },
  {
    id: "ADAPTATION",
    label: "Adaptation",
    description: "Configuration en 1 semaine. Ingestion du catalogue existant, définition des dimensions de scoring, calibration des poids par critère. Connecteurs vers vos outils (ATS, CRM, ERP).",
    annotations: [
      "Ingestion catalogue existant",
      "Définition des dimensions de scoring",
      "Calibration des poids par métier",
      "Connecteurs ATS, CRM, ERP",
    ],
  },
];

const SPECIALISTS: Specialist[] = [
  {
    code: "MA-01",
    name: "Matchmaker RH — Ressources humaines",
    tagline: "Constitution d'équipes en quelques secondes",
    description: "Le DRH recense ses collaborateurs et trouve la meilleure équipe-projet en quelques secondes sur base d'une fiche de poste.",
    uses: [
      "Matching fiche de poste → collaborateurs disponibles",
      "Constitution d'équipes projets pluridisciplinaires",
      "Identification des gaps de compétences",
      "Comparaison profils avec scoring transparent",
    ],
  },
  {
    code: "MA-02",
    name: "Matchmaker Conseil — Portfolio de consultants",
    tagline: "Réponse aux AO avec la combinaison optimale",
    description: "La société de conseil répond à ses appels d'offres en identifiant instantanément la combinaison optimale de consultants.",
    uses: [
      "Réponse rapide aux AO avec profils adaptés",
      "Scoring et diagramme radar pour le client",
      "Optimisation du staffing par disponibilité et prix",
      "Historique de références et KPIs projets",
    ],
  },
  {
    code: "MA-03",
    name: "Matchmaker Commercial — Produits & services",
    tagline: "Qualification et recommandation produit automatique",
    description: "Le directeur commercial identifie l'offre ou la combinaison de services idéale pour chaque demande client entrante.",
    uses: [
      "Qualification de demandes clients entrantes",
      "Recommandation de produits ou bundles",
      "Scoring de fit produit/besoin avec explication",
      "Support à la négociation par données objectives",
    ],
  },
];

const PRICING_TIERS: PricingTier[] = [
  {
    code: "MA-STARTER",
    name: "Starter",
    price: "590€",
    unit: "/mois",
    description: "500 ressources. 1 catalogue. 50 matchings/mois.",
    features: [
      "500 ressources indexées",
      "1 type de ressource",
      "50 matchings par mois",
      "Scores et radar chart",
      "Support email",
    ],
    highlight: false,
  },
  {
    code: "MA-PRO",
    name: "Pro",
    price: "1 490€",
    unit: "/mois",
    description: "Ressources illimitées. Multi-catalogues. API.",
    features: [
      "Ressources illimitées",
      "Multi-types de ressources",
      "Matchings illimités",
      "Boucle conversationnelle",
      "API REST + Webhooks",
      "Support prioritaire",
    ],
    highlight: true,
  },
  {
    code: "MA-DEPLOY",
    name: "Local Deploy",
    price: "Sur devis",
    unit: "",
    description: "On-premise. Données jamais hors site. Connecteurs sur mesure.",
    features: [
      "Déploiement on-premise",
      "Connecteurs ATS/CRM/ERP",
      "Données jamais hors site",
      "Audit sécurité inclus",
      "SLA personnalisé",
    ],
    highlight: false,
  },
];

// ---------------------------------------------------------------------------
// SVG Pipeline Diagram — Matchmaker has parallel branches
// ---------------------------------------------------------------------------

function SvgDefs() {
  return (
    <defs>
      <pattern id="mm-grid-sm" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(212,208,200,0.2)" strokeWidth="0.8" />
      </pattern>
      <pattern id="mm-grid-lg" width="100" height="100" patternUnits="userSpaceOnUse">
        <rect width="100" height="100" fill="url(#mm-grid-sm)" />
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(212,208,200,0.4)" strokeWidth="0.8" />
      </pattern>
      <marker id="mm-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
        <path d="M0,0.5 L0,6.5 L6,3.5 z" fill="#B8B5AE" />
      </marker>
      <marker id="mm-arrow-active" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
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
  const inputItems = ["Catalogue ressources", "Demande / AO", "Critères texte libre"];
  const outputItems = ["Top ressources", "Radar chart", "Rapport sélection"];

  const renderOperator = (op: PipelineOperator) => {
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
        <rect x={op.x} y={op.y} width={op.w} height={op.h} fill={sel ? "#EFF5E6" : "#EFEFEF"} stroke={sel ? "#A5D900" : "#9A968E"} strokeWidth="1" />
        <rect x={op.x} y={op.y} width={op.w} height={18} fill={sel ? "#A5D900" : "#9A968E"} />
        <text x={op.x + 5} y={op.y + 12} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill={sel ? "#1E1D1B" : "#F0EEEB"} fontWeight="500" letterSpacing="0.08em">
          {op.code}
        </text>
        <text x={op.x + op.w / 2} y={op.y + 33} fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill={sel ? "#1E1D1B" : "#1C1C1A"} fontWeight="500" letterSpacing="0.04em" textAnchor="middle">
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
  };

  const dataLayer = OPERATORS.find(o => o.id === "DATA_LAYER")!;
  const embedding = OPERATORS.find(o => o.id === "EMBEDDING")!;
  const nlpParser = OPERATORS.find(o => o.id === "NLP_PARSER")!;
  const matchEngine = OPERATORS.find(o => o.id === "MATCH_ENGINE")!;
  const scorer = OPERATORS.find(o => o.id === "SCORER")!;
  const convAgent = OPERATORS.find(o => o.id === "CONV_AGENT")!;

  const isActive = (id: OperatorId) => selectedOp === id;
  const arrowColor = (id: OperatorId) => isActive(id) ? "#A5D900" : "#B8B5AE";
  const arrowId = (id: OperatorId) => isActive(id) ? "url(#mm-arrow-active)" : "url(#mm-arrow)";

  // Branch mid-point x from DATA_LAYER right edge
  const branchX = dataLayer.x + dataLayer.w;
  const branchY = dataLayer.y + dataLayer.h / 2;

  return (
    <svg
      viewBox="0 0 960 320"
      className="w-full"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
      aria-label="Diagramme pipeline AG003 MATCHMAKER"
      role="img"
    >
      <SvgDefs />
      <rect width="960" height="320" fill="url(#mm-grid-lg)" />

      {/* Outer border */}
      <rect x="8" y="8" width="944" height="304" fill="none" stroke="#CDC9C2" strokeWidth="1" strokeDasharray="4 2" />

      {/* Corner marks */}
      {([[8,8],[952,8],[8,312],[952,312]] as [number,number][]).map(([cx, cy], i) => (
        <g key={i}>
          <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="#CDC9C2" strokeWidth="1" />
          <line x1={cx} y1={cy - 5} x2={cx} y2={cy + 5} stroke="#CDC9C2" strokeWidth="1" />
        </g>
      ))}

      {/* Header label */}
      <text x="20" y="26" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill="#9A968E" letterSpacing="0.12em">
        LITE OPS / AG003-MATCHMAKER / PIPELINE SCHEMA / REV.1
      </text>
      <text x="940" y="26" fontFamily="'JetBrains Mono', monospace" fontSize="7.5" fill="#B8B5AE" letterSpacing="0.08em" textAnchor="end">
        2026-03-28
      </text>
      <line x1="20" y1="33" x2="940" y2="33" stroke="#CDC9C2" strokeWidth="0.8" />

      {/* Status badge — EN DÉVELOPPEMENT */}
      <rect x="800" y="36" width="140" height="16" fill="rgba(154,150,142,0.15)" stroke="#7D7A73" strokeWidth="0.8" />
      <text x="870" y="47" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" fill="#7D7A73" letterSpacing="0.1em" textAnchor="middle">
        EN DÉVELOPPEMENT
      </text>

      {/* Input nodes */}
      <text x="20" y="85" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#9A968E" letterSpacing="0.12em">INPUTS</text>
      {inputItems.map((item, i) => (
        <g key={item}>
          <rect x={20} y={93 + i * 26} width={item.length * 6 + 12} height="20" fill="#F6F4F0" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x={26} y={107 + i * 26} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#6B6B60" letterSpacing="0.05em">
            {item}
          </text>
        </g>
      ))}

      {/* Input → DATA_LAYER */}
      <line
        x1={dataLayer.x} y1="104"
        x2={dataLayer.x} y2={dataLayer.y}
        stroke="#B8B5AE" strokeWidth="0.7" markerEnd="url(#mm-arrow)"
      />

      {/* DATA_LAYER → branch point */}
      <line
        x1={branchX} y1={branchY}
        x2={branchX + 30} y2={branchY}
        stroke={arrowColor("DATA_LAYER")}
        strokeWidth="0.8"
      />

      {/* Branch to EMBEDDING (upper) */}
      <line
        x1={branchX + 30} y1={branchY}
        x2={branchX + 30} y2={embedding.y + embedding.h / 2}
        stroke={arrowColor("DATA_LAYER")}
        strokeWidth="0.8"
      />
      <line
        x1={branchX + 30} y1={embedding.y + embedding.h / 2}
        x2={embedding.x} y2={embedding.y + embedding.h / 2}
        stroke={arrowColor("EMBEDDING")}
        strokeWidth="0.8"
        markerEnd={arrowId("EMBEDDING")}
      />

      {/* Branch to NLP_PARSER (lower) */}
      <line
        x1={branchX + 30} y1={branchY}
        x2={branchX + 30} y2={nlpParser.y + nlpParser.h / 2}
        stroke={arrowColor("DATA_LAYER")}
        strokeWidth="0.8"
      />
      <line
        x1={branchX + 30} y1={nlpParser.y + nlpParser.h / 2}
        x2={nlpParser.x} y2={nlpParser.y + nlpParser.h / 2}
        stroke={arrowColor("NLP_PARSER")}
        strokeWidth="0.8"
        markerEnd={arrowId("NLP_PARSER")}
      />

      {/* EMBEDDING → MATCH_ENGINE */}
      <line
        x1={embedding.x + embedding.w} y1={embedding.y + embedding.h / 2}
        x2={matchEngine.x} y2={matchEngine.y + matchEngine.h / 2}
        stroke={arrowColor("EMBEDDING")}
        strokeWidth="0.8"
        markerEnd={arrowId("EMBEDDING")}
      />

      {/* NLP_PARSER → MATCH_ENGINE */}
      <line
        x1={nlpParser.x + nlpParser.w} y1={nlpParser.y + nlpParser.h / 2}
        x2={matchEngine.x} y2={matchEngine.y + matchEngine.h / 2}
        stroke={arrowColor("NLP_PARSER")}
        strokeWidth="0.8"
        markerEnd={arrowId("NLP_PARSER")}
      />

      {/* MATCH_ENGINE → SCORER */}
      <line
        x1={matchEngine.x + matchEngine.w} y1={matchEngine.y + matchEngine.h / 2}
        x2={scorer.x} y2={scorer.y + scorer.h / 2}
        stroke={arrowColor("MATCH_ENGINE")}
        strokeWidth="0.8"
        markerEnd={arrowId("MATCH_ENGINE")}
      />

      {/* SCORER → CONV_AGENT */}
      <line
        x1={scorer.x + scorer.w} y1={scorer.y + scorer.h / 2}
        x2={convAgent.x} y2={convAgent.y + convAgent.h / 2}
        stroke={arrowColor("SCORER")}
        strokeWidth="0.8"
        markerEnd={arrowId("SCORER")}
      />

      {/* CONV_AGENT → OUTPUTS */}
      <line
        x1={convAgent.x + convAgent.w} y1={convAgent.y + convAgent.h / 2}
        x2="860" y2="164"
        stroke={arrowColor("CONV_AGENT")}
        strokeWidth="0.8"
        markerEnd={arrowId("CONV_AGENT")}
      />

      {/* Parallel label */}
      <text x="225" y="165" fontFamily="'JetBrains Mono', monospace" fontSize="6" fill="#B8B5AE" letterSpacing="0.08em" textAnchor="middle">
        parallèle
      </text>

      {/* Operator blocks */}
      {OPERATORS.map(renderOperator)}

      {/* Output nodes */}
      <text x="868" y="200" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#9A968E" letterSpacing="0.12em">OUTPUTS</text>
      {outputItems.map((item, i) => (
        <g key={item}>
          <rect x={868} y={208 + i * 26} width={item.length * 6 + 12} height="20" fill="#EFF5E6" stroke="#D5D1CB" strokeWidth="0.8" />
          <text x={874} y={222 + i * 26} fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#6B6B60" letterSpacing="0.05em">
            {item}
          </text>
        </g>
      ))}

      {/* Click hint */}
      <text x="940" y="308" fontFamily="'JetBrains Mono', monospace" fontSize="6.5" fill="#B8B5AE" letterSpacing="0.06em" textAnchor="end">
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

export default function MatchmakerPage() {
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
        aria-label="Présentation AG003 MATCHMAKER"
      >
        <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto px-8 lg:px-20 pt-40 pb-24 flex-1">

          {/* Status badge — EN DÉVELOPPEMENT (grey, not green) */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-12"
          >
            <span className="h-2 w-2 rounded-full bg-steel" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-steel">EN DÉVELOPPEMENT</span>
          </motion.div>

          {/* Agent code */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-chrome mb-4"
          >
            AG003
          </motion.span>

          {/* Agent name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="font-sans font-normal md:font-light text-architect-paper leading-[0.9] tracking-tight mb-6"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            MATCHMAKER
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            className="font-sans font-normal md:font-light text-architect-paper/70 max-w-xl leading-relaxed mb-12"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
          >
            Faites correspondre vos ressources aux besoins. En secondes, avec explication structurée.
          </motion.p>

          {/* Key metrics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-8 mb-14"
          >
            {["6 opérateurs", "4 types de ressources", "Score radar intégré"].map((m) => (
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
              href="mailto:contact@lite-ops.com?subject=Intérêt MATCHMAKER AG003"
              className="group inline-flex items-center gap-3 border border-steel/40 px-8 py-4 font-mono text-sm text-architect-paper/80 tracking-widest uppercase transition-all duration-300 hover:border-architect-paper/40 hover:text-architect-paper/80"
            >
              Exprimer mon intérêt
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
          </motion.div>

          {/* Development notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 border border-steel/20 bg-architect-paper/5 px-6 py-4 max-w-lg"
          >
            <p className="font-mono text-[11px] text-steel/80 leading-relaxed tracking-wider">
              Cet agent est en cours de développement. La documentation ci-dessous présente l'architecture cible et les fonctionnalités prévues.
            </p>
          </motion.div>
        </div>

        {/* Bottom rule */}
        <div className="border-t border-architect-paper/10 max-w-7xl mx-auto px-8 lg:px-20 w-full py-6 flex items-center justify-between">
          <span className="font-mono text-[11px] text-chrome tracking-widest">LITE OPS / AG003</span>
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
              Six opérateurs. Un résultat expliqué.
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
      {/* SECTION 5 — SCREENSHOTS (placeholder — en développement)         */}
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

          <SectionReveal delay={0.1}>
            <div className="border border-rule bg-warm-paper overflow-hidden">
              {/* Browser chrome mock */}
              <div className="bg-system-green flex items-center gap-2 px-4 py-2.5">
                <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                <span className="h-2 w-2 rounded-full bg-architect-paper/20" />
                <span className="flex-1 mx-4 h-4 bg-architect-paper/15 border border-architect-paper/10 font-mono text-[11px] text-chrome-light text-center leading-4 tracking-wider">
                  matchmaker.liteops.fr
                </span>
              </div>

              {/* Placeholder content */}
              <div className="flex flex-col items-center justify-center py-24 px-8 blueprint-grid">
                <div className="text-center max-w-md">
                  {/* Radar chart placeholder */}
                  <div className="mx-auto mb-8 w-48 h-48 relative">
                    <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                      {/* Radar grid */}
                      {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                        <polygon
                          key={i}
                          points={Array.from({ length: 5 }, (_, j) => {
                            const angle = (j * 72 - 90) * Math.PI / 180;
                            const x = 100 + r * 80 * Math.cos(angle);
                            const y = 100 + r * 80 * Math.sin(angle);
                            return `${x},${y}`;
                          }).join(" ")}
                          fill="none"
                          stroke="#9A968E"
                          strokeWidth="0.8"
                        />
                      ))}
                      {/* Radar axes */}
                      {Array.from({ length: 5 }, (_, j) => {
                        const angle = (j * 72 - 90) * Math.PI / 180;
                        return (
                          <line
                            key={j}
                            x1="100" y1="100"
                            x2={100 + 80 * Math.cos(angle)}
                            y2={100 + 80 * Math.sin(angle)}
                            stroke="#B8B5AE"
                            strokeWidth="0.8"
                          />
                        );
                      })}
                      {/* Sample data polygon */}
                      <polygon
                        points={[0.95, 0.88, 0.94, 0.87, 0.91].map((v, j) => {
                          const angle = (j * 72 - 90) * Math.PI / 180;
                          const x = 100 + v * 80 * Math.cos(angle);
                          const y = 100 + v * 80 * Math.sin(angle);
                          return `${x},${y}`;
                        }).join(" ")}
                        fill="rgba(165,217,0,0.1)"
                        stroke="#A5D900"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>

                  <p className="font-mono text-[11px] tracking-widest text-steel uppercase mb-3">
                    En cours de développement
                  </p>
                  <p className="font-sans text-sm text-ink/50 leading-relaxed mb-6">
                    Les interfaces de Matchmaker sont en cours de conception. Le diagramme radar est au cœur de l'expérience — chaque matching retourne un score visuel expliqué.
                  </p>

                  <a
                    href="mailto:contact@lite-ops.com?subject=Intérêt MATCHMAKER AG003"
                    className="group inline-flex items-center gap-2 border border-rule text-steel font-mono text-xs tracking-widest uppercase px-6 py-3 hover:border-chrome-dark hover:text-ink transition-all duration-200"
                  >
                    Exprimer mon intérêt
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </SectionReveal>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    style={{ fontSize: "clamp(1rem, 1.3vw, 1.2rem)" }}
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
            <p className="mt-3 font-mono text-xs text-steel tracking-widest">
              Tarifs indicatifs — agent en cours de développement.
            </p>
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
                      href="mailto:contact@lite-ops.com?subject=MATCHMAKER - Intérêt tarif"
                      className={[
                        "group inline-flex items-center gap-2 w-full justify-center border px-6 py-3 font-mono text-xs tracking-widest uppercase transition-all duration-200",
                        tier.highlight
                          ? "border-signal-green-text text-signal-green-text hover:bg-signal-green hover:text-system-green"
                          : "border-rule text-steel hover:border-chrome-dark hover:text-ink",
                      ].join(" ")}
                    >
                      M'alerter au lancement
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

            {/* SAILOR */}
            <SectionReveal delay={0.1}>
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
          </div>
        </div>
      </section>

    </div>
  );
}
