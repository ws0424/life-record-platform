'use client';

import { useState } from 'react';
import { Upload, Button, Progress, message, Card, Space } from 'antd';
import { UploadOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { uploadFileInChunks, validateFileType, formatFileSize } from '@/lib/utils/chunkUpload';
import { generateVideoThumbnail } from '@/lib/utils/videoUtils';
import { uploadImage } from '@/lib/api/upload';
import styles from './VideoUpload.module.css';

interface VideoUploadProps {
  value?: string[];
  onChange?: (urls: string[]) => void;
  onThumbnailChange?: (thumbnails: string[]) => void;
  maxCount?: number;
  maxSize?: number; // MB
}

interface VideoItem {
  uid: string;
  name: string;
  url?: string;
  thumbnail?: string;
  status: 'uploading' | 'done' | 'error';
  progress: number;
  size: number;
}

export default function VideoUpload({
  value = [],
  onChange,
  onThumbnailChange,
  maxCount = 5,
  maxSize = 500, // 默认最大 500MB
}: VideoUploadProps) {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // 允许的视频格式
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
  ];

  const handleUpload = async (file: File) => {
    // 验证文件类型
    if (!validateFileType(file, allowedTypes)) {
      message.error('只支持 MP4、WebM、OGG、MOV、AVI 格式的视频');
      return false;
    }

    // 验证文件大小
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      message.error(`视频大小不能超过 ${maxSize}MB`);
      return false;
    }

    // 检查数量限制
    if (videos.length >= maxCount) {
      message.error(`最多只能上传 ${maxCount} 个视频`);
      return false;
    }

    const videoItem: VideoItem = {
      uid: `${Date.now()}-${Math.random()}`,
      name: file.name,
      status: 'uploading',
      progress: 0,
      size: file.size,
    };

    setVideos(prev => [...prev, videoItem]);
    setUploading(true);

    try {
      // 1. 生成视频封面
      message.loading({ content: '正在生成视频封面...', key: 'thumbnail' });
      const thumbnailBlob = await generateVideoThumbnail(file, 1);
      
      // 2. 上传封面图片
      const thumbnailFile = new File([thumbnailBlob], `${file.name}_thumbnail.jpg`, {
        type: 'image/jpeg',
      });
      const thumbnailUrl = await uploadImage(thumbnailFile);
      message.success({ content: '视频封面生成成功', key: 'thumbnail' });

      // 3. 上传视频文件（使用切片上传）
      const result = await uploadFileInChunks({
        file,
        onProgress: (progress) => {
          setVideos(prev =>
            prev.map(v =>
              v.uid === videoItem.uid
                ? { ...v, progress }
                : v
            )
          );
        },
      });

      // 4. 上传成功，更新本地状态
      const updatedVideos = videos.map(v =>
          v.uid === videoItem.uid
          ? { ...v, status: 'done' as const, url: result.url, thumbnail: thumbnailUrl, progress: 100 }
            : v
      );
      const newVideo = { ...videoItem, status: 'done' as const, url: result.url, thumbnail: thumbnailUrl, progress: 100 };
      const allVideos = [...videos.filter(v => v.uid !== videoItem.uid), newVideo];

      setVideos(allVideos);

      // 5. 更新父组件 - 视频 URL 列表
      const newUrls = [...value, result.url];
      onChange?.(newUrls);
      
      // 6. 更新父组件 - 封面列表
      const allThumbnails = allVideos
        .filter(v => v.status === 'done' && v.thumbnail)
        .map(v => v.thumbnail!);
      onThumbnailChange?.(allThumbnails);
      
      console.log('✅ 视频上传成功:', {
        videoUrl: result.url,
        thumbnailUrl,
        allUrls: newUrls,
        allThumbnails
      });

      message.success('视频上传成功');
    } catch (error: any) {
      console.error('视频上传失败:', error);
      
      // 上传失败
      setVideos(prev =>
        prev.map(v =>
          v.uid === videoItem.uid
            ? { ...v, status: 'error' }
            : v
        )
      );

      message.error(error.message || '视频上传失败');
    } finally {
      setUploading(false);
    }

    return false; // 阻止默认上传行为
  };

  const handleRemove = (uid: string) => {
    const video = videos.find(v => v.uid === uid);
    if (!video) return;

    setVideos(prev => prev.filter(v => v.uid !== uid));

    if (video.url) {
      const newUrls = value.filter(url => url !== video.url);
      onChange?.(newUrls);
      
      // 更新封面列表
      const newThumbnails = videos
        .filter(v => v.uid !== uid && v.thumbnail)
        .map(v => v.thumbnail!);
      onThumbnailChange?.(newThumbnails);
    }
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className={styles.container}>
      <Upload
        beforeUpload={handleUpload}
        showUploadList={false}
        multiple
        accept="video/*"
        disabled={uploading || videos.length >= maxCount}
      >
        <Button
          icon={<UploadOutlined />}
          disabled={uploading || videos.length >= maxCount}
          size="large"
        >
          {uploading ? '上传中...' : '选择视频'}
        </Button>
      </Upload>

      <div className={styles.hint}>
        支持 MP4、WebM、OGG、MOV、AVI 格式，单个文件最大 {maxSize}MB，最多 {maxCount} 个视频
      </div>

      {videos.length > 0 && (
        <div className={styles.videoList}>
          {videos.map(video => (
            <Card
              key={video.uid}
              className={styles.videoCard}
              size="small"
            >
              <div className={styles.videoInfo}>
                <div className={styles.videoIcon}>
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.name}
                      style={{ 
                        width: 64, 
                        height: 64, 
                        objectFit: 'cover',
                        borderRadius: 4
                      }} 
                    />
                  ) : (
                  <PlayCircleOutlined style={{ fontSize: 32, color: 'var(--color-primary)' }} />
                  )}
                </div>
                <div className={styles.videoDetails}>
                  <div className={styles.videoName} title={video.name}>
                    {video.name}
                  </div>
                  <div className={styles.videoSize}>
                    {formatFileSize(video.size)}
                  </div>
                  {video.status === 'uploading' && (
                    <Progress
                      percent={video.progress}
                      size="small"
                      status="active"
                    />
                  )}
                  {video.status === 'error' && (
                    <div className={styles.errorText}>上传失败</div>
                  )}
                  {video.status === 'done' && (
                    <div className={styles.successText}>上传成功</div>
                  )}
                </div>
                <div className={styles.videoActions}>
                  {video.status === 'done' && video.url && (
                    <Button
                      type="link"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handlePreview(video.url!)}
                    >
                      预览
                    </Button>
                  )}
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemove(video.uid)}
                    disabled={video.status === 'uploading'}
                  >
                    删除
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

