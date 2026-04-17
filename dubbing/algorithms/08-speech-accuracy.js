/**
 * ═══════════════════════════════════════════════════════════════════
 * 🎯 ALGORITHM #08 · SPEECH ACCURACY MEASUREMENT
 *                     (발음 정확도 측정 알고리즘)
 * ───────────────────────────────────────────────────────────────────
 * 📊 PATENT GRADE  : A (고유 구현) ★ NEW
 * 📋 CLAIM TYPE    : 종속 청구항 (독립 #02 산하)
 * 🏷️  STATUS        : ✅ IMPLEMENTED (2026-04-17)
 * 
 * 📝 DESCRIPTION
 *   Web Speech API (SpeechRecognition) 기반 발음 정확도 측정.
 *   기존의 "목소리 감지"에서 "단어 매칭"으로 진화.
 *   
 *   단순 음량이 아닌 "실제로 무엇을 말했는가"를 평가하여
 *   진짜 발음 학습 가능.
 * 
 * 🔬 INNOVATION
 *   1. 실시간 음성→텍스트 (continuous mode)
 *   2. Levenshtein distance로 유사도 계산
 *   3. 단어별 매칭률 (target 10개 중 7개 맞으면 70%)
 *   4. 음소 단위 피드백 (어느 단어에서 틀렸는지)
 *   5. 완화 매칭 (대소문자, 구두점 무시)
 * 
 * 🎓 EDUCATIONAL THEORY
 *   - Corrective Feedback (Lyster & Ranta, 1997):
 *     구체적 피드백 = 학습 효과 극대화
 *   - Phonological Awareness (Yopp, 1992):
 *     발음 의식이 어학 습득 핵심
 *   - Comprehensible Output (Swain, 1985):
 *     산출 → 문제 인식 → 학습 강화
 * 
 * 🔗 RELATED ALGORITHMS
 *   - #02: 더빙 엔진의 기존 volumeTrack과 통합
 *   - #05: 5요소 채점에 "발음 점수" 추가 가능
 * 
 * ⚠️ BROWSER COMPATIBILITY
 *   - Chrome/Edge: 완벽 지원
 *   - Safari: iOS 14.5+ 지원
 *   - Firefox: 미지원 → 폴백으로 기존 볼륨 측정
 * ═══════════════════════════════════════════════════════════════════
 */

const SpeechAccuracyState = {
  recognition: null,
  isListening: false,
  targetText: '',
  recognizedText: '',
  wordScores: [],
  supported: false
};

// 브라우저 지원 체크
(function checkSupport() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  SpeechAccuracyState.supported = !!SR;
})();

/**
 * 발음 정확도 측정 시작
 * 
 * @param {string} targetText - 목표 문장 (예: "What do you do for a living?")
 * @param {string} lang - 언어 (예: 'en-US')
 * @param {Object} callbacks - UI 콜백
 * @returns {boolean} 시작 성공 여부
 */
function startSpeechAccuracy(targetText, lang, callbacks) {
  if (!SpeechAccuracyState.supported) {
    if (callbacks.onError) {
      callbacks.onError('브라우저가 음성 인식을 지원하지 않습니다');
    }
    return false;
  }
  
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  
  recognition.lang = lang || 'en-US';
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  
  SpeechAccuracyState.recognition = recognition;
  SpeechAccuracyState.targetText = normalizeText(targetText);
  SpeechAccuracyState.recognizedText = '';
  SpeechAccuracyState.wordScores = [];
  SpeechAccuracyState.isListening = true;
  
  // 결과 이벤트
  recognition.onresult = (event) => {
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    SpeechAccuracyState.recognizedText = (finalTranscript + interimTranscript).trim();
    
    // 실시간 점수 계산
    const score = calculateAccuracy(
      SpeechAccuracyState.targetText,
      SpeechAccuracyState.recognizedText
    );
    
    if (callbacks.onUpdate) {
      callbacks.onUpdate({
        recognized: SpeechAccuracyState.recognizedText,
        score: score.overall,
        wordScores: score.words,
        isInterim: !!interimTranscript
      });
    }
  };
  
  // 에러 이벤트
  recognition.onerror = (event) => {
    if (callbacks.onError) {
      callbacks.onError(`Recognition error: ${event.error}`);
    }
  };
  
  // 종료 이벤트
  recognition.onend = () => {
    if (SpeechAccuracyState.isListening) {
      // 자동 재시작 (continuous mode 유지)
      try {
        recognition.start();
      } catch (e) {
        SpeechAccuracyState.isListening = false;
      }
    }
  };
  
  try {
    recognition.start();
    return true;
  } catch (err) {
    if (callbacks.onError) {
      callbacks.onError(`Failed to start: ${err.message}`);
    }
    return false;
  }
}

