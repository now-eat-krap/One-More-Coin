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
        <button
          class="px-6 py-3 bg-yellow-600 rounded-lg text-stone-200 font-['Public_Sans'] font-medium text-base sm:text-lg md:text-xl hover:bg-yellow-800 transition animate-fade-in-up animation-delay-200"
        >
          전략 백테스트 시작하기
        </button>
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
                <svg
                  class="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500"
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
                <span class="text-yellow-500 font-['Timmana'] text-lg sm:text-xl"> Coin </span>
              </div>

              <!-- 오른쪽 Explore 버튼 -->
              <button
                class="px-4 py-2 bg-yellow-600 rounded-lg text-stone-200 font-['Public_Sans'] font-medium text-sm sm:text-base hover:bg-yellow-800 transition animate-fade-in-left"
              >
                전략 둘러보기
              </button>
            </div>

            <!-- 2) 카드 본문: 왼쪽에 두 개의 큰 사각형, 오른쪽에 세로 사각형 -->
            <div class="flex-1 grid grid-cols-3 gap-4 px-5 pb-5">
              <!-- 왼쪽 박스: 통합 차트 애니메이션 -->
              <div class="col-span-2 flex-1 bg-stone-800 rounded-lg shadow-inner relative overflow-hidden animate-fade-in-up animation-delay-600">
                <div class="absolute inset-0 flex items-center justify-center">
                  <!-- 차트 영역 -->
                </div>
              </div>
              <!-- 오른쪽 세로 박스 -->
              <div class="bg-stone-800 rounded-lg shadow-inner relative overflow-hidden animate-fade-in-up animation-delay-800">
                <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                  <!-- 성과 지표 영역 -->
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

// 컴포넌트 언마운트 시 인터벌 정리
onUnmounted(() => {
  if (animationInterval) {
    clearInterval(animationInterval)
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
