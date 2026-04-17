/**
 * ============================================================================
 * ALGORITHM #17 · SNAP NOTE + SNAP REVIEW (HANDWRITING LEARNING SYSTEM)
 * ============================================================================
 * 
 * PATENT GRADE: S (세계 최초 조합)
 * CLAIM TYPE: 독립 청구항 5 (추가 S급 청구항)
 * STATUS: 신규 추가 (v7.0.1)
 * 
 * DESCRIPTION:
 * YouTube 더빙 플랫폼 내에서 손글씨 기반 단어 학습 시스템을 통합한 혁신적
 * 학습 메커니즘. 두 가지 모드로 작동:
 * 
 * 1. 가리개 (Dubbing Screen Overlay) - 영상 위 즉흥 손글씨 메모
 * 2. Snap Note (My Room) - 저장된 표현을 손가락으로 반복 쓰기
 * 
 * 추가로 Snap Review 시스템 제공:
 * - 저장된 표현을 3초마다 1장씩 자동 순환 표시
 * - 카드 수에 관계없이 항상 미니멀 UI 유지 (100개든 1000개든)
 * - 일시정지 시 Snap Note 펼침 → 손가락으로 쓰면서 암기
 * 
 * INNOVATION:
 * - 더빙 앱 내 손글씨 = 세계 최초 조합 (선행기술 없음)
 * - 손가락 터치 기반 = 애플펜슬 불필요 (대중 접근성)
 * - 3초 순환 티저 UX = 저장 개수 폭증에도 UI 복잡도 0
 * - 이중 인코딩 (Dual Coding): 시각(영상) + 촉각(손글씨) + 청각(TTS)
 * - 우연한 재발견 효과 (Serendipitous Encounter): 잊었던 표현 재노출
 * 
 * EDUCATIONAL THEORY:
 * - Mueller & Oppenheimer (2014): 손글씨 학습 효과 (개념 이해 2배)
 * - Paivio (1971) Dual Coding Theory: 시각+언어 이중 부호화 기억 3배
 * - Multisensory Learning (Mayer 2009): 다감각 채널 = 전이 학습 향상
 * - Ebbinghaus Forgetting Curve: 간격 반복 노출로 망각 방지
 * - Serendipity Learning (Foster & Ford, 2003): 우연한 발견 = 깊은 학습
 * 
 * BUSINESS IMPACT:
 * - 경쟁사 회피 불가능: 더빙 + 손글씨 통합은 유일
 * - TOEIC 강사 노트 문화 디지털 이식 (한국 교실 경험 글로벌화)
 * - 특허 독립 청구항 5 추가 = 방어력 극대화
 * 
 * RELATED ALGORITHMS:
 * - #01 Progressive Dubbing (학습 주 흐름)
 * - #04 Karaoke Result (감정 기반 결과 → 학습 동기)
 * - #14 Interest Scoring (저장된 표현 = 관심 데이터)
 * ============================================================================
 */

