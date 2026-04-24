# 项目初始化与配置模块设计

## 概述

为周年纪念日网站建立项目基础：Vite + React + TypeScript 项目脚手架、Tailwind v4 样式集成、集中配置模块。覆盖 tasks.md 中的第 1、2 两组任务。

## 决策记录

### 1. 技术栈版本

| 依赖 | 版本 | 理由 |
|------|------|------|
| React | 18.x | 稳定版，Framer Motion 兼容 |
| Vite | latest (5.x+) | 官方推荐，构建快 |
| Tailwind CSS | v4 + @tailwindcss/vite | CSS-first 配置，更简洁现代 |
| Framer Motion | latest | 声明式 React 动画 |
| @tsparticles/react + slim | latest | 轻量粒子效果 |

### 2. 部署路径

- Vite `base` 配置为 `/love_web/`
- 静态资源路径不加前导 `/`（如 `images/pic1.jpg`），Vite 自动处理 base 前缀

### 3. Tailwind v4 CSS-first 配置

- 使用 `@tailwindcss/vite` 插件，不使用 PostCSS
- 自定义颜色和字体通过 `@theme` 指令在 `index.css` 中定义
- 不创建 `tailwind.config.js`

### 4. Google Fonts 引入方式

- 在 `index.html` 的 `<head>` 中通过 `<link>` 标签加载 Dancing Script
- 不通过 npm 包或 @font-face 自托管

### 5. 音乐资源

- 背景音乐放在 `public/music/` 目录
- 配置中写相对路径如 `music/bgm.mp3`

### 6. 示例数据语言

- config.ts 中使用中文示例数据（3-4 个时间点 + 信件文字）

## 项目结构

```
love_web/
├── public/
│   ├── images/          # 时间轴图片
│   │   ├── pic1.jpg
│   │   ├── pic2.jpg
│   │   └── pic3.jpg
│   └── music/           # 背景音乐
│       └── bgm.mp3
├── src/
│   ├── config.ts        # 集中配置（SiteConfig 类型 + 数据）
│   ├── App.tsx          # 主页面组合
│   ├── main.tsx         # React 入口
│   ├── index.css        # 全局样式 + Tailwind @theme
│   └── components/
│       ├── ParticleBackground.tsx
│       ├── Timeline.tsx
│       ├── TimelineSection.tsx
│       ├── TimelineNav.tsx
│       ├── LetterEnvelope.tsx
│       └── MusicPlayer.tsx
├── index.html
├── vite.config.ts       # base: '/love_web/'
├── package.json
└── tsconfig.json
```

## 配置模块设计

### SiteConfig 类型

```typescript
interface TimelineEntry {
    date: string;       // "2023-05-20"
    title: string;      // "第一次见面"
    desc: string;       // "那天阳光很好..."
    image: string;      // "images/pic1.jpg"（相对于 public/）
}

interface ThemeColor {
    primary: string;       // 主色 "#e91e63"
    gradientFrom: string;  // 渐变起始 "#fce4ec"
    gradientTo: string;    // 渐变结束 "#f8bbd0"
}

interface SiteConfig {
    bgMusic: string;          // "music/bgm.mp3"
    themeColor: ThemeColor;
    timeline: TimelineEntry[];
    letter: string;           // 信件文字
}
```

### 路径约定

- 图片路径：`images/pic1.jpg`（不加前导 `/`，Vite base 自动处理）
- 音乐路径：`music/bgm.mp3`（同上）
- 所有资源放在 `public/` 目录下

### 示例数据

- 3-4 个中文时间点（如 "第一次见面"、"第一个圣诞节" 等）
- 信件文字使用中文
- 主题色使用粉色系默认值

## Vite 配置

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/love_web/',
    plugins: [react(), tailwindcss()],
})
```

## Tailwind v4 集成

### index.css

```css
@import "tailwindcss";

@theme {
    /* 手写字体（Tailwind v4 内置 rose 色系，无需重复定义） */
    --font-handwriting: "Dancing Script", cursive;
}

/* 全局粉色渐变背景 */
body {
    background: linear-gradient(135deg, #fce4ec, #f8bbd0);
    min-height: 100vh;
}
```

### index.html 字体引入

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
```

## 不做的事情

- 不配置 ESLint / Prettier（轻量项目，暂不需要）
- 不配置路由（单页面，无需 react-router）
- 不配置环境变量（无后端，无需 .env）
- 不做 CI/CD（手动部署 GitHub Pages）
- 不配置测试框架（tasks.md 第 8 组只做手动验证）
