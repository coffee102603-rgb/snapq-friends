/**
 * ═══════════════════════════════════════════════════════════════════
 * 📋 CONFIG.js · SnapTalk 전역 설정
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 역할:
 *   - API URL, 색상, 타이밍, 임계값 등 전역 설정 관리
 *   - 하드코딩 지양, 여기서 한 번만 수정하면 전체 적용
 * 
 * 수정 빈도: 낮음 (초기 설정 후 거의 불변)
 * ═══════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🏷️ 앱 정보
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  app: {
    name: 'SnapTalk Snap Dubbing',
    version: '7.0.0',
    buildDate: '2026-04-17',
    slogan: 'Talk changes everything.',
    author: '최정은 (coffee102603@gmail.com)',
    githubRepo: 'coffee102603-rgb/snaptalk'
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌐 API 엔드포인트
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  api: {
    // Vercel 서버리스 함수
    baseUrl: 'https://snaptalk-api-two.vercel.app',
    generate: '/api/generate',   // AI 레슨 생성
    search: '/api/search'        // YouTube 검색
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎨 디자인 토큰 (CSS와 동기화 필요)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  colors: {
    accent: '#00e5a0',      // 메인 브랜드
    purple: '#7c6bff',      // 보조 1
    orange: '#ff6b35',      // 보조 2
    warn: '#ff6b6b',        // 경고
    gold: '#ffc842'         // 최고 등급
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ⏱️ 타이밍 설정
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  timing: {
    step2SyncInterval: 100,     // Step 2 실시간 싱크 측정 (ms)
    dubLoopInterval: 100,       // 더빙 중 실시간 루프 (ms)
    autoNextCountdown: 3000,    // 다음 영상 자동 추천 (ms)
    sentenceAutoAdvance: 6000,  // 문장 자동 진행 타이머 (ms)
    hofRotation: 2000           // 명예의전당 로테이션 (ms)
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🎤 오디오 설정
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  audio: {
    voiceThreshold: 40,         // 음성 감지 최소 볼륨
    minVoiceFrames: 5,          // 채점 최소 샘플 수
    ttsRate: 1.0,               // TTS 속도 (0.5 / 1.0 / 1.2)
    galaxyFixInterval: 10000    // Galaxy TTS 버그 우회 (ms)
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 📊 채점 설정 (ALGORITHM #05)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  scoring: {
    // 난이도별 배수
    difficultyMultiplier: {
      practice: 0.5,    // PRACTICE
      rehearsal: 0.8,   // REHEARSAL
      onair: 1.0        // ON AIR
    },
    // 등급 임계값
    ranks: {
      legend: 100,  // 🏆 LEGEND
      ss: 95,       // 💎 SS
      s: 80,        // ⭐ S
      a: 70,        // A
      b: 60,        // B
      c: 40         // C
      // D: < 40
    },
    // 가요방식 결과 연출 (ALGORITHM #04)
    zones: {
      legend: 95,       // 🎆 LEGEND Zone (95+)
      satisfaction: 80, // ✨ Satisfaction (80~94)
      regret: 60,       // 💢 Regret Zone (60~79) ★핵심
      encouragement: 0  // 💧 Encouragement (<60)
    },
    // Step 2 자동 진행 임계값
    step2AutoAdvance: 90
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 🌍 지원 언어 (향후 확장)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  languages: {
    default: 'ko',              // 기본 UI 언어
    supported: ['ko', 'en', 'ja', 'zh']
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 💾 localStorage 키
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  storageKeys: {
    streak: 'sd_streak',        // 스트릭
    history: 'sd_history',      // 학습 기록
    stats: 'sd_stats',          // 통계
    notebook: 'sd_notebook',    // 단어장
    hallOfFame: 'sd_hallOfFame',// 명예의전당
    interests: 'sd_interests',  // 관심사 스코어
    language: 'sd_language'     // 선택한 UI 언어
  }
};

// 개발자 도구에서 확인 가능하도록 전역 노출
if (typeof window !== 'undefined') {
  window.SnapTalkConfig = CONFIG;
}
