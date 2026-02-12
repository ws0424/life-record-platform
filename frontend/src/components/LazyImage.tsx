/**
 * 懒加载图片组件
 * 使用 react-lazy-load-image-component 实现图片懒加载
 */

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  effect?: 'blur' | 'black-and-white' | 'opacity';
  placeholderSrc?: string;
  threshold?: number;
  onClick?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  style,
  effect = 'blur',
  placeholderSrc,
  threshold = 100,
  onClick,
}: LazyImageProps) {
  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      effect={effect}
      placeholderSrc={placeholderSrc}
      threshold={threshold}
      onClick={onClick}
    />
  );
}

