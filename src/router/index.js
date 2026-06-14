import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/compras', 
    },
    {
      path: '/compras',
      name: 'compras',
      component: () => import('@/views/DarAltaCompra.vue'), 
    },
    {
      path: '/historial',
      name: 'historial',
      component: () => import('@/views/HistorialMovimientos.vue')
    },
  ],
})

export default router