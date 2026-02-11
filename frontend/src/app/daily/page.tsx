'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getDailyList } from '@/lib/api/content';
import type { ContentListItem } from '@/lib/api/content';
import { formatDate } from '@/lib/utils/date';
import styles from './page.module.css';

export default function DailyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [contents, setContents] = useState<ContentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 12;

  // 获取日常记录列表
  useEffect(() => {
    fetchDailyList();
  }, [page]);

  const fetchDailyList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDailyList({
        page,
        page_size: pageSize,
      });
      setContents(response.items);
      setTotal(response.total);
    } catch (err: any) {
      console.error('获取日常记录失败:', err);
      setError(err.message || '获取日常记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      if (confirm('需要登录后才能创建日常记录，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent('/create?type=daily'));
      }
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
          <Link 
            href="/create?type=daily" 
            className={styles.createBtn}
            onClick={handleCreateClick}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {isAuthenticated ? '创建记录' : '登录后创建'}
          </Link>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className={styles.error}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
            <button onClick={fetchDailyList} className={styles.retryBtn}>
              重试
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && contents.length === 0 && (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <p>还没有日常记录</p>
            <Link href="/create?type=daily" className={styles.createBtn}>
              创建第一条记录
            </Link>
          </div>
        )}

        {/* 内容列表 */}
        {!loading && !error && contents.length > 0 && (
          <>
            <div className={styles.grid}>
              {contents.map((content, index) => (
                <motion.article
                  key={content.id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <Link href={`/daily/${content.id}`} className={styles.cardLink}>
                    {/* 图片 */}
                    {content.images && content.images.length > 0 ? (
                      <div className={styles.cardImage}>
                        <img src={content.images[0]} alt={content.title} />
                      </div>
                    ) : (
                      <div className={styles.cardImage}>
                        <div className={styles.imagePlaceholder}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.cardContent}>
                      <h2 className={styles.cardTitle}>{content.title}</h2>
                      <p className={styles.cardDescription}>
                        {content.description || content.title}
                      </p>
                      
                      {/* 标签 */}
                      {content.tags && content.tags.length > 0 && (
                        <div className={styles.tags}>
                          {content.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className={styles.tag}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className={styles.cardMeta}>
                        <div className={styles.author}>
                          {content.user && (
                            <>
                              <div className={styles.avatar}>
                                {content.user.username.charAt(0).toUpperCase()}
                              </div>
                              <span>{content.user.username}</span>
                            </>
                          )}
                        </div>
                        <span className={styles.date}>
                          {formatDate(content.created_at)}
                        </span>
                      </div>
                      
                      <div className={styles.stats}>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          {content.view_count}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {content.like_count}
                        </span>
                        <span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          {content.comment_count}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* 分页 */}
            {total > pageSize && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                >
                  上一页
                </button>
                <span className={styles.pageInfo}>
                  第 {page} 页 / 共 {Math.ceil(total / pageSize)} 页
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / pageSize)}
                  className={styles.pageBtn}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

