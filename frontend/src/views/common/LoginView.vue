<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 animate-fade-in-up">
      <!-- 로고 영역 -->
      <div class="text-center">
        <div class="flex justify-center animate-fade-in-down">
          <img src="@/assets/logo.png" alt="Coin Logo" class="h-12" />
        </div>
        <h2 class="mt-6 text-3xl font-['Roboto_Serif'] font-bold text-stone-200 animate-fade-in-up animation-delay-200">
          One More Coin
        </h2>
        <p class="mt-2 text-sm text-stone-400 animate-fade-in-up animation-delay-400">
          당신만의 전략으로 수익을 창출하세요
        </p>
      </div>

      <!-- 소셜 로그인 버튼 -->
      <div class="mt-8 space-y-4 animate-fade-in-up animation-delay-600">
        <button
          @click="handleGoogleLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-700 rounded-lg text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <img src="@/assets/google-logo.svg" alt="Google" class="h-5 w-5 mr-2" />
          Google로 계속하기
        </button>
        <button
          @click="handleKakaoLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-700 rounded-lg text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <img src="@/assets/kakao-logo.svg" alt="Kakao" class="h-5 w-5 mr-2" />
          카카오로 계속하기
        </button>
        <button
          @click="handleNaverLogin"
          class="w-full flex items-center justify-center px-4 py-3 border border-stone-700 rounded-lg text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <img src="@/assets/naver-logo.svg" alt="Naver" class="h-5 w-5 mr-2" />
          네이버로 계속하기
        </button>
      </div>

      <!-- 이용약관 -->
      <p class="mt-4 text-xs text-center text-stone-500 animate-fade-in-up animation-delay-800">
        계속하기를 클릭하면 One More Coin의
        <a href="#" class="text-yellow-500 hover:text-yellow-400">이용약관</a>과
        <a href="#" class="text-yellow-500 hover:text-yellow-400">개인정보처리방침</a>에
        동의하게 됩니다.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const animationInterval = ref(null)

const handleGoogleLogin = () => {
  window.location.href = '/oauth2/authorization/google'
}

const handleKakaoLogin = () => {
  window.location.href = '/oauth2/authorization/kakao'
}

const handleNaverLogin = () => {
  window.location.href = '/oauth2/authorization/naver'
}

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

.animation-delay-800 {
  animation-delay: 800ms;
}

.animation-delay-1000 {
  animation-delay: 1000ms;
}

.animation-delay-1200 {
  animation-delay: 1200ms;
}
</style>
