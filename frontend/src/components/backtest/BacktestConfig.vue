<template>
  <div class="flex flex-col h-full">
    <!-- 날짜 선택 -->
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-white">백테스팅 기간</h4>
        <div class="flex items-center gap-4">
          <div class="relative">
            <label class="block text-gray-300 text-sm mb-1">시작일</label>
            <div class="relative">
              <input
                v-model="backtestPeriod.startDate"
                type="date"
                class="w-40 pl-10 pr-3 py-1.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                :max="backtestPeriod.endDate"
              />
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div class="relative">
            <label class="block text-gray-300 text-sm mb-1">종료일</label>
            <div class="relative">
              <input
                v-model="backtestPeriod.endDate"
                type="date"
                class="w-40 pl-10 pr-3 py-1.5 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
                :min="backtestPeriod.startDate"
              />
              <svg
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 전략 설정 -->
    <div class="mb-4 flex-1 overflow-hidden">
      <div class="grid grid-cols-2 gap-4 h-full">
        <!-- 매수 조건 -->
        <div class="bg-gray-800 rounded-lg p-4 overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-white">매수 조건</h5>
          </div>
          <div class="space-y-3">
            <div
              v-for="(condition, index) in buyConditions"
              :key="index"
              class="bg-gray-700 rounded-lg p-3"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-300">{{ getConditionName(condition) }}</span>
                </div>
                <button
                  @click="removeCondition('buy', index)"
                  class="text-red-400 hover:text-red-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-2 text-xs text-gray-400">
                {{ getConditionDescription(condition) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 매도 조건 -->
        <div class="bg-gray-800 rounded-lg p-4 overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h5 class="text-md font-medium text-white">매도 조건</h5>
          </div>
          <div class="space-y-3">
            <div
              v-for="(condition, index) in sellConditions"
              :key="index"
              class="bg-gray-700 rounded-lg p-3"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-300">{{ getConditionName(condition) }}</span>
                </div>
                <button
                  @click="removeCondition('sell', index)"
                  class="text-red-400 hover:text-red-300"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div class="mt-2 text-xs text-gray-400">
                {{ getConditionDescription(condition) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 백테스팅 실행 버튼 -->
    <button
      @click="runBacktest"
      class="mt-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="!isBacktestReady"
    >
      백테스팅 실행
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useStrategyStore } from '@/stores/strategyStore'

const strategyStore = useStrategyStore()

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['backtest-complete'])

// 백테스팅 기간
const backtestPeriod = ref({
  startDate: '',
  endDate: '',
})

// 매수/매도 조건
const buyConditions = ref([])
const sellConditions = ref([])

// 전략이 변경될 때마다 매수/매도 조건 업데이트
watch(
  () => strategyStore.buyConditions,
  (newBuyConditions) => {
    console.log('Buy conditions changed:', newBuyConditions) // 디버깅용
    buyConditions.value = newBuyConditions
  },
  { deep: true, immediate: true },
)

watch(
  () => strategyStore.sellConditions,
  (newSellConditions) => {
    //console.log('Sell conditions changed:', newSellConditions) // 디버깅용
    sellConditions.value = newSellConditions
  },
  { deep: true, immediate: true },
)

// 조건 제거 함수
const removeCondition = (type, index) => {
  if (type === 'buy') {
    buyConditions.value.splice(index, 1)
  } else {
    sellConditions.value.splice(index, 1)
  }
}

// 백테스팅 준비 상태 확인
const isBacktestReady = computed(() => {
  return (
    backtestPeriod.value.startDate &&
    backtestPeriod.value.endDate &&
    buyConditions.value.length > 0 &&
    sellConditions.value.length > 0
  )
})

// 백테스팅 실행 함수
const runBacktest = async () => {
  console.log(buyConditions.value)
  console.log(sellConditions.value)

  // try {
  //   const response = await axios.post('/api/backtest', {
  //     period: backtestPeriod.value,
  //     conditions: {
  //       buy: buyConditions.value,
  //       sell: sellConditions.value,
  //     },
  //     indicators: indicators.value,
  //     symbol: props.symbol,
  //     exchange: props.exchange,
  //     interval: props.interval,
  //   })
  //   emit('backtest-complete', response.data)
  // } catch (error) {
  //   console.error('Backtest failed:', error)
  // }
}

// 외부에 노출할 메서드들
defineExpose({
  removeCondition,
  runBacktest,
})

const getConditionName = (condition) => {
  if (condition.type === 'indicator') {
    return '지표 조건'
  } else if (condition.type === 'indicator_compare') {
    return '지표 간 비교'
  }
}

const getConditionDescription = (condition) => {
  if (condition.type === 'indicator') {
    return `${condition.params.indicator} [${Object.values(condition.params.settings)}] ${condition.params.operator} ${condition.params.oversold} 일 때`
  } else if (condition.type === 'indicator_compare') {
    return `${condition.params.indicator[0]} [${Object.values(condition.params.settings[0])}] ${condition.params.operator} ${condition.params.indicator[1]} [${Object.values(condition.params.settings[1])}] 일 때`
  }

  return condition.params.indicator
}
</script>

<style scoped>
/* 달력 아이콘 커스텀 스타일 */
input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

input[type='date']::-webkit-datetime-edit {
  padding: 0;
}

input[type='date']::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

input[type='date']::-webkit-datetime-edit-text {
  padding: 0 2px;
  color: #9ca3af;
}

input[type='date']::-webkit-datetime-edit-year-field,
input[type='date']::-webkit-datetime-edit-month-field,
input[type='date']::-webkit-datetime-edit-day-field {
  padding: 0 2px;
  color: #fff;
}

/* 호버 효과 */
input[type='date']:hover {
  background-color: #374151;
}

/* 포커스 효과 */
input[type='date']:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
