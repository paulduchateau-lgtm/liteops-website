@../CLAUDE.md

# liteops-website — CLAUDE.md
**REF-DS/CLAUDE/WEBSITE v1.0**

## Identité

- **Tier design :** T1 — Public
- **URL :** liteops-website.vercel.app
- **Périmètre :** Vitrine publique — présentation des agents, opérateurs, systèmes, partner programme

## Stack technique

| Couche | Tech |
|--------|------|
| Framework | Next.js 15 |
| CSS | CSS Modules + globals |
| Fonts | DM Sans + JetBrains Mono (Google Fonts) |
| Images | Unsplash (photos désert) + photos staff |
| Deploy | Vercel |

## Structure

```
liteops-website/
├── src/
│   ├── app/          ← App Router Next.js
│   ├── components/
│   └── styles/
├── photosdesert/     ← Photos désert propriétaires
├── photosstaff/      ← Photos équipe
└── BRAND_GUIDELINES.md  ← Legacy, remplacé par @../CLAUDE.md
```

## Règles T1 strictes

Ce projet est le **seul** à utiliser :
- Photos désert (dunes, vallées, horizons, arêtes)
- Pattern grain SVG (`ds-grain`)
- Background principal `#F0EEEB` (Architect Paper)
- Zéro border-radius — absolu

## Navigation

Structure de nav : `Opérateurs | Agents | Systèmes | Custom | À propos` + CTA "Demander une démo"

## Note sur BRAND_GUIDELINES.md

Le fichier `BRAND_GUIDELINES.md` présent dans ce projet est désormais **redondant** avec
`@../CLAUDE.md` et `docs/`. Il peut être conservé pour référence historique mais
n'est plus la source de vérité. La source de vérité est `@liteops/ds`.
