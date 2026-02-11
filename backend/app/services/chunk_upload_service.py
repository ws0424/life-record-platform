"""
切片上传服务
"""
import os
import shutil
import hashlib
from pathlib import Path
from typing import Optional, Dict, List
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.core.minio import minio_client
from app.core.config import settings


class ChunkUploadService:
    """切片上传服务"""
    
    def __init__(self, db: Session):
        self.db = db
        # 临时目录用于存储切片
        self.temp_dir = Path(settings.UPLOAD_DIR) / "chunks"
        self.temp_dir.mkdir(parents=True, exist_ok=True)
    
    async def upload_chunk(
        self,
        chunk: UploadFile,
        chunk_index: int,
        total_chunks: int,
        file_identifier: str,
        filename: str,
        user_id: str
    ) -> Dict:
        """
        上传单个切片
        """
        try:
            # 创建文件标识符目录
            chunk_dir = self.temp_dir / file_identifier
            chunk_dir.mkdir(parents=True, exist_ok=True)
            
            # 保存切片文件
            chunk_path = chunk_dir / f"chunk_{chunk_index}"
            
            with open(chunk_path, "wb") as f:
                content = await chunk.read()
                f.write(content)
            
            return {
                "chunkIndex": chunk_index,
                "totalChunks": total_chunks,
                "uploaded": True
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"切片上传失败: {str(e)}")
    
    async def merge_chunks(
        self,
        file_identifier: str,
        filename: str,
        total_chunks: int,
        file_size: int,
        mime_type: str,
        user_id: str
    ) -> Dict:
        """
        合并所有切片
        """
        try:
            chunk_dir = self.temp_dir / file_identifier
            
            # 检查所有切片是否都已上传
            if not chunk_dir.exists():
                raise HTTPException(status_code=400, detail="切片目录不存在")
            
            missing_chunks = []
            for i in range(total_chunks):
                chunk_path = chunk_dir / f"chunk_{i}"
                if not chunk_path.exists():
                    missing_chunks.append(i)
            
            if missing_chunks:
                raise HTTPException(
                    status_code=400,
                    detail=f"缺少切片: {missing_chunks}"
                )
            
            # 合并切片到临时文件
            merged_file_path = self.temp_dir / f"{file_identifier}_merged"
            
            with open(merged_file_path, "wb") as merged_file:
                for i in range(total_chunks):
                    chunk_path = chunk_dir / f"chunk_{i}"
                    with open(chunk_path, "rb") as chunk_file:
                        merged_file.write(chunk_file.read())
            
            # 验证文件大小
            actual_size = os.path.getsize(merged_file_path)
            if actual_size != file_size:
                raise HTTPException(
                    status_code=400,
                    detail=f"文件大小不匹配: 期望 {file_size}, 实际 {actual_size}"
                )
            
            # 上传到 MinIO
            with open(merged_file_path, "rb") as f:
                file_data = f.read()
            
            # 根据 MIME 类型确定存储桶
            if mime_type.startswith("video/"):
                bucket_name = "videos"
            elif mime_type.startswith("image/"):
                bucket_name = "images"
            else:
                bucket_name = "files"
            
            # 生成唯一文件名
            file_ext = Path(filename).suffix
            unique_filename = f"{file_identifier}{file_ext}"
            
            # 上传到 MinIO（使用 upload_file_object 方法）
            from io import BytesIO
            url = minio_client.upload_file_object(
                file_data=BytesIO(file_data),
                object_name=unique_filename,
                length=len(file_data),
                content_type=mime_type
            )
            
            # 清理临时文件
            self._cleanup_chunks(file_identifier)
            
            return {
                "url": url,
                "filename": filename,
                "size": file_size,
                "mimeType": mime_type
            }
        except HTTPException:
            raise
        except Exception as e:
            # 清理临时文件
            self._cleanup_chunks(file_identifier)
            raise HTTPException(status_code=500, detail=f"合并切片失败: {str(e)}")
    
    async def check_file_exists(
        self,
        file_identifier: str,
        filename: str,
        user_id: str
    ) -> Dict:
        """
        检查文件是否已上传（断点续传）
        """
        try:
            chunk_dir = self.temp_dir / file_identifier
            
            if not chunk_dir.exists():
                return {
                    "exists": False,
                    "uploadedChunks": []
                }
            
            # 检查已上传的切片
            uploaded_chunks = []
            for chunk_file in chunk_dir.glob("chunk_*"):
                chunk_index = int(chunk_file.name.split("_")[1])
                uploaded_chunks.append(chunk_index)
            
            return {
                "exists": len(uploaded_chunks) > 0,
                "uploadedChunks": sorted(uploaded_chunks)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"检查文件失败: {str(e)}")
    
    def _cleanup_chunks(self, file_identifier: str):
        """
        清理临时切片文件
        """
        try:
            chunk_dir = self.temp_dir / file_identifier
            if chunk_dir.exists():
                shutil.rmtree(chunk_dir)
            
            merged_file = self.temp_dir / f"{file_identifier}_merged"
            if merged_file.exists():
                merged_file.unlink()
        except Exception as e:
            print(f"清理临时文件失败: {str(e)}")

