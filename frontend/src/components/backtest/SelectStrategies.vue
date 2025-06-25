<template>
  <div id="step3" class="p-4 overflow-y-auto">
    <!-- 탭 메뉴 -->
    <div
      id="step3-1"
      class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
    >
      <ul class="flex flex-nowrap overflow-x-auto -mb-px">
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'recommended'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'recommended'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            추천 전략
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'indicator'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'indicator'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            지표 조건
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'indicator_compare'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'indicator_compare'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            지표 간 비교
          </a>
        </li>
        <li class="me-2">
          <a
            href="#"
            @click.prevent="activeTab = 'candle_pattern'"
            :class="[
              'inline-block p-4 border-b-2 rounded-t-lg',
              activeTab === 'candle_pattern'
                ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300',
            ]"
          >
            캔들 패턴
          </a>
        </li>
      </ul>
    </div>

    <!-- 추천 전략 탭 -->
    <RecommendTab v-if="activeTab === 'recommended'"></RecommendTab>
    <!-- 지표 조건 탭 -->
    <IndicatorConditionTab v-if="activeTab === 'indicator'" />

    <!-- 지표 간 비교 탭 -->
    <IndicatorCompareTab v-if="activeTab === 'indicator_compare'" />

    <!-- 캔들 패턴 탭 -->
    <CandlePatternTab v-if="activeTab === 'candle_pattern'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IndicatorConditionTab from './tabs/IndicatorConditionTab.vue'
import IndicatorCompareTab from './tabs/IndicatorCompareTab.vue'
import RecommendTab from './tabs/RecommendTab.vue'
import CandlePatternTab from './tabs/CandlePatternTab.vue'

const activeTab = ref('indicator')
</script>
