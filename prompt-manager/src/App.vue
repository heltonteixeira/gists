<script setup>
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted, watch, onErrorCaptured } from 'vue'
import { useAuthStore } from './store/authStore'
import NotificationSnackbar from './components/NotificationSnackbar.vue'

const router = useRouter()
const authStore = useAuthStore()
const theme = ref(localStorage.getItem('theme') || 'light')
const isRouterReady = ref(false)

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function logout() {
  authStore.logout()
  router.push('/')
}

onMounted(() => {
  authStore.checkAuth()
  // Set router as ready after a short delay to ensure it's fully initialized
  setTimeout(() => {
    isRouterReady.value = true
  }, 100)
})

watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)
})

onErrorCaptured((error, instance, info) => {
  console.error('Captured error in App:', error, instance, info)
  // You can add more error handling logic here, such as showing an error message to the user
  return false // Don't propagate the error
})
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar app>
      <v-toolbar-title>Prompt Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="router.push('/')">Home</v-btn>
      <v-btn @click="router.push('/explorer')">Explorer</v-btn>
      <v-btn @click="router.push('/management')">Management</v-btn>
      <v-btn v-if="authStore.isAuthenticated" @click="logout">Logout</v-btn>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <RouterView v-if="isRouterReady" />
        <v-progress-circular v-else indeterminate></v-progress-circular>
      </v-container>
    </v-main>

    <v-footer app>
      © {{ new Date().getFullYear() }} Prompt Manager
    </v-footer>

    <NotificationSnackbar />
  </v-app>
</template>

<style>
/* Add any global styles here */
</style>
