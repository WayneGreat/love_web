# 项目初始化与配置模块 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立周年纪念日网站的项目脚手架（Vite + React + TS + Tailwind v4）和集中配置模块。

**Architecture:** 使用 Vite 创建 React + TypeScript 项目，集成 Tailwind v4（CSS-first via @tailwindcss/vite），配置 GitHub Pages 子目录部署路径。所有可定制内容集中在 `src/config.ts`，通过 TypeScript 类型接口约束结构。静态资源（图片、音乐）放在 `public/` 目录。

**Tech Stack:** Vite 5.x, React 18, TypeScript, Tailwind CSS v4 + @tailwindcss/vite, Framer Motion, @tsparticles/react + @tsparticles/slim

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Create (via vite scaffold) | 项目依赖和脚本 |
| `vite.config.ts` | Create (via scaffold) + Modify | Vite 配置：base 路径 + Tailwind 插件 |
| `tsconfig.json` | Create (via scaffold) | TypeScript 配置 |
| `tsconfig.app.json` | Create (via scaffold) | TS app 编译选项 |
| `index.html` | Modify | 添加 Google Fonts link |
| `src/main.tsx` | Create (via scaffold) | React 入口 |
| `src/App.tsx` | Create (via scaffold) + Modify | 主组件，渲染 config 验证信息 |
| `src/index.css` | Modify | Tailwind @import + @theme + 全局渐变 |
| `src/config.ts` | Create | SiteConfig 类型 + 示例配置数据 |
| `public/images/.gitkeep` | Create | 图片目录占位 |
| `public/music/.gitkeep` | Create | 音乐目录占位 |
| `src/App.css` | Delete | 不需要独立 App 样式文件 |
| `src/assets/` | Delete | 不使用 assets 目录（静态资源走 public） |

---

### Task 1: 创建 Vite + React + TypeScript 项目

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: 用 Vite 脚手架创建项目**

在 `/root/project/love_web` 目录下初始化项目（项目目录已存在，在当前目录内初始化）：

```bash
cd /root/project/love_web && npm create vite@latest . -- --template react-ts
```

如果提示目录非空，选择覆盖/合并。脚手架会生成 `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/App.css` 等文件。

- [ ] **Step 2: 安装依赖**

```bash
cd /root/project/love_web && npm install
```

Expected: 安装成功，`node_modules` 目录生成，无错误。

- [ ] **Step 3: 验证脚手架可运行**

```bash
cd /root/project/love_web && npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173 | head -20
kill %1
```

Expected: 返回 HTML 包含 `<div id="root">`，Vite 开发服务器正常启动。

- [ ] **Step 4: Commit**

```bash
cd /root/project/love_web && git add -A && git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

### Task 2: 安装项目依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 Tailwind v4 + Vite 插件**

```bash
cd /root/project/love_web && npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 2: 安装 Framer Motion**

```bash
cd /root/project/love_web && npm install framer-motion
```

- [ ] **Step 3: 安装 tsparticles**

```bash
cd /root/project/love_web && npm install @tsparticles/react @tsparticles/slim @tsparticles/engine
```

- [ ] **Step 4: 验证依赖安装**

```bash
cd /root/project/love_web && npm ls tailwindcss @tailwindcss/vite framer-motion @tsparticles/react @tsparticles/slim --depth=0
```

Expected: 所有包列出，无 `UNMET DEPENDENCY` 或 `missing` 错误。

- [ ] **Step 5: Commit**

```bash
cd /root/project/love_web && git add package.json package-lock.json && git commit -m "feat: add Tailwind v4, Framer Motion, tsparticles dependencies"
```

---

### Task 3: 配置 Vite（base 路径 + Tailwind 插件）

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 修改 vite.config.ts**

将脚手架生成的 `vite.config.ts` 替换为：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    base: '/love_web/',
    plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 2: 验证构建**

```bash
cd /root/project/love_web && npm run build
```

Expected: 构建成功，`dist/` 目录生成，HTML 中资源路径包含 `/love_web/` 前缀。

- [ ] **Step 3: Commit**

```bash
cd /root/project/love_web && git add vite.config.ts && git commit -m "feat: configure Vite base path and Tailwind v4 plugin"
```

---

### Task 4: 配置 Tailwind v4 和全局样式

**Files:**
- Modify: `src/index.css`
- Delete: `src/App.css`

- [ ] **Step 1: 替换 src/index.css**

将 `src/index.css` 内容替换为：

```css
@import "tailwindcss";

@theme {
    --font-handwriting: "Dancing Script", cursive;
}

body {
    background: linear-gradient(135deg, #fce4ec, #f8bbd0);
    min-height: 100vh;
    margin: 0;
    padding: 0;
}
```

- [ ] **Step 2: 删除 src/App.css**

```bash
rm /root/project/love_web/src/App.css
```

- [ ] **Step 3: 清理 App.tsx 中对 App.css 的引用**

检查 `src/App.tsx`，删除 `import './App.css'` 行（如存在）。脚手架生成的 App.tsx 通常包含此 import。

- [ ] **Step 4: 验证样式生效**

```bash
cd /root/project/love_web && npm run build
```

Expected: 构建成功，无 CSS 相关错误。

- [ ] **Step 5: Commit**

```bash
cd /root/project/love_web && git add src/index.css && git add -u src/App.css && git commit -m "feat: configure Tailwind v4 with handwriting font and pink gradient"
```

---

### Task 5: 引入 Google Fonts

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 在 index.html 的 `<head>` 中添加字体链接**

在 `index.html` 的 `<head>` 中，`<title>` 标签之前添加：

