<template>
  <div>
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      :color="notification.type"
      :timeout="notification.timeout"
      v-model="notification.show"
    >
      {{ notification.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="closeNotification(notification)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { usePromptStore } from '../store/promptStore'
import { storeToRefs } from 'pinia'

const store = usePromptStore()
const { notifications } = storeToRefs(store)

function closeNotification(notification) {
  store.removeNotification(notification)
}
</script>