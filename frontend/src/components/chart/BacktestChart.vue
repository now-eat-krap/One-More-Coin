<template>
  <div class="h-full w-full">
    <div ref="chartContainer" class="h-full w-full"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import {
  createChart,
  CandlestickSeries,
  LineSeries,
  HistogramSeries,
  createSeriesMarkers,
  CrosshairMode,
} from 'lightweight-charts'
import { RSI, MACD, EMA, SMA } from 'technicalindicators'
import axios from 'axios'

const props = defineProps({
  results: {
    type: Object,
    required: true,
  },
})

const chartContainer = ref(null)
let chart = null
let candlestickSeries = null
const allCandleData = ref([])

const color = ref([
  '#1e90ff', // DodgerBlue - 시원한 파랑
  '#ffa07a', // LightSalmon - 따뜻한 연주황

  '#6a5acd', // SlateBlue - 보라계열
  '#ffd700', // Gold - 밝은 노랑

  '#00ced1', // DarkTurquoise - 청록
  '#ff69b4', // HotPink - 진한 핑크

  '#4682b4', // SteelBlue - 진한 파랑
  '#ff8c00', // DarkOrange - 오렌지

  '#483d8b', // DarkSlateBlue - 어두운 남보라
  '#f08080', // LightCoral - 코랄 핑크

  '#2e8b57', // SeaGreen - 초록
  '#cd5c5c', // IndianRed - 붉은 갈색

  '#008b8b', // DarkCyan - 진한 청록
  '#f4a460', // SandyBrown - 노랑빛 주황

  '#556b2f', // DarkOliveGreen - 올리브
  '#dda0dd', // Plum - 연보라

  '#191970', // MidnightBlue - 아주 짙은 파랑
  '#ffb6c1', // LightPink - 연한 핑크

  '#2f4f4f', // DarkSlateGray - 회녹색
  '#fafad2', // LightGoldenRodYellow - 부드러운 노랑
])

// === Indicator state ===
let nextPaneIndex = 1 // pane 0 is reserved for candles
const indicatorSeries = {} // will hold series objects by name
const indicatorPanes = {} // will hold pane indices by name
const uniqueMap = new Map()

let candleCount

async function fetchCandleData() {
  try {
    if (!props.results?.period?.startDate || !props.results?.period?.endDate) {
      console.error('Invalid results data:', props.results)
      return
    }

    const startDate = new Date(props.results.period.startDate)
    const endDate = new Date(props.results.period.endDate)
    const intervalMs = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1M': 30 * 24 * 60 * 60 * 1000,
    }

    const totalMs = endDate.getTime() - startDate.getTime()
    candleCount = Math.ceil(totalMs / intervalMs[props.results.interval])
    const params = {
      exchange: props.results.exchange,
      symbol: props.results.symbol,
      interval: props.results.interval,
      end: Math.floor(endDate.getTime() / 1000),
      limit: candleCount + 1000,
    }

    const resp = await axios.get('http://localhost:8000/api/v1/candles', { params })
    if (resp.data && resp.data.length > 0) {
      allCandleData.value = resp.data
        .map((c) => ({
          time: Math.floor(new Date(c.time * 1000).getTime() / 1000),
          open: parseFloat(c.open),
          high: parseFloat(c.high),
          low: parseFloat(c.low),
          close: parseFloat(c.close),
        }))
        .sort((a, b) => a.time - b.time)

      const displayData = allCandleData.value.slice(-candleCount - 1)
      candlestickSeries.setData(displayData)

      // set visible range
      chart.timeScale().setVisibleRange({
        from: displayData[0].time,
        to: displayData[displayData.length - 1].time,
      })

      // buy/sell markers
      if (props.results.trades?.length) {
        const markers = props.results.trades.flatMap((trade, i) => {
          const entryTime = Math.floor(new Date(trade.entry_time).getTime() / 1000)
          const m = [
            {
              time: entryTime,
              position: 'belowBar',
              color: '#2196F3',
              shape: 'arrowUp',
              text: `매수 ${i + 1}`,
            },
          ]
          if (!trade.unrealized && trade.exit_time) {
            const exitTime = Math.floor(new Date(trade.exit_time).getTime() / 1000)
            m.push({
              time: exitTime,
              position: 'aboveBar',
              color: '#e91e63',
              shape: 'arrowDown',
              text: `매도 ${i + 1}`,
            })
          }
          return m
        })
        createSeriesMarkers(candlestickSeries, markers)
      }

      // update indicators after candles
      updateIndicators(displayData)
    } else {
      console.error('No valid data to display')
    }
  } catch (error) {
    console.error('캔들 데이터 가져오기 실패:', error)
    if (error.response) console.error('Error response:', error.response.data)
  }
}

