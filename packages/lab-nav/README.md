# @goosterhof/lab-nav

> The shared nervous system of the Zmuuzn laboratory — a Vue 3 navigation component library that connects every experiment under `*.zmuuzn.nl`.

One nav bar to rule them all. Switch between experiments with a click. Navigate within them with SPA-smooth transitions. Show who's logged in. Look *good* doing it — dark lab aesthetic, per-experiment accent colors, breathing glow animations, and full accessibility baked in from day one.

## Features

- **Responsive** — Desktop two-tier nav + mobile hamburger drawer, one import each
- **Zero config** — Ships pre-compiled JS, CSS, and TypeScript declarations. No UnoCSS or tsconfig changes in consumers
- **Per-experiment identity** — Each experiment gets its own accent color, applied automatically from the registry
- **Accessible** — WCAG AA/AAA contrast, focus-visible indicators, escape key handlers, reduced motion support
- **Type-safe** — Full TypeScript types for all components, props, and exported utilities
- **Lightweight** — 18KB JS + 11KB CSS (gzipped: 4KB + 2.5KB)

## Installation

```bash
npm install @goosterhof/lab-nav
```

GitHub Packages requires authentication. Add to your project's `.npmrc`:

```ini
@goosterhof:registry=https://npm.pkg.github.com
```

And authenticate with a personal access token that has `read:packages` scope:

```bash
npm login --registry=https://npm.pkg.github.com
```

## Quick Start

```vue
<script setup lang="ts">
import { LabBar, LabBarMobile } from "@goosterhof/lab-nav";
import type { ExperimentId, LabUser, LocalNavItem } from "@goosterhof/lab-nav";
import "@goosterhof/lab-nav/style.css";

const currentExperiment: ExperimentId = "war-table";
const user: LabUser = { name: "Goos" };

const localNav: LocalNavItem[] = [
  { label: "Missions", to: "/missions", isActive: true },
  { label: "Operatives", to: "/operatives" },
];

const handleLogout = () => {
  // your logout logic
};
</script>

<template>
  <!-- Desktop: hidden on mobile, visible from md breakpoint -->
  <LabBar
    :current-experiment="currentExperiment"
    :user="user"
    :local-nav="localNav"
    @logout="handleLogout"
  />

  <!-- Mobile: visible on mobile, hidden from md breakpoint -->
  <LabBarMobile
    :current-experiment="currentExperiment"
    :user="user"
    :local-nav="localNav"
    @logout="handleLogout"
  />
</template>
```

Both components handle their own responsive visibility (`hidden md:block` / `block md:hidden`). Use them together for full coverage.

## Components

### LabMap Surface (v1.0.0) — Primary Export

The headline surface of v1.0.0. A persistent compass-rose button anchored to the corner of every experiment — press it and the laboratory floor plan rises from the void: six room tiles, each one breathing with visit-history ghost glows, the active room stamped with a **YOU ARE HERE** badge in its accent color.

#### `<LabMap>`

The entry point. Import `LabMap` and mount it alongside your experiment's root. It manages the compass button, the popover, and the registry fetch — the consumer provides only the current experiment's id and an optional corner preference.

