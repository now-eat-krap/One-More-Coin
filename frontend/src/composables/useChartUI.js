// src/composables/useChartUI.js
import { ref, computed } from 'vue'
import { mapIndicators } from '@/composables/useIndicators' // 지표 메타정보 가져오기

export function useChartUI(props) {
  const currentPrice = ref(null)
  const previousPrice = ref(null)
  const dataDiv = ref(null)
  const indicatorDiv = ref(null)

  const formattedPrice = computed(() => {
    if (currentPrice.value === null) return ''
    return currentPrice.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  })

  const priceColorClass = computed(() => {
    if (previousPrice.value === null) return 'text-white'
    return currentPrice.value > previousPrice.value ? 'text-green-400' : 'text-red-400'
  })

  /**
   * 차트 아래 데이터 영역 업데이트
   */
  function updateDataDivWithCandle(candle, indicatorValue = null) {
    if (!dataDiv.value || !candle) return

    // 서울 시간대 보정
    const date = new Date((candle.time - 32400) * 1000)
    const dateStr =
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('/') +
      ' ' +
      String(date.getHours()).padStart(2, '0') +
      ':' +
      String(date.getMinutes()).padStart(2, '0')

    const isBull = candle.close >= candle.open
    const colorClass = isBull ? 'text-green-400' : 'text-red-400'

    dataDiv.value.innerHTML = `
      <span class="text-gray-400">${dateStr}</span>
      <span class="text-gray-400 ml-2">Open:</span>
        <span class="${colorClass} ml-1">${candle.open.toFixed(2)}</span>
      <span class="text-gray-400 ml-2">High:</span>
        <span class="${colorClass} ml-1">${candle.high.toFixed(2)}</span>
      <span class="text-gray-400 ml-2">Low:</span>
        <span class="${colorClass} ml-1">${candle.low.toFixed(2)}</span>
      <span class="text-gray-400 ml-2">Close:</span>
        <span class="${colorClass} ml-1">${candle.close.toFixed(2)}</span>
    `
  }

  /**
   * 지표 영역 업데이트
   * @param {{ [key: string]: number|null }} valuesMap  // { ma: 1234.56, ema: 1230.12, macd: -0.45, ... }
   */
  function updateIndicatorDiv(valuesMap) {
    if (!indicatorDiv.value) return
    indicatorDiv.value.innerHTML = ''

    props.indicators.forEach((key) => {
      const cfg = mapIndicators[key]
      const raw = valuesMap[key]
      if (raw == null) return

      // ① MACD composite
      if (key === 'macd' && typeof raw === 'object') {
        const items = [
          { label: 'Hist', value: raw.hist, color: cfg.color },
          { label: 'MACD', value: raw.macd, color: cfg.color },
          { label: 'Signal', value: raw.signal, color: cfg.color },
        ]
        const el = document.createElement('div')
        el.className = `indicator-item pane-${cfg.paneIndex}`
        el.innerHTML = `<span class="text-gray-400 font-medium">
              MACD : 
            </span>`

        items.forEach((item) => {
          console.log(item.color)
          el.innerHTML += `
            <span>${item.value != null ? item.value.toFixed(2) : '-'}</span>
          `
          indicatorDiv.value.appendChild(el)
        })
        return
      }

      // ② all other simple indicators
      const display = raw != null ? raw.toFixed(2) : '-'
      const el = document.createElement('div')
      el.className = `indicator-item pane-${cfg.paneIndex}`
      el.innerHTML = `
        <span class="text-${cfg.color}-400 font-medium">
          ${cfg.name}:
        </span>
        <span>${display}</span>
      `
      indicatorDiv.value.appendChild(el)
    })
  }

  return {
    currentPrice,
    previousPrice,
    dataDiv,
    indicatorDiv,
    formattedPrice,
    priceColorClass,
    updateDataDivWithCandle,
    updateIndicatorDiv,
  }
}
