import { DeskStudioScene } from './studio-scene.js'
import { DeskStudioInteraction } from './studio-interaction.js'
import { calculateSetupTotal, addSetupToCart } from './studio-cart.js'
import { PRODUCTS } from '../products.js'
import { cart } from '../cart.js'

let studioScene = null
let studioInteraction = null
let isInitialized = false

export function initDeskBuilder() {
  const dialog = document.querySelector('#desk-builder-modal')
  if (!dialog) return

  const canvasContainer = dialog.querySelector('#studio-3d-canvas')
  const catalogList = dialog.querySelector('#studio-catalog-list')
  const totalBadge = dialog.querySelector('#studio-total-price')
  const addToCartBtn = dialog.querySelector('#studio-add-cart-btn')
  const closeBtn = dialog.querySelector('#desk-builder-close-btn')
  const clearBtn = dialog.querySelector('#studio-clear-btn')

  // Selection bar elements
  const selectedBar = dialog.querySelector('#studio-selected-bar')
  const selectedName = dialog.querySelector('#studio-selected-name')
  const rotateSlider = dialog.querySelector('#studio-rotate-slider')
  const rotateVal = dialog.querySelector('#studio-rotate-val')
  const deleteBtn = dialog.querySelector('#studio-delete-btn')

  function updateSetupDisplay(placedObjects) {
    const total = calculateSetupTotal(placedObjects)
    if (totalBadge) {
      totalBadge.textContent = `${total.toLocaleString('ar-SA')} ر.س`
    }
  }

  function handleSelectionChange(selectedObj) {
    if (!selectedBar) return
    if (selectedObj) {
      selectedBar.classList.add('active')
      selectedName.textContent = selectedObj.userData.name || 'عنصر'
      const deg = Math.round(((selectedObj.rotation.y * 180) / Math.PI) % 360)
      const positiveDeg = deg >= 0 ? deg : deg + 360
      rotateSlider.value = positiveDeg
      rotateVal.textContent = `${positiveDeg}°`
    } else {
      selectedBar.classList.remove('active')
    }
  }

  if (!isInitialized) {
    // 1. Initialize 3D Scene
    studioScene = new DeskStudioScene()
    studioScene.init(canvasContainer)

    // 2. Initialize Interaction Handler
    studioInteraction = new DeskStudioInteraction(
      studioScene,
      handleSelectionChange,
      updateSetupDisplay
    )

    // 3. Populate Catalog Drawer
    if (catalogList) {
      catalogList.innerHTML = ''
      PRODUCTS.forEach((product) => {
        const item = document.createElement('div')
        item.className = 'studio-product-card'
        item.setAttribute('role', 'button')
        item.setAttribute('tabindex', '0')
        item.setAttribute('aria-label', `إضافة ${product.name} إلى سطح المكتب`)

        item.innerHTML = `
          <div class="studio-card-icon" aria-hidden="true">${getProductIcon(product.id)}</div>
          <div class="studio-card-info">
            <span class="studio-card-title">${product.name}</span>
            <span class="studio-card-price">${product.price.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <span class="studio-drag-pill">اسحب</span>
        `

        // Direct Pointer Drag
        item.addEventListener('pointerdown', (e) => {
          e.preventDefault()
          studioInteraction.startSpawnDrag(product.id, e.clientX, e.clientY)
        })

        // Keyboard Accessibility (Enter or Space places at center)
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            studioInteraction.spawnAtCenter(product.id)
          }
        })

        catalogList.appendChild(item)
      })
    }

    // 4. Hook Rotation & Delete Controls
    if (rotateSlider) {
      rotateSlider.addEventListener('input', (e) => {
        const deg = Number(e.target.value)
        rotateVal.textContent = `${deg}°`
        studioInteraction.rotateSelected(deg)
      })
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        studioInteraction.deleteSelected()
      })
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        studioInteraction.clearAll()
      })
    }

    // 5. Hook Add to Cart Button
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        const placed = studioInteraction.getPlacedObjects()
        if (placed.length === 0) {
          addToCartBtn.textContent = '⚠️ يرجى سحب قطعة أولاً'
          setTimeout(() => {
            addToCartBtn.textContent = '🛒 إضافة التشكيلة كاملة للسلة'
          }, 2000)
          return
        }

        const summary = addSetupToCart(placed, cart)
        dialog.close()

        // Open cart drawer and notify
        const cartToggle = document.querySelector('#cart-toggle-btn')
        if (cartToggle) cartToggle.click()
      })
    }

    // 6. Close Modal Handling
    if (closeBtn) {
      closeBtn.addEventListener('click', () => dialog.close())
    }

    dialog.addEventListener('close', () => {
      studioScene.stop()
    })

    isInitialized = true
  }

  // Open Dialog
  dialog.showModal()
  studioScene.start()
  setTimeout(() => studioScene.resize(), 50)
}

function getProductIcon(id) {
  switch (id) {
    case 9: return '🖥️'
    case 10: return '📺'
    case 1: return '⌨️'
    case 4: return '🖱️'
    case 8: return '🪵'
    case 2: return '🎧'
    case 3: return '💡'
    case 5: return '🖋️'
    case 6: return '📐'
    case 7: return '⚡'
    default: return '📦'
  }
}
