'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useToast } from '@/lib/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import styles from './page.module.css';

type ContentType = 'daily' | 'album' | 'travel';

interface FormData {
  type: ContentType;
  title: string;
  content: string;
  tags: string[];
  images: File[];
  location?: string;
  isPublic: boolean;
}

function CreateContent() {
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();
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
  const [tagInput, setTagInput] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const contentTypes = [
    { id: 'daily', label: '日常记录', icon: '📝', description: '记录生活点滴' },
    { id: 'album', label: '相册', icon: '📷', description: '分享精彩照片' },
    { id: 'travel', label: '旅游路线', icon: '🗺️', description: '分享旅行攻略' },
  ];

  const handleTypeChange = (type: ContentType) => {
    setFormData({ ...formData, type });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 9) {
      error('最多只能上传9张图片');
      return;
    }

    setFormData({ ...formData, images: [...formData.images, ...files] });

    // 生成预览
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      error('请输入标题');
      return;
    }

    if (!formData.content.trim()) {
      error('请输入内容');
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
  };

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
          <p className={styles.subtitle}>分享你的精彩生活</p>
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* 内容类型选择 */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>选择类型</h2>
            <div className={styles.typeGrid}>
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  className={`${styles.typeCard} ${
                    formData.type === type.id ? styles.active : ''
                  }`}
                  onClick={() => handleTypeChange(type.id as ContentType)}
                >
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <span className={styles.typeLabel}>{type.label}</span>
                  <span className={styles.typeDescription}>{type.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* 标题 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                标题 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                className={styles.input}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="给你的内容起个标题..."
                maxLength={100}
              />
              <span className={styles.charCount}>{formData.title.length}/100</span>
            </div>

            {/* 内容 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                内容 <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="分享你的故事..."
                rows={10}
                maxLength={5000}
              />
              <span className={styles.charCount}>{formData.content.length}/5000</span>
            </div>

            {/* 图片上传 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>图片（最多9张）</label>
              <div className={styles.imageUpload}>
                {previewImages.map((preview, index) => (
                  <div key={index} className={styles.imagePreview}>
                    <img src={preview} alt={`预览 ${index + 1}`} />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {formData.images.length < 9 && (
                  <label className={styles.uploadBtn}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    <span>上传图片</span>
                  </label>
                )}
              </div>
            </div>

            {/* 位置（旅游路线专用） */}
            {formData.type === 'travel' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>位置</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="例如：北京·故宫"
                />
              </div>
            )}

            {/* 标签 */}
            <div className={styles.formGroup}>
              <label className={styles.label}>标签</label>
              <div className={styles.tagInput}>
                <input
                  type="text"
                  className={styles.input}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="输入标签后按回车添加"
                />
                <button type="button" className={styles.addTagBtn} onClick={handleAddTag}>
                  添加
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className={styles.tagList}>
                  {formData.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 可见性 */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
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
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? '发布中...' : '发布'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreateContent />
    </ProtectedRoute>
  );
}
