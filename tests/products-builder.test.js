import test from 'node:test'
import assert from 'node:assert/strict'
import { PRODUCTS, CATEGORIES } from '../src/modules/products/products.api'

test('PRODUCTS contains gaming PC case and curved monitor', () => {
  const pc = PRODUCTS.find(p => p.sku === 'SB-PC-09')
  const monitor = PRODUCTS.find(p => p.sku === 'SB-MON-10')

  assert.ok(pc, 'SB-PC-09 must exist in PRODUCTS')
  assert.equal(pc.category, 'أجهزة ألعاب')
  assert.equal(pc.price, 4850)
  assert.ok(pc.specs.length > 0)

  assert.ok(monitor, 'SB-MON-10 must exist in PRODUCTS')
  assert.equal(monitor.category, 'شاشات العرض')
  assert.equal(monitor.price, 2750)
  assert.ok(monitor.specs.length > 0)

  assert.ok(CATEGORIES.includes('أجهزة ألعاب'), 'CATEGORIES must include أجهزة ألعاب')
  assert.ok(CATEGORIES.includes('شاشات العرض'), 'CATEGORIES must include شاشات العرض')
})
