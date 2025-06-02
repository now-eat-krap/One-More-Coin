import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userName: ''
  }),
  
  actions: {
    setLoginState(name) {
      this.isLoggedIn = true
      this.userName = name
    },
    
    clearLoginState() {
      this.isLoggedIn = false
      this.userName = ''
    }
  }
}) 