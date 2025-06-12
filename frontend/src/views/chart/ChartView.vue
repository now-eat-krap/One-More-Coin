<!-- src/views/RealTimeView.vue -->
<template>
  <!-- 최상위: 화면 전체 높이, 세로 레이아웃 -->
  <div class="flex flex-col h-screen">
    <!-- 헤더 (고정 높이) -->
    <div class="flex-none p-2 border-b border-gray-700">
      <div class="flex items-center space-x-6">
        <RouterLink to="/" class="inline-block hover:opacity-80 transition-opacity">
          <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
        </RouterLink>

        <!-- 코인 심볼 선택 버튼 -->
        <div class="relative">
          <button
            @click="showSymbolModal = true"
            class="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <span class="font-medium">{{ chartSettings.symbol.toUpperCase() }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <!-- 시간 선택 드롭다운 -->
        <div class="relative">
          <select
            v-model="chartSettings.interval"
            class="px-4 py-2 text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer appearance-none pr-10 bg-no-repeat bg-[length:1em] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'white\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'%3e%3cpolyline points=\\'6 9 12 15 18 9\\'%3e%3c/polyline%3e%3c/svg%3e')]"
          >
            <option value="1m">1분</option>
            <option value="5m">5분</option>
            <option value="15m">15분</option>
            <option value="1h">1시간</option>
            <option value="4h">4시간</option>
            <option value="1w">1주</option>
            <option value="1M">1개월</option>
          </select>
          <!-- 화살표 아이콘 추가 -->
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <!-- 지표 선택 버튼 -->
        <div class="relative">
          <button
            @click="showIndicatorModal = true"
            class="flex items-center space-x-2 px-4 py-2 text-white rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <span class="font-medium">
              지표<span v-if="chartSettings.indicators.length">
                ({{ chartSettings.indicators.length }})</span
              >
            </span>
          </button>
        </div>

        <!-- 선택된 지표 태그들 -->
        <div class="mt-2 flex flex-wrap space-x-2">
          <span
            v-for="(id, index) in chartSettings.indicators"
            :key="`${id}-${index}`"
            class="bg-gray-700 text-white px-2 py-1 rounded flex items-center space-x-1"
          >
            <span>{{ indicatorsMap[id].name }}</span>
            <button @click="removeIndicator(index)" class="hover:text-red-400">&times;</button>
          </span>
        </div>
      </div>
    </div>

    <!-- 심볼 선택 모달 -->
    <div
      v-if="showSymbolModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-6 rounded-xl w-[600px] border border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-white">코인 선택</h3>
          <button
            @click="showSymbolModal = false"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- 검색 입력창 -->
        <div class="relative mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="코인명, 심볼, 거래소 검색..."
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- 심볼 목록 -->
        <div
          class="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
        >
          <div
            v-for="coin in filteredCoins"
            :key="coin.symbol"
            @click="selectSymbol(coin)"
            class="p-3 hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="font-medium text-white">{{ coin.symbol.toUpperCase() }}</span>
                <span class="text-gray-400 text-sm">{{ coin.name }}</span>
              </div>
              <span class="text-gray-400 text-sm">{{ coin.exchange }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 지표 선택 모달 -->
    <div
      v-if="showIndicatorModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-6 rounded-xl w-[600px] border border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-white">지표 선택</h3>
          <button
            @click="showIndicatorModal = false"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="relative mb-4">
          <input
            v-model="indicatorSearchQuery"
            type="text"
            placeholder="지표 검색..."
            class="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div
          class="max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
        >
          <div
            v-for="indicator in filteredIndicators"
            :key="indicator.id"
            @click="selectIndicator(indicator.id)"
            class="p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div>
                <span class="font-medium text-white">{{ indicator.name }}</span>
                <div class="text-gray-400 text-sm">{{ indicator.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 본문: 헤더 아래 남은 공간을 차지, 스크롤 없이 꽉 채움 -->
    <div class="flex-1 flex flex-row">
      <!-- 좌측 4/5 -->
      <div class="flex flex-col w-3/4 h-full">
        <!-- 상단 차트 영역 -->
        <div class="flex-1 border-3 border-gray-700">
          <div class="real-time-container h-full">
            <LiveChart
              :key="`${chartSettings.symbol}-${chartSettings.interval}-${chartSettings.exchange}`"
              :symbol="chartSettings.symbol"
              :interval="chartSettings.interval"
              :exchange="chartSettings.exchange.toLowerCase()"
              :indicators="chartSettings.indicators"
            />
          </div>
        </div>
        <!-- 하단 백테스트 영역: 높이 동일하게 분할하지 않고 필요에 따라 조정 -->
        <div class="border-3 border-gray-700 h-1/2 p-4">
          <BacktestConfig
            :symbol="chartSettings.symbol"
            :exchange="chartSettings.exchange"
            :interval="chartSettings.interval"
            :indicators="chartSettings.indicators"
            :strategy="currentStrategy"
            @backtest-complete="handleBacktestComplete"
          />
        </div>
      </div>

      <!-- 우측 1/5 -->
      <div class="border-3 border-gray-700 w-1/4 h-full">
        <RecommendedStrategies
          :selected-indicators="chartSettings.indicators"
          @select-strategy="handleStrategySelect"
          @save-strategy="handleSaveStrategy"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import LiveChart from '@/components/chart/LiveChart.vue'
import BacktestConfig from '@/components/backtest/BacktestConfig.vue'
import RecommendedStrategies from '@/components/backtest/RecommendedStrategies.vue'
import axios from 'axios'

// 로컬스토리지 키
const STORAGE_KEYS = {
  SYMBOL: 'omc_selectedSymbol',
  EXCHANGE: 'omc_selectedExchange',
  INTERVAL: 'omc_selectedInterval',
  INDICATORS: 'omc_selectedIndicators',
}

// 차트 설정 상태
const chartSettings = ref({
  symbol: localStorage.getItem(STORAGE_KEYS.SYMBOL) || 'btcusdt',
  exchange: localStorage.getItem(STORAGE_KEYS.EXCHANGE) || 'Binance',
  interval: localStorage.getItem(STORAGE_KEYS.INTERVAL) || '1m',
  indicators: JSON.parse(localStorage.getItem(STORAGE_KEYS.INDICATORS) || '[]'),
})

// 선택된 코인 정보
const selectedCoin = computed(() => ({
  symbol: chartSettings.value.symbol,
  name: coins.find((c) => c.symbol === chartSettings.value.symbol)?.name || '',
  exchange: chartSettings.value.exchange,
}))

// 모달 / 검색 상태
const showSymbolModal = ref(false)
const showIndicatorModal = ref(false)
const searchQuery = ref('')
const indicatorSearchQuery = ref('')

// 데이터 배열
const coins = [
  { symbol: 'btcusdt', name: 'Bitcoin', exchange: 'Binance' },
  { symbol: '추가 예정', name: '조금만 기다려주세요...', exchange: 'One-More-Coin' },
]

const indicators = [
  {
    id: 'ma',
    name: '이동평균선 (MA)',
    description: '단순 이동평균선',
    category: '추세',
    params: ['period'],
  },
  {
    id: 'ema',
    name: '지수이동평균선 (EMA)',
    description: '지수 이동평균선',
    category: '추세',
    params: ['period'],
  },
  { id: 'rsi', name: 'RSI', description: '상대강도지수', category: '모멘텀', params: ['period'] },
  {
    id: 'macd',
    name: 'MACD',
    description: '이동평균수렴확산지수',
    category: '모멘텀',
    params: ['fastPeriod', 'slowPeriod', 'signalPeriod'],
  },
  {
    id: 'bollinger',
    name: '볼린저 밴드',
    description: '볼린저 밴드',
    category: '변동성',
    params: ['period', 'stdDev'],
  },
]

// 검색 필터
const filteredCoins = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return coins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.exchange.toLowerCase().includes(q),
  )
})

