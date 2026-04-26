# PastLetters Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "那些年的信" (Those Years' Letters) carousel section between the Timeline and the final LetterEnvelope, displaying 3-5 past letters with physical letter-paper styling and staggered text reveal animations.

**Architecture:** A single `PastLetters` container component manages carousel state (active index, direction) and handles navigation (arrows, dots, keyboard, swipe). It renders `PastLetterCard` instances positioned absolutely with Framer Motion spring transitions. The section is integrated into the existing `Timeline` scroll-snap flow as an additional `snap-start` wrapper.

**Tech Stack:** React 19, TypeScript 6, Tailwind CSS v4, Framer Motion 12

---

## File Structure

| File | Action | Responsibility |
|------|--------|--------------|
| `src/config.ts` | Modify | Add `PastLetter` interface and sample data to `SiteConfig` |
| `src/components/PastLetterCard.tsx` | Create | Single letter card with paper styling and stagger text animation |
| `src/components/PastLetters.tsx` | Create | Carousel container with state, navigation, and positioning |
| `src/components/Timeline.tsx` | Modify | Insert PastLetters section between timeline entries and LetterEnvelope |

---

## Task 1: Update config.ts with PastLetter data model

**Files:**
- Modify: `src/config.ts:20-32`

- [ ] **Step 1: Add `PastLetter` interface before `SiteConfig`**

Insert the following interface definition right before `interface SiteConfig` (before line 26):

```typescript
export interface PastLetter {
    date: string;
    body: string;
}
```

- [ ] **Step 2: Add `pastLetters` field to `SiteConfig`**

Modify `interface SiteConfig` (lines 26-32) to include the new field:

```typescript
export interface SiteConfig {
    bgMusic: string;
    themeColor: ThemeColor;
    intro: IntroConfig;
    timeline: TimelineEntry[];
    pastLetters: PastLetter[];
    letter: LetterConfig;
}
```

- [ ] **Step 3: Add sample `pastLetters` data to the config object**

Insert the `pastLetters` array into the `siteConfig` object (between `timeline` and `letter`, around line 83):

```typescript
    pastLetters: [
        {
            date: "2023-08-15",
            body: "亲爱的，今天是我们的第一个七夕。\n虽然相隔千里，但每当想起你的笑容，心里就像被阳光填满了一样温暖。\n愿以后的每一个七夕，都能陪在你身边。",
        },
        {
            date: "2024-02-14",
            body: "这是我们在一起的第一个情人节。\n想对你说，遇见你是我这辈子最美好的意外。\n谢谢你让我相信，爱情真的可以让平凡的日子闪闪发光。",
        },
        {
            date: "2024-08-10",
            body: "时间不知不觉又过了一年。\n你依然是我每天醒来第一个想到的人，晚安前最后一个想念的人。\n未来还很长，我想一直牵着你的手走下去。",
        },
    ],
```

- [ ] **Step 4: Commit**

```bash
git add src/config.ts
git commit -m "feat: add PastLetter interface and sample data to config

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: Create PastLetterCard component

**Files:**
- Create: `src/components/PastLetterCard.tsx`

- [ ] **Step 1: Create the component file with complete implementation**

Create `src/components/PastLetterCard.tsx` with the following content:

```tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface PastLetterCardProps {
    date: string;
    body: string;
    isActive: boolean;
}

const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05, delayChildren: 0.3 },
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

