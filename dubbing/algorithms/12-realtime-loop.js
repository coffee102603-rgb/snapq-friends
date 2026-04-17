/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #12 · DUBBING REALTIME LOOP
 *                     (더빙 실시간 루프)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : B (청구항 보강용)
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #02 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   더빙 중 실시간 이벤트 감지 및 파티클 효과 트리거.
 *   #02 엔진이 사용하는 보조 루프.
 * 
 * 🔬 INNOVATION
 *   - 볼륨 추적 + 시간 기록
 *   - 열 단계 변화 시 파티클 스폰
 *   - Perfect 감지 시 배너 표시
 * 
 * 🔗 RELATED: #02 (엔진)
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * 파티클 스폰 설정
 */
const PARTICLE_CONFIG = {
  cold:    { count: 0, emoji: null },
  cool:    { count: 3, emoji: '✨' },
  warm:    { count: 5, emoji: '⭐' },
  hot:     { count: 8, emoji: '🌟' },
  fire:    { count: 12, emoji: '🔥' },
  perfect: { count: 20, emoji: '💎' }
};

/**
 * 열 단계 변화에 따른 파티클 효과 결정
 * 
 * @param {number} oldLevel - 이전 레벨
 * @param {number} newLevel - 새 레벨
 * @returns {Object} 파티클 설정
 */
function getParticleForTransition(oldLevel, newLevel) {
  if (newLevel <= oldLevel) return null;  // 레벨 상승일 때만
  
  const levelMap = ['cold', 'cool', 'warm', 'hot', 'fire', 'perfect'];
  const config = PARTICLE_CONFIG[levelMap[newLevel]] || PARTICLE_CONFIG.cold;
  
  return config.count > 0 ? {
    count: config.count,
    emoji: config.emoji,
    duration: 1500,  // ms
    spread: 200      // px
  } : null;
}

/**
 * Perfect 배너 표시 조건
 */
function shouldShowPerfectBanner(percent, durationInPerfect) {
  return percent >= 95 && durationInPerfect >= 500;  // 0.5초 이상 perfect
}

if (typeof window !== 'undefined') {
  window.RealtimeLoop = {
    PARTICLE_CONFIG,
    getParticleForTransition,
    shouldShowPerfectBanner
  };
}
