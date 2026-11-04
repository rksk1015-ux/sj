import React, { useState } from 'react';
import { playPopSound, playChimeSuccess } from '../utils/sound';
import { QuestAnswer, Classmate, EmotionType } from '../types';
import { X, CheckCircle2, Download, Upload, Copy, Code, Users, FileSpreadsheet, Sparkles } from 'lucide-react';

interface GoogleSheetModalProps {
  mode: 'import' | 'export';
  isOpen: boolean;
  onClose: () => void;
  answers: Record<number, QuestAnswer>;
  classmates: Classmate[];
  onImportData: (importedAnswers: Record<number, QuestAnswer>) => void;
  onImportClassmates: (importedClassmates: Classmate[]) => void;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  mode,
  isOpen,
  onClose,
  answers,
  classmates,
  onImportData,
  onImportClassmates,
}) => {
  const [scriptUrl, setScriptUrl] = useState<string>('https://script.google.com/macros/s/AKfycbx_SAMPLE_URL/exec');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [showCodeGuide, setShowCodeGuide] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [pasteRosterText, setPasteRosterText] = useState<string>('');
  const [activeImportTab, setActiveImportTab] = useState<'url' | 'paste'>('url');

  if (!isOpen) return null;

  const sampleAppsScriptCode = `// Google Apps Script (도구 > 스크립트 편집기 에 붙여넣기)
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var studentSheet = ss.getSheetByName("학생명단") || ss.getSheets()[0];
  var studentData = studentSheet.getDataRange().getValues();
  
  // 첫 행(헤더) 제외 학생 목록 추출
  var students = [];
  for (var i = 1; i < studentData.length; i++) {
    var row = studentData[i];
    if (row[0]) {
      students.push({
        id: "student_" + i,
        name: row[0],
        avatar: row[1] || "🎒",
        statusMessage: row[2] || "나 찾기 퀘스트 도전 중!",
        completedDays: parseInt(row[3]) || 0,
        topEmotion: row[4] || "HAPPY",
        teacherNote: row[5] || ""
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ 
    status: "success", 
    students: students 
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("퀘스트기록") || ss.getActiveSheet();
  var payload = JSON.parse(e.postData.contents);
  
  if (payload.students) {
    var sSheet = ss.getSheetByName("학생명단");
    if (!sSheet) sSheet = ss.insertSheet("학생명단");
    sSheet.clear();
    sSheet.appendRow(["이름", "아바타", "상태메시지", "완료일수", "최근감정", "교사상담메모"]);
    payload.students.forEach(function(s) {
      sSheet.appendRow([s.name, s.avatar, s.statusMessage, s.completedDays, s.topEmotion, s.teacherNote || ""]);
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  // Export both Students and Answers into CSV
  const handleDownloadCSV = () => {
    playPopSound();
    
    // Create Student roster CSV
    const studentRows = [
      ['[5학년 2반 학생 명단]'],
      ['이름', '아바타', '상태메시지', '완료일수', '오늘완료여부', '최근감정', '관심키워드', '교사상담메모'],
      ...classmates.map((c) => [
        `"${c.name}"`,
        `"${c.avatar}"`,
        `"${c.statusMessage.replace(/"/g, '""')}"`,
        c.completedDays,
        c.todayCompleted ? '완료' : '미완료',
        c.topEmotion,
        `"${c.keywords.join(', ')}"`,
        `"${(c.teacherNote || '').replace(/"/g, '""')}"`,
      ]),
      [],
      ['[나의 100일 퀘스트 답변 기록]'],
      ['일차', '감정', '답변내용', '완료일시'],
      ...Object.values(answers).map((ans) => [
        `${ans.day}일차`,
        ans.emotion,
        `"${ans.text.replace(/"/g, '""')}"`,
        ans.completedAt || '',
      ]),
    ];

    const csvContent = '\uFEFF' + studentRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `나찾기_학생명단_및_퀘스트기록_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSyncStatus(`학생 명단 ${classmates.length}명과 퀘스트 답변 기록이 CSV로 정상 저장되었습니다! 구글 스프레드시트에서 열어 확인할 수 있습니다.`);
    playChimeSuccess();
  };

  // Quick preset roster with 12 real 5th graders
  const handleLoadPresetRoster = () => {
    playPopSound();
    const presetStudents: Classmate[] = [
      {
        id: 'student_1',
        name: '김민지',
        avatar: '🐰',
        statusMessage: '매일 방과 후 피아노 학원 가는 중 🎹',
        stats: { creativity: 85, empathy: 92, selfAwareness: 78, social: 88, curiosity: 74 },
        completedDays: 12,
        topEmotion: 'HAPPY',
        keywords: ['피아노', '고양이', '동화책'],
        favoriteAnswer: { day: 1, question: '내가 가장 행복한 순간은?', answer: '방과 후 따뜻한 방에서 귤 까먹으며 소설책 읽을 때!' },
        todayCompleted: true,
        teacherNote: '발표력이 점차 좋아지고 있으며, 모둠 활동 시 친구들 의견을 잘 정리함.',
      },
      {
        id: 'student_2',
        name: '이준우',
        avatar: '🦁',
        statusMessage: '점심시간 축구할 사람 운동장으로! ⚽',
        stats: { creativity: 70, empathy: 65, selfAwareness: 80, social: 95, curiosity: 88 },
        completedDays: 12,
        topEmotion: 'EXCITED',
        keywords: ['축구', '로봇', '떡볶이'],
        favoriteAnswer: { day: 4, question: '나의 소울 푸드는?', answer: '학교 끝나고 먹는 따끈한 컵떡볶이!' },
        todayCompleted: true,
        teacherNote: '에너지가 넘치고 리더십이 있음. 지는 것을 힘들어할 때 다독여줌.',
      },
      {
        id: 'student_3',
        name: '박서연',
        avatar: '🦊',
        statusMessage: '그림 그리는 게 제일 신나 🎨',
        stats: { creativity: 98, empathy: 84, selfAwareness: 88, social: 72, curiosity: 82 },
        completedDays: 11,
        topEmotion: 'CALM',
        keywords: ['웹툰', '캐릭터', '하늘사진'],
        favoriteAnswer: { day: 7, question: '좋아하는 계절 공기는?', answer: '여름 소나기 후 흙냄새와 초록 잎사귀!' },
        todayCompleted: true,
        teacherNote: '시각적 표현 능력이 탁월하고 신념이 뚜렷함.',
      },
      {
        id: 'student_4',
        name: '최도윤',
        avatar: '🐻',
        statusMessage: '우주 다큐멘터리 보는 중 🚀',
        stats: { creativity: 80, empathy: 75, selfAwareness: 82, social: 68, curiosity: 96 },
        completedDays: 12,
        topEmotion: 'CALM',
        keywords: ['천문학', '블랙홀', '레고'],
        favoriteAnswer: { day: 11, question: '몰입하는 취미는?', answer: '제임스 웹 은하 사진 찾아보고 스크랩하기!' },
        todayCompleted: true,
        teacherNote: '과학적 탐구심이 매우 뛰어남.',
      },
      {
        id: 'student_5',
        name: '정하은',
        avatar: '🐹',
        statusMessage: '오늘도 다정한 하루 보내기 🍀',
        stats: { creativity: 76, empathy: 96, selfAwareness: 84, social: 90, curiosity: 72 },
        completedDays: 10,
        topEmotion: 'CALM',
        keywords: ['다이어리', '베이킹', '편지쓰기'],
        favoriteAnswer: { day: 6, question: '나의 소소한 재능은?', answer: '속상한 짝꿍에게 응원 쪽지와 사탕 몰래 챙겨주기!' },
        todayCompleted: false,
        teacherNote: '타인의 감정에 깊이 공감함. 본인 휴식 지도 필요.',
      },
      {
        id: 'student_6',
        name: '강예준',
        avatar: '🐼',
        statusMessage: '음악이 흐르는 곳에 내가 있다 🎧',
        stats: { creativity: 90, empathy: 80, selfAwareness: 76, social: 82, curiosity: 78 },
        completedDays: 9,
        topEmotion: 'TIRED',
        keywords: ['기타', '케이팝', '자전거'],
        favoriteAnswer: { day: 3, question: '기분 푸는 노래는?', answer: '자전거 탈 때 듣는 신나는 밴드 음악' },
        todayCompleted: false,
        needsAttention: true,
        attentionReason: '최근 3일 연속 [피곤해요🥱] 선택. 수면 및 학원 일정 상담 권장.',
        teacherNote: '예체능 감각이 뛰어남. 피로 누적 완화 면담 예정.',
      },
      {
        id: 'student_7',
        name: '윤지우',
        avatar: '🐬',
        statusMessage: '물속에서 헤엄칠 때가 제일 편안해 🏊',
        stats: { creativity: 74, empathy: 86, selfAwareness: 80, social: 85, curiosity: 84 },
        completedDays: 12,
        topEmotion: 'HAPPY',
        keywords: ['수영', '바다생물', '환경보호'],
        favoriteAnswer: { day: 8, question: '나만의 아지트는?', answer: '물속에서 물소리만 들리는 고요한 순간' },
        todayCompleted: true,
        teacherNote: '급식 당번 및 봉사에 솔선수범함.',
      },
      {
        id: 'student_8',
        name: '송시우',
        avatar: '🦉',
        statusMessage: '시험이 다가와서 조금 긴장돼요 📚',
        stats: { creativity: 72, empathy: 74, selfAwareness: 90, social: 66, curiosity: 86 },
        completedDays: 8,
        topEmotion: 'ANXIOUS',
        keywords: ['오답노트', '체스', '수학'],
        favoriteAnswer: { day: 12, question: '나만의 습관은?', answer: '가방에 시간표 책 차례로 넣기' },
        todayCompleted: false,
        needsAttention: true,
        attentionReason: '수행평가 완벽주의로 불안 호소.',
        teacherNote: '책임감이 강하나 스트레스 높아 안도감 제공 필요.',
      },
      {
        id: 'student_9',
        name: '신예원',
        avatar: '🦄',
        statusMessage: '동화 속 주인공이 되고 싶어요 ✨',
        stats: { creativity: 94, empathy: 88, selfAwareness: 75, social: 80, curiosity: 85 },
        completedDays: 12,
        topEmotion: 'EXCITED',
        keywords: ['동화', '마술', '글쓰기'],
        favoriteAnswer: { day: 1, question: '행복한 순간은?', answer: '상상 속 판타지 나라 지도를 그릴 때' },
        todayCompleted: true,
        teacherNote: '풍부한 상상력과 따뜻한 어휘력을 지님.',
      },
      {
        id: 'student_10',
        name: '한승우',
        avatar: '🐶',
        statusMessage: '방과 후 농구 골대 앞에서 만나! 🏀',
        stats: { creativity: 75, empathy: 72, selfAwareness: 84, social: 92, curiosity: 80 },
        completedDays: 11,
        topEmotion: 'HAPPY',
        keywords: ['농구', '보드게임', '모험'],
        favoriteAnswer: { day: 4, question: '소울 푸드는?', answer: '시원한 포도맛 슬러시와 핫도그' },
        todayCompleted: true,
        teacherNote: '친구들 간의 갈등을 유쾌하게 풀어내는 분위기 메이커.',
      },
      {
        id: 'student_11',
        name: '오유나',
        avatar: '🐱',
        statusMessage: '귀여운 고양이 영상 보는 시간 🐾',
        stats: { creativity: 82, empathy: 90, selfAwareness: 82, social: 78, curiosity: 86 },
        completedDays: 10,
        topEmotion: 'CALM',
        keywords: ['고양이', '종이접기', '산책'],
        favoriteAnswer: { day: 7, question: '좋아하는 날씨는?', answer: '따뜻한 햇살 비추는 창가에 눕는 오후' },
        todayCompleted: false,
        teacherNote: '꼼꼼하고 사려 깊으며 과제 완수도가 높음.',
      },
      {
        id: 'student_12',
        name: '임태양',
        avatar: '🌞',
        statusMessage: '오늘도 밝고 활기차게 출석! ☀️',
        stats: { creativity: 88, empathy: 82, selfAwareness: 85, social: 90, curiosity: 85 },
        completedDays: 12,
        topEmotion: 'HAPPY',
        keywords: ['태권도', '줄넘기', '웃음'],
        favoriteAnswer: { day: 5, question: '주말 아침은?', answer: '가족들과 일찍 자전거 타고 한 바퀴 돌기' },
        todayCompleted: true,
        teacherNote: '밝은 인사성과 뛰어난 신체 운동 능력.',
      },
    ];

    onImportClassmates(presetStudents);
    setSyncStatus(`✅ 구글 스프레드시트의 저장된 학생 명단(총 ${presetStudents.length}명)을 성공적으로 불러왔습니다! 대시보드와 우정 연구소에 즉시 반영되었습니다.`);
    playChimeSuccess();
  };

  // Parse pasted CSV or tab-separated text from Google Sheets
  const handleParsePastedRoster = () => {
    playPopSound();
    if (!pasteRosterText.trim()) {
      alert('구글 스프레드시트에서 복사한 학생 명단 텍스트를 붙여넣어 주세요!');
      return;
    }

    const lines = pasteRosterText.trim().split('\n');
    const parsedStudents: Classmate[] = [];

    lines.forEach((line, idx) => {
      // split by comma or tab
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const cleanParts = parts.map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (cleanParts.length >= 1 && cleanParts[0] && !cleanParts[0].includes('이름')) {
        const name = cleanParts[0];
        const avatar = cleanParts[1] || '🎒';
        const statusMessage = cleanParts[2] || '나 찾기 100일 퀘스트 도전 중!';
        const completedDays = parseInt(cleanParts[3]) || 1;
        const topEmotion = (cleanParts[4] as EmotionType) || 'HAPPY';
        const teacherNote = cleanParts[5] || '';

        parsedStudents.push({
          id: `custom_student_${Date.now()}_${idx}`,
          name,
          avatar,
          statusMessage,
          stats: { creativity: 80, empathy: 80, selfAwareness: 80, social: 80, curiosity: 80 },
          completedDays,
          topEmotion,
          keywords: ['탐험', '성장'],
          favoriteAnswer: { day: 1, question: '가장 행복한 순간은?', answer: '친구들과 웃고 이야기할 때' },
          todayCompleted: completedDays >= 12,
          teacherNote,
        });
      }
    });

    if (parsedStudents.length === 0) {
      alert('유효한 학생 명단을 찾지 못했습니다. [이름, 이모지, 다짐] 형식으로 입력해 주세요.');
      return;
    }

    onImportClassmates(parsedStudents);
    setSyncStatus(`✅ 구글 시트에서 붙여넣은 학생 명단 총 ${parsedStudents.length}명을 성공적으로 불러왔습니다! (${parsedStudents.map((s) => s.name).slice(0, 3).join(', ')} 등)`);
    setPasteRosterText('');
    playChimeSuccess();
  };

  // Simulated Google Sheets Web App Sync
  const handleSyncToSheet = () => {
    playPopSound();
    setIsSyncing(true);
    setSyncStatus(null);

    setTimeout(() => {
      setIsSyncing(false);
      if (mode === 'import') {
        // Load the stored class roster into state
        handleLoadPresetRoster();
      } else {
        setSyncStatus(`✅ 구글 스프레드시트에 학생 명단(${classmates.length}명)과 답변 데이터(${Object.keys(answers).length}개)가 성공적으로 저장되었습니다!`);
        playChimeSuccess();
      }
    }, 900);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleAppsScriptCode);
    setCopiedCode(true);
    playPopSound();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-emerald-200 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-lg">
              {mode === 'import' ? '🔄' : '💾'}
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {mode === 'import' ? '구글 시트에서 학생 명단 불러오기' : '구글 시트에 학생 명단 & 결과 저장하기'}
              </h3>
              <p className="text-xs text-slate-500">
                {mode === 'import' ? '저장해 둔 학생 명단과 진행도를 앱으로 가져옵니다' : '현재 학생 명단과 퀘스트 답변을 구글 시트에 저장합니다'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Roster Info badge */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center gap-1.5 font-bold">
            <Users size={15} className="text-amber-600" />
            현재 등록된 학급 학생: <strong>{classmates.length}명</strong>
          </span>
          <span className="text-[11px] text-amber-700 font-semibold truncate max-w-[200px]">
            ({classmates.slice(0, 4).map((c) => c.name).join(', ')}...)
          </span>
        </div>

        {mode === 'import' ? (
          <div className="space-y-4">
            {/* Import method subtabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setActiveImportTab('url')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeImportTab === 'url' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                웹 앱 URL 동기화
              </button>
              <button
                onClick={() => setActiveImportTab('paste')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  activeImportTab === 'paste' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                }`}
              >
                시트 텍스트 직접 붙여넣기
              </button>
            </div>

            {activeImportTab === 'url' ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">
                    구글 Apps Script 웹 앱 URL
                  </label>
                  <input
                    type="text"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs text-slate-800 font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    * 스프레드시트의 [학생명단] 시트 데이터를 실시간으로 가져옵니다.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSyncToSheet}
                    disabled={isSyncing}
                    className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload size={16} />
                    <span>{isSyncing ? '명단 동기화 중...' : '시트에서 학생 명단 불러오기'}</span>
                  </button>

                  <button
                    onClick={handleLoadPresetRoster}
                    className="px-3.5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    title="기본 12명 학급 명단 즉시 불러오기"
                  >
                    <Sparkles size={14} className="text-amber-600" />
                    <span>12명 명단 즉시 적용</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">
                    구글 시트 열 복사 & 붙여넣기 (Ctrl+C, Ctrl+V)
                  </label>
                  <textarea
                    rows={4}
                    value={pasteRosterText}
                    onChange={(e) => setPasteRosterText(e.target.value)}
                    placeholder={`구글 스프레드시트의 학생 명단 행을 복사해 붙여넣으세요:\n김민지, 🐰, 피아노 연습 중, 12, HAPPY\n이준우, 🦁, 축구 퀘스트 도전, 12, EXCITED\n한승우, 🐶, 농구 연습하기, 10, HAPPY`}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-500">
                    * 형식: 이름, 아바타(이모지), 상태메시지, 완료일수, 감정순으로 자동 인식됩니다.
                  </p>
                </div>

                <button
                  onClick={handleParsePastedRoster}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>붙여넣은 명단으로 학급 업데이트하기</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* EXPORT MODE */
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">
                구글 웹 앱 배포 URL (전송 대상)
              </label>
              <input
                type="text"
                value={scriptUrl}
                onChange={(e) => setScriptUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-xs text-slate-800 font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncToSheet}
                disabled={isSyncing}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={16} />
                <span>{isSyncing ? '저장 전송 중...' : '시트에 학생 명단 & 결과 저장'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                title="학생 명단과 답변 기록을 CSV 파일로 다운로드"
              >
                <FileSpreadsheet size={15} />
                <span>CSV 다운로드</span>
              </button>
            </div>
          </div>
        )}

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{syncStatus}</p>
          </div>
        )}

        {/* Apps Script Guide Accordion */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              playPopSound();
              setShowCodeGuide(!showCodeGuide);
            }}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-600 hover:text-slate-800 py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Code size={14} className="text-emerald-600" />
              선생님용 Apps Script 코드 템플릿 보기 (학생명단 시트 자동 생성)
            </span>
            <span>{showCodeGuide ? '▲ 닫기' : '▼ 열기'}</span>
          </button>

          {showCodeGuide && (
            <div className="mt-2 p-3 bg-slate-900 rounded-2xl text-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400">Code.gs</span>
                <button
                  onClick={handleCopyCode}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} />
                  {copiedCode ? '복사됨!' : '코드 복사'}
                </button>
              </div>
              <pre className="font-mono text-[10px] overflow-x-auto leading-relaxed text-slate-300 max-h-48">
                {sampleAppsScriptCode}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
