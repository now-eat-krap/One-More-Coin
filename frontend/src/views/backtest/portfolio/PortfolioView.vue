<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- 헤더 -->
    <div class="flex-none p-2 border-b border-gray-700">
      <div class="flex items-center space-x-6">
        <RouterLink to="/" class="inline-block hover:opacity-80 transition-opacity">
          <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
        </RouterLink>
        <h3 class="text-xl font-bold text-yellow-400 tracking-wide text-center inline-block">
          포트폴리오 백테스트
        </h3>
      </div>
    </div>

    <!-- 본문 -->
    <div class="flex-1 flex flex-row min-h-0">
      <!-- 좌측 3/4 -->
      <div class="flex flex-col w-3/4 h-full min-h-0">
        <!-- 상단: 도넛차트 + 자산 리스트 -->
        <div class="flex flex-1 border border-gray-700 overflow-auto p-4 space-x-4"></div>
        <div class="flex-1 border border-gray-700 p-4 overflow-auto h-1/2">
          <BacktestConfig />
        </div>
      </div>

      <!-- 우측 1/4: 자산군 선택 UI -->
      <div
        class="w-1/4 h-full border-l border-gray-700 p-6 bg-stone-900/80 overflow-auto text-white space-y-6"
      >
        <SelectAsset />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SelectAsset from '@/components/backtest/portfolio/SelectAsset.vue'
import BacktestConfig from '@/components/backtest/portfolio/BacktestConfig.vue'
</script>

<style scoped></style>
