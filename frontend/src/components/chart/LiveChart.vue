<!-- src/components/chart/LiveChart.vue -->
<template>
  <div class="h-full flex flex-col">
    <div class="bg-[#161A25] p-3 flex flex-wrap items-center">
      <span class="text-2xl font-bold">{{ symbol.toUpperCase() }}</span>
      <span class="text-xl font-bold ml-2">. {{ exchange.toUpperCase() }}</span>
      <span v-if="currentPrice !== null" :class="priceColorClass" class="text-xl ml-4">
        {{ formattedPrice }}
      </span>
    </div>

    <div class="relative flex-1">
      <!-- 메인 캔들 차트 -->
      <div ref="chartContainer" class="flex-1 chart-wrapper"></div>

      <!-- legend -->
      <div ref="legend" class="absolute top-2 left-2 text-xs max-w-[90%] z-10">
        <div ref="dataDiv" class="flex flex-wrap items-center space-x-1"></div>
        <div ref="indicatorDiv"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useChart } from '@/composables/useChart'
import { useCandleData } from '@/composables/useCandleData'
import { mapIndicators, useIndicators } from '@/composables/useIndicators'
import { useChartUI } from '@/composables/useChartUI'
import { intervalToSeconds } from '@/constants/chart'

const props = defineProps({
  symbol: { type: String, required: true },
  exchange: { type: String, required: true },
  interval: { type: String, required: true },
  indicators: { type: Array, required: [] },
})

const chartContainer = ref(null)
const legend = ref(null)
// initChartWithInitialCandles 밖에서도 사용할 수 있게 스코프 선언
let updateAllSeries, activeSeries

const {
  chart,
  candleSeries,
  indicatorSeries,
  initChart,
  cleanup: cleanupChart,
} = useChart(chartContainer, props)

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

async function initChartWithInitialCandles() {
  const { chart: chartInstance, candleSeries: series } = initChart()
  if (!chartInstance || !series) return
  ;({ updateAllSeries, activeSeries } = useIndicators(chartInstance, series, props))

  const initialCandles = await loadInitialCandlesFromBinance()
  currentCandles.value = [...initialCandles].sort((a, b) => a.time - b.time)
  series.setData(currentCandles.value)
  oldestTime.value = currentCandles.value[0]?.time || 0
  chartInstance.timeScale().fitContent()

  if (currentCandles.value.length) {
    currentPrice.value = currentCandles.value.slice(-1)[0].close
    updateDataDivWithCandle(currentCandles.value.slice(-1)[0])
  }
  updateAllSeries(currentCandles.value)

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
        updateAllSeries(currentCandles.value)
      }
    }
  })

  chartInstance.subscribeCrosshairMove((param) => {
    if (!dataDiv.value) return

    // console.log('hello', param)
    // 캔들 평소 동작
    if (!param || param.time === null) {
      updateDataDivWithCandle(currentCandles.value.slice(-1)[0])
      // 지표도 마지막 값으로 업데이트

      const lastMap =
        {} +
        props.indicators.forEach((key) => {
          if (key === 'macd') {
            const hS = activeSeries.macdHist
            const lS = activeSeries.macdLine
            const sS = activeSeries.macdSignal

            const hV = hS && param.seriesData.get(hS)?.value
            const lV = lS && param.seriesData.get(lS)?.value
            const sV = sS && param.seriesData.get(sS)?.value

            valuesMap.macd = {
              hist: hV ?? null,
              macd: lV ?? null,
              signal: sV ?? null,
            }
          } else {
            const s = activeSeries[key]
            const p = s && param.seriesData.get(s)
            valuesMap[key] = p?.value ?? null
          }
        })
      updateIndicatorDiv(lastMap)
      return
    }

    // 마우스 위치의 캔들
    const candle = param.seriesData.get(series)
    if (candle) {
      updateDataDivWithCandle(candle)
      // 지표 값도 함께 뽑아서 업데이트
      const valuesMap = {}
      props.indicators.forEach((key) => {
        if (key === 'macd') {
          const hS = activeSeries.macdHist
          const lS = activeSeries.macdLine
          const sS = activeSeries.macdSignal

          const hV = hS && param.seriesData.get(hS)?.value
          const lV = lS && param.seriesData.get(lS)?.value
          const sV = sS && param.seriesData.get(sS)?.value

          valuesMap.macd = {
            hist: hV ?? null,
            macd: lV ?? null,
            signal: sV ?? null,
          }
        } else {
          const s = activeSeries[key]
          const p = s && param.seriesData.get(s)
          valuesMap[key] = p?.value ?? null
        }
      })
      updateIndicatorDiv(valuesMap)
    }
  })
}

function handleWebSocketMessage(candle) {
  previousPrice.value = currentPrice.value
  currentPrice.value = candle.close

  const idx = currentCandles.value.findIndex((c) => c.time === candle.time)
  if (idx >= 0) currentCandles.value[idx] = candle
  else currentCandles.value.push(candle)
  currentCandles.value.sort((a, b) => a.time - b.time)
  candleSeries.value.setData(currentCandles.value)
  updateDataDivWithCandle(candle)
  updateAllSeries(currentCandles.value)
}

function cleanup() {
  cleanupChart()
  cleanupData()
}

onMounted(async () => {
  await initChartWithInitialCandles()
  connectWebSocket(handleWebSocketMessage)
})

// ① props.indicators 변경 감지 → 즉시 렌더
watch(
  () => props.indicators,
  (newList, oldList) => {
    // updateAllSeries가 아직 할당되지 않았으면 아무 것도 안 함
    if (typeof updateAllSeries !== 'function') return

    // 1) 차트 위 지표 라인들 업데이트/생성/삭제
    updateAllSeries(currentCandles.value)

    // 2) UI 영역에도 마지막 지표 값 바로 보여주기
    /* … */
  },
  {
    deep: true,
    immediate: false, // 또는 immediate를 false로 변경
  },
)

// props.indicators가 변경될 때마다 indicatorDiv 강제 갱신
watch(
  () => props.indicators,
  (newInds) => {
    if (!indicatorDiv.value) return

    // 1) 지표가 하나도 없으면 즉시 비우기
    if (newInds.length === 0) {
      indicatorDiv.value.innerHTML = ''
      return
    }

    // 2) 남은 지표만 다시 렌더링
    const lastMap = {}
    newInds.forEach((key) => {
      if (key === 'macd') {
        const hS = activeSeries.macdHist
        const lS = activeSeries.macdLine
        const sS = activeSeries.macdSignal

        const hV = hS && param.seriesData.get(hS)?.value
        const lV = lS && param.seriesData.get(lS)?.value
        const sV = sS && param.seriesData.get(sS)?.value

        valuesMap.macd = {
          hist: hV ?? null,
          macd: lV ?? null,
          signal: sV ?? null,
        }
      } else {
        const s = activeSeries[key]
        const p = s && param.seriesData.get(s)
        valuesMap[key] = p?.value ?? null
      }
    })
    updateIndicatorDiv(lastMap)
  },
  { deep: true, immediate: true },
)

onBeforeUnmount(() => cleanup())
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>
