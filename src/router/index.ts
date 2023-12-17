import { App } from 'vue';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/map',
    name: 'map',
    meta: { auth: true },
    component: () => import('../layout/map.vue')
  },
  {
    path: '/',
    name: 'earth',
    meta: { auth: true },
    component: () => import('../layout/Earth.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export async function setupRouter(app: App) {
  app.use(router)
}

export default router;