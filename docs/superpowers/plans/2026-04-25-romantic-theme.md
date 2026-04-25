# 浪漫主题系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现爱心粒子飘落背景，集成到 App 布局中，形成浪漫主题视觉层。

**Architecture:** ParticleBackground 组件使用 @tsparticles/react + @tsparticles/slim + @tsparticles/shape-heart，渲染为 fixed 全屏覆盖层（pointer-events: none, z-0）。App.tsx 将粒子层放在最底层，内容层用 z-10 叠加。粒子颜色从 config.themeColor.primary 读取。

**Tech Stack:** React 19, @tsparticles/react v3, @tsparticles/slim, @tsparticles/shape-heart, Tailwind CSS v4, Vite 8

---

## 文件结构

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/components/ParticleBackground.tsx` | 新建 | 爱心粒子组件，读取 config.themeColor.primary |
| `src/App.tsx` | 修改 | 集成 ParticleBackground + z-index 分层布局 |
| `src/index.css` | 不变 | 现有渐变已满足 |
| `src/config.ts` | 不变 | 粒子只读 themeColor.primary |

---

### Task 1: 安装 @tsparticles/shape-heart

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: 安装依赖**

```bash
npm install @tsparticles/shape-heart
```

- [ ] **Step 2: 验证安装成功**

Run: `npm ls @tsparticles/shape-heart`
Expected: 输出包含 `@tsparticles/shape-heart@3.x.x`

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "feat: add @tsparticles/shape-heart for heart-shaped particles"
```

---

### Task 2: 创建 ParticleBackground 组件

**Files:**
- Create: `src/components/ParticleBackground.tsx`

- [ ] **Step 1: 创建组件文件**

```tsx
import { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadHeartShape } from "@tsparticles/shape-heart";
import type { Engine } from "@tsparticles/engine";
import config from "../config";

function ParticleBackground() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadSlim(engine);
        await loadHeartShape(engine);
    }, []);

    const particlesOptions = useMemo(
        () => ({
            fullScreen: false,
            fpsLimit: 60,
            particles: {
                color: {
                    value: config.themeColor.primary,
                },
                shape: {
                    type: "heart" as const,
                },
                number: {
                    value: 35,
                    density: {
                        enable: true,
                        area: 900,
                    },
                },
                size: {
                    value: {
                        min: 6,
                        max: 14,
                    },
                },
                opacity: {
                    value: {
                        min: 0.4,
                        max: 0.8,
                    },
                },
                move: {
                    enable: true,
                    speed: 1.2,
                    direction: "bottom" as const,
                    outModes: {
                        default: "out" as const,
                    },
                    straight: false,
                },
                wobble: {
                    enable: true,
                    distance: 15,
                    speed: 8,
                },
            },
            detectRetina: true,
        }),
        [],
    );

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Particles
                id="heart-particles"
                init={particlesInit}
                options={particlesOptions}
            />
        </div>
    );
}

export default ParticleBackground;
```

`★ Insight ─────────────────────────────────────`
- `fullScreen: false` 是关键——tsParticles 默认会创建全屏 canvas 并控制 body 样式，设为 false 让我们自己用 `fixed inset-0` div 控制定位
- `wobble` 属性让粒子有轻微左右摆动，模拟真实飘落效果，比 `straight: true` 自然得多
- `loadHeartShape(engine)` 必须在 `loadSlim` 之后调用，因为 shape 注册依赖 engine 已初始化
- `useMemo` 缓存 options 对象避免每次渲染重建配置触发粒子重初始化
`─────────────────────────────────────────────────`

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 4: 提交**

```bash
git add src/components/ParticleBackground.tsx
git commit -m "feat: add ParticleBackground with heart-shaped particles"
```

---

### Task 3: 集成 ParticleBackground 到 App 布局

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 更新 App.tsx**

将现有 App.tsx 内容替换为：

```tsx
import config from "./config";
import ParticleBackground from "./components/ParticleBackground";

function App() {
    return (
        <div className="min-h-screen relative">
            <ParticleBackground />
            <div className="relative z-10">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center font-handwriting">
                        <h1 className="text-4xl text-rose-600 mb-4">
                            {config.timeline[0].title}
                        </h1>
                        <p className="text-rose-400">
                            {config.timeline[0].desc}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
```

`★ Insight ─────────────────────────────────────`
- z-index 分层策略：`ParticleBackground` 内部 z-0（粒子层），内容层 `relative z-10` 叠加其上。这样粒子在背景飘落，内容始终可交互
- 现有的验证渲染内容（config.timeline[0]）暂时保留，后续 Task Group 4-7 会替换为完整的时间轴、信封等组件
- `min-h-screen relative` 在最外层确保容器占满视口高度，`relative` 为 z-10 提供定位上下文
`─────────────────────────────────────────────────`

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 验证构建**

Run: `npm run build`
Expected: 构建成功，dist 输出正常

- [ ] **Step 4: 启动开发服务器做视觉验证**

Run: `npm run dev`
Expected: 浏览器中页面背景有粉色渐变，稀疏爱心粒子从上方缓慢飘落，文字内容可正常交互（不被粒子遮挡）

- [ ] **Step 5: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate ParticleBackground into App layout with z-index layering"
```

---

### Task 4: 构建验证与收尾

**Files:** 无变更

- [ ] **Step 1: 完整构建验证**

Run: `npm run build`
Expected: 构建成功，输出文件列表包含 index.html、index.css、index.js

- [ ] **Step 2: TypeScript 严格检查**

Run: `npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: 确认 dist 路径前缀**

Run: `grep -r '/love_web/' dist/`
Expected: dist 中的资源路径包含 `/love_web/` 前缀

- [ ] **Step 4: 检查 git 状态**

Run: `git status`
Expected: 工作区干净，所有变更已提交
