import axios from 'axios'
import { isTokenExpired } from '@/utils/token'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { refreshToken } from '@/composables/useTokenRefresh'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
})

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false
// 갱신 대기 중인 요청들을 저장하는 배열
let refreshSubscribers = []

// 갱신 대기 중인 요청들을 처리하는 함수
const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

// 갱신 대기 중인 요청을 추가하는 함수
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback)
}

// 로그아웃 처리 함수
const handleLogout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('name')
  const authStore = useAuthStore()
  authStore.clearLoginState()
  router.push('/login')
}

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 로그아웃 요청인 경우 토큰 재발급 시도하지 않음
    if (config.url === '/logout') {
      return config
    }

    const token = localStorage.getItem('access')

    // 토큰이 만료되었는지 확인
    if (token && isTokenExpired(token)) {
      if (!isRefreshing) {
        isRefreshing = true
        return refreshToken()
          .then((newToken) => {
            isRefreshing = false
            onRefreshed(newToken)
            config.headers.Authorization = `Bearer ${newToken}`
            return config
          })
          .catch((error) => {
            isRefreshing = false
            console.log(error.response?.status)
            // 네트워크 오류나 서버 오류의 경우 재시도
            if (error.response?.status >= 500 || !error.response) {
              console.error('서버 오류로 인한 토큰 갱신 실패:', error)
              return config // 원래 요청을 그대로 진행
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
            return Promise.reject(error)
          })
      } else {
        // 이미 갱신 중이면 대기
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(config)
          })
        })
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 로그아웃 요청이거나 이미 재시도한 요청인 경우 토큰 재발급 시도하지 않음
    if (originalRequest.url === '/logout' || originalRequest._retry) {
      return Promise.reject(error)
    }

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401) {
      if (!isRefreshing) {
        isRefreshing = true
        originalRequest._retry = true

        try {
          const newToken = await refreshToken()
          isRefreshing = false
          onRefreshed(newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        } catch (reissueError) {
          isRefreshing = false
          // 네트워크 오류나 서버 오류의 경우 재시도
          if (reissueError.response?.status >= 500 || !reissueError.response) {
            console.error('서버 오류로 인한 토큰 갱신 실패:', reissueError)
            return api(originalRequest) // 원래 요청을 그대로 진행
          }
          // 401, 403 등의 인증 오류의 경우 로그아웃
          if (reissueError.response?.status === 401 || reissueError.response?.status === 403) {
            console.error('인증 오류로 인한 토큰 갱신 실패:', reissueError)
            handleLogout()
          }
          return Promise.reject(reissueError)
        }
      } else {
        // 이미 갱신 중이면 대기
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            resolve(api(originalRequest))
          })
        })
      }
    }

    return Promise.reject(error)
  },
)

export default api
