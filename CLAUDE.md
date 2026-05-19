# CLAUDE.md — The Shared Nervous System

Monorepo for shared packages consumed by Zmuuzn laboratory experiments. Uses **npm workspaces** to manage multiple packages under `packages/`.

## Monorepo Structure

```
packages/
└── lab-nav/          # @goosterhof/lab-nav — Vue 3 navigation component library
package.json          # Workspace root (private, delegates to packages)
.npmrc                # GitHub Packages auth scope
.github/workflows/    # CI: quality gates + publish (runs across all workspaces)
```

Each package is **fully self-contained** — its own `vite.config.ts`, `vitest.config.ts`, `uno.config.ts`, `tsconfig.json`, and `package.json`. No shared root configs. Adding a new package is as simple as creating a new directory under `packages/`.

### Root Commands (run across all packages)

```bash
npm run check          # Full pipeline for all packages
npm run build          # Build all packages
npm run test           # Test all packages
npm run dev            # Dev server for lab-nav (single package)
```

### Per-Package Commands

```bash
npm run check -w packages/lab-nav    # Quality gates for lab-nav only
npm run build -w packages/lab-nav    # Build lab-nav only
npm run test -w packages/lab-nav     # Test lab-nav only
```

### Adding a New Package

1. Create `packages/<name>/` with its own `package.json`, configs, `src/`, `tests/`
2. Run `npm install` from root to link the new workspace
3. Root scripts automatically include it via `--workspaces`

## Packages

### `@goosterhof/lab-nav` — Navigation Component Library

Shared Vue 3 navigation bar connecting all experiments under `*.zmuuzn.nl`.

#### Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode, `vue-tsc` for type-checking)
- **UnoCSS** (attributify syntax — `uno.config.ts` defines theme tokens, shortcuts, preflights, and keyframes)
- **Vitest** + `happy-dom` + `@vue/test-utils` for testing
- **OxLint** + **OxFmt** for lint and format

#### Distribution Model

Compiled library published to **GitHub Packages** as `@goosterhof/lab-nav`. Vite library mode compiles `.vue` and `.ts` source into:
- `dist/lab-nav.js` — ES module bundle (vue + vue-router externalized)
- `dist/lab-nav.css` — UnoCSS utilities extracted during build
- `dist/*.d.ts` — TypeScript declarations generated via `vite-plugin-dts`

Consumers install from GitHub Packages:
```bash
npm install @goosterhof/lab-nav
```

Consumers import components and the bundled CSS:
```ts
import { LabBar, LabBarMobile } from "@goosterhof/lab-nav";
import "@goosterhof/lab-nav/style.css";
```

No UnoCSS config or tsconfig changes needed in consumers — the package ships compiled JS, CSS, and type declarations.

#### Directory Structure

```
packages/lab-nav/
├── src/
│   ├── index.ts                    # Barrel export
│   ├── types.ts                    # ExperimentId, LabUser, LocalNavItem, ExperimentConfig (incl. exitLabel)
│   ├── experiments.ts              # Experiment registry (6 experiments) — union-synchronized
│   ├── fonts.css                   # Google Fonts @import (Epilogue, IBM Plex Mono)
│   ├── components/
│   │   ├── LabMap.vue              # Compass-rose button + popover housing the laboratory miniature
│   │   ├── LaboratoryMiniature.vue # Perspective-tilted floor plan with visit-history ghost glows
│   │   ├── RoomTile.vue            # Per-experiment tile: accent shadows, YOU ARE HERE badge, departure animation
│   │   ├── BrandMark.vue           # Three-segment pill: stars | wordmark | app name
│   │   ├── LabBar.vue              # Desktop: two-tier nav (lab bar + local nav)
│   │   ├── LabBarMobile.vue        # Mobile: hamburger → slide-out drawer
│   │   ├── ExperimentSwitcher.vue  # Horizontal experiment list with active indicator
│   │   └── UserMenu.vue            # User name + experiment-aware exit dropdown
│   └── composables/
│       ├── useRegistryFetcher.ts   # Courier to auth.zmuuzn.nl/api/experiments; TS-derived offline fallback
│       └── useVisitHistory.ts      # localStorage footprint ledger — records, reads, formats visit timestamps
├── tests/
│   ├── BrandMark.spec.ts
│   ├── experiments.spec.ts
│   ├── ExperimentSwitcher.spec.ts
│   ├── UserMenu.spec.ts
│   ├── LabBar.spec.ts
│   └── LabBarMobile.spec.ts
├── vite.config.ts                  # Library build config
├── vitest.config.ts                # Test config (happy-dom)
├── uno.config.ts                   # UnoCSS theme + shortcuts
├── tsconfig.json / tsconfig.build.json
├── oxlintrc.json                   # Lint rules
└── package.json                    # Package manifest (v1.2.0)
```

