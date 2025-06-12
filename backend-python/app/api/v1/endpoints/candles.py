from fastapi import APIRouter, Depends, Query
from fastapi.security import HTTPAuthorizationCredentials
from typing import List, Optional
from app.schemas.candle import Candle
from app.crud.candle import get_candles
from app.core.auth import verify_jwt

router = APIRouter()

@router.get("/candles", response_model=List[Candle])
async def read_candles(
    exchange: str = Query(...),
    symbol: str = Query(...),
    interval: str = Query(...),
    limit: int = Query(300),
    end: Optional[int] = Query(None),
    # credentials: HTTPAuthorizationCredentials = Depends(verify_jwt),
):
    return await get_candles(exchange, symbol, interval, limit, end)
