import React, { useState, useEffect } from 'react';
import { QuestAnswer, StatKey, Classmate } from './types';
import { ALL_QUESTS } from './data/quests';
import { BADGE_DEFINITIONS } from './data/badges';
import { INITIAL_CLASSMATES } from './data/classmates';
import { TodayQuestView } from './components/TodayQuestView';
import { CollectionStatsView } from './components/CollectionStatsView';
import { FriendshipChemistryView } from './components/FriendshipChemistryView';
import { SelfBookReportView } from './components/SelfBookReportView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { CodeExportModal } from './components/CodeExportModal';
import { playPopSound, isSoundEnabled, setSoundEnabled } from './utils/sound';
import { Sparkles, BarChart3, HeartHandshake, BookOpen, GraduationCap, Volume2, VolumeX, Download, RotateCcw, Share2 } from 'lucide-react';

const STORAGE_KEY_ANSWERS = 'quest100_answers_v1';
const STORAGE_KEY_STATS = 'quest100_stats_v1';
const STORAGE_KEY_CLASSMATES = 'quest100_classmates_v1';

// Initial pre-seeded answers for Days 1-11 for an immediate engaging experience
const SEED_ANSWERS: Record<number, QuestAnswer> = {
  1: {
    day: 1,
    emotion: 'HAPPY',
    text: '방과 후 따뜻한 집 방구석에 누워서 좋아하는 모험 소설책을 읽으며 붕어빵을 베어 물 때 제일 행복해요!',
    completedAt: '2026-10-20T16:30:00.000Z',
    badgeUnlocked: 'badge_first_step',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 5, social: 2, curiosity: 2 },
  },
  2: {
    day: 2,
    emotion: 'CALM',
    text: '작년 생일에 할머니께서 직접 떠주신 털장갑이에요. 추운 날씨에 손을 넣으면 마음까지 따뜻해지는 기분이 들어요.',
    completedAt: '2026-10-21T17:00:00.000Z',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 2, social: 2, curiosity: 5 },
  },
  3: {
    day: 3,
    emotion: 'EXCITED',
    text: '유튜브에서 우연히 찾은 신나는 애니메이션 오프닝 곡인데, 듣고 있으면 저절로 어깨가 들썩거리고 힘이 나요!',
    completedAt: '2026-10-22T15:20:00.000Z',
    statsGained: { creativity: 5, empathy: 2, selfAwareness: 2, social: 2, curiosity: 2 },
  },
  4: {
    day: 4,
    emotion: 'HAPPY',
    text: '엄마가 비 오는 날 끓여주시는 바지락 칼국수예요. 김이 모락모락 날 때 후후 불어 먹으면 세상에서 제일 맛있어요.',
    completedAt: '2026-10-23T18:10:00.000Z',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 5, social: 2, curiosity: 2 },
  },
  5: {
    day: 5,
    emotion: 'CALM',
    text: '일어나자마자 창문을 활짝 열고 아침 햇살을 맞으면서 멍때리기! 시원한 바람이 방 안으로 들어올 때 참 평화로워요.',
    completedAt: '2026-10-24T09:40:00.000Z',
    badgeUnlocked: 'badge_season1_early',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 5, social: 2, curiosity: 2 },
  },
  6: {
    day: 6,
    emotion: 'HAPPY',
    text: '종이접기로 드래곤이나 복잡한 비행기를 접는 손재주예요. 친구들이 접어달라고 할 때마다 뿌듯해요.',
    completedAt: '2026-10-25T16:00:00.000Z',
    statsGained: { creativity: 5, empathy: 2, selfAwareness: 2, social: 2, curiosity: 2 },
  },
  7: {
    day: 7,
    emotion: 'CALM',
    text: '늦가을 저녁 선선한 바람에 낙엽이 바스락거리는 냄새를 제일 좋아해요. 왠지 깊은 생각에 잠기게 돼요.',
    completedAt: '2026-10-26T17:30:00.000Z',
    statsGained: { creativity: 5, empathy: 2, selfAwareness: 2, social: 2, curiosity: 2 },
  },
  8: {
    day: 8,
    emotion: 'CALM',
    text: '우리 아파트 뒤편 작은 숲길 벤치예요. 키 큰 나무들이 그늘을 만들어줘서 조용히 혼자 생각하기 딱 좋아요.',
    completedAt: '2026-10-27T16:45:00.000Z',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 5, social: 2, curiosity: 2 },
  },
  9: {
    day: 9,
    emotion: 'HAPPY',
    text: '민트색과 하늘색이에요. 탁 트인 바다나 맑은 하늘을 보는 것처럼 마음이 상쾌하고 시원해져요.',
    completedAt: '2026-10-28T18:00:00.000Z',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 2, social: 2, curiosity: 5 },
  },
  10: {
    day: 10,
    emotion: 'EXCITED',
    text: '높은 곳에 올라가 세상을 두리번거리는 호기심 많은 아기 고양이 같아요. 매일 새로운 걸 발견하고 싶어요!',
    completedAt: '2026-10-29T16:20:00.000Z',
    badgeUnlocked: 'badge_day10_thinker',
    statsGained: { creativity: 5, empathy: 2, selfAwareness: 2, social: 2, curiosity: 2 },
  },
  11: {
    day: 11,
    emotion: 'CALM',
    text: '도서관에서 과학 잡지 읽는 거요. 우주 블랙홀이랑 심해 생물 사진을 볼 때 시간 가는 줄 몰라요.',
    completedAt: '2026-10-30T17:15:00.000Z',
    statsGained: { creativity: 2, empathy: 2, selfAwareness: 2, social: 2, curiosity: 5 },
  },
};

