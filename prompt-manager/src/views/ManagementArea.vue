<template>
  <v-container>
    <h1>Management Area</h1>
    <v-row v-if="!authStore.isAuthenticated">
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title>Enter PIN</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="authenticate" ref="authForm">
              <input
                type="text"
                name="username"
                autocomplete="username"
                value="pin-user"
                style="display: none;"
              />
              <v-text-field
                v-model="pin"
                label="PIN"
                type="password"
                autocomplete="current-password"
                :rules="[v => !!v || 'PIN is required']"
                @keyup.enter="authenticate"
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                :loading="authStore.loading"
                :disabled="!pin">Submit</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="6">
        <h2>{{ editingPrompt ? 'Edit Prompt' : 'Create New Prompt' }}</h2>
        <PromptForm
          :prompt="editingPrompt || {}"
          @submit="savePrompt"
          :loading="loading.save"
          ref="promptForm"
        />
      </v-col>
      <v-col cols="12" md="6">
        <h2>Existing Prompts</h2>
        <v-progress-linear v-if="loading.fetch" indeterminate></v-progress-linear>
        <v-row v-else>
          <v-col
            v-for="prompt in prompts"
            :key="prompt.id"
            cols="12"
          >
            <PromptCard
              :prompt="prompt"
              :show-actions="true"
              @edit="editPrompt"
              @delete="deletePrompt"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePromptStore } from '../store/promptStore'
import { useAuthStore } from '../store/authStore'
import PromptForm from '../components/PromptForm.vue'
import PromptCard from '../components/PromptCard.vue'

const promptStore = usePromptStore()
const authStore = useAuthStore()

const pin = ref('')
const authForm = ref(null)
const promptForm = ref(null)
const editingPrompt = ref(null)
const loading = ref({
  fetch: false,
  save: false,
  delete: false
})

const prompts = computed(() => promptStore.prompts)

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await fetchPrompts()
  }
})

watch(() => authStore.isAuthenticated, async (newValue) => {
  if (newValue) {
    await fetchPrompts()
  }
})

async function fetchPrompts() {
  loading.value.fetch = true
  try {
    await promptStore.fetchPrompts()
  } catch (error) {
    promptStore.setError('Failed to fetch prompts: ' + error.message)
  } finally {
    loading.value.fetch = false
  }
}

async function authenticate() {
  if (!pin.value) return

  try {
    await authStore.login(pin.value)
    pin.value = ''
    if (authForm.value) {
      authForm.value.reset()
    }
    promptStore.setSuccessMessage('Authentication successful')
  } catch (error) {
    promptStore.setError('Authentication failed: ' + error.message)
  }
}

async function savePrompt(promptData) {
  if (!promptForm.value || !promptForm.value.validate()) {
    return
  }

  loading.value.save = true
  try {
    if (editingPrompt.value) {
      await promptStore.updatePrompt({ ...promptData, id: editingPrompt.value.id })
    } else {
      await promptStore.addPrompt(promptData)
    }
    editingPrompt.value = null
    promptForm.value.resetForm()
  } catch (error) {
    promptStore.setError('Failed to save prompt: ' + error.message)
  } finally {
    loading.value.save = false
  }
}

function editPrompt(prompt) {
  editingPrompt.value = { ...prompt }
}

async function deletePrompt(promptId) {
  if (window.confirm('Are you sure you want to delete this prompt?')) {
    loading.value.delete = true
    try {
      await promptStore.deletePrompt(promptId)
    } catch (error) {
      promptStore.setError('Failed to delete prompt: ' + error.message)
    } finally {
      loading.value.delete = false
    }
  }
}
</script>