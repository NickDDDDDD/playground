# Agent 工作指南

这个仓库是一个 SDD（Spec-Driven Development，规格驱动开发）的 React playground。任何 agent 在修改代码前，都应该先理解项目规格、架构决策和当前任务边界。

## 工作原则

- 默认使用中文沟通和编写 SDD 文档；技术名词、包名、命令、API 名称保留英文原文。
- 先读相关 spec，再实现代码；如果行为或约束发生变化，同步更新 spec。
- 当技术选择会影响后续开发时，新增或更新 `docs/adr/` 下的 ADR。
- 保持改动聚焦，不顺手重构无关模块。
- 不提交临时 debug 产物，例如 dev server log、error log、scratch 输出文件。
- 修复和验证完成后，主动清理临时产物，并在最终反馈中说明清理情况。

## 项目结构

- `apps/shell`：主应用 shell，负责布局、路由和全局 Redux store。
- `packages/ui`：共享 shadcn-style UI primitives 和 Tailwind 全局样式。
- `packages/experiment-contract`：实验包接入 shell 的公开类型契约。
- `experiments/*`：每个技术探索实验，一个实验一个 workspace package。
- `tests/`：测试配置、Vitest setup、Playwright E2E、测试报告和运行结果目录。
- `specs/`：SDD 规格文档。
- `docs/adr/`：架构决策记录。

## 新增或修改实验

1. 先新增或更新 `specs/experiments/<name>.md`。
2. 如果实验需要新的长期约定，更新对应 `specs/architecture/*.md`。
3. 如果涉及架构决策，新增 `docs/adr/<number>-<slug>.md`。
4. 实验包必须导出 `ExperimentModule`，并支持 shell 挂载和独立运行。
5. 新实验默认使用项目内 `.codex/skills/create-playground-experiment` skill；该 skill 调用 `pnpm create:experiment <name>` 生成基础包，并继续完成 shell 注册、spec 更新和验证。

## 路由和状态约定

- shell 使用 React Router 管理顶层路由。
- 实验通过 `ExperimentModule` 提供 `id`、`title`、`description`、`path`、`tags` 和 `Component`。
- 客户端状态使用 Redux Toolkit `createSlice`。
- 服务端状态使用 RTK Query `createApi`。
- 默认不引入 Axios；需要复杂 HTTP 行为时再通过 ADR 记录。

## 样式约定

- 所有 app 和 experiment 都导入 `@playground/ui/styles.css`。
- Tailwind CSS v4 的 `@source` 集中维护在共享 UI stylesheet 中。
- 新增会产出 Tailwind classes 的 workspace 根目录时，必须同步更新 `@source`。
- UI 修复要用浏览器验证，不只依赖编译通过。

## SDD Skill 工作流

按任务性质自然触发对应 skill；详细分工见 `specs/architecture/skill-workflow.md`。当用户要求优化 UI、重设计页面、polish 组件、改善 UX、让页面更好看，或类似表达时，遵循 `Design direction -> UI implementation -> visual audit -> browser review -> iterative improvement`。

- `design-taste-frontend`：负责视觉方向和 taste 判断。用于确定页面应该如何避免 generic AI UI，例如视觉层级、密度、间距、字体、颜色、构图、动效克制程度。
- `ui-design`：负责把视觉方向落到当前技术栈内的真实组件、CSS、响应式布局和交互状态。优先复用 `@playground/ui`、Tailwind v4 token 和已有组件模式。
- `typography-audit`：实现完成后用于检查字体层级、字号、字重、行高、节奏、可读性、对齐和信息密度。
- `product-design`：只在新增页面、用户流程、信息架构、primary action 或交互结构明显变化时使用；普通视觉 polish 不强制调用。
- `ui-animation`：只在动效本身是任务主题时使用，例如 easing、spring、gesture、drag、页面/组件过渡；普通 hover transition 仍由 `ui-design` 处理。
- `copywriting`：负责短产品文案、CTA、空/错/成功状态文案、landing copy 和 AI 味文案清理；技术文档不要交给它。
- `docs-writing`：负责技术文档和 SDD 文档的写作、审计和结构质量；README 从零重写交给 `readme-creator`。
- `readme-creator`：只在创建或大幅重写 `README.md` 时使用；普通 README prose polish 用 `docs-writing`。
- `planning`：覆盖 plan-create 和 plan-review；当用户明确要计划、压力测试计划、拆任务或先讨论方案时使用，不在该模式下直接写代码。
- `agents-md`：负责审计和重构 `AGENTS.md` / `CLAUDE.md`；不要用通用 docs skill 改 agent 指令文件。

执行 UI 工作时先检查现有页面结构、组件、typography、spacing、colors、layout、responsive behavior 和 interaction states，再决定改动。除非用户明确要求 redesign，不改变业务逻辑、API、数据结构、路由语义和现有用户流程。

当前项目是 React + Vite + TypeScript + Tailwind CSS v4 + shadcn-style 自有 UI package。不要为了套用 skill 示例而迁移技术栈；skill 只提供设计和实现原则。

`ui-audit`、`ux-audit`、`plan-creator`、`plan-reviewer` 当前不是已安装 skill 名称：UI audit 归 `ui-design` Audit mode，UX/flow review 归 `product-design`，计划创建和计划审计都归 `planning`。

GSAP 只用于 timeline、stagger、scroll-driven、复杂 enter/leave、SVG 或交互编排；button hover、简单 opacity/color/transform transition、focus state 继续优先使用 CSS。React 组件中不要散落 `gsap.to()`，优先复用 `@playground/ui` 暴露的动画 hook 和 preset；新增 GSAP 插件必须按需注册并记录到 spec。

## 验证命令

常规改动完成后至少运行：

```bash
pnpm lint
pnpm typecheck
pnpm test
```

涉及构建、依赖、Vite、Tailwind 或 workspace 边界时，额外运行：

```bash
pnpm build
```

涉及 UI 布局或交互时，启动项目并用浏览器验证：

```bash
pnpm dev
```

涉及用户级浏览器流程时，使用 Playwright：

```bash
pnpm test:e2e
```

UI 修改完成后，至少检查 desktop 和 mobile viewport。优先使用 Playwright 或浏览器自动化查看实际渲染结果，找出最明显的视觉问题并迭代修复；目标是 rendered UI looks good，而不是只让源码看起来合理。

## Git 约定

- 当前远端使用 HTTPS：`https://github.com/NickDDDDDD/playground.git`。
- 同一个小问题或同一轮 UI debug 不要每改一小步就 commit/push；先本地迭代、浏览器验证、清理临时产物，等问题完整收束后再提交。
- 用户还在反馈“还是有”“再看看”“不对”等未确认状态时，默认不要提交；除非用户明确要求保存当前检查点。
- 每次提交应该对应一个稳定、可解释的完成点，例如一个完整 bugfix、一个 spec 决策、一个可独立 review 的功能切片。
- 提交前检查 `git status -sb`，避免混入无关改动。
- 提交信息保持简短明确，例如 `docs: update agent workflow`。
