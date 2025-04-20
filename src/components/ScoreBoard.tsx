'use client';

export default function ScoreBoard() {
  return (
    <div className="score-board h-full p-4 flex flex-col gap-4">
      <div className="score-item flex items-center gap-2 bg-[#002541] p-3 rounded w-[80px] justify-center">
        <span className="text-3xl">🌻</span>
        <span className="text-lg">0</span>
      </div>
      <div className="score-item flex items-center gap-2 bg-[#002541] p-3 rounded w-[80px] justify-center">
        <span className="text-3xl">🦋</span>
        <span className="text-lg">0</span>
      </div>
      <div className="score-item flex items-center gap-2 bg-[#002541] p-3 rounded w-[80px] justify-center">
        <span className="text-3xl">🐟</span>
        <span className="text-lg">0</span>
      </div>
      <div className="score-item flex items-center gap-2 bg-[#002541] p-3 rounded w-[80px] justify-center">
        <span className="text-3xl">🌸</span>
        <span className="text-lg">0</span>
      </div>
    </div>
  );
} 