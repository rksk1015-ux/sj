import React from 'react';
import { EmotionType } from '../types';
import { EMOTION_OPTIONS } from '../data/quests';

interface EmotionPieChartProps {
  emotionCounts: Record<EmotionType, number>;
  totalCount: number;
}

export const EmotionPieChart: React.FC<EmotionPieChartProps> = ({ emotionCounts, totalCount }) => {
  if (totalCount === 0) {
    return (
      <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-sm">
        <span>아직 기록된 감정 날씨가 없어요!</span>
        <span className="text-xs text-slate-400 mt-1">오늘의 퀘스트를 풀고 첫 감정을 기록해보세요.</span>
      </div>
    );
  }

  // Pre-mapped colors for each emotion
  const EMOTION_MAP: Record<EmotionType, { label: string; emoji: string; hex: string }> = {
    HAPPY: { label: '행복해요', emoji: '😊', hex: '#FBBF24' },
    CALM: { label: '차분해요', emoji: '😌', hex: '#34D399' },
    EXCITED: { label: '신나요', emoji: '🤩', hex: '#FB923C' },
    ANXIOUS: { label: '불안해요', emoji: '😰', hex: '#818CF8' },
    SAD: { label: '슬퍼요', emoji: '😢', hex: '#60A5FA' },
    TIRED: { label: '피곤해요', emoji: '🥱', hex: '#C084FC' },
  };

  const emotions = (Object.keys(EMOTION_MAP) as EmotionType[]).filter(
    (em) => (emotionCounts[em] || 0) > 0
  );

  // Calculate slice angles for SVG donut chart
  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      {/* Donut Graphic */}
      <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {emotions.map((em) => {
            const count = emotionCounts[em] || 0;
            const ratio = count / totalCount;
            const strokeDasharray = `${ratio * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativeAngle * circumference;
            cumulativeAngle += ratio;

            return (
              <circle
                key={em}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={EMOTION_MAP[em].hex}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out hover:opacity-90 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800">{totalCount}일</span>
          <span className="text-[11px] font-medium text-slate-500">마음 날씨</span>
        </div>
      </div>

      {/* Legend & Percentages */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-xs">
        {EMOTION_OPTIONS.map((item) => {
          const count = emotionCounts[item.type] || 0;
          const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
          if (count === 0) return null;

          return (
            <div
              key={item.type}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-base">{item.emoji}</span>
                <span className="font-semibold text-slate-700 truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0 font-bold">
                <span className="text-slate-500">{count}회</span>
                <span className="text-amber-600">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
