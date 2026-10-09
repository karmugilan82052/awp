/**
 * RatingModal Component for 5-Star Multi-Criteria Review Submission
 */

export function renderRatingModal(order) {
  if (!order) return "";

  return `
    <div id="rating-modal-overlay" style="position:fixed; inset:0; background:rgba(15, 23, 42, 0.6); backdrop-filter:blur(4px); z-index:2500; display:flex; align-items:center; justify-content:center; padding:20px;">
      
      <div style="background:#ffffff; border-radius:18px; width:100%; max-width:480px; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.25); font-family:'Plus Jakarta Sans', sans-serif;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #f0f6f0; padding-bottom:12px;">
          <div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
              Rate & Review Seller
            </h3>
            <span style="font-size:12px; color:#64748b;">Order: ${order.id} • ${order.listingTitle}</span>
          </div>
          <button id="btn-close-rating-modal" style="background:none; border:none; font-size:22px; color:#64748b; cursor:pointer;">✕</button>
        </div>

        <form id="rating-form" data-order-id="${order.id}" data-seller-id="${order.seller.id}" data-seller-name="${order.seller.name}">
          
          <!-- Overall Rating -->
          <div style="text-align:center; margin-bottom:20px; background:#f8fafc; padding:16px; border-radius:12px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#0f172a; margin-bottom:8px;">Overall Experience Rating</label>
            <div id="star-rating-selector" style="font-size:32px; color:#eab308; cursor:pointer; letter-spacing:4px;">
              <span class="star-btn" data-val="1">★</span>
              <span class="star-btn" data-val="2">★</span>
              <span class="star-btn" data-val="3">★</span>
              <span class="star-btn" data-val="4">★</span>
              <span class="star-btn" data-val="5">★</span>
            </div>
            <input type="hidden" id="input-overall-rating" value="5" />
          </div>

          <!-- Multi-Criteria Ratings -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; font-size:12px;">
            <div>
              <label style="font-weight:600; color:#475569; display:block; margin-bottom:4px;">Biomass Quality</label>
              <select id="input-quality-rating" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;">
                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
                <option value="3">⭐⭐⭐ Average (3/5)</option>
              </select>
            </div>
            <div>
              <label style="font-weight:600; color:#475569; display:block; margin-bottom:4px;">Communication</label>
              <select id="input-comm-rating" style="width:100%; padding:6px 10px; border:1px solid #cbd5e1; border-radius:6px;">
                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
                <option value="3">⭐⭐⭐ Average (3/5)</option>
              </select>
            </div>
          </div>

          <!-- Written Review -->
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Detailed Feedback</label>
            <textarea id="input-review-text" rows="3" placeholder="Describe the waste condition, moisture level, loading assistance, and overall satisfaction..." style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif; outline:none;"></textarea>
          </div>

          <button type="submit" style="width:100%; background:#16a34a; color:white; border:none; padding:12px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">
            Submit Review & Rating
          </button>
        </form>

      </div>

    </div>
  `;
}
