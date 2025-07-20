<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold text-white mb-4">추천 백테스팅 전략</h3>

    <!-- 전략 카드들 -->
    <div class="space-y-4">
      <!-- 이동평균선 크로스오버 전략 -->
      <div
        class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
        @click="showStrategyDetail('ma_crossover')"
      >
        <h4 class="text-lg font-medium text-white mb-2">이동평균선 크로스오버</h4>
        <p class="text-gray-400 text-sm mb-3">
          단기 이동평균선이 장기 이동평균선을 상향 돌파할 때 매수, 하향 돌파할 때 매도
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">MA</span>
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">추세</span>
        </div>
      </div>

      <!-- RSI 과매수/과매도 전략 -->
      <div
        class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
        @click="showStrategyDetail('rsi')"
      >
        <h4 class="text-lg font-medium text-white mb-2">RSI 과매수/과매도</h4>
        <p class="text-gray-400 text-sm mb-3">RSI가 30 이하일 때 매수, 70 이상일 때 매도</p>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">RSI</span>
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">모멘텀</span>
        </div>
      </div>

      <!-- 볼린저 밴드 전략 -->
      <!-- <div
        class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
        @click="showStrategyDetail('bollinger')"
      >
        <h4 class="text-lg font-medium text-white mb-2">볼린저 밴드 반전</h4>
        <p class="text-gray-400 text-sm mb-3">
          가격이 하단 밴드를 터치하면 매수, 상단 밴드를 터치하면 매도
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">BB</span>
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">변동성</span>
        </div>
      </div> -->

      <!-- MACD 전략 -->
      <div
        class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
        @click="showStrategyDetail('macd')"
      >
        <h4 class="text-lg font-medium text-white mb-2">MACD 크로스오버</h4>
        <p class="text-gray-400 text-sm mb-3">
          MACD 라인이 시그널 라인을 상향 돌파할 때 매수, 하향 돌파할 때 매도
        </p>
        <div class="flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">MACD</span>
          <span class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">모멘텀</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 전략 상세 모달 -->
  <StrategyDetailModal :show="showModal" :strategy-id="selectedStrategyId" @close="closeModal" />
</template>

<script setup>
import { ref } from 'vue'
import StrategyDetailModal from '../StrategyDetailModal.vue'

const showModal = ref(false)
const selectedStrategyId = ref('')

const showStrategyDetail = (strategyId) => {
  selectedStrategyId.value = strategyId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStrategyId.value = ''
}
</script>
