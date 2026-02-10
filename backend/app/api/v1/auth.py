from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas import (
    UserCreate,
    UserLogin,
    TokenResponse,
    SendCodeRequest,
    SendCodeResponse,
    MessageResponse,
    ResetPasswordRequest,
    UserInfoResponse,
    UpdateProfileRequest,
    UpdateProfileResponse,
    ChangePasswordRequest
)
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user
from app.models.user import User
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/send-code",
    response_model=SendCodeResponse,
    summary="发送验证码",
    description="发送邮箱验证码，用于注册或重置密码",
    response_description="返回验证码发送信息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "examples": {
                        "success": {
                            "summary": "成功",
                            "value": {
                                "code": 200,
                                "data": {
                                    "email": "user@example.com",
                                    "expires_in": 300,
                                    "sent_at": "2026-02-10T10:00:00Z"
                                },
                                "msg": "验证码发送成功",
                                "errMsg": None
                            }
                        },
                        "rate_limit": {
                            "summary": "请求过于频繁",
                            "value": {
                                "code": 429,
                                "data": None,
                                "msg": "error",
                                "errMsg": "发送过于频繁，请60秒后再试"
                            }
                        },
                        "email_exists": {
                            "summary": "邮箱已注册",
                            "value": {
                                "code": 409,
                                "data": None,
                                "msg": "error",
                                "errMsg": "该邮箱已被注册"
                            }
                        }
                    }
                }
            }
        }
    }
)
async def send_verification_code(
    request: SendCodeRequest,
    db: Session = Depends(get_db)
):
    """
    ## 发送邮箱验证码
    
    发送 6 位数字验证码到指定邮箱，用于用户注册或密码重置。
    
    ### 请求参数
    - **email**: 邮箱地址（必填）
    - **type**: 验证码类型（必填）
        - `register`: 注册验证码
        - `reset`: 重置密码验证码
    
    ### 验证规则
    - 注册类型：检查邮箱是否已注册
    - 重置类型：检查邮箱是否存在
    - 频率限制：同一邮箱 60 秒内只能发送 1 次
    
    ### 验证码规则
    - 格式：6 位数字
    - 有效期：5 分钟
    - 一次性使用（验证后自动删除）
    
    ### 示例请求
    ```json
    {
        "email": "user@example.com",
        "type": "register"
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": {
            "email": "user@example.com",
            "expires_in": 300,
            "sent_at": "2026-02-10T10:00:00Z"
        },
        "msg": "验证码发送成功",
        "errMsg": null
    }
    ```
    
    ### 错误响应示例
    ```json
    {
        "code": 429,
        "data": null,
        "msg": "error",
        "errMsg": "发送过于频繁，请60秒后再试"
    }
    ```
    """
    auth_service = AuthService(db)
    result = await auth_service.send_verification_code(request.email, request.type)
    return result


