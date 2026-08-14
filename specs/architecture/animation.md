# 动画架构规格

## 目标

为 React playground 建立可复用、可维护、可访问的动画基础。动画必须服务于 hierarchy、feedback、spatial relationship、continuity、focus 或 transition clarity，不为了展示技术而存在。

## 技术选择

- 当前项目使用 React + TypeScript + Vite + Tailwind CSS v4。
- 包管理器使用 pnpm。
- 复杂动画使用 GSAP。
- React 集成使用 `@gsap/react` 的 `useGSAP()`。
- 简单交互反馈继续优先使用 CSS transition。

GSAP 官方 React 指南说明 `useGSAP()` 会基于 `gsap.context()` 自动处理 cleanup，因此项目中的 React GSAP 动画默认使用共享封装，不在业务组件里散落裸 `gsap.to()`。

## 安装位置

GSAP 相关依赖安装在共享 UI 包 `@playground/ui` 中：

- `gsap`
- `@gsap/react`

原因：

- shell 和后续 experiments 都会消费 `@playground/ui`。
- 动画基础层应该靠共享包统一暴露。
- 业务组件只依赖 hook 和 preset，不直接关心注册细节。

## 共享 API

当前共享动画基础层：

- `@playground/ui` 导出 `gsap` 和 `useGSAP`。
- `@playground/ui` 导出 `revealPreset`。
- `@playground/ui` 导出 `usePrefersReducedMotion()`。
- `@playground/ui` 导出 `useGsapReveal(scope, options)`。

`useGsapReveal` 约定：

- 传入组件 root ref 作为 scope。
- 默认只选择 scope 内的 `[data-gsap-reveal]`。
- 组件卸载和依赖变化时由 `useGSAP()` 自动 revert。
- 用户开启 `prefers-reduced-motion: reduce` 时，直接设置最终状态，不播放位移动画。

## 使用边界

### CSS 优先

以下场景优先 CSS：

- button hover。
- focus state。
- simple opacity transition。
- basic color transition。
- simple transform。

### GSAP 优先

以下场景适合 GSAP：

- timeline。
- coordinated multi-element animation。
- stagger。
- scroll-driven animation。
- complex enter / leave sequences。
- SVG animation。
- text reveal。
- interactive sequences。
- complex transform choreography。

## 插件注册

当前未注册任何 GSAP 业务插件。

规则：

- 只注册实际使用的插件。
- 需要 ScrollTrigger、Flip、Observer、Draggable、MotionPathPlugin 等插件时，在共享动画入口中按需注册。
- 不一次性注册所有插件。
- 新插件会影响 bundle size 或动画语义时，同步更新本规格或 ADR。

## 性能规则

- 优先动画 `transform` 和 `opacity`。
- 避免动画 `width`、`height`、`top`、`left` 等触发布局计算的属性。
- 不使用高频手写 `scroll` listener 实现滚动动画；需要滚动编排时优先评估 ScrollTrigger。
- 不使用无边界的全局 selector；动画 selector 必须被组件 root ref 或等价 scope 限定。
- 不让动画成为读取内容或完成操作的前置条件。

## 可访问性规则

- 明显装饰性动画必须支持 `prefers-reduced-motion`。
- reduced motion 下禁用位移、缩放、长时长或循环动画，必要时保留 instant state 或短 opacity transition。
- 动画不能破坏键盘操作、focus 状态、表单输入或内容可读性。

## 示例

当前最小示例位于 shell 首页：

- `apps/shell/src/pages/home-page.tsx`

示例内容：

- 使用 `useRef` 建立页面 root scope。
- 调用 `useGsapReveal(pageRef)`。
- 对少量稳定内容块添加 `data-gsap-reveal`。
- 动画为轻量 fade + translate enter。

这个示例只用于验证 GSAP 基础层，不代表所有页面都必须添加进入动画。

## 验收标准

- `gsap` 和 `@gsap/react` 已安装到 `@playground/ui`。
- TypeScript 能识别 GSAP 类型。
- 至少有一个 scoped、cleanup-safe、reduced-motion-safe 的最小示例。
- 没有注册未使用的 GSAP 插件。
- `pnpm lint`、`pnpm typecheck`、`pnpm build` 通过。
