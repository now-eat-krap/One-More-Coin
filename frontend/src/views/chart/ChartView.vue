<!-- src/views/RealTimeView.vue -->
<template>
  <!-- 최상위: 화면 전체 높이, 세로 레이아웃 -->
  <div class="flex flex-col h-screen">
    <!-- 헤더 (고정 높이) -->
    <div class="flex-none p-3">
      <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
        <!-- PNG 로고 -->
        <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
      </RouterLink>
    </div>

    <!-- 본문: 헤더 아래 남은 공간을 차지, 스크롤 없이 꽉 채움 -->
    <div class="flex-1 flex flex-row">
      <!-- 좌측 3/4 -->
      <div class="flex flex-col w-3/4 h-full">
        <!-- 상단 차트 영역: 남은 세로 공간 모두 차지 -->
        <div class="flex-1 border-3 border-gray-700">
          <div class="real-time-container h-full">
            <h2 class="p-2">실시간 캔들 차트 ({{ symbol.toUpperCase() }} / {{ interval }})</h2>
            <LiveChart :symbol="symbol" :interval="interval" :initialLimit="150" />
          </div>
        </div>
        <!-- 하단 백테스트 영역: 높이 동일하게 분할하지 않고 필요에 따라 조정 -->
        <div class="border-3 border-gray-700 h-1/3 p-4">전략 백테스트</div>
      </div>

      <!-- 우측 1/4 -->
      <div class="border-3 border-gray-700 w-1/4 h-full">추천 백테스팅 기법</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LiveChart from '@/components/chart/LiveChart.vue'

// 심볼과 인터벌 정의
const symbol = ref('btcusdt')
const interval = ref('1h')
</script>

<style scoped>
/* 필요에 따라 추가 스타일을 작성하세요 */
</style>
