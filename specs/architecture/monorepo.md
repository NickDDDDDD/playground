# Monorepo 规格

## 目标

提供一个轻量的 workspace，让 shell、共享包和实验项目可以相互隔离地演进，同时保持基础设施一致。

## 结构

- `apps/shell`：主应用 shell，负责布局、路由和全局状态。
- `packages/ui`：共享的 shadcn-style UI primitives 和 CSS。
- `packages/experiment-contract`：shell 与实验包之间的公开接入契约。
- `experiments/*`：可以独立运行的技术探索项目。

## 验收标准

- `pnpm dev` 可以启动 shell。
- `pnpm -r build` 可以构建所有 workspace 包。
- 单个实验可以从仓库根目录通过 `pnpm --filter <experiment> dev` 独立启动。
- 进入实验包目录后，也可以直接运行 `pnpm dev` 启动该实验。
