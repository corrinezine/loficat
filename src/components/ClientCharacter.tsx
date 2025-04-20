'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { GAME_CONFIG } from '@/constants/gameConfig';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

// 定义音乐区域
const MUSIC_ZONES = {
  BACH: { x: [1, 2] as number[], y: [2, 4] as number[], music: '/assets/sounds/声音2-bach.mp3' },
  FENG_BO: { x: [3, 6] as number[], y: [1, 3] as number[], music: '/assets/sounds/声音1-定风波.mp3' },
  NUJABES: { x: [7, 8] as number[], y: [5, 8] as number[], music: '/assets/sounds/声音3-Nujabes.mp3' },
  KYOGEN: { x: [4, 7] as number[], y: [9, 11] as number[], music: '/assets/sounds/声音2-狂言.mp3' },
} as const;

export default function ClientCharacter() {
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 1, y: 7 });
  const [velocity, setVelocity] = useState<Velocity>({ x: 0, y: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [currentMusic, setCurrentMusic] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 游戏常量
  const CONSTANTS = {
    BASE_SPEED: 5, // 基础速度 5 单位/帧
    ACCELERATION: 0.5, // 加速度 0.5 单位/帧²
    MAX_SPEED: 10, // 最大速度 10 单位/帧
    JUMP_HEIGHT: 15, // 基础跳跃高度
    DOUBLE_JUMP_HEIGHT: 10, // 二段跳高度
    GRAVITY: 0.8, // 重力加速度
  };

  // 计算一个乐高块的大小
  const blockWidth = 100 / GAME_CONFIG.GAME_AREA.GRID_WIDTH;
  const blockHeight = 100 / GAME_CONFIG.GAME_AREA.GRID_HEIGHT;

  // 检查当前位置是否在指定区域内
  const isInZone = (x: number, y: number, zone: { x: number[], y: number[] }) => {
    return x >= zone.x[0] && x <= zone.x[1] && y >= zone.y[0] && y <= zone.y[1];
  };

  // 处理音乐播放
  const handleMusicZone = useCallback((newPosition: Position) => {
    let newMusic: string | null = null;

    // 检查当前位置所在的音乐区域
    Object.entries(MUSIC_ZONES).forEach(([_, zone]) => {
      if (isInZone(newPosition.x, newPosition.y, zone)) {
        newMusic = zone.music;
      }
    });

    // 如果进入新的音乐区域
    if (newMusic !== currentMusic) {
      // 停止当前音乐
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // 播放新音乐
      if (newMusic) {
        if (!audioRef.current) {
          audioRef.current = new Audio(newMusic);
          audioRef.current.loop = true;
        } else {
          audioRef.current.src = newMusic;
        }
        audioRef.current.play().catch(error => {
          console.warn('音乐播放失败:', error);
        });
      }

      setCurrentMusic(newMusic);
    }
  }, [currentMusic]);

  // 移动逻辑
  const moveCharacter = useCallback(() => {
    setPosition(prev => {
      let newVelX = 0;
      let newVelY = 0;

      // 计算水平速度
      if (pressedKeys.has('ArrowLeft')) {
        newVelX = Math.max(-CONSTANTS.MAX_SPEED, velocity.x - CONSTANTS.ACCELERATION);
      } else if (pressedKeys.has('ArrowRight')) {
        newVelX = Math.min(CONSTANTS.MAX_SPEED, velocity.x + CONSTANTS.ACCELERATION);
      } else {
        // 减速
        newVelX = Math.abs(velocity.x) < CONSTANTS.ACCELERATION ? 0 : 
                  velocity.x > 0 ? velocity.x - CONSTANTS.ACCELERATION : velocity.x + CONSTANTS.ACCELERATION;
      }

      // 计算垂直速度
      if (pressedKeys.has('ArrowUp')) {
        newVelY = Math.max(-CONSTANTS.MAX_SPEED, velocity.y - CONSTANTS.ACCELERATION);
      } else if (pressedKeys.has('ArrowDown')) {
        newVelY = Math.min(CONSTANTS.MAX_SPEED, velocity.y + CONSTANTS.ACCELERATION);
      } else {
        // 减速
        newVelY = Math.abs(velocity.y) < CONSTANTS.ACCELERATION ? 0 :
                  velocity.y > 0 ? velocity.y - CONSTANTS.ACCELERATION : velocity.y + CONSTANTS.ACCELERATION;
      }

      // 更新速度状态
      setVelocity({ x: newVelX, y: newVelY });

      // 计算新位置
      let newX = Math.max(1, Math.min(GAME_CONFIG.GAME_AREA.GRID_WIDTH, prev.x + newVelX * 0.1));
      let newY = Math.max(1, Math.min(GAME_CONFIG.GAME_AREA.GRID_HEIGHT, prev.y + newVelY * 0.1));

      const newPosition = { x: newX, y: newY };
      
      // 检查并处理音乐区域
      handleMusicZone(newPosition);

      return newPosition;
    });
  }, [velocity, pressedKeys, handleMusicZone]);

  // 处理跳跃
  const handleJump = useCallback(() => {
    if (jumpCount < 2) { // 允许二段跳
      const jumpForce = jumpCount === 0 ? CONSTANTS.JUMP_HEIGHT : CONSTANTS.DOUBLE_JUMP_HEIGHT;
      setVelocity(prev => ({ ...prev, y: -jumpForce }));
      setJumpCount(prev => prev + 1);
      setIsJumping(true);
    }
  }, [jumpCount]);

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.add(e.code);
        return newKeys;
      });

      if (e.code === 'Space') {
        handleJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(e.code);
        return newKeys;
      });

      // 当落地时重置跳跃计数
      if (position.y >= GAME_CONFIG.GAME_AREA.GRID_HEIGHT) {
        setJumpCount(0);
        setIsJumping(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleJump, position.y]);

  // 动画循环
  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      moveCharacter();
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [moveCharacter]);

  // 清理音频资源
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // 将网格坐标转换为百分比位置
  const percentX = ((position.x - 1) * blockWidth);
  const percentY = ((position.y - 1) * blockHeight);

  return (
    <div 
      className="character absolute"
      style={{
        left: `${percentX}%`,
        top: `${percentY}%`,
        width: `${blockWidth}%`,
        height: `${blockHeight}%`,
        position: 'absolute',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        transform: `translateY(${isJumping ? '-20px' : '0'})`,
        transition: 'transform 0.2s ease-out',
      }}
    >
      <img
        src="/assets/scene/界面/猫咪/black-cat.png"
        alt="黑猫角色"
        style={{
          width: '96px',
          height: '96px',
          objectFit: 'contain',
          userSelect: 'none',
          // @ts-ignore
          WebkitUserDrag: 'none',
        }}
        draggable={false}
      />
    </div>
  );
} 