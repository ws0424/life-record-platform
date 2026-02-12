/**
 * 视频处理工具函数
 */

/**
 * 从视频文件生成封面图
 * @param videoFile 视频文件
 * @param time 截取时间（秒），默认第1秒
 * @returns Promise<Blob> 封面图片 Blob
 */
export async function generateVideoThumbnail(
  videoFile: File,
  time: number = 1
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    // 创建视频 URL
    const videoURL = URL.createObjectURL(videoFile);
    video.src = videoURL;

    video.addEventListener('loadedmetadata', () => {
      // 设置 canvas 尺寸
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 跳转到指定时间
      video.currentTime = Math.min(time, video.duration);
    });

    video.addEventListener('seeked', () => {
      try {
        // 绘制视频帧到 canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换为 Blob
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(videoURL);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('生成封面失败'));
            }
          },
          'image/jpeg',
          0.8
        );
      } catch (error) {
        URL.revokeObjectURL(videoURL);
        reject(error);
      }
    });

    video.addEventListener('error', (e) => {
      URL.revokeObjectURL(videoURL);
      reject(new Error('视频加载失败'));
    });

    // 开始加载视频
    video.load();
  });
}

/**
 * 从视频 URL 生成封面图
 * @param videoUrl 视频 URL
 * @param time 截取时间（秒），默认第1秒
 * @returns Promise<string> 封面图片 Data URL
 */
export async function generateThumbnailFromUrl(
  videoUrl: string,
  time: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('无法创建 Canvas 上下文'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = Math.min(time, video.duration);
    });

    video.addEventListener('seeked', () => {
      try {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      }
    });

    video.addEventListener('error', () => {
      reject(new Error('视频加载失败'));
    });

    video.load();
  });
}

/**
 * 获取视频时长
 * @param videoFile 视频文件
 * @returns Promise<number> 视频时长（秒）
 */
export async function getVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const videoURL = URL.createObjectURL(videoFile);
    video.src = videoURL;

    video.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(videoURL);
      resolve(video.duration);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(videoURL);
      reject(new Error('无法获取视频时长'));
    });

    video.load();
  });
}

/**
 * 格式化视频时长
 * @param seconds 秒数
 * @returns 格式化的时长字符串（如：01:23）
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

