<template>
  <h4 class="font-semibold">자산군 선택</h4>
  <div class="space-y-4 border border-gray-700 p-4 rounded-lg bg-stone-800">
    <select
      v-model="newAsset.type"
      class="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
    >
      <option>코인 현물</option>
      <option>코인 선물</option>
    </select>
    <select
      v-model="newAsset.name"
      class="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
    >
      <option disabled value="">자산군을 선택해주세요.</option>
      <option>BTC</option>
      <option>ETH</option>
      <option>XRP</option>
    </select>
    <div class="flex items-center space-x-2">
      <input
        type="number"
        v-model.number="newAsset.ratio"
        class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
      />
      <span class="text-white text-sm">%</span>
    </div>
    <div class="flex items-center space-x-4">
      <label class="inline-flex items-center space-x-1">
        <input
          type="radio"
          value="Long"
          v-model="newAsset.position"
          :disabled="newAsset.type !== '코인 선물'"
          class="accent-green-400"
        />
        <span :class="newAsset.type !== '코인 선물' ? 'text-gray-500' : 'text-white'">Long</span>
      </label>
      <label class="inline-flex items-center space-x-1">
        <input
          type="radio"
          value="Short"
          v-model="newAsset.position"
          :disabled="newAsset.type !== '코인 선물'"
          class="accent-red-400"
        />
        <span :class="newAsset.type !== '코인 선물' ? 'text-gray-500' : 'text-white'">Short</span>
      </label>
    </div>
    <button
      @click="addAssetToList"
      class="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded"
    >
      추가
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/PortfolioStore'

// 1) 스토어 인스턴스
const portfolioStore = usePortfolioStore()

// 2) 새 자산 입력용
const newAsset = ref({
  type: '',
  name: '',
  ratio: 0,
  position: 'Long',
})

// 3) 도넛 차트랑 유효성 검사에 쓸 총합
const totalRatio = computed(() =>
  portfolioStore.assetList.reduce((sum, a) => sum + (a.ratio || 0), 0),
)

// 4) 추가 함수: 스토어에 바로 push
function addAssetToList() {
  if (!newAsset.value.name || newAsset.value.ratio <= 0) {
    return alert('자산군과 비중을 올바르게 입력하세요.')
  }
  if (totalRatio.value + newAsset.value.ratio > 100) {
    return alert('비중 합계가 100%를 초과할 수 없습니다.')
  }
  portfolioStore.assetList.push({ ...newAsset.value })
  // 초기화
  newAsset.value = { type: '코인 선물', name: '', ratio: 0, position: 'Long' }
}

// 5) 차트용 데이터
const donutChartData = computed(() => ({
  labels: portfolioStore.assetList.map((a) => a.name),
  datasets: [
    {
      data: portfolioStore.assetList.map((a) => a.ratio),
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'],
    },
  ],
}))
</script>
