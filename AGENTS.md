# AGENTS.md

Single source of truth for any AI agent working on this project.
Read this file first. If you learn something durable about the project
(architecture decisions, conventions, gotchas, TODOs), write it back here —
not into `CLAUDE.md`, not into chat-only notes.

## Project

**shopboard** — a frontend app scaffolded with Vite (vanilla JS template, no framework).

- Repo root: this directory (`shopboard/`), initialized with git.
- First commit `a076b79` is the untouched Vite scaffold, so `git diff a076b79` always
  shows exactly what has been built on top of the starter.
- Node 22, npm 10. Vite `^8.3.5`. ESM throughout (`"type": "module"` in package.json).

## Commands

```bash
npm run dev      # dev server with HMR
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
```

There are no tests, linter, or formatter configured yet. If you add any, document the
command here.

## Layout

| Path | Role |
|---|---|
| `index.html` | Real entry point — Vite serves it directly. Holds `<div id="app">` and loads `/src/main.js`. |
| `src/main.js` | App entry: imports CSS, renders markup into `#app`, wires up modules. |
| `src/counter.js` | Leftover scaffold demo module (`setupCounter`). Safe to delete once real code lands. |
| `src/style.css` | All styles: CSS custom properties on `:root`, a `prefers-color-scheme: dark` block, nested CSS, one breakpoint at 1024px. |
| `src/assets/` | Assets that must be `import`ed from JS so Vite fingerprints and rewrites their URLs. |
| `public/` | Files copied verbatim to the web root; reference them by absolute path (`/favicon.svg`, `/icons.svg`). Never `import` from here. |

Still the Vite starter page as of the last update to this file.

## Conventions

- Vanilla JS and plain CSS. Don't introduce a framework, TypeScript, or a CSS
  preprocessor without the owner asking for it.
- Keep modules small and single-purpose, exporting `setup*(element)`-style functions that
  take the DOM node they operate on — the pattern `src/counter.js` establishes.
- Theme values belong in the `:root` custom properties in `src/style.css`, with a matching
  entry in the dark-mode block. Don't hardcode colors in rules.
- Match the existing code style: 2-space indent, no semicolons in JS, single quotes.
- Assets used from JS go in `src/assets/`; only genuinely static, path-stable files go in
  `public/`.

## State of play

- [x] Vite vanilla scaffold, dependencies installed, first commit
- [ ] Replace the starter page with the real shopboard UI
- [ ] Decide what shopboard actually does (no product spec captured yet — ask the owner)
- [ ] Remove `src/counter.js` and the scaffold assets once unused

## Notes for the next agent

- The parent directory (`core forontend/`) is **not** a git repo; only `shopboard/` is.
  Run git commands from inside `shopboard/`.
- The path contains a space (`core forontend`) — always quote it in shell commands.
- The scaffold came from create-vite v9, which ships a richer starter page than older
  Vite versions: `public/icons.svg` is an SVG sprite consumed via `<use href="...#id">`.
