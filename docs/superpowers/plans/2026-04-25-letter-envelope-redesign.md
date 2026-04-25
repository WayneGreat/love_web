# LetterEnvelope Redesign — Fullscreen Expandable Envelope

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `LetterEnvelope` component to match the screenshot design — a large square envelope with a downward-pointing triangular flap that flips upward on open, expanding the letter to fullscreen with a close button.

**Architecture:** Single component rewrite using Framer Motion `AnimatePresence` + `motion.div` for coordinated multi-stage open/close animations. The component lives inside the existing timeline's `snap-start` wrapper — no changes to timeline structure. State machine: `isOpen` boolean drives all animation variants via staggered delays.

**Tech Stack:** React 19 · TypeScript 6 · Tailwind CSS v4 · Framer Motion 12

---

### Task 1: Rewrite `LetterEnvelope.tsx` — Closed State Layout

**Files:**
- Modify: `src/components/LetterEnvelope.tsx` (full rewrite)

- [ ] **Step 1: Replace the entire component with closed-state layout**

Replace the full contents of `src/components/LetterEnvelope.tsx` with the closed-state structure (envelope body, downward-pointing flap, open button, title, footer text):

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import config from "../config";

const rootVariants = {
    hidden: { opacity: 0, transition: { duration: 0.6 } },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};

const flapVariants = {
    closed: {
        rotateX: 0,
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.5 },
    },
    open: {
        rotateX: -180,
        transition: { duration: 0.6, ease: "easeOut" as const, delay: 0.2 },
    },
};

interface LetterEnvelopeProps {
    index: number;
    onInView: (index: number) => void;
}

function LetterEnvelope({ index, onInView }: LetterEnvelopeProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });

    useEffect(() => {
        if (isInView) onInView(index);
    }, [isInView, index, onInView]);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <motion.div
            ref={ref}
            className="h-screen flex flex-col items-center justify-center px-6 relative"
            variants={rootVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 mb-10 font-handwriting tracking-wide">
                给你的一封信
            </h2>

            {/* Envelope container with 3D perspective */}
            <div className="relative" style={{ perspective: 800 }}>
                {/* Envelope body */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-b from-pink-100 to-pink-200 rounded-xl shadow-2xl relative border-4 border-pink-300">
                    {/* Triangular flap (downward pointing, closes the envelope) */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 h-[100px] sm:h-[110px] bg-gradient-to-b from-pink-400 to-pink-300"
                        style={{
                            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                            transformOrigin: "top",
                        }}
                        variants={flapVariants}
                        animate={isOpen ? "open" : "closed"}
                    />

                    {/* Open button — disappears when opened */}
                    <AnimatePresence>
                        {!isOpen && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.2, delay: 1.1 } }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                onClick={handleOpen}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-7 py-2.5 bg-rose-500 text-white rounded-full text-sm font-medium shadow-lg hover:bg-rose-600 hover:scale-105 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none z-30 cursor-pointer"
                            >
                                点击打开信封
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer text */}
            <p className="mt-8 text-sm text-rose-500 italic tracking-wide">
                愿我们的故事一直继续下去 ✨
            </p>
        </motion.div>
    );
}

export default LetterEnvelope;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. Fix any unused variable or type errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/LetterEnvelope.tsx
git commit -m "feat: rewrite LetterEnvelope with new closed-state layout

- Square envelope with pink gradient and border
- Downward-pointing triangular flap with clipPath
- Centered open button with hover/scale effects
- Title and footer text matching screenshot design

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 2: Add Fullscreen Letter Overlay with Open Animation

**Files:**
- Modify: `src/components/LetterEnvelope.tsx`

- [ ] **Step 1: Add fullscreen overlay AnimatePresence block inside the component**

Insert the following block **after the footer `<p>` element** and **before the closing `</motion.div>`** of the root component:

```tsx
            {/* Fullscreen letter overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-pink-50/90 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 }}
                        />

                        {/* Letter card */}
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                            initial={{ opacity: 0, scale: 0.3, y: 120 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.3, y: 120 }}
                            transition={{ duration: 0.5, ease: "easeOut" as const, delay: 0.8 }}
                        >
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-10 relative">
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-md hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none cursor-pointer transition-transform"
                                    aria-label="关闭信件"
                                >
                                    ✕
                                </button>

                                {/* Letter title */}
                                <h3 className="text-2xl sm:text-3xl font-bold text-rose-700 text-center mb-6 sm:mb-8 font-handwriting">
                                    给你的一封信
                                </h3>

                                {/* Letter body */}
                                <div className="font-handwriting text-rose-700 text-base sm:text-lg leading-relaxed whitespace-pre-line text-center px-2">
                                    {config.letter}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
```

