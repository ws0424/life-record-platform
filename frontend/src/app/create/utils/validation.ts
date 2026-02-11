/**
 * 表单验证工具函数
 */

import type { FormData } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * 验证表单数据
 */
export function validateFormData(formData: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // 验证标题
  if (!formData.title.trim()) {
    errors.push({ field: 'title', message: '请输入标题' });
  }

  // 验证内容
  if (!formData.content.trim()) {
    errors.push({ field: 'content', message: '请输入内容' });
  }

  // 旅游路线需要位置
  if (formData.type === 'travel' && !formData.location?.trim()) {
    errors.push({ field: 'location', message: '旅游路线需要填写位置' });
  }

  return errors;
}

