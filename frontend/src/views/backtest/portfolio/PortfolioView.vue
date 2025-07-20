<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <!-- 헤더 -->
    <div class="flex-none p-2 border-b border-gray-700">
      <div class="flex items-center space-x-6">
        <RouterLink to="/" class="inline-block hover:opacity-80 transition-opacity">
          <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
        </RouterLink>
        <h3 class="text-xl font-bold text-yellow-400 tracking-wide text-center inline-block">
          포트폴리오 백테스트
        </h3>
      </div>
    </div>

    <!-- 본문 -->
    <div class="flex-1 flex flex-row min-h-0">
      <!-- 좌측 3/4 -->
      <div class="flex flex-col w-3/4 h-full min-h-0">
        <!-- 상단: 도넛차트 + 자산 리스트 -->
        <div class="flex flex-1 border border-gray-700 overflow-auto p-4 space-x-4">
          <div class="w-1/2 flex justify-center items-center">
            <DonutChart :data="donutChartData" />
          </div>
          <div class="w-1/2">
            <h4 class="text-white font-semibold mb-2">현재 자산 구성</h4>
            <ul class="space-y-2">
              <li
                v-for="(asset, index) in assetList"
                :key="index"
                class="bg-stone-800 p-2 rounded flex justify-between text-sm text-white"
              >
                <span>{{ asset.name }} ({{ asset.type }}, {{ asset.position }})</span>
                <span>{{ asset.ratio }}%</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 하단: 설정 -->
        <div class="border border-gray-700 p-6 space-y-4 text-white">
          <div>
            <label class="block text-sm text-gray-300 mb-1">초기 투자금액 (USDT)</label>
            <input
              type="number"
              v-model="initialCapital"
              class="w-full px-2 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">주기 리밸런싱</label>
            <select
              v-model="rebalanceFrequency"
              class="w-full px-2 py-2 rounded bg-gray-800 text-white border border-gray-600"
            >
              <option value="none">하지 않음</option>
              <option value="weekly">주별</option>
              <option value="monthly">월별</option>
              <option value="quarterly">분기별</option>
              <option value="semiannually">반기별</option>
              <option value="annually">연간</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">밴드 리밸런싱 (%)</label>
            <input
              type="number"
              v-model="bandRebalance"
              class="w-full px-2 py-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">거래 수수료 (%)</label>
            <input
              type="number"
              v-model="commission"
              class="w-full px-2 py-2 rounded bg-gray-800 text-white border border-gray-600"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-300 mb-1">기간 설정</label>
            <div class="flex gap-2">
              <input
                type="date"
                v-model="startDate"
                class="w-full px-2 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
              <input
                type="date"
                v-model="endDate"
                class="w-full px-2 py-2 rounded bg-gray-800 text-white border border-gray-600"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 우측 1/4: 자산군 선택 UI -->
      <div
        class="w-1/4 h-full border-l border-gray-700 p-6 bg-stone-900/80 overflow-auto text-white space-y-6"
      >
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
              <span :class="newAsset.type !== '코인 선물' ? 'text-gray-500' : 'text-white'"
                >Long</span
              >
            </label>
            <label class="inline-flex items-center space-x-1">
              <input
                type="radio"
                value="Short"
                v-model="newAsset.position"
                :disabled="newAsset.type !== '코인 선물'"
                class="accent-red-400"
              />
              <span :class="newAsset.type !== '코인 선물' ? 'text-gray-500' : 'text-white'"
                >Short</span
              >
            </label>
          </div>
          <button
            @click="addAssetToList"
            class="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 rounded"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DonutChart from '@/components/backtest/portfolio/DonutChart.vue'

const initialCapital = ref(10000)
const rebalanceFrequency = ref('none')
const bandRebalance = ref(5)
const commission = ref(0.1)
const startDate = ref('')
const endDate = ref('')

const newAsset = ref({
  type: '코인 선물',
  name: '',
  ratio: 0,
  position: 'Long',
})

const assetList = ref([])

function addAssetToList() {
  if (!newAsset.value.name || newAsset.value.ratio <= 0) {
    alert('자산군과 비중을 올바르게 입력하세요.')
    return
  }
  if (totalRatio.value + newAsset.value.ratio > 100) {
    alert('비중 합계가 100%를 초과할 수 없습니다.')
    return
  }
  assetList.value.push({ ...newAsset.value })
  newAsset.value = { type: '코인 선물', name: '', ratio: 0, position: 'Long' }
}

const totalRatio = computed(() => assetList.value.reduce((sum, a) => sum + (a.ratio || 0), 0))

const donutChartData = computed(() => ({
  labels: assetList.value.map((a) => a.name),
  datasets: [
    {
      data: assetList.value.map((a) => a.ratio),
      backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#c084fc'],
    },
  ],
}))
</script>

<style scoped></style>
