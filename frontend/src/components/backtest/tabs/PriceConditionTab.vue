<template>
  <div class="mt-6">
    <h3 class="text-xl font-semibold text-white mb-4">가격 조건</h3>

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

    <!-- 가격 조건 설정 -->
    <div class="bg-gray-800 rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">가격 타입</label>
          <select
            v-model="priceCondition.priceType"
            class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="option in priceTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">연산자</label>
            <select
              v-model="priceCondition.operator"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="option in operatorOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-300 mb-2">가격</label>
            <input
              v-model="priceCondition.price"
              type="number"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2.5 border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              placeholder="가격을 입력하세요"
            />
          </div>
        </div>
      </div>

      <!-- 조건 저장 버튼 -->
      <button
        @click="savePriceCondition"
        class="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-800 mt-6"
      >
        조건 저장하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStrategyStore } from '@/stores/strategyStore'

const strategyStore = useStrategyStore()
const activeCondition = ref('buy')

// 가격 타입 옵션
const priceTypeOptions = ref([
  { value: 'close', label: '종가' },
  { value: 'open', label: '시가' },
  { value: 'high', label: '고가' },
  { value: 'low', label: '저가' }
])

// 연산자 옵션
const operatorOptions = ref([
  { value: '>', label: '초과' },
  { value: '<', label: '미만' },
  { value: '>=', label: '이상' },
  { value: '<=', label: '이하' },
  { value: '==', label: '같음' }
])

// 가격 조건 관련 상태
const priceCondition = ref({
  priceType: 'close',
  operator: '>',
  price: ''
})

// 가격 조건 저장
const savePriceCondition = () => {
  const condition = {
    type: 'price',
    params: {
      priceType: priceCondition.value.priceType,
      operator: priceCondition.value.operator,
      price: Number(priceCondition.value.price)
    }
  }

  if (activeCondition.value === 'buy') {
    strategyStore.addBuyCondition(condition)
  } else {
    strategyStore.addSellCondition(condition)
  }

  // 초기화
  priceCondition.value = {
    priceType: 'close',
    operator: '>',
    price: ''
  }
}
</script> 