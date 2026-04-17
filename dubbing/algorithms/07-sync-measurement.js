/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #07 · STEP 2 REALTIME SYNC MEASUREMENT
 *                     (Step 2 싱크로율 실시간 측정)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : A (고유 구현)
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #01 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 📅 LAST UPDATED  : 2026-04-17
 * 
 * 📝 DESCRIPTION
 *   Progressive Dubbing 2단계 ("따라 말하기")에서 실시간으로
 *   사용자의 싱크로율을 측정하여 90% 도달 시 자동 진행.
 *   
 *   최고 기록 유지 시스템으로 여러 번 시도 가능.
 *   "거의 됐어! 한 번만 더!" 심리 유도.
 * 
 * 🔬 INNOVATION
 *   - 100ms 간격 실시간 측정
 *   - attemptScore = voiceRatio × timingMatch × 100
 *   - 각 시도마다 최고 기록 갱신
 *   - 90% 도달 → 자동 다음 문장 진행
 *   - 5 프레임 미만 → "목소리 안 들림" 경고
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Mastery Learning (Bloom, 1968):
 *     단순 통과가 아닌 "숙달" 기준
 *   - Flow State (Csikszentmihalyi, 1990):
 *     도전과 실력의 균형 = 몰입
 *   - Intermittent Reinforcement:
 *     "거의 성공" 상태에서 동기 극대화
 * 
 * 🔗 RELATED ALGORITHMS
 *   - #01: Stage 2에서 이 알고리즘 실행
 *   - #05: 채점 알고리즘과 공식 일부 공유
 * ═══════════════════════════════════════════════════════════════════
 */

const SyncMeasurementState = {
  isRunning: false,
  currentSentence: null,
  bestScore: 0,
  currentScore: 0,
  voiceSamples: 0,
  totalSamples: 0,
  _intervalId: null
};

/**
 * Step 2 싱크 측정 시작
 * 
 * @param {Object} sentence - 측정할 문장
 * @param {Object} callbacks - UI 콜백
 */
function startSyncMeasurement(sentence, callbacks) {
  SyncMeasurementState.isRunning = true;
  SyncMeasurementState.currentSentence = sentence;
  SyncMeasurementState.bestScore = 0;
  SyncMeasurementState.currentScore = 0;
  SyncMeasurementState.voiceSamples = 0;
  SyncMeasurementState.totalSamples = 0;
  
  const interval = window.SnapTalkConfig?.timing?.step2SyncInterval || 100;
  const threshold = window.SnapTalkConfig?.audio?.voiceThreshold || 40;
  const autoAdvance = window.SnapTalkConfig?.scoring?.step2AutoAdvance || 90;
  
  SyncMeasurementState._intervalId = setInterval(() => {
    if (!SyncMeasurementState.isRunning) return;
    
    const volume = callbacks.getVolume ? callbacks.getVolume() : 0;
    SyncMeasurementState.totalSamples++;
    
    if (volume > threshold) {
      SyncMeasurementState.voiceSamples++;
    }
    
    // 실시간 점수 계산
    const voiceRatio = SyncMeasurementState.voiceSamples / SyncMeasurementState.totalSamples;
    const timingMatch = Math.min(1, SyncMeasurementState.totalSamples / 30); // 최소 3초
    const score = Math.round(voiceRatio * timingMatch * 100);
    
    SyncMeasurementState.currentScore = score;
    
    // 최고 기록 갱신
    if (score > SyncMeasurementState.bestScore) {
      SyncMeasurementState.bestScore = score;
    }
    
    // 콜백 호출
    if (callbacks.onUpdate) {
      callbacks.onUpdate({
        current: score,
        best: SyncMeasurementState.bestScore,
        voiceSamples: SyncMeasurementState.voiceSamples
      });
    }
    
    // 90% 도달 시 자동 진행
    if (score >= autoAdvance) {
      if (callbacks.onAutoAdvance) {
        callbacks.onAutoAdvance(score);
      }
      stopSyncMeasurement();
    }
  }, interval);
}

/**
 * Step 2 싱크 측정 정지 + 결과 반환
 */
function stopSyncMeasurement() {
  SyncMeasurementState.isRunning = false;
  if (SyncMeasurementState._intervalId) {
    clearInterval(SyncMeasurementState._intervalId);
    SyncMeasurementState._intervalId = null;
  }
  
  const minVoiceFrames = window.SnapTalkConfig?.audio?.minVoiceFrames || 5;
  
  return {
    finalScore: SyncMeasurementState.bestScore,
    voiceSamples: SyncMeasurementState.voiceSamples,
    hasEnoughVoice: SyncMeasurementState.voiceSamples >= minVoiceFrames,
    warning: SyncMeasurementState.voiceSamples < minVoiceFrames 
      ? '🔇 목소리가 안 들려요' 
      : null
  };
}

/**
 * 현재 상태 스냅샷
 */
function getSyncSnapshot() {
  return {
    isRunning: SyncMeasurementState.isRunning,
    currentScore: SyncMeasurementState.currentScore,
    bestScore: SyncMeasurementState.bestScore,
    voiceSamples: SyncMeasurementState.voiceSamples
  };
}

if (typeof window !== 'undefined') {
  window.SyncMeasurement = {
    start: startSyncMeasurement,
    stop: stopSyncMeasurement,
    getSnapshot: getSyncSnapshot
  };
}
