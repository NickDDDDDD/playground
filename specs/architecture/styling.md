# Styling Spec

## Goal

Use Tailwind CSS and shared shadcn-style primitives to keep experiments visually consistent.

## Behavior

- Shared CSS variables and base styles live in `packages/ui`.
- Apps and experiments import the shared stylesheet.
- UI components are exported from `packages/ui`.

## Acceptance Criteria

- Shell and standalone experiments share the same theme.
- Reusable primitives are imported from `@playground/ui`.