```vue
<script setup lang="ts">
import { LabMap } from "@goosterhof/lab-nav";
import "@goosterhof/lab-nav/style.css";
</script>

<template>
  <LabMap current="war-table" position="bottom-right" />
</template>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `current` | `ExperimentId` | Yes | — | Which experiment the consumer is running — drives the YOU ARE HERE badge and accent-colored hard shadow |
| `position` | `'bottom-right' \| 'bottom-left'` | No | `'bottom-right'` | Corner anchor for both the button and the popover |

The button renders `position: fixed` at `z-index: 9990`. The popover teleports to `<body>` at `z-index: 9991` — it floats above the experiment's own layout and never disrupts document flow.

**Popover direction:** Opens upward by default. If the button is within 280px of the top edge (less than the popover height + gap), it inverts to open downward. The direction is recalculated on every open.

**Loading state:** While `useRegistryFetcher` resolves the live registry, the popover shows `"Mapping the laboratory..."`. On error the fallback (bundled from `experiments.ts`) renders instantly — the map never stays empty.

**Accessibility:** `aria-expanded`, `aria-haspopup="dialog"`, Escape-to-close, focus returns to the button on close.

---

#### `<LaboratoryMiniature>`

The floor plan. A 3-column CSS grid of room tiles rendered with `perspective: 800px` and an 8-degree `rotateX` tilt — the laboratory seen from above, like a lit diorama. Not typically mounted directly; `<LabMap>` mounts it internally. Exposed as a named export if consumers need the floor plan without the compass button.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `experiments` | `RegistryExperiment[]` | Yes | The registry list — passed in from LabMap after the registry fetch resolves |
| `current` | `ExperimentId` | Yes | Active experiment — forwarded to each RoomTile for the YOU ARE HERE badge |
| `visible` | `boolean` | Yes | Controls the per-tile entrance animation stagger (30ms per tile index) |

Emits `navigate(url: string)`. After a tile is clicked, `LaboratoryMiniature` plays the departure animation (the departing tile brightens and scales; siblings fade to 15% opacity) before emitting the URL to `LabMap`, which then sets `globalThis.location.href`.

`prefers-reduced-motion` removes the perspective tilt and all transitions.

---

#### `<RoomTile>`

The per-experiment surface inside the floor plan. Each tile carries its accent color, a darkened shadow color (from `EXPERIMENT_SHADOW_COLORS`), visit history, and per-experiment visual character expressed as inset box-shadows:

| Experiment | Visual signature |
|------------|------------------|
| Gatekeeper | Reinforced left edge — the vault door hinge |
| War Table | Double-thick inset on all sides — military fortification |
| Crucible | Hot-floor bottom glow — `borderBottomColor` always lit |
| Smokestacks | Pipe emerging from the roof — `borderTopColor` always lit |
| Parlour | Rounded corners (8px) — the only room that curves |
| Horadrim | No inset signature — the codex speaks through crimson alone |

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `experiment` | `RegistryExperiment` | Yes | The experiment this tile represents |
| `current` | `ExperimentId` | Yes | Determines the YOU ARE HERE badge |
| `lastVisited` | `string` | Yes | Human-readable timestamp from `useVisitHistory` |
| `visitCount` | `number` | Yes | Raw count — drives ghost glow intensity (saturates at 20 visits) |
| `departing` | `boolean` | Yes | True while departure animation is running |
| `siblingFade` | `boolean` | Yes | True on all non-departing tiles when a sibling is departing |

---

### Navigation Bar Surface — Legacy (pre-v1.0.0)

The original `@goosterhof/lab-nav` surface. Fully supported; consumers on pre-v1.0.0 imports are unaffected. The LabMap and the navigation bar are independent surfaces — mount both if you want the compass button alongside the nav bar, or either one alone.

### `<LabBar>`

Desktop navigation — a two-tier bar with the lab brand, experiment switcher, user menu, and optional local navigation.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentExperiment` | `ExperimentId` | Yes | Which experiment is active |
| `user` | `LabUser` | Yes | Logged-in user (displays name) |
| `localNav` | `LocalNavItem[]` | Yes | In-app navigation items |

| Event | Payload | Description |
|-------|---------|-------------|
| `logout` | — | User clicked "Logout" |

| Slot | Description |
|------|-------------|
| `local-nav-end` | Content appended after local nav items |

**Layout:**
- **Row 1:** BrandMark | ExperimentSwitcher | UserMenu
- **Row 2:** Local nav links (rendered as `<router-link>`) with accent-colored active indicator

---

### `<LabBarMobile>`

Mobile navigation — a compact header bar with a hamburger button that opens a slide-out drawer.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentExperiment` | `ExperimentId` | Yes | Which experiment is active |
| `user` | `LabUser` | Yes | Logged-in user (displays name in drawer) |
| `localNav` | `LocalNavItem[]` | Yes | In-app navigation items |

| Event | Payload | Description |
|-------|---------|-------------|
| `logout` | — | User clicked "Logout" |

**Drawer sections:** Experiments | Navigation | Logout

**Interactions:**
- Hamburger button opens the drawer (slides in from right)
- Escape key or backdrop click closes the drawer
- Focus returns to the hamburger button after close

---

### `<BrandMark>`

The laboratory brand — a three-segment pill showing stars, the "zmuuzn" wordmark, and the current experiment name.

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `size` | `"sm" \| "xs"` | No | `"sm"` | Size variant (desktop / mobile) |
| `currentExperiment` | `ExperimentId` | No | — | Shows experiment name in third segment |

**Segments:**
1. Seven SVG stars on crimson (`#C8102E`)
2. "zmuuzn" wordmark in Epilogue 900
3. Experiment label in gold on dark background (only if `currentExperiment` is set)

