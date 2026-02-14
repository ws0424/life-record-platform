'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tabs, Input, Card, Tag, Avatar, Empty, Spin, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, HeartOutlined, MessageOutlined, StarFilled, UserOutlined } from '@ant-design/icons';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { exploreContents } from '@/lib/api/content';
import type { ContentListItem } from '@/lib/api/content';
import { formatDate } from '@/lib/utils/date';
import { ContentCover } from '@/components/ContentCover';
import styles from './page.module.css';

const { Search } = Input;
const { Meta } = Card;

type Category = 'all' | 'daily' | 'album' | 'travel' | 'popular';

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState<ContentListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // 获取内容列表
  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, page]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await exploreContents({
        page,
        page_size: pageSize,
        category: activeCategory,
        keyword: searchQuery || undefined,
      });
      setContents(response.data?.items || []);
    } catch (error) {
      console.error('获取内容失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 使用 debounce 优化搜索
  const debouncedSearch = useDebounce((value: string) => {
    setSearchQuery(value);
    setPage(1); // 重置页码
  }, 300);

  const tabItems = [
    { key: 'all', label: '全部', icon: '🌟' },
    { key: 'daily', label: '日常', icon: '📝' },
    { key: 'album', label: '相册', icon: '📷' },
    { key: 'travel', label: '旅行', icon: '✈️' },
    { key: 'popular', label: '热门', icon: '🔥' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>探索发现</h1>
          <p className={styles.subtitle}>发现更多精彩内容</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: 24 }}
        >
          <Search
            placeholder="搜索内容、标签或用户..."
            allowClear
            enterButton
            size="large"
            prefix={<SearchOutlined />}
            onChange={(e) => debouncedSearch(e.target.value)}
            style={{ maxWidth: 600 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs
            activeKey={activeCategory}
            onChange={(key) => {
              setActiveCategory(key as Category);
              setPage(1);
            }}
            size="large"
            items={tabItems.map(item => ({
              key: item.key,
              label: (
                <span>
                  <span style={{ marginRight: 6 }}>{item.icon}</span>
                  {item.label}
                </span>
              ),
            }))}
          />
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        ) : contents.length === 0 ? (
          <Empty
            description="没有找到相关内容"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <p style={{ color: 'var(--text-secondary)' }}>试试其他关键词或分类</p>
          </Empty>
        ) : (
          <div className={styles.grid}>
            {contents.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={`/daily/${content.id}`} style={{ textDecoration: 'none' }}>
                  <Badge.Ribbon
                    text={
                      <span>
                        <StarFilled style={{ marginRight: 4 }} />
                        精选
                      </span>
                    }
                    color="var(--color-primary)"
                    style={{ display: content.is_featured ? 'block' : 'none' }}
                  >
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
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          {content.user ? (
                            <>
                              <Avatar size="small" style={{
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              }}>
                                {content.user.username.charAt(0).toUpperCase()}
                              </Avatar>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                                  {content.user.username}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                                  {formatDate(content.created_at)}
                                </div>
                              </div>
                            </>
                          ) : (
                            <Avatar size="small" icon={<UserOutlined />} />
                          )}
                        </div>
                      </div>

                      <Meta
                        title={
                          <div style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: 8,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {content.title}
                          </div>
                        }
                        description={
                          <div>
                            <p style={{
                              color: 'var(--text-secondary)',
                              marginBottom: 12,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.6,
                            }}>
                              {content.description || content.title}
                            </p>

                            {content.tags && content.tags.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                {content.tags.slice(0, 3).map((tag) => (
                                  <Tag key={tag} style={{ marginBottom: 4 }}>
                                    #{tag}
                                  </Tag>
                                ))}
                              </div>
                            )}

                            <div style={{
                              display: 'flex',
                              gap: 16,
                              fontSize: 13,
                              color: 'var(--text-tertiary)',
                              paddingTop: 12,
                              borderTop: '1px solid var(--border-secondary)',
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <HeartOutlined />
                                {content.like_count}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <MessageOutlined />
                                {content.comment_count}
                              </span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <EyeOutlined />
                                {content.view_count}
                              </span>
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

