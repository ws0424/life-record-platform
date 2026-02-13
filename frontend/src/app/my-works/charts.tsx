import { motion } from 'framer-motion';
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
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.barChart}>
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            className={styles.barItem}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className={styles.barLabel}>{item.label}</div>
            <div className={styles.barWrapper}>
              <motion.div
                className={styles.bar}
                style={{ 
                  background: item.color,
                  width: `${(item.value / maxValue) * 100}%`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
              />
              <span className={styles.barValue}>{item.value}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface PieChartProps {
  data: ChartData[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  const segments = data.map(item => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <div className={styles.pieChart}>
        <svg viewBox="0 0 200 200" className={styles.pieSvg}>
          {segments.map((segment, index) => {
            const startAngle = (segment.startAngle - 90) * (Math.PI / 180);
            const endAngle = (segment.endAngle - 90) * (Math.PI / 180);
            const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

            const x1 = 100 + 80 * Math.cos(startAngle);
            const y1 = 100 + 80 * Math.sin(startAngle);
            const x2 = 100 + 80 * Math.cos(endAngle);
            const y2 = 100 + 80 * Math.sin(endAngle);

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
              `Z`,
            ].join(' ');

            return (
              <motion.path
                key={segment.label}
                d={pathData}
                fill={segment.color}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
        </svg>
        <div className={styles.pieLegend}>
          {segments.map((segment, index) => (
            <motion.div
              key={segment.label}
              className={styles.legendItem}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={styles.legendColor}
                style={{ background: segment.color }}
              />
              <span className={styles.legendLabel}>
                {segment.label}: {segment.value} ({segment.percentage.toFixed(1)}%)
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { date: string; value: number }[];
  title: string;
  color: string;
}

export function LineChart({ data, title, color }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const width = 600;
  const height = 300;
  const padding = 40;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - (item.value / maxValue) * (height - 2 * padding);
    return { x, y, ...item };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.lineSvg}>
        {/* 网格线 */}
        {[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i / 4) * (height - 2 * padding);
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="var(--border-secondary)"
              strokeWidth="1"
              opacity="0.3"
            />
          );
        })}

        {/* 折线 */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* 数据点 */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          />
        ))}

        {/* X 轴标签 */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="var(--text-tertiary)"
          >
            {point.date}
          </text>
        ))}
      </svg>
    </div>
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

