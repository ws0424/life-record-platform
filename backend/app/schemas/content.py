from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ContentType(str, Enum):
    """内容类型"""
    DAILY = "daily"
    ALBUM = "album"
    TRAVEL = "travel"


class ContentCreate(BaseModel):
    """创建内容请求"""
    type: ContentType
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    content: str = Field(..., min_length=1, max_length=10000)
    tags: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    location: Optional[str] = Field(None, max_length=200)
    extra_data: Optional[Dict[str, Any]] = None
    is_public: bool = True


class ContentUpdate(BaseModel):
    """更新内容请求"""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    content: Optional[str] = Field(None, min_length=1, max_length=10000)
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None
    location: Optional[str] = Field(None, max_length=200)
    extra_data: Optional[Dict[str, Any]] = None
    is_public: Optional[bool] = None


class UserBrief(BaseModel):
    """用户简要信息"""
    id: str
    username: str
    email: str

    class Config:
        from_attributes = True


class ContentResponse(BaseModel):
    """内容响应"""
    id: str
    user_id: str
    type: ContentType
    title: str
    description: Optional[str]
    content: str
    tags: List[str]
    images: List[str]
    location: Optional[str]
    extra_data: Optional[Dict[str, Any]]
    is_public: bool
    is_featured: bool
    view_count: int
    like_count: int
    comment_count: int
    save_count: int
    created_at: datetime
    updated_at: datetime
    
    # 关联数据
    user: Optional[UserBrief] = None
    is_liked: Optional[bool] = None  # 当前用户是否点赞
    is_saved: Optional[bool] = None  # 当前用户是否收藏

    class Config:
        from_attributes = True


class ContentListItem(BaseModel):
    """内容列表项（简化版）"""
    id: str
    user_id: str
    type: ContentType
    title: str
    description: Optional[str]
    tags: List[str]
    images: List[str]
    location: Optional[str]
    is_featured: bool
    view_count: int
    like_count: int
    comment_count: int
    save_count: int
    created_at: datetime
    
    # 关联数据
    user: Optional[UserBrief] = None

    class Config:
        from_attributes = True


class ContentListResponse(BaseModel):
    """内容列表响应"""
    items: List[ContentListItem]
    total: int
    page: int
    page_size: int
    total_pages: int


class CommentCreate(BaseModel):
    """创建评论请求"""
    comment_text: str = Field(..., min_length=1, max_length=1000)
    parent_id: Optional[str] = None


class CommentResponse(BaseModel):
    """评论响应"""
    id: str
    content_id: str
    user_id: str
    comment_text: str
    parent_id: Optional[str]
    like_count: int
    created_at: datetime
    updated_at: datetime
    
    # 关联数据
    user: Optional[UserBrief] = None
    replies: Optional[List["CommentResponse"]] = None

    class Config:
        from_attributes = True


class LikeResponse(BaseModel):
    """点赞响应"""
    is_liked: bool
    like_count: int


class SaveResponse(BaseModel):
    """收藏响应"""
    is_saved: bool
    save_count: int

