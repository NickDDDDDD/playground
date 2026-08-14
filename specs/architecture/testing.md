# 测试规格

## 目标

建立适合 React + Vite playground 的分层测试策略，让稳定基础设施有自动化保护，同时避免给短期占位实验增加维护成本。

## 测试分层

- 纯函数、reducer、parser、工具方法使用 Vitest。
- React 组件测试使用 Vitest + React Testing Library + jsdom。
- 用户级浏览器流程使用 Playwright；依赖安装完成后启用 E2E 脚本。

## 约束

- 占位实验不强制写测试；即将被替换的实验优先避免测试负担。
- 稳定层优先测试，例如 shell 状态、共享 UI primitives、实验接入契约和长期存在的工具函数。
- 真实布局、路由流和浏览器行为使用 Playwright 或 Codex 浏览器验证；不要用 jsdom 判断真实 CSS layout。
- 当前已接入 Vitest、React Testing Library 和 jsdom。Playwright 依赖如果自动安装超时，可手动运行 `pnpm add -D -w @playwright/test`，安装完成后再启用 `pnpm test:e2e`。

## 验收标准

- `pnpm test` 可以运行 Vitest 测试。
- reducer 和共享 UI primitives 至少有基础测试样例。
- Playwright 依赖安装完成后，提供 `pnpm test:e2e` 作为 E2E 测试入口。
