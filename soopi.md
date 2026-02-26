# soopi-utils — 스트리머 유틸 2종 (LoL / PUBG) React 구현 + GitHub Pages 배포 (Codex용)

## 0) 목표
스트리머가 방송 중 빠르게 사용할 수 있는 팀 섞기 유틸 2종을 **React + Vite**로 구현하고, **GitHub Pages**에 배포한다.

- 유틸 A: **LoL 랜덤 팀 섞기** (**2열 5행**, 포지션 고정, 팀만 좌우 swap)
- 유틸 B: **PUBG 랜덤 팀 섞기** (**2열 4행**, 티어 고정, 팀만 좌우 swap)
- 공통 기능: **행(포지션/티어) 고정(락)**, **다크모드**, **반응형**, **localStorage 저장**
- 배포: GitHub Actions로 build 후 Pages 자동 배포

---

## 1) GitHub 정보(배포 확정값)
- GitHub Profile: https://github.com/50091page
- Repo Name: **soopi-utils**
- GitHub Pages(개인 도메인): https://50091page.github.io/
- Pages URL(프로젝트): **https://50091page.github.io/soopi-utils/**
- Vite base 경로: **`/soopi-utils/`**

---

## 2) 핵심 개념(중요)
- “2열”은 **좌팀/우팀 2개 팀 컬럼**을 의미한다.
- “N행”은 **포지션(LoL) 또는 티어(PUBG) 행**을 의미한다.
- 즉, 각 행은 하나의 포지션/티어를 나타내며, 그 행 안에서 **좌팀 ↔ 우팀만 랜덤 swap**된다.

---

## 3) UX / 디자인 요구 (세련되고 반응형)
- 상단 헤더(타이틀 + 다크모드 토글)
- 본문 카드 2개:
  - `LoL 랜덤 팀 섞기`
  - `PUBG 랜덤 팀 섞기`
- 모바일: 카드 세로 스택, 입력칸/버튼 크게(터치 친화)
- 행 단위(포지션/티어)가 명확하도록 **각 행을 카드/행 블록처럼** 보이게 처리 권장
- 각 행의 라벨(예: 탑, 정글…) 옆에 🔒 고정 토글 제공

---

## 4) 공통 기능 요구사항

### 4.1 입력 그리드(수정된 레이아웃)
- 공통 레이아웃: **2열 × N행**
- 열(컬럼) 고정:
  - 1열: **좌팀 input**
  - 2열: **우팀 input**
- 행(로우) 고정:
  - LoL: 탑/정글/미드/원딜/서폿 (총 5행)
  - PUBG: 1~4티어 (총 4행)

### 4.2 랜덤 규칙(팀만 좌우 변경)
- “돌리기” 클릭 시 **각 행(포지션/티어) 단위**로 처리한다.
- 각 행에 대해:
  1) 해당 행이 **고정(locked) 상태면 절대 swap 금지**
  2) 고정이 아니면 **50% 확률로 좌팀 ↔ 우팀 swap**
  3) 빈칸 처리(기본): **둘 중 하나라도 빈칸이면 swap 하지 않음**
- (옵션) `빈칸도 섞기` 토글 제공:
  - ON이면 한쪽만 비어도 swap 허용
  - 권장 기본값: OFF

### 4.3 ⭐ 행 고정(락) 기능 (수정 반영)
- “특정 포지션/티어를 고정” = **해당 행을 고정**
- 각 행 라벨 옆에 lock 토글 제공
- ON이면 해당 행은 돌리기 대상에서 제외
- 버튼 2개 권장:
  - `입력 초기화`: 입력값만 비움(락 상태 유지)
  - `전체 초기화`: 입력값 + 락 + 옵션까지 모두 초기화

### 4.4 다크모드
- 헤더 우측에 테마 토글(🌙/☀️)
- 기본값:
  - OS 설정(`prefers-color-scheme`) 반영
  - 사용자가 토글하면 그 값 우선
- 다크모드 스타일:
  - 배경: 짙은 회색(완전 검정 X)
  - 카드: 배경보다 살짝 밝게
  - 입력/버튼/라벨 대비 확실히
  - 포커스 테두리 명확

