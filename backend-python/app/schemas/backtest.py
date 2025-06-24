from typing import List, Literal, Union, Optional, Dict
from pydantic import BaseModel, validator, Extra

# --- 지표 설정 공통 ---
class IndicatorSettings(BaseModel):
    class Config:
        extra = Extra.allow

# --- indicator (고정 수치와 비교) 전용 Params ---
class IndicatorParams(BaseModel):
    indicator: List[str]  # ex: ["rsi"]
    operator: Literal['>', '<', '>=', '<=', '==', 'crossover', 'crossunder']
    settings: List[IndicatorSettings]
    oversold: Optional[float] = None  # 기본값 None으로 선택적 필드 처리

    @validator('settings', pre=True)
    def ensure_list(cls, v):
        # dict로 들어오면 [dict] 로 감싸 줌
        if isinstance(v, dict):
            return [v]
        return v

# --- indicator_compare (지표 vs 지표) 전용 Params ---
class IndicatorCompareParams(BaseModel):
    indicator: List[str]
    operator: Literal['>', '<', '>=', '<=', '==', 'crossover', 'crossunder']
    settings: List[IndicatorSettings]

    @validator('settings', pre=True)
    def ensure_list(cls, v):
        if isinstance(v, dict):
            return [v]
        return v

# --- candle_pattern (캔들 패턴) 전용 Params ---
class CandlePatternParams(BaseModel):
    pattern: str

# --- Condition 모델을 정의 ---
class IndicatorCondition(BaseModel):
    type: Literal['indicator']
    params: IndicatorParams

class IndicatorCompareCondition(BaseModel):
    type: Literal['indicator_compare']
    params: IndicatorCompareParams

class CandlePatternCondition(BaseModel):
    type: Literal['candle_pattern']
    params: CandlePatternParams

# --- Union 타입으로 묶기 ---
Condition = Union[IndicatorCondition, IndicatorCompareCondition, CandlePatternCondition]

# --- 나머지 모델은 그대로 ---
class BacktestPeriod(BaseModel):
    startDate: str
    endDate: str

class AdvancedSettings(BaseModel):
    initialCapital: int
    baseCurrency: str
    orderSize: float
    orderSizeUnit: str
    pyramiding: int
    pyramidingUnit: str
    commission: float
    commissionUnit: str
    limitOrderPriceVerification: float
    slippage: float
    longPositionMargin: float
    shortPositionMargin: float
    recalculateAfterOrder: bool
    recalculatePerTick: bool
    useBarMagnifier: bool
    atClosePrice: bool
    useStandardOHLC: bool

class BacktestRequest(BaseModel):
    period: BacktestPeriod
    conditions: Dict[str, List[Condition]]
    symbol: str
    exchange: str
    interval: str
    advancedSettings: AdvancedSettings