@router.post(
    "/register",
    response_model=TokenResponse,
    summary="用户注册",
    description="使用邮箱验证码注册新账户",
    response_description="返回 JWT Token 和用户信息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "examples": {
                        "success": {
                            "summary": "注册成功",
                            "value": {
                                "code": 200,
                                "data": {
                                    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                    "token_type": "Bearer",
                                    "expires_in": 3600,
                                    "user": {
                                        "id": "550e8400-e29b-41d4-a716-446655440000",
                                        "username": "张三",
                                        "email": "user@example.com",
                                        "avatar": None,
                                        "bio": None,
                                        "is_active": True,
                                        "is_verified": True,
                                        "created_at": "2026-02-10T10:00:00Z",
                                        "updated_at": "2026-02-10T10:00:00Z"
                                    }
                                },
                                "msg": "注册成功",
                                "errMsg": None
                            }
                        },
                        "code_error": {
                            "summary": "验证码错误",
                            "value": {
                                "code": 422,
                                "data": None,
                                "msg": "error",
                                "errMsg": "验证码错误或已过期"
                            }
                        },
                        "email_exists": {
                            "summary": "邮箱已注册",
                            "value": {
                                "code": 409,
                                "data": None,
                                "msg": "error",
                                "errMsg": "该邮箱已被注册"
                            }
                        }
                    }
                }
            }
        }
    }
)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    ## 用户注册
    
    使用邮箱验证码注册新账户，注册成功后自动登录并返回 JWT Token。
    
    ### 注册流程
    1. 调用 `/api/auth/send-code` 发送验证码
    2. 用户收到邮件验证码
    3. 填写注册信息并提交
    4. 验证通过后创建账户
    5. 返回 JWT Token 和用户信息
    
    ### 请求参数
    - **email**: 邮箱地址（必填）
    - **code**: 6 位数字验证码（必填）
    - **username**: 用户名，2-20 个字符（必填）
    - **password**: 密码，6-20 位，必须包含字母和数字（必填）
    - **confirm_password**: 确认密码，必须与密码一致（必填）
    
    ### 验证规则
    - 验证码必须正确且未过期
    - 邮箱不能重复
    - 用户名不能重复
    - 密码必须包含字母和数字
    - 两次密码必须一致
    
    ### 示例请求
    ```json
    {
        "email": "user@example.com",
        "code": "123456",
        "username": "张三",
        "password": "test123",
        "confirm_password": "test123"
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "Bearer",
            "expires_in": 3600,
            "user": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "username": "张三",
                "email": "user@example.com",
                "avatar": null,
                "bio": null,
                "is_active": true,
                "is_verified": true,
                "created_at": "2026-02-10T10:00:00Z",
                "updated_at": "2026-02-10T10:00:00Z"
            }
        },
        "msg": "注册成功",
        "errMsg": null
    }
    ```
    
    ### 错误响应示例
    ```json
    {
        "code": 422,
        "data": null,
        "msg": "error",
        "errMsg": "验证码错误或已过期"
    }
    ```
    
    ### Token 使用
    注册成功后，从 `data.access_token` 获取令牌并存储在客户端，后续请求需要在请求头中携带：
    ```
    Authorization: Bearer {access_token}
    ```
    """
    auth_service = AuthService(db)
    result = await auth_service.register_user(user_data)
    return result


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="用户登录",
    description="使用用户名/邮箱和密码登录",
    response_description="返回 JWT Token 和用户信息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "examples": {
                        "success": {
                            "summary": "登录成功",
                            "value": {
                                "code": 200,
                                "data": {
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
                                },
                                "msg": "登录成功",
                                "errMsg": None
                            }
                        },
                        "auth_error": {
                            "summary": "认证失败",
                            "value": {
                                "code": 401,
                                "data": None,
                                "msg": "error",
                                "errMsg": "邮箱或密码错误"
                            }
                        },
                        "account_disabled": {
                            "summary": "账户被禁用",
                            "value": {
                                "code": 403,
                                "data": None,
                                "msg": "error",
                                "errMsg": "账户已被禁用"
                            }
                        }
                    }
                }
            }
        }
    }
)
async def login(
    login_data: UserLogin,
    db: Session = Depends(get_db)
):
    """
    ## 用户登录
    
    使用用户名/邮箱和密码登录，登录成功后返回 JWT Token。
    
    ### 请求参数
    - **identifier**: 用户名或邮箱地址（必填）
    - **password**: 密码（必填）
    - **remember**: 是否记住登录状态（可选，默认 false）
        - `true`: Refresh Token 有效期 7 天
        - `false`: Refresh Token 有效期 1 天
    - **login_type**: 登录类型（可选，不传则自动判断）
        - `email`: 使用邮箱登录
        - `username`: 使用用户名登录
        - 不传：自动判断（包含 @ 则为邮箱，否则为用户名）
    
    ### 验证规则
    - 用户名/邮箱必须已注册
    - 密码必须正确
    - 账户必须处于激活状态
    
    ### Token 说明
    - **Access Token**: 用于访问受保护的 API，有效期 1 小时
    - **Refresh Token**: 用于刷新 Access Token，有效期根据 remember 参数决定
    
    ### 示例请求（邮箱登录）
    ```json
    {
        "identifier": "user@example.com",
        "password": "test123",
        "remember": false
    }
    ```
    
    ### 示例请求（用户名登录）
    ```json
    {
        "identifier": "张三",
        "password": "test123",
        "remember": false
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": {
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
                "is_active": true,
                "is_verified": true,
                "created_at": "2026-02-10T10:00:00Z",
                "updated_at": "2026-02-10T10:00:00Z"
            }
        },
        "msg": "登录成功",
        "errMsg": null
    }
    ```
    
    ### 错误响应示例
    ```json
    {
        "code": 401,
        "data": null,
        "msg": "error",
        "errMsg": "邮箱或密码错误"
    }
    ```
    
    ### Token 使用
    登录成功后，从 `data.access_token` 获取令牌并存储在客户端，后续请求需要在请求头中携带：
    ```
    Authorization: Bearer {access_token}
    ```
    
    ### 安全提示
    - 建议使用 HTTPS 传输
    - Token 应安全存储（localStorage 或 sessionStorage）
    - 不要在 URL 中传递 Token
    """
    auth_service = AuthService(db)
    result = await auth_service.login_user(login_data)
    return result


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="用户登出",
    description="登出当前用户，使 Token 失效",
    response_description="返回登出成功消息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "example": {
                        "code": 200,
                        "data": None,
                        "msg": "登出成功",
                        "errMsg": None
                    }
                }
            }
        }
    }
)
async def logout():
    """
    ## 用户登出
    
    登出当前用户，将 Token 加入黑名单使其失效。
    
    ### 功能说明
    - 将当前 Token 加入黑名单
    - Token 立即失效，无法再次使用
    - 客户端应清除存储的 Token
    
    ### 请求头
    ```
    Authorization: Bearer {access_token}
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": null,
        "msg": "登出成功",
        "errMsg": null
    }
    ```
    
    ### 注意事项
    - 登出后需要重新登录获取新的 Token
    - 建议客户端同时清除本地存储的 Token
    
    **状态**: ⏳ 功能开发中
    """
    from app.schemas import ApiResponse
    return ApiResponse(code=200, data=None, msg="登出成功", errMsg=None)


@router.get(
    "/me",
    response_model=UserInfoResponse,
    summary="获取当前用户信息",
    description="获取当前登录用户的详细信息",
    response_description="返回用户信息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "example": {
                        "code": 200,
                        "data": {
                            "id": "550e8400-e29b-41d4-a716-446655440000",
                            "username": "张三",
                            "email": "user@example.com",
                            "avatar": "https://example.com/avatar.jpg",
                            "bio": "这是我的个人简介",
                            "is_active": True,
                            "is_verified": True,
                            "created_at": "2026-02-10T10:00:00Z",
                            "updated_at": "2026-02-10T10:00:00Z"
                        },
                        "msg": "success",
                        "errMsg": None
                    }
                }
            }
        }
    }
)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    ## 获取当前用户信息
    
    获取当前登录用户的详细信息，需要提供有效的 Access Token。
    
    ### 请求头
    ```
    Authorization: Bearer {access_token}
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "username": "张三",
            "email": "user@example.com",
            "avatar": "https://example.com/avatar.jpg",
            "bio": "这是我的个人简介",
            "is_active": true,
            "is_verified": true,
            "created_at": "2026-02-10T10:00:00Z",
            "updated_at": "2026-02-10T10:00:00Z"
        },
        "msg": "success",
        "errMsg": null
    }
    ```
    
    ### 使用场景
    - 获取用户个人资料
    - 验证 Token 是否有效
    - 刷新用户信息
    """
    from app.schemas import UserResponse, ApiResponse
    return ApiResponse(
        code=200,
        data=UserResponse.from_orm(current_user),
        msg="success",
        errMsg=None
    )


