import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class DeskStudioScene {
  constructor() {
    this.container = null
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.deskTopMesh = null
    this.virtualDeskPlane = null
    this.animId = null
    this.isRunning = false
  }

  init(containerElement) {
    this.container = containerElement
    if (!this.container) return

    // Scene setup with subtle fog
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x0e1015)
    this.scene.fog = new THREE.FogExp2(0x0e1015, 0.04)

    const width = this.container.clientWidth || 800
    const height = this.container.clientHeight || 600

    // Perspective Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    this.camera.position.set(0, 3.4, 4.6)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15

    this.container.appendChild(this.renderer.domElement)

    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05 // prevent going under floor
    this.controls.minDistance = 2.0
    this.controls.maxDistance = 8.0
    this.controls.target.set(0, 1.25, 0)

    // Lighting
    this.setupLighting()

    // Environment & Desk
    this.setupRoomAndDesk()

    // Resize handler
    this._onResize = () => this.resize()
    window.addEventListener('resize', this._onResize)
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.9)
    dirLight.position.set(4, 7, 5)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.bias = -0.0005
    this.scene.add(dirLight)
  }

  setupRoomAndDesk() {
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.85 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    this.scene.add(floor)

    // Wall
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 15),
      new THREE.MeshStandardMaterial({ color: 0x1a1c23, roughness: 0.9 })
    )
    wall.position.set(0, 7.5, -3)
    wall.receiveShadow = true
    this.scene.add(wall)

    // Desk Group
    const deskGroup = new THREE.Group()
    this.scene.add(deskGroup)

    // Desk Top (Walnut wood, 3.2m x 1.6m)
    const deskGeo = new THREE.BoxGeometry(3.2, 0.08, 1.6)
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x3d2516, roughness: 0.35, metalness: 0.1 })
    this.deskTopMesh = new THREE.Mesh(deskGeo, deskMat)
    this.deskTopMesh.position.set(0, 1.4, 0)
    this.deskTopMesh.castShadow = true
    this.deskTopMesh.receiveShadow = true
    deskGroup.add(this.deskTopMesh)

    // Invisible Raycasting Plane for direct drag
    const deskPlaneGeo = new THREE.PlaneGeometry(3.4, 1.8)
    const deskPlaneMat = new THREE.MeshBasicMaterial({ visible: false })
    this.virtualDeskPlane = new THREE.Mesh(deskPlaneGeo, deskPlaneMat)
    this.virtualDeskPlane.rotation.x = -Math.PI / 2
    this.virtualDeskPlane.position.set(0, 1.44, 0)
    this.scene.add(this.virtualDeskPlane)

    // Desk Legs
    const legGeo = new THREE.BoxGeometry(0.08, 1.4, 1.4)
    const legMat = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.4, metalness: 0.8 })
    
    const leftLeg = new THREE.Mesh(legGeo, legMat)
    leftLeg.position.set(-1.45, 0.7, 0)
    leftLeg.castShadow = true
    deskGroup.add(leftLeg)

    const rightLeg = new THREE.Mesh(legGeo, legMat)
    rightLeg.position.set(1.45, 0.7, 0)
    rightLeg.castShadow = true
    deskGroup.add(rightLeg)
  }

  start() {
    if (this.isRunning) return
    this.isRunning = true

    const loop = () => {
      if (!this.isRunning) return
      this.animId = requestAnimationFrame(loop)
      if (this.controls) this.controls.update()
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    }
    loop()
  }

  stop() {
    this.isRunning = false
    if (this.animId) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
  }

  resize() {
    if (!this.container || !this.renderer || !this.camera) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  getDeskTopMesh() {
    return this.deskTopMesh
  }

  getVirtualDeskPlane() {
    return this.virtualDeskPlane
  }

  setControlsEnabled(enabled) {
    if (this.controls) {
      this.controls.enabled = enabled
    }
  }

  dispose() {
    this.stop()
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
    }
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
