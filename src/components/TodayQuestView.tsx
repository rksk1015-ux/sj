import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Quest, QuestAnswer, EmotionType, StatKey, Badge } from '../types';
import { EMOTION_OPTIONS, SEASONS_INFO } from '../data/quests';
import { STAT_DEFINITIONS } from '../data/classmates';
import { playChimeSuccess, playBadgeFanfare, playPopSound } from '../utils/sound';
import { Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Award, Flame, Lightbulb, RefreshCw } from 'lucide-react';

interface TodayQuestViewProps {
  currentDay: number;
  quest: Quest;
  answer?: QuestAnswer;
  allBadges: Badge[];
  totalAnsweredCount: number;
  onSaveAnswer: (answer: QuestAnswer) => void;
  onSelectDay: (day: number) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const TodayQuestView: React.FC<TodayQuestViewProps> = ({
  currentDay,
  quest,
  answer,
  allBadges,
  totalAnsweredCount,
  onSaveAnswer,
  onSelectDay,
  onNavigateToTab,
}) => {
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionType | null>(answer?.emotion || 'HAPPY');
  const [answerText, setAnswerText] = useState<string>(answer?.text || '');
  const [isFlipped, setIsFlipped] = useState<boolean>(!!answer);
  const [charCountError, setCharCountError] = useState(false);

  // Sync state when day changes
  useEffect(() => {
    setSelectedEmotion(answer?.emotion || 'HAPPY');
    setAnswerText(answer?.text || '');
    setIsFlipped(!!answer);
    setCharCountError(false);
  }, [currentDay, answer]);

  const seasonInfo = SEASONS_INFO[quest.season];
  const seasonStartDay = (quest.season - 1) * 25 + 1;
  const dayInSeason = quest.day - seasonStartDay + 1;
  const targetBadge = quest.badgeId ? allBadges.find((b) => b.id === quest.badgeId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmotion) {
      alert('오늘의 감정 날씨를 하나 골라주세요! 😊');
      return;
    }
    if (answerText.trim().length < 20) {
      setCharCountError(true);
      playPopSound();
      return;
    }

    setCharCountError(false);

    // Calculate stat gains
    const statsGained: Record<StatKey, number> = {
      creativity: quest.statBoost === 'creativity' ? quest.statPoints : 2,
      empathy: quest.statBoost === 'empathy' ? quest.statPoints : 2,
      selfAwareness: quest.statBoost === 'selfAwareness' ? quest.statPoints : 2,
      social: quest.statBoost === 'social' ? quest.statPoints : 2,
      curiosity: quest.statBoost === 'curiosity' ? quest.statPoints : 2,
    };

    const newAnswer: QuestAnswer = {
      day: quest.day,
      emotion: selectedEmotion,
      text: answerText.trim(),
      completedAt: new Date().toISOString(),
      badgeUnlocked: targetBadge ? targetBadge.id : undefined,
      statsGained,
    };

    onSaveAnswer(newAnswer);
    setIsFlipped(true);

    // Audio & celebratory confetti
    if (targetBadge) {
      playBadgeFanfare();
    } else {
      playChimeSuccess();
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
    } catch {
      // ignore
    }
  };

