// src/composables/useIndicators.js
import { LineSeries, HistogramSeries } from 'lightweight-charts'
import { SMA, EMA, MACD, RSI } from 'technicalindicators'

export const mapIndicators = {
  ma: {
    name: 'MA',
    options: { period: 9, valuesKey: 'close' },
    seriesOptions: { lineWidth: 1, priceScaleId: 'right', lastValueVisible: true },
    color: 'yellow',
    paneIndex: 0,
    calculator: (candles, opts) =>
      SMA.calculate({ period: opts.period, values: candles.map((c) => c[opts.valuesKey]) }),
  },
  ema: {
    name: 'EMA',
    options: { period: 9, valuesKey: 'close' },
    seriesOptions: { lineWidth: 1, priceScaleId: 'right', lastValueVisible: true },
    color: 'blue',
    paneIndex: 0,
    calculator: (candles, opts) =>
      EMA.calculate({ period: opts.period, values: candles.map((c) => c[opts.valuesKey]) }),
  },
  macd: {
    name: 'MACD',
    options: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, valuesKey: 'close' },
    histogramOptions: {
      // priceFormat: { type: 'volume' },
      lastValueVisible: true,
    },
    macdLineOptions: { lineWidth: 1, lastValueVisible: true, color: 'blue' },
    signalLineOptions: { lineWidth: 1, lastValueVisible: true, color: 'orange' },
    color: 'magenta',
    paneIndex: 1,
    calculator: (candles, opts) =>
      MACD.calculate({
        fastPeriod: opts.fastPeriod,
        slowPeriod: opts.slowPeriod,
        signalPeriod: opts.signalPeriod,
        values: candles.map((c) => c[opts.valuesKey]),
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      }),
  },
  rsi: {
    name: 'RSI',
    options: { period: 14, valuesKey: 'close' },
    seriesOptions: { lineWidth: 1, lastValueVisible: true },
    color: 'orange',
    paneIndex: 2,
    calculator: (candles, opts) =>
      RSI.calculate({ period: opts.period, values: candles.map((c) => c[opts.valuesKey]) }),
  },
}

export function useIndicators(chart, candleSeries, props) {
  const activeSeries = {}

  function updateAllSeries(candles) {
    const closes = candles.map((c) => c.close)

    props.indicators.forEach((key) => {
      const cfg = mapIndicators[key]
      if (!cfg) return

      if (key === 'macd') {
        // MACD: 히스토그램, MACD 라인, 시그널 라인
        const data = cfg.calculator(candles, cfg.options)
        if (!activeSeries.macdHist) {
          activeSeries.macdHist = chart.addSeries(
            HistogramSeries,
            {
              upColor: '#26a69a',
              downColor: '#ef5350',
              borderVisible: false,
              wickUpColor: '#26a69a',
              wickDownColor: '#ef5350',
            },
            cfg.histogramOptions,
            cfg.paneIndex,
          )
          activeSeries.macdLine = chart.addSeries(
            LineSeries,
            { color: cfg.color, ...cfg.macdLineOptions },
            cfg.paneIndex,
          )
          activeSeries.macdSignal = chart.addSeries(
            LineSeries,
            { color: cfg.signalLineOptions.color, ...cfg.signalLineOptions },
            cfg.paneIndex,
          )
        }
        const start = candles.length - data.length
        activeSeries.macdHist.setData(
          data.map((v, i) => ({ time: candles[i + start].time, value: v.histogram })),
        )
        activeSeries.macdLine.setData(
          data.map((v, i) => ({ time: candles[i + start].time, value: v.MACD })),
        )
        activeSeries.macdSignal.setData(
          data.map((v, i) => ({ time: candles[i + start].time, value: v.signal })),
        )
        return
      }

      // MA / EMA / RSI
      const vals = cfg.calculator(candles, cfg.options)
      if (!activeSeries[key]) {
        activeSeries[key] = chart.addSeries(
          LineSeries,
          { color: cfg.color, ...cfg.seriesOptions },
          cfg.paneIndex,
        )
      }
      const start = candles.length - vals.length
      activeSeries[key].setData(
        vals.map((v, i) => ({
          time: candles[i + start].time,
          value: v,
        })),
      )
    })

    // 제거된 시리즈 cleanup
    Object.keys(activeSeries).forEach((k) => {
      if (k.startsWith('macd') && !props.indicators.includes('macd')) {
        ;['macdHist', 'macdLine', 'macdSignal'].forEach((id) => {
          chart.removeSeries(activeSeries[id])
          delete activeSeries[id]
        })
      } else if (!k.startsWith('macd') && !props.indicators.includes(k)) {
        chart.removeSeries(activeSeries[k])
        delete activeSeries[k]
      }
    })
  }

  return { updateAllSeries, activeSeries }
}
