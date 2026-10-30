import { PRODUCTS } from '../products.js'

export function calculateSetupTotal(placedInstances = []) {
  return placedInstances.reduce((sum, inst) => sum + (inst.userData?.price || 0), 0)
}

export function addSetupToCart(placedInstances = [], cartManager) {
  if (!placedInstances.length || !cartManager) {
    return { totalItems: 0, uniqueProducts: 0, totalAmount: 0 }
  }

  // Count instances per productId
  const counts = new Map()
  for (const inst of placedInstances) {
    const pId = inst.userData?.productId
    if (pId) {
      counts.set(pId, (counts.get(pId) || 0) + 1)
    }
  }

  let totalItems = 0
  let totalAmount = 0

  for (const [productId, quantity] of counts.entries()) {
    const product = PRODUCTS.find((p) => p.id === productId)
    if (product) {
      for (let i = 0; i < quantity; i++) {
        cartManager.addItem(product)
      }
      totalItems += quantity
      totalAmount += product.price * quantity
    }
  }

  return {
    totalItems,
    uniqueProducts: counts.size,
    totalAmount
  }
}
