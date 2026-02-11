import type { ThemeConfig } from 'antd';

/**
 * Ant Design 主题配置
 * 基于 Vibrant Rose 主题色系
 */
export const antdTheme: ThemeConfig = {
  token: {
    // 主色调 - Vibrant Rose
    colorPrimary: '#E11D48',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',
    colorInfo: '#3B82F6',
    
    // 文本颜色
    colorText: '#881337',
    colorTextSecondary: '#9F1239',
    colorTextTertiary: '#BE123C',
    colorTextQuaternary: '#FDA4AF',
    
    // 背景颜色
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#FFFFFF',
    colorBgLayout: '#FFF1F2',
    colorBgSpotlight: '#FFE4E6',
    
    // 边框颜色
    colorBorder: '#FECDD3',
    colorBorderSecondary: '#FED7E2',
    
    // 圆角
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 4,
    
    // 字体
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 16,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 18,
    
    // 阴影
    boxShadow: '0 4px 6px rgba(225, 29, 72, 0.1)',
    boxShadowSecondary: '0 1px 2px rgba(225, 29, 72, 0.05)',
    
    // 动画
    motionDurationFast: '0.15s',
    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      colorPrimaryHover: '#BE123C',
      colorPrimaryActive: '#9F1239',
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      fontWeight: 600,
    },
    Input: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingBlock: 12,
      paddingInline: 16,
    },
    Select: {
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 6px rgba(225, 29, 72, 0.1)',
    },
    Table: {
      borderRadius: 12,
      headerBg: '#FFE4E6',
      headerColor: '#881337',
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Message: {
      contentBg: '#FFFFFF',
      borderRadiusLG: 12,
    },
    Notification: {
      borderRadiusLG: 12,
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Tabs: {
      itemActiveColor: '#E11D48',
      itemHoverColor: '#FB7185',
      itemSelectedColor: '#E11D48',
    },
  },
};

/**
 * 暗色主题配置
 */
export const antdDarkTheme: ThemeConfig = {
  token: {
    // 主色调 - Vibrant Rose (暗色模式)
    colorPrimary: '#FB7185',
    colorSuccess: '#34D399',
    colorWarning: '#FBBF24',
    colorError: '#F87171',
    colorInfo: '#60A5FA',
    
    // 文本颜色
    colorText: '#FECDD3',
    colorTextSecondary: '#FDA4AF',
    colorTextTertiary: '#FB7185',
    colorTextQuaternary: '#881337',
    
    // 背景颜色
    colorBgContainer: '#1A1215',
    colorBgElevated: '#1A1215',
    colorBgLayout: '#0F0A0D',
    colorBgSpotlight: '#251A1E',
    
    // 边框颜色
    colorBorder: '#4C0519',
    colorBorderSecondary: '#3A0412',
    
    // 圆角
    borderRadius: 12,
    borderRadiusLG: 16,
    borderRadiusSM: 8,
    borderRadiusXS: 4,
    
    // 字体
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 16,
    
    // 阴影
    boxShadow: '0 4px 6px rgba(251, 113, 133, 0.15)',
    boxShadowSecondary: '0 1px 2px rgba(251, 113, 133, 0.1)',
  },
  components: {
    Button: {
      primaryColor: '#0F0A0D',
      colorPrimaryHover: '#F43F5E',
      colorPrimaryActive: '#E11D48',
    },
    Card: {
      borderRadiusLG: 16,
      boxShadowTertiary: '0 4px 6px rgba(251, 113, 133, 0.15)',
    },
    Table: {
      headerBg: '#251A1E',
      headerColor: '#FECDD3',
    },
  },
};

