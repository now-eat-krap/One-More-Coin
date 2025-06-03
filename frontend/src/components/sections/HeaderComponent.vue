<template>
  <header class="bg-stone-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 상단 네비게이션 바 -->
      <nav class="flex items-center justify-between h-16">
        <!-- 로고 영역 -->
        <RouterLink to="/" class="flex items-center hover:opacity-80 transition-opacity">
          <!-- PNG 로고 -->
          <div class="flex-shrink-0">
            <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
          </div>
          <span class="ml-2 font-['Roboto_Serif'] font-bold text-2xl text-yellow-400">One More Coin</span>
        </RouterLink>

        <!-- 네비게이션 링크 (데스크탑) -->
        <div class="hidden md:flex space-x-8">
          <RouterLink to="/" class="hover:text-white font-medium">Home</RouterLink>
          <RouterLink to="/features" class="hover:text-white font-medium">Features</RouterLink>
          <RouterLink to="/pricing" class="hover:text-white font-medium">Pricing</RouterLink>
          <RouterLink to="/contact" class="hover:text-white font-medium">Contact</RouterLink>
        </div>

        <!-- 우측 버튼들 -->
        <div class="hidden md:flex items-center space-x-4">
          <template v-if="!isLoggedIn">
            <routerLink
              to="/login"
              class="px-5 py-2 border border-stone-400/20 rounded-lg text-base"
              >Log in</routerLink
            >
            <routerLink
              to="/login"
              class="px-5 py-2 bg-yellow-600 rounded-lg text-base hover:bg-yellow-800"
            >
              Try it free
            </routerLink>
          </template>
          <template v-else>
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-stone-800"
              >
                <span class="text-stone-200 text-base">{{ userName }} 님</span>
                <svg
                  class="w-5 h-5 text-stone-400 transition-transform duration-200"
                  :class="{ 'transform rotate-180': isUserMenuOpen }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- 드롭다운 메뉴 -->
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-56 rounded-lg bg-stone-900 shadow-lg py-1 z-50 divide-y divide-stone-700"
              >
                <div class="px-4 py-3">
                  <div class="text-base text-stone-200">{{ userName }} 님</div>
                  <div class="text-sm text-stone-400 truncate">환영합니다</div>
                </div>
                <ul class="py-2">
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2.5 text-base text-stone-200 hover:bg-stone-800"
                      @click="isUserMenuOpen = false"
                    >
                      내 정보
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      class="block px-4 py-2.5 text-base text-stone-200 hover:bg-stone-800"
                      @click="isUserMenuOpen = false"
                    >
                      설정
                    </a>
                  </li>
                </ul>
                <div class="py-2">
                  <button
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2.5 text-base text-stone-200 hover:bg-stone-800"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 모바일 햄버거 아이콘 -->
        <div class="md:hidden flex items-center">
          <button @click="toggleMobileMenu">
            <svg
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </nav>

      <!-- 모바일 메뉴 (슬라이드 다운) -->
      <transition name="fade">
        <div v-if="mobileOpen" class="md:hidden bg-stone-900/90 backdrop-blur-sm">
          <nav class="px-4 pt-2 pb-4 space-y-2">
            <RouterLink to="/" class="block py-2 hover:text-white font-medium">Home</RouterLink>
            <RouterLink to="/features" class="block py-2 hover:text-white font-medium">Features</RouterLink>
            <RouterLink to="/pricing" class="block py-2 hover:text-white font-medium">Pricing</RouterLink>
            <RouterLink to="/contact" class="block py-2 hover:text-white font-medium">Contact</RouterLink>
            <div class="mt-2 border-t border-stone-700"></div>
            <template v-if="!isLoggedIn">
              <RouterLink
                to="/login"
                class="w-full text-left py-2 border-b border-stone-700 font-medium"
              >
                Log in
              </RouterLink>
            </template>
            <template v-else>
              <div class="py-3 border-b border-stone-700">
                <div class="text-base text-stone-200">{{ userName }}님</div>
                <div class="text-sm text-stone-400">환영합니다</div>
              </div>
              <RouterLink
                to="/profile"
                class="block py-3 text-base hover:text-white font-medium"
                @click="mobileOpen = false"
              >
                내 정보
              </RouterLink>
              <RouterLink
                to="/settings"
                class="block py-3 text-base hover:text-white font-medium"
                @click="mobileOpen = false"
              >
                설정
              </RouterLink>
              <button @click="handleLogout" class="w-full text-left py-3 text-base font-medium">
                로그아웃
              </button>
            </template>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/plugins/axios'
import { isTokenExpired, getTokenExpirationTime } from '@/utils/token'

const router = useRouter()
const authStore = useAuthStore()
const mobileOpen = ref(false)
const isUserMenuOpen = ref(false)

// computed로 변경
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userName = computed(() => authStore.userName)

// 토큰 만료 체크 함수
const checkTokenExpiration = () => {
  const token = localStorage.getItem('access')
  if (token) {
    if (isTokenExpired(token)) {
      console.log('토큰이 만료되었습니다.')
    }
    const expirationTime = getTokenExpirationTime(token)
    console.log('토큰 만료 시간:', expirationTime)
  }
}

// 로그인 상태가 변경될 때마다 토큰 만료 체크
watch(isLoggedIn, (newValue) => {
  if (newValue) {
    checkTokenExpiration()
  }
})

// 로그인 상태 확인
onMounted(() => {
  const name = localStorage.getItem('name')
  if (name) {
    authStore.setLoginState(name)
  }

  // 드롭다운 메뉴 외부 클릭 시 닫기
  document.addEventListener('click', handleClickOutside)

  // 초기 토큰 만료 체크
  checkTokenExpiration()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 드롭다운 메뉴 토글
function toggleUserMenu(event) {
  event.stopPropagation()
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 드롭다운 메뉴 외부 클릭 시 닫기
function handleClickOutside(event) {
  const dropdown = document.querySelector('.relative')
  if (dropdown && !dropdown.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
}

// 로그아웃 처리
async function handleLogout() {
  try {
    await api.post('/logout')
    localStorage.removeItem('name')
    localStorage.removeItem('access')
    authStore.clearLoginState()
    isUserMenuOpen.value = false
    router.push('/')
  } catch (err) {
    console.error('로그아웃 실패:', err)
    localStorage.removeItem('name')
    localStorage.removeItem('access')
    authStore.clearLoginState()
    router.push('/')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 헤더 고정 시 본문 여백 추가 */
:deep(body) {
  padding-top: 4rem;
}
</style>
