# SnapTalk — Snap Dubbing v7.0

> **"Talk changes everything."**  
> YouTube 숏츠 × Progressive Dubbing × 다국어 학습 플랫폼

---

## 📖 문서 네비게이션

| 문서 | 용도 | 대상 |
|-----|------|-----|
| [ALGORITHMS.md](./ALGORITHMS.md) | 16개 알고리즘 전체 설명 | 개발자, AI Agent |
| [PATENT_CLAIMS.md](./PATENT_CLAIMS.md) | 특허 청구항 초안 | 변리사 |
| [EDUCATIONAL_THEORY.md](./EDUCATIONAL_THEORY.md) | 교육 이론 근거 | 교수님, 논문 |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 시스템 아키텍처 | 엔지니어 |

---

## 🎯 SnapTalk이 세상에 없던 이유

### 1. 통합 형식
- **기존**: TikTok (재미) OR Duolingo (교육) OR 노래방 (연출)
- **SnapTalk**: 3가지를 하나로

### 2. Hidden 1-Step UX
- 사용자 느낌: "숏츠 따라 말하는 거 재밌네"
- 실제 구조: 4단계 Progressive Learning이 숨어있음

### 3. 가요방식 결과 연출
- 한국 가요방 문화 → 어학 앱 최초 적용
- Regret Zone에서 "재도전 욕구" 극대화

---

## 📁 프로젝트 구조

```
snaptalk/dubbing/
├── index.html                     엔트리 포인트 (하단 네비바 포함)
├── app/                          앱 코어
│   ├── config.js                 전역 설정
│   └── main.js                   초기화 + 라우팅
├── algorithms/                   ★ 17개 특허 알고리즘
│   ├── 01-progressive-dubbing.js  S급 #1
│   ├── 02-dubbing-engine.js       S급 #2
│   ├── 03-audio-gate.js           S급 #3
│   ├── 04-karaoke-result.js       S급 #4 ★NEW
│   ├── 05~09-*.js                 A급 (5개)
│   ├── 10~13-*.js                 B급 (4개)
│   ├── 14~16-*.js                 C급 (3개)
│   └── 17-snap-note-review.js    S급 #5 ★NEW (v7.0.1)
├── ui/                           UI 컴포넌트 5개
│   ├── feed.js                   카테고리 피드
│   ├── player.js                 영상 플레이어 + Progressive Dubbing
│   ├── scoreboard.js             결과 화면 (가요방식)
│   ├── hall-of-fame.js           명예의전당
│   └── my-room.js                나의 방 (Snap Review) ★NEW
├── data/                         JSON 데이터 3개
├── styles/                       CSS
└── docs/                         ★ 이 문서들
```

---

## 🏆 특허 청구항 요약

| 등급 | 개수 | 특징 |
|------|-----|------|
| **S급 (독립)** | 5 | 세계 최초 조합, PCT 국제출원 대상 |
| **A급 (종속)** | 5 | 고유 구현, 국내 특허 |
| **B급 (종속)** | 4 | 청구항 보강 |
| **C급 (부가)** | 3 | 부가 청구항 |
| **총계** | **17** | |

---

## 👤 Author

**최정은** (coffee102603@gmail.com)
- TOEIC 강사 15년
- 대구교대 AI교육학과 박사과정
- SnapTalk 창업자

---

## 📅 버전 히스토리

| 버전 | 날짜 | 주요 변경 |
|------|-----|----------|
| **7.0.1** | **2026-04-17** | **Snap Note + Snap Review (손글씨 + 3초 순환) 추가** |
| 7.0.0 | 2026-04-17 | 모듈 분리 + 가요방식 연출 + 발음정확도 + 다국어 구조 |
| 6.2 | 2026-04-15 | 단일 파일 최종 버전 |
| 5.0 | 2026-04-10 | Studio Booth Mode |

---

## 🔒 License

Proprietary (특허 출원 예정)

© 2026 최정은. All rights reserved.
