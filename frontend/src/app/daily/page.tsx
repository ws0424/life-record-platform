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
const FROM_DETAIL_KEY = 'daily_from_detail'; // 标记是否从详情页返回

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

  // 用于检测滚动到底部的 ref
  const observerTarget = useRef<HTMLDivElement>(null);
  const isRestoringScroll = useRef(false);
  const hasRestoredScroll = useRef(false);

  // 从缓存加载数据
  const loadFromCache = useCallback(() => {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: CacheData = JSON.parse(cached);
        // 缓存有效期 5 分钟
        const isValid = Date.now() - data.timestamp < 5 * 60 * 1000;
        
        if (isValid && data.contents.length > 0) {
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

  // 保存到缓存
  const saveToCache = useCallback((data: Omit<CacheData, 'timestamp'>) => {
    try {
      const cacheData: CacheData = {
        ...data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('保存缓存失败:', error);
    }
  }, []);

  // 保存滚动位置
  const saveScrollPosition = useCallback(() => {
    try {
      const scrollY = window.scrollY;
      sessionStorage.setItem(SCROLL_KEY, scrollY.toString());
    } catch (error) {
      console.error('保存滚动位置失败:', error);
    }
  }, []);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    try {
      const scrollY = sessionStorage.getItem(SCROLL_KEY);
      if (scrollY && !hasRestoredScroll.current) {
        isRestoringScroll.current = true;
        hasRestoredScroll.current = true;
        
        // 使用 requestAnimationFrame 确保 DOM 已完全渲染
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: parseInt(scrollY, 10),
              behavior: 'instant' as ScrollBehavior,
            });
            
            // 延迟清除标记，确保不会触发 Observer
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

      setContents(prevContents => {
        let newContents: ContentListItem[];
        if (isLoadMore) {
          // 加载更多：追加到现有列表
          newContents = [...prevContents, ...response.items];
        } else {
          // 首次加载：替换列表
          newContents = response.items;
        }

        // 检查是否还有更多数据
        const totalPages = Math.ceil(response.total / pageSize);
        const hasMoreData = pageNum < totalPages;
        setHasMore(hasMoreData);

        // 保存到缓存
        saveToCache({
          contents: newContents,
          page: pageNum,
          hasMore: hasMoreData,
        });

        return newContents;
      });

    } catch (err: any) {
      console.error('获取日常记录失败:', err);
      setError(err.message || '获取日常记录失败');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [saveToCache]);

  // 首次加载
  useEffect(() => {
    // 检查是否从详情页返回
    const fromDetail = sessionStorage.getItem(FROM_DETAIL_KEY);
    
    if (fromDetail === 'true') {
      // 从详情页返回：尝试从缓存加载
      const hasCache = loadFromCache();
      
      if (hasCache) {
        // 有缓存，恢复滚动位置
        restoreScrollPosition();
      } else {
        // 无缓存，加载第一页
        hasRestoredScroll.current = true; // 标记为已恢复
        fetchDailyList(1, false);
      }
      
      // 清除标记
      sessionStorage.removeItem(FROM_DETAIL_KEY);
    } else {
      // 直接访问或刷新：清除缓存，从第一页开始
      sessionStorage.removeItem(CACHE_KEY);
      sessionStorage.removeItem(SCROLL_KEY);
      setPage(1);
      setHasMore(true);
      hasRestoredScroll.current = true; // 标记为已恢复（无需恢复）
      fetchDailyList(1, false);
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听页面离开，保存滚动位置
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // 监听路由变化（点击链接）
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href.includes('/daily/')) {
        // 设置标记：从详情页返回
        sessionStorage.setItem(FROM_DETAIL_KEY, 'true');
        // 保存滚动位置
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, [saveScrollPosition]);

  // 使用 Intersection Observer 监听滚动到底部
  useEffect(() => {
    // 等待初始加载完成
    if (loading) {
      return;
    }

    // 如果没有内容，不创建 Observer
    if (contents.length === 0) {
      return;
    }

    // 如果还没有恢复滚动，延迟创建 Observer
    if (!hasRestoredScroll.current) {
      const timer = setTimeout(() => {
        hasRestoredScroll.current = true;
      }, 1000);
      return () => clearTimeout(timer);
    }

    // 使用 ref 存储加载状态，避免闭包问题
    const loadingRef = { current: false };

    const observer = new IntersectionObserver(
      (entries) => {
        // 如果正在恢复滚动位置，不触发加载
        if (isRestoringScroll.current) {
          return;
        }

        // 当目标元素进入视口时
        if (entries[0].isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setLoadingMore(true);
          
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            
            // 异步加载数据
            getDailyList({
              page: nextPage,
              page_size: pageSize,
            }).then(response => {
              setContents(prevContents => {
                const newContents = [...prevContents, ...response.items];
                
                const totalPages = Math.ceil(response.total / pageSize);
                const hasMoreData = nextPage < totalPages;
                setHasMore(hasMoreData);
                
                // 保存到缓存
                try {
                  const cacheData: CacheData = {
                    contents: newContents,
                    page: nextPage,
                    hasMore: hasMoreData,
                    timestamp: Date.now(),
                  };
                  sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                } catch (error) {
                  console.error('保存缓存失败:', error);
                }
                
                loadingRef.current = false;
                setLoadingMore(false);
                
                return newContents;
              });
            }).catch(err => {
              console.error('获取日常记录失败:', err);
              loadingRef.current = false;
              setLoadingMore(false);
            });
            
            return nextPage;
          });
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
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
    // 只在初始加载完成后创建一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      if (confirm('需要登录后才能创建日常记录，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent('/create?type=daily'));
      }
    } else {
      router.push('/create?type=daily');
    }
  };

  // 刷新数据（清除缓存）
  const handleRefresh = () => {
    sessionStorage.removeItem(CACHE_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    setPage(1);
    setContents([]);
    setHasMore(true);
    fetchDailyList(1, false);
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
