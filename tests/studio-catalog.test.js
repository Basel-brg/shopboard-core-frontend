import test from 'node:test'
import assert from 'node:assert/strict'
import { create3DProduct } from '../src/desk-builder/studio-catalog.js'

test('create3DProduct creates valid 3D groups for catalog products', () => {
  // Test Gaming PC Case (id: 9)
  const pcGroup = create3DProduct(9)
  assert.ok(pcGroup, 'pcGroup must be created')
  assert.equal(pcGroup.userData.productId, 9)
  assert.equal(pcGroup.userData.type, 'pc')
  assert.equal(pcGroup.userData.price, 4850)
  assert.ok(pcGroup.children.length > 0)

  // Test Curved Monitor (id: 10)
  const monitorGroup = create3DProduct(10)
  assert.ok(monitorGroup, 'monitorGroup must be created')
  assert.equal(monitorGroup.userData.productId, 10)
  assert.equal(monitorGroup.userData.type, 'monitor')
  assert.equal(monitorGroup.userData.price, 2750)

  // Test Keyboard (id: 1)
  const kbGroup = create3DProduct(1)
  assert.ok(kbGroup, 'kbGroup must be created')
  assert.equal(kbGroup.userData.productId, 1)

  // Test Desk Mat (id: 8) has isSurface: true for stacking
  const matGroup = create3DProduct(8)
  assert.ok(matGroup, 'matGroup must be created')
  assert.equal(matGroup.userData.isSurface, true)
})
