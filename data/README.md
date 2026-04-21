# 📂 SnapTalk `data/` 폴더 가이드

> 영상과 카테고리, 시나리오 데이터가 HTML에서 분리되어 이 폴더에 저장됩니다.
> **HTML 파일은 거의 건드리지 않고, 이 폴더의 JSON만 편집하면 콘텐츠가 업데이트됩니다.**

---

## 📁 파일 구성

```
data/
├── shorts.json       (26 KB)  영상 콘텐츠 (US/KR 목록 + 문장별 번역)
├── categories.json   (4 KB)   카테고리 정의 (us/kr 지역별)
├── scenarios.json    (4 KB)   AI 대화 시나리오 (food/travel/business 등)
└── meta.json         (0.5 KB) 플랫폼 메타정보 (버전 / 지원 언어)
```

---

## 🎬 영상 추가하기 (`shorts.json`)

### 새 영상 하나 추가하는 방법

1. `data/shorts.json` 파일 열기
2. `shorts.us` 배열에 새 영상 객체 추가
3. Git push → 라이브 반영 (HTML 수정 불필요)

### 영상 데이터 구조

```json
{
  "id": "영상ID(11자)",        // YouTube Video ID (예: "K56O5RdE3KM")
  "title": "영상 제목",        // 메인 카드에 표시됨
  "cat": "food",              // 카테고리 (categories.json 참조)
  "catIcon": "🍔",            // 카테고리 이모지
  "diff": "intermediate",     // beginner | intermediate | advanced
  "dubs": 100,                // 더빙 시도 수 (초기값)
  "lang": "en",               // 원본 언어
  "region": "us",             // 지역
  "createdAt": "2026-04-21",  // 등록일 (NEW 뱃지용)
  "status": "live",           // draft | review | live | disabled
  "sentences": [
    {
      "en": "This is Dalgona candy,",
      "ko": "이건 달고나 사탕이에요,",
      "start": 0.16,
      "end": 1.109,
      "core": "candy",                 // 핵심 단어
      "highlight": "Dalgona candy",    // 핵심 청크
      "koHighlight": "달고나 사탕",     // 한글 핵심 청크
      "phonetic": "디스 이즈 달고나 캔디,",
      "translations": {                // 🌐 다국어 확장 (선택)
        "ja": { "text": "", "highlight": "" },
        "zh": { "text": "", "highlight": "" }
      }
    }
  ]
}
```

---

## 🌐 다국어 번역 추가하기

### 일본어/중국어 번역 추가

각 문장의 `translations` 필드를 채우면 자동으로 해당 언어 학습자에게 제공됨:

```json
"translations": {
  "ja": {
    "text": "これはダルゴナキャンディです",
    "highlight": "ダルゴナキャンディ"
  },
  "zh": {
    "text": "这是达尔戈纳糖",
    "highlight": "达尔戈纳糖"
  }
}
```

### 새 언어 추가 (예: 스페인어)

`translations`에 새 키 추가:
```json
"translations": {
  "ja": { ... },
  "zh": { ... },
  "es": {
    "text": "Este es dulce de Dalgona",
    "highlight": "dulce de Dalgona"
  }
}
```

그 후 `meta.json` 의 `supportedLanguages.translations` 배열에 `"es"` 추가.

---

## 📂 카테고리 추가하기 (`categories.json`)

```json
{
  "us": [
    {
      "id": "food",
      "emoji": "🍔",
      "name": "Foodie",
      "description": "맛집·먹방·요리"
    }
  ]
}
```

**주의:** 카테고리 `id`를 바꾸면 기존 영상들의 `cat` 필드도 같이 업데이트해야 합니다.

---

## 🎭 AI 시나리오 추가하기 (`scenarios.json`)

각 카테고리 `id`와 매핑되는 AI 대화 시나리오. 새 시나리오 추가 시 양쪽 파일 일관성 유지.

---

## 🔒 안전 장치 (Fallback)

만약 `data/` 폴더의 JSON 로드가 실패하면 (네트워크 오류 등):
- HTML의 하드코딩된 데이터가 **자동으로 사용됨** (섹션 03: DATA CONSTANTS)
- 앱이 절대 깨지지 않음

📍 관련 코드: `snaptalk-youtube-lab.html` 의 **섹션 04 · DATA LOADER**

---

## 🤖 AI Agent 작업 가이드

AI에게 영상 추가 요청 예시:
> "data/shorts.json의 US 영상 목록에 YouTube ID `abc123xyz`, 카테고리 food인 새 영상을 추가해줘. 제목과 자막은 내가 제공하는 내용 참고."

AI가 정확히 이 파일만 수정하면 됨. HTML은 건드리지 않음.

---

## 📝 버전 관리

- 이 폴더를 수정하면 `meta.json`의 `lastUpdated` 날짜를 갱신하는 게 좋아요.
- `shorts.json`, `categories.json`, `scenarios.json` 각 파일도 `lastUpdated` 필드 있음.

---

## ⚠️ 주의사항

1. **id 중복 금지**: 같은 `id`(YouTube ID)가 두 번 들어가면 안 됨
2. **JSON 문법**: 콤마·따옴표 주의. VS Code 같은 에디터로 편집 권장
3. **status="live"만 표시**: draft/review 상태 영상은 앱에서 안 보임 (향후 구현 예정)
4. **큰 변경은 백업**: 많이 바꾸기 전에 `shorts.json.BAK-YYYYMMDD.json` 같은 이름으로 백업

---

*Last updated: 2026-04-21*
*SnapTalk v10.13 — data/ 분리 리팩터링 1차*
