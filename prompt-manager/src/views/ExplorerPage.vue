<template>
  <v-container>
    <h1>Explorer Page</h1>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="Search prompts"
          prepend-icon="mdi-magnify"
          @input="debouncedSearch"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-else-if="filteredPrompts.length === 0">
      <v-col cols="12">
        <p>No prompts found. Try adding some in the Management Area.</p>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col
        v-for="prompt in paginatedPrompts"
        :key="prompt.id"
        cols="12"
        sm="6"
        md="4"
      >
        <PromptCard :prompt="prompt" />
      </v-col>
    </v-row>
    <v-row v-if="totalPages > 1">
      <v-col cols="12" class="text-center">
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="setCurrentPage"
        ></v-pagination>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onErrorCaptured, onMounted } from 'vue'
import { usePromptStore } from '../store/promptStore'
import PromptCard from '../components/PromptCard.vue'
import debounce from 'lodash/debounce'

const promptStore = usePromptStore()
const search = ref('')
const isLoading = ref(true)
const currentPage = ref(1)

const filteredPrompts = computed(() => promptStore.filteredPrompts || [])

const paginatedPrompts = computed(() => {
  const start = (currentPage.value - 1) * promptStore.itemsPerPage
  const end = start + promptStore.itemsPerPage
  return filteredPrompts.value.slice(start, end)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPrompts.value.length / promptStore.itemsPerPage)))

const debouncedSearch = debounce(() => {
  promptStore.setSearchQuery(search.value)
}, 300)

const setCurrentPage = (page) => {
  currentPage.value = page
}

watch(() => promptStore.isLoading, (newValue) => {
  isLoading.value = newValue
})

onMounted(() => {
  // Simulate fetching prompts
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})

onErrorCaptured((error, instance, info) => {
  console.error('Captured error in ExplorerPage:', error, instance, info)
  // You could also show an error message to the user here
  return false // Don't propagate the error
})
</script>