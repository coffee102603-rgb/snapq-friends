/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #14 · INTEREST SCORING
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : C (부가 청구항)
 * 📋 CLAIM TYPE    : 종속 청구항
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   사용자 행동 (탭, 완주, 재시도)을 카테고리별 관심도 점수로 집계.
 *   localStorage 기반 개인화 추천.
 * 
 * 🔬 INNOVATION — 가중치
 *   - view:       +1 점
 *   - complete:   +5 점
 *   - retry:      +3 점
 *   - share:      +10 점
 *   - 시간 감쇠: 30일 후 절반
 * 
 * 🔗 RELATED: #15, #16
 * ═══════════════════════════════════════════════════════════════════
 */

const ACTION_WEIGHTS = {
  view: 1,
  complete: 5,
  retry: 3,
  share: 10
};

function scoreInterest(categoryId, action) {
  const key = window.SnapTalkConfig?.storageKeys?.interests || 'sd_interests';
  const scores = JSON.parse(localStorage.getItem(key) || '{}');
  
  if (!scores[categoryId]) {
    scores[categoryId] = { score: 0, lastUpdated: Date.now() };
  }
  
  // 시간 감쇠
  const daysSince = (Date.now() - scores[categoryId].lastUpdated) / 86400000;
  if (daysSince > 30) {
    scores[categoryId].score *= 0.5;
  }
  
  scores[categoryId].score += ACTION_WEIGHTS[action] || 0;
  scores[categoryId].lastUpdated = Date.now();
  
  localStorage.setItem(key, JSON.stringify(scores));
  return scores[categoryId].score;
}

function getTopCategories(limit = 3) {
  const key = window.SnapTalkConfig?.storageKeys?.interests || 'sd_interests';
  const scores = JSON.parse(localStorage.getItem(key) || '{}');
  
  return Object.entries(scores)
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, limit)
    .map(([cat, data]) => ({ category: cat, score: data.score }));
}

if (typeof window !== 'undefined') {
  window.InterestScoring = {
    ACTION_WEIGHTS,
    scoreInterest,
    getTopCategories
  };
}
