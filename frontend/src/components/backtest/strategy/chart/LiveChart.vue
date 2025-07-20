<!-- src/components/chart/LiveChart.vue -->
<template>
  <div class="relative h-full flex flex-col">
    <div
      v-if="isLoadingSpinner"
      class="absolute inset-0 flex items-center justify-center bg-black/70 dark:bg-gray-900/70 z-50"
      role="status"
    >
      <svg
        aria-hidden="true"
        class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

    <div class="bg-[#161A25] p-3 flex flex-wrap items-center">
      <span class="text-2xl font-bold">{{ symbol.toUpperCase() }}</span>
      <span class="text-xl font-bold ml-2">. {{ exchange.toUpperCase() }}</span>
      <span v-if="currentPrice !== null" :class="priceColorClass" class="text-xl ml-4">
        {{ formattedPrice }}
      </span>
    </div>

    <div class="relative flex-1">
      <!-- 메인 캔들 차트 -->
      <div ref="chartContainer" class="w-full h-full"></div>

      <!-- legend -->
      <div ref="legend" class="absolute top-2 left-2 text-xs max-w-[90%] z-10">
        <div ref="dataDiv" class="flex flex-wrap items-center space-x-1"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, onUnmounted } from 'vue'
import { useChart, handleResize } from '@/composables/useChart'
import { useCandleData } from '@/composables/useCandleData'
import { useChartUI } from '@/composables/useChartUI'
import { intervalToSeconds } from '@/constants/chart'

const isLoadingSpinner = ref(false)

const props = defineProps({
  symbol: { type: String, required: true },
  exchange: { type: String, required: true },
  interval: { type: String, required: true },
})

const chartContainer = ref(null)
const legend = ref(null)
const candleSeries = ref(null)

// initChartWithInitialCandles 밖에서도 사용할 수 있게 스코프 선언
let updateAllSeries, activeSeries

const { chart, initChart, cleanup: cleanupChart } = useChart(chartContainer, props)

const {
  currentCandles,
  oldestTime,
  isLoading,
  loadInitialCandlesFromBinance,
  loadOlderCandlesFromTimescale,
  connectWebSocket,
  cleanup: cleanupData,
} = useCandleData(props)

const {
  currentPrice,
  previousPrice,
  dataDiv,
  indicatorDiv,
  formattedPrice,
  priceColorClass,
  updateDataDivWithCandle,
  updateIndicatorDiv, // ← 추가
} = useChartUI(props)

const isHovering = ref(false)
const lastCandle = ref(null) // 마지막 캔들 정보를 저장할 ref 추가

async function initChartWithInitialCandles() {
  const { chart: chartInstance, candleSeries: series } = initChart()
  if (!chartInstance || !series) return

  candleSeries.value = series

  const initialCandles = await loadInitialCandlesFromBinance()
  currentCandles.value = [...initialCandles].sort((a, b) => a.time - b.time)
  series.setData(currentCandles.value)
  oldestTime.value = currentCandles.value[0]?.time || 0
  chartInstance.timeScale().fitContent()

  if (currentCandles.value.length) {
    currentPrice.value = currentCandles.value.slice(-1)[0].close
    lastCandle.value = currentCandles.value.slice(-1)[0] // 초기 마지막 캔들 설정
    updateDataDivWithCandle(lastCandle.value)
  }

  chartInstance.timeScale().subscribeVisibleTimeRangeChange(async () => {
    if (!chartInstance || isLoading.value) return
    const vis = chartInstance.timeScale().getVisibleRange()
    if (!vis?.from) return
    const fromTime = Math.floor(vis.from)
    const range = Math.floor(vis.to) - fromTime
    const limit = Math.min(1000, Math.ceil(range / intervalToSeconds[props.interval]))
    if (fromTime <= oldestTime.value) {
      isLoading.value = true
      const offsetMs = new Date().getTimezoneOffset() * 60 * 1000
      const utcSec = Math.floor((oldestTime.value * 1000 + offsetMs) / 1000)
      const older = await loadOlderCandlesFromTimescale(utcSec, limit)
      isLoading.value = false
      if (older.length) {
        const existing = new Set(currentCandles.value.map((c) => c.time))
        const filtered = older.filter((c) => !existing.has(c.time))
        currentCandles.value = [...filtered, ...currentCandles.value].sort(
          (a, b) => a.time - b.time,
        )
        series.setData(currentCandles.value)
        oldestTime.value = currentCandles.value[0].time
      }
    }
  })

  // 크로스헤어 이동 감지
  chartInstance.subscribeCrosshairMove((param) => {
    if (!dataDiv.value) return

    // 마우스가 차트를 벗어났거나 크로스헤어가 없을 때
    if (!param || param.time === null) {
      isHovering.value = false
      updateDataDivWithCandle(lastCandle.value) // 마지막 캔들 정보 표시
      return
    }

    // 마우스 위치의 캔들
    const candle = param.seriesData.get(series)
    if (candle) {
      isHovering.value = true
      updateDataDivWithCandle(candle) // 호버한 캔들 정보 표시
    } else {
      isHovering.value = false
      updateDataDivWithCandle(lastCandle.value) // 마지막 캔들 정보 표시
    }
  })
}

function handleWebSocketMessage(candle) {
  previousPrice.value = currentPrice.value
  currentPrice.value = candle.close

  const idx = currentCandles.value.findIndex((c) => c.time === candle.time)
  if (idx >= 0) {
    currentCandles.value[idx] = candle
    candleSeries.value?.update(candle)
  } else {
    currentCandles.value.push(candle)
    currentCandles.value.sort((a, b) => a.time - b.time)
    candleSeries.value?.update(candle)
  }

  // 마지막 캔들 정보 업데이트
  lastCandle.value = candle

  // 호버 중이 아닐 때만 업데이트
  if (!isHovering.value) {
    updateDataDivWithCandle(candle)
  }
}

function cleanup() {
  cleanupChart()
  cleanupData()
}

onMounted(async () => {
  isLoadingSpinner.value = true
  await initChartWithInitialCandles()
  connectWebSocket(handleWebSocketMessage)
  isLoadingSpinner.value = false
  onResize = () => handleResize(chartContainer)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => cleanup())

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
