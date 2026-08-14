# 样式规格

## 目标

使用 Tailwind CSS 和共享的 shadcn-style primitives，让不同实验项目保持一致的视觉基础。

## 视觉方向

当前 shell 使用 Apple desktop / liquid glass web approximation 方向：

- light theme。
- 背景模拟 Ventura / Monterey 风格的高饱和抽象 macOS wallpaper，但不直接拷贝 Apple 资产。
- blue 作为唯一 action accent；按钮和正文小字使用经过 WCAG 对比度校正的可访问 system blue。
- 基础灰阶使用中性 system gray，避免偏蓝的 SaaS dashboard 质感。
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
- shell 使用桌面层、实验窗口和底部 Dock。
- Overview 直接作为桌面 widget 渲染，不包进窗口。
- Overview 桌面 widget 的 hover motion 只用于主行动卡片和实验入口卡片；状态卡、功能说明卡等信息展示卡保持静态，避免桌面元素过度漂浮。
- `desktop-widget-motion` 只允许短时 `transform` 位移，不使用布局属性动画。
- Overview 桌面 widget 内的主 action 应响应整张可行动卡片 hover：按钮整体轻微右移，不只移动按钮内 icon。
- 主按钮 hover 可以使用统一的 `button-spotlight` 径向高光；React `Button` primitive 和其他手动套用 `button-spotlight` 的可行动元素都必须写入鼠标位置 CSS 变量，让高光跟随指针。高光只改变 opacity/background，不改变布局。
- Dock 只展示实验入口；每个实验是一个 Dock item。
- Dock 不展示 Overview。
- Dock 视觉应接近 macOS Dock 的桌面托盘隐喻：底座保持贴近底部、较薄、强 blur、柔和底部阴影；图标使用 app icon squircle 形态，运行状态用小圆点表达。
- Dock icon 应具备 app icon 质感：使用 squircle、克制高光、深浅层次和主体 glyph，不使用裸 outline icon 加纯色背景的普通导航图标风格，也不叠加过多装饰层。
- Dock 运行指示点不参与 Dock item 布局计算，避免把 app icon 顶离底座垂直中心。
- Dock magnification 采用鼠标距离驱动的 interpolation：底部应有透明接近感应区，鼠标进入 Dock 上方接近区域时先轻微响应，越靠近 Dock 强度越大，而不是必须 hover 到 Dock 或 app icon 才触发。每个 item 根据指针到 icon 中心的水平距离计算尺寸，距离区间和曲线形状参考 `PuruVJ/macos-web` 的 Dock demo（`base * 6`、`1 / 1.1 / 1.618 / 2.618 / 1.618 / 1.1 / 1`），但放大幅度必须按当前实验数量和视觉密度调校，不能硬套最大 `2.618x`。
- Dock magnification 必须遵守 `prefers-reduced-motion`，用户降低动态效果时取消放大和位移。
- Dock magnification 的尺寸动画只允许出现在 Dock 这种少量 item、明确服务空间关系的交互中；其他高频 UI 仍优先 `transform` 和 `opacity`。
- Dock 的尺寸和圆角是 Web 近似值，不记录为 Apple 官方固定 token；后续调整应优先保持比例、材质层级和交互语义一致。
- 颜色和材质参考 `PuruVJ/macos-web` 这类高星 macOS web desktop 项目的系统感，但不能直接复制其代码或 Apple 版权资产。
- 实验窗口使用红黄绿窗口按钮，按钮必须真实改变关闭、最小化、全屏最大化状态。
- 最小化和关闭都返回桌面 Overview；Dock 运行指示点用于表达二者差异。
- 桌面右键菜单属于 shell 层低频操作入口；默认不进入实验包契约。当前菜单可提供打开首个实验、复制当前 URL、复制实验创建命令、进入 Focus / Sleep Screen。
- Focus / Sleep Screen 是轻量沉浸状态，不是锁屏/登录系统；它不要求密码、不管理账号，也不改变当前路由或实验运行状态。进入和 Wake 都不能硬切，应使用 `entering` / `entered` / `exiting` 三态让浏览器实际播放 transition，再卸载 overlay；Sleep 和 Wake 可以使用淡入淡出、缩放和模糊，但不做上下位移。
- 长期不做窗口拖拽/自由 resize、真实 app icon 图片资产、wallpaper 管理、完整锁屏/登录/启动系统、Finder/系统设置等 OS 级模拟功能。
- 窄屏视口下 Dock 保持底部导航形态，避免页面级横向溢出。

## Material 基础层

共享 stylesheet 提供这些可复用 class：

- `desktop-wallpaper`：桌面背景层。
- `desktop-widget-motion`：Overview 里主行动卡片和实验入口卡片的轻微 hover/focus motion。
- `button-spotlight`：按钮径向 hover/focus 高光。
- `liquid-glass`：结构性 glass surface，用于窗口和需要更重材质的浮层。
- `liquid-window`：窗口级半径规则。
- `mac-dock`：macOS Dock 近似底座。
- `mac-dock-icon`：Dock app icon 近似外观。
- `mac-dock-icon-glyph`：Dock app icon 的主体符号。
- `mac-dock-running-dot`：Dock 运行状态指示点。
- `mac-dock-tooltip`：Dock item tooltip。
- `mac-context-menu` / `mac-context-menu-item`：桌面右键菜单。
- `sleep-screen`：Focus / Sleep Screen。
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
- `/` 可以直接显示 Overview 桌面。
- Overview 桌面 widget 的 hover motion 应保持克制，只出现在最大说明卡片和实验入口卡片；状态卡片、功能卡片不应有微动。
- Overview 不出现在 Dock。
- 实验入口出现在底部 Dock，而不是左侧 sidebar。
- 实验窗口最小化后回到桌面，点击对应 Dock item 可以恢复。
- 实验窗口最大化后应占满 viewport，并隐藏 Dock。
- 桌面空白区域右键可以打开菜单，窗口、Dock、按钮和链接区域不应被右键菜单拦截。
- Focus / Sleep Screen 打开后覆盖桌面，点击 Wake 或按 Escape 可以回到桌面。
- mobile viewport 不出现由 shell navigation、Dock 或长命令文本造成的页面级横向滚动。
