# SnapTalk 알고리즘 전체 설명서

> 총 16개 알고리즘 · S급 4 + A급 5 + B급 4 + C급 3  
> 모든 알고리즘은 `algorithms/` 폴더에 독립 파일로 존재

---

## 🏆 S급 알고리즘 (독립 청구항 5개)

세계 최초 조합. 글로벌 PCT 국제출원 대상.

### #01 · Progressive Dubbing UX

- **파일**: `algorithms/01-progressive-dubbing.js`
- **특허 청구항**: 독립 청구항 1
- **한 줄 설명**: 동일 YouTube 영상을 4단계 progressive blanks로 반복 학습
- **혁신**:
  - 1단계: 전체 자막 (0% 빈칸)
  - 2단계: 20% 빈칸
  - 3단계: 50% 빈칸
  - 4단계: 85% 빈칸 (완전 더빙)
- **핵심 함수**: `calculateBlanks()`, `canProgressToNextStage()`
- **교육 이론**: Krashen's i+1, Vygotsky's ZPD, GRR 모델

### #02 · Integrated Dubbing Engine

- **파일**: `algorithms/02-dubbing-engine.js`
- **특허 청구항**: 독립 청구항 2
- **한 줄 설명**: 음성감지 + 카라오케 + 싱크링 통합 실시간 엔진
- **혁신**:
  - 100ms 간격 3가지 동시 측정
  - 문장별 커버리지 계산
  - 파티클 효과 + 열 단계 전환
- **핵심 함수**: `startDubbingEngine()`, `dubbingEngineTick()`
- **교육 이론**: Immediate Feedback, Multimodal Learning

### #03 · Cross-Platform Audio Activation Gate

- **파일**: `algorithms/03-audio-gate.js`
- **특허 청구항**: 독립 청구항 3
- **한 줄 설명**: 단일 탭으로 3가지 오디오 시스템 동시 해제
- **혁신**:
  - AudioContext.resume()
  - speechSynthesis 웜업 (iOS)
  - YouTube unMute() + play()
  - Galaxy TTS 버그 자동 우회
- **핵심 함수**: `activateAudioGate()`, `speakTTS()`
- **기술 이론**: W3C Media Spec의 User Gesture Requirement

### #04 · Karaoke-Style Result Dramatization ★NEW

- **파일**: `algorithms/04-karaoke-result.js`
- **특허 청구항**: 독립 청구항 4
- **한 줄 설명**: 한국 가요방 문화 기반 감정 기반 결과 연출
- **혁신**:
  - 숫자 카운터 감속 (0→50: 3pt, 50→80: 1pt, 80→100: 0.5pt)
  - 3단계 감정 구간 (Legend/Satisfaction/Regret/Encouragement)
  - Regret Zone 동적 메시지: "아쉬운 78점! 2점만 더!"
  - 재도전 버튼 펄스 효과
- **핵심 함수**: `dramatizeResult()`, `generateRegretMessage()`
- **교육 이론**: Loss Aversion (Kahneman), Near-miss Effect
- **문화적 독창성**: 한국 가요방 → 어학 학습 세계 최초 적용

### #17 · Snap Note + Snap Review ★NEW (2026-04-17)

- **파일**: `algorithms/17-snap-note-review.js`
- **특허 청구항**: 독립 청구항 5
- **한 줄 설명**: 손가락 손글씨 + 3초 순환 티저 UI의 통합 학습 시스템
- **두 가지 모드**:
  1. **가리개** (영상 위): 학습 중 즉흥 손글씨 메모
  2. **Snap Note** (나의 방): 저장된 표현을 손가락으로 반복 쓰기
- **Snap Review 혁신**:
  - 저장 표현 3초마다 자동 순환 (페이드 인/아웃)
  - 100개 · 1000개 저장해도 UI는 항상 미니멀 (1장씩만)
  - 일시정지 → Snap Note 자동 펼침
  - 10번 반복 쓰기 → MASTERED! 뱃지
- **핵심 혁신**:
  - 더빙 앱 내 손글씨 = 세계 최초 조합 (선행기술 없음)
  - 애플펜슬 불필요 = 손가락만으로 동작 (대중 접근성)
  - 3초 순환 티저 UX = 저장 폭증에도 UI 복잡도 0
  - 이중 인코딩: 시각(영상) + 촉각(손글씨) + 청각(TTS)
- **핵심 함수**: `startReview()`, `togglePause()`, `drawLine()`, `incrementWritingCount()`
- **교육 이론**: Mueller & Oppenheimer (2014), Dual Coding Theory (Paivio), Multisensory Learning
- **문화적 독창성**: TOEIC 강사 노트 문화 → 디지털 이식 (한국 교실 글로벌화)

---

## 💎 A급 알고리즘 (종속 청구항 5개)

고유 구현. 국내 특허 대상.

### #05 · 5-Factor Scoring

- **파일**: `algorithms/05-scoring-5factor.js`
- **종속 청구항**: #02 더빙 엔진 산하
- **한 줄 설명**: 5요소 곱셈 공식으로 정밀 채점
- **5요소**:
  1. voiceRatio (음성 비율)
  2. timingMatch (타이밍 매치)
  3. volumeConsistency (볼륨 일관성)
  4. completionBonus (완주 보너스)
  5. difficultyMultiplier (난이도 배수)