@router.post(
    "/reset-password",
    response_model=MessageResponse,
    summary="重置密码",
    description="使用邮箱验证码重置密码",
    response_description="返回重置成功消息",
    responses={
        200: {
            "description": "统一响应格式",
            "content": {
                "application/json": {
                    "examples": {
                        "success": {
                            "summary": "重置成功",
                            "value": {
                                "code": 200,
                                "data": None,
                                "msg": "密码重置成功",
                                "errMsg": None
                            }
                        },
                        "code_error": {
                            "summary": "验证码错误",
                            "value": {
                                "code": 422,
                                "data": None,
                                "msg": "error",
                                "errMsg": "验证码错误或已过期"
                            }
                        },
                        "password_mismatch": {
                            "summary": "密码不一致",
                            "value": {
                                "code": 422,
                                "data": None,
                                "msg": "error",
                                "errMsg": "两次输入的密码不一致"
                            }
                        },
                        "email_not_found": {
                            "summary": "邮箱未注册",
                            "value": {
                                "code": 404,
                                "data": None,
                                "msg": "error",
                                "errMsg": "该邮箱未注册"
                            }
                        }
                    }
                }
            }
        }
    }
)
async def reset_password(
    reset_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    ## 重置密码
    
    使用邮箱验证码重置账户密码。
    
    ### 重置流程
    1. 调用 `/api/auth/send-code` 发送验证码（type: reset）
    2. 用户收到邮件验证码
    3. 填写新密码和验证码并提交
    4. 验证通过后更新密码
    5. 返回成功消息
    
    ### 请求参数
    - **email**: 邮箱地址（必填）
    - **code**: 6 位数字验证码（必填）
    - **new_password**: 新密码，6-20 位，必须包含字母和数字（必填）
    - **confirm_password**: 确认新密码，必须与新密码一致（必填）
    
    ### 验证规则
    - 验证码必须正确且未过期
    - 邮箱必须已注册
    - 新密码必须包含字母和数字
    - 两次密码必须一致
    
    ### 示例请求
    ```json
    {
        "email": "user@example.com",
        "code": "123456",
        "new_password": "newpass123",
        "confirm_password": "newpass123"
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": null,
        "msg": "密码重置成功",
        "errMsg": null
    }
    ```
    
    ### 错误响应示例
    ```json
    {
        "code": 422,
        "data": null,
        "msg": "error",
        "errMsg": "验证码错误或已过期"
    }
    ```
    
    ### 安全提示
    - 验证码一次性使用，验证后自动删除
    - 密码重置后建议立即登录
    - 如非本人操作，请立即联系客服
    """
    auth_service = AuthService(db)
    result = await auth_service.reset_password(reset_data)
    return result


@router.put(
    "/profile",
    response_model=UpdateProfileResponse,
    summary="更新个人信息",
    description="更新当前用户的个人信息",
    response_description="返回更新后的用户信息"
)
async def update_profile(
    update_data: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## 更新个人信息
    
    更新当前登录用户的个人信息（用户名、个人简介、头像）。
    
    ### 请求头
    ```
    Authorization: Bearer {access_token}
    ```
    
    ### 请求参数
    - **username**: 用户名，2-20个字符（可选）
    - **bio**: 个人简介，最多500字符（可选）
    - **avatar**: 头像 URL（可选）
    
    ### 验证规则
    - 用户名不能与其他用户重复
    - 邮箱不可修改
    
    ### 示例请求
    ```json
    {
        "username": "新用户名",
        "bio": "这是我的新简介",
        "avatar": "https://example.com/new-avatar.jpg"
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "username": "新用户名",
            "email": "user@example.com",
            "avatar": "https://example.com/new-avatar.jpg",
            "bio": "这是我的新简介",
            "is_active": true,
            "is_verified": true,
            "created_at": "2026-02-10T10:00:00Z",
            "updated_at": "2026-02-10T16:30:00Z"
        },
        "msg": "个人信息更新成功",
        "errMsg": null
    }
    ```
    """
    auth_service = AuthService(db)
    result = await auth_service.update_profile(str(current_user.id), update_data)
    return result


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="修改密码",
    description="修改当前用户的密码",
    response_description="返回修改成功消息"
)
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## 修改密码
    
    修改当前登录用户的密码，需要提供当前密码进行验证。
    
    ### 请求头
    ```
    Authorization: Bearer {access_token}
    ```
    
    ### 请求参数
    - **current_password**: 当前密码（必填）
    - **new_password**: 新密码，6-20位，必须包含字母和数字（必填）
    - **confirm_password**: 确认新密码（必填）
    
    ### 验证规则
    - 当前密码必须正确
    - 新密码必须包含字母和数字
    - 两次密码必须一致
    
    ### 示例请求
    ```json
    {
        "current_password": "oldpass123",
        "new_password": "newpass123",
        "confirm_password": "newpass123"
    }
    ```
    
    ### 成功响应示例
    ```json
    {
        "code": 200,
        "data": null,
        "msg": "密码修改成功",
        "errMsg": null
    }
    ```
    
    ### 安全提示
    - 密码修改后，建议重新登录
    - 如非本人操作，请立即联系客服
    """
    auth_service = AuthService(db)
    result = await auth_service.change_password(str(current_user.id), password_data)
    return result

