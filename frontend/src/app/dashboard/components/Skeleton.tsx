import styles from './Skeleton.module.css';

export function ProfileSkeleton() {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton} />
        <div className={styles.buttonSkeleton} />
      </div>
      <div className={styles.form}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={styles.formGroup}>
            <div className={styles.labelSkeleton} />
            <div className={styles.inputSkeleton} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SecuritySkeleton() {
  return (
    <div className={styles.section}>
      <div className={styles.titleSkeleton} />
      <div className={styles.overviewGrid}>
        {[1, 2].map((i) => (
          <div key={i} className={styles.overviewCardSkeleton} />
        ))}
      </div>
      <div className={styles.cardList}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.cardSkeleton} />
        ))}
      </div>
    </div>
  );
}

export function ActivitySkeleton() {
  return (
    <div className={styles.section}>
      <div className={styles.titleSkeleton} />
      <div className={styles.list}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.listItemSkeleton}>
            <div className={styles.iconSkeleton} />
            <div className={styles.contentSkeleton}>
              <div className={styles.textSkeleton} />
              <div className={styles.textSmallSkeleton} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DevicesSkeleton() {
  return (
    <div className={styles.section}>
      <div className={styles.titleSkeleton} />
      <div className={styles.list}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.listItemSkeleton}>
            <div className={styles.iconSkeleton} />
            <div className={styles.contentSkeleton}>
              <div className={styles.textSkeleton} />
              <div className={styles.textSmallSkeleton} />
            </div>
            <div className={styles.buttonGroupSkeleton}>
              <div className={styles.buttonSkeleton} />
              <div className={styles.buttonSkeleton} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

