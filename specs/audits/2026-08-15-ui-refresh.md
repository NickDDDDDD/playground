# UI 翻新记录 2026-08-15

## 目标

使用当前 SDD skill workflow 和 taste skill 对 shell、Overview、welcome 实验和 not-found 页做一次低风险 UI 翻新。

## Design Read

Reading this as: developer playground product shell for a technical user, with a calm dev-tool / lab-console language, leaning toward product UI restraint rather than marketing hero polish.

## Dials

- `DESIGN_VARIANCE`: 5
- `MOTION_INTENSITY`: 3
- `VISUAL_DENSITY`: 5

原因：这是面向开发者的 playground shell，不是营销页。界面需要更像稳定的技术工作台：清晰、克制、可持续扩展。

## 使用的 Skill

- `design-taste-frontend`：判断翻新方向，避免默认卡片堆、黑边、AI 风格装饰。
- `ui-design`：落地到 React、Tailwind、shared primitives、响应式布局和可访问性验证。
- `ui-animation`：保留现有 GSAP reveal，不增加无意义动效。
- `docs-writing`：记录 SDD 变更和验收结果。

## 改动范围

- `packages/ui/src/styles/globals.css`
- `packages/ui/src/primitives/button-variants.ts`
- `packages/ui/src/primitives/card.tsx`
- `apps/shell/src/shell/shell-layout.tsx`
- `apps/shell/src/pages/home-page.tsx`
- `apps/shell/src/pages/not-found-page.tsx`
- `experiments/welcome/src/welcome-page.tsx`
- `specs/architecture/styling.md`

## 设计调整

- 将主题调整为更冷静的浅灰工作台背景。
- 保留 emerald 作为唯一 action accent。
- 使用 amber 作为低频 icon tile 辅助色，不作为第二 CTA 颜色。
- 降低黑边卡片感，使用轻边框、轻阴影和更稳定的 card surface。
- shell sidebar 保持稳定宽度和现有折叠行为，但视觉上弱化边框重量。
- Overview 从 README 摘要式布局改成带状态面板的工作台首页。
- 实验入口卡片增加 header surface 和实验 icon，使导航目标更清楚。
- welcome 实验页与 shell 共享同一 surface 和节奏。
- not-found 页从裸文本改成一致的 card surface。

## 保持不变

- 路由结构。
- Redux store。
- RTK Query 接入。
- 实验 `ExperimentModule` 契约。
- welcome 实验的 counter 行为。
- GSAP reveal 示例的 scope 和 reduced-motion 逻辑。

## 验收标准

- core routes 在 desktop 和 mobile 下无页面级横向滚动。
- 按钮文字对比度满足 WCAG AA。
- `Button asChild` link button 保持 `text-primary-foreground` 生效。
- mobile icon buttons 保持 44px 触控目标。
- `pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm test:e2e:headless` 通过。