function initIndicatorPanes() {
  // gather all indicator names from buy/sell conditions
  const allConds = [...props.results.conditions.buy, ...props.results.conditions.sell]

  allConds.forEach((cond) => {
    if (cond.type === 'indicator_compare') {
      // 두 개짜리 비교 지표: indicator[i] ↔ settings[i]
      cond.params.indicator.forEach((name, idx) => {
        const lower = name.toLowerCase()
        const singleSet = cond.params.settings[idx] // 해당 지표의 설정만
        const settingsKey = JSON.stringify([singleSet]) // 배열 형태로 직렬화
        const key = `${lower}|${settingsKey}`

        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, {
            name: lower,
            params: { indicator: [name], settings: [singleSet] },
          })
        }
      })
    } else if (cond.type === 'indicator') {
      // 단일 지표
      cond.params.indicator.forEach((name) => {
        const lower = name.toLowerCase()
        const settingsKey = JSON.stringify(cond.params.settings)
        const key = `${lower}|${settingsKey}`
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, { name: lower, params: cond.params })
        }
      })
    }
  })

  const paneByIndicator = {}
  let nextPaneIndex = 1
  let colorIndex = -1
  uniqueMap.forEach(({ name, params }, key) => {
    colorIndex += 1
    // 같은 name이면 같은 paneIndex, 처음 보는 name이면 새 paneIndex 할당
    let paneIndex
    if (paneByIndicator[name] !== undefined && name !== 'ema' && name !== 'sma') {
      paneIndex = paneByIndicator[name]
    } else {
      paneIndex = nextPaneIndex++
      paneByIndicator[name] = paneIndex

      // 실제 차트에 pane를 추가하려면 (이미 pane()가 생성돼 있다면 생략)
      // const pane = chart.addPane({ height: 100 })
      // chart.panes()[paneIndex] = pane
    }

    indicatorPanes[key] = paneIndex

    // create series based on indicator type
    if (name === 'rsi') {
      const period = params.settings[0].period
      indicatorSeries[key] = chart.addSeries(
        LineSeries,
        {
          //title: `RSI(${period})`,
          priceFormat: { type: 'price', precision: 2 },
          lineWidth: 1,
          color: color.value[colorIndex],
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        },
        paneIndex,
      )
    } else if (name === 'macd') {
      const hist = chart.addSeries(
        HistogramSeries,
        {
          //title: 'MACD Hist',
          lastValueVisible: false,
          priceLineVisible: false,
        },
        paneIndex,
      )
      const macdLine = chart.addSeries(
        LineSeries,
        {
          //title: 'MACD Line',
          lineWidth: 1,
          color: color.value[colorIndex++],
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        },
        paneIndex,
      )
      const signalLine = chart.addSeries(
        LineSeries,
        {
          //title: 'Signal Line',
          lineWidth: 1,
          color: color.value[colorIndex],
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        },
        paneIndex,
      )
      indicatorSeries[key] = { hist, macdLine, signalLine }
    } else if (name === 'ema') {
      // params.settings = [{ period: X }]
      const period = params.settings[0].period
      indicatorSeries[key] = chart.addSeries(
        LineSeries,
        {
          //title: `EMA(${period})`,
          priceFormat: { type: 'price', precision: 2 },
          lineWidth: 1,
          color: color.value[colorIndex],
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        },
        0,
      )
    }
    // --- 추가: SMA ---
    else if (name === 'sma') {
      const period = params.settings[0].period
      indicatorSeries[key] = chart.addSeries(
        LineSeries,
        {
          //title: `SMA(${period})`,
          priceFormat: { type: 'price', precision: 2 },
          lineWidth: 1,
          color: color.value[colorIndex],
          lastValueVisible: false,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
        },
        0,
      )
    }

    // pane height 조정
    const pane = chart.panes()[paneIndex]
    // pane.setHeight(100)
  })
}

