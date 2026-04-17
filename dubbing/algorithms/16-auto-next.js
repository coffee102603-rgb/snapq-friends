/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #16 · AUTO-NEXT COUNTDOWN
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : C (부가 청구항)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   학습 완료 후 3초 카운트다운 → 다음 추천 영상 자동 시작.
 *   YouTube/TikTok 스타일 "끊김 없는 흐름".
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * 카운트다운 시작
 */
function startAutoNextCountdown(duration, callbacks) {
  let remaining = duration / 1000;
  
  if (callbacks.onTick) callbacks.onTick(remaining);
  
  const intervalId = setInterval(() => {
    remaining--;
    if (callbacks.onTick) callbacks.onTick(remaining);
    
    if (remaining <= 0) {
      clearInterval(intervalId);
      if (callbacks.onComplete) callbacks.onComplete();
    }
  }, 1000);
  
  return {
    cancel: () => clearInterval(intervalId)
  };
}

/**
 * 다음 추천 영상 선택 (interest + adaptive 결합)
 */
function pickNextRecommendation(currentCategory, lastScore) {
  const topCats = window.InterestScoring?.getTopCategories(3) || [];
  const diffRec = window.AdaptiveDifficulty?.calculateRecommendedDifficulty(
    window.AdaptiveDifficulty.getRecentScores(),
    'beginner'
  );
  
  return {
    preferredCategories: topCats.map(c => c.category),
    preferredDifficulty: diffRec?.recommendedLevel || 'beginner',
    reason: diffRec?.reason || 'flow'
  };
}

if (typeof window !== 'undefined') {
  window.AutoNext = {
    startAutoNextCountdown,
    pickNextRecommendation
  };
}
