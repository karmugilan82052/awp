/**
 * NotificationPanel Component
 */

import { store } from "../store/state.js";

export function renderNotificationPanel() {
  const notifications = store.getNotifications();

  return `
    <div id="notification-panel" style="display:none; position:fixed; top:74px; right:20px; width:100%; max-width:380px; max-height:500px; background:#ffffff; border:1px solid #e2ece2; border-radius:16px; box-shadow:0 15px 35px rgba(0,0,0,0.15); z-index:1500; display:flex; flex-direction:column; overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Header -->
      <div style="padding:16px; border-bottom:1px solid #f0f6f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
        <div>
          <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0;">Notifications</h4>
          <span style="font-size:11px; color:#64748b;">Live updates & alerts</span>
        </div>
        <button id="btn-mark-all-read" style="background:none; border:none; color:#16a34a; font-size:11px; font-weight:700; cursor:pointer;">
          Mark all read
        </button>
      </div>

      <!-- Notification List -->
      <div style="flex-grow:1; overflow-y:auto; padding:8px 0; max-height:400px;">
        ${
          notifications.length === 0
            ? `<p style="text-align:center; padding:30px; color:#94a3b8; font-size:13px;">No notifications</p>`
            : notifications
                .map(
                  n => `
            <div class="notif-item ${n.unread ? "unread" : ""}" data-id="${n.id}" style="padding:12px 16px; border-bottom:1px solid #f8fafc; background:${
                    n.unread ? "#f0fdf4" : "#ffffff"
                  }; cursor:pointer; transition:background 0.15s;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
                <strong style="font-size:13px; color:#0f172a;">${n.title}</strong>
                <span style="font-size:10px; color:#94a3b8;">${n.time}</span>
              </div>
              <p style="font-size:12px; color:#475569; line-height:1.4; margin:0;">${n.message}</p>
            </div>
          `
                )
                .join("")
        }
      </div>

    </div>
  `;
}
