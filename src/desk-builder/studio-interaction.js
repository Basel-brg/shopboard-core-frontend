import * as THREE from 'three'
import { create3DProduct } from './studio-catalog.js'

export const DESK_LIMITS = {
  minX: -1.5,
  maxX: 1.5,
  minZ: -0.7,
  maxZ: 0.7,
  baseY: 1.44
}

export function clampToDesk(x, z, limits = DESK_LIMITS) {
  return {
    x: Math.max(limits.minX, Math.min(limits.maxX, x)),
    z: Math.max(limits.minZ, Math.min(limits.maxZ, z))
  }
}

export function calculateElevation(x, z, surfaces = [], baseY = DESK_LIMITS.baseY) {
  for (const s of surfaces) {
    if (s.isSurface && x >= s.minX && x <= s.maxX && z >= s.minZ && z <= s.maxZ) {
      return s.surfaceY
    }
  }
  return baseY
}

export class DeskStudioInteraction {
  constructor(studioScene, onSelectionChange = () => {}, onSetupChange = () => {}) {
    this.scene = studioScene
    this.onSelectionChange = onSelectionChange
    this.onSetupChange = onSetupChange

    this.placedObjects = []
    this.selectedObject = null
    this.activeDragObj = null
    this.isSpawningNew = false
    this.isDraggingExisting = false

    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.instanceSeq = 1

    this.initEvents()
  }

  initEvents() {
    if (!this.scene || !this.scene.container) return

    const container = this.scene.container
    container.addEventListener('contextmenu', (e) => e.preventDefault())

    // Click on canvas to select or start moving existing item
    container.addEventListener('pointerdown', (e) => {
      if (this.isSpawningNew) return

      const hit = this.getClickableIntersection(e.clientX, e.clientY)
      if (hit) {
        const targetGroup = hit.object.userData.parentGroup
        this.selectObject(targetGroup)
        this.isDraggingExisting = true
        this.activeDragObj = targetGroup
        this.scene.setControlsEnabled(false)
      } else {
        // Clicked empty space
        this.selectObject(null)
      }
    })

    window.addEventListener('pointermove', (e) => {
      if ((this.isSpawningNew || this.isDraggingExisting) && this.activeDragObj) {
        this.handlePointerMove(e.clientX, e.clientY)
      }
    })

    window.addEventListener('pointerup', () => {
      if (this.isSpawningNew || this.isDraggingExisting) {
        this.handlePointerUp()
      }
    })
  }

  getDeskIntersection(clientX, clientY) {
    if (!this.scene || !this.scene.container || !this.scene.virtualDeskPlane) return null

    const rect = this.scene.container.getBoundingClientRect()
    this.mouse.x = ((clientX - rect.left) / this.scene.container.clientWidth) * 2 - 1
    this.mouse.y = -((clientY - rect.top) / this.scene.container.clientHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.scene.camera)
    const hits = this.raycaster.intersectObject(this.scene.virtualDeskPlane)
    return hits.length > 0 ? hits[0] : null
  }

  getClickableIntersection(clientX, clientY) {
    if (!this.scene || !this.scene.container || !this.scene.camera) return null

    const rect = this.scene.container.getBoundingClientRect()
    this.mouse.x = ((clientX - rect.left) / this.scene.container.clientWidth) * 2 - 1
    this.mouse.y = -((clientY - rect.top) / this.scene.container.clientHeight) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.scene.camera)

    const clickableMeshes = []
    this.placedObjects.forEach((group) => {
      group.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentGroup = group
          clickableMeshes.push(child)
        }
      })
    })

    const hits = this.raycaster.intersectObjects(clickableMeshes)
    return hits.length > 0 ? hits[0] : null
  }

  startSpawnDrag(productId, clientX, clientY) {
    this.scene.setControlsEnabled(false)
    this.isSpawningNew = true

    // Create 3D model immediately
    this.activeDragObj = create3DProduct(productId, false)
    if (!this.activeDragObj) return

    this.activeDragObj.userData.instanceId = 'inst_' + this.instanceSeq++
    this.scene.scene.add(this.activeDragObj)

    this.handlePointerMove(clientX, clientY)
  }

  handlePointerMove(clientX, clientY) {
    if (!this.activeDragObj) return

    const hit = this.getDeskIntersection(clientX, clientY)
    if (hit) {
      const clamped = clampToDesk(hit.point.x, hit.point.z)
      const surfaces = this.getSurfaces()
      const y = calculateElevation(clamped.x, clamped.z, surfaces)
      this.activeDragObj.position.set(clamped.x, y, clamped.z)
    }
  }

  handlePointerUp() {
    if (this.isSpawningNew && this.activeDragObj) {
      this.placedObjects.push(this.activeDragObj)
      this.selectObject(this.activeDragObj)
      this.onSetupChange(this.placedObjects)
    } else if (this.isDraggingExisting && this.activeDragObj) {
      this.onSetupChange(this.placedObjects)
    }

    this.isSpawningNew = false
    this.isDraggingExisting = false
    this.activeDragObj = null
    this.scene.setControlsEnabled(true)
  }

  getSurfaces() {
    const surfaces = []
    for (const obj of this.placedObjects) {
      if (obj.userData.isSurface) {
        surfaces.push({
          isSurface: true,
          minX: obj.position.x - 0.9,
          maxX: obj.position.x + 0.9,
          minZ: obj.position.z - 0.4,
          maxZ: obj.position.z + 0.4,
          surfaceY: DESK_LIMITS.baseY + 0.015
        })
      }
    }
    return surfaces
  }

  selectObject(group) {
    this.selectedObject = group
    this.onSelectionChange(this.selectedObject)
  }

  rotateSelected(degrees) {
    if (!this.selectedObject) return
    const rad = (degrees * Math.PI) / 180
    this.selectedObject.rotation.y = rad
  }

  deleteSelected() {
    if (!this.selectedObject) return
    this.scene.scene.remove(this.selectedObject)
    const idx = this.placedObjects.indexOf(this.selectedObject)
    if (idx > -1) {
      this.placedObjects.splice(idx, 1)
      this.onSetupChange(this.placedObjects)
    }
    this.selectObject(null)
  }

  getPlacedObjects() {
    return this.placedObjects
  }

  clearAll() {
    for (const obj of this.placedObjects) {
      this.scene.scene.remove(obj)
    }
    this.placedObjects = []
    this.selectObject(null)
    this.onSetupChange(this.placedObjects)
  }
}
