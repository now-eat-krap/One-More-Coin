import { ref, onMounted, onUnmounted } from 'vue'
import { getTimeUntilExpiration } from '@/utils/token'
import api from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// 로그아웃 처리 함수
const handleLogout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('name')
  const authStore = useAuthStore()
  authStore.clearLoginState()
  router.push('/login')
}

// 토큰 갱신 함수를 외부에서도 사용할 수 있도록 분리
export const refreshToken = async () => {
  try {
    const response = await api.post('/reissue', null, { withCredentials: true })
    const newAccessToken = response.data.accessToken
    localStorage.setItem('access', newAccessToken)
    return newAccessToken
  } catch (error) {
    console.error('토큰 갱신 실패:', error)
    // 네트워크 오류나 서버 오류의 경우 재시도
    if (error.response?.status >= 500 || !error.response) {
      console.error('서버 오류로 인한 토큰 갱신 실패:', error)
      throw error
    }
    // 400, 401, 403 등의 인증 오류의 경우 로그아웃
    if (
      error.response?.status === 400 ||
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.error('인증 오류로 인한 토큰 갱신 실패:', error)
      handleLogout()
    }
    throw error
  }
}

export function useTokenRefresh() {
  const refreshTimer = ref(null)
  const REFRESH_THRESHOLD = 60 * 1000 // 1분 전에 갱신

  const startTokenRefreshTimer = () => {
    const token = localStorage.getItem('access')
    if (!token) return

    const timeUntilExpiration = getTimeUntilExpiration(token)
    
    // 만료 시간이 1분 이내로 남은 경우
    if (timeUntilExpiration <= REFRESH_THRESHOLD) {
      // 즉시 토큰 갱신
      refreshToken()
        .then(() => {
          // 새로운 토큰으로 타이머 재시작
          startTokenRefreshTimer()
        })
        .catch(error => {
          console.error('토큰 갱신 실패:', error)
          // 에러는 refreshToken 함수 내에서 처리되므로 여기서는 추가 처리 불필요
        })
    } else {
      // 만료 시간이 1분 이상 남은 경우, 남은 시간 - 1분 후에 갱신
      const refreshTime = timeUntilExpiration - REFRESH_THRESHOLD
      refreshTimer.value = setTimeout(() => {
        startTokenRefreshTimer()
      }, refreshTime)
    }
  }

  onMounted(() => {
    startTokenRefreshTimer()
  })

  onUnmounted(() => {
    if (refreshTimer.value) {
      clearTimeout(refreshTimer.value)
    }
  })

  return {
    startTokenRefreshTimer,
    refreshToken
  }
}
