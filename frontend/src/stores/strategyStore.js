import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// YYYY-MM-DD 포맷 헬퍼
const ymd = (d) => d.toISOString().slice(0, 10)

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    buyConditions: useStorage('strategy-buy-conditions', []),
    sellConditions: useStorage('strategy-sell-conditions', []),
    backtestPeriod: useStorage('backtest-period', {
      startDate: ymd(new Date(Date.now()-24 * 60 * 60 * 1000)), // 하루 어제 날짜
      endDate: ymd(new Date(Date.now()-24 * 60 * 60 * 1000)), // 하루 어제 날짜
    }),
    advancedSettings: useStorage('advanced-settings', {
      initialCapital: 1000000,
      baseCurrency: '기본설정',
      orderSize: 100,
      orderSizeUnit: '%',
      pyramiding: 1,
      pyramidingUnit: '오더',
      commission: 0,
      commissionUnit: '%',
      limitOrderPriceVerification: 0,
      slippage: 0,
      longPositionMargin: 0,
      shortPositionMargin: 0,
      recalculateAfterOrder: false,
      recalculatePerTick: false,
      useBarMagnifier: false,
      atClosePrice: false,
      useStandardOHLC: false,
    }),
  }),

  actions: {
    setBuyConditions(conditions) {
      this.buyConditions = conditions
    },

    setSellConditions(conditions) {
      this.sellConditions = conditions
    },

    addBuyCondition(condition) {
      this.buyConditions.push(condition)
    },

    addSellCondition(condition) {
      this.sellConditions.push(condition)
    },

    removeBuyCondition(index) {
      this.buyConditions.splice(index, 1)
    },

    removeSellCondition(index) {
      this.sellConditions.splice(index, 1)
    },

    clearConditions() {
      this.buyConditions = []
      this.sellConditions = []
    },

    setBacktestPeriod(period) {
      this.backtestPeriod = period
    },

    setAdvancedSettings(settings) {
      this.advancedSettings = settings
    },
  },
})
