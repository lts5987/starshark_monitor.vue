import { createRouter, createWebHashHistory } from 'vue-router'
import MonitorView from '../views/MonitorView.vue'
import AccountsView from '../views/AccountsView.vue'

const routes = [
  {
    path: '/',
    name: 'accounts',
    component: AccountsView
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
