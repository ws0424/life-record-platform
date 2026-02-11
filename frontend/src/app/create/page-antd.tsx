'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  Card, 
  Space, 
  Tag, 
  Switch, 
  Progress,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  InboxOutlined, 
  DeleteOutlined,
  CloudUploadOutlined 
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { CONTENT_TYPES, MAX_IMAGES, MAX_VIDEOS, MAX_TITLE_LENGTH, MAX_CONTENT_LENGTH } from './constants';
import { validateFormData } from './utils/validation';
import { smartUploadFile } from './utils/uploadUtils';
import type { FormData, ContentType } from './types';
import styles from './page.module.css';

const { TextArea } = Input;
const { Dragger } = Upload;

function CreateContent() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedType, setSelectedType] = useState<ContentType>('daily');
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [videoList, setVideoList] = useState<UploadFile[]>([]);

  // 图片上传配置
  const imageUploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture-card',
    fileList: imageList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过 10MB！');
        return Upload.LIST_IGNORE;
      }
      if (imageList.length >= MAX_IMAGES) {
        message.error(`最多只能上传 ${MAX_IMAGES} 张图片！`);
        return Upload.LIST_IGNORE;
      }
      return false; // 阻止自动上传
    },
    onChange: ({ fileList }) => {
      setImageList(fileList.slice(0, MAX_IMAGES));
    },
    onRemove: (file) => {
      setImageList(imageList.filter(item => item.uid !== file.uid));
    },
  };

  // 视频上传配置
  const videoUploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    listType: 'picture',
    fileList: videoList,
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith('video/');
      if (!isVideo) {
        message.error('只能上传视频文件！');
        return Upload.LIST_IGNORE;
      }
      const isLt500M = file.size / 1024 / 1024 < 500;
      if (!isLt500M) {
        message.error('视频大小不能超过 500MB！');
        return Upload.LIST_IGNORE;
      }
      if (videoList.length >= MAX_VIDEOS) {
        message.error(`最多只能上传 ${MAX_VIDEOS} 个视频！`);
        return Upload.LIST_IGNORE;
      }
      return false; // 阻止自动上传
    },
    onChange: ({ fileList }) => {
      setVideoList(fileList.slice(0, MAX_VIDEOS));
    },
    onRemove: (file) => {
      setVideoList(videoList.filter(item => item.uid !== file.uid));
    },
  };

  // 上传文件到服务器
  const uploadFiles = useCallback(async () => {
    const imageUrls: string[] = [];
    const videoUrls: string[] = [];

    try {
      // 上传图片
      for (const file of imageList) {
        if (file.originFileObj) {
          const url = await smartUploadFile(
            file.originFileObj,
            'image',
            (progress) => setUploadProgress(progress)
          );
          imageUrls.push(url);
        }
      }

      // 上传视频
      for (const file of videoList) {
        if (file.originFileObj) {
          const url = await smartUploadFile(
            file.originFileObj,
            'video',
            (progress) => setUploadProgress(progress)
          );
          videoUrls.push(url);
        }
      }

      return { imageUrls, videoUrls };
    } catch (error) {
      console.error('文件上传失败:', error);
      throw error;
    }
  }, [imageList, videoList]);

  // 表单提交
  const handleSubmit = useCallback(async (values: any) => {
    setLoading(true);
    setUploadProgress(0);

    try {
      // 上传文件
      const { imageUrls, videoUrls } = await uploadFiles();

      // 创建内容
      const { createContent } = await import('@/lib/api/content');
      
      await createContent({
        type: selectedType,
        title: values.title,
        description: values.description,
        content: values.content,
        tags: values.tags || [],
        images: imageUrls,
        location: values.location,
        extra_data: {
          videos: videoUrls,
        },
        is_public: values.isPublic ?? true,
      });

      message.success('发布成功！');
      
      // 跳转到对应的列表页
      setTimeout(() => {
        router.push(`/${selectedType}`);
      }, 1000);
    } catch (err: any) {
      console.error('发布失败:', err);
      message.error(err.message || '发布失败，请重试');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [selectedType, router, uploadFiles]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>创建内容</h1>
            <p className={styles.subtitle}>分享你的精彩生活</p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              type: 'daily',
              isPublic: true,
            }}
          >
            {/* 内容类型选择 */}
            <Form.Item label="选择类型" required>
              <Space size="middle" wrap>
                {CONTENT_TYPES.map((type) => (
                  <Card
                    key={type.id}
                    hoverable
                    className={`${styles.typeCard} ${
                      selectedType === type.id ? styles.typeCardActive : ''
                    }`}
                    style={{ borderColor: selectedType === type.id ? type.color : undefined }}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className={styles.typeIcon}>{type.icon}</div>
                    <div className={styles.typeLabel}>{type.label}</div>
                    <div className={styles.typeDescription}>{type.description}</div>
                  </Card>
                ))}
              </Space>
            </Form.Item>

            {/* 标题 */}
            <Form.Item
              label="标题"
              name="title"
              rules={[
                { required: true, message: '请输入标题' },
                { max: MAX_TITLE_LENGTH, message: `标题不能超过 ${MAX_TITLE_LENGTH} 个字符` },
              ]}
            >
              <Input
                placeholder="给你的内容起个标题..."
                maxLength={MAX_TITLE_LENGTH}
                showCount
                size="large"
              />
            </Form.Item>

            {/* 描述 */}
            <Form.Item
              label="描述"
              name="description"
              rules={[
                { max: 500, message: '描述不能超过 500 个字符' },
              ]}
            >
              <TextArea
                placeholder="简单描述一下..."
                maxLength={500}
                showCount
                rows={2}
              />
            </Form.Item>

            {/* 内容 */}
            <Form.Item
              label="内容"
              name="content"
              rules={[
                { required: true, message: '请输入内容' },
                { max: MAX_CONTENT_LENGTH, message: `内容不能超过 ${MAX_CONTENT_LENGTH} 个字符` },
              ]}
            >
              <TextArea
                placeholder="分享你的故事..."
                maxLength={MAX_CONTENT_LENGTH}
                showCount
                rows={10}
              />
            </Form.Item>

            {/* 图片上传 */}
            <Form.Item label={`图片（最多 ${MAX_IMAGES} 张）`}>
              <Upload {...imageUploadProps}>
                {imageList.length < MAX_IMAGES && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            {/* 视频上传 */}
            <Form.Item label={`视频（最多 ${MAX_VIDEOS} 个）`}>
              <Dragger {...videoUploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽视频文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 MP4、MOV、AVI、WebM 格式，单个文件最大 500MB
                </p>
              </Dragger>
            </Form.Item>

            {/* 位置（旅游路线专用） */}
            {selectedType === 'travel' && (
              <Form.Item
                label="位置"
                name="location"
                rules={[{ required: true, message: '请输入位置' }]}
              >
                <Input placeholder="例如：北京·故宫" size="large" />
              </Form.Item>
            )}

            {/* 标签 */}
            <Form.Item label="标签" name="tags">
              <Select
                mode="tags"
                placeholder="输入标签后按回车添加"
                size="large"
                maxTagCount={10}
              />
            </Form.Item>

            {/* 可见性 */}
            <Form.Item label="可见性" name="isPublic" valuePropName="checked">
              <Switch checkedChildren="公开" unCheckedChildren="私密" />
            </Form.Item>

            {/* 上传进度 */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <Form.Item>
                <Progress percent={uploadProgress} status="active" />
              </Form.Item>
            )}

            {/* 提交按钮 */}
            <Form.Item>
              <Space size="middle">
                <Button
                  type="default"
                  size="large"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={loading}
                  icon={<CloudUploadOutlined />}
                >
                  {loading ? '发布中...' : '发布'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <ProtectedRoute>
      <CreateContent />
    </ProtectedRoute>
  );
}

