import { ref } from 'vue'
import axios from 'axios'

export function useCandleData(props) {
  const currentCandles = ref([])
  const oldestTime = ref(null)
  const isLoading = ref(false)
  const ws = ref(null)

  const loadInitialCandlesFromBinance = async () => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${props.symbol.toUpperCase()}&interval=${props.interval}&limit=50`
    const resp = await axios.get(url)
    const offsetMs = new Date().getTimezoneOffset() * 60 * 1000

    return resp.data.map((arr) => ({
      time: (arr[0] - offsetMs) / 1000,
      open: parseFloat(arr[1]),
      high: parseFloat(arr[2]),
      low: parseFloat(arr[3]),
      close: parseFloat(arr[4]),
      volume: parseFloat(arr[5]),
    }))
  }

  const loadOlderCandlesFromTimescale = async (endTimeUtcSec, limit) => {
    try {
      const resp = await axios.get('/api/v1/candles', {
        params: {
          exchange: props.exchange,
          symbol: props.symbol,
          interval: props.interval,
          end: endTimeUtcSec,
          limit,
        },
      })
      const offsetMs = new Date().getTimezoneOffset() * 60 * 1000
      return resp.data.map((c) => ({
        time: (c.time * 1000 - offsetMs) / 1000,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume ?? 0,
      }))
    } catch {
      console.error('Failed to load older candles')
      return []
    }
  }

  const connectWebSocket = (onMessage) => {
    const endpoint = `wss://stream.binance.com:9443/ws/${props.symbol}@kline_${props.interval}`
    ws.value = new WebSocket(endpoint)
    const offsetMs = new Date().getTimezoneOffset() * 60 * 1000

    ws.value.onmessage = (e) => {
      try {
        const { k } = JSON.parse(e.data)
        const localMs = k.t - offsetMs
        const candle = {
          time: localMs / 1000,
          open: parseFloat(k.o),
          high: parseFloat(k.h),
          low: parseFloat(k.l),
          close: parseFloat(k.c),
          volume: parseFloat(k.v),
        }
        onMessage(candle)
      } catch {}
    }
  }

  const cleanup = () => {
    ws.value?.close()
  }

  return {
    currentCandles,
    oldestTime,
    isLoading,
    loadInitialCandlesFromBinance,
    loadOlderCandlesFromTimescale,
    connectWebSocket,
    cleanup,
  }
}
