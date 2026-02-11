"""
文件上传 API
"""
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.utils.dependencies import get_current_user
from app.models.user import User
from app.services.upload_service import upload_service
from app.schemas import ApiResponse

router = APIRouter()


@router.post(
    "/image",
    response_model=ApiResponse[dict],
    summary="上传图片",
    description="上传单张图片"
)
async def upload_image(
    file: UploadFile = File(..., description="图片文件"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传图片
    
    - 支持格式：JPEG、PNG、GIF、WebP
    - 最大大小：10MB
    """
    url = await upload_service.upload_image(file, str(current_user.id))
    
    return ApiResponse(
        code=200,
        data={"url": url},
        msg="图片上传成功",
        errMsg=None
    )


@router.post(
    "/images",
    response_model=ApiResponse[dict],
    summary="批量上传图片",
    description="批量上传多张图片"
)
async def upload_images(
    files: List[UploadFile] = File(..., description="图片文件列表"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    批量上传图片
    
    - 支持格式：JPEG、PNG、GIF、WebP
    - 最大大小：每张 10MB
    - 最多上传：9 张
    """
    if len(files) > 9:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="最多只能上传 9 张图片"
        )
    
    urls = await upload_service.upload_images_batch(files, str(current_user.id))
    
    return ApiResponse(
        code=200,
        data={"urls": urls},
        msg=f"成功上传 {len(urls)} 张图片",
        errMsg=None
    )


@router.post(
    "/video",
    response_model=ApiResponse[dict],
    summary="上传视频",
    description="上传视频文件"
)
async def upload_video(
    file: UploadFile = File(..., description="视频文件"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传视频
    
    - 支持格式：MP4、MPEG、MOV、AVI、WebM
    - 最大大小：500MB
    """
    url = await upload_service.upload_video(file, str(current_user.id))
    
    return ApiResponse(
        code=200,
        data={"url": url},
        msg="视频上传成功",
        errMsg=None
    )


@router.post(
    "/chunk",
    response_model=ApiResponse[dict],
    summary="上传文件分片",
    description="上传大文件的分片"
)
async def upload_chunk(
    chunk: UploadFile = File(..., description="文件分片"),
    chunk_index: int = Form(..., description="分片索引"),
    total_chunks: int = Form(..., description="总分片数"),
    file_id: str = Form(..., description="文件唯一标识"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    上传文件分片
    
    用于大文件上传，将文件分片后逐个上传
    
    - 分片大小：建议 5MB
    - 上传完所有分片后，调用合并接口
    """
    result = await upload_service.upload_chunk(
        chunk,
        chunk_index,
        total_chunks,
        file_id,
        str(current_user.id)
    )
    
    return ApiResponse(
        code=200,
        data=result,
        msg=f"分片 {chunk_index}/{total_chunks} 上传成功",
        errMsg=None
    )


@router.post(
    "/merge",
    response_model=ApiResponse[dict],
    summary="合并文件分片",
    description="合并所有上传的文件分片"
)
async def merge_chunks(
    file_id: str = Form(..., description="文件唯一标识"),
    total_chunks: int = Form(..., description="总分片数"),
    original_filename: str = Form(..., description="原始文件名"),
    content_type: str = Form(..., description="文件类型"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    合并文件分片
    
    将所有上传的分片合并为完整文件
    """
    url = await upload_service.merge_chunks(
        file_id,
        total_chunks,
        original_filename,
        str(current_user.id),
        content_type
    )
    
    return ApiResponse(
        code=200,
        data={"url": url},
        msg="文件合并成功",
        errMsg=None
    )

