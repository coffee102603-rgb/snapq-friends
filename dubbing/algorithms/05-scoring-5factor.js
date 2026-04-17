/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #05 · 5-FACTOR SCORING
 *                     (5요소 채점 알고리즘)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : A (고유 구현)
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #02 더빙 엔진 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 📅 LAST UPDATED  : 2026-04-17
 * 
 * 📝 DESCRIPTION
 *   5가지 요소를 곱하여 최종 점수 산출.
 *   단순 발화 감지가 아닌, 다차원 채점 시스템.
 *   
 *   최종 점수 = voiceRatio × timingMatch × volumeConsistency
 *            × completionBonus × difficultyMultiplier × 100
 * 
 * 🔬 INNOVATION: 5개 요소
 *   1. voiceRatio (음성 비율)
 *      = 원본 대사 구간 중 실제 음성 프레임 비율
 *      - 100ms 프레임 중 볼륨 > 40인 프레임 비율
 *   
 *   2. timingMatch (타이밍 매치)
 *      = 각 문장별 커버리지 평균
 *      - 문장 1: 0.85, 문장 2: 0.92 → 평균 0.885
 *   
 *   3. volumeConsistency (볼륨 일관성)
 *      = 1 - (stdDev - 30) / 50
 *      - 범위: 0.3 ~ 1.0
 *      - 너무 일정하거나 너무 들쭉날쭉하면 감점
 *   
 *   4. completionBonus (완주 보너스)
 *      = 0.6 + 0.4 × (말한 문장 수 / 전체 문장)
 *      - 절반 말하면 0.8, 전체 말하면 1.0
 *   
 *   5. difficultyMultiplier (난이도 배수)
 *      - PRACTICE: 0.5
 *      - REHEARSAL: 0.8
 *      - ONAIR: 1.0
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Multi-dimensional Assessment (Messick, 1989):
 *     단일 지표보다 다차원 평가가 타당성 높음
 *   - Authentic Assessment (Wiggins, 1993):
 *     실제 맥락(영상 더빙)에서 평가 = 전이 효과 극대화
 * 
 * 🏅 RANK SYSTEM
 *   LEGEND:    100점       (완벽)
 *   SS:        95~99점     (최고급)
 *   S:         80~94점     (훌륭)
 *   A:         70~79점
 *   B:         60~69점
 *   C:         40~59점
 *   D:         < 40점      (재도전 권장)
 * 
 * 🔗 RELATED ALGORITHMS
 *   - #02: 엔진이 sentenceStats와 volumeTrack 제공
 *   - #04: 점수를 가요방식 연출로 표시
 *   - #13: 적응형 난이도 조절에 점수 활용
 * ═══════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 핵심 함수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 5요소 채점 메인 함수
 * 
 * @param {Object} params
 * @param {Array<Object>} params.sentenceStats - 문장별 통계 [{voiceFrames, totalFrames, coverage}]
 * @param {Array<Object>} params.volumeTrack - 볼륨 기록 [{t, v}]
 * @param {Array<Object>} params.sentences - 문장 목록
 * @param {string} params.difficulty - 난이도 (practice/rehearsal/onair)
 * @returns {Object} 채점 결과
 * 
 * @example
 *   const result = calculateScore({
 *     sentenceStats: [{voiceFrames: 15, totalFrames: 20, coverage: 0.75}, ...],
 *     volumeTrack: [{t: 0.1, v: 45}, ...],
 *     sentences: [{start: 0.5, end: 2.3}, ...],
 *     difficulty: 'onair'
 *   });
 *   // result.finalScore = 82
 *   // result.rank = 'S'
 *   // result.factors = { voiceRatio: 0.8, timingMatch: 0.85, ... }
 */
