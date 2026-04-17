/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #01 · PROGRESSIVE DUBBING UX
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : S (세계 최초 조합)
 * 📋 CLAIM TYPE    : 독립 청구항 1
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 📅 LAST UPDATED  : 2026-04-17
 * 
 * 📝 DESCRIPTION
 *   동일 YouTube 영상을 4단계 Progressive Blanks로 반복 학습하며,
 *   사용자가 "학습 단계"를 인지하지 못한 채 난이도가 자연스럽게 상승.
 *   "Hidden 1-Step UX" — 교육이 숨어있는 1단계.
 * 
 * 🔬 INNOVATION
 *   - 1단계: 전체 자막 + 번역 (표현 학습 단계)
 *   - 2단계: 1~2개 빈칸 (스크립트 연습 단계)
 *   - 3단계: 3~4개 빈칸 (더빙 시작 단계)
 *   - 4단계: 대부분 빈칸 (완전 더빙 단계)
 *   
 *   각 단계마다 같은 영상을 반복하되,
 *   보이는 텍스트 정보량만 점진적으로 감소.
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Krashen's Input Hypothesis (i+1): 약간 높은 수준의 입력
 *   - Vygotsky's ZPD: 도움 받아 할 수 있는 범위에서 학습
 *   - Gradual Release of Responsibility (GRR):
 *     "I do → We do → You do" 3단계 + SnapTalk 4단계
 * 
 * 🔗 RELATED ALGORITHMS
 *   - #02: 각 단계에서 더빙 엔진이 실시간 채점
 *   - #05: 최종 점수는 5요소 채점 알고리즘으로 산출
 *   - #10: 카라오케 자막과 연동
 * 
 * 📈 EXPECTED OUTCOME
 *   - 동일 영상 3~4회 반복 시청
 *   - 평균 학습 시간: 2분 30초 (영상 1개당)
 *   - 기억 잔존율: 단순 시청 대비 3배 향상 (예상)
 * ═══════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상수 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 각 단계별 빈칸 비율
 * @type {Object<number, number>}
 */
const BLANK_RATIO = {
  1: 0.0,   // 1단계: 빈칸 없음 (전체 공개)
  2: 0.2,   // 2단계: 20% 빈칸
  3: 0.5,   // 3단계: 50% 빈칸
  4: 0.85   // 4단계: 85% 빈칸 (거의 완전 더빙)
};

/**
 * 각 단계별 설명 문구
 * @type {Object<number, string>}
 */
const STAGE_LABELS = {
  1: '🎧 듣기 + 보기',
  2: '📝 따라 말하기',
  3: '🎤 더빙 시작',
  4: '🎬 완전 더빙'
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 핵심 함수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 주어진 단계에서 문장에 적용할 빈칸을 계산
 * 
 * @param {number} stage - 학습 단계 (1~4)
 * @param {Object} sentence - 문장 객체 {en, ko, core, highlight}
 * @returns {Object} 빈칸 처리된 문장 데이터
 * 
 * @example
 *   const result = calculateBlanks(3, {
 *     en: "What do you do for a living?",
 *     core: "living",
 *     highlight: "for a living"
 *   });
 *   // result.masked === "What ___ you do ___ a ___?"
 */
function calculateBlanks(stage, sentence) {
  if (stage < 1 || stage > 4) {
    throw new Error(`Invalid stage: ${stage}. Must be 1~4.`);
  }

  const words = sentence.en.split(' ');
  const blankCount = Math.floor(words.length * BLANK_RATIO[stage]);
  
  // 핵심 단어(highlight)를 우선적으로 빈칸 처리
  const highlightWords = (sentence.highlight || '').split(' ');
  const priorityIndexes = [];
  
  words.forEach((word, idx) => {
    const cleanWord = word.replace(/[.,!?;:'"]/g, '').toLowerCase();
    if (highlightWords.some(hw => hw.toLowerCase() === cleanWord)) {
      priorityIndexes.push(idx);
    }
  });

  // 빈칸 인덱스 결정 (핵심 단어 우선 → 나머지 랜덤)
  const blankIndexes = new Set(priorityIndexes.slice(0, blankCount));
  while (blankIndexes.size < blankCount) {
    const randomIdx = Math.floor(Math.random() * words.length);
    blankIndexes.add(randomIdx);
  }

  // 빈칸 처리
  const masked = words.map((word, idx) => {
    if (blankIndexes.has(idx)) {
      return '___';
    }
    return word;
  }).join(' ');

  return {
    original: sentence.en,
    masked: masked,
    blankIndexes: Array.from(blankIndexes),
    stage: stage,
    stageLabel: STAGE_LABELS[stage],
    blankRatio: BLANK_RATIO[stage]
  };
}

/**
 * 다음 단계로 진행 가능한지 판정
 * 
 * @param {number} currentStage - 현재 단계
 * @param {number} score - 현재 점수
 * @returns {boolean} 진행 가능 여부
 */
function canProgressToNextStage(currentStage, score) {
  if (currentStage >= 4) return false;  // 이미 마지막 단계
  
  // 최소 기준 점수 (단계별로 다름)
  const thresholds = {
    1: 50,   // 1→2단계: 50점 이상
    2: 60,   // 2→3단계: 60점 이상
    3: 70    // 3→4단계: 70점 이상
  };
  
  return score >= thresholds[currentStage];
}

/**
 * 전체 학습 진행률 계산
 * 
 * @param {number} currentStage - 현재 단계 (1~4)
 * @param {number} sentenceIdx - 현재 문장 인덱스
 * @param {number} totalSentences - 총 문장 수
 * @returns {number} 진행률 (0~100)
 */
function calculateProgress(currentStage, sentenceIdx, totalSentences) {
  const stageProgress = ((currentStage - 1) / 4) * 100;
  const sentenceProgress = (sentenceIdx / totalSentences) * 25;  // 단계 당 25%
  return Math.min(100, Math.floor(stageProgress + sentenceProgress));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 공개 API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof window !== 'undefined') {
  window.ProgressiveDubbing = {
    BLANK_RATIO,
    STAGE_LABELS,
    calculateBlanks,
    canProgressToNextStage,
    calculateProgress
  };
}
