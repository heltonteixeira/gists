import { defineStore } from 'pinia'

const SECRET_PIN = '1234' // In a real app, this should be stored securely on the server

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    login(pin) {
      if (pin === SECRET_PIN) {
        const token = Math.random().toString(36).substr(2) // Generate a random token
        this.token = token
        localStorage.setItem('auth_token', token)
        return true
      }
      return false
    },
    logout() {
      this.token = null
      localStorage.removeItem('auth_token')
    },
    checkAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        return true
      }
      return false
    },
  },
})