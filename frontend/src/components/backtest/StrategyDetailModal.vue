<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="bg-gray-800 p-6 rounded-xl w-[800px] max-h-[90vh] overflow-y-auto border border-gray-700"
    >
      <!-- 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-white">{{ strategy.name }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-white transition-colors">
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

      <!-- 전략 설명 -->
      <div class="mb-6">
        <h4 class="text-lg font-medium text-white mb-2">전략 설명</h4>
        <p class="text-gray-300">{{ strategy.description }}</p>
      </div>

      <!-- 전략 파라미터 -->
      <div class="mb-6">
        <h4 class="text-lg font-medium text-white mb-2">주요 파라미터</h4>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="(param, key) in strategy.parameters"
            :key="key"
            class="bg-gray-700/50 p-3 rounded-lg"
          >
            <div class="text-gray-300 font-medium">{{ param.name }}</div>
            <div class="text-gray-400 text-sm">{{ param.description }}</div>
          </div>
        </div>
      </div>

      <!-- 차트 예시 -->
      <div class="mb-6">
        <h4 class="text-lg font-medium text-white mb-2">차트 예시</h4>
        <div class="bg-gray-900 rounded-lg">
          <img
            :src="strategy.chartExample"
            :alt="strategy.name + ' 차트 예시'"
            class="w-full rounded-lg"
          />
        </div>
      </div>

      <!-- 매매 시그널 설명 -->
      <div class="mb-6">
        <h4 class="text-lg font-medium text-white mb-2">매매 시그널</h4>
        <div class="space-y-3">
          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg
                class="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p class="text-gray-300">{{ strategy.buySignal }}</p>
          </div>
          <div class="flex items-start space-x-3">
            <div
              class="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1"
            >
              <svg
                class="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p class="text-gray-300">{{ strategy.sellSignal }}</p>
          </div>
        </div>
      </div>

      <!-- 시험해보기 버튼 -->
      <div class="flex justify-end">
        <button
          @click="tryStrategy"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          시험해보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStrategyStore } from '@/stores/strategyStore'

const strategyStore = useStrategyStore()

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  strategyId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['close'])

