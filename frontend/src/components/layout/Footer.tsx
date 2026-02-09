'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.title}>生活记录平台</h3>
            <p className={styles.description}>
              记录生活的每一个精彩瞬间，分享你的故事和旅程。
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>快速链接</h4>
            <ul className={styles.links}>
              <li><Link href="/daily">日常记录</Link></li>
              <li><Link href="/albums">相册</Link></li>
              <li><Link href="/travel">旅游路线</Link></li>
              <li><Link href="/tools">小工具</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>关于</h4>
            <ul className={styles.links}>
              <li><Link href="/about">关于我们</Link></li>
              <li><Link href="/privacy">隐私政策</Link></li>
              <li><Link href="/terms">服务条款</Link></li>
              <li><Link href="/contact">联系我们</Link></li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>关注我们</h4>
            <div className={styles.social}>
              <a href="#" aria-label="GitHub" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="WeChat" className={styles.socialLink}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01.181-.556c1.52-1.186 2.506-2.952 2.506-4.942 0-3.598-3.42-6.747-7.069-6.799zm-2.16 4.292c.513 0 .926.421.926.938a.932.932 0 01-.926.937.932.932 0 01-.926-.937c0-.517.413-.938.926-.938zm4.32 0c.513 0 .926.421.926.938a.932.932 0 01-.926.937.932.932 0 01-.926-.937c0-.517.413-.938.926-.938z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} 生活记录平台. All rights reserved.
          </p>
          <p className={styles.tech}>
            Built with Next.js & FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}

