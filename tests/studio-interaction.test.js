import test from 'node:test'
import assert from 'node:assert/strict'
import { clampToDesk, calculateElevation } from '../src/desk-builder/studio-interaction.js'

test('clampToDesk strictly constrains coordinates within desk surface boundaries', () => {
  // Extreme values outside desk top
  const clampedFarRight = clampToDesk(2.5, 0.2)
  assert.equal(clampedFarRight.x, 1.5)
  assert.equal(clampedFarRight.z, 0.2)

  const clampedFarLeft = clampToDesk(-3.0, -1.2)
  assert.equal(clampedFarLeft.x, -1.5)
  assert.equal(clampedFarLeft.z, -0.7)

  // Within boundaries
  const normal = clampToDesk(0.3, -0.1)
  assert.equal(normal.x, 0.3)
  assert.equal(normal.z, -0.1)
})

test('calculateElevation adds height offset when placed above desk surfaces', () => {
  const surfaces = [
    {
      isSurface: true,
      minX: -0.9,
      maxX: 0.9,
      minZ: -0.4,
      maxZ: 0.4,
      surfaceY: 1.44 + 0.015
    }
  ]

  // Placed over mat
  const yOverMat = calculateElevation(0.0, 0.0, surfaces, 1.44)
  assert.equal(yOverMat, 1.44 + 0.015)

  // Placed outside mat on bare wood
  const yBareWood = calculateElevation(1.2, 0.0, surfaces, 1.44)
  assert.equal(yBareWood, 1.44)
})
