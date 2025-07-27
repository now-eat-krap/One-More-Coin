<template>
  <div class="relative flex flex-col h-full">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-black/70 dark:bg-gray-900/70 z-50"
      role="status"
    >
      <svg
        aria-hidden="true"
        class="w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span class="sr-only">Loading...</span>
    </div>

    <!-- 탭 메뉴 -->
    <div class="flex justify-between items-start gap-4 flex-wrap">
      <ul
        class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-4"
      >
        <li class="me-2">
          <a
            href="#"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === '포트폴리오'
                ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            ]"
            @click.prevent="activeTab = '포트폴리오'"
            >포트폴리오</a
          >
        </li>
        <li class="me-2">
          <a
            href="#"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === '요약'
                ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            ]"
            @click.prevent="activeTab = '요약'"
            >요약</a
          >
        </li>
        <li class="me-2">
          <a
            href="#"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === '성과'
                ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            ]"
            @click.prevent="activeTab = '성과'"
            >성과</a
          >
        </li>
        <li class="me-2">
          <a
            href="#"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === '거래 분석'
                ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            ]"
            @click.prevent="activeTab = '거래 분석'"
            >거래 분석</a
          >
        </li>
        <li class="me-2">
          <a
            href="#"
            :class="[
              'inline-block p-4 rounded-t-lg',
              activeTab === '거래목록'
                ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
                : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
            ]"
            @click.prevent="activeTab = '거래목록'"
            >거래목록</a
          >
        </li>
      </ul>
      <div class="flex items-center gap-4">
        <!-- 날짜 선택 -->
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Advanced Settings Button -->
              <button
                id="step5"
                @click="showAdvancedSettingsModal = true"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                고급설정
              </button>
              <div id="step4" class="flex gap-4">
                <div class="relative">
                  <label class="block text-gray-300 text-sm mb-1">시작일</label>
                  <div class="relative w-40">
                    <DatePicker
                      v-model="rawStartDate"
                      dateFormat="yy-mm-dd"
                      showIcon
                      fluid
                      iconDisplay="input"
                      :maxDate="new Date(rawEndDate) || new Date()"
                      :minDate="new Date(startDate)"
                    >
                      <template #footer>
                        <div class="mt-2">
                          <!-- minDate 로 바로 점프 -->
                          <Button
                            class="w-full"
                            label="마지막 날 선택"
                            size="small"
                            @click="rawStartDate = new Date(startDate)"
                          ></Button>
                        </div>
                      </template>
                    </DatePicker>
                  </div>
                </div>
                <div class="relative">
                  <label class="block text-gray-300 text-sm mb-1">종료일</label>
                  <div class="relative w-40">
                    <DatePicker
                      v-model="rawEndDate"
                      dateFormat="yy-mm-dd"
                      showIcon
                      fluid
                      iconDisplay="input"
                      :minDate="new Date(rawStartDate) || new Date(startDate)"
                      :maxDate="new Date(Date.now() - 24 * 60 * 60 * 1000)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Settings Modal -->
        <div
          v-if="showAdvancedSettingsModal"
          class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
        >
          <div
            class="bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-semibold text-white">고급설정</h3>
              <button
                @click="showAdvancedSettingsModal = false"
                class="text-gray-400 hover:text-gray-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Modal Content (Advanced Settings Form) -->
            <div class="space-y-4">
              <!-- 초기 자본금 -->
              <div class="flex items-center gap-2">
                <label for="initialCapital" class="block text-gray-300 text-sm mb-1 w-32"
                  >초기 자본금</label
                >
                <input
                  type="number"
                  id="initialCapital"
                  v-model="portfolioStore.advancedSettings.initialCapital"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- 주기 리밸런싱 -->
              <div class="flex items-center gap-2">
                <label for="rebalanceFrequency" class="block text-gray-300 text-sm mb-1 w-32"
                  >주기 리밸런싱</label
                >
                <select
                  id="rebalanceFrequency"
                  v-model="portfolioStore.advancedSettings.rebalanceFrequency"
                  class="w-40 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="none">하지 않음</option>
                  <option value="weekly">주별</option>
                  <option value="monthly">월별</option>
                  <option value="quarterly">분기별</option>
                  <option value="semiannually">반기별</option>
                  <option value="annually">연간</option>
                </select>
              </div>

              <!-- 밴드 리밸런싱 -->
              <div class="flex items-center gap-2">
                <label for="bandRebalance" class="block text-gray-300 text-sm mb-1 w-32"
                  >밴드 리밸런싱 (%)</label
                >
                <input
                  type="number"
                  id="bandRebalance"
                  v-model="portfolioStore.advancedSettings.bandRebalance"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- 수수료 선택 -->
              <div class="flex items-center gap-2">
                <label for="commission" class="block text-gray-300 text-sm mb-1 w-32"
                  >거래 수수료 (%)</label
                >
                <input
                  type="number"
                  id="commission"
                  v-model="portfolioStore.advancedSettings.commission"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Modal Footer Buttons -->
            <div class="mt-6 flex justify-end gap-3">
              <button
                @click="showAdvancedSettingsModal = false"
                class="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                취소
              </button>
              <button
                @click="saveAdvancedSettings"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 포트폴리오 탭 내용 -->
    <div v-if="activeTab === '포트폴리오'" class="flex-1 flex flex-col min-h-0">
      <!-- 전략 설정 -->
      <div class="mb-4 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div class="grid grid-cols-2 gap-4 flex-1 min-h-0 overflow-hidden">
          <DonutChart />
        </div>
      </div>
      <!-- 백테스팅 실행 버튼 -->
      <button
        id="step6"
        @click="runBacktest"
        class="mt-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!isBacktestReady"
      >
        백테스팅 실행
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { usePortfolioStore } from '@/stores/PortfolioStore'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { firstDate } from '@/constants/firstDate'
import DonutChart from '@/components/backtest/portfolio/DonutChart.vue'

