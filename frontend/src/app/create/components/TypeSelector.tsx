/**
 * 内容类型选择组件
 */

import { memo } from 'react';
import type { ContentType, ContentTypeOption } from '../types';
import styles from './TypeSelector.module.css';

interface TypeSelectorProps {
  /** 当前选中的类型 */
  selectedType: ContentType;
  /** 可选的类型列表 */
  types: readonly ContentTypeOption[];
  /** 类型改变回调 */
  onChange: (type: ContentType) => void;
}

export const TypeSelector = memo<TypeSelectorProps>(({ selectedType, types, onChange }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>选择类型</h2>
      <div className={styles.typeGrid}>
        {types.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`${styles.typeCard} ${
              selectedType === type.id ? styles.active : ''
            }`}
            onClick={() => onChange(type.id)}
            aria-pressed={selectedType === type.id}
          >
            <span className={styles.typeIcon} aria-hidden="true">
              {type.icon}
            </span>
            <span className={styles.typeLabel}>{type.label}</span>
            <span className={styles.typeDescription}>{type.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

TypeSelector.displayName = 'TypeSelector';

