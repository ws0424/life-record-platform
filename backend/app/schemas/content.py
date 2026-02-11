from pydantic import BaseModel, Field
from typing import List, Optional
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
    content: str = Field(..., min_length=1, max_length=5000)
    tags: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    location: Optional[str] = Field(None, max_length=200)
    is_public: bool = True


class ContentUpdate(BaseModel):
    """更新内容请求"""
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    content: Optional[str] = Field(None, min_length=1, max_length=5000)
    tags: Optional[List[str]] = None
    images: Optional[List[str]] = None
    location: Optional[str] = Field(None, max_length=200)
    is_public: Optional[bool] = None


class ContentResponse(BaseModel):
    """内容响应"""
    id: str
    user_id: str
    type: ContentType
    title: str
    content: str
    tags: List[str]
    images: List[str]
    location: Optional[str]
    is_public: bool
    view_count: int
    like_count: int
    comment_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentListResponse(BaseModel):
    """内容列表响应"""
    items: List[ContentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

