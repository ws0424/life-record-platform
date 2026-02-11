from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from typing import List, Optional
from fastapi import HTTPException, status
import logging

from app.models.content import Content, ContentType
from app.schemas.content import ContentCreate, ContentUpdate, ContentResponse
from app.schemas import ApiResponse

logger = logging.getLogger(__name__)


class ContentService:
    """内容服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_content(self, user_id: str, content_data: ContentCreate) -> ApiResponse[ContentResponse]:
        """创建内容"""
        try:
            logger.info(f"📝 创建内容 - 用户ID: {user_id}, 类型: {content_data.type}")
            
            # 创建内容
            content = Content(
                user_id=user_id,
                type=content_data.type,
                title=content_data.title,
                content=content_data.content,
                tags=content_data.tags,
                images=content_data.images,
                location=content_data.location,
                is_public=content_data.is_public,
            )
            
            self.db.add(content)
            self.db.commit()
            self.db.refresh(content)
            
            logger.info(f"✅ 内容创建成功 - ID: {content.id}")
            
            return ApiResponse(
                code=200,
                data=ContentResponse.from_orm(content),
                msg="内容创建成功",
                errMsg=None
            )
        except Exception as e:
            logger.error(f"❌ 内容创建失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"内容创建失败: {str(e)}"
            )
    
    def get_content(self, content_id: str, user_id: Optional[str] = None) -> ApiResponse[ContentResponse]:
        """获取内容详情"""
        try:
            logger.info(f"🔍 获取内容详情 - ID: {content_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            
            if not content:
                logger.warning(f"⚠️  内容不存在 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="内容不存在"
                )
            
            # 检查权限：如果是私密内容，只有作者可以查看
            if not content.is_public and str(content.user_id) != user_id:
                logger.warning(f"⚠️  无权访问私密内容 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权访问此内容"
                )
            
            # 增加浏览次数
            content.view_count += 1
            self.db.commit()
            
            logger.info(f"✅ 获取内容成功 - ID: {content_id}")
            
            return ApiResponse(
                code=200,
                data=ContentResponse.from_orm(content),
                msg="获取成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 获取内容失败 - 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"获取内容失败: {str(e)}"
            )
    
    def update_content(
        self, 
        content_id: str, 
        user_id: str, 
        content_data: ContentUpdate
    ) -> ApiResponse[ContentResponse]:
        """更新内容"""
        try:
            logger.info(f"📝 更新内容 - ID: {content_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            
            if not content:
                logger.warning(f"⚠️  内容不存在 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="内容不存在"
                )
            
            # 检查权限：只有作者可以更新
            if str(content.user_id) != user_id:
                logger.warning(f"⚠️  无权更新内容 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权更新此内容"
                )
            
            # 更新字段
            update_data = content_data.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(content, field, value)
            
            self.db.commit()
            self.db.refresh(content)
            
            logger.info(f"✅ 内容更新成功 - ID: {content_id}")
            
            return ApiResponse(
                code=200,
                data=ContentResponse.from_orm(content),
                msg="内容更新成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 内容更新失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"内容更新失败: {str(e)}"
            )
    
    def delete_content(self, content_id: str, user_id: str) -> ApiResponse[None]:
        """删除内容"""
        try:
            logger.info(f"🗑️  删除内容 - ID: {content_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            
            if not content:
                logger.warning(f"⚠️  内容不存在 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="内容不存在"
                )
            
            # 检查权限：只有作者可以删除
            if str(content.user_id) != user_id:
                logger.warning(f"⚠️  无权删除内容 - ID: {content_id}")
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="无权删除此内容"
                )
            
            self.db.delete(content)
            self.db.commit()
            
            logger.info(f"✅ 内容删除成功 - ID: {content_id}")
            
            return ApiResponse(
                code=200,
                data=None,
                msg="内容删除成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 内容删除失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"内容删除失败: {str(e)}"
            )
    
    def list_contents(
        self,
        page: int = 1,
        page_size: int = 20,
        content_type: Optional[ContentType] = None,
        user_id: Optional[str] = None,
        is_public: Optional[bool] = None,
        keyword: Optional[str] = None,
    ) -> ApiResponse[dict]:
        """获取内容列表"""
        try:
            logger.info(f"📋 获取内容列表 - 页码: {page}, 类型: {content_type}")
            
            query = self.db.query(Content)
            
            # 筛选条件
            if content_type:
                query = query.filter(Content.type == content_type)
            
            if user_id:
                query = query.filter(Content.user_id == user_id)
            
            if is_public is not None:
                query = query.filter(Content.is_public == is_public)
            
            if keyword:
                query = query.filter(
                    or_(
                        Content.title.ilike(f"%{keyword}%"),
                        Content.content.ilike(f"%{keyword}%"),
                    )
                )
            
            # 总数
            total = query.count()
            
            # 分页
            offset = (page - 1) * page_size
            contents = query.order_by(desc(Content.created_at)).offset(offset).limit(page_size).all()
            
            # 计算总页数
            total_pages = (total + page_size - 1) // page_size
            
            logger.info(f"✅ 获取内容列表成功 - 总数: {total}")
            
            return ApiResponse(
                code=200,
                data={
                    "items": [ContentResponse.from_orm(content) for content in contents],
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": total_pages,
                },
                msg="获取成功",
                errMsg=None
            )
        except Exception as e:
            logger.error(f"❌ 获取内容列表失败 - 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"获取内容列表失败: {str(e)}"
            )

