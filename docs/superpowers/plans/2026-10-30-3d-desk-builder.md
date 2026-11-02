# 3D Desk Builder (مُنشئ مساحة العمل ثلاثي الأبعاد) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive, realistic 3D Desk Builder in ShopBoard using Three.js, enabling users to direct-drag and position realistic gaming PC setup components onto a 3D desk, rotate/reposition them, calculate bundle price live, and add the entire custom setup to the shopping cart.

**Architecture:** A modular studio architecture inside `src/desk-builder/` initialized lazily when the user opens the `<dialog id="desk-builder-modal">`. Built with Three.js (WebGL PBR renderer, OrbitControls, and Raycasting for pointer-driven spatial positioning), cleanly integrated with the existing `src/products.js` catalog and `src/cart.js` state manager.

**Tech Stack:** Three.js, Vanilla JavaScript (ESM), Vite, Semantic HTML5 `<dialog>`, CSS3.

**Spec:** `docs/superpowers/specs/2026-10-30-3d-desk-builder-design.md`

## Global Constraints
- Strict adherence to `shopboard/PRODUCT.md` and `shopboard/AGENTS.md` (Semantic HTML, Mobile-first CSS, No `!important`, ARIA attributes, Arabic language `dir="rtl"`).
- Lazy loading: Three.js and 3D studio resources must only load/initialize when opening the builder modal to keep initial page load lightweight.
- Smooth performance: 60 FPS rendering with soft shadow mapping and orbit damping.
- Pointer isolation: OrbitControls must be automatically disabled during product drag/repositioning to prevent camera jitter.

## Review Focus
1. **Dragging outside desk boundaries:** When dragging an item, coordinates must be clamped to the desk top plane boundaries so items cannot float in empty air.
2. **Multi-instance cart aggregation:** Adding duplicate items (e.g. 2 monitors, 2 speakers) must correctly increment `quantity` in `CartManager` rather than creating corrupt duplicate IDs.
3. **Z-fighting on desk accessories:** Items placed over a desk mat (لباد) or monitor riser must automatically receive an elevation offset ($Y + \text{height}$) to prevent visual clipping.
4. **Modal lifecycle & WebGL disposal:** Closing the builder modal (via `Escape` or close button) must pause the animation loop and preserve camera state cleanly without memory leaks.
5. **Responsive resize:** Resizing the browser window must update `camera.aspect` and call `renderer.setSize` without distorting the 3D scene.

---

### Task 1: Expand Product Catalog with Gaming PC Tower & Gaming Monitor

**Files:**
- Modify: `shopboard/src/products.js:1-144`
- Test: `shopboard/tests/products-builder.test.js`

**Interfaces:**
- Produces: `PRODUCTS` array containing new items `SB-PC-09` (كيسة كمبيوتر ألعاب احترافية) and `SB-MON-10` (شاشة ألعاب منحنية 34 بوصة), compatible with `CartManager`.

- [ ] **Step 1: Write test for new catalog items**

