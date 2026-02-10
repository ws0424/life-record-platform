from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas import UserCreate, UserLogin, TokenResponse, UserResponse, SendCodeResponse
from app.utils.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.utils.verification import generate_code, save_code, verify_code, check_code_rate_limit
from app.services.email_service import send_verification_email
from datetime import datetime, timedelta
from app.core.config import settings
import re


class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    async def send_verification_code(self, email: str, code_type: str) -> SendCodeResponse:
        """发送验证码"""
        # 检查频率限制
        if not check_code_rate_limit(email):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="发送过于频繁，请60秒后再试"
            )
        
        # 如果是注册，检查邮箱是否已存在
        if code_type == "register":
            existing_user = self.db.query(User).filter(User.email == email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="该邮箱已被注册"
                )
        
        # 如果是重置密码，检查邮箱是否存在
        if code_type == "reset":
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="该邮箱未注册"
                )
        
        # 生成验证码
        code = generate_code()
        save_code(email, code, code_type)
        
        # 发送邮件
        try:
            await send_verification_email(email, code, code_type)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"邮件发送失败: {str(e)}"
            )
        
        return SendCodeResponse(
            email=email,
            expires_in=settings.CODE_EXPIRE_MINUTES * 60,
            sent_at=datetime.utcnow()
        )
    
    async def register_user(self, user_data: UserCreate) -> TokenResponse:
        """用户注册"""
        # 验证密码一致性
        if user_data.password != user_data.confirm_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="两次输入的密码不一致"
            )
        
        # 验证密码强度（包含字母和数字）
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$', user_data.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="密码必须包含字母和数字"
            )
        
        # 验证验证码
        if not verify_code(user_data.email, user_data.code, "register"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="验证码错误或已过期"
            )
        
        # 检查邮箱是否已存在
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="该邮箱已被注册"
            )
        
        # 检查用户名是否已存在
        existing_username = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="该用户名已被使用"
            )
        
        # 创建用户
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=hashed_password,
            is_verified=True  # 邮箱验证码验证通过，直接设为已验证
        )
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        
        # 生成 Token
        access_token = create_access_token(data={"sub": str(new_user.id)})
        refresh_token = create_refresh_token(data={"sub": str(new_user.id)}, remember=False)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.from_orm(new_user)
        )
    
    async def login_user(self, login_data: UserLogin) -> TokenResponse:
        """用户登录"""
        # 查找用户
        user = self.db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="邮箱或密码错误"
            )
        
        # 验证密码
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="邮箱或密码错误"
            )
        
        # 检查账户是否激活
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="账户已被禁用"
            )
        
        # 生成 Token
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)}, remember=login_data.remember)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="Bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=UserResponse.from_orm(user)
        )

