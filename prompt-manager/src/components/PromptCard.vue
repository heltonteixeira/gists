<template>
  <v-card class="mb-4">
    <v-card-title>{{ prompt.title }}</v-card-title>
    <v-card-text>
      <p>{{ prompt.content }}</p>
      <v-chip-group>
        <v-chip v-for="tag in prompt.tags" :key="tag" small>
          {{ tag }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
    <v-card-actions v-if="showActions">
      <v-btn color="primary" @click="$emit('edit', prompt)">Edit</v-btn>
      <v-btn color="error" @click="$emit('delete', prompt.id)">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  prompt: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit', 'delete'])
</script>