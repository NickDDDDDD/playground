# UI 设计工作流规格

## 目标

为当前 React playground 建立稳定的前端 UI 工作流，让 UI 修改从视觉方向、实现、审计到浏览器验证都有明确分工。

标准流程：

```text
Design direction -> UI implementation -> visual audit -> browser review -> iterative improvement
```

## 已安装 Skills

- `design-taste-frontend`：来源 `Leonxlnx/taste-skill`，安装到 `C:\Users\User\.agents\skills\design-taste-frontend`。
- `ui-design`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\ui-design`。
- `typography-audit`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\typography-audit`。
- `product-design`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\product-design`。

这些 skills 通过 `npx skills list -g --agent codex --json` 验证为 Codex 全局 skills。

## 当前项目 UI 技术栈

- Framework：React + TypeScript + Vite。
- Styling：Tailwind CSS v4，集中在 `@playground/ui/styles.css` 中维护 `@source` 和主题 token。
- Component library：项目自有 shadcn-style UI package `@playground/ui`。
- Icons：当前项目已使用 `lucide-react`，后续 UI 修改应保持同一图标体系，除非通过 ADR 明确替换。
- Routing：React Router。
- State：Redux Toolkit + RTK Query。

## Skill 分工

### Visual Direction

使用 `design-taste-frontend`。

职责：

- 判断页面视觉方向和成熟度。
- 避免模板化、AI 感明显的 UI。
- 约束 spacing、typography、visual density、color usage、composition 和 motion。
- 避免无意义的 rounded cards、gradient、glassmorphism、shadow 和装饰元素。

### UI Structure & Implementation

使用 `ui-design`。

职责：

- 将视觉方向转换为真实页面结构、组件、Tailwind class 和 responsive behavior。
- 复用现有 `@playground/ui` primitives、主题 token 和布局模式。
- 补齐必要的 hover、focus、active、selected、disabled、loading、empty、error 状态。

### Typography Audit

使用 `typography-audit`。

职责：

- 检查 typography hierarchy、font size、font weight、line height、spacing rhythm、readability、alignment 和 information hierarchy。
- 在实现后作为独立审计步骤使用。

### Product Structure

仅在以下场景使用 `product-design`：

- 新建页面或主要功能。
- 页面结构需要明显重构。
- 用户流程或信息架构存在问题。
- primary action 不清楚。
- 交互状态或操作影响范围需要重新定义。

普通 UI polish 不强制调用 `product-design`。

## 修改边界

除非用户明确要求 redesign，UI 优化默认保持：

- 原有功能。
- 原有业务逻辑。
- 原有 API。
- 原有数据结构。
- 原有路由语义。
- 原有用户流程。

如果实现高质量 UI 必须做较大结构调整，先说明原因，再执行。

## 浏览器验证

UI 修改完成后必须验证实际渲染结果，而不只看源码。

至少检查：

- desktop viewport。
- narrower desktop 或 tablet viewport。
- mobile viewport。
- 关键 hover、focus、active 或展开折叠等交互状态。
- 控件文字是否溢出、遮挡或跳动。
- 视觉层级、间距节奏和内容密度是否符合当前页面目标。

当前项目已经接入 Playwright。涉及用户级浏览器流程时，优先使用：

```bash
pnpm test:e2e
```

需要无窗口回归时使用：

```bash
pnpm test:e2e:headless
```

## 验收标准

- UI 需求开始前已检查现有技术栈和设计约定。
- 使用的 skill 与任务性质匹配，没有让多个 skill 抢占职责。
- 代码实现复用现有技术栈，不因为 skill 示例迁移框架或样式方案。
- 实现后完成 typography 或视觉审计。
- 浏览器中检查 desktop 和 mobile 渲染结果。
- 明显视觉问题经过至少一轮迭代修复。
- 临时日志、报告和测试产物在完成后清理。