const activeTab = ref('포트폴리오')
const showAdvancedSettingsModal = ref(false)
const portfolioStore = usePortfolioStore()

const isBacktestReady = computed(() => {
  let assetPercentage = 0
  for (let i = 0; i < portfolioStore.assetList.length; i++) {
    assetPercentage += portfolioStore.assetList[i].ratio
  }
  return (
    portfolioStore.backtestPeriod.startDate &&
    portfolioStore.backtestPeriod.endDate &&
    portfolioStore.assetList.length > 0 &&
    assetPercentage === 100
  )
})

const saveAdvancedSettings = () => {
  // 고급 설정 저장 로직은 이제 스토어에서 직접 v-model로 처리되므로, 별도의 저장 로직 불필요.
  // console.log('Advanced Settings saved:', strategyStore.advancedSettings)
  showAdvancedSettingsModal.value = false
}

const rawStartDate = ref(
  portfolioStore.backtestPeriod.startDate
    ? new Date(portfolioStore.backtestPeriod.startDate) // 🎯 유효 문자열이면 Date로
    : new Date(Date.now() - 24 * 60 * 60 * 1000),
)

// /* ✅ 1. computed: 항상 최신 값 유지 */
// const startDate = computed(() => {
//   return firstDate[props.exchange.toUpperCase()]?.[props.symbol.toUpperCase()] ?? null
//   // 값이 없으면 null, 필요하면 '2010-01-01' 같은 기본값 지정
// })

watch(rawStartDate, (val) => {
  if (val instanceof Date) {
    const yyyy = val.getFullYear()
    const mm = String(val.getMonth() + 1).padStart(2, '0')
    const dd = String(val.getDate()).padStart(2, '0')
    portfolioStore.backtestPeriod.startDate = `${yyyy}-${mm}-${dd}`
  }
})

const rawEndDate = ref(
  portfolioStore.backtestPeriod.endDate
    ? new Date(portfolioStore.backtestPeriod.endDate) // 🎯 유효 문자열이면 Date로
    : new Date(Date.now() - 24 * 60 * 60 * 1000),
)

watch(rawEndDate, (val) => {
  if (val instanceof Date) {
    const yyyy = val.getFullYear()
    const mm = String(val.getMonth() + 1).padStart(2, '0')
    const dd = String(val.getDate()).padStart(2, '0')
    portfolioStore.backtestPeriod.endDate = `${yyyy}-${mm}-${dd}`
  }
})
</script>
