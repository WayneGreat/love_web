# Password Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a romantic passphrase entry page (`PasswordGate`) before the existing `IntroSplash`, with unified visual style and clear error feedback.

**Architecture:** A new `PasswordGate` component overlays the app at `z-[60]`. `App.tsx` gains a `passwordVerified` state to gate the transition: `PasswordGate` → `IntroSplash` → main content. All text and the correct passphrase live in `config.ts`.

**Tech Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 · Framer Motion 12

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/config.ts` | Modify | Add `password: string` and `passwordGate: PasswordGateConfig` to `SiteConfig` |
| `src/components/PasswordGate.tsx` | Create | Full-screen passphrase input page with floating hearts, input field, submit button, and error feedback |
| `src/App.tsx` | Modify | Add `passwordVerified` state; render `PasswordGate` before `IntroSplash`; wire `onVerify` callback |

---

### Task 1: Extend `config.ts` with password gate configuration

**Files:**
- Modify: `src/config.ts`

- [ ] **Step 1: Add `PasswordGateConfig` interface and update `SiteConfig`**

Insert the new interface after `IntroConfig` (before `LetterConfig`) and add two new fields to `SiteConfig`:

```typescript
export interface PasswordGateConfig {
    title: string;
    subtitle: string;
    placeholder: string;
    buttonText: string;
    errorText: string;
}
```

Update `SiteConfig`:
```typescript
export interface SiteConfig {
    bgMusic: string;
    themeColor: ThemeColor;
    intro: IntroConfig;
    timeline: TimelineEntry[];
    pastLetters: PastLetter[];
    letter: LetterConfig;
    password: string;
    passwordGate: PasswordGateConfig;
}
```

- [ ] **Step 2: Add default values to `siteConfig` object**

Insert before `intro:` in the `siteConfig` literal:

```typescript
    password: "lwj0903",
    passwordGate: {
        title: "欢迎来到我们的世界",
        subtitle: "请输入密令",
        placeholder: "在这里输入密令...",
        buttonText: "进入",
        errorText: "密令不正确，请再试一次",
    },
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/config.ts
git commit -m "$(cat <<'EOF'
config: add password gate configuration fields

Adds password string and PasswordGateConfig to central config.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Create `PasswordGate` component

**Files:**
- Create: `src/components/PasswordGate.tsx`

- [ ] **Step 1: Write the component file**

Create `src/components/PasswordGate.tsx` with this exact content:

```tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config";

interface PasswordGateProps {
    onVerify: () => void;
}

function PasswordGate({ onVerify }: PasswordGateProps) {
    const [inputValue, setInputValue] = useState("");
    const [hasError, setHasError] = useState(false);
    const [shakeKey, setShakeKey] = useState(0);

    const handleVerify = useCallback(() => {
        if (inputValue === config.password) {
            onVerify();
        } else {
            setHasError(true);
            setShakeKey((k) => k + 1);
        }
    }, [inputValue, onVerify]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleVerify();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (hasError) {
            setHasError(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" as const }}
        >
            {/* Floating heart decorations */}
            <span className="absolute top-[15%] left-[10%] text-rose-400 text-2xl animate-float-heart">
                ♥
            </span>
            <span className="absolute top-[25%] right-[12%] text-rose-300 text-xl animate-float-heart-delay">
                ♥
            </span>
            <span className="absolute bottom-[20%] left-[15%] text-rose-300 text-lg animate-float-heart">
                ♥
            </span>
            <span className="absolute bottom-[30%] right-[10%] text-rose-400 text-2xl animate-float-heart-delay">
                ♥
            </span>

            {/* Center content */}
            <h1 className="text-4xl md:text-5xl font-bold text-rose-500 mb-4 font-handwriting tracking-wider drop-shadow-sm">
                {config.passwordGate.title}
            </h1>
            <p className="text-lg md:text-xl text-rose-400 tracking-wide mb-10">
                {config.passwordGate.subtitle}
            </p>

            {/* Input + button */}
            <motion.div
                key={shakeKey}
                animate={
                    hasError
                        ? { x: [0, -10, 10, -10, 10, 0] }
                        : { x: 0 }
                }
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center"
            >
                <input
                    type="password"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={config.passwordGate.placeholder}
                    aria-label="密令输入"
                    aria-invalid={hasError}
                    aria-describedby={hasError ? "password-error" : undefined}
                    autoFocus
                    className="w-64 sm:w-80 px-6 py-3 rounded-full border-2 border-rose-300 bg-white/80 backdrop-blur-sm text-center text-rose-700 font-handwriting text-lg placeholder:text-rose-300 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-400/50"
                />
                <AnimatePresence>
                    {hasError && (
                        <motion.p
                            id="password-error"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="mt-3 text-sm text-red-500 font-medium"
                            role="alert"
                        >
                            {config.passwordGate.errorText}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            <button
                type="button"
                onClick={handleVerify}
                className="mt-6 px-8 py-2.5 bg-rose-500 text-white rounded-full font-medium shadow-lg hover:bg-rose-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none cursor-pointer transition-transform"
            >
                {config.passwordGate.buttonText}
            </button>
        </motion.div>
    );
}

export default PasswordGate;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PasswordGate.tsx
git commit -m "$(cat <<'EOF'
feat: add PasswordGate component

Creates the romantic passphrase entry page with floating hearts,
error shake animation, and keyboard submit support.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Wire `PasswordGate` into `App.tsx`

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import `PasswordGate` and add `passwordVerified` state**

Add import:
```typescript
import PasswordGate from "./components/PasswordGate";
```

Update state declarations:
```typescript
function App() {
    const [passwordVerified, setPasswordVerified] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const musicPlayerRef = useRef<MusicPlayerHandle>(null);
```

- [ ] **Step 2: Update JSX to render `PasswordGate` before `IntroSplash`**

Replace the entire return block with:

```tsx
    return (
        <div className="min-h-screen relative">
            <AnimatePresence>
                {!passwordVerified && (
                    <PasswordGate onVerify={() => setPasswordVerified(true)} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {passwordVerified && showIntro && (
                    <IntroSplash onExit={handleIntroExit} />
                )}
            </AnimatePresence>
            {passwordVerified && !showIntro && (
                <>
                    <ParticleBackground />
                    <div className="relative z-10">
                        <Timeline />
                    </div>
                </>
            )}
            <MusicPlayer ref={musicPlayerRef} />
        </div>
    );
```

`handleIntroExit` stays unchanged:
```typescript
    const handleIntroExit = () => {
        setShowIntro(false);
        musicPlayerRef.current?.play();
    };
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Run full build**

Run: `npm run build`

Expected: Build succeeds with no TypeScript or Vite errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "$(cat <<'EOF'
feat: wire PasswordGate into App entry flow

Renders PasswordGate before IntroSplash; main content only
mounts after both password verification and intro exit.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Verification Checklist

After all tasks are complete, manually verify in the browser:

1. `npm run dev` starts the dev server
2. Open the site — the first screen is `PasswordGate` with title "欢迎来到我们的世界"
3. Floating hearts are visible and animating
4. Type a wrong password and click "进入" — input box shakes, red error text appears
5. Type the correct password (`lwj0903`) and press Enter — `PasswordGate` slides up, `IntroSplash` appears
6. Scroll/click past `IntroSplash` — main timeline content loads normally
7. Build passes: `npm run build` exits 0

---

## Self-Review

1. **Spec coverage:**
   - 全屏密码门在 IntroSplash 之前 → Task 3
   - 视觉风格统一（渐变 + 浮动心形 + 手写体）→ Task 2
   - 错误抖动 + 红色提示 → Task 2
   - 配置集中 → Task 1
   - 键盘回车提交 → Task 2 (`onKeyDown`)
   - 移动端字体 `text-lg`（≥16px）→ Task 2
   - 无障碍属性 → Task 2 (`aria-label`, `aria-invalid`, `aria-describedby`, `role="alert"`)
   - 无占位符或 TBD → 已检查
2. **Type consistency:** `PasswordGateProps` 接口、`config.passwordGate.*` 字段名在 Task 1 和 Task 2 中完全一致。
3. **No placeholders:** 所有代码块完整，所有命令精确，无 "TBD"/"TODO"。
