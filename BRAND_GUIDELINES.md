# LiteOps — Brand Guidelines

---

## Palette principale

The palette is intentionally desaturated — warm grays, not cold. Every tone carries a slight warm undertone (olive, sand, or amber bias). Cold blues, neutral grays, and pure whites are avoided.

### Background palette

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-architect-paper` | `#F0EEEB` | Architect Paper | Primary page background — the canonical surface |
| `--color-warm-paper` | `#F6F4F0` | Warm Paper | Lighter warm surface — elevated sections, hero areas |
| `--color-fog` | `#E9E6E1` | Fog | Card backgrounds, secondary surfaces |
| `--color-green-tint` | `#F2F3ED` | Green Tint | Barely-there background tint — code blocks, subtle callouts |

### Text colors

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-ink` | `#1C1C1A` | Ink | Primary text — headings, body copy, all critical readable content |
| `--color-system-green` | `#1E1D1B` | System Green | Almost black-olive — primary dark tone, alternate headings, dark surfaces |
| `--color-steel` | `#7D7A73` | Steel | Heavy labels, secondary headings, metadata |
| `--color-moss` | `#6B6B60` | Moss | Desaturated green-gray — tertiary text, captions |
| `--color-sage` | `#908E85` | Sage | Warm gray — placeholder text, disabled states, muted annotations |

### Signal colors

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-signal-green` | `#A5D900` | Signal Green | Active/live status indicators and primary CTAs — ONLY |

**Rule:** Signal green (`#A5D900`) is never used decoratively. It appears exclusively to communicate live system activity, online/active states, and primary call-to-action buttons. One instance per composition is the target. Overuse destroys its meaning.

### Chrome / metallic palette

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-chrome` | `#B8B5AE` | Chrome | Primary metallic accent — polished metal highlights, premium accents |
| `--color-chrome-light` | `#CDC9C2` | Chrome Light | Lighter metallic surface — gradient base, shimmer start |
| `--color-chrome-dark` | `#9A968E` | Chrome Dark | Darker metallic surface — gradient end, shadow side |
| `--color-rule` | `#D5D1CB` | Rule | Borders, dividers, hairlines — structural definition |

### Agent imagery accent colors

These tokens are used for chromatic hierarchy and illustration accents. They do not appear in the main UI palette but define the color language for agent and operator visual identity.

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-amber` | `#C4872E` | Amber | Agent specialists — warm gold, expertise, business logic |
| `--color-copper` | `#A0694A` | Copper | Orchestration systems — earth tone, strategy, integration layers |

### Functional colors

| Token | Hex | Name | Usage |
|---|---|---|---|
| `--color-alert` | `#B85A40` | Alert | Error states, warnings, destructive actions — muted terracotta, not alarming red |

---

## Chromatic hierarchy

The three-tier chromatic hierarchy maps color to function type, enabling users and operators to read system architecture at a glance.

| Tier | Color family | Tokens | Represents |
|---|---|---|---|
| Opérateurs | Vert technique | `system-green`, `ink`, `moss` | Infrastructure, execution, low-level operations |
| Agents | Ambre / doré | `amber` (`#C4872E`) | Business specialists, domain expertise, analytical layers |
| Systèmes | Cuivre / terre | `copper` (`#A0694A`) | Orchestration, strategy, cross-system integration |

This hierarchy is applied consistently in diagrams, agent cards, documentation, and any visual representation of system architecture.

---

## Typographie

### Font families

| Role | Family | Fallbacks |
|---|---|---|
| Primary | DM Sans | Helvetica Neue, Helvetica, Arial, sans-serif |
| Monospace | JetBrains Mono | Courier New, monospace |

**DM Sans** is used for all headings and body text. It carries the voice of the brand — clean, considered, and slightly humanist without being playful.

**JetBrains Mono** is reserved for technical content: labels, status indicators, code, version numbers, system annotations, and any content that must read as data rather than prose.

### Weight system

