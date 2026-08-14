# 状态管理规格

## 目标

使用 Redux Toolkit 和 RTK Query 作为默认状态管理学习路径。

## 状态边界

- `createSlice` 负责客户端状态，例如 sidebar 折叠状态、主题偏好等。
- `createApi` 负责远程/服务端状态，例如接口数据、缓存、loading 和 error。
- 当实验目标需要隔离时，实验项目可以定义自己的本地 store。

## 验收标准

- shell 根部包裹 Redux Provider。
- sidebar 折叠状态存储在 Redux 中。
- RTK Query 已接入 shell store。
