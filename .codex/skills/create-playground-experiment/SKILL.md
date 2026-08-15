---
name: create-playground-experiment
description: Create and register a new experiment in this React Playground monorepo. Use when the user asks to add, create, scaffold, generate, or start a new Playground experiment, exploration project, lab, demo, or independently runnable experiment package.
---

# Create Playground Experiment

## Purpose

Create a complete Playground experiment, not just files. Use the repository script for deterministic scaffolding, then finish the SDD, shell registration, validation, and cleanup steps that require project context.

## Preconditions

- Work from the repository root.
- Preserve the repository script as the canonical scaffolder: `scripts/create-experiment.mjs`.
- Do not copy the scaffolding script into this skill or reimplement it unless the repository script is missing or broken.
- Use a kebab-case experiment name such as `motion-lab` or `three-scene`.

## Workflow

1. Read the relevant project docs before changing files:
   - `AGENTS.md`
   - `specs/architecture/monorepo.md`
   - `specs/architecture/routing.md`
   - `specs/architecture/styling.md`
   - `specs/architecture/testing.md`
2. Check current workspace state with `git status -sb`. If unrelated user changes exist, work around them and do not revert them.
3. Confirm the experiment name is kebab-case. If the user gave a vague title, derive a short kebab-case package name and mention it.
4. Run the repository scaffolder:

   ```bash
   pnpm create:experiment <name>
   ```

5. Update `specs/experiments/<name>.md` from the generated placeholder into a useful Chinese SDD spec.
6. Register the experiment in `apps/shell/src/experiments.ts`:
   - Import the generated export from `@playground/experiment-<name>`.
   - Add it to the exported `experiments` array.
   - Keep the array readable and stable; do not reorder unrelated entries unless there is an established local ordering rule.
7. Inspect the generated `experiments/<name>/src/route.tsx` and verify it exports an `ExperimentModule`.
8. If the experiment introduces new shared architecture, update the relevant file under `specs/architecture/` or add an ADR under `docs/adr/`.
9. Validate:

   ```bash
   pnpm --filter @playground/experiment-<name> typecheck
   pnpm --filter @playground/experiment-<name> build
   pnpm typecheck
   pnpm build
   ```

10. If shell routing, Dock, layout, or visible UI changed, run browser or Playwright verification:

    ```bash
    pnpm test:e2e:headless
    ```

11. Clean temporary outputs, especially `tests/results`, `tests/reports`, `tests/coverage`, ad-hoc screenshots, logs, and scratch files.
12. Report what was created, where it was registered, what specs changed, what validation ran, and what temporary artifacts were cleaned.

## Registration Pattern

Current shell registration is in `apps/shell/src/experiments.ts`:

```ts
import type { ExperimentModule } from "@playground/experiment-contract";
import { welcomeExperiment } from "@playground/experiment-welcome";

export const experiments: ExperimentModule[] = [welcomeExperiment];
```

For a new `motion-lab` experiment, register it like this:

```ts
import type { ExperimentModule } from "@playground/experiment-contract";
import { motionLabExperiment } from "@playground/experiment-motion-lab";
import { welcomeExperiment } from "@playground/experiment-welcome";

export const experiments: ExperimentModule[] = [welcomeExperiment, motionLabExperiment];
```

## Boundaries

- The script creates the package and starter spec; the skill completes project integration.
- Keep generated code minimal until the experiment spec says what to build.
- Do not add tests for short-lived placeholder experiment content unless the spec makes that behavior stable.
- Do not commit or push until the experiment is fully wired, verified, and the user agrees the work is at a stable checkpoint.
