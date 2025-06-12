// RSI 파라미터
export const rsiParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 14,
    min: 1,
    max: 100,
    description: 'RSI 계산에 사용할 기간을 설정합니다.'
  }
}

// MACD 파라미터
export const macdParams = {
  fastPeriod: {
    label: '빠른 이평선 기간',
    type: 'number',
    default: 12,
    min: 1,
    max: 100,
    description: '빠른 이동평균선의 기간을 설정합니다.'
  },
  slowPeriod: {
    label: '느린 이평선 기간',
    type: 'number',
    default: 26,
    min: 1,
    max: 100,
    description: '느린 이동평균선의 기간을 설정합니다.'
  },
  signalPeriod: {
    label: '시그널 기간',
    type: 'number',
    default: 9,
    min: 1,
    max: 100,
    description: '시그널 라인의 기간을 설정합니다.'
  }
}

// EMA 파라미터
export const emaParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 20,
    min: 1,
    max: 200,
    description: '지수이동평균선의 기간을 설정합니다.'
  }
}

// SMA 파라미터
export const smaParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 20,
    min: 1,
    max: 200,
    description: '단순이동평균선의 기간을 설정합니다.'
  }
}

// 볼린저 밴드 파라미터
export const bollingerParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 20,
    min: 1,
    max: 100,
    description: '볼린저 밴드 계산에 사용할 기간을 설정합니다.'
  },
  stdDev: {
    label: '표준편차',
    type: 'number',
    default: 2,
    min: 0.1,
    max: 5,
    step: 0.1,
    description: '표준편차 배수를 설정합니다.'
  }
}

// 스토캐스틱 파라미터
export const stochParams = {
  kPeriod: {
    label: 'K 기간',
    type: 'number',
    default: 14,
    min: 1,
    max: 100,
    description: '스토캐스틱 K의 기간을 설정합니다.'
  },
  dPeriod: {
    label: 'D 기간',
    type: 'number',
    default: 3,
    min: 1,
    max: 100,
    description: '스토캐스틱 D의 기간을 설정합니다.'
  },
  slowing: {
    label: '슬로잉',
    type: 'number',
    default: 3,
    min: 1,
    max: 100,
    description: '슬로잉 기간을 설정합니다.'
  }
}

// ATR 파라미터
export const atrParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 14,
    min: 1,
    max: 100,
    description: 'ATR 계산에 사용할 기간을 설정합니다.'
  }
}

// CCI 파라미터
export const cciParams = {
  period: {
    label: '기간',
    type: 'number',
    default: 20,
    min: 1,
    max: 100,
    description: 'CCI 계산에 사용할 기간을 설정합니다.'
  }
}

export const indicatorMeta = {
  rsi: {
    label: 'RSI',
    description: '상대강도지수 (과매수/과매도 판단)',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 14,
        min: 1,
        max: 100,
        description: 'RSI 계산에 사용할 기간을 설정합니다.'
      }
    }
  },

  macd: {
    label: 'MACD',
    description: '이동평균 수렴·확산 지표',
    params: {
      fastPeriod: {
        label: '빠른 이평선 기간',
        type: 'number',
        default: 12,
        min: 1,
        max: 100,
        description: '빠른 이동평균선의 기간을 설정합니다.'
      },
      slowPeriod: {
        label: '느린 이평선 기간',
        type: 'number',
        default: 26,
        min: 1,
        max: 100,
        description: '느린 이동평균선의 기간을 설정합니다.'
      },
      signalPeriod: {
        label: '시그널 기간',
        type: 'number',
        default: 9,
        min: 1,
        max: 100,
        description: '시그널 라인의 기간을 설정합니다.'
      }
    }
  },

  ema: {
    label: 'EMA',
    description: '지수이동평균선',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 20,
        min: 1,
        max: 200,
        description: '지수이동평균선의 기간을 설정합니다.'
      }
    }
  },

  sma: {
    label: 'SMA',
    description: '단순이동평균선',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 20,
        min: 1,
        max: 200,
        description: '단순이동평균선의 기간을 설정합니다.'
      }
    }
  },

  bollinger: {
    label: '볼린저 밴드',
    description: '표준편차를 활용한 변동성 지표',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 20,
        min: 1,
        max: 100,
        description: '볼린저 밴드 계산에 사용할 기간을 설정합니다.'
      },
      stdDev: {
        label: '표준편차',
        type: 'number',
        default: 2,
        min: 0.1,
        max: 5,
        step: 0.1,
        description: '표준편차 배수를 설정합니다.'
      }
    }
  },

  stoch: {
    label: '스토캐스틱',
    description: '과매수/과매도 모멘텀 지표',
    params: {
      kPeriod: {
        label: 'K 기간',
        type: 'number',
        default: 14,
        min: 1,
        max: 100,
        description: '스토캐스틱 K의 기간을 설정합니다.'
      },
      dPeriod: {
        label: 'D 기간',
        type: 'number',
        default: 3,
        min: 1,
        max: 100,
        description: '스토캐스틱 D의 기간을 설정합니다.'
      },
      slowing: {
        label: '슬로잉',
        type: 'number',
        default: 3,
        min: 1,
        max: 100,
        description: '슬로잉 기간을 설정합니다.'
      }
    }
  },

  atr: {
    label: 'ATR',
    description: '평균 진폭 기반 변동성 측정 지표',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 14,
        min: 1,
        max: 100,
        description: 'ATR 계산에 사용할 기간을 설정합니다.'
      }
    }
  },

  cci: {
    label: 'CCI',
    description: '원자재 채널 지수 (추세 반전 지표)',
    params: {
      period: {
        label: '기간',
        type: 'number',
        default: 20,
        min: 1,
        max: 100,
        description: 'CCI 계산에 사용할 기간을 설정합니다.'
      }
    }
  }
}

// 지표별 파라미터 매핑 (이전 버전과의 호환성을 위해 유지)
export const indicatorParams = Object.fromEntries(
  Object.entries(indicatorMeta).map(([key, value]) => [key, value.params])
)

// 지표별 기본값 (이전 버전과의 호환성을 위해 유지)
export const defaultParams = Object.fromEntries(
  Object.entries(indicatorMeta).map(([key, value]) => [
    key,
    Object.fromEntries(
      Object.entries(value.params).map(([paramKey, paramValue]) => [
        paramKey,
        paramValue.default
      ])
    )
  ])
) 