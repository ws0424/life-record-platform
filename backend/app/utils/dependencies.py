from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.utils.security import decode_token, is_token_valid
from app.services.security_service import SecurityService
from typing import Optional

security = HTTPBearer()


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """获取当前登录用户"""
    token = credentials.credentials
    
    # 解码 token
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭证"
        )
    
    # 检查 token 类型
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的 token 类型"
        )
    
    # 获取用户 ID
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证凭证"
        )
    
    # 获取当前设备 ID
    user_agent = request.headers.get("user-agent", "")
    ip_address = request.client.host if request.client else ""
    device_id = SecurityService.generate_device_id(user_agent, ip_address)
    
    # 检查 Token 是否有效（Redis 中是否存在且匹配）
    if not is_token_valid(user_id, device_id, token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token 已失效，请重新登录"
        )
    
    # 查询用户
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户不存在"
        )
    
    # 检查用户是否激活
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账户已被禁用"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """获取当前激活的用户"""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账户已被禁用"
        )
    return current_user


async def get_optional_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Optional[User]:
    """获取当前用户（可选，允许未登录）"""
    try:
        # 尝试从 Authorization header 获取 token
        auth_header = request.headers.get("authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None
        
        token = auth_header.replace("Bearer ", "")
        
        # 解码 token
        payload = decode_token(token)
        if payload is None:
            return None
        
        # 检查 token 类型
        if payload.get("type") != "access":
            return None
        
        # 获取用户 ID
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        
        # 获取当前设备 ID
        user_agent = request.headers.get("user-agent", "")
        ip_address = request.client.host if request.client else ""
        device_id = SecurityService.generate_device_id(user_agent, ip_address)
        
        # 检查 Token 是否有效
        if not is_token_valid(user_id, device_id, token):
            return None
        
        # 查询用户
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        return user
    except Exception:
        return None

