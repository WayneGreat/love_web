# LetterEnvelope 重设计 — 全屏展开式信封

## 背景与目标

现有 `LetterEnvelope` 组件位于时间线末尾，使用小型横版信封（`w-80 h-56`），信件仅在信封内部向上抽出有限距离，无法提供沉浸式的阅读体验。

本次重设计的目标是：
- 将信封替换为截图所示的竖版大信封样式
- 点击打开后，三角形翻盖向上翻转，信件抽出并**扩展覆盖全屏幕**
- 全屏阅读体验优雅、沉浸
- 右上角提供关闭按钮，关闭后完整还原为初始闭合态
- 保持与现有时间线、滚动捕捉、Framer Motion 动画系统的兼容

## 现有架构约束

- 组件通过 `Timeline` 渲染，包裹在 `h-screen snap-start` 的 div 中
- 使用 Framer Motion `useInView` 驱动入场动画
- 信封内容来自 `config.letter`
- `noUnusedLocals` / `noUnusedParameters` 严格模式启用
- Tailwind v4 CSS-first 配置，无 `tailwind.config.js`

## 设计方案

### 闭合态（Closed State）

整个信封组件占据 `h-screen` 视口并居中显示：

- **标题** "给你的一封信" — 位于信封上方，深粉色/酒红色，手写体，居中
- **信封主体** — 接近正方形（约 `w-80 h-80`），浅粉渐变背景（`from-pink-100 to-pink-200`），圆角 `rounded-xl`，柔和阴影
- **翻盖** — 倒三角形，颜色比信封稍深（`bg-pink-400`），使用 `clip-path: polygon(0 0, 50% 100%, 100% 0)` 实现三角，闭合时覆盖信封上部
- **打开按钮** — 信封中部偏上的药丸形按钮，文字"点击打开信封"，粉色背景白字，带悬停效果
- **底部文字** — 信封下方居中，"愿我们的故事一直继续下去 ✨"，斜体，小字号

### 打开动画（Opening Animation，总时长 ~1.5s）

三步连贯动画：

1. **按钮淡出**（0ms ~ 200ms）
   - "点击打开信封"按钮 `opacity: 1 → 0`
2. **翻盖向上翻转**（200ms ~ 800ms，duration 0.6s）
   - 三角形绕顶部边缘 `rotateX: 0 → -180deg`
   - `transformOrigin: "top"`
   - 翻转完成后翻盖位于信封主体后方
3. **信件抽出并扩展为全屏**（800ms ~ 1500ms，duration 0.7s）
   - 白色信件卡片从信封内部向上抽出
   - 同时 `scale` 放大并位移，最终覆盖整个视口
   - 背景遮罩从透明渐变为半透明白色（`bg-pink-50/90` + `backdrop-blur-sm`）
   - 右上角关闭按钮淡入

### 全屏阅读态（Opened / Fullscreen State）

动画完成后进入全屏阅读态：

- **遮罩层**：`fixed inset-0`，半透明白色背景 + 轻微毛玻璃效果
- **信件卡片**：纯白底色，居中大宽度 `max-w-3xl mx-auto`，柔和阴影，圆角
- **标题**："给你的一封信"，`text-2xl`，居中
- **正文**：来自 `config.letter`，手写体 `font-handwriting`，`text-rose-700`，`text-lg`，`leading-relaxed`，`whitespace-pre-line`
- **关闭按钮**：`fixed top-6 right-6`，圆形 `w-10 h-10`，玫瑰色背景 + 白色 ✕ 图标

### 关闭动画（Closing Animation，总时长 ~1.2s）

关闭按钮触发逆向动画：

1. **信件收缩**（0ms ~ 500ms）
   - 全屏信件卡片缩小并下移回信封位置
   - 遮罩淡出
   - 关闭按钮淡出
2. **翻盖向下翻转**（500ms ~ 1100ms，duration 0.6s）
   - 三角形 `rotateX: -180 → 0`
   - 翻盖重新覆盖信封上部
3. **按钮淡入**（1100ms ~ 1300ms）
   - "点击打开信封"按钮 `opacity: 0 → 1`

## 技术实现要点

### 状态管理
- 组件内部使用 `useState<"closed" | "opening" | "opened" | "closing">` 驱动四个阶段的动画
- 或简化为 `isOpen` + `isAnimating` 布尔组合

### Framer Motion 动画结构
- 使用 `AnimatePresence` + `motion.div` 的 `exit` 变体处理全屏卡片的出现/消失
- 翻盖使用独立的 `motion.div` 配合 `animate` prop
- 按钮淡出/淡入使用条件渲染 + `motion` 过渡

### z-index 层级
- 闭合态信封：正常文档流，z-10 左右
- 全屏遮罩：`fixed inset-0 z-50`
- 关闭按钮：`fixed z-[60]`

### 可访问性
- 打开按钮：`aria-label="打开信封"`，`focus-visible:ring`
- 关闭按钮：`aria-label="关闭信件"`
- 全屏内容：`aria-hidden={!isOpen}`

### 性能
- 使用 `will-change: transform` 提示浏览器优化动画层
- 全屏态使用 `transform` 动画而非 `top/left`，保证 60fps

## 依赖

- Framer Motion（已有）
- Tailwind CSS v4（已有）
- `config.letter` 内容源（已有）

## 排除项

- 不修改 `config.ts` 中的信件内容格式
- 不修改时间线其他部分的布局或逻辑
- 不引入新的第三方依赖
