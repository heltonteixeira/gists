import { defineStore } from 'pinia'

// Custom storage object
const storage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch {
      // Ignore errors
    }
  }
}

export const usePromptStore = defineStore('prompt', {
  state: () => ({
    prompts: JSON.parse(storage.getItem('prompts') || '[]'),
    loading: false,
    error: null,
    successMessage: null,
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: '',
    isLoading: false,
    notifications: []
  }),
  actions: {
    setLoading(status) {
      this.loading = status
    },
    setError(error) {
      this.error = error
      this.addNotification({ type: 'error', message: error, timeout: 5000 })
    },
    setSuccessMessage(message) {
      this.successMessage = message
      this.addNotification({ type: 'success', message, timeout: 3000 })
    },
    clearMessages() {
      this.error = null
      this.successMessage = null
    },
    setCurrentPage(page) {
      this.currentPage = page
    },
    setItemsPerPage(items) {
      this.itemsPerPage = items
    },
    setSearchQuery(query) {
      this.searchQuery = query
    },
    addNotification(notification) {
      this.notifications.push({
        ...notification,
        id: Date.now(),
        show: true
      })
    },
    removeNotification(notification) {
      const index = this.notifications.findIndex(n => n.id === notification.id)
      if (index !== -1) {
        this.notifications.splice(index, 1)
      }
    },
    async fetchPrompts() {
      this.isLoading = true
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 500))
        this.prompts = JSON.parse(storage.getItem('prompts') || '[]')
      } catch (error) {
        this.setError('Failed to fetch prompts: ' + error.message)
      } finally {
        this.isLoading = false
      }
    },
    async addPrompt(prompt) {
      this.clearMessages()
      this.setLoading(true)
      try {
        const newPrompt = {
          ...prompt,
          id: Date.now().toString()
        }
        this.prompts.push(newPrompt)
        await this.saveToStorage()
        this.setSuccessMessage('Prompt added successfully')
      } catch (error) {
        this.setError('Failed to add prompt: ' + error.message)
      } finally {
        this.setLoading(false)
      }
    },
    async updatePrompt(updatedPrompt) {
      this.clearMessages()
      this.setLoading(true)
      try {
        const index = this.prompts.findIndex(p => p.id === updatedPrompt.id)
        if (index !== -1) {
          this.prompts[index] = updatedPrompt
          await this.saveToStorage()
          this.setSuccessMessage('Prompt updated successfully')
        } else {
          throw new Error('Prompt not found')
        }
      } catch (error) {
        this.setError('Failed to update prompt: ' + error.message)
      } finally {
        this.setLoading(false)
      }
    },
    async deletePrompt(promptId) {
      this.clearMessages()
      this.setLoading(true)
      try {
        this.prompts = this.prompts.filter(p => p.id !== promptId)
        await this.saveToStorage()
        this.setSuccessMessage('Prompt deleted successfully')
      } catch (error) {
        this.setError('Failed to delete prompt: ' + error.message)
      } finally {
        this.setLoading(false)
      }
    },
    async saveToStorage() {
      storage.setItem('prompts', JSON.stringify(this.prompts))
    }
  },
  getters: {
    getPromptById: (state) => (id) => {
      return state.prompts.find(p => p.id === id)
    },
    filteredPrompts: (state) => {
      if (!state.searchQuery) return state.prompts || []
      const searchLower = state.searchQuery.toLowerCase()
      return (state.prompts || []).filter(prompt =>
        (prompt.title?.toLowerCase().includes(searchLower) ?? false) ||
        (prompt.content?.toLowerCase().includes(searchLower) ?? false) ||
        (prompt.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ?? false)
      )
    },
    paginatedPrompts: (state) => {
      const filtered = state.filteredPrompts
      const start = (state.currentPage - 1) * state.itemsPerPage
      const end = start + state.itemsPerPage
      return filtered.slice(start, end)
    },
    totalPages: (state) => {
      return Math.ceil((state.filteredPrompts || []).length / state.itemsPerPage)
    }
  }
})