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
      path: '/algebra/product-notation',
      name: 'algebra-product-notation',
      component: () => import('@/views/algebra/ProductNotationView.vue'),
    },
    {
      path: '/algebra/linear-equations',
      name: 'algebra-linear-equations',
      component: () => import('@/views/algebra/LinearEquationsView.vue'),
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
    {
      path: '/trigonometry/right-triangles',
      name: 'trigonometry-right-triangles',
      component: () => import('@/views/trigonometry/RightTrianglesView.vue'),
    },
    // Linear Algebra section
    {
      path: '/linear-algebra',
      name: 'linear-algebra',
      component: () => import('@/views/linear-algebra/LinearAlgebraIndexView.vue'),
    },
    {
      path: '/linear-algebra/vectors',
      name: 'linear-algebra-vectors',
      component: () => import('@/views/linear-algebra/VectorsView.vue'),
    },
    {
      path: '/linear-algebra/matrices',
      name: 'linear-algebra-matrices',
      component: () => import('@/views/linear-algebra/MatricesView.vue'),
    },
    // Statistics section
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/statistics/StatisticsIndexView.vue'),
    },
    {
      path: '/statistics/descriptive',
      name: 'statistics-descriptive',
      component: () => import('@/views/statistics/DescriptiveStatsView.vue'),
    },
    // Calculus section
    {
      path: '/calculus',
      name: 'calculus',
      component: () => import('@/views/calculus/CalculusIndexView.vue'),
    },
    {
      path: '/calculus/limits',
      name: 'calculus-limits',
      component: () => import('@/views/calculus/LimitsView.vue'),
    },
    {
      path: '/calculus/derivatives',
      name: 'calculus-derivatives',
      component: () => import('@/views/calculus/DerivativesView.vue'),
    },
    // Catch-all 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
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
    // Don't scroll when only query params change (same path)
    if (to.path === from.path) {
      return false
    }
    // Scroll to top on new navigation
    return { top: 0 }
  },
})

export default router
