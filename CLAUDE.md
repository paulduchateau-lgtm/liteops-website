@../CLAUDE.md

# liteops-website — CLAUDE.md
**REF-DS/CLAUDE/WEBSITE v1.1 — 2026-04-03**

## Identite

- **Tier design :** T1 — Public
- **URL :** liteops-website.vercel.app
- **Perimetre :** Vitrine publique — presentation des agents, operateurs, systemes, partner programme

## Stack technique

| Couche | Tech |
|--------|------|
| Framework | Next.js 15 |
| CSS | CSS Modules + globals + Tailwind |
| Fonts | DM Sans + JetBrains Mono (Google Fonts) |
| Images | Photos desert proprietaires (`photosdesert/`) + photos staff (`photosstaff/`) |
| Deploy | Vercel |

## Structure

```
liteops-website/
├── src/
│   ├── app/
│   │   ├── page.tsx            ← Home
│   │   ├── agents/page.tsx     ← Listing agents (cards)
│   │   ├── agents/[slug]/      ← Detail agent
│   │   ├── operators/          ← Listing operateurs
│   │   └── ...
│   ├── components/
│   │   ├── Navigation.tsx      ← Nav avec scroll-based contrast
│   │   └── ...
│   └── styles/
├── photosdesert/               ← Photos desert proprietaires
├── photosstaff/                ← Photos equipe
└── BRAND_GUIDELINES.md         ← Legacy, source de verite = @../CLAUDE.md
```

## Regles T1 strictes

Ce projet est le **seul** a utiliser :
- Photos desert (dunes, vallees, horizons, aretes)
- Pattern grain SVG (`ds-grain`)
- Background principal `#F0EEEB` (Architect Paper)
- Zero border-radius — absolu

## Navigation (Sprint 4)

La navigation a un comportement **scroll-based** :

- **En haut de page** (fond sombre/hero) : logo et liens en **blanc** (`text-architect-paper`)
- **Apres scroll** (fond clair) : logo et liens en **sombre** (`text-ink`)
- Transition smooth `duration-300` sur tous les elements
- Le hamburger mobile suit la meme logique

Implementation : prop `light` calculee depuis `scrolled` state dans `Navigation.tsx`.

## Agent Cards (Sprint 4)

Les cards agents sur `/agents` ont ete corrigees :

- **Status badge** : pill mono (pas dot+texte). ACTIF = fond vert + texte dark. Autres = border subtile
- **Titre** : `clamp(1.6rem, 3vw, 2.4rem)` pour eviter overflow
- **Tagline** : `line-clamp-1` pour eviter debordement
- **Operateurs** : max 4 affiches + badge `+N` si plus
- **Description** : `line-clamp-2`

## Note sur BRAND_GUIDELINES.md

Le fichier `BRAND_GUIDELINES.md` est **redondant** avec `@../CLAUDE.md`.
Conserve pour reference historique. La source de verite est le root `CLAUDE.md`.
