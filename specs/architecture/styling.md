# 样式规格

## 目标

使用 Tailwind CSS 和共享的 shadcn-style primitives，让不同实验项目保持一致的视觉基础。

## 行为

- 共享 CSS 变量和基础样式放在 `packages/ui`。
- apps 和 experiments 都导入共享 stylesheet。
- UI 组件从 `packages/ui` 导出。
- Tailwind source discovery 集中在共享 stylesheet 中维护。
- Sidebar 的 brand icon 和 nav icon 使用同一套水平节奏。

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
- sidebar header icon 和 nav icon 在展开态、折叠态都对齐在同一条水平轴线上。
