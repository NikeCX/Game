# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Matrix Academy" — a React/Vite game that teaches Matrigma/Raven's-Progressive-Matrices-style visual logic puzzles (3×3 grid, pick the missing cell). Puzzles are **procedurally generated**, not a fixed image bank: there are 5 rule categories (Progression, Rotation, Construction/Overlap, Distribution/Frequency, Symmetry), each with its own generator that produces an unlimited number of unique puzzles at 5 difficulty tiers. Client-only, no backend — progress persists to `localStorage`.

## Commands

```bash
npm install
npm run dev       # Vite dev server, http://localhost:5173
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint       # oxlint (see .oxlintrc.json)
```

There is no automated test suite (no `test` script, no test files). Correctness of the puzzle generators is verified with throwaway Node scripts written on the fly (`node -e "..."` or a temp `.mjs` file importing directly from `src/generators/...`, then deleted after use) that generate thousands of puzzles and assert generator invariants — see "Verifying generator changes" below. When live-visual verification is needed, puzzles are also inspected in a running dev server via browser automation (reading actual rendered SVG `transform` values from the DOM, not just screenshots — see the symmetry-shape bugs below for why).

## Architecture

### Puzzle data model (the contract everything else depends on)

Defined as JSDoc typedefs in `src/data/puzzleTypes.js` (no TypeScript in this project):

```
Puzzle = { id, ruleType, difficulty, grid: Cell[3][3], correctAnswer, options: PuzzleOption[], explanation, meta }
Cell = ShapeInstance[]              // 1-3 shapes layered in one grid cell
ShapeInstance = { shape, size, color, rotation, fillStyle, mirror }
```

`grid[2][2]` always equals `correctAnswer` but is never rendered directly — `MatrixGrid` renders a blank "?" at that position regardless of what's stored there (`hideAnswer` prop, default `true`; the Tutorial screen sets it `false` to show the worked example fully solved).

### Generator pipeline

- `src/generators/{progression,rotation,construction,frequency,symmetry}Generator.js` — one pure `generate(difficulty, seed?)` per rule.
- `src/generators/puzzleFactory.js` — `generatePuzzle(ruleId, difficulty, seed?)` is the **single dispatch point** every screen uses; never import a generator directly from a component.
- `src/generators/core/` — shared plumbing used by all 5 generators:
  - `rng.js` — seedable PRNG (mulberry32) + `stringToSeed()` for reproducible tutorial examples.
  - `attributes.js` — domain helpers (`randomShape`, `randomColor`, `sizeAt`/`sizeIndex`, `polygonAt`/`polygonIndex`, `normalizeAngle`, `makeShapeInstance`).
  - `gridUtils.js` — `cellSignature()` (order-independent structural hash used for dedup/equality) and `cloneCell`/`cloneGrid`.
  - `distractorEngine.js` — `buildDistractor()` + `finalizeOptions()`: every generator builds a list of labeled distractor candidates (each meant to break exactly one aspect of the rule), then `finalizeOptions` dedupes by `cellSignature`, shuffles, and caps to the difficulty's `optionCount` — gracefully returning fewer options if too many candidates collide.
- `src/data/difficulty.js` — `DIFFICULTY_CONFIG[1..5]` is the single source of truth for difficulty-dependent domain sizes (option count, color/shape/rotation-step counts, co-varying attribute count). All 5 generators read from this; don't hardcode difficulty scaling inside an individual generator.

### Rendering pipeline

`src/data/shapes.js` (vocabulary: `ALL_SHAPES`, `COLOR_PALETTE`, `SIZE_SCALE`, `ROTATIONS`, `LAYOUT_SLOTS`) → `src/components/shapes/ShapeRegistry.js` (pure geometry per shape, normalized to a 0-100 viewBox) → `ShapePrimitive.jsx` (renders one shape as SVG) → `Cell.jsx` (positions 1-3 `ShapeInstance`s into a cell using `LAYOUT_SLOTS`, or renders the blank "?" placeholder) → `MatrixGrid.jsx` / `AnswerOptions.jsx`.

**Render transform order matters and is a common source of bugs**: `ShapePrimitive` applies `style.transform = "scale(size) scale(mirrorX, mirrorY) rotate(rotation)"`. CSS composes transform functions right-to-left against the geometry, so the actual point transform is **rotate first, then mirror** (mirror is applied in screen-space on top of the rotated shape). Any code that needs to reason about "does rotation X + mirror Y look the same as rotation X' + mirror Y'" must replicate this exact order — see the symmetry-shape history below.

