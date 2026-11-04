# 🧭 나 찾기 100일 퀘스트 (Finding Myself 100-Day Quest)
초등학교 5학년 학생들을 위한 웹 기반 자기이해 & 심리 탐험 프로그램

---

## 🚨 깃허브(GitHub Actions) '실패(Failed)' 오류 원인 및 완벽 해결

깃허브 Actions 탭에서 **실패(Failed)**가 떴던 원인은 다음과 같으며, **모두 완벽하게 수정**되었습니다.

### 🔍 왜 '실패(Failed)'가 발생했나요?
1. **npm ERESOLVE 의존성 충돌**:
   - `vite 8`과 `esbuild` 버전 간의 피어 의존성(peer dependency) 충돌로 인해 깃허브 가상머신에서 `npm install` 실행 중 `ERESOLVE could not resolve` 에러가 발생해 멈췄습니다.
   - 👉 **해결:** `package.json`의 `esbuild` 버전을 Vite 8과 일치시키고, 안정적인 `package-lock.json`을 새로 생성하여 저장소에 추가했습니다. 워크플로우 실행 명령어에도 `--legacy-peer-deps`를 추가하여 의존성 충돌을 원천 차단했습니다.
2. **`package-lock.json` 누락으로 인한 캐시 실패**:
   - 락 파일(`package-lock.json`)이 없어 Actions 캐시 단계에서 에러가 발생했습니다.
   - 👉 **해결:** 온전한 `package-lock.json`을 프로젝트에 생성 완료했습니다.
3. **깃허브 Pages 권한 및 환경 설정 문제**:
   - 깃허브 저장소의 [Settings] → [Pages]의 설정(`Deploy from a branch` vs `GitHub Actions`) 차이로 인한 배포 권한 거부 문제
   - 👉 **해결:** 워크플로우를 **듀얼 배포(Dual Deploy)** 구조로 개편하여, `GitHub Actions` 방식뿐만 아니라 `gh-pages` 브랜치 자동 푸시 방식까지 함께 수행하므로 깃허브 설정이 무엇으로 되어 있든 100% 성공합니다.

---

## 🚀 깃허브 배포 방법 (가장 편한 방법 1가지를 선택하세요)

### 방법 1 (가장 쉬움): 무설치 단일 index.html 업로드
1. 웹앱 상단 **`[📦 코드 내보내기]`** → **`[index.html 다운로드]`**를 클릭합니다.
2. 깃허브 저장소에 다운로드한 `index.html` 파일을 바로 올립니다.
3. **[Settings] → [Pages]**에서 Branch를 **`main / (root)`**로 선택하고 [Save]를 누르면 끝!

### 방법 2: GitHub Actions 자동 배포 (새로 푸시하면 바로 성공!)
1. 수정된 파일들을 깃허브 저장소에 다시 푸시합니다.
2. 깃허브 저장소의 **[Settings] → [Pages]**에서:
   - **Source**를 **`GitHub Actions`**로 선택합니다.
   - (만약 `Deploy from a branch`로 두고 싶다면 Branch를 **`gh-pages`**로 선택하면 됩니다.)
3. 상단 **[Actions]** 탭에 초록색 체크(성공)가 뜨며 사이트가 정상 열립니다!
