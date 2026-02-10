'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';

// Mock 数据
const mockPlatforms = [
  { id: 'all', name: '全部', icon: '🔥', color: '#E11D48' },
  { id: 'zhihu', name: '知乎', icon: '知', color: '#0084FF' },
  { id: 'weibo', name: '微博', icon: '微', color: '#E6162D' },
  { id: 'baidu', name: '百度', icon: '百', color: '#2932E1' },
  { id: 'douyin', name: '抖音', icon: '抖', color: '#000000' },
  { id: 'github', name: 'GitHub', icon: 'G', color: '#24292E' },
  { id: 'juejin', name: '掘金', icon: '掘', color: '#1E80FF' },
  { id: 'v2ex', name: 'V2EX', icon: 'V', color: '#778087' },
];

const mockTrendingData = {
  zhihu: [
    { id: '1', title: '如何看待 2026 年春节档电影票房创新高？', hot_value: '1234万', tag: '热', category: '娱乐' },
    { id: '2', title: 'AI 技术会取代程序员吗？', hot_value: '987万', tag: '新', category: '科技' },
    { id: '3', title: '年轻人为什么越来越不愿意结婚？', hot_value: '856万', tag: '', category: '社会' },
    { id: '4', title: '如何评价最新发布的 iPhone 18？', hot_value: '745万', tag: '热', category: '数码' },
    { id: '5', title: '在北京月薪 3 万是什么体验？', hot_value: '698万', tag: '', category: '职场' },
    { id: '6', title: '为什么很多人觉得工作没有意义？', hot_value: '623万', tag: '', category: '职场' },
    { id: '7', title: '如何看待某明星官宣恋情？', hot_value: '589万', tag: '爆', category: '娱乐' },
    { id: '8', title: '程序员如何保持身体健康？', hot_value: '534万', tag: '', category: '健康' },
    { id: '9', title: '2026 年最值得学习的编程语言是什么？', hot_value: '498万', tag: '', category: '科技' },
    { id: '10', title: '如何看待 00 后整顿职场？', hot_value: '467万', tag: '热', category: '职场' },
    { id: '11', title: '为什么现在的年轻人都喜欢躺平？', hot_value: '423万', tag: '', category: '社会' },
    { id: '12', title: '如何评价最新的国产芯片技术？', hot_value: '398万', tag: '新', category: '科技' },
  ],
  weibo: [
    { id: '1', title: '#春节档票房破百亿#', hot_value: '5678万', tag: '热', category: '娱乐' },
    { id: '2', title: '#某某明星结婚#', hot_value: '4532万', tag: '爆', category: '娱乐' },
    { id: '3', title: '#AI 绘画引发争议#', hot_value: '3421万', tag: '新', category: '科技' },
    { id: '4', title: '#今日份的快乐#', hot_value: '2987万', tag: '', category: '生活' },
    { id: '5', title: '#打工人的一天#', hot_value: '2654万', tag: '', category: '职场' },
    { id: '6', title: '#美食分享#', hot_value: '2398万', tag: '', category: '美食' },
    { id: '7', title: '#旅行vlog#', hot_value: '2156万', tag: '', category: '旅游' },
    { id: '8', title: '#健身打卡#', hot_value: '1987万', tag: '', category: '健康' },
    { id: '9', title: '#今日穿搭#', hot_value: '1823万', tag: '', category: '时尚' },
    { id: '10', title: '#宠物日常#', hot_value: '1698万', tag: '', category: '宠物' },
    { id: '11', title: '#学习笔记#', hot_value: '1534万', tag: '', category: '教育' },
    { id: '12', title: '#摄影分享#', hot_value: '1423万', tag: '', category: '摄影' },
  ],
  baidu: [
    { id: '1', title: '春节假期高速免费时间', hot_value: '4532123', tag: '热', category: '生活' },
    { id: '2', title: '2026 年春晚节目单', hot_value: '3987654', tag: '新', category: '娱乐' },
    { id: '3', title: 'iPhone 18 发布时间', hot_value: '3456789', tag: '', category: '数码' },
    { id: '4', title: '今日油价调整', hot_value: '2987456', tag: '', category: '财经' },
    { id: '5', title: '天气预报查询', hot_value: '2654321', tag: '', category: '生活' },
    { id: '6', title: '股市行情分析', hot_value: '2398765', tag: '', category: '财经' },
    { id: '7', title: '最新疫情数据', hot_value: '2156432', tag: '', category: '健康' },
    { id: '8', title: '高考志愿填报', hot_value: '1987654', tag: '', category: '教育' },
    { id: '9', title: '房价走势预测', hot_value: '1823456', tag: '', category: '房产' },
    { id: '10', title: '汽车报价查询', hot_value: '1698765', tag: '', category: '汽车' },
    { id: '11', title: '旅游景点推荐', hot_value: '1534567', tag: '', category: '旅游' },
    { id: '12', title: '美食菜谱大全', hot_value: '1423456', tag: '', category: '美食' },
  ],
};

export default function TrendingPage() {
  const [activePlatform, setActivePlatform] = useState('zhihu');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 模拟刷新
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const currentData = mockTrendingData[activePlatform as keyof typeof mockTrendingData] || [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.headerContent}>
            <h1 className={styles.title}>热搜榜</h1>
            <p className={styles.subtitle}>实时热点，一网打尽</p>
          </div>
          <button 
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <svg 
              className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`}
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            {isRefreshing ? '刷新中...' : '刷新'}
          </button>
        </motion.div>

        {/* Platform Tabs */}
        <motion.div
          className={styles.platformTabs}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {mockPlatforms.map((platform) => (
            <button
              key={platform.id}
              className={`${styles.platformTab} ${activePlatform === platform.id ? styles.active : ''}`}
              onClick={() => setActivePlatform(platform.id)}
              style={{
                '--platform-color': platform.color,
              } as React.CSSProperties}
            >
              <span className={styles.platformIcon}>{platform.icon}</span>
              <span className={styles.platformName}>{platform.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Trending List */}
        <div className={styles.trendingGrid}>
          {currentData.map((item, index) => (
            <motion.article
              key={item.id}
              className={styles.trendingCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <a href="#" className={styles.cardLink}>
                {/* Rank */}
                <div className={`${styles.rank} ${index < 3 ? styles[`rank${index + 1}`] : ''}`}>
                  {index + 1}
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {item.title}
                    {item.tag && (
                      <span className={`${styles.tag} ${styles[`tag${item.tag}`]}`}>
                        {item.tag}
                      </span>
                    )}
                  </h3>
                  <div className={styles.cardMeta}>
                    <span className={styles.category}>{item.category}</span>
                    <span className={styles.hotValue}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      {item.hot_value}
                    </span>
                  </div>
                </div>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

