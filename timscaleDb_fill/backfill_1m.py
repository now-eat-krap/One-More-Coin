import asyncio
import asyncpg
import aiohttp
from datetime import datetime, timezone
from dateutil.parser import parse as parse_dt

try:
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
except AttributeError:
    pass

POSTGRES_DSN  = "postgresql://postgres:!taewonb916@localhost:5432/postgres"
SYMBOL        = "BTCUSDT"
INTERVAL      = "1m"
# BACKFILL_FROM = "2017-08-17T00:00:00Z"
BACKFILL_FROM = "2025-06-04T09:00:00Z"
PAGE_LIMIT    = 1000

async def fetch_klines(session, symbol, interval, start_time_ms, limit=1000):
    base = "https://api.binance.com/api/v3/klines"
    params = {"symbol": symbol, "interval": interval, "limit": limit, "startTime": start_time_ms}
    async with session.get(base, params=params) as resp:
        if resp.status == 429:
            # 레이트 리밋: 잠시 대기 후 재호출
            await asyncio.sleep(2)
            return await fetch_klines(session, symbol, interval, start_time_ms, limit)
        data = await resp.json()
        return data

async def backfill():
    pool = await asyncpg.create_pool(dsn=POSTGRES_DSN, min_size=1, max_size=5)
    async with aiohttp.ClientSession() as session:
        start_dt = parse_dt(BACKFILL_FROM)
        start_ms = int(start_dt.timestamp() * 1000)
        now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)

        current_start = start_ms
        while current_start < now_ms:
            raw = await fetch_klines(session, SYMBOL, INTERVAL, current_start, PAGE_LIMIT)
            if not raw:
                break

            async with pool.acquire() as conn:
                async with conn.transaction():
                    records = []
                    for arr in raw:
                        o_time = arr[0] // 1000
                        open_p = float(arr[1])
                        high_p = float(arr[2])
                        low_p = float(arr[3])
                        close_p = float(arr[4])
                        vol = float(arr[5])
                        records.append((
                            SYMBOL,
                            datetime.fromtimestamp(o_time, timezone.utc),
                            open_p,
                            high_p,
                            low_p,
                            close_p,
                            vol,
                        ))
                    await conn.executemany(
                        """
                        INSERT INTO klines_1m
                          (symbol, open_time, open_price, high_price, low_price, close_price, volume)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        ON CONFLICT (symbol, open_time) DO NOTHING
                        """,
                        records
                    )

            last_open_time_ms = raw[-1][0]
            current_start = last_open_time_ms + 1
            await asyncio.sleep(0.1)  # 0.1초로 조정

    await pool.close()

if __name__ == "__main__":
    asyncio.run(backfill())
