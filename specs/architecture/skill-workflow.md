# SDD Skill 工作流规格

## 目标

为当前 React playground 建立稳定的 SDD skill 调度规则，让前端 UI、动效、文案、文档、README、计划和 agent 指令修改都有明确分工，并能在开发过程中按任务性质自然触发。

标准流程：

```text
Design direction -> UI implementation -> visual audit -> browser review -> iterative improvement
```

## 已安装 Skills

- `design-taste-frontend`：来源 `Leonxlnx/taste-skill`，安装到 `C:\Users\User\.agents\skills\design-taste-frontend`。
- `ui-design`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\ui-design`。
- `typography-audit`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\typography-audit`。
- `product-design`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\product-design`。
- `ui-animation`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\ui-animation`。
- `copywriting`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\copywriting`。
- `docs-writing`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\docs-writing`。
- `readme-creator`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\readme-creator`。
- `planning`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\planning`。
- `agents-md`：来源 `mblode/agent-skills`，安装到 `C:\Users\User\.agents\skills\agents-md`。

这些 skills 通过 `npx skills list -g --agent codex --json` 验证为 Codex 全局 skills。

## 当前项目技术栈

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

### Product Design

仅在以下场景使用 `product-design`：

- 新建页面或主要功能。
- 页面结构需要明显重构。
- 用户流程或信息架构存在问题。
- primary action 不清楚。
- 交互状态或操作影响范围需要重新定义。

普通 UI polish 不强制调用 `product-design`。

### Motion

使用 `ui-animation`。

职责：

- 设计、实现或审计状态之间的过渡，例如 CSS transitions、keyframes、spring、gesture、drag、easing 和 timing。
- 当动效本身是任务主题时使用，例如“更顺滑”“加动画”“匹配这个 easing”“增加 swipe gesture”。
- 普通组件 hover、focus、pressed 的轻量反馈仍可由 `ui-design` 在实现中处理。
- 如果 gesture 改变了用户能做什么，例如 swipe-to-delete 或 hold-to-confirm，先由 `product-design` 决定交互语义，再由 `ui-animation` 实现动效。
- 当前项目使用 GSAP 作为复杂动画实现基础；具体使用边界见 `specs/architecture/animation.md`。

### Copywriting

使用 `copywriting`。

职责：

- 编写或修改短产品文案、landing copy、CTA、onboarding strings、空状态、错误状态、成功状态和权限状态文案。
- 清理明显 AI 味文案。
- 不负责技术文档；技术文档交给 `docs-writing`。
- 不决定 action 是否存在、作用范围和后果；这些先由 `product-design` 决定。

### Technical Documentation

使用 `docs-writing`。

职责：

- 编写或审计技术文档、how-to、reference、explanation 和 SDD 规格内容。
- 检查文档结构、清晰度、代码示例、链接、可扫描性和内容卫生。
- 不负责 `AGENTS.md`；agent 指令文件交给 `agents-md`。
- 不负责从零重写 README；README 门面重写交给 `readme-creator`。

### README

使用 `readme-creator`。

职责：

- 创建或大幅重写 `README.md`，让它成为面向读者的项目门面。
- 如果只是审计或轻微润色现有 README，使用 `docs-writing`。

### Planning

使用 `planning`。

职责：

- 创建计划、拆分任务、压力测试计划、验证计划中的可检查假设。
- 覆盖用户提到的 plan-create 和 plan-review 两种能力。
- 当 `planning` 处于工作模式时，不直接实现代码；计划通过后再进入实现。

### Agent Instructions

使用 `agents-md`。

职责：

- 审计、评分和重构 `AGENTS.md` / `CLAUDE.md`。
- 保持 agent 指令精简、可执行、命令真实、职责清楚。
- 不用通用 `docs-writing` 替代它。

## 名称映射

`mblode/agent-skills` 当前没有独立的 `ui-audit`、`ux-audit`、`plan-creator`、`plan-reviewer` skill 名称。对应关系如下：

- `ui-audit`：使用 `ui-design` Audit mode。
- `ux-audit`：用户流程、交互语义和信息架构使用 `product-design`；已构建 UI 的可用性和渲染质量使用 `ui-design` Audit mode。
- `plan-creator`：使用 `planning` Create mode。
- `plan-reviewer`：使用 `planning` Review mode。

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
