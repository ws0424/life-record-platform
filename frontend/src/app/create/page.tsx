'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';

type ContentType = 'post' | 'album' | 'travel' | 'daily';

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as ContentType;
  
  const [contentType, setContentType] = useState<ContentType>(typeParam || 'post');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    location: '',
    privacy: 'public',
  });
  const [isLoading, setIsLoading] = useState(false);

  const contentTypes = [
    {
      id: 'post' as ContentType,
      label: '日常记录',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ),
    },
    {
      id: 'album' as ContentType,
      label: '相册',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      id: 'travel' as ContentType,
      label: '旅游路线',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      id: 'daily' as ContentType,
      label: '每日心情',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: 实现创建逻辑
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

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
          <p className={styles.subtitle}>分享你的生活，记录美好时刻</p>
        </motion.div>

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.typeSelector}>
            <h2 className={styles.sectionTitle}>选择内容类型</h2>
            <div className={styles.typeGrid}>
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  className={`${styles.typeCard} ${contentType === type.id ? styles.typeCardActive : ''}`}
                  onClick={() => setContentType(type.id)}
                >
                  <div className={styles.typeIcon}>{type.icon}</div>
                  <span className={styles.typeLabel}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                标题 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={styles.input}
                placeholder="给你的内容起个标题"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="content" className={styles.label}>
                内容 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                className={styles.textarea}
                placeholder="写下你想分享的内容..."
                rows={8}
                required
              />
            </div>

            {contentType === 'travel' && (
              <div className={styles.formGroup}>
                <label htmlFor="location" className={styles.label}>
                  地点
                </label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={styles.inputWithIcon}
                    placeholder="添加地点"
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="tags" className={styles.label}>
                标签
              </label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={styles.inputWithIcon}
                  placeholder="用逗号分隔标签，如：旅行, 美食, 摄影"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="privacy" className={styles.label}>
                隐私设置
              </label>
              <select
                id="privacy"
                name="privacy"
                value={formData.privacy}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="public">公开 - 所有人可见</option>
                <option value="friends">好友 - 仅好友可见</option>
                <option value="private">私密 - 仅自己可见</option>
              </select>
            </div>

            <div className={styles.uploadSection}>
              <h3 className={styles.uploadTitle}>添加媒体</h3>
              <div className={styles.uploadGrid}>
                <button type="button" className={styles.uploadBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>上传图片</span>
                </button>
                <button type="button" className={styles.uploadBtn}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <span>上传视频</span>
                </button>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => router.back()}
              >
                取消
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className={styles.spinner} />
                ) : (
                  '发布'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

