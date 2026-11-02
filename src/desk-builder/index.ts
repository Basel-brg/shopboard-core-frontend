import * as THREE from 'three';
import { DeskStudioScene } from './studio-scene';
import { DeskStudioInteraction } from './studio-interaction';
import { calculateSetupTotal, addSetupToCart } from './studio-cart';
import { PRODUCTS } from '../modules/products/products.api';
import { cart } from '../modules/cart/cart.state';

let studioScene: DeskStudioScene | null = null;
let studioInteraction: DeskStudioInteraction | null = null;
let isInitialized: boolean = false;

export function initDeskBuilder(): void {
  const dialog = document.querySelector<HTMLDialogElement>('#desk-builder-modal');
  if (!dialog) return;

  const canvasContainer = dialog.querySelector<HTMLElement>('#studio-3d-canvas');
  const catalogList = dialog.querySelector<HTMLElement>('#studio-catalog-list');
  const totalBadge = dialog.querySelector<HTMLElement>('#studio-total-price');
  const addToCartBtn = dialog.querySelector<HTMLButtonElement>('#studio-add-cart-btn');
  const closeBtn = dialog.querySelector<HTMLButtonElement>('#desk-builder-close-btn');
  const clearBtn = dialog.querySelector<HTMLButtonElement>('#studio-clear-btn');

  // Selection bar elements
  const selectedBar = dialog.querySelector<HTMLElement>('#studio-selected-bar');
  const selectedName = dialog.querySelector<HTMLElement>('#studio-selected-name');
  const rotateSlider = dialog.querySelector<HTMLInputElement>('#studio-rotate-slider');
  const rotateVal = dialog.querySelector<HTMLElement>('#studio-rotate-val');
  const deleteBtn = dialog.querySelector<HTMLButtonElement>('#studio-delete-btn');

  function updateSetupDisplay(placedObjects: THREE.Group[]): void {
    const total = calculateSetupTotal(placedObjects);
    if (totalBadge) {
      totalBadge.textContent = `${total.toLocaleString('ar-SA')} ر.س`;
    }
  }

  function handleSelectionChange(selectedObj: THREE.Group | null): void {
    if (!selectedBar) return;
    if (selectedObj) {
      selectedBar.classList.add('active');
      if (selectedName) {
        selectedName.textContent = selectedObj.userData.name || 'عنصر';
      }
      const deg = Math.round(((selectedObj.rotation.y * 180) / Math.PI) % 360);
      const positiveDeg = deg >= 0 ? deg : deg + 360;
      if (rotateSlider) {
        rotateSlider.value = String(positiveDeg);
      }
      if (rotateVal) {
        rotateVal.textContent = `${positiveDeg}°`;
      }
    } else {
      selectedBar.classList.remove('active');
    }
  }

  if (!isInitialized && canvasContainer) {
    // 1. Initialize 3D Scene
    studioScene = new DeskStudioScene();
    studioScene.init(canvasContainer);

    // 2. Initialize Interaction Handler
    studioInteraction = new DeskStudioInteraction(
      studioScene,
      handleSelectionChange,
      updateSetupDisplay
    );

    // 3. Populate Catalog Drawer
    if (catalogList) {
      catalogList.innerHTML = '';
      PRODUCTS.forEach((product) => {
        const item = document.createElement('div');
        item.className = 'studio-product-card';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `إضافة ${product.name} إلى سطح المكتب`);

        item.innerHTML = `
          <div class="studio-card-icon" aria-hidden="true">${getProductIcon(product.id)}</div>
          <div class="studio-card-info">
            <span class="studio-card-title">${product.name}</span>
            <span class="studio-card-price">${product.price.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <span class="studio-drag-pill">اسحب</span>
        `;

        // Direct Pointer Drag
        item.addEventListener('pointerdown', (e: PointerEvent) => {
          e.preventDefault();
          if (studioInteraction) {
            studioInteraction.startSpawnDrag(product.id, e.clientX, e.clientY);
          }
        });

        // Keyboard Accessibility (Enter or Space places at center)
        item.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (studioInteraction) {
              studioInteraction.spawnAtCenter(product.id);
            }
          }
        });

        catalogList.appendChild(item);
      });
    }

    // 4. Hook Rotation & Delete Controls
    if (rotateSlider) {
      rotateSlider.addEventListener('input', (e: Event) => {
        const target = e.target as HTMLInputElement;
        const deg = Number(target.value);
        if (rotateVal) rotateVal.textContent = `${deg}°`;
        if (studioInteraction) studioInteraction.rotateSelected(deg);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (studioInteraction) studioInteraction.deleteSelected();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (studioInteraction) studioInteraction.clearAll();
      });
    }

    // 5. Hook Add to Cart Button
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        if (!studioInteraction) return;
        const placed = studioInteraction.getPlacedObjects();
        if (placed.length === 0) {
          addToCartBtn.textContent = '⚠️ يرجى سحب قطعة أولاً';
          setTimeout(() => {
            addToCartBtn.textContent = '🛒 إضافة التشكيلة كاملة للسلة';
          }, 2000);
          return;
        }

        addSetupToCart(placed, cart);
        dialog.close();

        // Open cart drawer and notify
        const cartToggle = document.querySelector<HTMLButtonElement>('#cart-toggle-btn');
        if (cartToggle) cartToggle.click();
      });
    }

    // 6. Close Modal Handling
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close());
    }

    dialog.addEventListener('close', () => {
      if (studioScene) studioScene.stop();
    });

    isInitialized = true;
  }

  // Open Dialog
  dialog.showModal();
  if (studioScene) {
    studioScene.start();
    setTimeout(() => {
      if (studioScene) studioScene.resize();
    }, 50);
  }
}

function getProductIcon(id: number): string {
  switch (id) {
    case 9: return '🖥️';
    case 10: return '📺';
    case 1: return '⌨️';
    case 4: return '🖱️';
    case 8: return '🪵';
    case 2: return '🎧';
    case 3: return '💡';
    case 5: return '🖋️';
    case 6: return '📐';
    case 7: return '⚡';
    default: return '📦';
  }
}
