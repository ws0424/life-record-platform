"""
切片上传相关接口
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional
import os
import shutil
from pathlib import Path

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.chunk_upload_service import ChunkUploadService

router = APIRouter()


@router.post("/chunk")
async def upload_chunk(
    chunk: UploadFile = File(...),
    chunkIndex: int = Form(...),
    totalChunks: int = Form(...),
    fileIdentifier: str = Form(...),
    filename: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传文件切片
    """
    try:
        service = ChunkUploadService(db)
        
        result = await service.upload_chunk(
            chunk=chunk,
            chunk_index=chunkIndex,
            total_chunks=totalChunks,
            file_identifier=fileIdentifier,
            filename=filename,
            user_id=current_user.id
        )
        
        return {
            "success": True,
            "message": f"切片 {chunkIndex + 1}/{totalChunks} 上传成功",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/merge")
async def merge_chunks(
    fileIdentifier: str = Form(...),
    filename: str = Form(...),
    totalChunks: int = Form(...),
    fileSize: int = Form(...),
    mimeType: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    合并文件切片
    """
    try:
        service = ChunkUploadService(db)
        
        result = await service.merge_chunks(
            file_identifier=fileIdentifier,
            filename=filename,
            total_chunks=totalChunks,
            file_size=fileSize,
            mime_type=mimeType,
            user_id=current_user.id
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/check")
async def check_file_exists(
    fileIdentifier: str,
    filename: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    检查文件是否已上传（断点续传）
    """
    try:
        service = ChunkUploadService(db)
        
        result = await service.check_file_exists(
            file_identifier=fileIdentifier,
            filename=filename,
            user_id=current_user.id
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