---

### `<ExperimentSwitcher>`

Horizontal list of all laboratory experiments. The active one is highlighted with its accent color; others are links to their URLs.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentExperiment` | `ExperimentId` | Yes | Which experiment is active |

Active experiments show a breathing glow animation on their status dot. Inactive experiments link to their full URL (cross-subdomain navigation via `<a href>`).

---

### `<UserMenu>`

Dropdown menu showing the user's name with a logout button.

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `user` | `LabUser` | Yes | User to display |

| Event | Payload | Description |
|-------|---------|-------------|
| `logout` | — | User clicked "Logout" |

Opens on click, closes on click-outside or Escape. Focus returns to the trigger button after close.

## Types

```ts
type ExperimentId = "gatekeeper" | "war-table" | "crucible" | "parlour" | "smokestacks" | "horadrim";

interface ExperimentConfig {
  id: ExperimentId;
  label: string;
  url: string;
  accentColor: string;
}

interface LabUser {
  name: string;
}

interface LocalNavItem {
  label: string;
  to: string;
  isActive?: boolean;
}
```

Additional types introduced in v1.0.0:

```ts
interface RegistryExperiment {
  id: ExperimentId;
  label: string;
  url: string;
  accentColor: string;
  icon?: string;
}

interface VisitRecord {
  count: number;
  lastVisited: number; // Unix timestamp (ms)
}

// Shadow colors per experiment — darkened accent for hard offset shadows
const EXPERIMENT_SHADOW_COLORS: Record<ExperimentId, string>;
```

All types are exported from the main entry point:

```ts
import type {
  ExperimentId,
  LabUser,
  LocalNavItem,
  ExperimentConfig,
  RegistryExperiment,
  VisitRecord,
} from "@goosterhof/lab-nav";
import { EXPERIMENT_SHADOW_COLORS } from "@goosterhof/lab-nav";
```

## Composables

### `useRegistryFetcher`

The courier between `<LabMap>` and the Gatekeeper's live registry at `https://auth.zmuuzn.nl/api/experiments`. Fetches on first open, caches the result in module scope for 5 minutes (shared across all `<LabMap>` instances on the same page), and falls back to the bundled snapshot when the endpoint is unreachable or returns an empty list.

```ts
import { useRegistryFetcher } from "@goosterhof/lab-nav";

const { experiments, loading, error, fetch } = useRegistryFetcher();
```

| Return value | Type | Description |
|-------------|------|-------------|
| `experiments` | `Ref<RegistryExperiment[]>` | The registry list — empty array until `fetch()` resolves |
| `loading` | `Ref<boolean>` | True during the in-flight request |
| `error` | `Ref<string | null>` | Last error message if the fetch failed; `null` on success |
| `fetch` | `() => Promise<void>` | Triggers the fetch (no-ops on a valid cache hit) |

The fallback is structurally derived from the TypeScript registry (`experiments.ts`) — not a parallel JSON file. If the live registry goes dark, consumers see the bundled snapshot. The snapshot is never stale relative to the type system because it is built from the same source the TypeScript compiler checks.

---

### `useVisitHistory`

The localStorage footprint ledger. Records every experiment visit under `lab-nav-visits`, reads back human-readable relative timestamps, and surfaces visit counts that drive the ghost glow intensity on `<RoomTile>`.

```ts
import { useVisitHistory } from "@goosterhof/lab-nav";

const { recordVisit, getLastVisited, getVisitCount } = useVisitHistory();
```

| Function | Signature | Description |
|----------|-----------|-------------|
| `recordVisit` | `(id: ExperimentId) => void` | Increments count and timestamps the visit. Called by `<LabMap>` on mount — consumers do not need to call this manually |
| `getLastVisited` | `(id: ExperimentId) => string` | Returns a relative time string: "just now", "3 hours ago", "Not yet visited" |
| `getVisitCount` | `(id: ExperimentId) => number` | Raw visit count — 0 for experiments never visited in this browser |

