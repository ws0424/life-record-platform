from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.models.content import ContentType
from app.schemas.content import (
    ContentCreate,
    ContentUpdate,
    ContentResponse,
    ContentListResponse,
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
    """
    ## 创建内容
    
    创建新的内容，支持三种类型：
    - daily: 日常记录
    - album: 相册
    - travel: 旅游路线
    
    ### 请求参数
    - **type**: 内容类型（必填）
    - **title**: 标题，1-100字符（必填）
    - **content**: 内容，1-5000字符（必填）
    - **tags**: 标签列表（可选）
    - **images**: 图片URL列表（可选）
    - **location**: 位置，最多200字符（可选，旅游路线专用）
    - **is_public**: 是否公开，默认true（可选）
    
    ### 示例请求
    ```json
    {
        "type": "daily",
        "title": "今天的美好时光",
        "content": "今天天气真好，去公园散步了...",
        "tags": ["生活", "日常"],
        "images": ["https://example.com/image1.jpg"],
        "is_public": true
    }
    ```
    """
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
    """
    ## 获取内容详情
    
    获取指定ID的内容详细信息。
    
    ### 权限说明
    - 公开内容：所有人可见
    - 私密内容：仅作者可见
    
    ### 路径参数
    - **content_id**: 内容ID
    """
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
    """
    ## 更新内容
    
    更新指定ID的内容信息。
    
    ### 权限说明
    - 仅作者可以更新自己的内容
    
    ### 路径参数
    - **content_id**: 内容ID
    
    ### 请求参数
    所有字段均为可选，只更新提供的字段。
    """
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
    """
    ## 删除内容
    
    删除指定ID的内容。
    
    ### 权限说明
    - 仅作者可以删除自己的内容
    
    ### 路径参数
    - **content_id**: 内容ID
    """
    service = ContentService(db)
    return service.delete_content(content_id, str(current_user.id))


@router.get(
    "/",
    response_model=ApiResponse[dict],
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    ## 获取内容列表
    
    获取内容列表，支持多种筛选条件和分页。
    
    ### 查询参数
    - **page**: 页码，默认1
    - **page_size**: 每页数量，默认20，最大100
    - **type**: 内容类型筛选（daily/album/travel）
    - **user_id**: 用户ID筛选
    - **is_public**: 是否公开筛选
    - **keyword**: 搜索关键词（标题和内容）
    
    ### 响应数据
    ```json
    {
        "items": [...],
        "total": 100,
        "page": 1,
        "page_size": 20,
        "total_pages": 5
    }
    ```
    """
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=type,
        user_id=user_id,
        is_public=is_public,
        keyword=keyword,
    )


@router.get(
    "/my/contents",
    response_model=ApiResponse[dict],
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
    """
    ## 获取我的内容
    
    获取当前登录用户的所有内容（包括私密内容）。
    
    ### 查询参数
    - **page**: 页码，默认1
    - **page_size**: 每页数量，默认20，最大100
    - **type**: 内容类型筛选（daily/album/travel）
    """
    service = ContentService(db)
    return service.list_contents(
        page=page,
        page_size=page_size,
        content_type=type,
        user_id=str(current_user.id),
    )

