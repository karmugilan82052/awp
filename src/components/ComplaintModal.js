/**
 * ComplaintModal Component for Dispute Resolution Tickets
 */

export function renderComplaintModal(order) {
  if (!order) return "";

  return `
    <div id="complaint-modal-overlay" style="position:fixed; inset:0; background:rgba(15, 23, 42, 0.6); backdrop-filter:blur(4px); z-index:2500; display:flex; align-items:center; justify-content:center; padding:20px;">
      
      <div style="background:#ffffff; border-radius:18px; width:100%; max-width:480px; padding:24px; box-shadow:0 25px 50px rgba(0,0,0,0.25); font-family:'Plus Jakarta Sans', sans-serif;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #f0f6f0; padding-bottom:12px;">
          <div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#dc2626; margin:0; display:flex; align-items:center; gap:8px;">
              <span>🛡️</span> Raise Dispute Ticket
            </h3>
            <span style="font-size:12px; color:#64748b;">Order: ${order.id} • ${order.listingTitle}</span>
          </div>
          <button id="btn-close-complaint-modal" style="background:none; border:none; font-size:22px; color:#64748b; cursor:pointer;">✕</button>
        </div>

        <form id="complaint-form" data-order-id="${order.id}">
          
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Dispute Reason / Category</label>
            <select id="input-complaint-type" style="width:100%; padding:9px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif;">
              <option value="Quality Mismatch / High Moisture">Quality Mismatch / High Moisture</option>
              <option value="Weight / Quantity Shortage">Weight / Quantity Shortage</option>
              <option value="Delayed Pickup / Transport Failure">Delayed Pickup / Transport Failure</option>
              <option value="Contamination / Non-biodegradable debris">Contamination / Non-biodegradable debris</option>
              <option value="Pricing / Weighbridge Dispute">Pricing / Weighbridge Dispute</option>
              <option value="Other Issue">Other Issue</option>
            </select>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Detailed Description & Evidence</label>
            <textarea id="input-complaint-desc" rows="4" required placeholder="State the specific issue, lab test findings, or transport delay details..." style="width:100%; padding:10px 12px; border:1px solid #cbd5e1; border-radius:8px; font-size:13px; font-family:'Plus Jakarta Sans', sans-serif; outline:none;"></textarea>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Supporting Document / Photo (Optional)</label>
            <input type="file" id="input-complaint-file" style="font-size:12px;" />
          </div>

          <div style="background:#fef2f2; border:1px solid #fecaca; padding:12px; border-radius:8px; margin-bottom:20px; font-size:11px; color:#991b1b; line-height:1.4;">
            ℹ️ Escrow funds for Order #${order.id} will be placed on hold until both parties and the platform arbitrator reach a resolution.
          </div>

          <button type="submit" style="width:100%; background:#dc2626; color:white; border:none; padding:12px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">
            Submit Dispute for Arbitration
          </button>
        </form>

      </div>

    </div>
  `;
}
