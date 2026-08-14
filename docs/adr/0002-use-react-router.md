# ADR 0002: 使用 React Router

## 状态

已接受

## 决策

shell 和独立实验 app 都使用 React Router。

## 原因

React Router 熟悉、稳定，对 playground shell 足够简单，同时也支持嵌套路由和独立实验入口。

## 影响

- shell 拥有顶层 router。
- 实验项目导出路由元数据和渲染组件。
- 独立实验 app 创建自己的 router。
