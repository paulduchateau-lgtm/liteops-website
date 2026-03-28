"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const ES = [0.22, 1, 0.36, 1] as [number, number, number, number];

type AgentCard = {
  code: string;
  name: string;
  status: "ACTIF" | "EN DÉVELOPPEMENT";
  tagline: string;
  description: string;
  photo: string;
  href: string;
  operators: string[];
  variants: { code: string; label: string }[];
};

const AGENTS: AgentCard[] = [
  {
    code: "AG001",
    name: "PILOT",
    status: "ACTIF",
    tagline: "Data Analytics par chatbot",
    description:
      "Requêtez votre base de données en langage naturel. Analysez, explorez, générez des rapports — sans écrire une ligne de SQL.",
    photo: "/photos/photo-1679587246899-8b9172fc78e2.avif",
    href: "/agents/pilot",
    operators: ["DATA LAYER", "TEXT TO SQL", "LLM", "GRAPH GEN"],
    variants: [
      { code: "PA-01", label: "Risques & RH" },
      { code: "PA-02", label: "Data Employés" },
    ],
  },
  {
    code: "AG002",
    name: "SAILOR",
    status: "ACTIF",
    tagline: "Base documentaire intelligente",
    description:
      "Transformez votre base documentaire en chatbot à sources citées. Chaque réponse est ancrée dans le corpus. Zéro hallucination.",
    photo: "/photos/photo-1553748024-dd3fd69ab116.avif",
    href: "/agents/sailor",
    operators: ["DATA LAYER", "OCR", "DOC UNDERSTANDING", "RAG", "LLM"],
    variants: [
      { code: "SA-01", label: "Acquisition" },
      { code: "SA-02", label: "Process / Gestion" },
    ],
  },
  {
    code: "AG003",
    name: "MATCHMAKER",
    status: "EN DÉVELOPPEMENT",
    tagline: "Matching ressources–besoins",
    description:
      "Faites correspondre vos ressources aux besoins. Humaines, matérielles, services ou produits — avec scoring structuré et diagramme radar.",
    photo: "/photos/photo-1739086759198-b99a6e3f8599.avif",
    href: "/agents/matchmaker",
    operators: ["DATA LAYER", "EMBEDDING", "NLP PARSER", "MATCH ENGINE", "SCORER", "CONV AGENT"],
    variants: [
      { code: "MA-01", label: "Ressources RH" },
      { code: "MA-02", label: "Conseil" },
      { code: "MA-03", label: "Commercial" },
    ],
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

function AgentCardComponent({ agent, index }: { agent: AgentCard; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 0.12}>
      <Link
        href={agent.href}
        className="group block relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-green"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={`${agent.code} ${agent.name} — ${agent.description}`}
      >
        {/* Photo background */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={agent.photo}
            alt={`${agent.name} agent visual`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          {/* Dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-system-green/95 via-system-green/40 to-system-green/10" />

          {/* Hover glass */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-0 bg-system-green/20 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-8">
            {/* Top: Status + Code */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "ACTIF" ? "bg-signal-green" : "bg-steel"
                  }`}
                />
                <span
                  className={`font-mono text-[10px] tracking-[0.2em] uppercase ${
                    agent.status === "ACTIF" ? "text-signal-green" : "text-steel"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <span className="font-mono text-[10px] text-chrome-dark tracking-widest uppercase">
                {agent.code}
              </span>
            </div>

            {/* Bottom: Info */}
            <div>
              {/* Agent name */}
              <h2 className="font-sans font-light text-architect-paper leading-none mb-2"
                style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
              >
                {agent.name}
              </h2>

              {/* Tagline */}
              <p className="font-mono text-xs text-signal-green tracking-wider uppercase mb-4">
                {agent.tagline}
              </p>

              {/* Description */}
              <p className="font-sans text-sm text-architect-paper/70 leading-relaxed mb-6 max-w-sm">
                {agent.description}
              </p>

              {/* Operators pipeline */}
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                {agent.operators.map((op, i) => (
                  <span key={op} className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-architect-paper/50 tracking-wider uppercase px-1.5 py-0.5 border border-architect-paper/15">
                      {op}
                    </span>
                    {i < agent.operators.length - 1 && (
                      <span className="text-chrome-dark text-[9px]" aria-hidden="true">→</span>
                    )}
                  </span>
                ))}
              </div>

              {/* Variants */}
              <div className="flex flex-wrap gap-2 mb-6">
                {agent.variants.map((v) => (
                  <div
                    key={v.code}
                    className="px-2 py-1 border border-architect-paper/20 bg-architect-paper/10 backdrop-blur-sm"
                  >
                    <span className="font-mono text-[10px] text-architect-paper/60 tracking-wider uppercase">
                      {v.code}
                    </span>
                    <span className="font-mono text-[10px] text-architect-paper/40 ml-1.5 tracking-wider">
                      {v.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA arrow */}
              <div className="flex items-center gap-2 text-signal-green font-mono text-xs tracking-widest uppercase">
                <span>Voir l&apos;agent</span>
                <motion.span
                  animate={{ x: hovered ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-system-green pt-32 pb-20 lg:pt-40 lg:pb-28 blueprint-grid">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ES }}
          >
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-4">
              Agents
            </span>
            <h1
              className="font-sans font-light text-architect-paper leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)" }}
            >
              Trois agents.
              <br />
              Un but.
            </h1>
            <p className="text-lg text-architect-paper/60 font-sans max-w-lg leading-relaxed">
              Chaque agent assemble des opérateurs spécialisés pour résoudre un problème métier précis.
              Pipeline documenté. Résultat mesurable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Agent Cards Grid */}
      <section className="bg-architect-paper py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {AGENTS.map((agent, i) => (
              <AgentCardComponent key={agent.code} agent={agent} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-warm-paper py-24 lg:py-32 border-t border-chrome-light/50">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <Reveal className="mb-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-chrome-dark block mb-3">
              Comparaison
            </span>
            <h2
              className="font-sans font-light text-system-green leading-tight"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
            >
              Quel agent pour quel besoin ?
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-chrome">
                    <th className="text-left py-4 pr-6 font-mono text-[10px] tracking-[0.2em] uppercase text-steel w-1/4">
                      &nbsp;
                    </th>
                    {AGENTS.map((a) => (
                      <th
                        key={a.code}
                        className="text-left py-4 px-4 font-mono text-[10px] tracking-[0.2em] uppercase text-ink w-1/4"
                      >
                        <span className="text-chrome-dark">{a.code}</span>
                        <span className="ml-2">{a.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-sans text-sm text-ink/70">
                  {[
                    {
                      label: "Input",
                      values: ["Base de données SQL", "Documents (PDF, DOCX…)", "Fiche de poste, AO, besoin"],
                    },
                    {
                      label: "Output",
                      values: ["Rapports & graphiques", "Réponses sourcées", "Ressources scorées + radar"],
                    },
                    {
                      label: "Pipeline",
                      values: ["4 opérateurs", "5 opérateurs", "6 opérateurs"],
                    },
                    {
                      label: "Variantes",
                      values: ["Risques & RH, Data Employés", "Acquisition, Process", "RH, Conseil, Commercial"],
                    },
                    {
                      label: "Déploiement",
                      values: ["< 5 jours", "< 5 jours", "< 7 jours"],
                    },
                    {
                      label: "Statut",
                      values: ["Actif", "Actif", "En développement"],
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-chrome-light/50">
                      <td className="py-3 pr-6 font-mono text-[10px] tracking-wider uppercase text-steel align-top">
                        {row.label}
                      </td>
                      {row.values.map((val, i) => (
                        <td key={i} className="py-3 px-4 align-top">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-system-green py-20 lg:py-28 text-center">
        <div className="max-w-3xl mx-auto px-8 lg:px-20">
          <Reveal>
            <p
              className="font-sans font-light text-architect-paper/90 leading-tight mb-8"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)" }}
            >
              Un agent ne fait pas tout.
              <br />
              Il fait une chose, très bien.
            </p>
            <Link
              href="/custom"
              className="inline-flex items-center gap-2 font-mono text-sm tracking-widest uppercase text-signal-green hover:text-architect-paper transition-colors duration-200"
            >
              Construire un système sur mesure
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
