from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """用户基础模型"""
    email: EmailStr = Field(..., description="邮箱地址", example="user@example.com")
    username: str = Field(..., min_length=2, max_length=20, description="用户名，2-20个字符", example="张三")


class UserCreate(BaseModel):
    """用户注册请求模型"""
    email: EmailStr = Field(..., description="邮箱地址", example="user@example.com")
    code: str = Field(..., min_length=6, max_length=6, description="6位数字验证码", example="123456")
    username: str = Field(..., min_length=2, max_length=20, description="用户名，2-20个字符", example="张三")
    password: str = Field(..., min_length=6, max_length=20, description="密码，6-20位，必须包含字母和数字", example="test123")
    confirm_password: str = Field(..., min_length=6, max_length=20, description="确认密码，必须与密码一致", example="test123")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "code": "123456",
                "username": "张三",
                "password": "test123",
                "confirm_password": "test123"
            }
        }


class UserLogin(BaseModel):
    """用户登录请求模型"""
    email: EmailStr = Field(..., description="邮箱地址", example="user@example.com")
    password: str = Field(..., min_length=6, max_length=20, description="密码", example="test123")
    remember: bool = Field(default=False, description="是否记住登录状态（影响 Refresh Token 有效期）", example=False)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "test123",
                "remember": False
            }
        }


class SendCodeRequest(BaseModel):
    """发送验证码请求模型"""
    email: EmailStr = Field(..., description="邮箱地址", example="user@example.com")
    type: str = Field(..., pattern="^(register|reset)$", description="验证码类型：register（注册）或 reset（重置密码）", example="register")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "type": "register"
            }
        }


class ResetPasswordRequest(BaseModel):
    """重置密码请求模型"""
    email: EmailStr = Field(..., description="邮箱地址", example="user@example.com")
    code: str = Field(..., min_length=6, max_length=6, description="6位数字验证码", example="123456")
    new_password: str = Field(..., min_length=6, max_length=20, description="新密码，6-20位，必须包含字母和数字", example="newpass123")
    confirm_password: str = Field(..., min_length=6, max_length=20, description="确认新密码", example="newpass123")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "code": "123456",
                "new_password": "newpass123",
                "confirm_password": "newpass123"
            }
        }


class UserResponse(BaseModel):
    """用户信息响应模型"""
    id: str = Field(..., description="用户 UUID", example="550e8400-e29b-41d4-a716-446655440000")
    username: str = Field(..., description="用户名", example="张三")
    email: str = Field(..., description="邮箱地址", example="user@example.com")
    avatar: Optional[str] = Field(None, description="头像 URL", example="https://example.com/avatar.jpg")
    bio: Optional[str] = Field(None, description="个人简介", example="这是我的个人简介")
    is_active: bool = Field(..., description="账户是否激活", example=True)
    is_verified: bool = Field(..., description="邮箱是否已验证", example=True)
    created_at: datetime = Field(..., description="创建时间", example="2026-02-10T10:00:00Z")
    updated_at: datetime = Field(..., description="更新时间", example="2026-02-10T10:00:00Z")
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "username": "张三",
                "email": "user@example.com",
                "avatar": "https://example.com/avatar.jpg",
                "bio": "这是我的个人简介",
                "is_active": True,
                "is_verified": True,
                "created_at": "2026-02-10T10:00:00Z",
                "updated_at": "2026-02-10T10:00:00Z"
            }
        }


class TokenResponse(BaseModel):
    """Token 响应模型"""
    access_token: str = Field(..., description="访问令牌，有效期 1 小时", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    refresh_token: str = Field(..., description="刷新令牌，用于刷新 Access Token", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="Bearer", description="令牌类型", example="Bearer")
    expires_in: int = Field(..., description="Access Token 过期时间（秒）", example=3600)
    user: UserResponse = Field(..., description="用户信息")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "Bearer",
                "expires_in": 3600,
                "user": {
                    "id": "550e8400-e29b-41d4-a716-446655440000",
                    "username": "张三",
                    "email": "user@example.com",
                    "avatar": "https://example.com/avatar.jpg",
                    "bio": "这是我的个人简介",
                    "is_active": True,
                    "is_verified": True,
                    "created_at": "2026-02-10T10:00:00Z",
                    "updated_at": "2026-02-10T10:00:00Z"
                }
            }
        }


class RefreshTokenResponse(BaseModel):
    """刷新 Token 响应模型"""
    access_token: str = Field(..., description="新的访问令牌", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(default="Bearer", description="令牌类型", example="Bearer")
    expires_in: int = Field(..., description="过期时间（秒）", example=3600)
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "Bearer",
                "expires_in": 3600
            }
        }


class MessageResponse(BaseModel):
    """消息响应模型"""
    message: str = Field(..., description="响应消息", example="操作成功")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "操作成功"
            }
        }


class SendCodeResponse(BaseModel):
    """发送验证码响应模型"""
    email: str = Field(..., description="邮箱地址", example="user@example.com")
    expires_in: int = Field(..., description="验证码有效期（秒）", example=300)
    sent_at: datetime = Field(..., description="发送时间", example="2026-02-10T10:00:00Z")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "expires_in": 300,
                "sent_at": "2026-02-10T10:00:00Z"
            }
        }

