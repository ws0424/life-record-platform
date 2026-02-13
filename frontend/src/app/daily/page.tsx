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

// 缓存键
const CACHE_KEY = 'daily_page_cache';
const SCROLL_KEY = 'daily_page_scroll';
const FROM_DETAIL_KEY = 'daily_from_detail';

interface CacheData {
  contents: ContentListItem[];
  page: number;
  hasMore: boolean;
  timestamp: number;
}

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

  // Refs
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const isRestoringScroll = useRef(false);

  // 加载数据
  const loadData = useCallback(async (pageNum: number, append: boolean = false) => {
    // 防止重复请求
    if (isLoadingRef.current) {
      console.log('已有请求在进行中，跳过');
      return;
    }

    try {
      isLoadingRef.current = true;
      
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      console.log(`加载第 ${pageNum} 页数据`);
      const response = await getDailyList({
        page: pageNum,
        page_size: pageSize,
      });

      const totalPages = Math.ceil(response.total / pageSize);
      const hasMoreData = pageNum < totalPages;

      setContents(prev => {
        const newContents = append ? [...prev, ...response.items] : response.items;
        
        // 保存到缓存
        try {
          const cacheData: CacheData = {
            contents: newContents,
            page: pageNum,
            hasMore: hasMoreData,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (err) {
          console.error('保存缓存失败:', err);
        }
        
        return newContents;
      });

      setPage(pageNum);
      setHasMore(hasMoreData);

    } catch (err: any) {
      console.error('获取日常记录失败:', err);
      setError(err.message || '获取日常记录失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 从缓存加载
  const loadFromCache = useCallback(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        const isValid = Date.now() - data.timestamp < 5 * 60 * 1000;
        
        if (isValid && data.contents.length > 0) {
          console.log('从缓存加载数据');
          setContents(data.contents);
          setPage(data.page);
          setHasMore(data.hasMore);
          setLoading(false);
          return true;
        }
      }
    } catch (error) {
      console.error('加载缓存失败:', error);
    }
    return false;
  }, []);

  // 恢复滚动位置
  const restoreScroll = useCallback(() => {
    try {
      const scrollY = sessionStorage.getItem(SCROLL_KEY);
      if (scrollY) {
        isRestoringScroll.current = true;
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: parseInt(scrollY, 10),
              behavior: 'instant' as ScrollBehavior,
            });
            
            setTimeout(() => {
              isRestoringScroll.current = false;
            }, 500);
          });
        });
      }
    } catch (error) {
      console.error('恢复滚动位置失败:', error);
      isRestoringScroll.current = false;
    }
  }, []);

  // 保存滚动位置
  const saveScroll = useCallback(() => {
    try {
      sessionStorage.setItem(SCROLL_KEY, window.scrollY.toString());
    } catch (error) {
      console.error('保存滚动位置失败:', error);
    }
  }, []);

  // 初始化
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const fromDetail = sessionStorage.getItem(FROM_DETAIL_KEY);
    
    if (fromDetail === 'true') {
      console.log('从详情页返回');
      sessionStorage.removeItem(FROM_DETAIL_KEY);
      
      const hasCache = loadFromCache();
      if (hasCache) {
        restoreScroll();
      } else {
        loadData(1, false);
      }
    } else {
      console.log('首次访问或刷新');
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(SCROLL_KEY);
      loadData(1, false);
      window.scrollTo(0, 0);
    }
  }, [loadData, loadFromCache, restoreScroll]);

  // 设置 Intersection Observer
  useEffect(() => {
    if (loading || contents.length === 0) {
      return;
    }

    // 清理旧的 observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 创建新的 observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        
        // 检查是否应该加载更多
        if (
          target.isIntersecting &&
          !isLoadingRef.current &&
          !loadingMore &&
          !loading &&
          hasMore &&
          !isRestoringScroll.current
        ) {
          console.log('触发加载更多');
          loadData(page + 1, true);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    // 开始观察
    if (observerTarget.current) {
      observerRef.current.observe(observerTarget.current);
    }

    // 清理
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, page, contents.length, loadData]);

  // 监听页面离开
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href.includes('/daily/')) {
        sessionStorage.setItem(FROM_DETAIL_KEY, 'true');
        saveScroll();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [saveScroll]);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      if (confirm('需要登录后才能创建日常记录，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent('/create?type=daily'));
      }
    } else {
      router.push('/create?type=daily');
    }
  };

  const handleRefresh = () => {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    setContents([]);
    setPage(1);
    setHasMore(true);
    loadData(1, false);
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
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={handleCreateClick}
            >
              {isAuthenticated ? '创建记录' : '登录后创建'}
            </Button>
          </div>
        </motion.div>

        {/* 首次加载状态 */}
        {loading && contents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: 'var(--text-secondary)' }}>加载中...</div>
          </div>
        )}

        {/* 错误状态 */}
        {error && !loading && contents.length === 0 && (
          <Empty
            description={error}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={handleRefresh}>
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
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 1) }}
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
                <div>
                  <Spin />
                  <div style={{ marginTop: 12, color: 'var(--text-secondary)', fontSize: 14 }}>加载更多...</div>
                </div>
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
