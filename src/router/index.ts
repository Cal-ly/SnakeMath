import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/basics',
      name: 'basics',
      component: () => import('@/views/basics/BasicsIndex.vue'),
    },
    {
      path: '/basics/foundations',
      name: 'basics-foundations',
      component: () => import('@/views/basics/FoundationsView.vue'),
    },
    {
      path: '/basics/symbols',
      name: 'basics-symbols',
      component: () => import('@/views/basics/SymbolsView.vue'),
    },
    {
      path: '/basics/number-types',
      name: 'basics-number-types',
      component: () => import('@/views/basics/NumberTypesView.vue'),
    },
    {
      path: '/basics/functions',
      name: 'basics-functions',
      component: () => import('@/views/basics/FunctionsView.vue'),
    },
    {
      path: '/basics/variables',
      name: 'basics-variables',
      component: () => import('@/views/basics/VariablesView.vue'),
    },
    {
      path: '/basics/order-of-operations',
      name: 'basics-order-of-operations',
      component: () => import('@/views/basics/OrderOfOperationsView.vue'),
    },
    // Algebra section
    {
      path: '/algebra',
      name: 'algebra',
      component: () => import('@/views/algebra/AlgebraIndex.vue'),
    },
    {
      path: '/algebra/summation',
      name: 'algebra-summation',
      component: () => import('@/views/algebra/SummationView.vue'),
    },
    {
      path: '/algebra/quadratics',
      name: 'algebra-quadratics',
      component: () => import('@/views/algebra/QuadraticsView.vue'),
    },
    {
      path: '/algebra/exponentials',
      name: 'algebra-exponentials',
      component: () => import('@/views/algebra/ExponentialsView.vue'),
    },
    // Trigonometry section
    {
      path: '/trigonometry',
      name: 'trigonometry',
      component: () => import('@/views/trigonometry/TrigonometryIndexView.vue'),
    },
    {
      path: '/trigonometry/unit-circle',
      name: 'trigonometry-unit-circle',
      component: () => import('@/views/trigonometry/UnitCircleView.vue'),
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    // Handle hash anchors
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Restore scroll position on back/forward
    if (savedPosition) {
      return savedPosition
    }
    // Scroll to top on new navigation
    return { top: 0 }
  },
})

export default router
