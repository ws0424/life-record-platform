from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Integer, Enum as SQLEnum, JSON
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
    description = Column(String(500), nullable=True)  # 描述/摘要
    content = Column(Text, nullable=False)
    images = Column(ARRAY(String), default=list)  # 图片 URL 列表
    tags = Column(ARRAY(String), default=list)  # 标签列表
    location = Column(String(200), nullable=True)  # 位置
    
    # 扩展数据（JSON格式存储特定类型的额外数据）
    extra_data = Column(JSON, nullable=True)
    # extra_data 示例：
    # - album: {"photo_count": 24, "cover_images": [...]}
    # - travel: {"duration": "3天2夜", "locations": 8, "budget": "¥5000", "difficulty": "简单", "waypoints": [...]}
    
    is_public = Column(Boolean, default=True)  # 是否公开
    is_featured = Column(Boolean, default=False)  # 是否精选
    
    # 统计字段
    view_count = Column(Integer, default=0)  # 浏览次数
    like_count = Column(Integer, default=0)  # 点赞数
    comment_count = Column(Integer, default=0)  # 评论数
    save_count = Column(Integer, default=0)  # 收藏数
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    user = relationship("User", back_populates="contents")
    likes = relationship("ContentLike", back_populates="content", cascade="all, delete-orphan")
    saves = relationship("ContentSave", back_populates="content", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="content", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Content {self.title}>"


class ContentLike(Base):
    """内容点赞"""
    __tablename__ = "content_likes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_id = Column(UUID(as_uuid=True), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    content = relationship("Content", back_populates="likes")
    user = relationship("User")

    def __repr__(self):
        return f"<ContentLike content_id={self.content_id} user_id={self.user_id}>"


class ContentSave(Base):
    """内容收藏"""
    __tablename__ = "content_saves"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_id = Column(UUID(as_uuid=True), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # 关系
    content = relationship("Content", back_populates="saves")
    user = relationship("User")

    def __repr__(self):
        return f"<ContentSave content_id={self.content_id} user_id={self.user_id}>"


class Comment(Base):
    """评论"""
    __tablename__ = "comments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_id = Column(UUID(as_uuid=True), ForeignKey("contents.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    comment_text = Column(Text, nullable=False)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)  # 父评论ID（用于回复）
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    content = relationship("Content", back_populates="comments")
    user = relationship("User")
    parent = relationship("Comment", remote_side=[id], backref="replies")

    def __repr__(self):
        return f"<Comment id={self.id} content_id={self.content_id}>"

