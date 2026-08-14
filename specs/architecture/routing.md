# 路由规格

## 目标

使用 React Router 将实验项目挂载到共享 shell 中，同时保留实验项目独立运行时的路由能力。

## 行为

- shell 拥有应用布局和顶层路由。
- 实验项目通过 `ExperimentModule` 暴露路由元数据。
- 未匹配的路由渲染 not-found 页面。

## 验收标准

- `/` 打开 shell 首页。
- `/experiments/welcome` 挂载 welcome 实验。
- welcome 实验也可以独立运行。
