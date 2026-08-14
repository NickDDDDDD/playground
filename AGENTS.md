# Agent 工作指南

这个仓库是一个 SDD（Spec-Driven Development，规格驱动开发）的 React playground。任何 agent 在修改代码前，都应该先理解项目规格、架构决策和当前任务边界。

## 工作原则

- 默认使用中文沟通和编写 SDD 文档；技术名词、包名、命令、API 名称保留英文原文。
- 先读相关 spec，再实现代码；如果行为或约束发生变化，同步更新 spec。
- 当技术选择会影响后续开发时，新增或更新 `docs/adr/` 下的 ADR。
- 保持改动聚焦，不顺手重构无关模块。
- 不提交临时 debug 产物，例如 dev server log、error log、scratch 输出文件。
- 修复和验证完成后，主动清理临时产物，并在最终反馈中说明清理情况。

## 项目结构

- `apps/shell`：主应用 shell，负责布局、路由和全局 Redux store。
- `packages/ui`：共享 shadcn-style UI primitives 和 Tailwind 全局样式。
- `packages/experiment-contract`：实验包接入 shell 的公开类型契约。
- `experiments/*`：每个技术探索实验，一个实验一个 workspace package。
- `specs/`：SDD 规格文档。
- `docs/adr/`：架构决策记录。

## 新增或修改实验

1. 先新增或更新 `specs/experiments/<name>.md`。
2. 如果实验需要新的长期约定，更新对应 `specs/architecture/*.md`。
3. 如果涉及架构决策，新增 `docs/adr/<number>-<slug>.md`。
4. 实验包必须导出 `ExperimentModule`，并支持 shell 挂载和独立运行。
5. 新实验默认通过 `pnpm create:experiment <name>` 生成，再按 spec 修改。

## 路由和状态约定

- shell 使用 React Router 管理顶层路由。
- 实验通过 `ExperimentModule` 提供 `id`、`title`、`description`、`path`、`tags` 和 `Component`。
- 客户端状态使用 Redux Toolkit `createSlice`。
- 服务端状态使用 RTK Query `createApi`。
- 默认不引入 Axios；需要复杂 HTTP 行为时再通过 ADR 记录。

## 样式约定

- 所有 app 和 experiment 都导入 `@playground/ui/styles.css`。
- Tailwind CSS v4 的 `@source` 集中维护在共享 UI stylesheet 中。
- 新增会产出 Tailwind classes 的 workspace 根目录时，必须同步更新 `@source`。
- UI 修复要用浏览器验证，不只依赖编译通过。

## 验证命令

常规改动完成后至少运行：

```bash
pnpm lint
pnpm typecheck
pnpm test
```

涉及构建、依赖、Vite、Tailwind 或 workspace 边界时，额外运行：

```bash
pnpm build
```

涉及 UI 布局或交互时，启动项目并用浏览器验证：

```bash
pnpm dev
```

涉及用户级浏览器流程时，使用 Playwright。Playwright 依赖接入后，再启用 `pnpm test:e2e`。

## Git 约定

- 当前远端使用 HTTPS：`https://github.com/NickDDDDDD/playground.git`。
- 提交前检查 `git status -sb`，避免混入无关改动。
- 提交信息保持简短明确，例如 `docs: update agent workflow`。
