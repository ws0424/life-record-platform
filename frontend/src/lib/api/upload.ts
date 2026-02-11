import apiClient from './client';

/**
 * 上传单张图片
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}

/**
 * 批量上传图片
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.urls;
}

/**
 * 上传视频
 */
export async function uploadVideo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}

/**
 * 上传文件分片
 */
export async function uploadChunk(
  chunk: Blob,
  chunkIndex: number,
  totalChunks: number,
  fileId: string
): Promise<void> {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('chunk_index', chunkIndex.toString());
  formData.append('total_chunks', totalChunks.toString());
  formData.append('file_id', fileId);

  await apiClient.post('/upload/chunk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 合并文件分片
 */
export async function mergeChunks(
  fileId: string,
  totalChunks: number,
  originalFilename: string,
  contentType: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file_id', fileId);
  formData.append('total_chunks', totalChunks.toString());
  formData.append('original_filename', originalFilename);
  formData.append('content_type', contentType);

  const response = await apiClient.post('/upload/merge', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
}

/**
 * 大文件分片上传（带进度回调）
 */
export async function uploadLargeFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 上传所有分片
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, i, totalChunks, fileId);

    // 更新进度
    if (onProgress) {
      const progress = Math.round(((i + 1) / totalChunks) * 100);
      onProgress(progress);
    }
  }

  // 合并分片
  const url = await mergeChunks(fileId, totalChunks, file.name, file.type);

  return url;
}
