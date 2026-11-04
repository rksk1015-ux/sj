import React, { useState } from 'react';
import { Badge, QuestAnswer, StatKey, Quest } from '../types';
import { STAT_DEFINITIONS } from '../data/classmates';
import { RadarChart } from './RadarChart';
import { BADGE_DEFINITIONS } from '../data/badges';
import { SEASONS_INFO, EMOTION_OPTIONS } from '../data/quests';
import { playPopSound } from '../utils/sound';
import { Award, BookOpen, Sparkles, Filter, Lock, Calendar, MessageCircle } from 'lucide-react';

interface CollectionStatsViewProps {
  stats: Record<StatKey, number>;
  answers: Record<number, QuestAnswer>;
  quests: Quest[];
  unlockedBadgeIds: string[];
  onSelectDayForEdit: (day: number) => void;
}

export const CollectionStatsView: React.FC<CollectionStatsViewProps> = ({
  stats,
  answers,
  quests,
  unlockedBadgeIds,
  onSelectDayForEdit,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'badges' | 'bookshelf'>('stats');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState<number | 'ALL'>('ALL');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [bookshelfSeason, setBookshelfSeason] = useState<1 | 2 | 3 | 4>(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Total stat score
  const totalScore = Object.values(stats).reduce((a, b) => a + b, 0);
  const level = Math.floor(totalScore / 25) + 1;

  // Filtered badges (16 badges 4x4)
  const filteredBadges = BADGE_DEFINITIONS.filter((b) => {
    if (selectedSeasonFilter === 'ALL') return true;
    return b.season === selectedSeasonFilter;
  });

  // Filtered bookshelf answers
  const seasonQuests = quests.filter((q) => q.season === bookshelfSeason);
  const filteredSeasonQuests = seasonQuests.filter((q) => {
    if (!searchKeyword.trim()) return true;
    const ans = answers[q.day];
    const matchQ = q.question.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchA = ans ? ans.text.toLowerCase().includes(searchKeyword.toLowerCase()) : false;
    return matchQ || matchA;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Subtab Navigator */}
      <div className="flex items-center justify-center p-1.5 bg-amber-50/80 backdrop-blur-md rounded-2xl border border-amber-200/80 max-w-md mx-auto">
        <button
          onClick={() => {
            playPopSound();
            setActiveSubTab('stats');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'stats'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Sparkles size={16} />
          <span>5대 자아 스탯</span>
        </button>

        <button
          onClick={() => {
            playPopSound();
            setActiveSubTab('badges');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'badges'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Award size={16} />
          <span>배지 갤러리 (4x4)</span>
        </button>

        <button
          onClick={() => {
            playPopSound();
            setActiveSubTab('bookshelf');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'bookshelf'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BookOpen size={16} />
          <span>시즌별 책꽂이</span>
        </button>
      </div>

      {/* SUBTAB 1: 5대 자아 스탯 & Radar Chart */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Radar Chart Panel */}
          <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-amber-100 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Radar Visualizer
                </span>
                <h3 className="text-lg font-black text-slate-800 mt-1">
                  나의 5대 자아 오각형 다이어그램
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-600 font-semibold">탐험가 레벨</span>
                <p className="text-xl font-black text-amber-800">Lv.{level}</p>
              </div>
            </div>

            <RadarChart stats={stats} size={330} />
          </div>

          {/* Stat progress cards */}
          <div className="md:col-span-5 space-y-3 flex flex-col justify-between">
            <div className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/60">
              <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wide">
                총 누적 경험치
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-slate-800">{totalScore}</span>
                <span className="text-xs font-bold text-slate-600">EXP (전체 성장도)</span>
              </div>
              <p className="text-xs text-slate-700 mt-2 font-medium">
                답변을 진솔하게 작성할 때마다 자아 스탯이 골고루 성장해요.
              </p>
            </div>

            <div className="space-y-2.5 bg-white rounded-3xl p-5 border border-slate-100 shadow-xs">
              <h4 className="text-xs font-black text-slate-600 uppercase tracking-wide">
                스탯별 상세 수치
              </h4>
              {Object.entries(STAT_DEFINITIONS).map(([k, def]) => {
                const statKey = k as StatKey;
                const value = stats[statKey] || 0;
                return (
                  <div key={statKey} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span>{def.icon}</span> {def.label}
                      </span>
                      <span style={{ color: def.color }}>{value} / 100</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.min(value, 100)}%`,
                          backgroundColor: def.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: 배지 갤러리 (4x4 Grid view of 16 Badges) */}
      {activeSubTab === 'badges' && (
        <div className="space-y-4">
          {/* Season Filter Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
                <Filter size={13} /> 필터:
              </span>
              <button
                onClick={() => {
                  playPopSound();
                  setSelectedSeasonFilter('ALL');
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedSeasonFilter === 'ALL'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                전체 (16개)
              </button>
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    playPopSound();
                    setSelectedSeasonFilter(s);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                    selectedSeasonFilter === s
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  시즌 {s}
                </button>
              ))}
            </div>

            <span className="text-xs font-bold text-amber-700">
              획득한 배지: {unlockedBadgeIds.length} / 16개 ({Math.round((unlockedBadgeIds.length / 16) * 100)}%)
            </span>
          </div>

          {/* 4x4 Grid of 16 Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {filteredBadges.map((badge) => {
              const isUnlocked = unlockedBadgeIds.includes(badge.id);
              const season = badge.season !== 0 ? SEASONS_INFO[badge.season as 1 | 2 | 3 | 4] : null;

              return (
                <div
                  key={badge.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedBadge(badge);
                  }}
                  className={`relative p-4 rounded-3xl border transition-all cursor-pointer flex flex-col items-center text-center transform hover:-translate-y-1 ${
                    isUnlocked
                      ? 'bg-white border-amber-200 hover:border-amber-400 shadow-xs hover:shadow-md'
                      : 'bg-slate-50/80 border-slate-200 opacity-60 hover:opacity-85'
                  }`}
                >
                  {/* Badge Icon Frame */}
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2.5 transition-transform ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-amber-100 to-rose-100 shadow-inner scale-105'
                        : 'bg-slate-200/80 text-slate-400'
                    }`}
                  >
                    {isUnlocked ? badge.icon : <Lock size={20} className="text-slate-400" />}
                  </div>

                  {/* Badge Name */}
                  <h5 className="font-extrabold text-sm text-slate-800 line-clamp-1">
                    {badge.name}
                  </h5>

                  {/* Season Tag */}
                  <span className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    {season ? `시즌 ${badge.season}` : '스페셜 업적'}
                  </span>

                  {/* Status chip */}
                  <span
                    className={`mt-2 text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isUnlocked ? '획득 완료 ✨' : '잠금 중'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Badge Detail Modal popup */}
          {selectedBadge && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-sm w-full p-6 border-2 border-amber-200 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-100 to-pink-100 flex items-center justify-center text-4xl mb-3 shadow-inner">
                    {unlockedBadgeIds.includes(selectedBadge.id) ? selectedBadge.icon : '🔒'}
                  </div>
                  <h3 className="text-xl font-black text-slate-800">
                    {selectedBadge.name}
                  </h3>
                  <p className="text-xs font-bold text-amber-600 mt-0.5">
                    {selectedBadge.season ? `시즌 ${selectedBadge.season} 공식 배지` : '특별 업적'}
                  </p>
                </div>

                <div className="my-4 p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-xs text-slate-700 space-y-2">
                  <div>
                    <span className="font-black text-slate-500 block">배지 설명:</span>
                    <p className="font-medium mt-0.5">{selectedBadge.description}</p>
                  </div>
                  <div>
                    <span className="font-black text-slate-500 block">해금 조건:</span>
                    <p className="font-bold text-amber-700 mt-0.5">
                      🔑 {selectedBadge.unlockCondition}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: 시즌별 책꽂이 (Archive Bookshelf) */}
      {activeSubTab === 'bookshelf' && (
        <div className="space-y-5">
          {/* 4 Season Book Spine Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([1, 2, 3, 4] as const).map((sNum) => {
              const sInfo = SEASONS_INFO[sNum];
              const isSelected = bookshelfSeason === sNum;
              const sAnsweredCount = quests
                .filter((q) => q.season === sNum)
                .filter((q) => !!answers[q.day]).length;

              return (
                <div
                  key={sNum}
                  onClick={() => {
                    playPopSound();
                    setBookshelfSeason(sNum);
                  }}
                  className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-400 shadow-md scale-102'
                      : 'bg-white border-slate-200 hover:border-amber-200 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sInfo.icon}</span>
                    <span className="text-[11px] font-bold text-amber-700">
                      {sAnsweredCount}/25일
                    </span>
                  </div>
                  <div className="mt-3">
                    <h5 className="font-black text-slate-800 text-sm">
                      {sInfo.title.split(':')[1] || sInfo.title}
                    </h5>
                    <p className="text-xs text-slate-500 truncate">{sInfo.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search bar inside season */}
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
            <MessageCircle size={18} className="text-slate-400 ml-2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="과거 작성한 답변 내용이나 질문 키워드로 검색해보세요..."
              className="flex-1 text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2"
              >
                지우기
              </button>
            )}
          </div>

          {/* Past Answers List */}
          <div className="space-y-3">
            {filteredSeasonQuests.map((q) => {
              const ans = answers[q.day];
              const isAnswered = !!ans;

              return (
                <div
                  key={q.day}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                    isAnswered
                      ? 'bg-white border-amber-100 shadow-xs'
                      : 'bg-slate-50/60 border-slate-200/80 border-dashed'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-amber-100 text-amber-800">
                        {q.day}일차
                      </span>
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-800">
                        {q.question}
                      </h4>
                    </div>

                    {isAnswered ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1">
                        <span>{ans.emotion ? EMOTION_OPTIONS.find((e) => e.type === ans.emotion)?.emoji : '😊'}</span>
                        완료
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 shrink-0">
                        미완료
                      </span>
                    )}
                  </div>

                  {isAnswered ? (
                    <div className="mt-3 p-3.5 bg-amber-50/40 rounded-2xl border border-amber-100/60 text-xs sm:text-sm text-slate-700 space-y-2">
                      <p className="leading-relaxed whitespace-pre-wrap">{ans.text}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-amber-100/50">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {ans.completedAt ? new Date(ans.completedAt).toLocaleDateString('ko-KR') : ''}
                        </span>
                        <button
                          onClick={() => {
                            playPopSound();
                            onSelectDayForEdit(q.day);
                          }}
                          className="font-bold text-amber-600 hover:text-amber-700 underline"
                        >
                          답변 수정하기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>아직 작성하지 않은 퀘스트예요.</span>
                      <button
                        onClick={() => {
                          playPopSound();
                          onSelectDayForEdit(q.day);
                        }}
                        className="font-bold text-amber-600 hover:text-amber-700 underline"
                      >
                        지금 작성하러 가기 ✏️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
