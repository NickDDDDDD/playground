# 测试规格

## 目标

建立适合 React + Vite playground 的分层测试策略，让稳定基础设施有自动化保护，同时避免给短期占位实验增加维护成本。

## 测试分层

- 纯函数、reducer、parser、工具方法使用 Vitest。
- React 组件测试使用 Vitest + React Testing Library + jsdom。
- 用户级浏览器流程使用 Playwright，并通过 `pnpm test:e2e` 运行。

## 约束

- 占位实验不强制写测试；即将被替换的实验优先避免测试负担。
- 稳定层优先测试，例如 shell 状态、共享 UI primitives、实验接入契约和长期存在的工具函数。
- 真实布局、路由流和浏览器行为使用 Playwright 或 Codex 浏览器验证；不要用 jsdom 判断真实 CSS layout。
- 当前已接入 Vitest、React Testing Library、jsdom 和 Playwright。
- Playwright 测试优先覆盖 shell、路由、布局和跨包挂载这类长期契约；不要把即将替换的占位实验文案写成 E2E 断言。
- 当前本地 E2E 项目使用 Playwright 的 `channel: "chrome"`，直接驱动本机 Google Chrome；如果后续接入 CI，再改为安装并使用 Playwright-managed Chromium。

## 验收标准

- `pnpm test` 可以运行 Vitest 测试。
- reducer 和共享 UI primitives 至少有基础测试样例。
- `pnpm test:e2e` 可以运行 Playwright 浏览器流程测试。
