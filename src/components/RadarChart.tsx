import React, { useState } from 'react';
import { StatKey } from '../types';
import { STAT_DEFINITIONS } from '../data/classmates';

interface RadarChartProps {
  stats: Record<StatKey, number>;
  compareStats?: Record<StatKey, number>;
  compareLabel?: string;
  size?: number;
  showDetails?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  stats,
  compareStats,
  compareLabel,
  size = 360,
  showDetails = true,
}) => {
  const [hoveredStat, setHoveredStat] = useState<StatKey | null>(null);

  const keys: StatKey[] = ['creativity', 'empathy', 'selfAwareness', 'social', 'curiosity'];
  const totalAxes = keys.length;
  const center = size / 2;
  const radius = (size / 2) - 55; // padding for labels

  // Calculate polygon coordinates (0 angle is top: -90 deg)
  const getCoordinates = (index: number, value: number, max = 100) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Concentric polygon points for grid
  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const gridPaths = gridLevels.map(level => {
    return keys.map((_, i) => {
      const { x, y } = getCoordinates(i, level * 100);
      return `${x},${y}`;
    }).join(' ');
  });

  // Main student stats polygon
  const userPolygonPoints = keys.map((key, i) => {
    const val = Math.min(Math.max(stats[key] || 10, 15), 100);
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  // Optional compare stats polygon
  const comparePolygonPoints = compareStats ? keys.map((key, i) => {
    const val = Math.min(Math.max(compareStats[key] || 10, 15), 100);
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ') : null;

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="overflow-visible filter drop-shadow-sm transition-all duration-500"
        >
          <defs>
            <linearGradient id="userRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#EC4899" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="compareRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Background concentric polygons */}
          {gridPaths.map((pts, idx) => (
            <polygon
              key={idx}
              points={pts}
              fill={idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}
              stroke="#E2E8F0"
              strokeWidth="1.2"
              strokeDasharray={idx === gridPaths.length - 1 ? 'none' : '3 3'}
            />
          ))}

          {/* Radial axis lines */}
          {keys.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#CBD5E1"
                strokeWidth="1"
              />
            );
          })}

          {/* Compare polygon if provided */}
          {comparePolygonPoints && (
            <polygon
              points={comparePolygonPoints}
              fill="url(#compareRadarGradient)"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="transition-all duration-700"
            />
          )}

          {/* Main User Stat Polygon */}
          <polygon
            points={userPolygonPoints}
            fill="url(#userRadarGradient)"
            stroke="#EC4899"
            strokeWidth="2.5"
            className="transition-all duration-700 hover:stroke-amber-500"
          />

          {/* Stat Points & Nodes */}
          {keys.map((key, i) => {
            const val = stats[key] || 0;
            const { x, y } = getCoordinates(i, val);
            const isHovered = hoveredStat === key;
            return (
              <g key={key} className="cursor-pointer" onMouseEnter={() => setHoveredStat(key)} onMouseLeave={() => setHoveredStat(null)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 8 : 5.5}
                  fill={STAT_DEFINITIONS[key].color}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-200 filter drop-shadow-sm"
                />
              </g>
            );
          })}

          {/* Category Outer Labels & Icons */}
          {keys.map((key, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const labelR = radius + 32;
            const lx = center + labelR * Math.cos(angle);
            const ly = center + labelR * Math.sin(angle);
            const def = STAT_DEFINITIONS[key];
            const isHovered = hoveredStat === key;

            return (
              <g
                key={key}
                transform={`translate(${lx}, ${ly})`}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredStat(key)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <circle
                  r={isHovered ? 18 : 15}
                  fill="#FFFFFF"
                  stroke={isHovered ? def.color : '#E2E8F0'}
                  strokeWidth={isHovered ? 2 : 1.5}
                  className="transition-all filter drop-shadow-sm"
                />
                <text
                  textAnchor="middle"
                  dy="5"
                  fontSize="14"
                  className="pointer-events-none"
                >
                  {def.icon}
                </text>
                <text
                  y={24}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight={isHovered ? '700' : '600'}
                  fill={isHovered ? def.color : '#475569'}
                  className="transition-all"
                >
                  {def.label} ({stats[key] || 0}점)
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        {compareStats && compareLabel && (
          <div className="flex items-center justify-center gap-4 mt-2 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-pink-600">
              <span className="w-3 h-3 rounded-full bg-pink-500 inline-block"></span>
              <span>나의 현재 스탯</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block border border-dashed border-blue-700"></span>
              <span>{compareLabel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive stat detail card */}
      {showDetails && (
        <div className="mt-3 w-full max-w-md bg-white/90 backdrop-blur-xs border border-amber-100 rounded-2xl p-3 shadow-xs">
          {hoveredStat ? (
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: `${STAT_DEFINITIONS[hoveredStat].color}20` }}
              >
                {STAT_DEFINITIONS[hoveredStat].icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">
                    {STAT_DEFINITIONS[hoveredStat].label}
                  </span>
                  <span className="text-sm font-extrabold" style={{ color: STAT_DEFINITIONS[hoveredStat].color }}>
                    {stats[hoveredStat]}점
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {STAT_DEFINITIONS[hoveredStat].desc}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center text-slate-500 py-1">
              💡 꼭짓점 아이콘에 마우스를 올리면 각 자아 스탯의 의미를 볼 수 있어요!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
