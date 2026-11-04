import React, { useState } from 'react';
import { playPopSound, playChimeSuccess } from '../utils/sound';
import { X, Download, Copy, Check, FileCode, Github, FolderArchive, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // Single standalone index.html generator
  const handleDownloadSingleHtml = async () => {
    playPopSound();
    try {
      // Fetch or use the standalone HTML template
      const res = await fetch('./standalone_single_file.html');
      let content = '';
      if (res.ok) {
        content = await res.text();
      } else {
        content = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>나 찾기 100일 퀘스트</title></head><body><p>나 찾기 100일 퀘스트</p></body></html>`;
      }
      const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'index.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadSuccess('초보자용 무설치 단일 index.html 파일이 다운로드되었습니다! 이 파일을 깃허브 저장소 루트에 올리면 빈 페이지 없이 즉시 실행됩니다.');
      playChimeSuccess();
    } catch {
      window.open('./standalone_single_file.html', '_blank');
    }
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
    setDownloadSuccess('3분할 파일(index.html, style.css, script.js)이 저장소에 준비되어 있습니다.');
    playChimeSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 border-2 border-amber-200 shadow-2xl animate-in fade-in zoom-in-95 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 text-lg">
              <Github size={20} />
            </span>
            <div>
              <h3 className="text-lg font-black text-slate-800">
                깃허브(GitHub) 배포 & 빈 페이지 해결 안내
              </h3>
              <p className="text-xs text-slate-500">초보자도 1분 만에 정상 작동하도록 조치되었습니다</p>
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

        {/* 빈 페이지 원인 & 해결 안내 Alert */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2 text-amber-900">
          <div className="flex items-center gap-1.5 font-black text-amber-800 text-sm">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>깃허브에 들어갔을 때 빈 페이지가 떴던 이유와 해결책:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 font-medium text-slate-700">
            <li>
              <strong>원인 1 (경로 오류):</strong> Vite 기본 빌드가 절대 경로(<code className="bg-white px-1 py-0.5 rounded text-rose-600 font-mono">/assets/</code>)로 설정되어 깃허브 저장소 주소(<code className="bg-white px-1 py-0.5 rounded font-mono">username.github.io/repo/</code>)에서 스크립트를 못 찾는 문제
              👉 <strong><code className="text-emerald-700 font-bold">base: './'</code> (상대 경로) 설정으로 완벽 해결!</strong>
            </li>
            <li>
              <strong>원인 2 (빌드 생략):</strong> <code className="bg-white px-1 py-0.5 rounded font-mono">npm run build</code> 없이 원본 <code className="bg-white px-1 py-0.5 rounded font-mono">.tsx</code> 파일이 있는 저장소를 그대로 올리면 일반 브라우저가 해석하지 못해 흰 화면이 뜸
              👉 <strong><code className="text-emerald-700 font-bold">.github/workflows/deploy.yml</code> (GitHub Actions 자동 빌드 배포) 설정 완료!</strong>
            </li>
            <li>
              <strong>원인 3 (Jekyll 충돌):</strong> 깃허브가 특정 정적 파일을 무시하는 현상
              👉 <strong><code className="text-emerald-700 font-bold">.nojekyll</code> 파일 추가 완료!</strong>
            </li>
          </ul>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {/* Option A: Single index.html */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <FileCode className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-slate-800">
                    [초보자 강력 추천] 단일 통합 index.html 받기
                  </h4>
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded-md font-black">무설치</span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  빌드 과정 없이 이 파일 하나만 깃허브에 올리거나 더블클릭하면 100% 빈 화면 없이 바로 뜹니다.
                </p>
              </div>
            </div>
            <button
              onClick={handleDownloadSingleHtml}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs shrink-0 cursor-pointer"
            >
              index.html 다운로드
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
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Step-by-step GitHub Pages instructions */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
          <span className="font-black text-slate-800 block">✨ 깃허브 저장소에서 빈 페이지 없이 호스팅하는 2가지 방법:</span>
          <div className="space-y-1 text-slate-600">
            <p><strong>방법 1 (가장 쉬움):</strong> 다운로드한 <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">index.html</code> 파일을 깃허브 저장소에 업로드하고, <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">Settings → Pages</code>에서 Branch를 <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">main / root</code>로 저장하면 끝!</p>
            <p><strong>방법 2 (GitHub Actions):</strong> <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">Settings → Pages → Source</code>를 <code className="bg-slate-200 px-1 py-0.2 rounded font-mono text-slate-800">GitHub Actions</code>로 선택하면 저장소에 추가된 워크플로우가 자동으로 최신 빌드본을 배포합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
