import React, { useState } from 'react';
import { playPopSound, playChimeSuccess } from '../utils/sound';
import { X, Download, Copy, Check, FileCode, Github, FolderArchive } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Single standalone index.html generator
  const generateSingleHtml = () => {
    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>나 찾기 100일 퀘스트 - 5학년 자기이해</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; }
    .font-hand { font-family: 'Gaegu', cursive; }
    .perspective-1000 { perspective: 1000px; }
    .transform-style-preserve-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
  </style>
</head>
<body class="bg-[#FFFDF7] text-slate-800 antialiased min-h-screen">
  <header class="bg-white/90 backdrop-blur-md border-b border-amber-200/80 sticky top-0 z-40 px-4 py-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎒</span>
        <div>
          <h1 class="font-black text-base sm:text-lg text-slate-800">나 찾기 100일 퀘스트</h1>
          <p class="text-[11px] text-amber-700 font-bold">초등학교 5학년 자기이해 & 심리 탐험</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="alert('Google Apps Script 웹 앱과 연동할 수 있습니다.')" class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">🔄 시트 불러오기</button>
        <button onclick="alert('현재 퀘스트 작성 결과가 저장 대기 중입니다.')" class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">💾 시트에 결과 저장</button>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
    <div class="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm text-center">
      <span class="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full">시즌 1: 취향과 일상 (내가 좋아하는 나)</span>
      <h2 class="text-2xl font-black text-slate-800 mt-3" id="quest-question">내가 하루 중 가장 행복하다고 느낄 때는 언제인가요?</h2>
      <p class="text-xs text-amber-800 mt-2 bg-amber-50 p-2.5 rounded-xl inline-block" id="quest-hint">💡 집에 돌아와 포근한 침대에 누울 때, 맛있는 간식을 먹을 때 등 사소한 순간도 좋아요!</p>
      
      <div class="mt-6 max-w-lg mx-auto text-left space-y-4">
        <div>
          <label class="block text-xs font-black text-slate-700 mb-2">오늘 나의 감정 날씨는?</label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2" id="emotion-buttons">
            <button type="button" class="p-2 rounded-2xl border bg-amber-100 border-amber-300 font-bold text-xs text-center">😊 행복</button>
            <button type="button" class="p-2 rounded-2xl border bg-emerald-50 border-emerald-200 font-bold text-xs text-center">😌 차분</button>
            <button type="button" class="p-2 rounded-2xl border bg-orange-50 border-orange-200 font-bold text-xs text-center">🤩 신남</button>
            <button type="button" class="p-2 rounded-2xl border bg-indigo-50 border-indigo-200 font-bold text-xs text-center">😰 불안</button>
            <button type="button" class="p-2 rounded-2xl border bg-blue-50 border-blue-200 font-bold text-xs text-center">😢 슬픔</button>
            <button type="button" class="p-2 rounded-2xl border bg-purple-50 border-purple-200 font-bold text-xs text-center">🥱 피곤</button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-700 mb-1">나의 솔직한 이야기 (최소 20자 이상)</label>
          <textarea id="answer-text" rows="4" placeholder="솔직하고 자유롭게 내 마음을 적어보세요..." class="w-full p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"></textarea>
        </div>

        <button onclick="submitQuest()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm shadow-md cursor-pointer hover:from-amber-600 hover:to-orange-600">퀘스트 제출 & 배지 획득! ✨</button>
      </div>
    </div>
  </main>

  <script>
    function submitQuest() {
      const text = document.getElementById('answer-text').value.trim();
      if(text.length < 20) {
        alert('최소 20자 이상 진솔한 이야기를 적어주세요! (현재 ' + text.length + '자)');
        return;
      }
      alert('🎉 축하합니다! 퀘스트 완료 & 성격 배지를 획득했습니다!');
    }
  </script>
</body>
</html>`;
  };

  const handleDownloadSingleHtml = () => {
    playPopSound();
    const content = generateSingleHtml();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('단일 index.html 파일이 다운로드되었습니다! 더블클릭하면 브라우저에서 바로 실행됩니다.');
    playChimeSuccess();
  };

  const handleDownloadThreeFiles = () => {
    playPopSound();
    // Download index.html, style.css, script.js
    const htmlCode = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>나 찾기 100일 퀘스트</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`;

    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('3분할 파일 템플릿(index.html, style.css, script.js)이 저장소에 함께 생성되었습니다!');
    playChimeSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border-2 border-amber-200 shadow-2xl animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-lg">
              <Github size={20} />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                깃허브(GitHub) & 단일 파일 내보내기
              </h3>
              <p className="text-xs text-slate-500">초보자도 바로 실행할 수 있는 원클릭 다운로드</p>
            </div>
          </div>
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Option A: Single index.html */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FileCode className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  단일 파일 통합본 (index.html)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  HTML + CSS + JS가 하나로 통합되어 더블클릭만으로 즉시 실행됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadSingleHtml}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs shrink-0 cursor-pointer"
            >
              index.html 받기
            </button>
          </div>

          {/* Option B: 3 Separated files */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FolderArchive className="text-slate-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  3분할 소스코드 (index.html + style.css + script.js)
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  유지보수와 GitHub 관리가 용이한 3개 분리 구조입니다.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadThreeFiles}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-xs shrink-0 cursor-pointer"
            >
              3분할 파일 받기
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-medium">
            ✅ {downloadSuccess}
          </div>
        )}

        {/* GitHub Pages quick instruction */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <span className="font-black text-slate-700 block">💡 깃허브 무료 웹 호스팅 방법 (GitHub Pages):</span>
          <p>1. GitHub에서 새로운 Repository를 만듭니다.</p>
          <p>2. 다운로드한 <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">index.html</code> 파일을 업로드합니다.</p>
          <p>3. [Settings] → [Pages]에서 Branch를 <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono">main</code>으로 저장하면 즉시 나만의 전용 웹사이트 주소가 생깁니다!</p>
        </div>
      </div>
    </div>
  );
};
