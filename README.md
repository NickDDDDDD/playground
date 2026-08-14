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
pnpm --filter @playground/experiment-welcome dev
cd experiments/welcome && pnpm dev
pnpm typecheck
pnpm build
pnpm test
```

## Development Flow

1. Write or update a spec under `specs/`.
2. Add an ADR under `docs/adr/` for architectural decisions.
3. Implement against the spec.
4. Verify typecheck and build.
