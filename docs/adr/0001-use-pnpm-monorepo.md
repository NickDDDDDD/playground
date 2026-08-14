# ADR 0001: Use pnpm Workspace Monorepo

## Status

Accepted

## Decision

Use pnpm workspaces with `apps/*`, `packages/*`, and `experiments/*`.

## Reason

The project is a playground where each exploration should be isolated but still share infrastructure, UI, and conventions.

## Consequences

- Shared code lives in `packages/*`.
- The main shell lives in `apps/shell`.
- Each exploration lives in `experiments/*`.
