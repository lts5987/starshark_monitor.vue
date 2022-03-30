import { createRouter, createWebHashHistory } from 'vue-router'
import AccountsView from '../views/AccountsView.vue'
import BalanceCheckerView from '../views/BalanceCheckerView.vue'
import MonitorView from '../views/MonitorView.vue'

const routes = [
  {
    path: '/',
    name: 'accounts',
    component: AccountsView,
    meta: {
      title: 'Accounts'
    }
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView,
    meta: {
      title: 'Monitor'
    }
  },
  {
    path: '/balancechecker',
    name: 'balancechecker',
    component: BalanceCheckerView,
    meta: {
      title: 'Balance Checker'
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | StarSharks Monitor`;
  next();
});

export default router
