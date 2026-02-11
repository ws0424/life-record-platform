from sqlalchemy.orm import Session
from sqlalchemy import select, desc, func
from typing import Optional, List
from datetime import datetime, timedelta
import hashlib

from app.models.login_log import LoginLog, LoginDevice
from app.models.user import User
from app.schemas.auth import (
    LoginLogResponse,
    LoginDeviceResponse,
    SecuritySettingsResponse,
    ApiResponse
)


class SecurityService:
    """安全设置服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_login_log(
        self,
        user_id: str,
        ip_address: str,
        user_agent: Optional[str] = None,
        device_type: Optional[str] = None,
        browser: Optional[str] = None,
        os: Optional[str] = None,
        location: Optional[str] = None,
        login_type: str = "password",
        status: str = "success"
    ) -> LoginLog:
        """创建登录日志"""
        log = LoginLog(
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent,
            device_type=device_type,
            browser=browser,
            os=os,
            location=location,
            login_type=login_type,
            status=status
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
    
    def get_login_logs(
        self,
        user_id: str,
        limit: int = 20,
        offset: int = 0
    ) -> ApiResponse[List[LoginLogResponse]]:
        """获取登录日志"""
        logs = self.db.query(LoginLog).filter(
            LoginLog.user_id == user_id
        ).order_by(desc(LoginLog.created_at)).limit(limit).offset(offset).all()
        
        log_responses = [LoginLogResponse.model_validate(log) for log in logs]
        
        return ApiResponse(
            code=200,
            data=log_responses,
            msg="获取登录日志成功",
            errMsg=None
        )
    
    def create_or_update_device(
        self,
        user_id: str,
        device_id: str,
        device_name: str,
        device_type: Optional[str] = None,
        browser: Optional[str] = None,
        os: Optional[str] = None,
        ip_address: str = "",
        location: Optional[str] = None
    ) -> LoginDevice:
        """创建或更新登录设备"""
        # 查找现有设备
        device = self.db.query(LoginDevice).filter(
            LoginDevice.device_id == device_id
        ).first()
        
        if device:
            # 更新现有设备
            device.ip_address = ip_address
            device.location = location
            device.last_active = datetime.utcnow()
        else:
            # 创建新设备
            device = LoginDevice(
                user_id=user_id,
                device_id=device_id,
                device_name=device_name,
                device_type=device_type,
                browser=browser,
                os=os,
                ip_address=ip_address,
                location=location
            )
            self.db.add(device)
        
        self.db.commit()
        self.db.refresh(device)
        return device
    
    def get_login_devices(
        self,
        user_id: str,
        current_device_id: Optional[str] = None
    ) -> ApiResponse[List[LoginDeviceResponse]]:
        """获取登录设备列表"""
        devices = self.db.query(LoginDevice).filter(
            LoginDevice.user_id == user_id
        ).order_by(desc(LoginDevice.last_active)).all()
        
        device_responses = []
        for device in devices:
            device_dict = LoginDeviceResponse.model_validate(device).model_dump()
            device_dict['is_current'] = (device.device_id == current_device_id)
            device_responses.append(LoginDeviceResponse(**device_dict))
        
        return ApiResponse(
            code=200,
            data=device_responses,
            msg="获取登录设备成功",
            errMsg=None
        )
    
    def remove_device(
        self,
        user_id: str,
        device_id: str
    ) -> ApiResponse[None]:
        """移除登录设备"""
        device = self.db.query(LoginDevice).filter(
            LoginDevice.user_id == user_id,
            LoginDevice.device_id == device_id
        ).first()
        
        if not device:
            return ApiResponse(
                code=404,
                data=None,
                msg="error",
                errMsg="设备不存在"
            )
        
        self.db.delete(device)
        self.db.commit()
        
        return ApiResponse(
            code=200,
            data=None,
            msg="设备移除成功",
            errMsg=None
        )
    
    def get_security_settings(
        self,
        user_id: str
    ) -> ApiResponse[SecuritySettingsResponse]:
        """获取安全设置信息"""
        # 获取用户信息
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return ApiResponse(
                code=404,
                data=None,
                msg="error",
                errMsg="用户不存在"
            )
        
        # 获取活跃设备数量
        active_devices_count = self.db.query(func.count(LoginDevice.id)).filter(
            LoginDevice.user_id == user_id
        ).scalar() or 0
        
        # 获取最近30天登录次数
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_login_count = self.db.query(func.count(LoginLog.id)).filter(
            LoginLog.user_id == user_id,
            LoginLog.created_at >= thirty_days_ago,
            LoginLog.status == "success"
        ).scalar() or 0
        
        settings = SecuritySettingsResponse(
            two_factor_enabled=False,  # 暂未实现两步验证
            email_verified=user.is_verified,
            last_password_change=None,  # 暂未记录密码修改时间
            active_devices_count=active_devices_count,
            recent_login_count=recent_login_count
        )
        
        return ApiResponse(
            code=200,
            data=settings,
            msg="获取安全设置成功",
            errMsg=None
        )
    
    @staticmethod
    def generate_device_id(user_agent: str, ip_address: str) -> str:
        """生成设备唯一标识"""
        raw = f"{user_agent}:{ip_address}"
        return hashlib.md5(raw.encode()).hexdigest()
    
    @staticmethod
    def parse_user_agent(user_agent: Optional[str]) -> dict:
        """解析 User Agent"""
        if not user_agent:
            return {
                "device_type": "unknown",
                "browser": "unknown",
                "os": "unknown",
                "device_name": "Unknown Device"
            }
        
        # 简单的 User Agent 解析（生产环境建议使用 user-agents 库）
        ua_lower = user_agent.lower()
        
        # 检测设备类型
        if "mobile" in ua_lower or "android" in ua_lower or "iphone" in ua_lower:
            device_type = "mobile"
        elif "tablet" in ua_lower or "ipad" in ua_lower:
            device_type = "tablet"
        else:
            device_type = "desktop"
        
        # 检测浏览器
        if "chrome" in ua_lower and "edg" not in ua_lower:
            browser = "Chrome"
        elif "firefox" in ua_lower:
            browser = "Firefox"
        elif "safari" in ua_lower and "chrome" not in ua_lower:
            browser = "Safari"
        elif "edg" in ua_lower:
            browser = "Edge"
        else:
            browser = "Unknown"
        
        # 检测操作系统
        if "windows" in ua_lower:
            os = "Windows"
        elif "mac" in ua_lower:
            os = "macOS"
        elif "linux" in ua_lower:
            os = "Linux"
        elif "android" in ua_lower:
            os = "Android"
        elif "iphone" in ua_lower or "ipad" in ua_lower:
            os = "iOS"
        else:
            os = "Unknown"
        
        device_name = f"{browser} on {os}"
        
        return {
            "device_type": device_type,
            "browser": browser,
            "os": os,
            "device_name": device_name
        }

