from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    db_url: str    = Field(..., env="DB_URL")
    redis_url: str = Field(..., env="REDIS_URL")
    jwt_secret: str = Field(..., env="JWT_SECRET")

    class Config:
        # .env 파일도 자동으로 읽도록 (compose에 넣더라도 로컬 개발 편리)
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()