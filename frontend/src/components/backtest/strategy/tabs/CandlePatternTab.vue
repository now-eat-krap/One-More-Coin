<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold text-white mb-4">캔들 패턴</h3>

    <!-- 매수/매도 조건 선택 -->
    <div class="flex space-x-4 mb-6">
      <button
        @click="activeCondition = 'buy'"
        :class="[
          'flex-1 py-2.5 rounded-lg font-medium transition-colors',
          activeCondition === 'buy'
            ? 'bg-green-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        ]"
      >
        매수 조건
      </button>
      <button
        @click="activeCondition = 'sell'"
        :class="[
          'flex-1 py-2.5 rounded-lg font-medium transition-colors',
          activeCondition === 'sell'
            ? 'bg-red-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
        ]"
      >
        매도 조건
      </button>
    </div>
    <div
      v-show="alert"
      class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <svg
        class="shrink-0 inline w-4 h-4 me-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
        />
      </svg>
      <span class="sr-only">Info</span>
      <div>
        <span class="font-medium">조건을 전부 선택해 주세요</span>
      </div>
    </div>
    <!-- 캔들 패턴 설정 -->
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">패턴 선택</label>
          <select
            v-model="selectedPattern"
            @change="handlePatternChange"
            class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">패턴을 선택하세요</option>
            <optgroup label="상승 반전 패턴">
              <option v-for="(pattern, key) in bullishPatterns" :key="key" :value="key">
                {{ pattern.korean }} ({{ pattern.label }})
              </option>
            </optgroup>
            <optgroup label="하락 반전 패턴">
              <option v-for="(pattern, key) in bearishPatterns" :key="key" :value="key">
                {{ pattern.korean }} ({{ pattern.label }})
              </option>
            </optgroup>
          </select>
        </div>

        <!-- 패턴 설명 -->
        <div v-if="selectedPattern && currentPattern" class="mt-4 p-4 bg-gray-700 rounded-lg">
          <h4 class="text-lg font-medium text-white mb-2">{{ currentPattern.korean }}</h4>
          <div class="space-y-2">
            <div>
              <span class="text-sm font-medium text-gray-300">형태:</span>
              <p class="text-gray-200">{{ currentPattern.description.shape }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-300">효과:</span>
              <p class="text-gray-200">{{ currentPattern.description.effect }}</p>
            </div>
            <!-- 이미지 영역 (추후 추가 예정) -->
            <div class="mt-4 bg-gray-600 rounded-lg h-48 flex items-center justify-center">
              <img :src="currentPatternImage" alt="패턴 이미지" class="h-full object-contain" />
            </div>
          </div>
        </div>
      </div>

      <!-- 조건 저장 버튼 -->
      <button
        @click="savePatternCondition"
        class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-800 mt-6"
      >
        조건 저장하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStrategyStore } from '@/stores/strategyStore'
import { candlestickPatterns } from '@/config/candlePatternParams'

const strategyStore = useStrategyStore()
const activeCondition = ref('buy')
const selectedPattern = ref('')

// 상승/하락 패턴 분류
const bullishPatterns = computed(() => {
  return Object.entries(candlestickPatterns)
    .filter(([_, pattern]) => pattern.type === 'bullish')
    .reduce((acc, [key, pattern]) => {
      acc[key] = pattern
      return acc
    }, {})
})

const bearishPatterns = computed(() => {
  return Object.entries(candlestickPatterns)
    .filter(([_, pattern]) => pattern.type === 'bearish')
    .reduce((acc, [key, pattern]) => {
      acc[key] = pattern
      return acc
    }, {})
})

// 현재 선택된 패턴
const currentPattern = computed(() => {
  if (!selectedPattern.value) return null
  return candlestickPatterns[selectedPattern.value]
})

const currentPatternImage = computed(() => {
  return `/candlePattern/${selectedPattern.value}.png`
})

// 패턴이 변경될 때
const handlePatternChange = () => {
  // 필요한 경우 추가 로직 구현
}

const alert = ref(false)
// 패턴 조건 저장
const savePatternCondition = () => {
  if (!selectedPattern.value) {
    alert.value = true
    return
  }

  const condition = {
    type: 'candle_pattern',
    params: {
      pattern: selectedPattern.value,
    },
  }

  if (activeCondition.value === 'buy') {
    strategyStore.addBuyCondition(condition)
  } else {
    strategyStore.addSellCondition(condition)
  }

  // 초기화
  // selectedPattern.value = ''
}
</script>
