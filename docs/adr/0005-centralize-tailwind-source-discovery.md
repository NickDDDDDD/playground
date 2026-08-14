# ADR 0005: 集中管理 Tailwind Source Discovery

## 状态

已接受

## 决策

在共享 UI stylesheet 中声明 Tailwind CSS v4 的 `@source` entries。

## 原因

apps 和 experiments 会从 workspace packages 中导入组件。如果没有显式 source discovery，Tailwind 可能会遗漏共享包内部使用的 utility classes，导致 UI primitives 丢失布局行为。

## 影响

- apps 和 experiments 必须导入 `@playground/ui/styles.css`。
- 新增会产出 Tailwind classes 的 workspace 根目录时，必须加入共享 source 列表。
- 由缺失 generated utilities 导致的布局回归，应视为 styling spec 违规。
