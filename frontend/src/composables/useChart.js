// src/composables/useChart.js
import {
  createChart,
  CrosshairMode,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
} from 'lightweight-charts'
import { SMA, EMA, MACD, RSI } from 'technicalindicators'

export function useChart(chartContainer, props) {
  let chart, candleSeries
  const indicatorSeries = {}

  const initChart = () => {
    if (!chartContainer.value) return

    chart = createChart(chartContainer.value, {
      layout: {
        background: { type: 'solid', color: '#161A25' },
        textColor: '#FFFFFF',
        panes: {
          separatorColor: '#f22c3d',
          separatorHoverColor: 'rgba(255, 0, 0, 0.1)',
          enableResize: false,
        },
      },
      grid: {
        vertLines: { color: '#313540' },
        horzLines: { color: '#313540' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      timeScale: { timeVisible: true, secondsVisible: false },
      autoSize: true,
    })

    // 메인 캔들 (pane 0)
    candleSeries = chart.addSeries(
      CandlestickSeries,
      {
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      },
      0, // paneIndex = 0
    )

    return { chart, candleSeries }
  }

  /**
   * indicators 배열을 보고 paneIndex별로 series 생성/업데이트
   */
  function updateIndicators(candles) {
    const closes = candles.map((c) => c.close)

    // --- MA (pane 0) ---
    if (props.indicators.includes('ma')) {
      const vals = SMA.calculate({ period: 9, values: closes })
      if (!indicatorSeries.ma) {
        indicatorSeries.ma = chart.addSeries(
          LineSeries,
          { lineWidth: 1, color: 'yellow' },
          0, // paneIndex = 0
        )
      }
      indicatorSeries.ma.setData(
        vals.map((v, i) => ({
          time: candles[i + (candles.length - vals.length)].time,
          value: v,
        })),
      )
    } else if (indicatorSeries.ma) {
      chart.removeSeries(indicatorSeries.ma)
      delete indicatorSeries.ma
    }

    // --- EMA (pane 0) ---
    if (props.indicators.includes('ema')) {
      const vals = EMA.calculate({ period: 9, values: closes })
      if (!indicatorSeries.ema) {
        indicatorSeries.ema = chart.addSeries(
          LineSeries,
          { lineWidth: 1, color: 'yellow' },
          0, // paneIndex = 0
        )
      }
      indicatorSeries.ema.setData(
        vals.map((v, i) => ({
          time: candles[i + (candles.length - vals.length)].time,
          value: v,
        })),
      )
    } else if (indicatorSeries.ema) {
      chart.removeSeries(indicatorSeries.ema)
      delete indicatorSeries.ema
    }

    // --- MACD (pane 1) ---
    if (props.indicators.includes('macd')) {
      const macdInput = MACD.calculate({
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        values: closes,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      })
      if (!indicatorSeries.macdHist) {
        indicatorSeries.macdHist = chart.addSeries(
          HistogramSeries,
          { priceFormat: { type: 'volume' } },
          1, // paneIndex = 1
        )
        indicatorSeries.macdLine = chart.addSeries(
          LineSeries,
          { lineWidth: 1, color: 'magenta' },
          1, // paneIndex = 1
        )
      }
      indicatorSeries.macdHist.setData(
        macdInput.map((v, i) => ({
          time: candles[i + (candles.length - macdInput.length)].time,
          value: v.histogram,
        })),
      )
      indicatorSeries.macdLine.setData(
        macdInput.map((v, i) => ({
          time: candles[i + (candles.length - macdInput.length)].time,
          value: v.MACD,
        })),
      )
    } else if (indicatorSeries.macdHist) {
      chart.removeSeries(indicatorSeries.macdHist)
      chart.removeSeries(indicatorSeries.macdLine)
      delete indicatorSeries.macdHist
      delete indicatorSeries.macdLine
    }

    // --- RSI (pane 2) ---
    if (props.indicators.includes('rsi')) {
      const vals = RSI.calculate({ period: 14, values: closes })
      if (!indicatorSeries.rsi) {
        indicatorSeries.rsi = chart.addSeries(
          LineSeries,
          { lineWidth: 1, color: 'orange' },
          2, // paneIndex = 2
        )
      }
      indicatorSeries.rsi.setData(
        vals.map((v, i) => ({
          time: candles[i + (candles.length - vals.length)].time,
          value: v,
        })),
      )
    } else if (indicatorSeries.rsi) {
      chart.removeSeries(indicatorSeries.rsi)
      delete indicatorSeries.rsi
    }
  }

  // 메인 차트의 visible range 변경 시 모든 pane 동기화
  function syncPanes(range) {
    chart.timeScale().setVisibleLogicalRange(range)
  }

  const cleanup = () => {
    chart?.remove()
  }

  return {
    initChart,
    updateIndicators,
    syncPanes,
    cleanup,
  }
}
