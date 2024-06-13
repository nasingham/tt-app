import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import SepoliaView from '@/views/SepoliaView.vue'
import EthView from '@/views/EthView.vue'
import StabilityView from '@/views/StabilityView.vue'
import StabilityTestView from '@/views/StabilityTestView.vue'
import XDCApothemView from '@/views/XDCApothemView.vue'
import XDCView from '@/views/XDCView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/sepolia',
    name: 'sepolia',
    component: SepoliaView,
  },
  {
    path: '/ethereum',
    name: 'eth',
    component: EthView,
  },
  {
    path: '/gtn',
    name: 'gtn',
    component: StabilityView,
  },
  {
    path:'/stability-testnet',
    name: 'stabilityTest',
    component: StabilityTestView,
  },
  {
    path:'/xdc-apothem',
    name: 'apothem',
    component: XDCApothemView,
  },
  {
    path: '/xdc',
    name: 'xdc',
    component: XDCView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