function updateIndicators(displayData) {
  const closes = allCandleData.value.map((c) => c.close)

  uniqueMap.forEach(({ name, params }, key) => {
    const seriesObj = indicatorSeries[key]
    if (!seriesObj) return

    if (name === 'rsi') {
      const period = params.settings[0].period
      const rsiVals = RSI.calculate({ values: closes, period })
      let data = []
      const min = Math.min(displayData.length, rsiVals.length)

      for (let i = 0; i < min; i++) {
        const c = displayData[displayData.length - 1 - i] // 대응하는 displayData 요소
        data.unshift({
          time: c.time, // 시간
          value: rsiVals[rsiVals.length - 1 - i], // RSI 값
        })
      }
      seriesObj.setData(data)
    } else if (name === 'macd') {
      const { fastPeriod, slowPeriod, signalPeriod } = params.settings[0]
      const macdInput = {
        values: closes,
        fastPeriod,
        slowPeriod,
        signalPeriod,
        SimpleMAOscillator: false,
        SimpleMASignal: false,
      }
      const macdRes = MACD.calculate(macdInput)
      const min = Math.min(displayData.length, macdRes.length)
      let macdData = []
      let histData = []
      let signalData = []

      for (let i = 0; i < min; i++) {
        const c = displayData[displayData.length - 1 - i] // 대응하는 displayData 요소
        const v = macdRes[macdRes.length - 1 - i].histogram
        const prev = i < min - 1 ? macdRes[macdRes.length - 2 - i].histogram : 0
        let color
        if (v < 0) color = v > prev ? '#FFCDD2' : '#FF5252'
        else if (v > 0) color = v < prev ? '#B2DFDB' : '#26A69A'
        else color = '#888'

        histData.unshift({
          time: c.time, // 시간
          value: v,
          color,
        })
        macdData.unshift({
          time: c.time, // 시간
          value: macdRes[macdRes.length - 1 - i].MACD,
        })
        signalData.unshift({
          time: c.time, // 시간
          value: macdRes[macdRes.length - 1 - i].signal,
        })
      }
      seriesObj.macdLine.setData(macdData)
      seriesObj.signalLine.setData(signalData)
      seriesObj.hist.setData(histData)
    }

    // === EMA ===
    else if (name === 'ema') {
      const period = params.settings[0].period
      const emaVals = EMA.calculate({ values: closes, period })
      let data = []
      for (let i = 0; i < displayData.length; i++) {
        const c = displayData[displayData.length - 1 - i] // 대응하는 displayData 요소
        data.unshift({
          time: c.time, // 시간
          value: emaVals[emaVals.length - 1 - i],
        })
      }
      seriesObj.setData(data)
    }

    // === SMA ===
    else if (name === 'sma') {
      const period = params.settings[0].period
      const smaVals = SMA.calculate({ values: closes, period })
      let data = []
      for (let i = 0; i < displayData.length; i++) {
        const c = displayData[displayData.length - 1 - i] // 대응하는 displayData 요소
        data.unshift({
          time: c.time, // 시간
          value: smaVals[smaVals.length - 1 - i],
        })
      }
      seriesObj.setData(data)
    }
  })
}

