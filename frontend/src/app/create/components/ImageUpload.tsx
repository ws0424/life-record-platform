/**
 * 图片上传组件 - 使用 Ant Design Upload
 */

import { memo, useState } from 'react';
import { Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

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
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: File, fileList: File[]) => {
    // 验证文件类型
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件！');
      return Upload.LIST_IGNORE;
    }

    // 验证文件大小（10MB）
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('图片大小不能超过 10MB！');
      return Upload.LIST_IGNORE;
    }

    // 调用父组件的上传回调
    onUpload([file]);
    
    // 阻止自动上传
    return false;
  };

  const handleRemove = (file: UploadFile) => {
    const index = fileList.indexOf(file);
    if (index > -1) {
      onRemove(index);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined style={{ fontSize: 24 }} />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </button>
  );

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
        图片（最多{maxCount}张）
      </div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
        maxCount={maxCount}
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp"
      >
        {fileList.length >= maxCount ? null : uploadButton}
      </Upload>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