### Key Patterns

- **Cross-subdomain links** use `<a href>` (full page navigation between experiments)
- **Local nav** uses `<router-link>` (SPA navigation within an experiment)
- **UnoCSS theme tokens** (`bg-lab-bg`, `text-lab-active`, `border-lab-border`) for static colors; inline `:style` only for dynamic values (accent colors, active/inactive state)
- **BrandMark pill** uses computed size token objects for sm/xs variants — all sizing in one computed, no conditional CSS classes
- **`vue` and `vue-router`** are `peerDependencies` to avoid duplicate instances
- **Active state detection**: Experiments use `currentExperiment` prop; local nav uses `isActive` on `LocalNavItem`
- **Accent colors**: Derived automatically from the experiment registry based on `currentExperiment`

## The LabMap v1.0.0 Surface

The headline export of the v1.0.0 release. A persistent compass-rose button anchored to the corner of every experiment — press it and the laboratory floor plan rises from the void: six room tiles, each one breathing with visit-history ghost glows, the active room stamped with a **YOU ARE HERE** badge in its accent color. The surface is self-contained and requires nothing from the consumer except a `current` prop.

### `<LabMap>`

The orchestrator. Renders the compass-rose button and owns the popover lifecycle — open/close, escape-key dismiss, click-outside dismiss, direction detection (opens up unless the button is too close to the top edge, where it inverts to down). Fires `useRegistryFetcher` on first open; shows `"Mapping the laboratory..."` while the registry resolves.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `current` | `ExperimentId` | Yes | — | The experiment the consumer is running in — determines the YOU ARE HERE badge |
| `position` | `'bottom-right' \| 'bottom-left'` | No | `'bottom-right'` | Corner anchor for the button and popover |

The button is `position: fixed` at `z-index: 9990` — it floats above the experiment's own layout. The popover teleports to `<body>` at `z-index: 9991`.

### `<LaboratoryMiniature>`

The floor plan itself. Renders the six room tiles in a 3-column CSS grid with `perspective: 800px` and an 8-degree `rotateX` tilt — the laboratory seen from a high angle, like looking down at a lit diorama. Manages the departure animation state: when a tile is clicked, its sibling tiles fade to 15% opacity and blur while the departing tile scales up and brightens before navigation fires.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `experiments` | `RegistryExperiment[]` | Yes | The registry list — passed in from LabMap after the registry fetch resolves |
| `current` | `ExperimentId` | Yes | Active experiment — forwarded to each RoomTile |
| `visible` | `boolean` | Yes | Controls per-tile entrance animation stagger (30ms per tile, zeroed when hidden) |

Emits `navigate(url: string)` — LabMap catches it and sets `globalThis.location.href`.

`prefers-reduced-motion` strips the perspective tilt and all transitions globally.

### `<RoomTile>`

The per-experiment surface. Each tile knows its own accent color, shadow color (from `EXPERIMENT_SHADOW_COLORS` — a darkened accent for the hard offset shadow underneath), visit history, and per-experiment visual character expressed as inset box-shadows:

| Experiment | Signature detail |
|------------|-----------------|
| Gatekeeper | Reinforced left edge — the vault door hinge |
| War Table | Double-thick inset on all sides — military fortification |
| Crucible | Hot-floor bottom glow — the forge floor |
| Smokestacks | Pipe emerging from the roof — `borderTopColor` always lit |
| Parlour | Rounded corners (`8px`) — the only room with soft edges |
| Horadrim | No inset signature — the codex speaks through crimson alone |

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `experiment` | `RegistryExperiment` | Yes | The experiment this tile represents |
| `current` | `ExperimentId` | Yes | Determines the YOU ARE HERE badge and accent-colored hard shadow |
| `lastVisited` | `string` | Yes | Human-readable timestamp from `useVisitHistory` (e.g. "3 hours ago") |
| `visitCount` | `number` | Yes | Raw count — drives the ghost glow intensity (saturates at 20 visits) |
| `departing` | `boolean` | Yes | True while the navigation departure animation is running |
| `siblingFade` | `boolean` | Yes | True on all non-departing tiles when a sibling is departing |

