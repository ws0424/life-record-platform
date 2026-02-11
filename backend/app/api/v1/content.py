from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.utils.dependencies import get_current_user, get_optional_current_user
from app.models.user import User
from app.models.content import ContentType
from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentResponse,
    ContentListResponse,
    CommentCreate,
    CommentResponse,
    LikeResponse,
    SaveResponse,
)
from app.schemas import ApiResponse, MessageResponse
from app.services.content_service import ContentService

router = APIRouter()


@router.post(
    "/",
    response_model=ApiResponse[ContentResponse],
    summary="创建内容",
    description="创建新的内容（日常记录、相册、旅游路线）"
)
async def create_content(
    content_data: ContentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建内容"""
    service = ContentService(db)
    return service.create_content(str(current_user.id), content_data)


@router.get(
    "/{content_id}",
    response_model=ApiResponse[ContentResponse],
    summary="获取内容详情",
    description="获取指定内容的详细信息"
)
async def get_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取内容详情"""
    service = ContentService(db)
    return service.get_content(content_id, str(current_user.id))


@router.put(
    "/{content_id}",
    response_model=ApiResponse[ContentResponse],
    summary="更新内容",
    description="更新指定内容的信息"
)
async def update_content(
    content_id: str,
    content_data: ContentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """更新内容"""
    service = ContentService(db)
    return service.update_content(content_id, str(current_user.id), content_data)


@router.delete(
    "/{content_id}",
    response_model=MessageResponse,
    summary="删除内容",
    description="删除指定的内容"
)
async def delete_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除内容"""
    service = ContentService(db)
    return service.delete_content(content_id, str(current_user.id))


@router.get(
    "/",
    response_model=ApiResponse[ContentListResponse],
    summary="获取内容列表",
    description="获取内容列表，支持筛选和分页"
)
async def list_contents(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    type: Optional[ContentType] = Query(None, description="内容类型"),
    user_id: Optional[str] = Query(None, description="用户ID"),
    is_public: Optional[bool] = Query(None, description="是否公开"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    tag: Optional[str] = Query(None, description="标签筛选"),
    is_featured: Optional[bool] = Query(None, description="是否精选"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取内容列表"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=type,
        user_id=user_id,
        is_public=is_public,
        keyword=keyword,
        tag=tag,
        is_featured=is_featured,
    )


@router.get(
    "/my/contents",
    response_model=ApiResponse[ContentListResponse],
    summary="获取我的内容",
    description="获取当前用户的所有内容"
)
async def get_my_contents(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    type: Optional[ContentType] = Query(None, description="内容类型"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的内容"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=type,
        user_id=str(current_user.id),
    )


# ==================== 日常记录相关接口 ====================

@router.get(
    "/daily/list",
    response_model=ApiResponse[ContentListResponse],
    summary="获取日常记录列表",
    description="获取所有日常记录（允许未登录访问）"
)
async def list_daily_contents(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取日常记录列表（允许未登录访问）"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=ContentType.DAILY,
        is_public=True,
        keyword=keyword,
    )


# ==================== 相册相关接口 ====================

@router.get(
    "/albums/list",
    response_model=ApiResponse[ContentListResponse],
    summary="获取相册列表",
    description="获取所有相册（允许未登录访问）"
)
async def list_albums(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取相册列表（允许未登录访问）"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=ContentType.ALBUM,
        is_public=True,
        keyword=keyword,
    )


# ==================== 旅游路线相关接口 ====================

@router.get(
    "/travel/list",
    response_model=ApiResponse[ContentListResponse],
    summary="获取旅游路线列表",
    description="获取所有旅游路线（允许未登录访问）"
)
async def list_travel_routes(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取旅游路线列表（允许未登录访问）"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=ContentType.TRAVEL,
        is_public=True,
        keyword=keyword,
    )


# ==================== 探索页面相关接口 ====================

@router.get(
    "/explore/list",
    response_model=ApiResponse[ContentListResponse],
    summary="探索内容",
    description="获取探索页面的内容列表，支持分类和搜索（允许未登录访问）"
)
async def explore_contents(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    category: Optional[str] = Query(None, description="分类：all/daily/album/travel/popular"),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    tag: Optional[str] = Query(None, description="标签筛选"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """探索内容（允许未登录访问）"""
    service = ContentService(db)
    
    # 处理分类
    content_type = None
    is_featured = None
    if category == "daily":
        content_type = ContentType.DAILY
    elif category == "album":
        content_type = ContentType.ALBUM
    elif category == "travel":
        content_type = ContentType.TRAVEL
    elif category == "popular":
        is_featured = True
    
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=content_type,
        is_public=True,
        keyword=keyword,
        tag=tag,
        is_featured=is_featured,
    )


# ==================== 点赞相关接口 ====================

@router.post(
    "/{content_id}/like",
    response_model=ApiResponse[LikeResponse],
    summary="切换点赞",
    description="点赞或取消点赞内容"
)
async def toggle_like(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换点赞"""
    service = ContentService(db)
    return service.toggle_like(content_id, str(current_user.id))


# ==================== 收藏相关接口 ====================

@router.post(
    "/{content_id}/save",
    response_model=ApiResponse[SaveResponse],
    summary="切换收藏",
    description="收藏或取消收藏内容"
)
async def toggle_save(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换收藏"""
    service = ContentService(db)
    return service.toggle_save(content_id, str(current_user.id))


# ==================== 评论相关接口 ====================

@router.post(
    "/{content_id}/comments",
    response_model=ApiResponse[CommentResponse],
    summary="创建评论",
    description="为内容添加评论"
)
async def create_comment(
    content_id: str,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """创建评论"""
    service = ContentService(db)
    return service.create_comment(content_id, str(current_user.id), comment_data)


@router.get(
    "/{content_id}/comments",
    response_model=ApiResponse[dict],
    summary="获取评论列表",
    description="获取内容的评论列表"
)
async def get_comments(
    content_id: str,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取评论列表"""
    service = ContentService(db)
    return service.get_comments(content_id, page, page_size)