const initChart = async () => {
  if (!chartContainer.value) return

  // 1) 툴팁 엘리먼트 생성
  const toolTip = document.createElement('div')
  Object.assign(toolTip.style, {
    position: 'absolute',
    display: 'none',
    padding: '8px',
    background: 'rgba(32,33,36,0.9)',
    // color: 'white',
    fontSize: '12px',
    borderRadius: '4px',
    pointerEvents: 'none',
    zIndex: 1000,
  })
  chartContainer.value.parentElement.appendChild(toolTip)

  chart = createChart(chartContainer.value, {
    layout: {
      background: { color: '#1a1a1a' },
      textColor: '#d1d4dc',
      panes: {
        separatorColor: '#444',
        separatorHoverColor: '#777',
        enableResize: true,
      },
    },
    grid: {
      vertLines: { color: '#2B2B43' },
      horzLines: { color: '#2B2B43' },
    },
    width: chartContainer.value.clientWidth,
    height: chartContainer.value.clientHeight,
    crosshair: {
      mode: CrosshairMode.Normal,
      vertLine: { visible: true, labelVisible: false },
      horzLine: { visible: false },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      //tickMarkFormatter: (t) => new Date(t * 1000).toLocaleDateString()
    },
  })

  chart.applyOptions({
    localization: {
      // 한국어 로케일
      locale: 'ko-KR',
      // yyyy: 연도(4자리), MM: 월, dd: 일
      dateFormat: 'yyyy년 MM월 dd일',
    },
  })

  // 3) 크로스헤어 무브 콜백
  chart.subscribeCrosshairMove((param) => {
    const { point, seriesData, time } = param
    // 차트 바깥으로 나가면 숨기기
    if (!param || !time || point.x < 0 || point.y < 0) {
      toolTip.style.display = 'none'
      return
    }

    // 4) OHLC 정보
    const ohlc = seriesData.get(candlestickSeries)
    let html = ''
    if (ohlc) {
      html += `
        <div><strong>${new Date(time * 1000).toLocaleString()}</strong></div>
        <div>시: ${ohlc.open.toFixed(2)}</div>
        <div>고: ${ohlc.high.toFixed(2)}</div>
        <div>저: ${ohlc.low.toFixed(2)}</div>
        <div>종: ${ohlc.close.toFixed(2)}</div>
        <hr style="margin:4px 0;border:1px solid #444">
      `
    }

    let colorIndex = -1
    // 5) 지표값들
    uniqueMap.forEach((_, key) => {
      colorIndex++
      const seriesObj = indicatorSeries[key]

      // key 파싱: "EMA|[{\"period\":10}]" → "EMA(10)"
      const [name, rawParams] = key.split('|')
      let displayName = name

      try {
        const params = JSON.parse(rawParams)
        if (Array.isArray(params)) {
          const values = params.map((p) => p.period).filter(Boolean)
          displayName = `${name}(${values.join(', ')})`
        }
      } catch (e) {
        // 파싱 실패 시 원본 이름 사용
      }

      // macd 은 object, 나머지는 하나의 LineSeries
      if (seriesObj.macdLine) {
        const m = seriesData.get(seriesObj.macdLine)
        const s = seriesData.get(seriesObj.signalLine)
        const h = seriesData.get(seriesObj.hist)
        if (m) html += `<div>MACD: ${m.value.toFixed(2)}</div>`
        if (s)
          html += `<div style="color: ${color.value[colorIndex++]}"]>Signal: ${s.value.toFixed(2)}</div>`
        if (h)
          html += `<div style="color: ${color.value[colorIndex]}">Hist: ${h.value.toFixed(2)}</div>`
      } else {
        const v = seriesData.get(seriesObj)
        if (v)
          html += `<div style="color: ${color.value[colorIndex]}">${displayName}: ${v.value.toFixed(2)}</div>`
      }
    })

    toolTip.innerHTML = html
    toolTip.style.display = 'block'

    // 6) 툴팁 위치 조정(차트 컨테이너 상대)
    const rect = chartContainer.value.getBoundingClientRect()
    toolTip.style.left = rect.left + window.pageXOffset + point.x + 10 + 'px'
    toolTip.style.top = rect.top + window.pageYOffset + point.y - toolTip.offsetHeight - 10 + 'px'
  })

  candlestickSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    priceFormat: { type: 'price', precision: 2, minMove: 0.01 },
  })

  initIndicatorPanes()
  await fetchCandleData()
}

const handleResize = () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({
      width: chartContainer.value.clientWidth,
      height: chartContainer.value.clientHeight,
    })
  }
}

onMounted(async () => {
  await initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) chart.remove()
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
