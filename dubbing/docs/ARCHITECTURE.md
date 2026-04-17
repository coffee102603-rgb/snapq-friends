# SnapTalk 시스템 아키텍처

> 개발자 / AI Agent / 향후 팀원 대상 기술 문서  
> 10,000명+ 사용자 안전성을 고려한 설계

---

## 🏗️ 전체 시스템 개요

```
┌─────────────────────────────────────────────────────┐
│                   클라이언트 (브라우저)                   │
├─────────────────────────────────────────────────────┤
│  index.html                                         │
│      ↓                                              │
│  app/main.js (동적 로더)                             │
│      ├─→ algorithms/ (16개 모듈)                     │
│      ├─→ ui/ (4개 컴포넌트)                          │
│      └─→ data/ (3개 JSON)                           │
│                                                     │
│  외부 API 연동:                                       │
│  - YouTube IFrame Player                            │
│  - Web Audio API + SpeechRecognition                │
│  - fetch → snaptalk-api (Vercel)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              백엔드 (Vercel 서버리스)                   │
├─────────────────────────────────────────────────────┤
│  snaptalk-api-two.vercel.app                        │
│      ├─ /api/generate  (YouTube → Claude → JSON)    │
│      └─ /api/translate (다국어 번역)                   │
│                                                     │
│  환경변수:                                             │
│  - ANTHROPIC_API_KEY (Claude)                       │
│  - YOUTUBE_API_KEY (자막 추출)                        │
└─────────────────────────────────────────────────────┘
```

---

## 📂 디렉토리 구조 원칙

### 각 폴더의 책임 (Single Responsibility)

| 폴더 | 책임 | 파일 예시 |
|------|------|----------|
| `app/` | 앱 부팅, 라우팅, 전역 설정 | main.js, config.js |
| `algorithms/` | 순수 로직 (UI 무관) | 01-progressive-dubbing.js |
| `ui/` | UI 렌더링 + 이벤트 | feed.js, player.js |
| `data/` | 정적 데이터 (JSON) | shorts.json, categories.json |
| `styles/` | 시각 스타일 | main.css |
| `docs/` | 문서 | README.md |

### 의존성 방향 (Dependency Direction)

```
docs/         ←─ 읽기 전용, 의존 없음
  ↑
data/         ←─ 정적 데이터, 의존 없음
  ↑
algorithms/   ←─ 순수 로직, 데이터만 의존
  ↑
ui/           ←─ 알고리즘 호출, UI 렌더링
  ↑
app/          ←─ 모든 것을 조율
```

**원칙**: 위에서 아래로는 의존 허용, 반대는 금지

---

## 🔀 런타임 플로우

### 앱 시작 시퀀스

```
1. 브라우저가 index.html 요청
2. config.js 먼저 로드 (동기)
3. main.js 로드 → initialize() 실행
4. Phase 1: 필수 알고리즘 4개 로드 (필수)
   - 01 progressive-dubbing
   - 09 multilang
   - 14 interest-scoring  
   - 15 difficulty-curve
5. Phase 2: UI 컴포넌트 3개 로드
   - feed, player, scoreboard
6. Phase 3: 데이터 fetch (병렬)
   - shorts.json, categories.json, languages.json
7. showScreen('home') → 피드 렌더링
```

### 영상 플레이어 진입 시 (Lazy Loading!)

```
사용자가 영상 카드 탭
    ↓
showScreen('player') 호출
    ↓
loadPlayerAlgorithms() 실행 (처음에만)
    ↓
추가로 11개 알고리즘 로드:
  02 dubbing-engine
  03 audio-gate
  04 karaoke-result
  05 scoring-5factor
  07 sync-measurement
  08 speech-accuracy
  10 karaoke-captions
  11 sync-ring-gauge
  12 realtime-loop
  13 adaptive-difficulty
  16 auto-next
    ↓
Player.render() → UI 표시
```

**성능 효과**:
- 초기 로딩: 약 20KB
- 영상 진입 시: +50KB
- 피드만 보는 사용자는 50KB 절감 (바이러스 확산 방지!)

---

## 🎯 10,000명+ 사용자 안전성 전략

### 1. 파일 분산 = 캐싱 효율 UP

**한 파일 수정 → 나머지 캐시 유지**

```
v6.2 (단일 파일):
  snaptalk-youtube-lab.html 수정
  → 160KB 전체 재다운로드

v7.0 (모듈 분리):
  algorithms/04-karaoke-result.js 수정 (8KB)
  → 8KB만 재다운로드
  → 152KB 캐시 유지 → 95% 절약!
```

### 2. 병렬 로딩

```
브라우저는 동일 도메인에서 6개까지 병렬 다운로드 가능
v6.2: 파일 1개 → 순차 다운로드
v7.0: 파일 15~20개 → 병렬 6개씩 → 3배 빠름
```

### 3. CDN 효율

```
GitHub Pages + Cloudflare CDN 조합:
각 파일별 캐시 정책 적용
→ 핫 파일(shorts.json) vs 콜드 파일(config.js) 구분
→ 캐시 적중률 90%+ 예상
```

### 4. 점진적 로딩 (Progressive Loading)

