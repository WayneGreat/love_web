# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check (tsc -b) + Vite production build
npm run lint       # ESLint with flat config
npm run preview    # Preview production build locally
npx tsc --noEmit   # Type-only check without emit

python serve_local.py              # Local build + serve with relative base path
python serve_local.py --build-only # Build only, don't serve
python serve_local.py --serve-only # Serve existing dist/ without rebuilding
python serve_local.py --port 8080  # Use custom port (default: auto-find)
python serve_local.py --no-browser # Don't auto-open browser
```

No test framework is configured yet.

## Architecture

**Romantic anniversary website** — single-page vertical scroll experience with timeline, envelope animation, background music, and heart particle effects. Deployed to GitHub Pages.

**Tech stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS v4 (CSS-first, no tailwind.config.js) · Framer Motion 12 · tsparticles

**Config-driven content:** All site data (timeline entries, letter text, theme colors) lives in `src/config.ts`. Components read from this central config — never hardcode content.

**Component layers (z-index):** PasswordGate (z-[60]) → IntroSplash / LetterEnvelope overlay (z-50) → LetterEnvelope backdrop (z-40) → MusicPlayer (z-30) → TimelineNav (z-20) → Content (z-10) → ParticleBackground (z-0)

**Scroll-snap sections:** The `Timeline` component renders wrapper divs with `snap-start` for three section types: `TimelineSection` entries, `PastLetters` carousel, and `LetterEnvelope`. Each wrapper holds the ref used for `scrollIntoView` navigation.

**Animation pattern:** Framer Motion `useInView` hook drives both visibility detection and animation state. Use `animate={isInView ? "visible" : "hidden"}` instead of `whileInView` + `viewport` props to avoid duplicate IntersectionObservers on the same element. Variant objects define `hidden`/`visible` states with `staggerChildren` for coordinated entrance.

**Scroll-snap:** `snap-y snap-mandatory` on the scroll container, `snap-start` on its **direct children only** (wrapper divs, not nested elements). `scrollIntoView` targets the wrapper div refs, not the section component internals.

**Tailwind v4:** Configuration is CSS-first via `src/index.css` using `@theme` blocks. No `tailwind.config.js`. Custom fonts and colors are defined there. Utility classes follow Tailwind v4 syntax. Integration uses the `@tailwindcss/vite` Vite plugin (not PostCSS). The `@theme` block defines `--font-handwriting` for the `font-handwriting` utility used across components.

**Asset organization:** Static assets (images, music) live in `public/images/` and `public/music/` and are referenced from `config.ts` by relative path (e.g., `images/pic1.png`). They are copied to `dist/` at build time with the same structure.

## Deployment

`vite.config.ts` sets `base: '/love_web/'` for GitHub Pages subdirectory deployment. All asset paths in `dist/` include this prefix. Do not remove or change the base path without updating GitHub Pages configuration.

**GitHub Actions:** `.github/workflows/deploy.yml` auto-builds and deploys to GitHub Pages on every push to `master`.

**Local preview (Windows/offline):** `serve_local.py` handles the base-path mismatch — it temporarily patches `vite.config.ts` to `base: './'` (relative), runs `npm run build`, restores the original base, then serves `dist/` via Python's `http.server` with CORS headers. Run `python serve_local.py` for build+serve, or `--build-only` / `--serve-only` for separate steps.

**Packaging:** `pack.sh` creates a tar.gz excluding `node_modules`, `dist`, `.git`, and dev-only files (`.claude`, `docs/superpowers`, `openspec`, `CLAUDE.md`). Recipients run `npm install && python serve_local.py`.

## OpenSpec Workflow

This project uses OpenSpec for requirements and Superpowers for implementation workflow:

- **Specs:** `openspec/changes/anniversary-website/` — proposal, design, tasks, and per-feature specs
- **Plans & design docs:** `docs/superpowers/plans/` and `docs/superpowers/specs/`
- **Flow:** OpenSpec produces `tasks.md` → Superpowers brainstorming → writing-plans → subagent-driven-development execution
- **Rule:** Spec changes go through OpenSpec first (`/opsx:propose`). Code changes go through Superpowers. Never modify OpenSpec specs during implementation.

## Key Conventions

- **TypeScript strictness:** `noUnusedLocals` and `noUnusedParameters` are enabled. Remove unused imports/variables before building.
- **Framer Motion easing:** Use `as const` on ease literals (e.g., `ease: "easeOut" as const`) — framer-motion 12 has strict `Easing` type that doesn't accept widened `string`.
- **Component refs:** When a component needs its own ref for `useInView`, use a wrapper div for external ref access (e.g., `scrollIntoView`). Don't try to share a single ref between internal and external concerns.
- **Focus styles:** Never use bare `outline-none` on interactive elements. Pair with `focus-visible:ring-*` for keyboard accessibility.
- **Language:** UI-facing comments and docs in Chinese; code comments in English.
- **TypeScript `erasableSyntaxOnly`:** Enabled in tsconfig. Use `as const` assertions instead of `enum` or `namespace` syntax — only erasable type annotations are allowed.
- **TypeScript `verbatimModuleSyntax`:** Enabled in tsconfig. Use `import type` for type-only imports (e.g., `import type { MusicPlayerHandle } from ...`).
- **Intro flow:** App renders a two-gate entry flow: `PasswordGate` (z-[60]) validates against `config.password`, then `IntroSplash` (z-50) dismisses on click/scroll. On intro exit, `showIntro` flips to `false`, main content mounts, and `musicPlayerRef.current?.play()` triggers autoplay.
- **MusicPlayer ref:** Uses `forwardRef` + `useImperativeHandle` exposing a `play()` method via `MusicPlayerHandle` interface. Handles browser autoplay policy with first-interaction fallback.
- **tsparticles cleanup:** Async engine initialization uses a cancellation flag in `useEffect` cleanup to prevent state updates after unmount.
- **Font loading:** Dancing Script loaded via Google Fonts in `index.html` with `rel="preconnect"` for performance.
- **Envelope animation:** CSS 3D transforms (`rotateX`) for flap, `clipPath: polygon()` for triangular flap shape. Opening triggers a fullscreen letter overlay with `scale: 0.3 → 1` and `y: 120 → 0` entrance animation, plus staggered text reveal via `textContainerVariants`.
- **Custom keyframes:** `src/index.css` defines `@keyframes float-heart` and utility classes `.animate-float-heart` / `.animate-float-heart-delay` used by `IntroSplash` and `PasswordGate` for floating heart decorations.
