/**
 * ChatWindow Component for Buyer-Seller 1-on-1 Messaging
 */

export function renderChatModal(conversation) {
  if (!conversation) return "";

  return `
    <div id="chat-modal-overlay" style="position:fixed; inset:0; background:rgba(15, 23, 42, 0.6); backdrop-filter:blur(4px); z-index:2500; display:flex; align-items:center; justify-content:center; padding:20px;">
      
      <div style="background:#ffffff; border-radius:18px; width:100%; max-width:540px; height:600px; display:flex; flex-direction:column; box-shadow:0 25px 50px rgba(0,0,0,0.25); overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header -->
        <div style="background:#ffffff; border-bottom:1px solid #e2ece2; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="position:relative;">
              <div style="width:40px; height:40px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:14px; display:flex; align-items:center; justify-content:center;">
                ${conversation.otherUserAvatar || "U"}
              </div>
              <span style="position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; background:#16a34a; border:2px solid white;"></span>
            </div>
            <div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                ${conversation.otherUserName}
              </h4>
              <span style="font-size:11px; color:#64748b;">${conversation.otherUserRole} • Online</span>
            </div>
          </div>
          <button id="btn-close-chat-modal" style="background:none; border:none; color:#64748b; font-size:22px; cursor:pointer;">✕</button>
        </div>

        <!-- Waste Listing Context Badge -->
        ${
          conversation.listingTitle
            ? `
          <div style="background:#f0fdf4; border-bottom:1px solid #bbf7d0; padding:8px 20px; display:flex; align-items:center; justify-content:space-between; font-size:12px;">
            <span style="color:#14532d;">Regarding: <strong>${conversation.listingTitle}</strong></span>
            <a href="#waste/${conversation.listingId}" style="color:#16a34a; font-weight:700; text-decoration:none;">View Listing →</a>
          </div>
        `
            : ""
        }

        <!-- Messages Stream -->
        <div id="modal-chat-messages" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; background:#f8fafc;">
          ${(conversation.messages || [])
            .map(
              msg => `
            <div style="display:flex; flex-direction:column; align-items:${msg.isSender ? "flex-end" : "flex-start"};">
              <div style="max-width:80%; padding:10px 14px; border-radius:${
                msg.isSender ? "14px 14px 2px 14px" : "14px 14px 14px 2px"
              }; background:${msg.isSender ? "#16a34a" : "#ffffff"}; color:${
                msg.isSender ? "#ffffff" : "#1e293b"
              }; font-size:13px; line-height:1.5; box-shadow:0 1px 3px rgba(0,0,0,0.05); border:${
                msg.isSender ? "none" : "1px solid #e2e8f0"
              };">
                ${msg.text}
              </div>
              <span style="font-size:10px; color:#94a3b8; margin-top:3px; padding:0 4px;">${msg.timestamp}</span>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Quick Reply Suggestions -->
        <div style="padding:8px 16px; background:#ffffff; border-top:1px solid #f1f5f9; display:flex; gap:6px; overflow-x:auto;">
          <button class="chat-quick-reply" data-text="Is loading assistance provided at the farm?" style="white-space:nowrap; background:#f1f5f9; border:none; padding:4px 8px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Loading provided?</button>
          <button class="chat-quick-reply" data-text="Can you share a lab moisture test report?" style="white-space:nowrap; background:#f1f5f9; border:none; padding:4px 8px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Lab test report?</button>
          <button class="chat-quick-reply" data-text="We are ready to schedule immediate truck pickup." style="white-space:nowrap; background:#f1f5f9; border:none; padding:4px 8px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Ready for pickup</button>
        </div>

        <!-- Input Box -->
        <div style="padding:14px 20px; background:#ffffff; border-top:1px solid #e2ece2;">
          <form id="chat-modal-form" style="display:flex; gap:10px; align-items:center;">
            <input type="text" id="chat-modal-input" placeholder="Type message to seller/buyer..." style="flex-grow:1; padding:10px 14px; border:1px solid #cbd5e1; border-radius:10px; font-size:13px; outline:none; font-family:'Plus Jakarta Sans', sans-serif;" />
            <button type="submit" style="background:#16a34a; color:white; border:none; padding:10px 18px; border-radius:10px; font-size:13px; font-weight:700; cursor:pointer;">
              Send
            </button>
          </form>
        </div>

      </div>

    </div>
  `;
}
