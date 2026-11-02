# Debugging Log — ShopBoard Interactive

This log documents bugs encountered during the implementation and auditing of the ShopBoard project, categorized by type (runtime, logic, state), root cause analysis, and resolution.

---

## Bug 1

- **What I saw:** When sorting products by price and then switching the dropdown back to "الافتراضي" (Default), the catalog order remained scrambled instead of returning to the initial product catalog sequence.
- **Type:** logic
- **How I found it:** Manual QA testing in browser while testing the Part 1 checks; compared DOM product IDs before and after sorting.
- **Cause:** `src/main.js` in `getFilteredProducts()` used a tag-based fallback sort (`list.sort((a, b) => (b.tag ? 1 : 0) - (a.tag ? 1 : 0))`) instead of preserving or referencing the original `PRODUCTS` array indexes.
- **Fix:** Added `<option value="default">الافتراضي (ترتيب الكتالوج)</option>` and updated the default sort case to deterministic index comparison: `list.sort((a, b) => PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b))`.
- **Did I use AI? For what?** No. Investigated the switch statement in `src/main.js` and verified against the initial `PRODUCTS` array.

---

## Bug 2

- **What I saw:** Changing the price or category filter 5 times and then clicking "أضف للسلة" on a product card added multiple duplicate quantities of the same item in a single click if listeners were attached per card.
- **Type:** state
- **How I found it:** Application tab in Chrome DevTools > Local Storage > inspecting item quantities after rapid filter switching.
- **Cause:** In dynamic JavaScript apps, calling `element.addEventListener()` repeatedly inside `renderProducts()` creates stacked event listeners for every re-render.
- **Fix:** Enforced Event Delegation in `src/main.js`. Replaced individual button listeners with a single static listener on `productsGrid.addEventListener('click', (e) => { ... })` using `e.target.closest('[data-add-id]')`.
- **Did I use AI? For what?** Yes, discussed event bubbling patterns vs per-element bindings to verify performance best practices.

---

## Bug 3

- **What I saw:** The 3D Desk Builder canvas rendered with deep pitch-black shadows where wood grain and computer parts were barely visible on low-gamma monitors.
- **Type:** runtime
- **How I found it:** Visual inspection on screen after opening the 3D studio modal; screenshot review.
- **Cause:** `src/desk-builder/scene.js` used only a single low-intensity directional light combined with ACESFilmic tone mapping and a dark background clear color (`#0c0e12`), casting harsh self-shadows across the desk.
- **Fix:** Replaced with a balanced 3-point studio lighting setup (Directional key light + fill light + back rim light) plus a `HemisphereLight` (sky color 0xffffff, ground color 0xd5c3a5, intensity 1.8), warmed the desk material to warm oak, and tuned exposure to 1.45.
- **Did I use AI? For what?** Yes, to calculate the optimal Three.js HemisphereLight color temperature and vector positions for warm architectural visualization.

---

## Bug 4

- **What I saw:** High-end items like the Aorus Gaming PC (4,850 SAR) and 34" Curved Monitor (2,750 SAR) disappeared completely from the catalog even when "الكل" was selected.
- **Type:** logic
- **How I found it:** Console log `PRODUCTS.length` vs displayed count `productsCount.textContent`; inspected `src/validation.js` and `src/main.js`.
- **Cause:** The price slider `<input type="range" id="price-range-input">` was hardcoded to `max="500"` with initial `value="500"`, causing `matchesPrice = item.price <= state.maxPrice` to filter out any item exceeding 500 SAR.
- **Fix:** Raised slider `max` and default `value` to `6000` (with `step="50"`), updated label output to `6000 ر.س`, and updated `priceRange` validator constraint in `src/validation.js` to `num >= 50 && num <= 6000`.
- **Did I use AI? For what?** No. Discovered directly by inspecting the filter state object `state.maxPrice`.

---

## Bug 5

- **What I saw:** When placing accessories (like the desk mat or mechanical keyboard) on the 3D desk surface, textures flickered (Z-fighting) and partially sank into the wood.
- **Type:** logic
- **How I found it:** Rotating the Three.js orbit camera to a grazing angle; observed polygon flickering.
- **Cause:** `src/desk-builder/interaction.js` placed all items at exact desk top elevation `y = 0.76` without factoring in stacking thickness or foundation heights of underlying desk pads.
- **Fix:** Implemented `calculateElevation(itemDef, placedItems)` in `src/desk-builder/interaction.js`, which detects if an accessory sits over a desk mat and adds a `+0.012` vertical offset to avoid geometric intersection.
- **Did I use AI? For what?** No. Calculated the mesh bounding box height and added the clearance offset.
