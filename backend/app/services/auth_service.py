from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas import (
    UserCreate, 
    UserLogin, 
    TokenResponse, 
    UserResponse, 
    SendCodeResponse,
    TokenData,
    SendCodeData,
    ApiResponse,
    ResetPasswordRequest,
    MessageResponse
)
from app.utils.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.utils.verification import generate_code, save_code, verify_code, check_code_rate_limit
from app.services.email_service import send_verification_email
from datetime import datetime, timedelta
from app.core.config import settings
import re
import logging

logger = logging.getLogger(__name__)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    async def send_verification_code(self, email: str, code_type: str) -> SendCodeResponse:
        """发送验证码"""
        # 检查频率限制
        if not check_code_rate_limit(email):
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail="发送过于频繁，请60秒后再试"
            )
        
        # 如果是注册，检查邮箱是否已存在
        if code_type == "register":
            existing_user = self.db.query(User).filter(User.email == email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="该邮箱已被注册"
                )
        
        # 如果是重置密码，检查邮箱是否存在
        if code_type == "reset":
            user = self.db.query(User).filter(User.email == email).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
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
                status_code=status.HTTP_200_OK,
                detail=f"邮件发送失败: {str(e)}"
            )
        
        # 返回统一格式
        return SendCodeResponse(
            code=200,
            data=SendCodeData(
                email=email,
                expires_in=settings.CODE_EXPIRE_MINUTES * 60,
                sent_at=datetime.utcnow()
            ),
            msg="验证码发送成功",
            errMsg=None
        )
    
    async def register_user(self, user_data: UserCreate) -> TokenResponse:
        """用户注册"""
        try:
            # 验证密码强度（包含字母和数字）
            if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$', user_data.password):
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="密码必须包含字母和数字，长度至少6位"
                )
            
            # 验证验证码
            if not verify_code(user_data.email, user_data.code, "register"):
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="验证码错误或已过期"
                )
            
            # 检查邮箱是否已存在
            existing_user = self.db.query(User).filter(User.email == user_data.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="该邮箱已被注册"
                )
            
            # 检查用户名是否已存在
            existing_username = self.db.query(User).filter(User.username == user_data.username).first()
            if existing_username:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
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
            
            # 返回统一格式
            return TokenResponse(
                code=200,
                data=TokenData(
                    access_token=access_token,
                    refresh_token=refresh_token,
                    token_type="Bearer",
                    expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                    user=UserResponse.from_orm(new_user)
                ),
                msg="注册成功",
                errMsg=None
            )
        except HTTPException:
            # 重新抛出 HTTPException，让异常处理器处理
            raise
        except Exception as e:
            # 捕获所有其他异常，返回统一格式
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"注册失败: {str(e)}"
            )
    
    async def login_user(self, login_data: UserLogin) -> TokenResponse:
        """用户登录 - 支持用户名或邮箱"""
        try:
            # 判断登录类型
            login_type = login_data.login_type
            if not login_type:
                # 自动判断：包含 @ 则为邮箱，否则为用户名
                login_type = 'email' if '@' in login_data.identifier else 'username'
            
            # 根据登录类型查找用户
            if login_type == 'email':
                user = self.db.query(User).filter(User.email == login_data.identifier).first()
                error_msg = "邮箱或密码错误"
            else:
                user = self.db.query(User).filter(User.username == login_data.identifier).first()
                error_msg = "用户名或密码错误"
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail=error_msg
                )
            
            # 验证密码
            if not verify_password(login_data.password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail=error_msg
                )
            
            # 检查账户是否激活
            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="账户已被禁用"
                )
            
            # 生成 Token
            access_token = create_access_token(data={"sub": str(user.id)})
            refresh_token = create_refresh_token(data={"sub": str(user.id)}, remember=login_data.remember)
            
            # 返回统一格式
            return TokenResponse(
                code=200,
                data=TokenData(
                    access_token=access_token,
                    refresh_token=refresh_token,
                    token_type="Bearer",
                    expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                    user=UserResponse.from_orm(user)
                ),
                msg="登录成功",
                errMsg=None
            )
        except HTTPException:
            # 重新抛出 HTTPException，让异常处理器处理
            raise
        except Exception as e:
            # 捕获所有其他异常，返回统一格式
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"登录失败: {str(e)}"
            )
    
    async def reset_password(self, reset_data: ResetPasswordRequest) -> MessageResponse:
        """重置密码"""
        try:
            logger.info(f"🔄 开始重置密码流程 - 邮箱: {reset_data.email}")
            
            # 验证两次密码是否一致
            if reset_data.new_password != reset_data.confirm_password:
                logger.warning(f"❌ 密码不一致 - 邮箱: {reset_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="两次输入的密码不一致"
                )
            
            # 验证密码强度（包含字母和数字）
            if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$', reset_data.new_password):
                logger.warning(f"❌ 密码强度不足 - 邮箱: {reset_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="密码必须包含字母和数字，长度至少6位"
                )
            
            # 验证验证码
            logger.info(f"🔍 验证验证码 - 邮箱: {reset_data.email}, 验证码: {reset_data.code}")
            if not verify_code(reset_data.email, reset_data.code, "reset"):
                logger.warning(f"❌ 验证码错误或已过期 - 邮箱: {reset_data.email}, 验证码: {reset_data.code}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="验证码错误或已过期"
                )
            logger.info(f"✅ 验证码验证通过 - 邮箱: {reset_data.email}")
            
            # 查找用户
            logger.info(f"🔍 查找用户 - 邮箱: {reset_data.email}")
            user = self.db.query(User).filter(User.email == reset_data.email).first()
            if not user:
                logger.warning(f"❌ 用户不存在 - 邮箱: {reset_data.email}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="该邮箱未注册"
                )
            logger.info(f"✅ 找到用户 - ID: {user.id}, 用户名: {user.username}")
            
            # 更新密码
            logger.info(f"🔐 更新密码 - 用户ID: {user.id}")
            old_password_hash = user.password_hash
            user.password_hash = get_password_hash(reset_data.new_password)
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"✅ 密码更新成功 - 用户ID: {user.id}, 邮箱: {reset_data.email}")
            logger.info(f"📊 密码哈希已更改: {old_password_hash[:20]}... -> {user.password_hash[:20]}...")
            
            # 返回统一格式
            return MessageResponse(
                code=200,
                data=None,
                msg="密码重置成功",
                errMsg=None
            )
        except HTTPException:
            # 重新抛出 HTTPException，让异常处理器处理
            raise
        except Exception as e:
            # 捕获所有其他异常，返回统一格式
            logger.error(f"❌ 密码重置失败 - 邮箱: {reset_data.email}, 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"密码重置失败: {str(e)}"
            )

