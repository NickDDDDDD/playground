# ADR 0003: Use Redux Toolkit and RTK Query

## Status

Accepted

## Decision

Use Redux Toolkit for client application state and RTK Query for server state.

## Reason

The project is also a learning playground, and Redux Toolkit is worth practicing as a modern state-management baseline.

## Consequences

- Client UI state is modeled with `createSlice`.
- Server data is modeled with `createApi`.
- Axios is not introduced by default; RTK Query starts with `fetchBaseQuery`.
