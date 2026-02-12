"""
文件上传服务
"""
from fastapi import UploadFile, HTTPException, status
from typing import List, Optional
import os
import uuid
from datetime import datetime
import logging
from pathlib import Path

from app.core.minio import minio_client

logger = logging.getLogger(__name__)

# 允许的文件类型
ALLOWED_IMAGE_TYPES = {
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
}

ALLOWED_VIDEO_TYPES = {
    "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm"
}

# 文件大小限制
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB
CHUNK_SIZE = 5 * 1024 * 1024  # 5MB 分片大小


class UploadService:
    """文件上传服务"""
    
    @staticmethod
    def validate_file(file: UploadFile, file_type: str = "image") -> None:
        """
        验证文件
        
        Args:
            file: 上传的文件
            file_type: 文件类型（image/video）
        
        Raises:
            HTTPException: 验证失败
        """
        # 验证文件类型
        if file_type == "image":
            if file.content_type not in ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"不支持的图片格式，仅支持: {', '.join(ALLOWED_IMAGE_TYPES)}"
                )
            max_size = MAX_IMAGE_SIZE
        elif file_type == "video":
            if file.content_type not in ALLOWED_VIDEO_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"不支持的视频格式，仅支持: {', '.join(ALLOWED_VIDEO_TYPES)}"
                )
            max_size = MAX_VIDEO_SIZE
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="不支持的文件类型"
            )
        
        # 验证文件大小
        file.file.seek(0, 2)  # 移动到文件末尾
        file_size = file.file.tell()
        file.file.seek(0)  # 重置到文件开头
        
        if file_size > max_size:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"文件大小超过限制（最大 {max_size / 1024 / 1024}MB）"
            )
    
    @staticmethod
    def generate_filename(original_filename: str, user_id: str) -> str:
        """
        生成唯一文件名
        
        Args:
            original_filename: 原始文件名
            user_id: 用户ID
        
        Returns:
            str: 生成的文件名
        """
        # 获取文件扩展名
        ext = Path(original_filename).suffix
        
        # 生成唯一文件名：日期/用户ID/UUID.ext
        date_path = datetime.now().strftime("%Y/%m/%d")
        unique_name = f"{uuid.uuid4().hex}{ext}"
        
        return f"{date_path}/{user_id}/{unique_name}"
    
    @staticmethod
    async def upload_image(file: UploadFile, user_id: str) -> str:
        """
        上传图片
        
        Args:
            file: 上传的图片文件
            user_id: 用户ID
        
        Returns:
            str: 图片访问 URL
        """
        try:
            # 验证文件
            UploadService.validate_file(file, "image")
            
            # 生成文件名
            object_name = UploadService.generate_filename(file.filename, user_id)
            
            # 读取文件内容
            file_data = await file.read()
            
            # 上传到 MinIO
            from io import BytesIO
            url = minio_client.upload_file_object(
                BytesIO(file_data),
                object_name,
                len(file_data),
                file.content_type
            )
            
            logger.info(f"✅ 图片上传成功 - 用户: {user_id}, URL: {url}")
            return url
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 图片上传失败: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"图片上传失败: {str(e)}"
            )
    
    @staticmethod
    async def upload_video(file: UploadFile, user_id: str) -> str:
        """
        上传视频
        
        Args:
            file: 上传的视频文件
            user_id: 用户ID
        
        Returns:
            str: 视频访问 URL
        """
        try:
            # 验证文件
            UploadService.validate_file(file, "video")
            
            # 生成文件名
            object_name = UploadService.generate_filename(file.filename, user_id)
            
            # 读取文件内容
            file_data = await file.read()
            
            # 上传到 MinIO
            from io import BytesIO
            url = minio_client.upload_file_object(
                BytesIO(file_data),
                object_name,
                len(file_data),
                file.content_type
            )
            
            logger.info(f"✅ 视频上传成功 - 用户: {user_id}, URL: {url}")
            return url
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"❌ 视频上传失败: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"视频上传失败: {str(e)}"
            )
    
    @staticmethod
    async def upload_images_batch(files: List[UploadFile], user_id: str) -> List[str]:
        """
        批量上传图片
        
        Args:
            files: 上传的图片文件列表
            user_id: 用户ID
        
        Returns:
            List[str]: 图片访问 URL 列表
        """
        urls = []
        for file in files:
            url = await UploadService.upload_image(file, user_id)
            urls.append(url)
        return urls
    
    @staticmethod
    async def upload_chunk(
        chunk: UploadFile,
        chunk_index: int,
        total_chunks: int,
        file_id: str,
        user_id: str
    ) -> dict:
        """
        上传文件分片
        
        Args:
            chunk: 文件分片
            chunk_index: 分片索引
            total_chunks: 总分片数
            file_id: 文件唯一标识
            user_id: 用户ID
        
        Returns:
            dict: 上传结果
        """
        try:
            # 生成分片文件名
            chunk_name = f"chunks/{user_id}/{file_id}/chunk_{chunk_index}"
            
            # 读取分片内容
            chunk_data = await chunk.read()
            
            # 上传分片到 MinIO
            from io import BytesIO
            minio_client.upload_file_object(
                BytesIO(chunk_data),
                chunk_name,
                len(chunk_data),
                "application/octet-stream"
            )
            
            logger.info(f"✅ 分片上传成功 - 用户: {user_id}, 分片: {chunk_index}/{total_chunks}")
            
            return {
                "chunk_index": chunk_index,
                "total_chunks": total_chunks,
                "uploaded": True
            }
            
        except Exception as e:
            logger.error(f"❌ 分片上传失败: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"分片上传失败: {str(e)}"
            )
    
    @staticmethod
    async def merge_chunks(
        file_id: str,
        total_chunks: int,
        original_filename: str,
        user_id: str,
        content_type: str
    ) -> str:
        """
        合并文件分片
        
        Args:
            file_id: 文件唯一标识
            total_chunks: 总分片数
            original_filename: 原始文件名
            user_id: 用户ID
            content_type: 文件类型
        
        Returns:
            str: 合并后的文件访问 URL
        """
        try:
            from io import BytesIO
            from app.core.config import settings
            
            # 生成最终文件名
            object_name = UploadService.generate_filename(original_filename, user_id)
            
            # 下载并合并所有分片
            merged_data = BytesIO()
            
            for chunk_index in range(total_chunks):
                chunk_name = f"chunks/{user_id}/{file_id}/chunk_{chunk_index}"
                
                try:
                    # 从 MinIO 下载分片
                    response = minio_client.client.get_object(
                        settings.MINIO_BUCKET,
                        chunk_name
                    )
                    
                    # 写入合并数据
                    merged_data.write(response.read())
                    response.close()
                    response.release_conn()
                    
                    logger.info(f"✅ 分片下载成功 - 分片: {chunk_index}/{total_chunks}")
                    
                except Exception as e:
                    logger.error(f"❌ 分片下载失败 - 分片: {chunk_index}, 错误: {str(e)}")
                    raise
            
            # 重置指针到开头
            merged_data.seek(0)
            file_size = merged_data.getbuffer().nbytes
            
            # 上传合并后的文件
            url = minio_client.upload_file_object(
                merged_data,
                object_name,
                file_size,
                content_type
            )
            
            # 删除临时分片文件
            try:
                for chunk_index in range(total_chunks):
                    chunk_name = f"chunks/{user_id}/{file_id}/chunk_{chunk_index}"
                    minio_client.delete_file(chunk_name)
                logger.info(f"✅ 临时分片已清理 - 文件ID: {file_id}")
            except Exception as e:
                logger.warning(f"⚠️  清理临时分片失败: {str(e)}")
            
            logger.info(f"✅ 文件合并成功 - 用户: {user_id}, 文件: {object_name}, URL: {url}")
            
            return url
            
        except Exception as e:
            logger.error(f"❌ 文件合并失败: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"文件合并失败: {str(e)}"
            )


# 全局上传服务实例
upload_service = UploadService()

