from fastapi import APIRouter, HTTPException
from app.schemas.backtest import BacktestRequest
from app.services.backtest_engine import run_backtest
from app.crud.backtest import fetch_candles
import pandas as pd
from datetime import datetime

router = APIRouter()

@router.post("/portfolio")
async def run_backtest_api(request: BacktestRequest):
    # print(request)
    start_ts = int(datetime.strptime(request.period.startDate, "%Y-%m-%d").timestamp())
    end_ts = int(datetime.strptime(request.period.endDate, "%Y-%m-%d").timestamp())

    df = await fetch_candles(
        request.exchange,
        request.symbol,
        request.interval,
        start_ts,
        end_ts,
    )
    # try:
    #     start_ts = int(datetime.strptime(request.period["startDate"], "%Y-%m-%d").timestamp())
    #     end_ts = int(datetime.strptime(request.period["endDate"], "%Y-%m-%d").timestamp())

    #     df = await fetch_candles(
    #         request.exchange,
    #         request.symbol,
    #         request.interval,
    #         start_ts,
    #         end_ts,
    #     )
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))

    if df.empty:
        raise HTTPException(status_code=404, detail="해당 조건의 데이터가 없습니다.")

    # Pandas에서 timestamp 변환
    df["time"] = pd.to_datetime(df["time"].astype(float), unit="s")
    df.set_index("time", inplace=True)
    # print([c.dict() for c in request.conditions["buy"]])


    if(request.advancedSettings.orderSizeUnit == '%'): #fractional 사용
        result = run_backtest(
            df,
            [c.dict() for c in request.conditions["buy"]],
            [c.dict() for c in request.conditions["sell"]],
            datetime.strptime(request.period.startDate, "%Y-%m-%d"),
            request.symbol,
            request.exchange,
            request.advancedSettings.initialCapital,
            request.advancedSettings.commission,
            True,  # fractional의미
            request.advancedSettings.orderSize
        )
    else:
         result = run_backtest(
            df,
            [c.dict() for c in request.conditions["buy"]],
            [c.dict() for c in request.conditions["sell"]],
            datetime.strptime(request.period.startDate, "%Y-%m-%d"),
            request.symbol,
            request.exchange,
            request.advancedSettings.initialCapital,
            request.advancedSettings.commission,
            False,  # fractional의미
            request.advancedSettings.orderSize
        )
    

   
    return result