### Shape symmetry gotchas (learned the hard way — read before adding/changing shapes)

Two real bugs shipped because a shape's geometric symmetry made two *data-different* options render *visually identical*:

1. `rotationGenerator.js` only uses shapes from a curated `ROTATABLE_SHAPES` list whose rotational-symmetry period doesn't collide with the 45°-step grid (e.g. `square`/`octagon`/`hexagon`/`plus`/`diamond`/`cross` are excluded — a square rotated 90° looks unrotated). A generic "rotate the shape as a filler distractor" trick was tried once in `progressionGenerator.js` and had to be removed because it wasn't restricted to symmetry-safe shapes.
2. `symmetryGenerator.js` needs shapes with **zero symmetry at all** (`CHIRAL_SHAPES` in `data/shapes.js`, currently `rightTriangle` and `flag`) so a mirror can never coincide with any rotation. This failed twice: first the `rightTriangle` was accidentally isosceles (one reflection axis), then it was scalene but only barely (legs ~4% different — mathematically distinct but visually indistinguishable at small render size). The current geometry (`ShapeRegistry.js`) uses a deliberately dramatic ~2.8:1 leg ratio. **When touching chiral-shape geometry, verify both mathematically (exact coordinate comparison across all rotation×mirror combos) and visually (screenshot at actual render size) — passing only the math check is not sufficient.**

### State / persistence

- `src/store/useGameStore.js` — Zustand store with `persist` middleware, localStorage key `matrix-game:v1`, versioned via `src/utils/storage.js` (`migrate` resets to defaults on schema mismatch). Tracks per-rule progress (`tutorialCompleted`, `puzzlesAttempted/Correct`, `highestDifficultySolved`, `practiceDifficulty`), XP, streaks, challenge attempt history, and badges.
- `src/store/selectors.js` — derived reads (`selectRuleMastery`, `selectFinalChallengeUnlocked`, `selectLevel`, `selectOverallAccuracy`).
- Difficulty is adaptive in **two independent places**: Practice mode uses the store's per-rule `practiceDifficulty` (`recordPracticeAnswer` does +1 on correct / -1 on incorrect, clamped 1-5). Challenge mode uses a separate in-memory `adaptiveEngine.js` (same +1/-1 clamp, but not persisted per-item — only the final summary is saved via `recordChallengeResult`).

### Screens / navigation

`App.jsx` does manual state-based routing (`screen` + `activeRuleId` in `useState`, no router) between `HomeScreen`, `TutorialStepper`, `PracticeScreen`, `ChallengeScreen`. Each top-level screen renders its own `Header`. Visiting `?dev=preview` bypasses the app entirely and renders `src/components/dev/GeneratorPreview.jsx`, a mass-generation QA tool for eyeballing many puzzles/distractors at once per rule+difficulty.

`TutorialStepper.jsx` walks a **fixed-seed** puzzle (via `stringToSeed('tutorial-<ruleId>')`) through the Inventory → Rule-Finding → Elimination method (`src/data/rules.js` → `METHOD_STEPS`) using `InventoryPanel`/`RuleFindingPanel`/`EliminationPanel`.

### React gotcha already hit once

Don't put side effects (store writes, `fireConfetti()`, etc.) inside a `setState` updater function (`setX(prev => { sideEffect(); return next })`) — React StrictMode double-invokes updater functions in dev, which silently double-fires the side effect (this caused duplicate Challenge-mode attempts to be recorded). `ChallengeScreen.jsx`'s `finish()` uses a `useRef` guard (`finishedRef`) instead.

## Verifying generator changes

There's no committed test suite, so the working pattern for this repo is: write a temporary `.mjs` script at the project root that imports directly from `src/generators/...` (ESM works directly under Node since `package.json` has `"type": "module"`), generate a few thousand puzzles per rule/difficulty, and assert:
- `cellSignature(puzzle.correctAnswer) === cellSignature(puzzle.grid[2][2])`
- exactly one option has `isCorrect: true`
- no two options share a `cellSignature` (data-level dedup)
- for anything touching rotation/mirror, no two options render to the *same visual signature* even when their data differs — reimplement `ShapePrimitive`'s exact transform math (rotate then mirror then scale) against `ShapeRegistry.getShapeGeometry()` output rather than trusting `cellSignature` alone, since geometric symmetry can make different data render identically (see the symmetry gotchas above)

Delete the script when done; none should be committed.