### `useRegistryFetcher`

The courier between the LabMap and the Gatekeeper's live registry. Fetches `https://auth.zmuuzn.nl/api/experiments` on first open, caches the result in module scope for 5 minutes (shared across all LabMap instances on the same page), and falls back to the bundled snapshot derived from `experiments.ts` when the endpoint is unreachable or returns an empty list.

```ts
import { useRegistryFetcher } from "@goosterhof/lab-nav"; // internal — not a public export

const { experiments, loading, error, fetch } = useRegistryFetcher();
```

Returns:

| Key | Type | Description |
|-----|------|-------------|
| `experiments` | `Ref<RegistryExperiment[]>` | The registry list — empty until `fetch()` resolves |
| `loading` | `Ref<boolean>` | True during the in-flight request |
| `error` | `Ref<string \| null>` | Last error message if the fetch failed; null on success |
| `fetch` | `() => Promise<void>` | Trigger the fetch (no-ops on cache hit) |

The fallback is structurally derived from the TypeScript registry — not a parallel JSON file. If the live registry goes dark, consumers see the bundled snapshot. The snapshot is never stale relative to the type system.

### `useVisitHistory`

The localStorage footprint ledger. Records every experiment visit by `ExperimentId` under `lab-nav-visits`, reads back human-readable timestamps, and surfaces visit counts that drive the ghost glow intensity on `RoomTile`.

```ts
import { useVisitHistory } from "@goosterhof/lab-nav"; // internal — not a public export

const { recordVisit, getLastVisited, getVisitCount } = useVisitHistory();
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `recordVisit` | `(id: ExperimentId) => void` | Increments count + timestamps the visit; called by LabMap on mount |
| `getLastVisited` | `(id: ExperimentId) => string` | Returns a relative time string ("3 hours ago", "Not yet visited") |
| `getVisitCount` | `(id: ExperimentId) => number` | Raw visit count — 0 for unvisited experiments |

localStorage failures (full storage, unavailable in SSR contexts) degrade silently — the ledger returns zero counts and "Not yet visited" strings rather than throwing.


## Design Tokens

Defined in `uno.config.ts` under `theme.colors.lab` — produces UnoCSS utilities like `bg-lab-bg`, `text-lab-active`:

| Token | UnoCSS | Value | Usage |
|-------|--------|-------|-------|
| Background | `lab-bg` | `#0F0F1F` | Bar and drawer background |
| Surface | `lab-surface` | `#1A1A2E` | Elevated surfaces |
| Border | `lab-border` | `#2E2E52` | Separators between rows and sections |
| Text (muted) | `lab-muted` | `#9E9EBF` | Inactive items, labels |
| Text (active) | `lab-active` | `#F5F0E8` | Active/hover items, user name (--zv-white) |
| Gold | `lab-gold` | `#F0D040` | Wordmark, focus rings, brand mark stars (--zv-gold) |
| Active indicator | — | Per-experiment `accentColor` | Bottom border + glow (desktop), left border (mobile) |

### UnoCSS Shortcuts

| Shortcut | Purpose |
|----------|---------|
| `lab-font-display` | Epilogue font stack |
| `lab-font-mono` | IBM Plex Mono font stack |
| `lab-focus` | Gold focus-visible outline (2px, offset 2) |
| `lab-nav-link` | Mono font, uppercase, tracking, transition |
| `lab-section-label` | Mono font, xs, uppercase, muted |
| `lab-ghost-btn` | Transparent bg, no border, cursor pointer |

### Experiment Accent Colors

| Experiment | Color | Hex |
|------------|-------|-----|
| Gatekeeper | Amber | `#D97706` |
| War Table | Gold | `#FFD100` |
| Crucible | Strava Orange | `#FC4C02` |
| Parlour | Violet | `#7C3AED` |
| Smokestacks | Green | `#22C55E` |
| Horadrim | Crimson | `#C8102E` |

