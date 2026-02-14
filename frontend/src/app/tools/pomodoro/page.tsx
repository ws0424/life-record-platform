'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, InputNumber, message, Progress } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './page.module.css';

type TimerMode = 'work' | 'break' | 'longBreak';

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分钟
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  // 设置
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 创建音频元素
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // 播放提示音
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // 忽略播放错误
      });
    }

    if (mode === 'work') {
      const newCompleted = completedPomodoros + 1;
      setCompletedPomodoros(newCompleted);
      
      if (newCompleted % pomodorosUntilLongBreak === 0) {
        message.success('工作完成！开始长休息');
        setMode('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        message.success('工作完成！开始短休息');
        setMode('break');
        setTimeLeft(breakDuration * 60);
      }
    } else {
      message.success('休息完成！开始工作');
      setMode('work');
      setTimeLeft(workDuration * 60);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (mode === 'break') {
      setTimeLeft(breakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'work') {
      setTimeLeft(workDuration * 60);
    } else if (newMode === 'break') {
      setTimeLeft(breakDuration * 60);
    } else {
      setTimeLeft(longBreakDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalTime = () => {
    if (mode === 'work') return workDuration * 60;
    if (mode === 'break') return breakDuration * 60;
    return longBreakDuration * 60;
  };

  const getProgress = () => {
    const total = getTotalTime();
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = () => {
    if (mode === 'work') return '#667eea';
    if (mode === 'break') return '#52c41a';
    return '#faad14';
  };

  const getModeText = () => {
    if (mode === 'work') return '工作时间';
    if (mode === 'break') return '短休息';
    return '长休息';
  };

  return (
    <div className={styles.page} style={{ background: `linear-gradient(135deg, ${getModeColor()} 0%, #764ba2 100%)` }}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>番茄钟</h1>
          <p className={styles.subtitle}>专注工作，提高效率的时间管理工具</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={styles.card}>
            <div className={styles.modeSelector}>
              <Button
                type={mode === 'work' ? 'primary' : 'default'}
                size="large"
                onClick={() => handleModeChange('work')}
                className={styles.modeButton}
              >
                工作
              </Button>
              <Button
                type={mode === 'break' ? 'primary' : 'default'}
                size="large"
                onClick={() => handleModeChange('break')}
                className={styles.modeButton}
              >
                短休息
              </Button>
              <Button
                type={mode === 'longBreak' ? 'primary' : 'default'}
                size="large"
                onClick={() => handleModeChange('longBreak')}
                className={styles.modeButton}
              >
                长休息
              </Button>
            </div>

            <div className={styles.timerContainer}>
              <div className={styles.modeLabel}>{getModeText()}</div>
              <div className={styles.timer}>{formatTime(timeLeft)}</div>
              <Progress
                type="circle"
                percent={getProgress()}
                strokeColor={getModeColor()}
                format={() => ''}
                width={300}
                strokeWidth={8}
                className={styles.progress}
              />
            </div>

            <div className={styles.controls}>
              {!isRunning ? (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={handleStart}
                  className={styles.controlButton}
                  style={{ background: getModeColor(), borderColor: getModeColor() }}
                >
                  开始
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<PauseCircleOutlined />}
                  onClick={handlePause}
                  className={styles.controlButton}
                  style={{ background: getModeColor(), borderColor: getModeColor() }}
                >
                  暂停
                </Button>
              )}
              <Button
                size="large"
                icon={<ReloadOutlined />}
                onClick={handleReset}
                className={styles.controlButton}
              >
                重置
              </Button>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{completedPomodoros}</div>
                <div className={styles.statLabel}>已完成番茄钟</div>
              </div>
            </div>

            {showSettings ? (
              <div className={styles.settings}>
                <h3>设置</h3>
                <div className={styles.settingItem}>
                  <label>工作时长（分钟）</label>
                  <InputNumber
                    min={1}
                    max={60}
                    value={workDuration}
                    onChange={(value) => setWorkDuration(value || 25)}
                  />
                </div>
                <div className={styles.settingItem}>
                  <label>短休息时长（分钟）</label>
                  <InputNumber
                    min={1}
                    max={30}
                    value={breakDuration}
                    onChange={(value) => setBreakDuration(value || 5)}
                  />
                </div>
                <div className={styles.settingItem}>
                  <label>长休息时长（分钟）</label>
                  <InputNumber
                    min={1}
                    max={60}
                    value={longBreakDuration}
                    onChange={(value) => setLongBreakDuration(value || 15)}
                  />
                </div>
                <div className={styles.settingItem}>
                  <label>长休息间隔（番茄钟数）</label>
                  <InputNumber
                    min={2}
                    max={10}
                    value={pomodorosUntilLongBreak}
                    onChange={(value) => setPomodorosUntilLongBreak(value || 4)}
                  />
                </div>
                <Button onClick={() => setShowSettings(false)}>关闭设置</Button>
              </div>
            ) : (
              <Button
                type="link"
                icon={<SettingOutlined />}
                onClick={() => setShowSettings(true)}
                className={styles.settingsButton}
              >
                设置
              </Button>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

