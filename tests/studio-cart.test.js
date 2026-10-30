import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateSetupTotal, addSetupToCart } from '../src/desk-builder/studio-cart.js'

test('calculateSetupTotal and addSetupToCart aggregate duplicate items and add to cart', () => {
  const dummyInstances = [
    { userData: { productId: 10, price: 2750 } }, // Monitor 1
    { userData: { productId: 10, price: 2750 } }, // Monitor 2
    { userData: { productId: 1, price: 310 } }    // Keyboard
  ]

  // Total check
  const total = calculateSetupTotal(dummyInstances)
  assert.equal(total, 2750 + 2750 + 310)

  // Mock cart
  const cartItems = []
  const mockCart = {
    addItem(product) {
      const existing = cartItems.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        cartItems.push({ id: product.id, name: product.name, price: product.price, quantity: 1 })
      }
    }
  }

  const result = addSetupToCart(dummyInstances, mockCart)
  assert.equal(result.totalItems, 3)
  assert.equal(result.uniqueProducts, 2)

  const monitorInCart = cartItems.find(i => i.id === 10)
  assert.ok(monitorInCart)
  assert.equal(monitorInCart.quantity, 2)

  const kbInCart = cartItems.find(i => i.id === 1)
  assert.ok(kbInCart)
  assert.equal(kbInCart.quantity, 1)
})
