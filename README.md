# Playground

A spec-driven React playground for exploring new frontend technologies.

## Stack

- React + TypeScript + Vite
- Tailwind CSS + shadcn-style shared UI package
- pnpm workspace monorepo
- React Router
- Redux Toolkit + RTK Query

## Commands

```bash
pnpm install
pnpm dev
pnpm create:experiment my-experiment
pnpm --filter @playground/experiment-welcome dev
cd experiments/welcome && pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

## Development Flow

1. Read the relevant spec under `specs/` before changing code.
2. Write or update the spec first when behavior or constraints change.
3. Add an ADR under `docs/adr/` for architectural decisions.
4. Implement against the spec and current skill workflow.
5. Verify with `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
6. Use Playwright or browser verification for UI layout and user-level flows.
