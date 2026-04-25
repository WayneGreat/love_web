# 开场页 (Intro Splash) 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为网站添加全屏开场页组件，支持配置驱动文案、浮动爱心装饰、点击/滑动退场动画，退场时联动播放背景音乐。

**Architecture:** App 层维护 `showIntro` 布尔状态；`IntroSplash` 使用 Framer Motion `AnimatePresence` 管理入场/退场；`MusicPlayer` 通过 `useImperativeHandle` 暴露 `play()`；交互事件（click/wheel/touchmove）触发状态变更，进而驱动退场动画和音乐播放。

**Tech Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Framer Motion 12

---

## 文件结构映射

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/config.ts` | 修改 | 添加 `intro` 配置类型和默认值（title、subtitle、hint） |
| `src/index.css` | 修改 | 添加浮动爱心 CSS keyframe 动画 |
| `src/components/MusicPlayer.tsx` | 修改 | 通过 `useImperativeHandle` + `forwardRef` 暴露 `play()` 方法 |
| `src/components/IntroSplash.tsx` | 创建 | 全屏开场页：文案渲染、爱心装饰、向下箭头、入场/退场动画 |
| `src/App.tsx` | 修改 | 添加 `showIntro` 状态，用 `AnimatePresence` 包裹 `IntroSplash` |

---

### Task 1: 配置与类型定义

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1.1: 添加 IntroConfig 接口到 SiteConfig**

在 `SiteConfig` 中添加 `intro` 字段，类型如下：

```typescript
export interface IntroConfig {
    title: string;
    subtitle: string;
    hint: string;
}
```

然后在 `SiteConfig` 接口中加入 `intro: IntroConfig;`。

- [ ] **Step 1.2: 添加默认值**

在 `siteConfig` 对象中添加：

```typescript
intro: {
    title: "我们的故事",
    subtitle: "从遇见你的那天起",
    hint: "向下滚动 开启回忆",
},
```

- [ ] **Step 1.3: Commit**

```bash
git add src/config.ts
git commit -m "feat: add intro config type and defaults"
```

---

### Task 2: 添加浮动爱心 CSS 动画

**Files:**
- Modify: `src/index.css`

- [ ] **Step 2.1: 在 index.css 中添加自定义浮动动画**

在 `@theme` 块之后、`body` 之前，添加：

```css
@keyframes float-heart {
    0%, 100% {
        transform: translateY(0) scale(1);
        opacity: 0.8;
    }
    50% {
        transform: translateY(-20px) scale(1.1);
        opacity: 1;
    }
}

.animate-float-heart {
    animation: float-heart 3s ease-in-out infinite;
}

.animate-float-heart-delay {
    animation: float-heart 3.5s ease-in-out infinite;
    animation-delay: 1s;
}
```

- [ ] **Step 2.2: Commit**

```bash
git add src/index.css
git commit -m "feat: add floating heart keyframe animations"
```

---

### Task 3: MusicPlayer 暴露 play() 方法

**Files:**
- Modify: `src/components/MusicPlayer.tsx`

- [ ] **Step 3.1: 引入 forwardRef 和 useImperativeHandle**

将导入改为：

```typescript
import { useCallback, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
```

- [ ] **Step 3.2: 定义外部接口类型**

在文件顶部（导入之后）添加：

```typescript
export interface MusicPlayerHandle {
    play: () => void;
}
```

- [ ] **Step 3.3: 用 forwardRef 包装组件**

将 `function MusicPlayer() {` 替换为：

```typescript
const MusicPlayer = forwardRef<MusicPlayerHandle>(function MusicPlayer(_props, ref) {
```

- [ ] **Step 3.4: 暴露 play()**

在组件内部（`useState` 之后即可），添加：

```typescript
useImperativeHandle(ref, () => ({
    play: async () => {
        const audio = audioRef.current;
        if (!audio || isDisabled) return;
        try {
            await audio.play();
            setIsPlaying(true);
        } catch {
            // Autoplay blocked or other error — ignore silently
        }
    },
}));
```

- [ ] **Step 3.5: 更新导出**

将文件末尾的 `export default MusicPlayer;` 保持不变（forwardRef 返回的组件可直接导出）。

- [ ] **Step 3.6: Commit**

```bash
git add src/components/MusicPlayer.tsx
git commit -m "feat: expose play() via useImperativeHandle on MusicPlayer"
```

---

### Task 4: 创建 IntroSplash 组件

**Files:**
- Create: `src/components/IntroSplash.tsx`

- [ ] **Step 4.1: 创建组件文件**

写入完整组件代码：

```tsx
import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import config from "../config";

interface IntroSplashProps {
    onExit: () => void;
}

function IntroSplash({ onExit }: IntroSplashProps) {
    const handleExit = useCallback(() => {
        onExit();
    }, [onExit]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                handleExit();
            }
        };

        const handleTouchMove = () => {
            handleExit();
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [handleExit]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 cursor-pointer select-none"
            onClick={handleExit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
                duration: 0.8,
                ease: "easeInOut" as const,
            }}
        >
            {/* 浮动爱心装饰 */}
            <div className="absolute top-[15%] left-[10%] text-rose-400 text-2xl animate-float-heart">
                ♥
            </div>
            <div className="absolute top-[25%] right-[12%] text-rose-300 text-xl animate-float-heart-delay">
                ♥
            </div>
            <div className="absolute bottom-[20%] left-[15%] text-rose-300 text-lg animate-float-heart">
                ♥
            </div>
            <div className="absolute bottom-[30%] right-[10%] text-rose-400 text-2xl animate-float-heart-delay">
                ♥
            </div>

            {/* 主文案 */}
            <div className="text-center px-6">
                <h1 className="text-5xl md:text-7xl font-bold text-rose-500 mb-6 tracking-wider drop-shadow-sm">
                    {config.intro.title}
                </h1>
                <p className="text-xl md:text-2xl text-rose-400 tracking-wide">
                    {config.intro.subtitle}
                </p>
            </div>

            {/* 底部提示和箭头 */}
            <div className="absolute bottom-12 flex flex-col items-center gap-2">
                <span className="text-sm text-rose-400 tracking-widest">
                    {config.intro.hint}
                </span>
                <motion.div
                    className="text-rose-400 text-2xl"
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut" as const,
                    }}
                >
                    ↓
                </motion.div>
            </div>
        </motion.div>
    );
}

