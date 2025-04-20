'use client';

import { useEffect, useState } from 'react';
import { GAME_CONFIG } from '@/constants/gameConfig';
import Image from 'next/image';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

export default function Character() {
  // 状态管理
  const [position, setPosition] = useState<Position>({ 
    x: 0, // x1 的位置
    y: (7 - 1) * (100 / GAME_CONFIG.GAME_AREA.GRID_HEIGHT), // y7 的位置
  });
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [canDoubleJump, setCanDoubleJump] = useState(false);

  // 物理参数
  const PHYSICS = {
    BASE_SPEED: 5,
    ACCELERATION: 0.5,
    MAX_SPEED: 10,
    JUMP_HEIGHT: 15,
    DOUBLE_JUMP_HEIGHT: 10,
    GRAVITY: 0.8,
  };

  // 处理键盘输入
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
          setVelocity(prev => ({
            ...prev,
            x: Math.max(-PHYSICS.MAX_SPEED, prev.x - PHYSICS.ACCELERATION)
          }));
          break;
        case 'ArrowRight':
          setVelocity(prev => ({
            ...prev,
            x: Math.min(PHYSICS.MAX_SPEED, prev.x + PHYSICS.ACCELERATION)
          }));
          break;
        case 'ArrowUp':
          setVelocity(prev => ({
            ...prev,
            y: Math.max(-PHYSICS.MAX_SPEED, prev.y - PHYSICS.ACCELERATION)
          }));
          break;
        case 'ArrowDown':
          setVelocity(prev => ({
            ...prev,
            y: Math.min(PHYSICS.MAX_SPEED, prev.y + PHYSICS.ACCELERATION)
          }));
          break;
        case 'Space':
          if (!isJumping) {
            setIsJumping(true);
            setVelocity(prev => ({ ...prev, y: -PHYSICS.JUMP_HEIGHT }));
            setCanDoubleJump(true);
          } else if (canDoubleJump) {
            setVelocity(prev => ({ ...prev, y: -PHYSICS.DOUBLE_JUMP_HEIGHT }));
            setCanDoubleJump(false);
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
          setVelocity(prev => ({ ...prev, x: 0 }));
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          setVelocity(prev => ({ ...prev, y: 0 }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isJumping, canDoubleJump]);

  // 更新位置
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPosition(prev => {
        // 计算新位置，确保不超出边界
        const newX = Math.max(0, Math.min(100 - (100 / GAME_CONFIG.GAME_AREA.GRID_WIDTH), prev.x + velocity.x));
        const newY = Math.max(0, Math.min(100 - (100 / GAME_CONFIG.GAME_AREA.GRID_HEIGHT), prev.y + velocity.y));
        
        // 检查是否着地
        if (newY >= 100 - (100 / GAME_CONFIG.GAME_AREA.GRID_HEIGHT)) {
          setIsJumping(false);
          setVelocity(prev => ({ ...prev, y: 0 }));
        }

        return { x: newX, y: newY };
      });

      // 应用重力
      if (isJumping) {
        setVelocity(prev => ({
          ...prev,
          y: prev.y + PHYSICS.GRAVITY
        }));
      }
    }, 1000 / 60); // 60fps

    return () => clearInterval(gameLoop);
  }, [velocity, isJumping]);

  // 计算角色尺寸，确保保持宽高比
  const blockWidth = 100 / GAME_CONFIG.GAME_AREA.GRID_WIDTH;
  const blockHeight = 100 / GAME_CONFIG.GAME_AREA.GRID_HEIGHT;

  return (
    <div 
      className="character absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${blockWidth}%`,
        height: `${blockHeight}%`,
        zIndex: 10,
        transform: `scaleX(${velocity.x < 0 ? -1 : 1})`,
        transition: 'transform 0.1s',
      }}
    >
      <Image
        src="/assets/scene/界面/猫咪/black-cat.png"
        alt="黑猫角色"
        fill
        style={{
          objectFit: 'contain',
        }}
        priority
      />
    </div>
  );
} 