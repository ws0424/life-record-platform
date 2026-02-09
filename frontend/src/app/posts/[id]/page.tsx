'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState('');

  // TODO: 从 API 获取数据
  const post = {
    id: postId,
    title: '春日京都赏樱之旅',
    content: `在樱花盛开的季节，我来到了京都。这座古老的城市在春天显得格外美丽，粉色的樱花与古朴的建筑相映成趣。

清晨，我漫步在哲学之道，两旁的樱花树形成了一条粉色的隧道。阳光透过花瓣洒下来，整个世界都变得温柔起来。

中午时分，我来到了清水寺。站在清水舞台上，可以俯瞰整个京都市区。远处的樱花如云似雾，近处的游客络绎不绝。

傍晚，我在鸭川边找了一家小店，品尝着京都特色的料理，看着河边的樱花随风飘落。这一刻，时间仿佛静止了。

京都的樱花季，是一场视觉的盛宴，更是一次心灵的洗礼。`,
    author: {
      username: 'traveler',
      name: '旅行达人',
      avatar: 'T',
      bio: '热爱旅行，用镜头记录世界',
    },
    date: '2024-03-15',
    tags: ['旅行', '日本', '樱花', '京都'],
    likes: 456,
    comments: 89,
    views: 2341,
    images: [1, 2, 3, 4],
  };

  const mockComments = [
    {
      id: 1,
      author: '摄影师',
      avatar: 'S',
      content: '照片拍得真好！京都的樱花确实很美',
      date: '2024-03-15 10:30',
      likes: 12,
    },
    {
      id: 2,
      author: '美食家',
      avatar: 'M',
      content: '请问那家料理店叫什么名字？我下次去也想尝尝',
      date: '2024-03-15 14:20',
      likes: 8,
    },
    {
      id: 3,
      author: '文艺青年',
      avatar: 'W',
      content: '哲学之道真的很美，我去年也去过，非常推荐！',
      date: '2024-03-15 16:45',
      likes: 15,
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    // TODO: 实现分享功能
    alert('分享功能开发中...');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 提交评论
    console.log('提交评论:', comment);
    setComment('');
  };

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
            <h1 className={styles.title}>{post.title}</h1>
            
            <div className={styles.meta}>
              <Link href={`/profile/${post.author.username}`} className={styles.author}>
                <div className={styles.avatar}>{post.author.avatar}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{post.author.name}</span>
                  <span className={styles.date}>{post.date}</span>
                </div>
              </Link>

              <div className={styles.stats}>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {post.views} 浏览
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {post.comments} 评论
                </span>
              </div>
            </div>
          </header>

          {/* 图片展示 */}
          <div className={styles.images}>
            {post.images.map((img, index) => (
              <motion.div
                key={index}
                className={styles.imageWrapper}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.imagePlaceholder}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 文章内容 */}
          <div className={styles.content}>
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* 标签 */}
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <Link key={tag} href={`/explore?tag=${tag}`} className={styles.tag}>
                #{tag}
              </Link>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${isLiked ? styles.actionBtnActive : ''}`}
              onClick={handleLike}
            >
              <svg viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{isLiked ? post.likes + 1 : post.likes}</span>
            </button>

            <button
              className={`${styles.actionBtn} ${isSaved ? styles.actionBtnActive : ''}`}
              onClick={handleSave}
            >
              <svg viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>{isSaved ? '已收藏' : '收藏'}</span>
            </button>

            <button className={styles.actionBtn} onClick={handleShare}>
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
        </motion.article>

        {/* 评论区 */}
        <motion.section
          className={styles.commentsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className={styles.commentsTitle}>评论 ({mockComments.length})</h2>

          {/* 评论表单 */}
          <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
            <textarea
              className={styles.commentInput}
              placeholder="写下你的评论..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button type="submit" className={styles.commentSubmit} disabled={!comment.trim()}>
              发表评论
            </button>
          </form>

          {/* 评论列表 */}
          <div className={styles.commentsList}>
            {mockComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                className={styles.commentItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.commentAvatar}>{comment.avatar}</div>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.author}</span>
                    <span className={styles.commentDate}>{comment.date}</span>
                  </div>
                  <p className={styles.commentText}>{comment.content}</p>
                  <div className={styles.commentActions}>
                    <button className={styles.commentLike}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {comment.likes}
                    </button>
                    <button className={styles.commentReply}>回复</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

