/**
 * 🎤 UI · Scoreboard 컴포넌트 (가요방식 결과 화면)
 * 
 * ⭐ ALGORITHM #04를 시각적으로 구현한 핵심 UI
 * 
 * 연출 순서:
 *   1. 숫자 카운터 애니메이션 (감속 포함)
 *   2. 구간별 이펙트 (폭죽/반짝/진동/페이드)
 *   3. 메시지 표시 ("아쉬운 78점! 2점만 더!")
 *   4. CTA 버튼 (재도전 펄스 / 공유 / 다음)
 */

(function() {
  'use strict';

  function render(container, result) {
    if (!result) {
      container.innerHTML = '<div>점수 데이터 없음</div>';
      return;
    }
    
    container.innerHTML = `
      <div id="scoreboardScreen">
        <div id="scoreboardTitle">결과 발표</div>
        
        <div id="scoreDisplay">
          <div id="scoreCounter">0</div>
          <div id="scoreRank"></div>
        </div>
        
        <div id="effectLayer"></div>
        
        <div id="scoreMessage"></div>
        
        <div id="factorBreakdown">
          <!-- 5요소 점수 상세 (접기/펼치기) -->
        </div>
        
        <div id="ctaArea"></div>
        
        <div id="feedback" style="margin-top:16px;color:#888;font-size:13px"></div>
      </div>
    `;
    
    // ★ 가요방식 결과 연출 시작!
    startKaraokeShow(result);
  }

  /**
   * 가요방식 결과 연출 메인
   */
  function startKaraokeShow(result) {
    const counterEl = document.getElementById('scoreCounter');
    const rankEl = document.getElementById('scoreRank');
    const effectEl = document.getElementById('effectLayer');
    const messageEl = document.getElementById('scoreMessage');
    const ctaEl = document.getElementById('ctaArea');
    
    if (!window.KaraokeResult) {
      counterEl.textContent = result.finalScore;
      return;
    }
    
    // ALGORITHM #04 호출
    window.KaraokeResult.dramatizeResult(result.finalScore, {
      // 1. 카운터 업데이트
      updateCounter: (current) => {
        counterEl.textContent = Math.floor(current);
        // 80점 이상이면 금색
        if (current >= 80) {
          counterEl.style.color = '#ffc842';
          counterEl.style.textShadow = '0 0 40px rgba(255,200,66,0.8)';
        }
      },
      
      // 2. 이펙트 표시
      showEffect: (zoneId, effect) => {
        applyEffect(effectEl, effect, zoneId);
        rankEl.textContent = result.rank;
        rankEl.style.color = getColorByZone(zoneId);
      },
      
      // 3. 메시지 표시
      showMessage: (message) => {
        messageEl.innerHTML = `<div class="message-text">${message}</div>`;
        
        // 문장별 피드백 추가
        const detailed = window.KaraokeResult.generateDetailedFeedback(result.sentenceScores);
        if (detailed) {
          document.getElementById('feedback').textContent = detailed;
        }
      },
      
      // 4. CTA 버튼
      showCTA: (ctaText, action, isPulse) => {
        ctaEl.innerHTML = `
          <button class="cta-btn ${isPulse ? 'pulse' : ''}" onclick="Scoreboard.handleCTA('${action}')">
            ${ctaText}
          </button>
        `;
      },
      
      // 5. 효과음 (실제 구현은 audio API)
      playSound: (bgm) => {
        console.log(`🔊 Play: ${bgm}`);
        // 추후 실제 오디오 재생
      }
    });
  }

  /**
   * 이펙트 적용
   */
  function applyEffect(container, effect, zoneId) {
    switch (effect) {
      case 'fireworks':
        container.innerHTML = '🎆🎆🎆';
        container.className = 'effect-fireworks';
        break;
      case 'sparkle':
        container.innerHTML = '✨';
        container.className = 'effect-sparkle';
        break;
      case 'shake':
        document.getElementById('scoreCounter').classList.add('shake-animation');
        break;
      case 'fade':
        container.className = 'effect-fade';
        break;
    }
  }

  function getColorByZone(zoneId) {
    const zone = window.KaraokeResult?.EMOTION_ZONES?.find(z => z.id === zoneId);
    return zone?.color || '#00e5a0';
  }

  /**
   * CTA 버튼 핸들러
   */
  function handleCTA(action) {
    switch (action) {
      case 'retry':
        window.SnapTalkApp.showScreen('player');
        break;
      case 'next':
        // 다음 영상 추천
        const rec = window.AutoNext?.pickNextRecommendation();
        console.log('다음 추천:', rec);
        window.SnapTalkApp.showScreen('home');
        break;
      case 'share':
        // 공유 기능
        if (navigator.share) {
          navigator.share({
            title: 'SnapTalk Score',
            text: `${window.SnapTalkApp.lastResult.finalScore}점 달성!`
          });
        }
        break;
      case 'easier':
        // 쉬운 영상 추천
        window.SnapTalkApp.showScreen('home');
        break;
    }
  }

  window.Scoreboard = { render, handleCTA };
})();
