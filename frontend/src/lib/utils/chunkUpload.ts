/**
 * 大文件切片上传工具
 */

import axios from 'axios';

// 切片大小：5MB
const CHUNK_SIZE = 5 * 1024 * 1024;

export interface ChunkUploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
  onChunkProgress?: (chunkIndex: number, total: number) => void;
  chunkSize?: number;
}

export interface ChunkUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * 计算文件 MD5（用于断点续传）
 */
async function calculateFileMD5(file: File): Promise<string> {
  // 简化版：使用文件名、大小、修改时间生成唯一标识
  const identifier = `${file.name}-${file.size}-${file.lastModified}`;
  return btoa(identifier).replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * 切片上传文件
 */
export async function uploadFileInChunks(
  options: ChunkUploadOptions
): Promise<ChunkUploadResult> {
  const { file, onProgress, onChunkProgress, chunkSize = CHUNK_SIZE } = options;

  // 计算文件唯一标识
  const fileIdentifier = await calculateFileMD5(file);
  
  // 计算切片数量
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  // 如果文件小于切片大小，直接上传
  if (totalChunks === 1) {
    return uploadSingleFile(file, onProgress);
  }

  // 上传所有切片
  const chunkPromises: Promise<void>[] = [];
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const promise = uploadChunk({
      chunk,
      chunkIndex,
      totalChunks,
      fileIdentifier,
      filename: file.name,
      onProgress: (progress) => {
        if (onChunkProgress) {
          onChunkProgress(chunkIndex, totalChunks);
        }
        if (onProgress) {
          const totalProgress = ((chunkIndex + progress) / totalChunks) * 100;
          onProgress(Math.round(totalProgress));
        }
      },
    });
    
    chunkPromises.push(promise);
  }

  // 等待所有切片上传完成
  await Promise.all(chunkPromises);

  // 合并切片
  const result = await mergeChunks({
    fileIdentifier,
    filename: file.name,
    totalChunks,
    fileSize: file.size,
    mimeType: file.type,
  });

  if (onProgress) {
    onProgress(100);
  }

  return result;
}

/**
 * 上传单个文件（小文件）
 */
async function uploadSingleFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<ChunkUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/v1/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
}

/**
 * 上传单个切片
 */
async function uploadChunk(options: {
  chunk: Blob;
  chunkIndex: number;
  totalChunks: number;
  fileIdentifier: string;
  filename: string;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  const { chunk, chunkIndex, totalChunks, fileIdentifier, filename, onProgress } = options;

  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunkIndex', chunkIndex.toString());
  formData.append('totalChunks', totalChunks.toString());
  formData.append('fileIdentifier', fileIdentifier);
  formData.append('filename', filename);

  await axios.post('/api/v1/upload/chunk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = progressEvent.loaded / progressEvent.total;
        onProgress(progress);
      }
    },
  });
}

/**
 * 合并切片
 */
async function mergeChunks(options: {
  fileIdentifier: string;
  filename: string;
  totalChunks: number;
  fileSize: number;
  mimeType: string;
}): Promise<ChunkUploadResult> {
  const response = await axios.post('/api/v1/upload/merge', options);
  return response.data;
}

/**
 * 检查文件是否已上传（断点续传）
 */
export async function checkFileExists(file: File): Promise<{
  exists: boolean;
  uploadedChunks?: number[];
  url?: string;
}> {
  const fileIdentifier = await calculateFileMD5(file);
  
  try {
    const response = await axios.get('/api/v1/upload/check', {
      params: {
        fileIdentifier,
        filename: file.name,
      },
    });
    return response.data;
  } catch (error) {
    return { exists: false };
  }
}

/**
 * 验证文件类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

