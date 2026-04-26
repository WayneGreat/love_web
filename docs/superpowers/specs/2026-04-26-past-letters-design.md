# PastLetters Section Design

## Overview

Add a new section called "那些年的信" (Those Years' Letters) that displays 3-5 past letters in a horizontal carousel with physical letter-paper styling. Placed after the Timeline and before the final LetterEnvelope, it creates an emotional narrative progression:

1. Timeline → "What we experienced together"
2. **PastLetters** → "What we wrote to each other"
3. LetterEnvelope → "What I want to say now"

---

## Architecture & Placement

### Page Flow

```
IntroSplash
  ↓
Timeline (scroll-snap sections)
  ↓
PastLetters (NEW — h-screen snap-start)
  ↓
LetterEnvelope (final envelope)
  ↓
MusicPlayer (fixed)
```

### Component Boundaries

| Component | Responsibility |
|-----------|--------------|
| `PastLetters` | Carousel container, gesture/click navigation, active-index state management |
| `PastLetterCard` | Single letter display (paper styling, date, body, stagger animation) |

### Refs & Animation Coordination

- `PastLetters` uses `useInView` to detect when the section enters the viewport. On enter, it triggers the container entrance animation (title fade-in, active card scale-in).
- `PastLetterCard` receives `isActive` prop. When `true` and the card mounts (or re-mounts on switch), it triggers the staggered text reveal.
- Cards are keyed by `date` so React remounts them on switch, ensuring the stagger animation replays.

---

## Visual Design

### Container

- **Height:** `h-screen snap-start`
- **Background:** Inherits global page gradient (`#fce4ec` → `#f8bbd0`)
- **Title:** "那些年的信", centered, Dancing Script, fade-in on enter
- **Carousel area:** Occupies the remaining vertical space below the title

### Active Letter Card (Center)

- **Paper color:** `#fffaf0` (warm off-white)
- **Border radius:** `rounded-lg`
- **Shadow:** `shadow-xl` for elevation
- **Border:** `1px solid rgba(0,0,0,0.05)` for subtle paper edge
- **Rotation:** `rotate(-1deg)` at rest; enters from `rotate(-3deg)` and settles
- **Size:** `width: min(85vw, 480px)`, `max-height: 70vh`, auto scroll if overflow
- **Padding:** `p-8` or `p-10` (generous margins like real letter paper)

### Typography Inside Card

- **Date:** Top-right corner, `text-sm`, `text-rose-400`, sans-serif font
- **Divider:** Thin horizontal line (`h-px bg-rose-100`) below date area, like letterhead
- **Body:** Dancing Script, `text-xl`, `leading-relaxed`, `text-gray-700`, left-aligned

### Adjacent Letter Cards (Peeking Edges)

- Positioned left and right of the active card, only partially visible
- `scale: 0.9`, `opacity: 0.5`
- Left card: `rotate(-3deg)`; Right card: `rotate(3deg)`
- Creates a fanned-out physical letter spread effect

### Navigation Controls

- **Arrows (desktop):** Thin circular outline buttons, `text-rose-400`, hover scale-up
- **Dots:** Bottom-centered, 3-5 circles. Active: solid + larger; Inactive: hollow + faded
- **Swipe (mobile/touch):** Horizontal swipe to switch
- **Keyboard:** `←` `→` arrow keys via `keydown` listener

---

## Animation Design

### Section Entrance (triggered by `useInView`)

1. Title fades in + translates up (`y: 20 → 0`, `opacity: 0 → 1`, duration 0.6s)
2. Active card scales in (`scale: 0.85 → 1`, `y: 40 → 0`, `rotate: -3deg → -1deg`, duration 0.7s, `easeOut`)
3. After card settles, body text stagger reveal begins

### Stagger Text Reveal (inside `PastLetterCard`)

- Body text split by `\n` or sentence into individual `<motion.p>` lines
- Parent variant: `staggerChildren: 0.05`
- Child variant: `hidden: { opacity: 0, y: 10 }`, `visible: { opacity: 1, y: 0 }`
- Duration per line: 0.4s

### Card Switch Animation

- Current active card exits in the direction of navigation (`x: -100%` or `x: 100%`, `opacity: 1 → 0`)
- New card enters from the opposite direction (`x: 100%` or `x: -100%`, `opacity: 0 → 1`)
- Transition: `type: "spring", stiffness: 300, damping: 30`
- New card remounts due to `key` change, triggering stagger reveal automatically

---

## Data Model

### `config.ts` Additions

```typescript
interface PastLetter {
    date: string;
    body: string;
}

interface SiteConfig {
    // ... existing fields
    pastLetters: PastLetter[];
}
```

### Example Data

```typescript
pastLetters: [
    {
        date: "2023-08-15",
        body: "亲爱的，今天是我们的第一个七夕。虽然相隔千里，但每当想起你的笑容，心里就像被阳光填满了一样温暖。"
    },
    {
        date: "2024-02-14",
        body: "这是我们在一起的第一个情人节。想对你说，遇见你是我这辈子最美好的意外。"
    },
    {
        date: "2024-08-10",
        body: "时间不知不觉又过了一年。你依然是我每天醒来第一个想到的人，晚安前最后一个想念的人。"
    },
],
```

### Design Rationale

- **No title field:** Letters don't have titles; the date serves as their identity. Keeps the design pure.
- **No image field:** User explicitly stated content includes only date and body. YAGNI.
- **Config-driven:** Follows existing project pattern. All content lives in `config.ts`.

---

## Component Props

### `PastLettersProps`

```typescript
interface PastLettersProps {
    letters: PastLetter[];
}
```

### `PastLetterCardProps`

```typescript
interface PastLetterCardProps {
    date: string;
    body: string;
    isActive: boolean;
}
```

---

## Accessibility

- Arrow buttons have `aria-label` ("上一封信", "下一封信")
- Dot indicators use `role="tab"` with `aria-selected`
- Keyboard navigation (`←` `→`) is supported
- Focus-visible ring on all interactive elements (`focus-visible:ring-2 focus-visible:ring-rose-400`)
- Reduced motion: respect `prefers-reduced-motion` by disabling rotations and reducing transition durations

---

## Dependencies

- `framer-motion` — already in use for animations
- `lucide-react` — already in use for icons (ChevronLeft, ChevronRight)
- No new packages required

---

## Open Questions

None. All requirements clarified and design approved by user.
