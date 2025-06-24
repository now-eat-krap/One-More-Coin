import asyncpg
import os
from typing import Optional

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

async def get_candles(exchange: str, symbol: str, interval: str, limit: int, end: Optional[int] = None):
    db_url = os.getenv("DB_URL")
    if not db_url:
        raise RuntimeError("DB_URL 환경변수가 설정되지 않았습니다.")

    table_name = INTERVAL_TABLE_MAP.get(interval)
    if not table_name:
        raise ValueError(f"지원하지 않는 interval: {interval}")

    time_column = "open_time" if interval == "1m" else "bucket"
    
    # WHERE 절에 exchange와 symbol을 모두 포함
    where_clause = f"WHERE exchange = $1 AND symbol = $2"
    params = [exchange.lower(), symbol.upper()]

    if end is not None:
        where_clause += f" AND {time_column} <= to_timestamp(${len(params) + 1})"
        params.append(end)

    query = f"""
        SELECT 
            EXTRACT(EPOCH FROM {time_column}) AS time,
            {"open_price" if interval == "1m" else "open"} AS open,
            {"high_price" if interval == "1m" else "high"} AS high,
            {"low_price" if interval == "1m" else "low"} AS low,
            {"close_price" if interval == "1m" else "close"} AS close
        FROM {table_name}
        {where_clause}
        ORDER BY {time_column} DESC
        LIMIT ${len(params) + 1}
    """
    params.append(limit)

    conn = await asyncpg.connect(dsn=db_url)
    rows = await conn.fetch(query, *params)
    await conn.close()

    # 시간 오름차순으로 리턴
    return [dict(row) for row in reversed(rows)]
