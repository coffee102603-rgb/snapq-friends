/**
 * 📁 UI · 나의 방 (My Room)
 * 
 * Snap Review 3초 순환 + Snap Note 손글씨 통합 화면
 * ALGORITHM #17 활용
 */

(function() {
  'use strict';

  function render(container) {
    if (!container) return;
    
    const expressions = window.SnapNote?.loadExpressions() || [];
    const streak = window.SnapTalkUtils?.getStreak?.() || { count: 0 };
    const history = JSON.parse(localStorage.getItem('sd_history') || '[]');
    const avgScore = history.length > 0 
      ? Math.round(history.reduce((a, b) => a + (b.score || 0), 0) / history.length)
      : 0;
    
    container.innerHTML = `
      <div class="my-room-wrapper">
        
        <!-- 상단: 미니멀 통계 (한 줄 압축) -->
        <div class="my-room-stats">
          <div class="stat-pill">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">${streak.count}</span>
            <span class="stat-label">일</span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">📝</span>
            <span class="stat-value">${expressions.length}</span>
            <span class="stat-label">개</span>
          </div>
          <div class="stat-pill">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">${avgScore}</span>
            <span class="stat-label">점</span>
          </div>
        </div>
        
        <!-- 섹션 타이틀 -->
        <div class="my-room-section-title">
          <span>🔄 Snap Review</span>
          <span class="section-hint">3초마다 자동 순환 · 탭해서 연습</span>
        </div>
        
        <!-- Snap Review 컨테이너 -->
        <div id="snap-review-container" class="snap-review-wrapper"></div>
        
        <!-- 하단 서브 메뉴 -->
        <div class="my-room-submenu">
          <button class="submenu-btn" onclick="MyRoom.goQuickReview()">
            <span class="submenu-icon">📖</span>
            <span class="submenu-label">퀵 리뷰</span>
          </button>
          <button class="submenu-btn" onclick="MyRoom.goRealTalk()">
            <span class="submenu-icon">🎤</span>
            <span class="submenu-label">실전 대화</span>
          </button>
          <button class="submenu-btn" onclick="MyRoom.share()">
            <span class="submenu-icon">📤</span>
            <span class="submenu-label">공유</span>
          </button>
        </div>
        
      </div>
    `;
    
    // Snap Review 자동 시작
    if (window.SnapNote) {
      window.SnapNote.startReview(expressions);
    }
  }
  
  function stop() {
    if (window.SnapNote) {
      window.SnapNote.stop();
    }
  }
  
  function goQuickReview() {
    alert('퀵 리뷰 모드는 Phase 3에서 구현 예정!');
  }
  
  function goRealTalk() {
    alert('실전 대화는 Friends Mode로 연결됩니다 (Phase 3)');
  }
  
  function share() {
    const text = 'SnapTalk으로 영어 더빙 연습 중! 🎬';
    if (navigator.share) {
      navigator.share({ title: 'SnapTalk', text: text, url: location.href });
    } else {
      navigator.clipboard.writeText(location.href);
      alert('링크가 복사되었어요!');
    }
  }
  
  // 공개 API
  window.MyRoom = {
    render: render,
    stop: stop,
    goQuickReview: goQuickReview,
    goRealTalk: goRealTalk,
    share: share
  };
})();
