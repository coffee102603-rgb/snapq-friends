/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #13 · ADAPTIVE DIFFICULTY
 *                     (적응형 난이도 조절)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : B (청구항 보강용) ★ NEW
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #01 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED (2026-04-17)
 * 
 * 📝 DESCRIPTION
 *   최근 3~5회 성적을 기반으로 다음 영상 난이도 자동 조정.
 *   너무 쉬우면 지루, 너무 어려우면 좌절 → 최적 몰입 영역 유지.
 * 
 * 🔬 INNOVATION — 조정 로직
 *   - 평균 90+ : 난이도 UP (challenging)
 *   - 평균 70~89: 유지 (optimal flow)
 *   - 평균 50~69: 유지 + 비슷한 주제 추천
 *   - 평균 <50  : 난이도 DOWN (comfort zone)
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Flow Theory (Csikszentmihalyi, 1990)
 *   - Zone of Proximal Development (Vygotsky, 1978)
 *   - i+1 Input Hypothesis (Krashen, 1985)
 * 
 * 🔗 RELATED: #05 (채점), #15 (난이도 커브)
 * ═══════════════════════════════════════════════════════════════════
 */

const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'];

/**
 * 최근 점수로부터 추천 난이도 계산
 * 
 * @param {Array<number>} recentScores - 최근 점수들 (최신 순)
 * @param {string} currentLevel - 현재 난이도
 * @returns {Object} 추천 결과
 */
function calculateRecommendedDifficulty(recentScores, currentLevel) {
  if (!recentScores || recentScores.length < 3) {
    return {
      recommendedLevel: currentLevel,
      reason: 'insufficient_data',
      message: '더 많은 데이터 필요'
    };
  }
  
  // 최근 3회만 사용
  const recent = recentScores.slice(0, 3);
  const average = recent.reduce((a, b) => a + b, 0) / recent.length;
  
  const currentIdx = DIFFICULTY_LEVELS.indexOf(currentLevel);
  let recommendedIdx = currentIdx;
  let reason = 'flow';
  let message = '현재 수준이 딱 맞아요!';
  
  if (average >= 90) {
    // 너무 쉬움 → 난이도 UP
    recommendedIdx = Math.min(DIFFICULTY_LEVELS.length - 1, currentIdx + 1);
    reason = 'challenge';
    message = '🚀 다음 단계에 도전해볼까요?';
  } else if (average < 50) {
    // 너무 어려움 → 난이도 DOWN
    recommendedIdx = Math.max(0, currentIdx - 1);
    reason = 'comfort';
    message = '📚 쉬운 영상으로 복습해요';
  } else if (average >= 50 && average < 70) {
    // 유지 + 같은 레벨 추천
    reason = 'practice';
    message = '💪 이 수준에서 더 연습해요';
  }
  
  return {
    recommendedLevel: DIFFICULTY_LEVELS[recommendedIdx],
    currentLevel,
    average: Math.round(average),
    reason,
    message,
    isChange: recommendedIdx !== currentIdx
  };
}

/**
 * 학습 기록 저장
 */
function recordLearningResult(score, videoId, difficulty) {
  const key = window.SnapTalkConfig?.storageKeys?.history || 'sd_history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  
  history.unshift({
    score,
    videoId,
    difficulty,
    date: new Date().toISOString()
  });
  
  // 최근 30개만 유지
  if (history.length > 30) history.length = 30;
  
  localStorage.setItem(key, JSON.stringify(history));
  return history;
}

/**
 * 최근 점수 조회
 */
function getRecentScores(count = 3) {
  const key = window.SnapTalkConfig?.storageKeys?.history || 'sd_history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  return history.slice(0, count).map(h => h.score);
}

if (typeof window !== 'undefined') {
  window.AdaptiveDifficulty = {
    DIFFICULTY_LEVELS,
    calculateRecommendedDifficulty,
    recordLearningResult,
    getRecentScores
  };
}
