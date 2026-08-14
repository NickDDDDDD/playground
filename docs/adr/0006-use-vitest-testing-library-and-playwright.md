# ADR 0006: 使用 Vitest、Testing Library 和 Playwright

## 状态

已接受

## 决策

采用分层测试方案：

- Vitest 用于纯逻辑单元测试。
- Vitest + React Testing Library + jsdom 用于 React 组件测试。
- Playwright 用于用户级浏览器流程测试。
- Playwright 本地默认通过 `pnpm test:e2e` 以 headed 模式运行，并由根 `playwright.config.ts` 启动 shell dev server。
- 无窗口回归测试通过 `pnpm test:e2e:headless` 运行。
- 当前本地 E2E 使用 Playwright-managed Chromium；运行前需要通过 `pnpm exec playwright install chromium` 安装浏览器二进制。

## 原因

项目基于 Vite，Vitest 能复用 Vite 生态，配置轻、速度快。React Testing Library 鼓励从用户可见行为测试组件。Playwright 使用真实浏览器，更适合路由、布局和端到端交互。

## 影响

- 默认测试命令是 `pnpm test`。
- 浏览器流程测试命令是 `pnpm test:e2e`，默认弹出浏览器窗口。
- 无窗口浏览器流程测试命令是 `pnpm test:e2e:headless`。
- 组件测试依赖 jsdom 提供 DOM 环境。
- 真实布局问题不使用 jsdom 判断。
- 短期占位实验不强制补测试，测试优先覆盖长期稳定层。
