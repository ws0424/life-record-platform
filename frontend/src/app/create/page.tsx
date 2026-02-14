'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Form, Input, Button, Checkbox, Select, message } from 'antd';
import { useAuthStore } from '@/lib/store/authStore';
import { TypeSelector } from './components/TypeSelector';
import { ImageUpload } from './components/ImageUpload';
import VideoUpload from './components/VideoUpload';
import { TagSelector } from './components/TagSelector';
import { CONTENT_TYPES, MAX_IMAGES, MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH } from './constants';
import { validateImageFile, generateImagePreviews } from './utils/imageUtils';
import type { ContentType } from './types';
import styles from './page.module.css';

const { TextArea } = Input;

interface FormValues {
  type: ContentType;
  title: string;
  content: string;
  location?: string;
  isPublic: boolean;
}

export default function CreatePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [form] = Form.useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('daily');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [videoThumbnails, setVideoThumbnails] = useState<string[]>([]);

  // 类型改变处理
  const handleTypeChange = useCallback((type: ContentType) => {
    setContentType(type);
    form.setFieldValue('type', type);
  }, [form]);

  // 图片上传处理
  const handleImageUpload = useCallback(async (files: File[]) => {
    // 检查数量限制
    if (files.length + images.length > MAX_IMAGES) {
      message.error(`最多只能上传${MAX_IMAGES}张图片`);
      return;
    }

    // 验证每个文件
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        message.error(validation.error || '图片验证失败');
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      // 生成预览
      const newPreviews = await generateImagePreviews(validFiles);
      
      setImages((prev) => [...prev, ...validFiles]);
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    } catch (err) {
      message.error('生成图片预览失败');
      console.error('Generate preview error:', err);
    }
  }, [images.length]);

  // 删除图片处理
  const handleRemoveImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 添加标签处理
  const handleAddTag = useCallback((tag: string) => {
    setTags((prev) => [...prev, tag]);
  }, []);

  // 删除标签处理
  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  // 视频上传处理
  const handleVideoChange = useCallback((urls: string[]) => {
    setVideos(urls);
  }, []);

  // 视频封面处理
  const handleVideoThumbnailChange = useCallback((thumbnails: string[]) => {
    setVideoThumbnails(thumbnails);
  }, []);

  // 表单提交处理
  const handleSubmit = useCallback(async (values: FormValues) => {
    // 检查登录状态
    if (!isAuthenticated) {
      message.warning('请先登录后再发布内容');
      setTimeout(() => {
        const currentPath = window.location.pathname;
        const redirectUrl = encodeURIComponent(currentPath);
        router.push(`/login?redirect=${redirectUrl}`);
      }, 1500);
      return;
    }

    setIsLoading(true);

    try {
      // 1. 上传图片到 MinIO
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const { uploadImages } = await import('@/lib/api/upload');
        const uploadResult = await uploadImages(images);
        imageUrls = Array.isArray(uploadResult) ? uploadResult : [];
        if (imageUrls.length > 0) {
          message.success(`成功上传 ${imageUrls.length} 张图片`);
        }
      }
      
      // 2. 创建内容
      const { createContent } = await import('@/lib/api/content');
      
      const contentData = {
        type: contentType,
        title: values.title,
        content: values.content,
        tags: tags,
        images: imageUrls,
        videos: videos,
        video_thumbnails: videoThumbnails,
        location: values.location,
        is_public: values.isPublic,
      };
      
      console.log('📝 创建内容数据:', contentData);
      console.log('🎬 视频列表:', videos);
      console.log('🖼️  封面列表:', videoThumbnails);
      
      await createContent(contentData);
      
      message.success('创建成功！');
      
      // 跳转到对应的列表页（处理单复数映射）
      const routeMap: Record<ContentType, string> = {
        daily: '/daily',
        album: '/albums',
        travel: '/travel',
        mood: '/mood',
      };
      
      setTimeout(() => {
        router.push(routeMap[contentType] || '/');
      }, 1000);
    } catch (err: any) {
      console.error('Create content error:', err);
      message.error(err.message || '创建失败，请重试');
    } finally {
      setIsLoading(false);
    }
  }, [contentType, tags, images, videos, videoThumbnails, router, isAuthenticated]);

  return (
    <div className={styles.page}>
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
              <Button
                type="primary"
                size="small"
                onClick={() => router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))}
              >
                去登录
              </Button>
            </motion.div>
          )}

          {/* 内容类型选择 */}
          <TypeSelector
            selectedType={contentType}
            types={CONTENT_TYPES}
            onChange={handleTypeChange}
          />

          {/* 表单 */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: 'daily',
              isPublic: true,
            }}
            autoComplete="off"
          >
            {/* 标题 */}
            <Form.Item
              label="标题"
              name="title"
              rules={[
                { required: true, message: '请输入标题' },
                { max: MAX_TITLE_LENGTH, message: `标题不能超过${MAX_TITLE_LENGTH}个字符` },
              ]}
            >
              <Input
                placeholder="给你的内容起个标题..."
                maxLength={MAX_TITLE_LENGTH}
                showCount
                size="large"
              />
            </Form.Item>

            {/* 内容 */}
            <Form.Item
              label="内容"
              name="content"
              rules={[
                { required: true, message: '请输入内容' },
                { max: MAX_CONTENT_LENGTH, message: `内容不能超过${MAX_CONTENT_LENGTH}个字符` },
              ]}
            >
              <TextArea
                placeholder="分享你的故事..."
                rows={10}
                maxLength={MAX_CONTENT_LENGTH}
                showCount
              />
            </Form.Item>

            {/* 图片上传 */}
            <ImageUpload
              previews={previewImages}
              maxCount={MAX_IMAGES}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />

            {/* 视频上传 */}
            <Form.Item label="视频">
              <VideoUpload
                value={videos}
                onChange={handleVideoChange}
                onThumbnailChange={handleVideoThumbnailChange}
                maxCount={5}
                maxSize={500}
              />
            </Form.Item>

            {/* 位置（旅游路线专用） */}
            {contentType === 'travel' && (
              <Form.Item
                label="位置"
                name="location"
                rules={[{ required: true, message: '请输入位置' }]}
              >
                <Input
                  placeholder="例如：北京·故宫"
                  size="large"
                />
              </Form.Item>
            )}

            {/* 标签 */}
            <TagSelector
              tags={tags}
              onAdd={handleAddTag}
              onRemove={handleRemoveTag}
              maxCount={10}
            />

            {/* 可见性 */}
            <Form.Item name="isPublic" valuePropName="checked">
              <Checkbox>公开发布（其他人可以看到）</Checkbox>
            </Form.Item>

            {/* 提交按钮 */}
            <Form.Item>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <Button
                  size="large"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  disabled={!isAuthenticated}
                >
                  {isAuthenticated ? '发布' : '登录后发布'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
