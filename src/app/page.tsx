'use client';

import GameArea from '@/components/GameArea';
import ScoreBoard from '@/components/ScoreBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#001529] text-white">
      {/* 标题区域 */}
      <div className="title-area w-full h-[10vh] flex items-center justify-center">
        <h1 className="text-2xl font-bold">小怪的一天</h1>
      </div>

      {/* 游戏内容区域 */}
      <div className="game-content h-[80vh] flex">
        {/* 游戏区域 */}
        <GameArea />
        
        {/* 计分板区域 */}
        <div className="score-board-container w-[25vw]">
          <ScoreBoard />
        </div>
      </div>
    </main>
  );
} 