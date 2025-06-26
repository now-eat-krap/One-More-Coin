<!-- src/pages/Home.vue -->
<template>
  <div>
    <!-- Hero 섹션 (타이틀 + 버튼) -->
    <section
      class="relative bg-[radial-gradient(ellipse_at_50%_-2%,rgba(13,10,2,0.7)_31%,rgba(112,85,0,0.1)_100%)] pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="mx-auto max-w-7xl flex flex-col items-center gap-12">
        <!-- 제목 -->
        <h1
          class="text-stone-200 font-['Roboto_Serif'] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center leading-snug sm:leading-tight animate-fade-in-up"
        >
          당신만의 전략으로<br class="hidden sm:block" />수익을 창출하세요
        </h1>

        <!-- Get Started 버튼 -->
        <RouterLink
          to="/chart"
          class="px-6 py-3 bg-yellow-600 rounded-lg text-stone-200 font-['Public_Sans'] font-medium text-base sm:text-lg md:text-xl hover:bg-yellow-800 transition animate-fade-in-up animation-delay-200"
        >
          전략 백테스트 시작하기
        </RouterLink>
      </div>
    </section>

    <!-- Card 섹션 -->
    <section class="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-4xl">
        <div
          class="relative bg-black/80 rounded-2xl shadow-[0px_12px_27px_rgba(0,0,0,0.03),0px_50px_50px_rgba(0,0,0,0.03),0px_112px_67px_rgba(0,0,0,0.02)] outline outline-[1.5px] outline-stone-400/20 overflow-hidden animate-fade-in-up animation-delay-400"
        >
          <!-- 카드 전체 크기를 비율로 잡아주기 위함 -->
          <div class="pt-[56.25%]"></div>
          <!-- 16:9 비율(예: 1024:576) 정도, 아래 absolute 박스가 겹쳐서 채움 -->

          <!-- 카드 내부 콘텐츠를 절대 위치로 배치 -->
          <div class="absolute inset-0 flex flex-col">
            <!-- 1) 상단 로고 + Explore 버튼 -->
            <div class="flex items-center justify-between p-5">
              <!-- 왼쪽 로고 + 텍스트 -->
              <div class="flex items-center gap-2 animate-fade-in-right">
                <img src="@/assets/logo.png" alt="Coin Logo" class="h-10" />
              </div>

              <!-- 오른쪽 Explore 버튼 -->
              <button
                class="px-4 py-2 bg-yellow-600 rounded-lg text-stone-200 font-['Public_Sans'] font-medium text-sm sm:text-base hover:bg-yellow-800 transition animate-fade-in-left"
              >
                전략 둘러보기
              </button>
            </div>

            <!-- 2) 카드 본문: 왼쪽에 두 개의 큰 사각형, 오른쪽에 세로 사각형 -->
            <div class="flex-1 grid grid-cols-4 gap-2 px-5 pb-5">
              <!-- 왼쪽 박스: 통합 차트 애니메이션 -->
              <div
                class="col-span-3 flex-1 shadow-inner relative overflow-hidden animate-fade-in-up animation-delay-600"
              >
                <div class="h-1/2 flex rounded-lg bg-stone-800 items-center justify-center p-1">
                  <img src="/common/chart.png" class="h-full" />
                </div>
                <div
                  class="h-1/2 flex rounded-lg bg-stone-800 items-center justify-center mt-1 p-1"
                >
                  <img src="/common/result.png" class="h-full mb-1" />
                </div>
              </div>
              <!-- 오른쪽 세로 박스 -->
              <div
                class="bg-stone-800 rounded-lg shadow-inner relative overflow-hidden animate-fade-in-up animation-delay-600"
              >
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-1">
                  <img src="/common/condition.png" class="h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const animationInterval = ref(null)

// 컴포넌트 언마운트 시 인터벌 정리
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out forwards;
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
</style>
