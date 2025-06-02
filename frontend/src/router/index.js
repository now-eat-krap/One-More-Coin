import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/oauth-callback',
      name: 'OAuthCallback',
      component: () => import('@/views/OAuthCallback.vue'),
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

  // 로그인된 상태에서 로그인 페이지 접근 시 홈으로 리다이렉트
  if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
