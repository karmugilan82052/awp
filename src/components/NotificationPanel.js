/**
 * NotificationPanel Component
 * Interactive Slide-down Panel for Alerts & Activity
 */

import { store } from "../store/state.js";

export function renderNotificationPanel() {
  const notifications = store.getNotifications();
  const unreadCount = notifications.filter(n => n.unread).length;

  return `
    <div id="notification-panel" style="display:none; position:fixed; top:78px; right:24px; width:100%; max-width:400px; max-height:520px; background:#ffffff; border:1.5px solid #dcfce7; border-radius:18px; box-shadow:0 20px 50px rgba(15,61,33,0.18), 0 0 0 1px rgba(0,0,0,0.05); z-index:2000; flex-direction:column; overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Header -->
      <div style="padding:16px 20px; border-bottom:1.5px solid #f0f6f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:18px;">🔔</span>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h4 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:800; color:#0f172a; margin:0;">Notifications</h4>
              ${
                unreadCount > 0
                  ? `<span style="background:#dc2626; color:white; font-size:11px; font-weight:800; padding:1px 7px; border-radius:10px;">${unreadCount} New</span>`
                  : ""
              }
            </div>
            <span style="font-size:12px; color:#64748b;">Live platform updates & alerts</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button id="btn-mark-all-read" style="background:none; border:none; color:#16a34a; font-size:12px; font-weight:700; cursor:pointer; padding:4px 6px;">
            Mark all read
          </button>
          <button id="btn-close-notif-panel" style="background:#f1f5f9; border:none; color:#64748b; font-size:14px; font-weight:800; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Close">
            ✕
          </button>
        </div>
      </div>

      <!-- Notification List -->
      <div style="flex-grow:1; overflow-y:auto; padding:6px 0; max-height:420px;">
        ${
          notifications.length === 0
            ? `<div style="text-align:center; padding:40px 20px; color:#94a3b8;">
                <span style="font-size:32px; display:block; margin-bottom:8px;">📭</span>
                <p style="font-size:14px; font-weight:600; margin:0;">No new notifications</p>
                <span style="font-size:12px;">You're all caught up!</span>
              </div>`
            : notifications
                .map(
                  n => `
            <div class="notif-item ${n.unread ? "unread" : ""}" data-id="${n.id}" data-link="${n.link || "#"}" style="padding:14px 18px; border-bottom:1px solid #f1f5f9; background:${
                    n.unread ? "#f0fdf4" : "#ffffff"
                  }; cursor:pointer; transition:background 0.15s ease; position:relative;">
              ${
                n.unread
                  ? `<span style="position:absolute; left:6px; top:18px; width:6px; height:6px; border-radius:50%; background:#16a34a;"></span>`
                  : ""
              }
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px; padding-left:${n.unread ? "8px" : "0"};">
                <strong style="font-size:14px; color:#0f172a; font-weight:700;">${n.title}</strong>
                <span style="font-size:11px; color:#94a3b8; white-space:nowrap; margin-left:8px;">${n.time}</span>
              </div>
              <p style="font-size:13px; color:#475569; line-height:1.45; margin:0; padding-left:${n.unread ? "8px" : "0"};">${n.message}</p>
            </div>
          `
                )
                .join("")
        }
      </div>

    </div>
  `;
}