- **등급**: LEGEND/SS/S/A/B/C/D
- **교육 이론**: Multi-dimensional Assessment, Authentic Assessment

### #06 · AI Lesson Generation Pipeline

- **파일**: `algorithms/06-ai-lesson-pipeline.js`
- **종속 청구항**: #01 Progressive Dubbing 산하
- **한 줄 설명**: YouTube URL → 자막 → Claude API → 레슨 JSON
- **혁신**:
  - 수동 40분 → 자동 30초 (80배)
  - CORE 자동 선정 (function words 제외)
  - HIGHLIGHT 자동 선정 (collocation DB)
  - 다국어 번역 동시 생성
- **비용**: 약 12원/영상

### #07 · Step 2 Realtime Sync Measurement

- **파일**: `algorithms/07-sync-measurement.js`
- **종속 청구항**: #01 Progressive Dubbing 산하
- **한 줄 설명**: 2단계에서 90% 도달 시 자동 진행
- **혁신**:
  - 100ms 실시간 측정
  - 최고 기록 유지 시스템
  - 5프레임 미만 → "목소리 안 들림"
- **교육 이론**: Mastery Learning, Flow State

### #08 · Speech Accuracy Measurement ★NEW

- **파일**: `algorithms/08-speech-accuracy.js`
- **종속 청구항**: #02 더빙 엔진 산하
- **한 줄 설명**: Web Speech API 기반 실제 발음 정확도 측정
- **혁신**:
  - 단순 음량 → 실제 단어 매칭
  - Levenshtein 거리로 유사도 계산
  - 단어별 피드백 (어느 단어 틀렸는지)
- **교육 이론**: Corrective Feedback, Comprehensible Output

### #09 · Multilingual JSON Structure ★NEW

- **파일**: `algorithms/09-multilang-structure.js`
- **종속 청구항**: #01 Progressive Dubbing 산하
- **한 줄 설명**: 1영상 → N개국 서비스 확장 가능한 스키마
- **혁신**:
  - translations 필드로 ko/en/ja/zh/es 통합
  - 폴백 체인 (ko→en→ja...)
  - 사용자 언어 자동 감지
  - 배치 번역 파이프라인
- **비즈니스 영향**: 5천만 → 10억 시장 확장

---

## 🥉 B급 알고리즘 (종속 청구항 4개)

청구항 보강용.

### #10 · Karaoke Progressive Captions
- 파일: `algorithms/10-karaoke-captions.js`
- 4단계 상태: done/current/next/upcoming
- 상태별 opacity + scale 전환

### #11 · Sync Ring Gauge 6-Level
- 파일: `algorithms/11-sync-ring-gauge.js`
- 6단계 색상: cold/cool/warm/hot/fire/perfect
- SVG 링 게이지 렌더링

### #12 · Dubbing Realtime Loop
- 파일: `algorithms/12-realtime-loop.js`
- 열 단계 전환 시 파티클 스폰
- Perfect 배너 표시 조건

### #13 · Adaptive Difficulty ★NEW
- 파일: `algorithms/13-adaptive-difficulty.js`
- 최근 3회 평균 → 난이도 자동 조정
- Flow Theory + ZPD 기반

---

## 📊 C급 알고리즘 (부가 청구항 3개)

### #14 · Interest Scoring
- 파일: `algorithms/14-interest-scoring.js`
- 행동 가중치: view(1), complete(5), retry(3), share(10)
- 30일 시간 감쇠

### #15 · Difficulty Curve
- 파일: `algorithms/15-difficulty-curve.js`
- 기본 커브: beginner 5 → intermediate 15 → advanced

### #16 · Auto-Next Countdown
- 파일: `algorithms/16-auto-next.js`
- 3초 카운트다운 후 다음 영상
- Interest + Adaptive 결합 추천

---

## 🔗 알고리즘 관계도

```
┌───────────────────────────────────────────────────┐
│                                                   │
│    #01 Progressive Dubbing (S)                    │
│           │                                       │
│           ├─ #06 AI Lesson Pipeline (A)           │
│           ├─ #07 Sync Measurement (A)             │
│           ├─ #09 Multilang Structure (A) ★        │
│           └─ #13 Adaptive Difficulty (B) ★        │
│                                                   │
│    #02 Dubbing Engine (S)                         │
│           │                                       │
│           ├─ #05 5-Factor Scoring (A)             │
│           ├─ #08 Speech Accuracy (A) ★            │
│           ├─ #10 Karaoke Captions (B)             │
│           ├─ #11 Sync Ring Gauge (B)              │
│           └─ #12 Realtime Loop (B)                │
│                                                   │
│    #03 Audio Gate (S)                             │
│           └─ #02 더빙 엔진 전제 조건                  │
│                                                   │
│    #04 Karaoke Result (S) ★                       │
│           └─ #05 채점 결과 활용                       │
│                                                   │
│    #14 Interest Scoring (C)                       │
│    #15 Difficulty Curve (C)                       │
│    #16 Auto-Next (C)                              │
│                                                   │
└───────────────────────────────────────────────────┘
```

---

## 📈 구현 통계

- **총 코드**: 2,789줄
- **총 파일 크기**: 104KB (알고리즘만)
- **평균 파일 크기**: 174줄
- **가장 큰 파일**: #04 karaoke-result.js (250줄)
- **가장 작은 파일**: #15 difficulty-curve.js (60줄)
