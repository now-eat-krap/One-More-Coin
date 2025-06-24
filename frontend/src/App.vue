<template>
  <div class="flex flex-col min-h-screen bg-stone-950 text-stone-200">
    <!-- 헤더 -->
    <HeaderComponent v-if="route.path !== '/chart'" />

    <!-- 메인 컨텐츠 (고정 폭이 아니라 유연하게 늘어남) -->
    <main>
      <RouterView />
    </main>

    <!-- 푸터 -->
    <FooterComponent v-if="route.path !== '/chart'" />
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/sections/HeaderComponent.vue'
import FooterComponent from '@/components/sections/FooterComponent.vue'
import { useTokenRefresh } from '@/composables/useTokenRefresh'
import { useRoute } from 'vue-router'

// Composition API: 특별히 reactive 상태나 props가 필요 없으면 setup은 import 정도만 사용
// 현재 경로 정보 가져오기
const route = useRoute()

// 토큰 갱신 타이머 시작
useTokenRefresh()
</script>

<style>
/* 전역 스타일이 필요하면 여기에 추가 */
</style>