### 4.5 상태 저장(localStorage) — 필수
- 새로고침 후에도 아래 상태 유지:
  - LoL: 입력 10칸(2열×5행) + 락 5개(행별)
  - PUBG: 입력 8칸(2열×4행) + 락 4개(행별)
  - 옵션(빈칸도 섞기)
  - 테마(dark/light)
- key 예시(확정 권장):
  - `soopi-utils.theme`
  - `soopi-utils.lol.state`
  - `soopi-utils.pubg.state`
  - `soopi-utils.options`

---

## 5) 유틸 A: LoL 랜덤 팀 섞기 (2열 5행)

### 5.1 행 정의(포지션)
행(위에서 아래 순서):
1) 탑(Top)
2) 정글(Jungle)
3) 미드(Mid)
4) 원딜(ADC)
5) 서폿(Support)

### 5.2 UI 레이아웃(개념)
각 행은 다음 형태:
- `[🔒 토글] [포지션 라벨] | [좌팀 input] [우팀 input]`

### 5.3 돌리기 동작
- 포지션(행)은 고정
- 고정 OFF인 행만 50% 확률로 좌/우 swap (빈칸 정책 적용)

---

## 6) 유틸 B: PUBG 랜덤 팀 섞기 (2열 4행)

### 6.1 행 정의(티어)
행(위에서 아래 순서):
1) 1티어
2) 2티어
3) 3티어
4) 4티어

### 6.2 UI 레이아웃(개념)
각 행은 다음 형태:
- `[🔒 토글] [티어 라벨] | [좌팀 input] [우팀 input]`

### 6.3 돌리기 동작
- 티어(행)은 고정
- 고정 OFF인 행만 50% 확률로 좌/우 swap (빈칸 정책 적용)

---

## 7) 기술 스펙(필수)
- React + Vite
- TypeScript 권장(가능하면 TS로)
- 스타일링:
  - Tailwind CSS 권장(세련된 UI/반응형에 유리)
  - 또는 CSS Modules
- 로직 분리:
  - swap 로직은 순수 함수로 분리(`utils/shuffleSwap.ts`)
  - localStorage 접근은 훅으로 분리(`hooks/useLocalStorage.ts`)
  - 테마 관리 훅(`hooks/useTheme.ts`)

---

## 8) 권장 파일 구조
- `src/components/RowSwapGrid.tsx` : 공용 “행 단위 swap” 컴포넌트
- `src/features/lol/LolTool.tsx`
- `src/features/pubg/PubgTool.tsx`
- `src/hooks/useLocalStorage.ts`
- `src/hooks/useTheme.ts`
- `src/utils/shuffleSwap.ts`
- `src/App.tsx`
- `src/main.tsx`
- `vite.config.ts`

---

## 9) 테스트 케이스(최소)
### 9.1 고정 기능(행 고정)
1) LoL: 탑/원딜 행 고정 ON 후 여러 번 돌리기 → 탑/원딜은 항상 그대로, 나머지 행만 섞임
2) PUBG: 1티어/4티어 행 고정 ON → 1/4티어 그대로, 2/3만 섞임

### 9.2 빈칸 정책
1) 특정 행에서 좌팀만 입력, 우팀 빈칸 → 기본 정책이면 swap 금지
2) `빈칸도 섞기` ON이면 한쪽만 비어도 swap 가능(옵션 구현 시)

### 9.3 다크모드
1) 토글 클릭 시 즉시 변경
2) 새로고침 후에도 유지(localStorage)

### 9.4 Pages 배포
1) `https://50091page.github.io/soopi-utils/` 접속 시 정상 렌더링
2) 새로고침해도 404 없이 정상(= base 경로 설정 정확)

---

## 10) GitHub Pages 배포 — 반드시 수행

### 10.1 Repo 생성 및 푸시
1) GitHub에 repo 생성: **soopi-utils**
2) 로컬에서 Vite 프로젝트 생성 및 작업 후 커밋/푸시 (main 브랜치)

### 10.2 Vite base 경로 설정(필수)
- `vite.config.ts`에 아래 설정:
  - `base: '/soopi-utils/'`

### 10.3 GitHub Actions로 자동 배포(필수)
- GitHub repo → Settings → Pages
  - Source: **GitHub Actions**
- 아래 workflow 파일 생성: `.github/workflows/deploy.yml`

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4