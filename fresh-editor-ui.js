// ============================================================================
// FRESH EDITOR UI — Clean toolbar + page replacement for old Editor tab
// ============================================================================

(function() {
  'use strict';

  var COLORS = ['#141413', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#78716c', '#94a3b8'];

  function buildToolbar() {
    var bar = document.createElement('div');
    bar.id = 'fe-bar';
    bar.style.cssText = 'display:flex;align-items:center;justify-content:space-around;padding:4px 8px 8px;background:#fff;border-top:1px solid #e5e7eb;gap:2px;flex-shrink:0;';
    bar.innerHTML = [
      '<button class="fe-t" data-t="select" title="Select"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 3l7 17 2.5-6.5L20 11z"/></svg></button>',
      '<button class="fe-t" data-t="text" title="Text"><span style="font-weight:900;font-size:17px;">T</span></button>',
      '<button class="fe-t" id="fe-shape-btn" title="Shapes"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg></button>',
      '<button class="fe-t" data-t="draw" title="Draw"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M17 3l4 4L8 20l-5 1 1-5z"/></svg></button>',
      '<button class="fe-t" id="fe-img-btn" title="Image"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></button>',
      '<button class="fe-t" id="fe-color-btn" title="Color"><span id="fe-cur-color" style="width:18px;height:18px;border-radius:50%;background:#141413;display:block;border:2px solid #e5e7eb;"></span></button>',
      '<button class="fe-t" id="fe-undo-btn" title="Undo"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-15-6.7L3 13"/></svg></button>',
      '<button class="fe-t" id="fe-export-btn" title="Export" style="background:#2563eb;color:#fff;border-radius:10px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg></button>',
    ].join('');
    return bar;
  }

  function buildTopBar() {
    var bar = document.createElement('div');
    bar.id = 'fe-top';
    bar.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 10px;background:#fff;border-bottom:1px solid #e5e7eb;flex-shrink:0;';
    bar.innerHTML = [
      '<button class="fe-tb" id="fe-new-btn" title="New">＋</button>',
      '<button class="fe-tb" id="fe-open-btn" title="Open">📂</button>',
      '<span style="flex:1;"></span>',
      '<span id="fe-zoom" style="font-size:11px;font-weight:800;color:#64748b;min-width:36px;text-align:center;">100%</span>',
      '<button class="fe-tb" id="fe-fit-btn" title="Fit">⤢</button>',
      '<button class="fe-tb" id="fe-reset-btn" title="1:1">1:1</button>',
    ].join('');
    return bar;
  }

  function buildShapesFlyout() {
    var el = document.createElement('div');
    el.id = 'fe-shapes';
    el.style.cssText = 'display:none;position:absolute;bottom:60px;left:10px;right:10px;padding:10px;background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:50;flex-wrap:wrap;gap:6px;';
    el.innerHTML = [
      '<button class="fe-shape" data-s="rect" style="font-size:22px;">▭</button>',
      '<button class="fe-shape" data-s="circle" style="font-size:22px;">◯</button>',
      '<button class="fe-shape" data-s="triangle" style="font-size:22px;">△</button>',
      '<button class="fe-shape" data-s="line" style="font-size:22px;">─</button>',
      '<button class="fe-shape" data-s="arrow" style="font-size:22px;">→</button>',
      '<button id="fe-fill-toggle" style="padding:6px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:12px;font-weight:700;">Fill: Off</button>',
    ].join('');
    return el;
  }

  function buildColorFlyout() {
    var el = document.createElement('div');
    el.id = 'fe-colors';
    el.style.cssText = 'display:none;position:absolute;bottom:60px;left:10px;right:10px;padding:10px;background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.15);z-index:50;';
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:8px;';
    COLORS.forEach(function(c) {
      var b = document.createElement('button');
      b.style.cssText = 'width:100%;aspect-ratio:1;border-radius:50%;border:2px solid #e5e7eb;background:' + c + ';';
      b.onclick = function() {
        FreshEditor.setColor(c);
        document.getElementById('fe-cur-color').style.background = c;
        document.getElementById('fe-colors').style.display = 'none';
      };
      grid.appendChild(b);
    });
    el.appendChild(grid);
    var custom = document.createElement('div');
    custom.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;';
    custom.innerHTML = '<input type="color" value="#141413" style="width:36px;height:24px;border:1px solid #e5e7eb;border-radius:4px;cursor:pointer;"><span style="font-size:10px;font-weight:700;color:#64748b;">CUSTOM</span>';
    custom.querySelector('input').onchange = function() {
      FreshEditor.setColor(this.value);
      document.getElementById('fe-cur-color').style.background = this.value;
      document.getElementById('fe-colors').style.display = 'none';
    };
    el.appendChild(custom);
    return el;
  }

  function buildContextMenu() {
    var el = document.createElement('div');
    el.id = 'fe-context';
    el.style.cssText = 'display:none;position:absolute;bottom:60px;left:50%;transform:translateX(-50%);padding:6px 12px;background:#1e293b;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.3);z-index:50;gap:4px;align-items:center;';
    el.innerHTML = [
      '<button class="fe-ctx" id="fe-ctx-del" title="Delete" style="color:#f87171;">✕</button>',
      '<button class="fe-ctx" id="fe-ctx-dup" title="Duplicate" style="color:#93c5fd;">⧉</button>',
      '<button class="fe-ctx" id="fe-ctx-front" title="Front" style="color:#93c5fd;">↑</button>',
      '<button class="fe-ctx" id="fe-ctx-back" title="Back" style="color:#93c5fd;">↓</button>',
    ].join('');
    return el;
  }

  function buildBadge() {
    var el = document.createElement('div');
    el.id = 'fe-badge';
    el.style.cssText = 'display:none;position:absolute;top:52px;left:8px;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;letter-spacing:.03em;z-index:20;pointer-events:none;';
    return el;
  }

  // ---- Replace the Editor tab ----
  function replaceEditorTab() {
    var pane = document.getElementById('tab-editor');
    if (!pane) return;

    // Clear ALL old editor content
    pane.innerHTML = '';
    pane.style.display = 'flex';
    pane.style.flexDirection = 'column';
    pane.style.padding = '0';
    pane.style.overflow = 'hidden';
    pane.style.position = 'relative';

    // Build fresh layout
    pane.appendChild(buildTopBar());

    var canvasWrap = document.createElement('div');
    canvasWrap.id = 'fe-canvas';
    canvasWrap.style.cssText = 'flex:1;position:relative;overflow:hidden;touch-action:none;background:#c8ccd0;';
    pane.appendChild(canvasWrap);

    pane.appendChild(buildToolbar());
    pane.appendChild(buildShapesFlyout());
    pane.appendChild(buildColorFlyout());
    pane.appendChild(buildContextMenu());
    pane.appendChild(buildBadge());

    // Hidden file input for image insertion
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'fe-file-input';
    fileInput.onchange = function(e) {
      var f = e.target.files[0];
      if (!f) return;
      var rd = new FileReader();
      rd.onload = function(ev) {
        var img = new Image();
        img.onload = function() {
          FreshEditor.add('image', {
            x: 100, y: 100, w: Math.min(250, img.width), h: Math.min(250, img.width * (img.height / img.width),
            src: ev.target.result, img: img
          });
          FreshEditor.draw();
        };
        img.src = ev.target.result;
      };
      rd.readAsDataURL(f);
    };
    pane.appendChild(fileInput);

    // Initialize engine
    FreshEditor.init(canvasWrap);
    FreshEditor.draw();
  }

  // ---- Wire up toolbar events ----
  function wireEvents() {
    // Tool buttons
    document.querySelectorAll('.fe-t[data-t]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var t = btn.getAttribute('data-t');
        FreshEditor.setTool(t);
        // Update active state
        document.querySelectorAll('.fe-t').forEach(function(b) { b.classList.remove('fe-active'); });
        btn.classList.add('fe-active');
        // Close flyouts
        document.getElementById('fe-shapes').style.display = 'none';
        document.getElementById('fe-colors').style.display = 'none';
      });
    });

    // Shapes flyout
    document.getElementById('fe-shape-btn').addEventListener('click', function() {
      var sf = document.getElementById('fe-shapes');
      sf.style.display = sf.style.display === 'none' ? 'flex' : 'none';
      document.getElementById('fe-colors').style.display = 'none';
    });
    document.querySelectorAll('.fe-shape').forEach(function(btn) {
      btn.addEventListener('click', function() {
        window.__feShape = btn.getAttribute('data-s');
        window.__feShapeBtn = btn;
        document.querySelectorAll('.fe-shape').forEach(function(b) { b.style.background = ''; b.style.color = ''; });
        btn.style.background = '#2563eb'; btn.style.color = '#fff';
        FreshEditor.setTool('shape');
        document.querySelectorAll('.fe-t').forEach(function(b) { b.classList.remove('fe-active'); });
        document.getElementById('fe-shape-btn').classList.add('fe-active');
        document.getElementById('fe-shapes').style.display = 'none';
      });
    });
    document.getElementById('fe-fill-toggle').addEventListener('click', function() {
      window.__feFill = !window.__feFill;
      this.textContent = 'Fill: ' + (window.__feFill ? 'On' : 'Off');
      this.style.background = window.__feFill ? '#2563eb' : '';
      this.style.color = window.__feFill ? '#fff' : '';
    });

    // Colors flyout
    document.getElementById('fe-color-btn').addEventListener('click', function() {
      var cp = document.getElementById('fe-colors');
      cp.style.display = cp.style.display === 'none' ? 'block' : 'none';
      document.getElementById('fe-shapes').style.display = 'none';
    });

    // Image button
    document.getElementById('fe-img-btn').addEventListener('click', function() {
      document.getElementById('fe-file-input').click();
    });

    // Top bar
    document.getElementById('fe-fit-btn').addEventListener('click', FreshEditor.fit);
    document.getElementById('fe-reset-btn').addEventListener('click', FreshEditor.resetCam);
    document.getElementById('fe-new-btn').addEventListener('click', function() {
      FreshEditor.setTool('select');
      FreshEditor.draw();
    });

    // Export
    document.getElementById('fe-export-btn').addEventListener('click', async function() {
      try {
        var dataUrl = FreshEditor.exportImage();
        if (dataUrl && typeof window.Android !== 'undefined' && window.Android.saveToDownloads) {
          var b64 = dataUrl.split(',')[1];
          window.Android.saveToDownloads(b64, 'Edited_Document.jpg', 'image/jpeg');
        }
      } catch (e) {
        if (typeof showToast === 'function') showToast('Export failed: ' + e.message);
      }
    });

    // Context menu buttons
    document.getElementById('fe-ctx-del').addEventListener('click', function() {
      FreshEditor.del();
      document.getElementById('fe-context').style.display = 'none';
    });
    document.getElementById('fe-ctx-dup').addEventListener('click', function() {
      FreshEditor.dup();
    });
    document.getElementById('fe-ctx-front').addEventListener('click', function() {
      var s = FreshEditor.sel();
      if (s) { s.z = 999; FreshEditor.draw(); }
    });
    document.getElementById('fe-ctx-back').addEventListener('click', function() {
      var s = FreshEditor.sel();
      if (s) { s.z = 0; FreshEditor.draw(); }
    });

    // Show context menu when object is selected
    var origDraw = FreshEditor.draw;
    FreshEditor.draw = function() {
      origDraw();
      var s = FreshEditor.sel();
      var ctx = document.getElementById('fe-context');
      if (ctx) {
        ctx.style.display = s ? 'flex' : 'none';
      }
    };
  }

  // ---- CSS injection ----
  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = `
      .fe-t { width:42px; height:42px; border:none; border-radius:12px; background:transparent; color:#475569; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; }
      .fe-t:active { background:#e2e8f0; transform:scale(.92); }
      .fe-t.fe-active { background:#2563eb; color:#fff; }
      .fe-tb { width:32px; height:32px; border:none; border-radius:8px; background:#f1f5f9; color:#334155; font-size:14px; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      .fe-tb:active { background:#e2e8f0; }
      .fe-shape { width:44px; height:44px; border:1.5px solid #e5e7eb; border-radius:10px; background:#fff; color:#334155; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      .fe-ctx { width:36px; height:36px; border:none; border-radius:8px; background:transparent; font-size:16px; font-weight:700; display:flex; align-items:center; justify-content:center; cursor:pointer; }
      .fe-ctx:active { background:rgba(255,255,255,0.15); }
      .fe-badge { display:none; }
      .fe-pdf { background:#fee2e2; color:#991b1b; }
      .fe-jpg, .fe-jpeg { background:#fef3c7; color:#92400e; }
      .fe-png { background:#d1fae5; color:#065f46; }
      #tab-editor { padding:0 !important; overflow:hidden !important; }
    `;
    document.head.appendChild(style);
  }

  // ---- File open routing ----
  window.feOpenFile = function(base64, name) {
    FreshEditor.load(base64, name);
  };

  // ---- Initialize ----
  function init() {
    injectCSS();
    replaceEditorTab();
    wireEvents();
    // Select tool active by default
    document.querySelector('.fe-t[data-t="select"]').classList.add('fe-active');
  }

  // Run when Editor tab is shown
  var origSwitch = window.switchTab;
  if (origSwitch) {
    window.switchTab = function(tab) {
      var r = origSwitch.apply(this, arguments);
      if (tab === 'editor') {
        setTimeout(function() {
          if (!document.getElementById('fe-bar')) init();
          FreshEditor.draw();
        }, 200);
      }
      return r;
    };
  }

  // Also init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(init, 300); });
  } else {
    setTimeout(init, 300);
  }
})();