| Context | Weight | Notes |
|---|---|---|
| Desktop headings | 300 (Light) | Generous tracking, large sizes — refined and editorial |
| Mobile headings | 400 (Normal) | Legibility at smaller sizes takes priority over aesthetics |
| Body text | 400 (Normal) | Consistent across all viewport sizes |
| Mono labels | 400–500 | Pair with `UPPERCASE` and `tracking-widest` |

### Mono label pattern

All JetBrains Mono labels follow this pattern: `UPPERCASE` + `letter-spacing: widest`. This applies to section labels, status chips, category tags, system annotations, and any short-form technical identifier. It is a consistent visual signature of the brand.

Example: `INFRASTRUCTURE` / `LIVE` / `v2.4.1` / `AGENT CLASS`

---

## Imagerie

### Color direction

Photography and illustration should operate in this palette: amber, brown, copper, olive green, sage, golden light. Images should feel warm, material, and grounded.

### Forbidden colors in imagery

Rose, magenta, fuchsia, saturated violet, neon tones of any hue, and glossy 3D renders are not permitted in any LiteOps visual asset.

### Photographic themes

- Atelier and workshop environments
- Craft fabrication and manufacturing detail
- Engineering precision — tools, components, process
- Natural light — diffused, directional, golden hour

The imagery evokes craft, precision, and the workshop floor. It does not evoke Silicon Valley tech, startup culture, or abstract digital metaphors. Preferred subjects include physical processes, skilled hands at work, machinery detail, and materials under good light.

---

## Logo

```
LITE●OPS
```

- The wordmark is always `LITE●OPS` — uppercase, never mixed case
- The bullet `●` is a filled circle rendered in signal green (`#A5D900`)
- The bullet is the only element in the logo that carries color
- Typeface: DM Sans Medium
- Letter-spacing: `0.22em`
- The signal-green bullet is the sole chromatic accent — no other part of the logo is colored

**Clear space:** Maintain clear space equal to the cap-height of the logotype on all sides.

**Forbidden logo treatments:** Do not recolor the wordmark, do not use a non-circle bullet, do not apply the logo on backgrounds that reduce contrast below accessible thresholds, do not stretch or condense the letterforms.

---

## Design patterns

These recurring visual motifs define the LiteOps aesthetic. They provide texture, depth, and a sense of material quality without introducing noise.

### Blueprint grid

A subtle 48px grid overlay at low opacity applied to section backgrounds. It references technical drawing and engineering documentation. It should be visible on close inspection but invisible at a glance.

### Topographic lines

Organic, contour-map line patterns used as background texture in large surface areas. They add visual depth and evoke mapping, terrain, and systems thinking without being illustrative.

### Chrome shimmer

A metallic gradient built from `chrome-light` → `chrome` → `chrome-dark` for premium UI accents — hardware badges, plan tier indicators, surface highlights on interactive elements. It references precision tooling and polished metal.

### Grain overlay

A film grain texture at 4% opacity applied as a final layer over surfaces. It introduces analog warmth, prevents the design from reading as purely digital, and subtly grounds the UI in material reality.

---

## Spacing

LiteOps uses generous vertical rhythm. Density is avoided. White space is structural, not decorative.

### Sections

```
py-32 lg:py-40
```

Full-width sections use 128px vertical padding on desktop and 80px on mobile by default.

### Containers

```
max-w-7xl mx-auto px-8 lg:px-20
```

Content is constrained to `1280px` maximum width with `32px` horizontal padding on mobile and `80px` on desktop.

### Component gaps

| Scale | Value | Context |
|---|---|---|
| `gap-8` | 32px | Tight component groupings, inline elements |
| `gap-12` | 48px | Card grids, feature rows |
| `gap-16` | 64px | Section sub-divisions |
| `gap-20` | 80px | Major layout divisions |

Gap values are chosen based on the hierarchy of the content being separated. Greater visual distance signals greater structural distance.
