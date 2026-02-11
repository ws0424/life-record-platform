"""
MinIO 对象存储配置
"""
from minio import Minio
from minio.error import S3Error
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class MinIOClient:
    """MinIO 客户端"""
    
    def __init__(self):
        self.client = None
        self._initialized = False
    
    def _ensure_initialized(self):
        """确保 MinIO 客户端已初始化（延迟初始化）"""
        if self._initialized:
            return
            
        try:
            self.client = Minio(
                settings.MINIO_ENDPOINT,
                access_key=settings.MINIO_ACCESS_KEY,
                secret_key=settings.MINIO_SECRET_KEY,
                secure=settings.MINIO_SECURE
            )
            
            # 确保 bucket 存在
            if not self.client.bucket_exists(settings.MINIO_BUCKET):
                self.client.make_bucket(settings.MINIO_BUCKET)
                logger.info(f"✅ 创建 MinIO bucket: {settings.MINIO_BUCKET}")
            else:
                logger.info(f"✅ MinIO bucket 已存在: {settings.MINIO_BUCKET}")
            
            self._initialized = True
                
        except Exception as e:
            logger.error(f"❌ MinIO 初始化失败: {str(e)}")
            raise
    
    def upload_file(self, file_path: str, object_name: str, content_type: str = None):
        """
        上传文件到 MinIO
        
        Args:
            file_path: 本地文件路径
            object_name: 对象名称（存储路径）
            content_type: 文件类型
        
        Returns:
            str: 文件访问 URL
        """
        self._ensure_initialized()
        
        try:
            self.client.fput_object(
                settings.MINIO_BUCKET,
                object_name,
                file_path,
                content_type=content_type
            )
            
            # 生成访问 URL
            url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{object_name}"
            logger.info(f"✅ 文件上传成功: {url}")
            return url
            
        except S3Error as e:
            logger.error(f"❌ 文件上传失败: {str(e)}")
            raise
    
    def upload_file_object(self, file_data, object_name: str, length: int, content_type: str = None):
        """
        上传文件对象到 MinIO
        
        Args:
            file_data: 文件数据流
            object_name: 对象名称（存储路径）
            length: 文件大小
            content_type: 文件类型
        
        Returns:
            str: 文件访问 URL
        """
        self._ensure_initialized()
        
        try:
            self.client.put_object(
                settings.MINIO_BUCKET,
                object_name,
                file_data,
                length,
                content_type=content_type
            )
            
            # 生成访问 URL
            url = f"{settings.MINIO_PUBLIC_URL}/{settings.MINIO_BUCKET}/{object_name}"
            logger.info(f"✅ 文件上传成功: {url}")
            return url
            
        except S3Error as e:
            logger.error(f"❌ 文件上传失败: {str(e)}")
            raise
    
    def delete_file(self, object_name: str):
        """
        删除文件
        
        Args:
            object_name: 对象名称（存储路径）
        """
        self._ensure_initialized()
        
        try:
            self.client.remove_object(settings.MINIO_BUCKET, object_name)
            logger.info(f"✅ 文件删除成功: {object_name}")
        except S3Error as e:
            logger.error(f"❌ 文件删除失败: {str(e)}")
            raise
    
    def get_file_url(self, object_name: str, expires: int = 3600):
        """
        获取文件预签名 URL
        
        Args:
            object_name: 对象名称（存储路径）
            expires: 过期时间（秒）
        
        Returns:
            str: 预签名 URL
        """
        self._ensure_initialized()
        
        try:
            url = self.client.presigned_get_object(
                settings.MINIO_BUCKET,
                object_name,
                expires=expires
            )
            return url
        except S3Error as e:
            logger.error(f"❌ 获取文件 URL 失败: {str(e)}")
            raise


# 全局 MinIO 客户端实例
minio_client = MinIOClient()

