/**
 * 标签输入组件
 */

import { memo, useCallback, useState } from 'react';
import styles from './TagInput.module.css';

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

  const handleAdd = useCallback(() => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onAdd(trimmedValue);
      setInputValue('');
    }
  }, [inputValue, tags, onAdd]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  }, [handleAdd]);

  return (
    <div className={styles.formGroup}>
      <label htmlFor="tag-input" className={styles.label}>
        标签
      </label>
      <div className={styles.tagInput}>
        <input
          id="tag-input"
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入标签后按回车添加"
        />
        <button 
          type="button" 
          className={styles.addTagBtn} 
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          添加
        </button>
      </div>
      {tags.length > 0 && (
        <div className={styles.tagList}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button 
                type="button" 
                onClick={() => onRemove(tag)}
                aria-label={`删除标签 ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

TagInput.displayName = 'TagInput';

