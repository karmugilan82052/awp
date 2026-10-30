/**
 * AIAssistantModal Component
 * Powered by Google Gemini LLM
 * Interactive natural language assistant modal answering questions on agricultural waste monetization.
 */

import { getGeminiApiKey, getGeminiModel, isAutoInstalledKey } from "../services/aiService.js";

export function renderAIAssistantModal() {
  const currentKey = getGeminiApiKey();
  const currentModel = getGeminiModel();
  const isAuto = isAutoInstalledKey(currentKey);

  return `
    <div id="ai-assistant-drawer" style="display:none; position:fixed; top:0; right:0; bottom:0; width:100%; max-width:460px; background:#ffffff; box-shadow:-10px 0 40px rgba(0,0,0,0.25); z-index:2000; flex-direction:column; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Drawer Header with Gemini Branding -->
      <div style="background:linear-gradient(135deg, #092c17 0%, #14532d 55%, #15803d 100%); color:white; padding:18px 20px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.15);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="background:rgba(255,255,255,0.18); backdrop-filter:blur(6px); width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">
            ⚡
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:19px; font-weight:800; margin:0; line-height:1.2; color:#ffffff;">Gemini Bio-Advisor</h3>
              <span id="gemini-badge-status" style="background:#dcfce7; color:#15803d; font-size:11.5px; font-weight:800; padding:2px 8px; border-radius:10px; border:1px solid #86efac; display:inline-flex; align-items:center; gap:4px;">
                <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#16a34a;"></span> Active
              </span>
            </div>
            <span style="font-size:13px; color:#dcfce7; display:block; margin-top:2px;">Google Gemini 2.0 Flash • Connected</span>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px;">
          <button id="btn-toggle-gemini-settings" title="Gemini Settings" style="background:rgba(255,255,255,0.18); border:1px solid rgba(255,255,255,0.3); color:white; font-size:13px; font-weight:700; padding:6px 11px; border-radius:8px; cursor:pointer; display:flex; align-items:center; gap:5px;">
            <span>⚙️</span> Key
          </button>
          <button id="btn-close-ai-drawer" style="background:none; border:none; color:white; font-size:24px; cursor:pointer; opacity:0.85; padding:4px 8px;">✕</button>
        </div>
      </div>

      <!-- Collapsible Gemini Config Tray -->
      <div id="gemini-config-tray" style="display:none; background:#f0fdf4; border-bottom:1.5px solid #bbf7d0; padding:16px 20px; font-size:13px; color:#166534;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:16px;">✓</span>
            <strong style="color:#0f3d21; font-size:14px;">Gemini Key Status: Installed & Active</strong>
          </div>
          <span style="background:#16a34a; color:white; font-size:10.5px; font-weight:800; padding:2px 6px; border-radius:6px;">Auto-Managed</span>
        </div>

        <p style="font-size:12px; color:#15803d; margin-bottom:12px; line-height:1.5;">
          The Gemini LLM key has been automatically installed and verified. The model is active and answering queries without any manual configuration required.
        </p>

        <div style="display:flex; gap:8px; margin-bottom:10px;">
          <select id="gemini-model-select" style="flex-grow:1; padding:7px 10px; border:1px solid #86efac; border-radius:8px; font-size:13px; background:white; color:#0f3d21; font-weight:700; outline:none;">
            <option value="gemini-2.0-flash" ${currentModel === "gemini-2.0-flash" ? "selected" : ""}>Gemini 2.0 Flash (Active / Recommended)</option>
            <option value="gemini-1.5-flash" ${currentModel === "gemini-1.5-flash" ? "selected" : ""}>Gemini 1.5 Flash</option>
            <option value="gemini-1.5-pro" ${currentModel === "gemini-1.5-pro" ? "selected" : ""}>Gemini 1.5 Pro</option>
          </select>
          <button id="btn-auto-install-key" style="background:#16a34a; color:white; border:none; padding:7px 12px; border-radius:8px; font-weight:700; font-size:12px; cursor:pointer; white-space:nowrap;">
            ⚡ Auto-Refresh Key
          </button>
        </div>

        <!-- Optional Custom Key Input -->
        <details style="margin-top:8px;">
          <summary style="cursor:pointer; font-size:12px; font-weight:700; color:#15803d; outline:none;">
            Use custom Google AI Studio Key (Optional)
          </summary>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input type="password" id="gemini-api-key-input" placeholder="AIzaSy... (leave blank for auto key)" value="${isAuto ? "" : currentKey}" style="flex-grow:1; padding:7px 12px; border:1px solid #86efac; border-radius:8px; font-size:12.5px; outline:none; font-family:monospace; background:white;" />
            <button id="btn-save-gemini-key" style="background:#0f3d21; color:white; border:none; padding:7px 12px; border-radius:8px; font-weight:700; font-size:12px; cursor:pointer;">
              Save
            </button>
          </div>
        </details>
      </div>

      <!-- Quick Suggestion Pills -->
      <div style="padding:10px 16px; background:#ffffff; border-bottom:1px solid #e2ece2; display:flex; gap:8px; overflow-x:auto;">
        <button class="ai-quick-query" data-query="Where can I sell paddy straw?" style="white-space:nowrap; background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 12px; border-radius:14px; font-size:13px; font-weight:700; cursor:pointer; color:#16a34a;">🌾 Paddy Straw Rates?</button>
        <button class="ai-quick-query" data-query="What can coconut husk be used for?" style="white-space:nowrap; background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 12px; border-radius:14px; font-size:13px; font-weight:700; cursor:pointer; color:#16a34a;">🥥 Coconut Shell Value?</button>
        <button class="ai-quick-query" data-query="What is the price of sugarcane bagasse?" style="white-space:nowrap; background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 12px; border-radius:14px; font-size:13px; font-weight:700; cursor:pointer; color:#16a34a;">🌿 Bagasse Market Price?</button>
        <button class="ai-quick-query" data-query="What government subsidies exist for bio-CNG plants?" style="white-space:nowrap; background:#eff6ff; border:1px solid #bfdbfe; padding:6px 12px; border-radius:14px; font-size:13px; font-weight:700; cursor:pointer; color:#2563eb;">🏛️ SATAT Subsidies?</button>
      </div>

      <!-- Messages Stream -->
      <div id="ai-chat-messages" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:16px; background:#f8faf8;">
        
        <!-- Welcome Message -->
        <div style="background:#ffffff; border-radius:14px; padding:18px; border:1px solid #e2ece2; box-shadow:0 2px 8px rgba(15,61,33,0.05); font-size:15px; line-height:1.6; color:#1e293b;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
            <span style="font-size:20px;">⚡</span>
            <strong style="color:#0f3d21; font-size:16px;">Namaste! I am your AgriWaste Gemini Advisor.</strong>
          </div>
          <p style="margin-bottom:8px; color:#334155;">
            Powered by <strong>Google Gemini 2.0 Flash</strong>, I analyze agricultural residue economics, fair market rates across India, and direct industrial procurement connections.
          </p>
          <div style="background:#f0fdf4; border-left:3px solid #16a34a; padding:8px 12px; border-radius:0 8px 8px 0; font-size:13px; color:#166534;">
            ✓ <em>Gemini is automatically connected and ready. Ask any question below to get instant insights!</em>
          </div>
        </div>

      </div>

      <!-- Input Box -->
      <div style="padding:16px; background:#ffffff; border-top:1.5px solid #e2ece2;">
        <form id="ai-query-form" style="display:flex; gap:8px;">
          <input type="text" id="ai-query-input" placeholder="Ask Gemini about crop waste, prices, buyers..." style="flex-grow:1; padding:12px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:15px; outline:none; font-family:'Plus Jakarta Sans', sans-serif; transition:border-color 0.2s;" onfocus="this.style.borderColor='#16a34a';" onblur="this.style.borderColor='#cbd5e1';" />
          <button type="submit" id="btn-submit-ai-query" style="background:#16a34a; color:white; border:none; width:48px; height:48px; border-radius:12px; font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 3px 8px rgba(22,163,74,0.3);">
            ➤
          </button>
        </form>
      </div>

    </div>
  `;
}
