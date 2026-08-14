# Liquid Glass 桌面化重设计记录 2026-08-15

## 目标

这次重设计把 shell 从左侧 sidebar 工作台改为桌面式 playground：顶部菜单栏负责全局上下文，中央窗口承载当前页面，底部 Dock 承载实验入口。

## Design Read

Reading this as: React playground product shell for a technical user, with Apple desktop / liquid glass approximation language, leaning toward a web-built frosted material system rather than any official Apple package.

## Dials

- `DESIGN_VARIANCE`: 7
- `MOTION_INTENSITY`: 5
- `VISUAL_DENSITY`: 4

原因：用户明确要求苹果桌面和液态玻璃风格。这个方向需要更强的材质、空间和桌面隐喻，但 playground 仍然是开发者工具，不能变成营销页或无意义动效展示。

## 使用的 Skill

- `design-taste-frontend`：判断 Apple Liquid Glass 在 Web 中只能做近似实现，并约束材质不要泛滥。
- `product-design`：决定实验入口从 sidebar 切换到底部 Dock，保持路由语义和 Overview 访问路径。
- `ui-design`：实现桌面背景、顶部菜单栏、窗口、Dock、内容卡片和响应式布局。
- `docs-writing`：同步记录 routing 和 styling 规格变化。

## 设计决策

- `Playground` 标题是 Overview 的入口。
- 每个实验是 Dock 中的一个导航入口。
- Dock 可以隐藏，但隐藏不改变当前路由。
- 首页仍提供实验列表和首个实验入口，避免只依赖固定 Dock。
- Glass material 集中在 shared stylesheet 中，业务组件只消费命名 class。
- 文档明确说明这是 Apple Liquid Glass 的 Web 近似，不是官方 Apple Web API。

## 保持不变

- React Router 路由结构。
- 实验 `ExperimentModule` 契约。
- Redux Toolkit store 机制。
- RTK Query 接入。
- welcome 实验的本地 counter 行为。
- GSAP reveal 示例和 reduced-motion 逻辑。

## 验收标准

- `/` 打开桌面式 Overview。
- `/experiments/welcome` 在中央窗口中挂载实验。
- Dock 可以导航到实验。
- Dock 隐藏后当前页面不丢失。
- desktop 和 mobile viewport 不出现页面级横向滚动。
- 玻璃材质在 reduced-transparency 或 high-contrast 偏好下有可读 fallback。
- `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm test:e2e:headless` 通过。
