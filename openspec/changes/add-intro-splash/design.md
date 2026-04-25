## Context

当前网站是一个 React + Vite 的单页应用，使用 Framer Motion 做动画，Tailwind CSS v4 做样式，所有内容通过 `src/config.ts` 配置驱动。用户打开网站后直接看到时间线内容，缺少一个情感化的入口过渡。

## Goals / Non-Goals

**Goals:**
- 提供全屏开场页，营造浪漫仪式感
- 支持配置驱动的文案（标题、副标题、提示语）
- 通过下滑/点击手势平滑过渡到主内容
- 过渡时自动播放背景音乐
- 使用 Framer Motion 实现流畅的入场/退场动画

**Non-Goals:**
- 不添加路由（保持单页应用结构）
- 不修改现有时间线、信封、粒子背景的动画逻辑
- 不添加新的外部依赖

## Decisions

1. **状态管理：App 层 useState**
   - 在 `App.tsx` 中维护 `showIntro` 布尔状态
   - 理由：状态极简，不需要 Context 或全局状态库
   - 替代方案：URL hash 路由 — 过于复杂，且用户明确不需要路由

2. **音乐触发：回调函数传递**
   - `MusicPlayer` 暴露 `play()` 方法，通过 ref 或回调在开场页消失时调用
   - 理由：避免直接操作 DOM，保持 React 组件封装
   - 替代方案：自动播放属性 — 浏览器限制用户交互后才能播放音频

3. **退场动画：Framer Motion AnimatePresence + 上滑**
   - 使用 `AnimatePresence` 包裹开场页，`exit={{ y: "-100%" }}`
   - 理由：与现有 Framer Motion 技术栈一致，动画流畅自然
   - 替代方案：CSS transition — 需要手动管理 mount/unmount，不如 AnimatePresence 简洁

4. **交互触发：onClick + wheel 事件**
   - 同时支持点击和鼠标滚轮/触摸滑动触发退场
   - 理由：覆盖桌面和移动端习惯
   - 替代方案：仅支持点击 — 不够自然；仅支持滚动 — 桌面用户可能不习惯

5. **装饰爱心：纯 CSS 动画**
   - 使用 Tailwind 的 `animate-bounce` 或自定义 keyframes 实现浮动爱心
   - 理由：不需要引入新的粒子库，轻量且可控
   - 替代方案：tsparticles — 项目中已使用，但杀鸡用牛刀

## Risks / Trade-offs

- **[Risk]** 部分浏览器可能阻止自动播放音频 → **Mitigation**: 音乐播放依赖用户点击/滑动交互，符合浏览器策略
- **[Risk]** 开场页增加一次渲染，低端设备可能略有延迟 → **Mitigation**: 组件轻量，无图片资源，仅文字和 CSS 动画
- **[Trade-off]** AnimatePresence 退场时主内容已渲染在下方，可能短暂重叠 → **Mitigation**: 使用 `position: fixed` 让开场页覆盖全屏，退场动画完成后再 unmount

## Migration Plan

无需迁移，纯增量功能。
