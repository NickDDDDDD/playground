# ADR 0007: 使用 GSAP 作为复杂 UI 动画基础

## 状态

已接受

## 决策

引入 `gsap` 和 `@gsap/react`，并在 `@playground/ui` 中提供共享动画基础层。

React 组件默认通过 `@gsap/react` 的 `useGSAP()` 使用 GSAP。业务组件不直接散落裸 `gsap.to()`，而是优先复用共享 hook 和 preset。

当前不注册 ScrollTrigger、Flip、Observer、Draggable 等插件；后续只在实际需求出现时按需注册。

## 原因

项目后续会包含多个 UI 实验，复杂 enter/leave、stagger、timeline、scroll-driven 或 SVG 动画需要比 CSS transition 更强的编排能力。GSAP 适合这些复杂场景，但简单 hover、focus、opacity、color 和 transform 过渡继续用 CSS 更轻、更直接。

`@gsap/react` 的 `useGSAP()` 可以自动处理 React 组件中的动画 cleanup，降低 React Strict Mode 下重复执行和卸载残留的风险。

## 影响

- `@playground/ui` 新增动画导出。
- 业务组件应通过共享动画 hook 和 preset 复用 GSAP。
- 动画必须支持 `prefers-reduced-motion`。
- 新增 GSAP 插件时需要更新动画规格，必要时补 ADR。
