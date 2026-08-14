# ADR 0005: Centralize Tailwind Source Discovery

## Status

Accepted

## Decision

Declare Tailwind CSS v4 `@source` entries in the shared UI stylesheet.

## Reason

Apps and experiments import components from workspace packages. Without explicit source discovery, Tailwind may omit utility classes used inside shared packages, causing UI primitives to lose layout behavior.

## Consequences

- Apps and experiments must import `@playground/ui/styles.css`.
- New workspace roots that emit Tailwind classes must be added to the shared source list.
- Layout regressions caused by missing generated utilities should be treated as styling spec violations.
