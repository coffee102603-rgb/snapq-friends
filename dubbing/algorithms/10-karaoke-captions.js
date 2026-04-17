/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #10 · KARAOKE PROGRESSIVE CAPTIONS
 *                     (카라오케식 progressive reveal 자막)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : B (청구항 보강용)
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #02 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED
 * 
 * 📝 DESCRIPTION
 *   현재 문장을 강조하면서 이전/다음 문장도 보여주는
 *   4단계 상태 시스템. 노래방식 UI 차용.
 * 
 * 🔬 INNOVATION — 4단계 상태
 *   - done     : 이미 끝난 문장 (회색, opacity 0.4)
 *   - current  : 현재 활성 문장 (밝음, 크게, 박동)
 *   - next     : 다음 문장 (중간 밝기, 힌트)
 *   - upcoming : 먼 미래 문장 (매우 흐림)
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Attention Management (Broadbent, 1958):
 *     현재에 집중하되 다음을 예측
 *   - Reading Ahead Strategy:
 *     다음 문장 미리 보기 = 읽기 속도 향상
 * 
 * 🔗 RELATED: #02 (엔진), #11 (싱크 링)
 * ═══════════════════════════════════════════════════════════════════
 */

/**
 * 문장 상태 결정
 * 
 * @param {number} sentenceIdx - 문장 인덱스
 * @param {number} activeIdx - 현재 활성 인덱스
 * @returns {string} 상태 (done/current/next/upcoming)
 */
function getSentenceState(sentenceIdx, activeIdx) {
  if (sentenceIdx < activeIdx) return 'done';
  if (sentenceIdx === activeIdx) return 'current';
  if (sentenceIdx === activeIdx + 1) return 'next';
  return 'upcoming';
}

/**
 * 카라오케 자막 전체 렌더링
 * 
 * @param {Array<Object>} sentences - 문장 배열
 * @param {number} activeIdx - 현재 활성 인덱스
 * @param {Object} options - 옵션
 * @returns {Array<Object>} 렌더링 데이터
 */
function renderKaraokeCaptions(sentences, activeIdx, options = {}) {
  return sentences.map((sentence, idx) => {
    const state = getSentenceState(idx, activeIdx);
    
    return {
      idx,
      text: sentence.en,
      translation: options.showTranslation ? sentence.translation : null,
      state,
      opacity: getOpacityByState(state),
      scale: state === 'current' ? 1.1 : 1.0,
      isActive: state === 'current',
      shouldPulse: state === 'current'
    };
  });
}

function getOpacityByState(state) {
  switch (state) {
    case 'done': return 0.4;
    case 'current': return 1.0;
    case 'next': return 0.7;
    case 'upcoming': return 0.3;
    default: return 0.5;
  }
}

if (typeof window !== 'undefined') {
  window.KaraokeCaptions = {
    getSentenceState,
    renderKaraokeCaptions,
    getOpacityByState
  };
}
