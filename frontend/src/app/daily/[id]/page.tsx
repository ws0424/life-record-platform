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
import { getContent, toggleLike, toggleSave, createComment, getComments, toggleCommentLike } from '@/lib/api/content';
import type { ContentDetail, Comment } from '@/lib/api/content';
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
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const contentId = params.id as string;

  useEffect(() => {
    loadContent();
    loadComments(); // 自动加载评论
  }, [contentId]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await getContent(contentId);
      console.log('Daily detail 接口返回:', response);
      
      // 检查返回数据格式
      let data;
      if (response && response.data) {
        // 新格式：{code, data: {...}}
        data = response.data;
      } else {
        // 旧格式：直接是数据
        data = response;
      }
      
      console.log('Content data:', data);
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
      const response = await toggleLike(contentId);
      const result = response.data || response;
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
      const response = await toggleSave(contentId);
      const result = response.data || response;
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

  const loadComments = async (page: number = 1) => {
    try {
      setLoadingComments(true);
      const response = await getComments(contentId, { page, page_size: 10 });
      const data = response.data || response;
      
      if (page === 1) {
        setComments(data.items || []);
      } else {
        setComments(prev => [...prev, ...(data.items || [])]);
      }
      
      setCommentsPage(page);
      setHasMoreComments(page < (data.total_pages || 0));
    } catch (error: any) {
      console.error('加载评论失败:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSubmitComment = async () => {
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
      setSubmittingComment(true);
      const response = await createComment(contentId, { comment_text: commentText.trim() });
      const newComment = response.data || response;
      
      message.success('评论成功');
      setCommentText('');
      
      // 将新评论添加到列表顶部
      setComments(prev => [newComment, ...prev]);
      
      // 更新评论数
      setContent(prev => prev ? {
        ...prev,
        comment_count: prev.comment_count + 1,
      } : null);
    } catch (error: any) {
      message.error(error.message || '评论失败');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=' + encodeURIComponent(`/daily/${contentId}`));
      return;
    }

    if (!replyText.trim()) {
      message.warning('请输入回复内容');
      return;
    }

    try {
      const response = await createComment(contentId, { 
        comment_text: replyText.trim(),
        parent_id: parentId 
      });
      const newReply = response.data || response;
      
      message.success('回复成功');
      setReplyText('');
      setReplyingTo(null);
      
      // 更新评论列表，将回复添加到对应评论的 replies 中
      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
            reply_count: (comment.reply_count || 0) + 1
          };
        }
        return comment;
      }));
      
      // 更新评论数
      setContent(prev => prev ? {
        ...prev,
        comment_count: prev.comment_count + 1,
      } : null);
    } catch (error: any) {
      message.error(error.message || '回复失败');
    }
  };

  const handleCommentLike = async (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      return;
    }

    try {
      const response = await toggleCommentLike(commentId);
      const result = response.data || response;
      
      // 更新评论或回复的点赞状态
      setComments(prev => prev.map(comment => {
        if (isReply && comment.id === parentId) {
          // 更新回复的点赞状态
          return {
            ...comment,
            replies: comment.replies?.map(reply =>
              reply.id === commentId
                ? { ...reply, is_liked: result.is_liked, like_count: result.like_count }
                : reply
            )
          };
        } else if (comment.id === commentId) {
          // 更新评论的点赞状态
          return { ...comment, is_liked: result.is_liked, like_count: result.like_count };
        }
        return comment;
      }));
    } catch (error: any) {
      message.error(error.message || '操作失败');
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
          </div>

          <Divider>评论 ({content.comment_count})</Divider>

          {/* 评论输入框 */}
          <div style={{ marginBottom: 24 }}>
            <textarea
              placeholder="写下你的评论..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid var(--border-primary)',
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                fontSize: 14,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                loading={submittingComment}
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                发表评论
              </Button>
            </div>
          </div>

          {/* 评论列表 */}
          {loadingComments && comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin />
            </div>
          ) : comments.length === 0 ? (
            <div style={{ 
              padding: 40, 
              background: 'var(--bg-elevated)', 
              borderRadius: 12,
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <MessageOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }} />
              <div>暂无评论，快来抢沙发吧~</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      padding: 16,
                      background: 'var(--bg-elevated)',
                      borderRadius: 12,
                      border: '1px solid var(--border-primary)',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Avatar style={{
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      }}>
                        {comment.user?.username.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: 8 
                        }}>
                          <div>
                            <span style={{ 
                              fontWeight: 600, 
                              color: 'var(--text-primary)',
                              marginRight: 12 
                            }}>
                              {comment.user?.username || '未知用户'}
                            </span>
                            <span style={{ 
                              fontSize: 13, 
                              color: 'var(--text-tertiary)' 
                            }}>
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                        <div style={{ 
                          color: 'var(--text-primary)', 
                          lineHeight: 1.6,
                          marginBottom: 12 
                        }}>
                          {comment.comment_text}
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                          <Button
                            type="text"
                            size="small"
                            icon={comment.is_liked ? <HeartFilled /> : <HeartOutlined />}
                            onClick={() => handleCommentLike(comment.id)}
                            style={{ 
                              color: comment.is_liked ? 'var(--color-primary)' : 'var(--text-secondary)' 
                            }}
                          >
                            {comment.like_count || 0}
                          </Button>
                          <Button
                            type="text"
                            size="small"
                            icon={<MessageOutlined />}
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            回复 {comment.reply_count ? `(${comment.reply_count})` : ''}
                          </Button>
                        </div>

                        {/* 回复输入框 */}
                        {replyingTo === comment.id && (
                          <div style={{ marginTop: 12, marginBottom: 12 }}>
                            <textarea
                              placeholder={`回复 @${comment.user?.username || '用户'}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={3}
                              style={{
                                width: '100%',
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid var(--border-primary)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: 14,
                                resize: 'vertical',
                                fontFamily: 'inherit',
                              }}
                            />
                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                              <Button size="small" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                                取消
                              </Button>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyText.trim()}
                              >
                                发送
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* 回复列表 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div style={{ 
                            marginTop: 12, 
                            paddingLeft: 16, 
                            borderLeft: '2px solid var(--border-secondary)' 
                          }}>
                            {comment.replies.map((reply) => (
                              <div key={reply.id} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                  <Avatar size="small" style={{
                                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                  }}>
                                    {reply.user?.username.charAt(0).toUpperCase() || 'U'}
                                  </Avatar>
                                  <div style={{ flex: 1 }}>
                                    <div>
                                      <span style={{ 
                                        fontWeight: 600, 
                                        fontSize: 13,
                                        color: 'var(--text-primary)',
                                        marginRight: 8 
                                      }}>
                                        {reply.user?.username || '未知用户'}
                                      </span>
                                      <span style={{ 
                                        fontSize: 12, 
                                        color: 'var(--text-tertiary)' 
                                      }}>
                                        {formatDate(reply.created_at)}
                                      </span>
                                    </div>
                                    <div style={{ 
                                      color: 'var(--text-primary)', 
                                      fontSize: 14,
                                      lineHeight: 1.6,
                                      marginTop: 4,
                                      marginBottom: 8
                                    }}>
                                      {reply.comment_text}
                                    </div>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                      <Button
                                        type="text"
                                        size="small"
                                        icon={reply.is_liked ? <HeartFilled /> : <HeartOutlined />}
                                        onClick={() => handleCommentLike(reply.id, true, comment.id)}
                                        style={{ 
                                          color: reply.is_liked ? 'var(--color-primary)' : 'var(--text-secondary)',
                                          fontSize: 12,
                                          padding: '0 4px'
                                        }}
                                      >
                                        {reply.like_count || 0}
                                      </Button>
                                      <Button
                                        type="text"
                                        size="small"
                                        icon={<MessageOutlined />}
                                        onClick={() => setReplyingTo(comment.id)}
                                        style={{ 
                                          color: 'var(--text-secondary)',
                                          fontSize: 12,
                                          padding: '0 4px'
                                        }}
                                      >
                                        回复
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 加载更多 */}
              {hasMoreComments && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Button
                    loading={loadingComments}
                    onClick={() => loadComments(commentsPage + 1)}
                  >
                    加载更多评论
                  </Button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
