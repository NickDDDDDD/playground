# 测试规格

## 目标

建立适合 React + Vite playground 的分层测试策略，让稳定基础设施有自动化保护，同时避免给短期占位实验增加维护成本。

## 测试分层

- 纯函数、reducer、parser、工具方法使用 Vitest。
- React 组件测试使用 Vitest + React Testing Library + jsdom。
- 用户级浏览器流程使用 Playwright；本地默认通过 `pnpm test:e2e` 以 headed 模式运行，便于观察浏览器行为。

## 约束

- 占位实验不强制写测试；即将被替换的实验优先避免测试负担。
- 稳定层优先测试，例如 shell 状态、共享 UI primitives、实验接入契约和长期存在的工具函数。
- 真实布局、路由流和浏览器行为使用 Playwright 或 Codex 浏览器验证；不要用 jsdom 判断真实 CSS layout。
- 当前已接入 Vitest、React Testing Library、jsdom 和 Playwright。
- Playwright 测试优先覆盖 shell、路由、布局和跨包挂载这类长期契约；不要把即将替换的占位实验文案写成 E2E 断言。
- Playwright 需要覆盖关键 UI 的 computed style 回归，例如 semantic color utility 是否被全局 CSS 覆盖、核心路由文本对比度是否达标。
- 当前本地 E2E 项目使用 Playwright-managed Chromium；运行前需要通过 `pnpm exec playwright install chromium` 安装浏览器二进制。
- `pnpm test:e2e` 默认弹出浏览器窗口；需要无窗口回归时使用 `pnpm test:e2e:headless`。

## 验收标准

- `pnpm test` 可以运行 Vitest 测试。
- reducer 和共享 UI primitives 至少有基础测试样例。
- `pnpm test:e2e` 可以运行可见窗口的 Playwright 浏览器流程测试。
- `pnpm test:e2e:headless` 可以运行无窗口的 Playwright 浏览器流程测试。
