# MusicPlayer 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为纪念日网站添加浮动圆形背景音乐播放按钮，支持自动播放+交互激活降级策略。

**Architecture:** 单组件 MusicPlayer.tsx，内含 HTML5 `<audio>` 元素 + useState 管理播放状态。挂载时尝试 autoplay，被浏览器策略阻止后监听全局首次交互激活播放。集成到 App.tsx 与现有组件并列。

**Tech Stack:** React 19 · TypeScript · Framer Motion 12 · Tailwind CSS v4 · HTML5 Audio API

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/components/MusicPlayer.tsx` | 创建 | 浮动播放按钮 + audio 元素 + autoplay 逻辑 |
| `src/App.tsx` | 修改 | 添加 `<MusicPlayer />` |

---

### Task 1: 创建 MusicPlayer 组件

**Files:**
- Create: `src/components/MusicPlayer.tsx`

- [ ] **Step 1: 创建 MusicPlayer.tsx**

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import config from "../config";

function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const hasInteractedRef = useRef(false);

    // Autoplay on mount: try play(), fall back to first-interaction activation
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const startPlay = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch (err) {
                if (err instanceof DOMException && err.name === "NotAllowedError") {
                    const activateOnInteraction = async () => {
                        try {
                            await audio.play();
                            setIsPlaying(true);
                            hasInteractedRef.current = true;
                        } catch {
                            // Silently ignore — user can still click the button
                        }
                    };
                    document.addEventListener("click", activateOnInteraction, { once: true });
                    document.addEventListener("touchstart", activateOnInteraction, { once: true });

                    return () => {
                        document.removeEventListener("click", activateOnInteraction);
                        document.removeEventListener("touchstart", activateOnInteraction);
                    };
                }
            }
        };

        startPlay();
    }, []);

    // Handle audio error (e.g. file not found) — disable button silently
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleError = () => setIsDisabled(true);
        audio.addEventListener("error", handleError);
        return () => audio.removeEventListener("error", handleError);
    }, []);

    const togglePlay = useCallback(async () => {
        const audio = audioRef.current;
        if (!audio || isDisabled) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                // AbortError or NotAllowedError — state stays paused
            }
        }
    }, [isPlaying, isDisabled]);

    return (
        <>
            <audio ref={audioRef} src={config.bgMusic} loop preload="auto" />
            <motion.button
                onClick={togglePlay}
                disabled={isDisabled}
                className={`fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-rose-500/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-white text-lg focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:outline-none ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                whileTap={!isDisabled ? { scale: 0.85 } : undefined}
                aria-label={isPlaying ? "暂停音乐" : "播放音乐"}
            >
                {isPlaying ? "⏸" : "♪"}
            </motion.button>
        </>
    );
}

export default MusicPlayer;
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 提交**

```bash
git add src/components/MusicPlayer.tsx
git commit -m "feat: add MusicPlayer with autoplay and interaction fallback"
```

---

### Task 2: 集成 MusicPlayer 到 App

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 修改 App.tsx 添加 MusicPlayer**

在 App.tsx 中导入 MusicPlayer 并添加到 JSX：

```tsx
import ParticleBackground from "./components/ParticleBackground";
import Timeline from "./components/Timeline";
import MusicPlayer from "./components/MusicPlayer";

function App() {
    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <div className="relative z-10">
                <Timeline />
            </div>
            <MusicPlayer />
        </div>
    );
}

export default App;
```

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 构建成功，无 TypeScript 错误

- [ ] **Step 3: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate MusicPlayer into App layout"
```

---

### Task 3: 构建验证

- [ ] **Step 1: 运行完整构建**

Run: `npm run build`
Expected: 构建成功，dist 输出包含 `/love_web/` 前缀路径

- [ ] **Step 2: 运行 TypeScript 类型检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 确认 git 干净**

Run: `git status`
Expected: 工作树干净（除 CLAUDE.md 外无未跟踪文件）