const SnapNote = (function() {
  'use strict';

  // ==========================================================================
  // SECTION 1: 설정
  // ==========================================================================
  const CONFIG = {
    SNAP_REVIEW_INTERVAL: 3000,     // 3초 카드 순환
    FADE_DURATION: 400,              // 페이드 인/아웃
    AUTO_PAUSE_TIMEOUT: 300000,      // 5분 비활성 → 자동 재개
    MASTERY_THRESHOLD: 10,           // 10번 쓰기 = MASTERED
    
    PENCIL_COLORS: ['#2a2a38', '#e24b4a', '#378add', '#639922'],
    PENCIL_THICKNESS: 3,
    ERASER_SIZE: 20,
    
    CANVAS_WIDTH: 300,
    CANVAS_HEIGHT: 140,
    
    STORAGE_KEY: 'sd_snap_notes',
    REVIEW_STATE_KEY: 'sd_review_state'
  };

  // ==========================================================================
  // SECTION 2: 상태 관리
  // ==========================================================================
  let state = {
    expressions: [],           // 저장된 표현 배열
    currentIdx: 0,             // 현재 표시 중인 카드 인덱스
    isPaused: false,           // 일시정지 상태
    reviewTimer: null,         // setInterval 핸들
    isNoteOpen: false,         // 노트 펼침 상태
    writingCount: 0,           // 현재 표현에 쓴 횟수
    canvas: null,              // Canvas DOM 참조
    ctx: null,                 // Canvas 2D context
    isDrawing: false,          // 드로잉 중 여부
    currentTool: 'pencil',     // pencil | eraser
    currentColor: '#2a2a38',
    lastPos: null              // 마지막 터치 좌표
  };

  // ==========================================================================
  // SECTION 3: Snap Review - 3초 순환 시스템
  // ==========================================================================
  
  /**
   * 순환 시작
   * @param {Array} expressions - 저장된 표현 배열
   */
  function startReview(expressions) {
    if (!expressions || expressions.length === 0) {
      renderEmptyState();
      return;
    }
    
    state.expressions = expressions;
    state.currentIdx = 0;
    state.isPaused = false;
    
    renderCurrentCard();
    scheduleNext();
  }
  
  /**
   * 다음 카드로 자동 전환 스케줄
   */
  function scheduleNext() {
    if (state.reviewTimer) clearInterval(state.reviewTimer);
    
    state.reviewTimer = setInterval(() => {
      if (!state.isPaused && !state.isNoteOpen) {
        advanceToNext();
      }
    }, CONFIG.SNAP_REVIEW_INTERVAL);
  }
  
  /**
   * 다음 표현으로 이동 (페이드 애니메이션 포함)
   */
  function advanceToNext() {
    const cardEl = document.getElementById('snap-review-card');
    if (!cardEl) return;
    
    // 페이드 아웃
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'translateY(-8px)';
    
    setTimeout(() => {
      // 인덱스 업데이트 (순환)
      state.currentIdx = (state.currentIdx + 1) % state.expressions.length;
      renderCurrentCard();
      
      // 페이드 인
      requestAnimationFrame(() => {
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'translateY(0)';
      });
    }, CONFIG.FADE_DURATION / 2);
  }
  
  /**
   * 일시정지 토글 → 정지 시 Snap Note 펼침
   */
  function togglePause() {
    state.isPaused = !state.isPaused;
    
    if (state.isPaused) {
      openSnapNote();
    } else {
      closeSnapNote();
    }
    
    updatePauseUI();
  }
  
  /**
   * 현재 카드 삭제
   */
  function deleteCurrent() {
    if (state.expressions.length === 0) return;
    
    if (!confirm('이 표현을 삭제할까요?')) return;
    
    state.expressions.splice(state.currentIdx, 1);
    persistExpressions();
    
    if (state.expressions.length === 0) {
      renderEmptyState();
      return;
    }
    
    // 인덱스 조정
    if (state.currentIdx >= state.expressions.length) {
      state.currentIdx = 0;
    }
    
    renderCurrentCard();
  }
  
  /**
   * TTS 재생
   */
  function playTTS() {
    const expr = state.expressions[state.currentIdx];
    if (!expr) return;
    
    const utterance = new SpeechSynthesisUtterance(expr.en || expr.text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    
    speechSynthesis.speak(utterance);
  }
  
  /**
   * 현재 카드 렌더링
   */
  function renderCurrentCard() {
    const container = document.getElementById('snap-review-container');
    if (!container) return;
    
    const expr = state.expressions[state.currentIdx];
    const total = state.expressions.length;
    const progress = ((state.currentIdx + 1) / total) * 100;
    
    container.innerHTML = `
      <div class="snap-review-header">
        <span class="snap-review-count">${state.currentIdx + 1} / ${total}</span>
        <div class="snap-review-progress">
          <div class="snap-review-progress-fill" style="width:${progress}%"></div>
        </div>
      </div>
      <div id="snap-review-card" class="snap-review-card">
        <div class="snap-review-en">${escapeHtml(expr.en || '')}</div>
        <div class="snap-review-ko">${escapeHtml(expr.ko || '')}</div>
        <div class="snap-review-source">${escapeHtml(expr.source || '')}</div>
        <div class="snap-review-status">${state.isPaused ? '⏸ 정지됨' : '3초 후 다음...'}</div>
      </div>
      <div class="snap-review-actions">
        <button class="snap-btn" onclick="SnapNote.togglePause()">
          ${state.isPaused ? '▶' : '⏸'}
        </button>
        <button class="snap-btn" onclick="SnapNote.playTTS()">🔊</button>
        <button class="snap-btn" onclick="SnapNote.deleteCurrent()">🗑</button>
      </div>
    `;
    
    // 노트가 열려있으면 유지
    if (state.isNoteOpen) {
      renderSnapNote();
    }
  }
  
  function renderEmptyState() {
    const container = document.getElementById('snap-review-container');
    if (!container) return;
    
    container.innerHTML = `
      <div class="snap-review-empty">
        <div class="snap-review-empty-icon">📝</div>
        <div class="snap-review-empty-text">
          아직 저장된 표현이 없어요<br>
          더빙하면서 마음에 드는 표현을 저장해보세요!
        </div>
      </div>
    `;
  }
  
  function updatePauseUI() {
    const statusEl = document.querySelector('.snap-review-status');
    if (statusEl) {
      statusEl.textContent = state.isPaused ? '⏸ 정지됨' : '3초 후 다음...';
    }
    
    const pauseBtn = document.querySelector('.snap-review-actions .snap-btn:first-child');
    if (pauseBtn) {
      pauseBtn.textContent = state.isPaused ? '▶' : '⏸';
    }
  }
  
  // ==========================================================================
  // SECTION 4: Snap Note - 손글씨 캔버스 (나의 방)
  // ==========================================================================
  
  function openSnapNote() {
    state.isNoteOpen = true;
    state.writingCount = 0;
    renderSnapNote();
  }
  
  function closeSnapNote() {
    state.isNoteOpen = false;
    const noteEl = document.getElementById('snap-note-area');
    if (noteEl) {
      noteEl.style.maxHeight = '0';
      setTimeout(() => noteEl.remove(), 300);
    }
  }
  
  function renderSnapNote() {
    let noteEl = document.getElementById('snap-note-area');
    if (noteEl) noteEl.remove();
    
    noteEl = document.createElement('div');
    noteEl.id = 'snap-note-area';
    noteEl.className = 'snap-note-area';
    noteEl.innerHTML = `
      <div class="snap-note-header">
        <span>📝 Snap Note</span>
        <div class="snap-note-progress">
          <span class="snap-note-dots">
            ${renderProgressDots()}
          </span>
          <span class="snap-note-count">${state.writingCount} / ${CONFIG.MASTERY_THRESHOLD}</span>
        </div>
      </div>
      <canvas id="snap-note-canvas" 
              width="${CONFIG.CANVAS_WIDTH}" 
              height="${CONFIG.CANVAS_HEIGHT}">
      </canvas>
      <div class="snap-note-tools">
        <button class="snap-note-tool ${state.currentTool === 'pencil' ? 'active' : ''}" 
                onclick="SnapNote.setTool('pencil')">
          ✏️
        </button>
        <button class="snap-note-tool ${state.currentTool === 'eraser' ? 'active' : ''}" 
                onclick="SnapNote.setTool('eraser')">
          🧽
        </button>
        <button class="snap-note-tool" onclick="SnapNote.clearCanvas()">
          🔄
        </button>
        <button class="snap-note-tool" onclick="SnapNote.saveToNote()">
          💾
        </button>
      </div>
    `;
    
    const reviewContainer = document.getElementById('snap-review-container');
    if (reviewContainer && reviewContainer.parentNode) {
      reviewContainer.parentNode.insertBefore(noteEl, reviewContainer.nextSibling);
    }
    
    // Canvas 초기화
    setTimeout(() => {
      initCanvas();
      // 애니메이션: 펼쳐지는 효과
      requestAnimationFrame(() => {
        noteEl.style.maxHeight = '300px';
        noteEl.style.opacity = '1';
      });
    }, 0);
  }
  
  function renderProgressDots() {
    let dots = '';
    for (let i = 0; i < CONFIG.MASTERY_THRESHOLD; i++) {
      dots += i < state.writingCount ? '●' : '○';
    }
    return dots;
  }
  
  function initCanvas() {
    state.canvas = document.getElementById('snap-note-canvas');
    if (!state.canvas) return;
    
    state.ctx = state.canvas.getContext('2d');
    state.ctx.strokeStyle = state.currentColor;
    state.ctx.lineWidth = CONFIG.PENCIL_THICKNESS;
    state.ctx.lineCap = 'round';
    state.ctx.lineJoin = 'round';
    
    // 터치 이벤트
    state.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    state.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    state.canvas.addEventListener('touchend', handleTouchEnd);
    
    // 마우스 이벤트 (데스크톱 테스트용)
    state.canvas.addEventListener('mousedown', handleMouseDown);
    state.canvas.addEventListener('mousemove', handleMouseMove);
    state.canvas.addEventListener('mouseup', handleMouseUp);
    state.canvas.addEventListener('mouseleave', handleMouseUp);
  }
  
  function getCanvasPos(e) {
    const rect = state.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * (state.canvas.width / rect.width),
      y: (clientY - rect.top) * (state.canvas.height / rect.height)
    };
  }
  
  function handleTouchStart(e) {
    e.preventDefault();
    state.isDrawing = true;
    state.lastPos = getCanvasPos(e);
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    if (!state.isDrawing) return;
    
    const pos = getCanvasPos(e);
    drawLine(state.lastPos, pos);
    state.lastPos = pos;
  }
  
  function handleTouchEnd() {
    if (state.isDrawing) {
      state.isDrawing = false;
      incrementWritingCount();
    }
  }
  
  function handleMouseDown(e) {
    state.isDrawing = true;
    state.lastPos = getCanvasPos(e);
  }
  
  function handleMouseMove(e) {
    if (!state.isDrawing) return;
    const pos = getCanvasPos(e);
    drawLine(state.lastPos, pos);
    state.lastPos = pos;
  }
  
  function handleMouseUp() {
    if (state.isDrawing) {
      state.isDrawing = false;
      incrementWritingCount();
    }
  }
  
  function drawLine(from, to) {
    if (!state.ctx) return;
    
    if (state.currentTool === 'eraser') {
      state.ctx.globalCompositeOperation = 'destination-out';
      state.ctx.lineWidth = CONFIG.ERASER_SIZE;
    } else {
      state.ctx.globalCompositeOperation = 'source-over';
      state.ctx.strokeStyle = state.currentColor;
      state.ctx.lineWidth = CONFIG.PENCIL_THICKNESS;
    }
    
    state.ctx.beginPath();
    state.ctx.moveTo(from.x, from.y);
    state.ctx.lineTo(to.x, to.y);
    state.ctx.stroke();
  }
  
  function setTool(tool) {
    state.currentTool = tool;
    
    // UI 업데이트
    document.querySelectorAll('.snap-note-tool').forEach(btn => {
      btn.classList.remove('active');
    });
    event.target.classList.add('active');
  }
  
  function clearCanvas() {
    if (!state.ctx) return;
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
  }
  
  function incrementWritingCount() {
    state.writingCount++;
    
    const countEl = document.querySelector('.snap-note-count');
    const dotsEl = document.querySelector('.snap-note-dots');
    
    if (countEl) countEl.textContent = `${state.writingCount} / ${CONFIG.MASTERY_THRESHOLD}`;
    if (dotsEl) dotsEl.textContent = renderProgressDots();
    
    if (state.writingCount >= CONFIG.MASTERY_THRESHOLD) {
      celebrateMastery();
    }
  }
  
  function celebrateMastery() {
    const noteEl = document.getElementById('snap-note-area');
    if (!noteEl) return;
    
    const banner = document.createElement('div');
    banner.className = 'snap-mastery-banner';
    banner.textContent = '🎉 MASTERED!';
    noteEl.appendChild(banner);
    
    setTimeout(() => banner.remove(), 2500);
    
    // 마스터 기록 저장
    const expr = state.expressions[state.currentIdx];
    if (expr) {
      expr.mastered = true;
      expr.masteredAt = new Date().toISOString();
      persistExpressions();
    }
    
    state.writingCount = 0;
    clearCanvas();
  }
  
  function saveToNote() {
    if (!state.canvas) return;
    
    const dataURL = state.canvas.toDataURL('image/png');
    const expr = state.expressions[state.currentIdx];
    if (!expr) return;
    
    if (!expr.handwritings) expr.handwritings = [];
    expr.handwritings.push({
      image: dataURL,
      date: new Date().toISOString()
    });
    
    persistExpressions();
    
    // 간단한 피드백
    const btn = event.target;
    btn.textContent = '✅';
    setTimeout(() => btn.textContent = '💾', 1500);
  }
  
  // ==========================================================================
  // SECTION 5: 영속성
  // ==========================================================================
  
  function persistExpressions() {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.expressions));
    } catch (e) {
      console.warn('Snap Note: 저장 실패', e);
    }
  }
  
  function loadExpressions() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  
  function addExpression(expr) {
    const existing = loadExpressions();
    
    // 중복 체크
    if (existing.find(e => e.en === expr.en)) return false;
    
    existing.push({
      en: expr.en,
      ko: expr.ko,
      source: expr.source || '',
      savedAt: new Date().toISOString(),
      handwritings: [],
      mastered: false
    });
    
    state.expressions = existing;
    persistExpressions();
    return true;
  }
  
  // ==========================================================================
  // SECTION 6: 유틸리티
  // ==========================================================================
  
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  
  function stop() {
    if (state.reviewTimer) {
      clearInterval(state.reviewTimer);
      state.reviewTimer = null;
    }
    state.isPaused = false;
    state.isNoteOpen = false;
  }
  
  // ==========================================================================
  // 공개 API
  // ==========================================================================
  return {
    // Snap Review
    startReview: startReview,
    togglePause: togglePause,
    deleteCurrent: deleteCurrent,
    playTTS: playTTS,
    stop: stop,
    
    // Snap Note
    setTool: setTool,
    clearCanvas: clearCanvas,
    saveToNote: saveToNote,
    openSnapNote: openSnapNote,
    closeSnapNote: closeSnapNote,
    
    // Data
    addExpression: addExpression,
    loadExpressions: loadExpressions,
    
    // Config
    CONFIG: CONFIG
  };
})();

// 전역 등록
if (typeof window !== 'undefined') {
  window.SnapNote = SnapNote;
}
