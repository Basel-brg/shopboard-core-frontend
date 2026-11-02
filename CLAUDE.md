# CLAUDE.md

## 3 Core Engineering Rules for AI Agents (Day 2 Homework)

To prevent the most common architectural and state-management pitfalls observed when building interactive e-commerce applications:

### Rule 1: Never Mutate Original Catalog State on Sorting (Default Order Preservation)
- **The Mistake:** Using in-place `Array.prototype.sort()` directly on shared catalog arrays or relying on non-deterministic sorts so choosing "Default" fails to restore the initial catalog index.
- **The Rule:** Always operate on a shallow copy (`[...PRODUCTS]`) and preserve reference indices. When "Default" is selected, deterministically restore initial catalog order using `PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b)`.

### Rule 2: Single-Source Event Delegation for Dynamic Elements
- **The Mistake:** Re-attaching click event listeners to individual buttons/cards inside render functions (`renderProducts()`), causing repeated filter/search changes to accumulate multiple listeners and add 5+ items on a single click.
- **The Rule:** Attach exactly ONE event listener to the static parent container (`#products-grid` or `#cart-items-list`) using event delegation (`e.target.closest('[data-add-id]')`). Re-rendering inner HTML must never attach new listeners.

### Rule 3: Strict Separation of Concerns (Only One Presentation File Touches the DOM)
- **The Mistake:** Allowing data/logic modules (`cart.js`, `products.js`, `auth.js`) to query or manipulate the DOM (`document.querySelector`, `window.alert`), creating tight coupling and breaking unit tests.
- **The Rule:** Pure logic lives in standalone managers (`CartManager`, `AuthManager`, `validation.js`) with zero DOM dependencies. All DOM reads, writes, and event bindings belong strictly to `src/main.js`. Future features like a wishlist must follow this architecture (`src/wishlist.js` for pure logic, rendered only via `src/main.js`).

### Rule 4: Clean, Normalized Local Storage Persistence
- **The Mistake:** Storing raw DOM nodes, non-serializable objects, or stale denormalized totals in `localStorage`.
- **The Rule:** Store only essential normalized state (e.g. `[{ id, quantity, ... }]`). Calculate derived metrics (item count, subtotal, discount, shipping, grand total) dynamically via getters (`cart.getState()`), and persist automatically on every state mutation.

---

> For detailed project styling conventions, design tokens, and commands, refer to [AGENTS.md](./AGENTS.md).
