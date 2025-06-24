<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold text-white mb-4">지표 간 비교</h3>

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

    <!-- 지표 간 비교 설정 -->
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">첫 번째 지표</label>
            <select
              v-model="indicatorCompare.firstIndicator"
              @change="handleFirstIndicatorChange"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">지표 선택</option>
              <option v-for="option in indicatorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p v-if="indicatorCompare.firstIndicator" class="text-xs text-gray-400 mt-1">
              {{ indicatorMeta[indicatorCompare.firstIndicator].description }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">두 번째 지표</label>
            <select
              v-model="indicatorCompare.secondIndicator"
              @change="handleSecondIndicatorChange"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">지표 선택</option>
              <option v-for="option in indicatorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <p v-if="indicatorCompare.secondIndicator" class="text-xs text-gray-400 mt-1">
              {{ indicatorMeta[indicatorCompare.secondIndicator].description }}
            </p>
          </div>
        </div>

        <!-- 첫 번째 지표 파라미터 -->
        <div v-if="firstSelectedIndicatorParams.length > 0" class="bg-gray-700 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-300 mb-3">첫 번째 지표 파라미터</h4>
          <div class="space-y-3">
            <div v-for="param in firstSelectedIndicatorParams" :key="param.key">
              <label class="block text-sm text-gray-300 mb-1">{{ param.label }}</label>
              <input
                v-model="firstIndicatorParams[param.key]"
                :type="param.type"
                :min="param.min"
                :max="param.max"
                :step="param.step"
                class="w-full bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-400 mt-1">{{ param.description }}</p>
            </div>
          </div>
        </div>

        <!-- 두 번째 지표 파라미터 -->
        <div v-if="secondSelectedIndicatorParams.length > 0" class="bg-gray-700 p-4 rounded-lg">
          <h4 class="text-sm font-medium text-gray-300 mb-3">두 번째 지표 파라미터</h4>
          <div class="space-y-3">
            <div v-for="param in secondSelectedIndicatorParams" :key="param.key">
              <label class="block text-sm text-gray-300 mb-1">{{ param.label }}</label>
              <input
                v-model="secondIndicatorParams[param.key]"
                :type="param.type"
                :min="param.min"
                :max="param.max"
                :step="param.step"
                class="w-full bg-gray-600 text-white rounded-lg px-3 py-2 border border-gray-500 focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="text-xs text-gray-400 mt-1">{{ param.description }}</p>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">연산자</label>
          <select
            v-model="indicatorCompare.operator"
            class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">연산자 선택</option>
            <option v-for="option in operatorOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- 조건 저장 버튼 -->
      <button
        @click="saveIndicatorCompare"
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
import { indicatorMeta } from '@/config/indicatorParams'

const strategyStore = useStrategyStore()
const activeCondition = ref('buy')

// 지표 옵션
const indicatorOptions = computed(() =>
  Object.entries(indicatorMeta).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
)

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

// 지표 간 비교 관련 상태
const indicatorCompare = ref({
  firstIndicator: '',
  secondIndicator: '',
  operator: '',
})

// 첫 번째 지표의 파라미터 값
const firstIndicatorParams = ref({})
// 두 번째 지표의 파라미터 값
const secondIndicatorParams = ref({})

// 선택된 지표들의 파라미터
const firstSelectedIndicatorParams = computed(() => {
  if (!indicatorCompare.value.firstIndicator) return []
  return Object.entries(indicatorMeta[indicatorCompare.value.firstIndicator].params).map(
    ([key, value]) => ({
      key,
      ...value,
    }),
  )
})

const secondSelectedIndicatorParams = computed(() => {
  if (!indicatorCompare.value.secondIndicator) return []
  return Object.entries(indicatorMeta[indicatorCompare.value.secondIndicator].params).map(
    ([key, value]) => ({
      key,
      ...value,
    }),
  )
})

// 지표 변경 시 파라미터 초기화
const handleFirstIndicatorChange = () => {
  firstIndicatorParams.value = {}
  if (indicatorCompare.value.firstIndicator) {
    const params = indicatorMeta[indicatorCompare.value.firstIndicator].params
    firstIndicatorParams.value = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.default]),
    )
  }
}

const handleSecondIndicatorChange = () => {
  secondIndicatorParams.value = {}
  if (indicatorCompare.value.secondIndicator) {
    const params = indicatorMeta[indicatorCompare.value.secondIndicator].params
    secondIndicatorParams.value = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, value.default]),
    )
  }
}

// 지표 간 비교 저장
const saveIndicatorCompare = () => {
  const { firstIndicator, secondIndicator, operator } = indicatorCompare.value
  // null·undefined·'' 인 값이 하나라도 있으면
  if ([firstIndicator, secondIndicator, operator].some((v) => v == null || v === '')) {
    alert('값을 선택해주세요')
    return
  }

  const condition = {
    type: 'indicator_compare',
    params: {
      indicator: [indicatorCompare.value.firstIndicator, indicatorCompare.value.firstIndicator],
      operator: indicatorCompare.value.operator,
      settings: [firstIndicatorParams.value, secondIndicatorParams.value],
    },
  }

  if (activeCondition.value === 'buy') {
    strategyStore.addBuyCondition(condition)
  } else {
    strategyStore.addSellCondition(condition)
  }

  // 초기화
  indicatorCompare.value = {
    firstIndicator: '',
    secondIndicator: '',
    operator: '',
  }
  firstIndicatorParams.value = {}
  secondIndicatorParams.value = {}
}
</script>
