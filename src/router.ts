import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('./pages/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/iconify-catalog/'),
  routes,
})

export { router }
