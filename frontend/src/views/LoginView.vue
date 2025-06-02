<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- 로고 영역 -->
      <div class="flex flex-col items-center">
        <div class="flex items-center">
          <svg
            class="h-12 w-12 text-yellow-500"
            viewBox="0 0 49 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5599 26C10.5599 29.2968 11.8894 32.283 14.0414 34.4519C14.249 34.6611 14.3527 34.7657 14.414 34.8663C14.4724 34.9622 14.5065 35.0448 14.5326 35.1541C14.5599 35.2687 14.5599 35.399 14.5599 35.6597V40.4C14.5599 40.9601 14.5599 41.2401 14.6689 41.454C14.7648 41.6422 14.9178 41.7951 15.1059 41.891C15.3198 42 15.5999 42 16.1599 42H19.9599C20.52 42 20.8 42 21.0139 41.891C21.2021 41.7951 21.3551 41.6422 21.4509 41.454C21.5599 41.2401 21.5599 40.9601 21.5599 40.4V39.6C21.5599 39.0399 21.5599 38.7599 21.6689 38.546C21.7648 38.3578 21.9178 38.2049 22.1059 38.109C22.3198 38 22.5999 38 23.1599 38H25.9599C26.52 38 26.8 38 27.0139 38.109C27.2021 38.2049 27.3551 38.3578 27.4509 38.546C27.5599 38.7599 27.5599 39.0399 27.5599 39.6V40.4C27.5599 40.9601 27.5599 41.2401 27.6689 41.454C27.7648 41.6422 27.9178 41.7951 28.1059 41.891C28.3198 42 28.5999 42 29.1599 42H32.9601C33.5201 42 33.8001 42 34.014 41.891C34.2022 41.7951 34.3552 41.6422 34.4511 41.454C34.5601 41.2401 34.5601 40.9601 34.5601 40.4V38.4487C34.5601 38.0445 34.5601 37.8425 34.6176 37.6803C34.6727 37.5248 34.7422 37.416 34.86 37.3005C34.9829 37.18 35.1911 37.0834 35.6074 36.89C37.5719 35.978 39.2481 34.5501 40.4623 32.7803C40.6758 32.4691 40.7826 32.3135 40.8966 32.2216C41.0056 32.1337 41.1034 32.0822 41.2375 32.042C41.3778 32 41.5444 32 41.8775 32H42.9601C43.5201 32 43.8001 32 44.0141 31.891C44.2022 31.7951 44.3552 31.6422 44.4511 31.454C44.5601 31.2401 44.5601 30.9601 44.5601 30.4V23.5715C44.5601 23.0383 44.5601 22.7717 44.461 22.5661C44.3627 22.362 44.1981 22.1973 43.994 22.0991C43.7883 22 43.5217 22 42.9886 22C42.6026 22 42.4099 22 42.2542 21.9476C42.0866 21.8911 41.9691 21.816 41.8475 21.6875C41.7348 21.5684 41.6427 21.3694 41.4586 20.9709C40.8677 19.6924 40.0584 18.5355 39.0786 17.5482C38.871 17.3389 38.7677 17.2344 38.7069 17.1338C38.6475 17.0379 38.6139 16.9556 38.5874 16.8459C38.5601 16.7313 38.5601 16.601 38.5601 16.3404V14.1212C38.5601 13.4011 38.5601 13.041 38.4101 12.799C38.2787 12.587 38.0729 12.4318 37.833 12.3637C37.5591 12.286 37.2129 12.3849 36.5205 12.5827L31.7754 13.9384C31.6947 13.9615 31.6545 13.973 31.6134 13.9811C31.5772 13.9882 31.5401 13.9933 31.5033 13.9965C31.4616 14 31.4197 14 31.3358 14H30.4781M10.5599 26C10.5599 21.3919 13.1573 17.3904 16.968 15.3798M10.5599 26H8.56006C6.35092 26 4.56006 24.2091 4.56006 22C4.56006 20.5194 5.36446 19.2267 6.56006 18.5351M30.5601 13C30.5601 16.866 27.4261 20 23.5601 20C19.6941 20 16.5601 16.866 16.5601 13C16.5601 9.13401 19.6941 6 23.5601 6C27.4261 6 30.5601 9.13401 30.5601 13Z"
              stroke="#EAB300"
              stroke-width="3.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="ml-2 font-['Timmana'] text-3xl text-yellow-500">Coin</span>
        </div>
        <h2 class="mt-6 text-center text-2xl font-bold text-stone-200">로그인</h2>
      </div>

      <!-- 소셜 로그인 버튼들 -->
      <div class="space-y-4">
        <button
          @click="handleNaverLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-400/20 rounded-lg text-stone-200 hover:bg-stone-800/50 transition-colors"
        >
          <img src="@/assets/naver-logo.svg" alt="Naver" class="h-5 w-5 mr-2" />
          네이버로 로그인
        </button>
        <button
          @click="handleKakaoLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-400/20 rounded-lg text-stone-200 hover:bg-stone-800/50 transition-colors"
        >
          <img src="@/assets/kakao-logo.svg" alt="Kakao" class="h-5 w-5 mr-2" />
          카카오로 로그인
        </button>
        <button
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-400/20 rounded-lg text-stone-200 hover:bg-stone-800/50 transition-colors"
        >
          <img src="@/assets/google-logo.svg" alt="Google" class="h-5 w-5 mr-2" />
          구글로 로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/plugins/axios'

const handleNaverLogin = () => {
  // 네이버 OAuth 로그인 로직 구현
  window.location.href = 'http://localhost:8080/oauth2/authorization/naver'
  console.log('Naver login clicked')
}

const handleKakaoLogin = () => {
  // 카카오 OAuth 로그인 로직 구현
  window.location.href = 'http://localhost:8080/oauth2/authorization/kakao'
  console.log('Kakao login clicked')
}

const handleGoogleLogin = () => {
  // 구글 OAuth 로그인 로직 구현
  window.location.href = 'http://localhost:8080/oauth2/authorization/google'
  console.log('Google login clicked')
}
</script>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