function PastLetterCard({ date, body, isActive }: PastLetterCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.3 });
    const lines = body.split("\n");
    const shouldAnimate = isActive && isInView;

    return (
        <div
            ref={ref}
            className="w-[min(85vw,480px)] max-h-[70vh] overflow-y-auto bg-[#fffaf0] rounded-lg shadow-xl border border-black/5 p-8 sm:p-10 relative"
            style={{ transform: "rotate(-1deg)" }}
        >
            <div className="flex justify-end mb-4">
                <span className="text-sm text-rose-400 font-sans">{date}</span>
            </div>
            <div className="h-px bg-rose-100 mb-6" />
            {shouldAnimate ? (
                <motion.div
                    className="font-handwriting text-xl text-gray-700 leading-relaxed text-left"
                    variants={textContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {lines.map((line, i) => (
                        <motion.p key={i} variants={textLineVariants} className="mb-1">
                            {line || " "}
                        </motion.p>
                    ))}
                </motion.div>
            ) : (
                <div className="font-handwriting text-xl text-gray-700 leading-relaxed text-left opacity-60">
                    {lines.map((line, i) => (
                        <p key={i} className="mb-1">
                            {line || " "}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PastLetterCard;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PastLetterCard.tsx
git commit -m "feat: add PastLetterCard component with paper styling and stagger animation

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Create PastLetters carousel component

**Files:**
- Create: `src/components/PastLetters.tsx`

- [ ] **Step 1: Create the component file with complete implementation**

Create `src/components/PastLetters.tsx` with the following content:

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { PastLetter } from "../config";
import PastLetterCard from "./PastLetterCard";

interface PastLettersProps {
    letters: PastLetter[];
    index: number;
    onInView: (index: number) => void;
}

function PastLetters({ letters, index, onInView }: PastLettersProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 0.5 });
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (isInView) onInView(index);
    }, [isInView, index, onInView]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isInView) return;
            if (e.key === "ArrowLeft") {
                setActiveIndex((prev) => Math.max(0, prev - 1));
            } else if (e.key === "ArrowRight") {
                setActiveIndex((prev) => Math.min(letters.length - 1, prev + 1));
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isInView, letters.length]);

    const goPrev = useCallback(() => {
        setActiveIndex((prev) => Math.max(0, prev - 1));
    }, []);

    const goNext = useCallback(() => {
        setActiveIndex((prev) => Math.min(letters.length - 1, prev + 1));
    }, [letters.length]);

    const handleDragEnd = useCallback(
        (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
            if (info.offset.x > 50) {
                goPrev();
            } else if (info.offset.x < -50) {
                goNext();
            }
        },
        [goPrev, goNext]
    );

    return (
        <div
            ref={ref}
            className="h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
        >
            {/* Title */}
            <motion.h2
                className="text-3xl sm:text-4xl font-bold text-rose-700 mb-10 font-handwriting tracking-wide"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                那些年的信
            </motion.h2>

            {/* Carousel area */}
            <div className="relative w-full max-w-4xl flex items-center justify-center">
                {/* Left arrow */}
                <button
                    type="button"
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    aria-label="上一封信"
                    className="absolute left-0 sm:left-4 z-10 w-10 h-10 rounded-full border-2 border-rose-300 text-rose-400 flex items-center justify-center hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                {/* Cards */}
                <motion.div
                    className="relative w-[min(85vw,480px)] h-[60vh] flex items-center justify-center"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                >
                    {letters.map((letter, i) => {
                        const offset = i - activeIndex;
                        const isActive = offset === 0;

                        return (
                            <motion.div
                                key={letter.date}
                                className="absolute"
                                initial={false}
                                animate={{
                                    x: offset * 320,
                                    scale: isActive ? 1 : 0.9,
                                    opacity: Math.abs(offset) <= 1 ? (isActive ? 1 : 0.5) : 0,
                                    rotate: isActive ? -1 : offset < 0 ? -3 : 3,
                                    pointerEvents: isActive ? "auto" : "none",
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                <PastLetterCard
                                    date={letter.date}
                                    body={letter.body}
                                    isActive={isActive}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Right arrow */}
                <button
                    type="button"
                    onClick={goNext}
                    disabled={activeIndex === letters.length - 1}
                    aria-label="下一封信"
                    className="absolute right-0 sm:right-4 z-10 w-10 h-10 rounded-full border-2 border-rose-300 text-rose-400 flex items-center justify-center hover:scale-110 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-transform"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>
            </div>

            {/* Dots */}
            <div className="flex gap-2.5 mt-8" role="tablist">
                {letters.map((letter, i) => (
                    <button
                        key={letter.date}
                        type="button"
                        role="tab"
                        aria-selected={i === activeIndex}
                        onClick={() => setActiveIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none ${
                            i === activeIndex
                                ? "bg-rose-500 scale-125"
                                : "bg-rose-200 hover:bg-rose-300"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default PastLetters;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PastLetters.tsx
git commit -m "feat: add PastLetters carousel with arrows, dots, keyboard, and swipe

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 4: Integrate PastLetters into Timeline

**Files:**
- Modify: `src/components/Timeline.tsx`

- [ ] **Step 1: Add import for PastLetters and config**

Add the following imports at the top of `src/components/Timeline.tsx` (after existing imports, around line 4):

```typescript
import PastLetters from "./PastLetters";
```

The existing `import config from "../config";` is already present, so no new config import is needed.

- [ ] **Step 2: Update totalSections calculation**

Change line 8 from:

```typescript
    const totalSections = config.timeline.length + 1;
```

To:

```typescript
    const totalSections = config.timeline.length + 2;
```

- [ ] **Step 3: Insert PastLetters wrapper between timeline entries and LetterEnvelope**

Modify the JSX inside the scroll container (around lines 38-47) from:

```tsx
                <div
                    ref={(el) => { sectionRefs.current[config.timeline.length] = el; }}
                    className="snap-start"
                >
                    <LetterEnvelope
                        index={config.timeline.length}
                        onInView={handleInView}
                    />
                </div>
```

To:

```tsx
                <div
                    ref={(el) => { sectionRefs.current[config.timeline.length] = el; }}
                    className="snap-start"
                >
                    <PastLetters
                        letters={config.pastLetters}
                        index={config.timeline.length}
                        onInView={handleInView}
                    />
                </div>
                <div
                    ref={(el) => { sectionRefs.current[config.timeline.length + 1] = el; }}
                    className="snap-start"
                >
                    <LetterEnvelope
                        index={config.timeline.length + 1}
                        onInView={handleInView}
                    />
                </div>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Timeline.tsx
git commit -m "feat: integrate PastLetters section into Timeline scroll-snap flow

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 5: Type check and build verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: No errors. If errors appear, fix them before proceeding.

- [ ] **Step 2: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Open the local URL (usually `http://localhost:5173/love_web/`). Navigate through the site and verify:

1. Scroll past the Timeline sections
2. The "那些年的信" section appears with the title animating in
3. The first past letter card is centered and its text staggers in
4. Left/right arrow buttons switch letters with spring animation
5. Bottom dot indicators reflect the active letter
6. Swiping left/right on the card area switches letters
7. Keyboard arrow keys work when the section is in view
8. The adjacent letter cards peek from the sides with reduced opacity
9. The final LetterEnvelope section still works correctly after PastLetters
10. The TimelineNav dot count is correct (one extra dot for PastLetters)

- [ ] **Step 4: Commit any fixes**

If any fixes were needed during verification:

```bash
git add -A
git commit -m "fix: address type/build issues in PastLetters integration

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review

### Spec Coverage Check

| Spec Requirement | Task |
|------------------|------|
| `PastLetter` interface in config.ts | Task 1 |
| 3-5 sample letters with date and body | Task 1 |
| Physical letter-paper styling (`#fffaf0`, shadow, border, rotation) | Task 2 |
| Date in top-right corner | Task 2 |
| Body in Dancing Script with stagger reveal | Task 2 |
| Horizontal carousel with centered active card | Task 3 |
| Adjacent cards peek from sides with reduced opacity/scale | Task 3 |
| Left/right arrow buttons | Task 3 |
| Bottom dot indicators | Task 3 |
| Keyboard arrow navigation | Task 3 |
| Swipe gesture support | Task 3 |
| Section entrance animation (title fade-in, card scale-in) | Task 3 |
| Placed between Timeline and LetterEnvelope | Task 4 |
| Scroll-snap integration (`snap-start`) | Task 4 |
| TimelineNav dot count updated | Task 4 |

### Placeholder Scan

- No "TBD", "TODO", "implement later", or "fill in details" found.
- No vague instructions like "add appropriate error handling".
- All code blocks contain complete, copy-pasteable implementations.
- No "similar to Task N" references.

### Type Consistency Check

- `PastLetter` interface matches usage in `PastLettersProps`.
- `PastLettersProps.letters` is `PastLetter[]`, consistent with `config.pastLetters`.
- `PastLetterCardProps` fields (`date`, `body`, `isActive`) match all call sites.
- `Timeline.tsx` passes `config.pastLetters` (type `PastLetter[]`) to `PastLetters`.
- No naming mismatches across tasks.
