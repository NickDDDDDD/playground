# Monorepo Spec

## Goal

Provide a lightweight workspace where the shell, shared packages, and experiments evolve independently.

## Structure

- `apps/shell`: main application shell.
- `packages/ui`: shared shadcn-style UI primitives and CSS.
- `packages/experiment-contract`: public contract between shell and experiments.
- `experiments/*`: independently runnable technology explorations.

## Acceptance Criteria

- `pnpm dev` starts the shell.
- `pnpm -r build` builds all packages.
- A single experiment can be started with `pnpm --filter <experiment> dev`.
