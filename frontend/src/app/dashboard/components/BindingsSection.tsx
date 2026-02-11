'use client';

import styles from '../page.module.css';

export function BindingsSection() {
  const bindings = [
    { id: 'wechat', name: '微信', icon: '💬', bound: false },
    { id: 'github', name: 'GitHub', icon: '🐙', bound: false },
    { id: 'google', name: 'Google', icon: '🔍', bound: false },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>账号绑定</h2>
      <div className={styles.bindingList}>
        {bindings.map((binding) => (
          <div key={binding.id} className={styles.bindingItem}>
            <div className={styles.bindingIcon}>{binding.icon}</div>
            <div className={styles.bindingInfo}>
              <h4>{binding.name}</h4>
              <p>
                {binding.bound ? (
                  <span className={styles.bound}>已绑定</span>
                ) : (
                  <span className={styles.unbound}>未绑定</span>
                )}
              </p>
            </div>
            <button className={styles.bindBtn}>
              {binding.bound ? '解绑' : '绑定'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

