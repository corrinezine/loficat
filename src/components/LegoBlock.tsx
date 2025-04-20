'use client';

import { Position } from '@/types/game';
import { useEffect, useState } from 'react';

interface LegoBlockProps {
  position: Position;
  totalColumns: number;
  totalRows: number;
}

export default function LegoBlock({ position, totalColumns, totalRows }: LegoBlockProps) {
  const { x, y } = position;
  const [imageError, setImageError] = useState(false);
  
  // 检查图片是否存在
  useEffect(() => {
    const img = new Image();
    img.src = `/assets/scene/乐高块/x${x}y${y}.svg`;
    img.onerror = () => setImageError(true);
  }, [x, y]);

  // 计算块的位置和尺寸
  // 单个乐高块的宽高比是 192:64 = 3:1
  const blockStyle = {
    position: 'absolute',
    left: `${((x - 1) / totalColumns) * 100}%`,
    top: `${((y - 1) / totalRows) * 100}%`,
    width: `${100 / totalColumns}%`,
    height: `${100 / totalRows}%`,
    overflow: 'hidden',
  } as const;

  // 计算图片容器的样式
  const imageContainerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const;

  return (
    <div className="lego-block" style={blockStyle}>
      {!imageError ? (
        <div style={imageContainerStyle}>
          <img 
            src={`/assets/scene/乐高块/x${x}y${y}.svg`}
            alt={`乐高块 ${x},${y}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'fill',
              display: 'block',
            }}
          />
        </div>
      ) : (
        <div 
          style={{
            ...imageContainerStyle,
            background: 'rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          {`${x},${y}`}
        </div>
      )}
    </div>
  );
} 