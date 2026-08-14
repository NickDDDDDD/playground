# 路由规格

## 目标

使用 React Router 将实验项目挂载到共享 shell 中，同时保留实验项目独立运行时的路由能力。

## 行为

- shell 拥有应用布局和顶层路由。
- `/` 是 shell 内置 Overview 页面，不作为实验项目出现。
- Overview 直接渲染在桌面层，不放进实验窗口。
- 底部 Dock 只展示实验项目。
- 实验项目通过 `ExperimentModule` 暴露路由元数据。
- 实验路由渲染在桌面窗口中。
- 窗口关闭按钮返回 `/`。
- 窗口最小化按钮返回 `/`，同时保留当前实验的运行状态。
- 最小化和关闭都会显示桌面 Overview；区别是最小化后 Dock 中对应实验保留运行指示点，关闭后清除运行指示点。
- 点击当前实验的 Dock item 会恢复最小化窗口。
- 窗口最大化按钮在普通窗口和全屏窗口之间切换。
- Focus / Sleep Screen 是 shell 层 overlay 状态，不改变当前路由、不关闭实验，也不清除 Dock 运行指示点。
- 从 Focus / Sleep Screen 唤醒后应回到进入 sleep 前的 shell 状态。
- 未匹配的路由渲染 not-found 页面。

## 验收标准

- `/` 打开 shell 首页。
- `/experiments/welcome` 挂载 welcome 实验。
- Dock 中不展示 Overview，只展示实验。
- 每个实验都是 Dock 中的一个导航入口。
- 实验窗口的关闭、最小化、最大化按钮都能改变真实 UI 状态。
- 最小化和关闭都会回到桌面，但 Dock 运行指示点必须不同。
- 最大化窗口必须占满可用 viewport。
- Focus / Sleep Screen 可以从桌面右键菜单进入，并可以通过 Wake 按钮或 Escape 离开。
- welcome 实验也可以独立运行。
