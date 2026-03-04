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
type ExperimentId = "gatekeeper" | "war-table" | "crucible";

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

All types are exported from the main entry point:

```ts
import type { ExperimentId, LabUser, LocalNavItem, ExperimentConfig } from "@goosterhof/lab-nav";
```

## Experiment Registry

The library ships a hardcoded registry of all laboratory experiments:

```ts
import { experiments } from "@goosterhof/lab-nav";
```

| Experiment | ID | Accent Color | URL |
|------------|----|-------------|-----|
| Gatekeeper | `gatekeeper` | `#D97706` (amber) | `auth.zmuuzn.nl` |
| War Table | `war-table` | `#FFD100` (gold) | `helldivers.zmuuzn.nl` |
| Crucible | `crucible` | `#FC4C02` (orange) | `strava.zmuuzn.nl` |

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
npm run test -w packages/lab-nav     # Vitest (34 tests)
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
