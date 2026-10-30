import test from 'node:test'
import assert from 'node:assert/strict'
import { DeskStudioScene } from '../src/desk-builder/studio-scene.js'
import { DeskStudioInteraction } from '../src/desk-builder/studio-interaction.js'
import { addSetupToCart, calculateSetupTotal } from '../src/desk-builder/studio-cart.js'

test('End-to-End: full 3D desk setup workflow with multi-instance cart addition', () => {
  // 1. Initialize scene structure
  const scene = new DeskStudioScene()
  assert.ok(scene)

  // 2. Interaction manager
  let lastPlaced = []
  const interaction = new DeskStudioInteraction(
    scene,
    () => {},
    (placed) => { lastPlaced = placed }
  )

  // 3. Spawn PC Case (id: 9)
  const pc = { userData: { productId: 9, price: 4850, name: 'صندوق حاسب ألعاب Aorus' }, rotation: { y: 0 } }
  interaction.placedObjects.push(pc)

  // 4. Spawn First Curved Monitor (id: 10)
  const mon1 = { userData: { productId: 10, price: 2750, name: 'شاشة ألعاب منحنية' }, rotation: { y: 0 } }
  interaction.placedObjects.push(mon1)

  // 5. Spawn Second Curved Monitor (id: 10) - Dual Monitor Setup
  const mon2 = { userData: { productId: 10, price: 2750, name: 'شاشة ألعاب منحنية' }, rotation: { y: 0 } }
  interaction.placedObjects.push(mon2)

  // 6. Rotate Mon1
  interaction.selectedObject = mon1
  interaction.rotateSelected(45)
  assert.equal(mon1.rotation.y, (45 * Math.PI) / 180)

  // 7. Verify Total Price Calculation
  const total = calculateSetupTotal(interaction.placedObjects)
  assert.equal(total, 4850 + 2750 + 2750)

  // 8. Add entire setup to shopping cart
  const cartItems = []
  const mockCart = {
    addItem(product) {
      const existing = cartItems.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        })
      }
    }
  }

  const result = addSetupToCart(interaction.placedObjects, mockCart)
  assert.equal(result.totalItems, 3)
  assert.equal(result.uniqueProducts, 2)
  assert.equal(result.totalAmount, 10350)

  const monitorEntry = cartItems.find((i) => i.id === 10)
  assert.ok(monitorEntry)
  assert.equal(monitorEntry.quantity, 2)

  const pcEntry = cartItems.find((i) => i.id === 9)
  assert.ok(pcEntry)
  assert.equal(pcEntry.quantity, 1)
})
