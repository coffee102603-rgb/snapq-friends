/**
 * 🏆 UI · Hall of Fame 컴포넌트
 * 명예의전당 + 레전드 표시
 */

(function() {
  'use strict';

  function render(container) {
    const hofKey = window.SnapTalkConfig?.storageKeys?.hallOfFame || 'sd_hallOfFame';
    const legends = JSON.parse(localStorage.getItem(hofKey) || '[]');
    
    container.innerHTML = `
      <div id="hallOfFame">
        <h2>🏆 명예의전당</h2>
        <div class="legend-list">
          ${legends.length === 0 ? 
            '<p>아직 LEGEND 기록이 없어요!</p>' :
            legends.slice(0, 10).map((l, i) => `
              <div class="legend-item">
                <div class="legend-rank">#${i + 1}</div>
                <div class="legend-title">${l.title}</div>
                <div class="legend-score">${l.score}점</div>
              </div>
            `).join('')
          }
        </div>
      </div>
    `;
  }

  function saveLegend(short, score, difficulty) {
    if (score < 95) return false;  // LEGEND만 저장
    
    const hofKey = window.SnapTalkConfig?.storageKeys?.hallOfFame || 'sd_hallOfFame';
    const legends = JSON.parse(localStorage.getItem(hofKey) || '[]');
    
    legends.push({
      title: short.title,
      videoId: short.id,
      score,
      difficulty,
      date: new Date().toISOString()
    });
    
    legends.sort((a, b) => b.score - a.score);
    localStorage.setItem(hofKey, JSON.stringify(legends.slice(0, 50)));
    
    return true;
  }

  window.HallOfFame = { render, saveLegend };
})();
