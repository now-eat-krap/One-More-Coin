// 캔들 패턴 정의 (TA-Lib 기준)

export const candlestickPatterns = {
  CDL3WHITESOLDIERS: {
    label: 'Three White Soldiers',
    korean: '삼병 (3연속 양봉)',
    type: 'bullish',
    description: {
      shape: '3개의 양봉이 연속으로 상승 마감하며, 몸통이 크고 꼬리가 짧은 형태',
      effect: '하락세 이후 매수세 유입으로 강한 상승 반전을 예고함',
    },
  },

  CDLENGULFING_Bullish: {
    label: 'Bullish Engulfing',
    korean: '상승 장악형',
    type: 'bullish',
    description: {
      shape: '음봉 뒤 양봉이 이전 음봉의 몸통을 완전히 감싸는 형태',
      effect: '매도세가 완전히 흡수되고 매수세가 전환된다는 신호',
    },
  },

  CDLPIERCING: {
    label: 'Piercing Line',
    korean: '관통형',
    type: 'bullish',
    description: {
      shape: '하락 음봉 이후 양봉이 시가보다 낮게 시작해 전일 몸통의 절반 이상 회복',
      effect: '단기 반등 가능성 있는 매수 전환 패턴',
    },
  },

  CDLMORNINGSTAR: {
    label: 'Morning Star',
    korean: '모닝스타',
    type: 'bullish',
    description: {
      shape: '음봉 → 작은 몸통 → 양봉 순서의 3캔들 구성',
      effect: '하락세 종료 후 반등의 시작을 알리는 패턴',
    },
  },

  CDLINVERTEDHAMMER: {
    label: 'Inverted Hammer',
    korean: '역망치형',
    type: 'bullish',
    description: {
      shape: '몸통 작고 위 꼬리가 길며 아래 꼬리가 짧은 양봉',
      effect: '저점에서 매수세 진입 시사, 반등 가능성 있음',
    },
  },

  CDLHAMMER: {
    label: 'Hammer',
    korean: '망치형',
    type: 'bullish',
    description: {
      shape: '작은 몸통, 아래 꼬리 길고 위 꼬리 짧은 양봉',
      effect: '지지선에서 반등 가능성 나타냄',
    },
  },

  CDL3BLACKCROWS: {
    label: 'Three Black Crows',
    korean: '삼까마귀 (3연속 음봉)',
    type: 'bearish',
    description: {
      shape: '3개의 음봉이 연속 하락하며 나타나는 패턴',
      effect: '상승세 종료 후 하락 반전을 예고함',
    },
  },

  CDLENGULFING_Bearish: {
    label: 'Bearish Engulfing',
    korean: '하락 장악형',
    type: 'bearish',
    description: {
      shape: '양봉 뒤 음봉이 양봉의 몸통을 완전히 감싸는 형태',
      effect: '상승세가 꺾이고 하락세로 전환될 가능성',
    },
  },

  CDLDARKCLOUDCOVER: {
    label: 'Dark Cloud Cover',
    korean: '흑운형',
    type: 'bearish',
    description: {
      shape: '양봉 뒤 시가 상승 → 종가는 이전 몸통 절반 이하로 하락',
      effect: '상승세 둔화 및 하락 전환 경고',
    },
  },

  CDLEVENINGSTAR: {
    label: 'Evening Star',
    korean: '석별형',
    type: 'bearish',
    description: {
      shape: '양봉 → 작은 몸통 → 음봉 순서의 3캔들 구성',
      effect: '상승세 마무리, 하락세로 전환 가능성 시사',
    },
  },

  CDLSHOOTINGSTAR: {
    label: 'Shooting Star',
    korean: '슈팅스타',
    type: 'bearish',
    description: {
      shape: '작은 몸통, 위 꼬리 길고 아래 꼬리 짧은 음봉',
      effect: '고점에서 매도세 유입 가능성을 나타내는 경고 신호',
    },
  },
}
