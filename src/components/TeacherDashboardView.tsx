import React, { useState } from 'react';
import { Classmate, EmotionType } from '../types';
import { playPopSound, playChimeSuccess } from '../utils/sound';
import { AlertTriangle, Users, CheckCircle, Clock, HeartHandshake, Search, Edit3, Save, UserPlus, Trash2, X, Sparkles } from 'lucide-react';

interface TeacherDashboardViewProps {
  classmates: Classmate[];
  onUpdateClassmateNote: (id: string, note: string) => void;
  onAddStudent: (newStudent: Classmate) => void;
  onDeleteStudent: (id: string) => void;
}

const AVATAR_OPTIONS = ['🐶', '🐱', '🦊', '🐻', '🐼', '🦁', '🐯', '🐰', '🐹', '🐨', '🦄', '🐬', '🐧', '🦉', '🐣', '🌸'];

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  classmates,
  onUpdateClassmateNote,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(classmates[0]?.id || '');
  const [filterMode, setFilterMode] = useState<'ALL' | 'INCOMPLETE' | 'ATTENTION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<string>('');
  const [isEditingNote, setIsEditingNote] = useState(false);
  
  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAvatar, setNewStudentAvatar] = useState('🐰');
  const [newStudentStatus, setNewStudentStatus] = useState('나 찾기 100일 퀘스트 시작! 🎒');
  const [newStudentKeywords, setNewStudentKeywords] = useState('그림, 만들기, 독서');
  const [newStudentDays, setNewStudentDays] = useState(1);
  const [newStudentEmotion, setNewStudentEmotion] = useState<EmotionType>('HAPPY');
  const [newStudentNeedsAttention, setNewStudentNeedsAttention] = useState(false);
  const [newStudentAttentionReason, setNewStudentAttentionReason] = useState('');
  const [newStudentTeacherNote, setNewStudentTeacherNote] = useState('');

  const selectedStudent = classmates.find((c) => c.id === selectedStudentId) || classmates[0];

  // Stats for the class
  const totalStudents = classmates.length;
  const completedTodayCount = classmates.filter((c) => c.todayCompleted).length;
  const attentionCount = classmates.filter((c) => c.needsAttention).length;
  const todayRate = totalStudents > 0 ? Math.round((completedTodayCount / totalStudents) * 100) : 0;

  // Filter students
  const filteredList = classmates.filter((c) => {
    if (filterMode === 'INCOMPLETE' && c.todayCompleted) return false;
    if (filterMode === 'ATTENTION' && !c.needsAttention) return false;
    if (searchQuery.trim() && !c.name.includes(searchQuery.trim())) return false;
    return true;
  });

  const handleSelectStudent = (s: Classmate) => {
    playPopSound();
    setSelectedStudentId(s.id);
    setEditingNote(s.teacherNote || '');
    setIsEditingNote(false);
  };

  const handleSaveNote = () => {
    playPopSound();
    onUpdateClassmateNote(selectedStudent.id, editingNote);
    setIsEditingNote(false);
  };

  const handleDelete = (s: Classmate) => {
    playPopSound();
    if (confirm(`'${s.name}' 학생을 명단에서 삭제하시겠습니까?`)) {
      onDeleteStudent(s.id);
      if (selectedStudentId === s.id) {
        const remaining = classmates.filter((c) => c.id !== s.id);
        if (remaining.length > 0) {
          setSelectedStudentId(remaining[0].id);
        }
      }
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      alert('학생 이름을 입력해주세요!');
      return;
    }

    const newStudent: Classmate = {
      id: `student_${Date.now()}`,
      name: newStudentName.trim(),
      avatar: newStudentAvatar,
      statusMessage: newStudentStatus.trim() || '매일 성장하는 멋진 5학년!',
      stats: {
        creativity: 80,
        empathy: 80,
        selfAwareness: 80,
        social: 80,
        curiosity: 80,
      },
      completedDays: Number(newStudentDays) || 1,
      topEmotion: newStudentEmotion,
      keywords: newStudentKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      favoriteAnswer: {
        day: 1,
        question: '내가 하루 중 가장 행복하다고 느낄 때는 언제인가요?',
        answer: '친구들과 웃고 이야기할 때가 가장 행복해요!',
      },
      todayCompleted: Number(newStudentDays) >= 12,
      needsAttention: newStudentNeedsAttention,
      attentionReason: newStudentNeedsAttention ? newStudentAttentionReason.trim() : undefined,
      teacherNote: newStudentTeacherNote.trim(),
    };

    onAddStudent(newStudent);
    setSelectedStudentId(newStudent.id);
    setIsAddModalOpen(false);
    playChimeSuccess();

    // Reset form
    setNewStudentName('');
    setNewStudentAvatar('🐰');
    setNewStudentStatus('나 찾기 100일 퀘스트 시작! 🎒');
    setNewStudentKeywords('그림, 만들기, 독서');
    setNewStudentDays(1);
    setNewStudentEmotion('HAPPY');
    setNewStudentNeedsAttention(false);
    setNewStudentAttentionReason('');
    setNewStudentTeacherNote('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Teacher Dashboard Header */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              🍎 교사용 안심 지도실
            </span>
            <span className="text-xs font-bold text-slate-500">5학년 2반 담당</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mt-1">
            학생 100일 퀘스트 참여 현황 & 마음 돌봄 상담실
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            아이들의 자아 탐험 진행률을 점검하고, 새로운 학생을 명단에 추가하거나 상담 메모를 관리합니다.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 text-center min-w-[90px]">
            <span className="text-[11px] font-bold text-emerald-700 block">오늘 완료율</span>
            <span className="text-xl font-black text-emerald-800">{todayRate}%</span>
            <span className="text-[10px] text-emerald-600 block">({completedTodayCount}/{totalStudents}명)</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100 text-center min-w-[90px]">
            <span className="text-[11px] font-bold text-amber-700 block">마음 관찰 필요</span>
            <span className="text-xl font-black text-amber-800">{attentionCount}명</span>
            <span className="text-[10px] text-amber-600 block">정서 지원 권장</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Student List & Filter */}
        <div className="md:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Users size={15} />
              학급 명단 ({filteredList.length}명)
            </h4>

            {/* [+ 학생 추가] BUTTON */}
            <button
              onClick={() => {
                playPopSound();
                setIsAddModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <UserPlus size={14} />
              <span>학생 추가</span>
            </button>
          </div>

          {/* Search box */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="학생 이름으로 검색..."
              className="text-xs bg-transparent outline-none flex-1 text-slate-800"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                playPopSound();
                setFilterMode('ALL');
              }}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all ${
                filterMode === 'ALL'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              전체 ({totalStudents})
            </button>
            <button
              onClick={() => {
                playPopSound();
                setFilterMode('INCOMPLETE');
              }}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all ${
                filterMode === 'INCOMPLETE'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              미완료 ({totalStudents - completedTodayCount})
            </button>
            <button
              onClick={() => {
                playPopSound();
                setFilterMode('ATTENTION');
              }}
              className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all ${
                filterMode === 'ATTENTION'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              관찰 필요 ({attentionCount})
            </button>
          </div>

          {/* Scrollable Student List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredList.map((s) => {
              const isSelected = s.id === selectedStudent?.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectStudent(s)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{s.avatar}</span>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-800 truncate">{s.name}</span>
                        {s.needsAttention && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-700 shrink-0">
                            관찰
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block truncate">
                        진도: {s.completedDays}/100일 • {s.statusMessage}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {s.todayCompleted ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle size={12} /> 완료
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                        <Clock size={12} /> 미완료
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredList.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                일치하는 학생이 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Confidential Counselling & Student Details */}
        <div className="md:col-span-7 space-y-4">
          {selectedStudent ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              {/* Profile Card */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-3xl shadow-xs">
                    {selectedStudent.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-slate-800">{selectedStudent.name}</h4>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                        5학년 2반
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      최근 감정: <strong className="text-slate-800">{selectedStudent.topEmotion}</strong> • 총 완료 퀘스트: <strong>{selectedStudent.completedDays}일</strong>
                    </p>
                    <p className="text-xs text-amber-700 italic mt-0.5">
                      "{selectedStudent.statusMessage}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedStudent.todayCompleted ? (
                    <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                      오늘 퀘스트 제출됨
                    </span>
                  ) : (
                    <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-xl">
                      오늘 미제출
                    </span>
                  )}

                  {/* Delete student button */}
                  <button
                    onClick={() => handleDelete(selectedStudent)}
                    className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                    title="학생 삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Keywords */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-500">관심 키워드:</span>
                {selectedStudent.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs font-bold px-2.5 py-0.5 rounded-xl bg-slate-100 text-slate-700"
                  >
                    #{kw}
                  </span>
                ))}
              </div>

              {/* Attention Warning Alert Banner */}
              {selectedStudent.needsAttention && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-amber-800 block">정서 관찰 필요 알림:</span>
                    <p className="font-medium mt-0.5">{selectedStudent.attentionReason || '지속적인 감정 추이 관찰이 권장됩니다.'}</p>
                  </div>
                </div>
              )}

              {/* Student's Recent Favorite Answer Inspection */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                <span className="font-black text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <HeartHandshake size={14} className="text-pink-500" />
                  학생의 최근 자아 표현 기록 ({selectedStudent.favoriteAnswer.day}일차)
                </span>
                <p className="font-bold text-slate-800">
                  Q. {selectedStudent.favoriteAnswer.question}
                </p>
                <p className="p-3 bg-white rounded-xl border border-slate-100 text-slate-700 italic leading-relaxed">
                  "{selectedStudent.favoriteAnswer.answer}"
                </p>
              </div>

              {/* Confidential Teacher Consultation Note */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Edit3 size={14} className="text-emerald-600" />
                    교사 비밀 지도 & 상담 메모 (학생에게 비공개)
                  </span>
                  {!isEditingNote && (
                    <button
                      onClick={() => {
                        setEditingNote(selectedStudent.teacherNote || '');
                        setIsEditingNote(true);
                      }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                    >
                      메모 수정
                    </button>
                  )}
                </div>

                {isEditingNote ? (
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      placeholder="이 학생의 성향, 상담 내용, 학부모 소통 사항 등을 비공개로 기록하세요..."
                      className="w-full p-3 rounded-2xl bg-emerald-50/40 border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs text-slate-800 leading-relaxed"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsEditingNote(false)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveNote}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} />
                        저장하기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/30 border border-emerald-200/60 text-xs text-slate-700">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {selectedStudent.teacherNote || '작성된 비밀 상담 메모가 없습니다. [메모 수정]을 눌러 기록을 남겨보세요.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              왼쪽 명단에서 학생을 선택해주세요.
            </div>
          )}
        </div>
      </div>

      {/* [+ 학생 추가] MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border-2 border-emerald-300 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-lg">
                  <UserPlus size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-800">새 학생 명단 추가</h3>
                  <p className="text-xs text-slate-500">5학년 2반 퀘스트 참가 학생을 등록합니다</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  학생 이름 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="예: 김하늘"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  아바타 캐릭터 이모지
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => {
                        playPopSound();
                        setNewStudentAvatar(emoji);
                      }}
                      className={`text-xl p-1.5 rounded-xl transition-all ${
                        newStudentAvatar === emoji
                          ? 'bg-emerald-200 scale-110 shadow-xs'
                          : 'hover:bg-slate-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Message / Resolution */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  한 줄 다짐 / 상태메시지
                </label>
                <input
                  type="text"
                  value={newStudentStatus}
                  onChange={(e) => setNewStudentStatus(e.target.value)}
                  placeholder="예: 나만의 장점을 찾는 모험 시작!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  관심 키워드 (쉼표 구분)
                </label>
                <input
                  type="text"
                  value={newStudentKeywords}
                  onChange={(e) => setNewStudentKeywords(e.target.value)}
                  placeholder="예: 축구, 레고, 만들기"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Days & Emotion */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    현재 완료 일수
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={newStudentDays}
                    onChange={(e) => setNewStudentDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    최근 감정 상태
                  </label>
                  <select
                    value={newStudentEmotion}
                    onChange={(e) => setNewStudentEmotion(e.target.value as EmotionType)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold"
                  >
                    <option value="HAPPY">😊 행복해요</option>
                    <option value="CALM">😌 차분해요</option>
                    <option value="EXCITED">🤩 신나요</option>
                    <option value="ANXIOUS">😰 불안해요</option>
                    <option value="SAD">😢 슬퍼요</option>
                    <option value="TIRED">🥱 피곤해요</option>
                  </select>
                </div>
              </div>

              {/* Needs Attention Toggle */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
                  <input
                    type="checkbox"
                    checked={newStudentNeedsAttention}
                    onChange={(e) => setNewStudentNeedsAttention(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>⚠️ 정서 관찰 필요 학생으로 등록</span>
                </label>
                {newStudentNeedsAttention && (
                  <input
                    type="text"
                    value={newStudentAttentionReason}
                    onChange={(e) => setNewStudentAttentionReason(e.target.value)}
                    placeholder="주의 관찰 사유를 입력하세요 (예: 최근 무기력 호소)"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs text-slate-800 focus:outline-none"
                  />
                )}
              </div>

              {/* Initial Note */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">
                  초기 교사 상담 메모 (비공개)
                </label>
                <textarea
                  rows={2}
                  value={newStudentTeacherNote}
                  onChange={(e) => setNewStudentTeacherNote(e.target.value)}
                  placeholder="학생 특이사항이나 관심사 메모..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>학생 명단 등록 완료</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