- [ ] **Step 2: Verify animation timing is correct**

Confirm the delays align with the design spec:
- Button exit: `duration: 0.2` (immediate on click)
- Flap open: `delay: 0.2, duration: 0.6` → completes at 0.8s
- Backdrop enter: `delay: 0.6, duration: 0.3` → completes at 0.9s
- Letter card enter: `delay: 0.8, duration: 0.5` → completes at 1.3s

- [ ] **Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LetterEnvelope.tsx
git commit -m "feat: add fullscreen letter overlay with open animation

- Backdrop with blur effect fades in after flap opens
- Letter card scales up from envelope position
- Close button in top-right of card
- Staggered animation timing: button → flap → backdrop → card

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 3: Add Staggered Text Reveal and Polish

**Files:**
- Modify: `src/components/LetterEnvelope.tsx`

- [ ] **Step 1: Add text container and line variants, replace plain letter body**

Add these variant objects **after the existing `flapVariants`** and **before the `interface`**:

```tsx
const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.4 },
    },
};

const textLineVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};
```

Replace the letter body div (the one with `whitespace-pre-line`) with:

```tsx
                                {/* Letter body with staggered reveal */}
                                <motion.div
                                    className="font-handwriting text-rose-700 text-base sm:text-lg leading-relaxed text-center px-2"
                                    variants={textContainerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {config.letter.split("\n").map((line, i) => (
                                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                                            {line || " "}
                                        </motion.p>
                                    ))}
                                </motion.div>
```

- [ ] **Step 2: Verify text reveal animation**

Each line of the letter should fade in with a slight upward translate, 60ms apart, starting 0.4s after the card appears.

- [ ] **Step 3: Run TypeScript check and build**

Run: `npx tsc --noEmit`

Expected: No errors.

Run: `npm run build`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LetterEnvelope.tsx
git commit -m "feat: add staggered text reveal animation to letter

- Each line fades in with upward translate, 60ms stagger
- Motion variants for text container and individual lines
- Build verified

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 4: Browser Verification

**Files:**
- No file changes — visual QA only

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Open browser and navigate to the envelope section**

Scroll to the last section (the envelope). Verify:

1. **Closed state:**
   - Title "给你的一封信" is centered above the envelope
   - Envelope is square-ish, pink gradient, with a pink border
   - Downward-pointing pink triangle covers the top portion
   - "点击打开信封" button is centered on the envelope
   - Footer text "愿我们的故事一直继续下去 ✨" is below the envelope

2. **Open animation:**
   - Click the button → it fades out
   - Triangle flips upward (disappears behind the envelope)
   - Semi-transparent backdrop fades in
   - White letter card scales up from the envelope position
   - Letter text lines fade in one by one

3. **Fullscreen state:**
   - Letter card fills most of the screen
   - Close button (✕) is visible in the top-right corner
   - Content is readable, well-spaced, centered
   - Scroll works if letter content is long

4. **Close animation:**
   - Click ✕ → letter card shrinks back down
   - Backdrop fades out
   - Triangle flips back down
   - "点击打开信封" button reappears

5. **Responsive:** Check on narrow (mobile) and wide (desktop) viewport.

- [ ] **Step 3: Stop dev server**

Press `Ctrl+C` to stop the dev server.

- [ ] **Step 4: Commit (if no fixes needed)**

If all checks pass:
```bash
git commit --allow-empty -m "qa: browser verification passed for LetterEnvelope redesign

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Square envelope with pink gradient and border → Task 1
- [x] Downward-pointing triangular flap (clipPath polygon) → Task 1
- [x] "点击打开信封" centered pill button → Task 1
- [x] Title and footer text → Task 1
- [x] Flap flips upward on open (rotateX: -180) → Task 1 (flapVariants)
- [x] Fullscreen letter overlay with backdrop blur → Task 2
- [x] Close button in top-right → Task 2
- [x] Staggered open animation timing → Task 1 & 2 delays
- [x] Close animation reverses to closed state → Task 2 exit variants + Task 1 button re-entry
- [x] Letter text reveal animation → Task 3

**Placeholder scan:**
- [x] No "TBD", "TODO", or "implement later"
- [x] Every step has concrete code or commands
- [x] No vague descriptions like "add appropriate styling"

**Type consistency:**
- [x] `MusicPlayerHandle` import not needed — removed in rewrite
- [x] `useState`, `useRef`, `useEffect`, `useInView` imports kept from original
- [x] `AnimatePresence` added to framer-motion import
- [x] `LetterEnvelopeProps` interface unchanged (compatible with Timeline)
