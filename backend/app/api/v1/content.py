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
    CommentLikeResponse,
)
from app.schemas import ApiResponse, MessageResponse
from app.services.content_service import ContentService

router = APIRouter()


@router.post(
    "",
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
    description="获取指定内容的详细信息（公开内容允许未登录访问）"
)
async def get_content(
    content_id: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取内容详情（公开内容允许未登录访问）"""
    service = ContentService(db)
    user_id = str(current_user.id) if current_user else None
    return service.get_content(content_id, user_id)


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
    "",
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


# ==================== 我的创作相关接口 ====================
# 注意：这些路由必须放在 /{content_id} 相关路由之前，避免路径冲突

@router.get(
    "/my/works",
    response_model=ApiResponse[ContentListResponse],
    summary="我的作品",
    description="获取当前用户创建的所有作品"
)
async def get_my_works(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    type: Optional[ContentType] = Query(None, description="内容类型"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取我的作品"""
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=type,
        user_id=str(current_user.id),
    )


@router.get(
    "/my/views",
    response_model=ApiResponse[ContentListResponse],
    summary="浏览记录",
    description="获取当前用户的浏览记录"
)
async def get_my_views(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取浏览记录"""
    service = ContentService(db)
    return service.get_user_views(str(current_user.id), page, page_size)


@router.get(
    "/my/likes",
    response_model=ApiResponse[ContentListResponse],
    summary="点赞记录",
    description="获取当前用户点赞的内容"
)
async def get_my_likes(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取点赞记录"""
    service = ContentService(db)
    return service.get_user_likes(str(current_user.id), page, page_size)


@router.get(
    "/my/comments",
    response_model=ApiResponse[dict],
    summary="评论记录",
    description="获取当前用户的评论记录"
)
async def get_my_comments(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """获取评论记录"""
    service = ContentService(db)
    return service.get_user_comments(str(current_user.id), page, page_size)


@router.delete(
    "/my/views/{content_id}",
    response_model=MessageResponse,
    summary="删除浏览记录",
    description="删除指定的浏览记录"
)
async def delete_view_record(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """删除浏览记录"""
    service = ContentService(db)
    return service.delete_view_record(content_id, str(current_user.id))


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
    description="获取内容的评论列表（允许未登录访问）"
)
async def get_comments(
    content_id: str,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取评论列表（允许未登录访问）"""
    service = ContentService(db)
    user_id = str(current_user.id) if current_user else None
    return service.get_comments(content_id, page, page_size, user_id)


# ==================== 标签相关接口 ====================

@router.get(
    "/tags/hot",
    response_model=ApiResponse[dict],
    summary="获取热门标签",
    description="获取使用频率最高的标签（允许未登录访问）"
)
async def get_hot_tags(
    limit: int = Query(10, ge=1, le=50, description="返回数量"),
    db: Session = Depends(get_db)
):
    """获取热门标签"""
    service = ContentService(db)
    return service.get_hot_tags(limit)


# ==================== 评论点赞相关接口 ====================

@router.post(
    "/comments/{comment_id}/like",
    response_model=ApiResponse[CommentLikeResponse],
    summary="切换评论点赞",
    description="点赞或取消点赞评论"
)
async def toggle_comment_like(
    comment_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """切换评论点赞"""
    service = ContentService(db)
    return service.toggle_comment_like(comment_id, str(current_user.id))


@router.get(
    "/comments/{comment_id}/replies",
    response_model=ApiResponse[dict],
    summary="获取评论回复",
    description="获取评论的回复列表（分页）"
)
async def get_comment_replies(
    comment_id: str,
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=50, description="每页数量"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """获取评论回复"""
    service = ContentService(db)
    user_id = str(current_user.id) if current_user else None
    return service.get_comment_replies(comment_id, page, page_size, user_id)


# ==================== 内容可见性相关接口 ====================

@router.post(
    "/{content_id}/hide",
    response_model=MessageResponse,
    summary="隐藏作品",
    description="将作品设置为私密（仅自己可见）"
)
async def hide_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """隐藏作品"""
    service = ContentService(db)
    return service.toggle_content_visibility(content_id, str(current_user.id), is_public=False)


@router.post(
    "/{content_id}/show",
    response_model=MessageResponse,
    summary="公开作品",
    description="将作品设置为公开"
)
async def show_content(
    content_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """公开作品"""
    service = ContentService(db)
    return service.toggle_content_visibility(content_id, str(current_user.id), is_public=True)




