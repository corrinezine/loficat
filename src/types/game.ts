// 坐标类型
export interface Position {
  x: number;
  y: number;
}

// 收集物品类型
export type CollectibleType = 'sunflower' | 'butterfly' | 'fish' | 'lotus';

// 收集物品状态
export interface CollectibleState {
  id: CollectibleType;
  position: Position;
  collected: boolean;
}

// 游戏状态
export interface GameState {
  catPosition: Position;
  collectibles: Record<CollectibleType, number>;
  currentMusic?: string;
}

// 乐高块属性
export interface LegoBlock {
  position: Position;
  type: string;
  musicZone?: string;
} 