const filteredIndicators = computed(() => {
  const q = indicatorSearchQuery.value.toLowerCase()
  return indicators.filter(
    (i) =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q),
  )
})

// 인디케이터 이름 빠른조회용 맵
const indicatorsMap = Object.fromEntries(indicators.map((i) => [i.id, i]))

// localStorage 동기화
watch(
  chartSettings,
  (newSettings) => {
    localStorage.setItem(STORAGE_KEYS.SYMBOL, newSettings.symbol)
    localStorage.setItem(STORAGE_KEYS.EXCHANGE, newSettings.exchange)
    localStorage.setItem(STORAGE_KEYS.INTERVAL, newSettings.interval)
    localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(newSettings.indicators))
  },
  { deep: true },
)

// 선택 핸들러
function selectSymbol(coin) {
  chartSettings.value.symbol = coin.symbol
  chartSettings.value.exchange = coin.exchange
  showSymbolModal.value = false
  searchQuery.value = ''
}

function selectIndicator(id) {
  chartSettings.value.indicators.push(id)
  localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(chartSettings.value.indicators))
  showIndicatorModal.value = false
  indicatorSearchQuery.value = ''
}

function removeIndicator(index) {
  chartSettings.value.indicators.splice(index, 1)
  localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(chartSettings.value.indicators))
}

// 백테스트, 전략 핸들러
function handleBacktestComplete(results) {
  console.log('Backtest results:', results)
}

function handleStrategySelect(strategyId) {
  console.log('Selected strategy:', strategyId)
}

// script setup 내부에 추가
const currentStrategy = ref({})

const handleSaveStrategy = (strategy) => {
  console.log('Strategy saved:', strategy)
  currentStrategy.value = strategy
}
</script>

<style scoped>
/* 모든 스타일이 Tailwind 클래스로 이동되었습니다 */
select option {
  background-color: #1f2937; /* bg-gray-800 */
  color: white;
}

select option:hover {
  background-color: #374151; /* bg-gray-700 */
}
</style>
