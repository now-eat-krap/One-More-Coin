<template>
  <header class="bg-stone-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 상단 네비게이션 바 -->
      <nav class="flex items-center justify-between h-16">
        <!-- 로고 영역 -->
        <div class="flex items-center">
          <!-- SVG 로고 (원본에서 가져온 coin 아이콘) -->
          <div class="flex-shrink-0">
            <svg
              class="h-8 w-8 text-yellow-500"
              viewBox="0 0 49 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <!-- (원본 coin 로고 경로) -->
              <path
                d="M10.5599 26C10.5599 29.2968 11.8894 32.283 14.0414 34.4519C14.249 34.6611 14.3527 34.7657 14.414 34.8663C14.4724 34.9622 14.5065 35.0448 14.5326 35.1541C14.5599 35.2687 14.5599 35.399 14.5599 35.6597V40.4C14.5599 40.9601 14.5599 41.2401 14.6689 41.454C14.7648 41.6422 14.9178 41.7951 15.1059 41.891C15.3198 42 15.5999 42 16.1599 42H19.9599C20.52 42 20.8 42 21.0139 41.891C21.2021 41.7951 21.3551 41.6422 21.4509 41.454C21.5599 41.2401 21.5599 40.9601 21.5599 40.4V39.6C21.5599 39.0399 21.5599 38.7599 21.6689 38.546C21.7648 38.3578 21.9178 38.2049 22.1059 38.109C22.3198 38 22.5999 38 23.1599 38H25.9599C26.52 38 26.8 38 27.0139 38.109C27.2021 38.2049 27.3551 38.3578 27.4509 38.546C27.5599 38.7599 27.5599 39.0399 27.5599 39.6V40.4C27.5599 40.9601 27.5599 41.2401 27.6689 41.454C27.7648 41.6422 27.9178 41.7951 28.1059 41.891C28.3198 42 28.5999 42 29.1599 42H32.9601C33.5201 42 33.8001 42 34.014 41.891C34.2022 41.7951 34.3552 41.6422 34.4511 41.454C34.5601 41.2401 34.5601 40.9601 34.5601 40.4V38.4487C34.5601 38.0445 34.5601 37.8425 34.6176 37.6803C34.6727 37.5248 34.7422 37.416 34.86 37.3005C34.9829 37.18 35.1911 37.0834 35.6074 36.89C37.5719 35.978 39.2481 34.5501 40.4623 32.7803C40.6758 32.4691 40.7826 32.3135 40.8966 32.2216C41.0056 32.1337 41.1034 32.0822 41.2375 32.042C41.3778 32 41.5444 32 41.8775 32H42.9601C43.5201 32 43.8001 32 44.0141 31.891C44.2022 31.7951 44.3552 31.6422 44.4511 31.454C44.5601 31.2401 44.5601 30.9601 44.5601 30.4V23.5715C44.5601 23.0383 44.5601 22.7717 44.461 22.5661C44.3627 22.362 44.1981 22.1973 43.994 22.0991C43.7883 22 43.5217 22 42.9886 22C42.6026 22 42.4099 22 42.2542 21.9476C42.0866 21.8911 41.9691 21.816 41.8475 21.6875C41.7348 21.5684 41.6427 21.3694 41.4586 20.9709C40.8677 19.6924 40.0584 18.5355 39.0786 17.5482C38.871 17.3389 38.7677 17.2344 38.7069 17.1338C38.6475 17.0379 38.6139 16.9556 38.5874 16.8459C38.5601 16.7313 38.5601 16.601 38.5601 16.3404V14.1212C38.5601 13.4011 38.5601 13.041 38.4101 12.799C38.2787 12.587 38.0729 12.4318 37.833 12.3637C37.5591 12.286 37.2129 12.3849 36.5205 12.5827L31.7754 13.9384C31.6947 13.9615 31.6545 13.973 31.6134 13.9811C31.5772 13.9882 31.5401 13.9933 31.5033 13.9965C31.4616 14 31.4197 14 31.3358 14H30.4781M10.5599 26C10.5599 21.3919 13.1573 17.3904 16.968 15.3798M10.5599 26H8.56006C6.35092 26 4.56006 24.2091 4.56006 22C4.56006 20.5194 5.36446 19.2267 6.56006 18.5351M30.5601 13C30.5601 16.866 27.4261 20 23.5601 20C19.6941 20 16.5601 16.866 16.5601 13C16.5601 9.13401 19.6941 6 23.5601 6C27.4261 6 30.5601 9.13401 30.5601 13Z"
                stroke="#EAB300"
                stroke-width="3.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span class="ml-2 font-['Timmana'] text-2xl text-yellow-500">Coin</span>
        </div>

        <!-- 네비게이션 링크 (데스크탑) -->
        <div class="hidden md:flex space-x-8">
          <a href="#" class="hover:text-white font-medium">Home</a>
          <a href="#" class="hover:text-white font-medium">Features</a>
          <a href="#" class="hover:text-white font-medium">Pricing</a>
          <a href="#" class="hover:text-white font-medium">Contact</a>
        </div>

        <!-- 우측 버튼들 -->
        <div class="hidden md:flex items-center space-x-4">
          <routerLink to="/login" class="px-5 py-2 border border-stone-400/20 rounded-lg text-base">Log in</routerLink>
          <button class="px-5 py-2 bg-yellow-600 rounded-lg text-base hover:bg-yellow-800">
            Try it free
          </button>
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
            <a href="#" class="block py-2 hover:text-white font-medium">Home</a>
            <a href="#" class="block py-2 hover:text-white font-medium">Features</a>
            <a href="#" class="block py-2 hover:text-white font-medium">Pricing</a>
            <a href="#" class="block py-2 hover:text-white font-medium">Contact</a>
            <div class="mt-2 border-t border-stone-700"></div>
            <button class="w-full text-left py-2 border-b border-stone-700 font-medium">
              Log in
            </button>
            <button class="w-full text-left py-2 font-medium">Try it free</button>
          </nav>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// 모바일 메뉴 토글
const mobileOpen = ref(false)
function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value
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
</style>
