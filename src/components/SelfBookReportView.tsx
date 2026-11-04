import React from 'react';
import { StatKey, QuestAnswer, EmotionType, Quest, Badge } from '../types';
import { STAT_DEFINITIONS } from '../data/classmates';
import { EmotionPieChart } from './EmotionPieChart';
import { RadarChart } from './RadarChart';
import { playPopSound } from '../utils/sound';
import { Printer, Download, Sparkles, BookOpen, Heart, Calendar } from 'lucide-react';

interface SelfBookReportViewProps {
  studentName: string;
  stats: Record<StatKey, number>;
  answers: Record<number, QuestAnswer>;
  quests: Quest[];
  unlockedBadges: Badge[];
  totalAnsweredCount: number;
}

export const SelfBookReportView: React.FC<SelfBookReportViewProps> = ({
  studentName,
  stats,
  answers,
  quests,
  unlockedBadges,
  totalAnsweredCount,
}) => {
  // Compute Top 3 Strengths based on stats
  const sortedStats = Object.entries(stats).sort((a, b) => b[1] - a[1]);
  const top3Keys = sortedStats.slice(0, 3).map(([k]) => k as StatKey);

  // Compute emotion breakdown
  const emotionCounts: Record<EmotionType, number> = {
    HAPPY: 0,
    CALM: 0,
    EXCITED: 0,
    ANXIOUS: 0,
    SAD: 0,
    TIRED: 0,
  };
  Object.values(answers).forEach((ans) => {
    if (ans.emotion && emotionCounts[ans.emotion] !== undefined) {
      emotionCounts[ans.emotion] += 1;
    }
  });

  // Calculate Character Title
  const getCharacterTitle = () => {
    const primaryStat = top3Keys[0];
    if (primaryStat === 'empathy') return '따뜻한 감성을 품은 마음 치유사 💖';
    if (primaryStat === 'creativity') return '세상을 무지개색으로 물들이는 크리에이터 🎨';
    if (primaryStat === 'curiosity') return '끝없는 미지의 세계를 개척하는 탐험가 🔍';
    if (primaryStat === 'social') return '교실을 웃음과 배려로 채우는 평화의 리더 🤝';
    return '단단한 중심을 가진 빛나는 자아 탐색가 🪞';
  };

  const handlePrint = () => {
    playPopSound();
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner with Print Button (Hidden in Print Mode) */}
      <div className="no-print bg-white rounded-3xl p-6 border border-amber-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            디지털 자서전 & 완주 리포트
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-1">
            100일 나 찾기 자아 도감 (디지털 책)
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            내가 작성한 모든 퀘스트와 감정 기록을 한 권의 포트폴리오로 정리했어요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer size={16} />
            <span>도감 인쇄 / PDF 저장하기</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE DIGITAL BOOK CONTAINER */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-md p-6 sm:p-10 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Book Cover Header */}
        <div className="text-center pb-6 border-b-2 border-dashed border-amber-200">
          <div className="inline-block p-3 rounded-3xl bg-amber-100/70 mb-2">
            <BookOpen size={32} className="text-amber-700" />
          </div>
          <span className="text-xs font-black text-amber-800 tracking-widest uppercase block">
            5학년 2반 김민우의 자아 탐험 기록물
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
            나를 찾는 100일간의 여행
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-sm font-extrabold px-3 py-1 bg-amber-50 rounded-xl text-amber-800 border border-amber-200">
              칭호: {getCharacterTitle()}
            </span>
            <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-xl text-slate-600">
              완료 퀘스트: {totalAnsweredCount} / 100일
            </span>
          </div>
        </div>

        {/* Section 1: 3대 핵심 강점 & 레이더 차트 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-6 flex flex-col items-center">
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              자아 스탯 레이더 종합 결과
            </h4>
            <RadarChart stats={stats} size={280} showDetails={false} />
          </div>

          <div className="md:col-span-6 space-y-3">
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Heart size={16} className="text-rose-500" />
              나의 3대 핵심 자아 강점
            </h4>
            <div className="space-y-2.5">
              {top3Keys.map((k, idx) => {
                const def = STAT_DEFINITIONS[k];
                return (
                  <div
                    key={k}
                    className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-xl bg-white shadow-xs font-black text-xs text-amber-700 flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{def.icon}</span>
                        <span className="font-extrabold text-sm text-slate-800">{def.label}</span>
                        <span className="text-xs font-black text-pink-600">({stats[k]}점)</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{def.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 2: Emotion Weather Breakdown */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-4 text-center">
            🌦️ 100일 동안 기록된 나의 마음 날씨 비율
          </h4>
          <EmotionPieChart emotionCounts={emotionCounts} totalCount={totalAnsweredCount} />
        </div>

        {/* Section 3: Earned Badges Showcase */}
        <div>
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            🏆 획득한 명예 배지 컬렉션 ({unlockedBadges.length}개)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {unlockedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-2.5"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-800 block truncate">
                    {badge.name}
                  </span>
                  <span className="text-[10px] text-amber-700 font-medium">
                    {badge.season ? `시즌 ${badge.season}` : '스페셜'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Highlights from Answers */}
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            📝 마음에 남는 자아 탐험 기록 베스트
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quests
              .filter((q) => !!answers[q.day])
              .slice(0, 4)
              .map((q) => {
                const ans = answers[q.day];
                return (
                  <div
                    key={q.day}
                    className="p-4 rounded-2xl bg-white border border-amber-200/70 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-800">
                      <span>{q.day}일차 퀘스트</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar size={11} />
                        {ans?.completedAt ? new Date(ans.completedAt).toLocaleDateString('ko-KR') : ''}
                      </span>
                    </div>
                    <h5 className="font-extrabold text-xs text-slate-800">{q.question}</h5>
                    <p className="text-xs text-slate-600 line-clamp-3 italic bg-amber-50/40 p-2 rounded-xl">
                      "{ans?.text}"
                    </p>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Footer for Print Page */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>나 찾기 100일 퀘스트 • 초등학교 5학년 자기이해 심리 탐험 프로그램</span>
          <span>확인 교사 서명: ________________ (인)</span>
        </div>
      </div>
    </div>
  );
};
