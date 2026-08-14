# State Management Spec

## Goal

Use Redux Toolkit and RTK Query as the default state-management learning path.

## State Boundaries

- `createSlice` owns client state such as sidebar collapse and theme preference.
- `createApi` owns remote/server state such as example API data.
- Experiments may define local stores when their learning goal requires isolation.

## Acceptance Criteria

- The shell is wrapped in a Redux Provider.
- Sidebar collapsed state is stored in Redux.
- RTK Query is configured in the shell store.
