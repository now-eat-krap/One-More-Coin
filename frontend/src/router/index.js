import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { refreshToken } from '@/composables/useTokenRefresh'
import { getTimeUntilExpiration } from '@/utils/token'

const REFRESH_THRESHOLD = 60 * 1000

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


/* ─────────────────────────────────────────────
   전역 가드
   1) 스토어 비어 있으면 hydrate() 한 번 호출
   2) 보호 라우트 + 비로그인 → /login
   3) 로그인 상태로 /login 접근 → /
────────────────────────────────────────────── */
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()

  // 1) 새로고침 뒤 첫 네비게이션이면 스토어 복원
  if (auth.name === null) {
    await auth.hydrate()            // 쿠키 기반 /users/me 호출
  }

  // 2) 인증 필요한데 로그인 안 됐으면 /login
  if (to.meta.requiresAuth && auth.name === null) {
    return next('/login')
  }

  // 3) 이미 로그인한 상태로 /login 접근 시 홈으로
  if (to.path === '/login' && auth.name) {
    return next('/')
  }

  next()
})

export default router

// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore()
//   const token = localStorage.getItem('access')
//   console.log("beforeach")
//   // 1) 로컬스토리지엔 토큰 있는데 Pinia 상태만 초기화 된 경우 복원
//   if (token && !authStore.isLoggedIn) {
//     const remains = getTimeUntilExpiration(token)
//     if (remains > 0) {                          // ⬅️ 만료 안 됐을 때만 복원
//       const name = localStorage.getItem('name')
//       if(name) {
//         authStore.setLoginState(name)
//       }
//     } 
//     else {
//       console.log("갱신 시도")
//       try {
//         refreshToken()          // 새 토큰 저장됨
//       } catch (err) {
//         // ⚠️ 갱신 실패 – 로그아웃 처리
//         authStore.clearLoginState()
//         console.log(err)
//         return next('/')                        // next 호출 없이 종료 → push 된 /login 으로 이동
//       }
//     }
//   }

//   // 2) 보호 라우트인데 로그인 안됐으면 /login
//   if (to.meta.requiresAuth && !authStore.isLoggedIn) {
//     return next('/login')
//   }

//   // 3) 토큰이 존재하고 만료 임박이면 먼저 리프레시 시도
//   if (token) {
//     const remains = getTimeUntilExpiration(token)
//     if (remains <= REFRESH_THRESHOLD) {
//       console.log("갱신 시도")
//       try {
//         refreshToken()          // 새 토큰 저장됨
//       } catch (err) {
//         // ⚠️ 갱신 실패 – 로그아웃 처리
//         authStore.clearLoginState()
//         return                         // next 호출 없이 종료 → push 된 /login 으로 이동
//       }
//     }
//   }

//   // 4) 로그인 페이지에 이미 로그인 상태로 진입하면 홈으로
//   if (to.path === '/login' && authStore.isLoggedIn) {
//     return next('/')
//   }

//   next()
// })