```html
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2: 验证 HTML 结构**

```bash
cd /root/project/love_web && grep -c "Dancing Script" index.html
```

Expected: 输出 `1`（找到一处引用）。

- [ ] **Step 3: Commit**

```bash
cd /root/project/love_web && git add index.html && git commit -m "feat: add Dancing Script Google Font"
```

---

### Task 6: 创建静态资源目录

**Files:**
- Create: `public/images/.gitkeep`
- Create: `public/music/.gitkeep`
- Delete: `src/assets/` (脚手架生成的)

- [ ] **Step 1: 创建目录并添加 .gitkeep**

```bash
mkdir -p /root/project/love_web/public/images /root/project/love_web/public/music
touch /root/project/love_web/public/images/.gitkeep
touch /root/project/love_web/public/music/.gitkeep
```

- [ ] **Step 2: 删除脚手架生成的 assets 目录**

```bash
rm -rf /root/project/love_web/src/assets
```

- [ ] **Step 3: 清理 App.tsx 中的 assets 引用**

检查 `src/App.tsx`，删除任何 `import ... from './assets/...'` 行（脚手架可能生成了 logo 引用）。同时删除组件中使用该 logo 的 JSX。

- [ ] **Step 4: 验证构建**

```bash
cd /root/project/love_web && npm run build
```

Expected: 构建成功，`dist/images/` 和 `dist/music/` 目录存在。

- [ ] **Step 5: Commit**

```bash
cd /root/project/love_web && git add public/images/.gitkeep public/music/.gitkeep && git add -u src/assets && git commit -m "feat: add public/images and public/music directories"
```

---

### Task 7: 创建配置模块 src/config.ts

**Files:**
- Create: `src/config.ts`

- [ ] **Step 1: 创建 src/config.ts**

```typescript
export interface TimelineEntry {
    date: string;
    title: string;
    desc: string;
    image: string;
}

export interface ThemeColor {
    primary: string;
    gradientFrom: string;
    gradientTo: string;
}

export interface SiteConfig {
    bgMusic: string;
    themeColor: ThemeColor;
    timeline: TimelineEntry[];
    letter: string;
}

const siteConfig: SiteConfig = {
    bgMusic: "music/bgm.mp3",
    themeColor: {
        primary: "#e91e63",
        gradientFrom: "#fce4ec",
        gradientTo: "#f8bbd0",
    },
    timeline: [
        {
            date: "2023-05-20",
            title: "第一次见面",
            desc: "那天阳光很好，我们在咖啡店聊了一下午...",
            image: "images/pic1.jpg",
        },
        {
            date: "2023-08-15",
            title: "第一次旅行",
            desc: "我们一起去了海边，看了最美的日落...",
            image: "images/pic2.jpg",
        },
        {
            date: "2023-12-25",
            title: "第一个圣诞节",
            desc: "在圣诞树下交换礼物，这是最温暖的冬天...",
            image: "images/pic3.jpg",
        },
        {
            date: "2024-05-20",
            title: "一周年纪念日",
            desc: "一年了，感谢有你的每一天...",
            image: "images/pic4.jpg",
        },
    ],
    letter:
        "亲爱的，\n\n从我们相遇的那天起，每一天都变得特别。感谢你一直以来的陪伴和理解，让我成为了更好的人。\n\n未来的路，我们一起走。\n\n永远爱你的",
};

export default siteConfig;
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
cd /root/project/love_web && npx tsc --noEmit
```

Expected: 无类型错误。

- [ ] **Step 3: Commit**

```bash
cd /root/project/love_web && git add src/config.ts && git commit -m "feat: add SiteConfig types and sample data in config.ts"
```

---

### Task 8: 验证 App.tsx 集成配置

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 修改 App.tsx 为最小可验证状态**

将 `src/App.tsx` 替换为最小验证版本（确认配置可被正确导入和渲染）：

```tsx
import config from "./config";

function App() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center font-handwriting">
                <h1 className="text-4xl text-rose-600 mb-4">{config.timeline[0].title}</h1>
                <p className="text-rose-400">{config.timeline[0].desc}</p>
            </div>
        </div>
    );
}

export default App;
```

- [ ] **Step 2: 验证构建和开发服务器**

```bash
cd /root/project/love_web && npm run build
```

Expected: 构建成功，无 TypeScript 错误。

- [ ] **Step 3: 启动开发服务器确认渲染**

```bash
cd /root/project/love_web && npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173/love_web/ | grep -o "第一次见面"
kill %1
```

Expected: 输出包含 "第一次见面"，说明配置数据正确渲染。

- [ ] **Step 4: Commit**

```bash
cd /root/project/love_web && git add src/App.tsx && git commit -m "feat: integrate config into App with minimal verification render"
```

---

### Task 9: 最终验证

**Files:** 无新文件

- [ ] **Step 1: 完整构建验证**

```bash
cd /root/project/love_web && npm run build
```

Expected: 构建成功，`dist/` 目录存在且结构正确。

- [ ] **Step 2: 检查 dist 路径**

```bash
cd /root/project/love_web && ls dist/ && cat dist/index.html | grep -o '/love_web/[^"]*' | head -5
```

Expected: 资源路径包含 `/love_web/` 前缀。

- [ ] **Step 3: TypeScript 严格检查**

```bash
cd /root/project/love_web && npx tsc --noEmit
```

Expected: 无错误。

- [ ] **Step 4: Final commit (if any uncommitted changes)**

```bash
cd /root/project/love_web && git status
```

如果有未提交的更改，提交它们。如果没有，跳过此步骤。
