'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, message, Spin } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import styles from './page.module.css';

interface Hitokoto {
  id: number;
  uuid: string;
  hitokoto: string;
  type: string;
  from: string;
  from_who: string | null;
  creator: string;
  creator_uid: number;
  reviewer: number;
  commit_from: string;
  created_at: string;
  length: number;
}

export default function HitokotoPage() {
  const [hitokoto, setHitokoto] = useState<Hitokoto | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHitokoto = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://v1.hitokoto.cn/');
      const data = await response.json();
      setHitokoto(data);
    } catch (error) {
      console.error('获取一言失败:', error);
      message.error('获取失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHitokoto();
  }, []);

  const handleCopy = () => {
    if (!hitokoto) return;
    
    const text = `${hitokoto.hitokoto}\n—— ${hitokoto.from_who || '佚名'} 《${hitokoto.from}》`;
    navigator.clipboard.writeText(text).then(() => {
      message.success('已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
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
          <h1 className={styles.title}>每日一句</h1>
          <p className={styles.subtitle}>发现生活中的美好句子</p>
        </motion.div>

        <motion.div
          className={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <div className={styles.loading}>
              <Spin size="large" />
              <p>加载中...</p>
            </div>
          ) : hitokoto ? (
            <>
              <div className={styles.quoteContainer}>
                <div className={styles.quoteIcon}>"</div>
                <p className={styles.quote}>{hitokoto.hitokoto}</p>
                <div className={styles.quoteIconEnd}>"</div>
              </div>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>来源</span>
                  <span className={styles.metaValue}>{hitokoto.from}</span>
                </div>
                {hitokoto.from_who && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>作者</span>
                    <span className={styles.metaValue}>{hitokoto.from_who}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>提交者</span>
                  <span className={styles.metaValue}>{hitokoto.creator}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={fetchHitokoto}
                  loading={loading}
                  className={styles.refreshButton}
                >
                  换一句
                </Button>
                <Button
                  size="large"
                  icon={<CopyOutlined />}
                  onClick={handleCopy}
                  className={styles.copyButton}
                >
                  复制
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.error}>
              <p>加载失败</p>
              <Button type="primary" onClick={fetchHitokoto}>
                重试
              </Button>
            </div>
          )}
        </motion.div>

        <motion.div
          className={styles.info}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>数据来源：<a href="https://hitokoto.cn" target="_blank" rel="noopener noreferrer">一言 Hitokoto</a></p>
        </motion.div>
      </div>
    </div>
  );
}

