# Lab 06 - Project Milestone 2: React Foundation

**Week 7 - worth 12% of your final grade - group milestone**

> A project lab - the work lives in your **group's repository**, built over weeks 5-7. Today is the deadline, the demo, and a TA checkpoint. Start early; `project/PROJECT.md` is the plan.

## What's due

### 1 - The prototype, rebuilt as a React SPA

A Vite + React project (in your group's repo) where the Milestone 2 prototype is now:
- decomposed into components (with props)
- driven by state (`useState`)
- handling events, and rendering the collection with `.map` + stable keys
- interactive on local / mock data - an in-repo JSON file or array

The core experience must work: browse the collection, open an item, and toggle at least one piece of state (e.g. a favourite, a filter, an expand). It must run with `npm install && npm run dev`.

### 2 - Visible individual contribution

Each member's vertical slice should show real progress, and it should be provably theirs in the Git history (commits / reviewed PRs). Work on branches; merge through PRs.

### 3 - An updated project board

Issues moved/closed to reflect actual progress since Milestone 2.

## How to submit

1. All progress will be committed to your group's project repository (not this repo)
2. Commit and push to `main` (don't commit `node_modules/` - add a `.gitignore`)
3. Tag and push the graded commit:
   ```bash
   git tag -a m2 -m "Milestone 2: React foundation"
   git push origin m2
   ```
4. The graded state is the `m2` tag (or `main` at the start of the lab)

## In the lab session

- **TA-guided checkpoint** - a chance to get unstuck on React, component structure, or state
- **Group presentation** (~ ~5 min, slot assigned by your TA):
  - **live-demo** the React app (run it, click through it)
  - walk through your component structure
  - each member presents their own slice's progress
  - name the risks/remaining work for the final (M4)
  - **Every member must present a part.** Participation is graded

> **Accessibility accommodation:** if a Student Accessibility Services accommodation exempts you from presentations, arrange an alternative with your instructor in advance.

## How it's graded (12%)

| | |
|---|---|
| **Works as a React app** - components, props, state-drives-UI, events, keyed lists; runs cleanly on mock data | 6% |
| **Decomposition & quality** - sensible components, no mutated state, no by-hand DOM; basic security hygiene (no unsanitised `innerHTML`) | 3% |
| **Individual contribution** - each member's slice is visible in the Git history | 2% |
| **Presentation** - clear demo, all members participate | 1% |

> **AI policy:** this milestone allows AI for *learning* only. See `project/ai-policy.md`.
