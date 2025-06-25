// src/composables/useTutorial.js
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const TUTORIAL_KEY = 'tutorial_shown'

export const useTutorial = () => {
  const steps = [
    {
      element: '#step1',
      popover: {
        title: '심볼 선택',
        description: '이곳에서 거래소와 심볼은 선택할 수 있어요.',
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '#step2',
      popover: {
        title: '인터벌 선택',
        description: '인터벌을 여기서 선택할 수 있어요.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step3',
      popover: {
        title: '백테스팅',
        description: '백테스팅 조건은 여기서 설정해요',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#step3-1',
      popover: {
        title: '조건 유형 선택',
        description: '원하는 백테스팅 조건 유형을 선택해요',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step3-2',
      popover: {
        title: '주문 조건 선택',
        description: '주문 조건(매수 or 매도)은 여기서 설정해요',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step3-3',
      popover: {
        title: '백테스팅 조건 선택',
        description: '세부 조건은 여기서 설정해요',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step3-4',
      popover: {
        title: '조건 저장',
        description: '조건을 저장해주세요',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step4',
      popover: {
        title: '날짜 선택',
        description: '백테스팅 기간을 선택할 수 있어요.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step5',
      popover: {
        title: '고급 설정',
        description: '수수료, 주문수량 등 고급 설정을 할 수 있어요.',
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '#step6',
      popover: {
        title: '백테스팅 실행',
        description: '날짜, 매수/매도 조건을 모두 선택하면 백테스팅이 가능해요',
        side: 'top',
        align: 'center',
      },
    },
  ]

  const start = () => {
    if (localStorage.getItem(TUTORIAL_KEY) === 'true') return

    const tour = driver({
      onNextClick: () => {
        if (tour.isLastStep()) {
          // ✅ 마지막 단계에서 "다음"을 눌렀을 때 처리
          localStorage.setItem('tutorial_shown', 'true')
        }
        tour.moveNext()
      },
      overlayColor: 'rgba(0, 0, 0, 1)',
      showProgress: true,
      steps,
      allowClose: false,
      nextBtnText: '다음',
      prevBtnText: '이전',
      doneBtnText: '완료',
    })

    tour.drive()
  }
  const reset = () => {
    localStorage.removeItem(TUTORIAL_KEY)
    const tour = driver({
      showProgress: true,
      steps,
    })
    tour.drive()
  }

  return { start, reset }
}
