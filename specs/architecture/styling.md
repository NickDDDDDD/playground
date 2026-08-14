# Styling Spec

## Goal

Use Tailwind CSS and shared shadcn-style primitives to keep experiments visually consistent.

## Behavior

- Shared CSS variables and base styles live in `packages/ui`.
- Apps and experiments import the shared stylesheet.
- UI components are exported from `packages/ui`.
- Tailwind source discovery is centralized in the shared stylesheet.
- Sidebar brand and nav icons use the same horizontal rhythm.

## Tailwind Source Discovery

Tailwind CSS v4 must explicitly scan workspace roots that emit utility classes:

- `packages/ui`
- `apps`
- `experiments`

The shared stylesheet declares these roots with `@source`. This prevents layout utilities used by shared UI primitives from being omitted in app and experiment builds.

## Acceptance Criteria

- Shell and standalone experiments share the same theme.
- Reusable primitives are imported from `@playground/ui`.
- Shared UI primitives retain layout utilities such as `inline-flex`, `size-*`, and `gap-*`.
- Sidebar header icons and nav icons align on the same horizontal axis in expanded and collapsed states.
