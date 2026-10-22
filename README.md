# Lab 03 - Project Milestone 1: Proposal & Static Prototype

**Week 4 - worth 8% of your final grade - group milestone**

> This is a project lab - there is no starter repo and nothing to clone. The work happens in your **group's project repository**, over the weeks leading up to today. This session is the deadline, the demo, and a checkpoint with your TA. See `project/PROJECT.md` for the whole plan, and begin early.

This is the first milestone (m1) of your group project. By now you should have a topic, an API in mind, and a team that's been meeting. Today you lock the plan and show a styled prototype of your interface - built by hand in HTML & CSS, no framework code yet.

## What's due

### Part 1 - A written proposal (`PROPOSAL.md` in your repo)

- **Topic** - a one-paragraph pitch of your app and who it's for
- **Data source** - the API you'll consume: its name/URL, and a sample response (paste a trimmed JSON example) showing the fields you'll use (or, if you're building your own backend, describe its planned endpoints)
- **Comparators** - 2–3 existing apps/sites doing something similar, and how yours differs
- **Scaled feature plan** - the baseline features (from `project/PROJECT.md`) plus each member's vertical slice, named and assigned. Make it clear who owns what
- **Wireframes** - sketches of your key pages (hand-drawn, Figma, anything legible), committed to the repo

### Part 2 - A static HTML/CSS prototype

- The **list page** and a **detail page** at minimum, on sample / hard-coded data
- **Semantic HTML**, responsive layout, accessible (one `<h1>` per page, labelled controls, alt text, keyboard-reachable, AA contrast)
- **No framework / no JavaScript app code** yet - this is a static version. It can be plain CSS or use a CSS framework
- It should look like a real screen, not a placeholder - this is what we assess instead of a plan on paper

### Part 3 - A divided-up project board

- GitHub **Issues** created for the planned work, divided up and assigned to members, on your project board

## How to submit

1. Commit and push everything to `main`.
2. Create an annotated tag on the commit you want graded and push it:
   ```bash
   git tag -a m1 -m "Milestone 1: proposal + static prototype"
   git push origin m1
   ```
3. The graded state is the `m1` tag (or `main` at the start of the lab if you forget to tag).

## In the lab session

- **TA-guided checkpoint** - your TA reviews your repo, answers questions, and flags risks early
- **Group presentation** to your lab section (your TA will assign a slot, ~ 5 min):
  - walk through the proposal (topic, the API + its data, comparators, and the plan - who owns which slice)
  - **demo the prototype** (desktop and a narrow screen)
  - say what's next in the plan
  - **Every member must present a part.** Participation is graded

> **Accessibility accommodation:** if you have a Student Accessibility Services accommodation that exempts you from presentations, arrange an alternative with your instructor in advance - you will not be penalised.

## How it's graded (8%)

| Component | Weight |
|---|---|
| **Proposal** - clear topic, a real API with its data shape, comparators, and a credible per-member plan | 2% |
| **Prototype** - semantic, responsive, accessible, and a coherent design across the two pages | 3% |
| **Plan & teamwork** - issues created and divided; the board reflects the plan | 1% |
| **Presentation** - clear, all members participate | 2% |

> **AI policy:** this milestone allows AI for learning only - explanations, error messages, no AI-generated code. See `project/ai-policy.md`.

> **References**
., J. D. (n.d.). Dumbbell clipart etsy #35672 - Free Transparent PNG Logos. Free PNG Logos. Retrieved September 28, 2026, from https://www.freepnglogos.com/images/dumbbell-35672.html#user

Proposal
=======

# React + Vite (From Generated File)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.