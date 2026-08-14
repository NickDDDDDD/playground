# Routing Spec

## Goal

Use React Router to mount experiments inside a shared shell while preserving standalone experiment routes.

## Behavior

- The shell owns the app layout and top-level routes.
- Experiments expose route metadata through `ExperimentModule`.
- Unknown routes render a not-found view.

## Acceptance Criteria

- `/` opens the shell home page.
- `/experiments/welcome` mounts the welcome experiment.
- The welcome experiment can also run independently.
