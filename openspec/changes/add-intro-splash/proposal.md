## Why

当前网站打开后直接进入时间线内容，缺乏情感铺垫和仪式感。用户希望添加一个温馨的开场页，让访客在进入主内容前先沉浸在浪漫氛围中，同时通过交互动作（下滑/点击）自然过渡到主内容并触发背景音乐，提升整体体验。

## What Changes

- 新增全屏开场页组件 `IntroSplash`，覆盖首屏
- 开场页包含：大标题、副标题、底部提示文字、向下箭头、浮动爱心装饰
- 所有文案通过 `config.ts` 配置驱动
- 用户点击或向下滑动后，开场页向上滑出消失，平滑进入时间线主内容
- 开场页消失时自动触发背景音乐播放
- 新增 Framer Motion 入场/退场动画

## Capabilities

### New Capabilities
- `intro-splash`: 网站全屏开场页，包含文案展示、装饰动画、交互过渡及音乐联动

### Modified Capabilities
- （无现有 spec，此项为空）

## Impact

- 新增组件文件：`src/components/IntroSplash.tsx`
- 修改文件：`src/App.tsx`（添加开场页状态管理）、`src/config.ts`（添加开场页配置）、`src/components/MusicPlayer.tsx`（暴露播放触发接口）
- 无外部依赖变更
- 无 API 变更
