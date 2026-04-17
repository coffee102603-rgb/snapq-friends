/**
 * 🎬 UI · Player 컴포넌트
 * Progressive Dubbing 4단계 + 더빙 엔진 통합
 */

(function() {
  'use strict';

  const PlayerState = {
    currentShort: null,
    currentStage: 1,
    currentSentenceIdx: 0,
    ytPlayer: null
  };

  function render(container, short, stage) {
    if (!short) {
      container.innerHTML = '<div>영상 정보 없음</div>';
      return;
    }
    
    PlayerState.currentShort = short;
    PlayerState.currentStage = stage || 1;
    
    container.innerHTML = `
      <div id="playerScreen">
        <div id="playerHeader">
          <button onclick="SnapTalkApp.showScreen('home')" class="back-btn">← 뒤로</button>
          <div class="stage-indicator">
            ${[1,2,3,4].map(s => `
              <div class="stage-dot ${s <= PlayerState.currentStage ? 'active' : ''}" data-stage="${s}">
                ${s}
              </div>
            `).join('')}
          </div>
        </div>
        
        <div id="youtubeContainer">
          <div id="ytPlayer"></div>
        </div>
        
        <div id="karaokeContainer"></div>
        
        <div id="syncGauge">
          <svg viewBox="0 0 100 100" class="ring-gauge">
            <circle cx="50" cy="50" r="45" class="ring-bg"/>
            <circle cx="50" cy="50" r="45" class="ring-fill" id="ringFill"/>
          </svg>
          <div class="ring-text" id="ringText">0%</div>
        </div>
        
        <div id="controlBar">
          <button id="retryBtn" onclick="Player.retry()">🔄 다시</button>
          <button id="finishBtn" onclick="Player.finish()">🎬 완료</button>
        </div>
      </div>
    `;
    
    initializePlayer();
  }

  function initializePlayer() {
    // YouTube 플레이어 초기화는 여기서
    const stageLabel = window.ProgressiveDubbing?.STAGE_LABELS[PlayerState.currentStage];
    console.log(`🎬 Player: ${PlayerState.currentShort.title} - ${stageLabel}`);
    
    renderKaraokeCaptions();
  }

  function renderKaraokeCaptions() {
    const container = document.getElementById('karaokeContainer');
    if (!container || !window.KaraokeCaptions) return;
    
    const captions = window.KaraokeCaptions.renderKaraokeCaptions(
      PlayerState.currentShort.sentences,
      PlayerState.currentSentenceIdx,
      { showTranslation: true }
    );
    
    container.innerHTML = captions.map(c => `
      <div class="caption-line ${c.state}" style="opacity:${c.opacity};transform:scale(${c.scale})">
        <div class="caption-en">${c.text}</div>
        ${c.translation ? `<div class="caption-ko">${c.translation}</div>` : ''}
      </div>
    `).join('');
  }

  function retry() {
    PlayerState.currentSentenceIdx = 0;
    renderKaraokeCaptions();
  }

  function finish() {
    // 채점 + 가요방식 결과 연출
    const result = window.Scoring5Factor?.calculate({
      sentenceStats: window.DubbingEngine?._state?.sentenceStats || [],
      volumeTrack: window.DubbingEngine?._state?.volumeTrack || [],
      sentences: PlayerState.currentShort.sentences,
      difficulty: 'onair'
    });
    
    window.SnapTalkApp.lastResult = result;
    window.SnapTalkApp.showScreen('result');
  }

  window.Player = { render, retry, finish, _state: PlayerState };
})();
