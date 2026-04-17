/**
 * 📱 UI · Feed 컴포넌트
 * 카테고리별 영상 피드 (당근마켓 스타일)
 */

(function() {
  'use strict';

  function render(container, data) {
    if (!data.shorts || !data.categories) {
      container.innerHTML = '<div>데이터 로딩 중...</div>';
      return;
    }
    
    const userLang = window.MultiLang?.detectUserLanguage() || 'ko';
    const region = userLang === 'ko' ? 'us' : 'us';  // 기본 US
    
    const shorts = data.shorts[region] || [];
    const categories = data.categories[region] || [];
    
    container.innerHTML = `
      <div id="feedHeader">
        <div class="logo">SnapTalk <span class="logo-badge">v7.0</span></div>
        <button class="lang-btn" onclick="SnapTalkApp.toggleLanguage()">🇰🇷 한국어</button>
      </div>
      
      <div id="feedBody">
        ${categories.map(cat => renderCategoryRow(cat, shorts)).join('')}
      </div>
    `;
    
    attachEventListeners();
  }

  function renderCategoryRow(category, shorts) {
    const filtered = shorts.filter(category.filter || (() => true));
    if (filtered.length === 0) return '';
    
    return `
      <div class="category-row">
        <h3 class="category-title">${category.emoji} ${category.title}</h3>
        <div class="category-scroll">
          ${filtered.slice(0, category.limit || 10).map(short => 
            renderShortCard(short)
          ).join('')}
        </div>
      </div>
    `;
  }

  function renderShortCard(short) {
    return `
      <div class="short-card" data-id="${short.id}">
        <div class="short-thumb">
          <img src="https://img.youtube.com/vi/${short.id}/mqdefault.jpg" alt="${short.title}">
          <div class="short-icon">${short.catIcon}</div>
        </div>
        <div class="short-title">${short.title}</div>
        <div class="short-meta">${short.dubs?.toLocaleString() || 0} dubs</div>
      </div>
    `;
  }

  function attachEventListeners() {
    document.querySelectorAll('.short-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        const short = findShort(id);
        if (short) {
          window.SnapTalkApp.currentShort = short;
          window.SnapTalkApp.showScreen('player');
        }
      });
    });
  }

  function findShort(id) {
    const shorts = window.SnapTalkApp?.data?.shorts;
    if (!shorts) return null;
    
    for (const region in shorts) {
      const found = shorts[region].find(s => s.id === id);
      if (found) return found;
    }
    return null;
  }

  window.Feed = { render };
})();