localStorage failures (storage full, unavailable in SSR environments) degrade silently — the ledger returns zero counts and "Not yet visited" rather than throwing.

## Experiment Registry

The library ships a hardcoded registry of all laboratory experiments:

```ts
import { experiments } from "@goosterhof/lab-nav";
```

| Experiment | ID | Accent Color | Exit Ritual | URL |
|------------|----|-----------  |-------------|-----|
| Gatekeeper | `gatekeeper` | `#D97706` (amber) | "Leave the vault" | `auth.zmuuzn.nl` |
| War Table | `war-table` | `#FFD100` (gold) | "Dismiss" | `helldivers.zmuuzn.nl` |
| Crucible | `crucible` | `#FC4C02` (Strava orange) | "Exit the forge" | `strava.zmuuzn.nl` |
| Parlour | `parlour` | `#7C3AED` (violet) | "Leave the circle" | `parlour.zmuuzn.nl` |
| Smokestacks | `smokestacks` | `#22C55E` (green) | "Power down the factory" | `smokestacks.zmuuzn.nl` |
| Horadrim | `horadrim` | `#C8102E` (crimson) | "Close the codex" | `horadrim.zmuuzn.nl` |

Accent colors are applied automatically based on the `currentExperiment` prop — active indicators, glow effects, and border highlights all derive from the registry.

## Design System

### Colors

Dark laboratory palette defined as UnoCSS theme tokens:

| Token | Hex | Usage |
|-------|-----|-------|
| `lab-bg` | `#0F0F1F` | Bar and drawer background |
| `lab-surface` | `#1A1A2E` | Elevated surfaces (dropdowns) |
| `lab-border` | `#2E2E52` | Separators and dividers |
| `lab-muted` | `#9E9EBF` | Inactive items, labels |
| `lab-active` | `#F5F0E8` | Active items, user name |
| `lab-gold` | `#F0D040` | Wordmark, focus rings, brand stars |

### Typography

| Font | Family | Usage |
|------|--------|-------|
| **Epilogue** | Display (800–900) | Brand wordmark, section labels |
| **IBM Plex Mono** | Monospace (400–600) | Experiment names, nav links, user menu |

Fonts are bundled in the CSS via Google Fonts with `display=swap`.

### Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| `lab-glow-pulse` | 3s infinite | Breathing glow on active experiment status dot |
| `slide-in-right` | 250ms | Mobile drawer entrance |
| UserMenu transition | 150ms enter / 100ms leave | Dropdown fade + slide |

All animations respect `prefers-reduced-motion: reduce`.

## Accessibility

- **Focus indicators** — Gold `focus-visible` outlines (2px, offset 2) on all interactive elements
- **Keyboard navigation** — Escape closes UserMenu dropdown and mobile drawer, returning focus to trigger
- **WCAG contrast** — `lab-active` on `lab-bg`: 16.8:1 (AAA), `lab-muted` on `lab-bg`: 7.2:1 (AA)
- **Reduced motion** — All animations and transitions disabled when `prefers-reduced-motion: reduce` is active
- **Semantic HTML** — `<nav>`, `<header>`, ARIA labels on hamburger and close buttons

## Development

```bash
# From the monorepo root:
npm run check -w packages/lab-nav    # type-check + lint + format:check + test
npm run build -w packages/lab-nav    # Vite library build → dist/
npm run test -w packages/lab-nav     # Vitest (40 tests)
npm run dev -w packages/lab-nav      # Dev server with preview app
```

Or from inside `packages/lab-nav/`:

```bash
npm run check          # Full quality pipeline
npm run build          # Build to dist/
npm run test           # Run tests
npm run dev            # Dev server
npm run format         # Format with OxFmt
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Vue 3** | Component framework (Composition API, `<script setup>`) |
| **TypeScript** | Strict mode, full type declarations |
| **UnoCSS** | Utility CSS with attributify syntax + custom theme |
| **Vite** | Library mode build (ES module + CSS extraction) |
| **Vitest** | Unit tests with happy-dom |
| **OxLint + OxFmt** | Linting and formatting |
| **vite-plugin-dts** | TypeScript declaration generation |

## License

Part of the [Zmuuzn Laboratory](https://github.com/Goosterhof/zmuuzn).