Write `shopboard/tests/products-builder.test.js` verifying that `PRODUCTS` contains items with categories 'أجهزة ألعاب' and 'شاشات العرض', each possessing `id`, `sku`, `name`, `price`, `image`, and `specs`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test shopboard/tests/products-builder.test.js`  
Expected: FAIL (missing new categories and items).

- [ ] **Step 3: Add new products to `shopboard/src/products.js`**

Add `Aorus Gaming PC Tower` (SKU: `SB-PC-09`, price: 4,850 ر.س) and `Gigabyte Curved Gaming Monitor 34"` (SKU: `SB-MON-10`, price: 2,750 ر.س) to `PRODUCTS`, along with updated `CATEGORIES`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test shopboard/tests/products-builder.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add src/products.js tests/products-builder.test.js
git commit -m "feat(catalog): add gaming PC case and curved monitor to products"
```

---

### Task 2: Install Three.js & Implement 3D Scene Core (`studio-scene.js`)

**Files:**
- Modify: `shopboard/package.json`
- Create: `shopboard/src/desk-builder/studio-scene.js`
- Test: `shopboard/tests/studio-scene.test.js`

**Interfaces:**
- Produces: `class DeskStudioScene` with methods:
  - `init(containerElement): void`
  - `start(): void`
  - `stop(): void`
  - `resize(): void`
  - `getDeskTopMesh(): THREE.Mesh`
  - `setControlsEnabled(boolean): void`

- [ ] **Step 1: Install three package in shopboard**

Run: `cd shopboard && npm install three`

- [ ] **Step 2: Write test for DeskStudioScene structure**

Write `shopboard/tests/studio-scene.test.js` asserting `DeskStudioScene` exports correct API methods and lifecycle controls.

- [ ] **Step 3: Implement `DeskStudioScene` in `shopboard/src/desk-builder/studio-scene.js`**

Initialize WebGLRenderer with soft shadow maps, ACESFilmicToneMapping, PerspectiveCamera, OrbitControls (damping enabled), ambient light, directional shadow-casting sun light, room boundaries, and walnut wood desk with matte black steel legs.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test shopboard/tests/studio-scene.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add package.json package-lock.json src/desk-builder/studio-scene.js tests/studio-scene.test.js
git commit -m "feat(3d): implement Three.js DeskStudioScene core and lighting"
```

---

### Task 3: Build 3D Realistic Models & Catalog Mesh Generators (`studio-catalog.js`)

**Files:**
- Create: `shopboard/src/desk-builder/studio-catalog.js`
- Test: `shopboard/tests/studio-catalog.test.js`

**Interfaces:**
- Consumes: `PRODUCTS` from `src/products.js`
- Produces: `create3DProduct(productId, isPreview): THREE.Group` supporting:
  - Gaming PC Case (transparent glass side panel, RGB interior fans, GPU/motherboard geometry).
  - Ultrawide Curved Monitor (curved screen bezel, emissive glowing display, metallic arm).
  - Mechanical Keyboard (PBT keycaps, orange backlight).
  - Ergonomic Mouse & Desk Mat.
  - Desktop Studio Speakers & Screenbar Light.

- [ ] **Step 1: Write test for mesh generator**

Write `shopboard/tests/studio-catalog.test.js` asserting `create3DProduct(id)` returns a `THREE.Group` with proper `userData` (`productId`, `name`, `price`, dimensions) and valid child meshes with shadow properties.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test shopboard/tests/studio-catalog.test.js`  
Expected: FAIL (`create3DProduct` not defined).

- [ ] **Step 3: Implement `studio-catalog.js`**

Implement realistic PBR material models matching the approved Sketchfab Battlestation aesthetic, with realistic physical scales relative to desk dimensions (3.2m x 1.6m).

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test shopboard/tests/studio-catalog.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add src/desk-builder/studio-catalog.js tests/studio-catalog.test.js
git commit -m "feat(3d): implement realistic PBR mesh generators for PC setup"
```

---

### Task 4: Implement Direct Pointer Drag, Drop, Reposition & Rotate (`studio-interaction.js`)

**Files:**
- Create: `shopboard/src/desk-builder/studio-interaction.js`
- Test: `shopboard/tests/studio-interaction.test.js`

**Interfaces:**
- Consumes: `DeskStudioScene`, `create3DProduct`
- Produces: `class DeskStudioInteraction` managing:
  - `startSpawnDrag(productId, pointerEvent)`: immediately creates 3D model attached to cursor on desk plane.
  - `handlePointerMove(pointerEvent)`: clamps coordinates to desk boundaries and adjusts elevation above mats.
  - `handlePointerUp(pointerEvent)`: finalizes placement, assigns unique `instanceId`.
  - `selectObject(instance)`: triggers selection toolbar with rotation slider (0°-360°) and delete action.
  - `deleteSelected()`: removes object from scene and updates cart.

- [ ] **Step 1: Write unit test for coordinate clamping and stacking calculation**

