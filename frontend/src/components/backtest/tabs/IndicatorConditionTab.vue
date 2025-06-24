<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold text-white mb-4">지표 조건</h3>

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

    <!-- 지표 조건 설정 -->
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">지표 선택</label>
          <select
            v-model="indicatorCondition.indicator"
            @change="handleIndicatorChange"
            class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">지표 선택</option>
            <option v-for="option in indicatorOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 지표 파라미터 설정 -->
        <div v-if="selectedIndicatorParams.length > 0" class="space-y-4">
          <div v-for="param in selectedIndicatorParams" :key="param.key" class="space-y-2">
            <label class="block text-sm font-medium text-gray-300">{{ param.label }}</label>
            <div class="flex items-center space-x-2">
              <input
                v-model.number="paramValues[param.key]"
                type="number"
                :min="param.min"
                :max="param.max"
                class="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                :placeholder="param.description"
              />
              <span class="text-sm text-gray-400">{{ param.description }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">연산자</label>
            <select
              v-model="indicatorCondition.operator"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">연산자 선택</option>
              <option v-for="option in operatorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">기준값</label>
            <input
              v-model="indicatorCondition.target"
              type="number"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              placeholder="값을 입력하세요"
            />
          </div>
        </div>
      </div>

      <!-- 조건 저장 버튼 -->
      <button
        @click="saveIndicatorCondition"
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
import { indicatorParams, defaultParams } from '@/config/indicatorParams'

const strategyStore = useStrategyStore()
const activeCondition = ref('buy')

// 지표 옵션
const indicatorOptions = ref([
  { value: 'rsi', label: 'RSI' },
  { value: 'macd', label: 'MACD' },
  { value: 'ema', label: 'EMA' },
  { value: 'sma', label: 'SMA' },
  // { value: 'bollinger', label: '볼린저 밴드' },
  // { value: 'stoch', label: '스토캐스틱' },
  // { value: 'atr', label: 'ATR' },
  // { value: 'cci', label: 'CCI' },
])

// 연산자 옵션
const operatorOptions = ref([
  { value: '>', label: '초과 (>)' },
  { value: '<', label: '미만 (<)' },
  { value: '>=', label: '이상 (>=)' },
  { value: '<=', label: '이하 (<=)' },
  { value: '==', label: '같음 (=)' },
  { value: 'crossover', label: '크로스오버 (골든크로스)' },
  { value: 'crossunder', label: '크로스언더 (데드크로스)' },
])

// 지표 조건 관련 상태
const indicatorCondition = ref({
  indicator: '',
  operator: '',
  target: '',
})

// 선택된 지표의 파라미터
const selectedIndicatorParams = computed(() => {
  if (!indicatorCondition.value.indicator) return []
  return Object.entries(indicatorParams[indicatorCondition.value.indicator]).map(
    ([key, value]) => ({
      key,
      ...value,
    }),
  )
})

// 파라미터 값 상태
const paramValues = ref({})

// 지표가 변경될 때 파라미터 값 초기화
const handleIndicatorChange = () => {
  if (!indicatorCondition.value.indicator) return
  paramValues.value = { ...defaultParams[indicatorCondition.value.indicator] }
}

// 지표 조건 저장
const saveIndicatorCondition = () => {
  const { indicator, operator, target } = indicatorCondition.value

  // null·undefined·'' 인 값이 하나라도 있으면
  if ([indicator, operator, target].some((v) => v == null || v === '')) {
    alert('값을 선택해주세요')
    return
  }

  const condition = {
    type: 'indicator',
    params: {
      indicator: [indicatorCondition.value.indicator],
      operator: indicatorCondition.value.operator,
      settings: [{ ...paramValues.value }],
      oversold: Number(indicatorCondition.value.target),
    },
  }

  if (activeCondition.value === 'buy') {
    strategyStore.addBuyCondition(condition)
  } else {
    strategyStore.addSellCondition(condition)
  }

  // 초기화
  indicatorCondition.value = {
    indicator: '',
    operator: '',
    target: '',
  }
  paramValues.value = {}
}
</script>
