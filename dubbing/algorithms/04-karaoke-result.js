/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #04 · KARAOKE-STYLE RESULT DRAMATIZATION
 *                     (가요방식 결과 연출 알고리즘)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : S (세계 최초 조합)
 * 📋 CLAIM TYPE    : 독립 청구항 4 ★ NEW
 * 🏷️  STATUS        : ✅ IMPLEMENTED (2026-04-17)
 * 
 * 📝 DESCRIPTION
 *   한국 노래방(가요방) 문화에서 영감을 받은 감정 기반 결과 연출.
 *   점수를 단순 표시하는 대신, 숫자 카운터 애니메이션 감속과
 *   3단계 감정 구간(환희/아쉬움/격려)으로 분기하여
 *   "한 번만 더!" 재도전 욕구를 유발.
 * 
 * 🔬 INNOVATION
 *   1. 숫자 카운터 감속 알고리즘
 *      - 0~50점: 빠른 증가 (3점/tick)
 *      - 50~80점: 보통 (1점/tick)  ★긴장감 구간
 *      - 80~100점: 느린 증가 (0.5점/tick)  ★클라이맥스
 *   
 *   2. 3단계 감정 구간 분기
 *      - Legend Zone (95+): 🎆 폭죽 + 공유 유도
 *      - Satisfaction (80~94): ✨ 반짝 + 다음 영상
 *      - Regret Zone (60~79): 💢 진동 + "X점만 더!" ★핵심!
 *      - Encouragement (<60): 💧 부드러운 격려
 *   
 *   3. 근접 보상 메시지 (Regret Zone 핵심)
 *      "아쉬운 78점! 2점만 더 하면 S등급!"
 *      → 심리적 몰입 + 재도전 트리거
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Loss Aversion (손실 회피 편향, Kahneman & Tversky, 1979):
 *     "잃은 것"이 "얻은 것"보다 2배 강하게 느껴짐
 *   - Near-miss Effect (근접 보상 효과, Kassinove & Schare, 2001):
 *     "거의 성공했다"는 느낌이 도박/게임 중독의 핵심 원리
 *   - Spaced Repetition with Motivation:
 *     반복 학습 + 감정적 각성 = 기억 강화
 * 
 * 🌏 CULTURAL CONTEXT
 *   한국 가요방(노래방) 문화: 점수 애니메이션 + 피드백
 *   → 한국에서 성공한 공식을 어학 학습에 적용
 *   → "문화적 독창성" = 특허 청구 강력한 근거
 * 
 * 🔗 RELATED ALGORITHMS
 *   - #05 (5요소 채점): 최종 점수 산출 담당
 *   - #13 (적응형 난이도): Regret Zone 반복 시 난이도 조정
 *   - #16 (Auto-Next): 만족 시 다음 영상 자동 추천
 * ═══════════════════════════════════════════════════════════════════
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 상수 정의
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 감정 구간 정의
 * @type {Array<Object>}
 */
const EMOTION_ZONES = [
  {
    id: 'legend',
    min: 95,
    max: 100,
    emoji: '🎆',
    label: 'LEGEND!',
    message: '완벽해요!!! 전설이에요!',
    color: '#ffc842',
    bgm: 'fanfare',
    effect: 'fireworks',
    ctaText: '🎊 자랑하기',
    ctaAction: 'share'
  },
  {
    id: 'satisfaction',
    min: 80,
    max: 94,
    emoji: '✨',
    label: 'S등급',
    message: '훌륭해요! 잘했어요!',
    color: '#00e5a0',
    bgm: 'success',
    effect: 'sparkle',
    ctaText: '👉 다음 영상',
    ctaAction: 'next'
  },
  {
    id: 'regret',
    min: 60,
    max: 79,
    emoji: '💢',
    label: '아쉬움',
    message: null,  // 동적 생성: "아쉬운 X점! Y점만 더!"
    color: '#ff6b35',
    bgm: 'suspense',
    effect: 'shake',
    ctaText: '🔥 한 번 더!',
    ctaAction: 'retry',
    pulseRetry: true  // ★재도전 버튼 강조
  },
  {
    id: 'encouragement',
    min: 0,
    max: 59,
    emoji: '💧',
    label: '연습 필요',
    message: '연습이 필요해요. 다시 해볼까요?',
    color: '#7c6bff',
    bgm: 'soft',
    effect: 'fade',
    ctaText: '📚 쉬운 영상 추천',
    ctaAction: 'easier'
  }
];

/**
 * 카운터 애니메이션 속도 정의
 * 점수대별로 다른 속도 = 긴장감 연출
 * @type {Array<Object>}
 */
