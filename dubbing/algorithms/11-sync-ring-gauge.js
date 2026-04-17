/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #11 · SYNC RING GAUGE 6-LEVEL
 *                     (싱크 링 게이지 6단계)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : B (청구항 보강용)
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #02 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   원형 게이지로 실시간 싱크로율 시각화.
 *   온도계식 6단계 색상 전환 (cold→cool→warm→hot→fire→perfect)
 * 
 * 🔬 INNOVATION — 6단계 색상
 *   Level 0 (cold):    0-9%   #6b6b8a (회색)
 *   Level 1 (cool):    10-29% #6bb5ff (파랑)
 *   Level 2 (warm):    30-59% #ffc842 (노랑)
 *   Level 3 (hot):     60-79% #ff8c42 (주황)
 *   Level 4 (fire):    80-94% #ff4757 (빨강)
 *   Level 5 (perfect): 95-100% #00e5a0 (에메랄드)
 * 
 * 🔗 RELATED: #02 (엔진), #05 (채점)
 * ═══════════════════════════════════════════════════════════════════
 */

const HEAT_LEVELS = [
  { level: 0, id: 'cold',    min: 0,  max: 9,   color: '#6b6b8a', label: '🥶' },
  { level: 1, id: 'cool',    min: 10, max: 29,  color: '#6bb5ff', label: '😐' },
  { level: 2, id: 'warm',    min: 30, max: 59,  color: '#ffc842', label: '🙂' },
  { level: 3, id: 'hot',     min: 60, max: 79,  color: '#ff8c42', label: '😊' },
  { level: 4, id: 'fire',    min: 80, max: 94,  color: '#ff4757', label: '🔥' },
  { level: 5, id: 'perfect', min: 95, max: 100, color: '#00e5a0', label: '💎' }
];

/**
 * 퍼센트를 열 단계로 변환
 */
function percentToHeatLevel(percent) {
  return HEAT_LEVELS.find(h => percent >= h.min && percent <= h.max) || HEAT_LEVELS[0];
}

/**
 * SVG 링 게이지 데이터 생성
 * 
 * @param {number} percent - 0~100
 * @returns {Object} 게이지 렌더링 데이터
 */
function generateRingGauge(percent) {
  const heat = percentToHeatLevel(percent);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  
  return {
    percent,
    heat,
    radius,
    circumference,
    strokeDashoffset: offset,
    color: heat.color,
    label: heat.label,
    shouldParticle: percent >= 80  // 80% 이상일 때 파티클
  };
}

if (typeof window !== 'undefined') {
  window.SyncRingGauge = {
    HEAT_LEVELS,
    percentToHeatLevel,
    generateRingGauge
  };
}
