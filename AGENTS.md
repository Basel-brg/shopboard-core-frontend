# ShopBoard

Single source of truth for any AI agent working on this project.
Read this file first. If you learn something durable about the project
(architecture decisions, conventions, gotchas, TODOs), write it back here —
not into chat-only notes.

## Stack
TypeScript (strict), Vite, HTML5, CSS3, Playwright E2E, Three.js (3D Desk Studio).

## Core Rules
1. **Semantic HTML first**: Use appropriate HTML5 tags (`<dialog>`, `<header>`, `<main>`, `<section>`, `<nav>`, `<article>`, `<button>`).
2. **Every input has a label**: Explicit `<label for="...">` or `aria-label`/`aria-labelledby`.
3. **Mobile-first, min-width**: Responsive CSS starting from mobile, scaling up with `min-width` breakpoints (`640px`, `768px`, `1024px`).
4. **No `!important`**: Manage CSS specificity cleanly through class selectors and `:root` design tokens.
5. **Strict Separation of Concerns**: Pure logic/data files MUST NOT touch the DOM. Only `*.ui.ts` or `main.ts` interact with DOM elements.
6. **Validate all inputs**: Live inline feedback, constraint validation, accessibility attributes (`aria-invalid`, `aria-describedby`).
7. **Type-safe throughout**: Strict TypeScript with 0 `any` without explicit justification, full interfaces for all domain models.

## Commands

```bash
npm run dev        # start local Vite dev server
npm run build      # typecheck (tsc --noEmit) and build production bundle into dist/
npm run typecheck  # run TypeScript compiler check without emitting files
npm test           # run full Playwright browser E2E test suite (12 tests)
npm run preview    # preview production build locally
```

## Modular Feature Architecture ("A Folder for Each Feature")

When implementing any **new feature** or refactoring existing code, **always organize files by feature** under `src/modules/<feature-name>/` following this strict separation of responsibilities:

```text
src/modules/<feature-name>/
├── <feature>.types.ts    # 1. Type definitions: domain interfaces, payload types, state contracts (pure types, 0 logic)
├── <feature>.api.ts      # 2. Data / API: network requests, mock datasets, external fetches, remote schemas
├── <feature>.logic.ts    # 3. Pure Logic: algorithms, calculations, filters, sorters, pure transforms (0 DOM access)
├── <feature>.state.ts    # 4. State Management: localStorage sync, state containers, reactive signals/subscribers
└── <feature>.ui.ts       # 5. UI & Presentation: DOM element builders, HTML template rendering (ONLY file touching DOM)
```

### Responsibility Breakdown:
- **`*.types.ts`**: Contains domain models, interfaces, DTOs, and state contracts.
- **`*.api.ts` (or data)**: Handles remote fetching, REST/GraphQL calls, or catalog datasets.
- **`*.logic.ts`**: Pure functions taking inputs and returning outputs. **Never imports or touches the DOM**. Easily unit-tested.
- **`*.state.ts`**: Holds feature state, manages persistence (`localStorage`), handles subscriptions or mutations.
- **`*.ui.ts`**: Renders templates, creates DOM elements, attaches event listeners. **Only UI files and `main.ts` touch the DOM**.
- **`src/main.ts`**: The top-level application coordinator. Wires modules together, mounts views, and manages top-level event delegation.

### Shared Infrastructure (`src/shared/`)
For utilities and UI primitives used across multiple features:
```text
src/shared/
├── api/
│   └── client.ts         # Shared HTTP/Fetch client and request helpers
├── ui/
│   ├── icons.ts          # Custom SVG UI icons and vector illustrations
│   └── toast.ts          # Accessible notification/toast system
└── validation.ts         # Reusable form validators, regex patterns, and error formatters
```

---

## Directory Layout

| Path | Role |
|---|---|
| `index.html` | Real entry point — RTL Arabic setup (`lang="ar" dir="rtl"`), Google Fonts, mounts `/src/main.ts`. |
| `src/main.ts` | App coordinator: wires features, initializes dialogs, binds top-level event delegation. |
| `src/modules/products/` | Product catalog feature (`products.types.ts`, `products.api.ts`, `products.logic.ts`, `products.ui.ts`). |
| `src/modules/cart/` | Shopping cart feature (`cart.types.ts`, `cart.state.ts`, `cart.logic.ts`, `cart.ui.ts`). |
| `src/modules/auth/` | Authentication feature (`auth.types.ts`, `auth.state.ts`). |
| `src/desk-builder/` | 3D Interactive Desk Studio (`types.ts`, `studio-scene.ts`, `studio-catalog.ts`, `studio-interaction.ts`, `studio-cart.ts`). |
| `src/shared/` | Shared cross-feature infrastructure (`api/client.ts`, `ui/icons.ts`, `ui/toast.ts`, `validation.ts`). |
| `src/style.css` | Editorial design system (Warm Stone & Deep Emerald palette + dark mode), mobile-first CSS with no `!important`. |
| `tests/e2e/` | Playwright browser E2E test suites (`catalog.spec.ts`, `cart.spec.ts`, `auth.spec.ts`, `desk-builder.spec.ts`). |

## Architecture Conventions & Rules

1. **Deterministic Sorters (Catalog Rule)**:
   Never mutate catalog arrays in-place (`sort()`). Always copy (`[...PRODUCTS]`). Selecting "Default" must deterministically restore the original index order.
2. **Single-Source Event Delegation**:
   Attach event listeners to static parent containers (`#products-grid`, `#cart-items-list`) using `e.target.closest()`. Never re-bind event listeners inside render functions.
3. **Only UI Touches the DOM**:
   No DOM access in `*.logic.ts`, `*.state.ts`, `*.api.ts`, or `*.types.ts`. All DOM interaction is isolated to `*.ui.ts` and `main.ts`.
4. **Normalized State Persistence**:
   Save minimal normalized state to `localStorage` (e.g. `items: [{ id, quantity }]`). Compute derived metrics (subtotals, discounts, shipping) dynamically in `getState()`.
5. **No Duplicate Root Files**:
   Do not add root shim files (like `src/cart.ts` or `src/products.ts`). All code belongs strictly inside its feature folder under `src/modules/` or in `src/shared/`.

## State of play

- [x] TypeScript migration completed with strict mode and 0 type errors
- [x] Feature-based modular architecture applied (`src/modules/*`, `src/shared/*`)
- [x] Duplicate root shim files and redundant type folders removed
- [x] 3D Desk Studio modularized in `src/desk-builder/` with local types
- [x] Playwright E2E browser test suite passing 100% (12/12 tests green)
- [x] Production build passes (`npm run build`)
