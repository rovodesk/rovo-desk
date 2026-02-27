export function injectGlobalStyles() {
	if (document.getElementById("zh-widget-global")) return;

	const style = document.createElement("style");
	style.id = "zh-widget-global";

	style.innerHTML = `
	    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .zh-widget-wrapper,
    .zh-widget-panel,
    .zh-widget-panel * {
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif !important;
      box-sizing: border-box;
    }

    .zh-widget-panel {
      width: 380px;
      height: min(640px, 80vh);
      background: #0f172a;
      border-radius: 22px;
      box-shadow:
        0 40px 100px rgba(0,0,0,0.45),
        0 10px 30px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: zh-widget-enter 0.25s ease;
    }

    @keyframes zh-widget-enter {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Smooth close animation */
    @keyframes zh-widget-exit {
      from {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
      to {
        opacity: 0;
        transform: translateY(16px) scale(0.96);
      }
    }

    /* ========================= */
    /* 📱 Responsive Mobile Mode */
    /* ========================= */
    @media (max-width: 640px) {
      .zh-widget-wrapper {
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw;
        height: 100vh;
      }

      .zh-widget-panel {
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0 !important;
      }
    }

    /* Tablet refinement */
    @media (max-width: 900px) {
      .zh-widget-wrapper {
        right: 20px;
        bottom: 20px;
      }

      .zh-widget-panel {
        width: min(92vw, 380px);
        height: min(85vh, 640px);
      }
    }
  `;

	document.head.appendChild(style);
}
