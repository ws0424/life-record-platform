'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Empty, Spin, Button, Tag, Avatar, Tooltip } from 'antd';
import { PlusOutlined, EyeOutlined, HeartOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { getDailyList } from '@/lib/api/content';
import type { ContentListItem } from '@/lib/api/content';
import { formatDate } from '@/lib/utils/date';
import { ContentCover } from '@/components/ContentCover';
import styles from './page.module.css';

const { Meta } = Card;

export default function DailyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [contents, setContents] = useState<ContentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 12;

  // 用于检测滚动到底部的 ref
  const observerTarget = useRef<HTMLDivElement>(null);

  // 获取日常记录列表
  const fetchDailyList = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await getDailyList({
        page: pageNum,
        page_size: pageSize,
      });

      if (isLoadMore) {
        // 加载更多：追加到现有列表
        setContents(prev => [...prev, ...response.items]);
      } else {
        // 首次加载：替换列表
        setContents(response.items);
      }

      // 检查是否还有更多数据
      const totalPages = Math.ceil(response.total / pageSize);
      setHasMore(pageNum < totalPages);

    } catch (err: any) {
      console.error('获取日常记录失败:', err);
      setError(err.message || '获取日常记录失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // 首次加载
  useEffect(() => {
    fetchDailyList(1, false);
  }, [fetchDailyList]);

  // 使用 Intersection Observer 监听滚动到底部
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当目标元素进入视口且还有更多数据且不在加载中
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchDailyList(nextPage, true);
        }
      },
      {
        root: null, // 使用视口作为根
        rootMargin: '100px', // 提前 100px 触发加载
        threshold: 0.1, // 10% 可见时触发
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, page, fetchDailyList]);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      if (confirm('需要登录后才能创建日常记录，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent('/create?type=daily'));
      }
    } else {
      router.push('/create?type=daily');
    }
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
          <h1 className={styles.title}>日常记录</h1>
          <p className={styles.subtitle}>记录生活的点点滴滴</p>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
          >
            {isAuthenticated ? '创建记录' : '登录后创建'}
          </Button>
        </motion.div>

        {/* 首次加载状态 */}
        {loading && contents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && contents.length === 0 && (
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => fetchDailyList(1, false)}>
              重试
            </Button>
          </Empty>
        )}

        {/* 空状态 */}
        {!loading && !error && contents.length === 0 && (
          <Empty
            description="还没有日常记录"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
            >
              创建第一条记录
            </Button>
          </Empty>
        )}

        {/* 内容列表 */}
        {contents.length > 0 && (
          <>
            <div className={styles.grid}>
              {contents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link href={`/daily/${content.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                      hoverable
                      cover={
                        <ContentCover
                          images={content.images}
                          videos={content.videos}
                          videoThumbnails={content.video_thumbnails}
                          title={content.title}
                          height={200}
                        />
                      }
                      style={{ height: '100%' }}
                    >
                      <Meta
                        title={
                          <Tooltip title={content.title}>
                            <div style={{
                              fontSize: 18,
                              fontWeight: 600,
                              color: 'var(--text-primary)',
                              marginBottom: 8,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {content.title}
                            </div>
                          </Tooltip>
                        }
                        description={
                          <div>
                            <Tooltip title={content.description || content.title}>
                              <p style={{
                                color: 'var(--text-secondary)',
                                marginBottom: 12,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.6,
                                minHeight: 48,
                                maxHeight: 48,
                              }}>
                                {content.description || content.title}
                              </p>
                            </Tooltip>

                            {/* 标签 */}
                            {content.tags && content.tags.length > 0 && (
                              <div style={{ 
                                marginBottom: 12,
                                minHeight: 32,
                                maxHeight: 32,
                                overflow: 'hidden',
                              }}>
                                {content.tags.slice(0, 3).map((tag) => (
                                  <Tooltip key={tag} title={`#${tag}`}>
                                    <Tag style={{ 
                                      marginBottom: 4,
                                      maxWidth: 100,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      display: 'inline-block',
                                    }}>
                                      #{tag}
                                    </Tag>
                                  </Tooltip>
                                ))}
                                {content.tags.length > 3 && (
                                  <Tooltip title={content.tags.slice(3).map(t => `#${t}`).join(', ')}>
                                    <Tag style={{ marginBottom: 4 }}>
                                      +{content.tags.length - 3}
                                    </Tag>
                                  </Tooltip>
                                )}
                              </div>
                            )}

                            {/* 作者信息 */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingTop: 12,
                              borderTop: '1px solid var(--border-secondary)',
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {content.user ? (
                                  <>
                                    <Avatar size="small" style={{
                                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                    }}>
                                      {content.user.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                                      {content.user.username}
                                    </span>
                                  </>
                                ) : (
                                  <Avatar size="small" icon={<UserOutlined />} />
                                )}
                              </div>
                              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                {formatDate(content.created_at)}
                              </span>
                            </div>

                            {/* 统计数据 */}
                            <div style={{
                              display: 'flex',
                              gap: 16,
                              marginTop: 12,
                              fontSize: 13,
                              color: 'var(--text-tertiary)',
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <EyeOutlined />
                                {content.view_count}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HeartOutlined />
                                {content.like_count}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MessageOutlined />
                                {content.comment_count}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* 加载更多指示器 */}
            <div 
              ref={observerTarget}
              style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                minHeight: 100,
              }}
            >
              {loadingMore && (
                <Spin tip="加载更多..." />
              )}
              {!loadingMore && !hasMore && contents.length > 0 && (
                <div style={{ 
                  color: 'var(--text-tertiary)', 
                  fontSize: 14,
                }}>
                  已加载全部 {contents.length} 条记录
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
