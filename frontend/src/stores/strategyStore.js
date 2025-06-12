import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useStrategyStore = defineStore('strategy', {
  state: () => ({
    buyConditions: useStorage('strategy-buy-conditions', []),
    sellConditions: useStorage('strategy-sell-conditions', [])
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
    }
  }
})