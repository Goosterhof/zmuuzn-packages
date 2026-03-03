# CLAUDE.md — The Shared Nervous System

Shared Vue 3 navigation component library for the Zmuuzn laboratory. Provides a unified navigation bar that connects all experiments under `*.zmuuzn.nl`, allowing users to switch between experiments and navigate within them.

## Architecture

### Tech Stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode, `vue-tsc` for type-checking)
- **UnoCSS** (attributify syntax — consumers provide UnoCSS; this package has no config)
- **Vitest** + `happy-dom` + `@vue/test-utils` for testing
- **OxLint** + **OxFmt** for lint and format

### Distribution Model

This is a **compiled library** published to **GitHub Packages** as `@goosterhof/lab-nav`. Vite library mode compiles `.vue` and `.ts` source into:
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

### Directory Structure

```
src/
├── index.ts                    # Barrel export
├── types.ts                    # ExperimentId, LabUser, LocalNavItem, ExperimentConfig
├── experiments.ts              # Hardcoded experiment registry (3 experiments)
└── components/
    ├── LabBar.vue              # Desktop: two-tier nav (lab bar + local nav)
    ├── LabBarMobile.vue        # Mobile: hamburger → slide-out drawer
    ├── ExperimentSwitcher.vue  # Horizontal experiment list with active indicator
    └── UserMenu.vue            # User name + logout dropdown
tests/
├── experiments.spec.ts
├── ExperimentSwitcher.spec.ts
├── UserMenu.spec.ts
├── LabBar.spec.ts
└── LabBarMobile.spec.ts
```

### Key Patterns

- **Cross-subdomain links** use `<a href>` (full page navigation between experiments)
- **Local nav** uses `<router-link>` (SPA navigation within an experiment)
- **UnoCSS `class="text-[#hex]"`** for static color tokens; inline `:style` only for dynamic values (accent colors, active/inactive state)
- **`vue` and `vue-router`** are `peerDependencies` to avoid duplicate instances
- **Active state detection**: Experiments use `currentExperiment` prop; local nav uses `isActive` on `LocalNavItem`
- **Accent colors**: Derived automatically from the experiment registry based on `currentExperiment`

## Design Tokens

All hardcoded via inline styles (shared across all experiments):

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0F0F1F` | Bar and drawer background |
| Border | `#2E2E52` | Separators between rows and sections |
| Text (muted) | `#9E9EBF` | Inactive items, labels |
| Text (active) | `#E0E0E0` | Active/hover items, user name |
| Active indicator | Per-experiment `accentColor` | Bottom border (desktop), left border (mobile) |

### Experiment Accent Colors

| Experiment | Color | Hex |
|------------|-------|-----|
| Gatekeeper | Amber | `#D97706` |
| War Table | Gold | `#FFD100` |
| Crucible | Strava Orange | `#FC4C02` |

## Commands

```bash
npm run check          # Full pipeline: type-check + lint + format:check + test
npm run build          # Vite library build → dist/
npm run type-check     # vue-tsc --noEmit
npm run lint           # oxlint src/ tests/ --deny-warnings
npm run format         # oxfmt --write src/ tests/
npm run format:check   # oxfmt --check src/ tests/
npm run test           # vitest run
npm run test:watch     # vitest (watch mode)
```

## Conventions

- **Always run `npm run check`** before committing changes to this package
- **Always run `npm run format`** after any code changes (OxFmt enforces consistent style)
- **UnoCSS in build**: `uno.config.ts` provides `presetUno` + `presetAttributify` for CSS extraction during `vite build`. Styling uses UnoCSS attributify tokens (`bg="[#0F0F1F]"`) and class-based tokens (`class="text-[#hex]"`). Avoid `text="[#hex]"` attributify on `<a>` elements — it collides with the DOM `text` property
- **Test `.vue` components** with `Teleport` stubbed (`global: { stubs: { Teleport: true } }`) so drawer content renders inline for assertions

## Known Limitations & Tech Debt

- **Version bumping is manual**: Publish to GitHub Packages requires incrementing `version` in `package.json` — CI does not auto-bump
- **Hardcoded experiment registry**: Adding a new experiment requires editing `src/experiments.ts` — not dynamic
- **No accessibility audit**: Basic `aria-label` attributes on buttons, but no comprehensive a11y testing
- **No transition animations**: Drawer appears/disappears instantly — could add CSS transitions
