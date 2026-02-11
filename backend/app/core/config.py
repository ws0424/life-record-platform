from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # 数据库配置
    DATABASE_URL: str
    
    # Redis 配置
    REDIS_URL: str
    
    # JWT 配置
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # 邮件配置
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int = 587
    MAIL_SERVER: str
    MAIL_FROM_NAME: str = "生活记录平台"
    
    # 应用配置
    APP_NAME: str = "生活记录平台"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ALLOWED_HOSTS: str = "localhost,127.0.0.1"
    
    # CORS 配置
    CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    
    # 限流配置
    RATE_LIMIT_PER_MINUTE: int = 60
    LOGIN_RATE_LIMIT_PER_MINUTE: int = 10
    CODE_RATE_LIMIT_PER_HOUR: int = 10
    
    # 安全配置
    PASSWORD_MIN_LENGTH: int = 6
    PASSWORD_MAX_LENGTH: int = 50  # bcrypt 限制 72 字节，设置为 50 字符更安全
    CODE_EXPIRE_MINUTES: int = 5
    LOGIN_FAIL_LOCK_MINUTES: int = 30
    MAX_LOGIN_ATTEMPTS: int = 5
    
    # MinIO 配置
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin123"
    MINIO_BUCKET: str = "utils-web"
    MINIO_SECURE: bool = False
    MINIO_PUBLIC_URL: str = "http://localhost:9000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

