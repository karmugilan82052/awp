/**
 * AIAssistantModal Component
 * Interactive natural language assistant modal answering questions on agricultural waste monetization.
 */

import { getAIAssistantResponse } from "../services/aiService.js";

export function renderAIAssistantModal() {
  return `
    <div id="ai-assistant-drawer" style="display:none; position:fixed; top:0; right:0; bottom:0; width:100%; max-width:440px; background:#ffffff; box-shadow:-10px 0 40px rgba(0,0,0,0.2); z-index:2000; flex-direction:column; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Drawer Header -->
      <div style="background:linear-gradient(135deg, #092c17, #15803d); color:white; padding:20px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="background:rgba(255,255,255,0.2); width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;">
            ✨
          </div>
          <div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; margin:0; line-height:1.2;">AgriWaste AI Assistant</h3>
            <span style="font-size:11px; color:#86efac;">Agricultural Bio-Economy Advisor</span>
          </div>
        </div>
        <button id="btn-close-ai-drawer" style="background:none; border:none; color:white; font-size:22px; cursor:pointer; opacity:0.8;">✕</button>
      </div>

      <!-- Quick Suggestion Pills -->
      <div style="padding:12px 16px; background:#f8fafc; border-bottom:1px solid #e2e8f0; display:flex; gap:8px; overflow-x:auto;">
        <button class="ai-quick-query" data-query="Where can I sell paddy straw?" style="white-space:nowrap; background:#ffffff; border:1px solid #cbd5e1; padding:5px 10px; border-radius:14px; font-size:11px; font-weight:600; cursor:pointer; color:#334155;">🌾 Sell Paddy Straw?</button>
        <button class="ai-quick-query" data-query="What can coconut husk be used for?" style="white-space:nowrap; background:#ffffff; border:1px solid #cbd5e1; padding:5px 10px; border-radius:14px; font-size:11px; font-weight:600; cursor:pointer; color:#334155;">🥥 Uses of Coconut Husk?</button>
        <button class="ai-quick-query" data-query="What is the price of sugarcane bagasse?" style="white-space:nowrap; background:#ffffff; border:1px solid #cbd5e1; padding:5px 10px; border-radius:14px; font-size:11px; font-weight:600; cursor:pointer; color:#334155;">🌿 Bagasse Market Price?</button>
      </div>

      <!-- Messages Stream -->
      <div id="ai-chat-messages" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; background:#f0f6f0;">
        
        <!-- Welcome Message -->
        <div style="background:#ffffff; border-radius:12px; padding:16px; border:1px solid #e2ece2; box-shadow:0 2px 6px rgba(0,0,0,0.04); font-size:13px; line-height:1.6; color:#1e293b;">
          👋 <strong>Namaste! I am your AgriWaste AI Smart Assistant.</strong><br><br>
          I can help you analyze market prices, discover conversion applications for crop residues, and connect with suitable industrial buyers for your farm waste.
        </div>

      </div>

      <!-- Input Box -->
      <div style="padding:16px; background:#ffffff; border-top:1px solid #e2ece2;">
        <form id="ai-query-form" style="display:flex; gap:8px;">
          <input type="text" id="ai-query-input" placeholder="Ask about crop waste, prices, buyers..." style="flex-grow:1; padding:10px 14px; border:1px solid #cbd5e1; border-radius:10px; font-size:13px; outline:none; font-family:'Plus Jakarta Sans', sans-serif;" />
          <button type="submit" style="background:#16a34a; color:white; border:none; width:44px; height:44px; border-radius:10px; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
            ➤
          </button>
        </form>
      </div>

    </div>
  `;
}
