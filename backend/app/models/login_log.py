from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class LoginLog(Base):
    """登录日志模型"""
    __tablename__ = "login_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    ip_address = Column(String(45), nullable=False)  # 支持 IPv6
    user_agent = Column(Text, nullable=True)
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet
    browser = Column(String(100), nullable=True)
    os = Column(String(100), nullable=True)
    location = Column(String(200), nullable=True)  # 地理位置
    login_type = Column(String(20), nullable=False, default="password")  # password, oauth, etc.
    status = Column(String(20), nullable=False, default="success")  # success, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<LoginLog {self.user_id} - {self.ip_address}>"


class LoginDevice(Base):
    """登录设备模型"""
    __tablename__ = "login_devices"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    device_id = Column(String(255), nullable=False, unique=True, index=True)  # 设备唯一标识
    device_name = Column(String(200), nullable=False)  # Chrome on macOS
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet
    browser = Column(String(100), nullable=True)
    os = Column(String(100), nullable=True)
    ip_address = Column(String(45), nullable=False)
    location = Column(String(200), nullable=True)
    last_active = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<LoginDevice {self.device_name}>"

