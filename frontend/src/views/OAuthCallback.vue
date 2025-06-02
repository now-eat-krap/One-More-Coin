<script setup>
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  const token = route.query.access
  if (token) {
    localStorage.setItem('access', token)
    const decoded = jwtDecode(token)
    const name = decoded.name
    if (name) {
      localStorage.setItem('name', name)
      authStore.setLoginState(name)
    }
    router.push('/')
  } else {
    console.error('accessToken이 없습니다.')
  }
})
</script>

<template>
  <div class="text-white">로그인 처리 중...</div>
</template>
