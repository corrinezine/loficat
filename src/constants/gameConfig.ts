export const GAME_CONFIG = {
  // 游戏区域配置
  GAME_AREA: {
    GRID_WIDTH: 8,
    GRID_HEIGHT: 14,
    BLOCK_WIDTH: 192,
    BLOCK_HEIGHT: 64,
    RELATIVE_WIDTH: '80%',
    BLOCK_SIZE: {
      WIDTH: 192,
      HEIGHT: 64
    }
  },
  
  // 界面配置
  UI: {
    TITLE_HEIGHT: 128,
    BACKGROUND_COLOR: '#002541'
  },
  
  // 角色配置
  CHARACTER: {
    INITIAL_POSITION: {
      x: 1,
      y: 7,
    },
    PHYSICS: {
      BASE_SPEED: 5,
      ACCELERATION: 0.5,
      MAX_SPEED: 10,
      JUMP_HEIGHT: 15,
      DOUBLE_JUMP_HEIGHT: 10,
      GRAVITY: 0.8,
    },
  },

  // 物品配置
  COLLECTIBLES: {
    SUNFLOWER: { id: 'sunflower', size: 50 },
    BUTTERFLY: { id: 'butterfly', size: 50 },
    FISH: { id: 'fish', size: 50 },
    LOTUS: { id: 'lotus', size: 50 }
  }
} as const; 