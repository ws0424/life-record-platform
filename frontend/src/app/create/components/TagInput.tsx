/**
 * 标签输入组件 - 使用 Ant Design Tag 和 Input
 */

import { memo, useCallback, useState, useRef } from 'react';
import { Tag, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

interface TagInputProps {
  /** 标签列表 */
  tags: string[];
  /** 添加标签回调 */
  onAdd: (tag: string) => void;
  /** 删除标签回调 */
  onRemove: (tag: string) => void;
}

export const TagInput = memo<TagInputProps>(({ tags, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputVisible, setInputVisible] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const showInput = () => {
    setInputVisible(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleInputConfirm = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onAdd(trimmedValue);
    }
    setInputValue('');
    setInputVisible(false);
  }, [inputValue, tags, onAdd]);

  const handleClose = (removedTag: string) => {
    onRemove(removedTag);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
        标签
      </div>
      <Space size={[8, 8]} wrap>
        {tags.map((tag) => (
          <Tag
            key={tag}
            closable
            onClose={() => handleClose(tag)}
            style={{
              fontSize: 14,
              padding: '4px 12px',
              borderRadius: 8,
            }}
          >
            {tag}
          </Tag>
        ))}
        {inputVisible ? (
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
              padding: '4px 12px',
              borderRadius: 8,
              cursor: 'pointer',
              borderStyle: 'dashed',
            }}
          >
            <PlusOutlined /> 添加标签
          </Tag>
        )}
      </Space>
    </div>
  );
});

TagInput.displayName = 'TagInput';

