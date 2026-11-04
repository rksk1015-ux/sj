# 🧭 나 찾기 100일 퀘스트 (Finding Myself 100-Day Quest)
초등학교 5학년 학생들을 위한 웹 기반 자기이해 & 심리 탐험 프로그램

---

## 🚨 깃허브(GitHub Pages) 빈 페이지 해결 안내

깃허브 저장소에 코드를 올렸을 때 흰색 빈 화면(Blank Page)이 나오는 주된 원인은 다음과 같으며, 본 프로젝트는 **모두 해결 조치**되어 있습니다.

### 1. 원인과 해결 내용
- **자산 경로 404 오류 (해결 완료)**: 
  - 기본 Vite 빌드는 절대 경로(`/assets/`)로 스크립트를 불러와, `https://<아이디>.github.io/<저장소명>/` 서브 경로에서 404가 발생합니다.
  - `vite.config.ts`에 **`base: './'` (상대 경로)**를 설정하여 어느 경로에서도 자산이 정상 로드됩니다.
- **빌드되지 않은 `.tsx` 파일 직접 실행 불가 (해결 완료)**:
  - 브라우저는 TypeScript JSX(`.tsx`)를 직접 실행하지 못합니다.
  - 저장소에 **`.github/workflows/deploy.yml` (GitHub Actions 자동 빌드 및 배포)**을 추가하여 저장소에 푸시하면 자동으로 `npm run build` 후 GitHub Pages로 발행됩니다.
  - 루트 `index.html`에 **정적 자동 감지 및 단일 파일(`standalone_single_file.html`) 자동 전환 스크립트**가 탑재되어 빌드 없이 올려도 빈 화면 없이 작동합니다.
- **Jekyll 정적 파일 필터링 방지 (해결 완료)**:
  - **`.nojekyll`** 파일이 추가되어 깃허브가 정적 자산을 온전히 서빙합니다.

---

## 🚀 깃허브에 배포하는 2가지 방법

### 방법 A: 초보자용 가장 간단한 방법 (무설치 1분 완성)
1. 상단 메뉴의 **`[📦 코드 내보내기]`** 버튼을 누르고 **`[index.html 다운로드]`**를 클릭합니다.
2. 깃허브 저장소(Repository)에 다운로드한 `index.html` 파일을 업로드합니다.
3. 깃허브 저장소의 **[Settings] → [Pages]**로 이동합니다.
4. **Build and deployment → Branch**를 **`main / (root)`**로 선택하고 [Save]를 누릅니다.
5. 1~2분 후 생성되는 URL에 접속하면 빈 화면 없이 완벽하게 작동합니다!

### 방법 B: GitHub Actions 자동 빌드 배포
1. 본 프로젝트의 전체 파일(`.github`, `src`, `package.json` 등)을 깃허브 `main` 브랜치에 푸시합니다.
2. 깃허브 저장소의 **[Settings] → [Pages]**로 이동합니다.
3. **Build and deployment → Source**를 **`GitHub Actions`**로 변경합니다.
4. 상단 **[Actions]** 탭에서 배포가 완료되면 생성된 링크로 접속합니다.
