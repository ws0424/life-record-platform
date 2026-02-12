from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from app.core.config import settings
import hashlib
import base64

# 配置 bcrypt，设置 truncate_error=False 和 ident="2b" 来避免初始化错误
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b",  # 使用 2b 版本，避免 wrap bug 检测
    bcrypt__default_rounds=12  # 设置默认轮次
)


def _truncate_password(password: str) -> str:
    """
    安全地截断密码到 72 字节以内
    使用 SHA256 哈希确保：
    1. 任意长度的密码都能处理
    2. 输出固定为 44 字节（base64 编码后）
    3. 保持密码的熵值
    """
    # 检查密码字节长度
    password_bytes = password.encode('utf-8')
    
    # 如果密码小于 72 字节，直接返回
    if len(password_bytes) <= 72:
        return password
    
    # 如果超过 72 字节，使用 SHA256 哈希
    password_hash = hashlib.sha256(password_bytes).digest()
    return base64.b64encode(password_hash).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    # 先对明文密码进行截断处理
    processed_password = _truncate_password(plain_password)
    return pwd_context.verify(processed_password, hashed_password)


def get_password_hash(password: str) -> str:
    """生成密码哈希"""
    # 先对密码进行截断处理，确保不超过 72 字节
    processed_password = _truncate_password(password)
    return pwd_context.hash(processed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, remember: bool = False) -> str:
    """创建刷新令牌"""
    to_encode = data.copy()
    if remember:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    else:
        expire = datetime.utcnow() + timedelta(days=1)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """解码令牌"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def store_token(user_id: str, device_id: str, token: str, expire_seconds: int = None):
    """存储 Token 到 Redis"""
    from app.core.redis import get_redis
    redis_client = get_redis()
    
    # 使用 user_id:device_id 作为 key
    token_key = f"user_token:{user_id}:{device_id}"
    
    # 设置过期时间（默认为 access token 过期时间）
    if expire_seconds is None:
        expire_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    
    # 存储 token
    redis_client.setex(token_key, expire_seconds, token)


def get_stored_token(user_id: str, device_id: str) -> Optional[str]:
    """从 Redis 获取存储的 Token"""
    from app.core.redis import get_redis
    redis_client = get_redis()
    
    token_key = f"user_token:{user_id}:{device_id}"
    return redis_client.get(token_key)


def remove_token(user_id: str, device_id: str):
    """从 Redis 删除 Token（强制下线）"""
    from app.core.redis import get_redis
    redis_client = get_redis()
    
    token_key = f"user_token:{user_id}:{device_id}"
    redis_client.delete(token_key)


def is_token_valid(user_id: str, device_id: str, token: str) -> bool:
    """验证 Token 是否有效（检查 Redis 中是否存在且匹配）"""
    stored_token = get_stored_token(user_id, device_id)
    return stored_token is not None and stored_token == token

