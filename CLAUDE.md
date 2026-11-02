# CLAUDE.md

## Core Engineering Rules for AI Agents

To ensure consistency, maintainability, and architectural integrity across the project:

### Rule 1: Never Mutate Original Catalog State on Sorting (Default Order Preservation)
- **The Mistake:** Using in-place `Array.prototype.sort()` directly on shared catalog arrays or relying on non-deterministic sorts so choosing "Default" fails to restore the initial catalog index.
- **The Rule:** Always operate on a shallow copy (`[...PRODUCTS]`) and preserve reference indices. When "Default" is selected, deterministically restore initial catalog order using `PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b)`.

### Rule 2: Single-Source Event Delegation for Dynamic Elements
- **The Mistake:** Re-attaching click event listeners to individual buttons/cards inside render functions, causing repeated filter/search changes to accumulate multiple listeners and fire repeated actions on a single click.
- **The Rule:** Attach exactly ONE event listener to the static parent container (`#products-grid` or `#cart-items-list`) using event delegation (`e.target.closest('[data-add-id]')`). Re-rendering inner HTML must never attach new listeners.

### Rule 3: Strict Separation of Concerns (Only One Presentation File Touches the DOM)
- **The Mistake:** Allowing data, state, or pure logic files (`*.logic.ts`, `*.state.ts`, `*.api.ts`) to query or manipulate the DOM (`document.querySelector`, `window.alert`), creating tight coupling and breaking unit/headless tests.
- **The Rule:**
  - **`*.types.ts`**: Pure TypeScript contracts and interfaces.
  - **`*.api.ts`**: Remote fetching, mock datasets, or persistence adapters.
  - **`*.logic.ts`**: Pure functions, calculations, algorithms (ZERO DOM dependencies).
  - **`*.state.ts`**: State management & localStorage sync.
  - **`*.ui.ts` / `main.ts`**: ONLY presentation files touch the DOM or window.

### Rule 4: Feature-Based Modular Architecture ("A Folder for Each Feature")
When implementing any **new feature** (e.g. wishlist, reviews, checkout), create a dedicated directory under `src/modules/<feature-name>/`:
```text
src/modules/<feature-name>/
├── <feature>.types.ts    # Types & Interfaces
├── <feature>.api.ts      # Data fetching & API
├── <feature>.logic.ts    # Pure business rules (no DOM)
├── <feature>.state.ts    # State management
└── <feature>.ui.ts       # DOM rendering & UI templates
```
Shared cross-cutting code belongs in `src/shared/` (`api/client.ts`, `ui/icons.ts`, `ui/toast.ts`, `validation.ts`).
Do not create root-level shim files in `src/`.

### Rule 5: Clean, Normalized Local Storage Persistence
- **The Mistake:** Storing raw DOM nodes, non-serializable objects, or stale denormalized totals in `localStorage`.
- **The Rule:** Store only essential normalized state (e.g. `items: [{ id, quantity }]`). Calculate derived metrics (item count, subtotal, discount, shipping, grand total) dynamically via getters (`cart.getState()`), and persist automatically on state mutations.

---

> For detailed project styling conventions, design tokens, commands, and layout, refer to [AGENTS.md](./AGENTS.md).
