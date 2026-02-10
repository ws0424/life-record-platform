from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging
import traceback

logger = logging.getLogger(__name__)


async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """处理 HTTP 异常，返回统一格式"""
    # 记录异常日志
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}")
    
    # 根据 detail 判断业务错误码
    error_code_map = {
        "发送过于频繁，请60秒后再试": 429,
        "该邮箱已被注册": 409,
        "该邮箱未注册": 404,
        "邮箱或密码错误": 401,
        "账户已被禁用": 403,
        "两次输入的密码不一致": 400,
        "密码必须包含字母和数字": 400,
        "验证码错误或已过期": 422,
        "该用户名已被使用": 409,
    }
    
    detail = str(exc.detail)
    business_code = error_code_map.get(detail, 500)
    
    # 如果包含特定关键词，设置对应的业务码
    if "邮件发送失败" in detail:
        business_code = 500
        logger.error(f"邮件发送失败: {detail}")
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,  # HTTP 状态码始终返回 200
        content={
            "code": business_code,
            "data": None,
            "msg": "error",
            "errMsg": detail
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """处理请求验证异常，返回统一格式"""
    errors = exc.errors()
    error_messages = []
    
    for error in errors:
        field = " -> ".join(str(loc) for loc in error["loc"][1:])  # 跳过 'body'
        msg = error["msg"]
        error_messages.append(f"{field}: {msg}")
    
    error_detail = "; ".join(error_messages)
    logger.warning(f"Validation Error: {error_detail}")
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,  # HTTP 状态码始终返回 200
        content={
            "code": 400,
            "data": None,
            "msg": "参数验证失败",
            "errMsg": error_detail
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """处理未捕获的异常，返回统一格式"""
    # 记录详细的异常信息
    logger.error(f"Unhandled Exception: {type(exc).__name__}: {str(exc)}")
    logger.error(f"Traceback: {traceback.format_exc()}")
    
    return JSONResponse(
        status_code=status.HTTP_200_OK,  # HTTP 状态码始终返回 200
        content={
            "code": 500,
            "data": None,
            "msg": "服务器内部错误",
            "errMsg": str(exc)
        }
    )

