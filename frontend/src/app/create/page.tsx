'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { TypeSelector } from './components/TypeSelector';
import { ImageUpload } from './components/ImageUpload';
import { TagInput } from './components/TagInput';
import { CONTENT_TYPES, MAX_IMAGES, MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH } from './constants';
import { validateImageFile, generateImagePreviews } from './utils/imageUtils';
import { validateFormData } from './utils/validation';
import type { FormData, ContentType } from './types';
import styles from './page.module.css';

export default function CreatePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { toasts, removeToast, success, error, warning } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    type: 'daily',
    title: '',
    content: '',
    tags: [],
    images: [],
    location: '',
    isPublic: true,
  });
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  // 类型改变处理
  const handleTypeChange = useCallback((type: ContentType) => {
    setFormData((prev) => ({ ...prev, type }));
  }, []);

  // 图片上传处理
  const handleImageUpload = useCallback(async (files: File[]) => {
    // 检查数量限制
    if (files.length + formData.images.length > MAX_IMAGES) {
      error(`最多只能上传${MAX_IMAGES}张图片`);
      return;
    }

    // 验证每个文件
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        error(validation.error || '图片验证失败');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      // 生成预览
      const newPreviews = await generateImagePreviews(validFiles);
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
      
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    } catch (err) {
      error('生成图片预览失败');
      console.error('Generate preview error:', err);
    }
  }, [formData.images.length, error]);

  // 删除图片处理
  const handleRemoveImage = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 添加标签处理
  const handleAddTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  }, []);

  // 删除标签处理
  const handleRemoveTag = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  // 表单提交处理
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // 检查登录状态
    if (!isAuthenticated) {
      warning('请先登录后再发布内容');
      setTimeout(() => {
        const currentPath = window.location.pathname;
        const redirectUrl = encodeURIComponent(currentPath);
        router.push(`/login?redirect=${redirectUrl}`);
      }, 1500);
      return;
    }

    // 验证表单
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      error(errors[0].message);
      return;
    }

    setIsLoading(true);

    try {
      // 调用 API 创建内容
      const { createContent } = await import('@/lib/api/content');
      
      await createContent({
        type: formData.type,
        title: formData.title,
        content: formData.content,
        tags: formData.tags,
        images: formData.images.map((file) => URL.createObjectURL(file)), // TODO: 上传图片到服务器
        location: formData.location,
        is_public: formData.isPublic,
      });
      
      success('创建成功！');
      
      // 跳转到对应的列表页
      setTimeout(() => {
        router.push(`/${formData.type}`);
      }, 1000);
    } catch (err: any) {
      console.error('Create content error:', err);
      error(err.message || '创建失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, success, error, warning, isAuthenticated]);

  // 计算字符数
  const titleCharCount = useMemo(() => formData.title.length, [formData.title]);
  const contentCharCount = useMemo(() => formData.content.length, [formData.content]);

  return (
    <div className={styles.page}>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>创建内容</h1>
          <p className={styles.subtitle}>
            {isAuthenticated ? '分享你的精彩生活' : '预览创建页面（登录后可发布）'}
          </p>
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* 未登录提示 */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.loginWarning}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className={styles.loginWarningText}>
                <strong>提示：</strong>您当前未登录，可以预览页面功能，但需要登录后才能发布内容。
              </div>
              <button
                onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                className={styles.loginWarningBtn}
              >
                去登录
              </button>
            </motion.div>
          )}
          {/* 内容类型选择 */}
          <TypeSelector
            selectedType={formData.type}
            types={CONTENT_TYPES}
            onChange={handleTypeChange}
          />

          {/* 表单 */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 标题 */}
            <div className={styles.formGroup}>
              <label htmlFor="title-input" className={styles.label}>
                标题 <span className={styles.required}>*</span>
              </label>
              <input
                id="title-input"
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="给你的内容起个标题..."
                maxLength={MAX_TITLE_LENGTH}
                required
              />
              <span className={styles.charCount}>
                {titleCharCount}/{MAX_TITLE_LENGTH}
              </span>
            </div>

            {/* 内容 */}
            <div className={styles.formGroup}>
              <label htmlFor="content-input" className={styles.label}>
                内容 <span className={styles.required}>*</span>
              </label>
              <textarea
                id="content-input"
                className={styles.textarea}
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="分享你的故事..."
                rows={10}
                maxLength={MAX_CONTENT_LENGTH}
                required
              />
              <span className={styles.charCount}>
                {contentCharCount}/{MAX_CONTENT_LENGTH}
              </span>
            </div>

            {/* 图片上传 */}
            <ImageUpload
              previews={previewImages}
              maxCount={MAX_IMAGES}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />

            {/* 位置（旅游路线专用） */}
            {formData.type === 'travel' && (
              <div className={styles.formGroup}>
                <label htmlFor="location-input" className={styles.label}>
                  位置 <span className={styles.required}>*</span>
                </label>
                <input
                  id="location-input"
                  type="text"
                  className={styles.input}
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="例如：北京·故宫"
                  required
                />
              </div>
            )}

            {/* 标签 */}
            <TagInput
              tags={formData.tags}
              onAdd={handleAddTag}
              onRemove={handleRemoveTag}
            />

            {/* 可见性 */}
            <div className={styles.formGroup}>
              <label htmlFor="public-checkbox" className={styles.checkboxLabel}>
                <input
                  id="public-checkbox"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
                />
                <span>公开发布（其他人可以看到）</span>
              </label>
            </div>

            {/* 提交按钮 */}
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.back()}
                disabled={isLoading}
              >
                取消
              </button>
              <button 
                type="submit" 
                className={styles.submitBtn} 
                disabled={isLoading}
                title={!isAuthenticated ? '请先登录' : ''}
              >
                {isLoading ? '发布中...' : isAuthenticated ? '发布' : '登录后发布'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
