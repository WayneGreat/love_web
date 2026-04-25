## Context

周年纪念日网站的第五个功能模块——信封组件。用户滚动到时间轴末尾后看到一封可交互的情书信封，点击蜡封开启，信纸滑出展示信件内容，点击关闭按钮可收回。信封作为 Timeline 滚动容器的最后一个 snap 区块。

## Goals / Non-Goals

**Goals:**
- 经典矩形信封外观，上方三角翻盖，CSS 绘制无图片依赖
- 翻盖顶端蜡封图标，点击触发开启动画
- 翻盖 rotateX 翻转 + 信纸 translateY 滑出的顺序动画
- 关闭按钮收回信纸 + 关闭翻盖的逆序动画
- 信纸展示 config.letter 文字，手写字体渲染
- 与现有 Timeline 滚动容器无缝集成

**Non-Goals:**
- 不做信封拖拽/手势交互
- 不做信封内嵌图片或多媒体
- 不做信封主题切换（颜色由全局配置驱动）
- 不做信封拆开后的物理模拟（如纸片飞散）

## Decisions

### 1. 动画编排：Variant + delay

**选择**: Framer Motion variants + 固定 delay 控制时序

**理由**:
- 与项目已建立的 variants 模式一致（TimelineSection 用同样模式）
- 声明式代码最简洁，不需要 useAnimationControls 或状态机
- 翻盖 0.6s + 信纸 delay 0.4s 足够可靠，无需精确的 onAnimationComplete

**备选**:
- useAnimationControls 命令式编排：时序更精确但代码更多
- 状态机 + onAnimationComplete：最显式但对此场景过度设计

### 2. 信封外观：纯 CSS

**选择**: div + clip-path + 渐变背景绘制信封，无需图片

**理由**:
- 可通过 Tailwind 配色快速调整，与全局主题一致
- 无额外资源依赖，构建体积零增加
- clip-path 三角形翻盖比 SVG 更简洁

### 3. 信封位置：Timeline 末尾 snap 区块

**选择**: 信封作为滚动容器的最后一个 snap-start 区块

**理由**:
- 用户自然滚到最后即看到信封，体验连贯
- 复用现有 Timeline 的 scroll-snap + wrapper div 模式
- 与时间轴形成叙事弧线：回顾 → 情书

### 4. 关闭交互：信纸上的关闭按钮

**选择**: 信纸右上角 X 按钮，点击触发关闭

**理由**:
- 操作明确，不会误触
- focus-visible:ring 保证键盘可访问
- 关闭动画与开启动画互逆

## Animation Specification

### Open sequence (isOpen: false → true)

1. Flap: rotateX 0 → 180deg, 0.6s, easeOut, transformOrigin: top
2. Letter: translateY 0 → -120px + opacity 0 → 1, delay 0.4s, 0.5s
3. Text: staggerChildren 0.05, opacity 0 → 1 per line

### Close sequence (isOpen: true → false)

1. Text: opacity 1 → 0, 0.2s
2. Letter: translateY -120px → 0, delay 0.1s, 0.4s, easeIn
3. Flap: rotateX 180deg → 0, delay 0.3s, 0.6s

### Variant objects

```
flapVariants:     { closed: rotateX(0),    open: rotateX(180deg) }
letterVariants:   { closed: translateY(0),  open: translateY(-120px) }
textVariants:     { closed: opacity(0),     open: opacity(1) with stagger }
```

## Visual Specification

### Envelope body
- Width: max-w-md (~400px), centered
- Height: ~250px
- Background: gradient from-rose-100 to-rose-200
- Border radius: rounded-lg
- Shadow: shadow-xl

### Flap
- clip-path: polygon() for triangle shape
- Background: gradient from-rose-200 to-rose-300 (darker than body)
- transformOrigin: top
- Parent: perspective 800px on envelope body

### Seal
- Position: absolute, centered at flap apex
- Size: w-8 h-8, circle
- Background: bg-rose-600
- Cursor: pointer + focus-visible:ring

### Letter
- Background: bg-white
- Width: envelope body - 20px each side
- Padding: p-6
- Font: font-handwriting, text-rose-700
- Overflow: overflow-y-auto, max-h-[200px]

### Close button
- Position: absolute, top-right of letter
- Size: w-6 h-6, circle
- Background: bg-rose-100 hover:bg-rose-200
- Icon: X (text or SVG)
- focus-visible:ring for keyboard access

## Component API

```typescript
interface LetterEnvelopeProps {
    // No props needed — reads from config.letter internally
    // Wrapper div handles snap-start + ref for scrollIntoView
}
```

## Integration

- LetterEnvelope rendered inside Timeline's scroll container as the last item
- Wrapper div with `snap-start` class, same pattern as TimelineSection
- Adds `useInView` for fade-in entrance animation when scrolled into view
- Timeline.tsx 需修改：在 config.timeline.map 之后追加 LetterEnvelope 作为最后一个 snap 区块

## Risks / Trade-offs

- **[3D perspective compat]** rotateX 在极旧浏览器不生效 → 降级为简单展开，不影响内容可访问性
- **[信纸遮挡]** 信纸滑出高度固定 -120px，长信可能溢出 → max-h + overflow-y-auto 兜底
- **[动画时序]** 固定 delay 在极端设备性能下可能不同步 → Framer Motion 自动跳帧保证最终状态正确
