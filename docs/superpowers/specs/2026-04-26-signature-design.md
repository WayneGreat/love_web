# LetterEnvelope 落款独立定位设计

## 背景与目标

当前 `config.letter.body` 末尾通过空格和换行手动模拟了信件落款（"爱你的小狗" + 日期），这种硬编码在正文中的方式有两个问题：

1. **视觉不可控** — 落款依赖 `whitespace-pre-wrap` 的空格缩进，在不同屏幕宽度下对齐效果不可控
2. **语义不清晰** — 落款本质是独立的信件元数据，和正文混在一起不利于后续维护

本次设计的目标是将落款从正文中抽出，变为一个**独立渲染、固定在信件卡片右下角**的元素，既提升视觉表现，也改善数据结构的语义性。

## 现有架构约束

- `LetterConfig` 当前只有 `title` / `body` / `footer` 三个字段
- 信件卡片使用 `whitespace-pre-wrap` 渲染正文，落款文字被当做普通正文行处理
- 使用 Framer Motion stagger 动画逐行显示正文
- Tailwind v4 CSS-first 配置，手写体通过 `@theme` 定义为 `--font-handwriting`
- `noUnusedLocals` / `noUnusedParameters` 严格模式启用

## 设计方案

### 数据层

扩展 `LetterConfig` 接口，新增 `signature?: string` 字段：

```typescript
export interface LetterConfig {
    title: string;
    body: string;
    signature?: string;
    footer: string;
}
```

在 `config.ts` 中：
- 将 `body` 末尾的落款文字（含日期）移除
- 将移除的内容填入新的 `signature` 字段

### 视觉层

信件卡片内部结构变为：

```
letter card (bg-white rounded-2xl ...)
  ├── h3 (letter title)
  ├── div (letter body)
  │   └── motion.p × N (逐行动画)
  └── motion.p (signature — text-right)
```

**落款样式：**
- 对齐：`text-right`（或 `text-end`）固定在卡片右下角
- 字体：`font-handwriting`（Dancing Script），与正文一致
- 颜色：`text-rose-700`，与正文一致
- 字号：`text-base`（与正文同级）
- 间距：上方留 `mt-8`，右侧留 `pr-4`，与正文形成呼吸感
- 内容：支持多行（换行符通过 `whitespace-pre-line` 保留）

### 动画层

落款作为 Framer Motion stagger 序列的**最后一项**：

- `variants` 沿用现有的 `containerVariants`，`staggerChildren: 0.06`
- 落款 `<motion.p>` 紧跟在正文最后一行之后，自然成为 stagger 序列的末尾
- `itemVariants` 沿用 `hidden: { opacity: 0, y: 20 }` → `visible: { opacity: 1, y: 0 }`
- 无需额外延迟，整体动画保持连贯

### 回退处理

若 `signature` 未定义（旧数据或可选字段），组件静默不渲染落款区域，避免破坏现有数据兼容性。

## 技术实现要点

### 组件修改

`LetterEnvelope.tsx` 中：
1. 在 `letter.body.split("\n")` 渲染循环结束后，条件渲染 `signature`
2. 使用 `letter.signature?.split("\n")` 支持多行签名
3. 每个签名行使用与正文相同的 `<motion.p>` 结构，但外层包裹一个 `text-right` 的容器

### 类型安全

由于 `signature` 是可选字段，组件内需使用可选链 `letter.signature?.split("\n")` 或条件判断，避免 TypeScript 报错。

### 动画容器

确保包裹正文和落款的 `motion.div`（`variants={containerVariants}`）覆盖到落款元素，使 stagger 动画延续到签名行。

## 依赖

- Framer Motion（已有）
- Tailwind CSS v4（已有）
- `config.ts` 中的 `LetterConfig` 定义

## 排除项

- 不修改信封打开/关闭动画逻辑
- 不修改信件卡片尺寸、颜色、阴影等已有样式
- 不引入新的第三方依赖
- 不改动 `footer` 字段（信封下方的 "愿我们的故事一直继续下去 ✨" 保持不变）
