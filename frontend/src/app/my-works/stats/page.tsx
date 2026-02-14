'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Spin, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/lib/store/authStore';
import { myWorksApi } from '@/lib/api/myWorks';
import { BarChart, PieChart, StatsOverview } from '../charts';
import styles from '../stats.module.css';

interface ContentItem {
  id: string;
  type: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export default function MyWorksStatsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('请先登录');
      router.push('/login?redirect=' + encodeURIComponent('/my-works/stats'));
      return;
    }

    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 加载所有作品数据
      const data = await myWorksApi.getMyWorks(1, 100);
      setContents(data.items as any);
    } catch (error) {
      console.error('加载失败:', error);
      message.error('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // 计算统计数据
  const totalViews = contents.reduce((sum, item) => sum + item.view_count, 0);
  const totalLikes = contents.reduce((sum, item) => sum + item.like_count, 0);
  const totalComments = contents.reduce((sum, item) => sum + item.comment_count, 0);
  const avgViewsPerContent = contents.length > 0 ? totalViews / contents.length : 0;
  const avgLikesPerContent = contents.length > 0 ? totalLikes / contents.length : 0;
  const avgCommentsPerContent = contents.length > 0 ? totalComments / contents.length : 0;

  // 按类型统计
  const typeStats = contents.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = [
    { label: '日常记录', value: typeStats.daily || 0, color: '#7C3AED' },
    { label: '相册', value: typeStats.album || 0, color: '#F97316' },
    { label: '旅游路线', value: typeStats.travel || 0, color: '#10B981' },
  ].filter(item => item.value > 0);

  // 互动数据
  const interactionData = [
    { label: '浏览量', value: totalViews, color: '#7C3AED' },
    { label: '点赞数', value: totalLikes, color: '#F97316' },
    { label: '评论数', value: totalComments, color: '#10B981' },
  ];

  // Top 5 作品
  const topContents = [...contents]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, 5);

  const topContentsData = topContents.map((item, index) => ({
    label: `作品 ${index + 1}`,
    value: item.view_count,
    color: `hsl(${260 - index * 20}, 70%, 60%)`,
  }));

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      padding: '80px 0 40px',
    }}>
      <div style={{ 
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 32 }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/my-works')}
            style={{ marginBottom: 16 }}
          >
            返回我的创作
          </Button>
          
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
            fontFamily: 'Fira Sans, sans-serif',
          }}>
            数据统计
          </h1>
          <p style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            margin: 0,
          }}>
            查看你的创作数据和互动统计
          </p>
        </motion.div>

        {/* 统计概览 */}
        <StatsOverview
          stats={{
            totalViews,
            totalLikes,
            totalComments,
            avgViewsPerContent,
            avgLikesPerContent,
            avgCommentsPerContent,
          }}
        />

        {/* 图表 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: 24,
        }}>
          {/* 内容类型分布 */}
          {typeChartData.length > 0 && (
            <PieChart
              data={typeChartData}
              title="内容类型分布"
            />
          )}

          {/* 互动数据对比 */}
          <BarChart
            data={interactionData}
            title="互动数据统计"
          />

          {/* Top 5 作品 */}
          {topContentsData.length > 0 && (
            <BarChart
              data={topContentsData}
              title="浏览量 Top 5"
            />
          )}
        </div>

        {/* 空状态 */}
        {contents.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.3 }}>
              📊
            </div>
            <div style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              marginBottom: 24,
            }}>
              还没有作品数据
            </div>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push('/create')}
            >
              创建第一个作品
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

