# macOS Web 参考差距记录 2026-08-15

## 参考对象

- GitHub: `PuruVJ/macos-web`
- 选择原因：当前公开信息显示约 2.7k stars，是 macOS web desktop 方向的高星参考项目。
- 技术栈：Svelte、Vite、SCSS；本项目仍保持 React、Vite、Tailwind、Redux Toolkit。

## 参考项目特征

- 使用真实或拟真的 macOS wallpaper 资源，而不是浅色 SaaS 风格渐变背景。
- 使用中性系统灰阶和 macOS system blue。
- Dock 使用半透明浅色材质、真实 app icon 图片、运行点和 hover magnification。
- 桌面包含 top menu bar、时间、系统状态入口。
- 支持窗口拖拽、缩放、右键菜单、Finder/Settings/Calendar 等仿系统应用。

## 本项目已有

- React Router 驱动的桌面 Overview 和实验窗口。
- Dock 只承载实验入口。
- 实验窗口支持关闭、最小化、最大化。
- Dock 运行指示点可以区分关闭和最小化。
- 共享 `liquid-glass` / `liquid-card` / `mac-dock` / `mac-dock-icon` 材质基础层。
- reduced-transparency 和 high-contrast fallback。

## 本项目缺口

- 当前没有真实或拟真的 wallpaper asset，主要依赖 CSS 生成背景。
- 当前没有 menu bar。此前产品决策是 Overview 直接放桌面，避免顶部栏抢占 playground 信息层级。
- 当前 Dock icon 由通用 glyph 生成，不支持实验自定义 app icon asset。
- 当前 Dock hover 只有轻量 scale，没有邻近图标联动 magnification。
- 当前窗口不可拖拽、不可自由 resize。
- 当前没有右键菜单、系统设置、壁纸切换、锁屏/启动屏等完整 OS 模拟功能。

## 建议

- 现在应该做：将主色改为 macOS system blue 的可访问版本，背景改为高饱和抽象 wallpaper 方向，材质改为中性半透明 glass。
- 近期可以做：给 `ExperimentModule` 增加可选 `icon` 或 `iconUrl`，让每个实验拥有自己的 app icon。
- 近期可以做：加入 Dock tooltip 和轻量 launch bounce，但要遵守 reduced-motion。
- 暂不建议做：恢复全局 top menu bar。当前 playground 的 Overview 是桌面内容，不是完整 OS 模拟；top bar 会增加功能暗示和维护成本。
- 暂不建议做：锁屏、启动屏、Finder、系统设置等 OS 级模拟功能。它们会稀释“技术实验 playground”的主目标。
- 需要单独 ADR 决策：窗口拖拽/resize。如果加入，需要确认键盘可达性、mobile fallback、路由状态和测试策略。

## 本次调整

- 主 action token 改为更接近 macOS blue 的可访问版本。
- 背景从浅色 pastel 网格改为 Ventura/Monterey 风格的高饱和抽象 wallpaper 近似。
- card、window、Dock 的 glass material 改为中性灰白半透明，减少彩色材质本身对内容的干扰。
- 保留当前“Overview 直接在桌面上、Dock 只放实验”的产品结构。
