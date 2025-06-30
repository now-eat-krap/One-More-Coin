// JWT 토큰의 payload 부분을 디코딩하는 함수
const decodeToken = (token) => {
  if (!token) {
    // console.log('Token is null or undefined')
    return null
  }

  try {
    // 토큰 형식 검증 (header.payload.signature)
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token format:', token)
      return null
    }

    // Base64 디코딩 시도
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    // console.error('Token parsing error:', error)
    // console.log('Problematic token:', token)
    return null
  }
}

export const isTokenExpired = (token) => {
  const payload = decodeToken(token)
  if (!payload) return true

  const expirationTime = payload.exp * 1000 // Convert to milliseconds
  return Date.now() >= expirationTime
}

export const getTokenExpirationTime = (token) => {
  const payload = decodeToken(token)
  if (!payload) return null

  return new Date(payload.exp * 1000)
}

// 토큰 만료 시간까지 남은 시간을 계산 (밀리초)
export const getTimeUntilExpiration = (token) => {
  const payload = decodeToken(token)
  if (!payload) return 0

  const expirationTime = payload.exp * 1000
  return expirationTime - Date.now()
}
