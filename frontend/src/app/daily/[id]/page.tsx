'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Spin, message, Avatar, Tag, Divider } from 'antd';
import { 
  ArrowLeftOutlined, 
  HeartOutlined, 
  HeartFilled,
  MessageOutlined,
  EyeOutlined,
  StarOutlined,
  StarFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { getContent, toggleLike, toggleSave } from '@/lib/api/content';
import type { ContentDetail } from '@/lib/api/content';
import { formatDate } from '@/lib/utils/date';
import styles from './page.module.css';

export default function DailyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [saving, setSaving] = useState(false);

  const contentId = params.id as string;

  useEffect(() => {
    loadContent();
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getContent(contentId);
      setContent(data);
    } catch (error: any) {
      console.error('加载失败:', error);
      message.error(error.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      return;
    }

    try {
      setLiking(true);
      const result = await toggleLike(contentId);
      setContent(prev => prev ? {
        ...prev,
        is_liked: result.is_liked,
        like_count: result.like_count,
      } : null);
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLiking(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      return;
    }

    try {
      setSaving(true);
      const result = await toggleSave(contentId);
      setContent(prev => prev ? {
        ...prev,
        is_saved: result.is_saved,
        save_count: result.save_count,
      } : null);
      message.success(result.is_saved ? '已收藏' : '已取消收藏');
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
        <div style={{ marginTop: 16, color: 'var(--text-secondary)' }}>加载中...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.loading}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
        <div style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>内容不存在</div>
        <Button type="primary" onClick={() => router.push('/daily')}>
          返回列表
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: 24 }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            返回
          </Button>
        </motion.div>

        {/* 内容区域 */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 标题 */}
          <h1 className={styles.title}>{content.title}</h1>

          {/* 元信息 */}
          <div className={styles.meta}>
            <div className={styles.author}>
              {content.user ? (
                <>
                  <Avatar style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  }}>
                    {content.user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <span>{content.user.username}</span>
                </>
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </div>
            <div className={styles.info}>
              <span>
                <CalendarOutlined /> {formatDate(content.created_at)}
              </span>
              <span>
                <EyeOutlined /> {content.view_count} 浏览
              </span>
            </div>
          </div>

          {/* 位置 */}
          {content.location && (
            <div className={styles.location}>
              <EnvironmentOutlined />
              <span>{content.location}</span>
            </div>
          )}

          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <div className={styles.tags}>
              {content.tags.map(tag => (
                <Tag key={tag} color="blue">#{tag}</Tag>
              ))}
            </div>
          )}

          <Divider />

          {/* 图片 */}
          {content.images && content.images.length > 0 && (
            <div className={styles.images}>
              {content.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${content.title} - ${index + 1}`}
                  className={styles.image}
                />
              ))}
            </div>
          )}

          {/* 视频 */}
          {content.videos && content.videos.length > 0 && (
            <div className={styles.videos}>
              {content.videos.map((video, index) => (
                <video
                  key={index}
                  src={video}
                  controls
                  className={styles.video}
                  poster={content.video_thumbnails?.[index]}
                />
              ))}
            </div>
          )}

          {/* 正文 */}
          <div className={styles.body}>
            {content.content}
          </div>

          <Divider />

          {/* 操作栏 */}
          <div className={styles.actions}>
            <Button
              type={content.is_liked ? 'primary' : 'default'}
              icon={content.is_liked ? <HeartFilled /> : <HeartOutlined />}
              loading={liking}
              onClick={handleLike}
            >
              {content.is_liked ? '已点赞' : '点赞'} ({content.like_count})
            </Button>
            <Button
              type={content.is_saved ? 'primary' : 'default'}
              icon={content.is_saved ? <StarFilled /> : <StarOutlined />}
              loading={saving}
              onClick={handleSave}
            >
              {content.is_saved ? '已收藏' : '收藏'} ({content.save_count})
            </Button>
            <Button icon={<MessageOutlined />}>
              评论 ({content.comment_count})
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
