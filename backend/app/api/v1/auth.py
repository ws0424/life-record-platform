from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    SendCodeRequest,
    SendCodeResponse,
    MessageResponse
)
from app.services.auth_service import AuthService
from datetime import datetime

router = APIRouter()


@router.post("/send-code", response_model=SendCodeResponse)
async def send_verification_code(
    request: SendCodeRequest,
    db: Session = Depends(get_db)
):
    """发送验证码"""
    auth_service = AuthService(db)
    result = await auth_service.send_verification_code(request.email, request.type)
    return result


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """用户注册"""
    auth_service = AuthService(db)
    result = await auth_service.register_user(user_data)
    return result


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """用户登录"""
    auth_service = AuthService(db)
    result = await auth_service.login_user(login_data)
    return result


@router.post("/logout", response_model=MessageResponse)
async def logout():
    """用户登出"""
    return MessageResponse(message="登出成功")


@router.get("/me")
async def get_current_user():
    """获取当前用户信息"""
    # TODO: 实现获取当前用户逻辑
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="功能开发中"
    )

