// src/composables/useChartUI.js
import { ref, computed } from 'vue'

export function useChartUI(props) {
  const currentPrice = ref(null)
  const previousPrice = ref(null)
  const dataDiv = ref(null)

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
  function updateDataDivWithCandle(candle) {
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

  return {
    currentPrice,
    previousPrice,
    dataDiv,
    formattedPrice,
    priceColorClass,
    updateDataDivWithCandle,
  }
}
