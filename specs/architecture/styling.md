# 样式规格

## 目标

使用 Tailwind CSS 和共享的 shadcn-style primitives，让不同实验项目保持一致的视觉基础。

## 视觉方向

当前 shell 使用 Apple desktop / liquid glass web approximation 方向：

- light theme。
- 背景模拟 macOS 桌面壁纸，但只作为低对比度环境层。
- blue 作为唯一 action accent。
- 玻璃材质使用 `backdrop-filter`、半透明背景、内高光和柔和阴影实现。
- 这种材质是 Web 近似，不是 Apple 官方 Liquid Glass Web API。
- 大窗口使用更重的 glass material，Dock 和卡片使用较轻 material。
- 首页和实验页应像桌面工作区，不做 marketing hero。

## 行为

- 共享 CSS 变量和基础样式放在 `packages/ui`。
- 共享 base 样式必须放在 Tailwind `@layer base` 中，避免全局元素样式覆盖 utility class。
- apps 和 experiments 都导入共享 stylesheet。
- UI 组件从 `packages/ui` 导出。
- Tailwind source discovery 集中在共享 stylesheet 中维护。
- shell 使用顶部菜单栏、中央窗口和底部 Dock。
- 顶部 `Playground` 标题链接回到 Overview。
- Dock 只展示实验入口；每个实验是一个 Dock item。
- Dock 可隐藏，让窗口区域获得更多空间。
- 窄屏视口下 Dock 保持底部导航形态，避免页面级横向溢出。

## Material 基础层

共享 stylesheet 提供这些可复用 class：

- `desktop-wallpaper`：桌面背景层。
- `liquid-glass`：结构性 glass surface，用于菜单栏、窗口和 Dock。
- `liquid-window`：窗口级半径规则。
- `liquid-dock`：Dock 级半径规则。
- `liquid-card`：内容卡片级 glass surface。

这些 class 必须包含 reduced-transparency 和 high-contrast fallback。业务组件不应该散落重复的 glass CSS。

## Tailwind Source Discovery

Tailwind CSS v4 必须显式扫描会产出 utility class 的 workspace 根目录：

- `packages/ui`
- `apps`
- `experiments`

共享 stylesheet 使用 `@source` 声明这些根目录，避免共享 UI primitives 中使用的布局 utility 在 app 或 experiment 构建时被遗漏。

## 验收标准

- shell 和独立运行的实验项目共享同一套主题。
- 可复用 primitives 从 `@playground/ui` 导入。
- 共享 UI primitives 能保留 `inline-flex`、`size-*`、`gap-*` 等布局 utility。
- `Playground` 标题可以回到 Overview。
- 实验入口出现在底部 Dock，而不是左侧 sidebar。
- Dock 隐藏不会改变当前路由。
- mobile viewport 不出现由 shell navigation、Dock 或长命令文本造成的页面级横向滚动。