function calculateScore({ sentenceStats, volumeTrack, sentences, difficulty }) {
  // 최소 음성 샘플 수 체크
  const minVoiceFrames = window.SnapTalkConfig?.audio?.minVoiceFrames || 5;
  const totalVoiceFrames = sentenceStats.reduce((sum, s) => sum + s.voiceFrames, 0);
  
  if (totalVoiceFrames < minVoiceFrames) {
    return {
      finalScore: 0,
      rank: 'D',
      error: '🔇 목소리가 안 들려요',
      factors: null
    };
  }
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Factor 1: voiceRatio (음성 비율)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const totalFrames = sentenceStats.reduce((sum, s) => sum + s.totalFrames, 0);
  const voiceRatio = totalFrames > 0 ? totalVoiceFrames / totalFrames : 0;
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Factor 2: timingMatch (문장별 커버리지 평균)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const timingMatch = sentenceStats.length > 0
    ? sentenceStats.reduce((sum, s) => sum + s.coverage, 0) / sentenceStats.length
    : 0;
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Factor 3: volumeConsistency (볼륨 일관성)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const voiceFrames = volumeTrack.filter(f => f.v > 40);
  const volumes = voiceFrames.map(f => f.v);
  const volumeConsistency = calculateVolumeConsistency(volumes);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Factor 4: completionBonus (완주 보너스)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const spokenSentences = sentenceStats.filter(s => s.coverage > 0.3).length;
  const completionBonus = 0.6 + 0.4 * (spokenSentences / sentences.length);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Factor 5: difficultyMultiplier (난이도 배수)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const difficultyMultiplier = window.SnapTalkConfig?.scoring?.difficultyMultiplier?.[difficulty] || 1.0;
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 최종 점수 계산
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const rawScore = voiceRatio * timingMatch * volumeConsistency * completionBonus * difficultyMultiplier * 100;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));
  
  return {
    finalScore,
    rank: getRank(finalScore),
    factors: {
      voiceRatio: Math.round(voiceRatio * 100) / 100,
      timingMatch: Math.round(timingMatch * 100) / 100,
      volumeConsistency: Math.round(volumeConsistency * 100) / 100,
      completionBonus: Math.round(completionBonus * 100) / 100,
      difficultyMultiplier
    },
    sentenceScores: sentenceStats.map(s => ({
      idx: s.idx,
      score: Math.round(s.coverage * 100),
      covered: s.coverage > 0.3
    }))
  };
}

/**
 * 볼륨 일관성 계산
 * 
 * 너무 일정하면 (낮은 stdDev) → 감정 없음 → 감점
 * 너무 들쭉날쭉하면 (높은 stdDev) → 불안정 → 감점
 * 
 * @param {Array<number>} volumes - 볼륨 배열
 * @returns {number} 일관성 점수 (0.3 ~ 1.0)
 */
function calculateVolumeConsistency(volumes) {
  if (volumes.length < 2) return 0.5;
  
  const mean = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
  const variance = volumes.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / volumes.length;
  const stdDev = Math.sqrt(variance);
  
  // 이상적 stdDev: 30
  // 0~30: 일정함 (차분함 허용)
  // 30~80: 자연스러움
  // 80+: 너무 들쭉날쭉
  const deviation = Math.abs(stdDev - 30);
  const consistency = 1 - (deviation / 50);
  
  return Math.max(0.3, Math.min(1.0, consistency));
}

/**
 * 점수로부터 등급 산출
 * 
 * @param {number} score - 점수 (0~100)
 * @returns {string} 등급
 */
function getRank(score) {
  const ranks = window.SnapTalkConfig?.scoring?.ranks;
  
  if (score >= (ranks?.legend || 100)) return 'LEGEND';
  if (score >= (ranks?.ss || 95)) return 'SS';
  if (score >= (ranks?.s || 80)) return 'S';
  if (score >= (ranks?.a || 70)) return 'A';
  if (score >= (ranks?.b || 60)) return 'B';
  if (score >= (ranks?.c || 40)) return 'C';
  return 'D';
}

/**
 * 요소별 기여도 분석 (디버깅 + 학습 피드백용)
 * 
 * @param {Object} factors - 5요소 값
 * @returns {Object} 각 요소가 최종 점수에 미친 기여도
 */
function analyzeFactorContribution(factors) {
  if (!factors) return null;
  
  const contributions = {};
  const maxScore = 100;
  
  // 각 요소가 완벽(1.0)이라고 가정했을 때 대비 실제 기여도
  contributions.voiceRatio = {
    value: factors.voiceRatio,
    percentLoss: Math.round((1 - factors.voiceRatio) * maxScore),
    hint: factors.voiceRatio < 0.7 ? '음성이 부족해요' : '좋아요'
  };
  
  contributions.timingMatch = {
    value: factors.timingMatch,
    percentLoss: Math.round((1 - factors.timingMatch) * maxScore),
    hint: factors.timingMatch < 0.6 ? '타이밍이 맞지 않아요' : '좋아요'
  };
  
  contributions.volumeConsistency = {
    value: factors.volumeConsistency,
    percentLoss: Math.round((1 - factors.volumeConsistency) * maxScore),
    hint: factors.volumeConsistency < 0.7 ? '목소리가 들쭉날쭉해요' : '좋아요'
  };
  
  contributions.completionBonus = {
    value: factors.completionBonus,
    percentLoss: Math.round((1 - factors.completionBonus) * maxScore),
    hint: factors.completionBonus < 0.9 ? '끝까지 말해주세요' : '완주 성공!'
  };
  
  return contributions;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 공개 API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof window !== 'undefined') {
  window.Scoring5Factor = {
    calculate: calculateScore,
    getRank,
    calculateVolumeConsistency,
    analyzeFactorContribution
  };
}
