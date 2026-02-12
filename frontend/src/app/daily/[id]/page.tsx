'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Spin, message, Avatar, Button, Input, Empty } from 'antd';
import { HeartOutlined, HeartFilled, StarOutlined, StarFilled, ShareAltOutlined, EyeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { getContent, toggleLike, toggleSave, createComment, getComments } from '@/lib/api/content';
import type { Content, Comment as CommentType } from '@/lib/api/content';
import { formatDate } from '@/lib/utils/date';
import { ContentCover } from '@/components/ContentCover';
import styles from './page.module.css';

const { TextArea } = Input;

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const contentId = params.id as string;
  
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 获取内容详情
  useEffect(() => {
    fetchContent();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await getContent(contentId);
      setContent(response);
    } catch (error: any) {
      console.error('获取内容失败:', error);
      message.error(error.message || '获取内容失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await getComments(contentId, { page: 1, page_size: 50 });
      setComments(response.items);
    } catch (error: any) {
      console.error('获取评论失败:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=' + encodeURIComponent(`/daily/${contentId}`));
      return;
    }

    try {
      const response = await toggleLike(contentId);
      setContent(prev => prev ? {
        ...prev,
        is_liked: response.is_liked,
        like_count: response.like_count,
      } : null);
      message.success(response.is_liked ? '点赞成功' : '取消点赞');
    } catch (error: any) {
      console.error('点赞失败:', error);
      message.error(error.message || '操作失败');
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=' + encodeURIComponent(`/daily/${contentId}`));
      return;
    }

    try {
      const response = await toggleSave(contentId);
      setContent(prev => prev ? {
        ...prev,
        is_saved: response.is_saved,
        save_count: response.save_count,
      } : null);
      message.success(response.is_saved ? '收藏成功' : '取消收藏');
    } catch (error: any) {
      console.error('收藏失败:', error);
      message.error(error.message || '操作失败');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: content?.title,
        text: content?.description,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      message.success('链接已复制到剪贴板');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=' + encodeURIComponent(`/daily/${contentId}`));
      return;
    }

    if (!commentText.trim()) {
      message.warning('请输入评论内容');
      return;
    }

    try {
      setSubmitting(true);
      await createComment(contentId, { comment_text: commentText });
      message.success('评论成功');
      setCommentText('');
      fetchComments();
      // 更新评论数
      setContent(prev => prev ? {
        ...prev,
        comment_count: prev.comment_count + 1,
      } : null);
    } catch (error: any) {
      console.error('评论失败:', error);
      message.error(error.message || '评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <Empty description="内容不存在" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.article
          className={styles.article}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 返回按钮 */}
          <button className={styles.backBtn} onClick={() => router.back()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            返回
          </button>

          {/* 文章头部 */}
          <header className={styles.header}>
            <h1 className={styles.title}>{content.title}</h1>
            
            <div className={styles.meta}>
              <div className={styles.author}>
                <Avatar 
                  size="large" 
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                  }}
                >
                  {content.user?.username.charAt(0).toUpperCase()}
                </Avatar>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{content.user?.username || '匿名用户'}</span>
                  <span className={styles.date}>{formatDate(content.created_at)}</span>
                </div>
              </div>

              <div className={styles.stats}>
                <span>
                  <EyeOutlined />
                  {content.view_count} 浏览
                </span>
                <span>
                  <MessageOutlined />
                  {content.comment_count} 评论
                </span>
              </div>
            </div>
          </header>

          {/* 媒体展示 */}
          {(content.images.length > 0 || content.videos.length > 0) && (
            <div className={styles.mediaWrapper}>
              <ContentCover
                images={content.images}
                videos={content.videos}
                videoThumbnails={content.video_thumbnails}
                title={content.title}
                height={400}
              />
            </div>
          )}

          {/* 文章内容 */}
          <div className={styles.content}>
            {content.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <div className={styles.tags}>
              {content.tags.map((tag) => (
                <Link key={tag} href={`/explore?tag=${tag}`} className={styles.tag}>
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className={styles.actions}>
            <Button
              type={content.is_liked ? 'primary' : 'default'}
              icon={content.is_liked ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleLike}
              size="large"
            >
              {content.like_count}
            </Button>

            <Button
              type={content.is_saved ? 'primary' : 'default'}
              icon={content.is_saved ? <StarFilled /> : <StarOutlined />}
              onClick={handleSave}
              size="large"
            >
              {content.is_saved ? '已收藏' : '收藏'}
            </Button>

            <Button
              icon={<ShareAltOutlined />}
              onClick={handleShare}
              size="large"
            >
              分享
            </Button>
          </div>
        </motion.article>

        {/* 评论区 */}
        <motion.section
          className={styles.commentsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.commentsTitle}>评论 ({content.comment_count})</h2>

          {/* 评论表单 */}
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <TextArea
              placeholder="写下你的评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              maxLength={500}
              showCount
            />
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={submitting}
              disabled={!commentText.trim()}
              style={{ marginTop: 12 }}
            >
              发表评论
            </Button>
          </form>

          {/* 评论列表 */}
          {commentsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin tip="加载评论中..." />
            </div>
          ) : comments.length === 0 ? (
            <Empty description="暂无评论" style={{ padding: '40px 0' }} />
          ) : (
            <div className={styles.commentsList}>
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className={styles.commentItem}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Avatar 
                    icon={<UserOutlined />}
                    style={{
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    }}
                  >
                    {comment.user?.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <div className={styles.commentContent}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>{comment.user?.username || '匿名用户'}</span>
                      <span className={styles.commentDate}>{formatDate(comment.created_at)}</span>
                    </div>
                    <p className={styles.commentText}>{comment.comment_text}</p>
                    
                    {/* 回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className={styles.replies}>
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className={styles.replyItem}>
                            <Avatar 
                              size="small"
                              icon={<UserOutlined />}
                              style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              }}
                            >
                              {reply.user?.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className={styles.replyContent}>
                              <span className={styles.replyAuthor}>{reply.user?.username || '匿名用户'}</span>
                              <span className={styles.replyText}>{reply.comment_text}</span>
                              <span className={styles.replyDate}>{formatDate(reply.created_at)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}