// 전략 정보
const strategy = computed(() => {
  const strategies = {
    ma_crossover: {
      name: '이동평균선 크로스오버',
      description:
        '단기 이동평균선이 장기 이동평균선을 상향 돌파할 때 매수하고, 하향 돌파할 때 매도하는 전략입니다. 추세 추종형 전략으로, 강한 상승/하락 추세에서 효과적입니다.',
      parameters: [
        {
          name: '단기 이동평균선 기간',
          description: '단기 이동평균선의 기간을 설정합니다. (기본값: 10일)',
        },
        {
          name: '장기 이동평균선 기간',
          description: '장기 이동평균선의 기간을 설정합니다. (기본값: 20일)',
        },
      ],
      chartExample: '/recommend/ma_crossover.png',
      buySignal: '단기 이동평균선이 장기 이동평균선을 상향 돌파할 때',
      sellSignal: '단기 이동평균선이 장기 이동평균선을 하향 돌파할 때',
    },
    rsi: {
      name: 'RSI 과매수/과매도',
      description:
        'RSI(상대강도지수)가 과매도 구간에서 반등할 때 매수하고, 과매수 구간에서 하락할 때 매도하는 전략입니다. 반등 매매에 적합한 전략입니다.',
      parameters: [
        {
          name: 'RSI 기간',
          description: 'RSI 계산에 사용할 기간을 설정합니다. (기본값: 14일)',
        },
        {
          name: '과매수 기준',
          description: '과매수로 판단할 RSI 기준값을 설정합니다. (기본값: 70)',
        },
        {
          name: '과매도 기준',
          description: '과매도로 판단할 RSI 기준값을 설정합니다. (기본값: 30)',
        },
      ],
      chartExample: '/recommend/rsi.png',
      buySignal: 'RSI가 과매도 구간(30 이하)에서 반등할 때',
      sellSignal: 'RSI가 과매수 구간(70 이상)에서 하락할 때',
    },
    // bollinger: {
    //   name: '볼린저 밴드 반전',
    //   description:
    //     '가격이 볼린저 밴드의 하단을 터치하면 매수하고, 상단을 터치하면 매도하는 전략입니다. 변동성 돌파 전략으로 적합합니다.',
    //   parameters: [
    //     {
    //       name: '기간',
    //       description: '볼린저 밴드 계산에 사용할 기간을 설정합니다. (기본값: 20일)',
    //     },
    //     {
    //       name: '표준편차 승수',
    //       description: '볼린저 밴드의 폭을 결정하는 표준편차 승수를 설정합니다. (기본값: 2)',
    //     },
    //   ],
    //   chartExample: '/images/strategies/bollinger.png',
    //   buySignal: '가격이 하단 밴드를 터치하고 반등할 때',
    //   sellSignal: '가격이 상단 밴드를 터치하고 하락할 때',
    // },
    macd: {
      name: 'MACD 크로스오버',
      description:
        'MACD 라인이 시그널 라인을 상향 돌파할 때 매수하고, 하향 돌파할 때 매도하는 전략입니다. 추세 전환을 포착하는데 효과적입니다.',
      parameters: [
        {
          name: '빠른 이동평균선 기간',
          description: 'MACD의 빠른 이동평균선 기간을 설정합니다. (기본값: 12일)',
        },
        {
          name: '느린 이동평균선 기간',
          description: 'MACD의 느린 이동평균선 기간을 설정합니다. (기본값: 26일)',
        },
        {
          name: '시그널 기간',
          description: '시그널 라인의 기간을 설정합니다. (기본값: 9일)',
        },
      ],
      chartExample: '/recommend/macd.png',
      buySignal: 'MACD 라인이 시그널 라인을 상향 돌파할 때',
      sellSignal: 'MACD 라인이 시그널 라인을 하향 돌파할 때',
    },
  }
  return strategies[props.strategyId] || {}
})

const tryStrategy = () => {
  save(props.strategyId)
  console.log(props.strategyId)
  emit('close')
}

const save = (id) => {
  switch (id) {
    case 'ma_crossover':
      strategyStore.addBuyCondition({
        type: 'indicator_compare',
        params: {
          indicator: ['sma', 'sma'],
          operator: 'crossover',
          settings: [
            {
              period: 10,
            },
            {
              period: 20,
            },
          ],
        },
      })
      strategyStore.addSellCondition({
        type: 'indicator_compare',
        params: {
          indicator: ['sma', 'sma'],
          operator: 'crossunder',
          settings: [
            {
              period: 10,
            },
            {
              period: 20,
            },
          ],
        },
      })
      break
    case 'rsi':
      strategyStore.addBuyCondition({
        type: 'indicator',
        params: {
          indicator: ['rsi'],
          operator: 'crossover',
          settings: [
            {
              period: 14,
            },
          ],
          oversold: 30,
        },
      })
      strategyStore.addSellCondition({
        type: 'indicator',
        params: {
          indicator: ['rsi'],
          operator: 'crossunder',
          settings: [
            {
              period: 14,
            },
          ],
          oversold: 70,
        },
      })
      break
    case 'macd':
      strategyStore.addBuyCondition({
        type: 'indicator',
        params: {
          indicator: ['macd'],
          operator: 'crossover',
          settings: [
            {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9,
            },
          ],
          oversold: 0,
        },
      })
      strategyStore.addSellCondition({
        type: 'indicator',
        params: {
          indicator: ['macd'],
          operator: 'crossunder',
          settings: [
            {
              fastPeriod: 12,
              slowPeriod: 26,
              signalPeriod: 9,
            },
          ],
          oversold: 0,
        },
      })
      break
  }
}
</script>
