import random
from app.core.redis import get_redis
from app.core.config import settings


def generate_code() -> str:
    """生成6位数字验证码"""
    return str(random.randint(100000, 999999))


def save_code(email: str, code: str, code_type: str) -> None:
    """保存验证码到 Redis"""
    redis_client = get_redis()
    key = f"verify_code:{code_type}:{email}"
    redis_client.setex(key, settings.CODE_EXPIRE_MINUTES * 60, code)


def verify_code(email: str, code: str, code_type: str) -> bool:
    """验证验证码"""
    redis_client = get_redis()
    key = f"verify_code:{code_type}:{email}"
    saved_code = redis_client.get(key)
    
    if saved_code and saved_code == code:
        redis_client.delete(key)
        return True
    return False


def check_code_rate_limit(email: str) -> bool:
    """检查验证码发送频率限制"""
    redis_client = get_redis()
    key = f"code_rate_limit:{email}"
    
    if redis_client.exists(key):
        return False
    
    redis_client.setex(key, 60, "1")  # 60秒内只能发送一次
    return True

