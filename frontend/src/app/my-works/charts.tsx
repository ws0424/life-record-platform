'use client';

import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import styles from './stats.module.css';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: ChartData[];
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
        },
      },
      axisLabel: {
        color: 'var(--text-tertiary)',
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
          opacity: 0.3,
        },
      },
    },
    yAxis: {
      type: 'category',
      data: data.map(item => item.label),
      axisLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
        },
      },
      axisLabel: {
        color: 'var(--text-secondary)',
      },
    },
    series: [
      {
        type: 'bar',
        data: data.map(item => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          color: 'var(--text-secondary)',
          fontSize: 12,
        },
        animationDuration: 1000,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <motion.div
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}

interface PieChartProps {
  data: ChartData[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: 'var(--text-secondary)',
      },
      itemGap: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: 'var(--bg-primary)',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: 'var(--text-secondary)',
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data: data.map(item => ({
          name: item.label,
          value: item.value,
          itemStyle: {
            color: item.color,
          },
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDuration: 1000,
      },
    ],
  };

  return (
    <motion.div
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}

interface LineChartProps {
  data: { date: string; value: number }[];
  title: string;
  color: string;
}

export function LineChart({ data, title, color }: LineChartProps) {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
        },
      },
      axisLabel: {
        color: 'var(--text-tertiary)',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
        },
      },
      axisLabel: {
        color: 'var(--text-tertiary)',
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
          opacity: 0.3,
        },
      },
    },
    series: [
      {
        type: 'line',
        data: data.map(item => item.value),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: color,
          width: 3,
        },
        itemStyle: {
          color: color,
          borderWidth: 2,
          borderColor: '#fff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color + '40', // 透明度 25%
              },
              {
                offset: 1,
                color: color + '00', // 完全透明
              },
            ],
          },
        },
        animationDuration: 1500,
        animationEasing: 'cubicOut',
      },
    ],
  };

  return (
    <motion.div
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}

interface RadarChartProps {
  data: {
    name: string;
    values: number[];
  }[];
  indicators: string[];
  title: string;
}

export function RadarChart({ data, indicators, title }: RadarChartProps) {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      bottom: '5%',
      textStyle: {
        color: 'var(--text-secondary)',
      },
    },
    radar: {
      indicator: indicators.map(name => ({ name, max: 100 })),
      center: ['50%', '50%'],
      radius: '60%',
      axisName: {
        color: 'var(--text-secondary)',
        fontSize: 12,
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(124, 58, 237, 0.05)', 'rgba(124, 58, 237, 0.1)'],
        },
      },
      splitLine: {
        lineStyle: {
          color: 'var(--border-secondary)',
        },
      },
    },
    series: [
      {
        type: 'radar',
        data: data.map((item, index) => ({
          name: item.name,
          value: item.values,
          areaStyle: {
            opacity: 0.3,
          },
          lineStyle: {
            width: 2,
          },
        })),
        animationDuration: 1000,
      },
    ],
  };

  return (
    <motion.div
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}

interface StatsOverviewProps {
  stats: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    avgViewsPerContent: number;
    avgLikesPerContent: number;
    avgCommentsPerContent: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    { label: '总浏览量', value: stats.totalViews, icon: '👀', color: '#7C3AED' },
    { label: '总点赞数', value: stats.totalLikes, icon: '❤️', color: '#F97316' },
    { label: '总评论数', value: stats.totalComments, icon: '💬', color: '#10B981' },
    { label: '平均浏览', value: stats.avgViewsPerContent.toFixed(1), icon: '📊', color: '#3B82F6' },
    { label: '平均点赞', value: stats.avgLikesPerContent.toFixed(1), icon: '⭐', color: '#F59E0B' },
    { label: '平均评论', value: stats.avgCommentsPerContent.toFixed(1), icon: '💭', color: '#8B5CF6' },
  ];

  return (
    <div className={styles.statsOverview}>
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className={styles.statItem}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className={styles.statIcon} style={{ color: item.color }}>
            {item.icon}
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue} style={{ color: item.color }}>
              {item.value}
            </div>
            <div className={styles.statLabel}>{item.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface GaugeChartProps {
  value: number;
  title: string;
  max?: number;
}

export function GaugeChart({ value, title, max = 100 }: GaugeChartProps) {
  const option: EChartsOption = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: 'var(--text-primary)',
        fontSize: 16,
        fontWeight: 600,
      },
    },
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: max,
        center: ['50%', '70%'],
        radius: '90%',
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width: 6,
            color: [
              [0.3, '#10B981'],
              [0.7, '#F59E0B'],
              [1, '#EF4444'],
            ],
          },
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2,
          },
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5,
          },
        },
        axisLabel: {
          color: 'var(--text-tertiary)',
          fontSize: 12,
          distance: -60,
        },
        title: {
          offsetCenter: [0, '-10%'],
          fontSize: 14,
          color: 'var(--text-secondary)',
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: '{value}',
          color: 'auto',
        },
        data: [
          {
            value: value,
            name: '',
          },
        ],
      },
    ],
  };

  return (
    <motion.div
      className={styles.chartContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}