Write `shopboard/tests/studio-interaction.test.js` checking that x/z coordinates outside desk bounds are strictly clamped, and items overlapping desk mats receive correct elevation offset.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test shopboard/tests/studio-interaction.test.js`  
Expected: FAIL.

- [ ] **Step 3: Implement `studio-interaction.js`**

Implement Raycaster tracking against virtual desk plane, disable OrbitControls while dragging, handle pointermove/pointerup, rotation slider integration, and selection dispatching.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test shopboard/tests/studio-interaction.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add src/desk-builder/studio-interaction.js tests/studio-interaction.test.js
git commit -m "feat(3d): implement direct pointer drag, drop, repositioning and rotation"
```

---

### Task 5: Implement Studio Cart Aggregation & Bundle Checkout (`studio-cart.js`)

**Files:**
- Create: `shopboard/src/desk-builder/studio-cart.js`
- Modify: `shopboard/src/cart.js:45-65`
- Test: `shopboard/tests/studio-cart.test.js`

**Interfaces:**
- Consumes: Placed instances list from `studio-interaction.js`, `cart` from `src/cart.js`
- Produces:
  - `calculateSetupTotal(placedInstances): number`
  - `addSetupToCart(placedInstances): void` (aggregating duplicate items into quantity increments)

- [ ] **Step 1: Write unit test for setup cart aggregation**

Write `shopboard/tests/studio-cart.test.js` verifying that placing 2 monitors (id: 10) and 1 keyboard (id: 1) calls `cart.addItem` or bundle addition resulting in quantity 2 for monitors and 1 for keyboard, with total price verified.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test shopboard/tests/studio-cart.test.js`  
Expected: FAIL.

- [ ] **Step 3: Implement `addBundle` in `shopboard/src/cart.js` and `studio-cart.js`**

Support batch adding with quantity counts and instant toast/notification notification in the UI.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test shopboard/tests/studio-cart.test.js`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add src/cart.js src/desk-builder/studio-cart.js tests/studio-cart.test.js
git commit -m "feat(cart): add bundle integration and quantity aggregation for 3D setup"
```

---

### Task 6: UI Modal Integration, Navigation Entry, and End-to-End Verification

**Files:**
- Modify: `shopboard/index.html`
- Modify: `shopboard/src/main.js`
- Modify: `shopboard/src/style.css`
- Test: `shopboard/tests/desk-builder-e2e.test.js`

**Interfaces:**
- Trigger button in `header nav`: `<button id="btn-open-desk-builder">🎮 صمّم مكتبك 3D</button>`
- Accessible Semantic Dialog: `<dialog id="desk-builder-modal" aria-label="استوديو تكوين مساحة العمل 3D">`
- Overlay UI: Right floating catalog drawer, bottom selection/rotation toolbar, total counter, and close button (`Escape` support).

- [ ] **Step 1: Add HTML modal markup to `shopboard/index.html`**

Add semantic `<dialog id="desk-builder-modal">` container with proper ARIA attributes, close button, canvas container, and catalog sidebar.

- [ ] **Step 2: Add CSS styles in `shopboard/src/style.css`**

Add responsive styling following mobile-first principles (`min-width` queries only, no `!important`, backdrop blur, high-contrast dark studio styling).

- [ ] **Step 3: Wire up trigger and lazy initialization in `shopboard/src/main.js`**

Connect `#btn-open-desk-builder` to dynamically import `src/desk-builder/index.js` on first click, open dialog with `showModal()`, and pause render loop on `close`.

- [ ] **Step 4: Run end-to-end integration test / verification build**

Run: `cd shopboard && npm run build`  
Expected: Vite build succeeds with 0 errors.

- [ ] **Step 5: Commit**

```bash
cd shopboard && git add index.html src/main.js src/style.css tests/desk-builder-e2e.test.js
git commit -m "feat(ui): integrate 3D desk builder modal and navbar entry point into ShopBoard"
```
