import { defineStore } from 'pinia'

export const usePromptStore = defineStore('prompt', {
  state: () => ({
    prompts: [],
    notifications: []
  }),
  actions: {
    addPrompt(prompt) {
      this.prompts.push(prompt)
      this.addNotification({ type: 'success', message: 'Prompt added successfully' })
    },
    removePrompt(id) {
      this.prompts = this.prompts.filter(p => p.id !== id)
      this.addNotification({ type: 'success', message: 'Prompt removed successfully' })
    },
    updatePrompt(id, updatedPrompt) {
      const index = this.prompts.findIndex(p => p.id === id)
      if (index !== -1) {
        this.prompts[index] = { ...this.prompts[index], ...updatedPrompt }
        this.addNotification({ type: 'success', message: 'Prompt updated successfully' })
      } else {
        this.addNotification({ type: 'error', message: 'Prompt not found' })
      }
    },
    addNotification(notification) {
      this.notifications.push(notification)
      // Remove the notification after 3 seconds
      setTimeout(() => {
        this.removeNotification(notification)
      }, 3000)
    },
    removeNotification(notification) {
      const index = this.notifications.indexOf(notification)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    }
  },
  getters: {
    getPromptById: (state) => (id) => {
      return state.prompts.find(p => p.id === id)
    }
  }
})