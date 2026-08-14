# ADR 0001: 使用 pnpm Workspace Monorepo

## 状态

已接受

## 决策

使用 pnpm workspaces，并划分为 `apps/*`、`packages/*` 和 `experiments/*`。

## 原因

这个项目是技术探索 playground。每个探索项目需要保持隔离，同时复用基础设施、UI 和约定。

## 影响

- 共享代码放在 `packages/*`。
- 主 shell 放在 `apps/shell`。
- 每个探索项目放在 `experiments/*`。
