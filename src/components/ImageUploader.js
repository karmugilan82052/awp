/**
 * ImageUploader Component with AI Classification Trigger
 */

export function renderImageUploader() {
  return `
    <div class="image-uploader-wrapper" style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:14px; padding:24px; text-align:center; position:relative;">
      
      <div id="upload-idle-state">
        <div style="font-size:36px; margin-bottom:8px;">📸</div>
        <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin-bottom:4px;">
          Upload Agricultural Waste Images
        </h4>
        <p style="font-size:12px; color:#64748b; margin-bottom:16px;">
          Drag & drop photos or select from device (JPG, PNG, WebP up to 10MB)
        </p>

        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <label style="background:#ffffff; color:#0f172a; border:1px solid #cbd5e1; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:inline-block;">
            Choose Files
            <input type="file" id="waste-image-file-input" multiple accept="image/*" style="display:none;" />
          </label>

          <button type="button" id="btn-trigger-ai-classifier" style="background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 2px 10px rgba(16,185,129,0.3);">
            <span>✨</span> Auto-Classify Waste with AI
          </button>
        </div>
      </div>

      <!-- Image Previews Container -->
      <div id="image-preview-grid" style="display:none; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:12px; margin-top:16px;"></div>

      <!-- AI Classification Result Banner -->
      <div id="ai-classification-result" style="display:none; margin-top:18px; text-align:left; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:14px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <span style="font-size:12px; font-weight:800; color:#16a34a; text-transform:uppercase;">✨ AI Classification Match: <strong id="ai-detected-name">Paddy Straw</strong></span>
          <span id="ai-confidence-badge" style="background:#16a34a; color:white; font-size:10px; font-weight:800; padding:2px 8px; border-radius:12px;">97.4% Confidence</span>
        </div>
        <p style="font-size:12px; color:#14532d; margin-bottom:4px;" id="ai-price-suggestion">Suggested Market Price: <strong>₹4,200 - ₹4,800 / Ton</strong></p>
        <p style="font-size:11px; color:#4b6354;" id="ai-apps-suggestion">Best High-Value Uses: Biomass Pellets, Mushroom Cultivation, Cattle Silage</p>
      </div>

    </div>
  `;
}
