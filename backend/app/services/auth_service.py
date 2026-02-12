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
    MessageResponse,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ChangeEmailRequest
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
            password_valid = verify_password(login_data.password, user.password_hash)
            
            # 如果密码验证失败，尝试使用旧的哈希方法验证（兼容性处理）
            if not password_valid:
                try:
                    from app.utils.security import _truncate_password
                    import hashlib
                    import base64
                    from passlib.context import CryptContext
                    
                    # 旧的截断方法：总是使用 SHA256
                    old_password = base64.b64encode(
                        hashlib.sha256(login_data.password.encode('utf-8')).digest()
                    ).decode('utf-8')
                    
                    pwd_context = CryptContext(
                        schemes=["bcrypt"],
                        deprecated="auto",
                        bcrypt__ident="2b",
                        bcrypt__default_rounds=12
                    )
                    
                    if pwd_context.verify(old_password, user.password_hash):
                        password_valid = True
                        # 自动迁移到新的哈希方式
                        logger.info(f"🔄 自动迁移密码 - 用户ID: {user.id}")
                        user.password_hash = get_password_hash(login_data.password)
                        self.db.commit()
                        logger.info(f"✅ 密码迁移成功 - 用户ID: {user.id}")
                except Exception as e:
                    logger.warning(f"⚠️  密码兼容性验证失败: {str(e)}")
            
            if not password_valid:
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
    
    async def update_profile(self, user_id: str, update_data: UpdateProfileRequest) -> ApiResponse[UserResponse]:
        """更新个人信息"""
        try:
            logger.info(f"🔄 开始更新个人信息 - 用户ID: {user_id}")
            
            # 查找用户
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"❌ 用户不存在 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="用户不存在"
                )
            
            # 如果更新用户名，检查是否重复
            if update_data.username and update_data.username != user.username:
                existing_user = self.db.query(User).filter(
                    User.username == update_data.username,
                    User.id != user_id
                ).first()
                if existing_user:
                    logger.warning(f"❌ 用户名已存在 - 用户名: {update_data.username}")
                    raise HTTPException(
                        status_code=status.HTTP_200_OK,
                        detail="该用户名已被使用"
                    )
                user.username = update_data.username
                logger.info(f"✅ 更新用户名: {update_data.username}")
            
            # 更新个人简介
            if update_data.bio is not None:
                user.bio = update_data.bio
                logger.info(f"✅ 更新个人简介")
            
            # 更新头像
            if update_data.avatar is not None:
                user.avatar = update_data.avatar
                logger.info(f"✅ 更新头像")
            
            # 更新时间
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(user)
            
            logger.info(f"✅ 个人信息更新成功 - 用户ID: {user_id}")
            
            return ApiResponse(
                code=200,
                data=UserResponse.from_orm(user),
                msg="个人信息更新成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 个人信息更新失败 - 用户ID: {user_id}, 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"个人信息更新失败: {str(e)}"
            )
    
    async def change_password(self, user_id: str, password_data: ChangePasswordRequest) -> MessageResponse:
        """修改密码"""
        try:
            logger.info(f"🔄 开始修改密码 - 用户ID: {user_id}")
            
            # 验证两次密码是否一致
            if password_data.new_password != password_data.confirm_password:
                logger.warning(f"❌ 密码不一致 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="两次输入的密码不一致"
                )
            
            # 验证密码强度（包含字母和数字）
            if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$', password_data.new_password):
                logger.warning(f"❌ 密码强度不足 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="密码必须包含字母和数字，长度至少6位"
                )
            
            # 查找用户
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"❌ 用户不存在 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="用户不存在"
                )
            
            # 验证当前密码
            if not verify_password(password_data.current_password, user.password_hash):
                logger.warning(f"❌ 当前密码错误 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="当前密码错误"
                )
            
            # 更新密码
            logger.info(f"🔐 更新密码 - 用户ID: {user_id}")
            user.password_hash = get_password_hash(password_data.new_password)
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            logger.info(f"✅ 密码修改成功 - 用户ID: {user_id}")
            
            return MessageResponse(
                code=200,
                data=None,
                msg="密码修改成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 密码修改失败 - 用户ID: {user_id}, 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"密码修改失败: {str(e)}"
            )
    
    async def change_email(self, user_id: str, email_data: ChangeEmailRequest) -> ApiResponse[UserResponse]:
        """换绑邮箱"""
        try:
            logger.info(f"🔄 开始换绑邮箱 - 用户ID: {user_id}")
            
            # 验证验证码
            logger.info(f"🔍 验证验证码 - 新邮箱: {email_data.new_email}, 验证码: {email_data.code}")
            if not verify_code(email_data.new_email, email_data.code, "register"):
                logger.warning(f"❌ 验证码错误或已过期 - 新邮箱: {email_data.new_email}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="验证码错误或已过期"
                )
            logger.info(f"✅ 验证码验证通过 - 新邮箱: {email_data.new_email}")
            
            # 查找用户
            user = self.db.query(User).filter(User.id == user_id).first()
            if not user:
                logger.warning(f"❌ 用户不存在 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="用户不存在"
                )
            
            # 验证当前密码
            if not verify_password(email_data.password, user.password_hash):
                logger.warning(f"❌ 当前密码错误 - 用户ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="当前密码错误"
                )
            
            # 检查新邮箱是否已被使用
            existing_user = self.db.query(User).filter(
                User.email == email_data.new_email,
                User.id != user_id
            ).first()
            if existing_user:
                logger.warning(f"❌ 新邮箱已被使用 - 新邮箱: {email_data.new_email}")
                raise HTTPException(
                    status_code=status.HTTP_200_OK,
                    detail="该邮箱已被其他用户使用"
                )
            
            # 更新邮箱
            logger.info(f"📧 更新邮箱 - 用户ID: {user_id}, 旧邮箱: {user.email}, 新邮箱: {email_data.new_email}")
            old_email = user.email
            user.email = email_data.new_email
            user.is_verified = True  # 验证码验证通过，设为已验证
            user.updated_at = datetime.utcnow()
            
            self.db.commit()
            self.db.refresh(user)
            logger.info(f"✅ 邮箱换绑成功 - 用户ID: {user_id}, {old_email} -> {email_data.new_email}")
            
            return ApiResponse(
                code=200,
                data=UserResponse.from_orm(user),
                msg="邮箱换绑成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 邮箱换绑失败 - 用户ID: {user_id}, 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_200_OK,
                detail=f"邮箱换绑失败: {str(e)}"
            )

