# 路由规格

## 目标

使用 React Router 将实验项目挂载到共享 shell 中，同时保留实验项目独立运行时的路由能力。

## 行为

- shell 拥有应用布局和顶层路由。
- `/` 是 shell 内置 Overview 页面，不作为实验项目出现。
- 底部 Dock 只展示实验项目。
- 点击顶部菜单栏的 `Playground` 标题回到 Overview 页面。
- 实验项目通过 `ExperimentModule` 暴露路由元数据。
- 未匹配的路由渲染 not-found 页面。

## 验收标准

- `/` 打开 shell 首页。
- `/experiments/welcome` 挂载 welcome 实验。
- Dock 中不展示 Overview；Overview 通过顶部 `Playground` 标题访问。
- 每个实验都是 Dock 中的一个导航入口。
- welcome 实验也可以独立运行。
