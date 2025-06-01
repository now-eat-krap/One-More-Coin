<template>
  <div class="flex flex-col min-h-screen bg-stone-950 text-stone-200">
    <!-- 헤더 -->
    <HeaderComponent />

    <!-- 메인 컨텐츠 (고정 폭이 아니라 유연하게 늘어남) -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- 푸터 -->
    <FooterComponent />
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/sections/HeaderComponent.vue'
import FooterComponent from '@/components/sections/FooterComponent.vue'

// Composition API: 특별히 reactive 상태나 props가 필요 없으면 setup은 import 정도만 사용
</script>

<style>
/* 전역 스타일이 필요하면 여기에 추가 */
</style>
