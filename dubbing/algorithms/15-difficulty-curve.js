/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #15 · DIFFICULTY CURVE
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : C (부가 청구항)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   학습 초반 → 후반에 난이도를 점진적으로 높이는 기본 커브.
 *   beginner 5개 → intermediate 15개 → advanced
 * ═══════════════════════════════════════════════════════════════════
 */

const CURVE_STAGES = [
  { count: 5,  difficulty: 'beginner',     label: '🌱 시작 단계' },
  { count: 15, difficulty: 'intermediate', label: '🌿 성장 단계' },
  { count: 999,difficulty: 'advanced',     label: '🌳 숙련 단계' }
];

/**
 * 완료 횟수에 따른 단계 반환
 */
function getCurveStage(completedCount) {
  let accumulated = 0;
  for (const stage of CURVE_STAGES) {
    accumulated += stage.count;
    if (completedCount < accumulated) return stage;
  }
  return CURVE_STAGES[CURVE_STAGES.length - 1];
}

function getCompletedCount() {
  const key = window.SnapTalkConfig?.storageKeys?.history || 'sd_history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  return history.length;
}

if (typeof window !== 'undefined') {
  window.DifficultyCurve = {
    CURVE_STAGES,
    getCurveStage,
    getCompletedCount
  };
}
