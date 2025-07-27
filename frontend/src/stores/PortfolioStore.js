import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// YYYY-MM-DD 포맷 헬퍼
const ymd = (d) => d.toISOString().slice(0, 10)

export const usePortfolioStore = defineStore('portfolio', {
  state: () => ({
    assetList: useStorage('asset-list', []),

    backtestPeriod: useStorage('backtest-period', {
      startDate: ymd(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 하루 어제 날짜
      endDate: ymd(new Date(Date.now() - 24 * 60 * 60 * 1000)), // 하루 어제 날짜
    }),
    advancedSettings: useStorage('advanced-settings', {
      initialCapital: 1000000,
      rebalanceFrequency: 'none',
      bandRebalance: 0,
      commission: 0,
    }),
  }),

  actions: {
    setAdvancedSettings(settings) {
      this.advancedSettings = settings
    },

    addAssetList(assetList) {
      this.assetList.push(assetList)
    },

    removeAasetList(index) {
      this.assetList.splice(index, 1)
    },
  },
})
