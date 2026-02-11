from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.core.database import Base


class ContentType(str, enum.Enum):
    """内容类型枚举"""
    DAILY = "daily"  # 日常记录
    ALBUM = "album"  # 相册
    TRAVEL = "travel"  # 旅游路线


class Content(Base):
    """内容模型"""
    __tablename__ = "contents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(SQLEnum(ContentType), nullable=False, default=ContentType.DAILY)
    title = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
    images = Column(ARRAY(String), default=list)  # 图片 URL 列表
    tags = Column(ARRAY(String), default=list)  # 标签列表
    location = Column(String(200), nullable=True)  # 位置（旅游路线专用）
    is_public = Column(Boolean, default=True)  # 是否公开
    view_count = Column(Integer, default=0)  # 浏览次数
    like_count = Column(Integer, default=0)  # 点赞数
    comment_count = Column(Integer, default=0)  # 评论数
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="contents")

    def __repr__(self):
        return f"<Content {self.title}>"

