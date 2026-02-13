'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Spin, Empty, Button, Modal, message } from 'antd';
import { 
  EyeOutlined, 
  HeartOutlined, 
  MessageOutlined, 
  EyeInvisibleOutlined,
  DeleteOutlined,
  EditOutlined 
} from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { ContentCover } from '@/components/ContentCover';
import { formatDate } from '@/lib/utils/date';
import { myWorksApi, type CommentItem } from '@/lib/api/myWorks';
import { StatsGrid, SkeletonGrid } from './components';
import styles from './page.module.css';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  images: string[];
  videos: string[];
  video_thumbnails: string[];
  view_count: number;
  like_count: number;
  comment_count: number;
  is_public: boolean;
  created_at: string;
}

type TabType = 'works' | 'views' | 'likes' | 'comments';

export default function MyWorksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('works');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({
    worksCount: 0,
    viewsCount: 0,
    likesCount: 0,
    commentsCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const pageSize = 12;

  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isInitialized = useRef(false);
  const isLoadingRef = useRef(false);

  // 检查登录状态
  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=/my-works');
    }
  }, [isAuthenticated, router]);

  // 加载统计数据
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const data = await myWorksApi.getStats();
        setStats(data);
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [isAuthenticated]);

  // 加载数据
  const loadData = useCallback(async (pageNum: number, append: boolean = false) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let data;
      
      switch (activeTab) {
        case 'works':
          data = await myWorksApi.getMyWorks(pageNum, pageSize);
          break;
        case 'views':
          data = await myWorksApi.getMyViews(pageNum, pageSize);
          break;
        case 'likes':
          data = await myWorksApi.getMyLikes(pageNum, pageSize);
          break;
        case 'comments':
          data = await myWorksApi.getMyComments(pageNum, pageSize);
          break;
      }

      if (activeTab === 'comments') {
        const newComments = data.items || [];
        setComments(prev => append ? [...prev, ...newComments] : newComments);
        setHasMore(pageNum < data.total_pages);
      } else {
        const newContents = data.items || [];
        setContents(prev => append ? [...prev, ...newContents] : newContents);
        setHasMore(pageNum < data.total_pages);
      }

      setPage(pageNum);

    } catch (error) {
      console.error('加载失败:', error);
      message.error('加载失败，请重试');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [activeTab]);

  // 初始化
  useEffect(() => {
    if (!isAuthenticated) return;
    
    isInitialized.current = false;
    setContents([]);
    setComments([]);
    setPage(1);
    setHasMore(true);
    
    loadData(1, false);
  }, [activeTab, isAuthenticated, loadData]);

  // 设置 Intersection Observer
  useEffect(() => {
    if (loading || (!contents.length && !comments.length)) {
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingRef.current &&
          !loadingMore &&
          !loading &&
          hasMore
        ) {
          loadData(page + 1, true);
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (observerTarget.current) {
      observerRef.current.observe(observerTarget.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, loadingMore, hasMore, page, contents.length, comments.length, loadData]);

  // 隐藏/显示作品
  const handleToggleVisibility = async (contentId: string, isPublic: boolean) => {
    try {
      if (isPublic) {
        await myWorksApi.hideContent(contentId);
      } else {
        await myWorksApi.showContent(contentId);
      }

      message.success(isPublic ? '已隐藏' : '已公开');
      
      // 更新本地状态
      setContents(prev => prev.map(item => 
        item.id === contentId ? { ...item, is_public: !isPublic } : item
      ));
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试');
    }
  };

  // 删除作品
  const handleDelete = async (contentId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个作品吗？',
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await myWorksApi.deleteContent(contentId);
          message.success('删除成功');
          
          // 从列表中移除
          setContents(prev => prev.filter(item => item.id !== contentId));
          
          // 更新统计
          setStats(prev => ({ ...prev, worksCount: prev.worksCount - 1 }));
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败，请重试');
        }
      },
    });
  };

  // 删除浏览记录
  const handleDeleteView = async (contentId: string) => {
    try {
      await myWorksApi.deleteViewRecord(contentId);
      message.success('已删除');
      
      // 从列表中移除
      setContents(prev => prev.filter(item => item.id !== contentId));
      
      // 更新统计
      setStats(prev => ({ ...prev, viewsCount: prev.viewsCount - 1 }));
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请重试');
    }
  };

  const tabs = [
    { key: 'works' as TabType, label: '我的作品', icon: '📝' },
    { key: 'views' as TabType, label: '浏览记录', icon: '👀' },
    { key: 'likes' as TabType, label: '点赞记录', icon: '❤️' },
    { key: 'comments' as TabType, label: '评论记录', icon: '💬' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>我的创作</h1>
          <p className={styles.subtitle}>管理你的作品、浏览记录、点赞和评论</p>
        </motion.div>

        {/* 统计卡片 */}
        {!loadingStats && <StatsGrid stats={stats} />}

        {/* 标签页 */}
        <div className={styles.tabs}>
          <ul className={styles.tabList}>
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={`${styles.tabButton} ${activeTab === tab.key ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <span style={{ marginRight: 8 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 加载状态 */}
        {loading && contents.length === 0 && comments.length === 0 && (
          <SkeletonGrid count={6} />
        )}

        {/* 空状态 */}
        {!loading && contents.length === 0 && comments.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              {activeTab === 'works' && '📝'}
              {activeTab === 'views' && '👀'}
              {activeTab === 'likes' && '❤️'}
              {activeTab === 'comments' && '💬'}
            </div>
            <div className={styles.emptyText}>
              {activeTab === 'works' && '还没有创作任何作品'}
              {activeTab === 'views' && '还没有浏览记录'}
              {activeTab === 'likes' && '还没有点赞记录'}
              {activeTab === 'comments' && '还没有评论记录'}
            </div>
            {activeTab === 'works' && (
              <Button type="primary" size="large" onClick={() => router.push('/create')}>
                创建作品
              </Button>
            )}
          </div>
        )}

        {/* 内容列表 */}
        {activeTab !== 'comments' && contents.length > 0 && (
          <>
            <div className={styles.grid}>
              {contents.map((content, index) => (
                <motion.div
                  key={content.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 1) }}
                >
                  <div className={styles.card}>
                    <Link href={`/${content.type}/${content.id}`}>
                      <ContentCover
                        images={content.images}
                        videos={content.videos}
                        videoThumbnails={content.video_thumbnails}
                        title={content.title}
                        height={200}
                      />
                    </Link>
                    
                    <div className={styles.cardBody}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Link href={`/${content.type}/${content.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                          <h3 className={styles.cardTitle}>{content.title}</h3>
                        </Link>
                        {activeTab === 'works' && !content.is_public && (
                          <span className={`${styles.badge} ${styles.private}`}>私密</span>
                        )}
                      </div>
                      
                      <p className={styles.cardDescription}>{content.description || content.title}</p>
                      
                      <div className={styles.cardMeta}>
                        <div className={styles.cardStats}>
                          <span className={styles.cardStat}>
                            <EyeOutlined />
                            {content.view_count}
                          </span>
                          <span className={styles.cardStat}>
                            <HeartOutlined />
                            {content.like_count}
                          </span>
                          <span className={styles.cardStat}>
                            <MessageOutlined />
                            {content.comment_count}
                          </span>
                        </div>
                        
                        <div className={styles.cardActions}>
                          {activeTab === 'works' && (
                            <>
                              <button
                                className={styles.actionButton}
                                onClick={() => router.push(`/create?id=${content.id}`)}
                                title="编辑"
                              >
                                <EditOutlined />
                              </button>
                              <button
                                className={styles.actionButton}
                                onClick={() => handleToggleVisibility(content.id, content.is_public)}
                                title={content.is_public ? '隐藏' : '公开'}
                              >
                                {content.is_public ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                              </button>
                              <button
                                className={`${styles.actionButton} ${styles.danger}`}
                                onClick={() => handleDelete(content.id)}
                                title="删除"
                              >
                                <DeleteOutlined />
                              </button>
                            </>
                          )}
                          {activeTab === 'views' && (
                            <button
                              className={`${styles.actionButton} ${styles.danger}`}
                              onClick={() => handleDeleteView(content.id)}
                              title="删除记录"
                            >
                              <DeleteOutlined />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-tertiary)' }}>
                        {formatDate(content.created_at)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* 评论列表 */}
        {activeTab === 'comments' && comments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
                className={styles.commentCard}
              >
                <div className={styles.commentHeader}>
                  <Link 
                    href={`/${comment.content.type}/${comment.content.id}`}
                    className={styles.contentLink}
                  >
                    评论了《{comment.content.title}》
                  </Link>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                
                <div className={styles.commentContent}>
                  {comment.comment_text}
                </div>
                
                <div className={styles.commentFooter}>
                  <div className={styles.cardStats}>
                    <span className={styles.cardStat}>
                      <HeartOutlined />
                      {comment.like_count}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 加载更多指示器 */}
        {(contents.length > 0 || comments.length > 0) && (
          <div ref={observerTarget} className={styles.loadMore}>
            {loadingMore && (
              <div>
                <Spin />
                <div className={styles.loadingText}>加载更多...</div>
              </div>
            )}
            {!loadingMore && !hasMore && (
              <div style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
                已加载全部 {activeTab === 'comments' ? comments.length : contents.length} 条记录
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

