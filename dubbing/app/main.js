/**
 * ═══════════════════════════════════════════════════════════════════
 * 🚀 MAIN.js · SnapTalk 앱 초기화
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 역할:
 *   - 앱 부팅 시퀀스 관리
 *   - 스크립트 동적 로딩
 *   - 화면 전환 (home → category → player → result)
 *   - 전역 이벤트 핸들러
 * 
 * 실행 순서:
 *   1. config.js 로드 (먼저)
 *   2. 필수 알고리즘 로드 (지연 로딩)
 *   3. UI 컴포넌트 로드
 *   4. 데이터 로드 (shorts.json)
 *   5. 초기 화면 렌더링
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 앱 상태
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  
  const App = {
    version: '7.0.1',
    currentScreen: 'loading',
    currentShort: null,
    currentStage: 1,
    data: {
      shorts: null,
      categories: null,
      languages: null
    },
    loaded: {
      algorithms: new Set(),
      ui: new Set()
    }
  };

  // 전역 노출
  window.SnapTalkApp = App;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 스크립트 로더
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * 스크립트 동적 로딩
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * 여러 스크립트를 순차 로딩
   */
  async function loadScripts(srcList) {
    for (const src of srcList) {
      await loadScript(src);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 데이터 로더
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async function loadData() {
    try {
      const [shorts, categories, languages] = await Promise.all([
        fetch('data/shorts.json').then(r => r.json()),
        fetch('data/categories.json').then(r => r.json()),
        fetch('data/languages.json').then(r => r.json())
      ]);
      
      App.data.shorts = shorts;
      App.data.categories = categories;
      App.data.languages = languages;
      
      return true;
    } catch (err) {
      console.error('Data load failed:', err);
      return false;
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 초기화 시퀀스
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async function initialize() {
    console.log('🚀 SnapTalk v' + App.version + ' 시작');
    
    try {
      // Phase 1: 필수 알고리즘 로드
      await loadScripts([
        'algorithms/01-progressive-dubbing.js',
        'algorithms/09-multilang-structure.js',
        'algorithms/14-interest-scoring.js',
        'algorithms/15-difficulty-curve.js'
      ]);
      console.log('✅ 필수 알고리즘 로드 완료');
      
      // Phase 2: UI 컴포넌트 로드 (+ Snap Note/Review)
      await loadScripts([
        'algorithms/17-snap-note-review.js',
        'ui/feed.js',
        'ui/player.js',
        'ui/scoreboard.js',
        'ui/my-room.js'
      ]);
      console.log('✅ UI 컴포넌트 로드 완료');
      
      // Phase 3: 데이터 로드
      const dataOk = await loadData();
      if (!dataOk) {
        throw new Error('데이터 로딩 실패');
      }
      console.log('✅ 데이터 로드 완료');
      
      // Phase 4: 초기 화면 렌더링
      showScreen('home');
      console.log('✅ SnapTalk 시작 완료');
      
    } catch (err) {
      console.error('❌ 초기화 실패:', err);
      showError(err.message);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 화면 전환 (라우팅)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  async function showScreen(screenId) {
    App.currentScreen = screenId;
    
    const container = document.getElementById('app');
    if (!container) return;
    
    switch (screenId) {
      case 'home':
        renderHome(container);
        break;
      case 'my-room':
        renderMyRoom(container);
        break;
      case 'player':
        // 플레이어 진입 시 필요한 알고리즘 로드
        await loadPlayerAlgorithms();
        renderPlayer(container);
        break;
      case 'result':
        renderResult(container);
        break;
      default:
        renderHome(container);
    }
  }

  /**
   * 플레이어 알고리즘 지연 로딩
   */
  async function loadPlayerAlgorithms() {
    if (App.loaded.algorithms.has('player')) return;
    
    await loadScripts([
      'algorithms/02-dubbing-engine.js',
      'algorithms/03-audio-gate.js',
      'algorithms/04-karaoke-result.js',
      'algorithms/05-scoring-5factor.js',
      'algorithms/07-sync-measurement.js',
      'algorithms/08-speech-accuracy.js',
      'algorithms/10-karaoke-captions.js',
      'algorithms/11-sync-ring-gauge.js',
      'algorithms/12-realtime-loop.js',
      'algorithms/13-adaptive-difficulty.js',
      'algorithms/16-auto-next.js'
    ]);
    
    App.loaded.algorithms.add('player');
    console.log('✅ 플레이어 알고리즘 로드 완료');
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 화면 렌더링 (뼈대)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  function renderHome(container) {
    // Snap Review 타이머 정리 (다른 화면에서 돌고 있을 수 있음)
    if (window.MyRoom) window.MyRoom.stop();
    
    if (window.Feed) {
      window.Feed.render(container, App.data);
    } else {
      container.innerHTML = '<div class="screen-loading">Loading feed...</div>';
    }
  }

  function renderMyRoom(container) {
    if (window.MyRoom) {
      window.MyRoom.render(container);
    } else {
      container.innerHTML = '<div class="screen-loading">Loading My Room...</div>';
    }
  }

  function renderPlayer(container) {
    if (window.Player) {
      window.Player.render(container, App.currentShort, App.currentStage);
    }
  }

  function renderResult(container) {
    if (window.Scoreboard) {
      window.Scoreboard.render(container, App.lastResult);
    }
  }

  function showError(message) {
    const container = document.getElementById('app');
    container.innerHTML = `
      <div style="padding:40px;text-align:center;color:#ff6b6b">
        <h2>⚠️ 오류가 발생했습니다</h2>
        <p style="margin:16px 0;color:#888">${message}</p>
        <button onclick="location.reload()" style="padding:12px 24px;background:#00e5a0;color:#000;border:none;border-radius:8px;font-weight:700;cursor:pointer">
          다시 시도
        </button>
      </div>
    `;
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 공개 API
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  App.showScreen = showScreen;
  App.initialize = initialize;

  // 페이지 로드 완료 시 자동 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
