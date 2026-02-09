import { useState, useCallback } from 'react';
import * as mediaApi from '../api/media';

interface UploadProgress {
  [key: string]: number;
}

export const useUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({});
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      const result = await mediaApi.uploadImage(file);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '上传失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadVideo = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      
      const result = await mediaApi.uploadVideo(file, (progressValue) => {
        setProgress(prev => ({ ...prev, [file.name]: progressValue }));
      });
      
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '上传失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
      setProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[file.name];
        return newProgress;
      });
    }
  }, []);

  const uploadMultiple = useCallback(async (files: File[]) => {
    try {
      setIsUploading(true);
      setError(null);
      
      const results = await Promise.all(
        files.map(file => {
          if (file.type.startsWith('image/')) {
            return uploadImage(file);
          } else if (file.type.startsWith('video/')) {
            return uploadVideo(file);
          }
          throw new Error('不支持的文件类型');
        })
      );
      
      return results;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '批量上传失败';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [uploadImage, uploadVideo]);

  return {
    isUploading,
    progress,
    error,
    uploadImage,
    uploadVideo,
    uploadMultiple,
  };
};

