<!-- src/components/TradingViewWidget.vue -->
<template>
  <div ref="container" class="tradingview-widget-container" style="height: 100%; width: 100%">
    <!-- 위젯이 그려질 영역 -->
    <div
      class="tradingview-widget-container__widget"
      style="height: calc(100% - 32px); width: 100%"
    ></div>
    <div class="tradingview-widget-copyright">
      <a href="https://kr.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">트레이딩뷰에서 모든 시장 추적</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

// props 로 심볼·인터벌·거래소 전달
const props = defineProps({
  symbol: { type: String, required: true },
  interval: { type: String, required: true },
  exchange: { type: String, required: true },
})

const container = ref(null)

function loadWidget() {
  if (!container.value) return

  // (1) 컨테이너 안을 완전히 비웁니다
  container.value.innerHTML = `
    <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
  `

  // (2) 스크립트 태그 생성
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
  script.async = true

  const intervalMap = {
    '1m': '1',
    '5m': '5',
    '15m': '15',
    '1h': '60',
    '4h': '240',
    '1d': 'D',
    '1w': 'W',
    '1M': 'M',
  }

  // 👉 innerHTML 에는 JSON 설정만! JS 코드가 들어가면 JSON.parse 에 실패합니다.
  script.innerHTML = JSON.stringify({
    allow_symbol_change: false,
    calendar: false,
    details: false,
    hide_side_toolbar: true,
    hide_top_toolbar: true,
    hide_legend: false,
    hide_volume: true,
    hotlist: false,
    interval: intervalMap[props.interval] || 'D',
    locale: 'kr',
    save_image: false,
    style: '1',
    symbol: props.exchange.toUpperCase() + ':' + props.symbol.toUpperCase(),
    theme: 'dark',
    timezone: 'Asia/Seoul',
    backgroundColor: '#0F0F0F',
    gridColor: 'rgba(242, 242, 242, 0.06)',
    watchlist: [],
    withdateranges: false,
    compareSymbols: [],
    studies: [],
    autosize: true,
  })

  // (3) 맨 마지막에 붙여 줍니다
  container.value.appendChild(script)
}

onMounted(() => {
  loadWidget()
})

// props 가 바뀔 때마다 재로딩
watch(
  () => [props.symbol, props.interval, props.exchange],
  () => {
    loadWidget()
  },
)
</script>

<style scoped>
.tradingview-widget-container {
  position: relative;
}
</style>
