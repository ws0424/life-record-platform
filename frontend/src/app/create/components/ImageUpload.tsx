/**
 * 图片上传组件
 */

import { memo, useCallback } from 'react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
  /** 预览图片列表 */
  previews: string[];
  /** 最大上传数量 */
  maxCount: number;
  /** 上传回调 */
  onUpload: (files: File[]) => void;
  /** 删除回调 */
  onRemove: (index: number) => void;
}

export const ImageUpload = memo<ImageUploadProps>(({ 
  previews, 
  maxCount, 
  onUpload, 
  onRemove 
}) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
    // 重置 input，允许重复选择同一文件
    e.target.value = '';
  }, [onUpload]);

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>图片（最多{maxCount}张）</label>
      <div className={styles.imageUpload}>
        {previews.map((preview, index) => (
          <div key={index} className={styles.imagePreview}>
            <img src={preview} alt={`预览 ${index + 1}`} />
            <button
              type="button"
              className={styles.removeImage}
              onClick={() => onRemove(index)}
              aria-label={`删除图片 ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
        {previews.length < maxCount && (
          <label className={styles.uploadBtn}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              onChange={handleFileChange}
              className={styles.fileInput}
              aria-label="上传图片"
            />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>上传图片</span>
          </label>
        )}
      </div>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

