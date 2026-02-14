import apiClient from './client';

export interface UploadResponse {
  url: string;
  thumbnail_url?: string;
  file_size: number;
  width?: number;
  height?: number;
  duration?: number;
}

// 上传图片
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// 上传视频
export const uploadVideo = async (file: File, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/media/upload', formData, {
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

  return response.data.data;
};

// 分片上传（大文件）
export const uploadChunk = async (
  file: File,
  chunkIndex: number,
  totalChunks: number,
  fileId: string
): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('chunk_index', chunkIndex.toString());
  formData.append('total_chunks', totalChunks.toString());
  formData.append('file_id', fileId);

  const response = await apiClient.post('/media/upload/chunk', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

// 删除媒体文件
export const deleteMedia = async (id: string) => {
  const response = await apiClient.delete(`/media/${id}`);
  return response.data.data;
};

