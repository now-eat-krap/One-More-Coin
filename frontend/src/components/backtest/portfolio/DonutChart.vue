<!-- src/components/DonutChart.vue -->
<template>
  <div class="w-full h-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, Title } from 'chart.js'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, Title)

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const canvasRef = ref(null)
let chartInstance = null

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: props.data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff',
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.parsed
              return `${label}: ${value}%`
            },
          },
        },
      },
    },
  })
}

onMounted(renderChart)
onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy()
})

// 데이터 변경 시 차트 재렌더링
watch(() => props.data, renderChart, { deep: true })
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
