<template>
  <div>
    <v-form @submit.prevent="submitForm" ref="form">
      <v-text-field
        v-model="promptData.title"
        label="Title"
        :rules="titleRules"
        required
      ></v-text-field>
      <v-textarea
        v-model="promptData.content"
        label="Content"
        :rules="contentRules"
        required
      ></v-textarea>
      <v-combobox
        v-model="promptData.tags"
        label="Tags"
        multiple
        chips
        small-chips
        deletable-chips
        :rules="tagRules"
        @change="validateTags"
      ></v-combobox>
      <v-btn 
        type="submit" 
        color="primary" 
        :disabled="props.loading || !isFormValid"
        :loading="props.loading"
      >
        {{ isEditing ? 'Update' : 'Create' }} Prompt
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  prompt: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      tags: []
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit'])

const promptData = ref({ ...props.prompt })
const isEditing = ref(false)
const form = ref(null)

const titleRules = [v => !!v || 'Title is required']
const contentRules = [v => !!v || 'Content is required']
const tagRules = [
  v => (Array.isArray(v) && v.every(tag => tag.trim() !== '')) || 'Empty tags are not allowed'
]

const isTagsValid = computed(() => {
  return Array.isArray(promptData.value.tags) && 
         promptData.value.tags.length > 0 && 
         promptData.value.tags.every(tag => tag.trim() !== '')
})

const isFormValid = computed(() => {
  return !!promptData.value.title && 
         !!promptData.value.content && 
         isTagsValid.value
})

watch(() => props.prompt, (newPrompt) => {
  promptData.value = { 
    ...newPrompt,
    tags: Array.isArray(newPrompt.tags) ? [...newPrompt.tags] : []
  }
  isEditing.value = !!newPrompt.id
}, { deep: true })

function validateTags() {
  promptData.value.tags = promptData.value.tags.filter(tag => tag.trim() !== '')
}

function resetForm() {
  promptData.value = {
    title: '',
    content: '',
    tags: []
  }
  if (form.value) {
    form.value.reset()
  }
}

function submitForm() {
  if (form.value.validate() && isTagsValid.value) {
    emit('submit', { ...promptData.value })
    if (!isEditing.value) {
      resetForm()
    }
  }
}

function validate() {
  return form.value ? form.value.validate() && isTagsValid.value : false
}

// Expose these functions to the parent component
defineExpose({
  resetForm,
  validate
})
</script>

<style scoped>
.v-alert {
  margin-top: 10px;
}
</style>