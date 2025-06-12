<template>
  <div class="p-4 overflow-y-auto">
    <!-- 탭 메뉴 -->
    <div
      class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
    >
      <ul class="flex flex-wrap -mb-px">
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'recommended'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'recommended'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            추천 전략
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'indicator'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'indicator'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            지표 조건
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'indicator_compare'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'indicator_compare'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            지표 간 비교
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'price'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'price'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            가격 조건
          </a>
        </li>
      </ul>
    </div>

    <!-- 추천 전략 탭 -->
    <div v-if="activeTab === 'recommended'" class="mt-6">
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
        <div
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
        </div>

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

    <!-- 지표 조건 탭 -->
    <IndicatorConditionTab v-if="activeTab === 'indicator'" />

    <!-- 지표 간 비교 탭 -->
    <IndicatorCompareTab v-if="activeTab === 'indicator_compare'" />

    <!-- 가격 조건 탭 -->
    <PriceConditionTab v-if="activeTab === 'price'" />

    <!-- 전략 상세 모달 -->
    <StrategyDetailModal
      :show="showModal"
      :strategy-id="selectedStrategyId"
      @close="closeModal"
      @try-strategy="tryStrategy"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StrategyDetailModal from './StrategyDetailModal.vue'
import IndicatorConditionTab from './tabs/IndicatorConditionTab.vue'
import IndicatorCompareTab from './tabs/IndicatorCompareTab.vue'
import PriceConditionTab from './tabs/PriceConditionTab.vue'
import { useStrategyStore } from '@/stores/strategyStore'

const strategyStore = useStrategyStore()
const showModal = ref(false)
const selectedStrategyId = ref('')
const activeTab = ref('recommended')

const showStrategyDetail = (strategyId) => {
  selectedStrategyId.value = strategyId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedStrategyId.value = ''
}

const tryStrategy = (strategyId) => {
  const strategy = {
    buy: [],
    sell: []
  }

  switch (strategyId) {
    case 'ma_crossover':
      strategy.buy = [{
        type: 'ma_crossover',
        params: {
          shortPeriod: 20,
          longPeriod: 50
        }
      }]
      strategy.sell = [{
        type: 'ma_crossover',
        params: {
          shortPeriod: 20,
          longPeriod: 50
        }
      }]
      break
    case 'rsi':
      strategy.buy = [{
        type: 'rsi',
        params: {
          period: 14,
          oversold: 30
        }
      }]
      strategy.sell = [{
        type: 'rsi',
        params: {
          period: 14,
          overbought: 70
        }
      }]
      break
    case 'bollinger':
      strategy.buy = [{
        type: 'bollinger',
        params: {
          period: 20,
          stdDev: 2
        }
      }]
      strategy.sell = [{
        type: 'bollinger',
        params: {
          period: 20,
          stdDev: 2
        }
      }]
      break
    case 'macd':
      strategy.buy = [{
        type: 'macd',
        params: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9
        }
      }]
      strategy.sell = [{
        type: 'macd',
        params: {
          fastPeriod: 12,
          slowPeriod: 26,
          signalPeriod: 9
        }
      }]
      break
  }

  strategyStore.setBuyConditions(strategy.buy)
  strategyStore.setSellConditions(strategy.sell)
}
</script>
