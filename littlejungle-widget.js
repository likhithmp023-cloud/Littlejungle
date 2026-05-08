/**
 * Little Jungle AI Chat Widget — Embeddable Script
 * 
 * HOW TO USE:
 * 1. Host LittlejungleAI.html somewhere (GitHub Pages, Netlify, Vercel, etc.)
 * 2. Update WIDGET_URL below to point to your hosted URL
 * 3. Add this script to your Shopdeck store's custom code section:
 *    <script src="https://YOUR-HOST.com/littlejungle-widget.js"></script>
 * 
 * OR paste the minified embed snippet (see bottom of this file).
 */

(function () {
  // ═══════════════════════════════════════════════
  // CONFIG — Change this to your hosted AI page URL
  // ═══════════════════════════════════════════════
  const WIDGET_URL = "https://YOUR-HOSTED-URL.com/LittlejungleAI.html";

  // Prevent double-init
  if (window.__ljWidgetLoaded) return;
  window.__ljWidgetLoaded = true;

  // ═══════════════════════════════════════════════
  // CREATE STYLES
  // ═══════════════════════════════════════════════
  const style = document.createElement("style");
  style.textContent = `
    #lj-widget-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2b872f, #1b5e20);
      border: none;
      cursor: pointer;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(43,135,47,0.4), 0 0 0 0 rgba(43,135,47,0.3);
      transition: transform 0.2s, box-shadow 0.2s;
      animation: lj-pulse 3s infinite;
    }
    #lj-widget-fab:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(43,135,47,0.5);
    }
    #lj-widget-fab:active { transform: scale(0.95); }
    #lj-widget-fab svg { width: 28px; height: 28px; fill: white; }
    #lj-widget-fab .lj-close-icon { display: none; }
    #lj-widget-fab.open .lj-chat-icon { display: none; }
    #lj-widget-fab.open .lj-close-icon { display: block; }

    @keyframes lj-pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(43,135,47,0.4), 0 0 0 0 rgba(43,135,47,0.3); }
      50% { box-shadow: 0 4px 20px rgba(43,135,47,0.4), 0 0 0 12px rgba(43,135,47,0); }
    }

    #lj-widget-label {
      position: fixed;
      bottom: 90px;
      right: 24px;
      background: white;
      color: #1b5e20;
      padding: 8px 16px;
      border-radius: 12px 12px 4px 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      z-index: 99998;
      animation: lj-labelIn 0.4s ease;
      white-space: nowrap;
    }
    @keyframes lj-labelIn {
      from { opacity: 0; transform: translateY(8px) scale(0.95); }
      to { opacity: 1; transform: none; }
    }

    #lj-widget-frame-wrap {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      max-width: calc(100vw - 32px);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      z-index: 99999;
      display: none;
      animation: lj-frameIn 0.3s ease;
      border: 1px solid #e5e7eb;
    }
    #lj-widget-frame-wrap.open { display: block; }
    @keyframes lj-frameIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: none; }
    }
    #lj-widget-frame {
      width: 100%;
      height: 100%;
      border: none;
      background: white;
    }

    @media (max-width: 480px) {
      #lj-widget-frame-wrap {
        bottom: 0; right: 0; left: 0;
        width: 100%; height: 100%;
        max-height: 100vh; max-width: 100vw;
        border-radius: 0;
      }
      #lj-widget-fab { bottom: 16px; right: 16px; }
      #lj-widget-label { bottom: 82px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  // ═══════════════════════════════════════════════
  // CREATE FAB (Floating Action Button)
  // ═══════════════════════════════════════════════
  const fab = document.createElement("button");
  fab.id = "lj-widget-fab";
  fab.setAttribute("aria-label", "Chat with Little Jungle AI");
  fab.innerHTML = `
    <svg class="lj-chat-icon" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg class="lj-close-icon" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>
  `;
  document.body.appendChild(fab);

  // ═══════════════════════════════════════════════
  // CREATE TOOLTIP LABEL
  // ═══════════════════════════════════════════════
  const label = document.createElement("div");
  label.id = "lj-widget-label";
  label.textContent = "🌿 Need plant help?";
  document.body.appendChild(label);

  // Auto-hide label after 6s
  setTimeout(() => { if (label) label.style.display = "none"; }, 6000);

  // ═══════════════════════════════════════════════
  // CREATE IFRAME WRAPPER
  // ═══════════════════════════════════════════════
  const wrap = document.createElement("div");
  wrap.id = "lj-widget-frame-wrap";
  wrap.innerHTML = `<iframe id="lj-widget-frame" src="" loading="lazy" allow="camera;microphone"></iframe>`;
  document.body.appendChild(wrap);

  // ═══════════════════════════════════════════════
  // TOGGLE LOGIC
  // ═══════════════════════════════════════════════
  let isOpen = false;
  fab.addEventListener("click", () => {
    isOpen = !isOpen;
    fab.classList.toggle("open", isOpen);
    wrap.classList.toggle("open", isOpen);

    // Lazy-load iframe on first open
    const iframe = document.getElementById("lj-widget-frame");
    if (isOpen && iframe && !iframe.src) {
      iframe.src = WIDGET_URL;
    }

    // Hide label on first click
    if (label) label.style.display = "none";
  });
})();