```
피드 화면: 필수 4개만 (20KB)
  ↓
플레이어 진입: +11개 (50KB)
  ↓
특수 기능 사용: 추가 로드
```

### 5. localStorage 용량 관리

```
스토리지 키 역할:
- sd_streak: 스트릭 (수 바이트)
- sd_history: 최근 30개만 유지
- sd_notebook: 단어장 (사용자별)
- sd_hallOfFame: 상위 50개만 유지
- sd_interests: 카테고리 점수

총 예상 크기: < 100KB (localStorage 5MB 한계의 2%)
```

---

## 🔒 보안 고려사항

### API 키 보호

```
❌ 하면 안 되는 것:
  - 클라이언트 코드에 API 키 포함
  - GitHub에 .env 파일 푸시

✅ SnapTalk 방식:
  - 모든 API 키는 Vercel 환경변수에 저장
  - 클라이언트는 snaptalk-api-two.vercel.app만 호출
  - API 서버가 내부에서 Claude/YouTube API 호출
```

### 역엔지니어링 저항성

```
v6.2 (단일 파일):
  모든 로직 한 곳에 → 5분이면 파악

v7.0 (모듈 분산):
  16개 파일 + 의존성 그래프
  → 파악 어려움, 카피캣 방어력 UP
```

### XSS 방지

```
사용자 입력 렌더링 시:
- innerHTML 사용 최소화
- textContent 우선 사용
- 데이터는 항상 JSON 파싱
```

---

## 🚀 배포 전략

### GitHub Pages 배포

```
repo: coffee102603-rgb/snaptalk
branch: main
path: /dubbing/

URL: https://coffee102603-rgb.github.io/snaptalk/dubbing/
```

### 기존 파일과의 공존

```
snaptalk/
├── index.html                  ← 메인 페이지 (건드리지 않음)
├── snaptalk-youtube-lab.html   ← v6.2 백업 (건드리지 않음)
├── jake_ep1.html               ← Jake (건드리지 않음)
├── snaptalk-curator.html       ← 큐레이터 (건드리지 않음)
│
└── dubbing/                    ← ★ 새로 추가
    ├── index.html
    ├── app/, algorithms/, ui/, data/, styles/, docs/
    └── ...
```

**장점**: 구 버전과 v7.0 동시 접근 가능, 롤백 즉시 가능

---

## 🧪 테스트 전략

### 유닛 테스트 가능 구조

각 알고리즘 파일은 pure function 위주로 설계:

```javascript
// Testable!
const result = ProgressiveDubbing.calculateBlanks(3, sentence);
assert(result.stage === 3);
assert(result.blankRatio === 0.5);
```

### 브라우저 호환성 테스트 필수

```
대상 플랫폼:
✅ iOS Safari 14+
✅ Android Chrome 90+
✅ Samsung Internet
✅ Galaxy Chrome (TTS 버그 우회)
⚠️ Firefox (SpeechRecognition 미지원 → 폴백)
```

---

## 📊 성능 목표 (Lighthouse 기준)

| 지표 | 목표 | 현재 예상 |
|------|-----|----------|
| Performance | 90+ | 92 |
| Accessibility | 95+ | - |
| Best Practices | 95+ | - |
| SEO | 90+ | - |

### 주요 최적화

- Critical CSS 인라인 (초기 렌더 빠르게)
- 이미지 lazy loading
- Service Worker (PWA 준비)
- JSON minification

---

## 🔄 향후 확장 시나리오

### Phase 2: 100개 영상

```
shorts.json (현재): 5개, 약 5KB
shorts.json (100개): 약 100KB

문제 없음 (단일 fetch로 충분)
```

### Phase 3: 1,000개 영상

```
shorts.json (1,000개): 약 1MB

최적화 필요:
- 카테고리별 분할 (interview.json, food.json, ...)
- lazy loading
```

### Phase 4: 10,000개+

```
서버 사이드 필터링 필요:
- /api/shorts?category=food&difficulty=beginner
- 페이지네이션 (limit=20, offset=0)
- Algolia 같은 검색 엔진 도입
```

---

## 🛠️ 개발 환경

### 로컬 테스트

```bash
# Python 간이 서버
cd dubbing/
python -m http.server 8000
# → http://localhost:8000

# Node.js 간이 서버  
npx serve dubbing/
```

### Git 워크플로우

```bash
# 기능 추가
git checkout -b feature/new-feature
# ... 수정 ...
git add dubbing/
git commit -m "feat: 새 기능 추가"
git push origin feature/new-feature
# PR → merge → GitHub Pages 자동 배포
```

---

## 📞 AI Agent 사용 팁

### 알고리즘 찾기
```
"Regret Zone 로직 수정해줘"
→ algorithms/04-karaoke-result.js 편집
```

### 스타일 수정
```
"메인 컬러 바꿔줘"
→ styles/main.css의 --accent 변수 수정
```

### 새 영상 추가
```
"새 영상 ABC123 추가해줘"
→ data/shorts.json 편집
```

### 알고리즘 추가
```
"새 알고리즘 #17 만들어줘"
→ algorithms/17-new-algo.js 생성
→ docs/ALGORITHMS.md 업데이트
→ main.js에 import 추가
```

---

© 2026 최정은. SnapTalk 시스템 아키텍처 문서.
