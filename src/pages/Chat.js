/**
 * Full-Page Chat & Messaging Center Component
 */

import { store } from "../store/state.js";

export function renderChatPage(searchParams = {}) {
  const conversations = store.getConversations();
  const selectedConvId = searchParams.convId || (conversations[0] ? conversations[0].id : null);
  const activeConv = conversations.find(c => c.id === selectedConvId) || conversations[0];

  return `
    <div class="page-chat" style="padding:30px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1200px; margin:0 auto;">
        
        <div style="margin-bottom:20px;">
          <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
            💬 Buyer-Seller Messaging Center
          </h1>
          <p style="font-size:13px; color:#64748b; margin-top:4px;">
            Real-time direct communication with verified farmers and industrial buyers with listing context.
          </p>
        </div>

        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:20px; box-shadow:0 4px 20px rgba(15,61,33,0.06); height:650px; display:grid; grid-template-columns:340px 1fr; overflow:hidden;" class="chat-full-layout">
          
          <!-- Left: Conversations Inbox -->
          <div style="border-right:1px solid #e2ece2; display:flex; flex-direction:column; background:#ffffff;">
            <div style="padding:18px; border-bottom:1px solid #f0f6f0;">
              <input type="text" placeholder="Search conversations..." style="width:100%; padding:9px 14px; border:1px solid #cbd5e1; border-radius:10px; font-size:13px; outline:none; font-family:'Plus Jakarta Sans', sans-serif;" />
            </div>

            <div style="flex-grow:1; overflow-y:auto; padding:8px 0;">
              ${conversations
                .map(
                  conv => `
                <a href="#chat?convId=${conv.id}" class="conv-item ${conv.id === activeConv?.id ? "active" : ""}" style="display:flex; gap:12px; padding:14px 18px; border-bottom:1px solid #f8fafc; text-decoration:none; color:inherit; background:${
                    conv.id === activeConv?.id ? "#f0fdf4" : "transparent"
                  }; transition:background 0.15s;">
                  <div style="position:relative; flex-shrink:0;">
                    <div style="width:44px; height:44px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center;">
                      ${conv.otherUserAvatar || "U"}
                    </div>
                    <span style="position:absolute; bottom:0; right:0; width:10px; height:10px; border-radius:50%; background:#16a34a; border:2px solid white;"></span>
                  </div>

                  <div style="flex-grow:1; min-width:0;">
                    <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
                      <strong style="font-size:14px; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${conv.otherUserName}</strong>
                      <span style="font-size:10px; color:#94a3b8;">${conv.lastTimestamp}</span>
                    </div>
                    <p style="font-size:12px; color:#64748b; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                      ${conv.lastMessage}
                    </p>
                    ${
                      conv.listingTitle
                        ? `<span style="font-size:10px; color:#16a34a; font-weight:700; display:block; margin-top:2px;">🌾 ${conv.listingTitle}</span>`
                        : ""
                    }
                  </div>
                </a>
              `
                )
                .join("")}
            </div>
          </div>

          <!-- Right: Active Chat Stream -->
          <div style="display:flex; flex-direction:column; background:#f8fafc;">
            ${
              activeConv
                ? `
              <!-- Active Chat Header -->
              <div style="background:#ffffff; border-bottom:1px solid #e2ece2; padding:16px 24px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <div style="width:40px; height:40px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:15px; display:flex; align-items:center; justify-content:center;">
                    ${activeConv.otherUserAvatar || "U"}
                  </div>
                  <div>
                    <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0;">
                      ${activeConv.otherUserName}
                    </h3>
                    <span style="font-size:12px; color:#64748b;">${activeConv.otherUserRole} • Online</span>
                  </div>
                </div>

                ${
                  activeConv.listingTitle
                    ? `
                  <a href="#waste/${activeConv.listingId}" style="background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; padding:6px 12px; border-radius:8px; font-size:12px; font-weight:700; text-decoration:none;">
                    🌾 View Related Listing
                  </a>
                `
                    : ""
                }
              </div>

              <!-- Message Bubbles -->
              <div id="main-chat-messages" style="flex-grow:1; padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:14px;">
                ${(activeConv.messages || [])
                  .map(
                    msg => `
                  <div style="display:flex; flex-direction:column; align-items:${msg.isSender ? "flex-end" : "flex-start"};">
                    <div style="max-width:75%; padding:12px 16px; border-radius:${
                      msg.isSender ? "16px 16px 2px 16px" : "16px 16px 16px 2px"
                    }; background:${msg.isSender ? "#16a34a" : "#ffffff"}; color:${
                      msg.isSender ? "#ffffff" : "#1e293b"
                    }; font-size:13px; line-height:1.5; box-shadow:0 1px 3px rgba(0,0,0,0.06); border:${
                      msg.isSender ? "none" : "1px solid #e2e8f0"
                    };">
                      ${msg.text}
                    </div>
                    <span style="font-size:10px; color:#94a3b8; margin-top:4px; padding:0 4px;">${msg.timestamp}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>

              <!-- Quick Replies -->
              <div style="padding:8px 24px; background:#ffffff; border-top:1px solid #f1f5f9; display:flex; gap:8px; overflow-x:auto;">
                <button class="chat-quick-reply" data-text="Is loading assistance provided on-site?" style="white-space:nowrap; background:#f1f5f9; border:none; padding:5px 10px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Loading assistance?</button>
                <button class="chat-quick-reply" data-text="Can you share a lab moisture certificate?" style="white-space:nowrap; background:#f1f5f9; border:none; padding:5px 10px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Lab test certificate?</button>
                <button class="chat-quick-reply" data-text="We are sending a 16-tonner truck tomorrow morning." style="white-space:nowrap; background:#f1f5f9; border:none; padding:5px 10px; border-radius:6px; font-size:11px; color:#475569; cursor:pointer;">Sending truck tomorrow</button>
              </div>

              <!-- Chat Input Box -->
              <div style="padding:18px 24px; background:#ffffff; border-top:1px solid #e2ece2;">
                <form id="main-chat-form" data-conv-id="${activeConv.id}" style="display:flex; gap:10px; align-items:center;">
                  <input type="text" id="main-chat-input" placeholder="Type your message..." style="flex-grow:1; padding:12px 16px; border:1px solid #cbd5e1; border-radius:10px; font-size:14px; outline:none; font-family:'Plus Jakarta Sans', sans-serif;" />
                  <button type="submit" style="background:#16a34a; color:white; border:none; padding:12px 24px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">
                    Send
                  </button>
                </form>
              </div>
            `
                : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#94a3b8;">Select a conversation to start chatting.</div>`
            }
          </div>

        </div>

      </div>
    </div>
  `;
}