export default IntroSplash;
```

- [ ] **Step 4.2: Commit**

```bash
git add src/components/IntroSplash.tsx
git commit -m "feat: create IntroSplash component with animations and decorations"
```

---

### Task 5: App.tsx 集成 IntroSplash

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 5.1: 引入所需依赖**

在文件顶部添加：

```tsx
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntroSplash from "./components/IntroSplash";
import type { MusicPlayerHandle } from "./components/MusicPlayer";
```

- [ ] **Step 5.2: 修改 App 组件**

将 `App` 组件改为：

```tsx
function App() {
    const [showIntro, setShowIntro] = useState(true);
    const musicPlayerRef = useRef<MusicPlayerHandle>(null);

    const handleIntroExit = () => {
        setShowIntro(false);
        musicPlayerRef.current?.play();
    };

    return (
        <div className="min-h-screen relative">
            <AnimatePresence>
                {showIntro && (
                    <IntroSplash onExit={handleIntroExit} />
                )}
            </AnimatePresence>
            <ParticleBackground />
            <div className="relative z-10">
                <Timeline />
            </div>
            <MusicPlayer ref={musicPlayerRef} />
        </div>
    );
}
```

- [ ] **Step 5.3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate IntroSplash with AnimatePresence and music trigger"
```

---

### Task 6: 构建与验证

**Files:**
- （无新增文件）

- [ ] **Step 6.1: TypeScript 编译检查**

```bash
npx tsc --noEmit
```

Expected: 无错误。

- [ ] **Step 6.2: 运行完整构建**

```bash
npm run build
```

Expected: `dist/` 目录成功生成，无 TypeScript 或 Vite 错误。

- [ ] **Step 6.3: ESLint 检查**

```bash
npm run lint
```

Expected: 无 ESLint 报错。

- [ ] **Step 6.4: Commit（如 lint 有自动修复）**

```bash
git add -A
git commit -m "chore: pass build and lint checks"
```

---

## 自审 (Self-Review)

### Spec 覆盖检查

| 需求 | 对应任务 |
|------|----------|
| 全屏开场页覆盖视口 | Task 4 (fixed inset-0 z-50) |
| 配置驱动文案 | Task 1 (config.intro) + Task 4 ({config.intro.title} 等) |
| 浮动爱心装饰 (≥2个) | Task 2 (CSS keyframes) + Task 4 (4个爱心) |
| 点击/滑动触发退场 | Task 4 (onClick + wheel/touchmove listeners) |
| 退场动画 (上滑 0.8s ease-in-out) | Task 4 (exit={{ y: "-100%" }}, transition 0.8s easeInOut) |
| 音乐联动 | Task 3 (暴露 play) + Task 5 (handleIntroExit 调用 play) |

**无遗漏。**

### Placeholder 扫描

- 无 "TBD" / "TODO" / "implement later" / "fill in details"
- 无 "Add appropriate error handling" 等模糊描述
- 每步均含具体代码

### 类型一致性检查

- `MusicPlayerHandle` 接口在 Task 3 定义，在 Task 5 的 `useRef<MusicPlayerHandle>` 中引用 — 一致
- `IntroSplashProps.onExit` 在 Task 4 定义，在 Task 5 中作为 `handleIntroExit` 传入 — 一致
- `config.intro` 在 Task 1 定义，在 Task 4 中读取 — 一致

---

**Plan complete and saved to `docs/superpowers/plans/2026-04-25-add-intro-splash.md`.**

Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
