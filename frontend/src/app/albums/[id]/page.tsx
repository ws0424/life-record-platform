'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { getAlbumDetail, toggleAlbumLike, toggleAlbumSave } from '@/lib/api/album';
import styles from './page.module.css';

interface Album {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[];
  location: string;
  tags: string[];
  like_count: number;
  view_count: number;
  is_liked: boolean;
  is_saved: boolean;
  created_at: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const albumId = params.id as string;
  
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  useEffect(() => {
    loadAlbumDetail();
  }, [albumId]);

  const loadAlbumDetail = async () => {
    try {
      setLoading(true);
      const response = await getAlbumDetail(albumId);
      console.log('Album detail 接口返回:', response);
      
      // 检查返回数据格式
      let data;
      if (response && response.data) {
        // 新格式：{code, data: {...}}
        data = response.data;
      } else {
        // 旧格式：直接是数据
        data = response;
      }
      
      console.log('Album data:', data);
      setAlbum(data);
    } catch (error) {
      console.error('获取相册详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      if (confirm('需要登录后才能点赞，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent(`/albums/${albumId}`));
      }
      return;
    }

    try {
      const response = await toggleAlbumLike(albumId);
      const result = response.data || response;
      setAlbum(prev => prev ? {
        ...prev,
        is_liked: result.is_liked,
        like_count: result.like_count,
      } : null);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      if (confirm('需要登录后才能收藏，是否前往登录？')) {
        router.push('/login?redirect=' + encodeURIComponent(`/albums/${albumId}`));
      }
      return;
    }

    try {
      const response = await toggleAlbumSave(albumId);
      const result = response.data || response;
      setAlbum(prev => prev ? {
        ...prev,
        is_saved: result.is_saved,
      } : null);
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>加载中...</div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>相册不存在</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* 返回按钮 */}
        <button className={styles.backBtn} onClick={() => router.back()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          返回
        </button>

        {/* 相册头部 */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{album.title}</h1>
            <p className={styles.description}>{album.description}</p>

            <div className={styles.meta}>
              {album.user ? (
                <Link href={`/profile/${album.user.username}`} className={styles.author}>
                  <div className={styles.avatar}>{album.user.username[0].toUpperCase()}</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>{album.user.username}</span>
                    <span className={styles.date}>{formatDate(album.created_at)}</span>
                  </div>
                </Link>
              ) : (
                <div className={styles.author}>
                  <div className={styles.avatar}>?</div>
                  <div className={styles.authorInfo}>
                    <span className={styles.authorName}>未知用户</span>
                    <span className={styles.date}>{formatDate(album.created_at)}</span>
                  </div>
                </div>
              )}

              <div className={styles.info}>
                {album.location && (
                  <span className={styles.infoItem}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {album.location}
                  </span>
                )}
                <span className={styles.infoItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {album.images.length} 张照片
                </span>
                <span className={styles.infoItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {album.view_count} 浏览
                </span>
              </div>
            </div>

            {album.tags.length > 0 && (
              <div className={styles.tags}>
                {album.tags.map((tag) => (
                  <Link key={tag} href={`/explore?tag=${tag}`} className={styles.tag}>
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${album.is_liked ? styles.actionBtnActive : ''}`}
                onClick={handleLike}
              >
                <svg viewBox="0 0 24 24" fill={album.is_liked ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{album.like_count}</span>
              </button>

              <button
                className={`${styles.actionBtn} ${album.is_saved ? styles.actionBtnActive : ''}`}
                onClick={handleSave}
              >
                <svg viewBox="0 0 24 24" fill={album.is_saved ? 'currentColor' : 'none'} stroke="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                <span>收藏</span>
              </button>

              <button className={styles.actionBtn}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                <span>分享</span>
              </button>
            </div>
          </div>
        </motion.header>

        {/* 照片网格 */}
        <div className={styles.photoGrid}>
          {album.images.map((imageUrl, index) => (
            <motion.div
              key={index}
              className={styles.photoItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(index)}
            >
              <img src={imageUrl} alt={`${album.title} - ${index + 1}`} className={styles.photoImage} />
              <div className={styles.photoOverlay}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8m-4-4h8" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 图片查看器 */}
        {selectedImage !== null && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <button
              className={styles.navBtn}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage > 0 ? selectedImage - 1 : album.images.length - 1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
              <img 
                src={album.images[selectedImage]} 
                alt={`${album.title} - ${selectedImage + 1}`}
                className={styles.lightboxImage}
              />
              <div className={styles.lightboxInfo}>
                <h3>{album.title}</h3>
                <p>{selectedImage + 1} / {album.images.length}</p>
              </div>
            </div>

            <button
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(selectedImage < album.images.length - 1 ? selectedImage + 1 : 0);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

