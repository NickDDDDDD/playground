# macOS 桌面语义迭代记录 2026-08-15

## 目标

这次迭代修正上一版 Liquid Glass shell 中几个不符合桌面心智的点：Overview 不应该在 Dock 里，顶部栏不必要，实验窗口的红黄绿按钮不能只是装饰，Dock 需要更接近 macOS 的启动器形态。

## Design Read

Reading this as: Mac-like playground desktop for a technical owner, with a stronger desktop OS metaphor, leaning toward a careful web approximation of macOS chrome rather than a generic glass dashboard.

## 产品决策

- Overview 是桌面层内容，不是 Dock item。
- Dock 只承载实验入口。
- 实验路由才显示窗口 chrome。
- 红色关闭按钮返回 `/`。
- 黄色最小化按钮返回 `/`，但保留当前实验的运行状态。
- 最小化和关闭都显示桌面；区别是最小化保留 Dock 运行指示点，关闭清除运行指示点。
- 点击对应实验 Dock item 恢复最小化窗口。
- 绿色按钮在普通窗口和全屏窗口之间切换。

这些决策使用以下规则：

- `rule/navigation-vs-action`：Dock item 是路由导航；窗口控制是按钮动作。
- `rule/preserve-mental-model`：最小化不改变当前路由，避免隐式迁移用户上下文。
- `rule/cover-reachable-states`：实验窗口覆盖 normal、minimized、maximized、closed 状态。
- `rule/accessible-name-required`：红黄绿图形按钮必须有 accessible name。

## 设计调整

- 删除 shell 顶部菜单栏。
- 删除 Dock 中的 Overview item。
- Overview 卡片直接铺在桌面 wallpaper 上。
- Dock 改为更接近 macOS 的半透明 shelf、app icon、hover magnification 和运行指示点。
- Dock 的第二轮精修将 padding、圆角、blur、底部阴影、图标 squircle 和图标高光收敛进 `mac-dock` / `mac-dock-icon` / `mac-dock-running-dot`，避免 JSX 中散落视觉 token。
- Dock 运行指示点改为绝对定位，不参与 Dock item 的 flex 高度，避免 app icon 在底座里视觉偏上。
- Dock 底座和 app icon 尺寸下调一档，让单实验状态更接近 macOS Dock 的紧凑比例。
- Dock icon 从裸 lucide outline 加蓝色背景，调整为 app icon 层级：squircle 背景、内部 lens、高光面和加粗主体 glyph。
- Dock 近似 macOS 的可调比例和材质心智，不记录为 Apple 官方固定尺寸。
- 移动端 Dock 保持底部图标启动器，不展示常驻文字标签。

## 保持不变

- React Router 路由结构。
- 实验 `ExperimentModule` 契约。
- Redux Toolkit store 机制。
- welcome 实验的本地 counter 行为。
- GSAP reveal 示例和 reduced-motion 逻辑。

## 验收标准

- `/` 显示桌面 Overview，不显示实验窗口。
- Dock 只包含实验入口。
- 从 Dock 可以打开 `/experiments/welcome`。
- 关闭窗口返回 `/`。
- 最小化窗口后当前路由返回 `/`。
- 最小化后 Welcome Lab Dock item 保留运行指示点。
- 关闭窗口后 Welcome Lab Dock item 不保留运行指示点。
- 点击 Welcome Lab Dock item 可以恢复最小化窗口。
- 最大化按钮可以切换到占满 viewport 的全屏窗口状态。
- desktop 和 mobile viewport 不出现页面级横向滚动。
- `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm test:e2e:headless` 通过。
