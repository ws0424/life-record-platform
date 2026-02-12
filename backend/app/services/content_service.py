from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, or_, and_, func
from typing import List, Optional
from fastapi import HTTPException, status
import logging

from app.models.content import Content, ContentType, ContentLike, ContentSave, Comment
from app.models.user import User
from app.schemas.content import (
    ContentCreate, ContentUpdate, ContentResponse, ContentListResponse,
    CommentCreate, CommentResponse, LikeResponse, SaveResponse, UserBrief, ContentListItem
)
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
                description=content_data.description,
                content=content_data.content,
                tags=content_data.tags,
                images=content_data.images,
                videos=content_data.videos,
                video_thumbnails=content_data.video_thumbnails,
                location=content_data.location,
                extra_data=content_data.extra_data,
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
            
            content = self.db.query(Content).options(
                joinedload(Content.user)
            ).filter(Content.id == content_id).first()
            
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
            
            # 构建响应
            response_data = ContentResponse.from_orm(content)
            response_data.user = UserBrief.from_orm(content.user) if content.user else None
            
            # 检查当前用户是否点赞/收藏
            if user_id:
                is_liked = self.db.query(ContentLike).filter(
                    and_(ContentLike.content_id == content_id, ContentLike.user_id == user_id)
                ).first() is not None
                is_saved = self.db.query(ContentSave).filter(
                    and_(ContentSave.content_id == content_id, ContentSave.user_id == user_id)
                ).first() is not None
                response_data.is_liked = is_liked
                response_data.is_saved = is_saved
            
            logger.info(f"✅ 获取内容成功 - ID: {content_id}")
            
            return ApiResponse(
                code=200,
                data=response_data,
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
        tag: Optional[str] = None,
        is_featured: Optional[bool] = None,
    ) -> ApiResponse[ContentListResponse]:
        """获取内容列表"""
        try:
            logger.info(f"📋 获取内容列表 - 页码: {page}, 类型: {content_type}")
            
            query = self.db.query(Content).options(joinedload(Content.user))
            
            # 筛选条件
            if content_type:
                query = query.filter(Content.type == content_type)
            
            if user_id:
                query = query.filter(Content.user_id == user_id)
            
            if is_public is not None:
                query = query.filter(Content.is_public == is_public)
            
            if is_featured is not None:
                query = query.filter(Content.is_featured == is_featured)
            
            if keyword:
                query = query.filter(
                    or_(
                        Content.title.ilike(f"%{keyword}%"),
                        Content.content.ilike(f"%{keyword}%"),
                        Content.description.ilike(f"%{keyword}%"),
                    )
                )
            
            if tag:
                query = query.filter(Content.tags.contains([tag]))
            
            # 总数
            total = query.count()
            
            # 分页
            offset = (page - 1) * page_size
            contents = query.order_by(desc(Content.created_at)).offset(offset).limit(page_size).all()
            
            # 计算总页数
            total_pages = (total + page_size - 1) // page_size
            
            # 构建响应
            items = []
            for content in contents:
                item = ContentListItem.from_orm(content)
                item.user = UserBrief.from_orm(content.user) if content.user else None
                items.append(item)
            
            logger.info(f"✅ 获取内容列表成功 - 总数: {total}")
            
            return ApiResponse(
                code=200,
                data=ContentListResponse(
                    items=items,
                    total=total,
                    page=page,
                    page_size=page_size,
                    total_pages=total_pages,
                ),
                msg="获取成功",
                errMsg=None
            )
        except Exception as e:
            logger.error(f"❌ 获取内容列表失败 - 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"获取内容列表失败: {str(e)}"
            )
    
    def toggle_like(self, content_id: str, user_id: str) -> ApiResponse[LikeResponse]:
        """切换点赞状态"""
        try:
            logger.info(f"👍 切换点赞 - 内容ID: {content_id}, 用户ID: {user_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            if not content:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="内容不存在")
            
            # 检查是否已点赞
            existing_like = self.db.query(ContentLike).filter(
                and_(ContentLike.content_id == content_id, ContentLike.user_id == user_id)
            ).first()
            
            if existing_like:
                # 取消点赞
                self.db.delete(existing_like)
                content.like_count = max(0, content.like_count - 1)
                is_liked = False
            else:
                # 添加点赞
                new_like = ContentLike(content_id=content_id, user_id=user_id)
                self.db.add(new_like)
                content.like_count += 1
                is_liked = True
            
            self.db.commit()
            
            logger.info(f"✅ 点赞状态更新 - 是否点赞: {is_liked}")
            
            return ApiResponse(
                code=200,
                data=LikeResponse(is_liked=is_liked, like_count=content.like_count),
                msg="操作成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 点赞操作失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"点赞操作失败: {str(e)}"
            )
    
    def toggle_save(self, content_id: str, user_id: str) -> ApiResponse[SaveResponse]:
        """切换收藏状态"""
        try:
            logger.info(f"⭐ 切换收藏 - 内容ID: {content_id}, 用户ID: {user_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            if not content:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="内容不存在")
            
            # 检查是否已收藏
            existing_save = self.db.query(ContentSave).filter(
                and_(ContentSave.content_id == content_id, ContentSave.user_id == user_id)
            ).first()
            
            if existing_save:
                # 取消收藏
                self.db.delete(existing_save)
                content.save_count = max(0, content.save_count - 1)
                is_saved = False
            else:
                # 添加收藏
                new_save = ContentSave(content_id=content_id, user_id=user_id)
                self.db.add(new_save)
                content.save_count += 1
                is_saved = True
            
            self.db.commit()
            
            logger.info(f"✅ 收藏状态更新 - 是否收藏: {is_saved}")
            
            return ApiResponse(
                code=200,
                data=SaveResponse(is_saved=is_saved, save_count=content.save_count),
                msg="操作成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 收藏操作失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"收藏操作失败: {str(e)}"
            )
    
    def create_comment(
        self, content_id: str, user_id: str, comment_data: CommentCreate
    ) -> ApiResponse[CommentResponse]:
        """创建评论"""
        try:
            logger.info(f"💬 创建评论 - 内容ID: {content_id}, 用户ID: {user_id}")
            
            content = self.db.query(Content).filter(Content.id == content_id).first()
            if not content:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="内容不存在")
            
            # 创建评论
            comment = Comment(
                content_id=content_id,
                user_id=user_id,
                comment_text=comment_data.comment_text,
                parent_id=comment_data.parent_id,
            )
            
            self.db.add(comment)
            content.comment_count += 1
            self.db.commit()
            self.db.refresh(comment)
            
            # 加载用户信息
            comment_with_user = self.db.query(Comment).options(
                joinedload(Comment.user)
            ).filter(Comment.id == comment.id).first()
            
            response_data = CommentResponse.from_orm(comment_with_user)
            response_data.user = UserBrief.from_orm(comment_with_user.user) if comment_with_user.user else None
            
            logger.info(f"✅ 评论创建成功 - ID: {comment.id}")
            
            return ApiResponse(
                code=200,
                data=response_data,
                msg="评论成功",
                errMsg=None
            )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 评论创建失败 - 错误: {str(e)}", exc_info=True)
            self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"评论创建失败: {str(e)}"
            )
    
    def get_comments(
        self, content_id: str, page: int = 1, page_size: int = 20
    ) -> ApiResponse[dict]:
        """获取评论列表"""
        try:
            logger.info(f"📋 获取评论列表 - 内容ID: {content_id}")
            
            # 只获取顶级评论（没有父评论的）
            query = self.db.query(Comment).options(
                joinedload(Comment.user)
            ).filter(
                and_(Comment.content_id == content_id, Comment.parent_id == None)
            )
            
            total = query.count()
            offset = (page - 1) * page_size
            comments = query.order_by(desc(Comment.created_at)).offset(offset).limit(page_size).all()
            
            # 构建响应
            items = []
            for comment in comments:
                comment_data = CommentResponse.from_orm(comment)
                comment_data.user = UserBrief.from_orm(comment.user) if comment.user else None
                
                # 获取回复
                replies = self.db.query(Comment).options(
                    joinedload(Comment.user)
                ).filter(Comment.parent_id == comment.id).order_by(Comment.created_at).all()
                
                comment_data.replies = []
                for reply in replies:
                    reply_data = CommentResponse.from_orm(reply)
                    reply_data.user = UserBrief.from_orm(reply.user) if reply.user else None
                    comment_data.replies.append(reply_data)
                
                items.append(comment_data)
            
            total_pages = (total + page_size - 1) // page_size
            
            logger.info(f"✅ 获取评论列表成功 - 总数: {total}")
            
            return ApiResponse(
                code=200,
                data={
                    "items": items,
                    "total": total,
                    "page": page,
                    "page_size": page_size,
                    "total_pages": total_pages,
                },
                msg="获取成功",
                errMsg=None
            )
        except Exception as e:
            logger.error(f"❌ 获取评论列表失败 - 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"获取评论列表失败: {str(e)}"
            )
    
    def get_hot_tags(self, limit: int = 10) -> ApiResponse[dict]:
        """获取热门标签"""
        try:
            logger.info(f"🏷️  获取热门标签 - 数量: {limit}")
            
            # 查询所有公开内容的标签
            contents = self.db.query(Content).filter(Content.is_public == True).all()
            
            # 统计标签使用次数
            tag_counts = {}
            for content in contents:
                if content.tags:
                    for tag in content.tags:
                        tag_counts[tag] = tag_counts.get(tag, 0) + 1
            
            # 如果没有标签，返回默认热门标签
            if not tag_counts:
                default_tags = [
                    {"name": "生活", "count": 0},
                    {"name": "美食", "count": 0},
                    {"name": "旅行", "count": 0},
                    {"name": "摄影", "count": 0},
                    {"name": "运动", "count": 0},
                    {"name": "学习", "count": 0},
                    {"name": "工作", "count": 0},
                    {"name": "娱乐", "count": 0},
                    {"name": "健康", "count": 0},
                    {"name": "阅读", "count": 0},
                ]
                logger.info(f"✅ 返回默认热门标签 - 数量: {len(default_tags)}")
                return ApiResponse(
                    code=200,
                    data={"tags": default_tags[:limit]},
                    msg="获取成功",
                    errMsg=None
                )
            
            # 按使用次数排序
            sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
            
            # 构建响应
            hot_tags = [
                {"name": tag, "count": count}
                for tag, count in sorted_tags[:limit]
            ]
            
            logger.info(f"✅ 获取热门标签成功 - 数量: {len(hot_tags)}")
            
            return ApiResponse(
                code=200,
                data={"tags": hot_tags},
                msg="获取成功",
                errMsg=None
            )
        except Exception as e:
            logger.error(f"❌ 获取热门标签失败 - 错误: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"获取热门标签失败: {str(e)}"
            )

