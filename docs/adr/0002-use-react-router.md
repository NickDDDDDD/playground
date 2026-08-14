# ADR 0002: Use React Router

## Status

Accepted

## Decision

Use React Router for the shell and standalone experiment apps.

## Reason

React Router is familiar, stable, and simple enough for a playground shell while still supporting nested routes and standalone experiment entrypoints.

## Consequences

- The shell owns the top-level router.
- Experiments export route metadata and a render component.
- Standalone experiment apps create their own router.
