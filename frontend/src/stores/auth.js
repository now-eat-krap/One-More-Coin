// src/stores/auth.js
import { defineStore } from 'pinia'
import { apiSpring } from '@/plugins/axios'   // baseURL: '/springapi', withCredentials:true
import axios from 'axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    name:      null,   // 로그인한 사용자 이름 (없으면 null)
    hydrated:  false   // 새로고침마다 한 번만 hydrate 실행
  }),

  actions: {
    /* ───── 앱이 처음 로드될 때 로그인 상태 복원 ───── */
    async hydrate () {
      if (this.hydrated) return
        this.hydrated = true

        /* 1) ACCESS 로 /users/me 1차 시도 */
        try {
          const { data } = await apiSpring.get('/users/me')
          this.name = data.name          // ✅ 아직 만료 안 됨
          return
        } catch (e) {
          /* 401/403 만 처리, 그 외 에러는 그대로 비로그인 */
          if (!e.response || (e.response.status !== 401 && e.response.status !== 403)) {
            this.name = null
            return
          }
        }

        /* 2) ACCESS 만료 → /reissue 시도 */
        try {
          await apiSpring.post('/reissue')      // REFRESH 쿠키 유효하면 200
          const { data } = await apiSpring.get('/users/me')   // 재시도
          this.name = data.name                // ✅ 재발급 성공
        } catch {
          this.name = null                     // ❌ REFRESH 만료 → 비로그인
      }
    },

    /* OAuthCallback.vue 등에서 호출 – 로그인 성공 처리 */
    setLoginState (name) {
      this.name     = name
      this.hydrated = true               // 이미 로그인된 상태로 간주
    },

    /* 수동 로그아웃 */
    async logout () {
      /* 1) 서버에게 로그아웃 알리기 → /logout
            - withCredentials: true  ➜ 쿠키 동봉        */
      try {
        await axios.post('/logout', null, { withCredentials: true })
      } catch (_) {
        /* 네트워크 오류나 4xx/5xx 가 떠도
          클라이언트 상태는 아래에서 정리하므로 무시 */
      }

      /* 2) 클라이언트 상태 초기화 */
      this.name     = null
      this.hydrated = true   // 이후 hydrate() 재호출 방지

      /* 3) 로그인 화면으로 이동 */
      router.replace('/login')
    }
  }
})
