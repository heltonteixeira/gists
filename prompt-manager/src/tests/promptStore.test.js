import { setActivePinia, createPinia } from 'pinia'
import { usePromptStore } from '../store/promptStore'
import { describe, beforeEach, it, expect, vi } from 'vitest'

describe('promptStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mock('lodash/debounce', () => ({
      default: vi.fn((fn) => fn),
    }))
  })

  it('adds a prompt', async () => {
    const store = usePromptStore()
    const prompt = { title: 'Test Prompt', content: 'Test Content', tags: ['test'] }
    await store.addPrompt(prompt)
    expect(store.prompts.length).toBe(1)
    expect(store.prompts[0].title).toBe('Test Prompt')
  })

  it('updates a prompt', async () => {
    const store = usePromptStore()
    const prompt = { title: 'Test Prompt', content: 'Test Content', tags: ['test'] }
    await store.addPrompt(prompt)
    const updatedPrompt = { ...store.prompts[0], title: 'Updated Prompt' }
    await store.updatePrompt(updatedPrompt)
    expect(store.prompts[0].title).toBe('Updated Prompt')
  })

  it('deletes a prompt', async () => {
    const store = usePromptStore()
    const prompt = { title: 'Test Prompt', content: 'Test Content', tags: ['test'] }
    await store.addPrompt(prompt)
    const promptId = store.prompts[0].id
    await store.deletePrompt(promptId)
    expect(store.prompts.length).toBe(0)
  })

  it('filters prompts', () => {
    const store = usePromptStore()
    store.prompts = [
      { id: '1', title: 'Test Prompt 1', content: 'Content 1', tags: ['test'] },
      { id: '2', title: 'Test Prompt 2', content: 'Content 2', tags: ['example'] },
      { id: '3', title: 'Another Prompt', content: 'Content 3', tags: ['test', 'example'] }
    ]
    store.setSearchQuery('test')
    expect(store.filteredPrompts.length).toBe(2)
  })

  it('paginates prompts', () => {
    const store = usePromptStore()
    store.prompts = Array.from({ length: 25 }, (_, i) => ({ 
      id: `${i + 1}`, 
      title: `Prompt ${i + 1}`, 
      content: `Content ${i + 1}`, 
      tags: ['test'] 
    }))
    store.setItemsPerPage(10)
    store.setCurrentPage(2)
    expect(store.paginatedPrompts.length).toBe(10)
    expect(store.paginatedPrompts[0].title).toBe('Prompt 11')
  })

  it('calculates total pages', () => {
    const store = usePromptStore()
    store.prompts = Array.from({ length: 25 }, (_, i) => ({ 
      id: `${i + 1}`, 
      title: `Prompt ${i + 1}`, 
      content: `Content ${i + 1}`, 
      tags: ['test'] 
    }))
    store.setItemsPerPage(10)
    expect(store.totalPages).toBe(3)
  })
})