  const handleFlipBackToEdit = () => {
    playPopSound();
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Header: Season & Total Progress Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-amber-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-amber-50 rounded-2xl border border-amber-100">
              {seasonInfo.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  {seasonInfo.title}
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  {dayInSeason}일차 / 25일
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-800 mt-0.5">
                {seasonInfo.subtitle}
              </h2>
            </div>
          </div>

          {/* Day Navigation Controls */}
          <div className="flex items-center gap-1.5 self-end sm:self-center bg-slate-50 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                if (currentDay > 1) {
                  playPopSound();
                  onSelectDay(currentDay - 1);
                }
              }}
              disabled={currentDay <= 1}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="이전 날짜"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-extrabold text-sm px-2 text-slate-700">
              {currentDay}일차 / 100일
            </span>
            <button
              onClick={() => {
                if (currentDay < 100) {
                  playPopSound();
                  onSelectDay(currentDay + 1);
                }
              }}
              disabled={currentDay >= 100}
              className="p-1.5 rounded-xl hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="다음 날짜"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 100-Day Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame size={14} className="text-orange-500 fill-orange-500" />
              전체 100일 퀘스트 완주율
            </span>
            <span className="text-amber-800 font-black">
              {totalAnsweredCount}% 완료 ({totalAnsweredCount}/100일)
            </span>
          </div>
          <div className="h-3.5 bg-amber-100/60 rounded-full overflow-hidden p-0.5 border border-amber-200/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.max(totalAnsweredCount, 2)}%` }}
            />
          </div>
        </div>

        {/* Quick 1-100 day pill scroller */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto py-1 scrollbar-none">
          {Array.from({ length: 25 }, (_, i) => {
            const dayNum = seasonStartDay + i;
            const isCompleted = dayNum <= totalAnsweredCount;
            const isCurrent = dayNum === currentDay;
            return (
              <button
                key={dayNum}
                onClick={() => {
                  playPopSound();
                  onSelectDay(dayNum);
                }}
                className={`text-xs px-2.5 py-1 rounded-xl font-bold shrink-0 transition-all ${
                  isCurrent
                    ? 'bg-amber-700 text-white shadow-xs scale-105'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dayNum}일 {isCompleted && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quest Card with 3D Flip */}
      <div className="perspective-1000 w-full min-h-[460px]">
        <div
          className={`relative w-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD: Daily Question & Input Form */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md backface-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                Quest #{quest.day}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
                <span>보상 스탯:</span>
                <span className="text-pink-600">
                  {STAT_DEFINITIONS[quest.statBoost].icon} {STAT_DEFINITIONS[quest.statBoost].label} +{quest.statPoints}
                </span>
              </div>
            </div>

            {/* Question Title & Prompt */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-snug">
                {quest.question}
              </h3>
              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-100 text-xs sm:text-sm text-amber-900">
                <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <p>{quest.guideHint}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Emotion Selector */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wide mb-2.5">
                  오늘 나의 감정 날씨는 어떤가요? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {EMOTION_OPTIONS.map((item) => {
                    const isSelected = selectedEmotion === item.type;
                    return (
                      <button
                        type="button"
                        key={item.type}
                        onClick={() => {
                          playPopSound();
                          setSelectedEmotion(item.type);
                        }}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all transform active:scale-95 ${
                          isSelected
                            ? `${item.bgColor} border-2 ${item.borderColor} shadow-xs scale-105`
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="text-2xl mb-1">{item.emoji}</span>
                        <span className="text-[11px] font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide">
                    나의 솔직한 이야기 적기 <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-xs font-bold ${
                      answerText.length >= 20 ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {answerText.length}자 / 최소 20자
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={answerText}
                  onChange={(e) => {
                    setAnswerText(e.target.value);
                    if (charCountError && e.target.value.length >= 20) {
                      setCharCountError(false);
                    }
                  }}
                  placeholder="선생님이나 친구 눈치 보지 말고, 솔직하고 자유롭게 내 마음을 적어보세요! (최소 20자 이상)"
                  className="w-full p-4 rounded-2xl bg-amber-50/30 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white text-slate-800 placeholder-slate-400 text-sm leading-relaxed transition-all resize-none"
                />
                {charCountError && (
                  <p className="mt-1 text-xs text-rose-500 font-bold flex items-center gap-1">
                    ⚠️ 조금만 더 자세히 써볼까요? 20자 이상 작성해야 퀘스트가 완료돼요!
                  </p>
                )}
              </div>

              {/* Tag suggestions */}
              {quest.suggestedTags && quest.suggestedTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-slate-600 font-medium">추천 키워드:</span>
                  {quest.suggestedTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        playPopSound();
                        setAnswerText((prev) => (prev ? `${prev} #${tag}` : `#${tag} `));
                      }}
                      className="text-xs bg-slate-100 hover:bg-amber-100 text-slate-700 font-semibold px-2.5 py-1 rounded-xl transition-all"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-base shadow-lg shadow-amber-500/25 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>오늘의 퀘스트 완료 & 배지 획득하기!</span>
                </button>
              </div>
            </form>
          </div>

          {/* BACK OF CARD: Card Flip Success Celebration */}
          <div className="absolute inset-0 w-full bg-gradient-to-br from-amber-50 via-white to-pink-50 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl backface-hidden rotate-y-180 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-xl">
                  <CheckCircle2 size={15} />
                  퀘스트 완료 완료!
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  {answer?.completedAt ? new Date(answer.completedAt).toLocaleDateString('ko-KR') : '방금 완료'}
                </span>
              </div>

              {/* Celebration Hero */}
              <div className="text-center py-2">
                <div className="inline-block p-4 rounded-3xl bg-amber-100/80 mb-2 animate-bounce">
                  <span className="text-4xl">{selectedEmotion ? EMOTION_OPTIONS.find(e => e.type === selectedEmotion)?.emoji : '🎉'}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-800">
                  {currentDay}일차 자아 퀘스트 성공!
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 mt-1">
                  오늘도 나를 한 걸음 더 깊이 이해하게 되었어요.
                </p>
              </div>

              {/* Unlocked Badge Banner (if badge unlocked) */}
              {targetBadge && (
                <div className="my-3 p-3.5 bg-gradient-to-r from-amber-100 to-rose-100 rounded-2xl border border-amber-300/80 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                    {targetBadge.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-700 uppercase">
                      <Award size={13} /> 새로운 성격 배지 획득!
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-800 truncate">
                      {targetBadge.name}
                    </h5>
                    <p className="text-[11px] text-slate-600 truncate">
                      {targetBadge.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Stat Boosts display */}
              <div className="my-3 p-3 bg-white/80 rounded-2xl border border-amber-100">
                <span className="text-[11px] font-black text-slate-600 uppercase block mb-2">
                  📈 오늘 획득한 5대 자아 스탯
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(answer?.statsGained || {
                    creativity: 2,
                    empathy: 2,
                    selfAwareness: 5,
                    social: 2,
                    curiosity: 2,
                  }).map(([k, val]) => {
                    const statKey = k as StatKey;
                    const def = STAT_DEFINITIONS[statKey];
                    return (
                      <div
                        key={statKey}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <span>{def.icon}</span> {def.label}
                        </span>
                        <span className="font-extrabold text-pink-600">+{val} EXP</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Student's Saved Answer Preview */}
              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/50 text-xs text-slate-700 max-h-24 overflow-y-auto">
                <span className="font-black text-amber-800 block mb-1">내가 남긴 오늘의 한마디:</span>
                <p className="italic leading-relaxed font-medium">"{answerText}"</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleFlipBackToEdit}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>답변 다시 수정하기</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  onNavigateToTab('stats');
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>내 스탯 레이더 보러가기 📊</span>
              </button>

              {currentDay < 100 && (
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    onSelectDay(currentDay + 1);
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1"
                >
                  <span>다음 {currentDay + 1}일차 퀘스트 도전!</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
