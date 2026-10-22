# Seospace public design system: "Studio Paper"

Anti-slop rules (apply to every public page):
- NO gradients (text, buttons, backgrounds). Flat colour, photography and tactile cards only.
- NO Lucide/icon-in-rounded-square feature cards. Use big numerals, mono labels, typographic glyphs (↗ → + ✓ ×), real product-UI mini-mockups, and photos.
- NO centred "headline + 3 identical cards" grids. Use split, asymmetric, ruled-list, diagonal and tilted layouts.
- NO Inter / Roboto / serif. Fonts: `font-display` (Bricolage Grotesque, headlines), `font-sans` (Instrument Sans, body), `font-mono` (JetBrains Mono, labels/data).
- ONE hot accent (vermilion) + cobalt and butter-yellow as secondary colour blocks. Black pill buttons.

Theme: CSS variables set on `<html data-sp-theme="light|dark">` (toggle via `usePublicTheme`). Use token classes only; never write `isDark ? ... : ...` colour conditionals.

| class | meaning |
|---|---|
| `bg-paper` / `text-ink` | page bg / main text |
| `bg-card` | raised surface |
| `bg-stage` | large rounded "stage" panels |
| `text-mute` | secondary text |
| `border-line` | hairlines |
| `bg-accent` (text `text-[#141413]`) | vermilion highlight blocks |
| `bg-cobalt text-white` | cobalt colour-block sections |
| `bg-butter text-[#141413]` | butter-yellow sticky notes / blocks |
| `bg-night text-[#F3F0E8]` | always-dark sections (same in both themes) |

Utility classes (globals.css): `sp-display` (headline), `sp-eyebrow` (mono label), `sp-btn sp-btn-primary|sp-btn-ghost|sp-btn-accent`, `sp-stage` (rounded stage with dot texture), `sp-dots`, `sp-tilt-l|r|l2|r2`, `sp-diag-top|bot|both` (+ `sp-pull` negative margin), `sp-bob`, `sp-marquee`/`sp-marquee-track`, `sp-rule`.
Motion: add `data-reveal` (optional `data-delay="1..5"`) to any element for fade-up on scroll. `<CountUp/>` from `@/components/ui/Motion`.

Images in `/public/images/`: hero-portrait.jpg (orange backdrop portrait), team-review.jpg, clay-search.jpg, clay-dark.jpg, topo-lines.jpg, desk-flatlay.jpg, night-city-grid.jpg. Use `next/image` with `fill`/sizes and meaningful alt text.

Shared chrome: `PublicNavbar`, `PublicFooter`, `usePublicTheme`, `ThemeToggleButton` from `@/components/ui/PublicChrome`. Root wrapper of each page: `<div className="min-h-screen flex flex-col bg-paper text-ink font-sans">`.
