import test from 'node:test'
import assert from 'node:assert/strict'
import { DeskStudioScene } from '../src/desk-builder/studio-scene.js'

test('DeskStudioScene exposes required lifecycle and scene methods', () => {
  assert.equal(typeof DeskStudioScene, 'function')
  
  const studio = new DeskStudioScene()
  assert.equal(typeof studio.init, 'function')
  assert.equal(typeof studio.start, 'function')
  assert.equal(typeof studio.stop, 'function')
  assert.equal(typeof studio.resize, 'function')
  assert.equal(typeof studio.getDeskTopMesh, 'function')
  assert.equal(typeof studio.setControlsEnabled, 'function')
})
