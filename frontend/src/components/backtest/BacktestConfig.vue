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
    <ul
      class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 mb-4"
    >
      <li class="me-2">
        <a
          href="#"
          :class="[
            'inline-block p-4 rounded-t-lg',
            activeTab === '전략'
              ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500'
              : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300',
          ]"
          @click.prevent="activeTab = '전략'"
          >전략</a
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

    <!-- 전략 탭 내용 -->
    <div v-if="activeTab === '전략'" class="flex-1 flex flex-col">
      <!-- 날짜 선택 -->
      <div class="mb-4">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-medium text-white">백테스팅 기간</h4>

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
                    :maxDate="new Date()"
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
                v-model="strategyStore.advancedSettings.initialCapital"
                class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- 베이스 통화 -->
            <div class="flex items-center gap-2">
              <label for="baseCurrency" class="block text-gray-300 text-sm mb-1 w-32"
                >베이스 통화</label
              >
              <select
                id="baseCurrency"
                v-model="strategyStore.advancedSettings.baseCurrency"
                class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="기본설정">기본설정</option>
                <option value="USD">USD</option>
                <option value="KRW">KRW</option>
              </select>
            </div>

            <!-- 오더 사이즈 -->
            <div class="flex items-center gap-2">
              <label for="orderSize" class="block text-gray-300 text-sm mb-1 w-32"
                >오더 사이즈</label
              >
              <input
                type="number"
                id="orderSize"
                v-model="strategyStore.advancedSettings.orderSize"
                class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                id="orderSizeUnit"
                v-model="strategyStore.advancedSettings.orderSizeUnit"
                class="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-26"
              >
                <option value="%">자기자본 %</option>
                <option value="수량">수량</option>
                <option value="usdt">USDT</option>
              </select>
            </div>

            <!-- 피라미딩 -->
            <div class="flex items-center gap-2">
              <label for="pyramiding" class="block text-gray-300 text-sm mb-1 w-32">피라미딩</label>
              <input
                disabled
                type="number"
                id="pyramiding"
                v-model="strategyStore.advancedSettings.pyramiding"
                class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="text-white">오더</span>
            </div>

            <!-- 코스트 시뮬레이션 섹션 -->
            <h4 class="text-md font-medium text-gray-400 mt-6 mb-2">코스트 시뮬레이션</h4>
            <div class="space-y-4">
              <!-- 커미션 -->
              <div class="flex items-center gap-2">
                <label for="commission" class="block text-gray-300 text-sm mb-1 w-32">커미션</label>
                <input
                  type="number"
                  id="commission"
                  v-model="strategyStore.advancedSettings.commission"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  id="commissionUnit"
                  v-model="strategyStore.advancedSettings.commissionUnit"
                  class="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-26"
                >
                  <option value="%">%</option>
                  <option value="컨트랙트당 USDT">컨트랙트당 USDT</option>
                  <option value="오더당 USDT">오더당 USDT</option>
                </select>
              </div>

              <!-- 리밋오더가격 검증 -->
              <div class="flex items-center gap-2">
                <label
                  for="limitOrderPriceVerification"
                  class="block text-gray-300 text-sm mb-1 w-32"
                  >리밋오더가격 검증</label
                >
                <input
                  disabled
                  type="number"
                  id="limitOrderPriceVerification"
                  v-model="strategyStore.advancedSettings.limitOrderPriceVerification"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-white">틱</span>
              </div>

              <!-- 슬리피지 -->
              <div class="flex items-center gap-2">
                <label for="slippage" class="block text-gray-300 text-sm mb-1 w-32">슬리피지</label>
                <input
                  disabled
                  type="number"
                  id="slippage"
                  v-model="strategyStore.advancedSettings.slippage"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-white">틱</span>
              </div>
            </div>

            <!-- 마진 섹션 -->
            <h4 class="text-md font-medium text-gray-400 mt-6 mb-2">마진</h4>
            <div class="space-y-4">
              <!-- 롱 포지션 증거금 -->
              <div class="flex items-center gap-2">
                <label for="longPositionMargin" class="block text-gray-300 text-sm mb-1 w-32"
                  >롱 포지션 증거금</label
                >
                <input
                  disabled
                  type="number"
                  id="longPositionMargin"
                  v-model="strategyStore.advancedSettings.longPositionMargin"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-white">%</span>
              </div>

              <!-- 숏 포지션 증거금 -->
              <div class="flex items-center gap-2">
                <label for="shortPositionMargin" class="block text-gray-300 text-sm mb-1 w-32"
                  >숏 포지션 증거금</label
                >
                <input
                  disabled
                  type="number"
                  id="shortPositionMargin"
                  v-model="strategyStore.advancedSettings.shortPositionMargin"
                  class="w-32 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="text-white">%</span>
              </div>
            </div>

            <!-- 재계산 섹션 -->
            <h4 class="text-md font-medium text-gray-400 mt-6 mb-2">재계산</h4>
            <div class="space-y-2">
              <!-- 오더 체결 뒤 -->
              <div class="flex items-center">
                <input
                  disabled
                  type="checkbox"
                  id="recalculateAfterOrder"
                  v-model="strategyStore.advancedSettings.recalculateAfterOrder"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label for="recalculateAfterOrder" class="ml-2 text-gray-300">오더 체결 뒤</label>
              </div>

              <!-- 매틱마다 -->
              <div class="flex items-center">
                <input
                  disabled
                  type="checkbox"
                  id="recalculatePerTick"
                  v-model="strategyStore.advancedSettings.recalculatePerTick"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label for="recalculatePerTick" class="ml-2 text-gray-300">매틱마다</label>
              </div>
            </div>

            <!-- 주문 처리 섹션 -->
            <h4 class="text-md font-medium text-gray-400 mt-6 mb-2">주문 처리</h4>
            <div class="space-y-2">
              <!-- 바 돋보기 사용 -->
              <div class="flex items-center">
                <input
                  disabled
                  type="checkbox"
                  id="useBarMagnifier"
                  v-model="strategyStore.advancedSettings.useBarMagnifier"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label for="useBarMagnifier" class="ml-2 text-gray-300">바 돋보기 사용</label>
              </div>

              <!-- 봉종가에 -->
              <div class="flex items-center">
                <input
                  disabled
                  type="checkbox"
                  id="atClosePrice"
                  v-model="strategyStore.advancedSettings.atClosePrice"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label for="atClosePrice" class="ml-2 text-gray-300">봉종가에</label>
              </div>

              <!-- 표준 OHLC 사용 -->
              <div class="flex items-center">
                <input
                  disabled
                  type="checkbox"
                  id="useStandardOHLC"
                  v-model="strategyStore.advancedSettings.useStandardOHLC"
                  class="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <label for="useStandardOHLC" class="ml-2 text-gray-300">표준 OHLC 사용</label>
              </div>
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

      <!-- 전략 설정 -->
      <div class="mb-4 flex-1 overflow-y-auto">
        <div class="grid grid-cols-2 gap-4 h-full">
          <!-- 매수 조건 -->
          <div class="bg-gray-800 rounded-lg p-4 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-md font-medium text-white">매수 조건</h5>
            </div>
            <div class="space-y-3">
              <div
                v-for="(condition, index) in buyConditions"
                :key="index"
                class="bg-gray-700 rounded-lg p-3"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-300">{{ getConditionName(condition) }}</span>
                  </div>
                  <button
                    @click="removeCondition('buy', index)"
                    class="text-red-400 hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div class="mt-2 text-xs text-gray-400">
                  {{ getConditionDescription(condition) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 매도 조건 -->
          <div class="bg-gray-800 rounded-lg p-4 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h5 class="text-md font-medium text-white">매도 조건</h5>
            </div>
            <div class="space-y-3">
              <div
                v-for="(condition, index) in sellConditions"
                :key="index"
                class="bg-gray-700 rounded-lg p-3"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-300">{{ getConditionName(condition) }}</span>
                  </div>
                  <button
                    @click="removeCondition('sell', index)"
                    class="text-red-400 hover:text-red-300"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div class="mt-2 text-xs text-gray-400">
                  {{ getConditionDescription(condition) }}
                </div>
              </div>
            </div>
          </div>
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

    <!-- 요약 탭 내용 -->
    <div
      v-else-if="activeTab === '요약'"
      class="flex-1 flex flex-col items-center gap-6 overflow-y-auto font-light"
    >
      <div v-if="overview" class="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-10xl">
        <div class="bg-gray-800 rounded-lg py-6 px-3 flex flex-col items-center shadow">
          <div class="text-gray-400 text-sm mb-2">총손익</div>
          <div>
            <span
              class="text-2xl me-3"
              :class="overview.total_pnl >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'"
              >{{ overview.total_pnl >= 0 ? '+' : '' }}{{ overview.total_pnl.toLocaleString() }}
              <span class="text-sm">USDT</span>
            </span>
            <span
              class="text-sm"
              :class="overview.total_pnl_pct >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'"
            >
              {{ overview.total_pnl_pct >= 0 ? '+' : '' }}{{ overview.total_pnl_pct }}%
            </span>
          </div>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow">
          <div class="text-gray-400 text-sm mb-2">최대 자본 감소</div>
          <div>
            <span class="text-2xl me-3"
              >{{ Math.abs(overview.max_drawdown).toLocaleString() }}
              <span class="text-sm">USDT</span>
            </span>
            <span class="text-sm">{{ Math.abs(overview.max_drawdown_pct) }}% </span>
          </div>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow">
          <div class="text-gray-400 text-sm mb-2">총 거래</div>
          <span class="text-2xl">{{ overview.count }}</span>
        </div>
        <div class="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow">
          <div class="text-gray-400 text-sm mb-2">승률</div>
          <div>
            <span class="text-2xl me-3">{{ overview.win_rate }}%</span>
            <span class="text-sm">{{ overview.win_count }} / {{ overview.all_count }}</span>
          </div>
        </div>
      </div>
      <div
        v-else-if="overview === null"
        class="flex items-center justify-center h-full text-gray-500"
      >
        백테스팅을 실행하여 성과를 확인하세요.
      </div>
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다
      </div>
    </div>

    <!-- 성과 탭 내용 -->
    <div v-else-if="activeTab === '성과'" class="flex-1 flex flex-col min-h-0 font-light">
      <div v-if="performanceData" class="flex-1 overflow-auto min-h-0">
        <table class="min-w-full text-xs md:text-sm text-left text-white">
          <thead class="sticky top-0 bg-gray-900 text-gray-400 border-b border-gray-700">
            <tr>
              <th class="px-4 py-3">이름</th>
              <th class="px-4 py-3">전체</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">미실현 손익</td>
              <td class="px-4 py-2">
                <span
                  :class="
                    performanceData.unrealized_pnl === 0
                      ? 'text-white'
                      : performanceData.unrealized_pnl > 0
                        ? 'text-[#22ab94]'
                        : 'text-[#f7525f]'
                  "
                >
                  {{ performanceData.unrealized_pnl <= 0 ? '' : '+'
                  }}{{ performanceData.unrealized_pnl.toLocaleString() }} USDT
                </span>
                <div
                  :class="
                    performanceData.unrealized_pnl === 0
                      ? 'text-white'
                      : performanceData.unrealized_pnl > 0
                        ? 'text-[#22ab94]'
                        : 'text-[#f7525f]'
                  "
                >
                  {{ performanceData.unrealized_pnl_pct <= 0 ? '' : '+'
                  }}{{ performanceData.unrealized_pnl_pct }}%
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">순이익</td>
              <td class="px-4 py-2">
                <span
                  :class="performanceData.total_profit >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'"
                >
                  {{ performanceData.total_profit ? '+' : ''
                  }}{{ performanceData.total_profit.toLocaleString() }}
                  USDT
                </span>
                <div
                  :class="
                    performanceData.total_profit_pct >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'
                  "
                >
                  {{ performanceData.total_profit_pct >= 0 ? '+' : ''
                  }}{{ performanceData.total_profit_pct.toFixed(2) }}%
                </div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">총 수익</td>
              <td class="px-4 py-2">
                <span> {{ performanceData.profit.toLocaleString() }} USDT </span>
                <div>{{ performanceData.profit_pct.toFixed(2) }}%</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">총 손실</td>
              <td class="px-4 py-2">
                <span> {{ performanceData.loss.toLocaleString() }} USDT </span>
                <div>{{ performanceData.loss_pct.toFixed(2) }}%</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">수수료</td>
              <td class="px-4 py-2">
                <span> {{ performanceData.total_commission.toLocaleString() }} USDT </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 자본 상승</td>
              <td class="px-4 py-2">
                <span> {{ performanceData.max_runup.toLocaleString() }} USDT </span>
                <div>{{ performanceData.max_runup_pct }}%</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 자본 감소</td>
              <td class="px-4 py-2">
                <span> {{ performanceData.max_drawdown.toLocaleString() }} USDT </span>
                <div>{{ performanceData.max_drawdown_pct }}%</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else-if="performanceData === null"
        class="flex items-center justify-center h-full text-gray-500"
      >
        백테스팅을 실행하여 성과를 확인하세요.
      </div>
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다
      </div>
    </div>

    <!-- 거래 분석 탭 내용 -->
    <div v-else-if="activeTab === '거래 분석'" class="flex-1 flex flex-col min-h-0 font-light">
      <div v-if="tradeData" class="flex-1 overflow-auto min-h-0">
        <table class="min-w-full text-xs md:text-sm text-left text-white">
          <thead class="sticky top-0 bg-gray-900 text-gray-400 border-b border-gray-700">
            <tr>
              <th class="px-4 py-3">이름</th>
              <th class="px-4 py-3">전체</th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">총 거래</td>
              <td class="px-4 py-2">
                <span>
                  {{ tradeData.total_count }}
                </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">전체 미청산 거래</td>
              <td class="px-4 py-2">
                <span>
                  {{ tradeData.unrealized_count }}
                </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">수익 거래</td>
              <td class="px-4 py-2">
                <span>
                  {{ tradeData.profit_count }}
                </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">손실 거래</td>
              <td class="px-4 py-2">
                <span>
                  {{ tradeData.loss_count }}
                </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">승률</td>
              <td v-if="tradeData.win_rate === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.win_rate }}% </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">평균 손익</td>
              <td v-if="tradeData.avg_total === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.avg_total.toLocaleString() }} USDT </span>
                <div>{{ tradeData.avg_total_pct }} %</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">평균 이익 거래</td>
              <td v-if="tradeData.avg_profit === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.avg_profit.toLocaleString() }} USDT </span>
                <div>{{ tradeData.avg_profit_pct.toFixed(2) }} %</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">평균 손실 거래</td>
              <td v-if="tradeData.avg_loss === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.avg_loss.toLocaleString() }} USDT </span>
                <div>{{ tradeData.avg_loss_pct.toFixed(2) }} %</div>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 수익 거래</td>
              <td v-if="tradeData.max_profit === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.max_profit.toLocaleString() }} USDT </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 수익 거래 퍼센트</td>
              <td v-if="tradeData.max_profit_pct === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.max_profit_pct }} % </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 손실 거래</td>
              <td v-if="tradeData.max_loss === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.max_loss.toLocaleString() }} USDT </span>
              </td>
            </tr>
            <tr class="hover:bg-gray-800 transition border-y border-gray-700 h-15">
              <td class="px-4 py-2">최대 손실 거래 퍼센트</td>
              <td v-if="tradeData.max_loss_pct === 'X'" class="px-4 py-2">
                <span> X </span>
              </td>
              <td v-else class="px-4 py-2">
                <span> {{ tradeData.max_loss_pct }} % </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else-if="tradeData === null"
        class="flex items-center justify-center h-full text-gray-500"
      >
        백테스팅을 실행하여 성과를 확인하세요.
      </div>
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다
      </div>
    </div>

    <!-- 거래목록 탭 내용 -->
    <div v-else-if="activeTab === '거래목록'" class="flex-1 flex flex-col min-h-0 font-light">
      <div v-if="tradeList.length !== 0" class="flex-1 overflow-auto min-h-0">
        <table class="min-w-full text-xs md:text-sm text-left text-white text-right">
          <thead class="sticky top-0 bg-gray-900 text-gray-400 border-b border-gray-700">
            <tr>
              <th class="px-4 py-3">거래</th>
              <th class="px-4 py-3">타입</th>
              <th class="px-4 py-3">날짜/시간</th>
              <th class="px-4 py-3">가격</th>
              <th class="px-4 py-3">수수료</th>
              <th class="px-4 py-3">수량</th>
              <th class="px-4 py-3">P&L</th>
              <th class="px-4 py-3">런업</th>
              <th class="px-4 py-3">드로다운</th>
              <th class="px-4 py-3">누적 손익</th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-800 group"
            v-for="(trade, idx) in tradeList"
            :key="idx"
          >
            <tr class="group-hover:bg-gray-800 transition border-y border-gray-700">
              <td class="px-4 py-2 font-bold" rowspan="2">{{ trade.tradeNo }}</td>
              <td
                class="px-4 py-2"
                :class="trade.type[0] === '미실현' ? 'text-gray-500' : 'text-white'"
              >
                {{ trade.type[0] }}
              </td>
              <td class="px-4 py-2">{{ trade.date[0] }}</td>
              <td class="px-4 py-2">{{ trade.price[0].toLocaleString() }}</td>
              <td
                class="px-4 py-2"
                :class="trade.commission[0] === '미실현' ? 'text-gray-500' : 'text-white'"
              >
                {{ trade.commission[0].toLocaleString() }}
              </td>
              <td class="px-4 py-2" rowspan="2">{{ trade.qty }}</td>

              <td class="px-4 py-2" rowspan="2">
                <span :class="trade.pnl >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'">
                  {{ trade.pnl >= 0 ? '+' : '' }}{{ trade.pnl.toLocaleString() }} USDT
                </span>
                <div :class="trade.pnlPercent >= 0 ? 'text-[#22ab94]' : 'text-[#f7525f]'">
                  {{ trade.pnlPercent >= 0 ? '+' : '' }}{{ trade.pnlPercent }}%
                </div>
              </td>
              <td class="px-4 py-2" rowspan="2">
                <span> {{ trade.runUp.toLocaleString() }} USDT </span>
                <div>{{ trade.runUpPercent }}%</div>
              </td>
              <td class="px-4 py-2" rowspan="2">
                <span> {{ trade.drawDown.toLocaleString() }} USDT </span>
                <div>{{ trade.drawDownPercent }}%</div>
              </td>
              <td class="px-4 py-2" rowspan="2">
                {{ trade.cumPnl.toLocaleString() }} USDT
                <div class="text-xs">{{ trade.pnlPercent }}%</div>
              </td>
            </tr>
            <tr class="group-hover:bg-gray-800 transition border-y border-gray-700">
              <td class="px-4 py-2">{{ trade.type[1] }}</td>
              <td class="px-4 py-2">{{ trade.date[1] }}</td>
              <td class="px-4 py-2">{{ trade.price[1].toLocaleString() }}</td>
              <td class="px-4 py-2">{{ trade.commission[1].toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else-if="tradeList === 0"
        class="flex items-center justify-center h-full text-gray-500"
      >
        백테스팅을 실행하여 성과를 확인하세요.
      </div>
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        데이터가 없습니다
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useStrategyStore } from '@/stores/strategyStore'
import { candlestickPatterns } from '@/config/candlePatternParams'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { firstDate } from '@/constants/firstDate'

// 로딩 상태
const isLoading = ref(false)

const strategyStore = useStrategyStore()

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
  exchange: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['backtest-complete'])

// 매수/매도 조건
const buyConditions = ref([])
const sellConditions = ref([])

const overview = ref(null)

// 전략이 변경될 때마다 매수/매도 조건 업데이트
watch(
  () => strategyStore.buyConditions,
  (newBuyConditions) => {
    console.log('Buy conditions changed:', newBuyConditions) // 디버깅용
    buyConditions.value = newBuyConditions
  },
  { deep: true, immediate: true },
)

watch(
  () => strategyStore.sellConditions,
  (newSellConditions) => {
    //console.log('Sell conditions changed:', newSellConditions) // 디버깅용
    sellConditions.value = newSellConditions
  },
  { deep: true, immediate: true },
)

// 조건 제거 함수
const removeCondition = (type, index) => {
  if (type === 'buy') {
    buyConditions.value.splice(index, 1)
  } else {
    sellConditions.value.splice(index, 1)
  }
}

// 백테스팅 준비 상태 확인
const isBacktestReady = computed(() => {
  return (
    strategyStore.backtestPeriod.startDate &&
    strategyStore.backtestPeriod.endDate &&
    buyConditions.value.length > 0 &&
    sellConditions.value.length > 0
  )
})

// 백테스팅 실행 함수
const runBacktest = async () => {
  isLoading.value = true

  const data = {
    period: strategyStore.backtestPeriod,
    conditions: {
      buy: buyConditions.value,
      sell: sellConditions.value,
    },
    symbol: props.symbol,
    exchange: props.exchange,
    interval: props.interval,
    advancedSettings: strategyStore.advancedSettings,
  }

  console.log(JSON.stringify(data.conditions))

  try {
    const response = await axios.post('/api/v1/backtest', data)

    const result = { ...data, ...response.data }

    calculate_overview(response.data)
    calculate_trade_list(result)
    calculatePerformanceMetrics(response.data)
    calculateTradeMetrics(response.data)

    emit('backtest-complete', result)
  } catch (error) {
    console.error('Backtest failed:', error)
  } finally {
    isLoading.value = false // ← 끝나면 false
  }
}

const calculate_overview = (data) => {
  activeTab.value = '요약'

  // 1) 미실현(unrealized) 거래를 제외
  const realizedTrades = data.trades.filter((trade) => !trade.unrealized)

  if (realizedTrades.length > 0) {
    // 2) drawdown이 가장 작은(=최대 손실) 객체 찾기
    const worst = realizedTrades.reduce((worstSoFar, current) => {
      return current.drawdown < worstSoFar.drawdown ? current : worstSoFar
    }, realizedTrades[0])

    const positiveCount = realizedTrades.filter((t) => t.pnl > 0).length

    overview.value = {
      total_pnl: data.profit,
      total_pnl_pct: data.total_percent,
      max_drawdown: worst.drawdown,
      max_drawdown_pct: worst.drawdown_pct,
      count: data.trade_count,
      win_rate: ((positiveCount / realizedTrades.length) * 100).toFixed(2),
      win_count: positiveCount,
      all_count: realizedTrades.length,
    }
  } else {
    overview.value = false
  }
}

const calculate_trade_list = (data) => {
  tradeList.value = []
  if (data.trades.length === 0) {
    tradeList.value = false
    return
  }

  let cumpnl = 0
  let cumpnlpercent = 0

  for (let i = 0; i < data.trades.length; i++) {
    cumpnl = Math.round((cumpnl + data.trades[i].pnl) * 100) / 100

    let tp = ['매수 청산', '매수 진입']
    let commission = []

    if (data.trades[i].unrealized === true) {
      tp = ['미실현', '매수 진입']
      if (data.advancedSettings.commissionUnit === '%') {
        commission = [
          '미실현',
          (
            (data.trades[i].entry_price * data.trades[i].size * data.advancedSettings.commission) /
            100
          ).toFixed(2),
        ]
      }
      // 컨트랙트당 USDT, 오더당 USDT 구현 필요
    } else {
      if (data.advancedSettings.commissionUnit === '%') {
        commission = [
          (
            (data.trades[i].exit_price * data.trades[i].size * data.advancedSettings.commission) /
            100
          ).toFixed(2),
          (
            (data.trades[i].entry_price * data.trades[i].size * data.advancedSettings.commission) /
            100
          ).toFixed(2),
        ]
      }
    }

    const list = {
      tradeNo: i + 1,
      type: tp,
      date: [data.trades[i].exit_time, data.trades[i].entry_time],
      price: [data.trades[i].exit_price, data.trades[i].entry_price],
      qty: data.trades[i].size,
      commission: commission,
      pnl: data.trades[i].pnl,
      pnlPercent: data.trades[i].percent,
      runUp: data.trades[i].runup,
      runUpPercent: data.trades[i].runup_pct,
      drawDown: data.trades[i].drawdown,
      drawDownPercent: data.trades[i].drawdown_pct,
      cumPnl: cumpnl,
    }

    tradeList.value.unshift(list)
  }
}

const performanceData = ref(null)

const calculatePerformanceMetrics = (data) => {
  performanceData.value = null
  if (data.trades.length === 0) {
    performanceData.value = false
    return
  }

  let unrealized_pnl = 0
  let unrealized_pnl_percent = 0
  if (data.trades.at(-1).unrealized === true) {
    unrealized_pnl = data.trades.at(-1).pnl
    unrealized_pnl_percent = data.trades.at(-1).percent
  }

  const { sumProfit } = data.trades.reduce(
    (acc, trade) => {
      if (trade.unrealized) return acc

      if (trade.pnl > 0) acc.sumProfit += trade.pnl

      return acc
    },
    { sumProfit: 0 },
  )

  const { sumLoss } = data.trades.reduce(
    (acc, trade) => {
      if (trade.unrealized) return acc

      if (trade.pnl < 0) acc.sumLoss += trade.pnl

      return acc
    },
    { sumLoss: 0 },
  )

  const worst = data.trades.reduce((worstSoFar, current) => {
    // current 가 더 작은 drawdown 이면 current 로 교체
    return current.drawdown < worstSoFar.drawdown ? current : worstSoFar
  }, data.trades[0])

  const best = data.trades.reduce((bestSoFar, current) => {
    // current 가 더 작은 drawdown 이면 current 로 교체
    return current.runup > bestSoFar.runup ? current : bestSoFar
  }, data.trades[0])

  performanceData.value = {
    unrealized_pnl: unrealized_pnl || 0,
    unrealized_pnl_pct: unrealized_pnl_percent || 0,
    total_profit: data.profit - unrealized_pnl || 0,
    total_profit_pct: ((data.profit - unrealized_pnl) / data.initial_cash) * 100 || 0,
    profit: Math.abs(sumProfit) || 0,
    profit_pct: Math.abs((sumProfit / data.initial_cash) * 100) || 0,
    loss: Math.abs(sumLoss) || 0,
    loss_pct: Math.abs((sumLoss / data.initial_cash) * 100) || 0,
    total_commission: data.total_commission || 0,
    max_runup: Math.abs(best.runup) || 0,
    max_runup_pct: Math.abs(best.runup_pct) || 0,
    max_drawdown: Math.abs(worst.drawdown) || 0,
    max_drawdown_pct: Math.abs(worst.drawdown_pct) || 0,
  }
}

const tradeData = ref(null)
const calculateTradeMetrics = (data) => {
  tradeData.value = null

  if (data.trades.length === 0) {
    tradeData.value = false
    return
  }

  const { sumProfit, sumProfitPct, profitCnt, maxProfit, maxProfitPct } = data.trades.reduce(
    (acc, trade) => {
      if (trade.unrealized) return acc

      if (trade.pnl > 0) {
        acc.sumProfit += trade.pnl
        acc.profitCnt += 1
        acc.maxProfit = Math.max(acc.maxProfit, trade.pnl)
      }
      if (trade.percent > 0) {
        acc.sumProfitPct += trade.percent
        acc.maxProfitPct = Math.max(acc.maxProfitPct, trade.percent)
      }

      return acc
    },
    { sumProfit: 0, sumProfitPct: 0, profitCnt: 0, maxProfit: 0, maxProfitPct: 0 },
  )

  const { sumLoss, sumLossPct, lossCnt, maxLoss, maxLossPct } = data.trades.reduce(
    (acc, trade) => {
      if (trade.unrealized) return acc

      if (trade.pnl < 0) {
        acc.sumLoss += trade.pnl
        acc.lossCnt += 1
        acc.maxLoss = Math.min(acc.maxLoss, trade.pnl)
      }
      if (trade.percent < 0) {
        acc.sumLossPct += trade.percent
        acc.maxLossPct = Math.min(acc.maxLossPct, trade.percent)
      }
      return acc
    },
    { sumLoss: 0, sumLossPct: 0, lossCnt: 0, maxLoss: 0, maxLossPct: 0 },
  )

  tradeData.value = {
    total_count: data.trade_count || 0,
    unrealized_count: data.trades.length - data.trade_count || 0,
    profit_count: profitCnt || 0,
    loss_count: lossCnt || 0,
    win_rate: ((profitCnt / data.trade_count) * 100).toFixed(2) || 'X',
    avg_total: Math.abs((sumProfit + sumLoss) / data.trade_count).toFixed(2) || 'X',
    avg_total_pct: Math.abs((sumProfitPct + sumLossPct) / data.trade_count).toFixed(2) || 'X',
    avg_profit: Math.abs(sumProfit / profitCnt) || 'X',
    avg_profit_pct: Math.abs(sumProfitPct / profitCnt) || 'X',
    avg_loss: Math.abs(sumLoss / lossCnt) || 'X',
    avg_loss_pct: Math.abs(sumLossPct / lossCnt) || 'X',
    max_profit: Math.abs(maxProfit) || 'X',
    max_profit_pct: Math.abs(maxProfitPct) || 'X',
    max_loss: Math.abs(maxLoss) || 'X',
    max_loss_pct: Math.abs(maxLossPct) || 'X',
  }
}

// const formatValue = (metric, key) => {
//   const item = metric[key]
//   if (item.value === undefined || item.value === null) return '-'
//   let sign = item.value > 0 ? '+' : ''
//   let suffix = ' USDT'

//   if (
//     metric.name === '지불된 수수료' ||
//     metric.name === '총손실' ||
//     metric.name === '최대 자본 상승' ||
//     metric.name === '최대 자본 감소'
//   ) {
//     sign = ''
//   }
//   if (metric.name === '총수익' && item.value === 0) {
//     sign = ''
//   }

//   if (item.value === 0 && (metric.name === '총수익' || metric.name === '총손실')) {
//     return `0${suffix}`
//   }

//   return `${sign}${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`
// }

// 외부에 노출할 메서드들
defineExpose({
  removeCondition,
  runBacktest,
})

const getConditionName = (condition) => {
  if (condition.type === 'indicator') {
    return '지표 조건'
  } else if (condition.type === 'indicator_compare') {
    return '지표 간 비교'
  } else if (condition.type === 'candle_pattern') {
    return '캔들 패턴'
  }
}

const getConditionDescription = (condition) => {
  if (condition.type === 'indicator') {
    return `${condition.params.indicator[0]} [${Object.values(condition.params.settings[0])}] ${condition.params.operator} ${condition.params.oversold} 일 때`
  } else if (condition.type === 'indicator_compare') {
    return `${condition.params.indicator[0]} [${Object.values(condition.params.settings[0])}] ${condition.params.operator} ${condition.params.indicator[1]} [${Object.values(condition.params.settings[1])}] 일 때`
  } else if (condition.type === 'candle_pattern') {
    return `${candlestickPatterns[condition.params.pattern].korean} (${candlestickPatterns[condition.params.pattern].label}) 일 때`
  }

  return condition.params.indicator
}

const showAdvancedSettingsModal = ref(false)

const saveAdvancedSettings = () => {
  // 고급 설정 저장 로직은 이제 스토어에서 직접 v-model로 처리되므로, 별도의 저장 로직 불필요.
  console.log('Advanced Settings saved:', strategyStore.advancedSettings)
  showAdvancedSettingsModal.value = false
}

// 탭 상태
const activeTab = ref('전략')

const tradeList = ref([])

const rawStartDate = ref(
  strategyStore.backtestPeriod.startDate
    ? new Date(strategyStore.backtestPeriod.startDate) // 🎯 유효 문자열이면 Date로
    : new Date(),
)

/* ✅ 1. computed: 항상 최신 값 유지 */
const startDate = computed(() => {
  return firstDate[props.exchange.toUpperCase()]?.[props.symbol.toUpperCase()] ?? null
  // 값이 없으면 null, 필요하면 '2010-01-01' 같은 기본값 지정
})

watch(rawStartDate, (val) => {
  if (val instanceof Date) {
    const yyyy = val.getFullYear()
    const mm = String(val.getMonth() + 1).padStart(2, '0')
    const dd = String(val.getDate()).padStart(2, '0')
    strategyStore.backtestPeriod.startDate = `${yyyy}-${mm}-${dd}`
  }
})

const rawEndDate = ref(
  strategyStore.backtestPeriod.endDate
    ? new Date(strategyStore.backtestPeriod.endDate) // 🎯 유효 문자열이면 Date로
    : new Date(),
)

watch(rawEndDate, (val) => {
  if (val instanceof Date) {
    const yyyy = val.getFullYear()
    const mm = String(val.getMonth() + 1).padStart(2, '0')
    const dd = String(val.getDate()).padStart(2, '0')
    strategyStore.backtestPeriod.endDate = `${yyyy}-${mm}-${dd}`
  }
})
</script>

<style scoped>
/* 달력 아이콘 커스텀 스타일 */
input[type='date']::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

input[type='date']::-webkit-datetime-edit {
  padding: 0;
}

input[type='date']::-webkit-datetime-edit-fields-wrapper {
  padding: 0;
}

input[type='date']::-webkit-datetime-edit-text {
  padding: 0 2px;
  color: #9ca3af;
}

input[type='date']::-webkit-datetime-edit-year-field,
input[type='date']::-webkit-datetime-edit-month-field,
input[type='date']::-webkit-datetime-edit-day-field {
  padding: 0 2px;
  color: #fff;
}

/* 호버 효과 */
input[type='date']:hover {
  background-color: #374151;
}

/* 포커스 효과 */
input[type='date']:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
