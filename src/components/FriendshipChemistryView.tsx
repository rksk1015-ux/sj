import React, { useState } from 'react';
import { Classmate, StatKey, QuestAnswer } from '../types';
import { RadarChart } from './RadarChart';
import { playPopSound } from '../utils/sound';
import { Heart, Sparkles, MessageCircle, Flame } from 'lucide-react';

interface FriendshipChemistryViewProps {
  myStats: Record<StatKey, number>;
  myAnswers: Record<number, QuestAnswer>;
  classmates: Classmate[];
}

export const FriendshipChemistryView: React.FC<FriendshipChemistryViewProps> = ({
  myStats,
  myAnswers,
  classmates,
}) => {
  const [selectedFriendId, setSelectedFriendId] = useState<string>(classmates[0]?.id || '');

  const friend = classmates.find((c) => c.id === selectedFriendId) || classmates[0];

  // Calculate chemistry score based on stat correlation and shared strengths
  const calculateChemistry = (f: Classmate) => {
    let statDiffSum = 0;
    const keys: StatKey[] = ['creativity', 'empathy', 'selfAwareness', 'social', 'curiosity'];
    keys.forEach((k) => {
      statDiffSum += Math.abs((myStats[k] || 50) - (f.stats[k] || 50));
    });
    // Scale to a friendly 5th-grade uplifting percentage between 78% and 98%
    const baseScore = 98 - Math.round(statDiffSum / 12);
    return Math.max(76, Math.min(99, baseScore));
  };

  const chemistryScore = friend ? calculateChemistry(friend) : 88;

  const getChemistryVerdict = (score: number) => {
    if (score >= 93) return { title: '우주 최강의 소울메이트 🌟', desc: '생각하는 방식과 따뜻한 마음이 쌍둥이처럼 닮아있어요!' };
    if (score >= 87) return { title: '시너지가 폭발하는 단짝 콤비 🚀', desc: '서로 다른 장점이 멋지게 조화를 이루어 함께하면 무엇이든 해낼 수 있어요!' };
    return { title: '서로를 채워주는 든든한 보완형 친구 🍀', desc: '내가 부족한 점을 친구가 채워주고, 친구에게 없는 매력을 내가 보여줄 수 있어요.' };
  };

  const verdict = getChemistryVerdict(chemistryScore);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header & Friend Selector */}
      <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
              우정 케미 연구소 🧪
            </span>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              반 친구와 나의 생각 주파수 맞춰보기
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              서로 작성한 퀘스트 답변과 5대 자아 스탯을 바탕으로 케미를 분석해요.
            </p>
          </div>

          {/* Classmate Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-600 shrink-0">비교할 친구:</label>
            <select
              value={selectedFriendId}
              onChange={(e) => {
                playPopSound();
                setSelectedFriendId(e.target.value);
              }}
              className="px-4 py-2.5 rounded-2xl bg-pink-50/60 border border-pink-200 text-slate-800 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
            >
              {classmates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.avatar} {c.name} ({c.completedDays}일 완료)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Friend Profile Snippet */}
        {friend && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-pink-50/70 via-amber-50/40 to-sky-50/70 border border-pink-200/60 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl shrink-0">
                {friend.avatar}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-800 text-base">{friend.name}</h4>
                  <span className="text-xs bg-white text-slate-600 px-2 py-0.5 rounded-full font-semibold border border-slate-200">
                    5학년 2반
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 italic">
                  "{friend.statusMessage}"
                </p>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {friend.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/80 text-pink-700 border border-pink-200/50"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Chemistry Score & Radar comparison */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-pink-100 shadow-sm flex flex-col items-center">
          {/* Big Chemistry Score Badge */}
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500 animate-pulse" size={24} />
              <div>
                <span className="text-xs font-bold text-slate-500">우정 궁합도</span>
                <h4 className="text-lg font-black text-slate-800">{verdict.title}</h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-rose-500">{chemistryScore}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center my-2 font-medium">
            {verdict.desc}
          </p>

          {/* Dual Overlay Radar Chart */}
          <RadarChart
            stats={myStats}
            compareStats={friend.stats}
            compareLabel={`${friend.name}의 스탯`}
            size={320}
            showDetails={false}
          />
        </div>

        {/* Commonalities & Favorite Answer Comparison */}
        <div className="md:col-span-5 space-y-4">
          {/* Matched thoughts comparison card */}
          <div className="bg-gradient-to-br from-amber-50 to-pink-50 rounded-3xl p-5 border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wide">
              <Sparkles size={16} className="text-amber-500" />
              <span>발견된 공통점 & 케미 포인트</span>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-amber-100 text-xs text-slate-700 space-y-1.5 shadow-xs">
              <span className="font-extrabold text-amber-700 block">
                🤝 Q{friend.favoriteAnswer.day}. {friend.favoriteAnswer.question}
              </span>
              <p className="font-medium text-slate-600 line-clamp-3">
                <span className="font-bold text-slate-800">{friend.name}: </span>
                "{friend.favoriteAnswer.answer}"
              </p>
              {myAnswers[friend.favoriteAnswer.day] ? (
                <p className="font-medium text-slate-600 line-clamp-3 pt-1 border-t border-slate-100">
                  <span className="font-bold text-pink-700">나의 답변: </span>
                  "{myAnswers[friend.favoriteAnswer.day]?.text}"
                </p>
              ) : (
                <p className="text-[11px] text-amber-600 italic">
                  💡 나도 {friend.favoriteAnswer.day}일차 퀘스트를 작성하면 더 정밀한 비교를 볼 수 있어요!
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-black">✓</span>
                <span>혼자 편안하게 쉬며 에너지를 채우는 시간을 소중히 여겨요.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-black">✓</span>
                <span>친구가 속상해할 때 따뜻하게 다가가는 배려심이 높아요.</span>
              </div>
            </div>
          </div>

          {/* Conversation Starter Recommendation */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-xs uppercase tracking-wide">
              <MessageCircle size={16} className="text-blue-500" />
              <span>내일 교실에서 건넬 수 있는 대화 치트키</span>
            </div>

            <div className="p-3 bg-sky-50/60 rounded-2xl border border-sky-100 text-xs text-slate-700 space-y-2">
              <p className="leading-relaxed">
                "<strong>{friend.name}</strong>아, 너도 주말에 <strong>#{friend.keywords[0]}</strong> 하는 거 좋아한다고 했잖아! 나도 관심 있는데 어떻게 시작했어?"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Flame size={13} className="text-orange-500" />
                우정 친밀도 추천 미션:
              </span>
              <span className="font-bold text-slate-700">체육 시간에 같은 편 하기 ⚽</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
