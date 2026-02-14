'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Tabs, Input, Select, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import styles from './page.module.css';

const { TabPane } = Tabs;

// 长度单位转换
const lengthUnits = {
  meter: { name: '米 (m)', toMeter: 1 },
  kilometer: { name: '千米 (km)', toMeter: 1000 },
  centimeter: { name: '厘米 (cm)', toMeter: 0.01 },
  millimeter: { name: '毫米 (mm)', toMeter: 0.001 },
  mile: { name: '英里 (mi)', toMeter: 1609.34 },
  yard: { name: '码 (yd)', toMeter: 0.9144 },
  foot: { name: '英尺 (ft)', toMeter: 0.3048 },
  inch: { name: '英寸 (in)', toMeter: 0.0254 },
};

// 重量单位转换
const weightUnits = {
  kilogram: { name: '千克 (kg)', toKilogram: 1 },
  gram: { name: '克 (g)', toKilogram: 0.001 },
  milligram: { name: '毫克 (mg)', toKilogram: 0.000001 },
  ton: { name: '吨 (t)', toKilogram: 1000 },
  pound: { name: '磅 (lb)', toKilogram: 0.453592 },
  ounce: { name: '盎司 (oz)', toKilogram: 0.0283495 },
};

// 温度单位转换
const convertTemperature = (value: number, from: string, to: string): number => {
  if (from === to) return value;
  
  // 先转换为摄氏度
  let celsius = value;
  if (from === 'fahrenheit') {
    celsius = (value - 32) * 5 / 9;
  } else if (from === 'kelvin') {
    celsius = value - 273.15;
  }
  
  // 再转换为目标单位
  if (to === 'fahrenheit') {
    return celsius * 9 / 5 + 32;
  } else if (to === 'kelvin') {
    return celsius + 273.15;
  }
  return celsius;
};

const temperatureUnits = {
  celsius: { name: '摄氏度 (°C)' },
  fahrenheit: { name: '华氏度 (°F)' },
  kelvin: { name: '开尔文 (K)' },
};

export default function ConverterPage() {
  const [lengthFrom, setLengthFrom] = useState('meter');
  const [lengthTo, setLengthTo] = useState('kilometer');
  const [lengthValue, setLengthValue] = useState('');
  const [lengthResult, setLengthResult] = useState('');

  const [weightFrom, setWeightFrom] = useState('kilogram');
  const [weightTo, setWeightTo] = useState('gram');
  const [weightValue, setWeightValue] = useState('');
  const [weightResult, setWeightResult] = useState('');

  const [tempFrom, setTempFrom] = useState('celsius');
  const [tempTo, setTempTo] = useState('fahrenheit');
  const [tempValue, setTempValue] = useState('');
  const [tempResult, setTempResult] = useState('');

  const convertLength = (value: string) => {
    setLengthValue(value);
    if (!value || isNaN(Number(value))) {
      setLengthResult('');
      return;
    }

    const num = Number(value);
    const meters = num * lengthUnits[lengthFrom as keyof typeof lengthUnits].toMeter;
    const result = meters / lengthUnits[lengthTo as keyof typeof lengthUnits].toMeter;
    setLengthResult(result.toFixed(6));
  };

  const convertWeight = (value: string) => {
    setWeightValue(value);
    if (!value || isNaN(Number(value))) {
      setWeightResult('');
      return;
    }

    const num = Number(value);
    const kilograms = num * weightUnits[weightFrom as keyof typeof weightUnits].toKilogram;
    const result = kilograms / weightUnits[weightTo as keyof typeof weightUnits].toKilogram;
    setWeightResult(result.toFixed(6));
  };

  const convertTemp = (value: string) => {
    setTempValue(value);
    if (!value || isNaN(Number(value))) {
      setTempResult('');
      return;
    }

    const num = Number(value);
    const result = convertTemperature(num, tempFrom, tempTo);
    setTempResult(result.toFixed(2));
  };

  const swapLengthUnits = () => {
    const temp = lengthFrom;
    setLengthFrom(lengthTo);
    setLengthTo(temp);
    setLengthValue(lengthResult);
    setLengthResult(lengthValue);
  };

  const swapWeightUnits = () => {
    const temp = weightFrom;
    setWeightFrom(weightTo);
    setWeightTo(temp);
    setWeightValue(weightResult);
    setWeightResult(weightValue);
  };

  const swapTempUnits = () => {
    const temp = tempFrom;
    setTempFrom(tempTo);
    setTempTo(temp);
    setTempValue(tempResult);
    setTempResult(tempValue);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>单位转换</h1>
          <p className={styles.subtitle}>长度、重量、温度等单位快速转换</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className={styles.card}>
            <Tabs defaultActiveKey="length" size="large">
              <TabPane tab="📏 长度" key="length">
                <div className={styles.converter}>
                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={lengthValue}
                      onChange={(e) => convertLength(e.target.value)}
                      placeholder="输入数值"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={lengthFrom}
                      onChange={(value) => {
                        setLengthFrom(value);
                        convertLength(lengthValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(lengthUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className={styles.swapButton} onClick={swapLengthUnits}>
                    <SwapOutlined />
                  </div>

                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={lengthResult}
                      readOnly
                      placeholder="转换结果"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={lengthTo}
                      onChange={(value) => {
                        setLengthTo(value);
                        convertLength(lengthValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(lengthUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="⚖️ 重量" key="weight">
                <div className={styles.converter}>
                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={weightValue}
                      onChange={(e) => convertWeight(e.target.value)}
                      placeholder="输入数值"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={weightFrom}
                      onChange={(value) => {
                        setWeightFrom(value);
                        convertWeight(weightValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(weightUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className={styles.swapButton} onClick={swapWeightUnits}>
                    <SwapOutlined />
                  </div>

                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={weightResult}
                      readOnly
                      placeholder="转换结果"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={weightTo}
                      onChange={(value) => {
                        setWeightTo(value);
                        convertWeight(weightValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(weightUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </TabPane>

              <TabPane tab="🌡️ 温度" key="temperature">
                <div className={styles.converter}>
                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={tempValue}
                      onChange={(e) => convertTemp(e.target.value)}
                      placeholder="输入数值"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={tempFrom}
                      onChange={(value) => {
                        setTempFrom(value);
                        convertTemp(tempValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(temperatureUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className={styles.swapButton} onClick={swapTempUnits}>
                    <SwapOutlined />
                  </div>

                  <div className={styles.inputGroup}>
                    <Input
                      type="number"
                      size="large"
                      value={tempResult}
                      readOnly
                      placeholder="转换结果"
                      className={styles.input}
                    />
                    <Select
                      size="large"
                      value={tempTo}
                      onChange={(value) => {
                        setTempTo(value);
                        convertTemp(tempValue);
                      }}
                      className={styles.select}
                    >
                      {Object.entries(temperatureUnits).map(([key, unit]) => (
                        <Select.Option key={key} value={key}>
                          {unit.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

