'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, Checkbox, Slider, message, Input } from 'antd';
import { CopyOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import styles from './page.module.css';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
      message.warning('请至少选择一种字符类型');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!password) {
      message.warning('请先生成密码');
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      message.success('密码已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error('复制失败');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { text: '', color: '', percent: 0 };

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 15;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) strength += 15;

    if (strength < 40) return { text: '弱', color: '#ff4d4f', percent: strength };
    if (strength < 70) return { text: '中', color: '#faad14', percent: strength };
    return { text: '强', color: '#52c41a', percent: strength };
  };

  const strength = getPasswordStrength();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>密码生成器</h1>
          <p className={styles.subtitle}>生成安全的随机密码</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={styles.card}>
            <div className={styles.passwordDisplay}>
              <Input
                value={password}
                readOnly
                placeholder="点击生成密码"
                size="large"
                className={styles.passwordInput}
              />
              <Button
                type="primary"
                size="large"
                icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                onClick={copyToClipboard}
                className={styles.copyButton}
              >
                {copied ? '已复制' : '复制'}
              </Button>
            </div>

            {password && (
              <div className={styles.strengthBar}>
                <div className={styles.strengthLabel}>
                  密码强度: <span style={{ color: strength.color }}>{strength.text}</span>
                </div>
                <div className={styles.strengthProgress}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width: `${strength.percent}%`,
                      background: strength.color,
                    }}
                  />
                </div>
              </div>
            )}

            <div className={styles.options}>
              <div className={styles.optionItem}>
                <label className={styles.optionLabel}>密码长度: {length}</label>
                <Slider
                  min={6}
                  max={32}
                  value={length}
                  onChange={setLength}
                  className={styles.slider}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <Checkbox
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                >
                  包含大写字母 (A-Z)
                </Checkbox>
                <Checkbox
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                >
                  包含小写字母 (a-z)
                </Checkbox>
                <Checkbox
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                >
                  包含数字 (0-9)
                </Checkbox>
                <Checkbox
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                >
                  包含符号 (!@#$%^&*)
                </Checkbox>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ReloadOutlined />}
              onClick={generatePassword}
              className={styles.generateButton}
            >
              生成密码
            </Button>

            <div className={styles.tips}>
              <h3>💡 密码安全提示</h3>
              <ul>
                <li>使用至少 12 个字符的密码</li>
                <li>混合使用大小写字母、数字和符号</li>
                <li>不要在多个网站使用相同的密码</li>
                <li>定期更换密码</li>
                <li>不要与他人分享密码</li>
              </ul>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

