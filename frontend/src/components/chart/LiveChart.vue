<template>
  <!-- 캔들 차트가 그려질 컨테이너 -->
  <div ref="chartContainer" class="chart-wrapper h-full"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import axios from 'axios'
import { createChart, CrosshairMode, CandlestickSeries } from 'lightweight-charts'

// ----------------------
// 1) 상수 설정
// ----------------------
// ----------------------
// 1) Props 정의
// ----------------------
const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  initialLimit: {
    type: Number,
    default: 10000, // 과거 불러올 캔들 총 개수(기본)
  },
})

console.log('hello', props.symbol, props.interval)

const symbol = props.symbol // 소문자 심볼
const interval = props.interval // 캔들 간격
const totalCount = 10000 // 불러올 캔들 총 개수
const pageLimit = 1000 // 한 번에 가져올 수 있는 최대 개수 (Binance 제한)

// ----------------------
// 2) ref & 변수 선언
// ----------------------
const chartContainer = ref(null)
let chart = null
let candleSeries = null
let ws = null

// ----------------------
// 3) 페이징으로 과거 캔들 데이터 불러오기
// ----------------------
async function fetchHistoricalDataPaged() {
  const candles = []
  let fetched = 0
  let endTime = undefined

  // USDT-M 선물용
  // let url =
  //   `https://fapi.binance.com/fapi/v1/klines` +
  //   `?symbol=${symbol.toUpperCase()}` +
  //   `&interval=${interval}` +
  //   `&limit=${limit}`

  while (fetched < totalCount) {
    const limit = Math.min(pageLimit, totalCount - fetched)
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
    if (endTime !== undefined) {
      url += `&endTime=${endTime}`
    }
    const resp = await axios.get(url)
    if (!resp.data || resp.data.length === 0) break

    const batch = resp.data.map((arr) => ({
      time: arr[0] / 1000,
      open: parseFloat(arr[1]),
      high: parseFloat(arr[2]),
      low: parseFloat(arr[3]),
      close: parseFloat(arr[4]),
    }))
    candles.push(...batch)
    fetched += batch.length
    endTime = resp.data[resp.data.length - 1][0] - 1
  }

  // 정렬
  candles.sort((a, b) => a.time - b.time)

  // 중복 제거 (같은 time 값이 있으면 첫 번째만 남김)
  const unique = []
  for (const c of candles) {
    if (unique.length === 0 || unique[unique.length - 1].time !== c.time) {
      unique.push(c)
    }
  }

  return unique
}

// ----------------------
// 4) 차트 초기화 (과거 데이터 포함)
// ----------------------
async function initChartWithHistory() {
  if (!chartContainer.value) return

  chart = createChart(chartContainer.value, {
    width: chartContainer.value.clientWidth,
    // height: 450,
    layout: {
      background: { type: 'solid', color: '#161A25' },
      textColor: '#FFFFFF',
    },
    grid: {
      vertLines: { color: '#313540' },
      horzLines: { color: '#313540' },
    },
    crosshair: {
      mode: CrosshairMode.Normal,
    },
    rightPriceScale: {
      //   borderColor: '#cccccc',
    },
    timeScale: {
      //   borderColor: '#cccccc',
      timeVisible: true,
      secondsVisible: false,
    },
  })

  if (!chart || typeof chart.addSeries !== 'function') return

  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  })

  const history = await fetchHistoricalDataPaged()
  if (history.length > 0 && candleSeries) {
    candleSeries.setData(history)
    chart.timeScale().fitContent()
  }

  window.addEventListener('resize', resizeChart)
}

// ----------------------
// 5) 차트 리사이즈
// ----------------------
function resizeChart() {
  if (chart && chartContainer.value) {
    chart.applyOptions({ width: chartContainer.value.clientWidth })
  }
}

// ----------------------
// 6) WebSocket 연결 및 실시간 업데이트
// ----------------------
function connectWebSocket() {
  const endpoint = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`
  ws = new WebSocket(endpoint)

  ws.onopen = () => {
    console.log(`[WebSocket] Connected: ${endpoint}`)
  }

  ws.onmessage = (event) => {
    if (!candleSeries) return
    try {
      const raw = JSON.parse(event.data)
      const k = raw.k
      const candle = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      }
      candleSeries.update(candle)
    } catch {
      // 파싱 오류 무시
    }
  }

  ws.onerror = (err) => {
    console.error('[WebSocket] Error:', err)
  }

  ws.onclose = () => {
    console.log('[WebSocket] Closed')
  }
}

// ----------------------
// 7) 정리 (언마운트 시)
// ----------------------
function cleanup() {
  if (ws) ws.close()
  window.removeEventListener('resize', resizeChart)
  if (chart) {
    chart.remove()
    chart = null
    candleSeries = null
  }
}

onMounted(async () => {
  await initChartWithHistory()
  connectWebSocket()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped></style>
