import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
})

// 요청 인터셉터 (필요 시 추가)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 응답 인터셉터 - access 만료 시 재발급 시도
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const res = await axios.post('http://localhost:8080/auth/reissue', null, {
          withCredentials: true,
        })

        const newAccessToken = res.data.accessToken
        localStorage.setItem('access', newAccessToken)

        // 헤더에 다시 설정하고 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return axios(originalRequest)
      } catch (reissueError) {
        console.error('Reissue failed', reissueError)
        window.location.href = '/login'
        return Promise.reject(reissueError)
      }
    }

    return Promise.reject(err)
  },
)

export default api
