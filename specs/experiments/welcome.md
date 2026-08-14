# Welcome Experiment Spec

## Goal

Provide a first experiment that proves the monorepo, shell routing, shared UI, Redux Toolkit, and standalone experiment model work.

## User Experience

The page introduces the playground architecture and includes a small local counter interaction.

## Technical Notes

- Export an `ExperimentModule` for shell mounting.
- Provide a standalone Vite entrypoint.
- Use shared UI components.

## Acceptance Criteria

- `/experiments/welcome` renders inside the shell.
- `pnpm --filter @playground/experiment-welcome dev` runs the experiment standalone.
- Typecheck and build pass.
