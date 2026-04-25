# 时间轴组件设计

## 概述

实现 tasks.md Task Group 4：时间轴组件，包括全屏分段滚动、卡片进入动画和侧边导航圆点。

## 决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 布局风格 | 全屏分段 | 故事/卡片翻页体验，移动端友好，scroll-snap 吸附自然 |
| 卡片内容 | 完整展示（date+title+desc+image） | 信息完整，图片占视觉主体 |
| 导航形式 | 右侧固定圆点 | 简洁不打扰，点击跳转+高亮当前项 |
| 实现方案 | Framer Motion 驱动 | 动画和可见性检测统一用 framer-motion，代码一致性好，已安装依赖 |
| 可见性检测 | `useInView` | framer-motion 内置，与 whileInView 同一体系 |
| 滚动吸附 | 原生 CSS scroll-snap | 性能好，浏览器原生支持，无 JS 开销 |

## 组件设计

### TimelineSection.tsx

**职责**：单个时间点卡片，全屏高度，展示 date + title + desc + image，进入动画。

**Props**：
- `entry: TimelineEntry` — 从 config.ts 读取的时间点数据

**布局**：
- 桌面端：左右两栏，文字在左图片在右，垂直居中
- 移动端：单列堆叠，图片在文字下方
- 日期 `text-sm text-rose-300`，标题 `text-3xl font-handwriting text-rose-600`，描述 `text-rose-400`
- 图片 `object-cover rounded-xl`，最大高度 60vh

**动画**：
- 使用 framer-motion `whileInView` 触发，`viewport: { once: false, amount: 0.5 }`
- 退出时反向消失（滚动离开时淡出）
- 元素 stagger 顺序：日期 → 标题 → 描述 → 图片，`staggerChildren: 0.15`
- 每个元素：fadeIn + slideUp（图片额外 scaleUp）
- 过渡：`ease: "easeOut"`，duration 0.5s

**渲染结构**：
```tsx
<motion.section className="h-screen scroll-snap-align-start flex items-center justify-center">
  <motion.div variants={containerVariants} className="...">
    <motion.p variants={itemVariants}>{date}</motion.p>
    <motion.h2 variants={itemVariants}>{title}</motion.h2>
    <motion.p variants={itemVariants}>{desc}</motion.p>
    <motion.div variants={imageVariants}><img ... /></motion.div>
  </motion.div>
</motion.section>
```

### Timeline.tsx

**职责**：容器组件，遍历 config.timeline 渲染 TimelineSection 列表，持有 activeIndex 状态。

**滚动吸附**：
- 容器：`h-screen overflow-y-auto scroll-snap-type: y mandatory`
- 每个 TimelineSection：`scroll-snap-align: start`

**导航同步**：
- 给每个 TimelineSection 挂 `useInView({ amount: 0.5 })` ref
- 当某个 section 的 inView 变为 true，更新 activeIndex
- 传 activeIndex + onNavigate(index) 给 TimelineNav

### TimelineNav.tsx

**Props**：
- `activeIndex: number` — 当前可见时间点索引
- `onNavigate: (index: number) => void` — 点击圆点回调

**样式**：
- `fixed right-4 top-1/2 -translate-y-1/2 z-20`
- 圆点 `w-3 h-3 rounded-full`，默认 `bg-rose-300/50`
- 当前项 `bg-rose-600 scale-125`，framer-motion `layout` 动画切换
- 圆点间距 `gap-4`，纵向排列

**点击行为**：调用 `section.scrollIntoView({ behavior: "smooth" })`

### App.tsx 修改

用 Timeline 替换现有验证内容（config.timeline[0] 硬编码），保持粒子层 z-0 + 内容层 z-10 不变。TimelineNav 在 z-20。

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/components/TimelineSection.tsx` | 新建 | 单条时间点卡片组件 |
| `src/components/Timeline.tsx` | 新建 | 时间轴容器 + activeIndex 状态管理 |
| `src/components/TimelineNav.tsx` | 新建 | 侧边导航圆点 |
| `src/App.tsx` | 修改 | 集成 Timeline + TimelineNav，移除验证内容 |
| `src/config.ts` | 不变 | 只读 timeline 数据 |

## 约束

- 所有数据从 config.timeline 读取，不硬编码
- 动画用 framer-motion，不引入额外动画库
- 滚动吸附用原生 CSS scroll-snap，不用 JS polyfill
- 移动端必须可用（触摸滚动、响应式布局）
- TimelineNav 必须可点击，不拦截滚动
- TimelineSection 是纯展示组件，不持有状态