### Typography

Fonts are loaded via `src/fonts.css` (imported before `virtual:uno.css` in `index.ts`, compiled into `dist/lab-nav.css`):

| Token | Font | Weight | Usage |
|-------|------|--------|-------|
| `lab-font-display` | Epilogue | 800–900 | BrandMark wordmark (900), section labels |
| `lab-font-mono` | IBM Plex Mono | 400–600 | Experiment names, nav links, user menu, section headers |

Both are UnoCSS shortcuts defined in `uno.config.ts`. Fallback stacks ensure graceful degradation if fonts fail to load.

### Animations

Keyframes defined in UnoCSS preflights:

| Animation | Duration | Usage |
|-----------|----------|-------|
| `lab-glow-pulse` | 3s infinite | Breathing glow on active experiment status dot (staggered per-experiment via `animation-delay`) |
| `lab-dot-arrive` | 300ms once | One-shot arrival flash — glow expands from 6px to 14px and settles back on active dot |
| `slide-in-right` | 250ms | Mobile drawer slide-in from right |

Additional transitions via Vue `<Transition>` component:
- **UserMenu dropdown**: 150ms fade + translateY enter, 100ms leave
- **Mobile drawer overlay**: 250ms opacity enter, 200ms leave
- **Backdrop**: `backdrop-blur-sm` (4px blur)

## Commands

From the **repo root**:
```bash
npm run check          # Full pipeline across all workspaces
npm run build          # Build all packages
npm run test           # Test all packages
```

From **inside a package** (e.g., `packages/lab-nav/`), or with `-w`:
```bash
npm run check -w packages/lab-nav    # Full pipeline: type-check + lint + format:check + test
npm run build -w packages/lab-nav    # Vite library build → dist/
npm run test -w packages/lab-nav     # vitest run
npm run format -w packages/lab-nav   # oxfmt --write src/ tests/
```

## Conventions

- **Always run `npm run check`** (from root or with `-w`) before committing changes
- **Always run `npm run format`** after any code changes (OxFmt enforces consistent style)
- **UnoCSS in build**: `uno.config.ts` provides `presetUno` + `presetAttributify` + theme tokens + shortcuts + preflights (fonts, keyframes, `prefers-reduced-motion`) for CSS extraction during `vite build`. Use theme utilities (`bg-lab-bg`, `text-lab-active`) for static colors. Avoid `text="[#hex]"` attributify on `<a>` elements — it collides with the DOM `text` property
- **Test `.vue` components** with `Teleport` stubbed (`global: { stubs: { Teleport: true } }`) so drawer content renders inline for assertions

## Accessibility

- **Focus indicators**: Gold `focus-visible` outlines via `lab-focus` shortcut on all interactive elements
- **Escape key handlers**: UserMenu dropdown and LabBarMobile drawer close on Escape, returning focus to trigger
- **Reduced motion**: `prefers-reduced-motion` preflight disables all animations and transitions globally
- **Contrast**: All text meets WCAG AA against dark backgrounds (lab-active on lab-bg: 16.8:1, lab-muted on lab-bg: 7.2:1)

## Known Limitations & Tech Debt

- **Version bumping is manual**: Publish to GitHub Packages requires incrementing `version` in `package.json` — CI does not auto-bump
- **Experiment registry (partially mitigated)**: Adding a new experiment still requires three manual edits — `src/types.ts` (the `ExperimentId` union), `src/experiments.ts` (the registry), and `EXPERIMENT_SHADOW_COLORS` (the shadow palette in `src/types.ts`). However, the `ALL_EXPERIMENT_IDS` tuple in `experiments.spec.ts` uses `satisfies readonly ExperimentId[]` to make union-exhaustiveness a TypeScript compile error; the registry-sync deputy tests then fail loudly if the runtime registry or shadow map lags the union. Drift that once required human vigilance now requires a contributor to consciously suppress TS errors and three failing tests.
- **Font loading dependency**: Google Fonts loaded via CSS `@import` — `display=swap` prevents FOIT but initial render uses fallback fonts
- **BrandMark inline styles**: Brand colors (#C8102E red, #1A1A1A black) in BrandMark use inline `:style` since they're brand-specific, not lab theme tokens
