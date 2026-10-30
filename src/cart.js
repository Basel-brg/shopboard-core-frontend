const STORAGE_KEY = 'shopboard_cart_v2'
const FREE_SHIPPING_THRESHOLD = 300

export const VALID_COUPONS = {
  SHOP20: { code: 'SHOP20', percent: 20, label: 'خصم 20%' },
  WELCOME10: { code: 'WELCOME10', percent: 10, label: 'خصم 10%' }
}

export class CartManager {
  constructor() {
    this.listeners = new Set()
    this.items = this.loadCart()
    this.appliedCoupon = null
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    } catch {
      // storage unavailable or full
    }
    this.notify()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    listener(this.getState())
    return () => this.listeners.delete(listener)
  }

  notify() {
    const state = this.getState()
    this.listeners.forEach((fn) => fn(state))
  }

  addItem(product) {
    const existing = this.items.find((item) => item.id === product.id)
    if (existing) {
      existing.quantity += 1
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        artwork: product.artwork,
        tone: product.tone,
        category: product.category,
        quantity: 1
      })
    }
    this.saveCart()
  }

  removeItem(productId) {
    this.items = this.items.filter((item) => item.id !== productId)
    if (this.items.length === 0) {
      this.appliedCoupon = null
    }
    this.saveCart()
  }

  updateQuantity(productId, delta) {
    const item = this.items.find((i) => i.id === productId)
    if (!item) return

    item.quantity += delta
    if (item.quantity <= 0) {
      this.removeItem(productId)
    } else {
      this.saveCart()
    }
  }

  applyCoupon(rawCode) {
    const normalized = rawCode.trim().toUpperCase()
    const coupon = VALID_COUPONS[normalized]
    if (!coupon) {
      return null
    }
    this.appliedCoupon = coupon
    this.notify()
    return coupon
  }

  removeCoupon() {
    this.appliedCoupon = null
    this.notify()
  }

  clear() {
    this.items = []
    this.appliedCoupon = null
    this.saveCart()
  }

  getState() {
    const count = this.items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const discountAmount = this.appliedCoupon
      ? Math.round((subtotal * this.appliedCoupon.percent) / 100)
      : 0
    const discountedSubtotal = Math.max(0, subtotal - discountAmount)
    const shipping =
      discountedSubtotal >= FREE_SHIPPING_THRESHOLD || discountedSubtotal === 0 ? 0 : 25
    const total = discountedSubtotal + shipping
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - discountedSubtotal)
    const shippingProgress = Math.min(
      100,
      Math.round((discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100)
    )

    return {
      items: [...this.items],
      count,
      subtotal,
      discountAmount,
      appliedCoupon: this.appliedCoupon,
      shipping,
      total,
      remainingForFreeShipping,
      shippingProgress
    }
  }
}

export const cart = new CartManager()
