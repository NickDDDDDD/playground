# SDD 基线巡检 2026-08-15

## 目标

使用当前 SDD skill 工作流对项目做一次基线巡检，确认代码、UI、文档、测试和 agent 指令从这个时间点开始与 spec 对齐。

## 巡检范围

- `AGENTS.md`
- `README.md`
- `package.json`、`pnpm-workspace.yaml` 和 workspace package manifests
- `apps/shell`
- `packages/ui`
- `packages/experiment-contract`
- `experiments/welcome`
- `scripts/create-experiment.mjs`
- `e2e`、Vitest 和 Playwright 配置
- `specs/architecture/*`
- `docs/adr/*`

## 使用的工作流

- `agents-md`：检查 `AGENTS.md` 是否包含真实命令、项目约定和当前 skill 路由。
- `docs-writing`：检查 SDD 文档、README 和索引是否与当前实现一致。
- `product-design`：检查 shell navigation、实验入口和 counter 交互的语义是否正确。
- `ui-design`：检查 rendered UI 的响应式布局、可访问名称、交互目标尺寸和横向溢出。
- `ui-animation`：检查 GSAP 示例是否 scoped、cleanup-safe，并支持 reduced motion。

## 发现与处理

### 已修复

- mobile viewport 下 shell sidebar 与主内容横向并排，导致页面级横向滚动。
  - 处理：窄屏下 shell navigation 堆叠到内容上方，nav 横向滚动限制在自身区域内。
- icon-only button 在 mobile 下触控目标小于 44px。
  - 处理：`@playground/ui` 的 `size="icon"` button 在 mobile 下使用 44px，desktop 保持 36px。
- welcome 实验里的长命令文本可能撑破 mobile 布局。
  - 处理：命令 code block 改为局部横向滚动，不制造页面级横向滚动。
- grid/flex 布局中的 Card 可能被长内容的 min-content 宽度撑破。
  - 处理：共享 `Card` primitive 增加 `min-w-0`，让卡片在受限容器内正确收缩。
- 全局 `a { color: inherit }` 放在 Tailwind utilities 之后，会覆盖 `Button asChild` 链接按钮的 `text-primary-foreground`。
  - 处理：共享 base 样式移入 `@layer base`，让 utility class 正常覆盖元素默认样式。
  - 回归：新增 Playwright visual accessibility 测试，覆盖核心路由文本对比度和 link button foreground utility。
- `templates/experiment/package.json` 是未使用的旧模板，和 `scripts/create-experiment.mjs` 生成结果不一致。
  - 处理：删除该旧模板文件，当前实验生成入口以 `pnpm create:experiment <name>` 为准。
- README 的开发流程没有同步 lint、test、browser verification 和 SDD skill workflow。
  - 处理：更新 README 命令和 Development Flow。
- `AGENTS.md` 里的 skill 章节名偏窄。
  - 处理：改为 `SDD Skill 工作流`，并指向 `specs/architecture/skill-workflow.md`。

### 已确认

- shell 使用 React Router 管理 `/`、实验路由和 not-found。
- Overview 不作为实验显示在 sidebar 中。
- 实验通过 `ExperimentModule` 挂载，并支持独立 Vite entrypoint。
- shell 根部包裹 Redux Provider。
- sidebar 折叠状态使用 Redux Toolkit `createSlice`。
- RTK Query 已接入 shell store。
- `@playground/ui/styles.css` 集中维护 Tailwind CSS v4 `@source`。
- GSAP 和 `@gsap/react` 安装在 `@playground/ui`，业务页面通过共享 hook 使用最小 reveal 示例。
- 未发现 Axios、Framer Motion、anime.js 或其他动画方案与 GSAP 冲突。
- 未发现业务代码中的临时 `console.log` 或 `debugger`。

## 剩余风险

- 当前 welcome 实验仍是占位实验，不强制补更多测试，符合 `specs/architecture/testing.md` 的约束。
- 当前 shell 没有真实远程请求，因此 RTK Query error/loading UI 仍只是基础设施验证；后续接入真实 API 时需要按 product-design 和 ui-design 的 state coverage 规则补齐。
- 本次 UI 检查覆盖当前桌面和 mobile 视口，不等同于完整视觉回归体系。

## 验收标准

- `pnpm lint` 通过。
- `pnpm typecheck` 通过。
- `pnpm test` 通过。
- `pnpm build` 通过。
- `pnpm test:e2e:headless` 通过。
- 浏览器检查首页、welcome 实验、not-found、sidebar collapse 和 mobile viewport，无页面级横向滚动、无 console error。
