# The Shared Nervous System

> Shared packages for the [Zmuuzn Laboratory](https://github.com/Goosterhof/zmuuzn) — the connective tissue that binds every experiment together.

Every experiment in the laboratory needs to communicate. Navigate between them. Know who's logged in. Show a unified identity. This monorepo houses the packages that make that possible — compiled, tested, typed, and published to GitHub Packages so every experiment can plug in with a single `npm install`.

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@goosterhof/lab-nav`](./packages/lab-nav/) | `0.2.1` | Vue 3 navigation component library — unified nav bar with experiment switching, local navigation, and user menu |

## Quick Start

```bash
npm install @goosterhof/lab-nav
```

```ts
import { LabBar, LabBarMobile } from "@goosterhof/lab-nav";
import "@goosterhof/lab-nav/style.css";
```

> GitHub Packages requires authentication even for public packages. See the [lab-nav README](./packages/lab-nav/README.md#installation) for `.npmrc` setup.

## Development

This is an **npm workspaces** monorepo. Each package is fully self-contained — its own Vite config, test suite, UnoCSS theme, and TypeScript config. The root orchestrates them all.

```bash
npm install                # Install all workspace dependencies
npm run check              # Full quality pipeline across all packages
npm run build              # Build all packages
npm run test               # Test all packages
npm run dev                # Dev server (lab-nav)
```

Target a specific package:

```bash
npm run check -w packages/lab-nav
npm run build -w packages/lab-nav
```

## Adding a New Package

1. Create `packages/<name>/` with its own `package.json`, configs, `src/`, and `tests/`
2. Run `npm install` from the root to link the new workspace
3. Root scripts automatically include it via `--workspaces`

## The Laboratory

This repo is a submodule of the [Zmuuzn Laboratory](https://github.com/Goosterhof/zmuuzn) — the umbrella project that houses all experiments deployed under `*.zmuuzn.nl`. The packages here are the shared infrastructure that every experiment depends on.

| Experiment | Codename | URL |
|------------|----------|-----|
| OAuth2 Authentication | The Gatekeeper | `auth.zmuuzn.nl` |
| Helldivers 2 Dashboard | The War Table | `helldivers.zmuuzn.nl` |
| Strava Fitness Dashboard | The Crucible | `strava.zmuuzn.nl` |