/**
 * 발음 측정 정지 + 최종 결과
 * 
 * @returns {Object} 최종 결과
 */
function stopSpeechAccuracy() {
  SpeechAccuracyState.isListening = false;
  
  if (SpeechAccuracyState.recognition) {
    try {
      SpeechAccuracyState.recognition.stop();
    } catch (e) { /* ignore */ }
  }
  
  const finalScore = calculateAccuracy(
    SpeechAccuracyState.targetText,
    SpeechAccuracyState.recognizedText
  );
  
  return {
    target: SpeechAccuracyState.targetText,
    recognized: SpeechAccuracyState.recognizedText,
    accuracy: finalScore.overall,
    wordScores: finalScore.words,
    missedWords: finalScore.words.filter(w => !w.matched).map(w => w.target)
  };
}

/**
 * 텍스트 정규화 (비교용)
 * 
 * @param {string} text - 원본 텍스트
 * @returns {string} 정규화된 텍스트
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 정확도 계산 메인
 * 
 * @param {string} target - 목표 텍스트
 * @param {string} recognized - 인식된 텍스트
 * @returns {Object} 정확도 결과
 */
function calculateAccuracy(target, recognized) {
  const targetWords = normalizeText(target).split(/\s+/);
  const recognizedWords = normalizeText(recognized).split(/\s+/);
  
  const wordScores = [];
  let matchCount = 0;
  
  targetWords.forEach((targetWord, idx) => {
    // 유사한 단어 찾기 (Levenshtein)
    const bestMatch = findBestMatch(targetWord, recognizedWords);
    const matched = bestMatch.similarity >= 0.7;  // 70% 이상 유사
    
    wordScores.push({
      target: targetWord,
      matched: matched,
      recognized: bestMatch.word,
      similarity: Math.round(bestMatch.similarity * 100)
    });
    
    if (matched) matchCount++;
  });
  
  const overall = targetWords.length > 0
    ? Math.round((matchCount / targetWords.length) * 100)
    : 0;
  
  return {
    overall,
    words: wordScores,
    matchCount,
    totalWords: targetWords.length
  };
}

/**
 * 단어 유사도 계산 (Levenshtein 기반)
 * 
 * @param {string} target - 목표 단어
 * @param {Array<string>} candidates - 후보 단어들
 * @returns {Object} 가장 유사한 단어 + 유사도
 */
function findBestMatch(target, candidates) {
  if (!candidates || candidates.length === 0) {
    return { word: '', similarity: 0 };
  }
  
  let best = { word: candidates[0], similarity: 0 };
  
  candidates.forEach(candidate => {
    const similarity = calculateSimilarity(target, candidate);
    if (similarity > best.similarity) {
      best = { word: candidate, similarity };
    }
  });
  
  return best;
}

/**
 * Levenshtein 기반 유사도 (0~1)
 * 
 * @param {string} a - 문자열 A
 * @param {string} b - 문자열 B
 * @returns {number} 유사도 (0~1)
 */
function calculateSimilarity(a, b) {
  if (a === b) return 1.0;
  if (!a || !b) return 0;
  
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Levenshtein 거리 계산
 * 
 * @param {string} a
 * @param {string} b
 * @returns {number} 편집 거리
 */
function levenshteinDistance(a, b) {
  const matrix = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,  // 치환
          matrix[i][j - 1] + 1,      // 삽입
          matrix[i - 1][j] + 1       // 삭제
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

if (typeof window !== 'undefined') {
  window.SpeechAccuracy = {
    start: startSpeechAccuracy,
    stop: stopSpeechAccuracy,
    calculateAccuracy,
    calculateSimilarity,
    isSupported: () => SpeechAccuracyState.supported
  };
}
