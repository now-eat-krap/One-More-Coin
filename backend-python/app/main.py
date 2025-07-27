from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ 꼭 필요!
from dotenv import load_dotenv
from app.api.v1.endpoints import candles
from app.api.v1.endpoints import strategy_backtest
from app.api.v1.endpoints import portfolio_backtest

load_dotenv()

app = FastAPI()

# 허용할 origin 리스트
origins = [
    "http://localhost:5173",  # Vue 개발 서버 주소
    # "http://your-frontend-domain.com",  # 배포 시 추가
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candles.router, prefix="/api/v1")
app.include_router(strategy_backtest.router, prefix="/api/v1/backtest")
app.include_router(portfolio_backtest.router, prefix="/api/v1/backtest")

