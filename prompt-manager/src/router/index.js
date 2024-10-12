import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/management',
    name: 'ManagementArea',
    component: () => import('../views/ManagementArea.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/explorer',
    name: 'ExplorerPage',
    component: () => import('../views/ExplorerPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for the Management Area
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // If not authenticated, allow access to Management Area for PIN entry
      next()
    } else {
      // If authenticated, allow access
      next()
    }
  } else {
    // For non-protected routes, always allow access
    next()
  }
})

export default router