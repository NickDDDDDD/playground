# ADR 0003: 使用 Redux Toolkit 和 RTK Query

## 状态

已接受

## 决策

使用 Redux Toolkit 管理客户端应用状态，使用 RTK Query 管理服务端状态。

## 原因

这个项目也是学习 playground。Redux Toolkit 作为现代 Redux 的默认实践，值得作为状态管理基线来熟悉。

## 影响

- 客户端 UI 状态使用 `createSlice` 建模。
- 服务端数据使用 `createApi` 建模。
- 默认不引入 Axios；RTK Query 先使用 `fetchBaseQuery`。
