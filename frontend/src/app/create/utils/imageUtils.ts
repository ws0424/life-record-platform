/**
 * 图片上传相关工具函数
 */

import { MAX_IMAGE_SIZE } from '../constants';

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '只能上传图片文件' };
  }

  // 检查文件大小
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `图片大小不能超过 ${MAX_IMAGE_SIZE / 1024 / 1024}MB` };
  }

  return { valid: true };
}

/**
 * 生成图片预览
 */
export function generateImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    
    reader.onerror = () => {
      reject(new Error('读取图片失败'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * 批量生成图片预览
 */
export async function generateImagePreviews(files: File[]): Promise<string[]> {
  const previews = await Promise.all(
    files.map((file) => generateImagePreview(file))
  );
  return previews;
}

