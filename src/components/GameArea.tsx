'use client';

import { GAME_CONFIG } from '@/constants/gameConfig';
import LegoBlock from './LegoBlock';
import ClientCharacter from './ClientCharacter';

export default function GameArea() {
  // 生成网格坐标
  const generateGrid = () => {
    const grid = [];
    for (let y = 1; y <= GAME_CONFIG.GAME_AREA.GRID_HEIGHT; y++) {
      for (let x = 1; x <= GAME_CONFIG.GAME_AREA.GRID_WIDTH; x++) {
        grid.push({ x, y });
      }
    }
    return grid;
  };

  // 计算游戏板的宽高
  // 单个乐高块尺寸为 192x64
  // 游戏板宽度 = 8 * 192 = 1536
  // 游戏板高度 = 14 * 64 = 896
  // 宽高比应该是 1536:896 ≈ 1.71:1
  const aspectRatio = 896 / 1536; // 高除以宽，得到高度应该是宽度的多少比例

  return (
    <div className="game-area-container" style={{
      width: '80vw',
      margin: '0 auto',
      position: 'relative',
    }}>
      <div className="game-board" style={{
        width: '100%',
        height: 0,
        paddingBottom: `${aspectRatio * 100}%`,
        position: 'relative',
        background: '#002541',
      }}>
        {generateGrid().map((position) => (
          <LegoBlock
            key={`${position.x}-${position.y}`}
            position={position}
            totalColumns={GAME_CONFIG.GAME_AREA.GRID_WIDTH}
            totalRows={GAME_CONFIG.GAME_AREA.GRID_HEIGHT}
          />
        ))}
        <ClientCharacter />
      </div>
    </div>
  );
} 