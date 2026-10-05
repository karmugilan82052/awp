/**
 * Toast Notification Dispatcher
 */

export function showToast(message, type = "success", duration = 3500) {
  const root = document.getElementById("toast-root") || document.body;

  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    root.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;

  const colors = {
    success: { bg: "#16a34a", icon: "✓", border: "#15803d" },
    error: { bg: "#dc2626", icon: "✕", border: "#b91c1c" },
    info: { bg: "#0284c7", icon: "ℹ", border: "#0369a1" },
    warning: { bg: "#d97706", icon: "⚠", border: "#b45309" }
  };

  const c = colors[type] || colors.success;

  toast.style.cssText = `
    background: #ffffff;
    color: #1e293b;
    border-left: 4px solid ${c.bg};
    border-radius: 8px;
    padding: 12px 18px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    transform: translateX(120%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    max-width: 380px;
  `;

  toast.innerHTML = `
    <span style="background:${c.bg}; color:white; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:bold; flex-shrink:0;">${c.icon}</span>
    <span style="flex-grow:1; line-height:1.4;">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(0)";
  });

  setTimeout(() => {
    toast.style.transform = "translateX(120%)";
    toast.style.opacity = "0";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}
