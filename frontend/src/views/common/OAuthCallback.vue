<template>
  <div class="h-screen flex items-center justify-center">
    <!-- 간단한 스피너 -->
    <svg class="animate-spin h-8 w-8 text-yellow-400" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke-width="4" fill="none" />
    </svg>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { apiSpring } from '@/plugins/axios'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
   try {
    // 1) ACCESS 쿠키로 로그인 확인
    const { data } = await apiSpring.get('/users/me')   // 200 OK → 로그인 성공
    // data 예시: { username:"naver asdf123sdadf1231", name:"홍길동", email:"hong@example.com", role:"ROLE_USER" }
    // 2) 전역 상태 반영 (Pinia/Vuex 등)
    authStore.setLoginState(data.name)

    // 3) 홈으로 이동 (replace로 히스토리 정리)
    router.replace('/')
  } catch (err) {
    console.error('로그인 확인 실패', err)
    // ACCESS 만료 → 인터셉터가 /auth/refresh 호출 뒤에도 실패하면 로그인 페이지로
    router.replace('/login')
  }

  // const token = route.query.access
  // if (token) {
  //   localStorage.setItem('access', token)
  //   const decoded = jwtDecode(token)
  //   const name = decoded.name
  //   if (name) {
  //     localStorage.setItem('name', name)
  //     authStore.setLoginState(name)
  //   }
  //   router.push('/')
  // } else {
  //   console.error('accessToken이 없습니다.')
  // }
})
</script>
