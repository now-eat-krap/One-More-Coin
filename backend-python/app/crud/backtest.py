import os
import asyncpg
import pandas as pd
from app.core.config import settings

INTERVAL_TABLE_MAP = {
    "1m": "klines_1m",
    "5m": "klines_5m",
    "15m": "klines_15m",
    "1h": "klines_1h",
    "4h": "klines_4h",
    "1d": "klines_1d",
    "1w": "klines_1w",
    "1M": "klines_1month",
}

SECONDS_MAP = {
        "1m": 60,
        "5m": 60 * 5,
        "15m": 60 * 15,
        "1h": 60 * 60,
        "4h": 60 * 60 * 4,
        "1d": 60 * 60 * 24,
        "1w": 60 * 60 * 24 * 7,
        "1M": 60 * 60 * 24 * 30,
    }

async def fetch_candles(exchange, symbol, interval, start_time, end_time):
    # print(exchange, symbol, interval, start_time, end_time)
    db_url = settings.db_url
    if not db_url:
        raise RuntimeError("DB_URL 환경변수가 설정되지 않았습니다.")

    table = INTERVAL_TABLE_MAP.get(interval)
    if not table:
        raise ValueError("지원하지 않는 interval입니다.")

    sec_per_bar = SECONDS_MAP.get(interval)
    if sec_per_bar is None:
        raise ValueError(f"지원하지 않는 interval: {interval}")

    # 2. 원하는 바 개수 (1000개정도 여유를 가지고 불러와야지 지표의 무결성이 보장된다)
    target_bars = 1000
    fetch_start = start_time - target_bars * sec_per_bar

    time_col = "open_time" if interval == "1m" else "bucket"
    query = f"""
        SELECT
            EXTRACT(EPOCH FROM {time_col}) AS time,
            {"open_price" if interval == "1m" else "open"} AS open,
            {"high_price" if interval == "1m" else "high"} AS high,
            {"low_price" if interval == "1m" else "low"} AS low,
            {"close_price" if interval == "1m" else "close"} AS close
        FROM {table}
        WHERE exchange = $1 AND symbol = $2
          AND {time_col} BETWEEN to_timestamp($3) AND to_timestamp($4)
        ORDER BY {time_col} ASC
    """

    # 수정된 부분: connect에 await 먼저 사용하고 try-finally로 연결 종료
    conn = await asyncpg.connect(dsn=db_url)
    try:
        rows = await conn.fetch(query, exchange.lower(), symbol.upper(), fetch_start, end_time+32400)
        return pd.DataFrame(rows, columns=["time", "open", "high", "low", "close"])
    finally:
        await conn.close()
