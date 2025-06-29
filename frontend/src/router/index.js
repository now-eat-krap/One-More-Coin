import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/common/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/common/LoginView.vue'),
    },
    {
      path: '/oauth-callback',
      name: 'OAuthCallback',
      component: () => import('@/views/common/OAuthCallback.vue'),
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import('@/views/chart/ChartView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('@/views/common/PreparingContent.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/common/PreparingContent.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('@/views/common/PreparingContent.vue'),
      meta: { requiresAuth: true },
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/common/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
  const hasToken = localStorage.getItem('access')

  // 토큰은 있지만 상태가 초기화된 경우
  if (hasToken && !isLoggedIn) {
    const name = localStorage.getItem('name')
    if (name) {
      authStore.setLoginState(name)
    }
  }

  // ② 보호 라우트인데 로그인 안 됐으면 /login 으로
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ path: '/login' })
    return
  }

  // 로그인된 상태에서 로그인 페이지 접근 시 홈으로 리다이렉트
  if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