const INITIAL_STATS: Record<StatKey, number> = {
  creativity: 82,
  empathy: 78,
  selfAwareness: 86,
  social: 75,
  curiosity: 88,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'today' | 'stats' | 'chemistry' | 'report' | 'teacher'>('today');
  const [currentDay, setCurrentDay] = useState<number>(12);
  const [answers, setAnswers] = useState<Record<number, QuestAnswer>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return saved ? JSON.parse(saved) : SEED_ANSWERS;
    } catch {
      return SEED_ANSWERS;
    }
  });

  const [stats, setStats] = useState<Record<StatKey, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [classmates, setClassmates] = useState<Classmate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLASSMATES);
      return saved ? JSON.parse(saved) : INITIAL_CLASSMATES;
    } catch {
      return INITIAL_CLASSMATES;
    }
  });

  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [sheetModal, setSheetModal] = useState<{ isOpen: boolean; mode: 'import' | 'export' }>({
    isOpen: false,
    mode: 'import',
  });
  const [codeExportModalOpen, setCodeExportModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
      localStorage.setItem(STORAGE_KEY_CLASSMATES, JSON.stringify(classmates));
    } catch {
      // storage unavailable
    }
  }, [answers, stats, classmates]);

  // Derive unlocked badges
  const unlockedBadgeIds = Object.values(answers)
    .filter((a) => a.badgeUnlocked)
    .map((a) => a.badgeUnlocked as string);

  // Add auto-unlocked threshold badges (e.g. Day 1, 5, 10)
  if (answers[1] && !unlockedBadgeIds.includes('badge_first_step')) unlockedBadgeIds.push('badge_first_step');
  if (answers[5] && !unlockedBadgeIds.includes('badge_season1_early')) unlockedBadgeIds.push('badge_season1_early');
  if (answers[10] && !unlockedBadgeIds.includes('badge_day10_thinker')) unlockedBadgeIds.push('badge_day10_thinker');
  if (Object.keys(answers).length >= 25 && !unlockedBadgeIds.includes('badge_season1_master')) unlockedBadgeIds.push('badge_season1_master');
  if (Object.keys(answers).length >= 50 && !unlockedBadgeIds.includes('badge_season2_master')) unlockedBadgeIds.push('badge_season2_master');
  if (Object.keys(answers).length >= 75 && !unlockedBadgeIds.includes('badge_season3_master')) unlockedBadgeIds.push('badge_season3_master');
  if (Object.keys(answers).length >= 100 && !unlockedBadgeIds.includes('badge_day100_legend')) unlockedBadgeIds.push('badge_day100_legend');

  const unlockedBadges = BADGE_DEFINITIONS.filter((b) => unlockedBadgeIds.includes(b.id));

  // Handler: Save Quest Answer
  const handleSaveAnswer = (newAnswer: QuestAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [newAnswer.day]: newAnswer,
    }));

    // Increment stats
    setStats((prev) => {
      const updated = { ...prev };
      Object.entries(newAnswer.statsGained).forEach(([k, pts]) => {
        const key = k as StatKey;
        updated[key] = Math.min(100, (updated[key] || 50) + pts);
      });
      return updated;
    });
  };

  // Handler: Update Classmate Note in Teacher Dashboard
  const handleUpdateClassmateNote = (id: string, note: string) => {
    setClassmates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, teacherNote: note } : c))
    );
  };

  // Handler: Add New Student to Roster
  const handleAddStudent = (newStudent: Classmate) => {
    setClassmates((prev) => [newStudent, ...prev]);
  };

  // Handler: Delete Student from Roster
  const handleDeleteStudent = (id: string) => {
    setClassmates((prev) => prev.filter((c) => c.id !== id));
  };

  // Handler: Import Classmates from Google Sheet
  const handleImportClassmates = (importedClassmates: Classmate[]) => {
    setClassmates(importedClassmates);
  };

  // Reset to initial seed
  const handleResetData = () => {
    if (confirm('모든 퀘스트 작성 데이터를 초기 상태(12일차 시작)로 되돌릴까요?')) {
      playPopSound();
      setAnswers(SEED_ANSWERS);
      setStats(INITIAL_STATS);
      setClassmates(INITIAL_CLASSMATES);
      setCurrentDay(12);
    }
  };

  const currentQuest = ALL_QUESTS.find((q) => q.day === currentDay) || ALL_QUESTS[0];
  const totalAnsweredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col antialiased">
      {/* TOP HEADER */}
      <header className="no-print bg-white/90 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-300 to-orange-400 text-white flex items-center justify-center text-xl shadow-xs">
                🧭
              </span>
              <div>
                <h1 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight flex items-center gap-1.5">
                  나 찾기 100일 퀘스트
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    5학년
                  </span>
                </h1>
                <p className="text-[11px] font-semibold text-amber-700">
                  내가 누구인지 알아가는 100일간의 심리 탐험 & 디지털 자서전
                </p>
              </div>
            </div>

            {/* Mobile Sound toggle */}
            <div className="md:hidden flex items-center gap-1">
              <button
                onClick={() => {
                  const next = !soundOn;
                  setSoundOn(next);
                  setSoundEnabled(next);
                  if (next) playPopSound();
                }}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
                title={soundOn ? '소리 끄기' : '소리 켜기'}
              >
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>

          {/* Right Control Actions: Google Sheets, Export, Sound, Profile */}
          <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
            {/* Student ID chip */}
            <span className="text-xs font-black bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200/80 flex items-center gap-1">
              🎒 5학년 2반 김민우
            </span>

            {/* [🔄 시트 불러오기] Button */}
            <button
              onClick={() => {
                playPopSound();
                setSheetModal({ isOpen: true, mode: 'import' });
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-200/80 transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              title="구글 스프레드시트에서 데이터 불러오기"
            >
              <span>🔄 시트 불러오기</span>
            </button>

            {/* [💾 시트에 결과 저장] Button */}
            <button
              onClick={() => {
                playPopSound();
                setSheetModal({ isOpen: true, mode: 'export' });
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs border border-amber-300 transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              title="구글 스프레드시트에 결과 실시간 저장"
            >
              <span>💾 시트에 결과 저장</span>
            </button>

            {/* [📦 코드 내보내기] Button */}
            <button
              onClick={() => {
                playPopSound();
                setCodeExportModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs transition-all flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
              title="단일 index.html 또는 3분할 파일 다운로드"
            >
              <Download size={13} />
              <span>📦 코드 내보내기</span>
            </button>

            {/* Desktop Sound toggle */}
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                setSoundEnabled(next);
                if (next) playPopSound();
              }}
              className="hidden md:flex p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
              title={soundOn ? '효과음 끄기' : '효과음 켜기'}
            >
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS (5 Main Views) */}
      <nav className="no-print bg-white/70 backdrop-blur-xs border-b border-slate-200/70 sticky top-[65px] z-30 px-3 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto gap-1 scrollbar-none py-0.5">
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('today');
            }}
            className={`py-2 px-3.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'today'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                : 'text-slate-600 hover:bg-amber-50/80 hover:text-amber-800'
            }`}
          >
            <Sparkles size={16} />
            <span>오늘의 퀘스트</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('stats');
            }}
            className={`py-2 px-3.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                : 'text-slate-600 hover:bg-amber-50/80 hover:text-amber-800'
            }`}
          >
            <BarChart3 size={16} />
            <span>내 컬렉션 & 스탯</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('chemistry');
            }}
            className={`py-2 px-3.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chemistry'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20 scale-102'
                : 'text-slate-600 hover:bg-pink-50/80 hover:text-pink-800'
            }`}
          >
            <HeartHandshake size={16} />
            <span>친구와 우정 케미</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('report');
            }}
            className={`py-2 px-3.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'report'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 scale-102'
                : 'text-slate-600 hover:bg-indigo-50/80 hover:text-indigo-800'
            }`}
          >
            <BookOpen size={16} />
            <span>100일 자아 도감</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('teacher');
            }}
            className={`py-2 px-3.5 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-102'
                : 'text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-800'
            }`}
          >
            <GraduationCap size={16} />
            <span>선생님 대시보드</span>
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT VIEW CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'today' && (
          <TodayQuestView
            currentDay={currentDay}
            quest={currentQuest}
            answer={answers[currentDay]}
            allBadges={BADGE_DEFINITIONS}
            totalAnsweredCount={totalAnsweredCount}
            onSaveAnswer={handleSaveAnswer}
            onSelectDay={setCurrentDay}
            onNavigateToTab={(tabId) => setActiveTab(tabId as typeof activeTab)}
          />
        )}

        {activeTab === 'stats' && (
          <CollectionStatsView
            stats={stats}
            answers={answers}
            quests={ALL_QUESTS}
            unlockedBadgeIds={unlockedBadgeIds}
            onSelectDayForEdit={(day) => {
              setCurrentDay(day);
              setActiveTab('today');
            }}
          />
        )}

        {activeTab === 'chemistry' && (
          <FriendshipChemistryView
            myStats={stats}
            myAnswers={answers}
            classmates={classmates}
          />
        )}

        {activeTab === 'report' && (
          <SelfBookReportView
            studentName="김민우"
            stats={stats}
            answers={answers}
            quests={ALL_QUESTS}
            unlockedBadges={unlockedBadges}
            totalAnsweredCount={totalAnsweredCount}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherDashboardView
            classmates={classmates}
            onUpdateClassmateNote={handleUpdateClassmateNote}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}
      </main>

      {/* FOOTER (Hidden in Print Mode) */}
      <footer className="no-print bg-white/80 border-t border-amber-200/60 py-6 px-4 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>✨ 나 찾기 100일 퀘스트 (초등학교 5학년 자기이해 프로그램)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetData}
              className="text-slate-400 hover:text-rose-500 flex items-center gap-1 font-semibold transition-colors"
            >
              <RotateCcw size={12} />
              <span>데이터 초기화</span>
            </button>
            <span>•</span>
            <button
              onClick={() => {
                playPopSound();
                setCodeExportModalOpen(true);
              }}
              className="text-amber-700 hover:text-amber-800 font-bold"
            >
              GitHub / 단일 파일 다운로드
            </button>
          </div>
        </div>
      </footer>

      {/* Google Sheets Modal */}
      <GoogleSheetModal
        isOpen={sheetModal.isOpen}
        mode={sheetModal.mode}
        answers={answers}
        classmates={classmates}
        onClose={() => setSheetModal((prev) => ({ ...prev, isOpen: false }))}
        onImportData={(newAnswers) => {
          setAnswers((prev) => ({ ...prev, ...newAnswers }));
        }}
        onImportClassmates={handleImportClassmates}
      />

      {/* Code Export Modal */}
      <CodeExportModal
        isOpen={codeExportModalOpen}
        onClose={() => setCodeExportModalOpen(false)}
      />
    </div>
  );
}
