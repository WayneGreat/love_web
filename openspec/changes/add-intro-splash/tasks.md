## 1. 配置与接口准备

- [ ] 1.1 在 `src/config.ts` 中添加 `intro` 配置类型和默认值（title、subtitle、hint、themeColor 可选覆盖）
- [ ] 1.2 在 `src/components/MusicPlayer.tsx` 中通过 `useImperativeHandle` 暴露 `play()` 方法

## 2. 开场页组件开发

- [ ] 2.1 创建 `src/components/IntroSplash.tsx`，实现全屏固定定位的开场页布局
- [ ] 2.2 添加配置驱动的文案渲染（大标题、副标题、底部提示语）
- [ ] 2.3 添加角落浮动爱心装饰（至少两个，CSS 动画）
- [ ] 2.4 添加向下箭头图标和动画
- [ ] 2.5 使用 Framer Motion 实现入场动画（淡入 + 轻微上移）

## 3. 交互与退场逻辑

- [ ] 3.1 实现 `onClick` 触发退场
- [ ] 3.2 实现 `wheel` 和 `touchmove` 事件监听触发退场
- [ ] 3.3 使用 `AnimatePresence` 实现向上滑出退场动画（0.8s ease-in-out）
- [ ] 3.4 退场开始时调用 `MusicPlayer.play()` 播放背景音乐
- [ ] 3.5 退场完成后卸载开场页组件（`onExitComplete`）

## 4. 集成与验证

- [ ] 4.1 在 `src/App.tsx` 中添加 `showIntro` 状态，集成 `IntroSplash` 和 `AnimatePresence`
- [ ] 4.2 确保开场页固定定位（`fixed`）覆盖主内容，退场后正常滚动
- [ ] 4.3 运行 `npm run build` 检查 TypeScript 编译和 ESLint
- [ ] 4.4 本地预览验证：开场页显示、点击/滑动退场、音乐播放、动画流畅
