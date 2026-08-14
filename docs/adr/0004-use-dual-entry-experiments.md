# ADR 0004: Use Dual-Entry Experiments

## Status

Accepted

## Decision

Each experiment package must be mountable by the shell and independently runnable with Vite.

## Reason

This keeps the shell experience unified while allowing experiments to stay isolated during focused exploration.

## Consequences

- Each experiment exports an `ExperimentModule`.
- Each experiment owns a standalone `main.tsx`.
- Experiments can have local state and providers when running standalone.
