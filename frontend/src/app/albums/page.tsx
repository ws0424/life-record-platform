'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getAlbumList } from '@/lib/api/album';
import styles from './page.module.css';

interface Album {
  id: string;
  title: string;
  description: string;
  images: string[];
  location: string;
  tags: string[];
  like_count: number;
  view_count: number;
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export default function AlbumsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    loadAlbums();
  }, [page, keyword]);

  const loadAlbums = async () => {
    try {
      setLoading(true);
      const response = await getAlbumList({
        page,
        page_size: 20,
        keyword: keyword || undefined,
      });
      
      console.log('Albums 接口返回数据:', response);
      
      // 检查返回数据格式
      if (response && response.data) {
        // 新格式：{code, data: {items, total}}
        setAlbums(response.data.items || []);
        setTotal(response.data.total || 0);
      } else if (response && response.items) {
        // 旧格式：{items, total}
        setAlbums(response.items || []);
        setTotal(response.total || 0);
      } else {
        console.error('未知的数据格式:', response);
        setAlbums([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('获取相册列表失败:', error);
      setAlbums([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      if (confirm('需要登录后才能创建相册，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent('/create?type=album'));
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadAlbums();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getPhotoCount = (images: string[]) => {
    return images?.length || 0;
  };

  const getCoverImages = (images: string[]) => {
    return images?.slice(0, 4) || [];
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
          <h1 className={styles.title}>我的相册</h1>
          <p className={styles.subtitle}>珍藏生活中的美好瞬间</p>
          
          <div className={styles.headerActions}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input
                type="text"
                placeholder="搜索相册..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </form>

            {isAuthenticated && (
              <Link 
                href="/create?type=album" 
                className={styles.createBtn}
                onClick={handleCreateClick}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                创建相册
              </Link>
            )}
          </div>
        </motion.div>

        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : albums.length === 0 ? (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>暂无相册</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {albums.map((album, index) => (
                <motion.article
                  key={album.id}
                  className={styles.albumCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <Link href={`/albums/${album.id}`} className={styles.albumLink}>
                    <div className={styles.albumCover}>
                      <div className={styles.coverGrid}>
                        {getCoverImages(album.images).map((img, idx) => (
                          <div key={idx} className={styles.coverImage}>
                            {img ? (
                              <img src={img} alt={`${album.title} - ${idx + 1}`} />
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                  <polyline points="21 15 16 10 5 21" />
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className={styles.albumOverlay}>
                        <span className={styles.photoCount}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                          {getPhotoCount(album.images)} 张照片
                        </span>
                      </div>
                    </div>
                    <div className={styles.albumInfo}>
                      <h2 className={styles.albumTitle}>{album.title}</h2>
                      <p className={styles.albumDescription}>{album.description}</p>
                      <div className={styles.albumMeta}>
                        <span className={styles.date}>{formatDate(album.created_at)}</span>
                        <div className={styles.stats}>
                          <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            {album.like_count}
                          </span>
                          <span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {album.view_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {total > 20 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                >
                  上一页
                </button>
                <span className={styles.pageInfo}>
                  第 {page} 页 / 共 {Math.ceil(total / 20)} 页
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
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

