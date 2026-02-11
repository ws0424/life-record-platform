/**
 * 标签选择组件 - 支持热门标签推荐
 */

import { memo, useState, useEffect, useRef } from 'react';
import { Tag, Input, Space, Divider, Spin } from 'antd';
import { PlusOutlined, FireOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { getHotTags } from '@/lib/api/content';

interface TagSelectorProps {
  /** 已选标签列表 */
  tags: string[];
  /** 添加标签回调 */
  onAdd: (tag: string) => void;
  /** 删除标签回调 */
  onRemove: (tag: string) => void;
  /** 最大标签数量 */
  maxCount?: number;
}

interface HotTag {
  name: string;
  count: number;
}

export const TagSelector = memo<TagSelectorProps>(({ 
  tags, 
  onAdd, 
  onRemove,
  maxCount = 10 
}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const [hotTags, setHotTags] = useState<HotTag[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);

  // 获取热门标签
  useEffect(() => {
    fetchHotTags();
  }, []);

  const fetchHotTags = async () => {
    try {
      setLoading(true);
      const tags = await getHotTags(10);
      setHotTags(tags);
    } catch (error) {
      console.error('获取热门标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputConfirm = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      if (tags.length >= maxCount) {
        return;
      }
      onAdd(trimmedValue);
    }
    setInputValue('');
    setInputVisible(false);
  };

  const handleClose = (removedTag: string) => {
    onRemove(removedTag);
  };

  const handleHotTagClick = (tagName: string) => {
    if (!tags.includes(tagName) && tags.length < maxCount) {
      onAdd(tagName);
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ 
        marginBottom: 12, 
        fontSize: 16, 
        fontWeight: 600, 
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        标签
        <span style={{ 
          fontSize: 14, 
          fontWeight: 400, 
          color: 'var(--text-tertiary)' 
        }}>
          （最多{maxCount}个）
        </span>
      </div>

      {/* 已选标签 */}
      <div style={{ 
        marginBottom: 16,
        padding: 16,
        background: 'var(--bg-elevated)',
        borderRadius: 12,
        border: '1px solid var(--border-primary)',
        minHeight: 60,
      }}>
        <Space size={[8, 8]} wrap>
          {tags.map((tag) => (
            <Tag
              key={tag}
              closable
              onClose={() => handleClose(tag)}
              style={{
                fontSize: 14,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                color: 'white',
                border: 'none',
              }}
            >
              {tag}
            </Tag>
          ))}
          {tags.length < maxCount && (
            inputVisible ? (
              <Input
                ref={inputRef}
                type="text"
                size="small"
                style={{ width: 120 }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                placeholder="输入标签"
              />
            ) : (
              <Tag
                onClick={showInput}
                style={{
                  fontSize: 14,
                  padding: '6px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  borderStyle: 'dashed',
                  background: 'transparent',
                }}
              >
                <PlusOutlined /> 添加标签
              </Tag>
            )
          )}
        </Space>
      </div>

      {/* 热门标签推荐 */}
      <div>
        <Divider style={{ margin: '12px 0' }}>
          <span style={{ 
            fontSize: 14, 
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}>
            <FireOutlined style={{ color: 'var(--color-primary)' }} />
            热门标签
          </span>
        </Divider>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <Spin size="small" />
          </div>
        ) : (
          <Space size={[8, 8]} wrap>
            {hotTags.map((hotTag) => {
              const isSelected = tags.includes(hotTag.name);
              const isDisabled = tags.length >= maxCount && !isSelected;
              
              return (
                <Tag
                  key={hotTag.name}
                  onClick={() => !isSelected && !isDisabled && handleHotTagClick(hotTag.name)}
                  style={{
                    fontSize: 13,
                    padding: '4px 10px',
                    borderRadius: 6,
                    cursor: isSelected || isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isSelected || isDisabled ? 0.5 : 1,
                    background: isSelected ? 'var(--color-primary-light)' : 'var(--bg-tertiary)',
                    color: isSelected ? 'var(--color-primary)' : 'var(--text-secondary)',
                    border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--border-secondary)',
                  }}
                >
                  {hotTag.name}
                  {hotTag.count > 0 && (
                    <span style={{ 
                      marginLeft: 4, 
                      fontSize: 12,
                      opacity: 0.7
                    }}>
                      {hotTag.count}
                    </span>
                  )}
                </Tag>
              );
            })}
          </Space>
        )}
      </div>
    </div>
  );
});

TagSelector.displayName = 'TagSelector';

