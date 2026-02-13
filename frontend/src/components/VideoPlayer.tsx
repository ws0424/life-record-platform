'use client';

import { useEffect, useRef } from 'react';
import Player from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  url: string;
  poster?: string;
  width?: string | number;
  height?: string | number;
  autoplay?: boolean;
  loop?: boolean;
  playbackRate?: number[];
  className?: string;
}

/**
 * 西瓜视频播放器组件
 * 支持多个视频同时存在于页面中
 */
export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  poster,
  width = '100%',
  height = 'auto',
  autoplay = false,
  loop = false,
  playbackRate = [0.5, 0.75, 1, 1.25, 1.5, 2],
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    // 创建播放器实例
    const player = new Player({
      el: containerRef.current,
      url,
      poster,
      width,
      height,
      autoplay,
      loop,
      playbackRate,
      // 播放器配置
      fluid: true, // 流式布局
      fitVideoSize: 'auto', // 自适应视频尺寸
      videoInit: true, // 初始化视频
      // 控制栏配置
      controls: true,
      // 音量配置
      volume: {
        default: 0.6,
      },
      // 进度条配置
      progress: {
        isDrag: true,
      },
      // 语言配置
      lang: 'zh-cn',
      // 移动端配置
      mobile: {
        disableGesture: false, // 启用手势控制
      },
      // 错误处理
      errorTips: '视频加载失败，请稍后重试',
      // 加载提示
      loadingText: '加载中...',
    });

    playerRef.current = player;

    // 清理函数
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url, poster, width, height, autoplay, loop, playbackRate]);

  return (
    <div className={`${styles.videoPlayerContainer} ${className}`}>
      <div ref={containerRef} />
    </div>
  );
};

export default VideoPlayer;

