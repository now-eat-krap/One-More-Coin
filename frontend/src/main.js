// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import './style.css'

import { useAuthStore } from '@/stores/auth'

const koLocale = {
  firstDayOfWeek: 0,
  dayNames:       ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort:  ['일', '월', '화', '수', '목', '금', '토'],
  dayNamesMin:    ['일', '월', '화', '수', '목', '금', '토'],
  monthNames:     ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort:['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  today: '오늘',
  clear: '초기화',
  dateFormat: 'yy-mm-dd'
}

async function bootstrap () {
  /* 1) 앱 · 플러그인 등록 */
  const app   = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
     .use(router)
     .use(PrimeVue, { theme: { preset: Aura }, locale: koLocale })

  /* 2) 로그인 상태 복원 */
  const auth = useAuthStore()
  try {
    await auth.hydrate()          // 200 ⇢ name 세팅 /springapi/users/me 호출 (쿠키 기반)
  } catch {
    /* 401 등 ⇒ 그냥 무시하고 비로그인 상태로 진행 */
  }
  /* 3) 마운트 */
  app.mount('#app')
}

bootstrap()
