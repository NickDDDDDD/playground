# Welcome 实验规格

## 目标

提供第一个实验，用来证明 monorepo、shell 路由、共享 UI、Redux Toolkit 和独立实验入口都可以正常工作。

## 用户体验

页面介绍 playground 架构，并包含一个小型本地 counter 交互。

## 技术说明

- 导出 `ExperimentModule`，供 shell 挂载。
- 提供独立的 Vite entrypoint。
- 使用共享 UI 组件。

## 验收标准

- `/experiments/welcome` 可以在 shell 中渲染。
- `pnpm --filter @playground/experiment-welcome dev` 可以独立启动实验。
- 在 `experiments/welcome` 目录下运行 `pnpm dev` 也可以独立启动实验。
- typecheck 和 build 通过。
