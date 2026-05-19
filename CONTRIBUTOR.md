# CONTRIBUTOR.md — The Decoder

> *The audition script for code that wants to enter the Shared Nervous System. The stethoscope for code that wants to leave it. Same artifact, read from outside the lab or inside it — it does both jobs because the doctrine demands both.*

> **What this file is not:** a `CONTRIBUTING.md` that lowers the bar so more people can clear it. The bar does not move. This file teaches you where the bar is, why it is there, and how to clear it on the first jump.

> **What this file is:** the decoder ring for a laboratory that names its code like it names its experiments. If you are about to open a PR against `@goosterhof/lab-nav` (or any future package shipped from this monorepo) and you do not know why the file you are editing is called what it is called, *start here*.

---

## 1. Cold Open — Welcome to the Laboratory

This is not a project. It is a **laboratory**, and the code in this monorepo is the **shared nervous system** that connects every experiment under `*.zmuuzn.nl`. The laboratory has a voice. The voice has rules. The rules are absolute — they do not relax for shared code, they do not relax for outside contributors, they do not relax because someone has a deadline. The rules were forged by a Parliament of four arguing voices and a four-way convergence (see [§7 Lineage](#7-lineage)); they will outlast any single PR.

What this means for you, the contributor: you cannot land a change here without speaking the laboratory's vocabulary. You also cannot be expected to *know* that vocabulary on day one. So we wrote you a decoder. Read it once. Reference it forever. Pass it to the next contributor.

The laboratory's investor leads a team of 20+ Script trainees and runs sister operations (Brick & Mortar Associates, Stud & Sort Logistics) where this exact same doctrine applies under different costumes. The translation step you are about to learn is **not friction** — it is the audition contract. As one of the Parliament's voices put it: generic shared code is the audition where you sang the anthem instead of your own song.

Welcome. Now let us teach you the song.

---

## 2. Codename Map

Codenames are not nicknames. They are **stories compressed into words**, and every name in this codebase exists because a generic alternative was rejected on purpose. This map is the ground truth. If a codename appears anywhere in this monorepo — in a type, a component, a comment, a commit message — it resolves to exactly one referent listed below.

The map is grouped by **deployment surface**, not alphabetically. Alphabetical ordering would treat the Gatekeeper and the Mezzanine as peers; they are not. Where a thing lives in the laboratory is part of its identity.

### Experiments (live web applications)

| Codename | Referent | Surface | Earned from |
|---|---|---|---|
| **The Gatekeeper** | OAuth2 authentication server (Laravel 12 + Passport) | `auth.zmuuzn.nl` | *Vault-door metaphor — nobody enters the lab without clearance, nobody stays without a valid token.* |
| **The War Table** | Helldivers 2 mission dashboard with OCR (Laravel 12 + Vue 3) | `helldivers.zmuuzn.nl` | *Battlefield-intelligence metaphor — reads screenshots so the squad does not have to.* |
| **The Crucible** | Strava fitness dashboard (Laravel 12 + Vue 3) | `strava.zmuuzn.nl` | *The forge where raw athletic data is tempered into athlete intelligence.* |
| **The Parlour** | Single-room WebRTC voice chat (Laravel 12 + Vue 3 + Reverb) | `parlour.zmuuzn.nl` | *Inner-circle metaphor — no corridors, no scheduling, just voices converging.* |
| **The Smokestacks** | Satisfactory dedicated server dashboard (Laravel 12 + Vue 3) | `smokestacks.zmuuzn.nl` | *Industrial-command-center metaphor — the factory writes its own status reports.* |
| **The Horadrim** | Diablo 4 codex, build tracker, and Aspect Alchemy engine | `horadrim.zmuuzn.nl` | *Lore-keeper metaphor — the codex grows without ceremony, the alchemy surfaces what builds you could actually run.* |

### Packages (shared libraries, this monorepo)

| Codename | Referent | Surface | Earned from |
|---|---|---|---|
| **The Shared Nervous System** | The package monorepo itself (this repo) | GitHub Packages | *Connective-tissue metaphor — the thread that stitches every experiment's face together.* |
| **`@goosterhof/lab-nav`** | Vue 3 navigation component library | Published to GitHub Packages | *No fanciful codename yet — the package wears its function. Tracked as a doctrine gap; see [§7 Lineage](#7-lineage) and the lab-nav audit (Row #8 of `lab-backlog.md`).* |

### Gadgets (workbench instruments)

| Codename | Referent | Surface | Earned from |
|---|---|---|---|
| **The Observer** | Pixel-art VS Code visualization of agent activity | `gadgets/pixel-lab/` | *Watcher metaphor — when the agent works, the pixel scientist works.* |
| **The Mezzanine** | Tauri v2 desktop dispatch console for claude pty sessions | `gadgets/mezzanine/` | *Command-balcony metaphor — the investor stands above the lab floor and dispatches mad scientists onto missions.* |
| **The Holotable** | Interactive 3D dashboard of the lab | `gadgets/lab-monitor-3d/` | *Holographic-map metaphor — floating structures for every experiment, gadget, and bit of infrastructure.* |
| **The Grind** | Idle/incremental coding-as-RP game | `gadgets/idle-lab/` | *Reward-loop metaphor — the harder you code, the bigger your lab grows.* |
| **The Horadric Cube** | Windows desktop companion to The Horadrim (Tauri v2 + Tesseract sidecar) | `gadgets/horadric-cube/` | *Diablo-2 transmutation metaphor — feeds raw screenshot tooltips into the codex.* |

### Laboratory infrastructure

| Codename | Referent | Surface | Earned from |
|---|---|---|---|
| **The Bloodstream** | Shared PostgreSQL 16 instance | `postgres.railway.internal` (prod) / `localhost:5432` (dev) | *Circulatory metaphor — one brain, per-experiment veins.* |
| **The Reactor** | FrankenPHP via Laravel Octane | Port 8080 on every experiment | *Containment metaphor — ordinary PHP could not survive the pressure.* |
| **The Containment Protocols** | Architecture tests, Deptrac, PHPStan rules, CI sentinels | `tests/Architecture/`, `deptrac.yaml`, sentinel workflows | *Containment metaphor — the safety measures that stop experiments from going critical.* |
| **The Minions** | 19 specialized Claude Code agents | `.claude/agents/` | *Specialist-staff metaphor — each one a character with its own context window.* |

---

## 3. Voice Rules

Five rules. Every PR is checked against all five. A PR that breaks even one is sent back to the dressing room — not because the laboratory is cruel, but because the audition contract is the audition contract. (See [§5](#5-the-translation-step-and-why-it-is-the-contract-not-the-friction).)

### Rule 1 — File and identifier naming

> *A name that could belong to any project does not belong to this one.*

| Forbidden | Required |
|---|---|
| `Card.vue`, `Modal.vue`, `List.vue` | `BrandMark.vue`, `ExperimentSwitcher.vue`, `UserMenu.vue` |
| `UserService`, `DataHelper`, `BaseController` | `OAuthGatekeeper`, `MissionDebrief`, `ForgeMemory` |
| `useData()`, `useFetch()`, `useState()` (custom) | `useExperimentAccent()`, `useDrawerEscape()` |
| `types.ts` with `User`, `Item`, `Config` | `types.ts` with `LabUser`, `LocalNavItem`, `ExperimentConfig` |

**Counter-Audition Example.** A PR adds `Card.vue` that wraps `<div class="card">`. Verdict: fail. Rewrite as `LabPanel.vue` if it is a generic lab-themed surface, or as something domain-specific (`ExperimentTile.vue`) if it has a job. The rename is not cosmetic — it forces the contributor to answer *what is this thing actually for*, and the answer goes in the name.

### Rule 2 — Error messages

> *Three checks: Voice (sounds like the laboratory, not the framework), Empathy (acknowledges what the caller tried to do), Recovery (says what to do next).*

| Forbidden | Required |
|---|---|
| `"Invalid prop: currentExperiment"` | `"That experiment is not on the laboratory map — check the codename map in CONTRIBUTOR.md §2."` |
| `throw new Error("Not found")` | `throw new Error("The Shared Nervous System has no experiment registered under '" + id + "'. Add it to src/experiments.ts or pick one of: " + known.join(", ") + ".")` |
| `console.warn("Bad input")` | `console.warn("[lab-nav] LocalNavItem missing 'label' — the nav bar will render a void where this item should be. Provide a label or filter it before passing in.")` |

**Counter-Audition Example.** A PR adds a guard that throws `new Error("Missing user")` when `LabUser` is undefined. Verdict: fail all three checks. The Voice is Node's, the Empathy is zero, the Recovery is absent. Rewrite: `throw new Error("[lab-nav] <LabBar> mounted without a 'user' prop. The user menu has nobody to greet — pass a LabUser or omit the bar entirely on logged-out screens.")`.

### Rule 3 — JSDoc / TSDoc tone

> *Documentation is part of the experiment's voice. The doctype that reads like an API reference for any nav library is the doctype that fails.*

| Forbidden | Required |
|---|---|
| `/** The user object. */` | `/** The logged-in lab member. Displayed in the user menu; null is not supported — render <LabBar> only after the Gatekeeper has cleared the visitor. */` |
| `/** Switches between experiments. */` | `/** Renders every laboratory experiment as a switchable surface. Active experiment derives its glow from the registry's accentColor; inactive ones link out via <a href> for cross-subdomain navigation. */` |

### Rule 4 — Commit message form

> *Conventional Commits + the laboratory's scope table + a headline that earns its place in `git log --oneline`. The Three-Second Rule applies: if a reader cannot understand what changed and where in three seconds, rewrite.*

| Forbidden | Required |
|---|---|
| `feat: add component` | `feat(lab-nav): give ExperimentSwitcher a per-experiment glow pulse` |
| `fix: bug fix` | `fix(lab-nav): stop UserMenu from leaking focus when Escape closes the drawer mid-transition` |
| `chore: update submodule` | `sync(lab-nav): pull the Mezzanine accent token + drawer-arrival animation` |

**Allowed scopes for this monorepo:** `lab-nav`, `nervous-system` (monorepo-root concerns), `decoder` (CONTRIBUTOR.md and related onboarding). For experiment / gadget / lab scopes, see the root [`CLAUDE.md` Commit Doctrine table](../../CLAUDE.md#scope--always-use-the-experiments-codename).

### Rule 5 — Public API names (what consumers will import)

> *This is the most exposed surface in the laboratory. A public export from `@goosterhof/lab-nav` shows up in every consumer's IDE autocomplete. It is the laboratory's billboard.*

| Forbidden | Required |
|---|---|
| `export { NavBar, MobileNav }` | `export { LabBar, LabBarMobile }` |
| `export type { User, NavItem }` | `export type { LabUser, LocalNavItem }` |
| `export const items = [...]` | `export const experiments = [...]` |

**Audit gap (declared honestly, see [§7 Lineage](#7-lineage)):** the Parliament's Chaos Monkey scored lab-nav's current API surface 5/10 — *"vocabulary, not voice."* `LabBar` and `LabBarMobile` carry the laboratory name; they do not carry the laboratory's character. This decoder declares the rule. The Enhancement Squad's parallel audit (Row #8 of `lab-backlog.md`) measures the existing surface against it. The author of this document does not pretend the surface already complies — that is what the parallel audit is for.

---

## 4. The Five Auditions

Before you open a PR, every new file, identifier, and exported name walks five auditions. Answer each out loud. A PR that fails a single audition is not ready — it is wearing a costume the laboratory has not cast.

1. **The Costume Check.** *Could I drop this name into a different Vue navigation library and have it feel at home there?* If yes, you put it in a costume that fits the wrong stage. The laboratory's names should *not* transplant cleanly — that is the point.
2. **The Cast List Check.** *Does this name reference, derive from, or harmonize with a codename in [§2](#2-codename-map)?* If no, the name is floating outside the cast. Anchor it to a role that already exists in the laboratory or earn a new one.
3. **The Stage-Lights Check.** *If a Script trainee scans `git log --oneline` and sees my commit message, can they tell what changed and where in three seconds?* If no, the headline is mumbling under the lights. Rewrite.
4. **The Ventriloquist Check.** *If my code throws an error, who is actually speaking — the laboratory, or Node / Vue / Vite?* If the framework is the one moving the lips, you have ventriloquized the wrong voice. Rewrite the message until the laboratory is the one talking.
5. **The Billboard Check.** *If a consumer imports this from `@goosterhof/lab-nav`, will their IDE autocomplete show them the laboratory's vocabulary?* The public surface is the laboratory's billboard. If the autocomplete reads like a generic component library, the billboard is selling someone else's product.

Five passes, the PR is cast. One miss, back to the dressing room.

---

## 5. The Translation Step (and Why It Is the Contract, Not the Friction)

You may have noticed that contributing here is harder than contributing to a typical npm package. That is not an accident. That is not a defect to be smoothed away in v2. That is the **audition contract**, made explicit.

A Parliament of four laboratory minions debated whether the Naming Doctrine should relax for shared code — code that ships outside the laboratory's walls. They argued for three rounds. Three of the four entered with the same position; the fourth was the lone dissenter, then self-detonated his own compromise in Round 3. The four-way convergence was unanimous: **the doctrine does not relax**. The framing flip that made this artifact necessary came in the closing detonations:

> *"The collision revealed the wrong frame — 'translation step' isn't friction, it's the audition CONTRACT. Outside PRs don't get translated, they get cast."* — The Illusionist, Round 3 Late Arrival (emphasis original)
>
> *"The translation step isn't a doctrine wound — it's a missing instrument. Ship a CONTRIBUTOR.md decoder in every shared artifact: codename map, voice rules, naming rubric."* — The Enhancement Squad, Round 3 Late Arrival

This file is the missing instrument. It is the audition script the Illusionist named and the stethoscope the Enhancement Squad named — the same artifact viewed from outside the laboratory (stage) and inside it (operating theatre). The friction you feel when first contributing here is the laboratory's voice making itself heard. Generic shared code is invisible shared code. Invisible code does not deserve the electricity it consumes.

The contract is two-sided:

- **From the laboratory:** you will be given a decoder (this file). You will not be left to guess. The vocabulary will be documented, the rules will be explicit, the examples will be worked end-to-end.
- **From you, the contributor:** you will learn the vocabulary before opening the PR. You will not ask for the doctrine to relax. You will not propose a "generic core, voiced skin" compromise (that one has been tried and detonated — see [§7](#7-lineage)).

Sign the contract by reading the next section and walking through a PR.

---

## 6. Walking Through a PR

Here is a generic contribution arriving at `@goosterhof/lab-nav`. Watch it audition.

### Draft 1 (fails the audition)

```
File:     src/components/Card.vue
Identifier: Card
Commit:   feat: add card component
Error:    throw new Error("Bad prop")
```

Five questions, five wrong answers. The file name transplants cleanly. The identifier references no codename. The commit fails the Three-Second Rule. The error sounds like Node. The export `Card` would show up in every consumer's autocomplete as the most generic name available. **Verdict: rejected. Back to the dressing room.**

### Draft 2 (closer, still failing)

```
File:     src/components/LabCard.vue
Identifier: LabCard
Commit:   feat(lab-nav): add card component
Error:    throw new Error("Missing prop")
```

The `Lab` prefix attempts to anchor the name to the laboratory, but `Card` is still generic — it tells you nothing about what this surface *does*. The commit names the scope but the headline is still generic. The error still sounds like Node. **Verdict: closer, but still rejected. The prefix is camouflage, not character.**

### Draft 3 (passes the audition)

```
File:     src/components/ExperimentTile.vue
Identifier: ExperimentTile
Commit:   feat(lab-nav): give the experiment grid a tileable surface with accent-color borders
Error:    throw new Error("[lab-nav] <ExperimentTile> requires an 'experiment' prop. The tile has no laboratory to represent — pass an ExperimentConfig or omit the tile from the grid.")
Public export: ExperimentTile (anchored, domain-specific, autocompletes alongside ExperimentSwitcher)
```

The name describes the job (tile representing an experiment in a grid). The commit body says what changed (the experiment grid) and how (tileable surface with accent borders). The error has voice ("the tile has no laboratory to represent"), empathy ("requires an 'experiment' prop"), and recovery ("pass an ExperimentConfig or omit the tile"). The public export now lives in the same vocabulary family as `ExperimentSwitcher` and `ExperimentConfig`. **Verdict: cast. The audition is over. The PR is ready.**

What changed between Draft 1 and Draft 3 was not the code — it was the contributor's vocabulary.

---

## 7. Lineage

This document is not a sermon. It is a record. Every doctrinal claim above can be traced to a specific Parliament transcript, decision, or convergence event.

- **Producing source-of-truth for follow-ups:** [`documents/lab-backlog.md`](../../documents/lab-backlog.md) Row #6 (this CONTRIBUTOR.md decoder) and Row #8 (the parallel lab-nav API audit). Both rows descend from the same Parliament. The lab-backlog itself is canonical per [Decision 014 — Lab Backlog as Singleton Working Document](../../.claude/memory/decisions/014-lab-backlog-as-singleton-working-document.md) (2026-05-19).

- **Birth Parliament:** [`documents/parliament-transcripts/2026-05-19-team-naming-doctrine-shared-code.md`](../../documents/parliament-transcripts/2026-05-19-team-naming-doctrine-shared-code.md). Four-minion Agent Teams run. Three rounds. Cast: Chaos Monkey, Artisan, Illusionist, Enhancement Squad.

- **Four-way convergence (Survivor #1):** The Naming Doctrine stays absolute; it does not relax for shared code. Achieved through proposer reversal — the Artisan entered with a "generic core, voiced skin" compromise and self-detonated it in Round 3 ("would I let a Script trainee open a PR against lab-nav today? No").

- **Two-voice independent convergence (Survivor #2):** The CONTRIBUTOR.md decoder itself. Birthed simultaneously by the Illusionist's Round 3 Late Arrival ("Casting Call, CONTRIBUTING.md as audition script + domain glossary") and the Enhancement Squad's Round 3 Late Arrival ("CONTRIBUTOR.md decoder: codename map, voice rules, naming rubric"). Two opposite vocabularies — theatre and surgery — landed on the same artifact from independent context windows. This file is what they both described.

- **Framing flip (Survivor #5):** *The translation step is not friction — it is the audition contract.* Illusionist Round 3. The entire premise of §5 above.

- **Operational audit gap (Survivor #4):** Chaos Monkey Round 3 scored the current lab-nav surface 5/10 — vocabulary without voice. Tracked as Row #8 of the lab-backlog and assigned to the Enhancement Squad in a parallel lane. This decoder does not prescribe code changes to lab-nav; it declares the rule the audit will measure against.

- **Foundational doctrine references:**
  - [`CLAUDE.md` — The Naming Doctrine quick reference](../../CLAUDE.md#the-naming-doctrine-quick-reference)
  - [`.claude/MADNESS.md` — The Naming Doctrine, Error Manifesto, Over-Delivery Clause, Character Tax](../../.claude/MADNESS.md)
  - [`.claude/COMMIT-DOCTRINE.md` — Full Commit Doctrine and specimens of excellence](../../.claude/COMMIT-DOCTRINE.md)

- **Authoring minion:** The Artisan. Drafted in the same session that the Enhancement Squad ran the lab-nav API audit (Row #8) in parallel — by deliberate separation of lanes, so the doctrine document and the code audit could not contaminate each other.

---

*If you are reading this file in a fork, a clone, or a copy somewhere else on disk — it descended from `packages/zmuuzn-packages/CONTRIBUTOR.md` in the [Zmuuzn Laboratory](https://github.com/Goosterhof/zmuuzn). The doctrine moves with the code.*
