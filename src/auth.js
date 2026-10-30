const STORAGE_KEY = 'shopboard_user_v1'

export class AuthManager {
  constructor() {
    this.listeners = new Set()
    this.currentUser = this.loadUser()
  }

  loadUser() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }

  saveUser(user) {
    this.currentUser = user
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // storage unavailable
    }
    this.notify()
  }

  subscribe(listener) {
    this.listeners.add(listener)
    listener(this.currentUser)
    return () => this.listeners.delete(listener)
  }

  notify() {
    this.listeners.forEach((fn) => fn(this.currentUser))
  }

  login(email, password, remember = true) {
    // Demo login logic with persistence
    const user = {
      name: email.split('@')[0],
      email: email,
      token: 'demo_token_' + Date.now()
    }
    if (remember) {
      this.saveUser(user)
    } else {
      this.currentUser = user
      this.notify()
    }
    return user
  }

  register({ name, email, phone }) {
    const user = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      token: 'demo_token_' + Date.now()
    }
    this.saveUser(user)
    return user
  }

  logout() {
    this.saveUser(null)
  }

  getUser() {
    return this.currentUser
  }

  isLoggedIn() {
    return Boolean(this.currentUser)
  }
}

export const auth = new AuthManager()