const COUNTER_SPEED = [
  { min: 0,  max: 50,  step: 3.0, interval: 30 },  // 빠름
  { min: 50, max: 80,  step: 1.0, interval: 40 },  // 보통 (긴장감 시작)
  { min: 80, max: 100, step: 0.5, interval: 60 }   // 느림 (클라이맥스)
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 핵심 함수
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 점수에 해당하는 감정 구간 찾기
 * 
 * @param {number} score - 점수 (0~100)
 * @returns {Object} 해당 구간 설정
 */
function getEmotionZone(score) {
  const zone = EMOTION_ZONES.find(z => score >= z.min && score <= z.max);
  return zone || EMOTION_ZONES[EMOTION_ZONES.length - 1];
}

/**
 * Regret Zone 전용: 동적 메시지 생성
 * "아쉬운 78점! S등급까지 2점만 더!"
 * 
 * @param {number} score - 현재 점수
 * @returns {string} 메시지
 */
function generateRegretMessage(score) {
  const nextZone = EMOTION_ZONES.find(z => z.min > score);
  const gap = nextZone ? (nextZone.min - score) : 0;
  
  if (gap === 0) return '완벽해요!';
  if (gap <= 2) return `아까운 ${score}점! ${gap}점만 더 하면 ${nextZone.label}!`;
  if (gap <= 5) return `아쉬운 ${score}점! ${gap}점만 더!`;
  return `${score}점! ${nextZone.label}까지 ${gap}점!`;
}

/**
 * 점수 카운터 애니메이션
 * 
 * 가요방 특유의 "천천히 올라가다 멈추는" 효과 재현.
 * 점수대별로 속도가 다름 (긴장감 연출).
 * 
 * @param {number} targetScore - 최종 점수
 * @param {function} onUpdate - 매 tick마다 호출 (current) => void
 * @param {function} onComplete - 완료 콜백
 * @returns {number} interval ID (정지 시 clearInterval)
 * 
 * @example
 *   animateScoreCounter(85, 
 *     (current) => scoreEl.textContent = Math.floor(current),
 *     () => showResult(85)
 *   );
 */
function animateScoreCounter(targetScore, onUpdate, onComplete) {
  let current = 0;
  
  function tick() {
    // 현재 점수대에 맞는 속도 찾기
    const speed = COUNTER_SPEED.find(s => current >= s.min && current < s.max)
                  || COUNTER_SPEED[COUNTER_SPEED.length - 1];
    
    current += speed.step;
    
    if (current >= targetScore) {
      current = targetScore;
      onUpdate(current);
      if (onComplete) onComplete();
      return;
    }
    
    onUpdate(current);
    setTimeout(tick, speed.interval);
  }
  
  tick();
}

/**
 * 결과 연출 메인 함수
 * 점수 카운터 + 구간별 이펙트 + 메시지 + CTA
 * 
 * @param {number} score - 최종 점수
 * @param {Object} callbacks - UI 업데이트 콜백
 * @param {function} callbacks.updateCounter - (number) => void
 * @param {function} callbacks.showEffect - (zoneId, effect) => void
 * @param {function} callbacks.showMessage - (message) => void
 * @param {function} callbacks.showCTA - (ctaText, action, isPulse) => void
 * @param {function} callbacks.playSound - (bgm) => void
 * 
 * @example
 *   dramatizeResult(78, {
 *     updateCounter: (n) => scoreEl.textContent = Math.floor(n),
 *     showEffect: (id, fx) => applyEffect(fx),
 *     showMessage: (msg) => msgEl.textContent = msg,
 *     showCTA: (txt, act, pulse) => renderButton(txt, act, pulse),
 *     playSound: (bgm) => playBGM(bgm)
 *   });
 */
function dramatizeResult(score, callbacks) {
  const zone = getEmotionZone(score);
  
  // 1. 긴장감 BGM 시작 (즉시)
  if (callbacks.playSound) {
    callbacks.playSound('counting');
  }
  
  // 2. 점수 카운터 애니메이션
  animateScoreCounter(
    score,
    (current) => callbacks.updateCounter(current),
    () => {
      // 3. 카운터 완료 후 "땅!" 효과음
      if (callbacks.playSound) {
        callbacks.playSound(zone.bgm);
      }
      
      // 4. 구간별 이펙트 적용
      if (callbacks.showEffect) {
        callbacks.showEffect(zone.id, zone.effect);
      }
      
      // 5. 메시지 표시
      const message = zone.id === 'regret' 
        ? generateRegretMessage(score)
        : zone.message;
      
      if (callbacks.showMessage) {
        callbacks.showMessage(message);
      }
      
      // 6. CTA 버튼 표시 (Regret Zone은 펄스 효과)
      if (callbacks.showCTA) {
        callbacks.showCTA(zone.ctaText, zone.ctaAction, zone.pulseRetry || false);
      }
    }
  );
}

/**
 * 구체적 피드백 생성
 * 문장별 성적을 분석하여 "어디서 틀렸는지" 알려줌
 * 
 * @param {Array<Object>} sentenceScores - [{idx, score, covered}, ...]
 * @returns {string} 피드백 메시지
 */
function generateDetailedFeedback(sentenceScores) {
  if (!sentenceScores || sentenceScores.length === 0) return '';
  
  // 가장 낮은 점수 문장 찾기
  const worst = sentenceScores.reduce((min, cur) => 
    cur.score < min.score ? cur : min
  );
  
  if (worst.score < 50) {
    return `문장 ${worst.idx + 1}번에서 크게 놓쳤어요!`;
  } else if (worst.score < 70) {
    return `문장 ${worst.idx + 1}번이 살짝 아쉬워요.`;
  } else {
    return '전체적으로 잘하셨어요!';
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 공개 API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if (typeof window !== 'undefined') {
  window.KaraokeResult = {
    EMOTION_ZONES,
    COUNTER_SPEED,
    getEmotionZone,
    generateRegretMessage,
    animateScoreCounter,
    dramatizeResult,
    generateDetailedFeedback
  };
}
