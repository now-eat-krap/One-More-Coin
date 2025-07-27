<!-- src/components/DonutChart.vue -->
<template>
  <div class="w-full h-full relative overflow-hidden">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full cursor-pointer"></canvas>
  </div>

  <div class="mt-4">
    <h4 class="text-white font-semibold mb-2">현재 자산 구성</h4>
    <!-- 두 줄 그리드: 2열 레이아웃 -->
    <ul class="grid grid-cols-2 gap-2">
      <li
        v-for="(asset, index) in assetList"
        :key="index"
        class="bg-stone-800 p-2 rounded flex items-center justify-between text-sm text-white"
      >
        <!-- 왼쪽: 색상 인디케이터 + 이름 -->
        <div class="flex items-center">
          <span
            class="w-3 h-3 rounded-full mr-2"
            :style="{ backgroundColor: assetColors[index] }"
          ></span>
          <span>{{ asset.name }} ({{ asset.type }}, {{ asset.position }})</span>
        </div>

        <!-- 오른쪽: 비율 + 삭제 버튼 -->
        <div class="flex items-center space-x-2">
          <span>{{ asset.ratio }}%</span>
          <button
            @click="removeAsset(index)"
            class="text-gray-400 hover:text-red-400 focus:outline-none"
            aria-label="자산 삭제"
          >
            &times;
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref, computed } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { usePortfolioStore } from '@/stores/PortfolioStore'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title)

const portfolioStore = usePortfolioStore()
const assetList = computed(() => portfolioStore.assetList)

// 색상 배열
const assetColors = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#10B981', // green
  '#FBBF24', // yellow
  '#8B5CF6', // purple
  '#6366F1', // indigo
  '#14B8A6', // teal
  '#F97316', // orange
  '#EC4899', // pink
  '#F43F5E', // rose
  '#0EA5E9', // sky
  '#EAB308', // amber
  '#84CC16', // lime
  '#A855F7', // violet
  '#9333EA', // purple-dark
  '#D946EF', // fuchsia
  '#F87171', // red-light
  '#60A5FA', // blue-light
  '#34D399', // green-light
  '#C084FC', // purple-light
]

// 제거 함수
const removeAsset = (idx) => {
  portfolioStore.removeAasetList(idx)
}

const canvasRef = ref(null)
let chartInstance = null

const hoverIndex = ref(null)
const tooltipPosition = ref({ x: 0, y: 0 })
const tooltipStyle = computed(() =>
  hoverIndex.value === null
    ? {}
    : { top: tooltipPosition.value.y + 'px', left: tooltipPosition.value.x + 'px' },
)

const labels = computed(() => assetList.value.map((a) => a.name))
const dataValues = computed(() => assetList.value.map((a) => a.ratio))

// chartData computed: used==0일 때 투명 원형 표시
const chartData = computed(() => {
  const used = dataValues.value.reduce((sum, v) => sum + v, 0)
  let data, bg, labs
  if (used <= 0) {
    // 자산 없을 때, 전체 투명
    data = [100]
    bg = ['transparent']
    labs = ['']
  } else {
    data = [...dataValues.value]
    bg = [...assetColors.slice(0, dataValues.value.length)]
    labs = [...labels.value]
    if (used < 100) {
      data.push(100 - used)
      bg.push('transparent')
      labs.push('')
    }
  }
  return {
    labels: labs,
    datasets: [
      {
        data,
        backgroundColor: bg,
        borderWidth: 0,
      },
    ],
  }
})

function renderChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (item) => item.label !== '',
          callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}%` },
        },
      },
      onHover(evt, elements) {
        const rect = canvasRef.value.getBoundingClientRect()
        if (elements.length) {
          hoverIndex.value = elements[0].index
          tooltipPosition.value = {
            x: evt.clientX - rect.left + 10,
            y: evt.clientY - rect.top + 10,
          }
        } else {
          hoverIndex.value = null
        }
      },
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})
watch(chartData, renderChart, { deep: true })
</script>

<style scoped>
canvas {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
