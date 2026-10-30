/**
 * PaymentSuccessModal Component
 * Automatically displays upon successful payment completion with 1-click Payment PDF Download & Order Tracking
 */

import { formatINR } from "../utils/formatters.js";

export function renderPaymentSuccessModal(order) {
  if (!order) return "";

  return `
    <div id="payment-success-modal-overlay" style="position:fixed; inset:0; background:rgba(9, 30, 15, 0.75); backdrop-filter:blur(6px); z-index:2800; display:flex; align-items:center; justify-content:center; padding:16px;">
      
      <div style="background:#ffffff; border-radius:24px; width:100%; max-width:540px; box-shadow:0 30px 70px rgba(0,0,0,0.35); overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif; animation:slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
        
        <!-- Header Banner with Green Wave -->
        <div style="background:linear-gradient(135deg, #092c17 0%, #14532d 55%, #16a34a 100%); color:white; padding:32px 24px 24px 24px; text-align:center; position:relative;">
          
          <button id="btn-close-payment-success-modal" style="position:absolute; top:16px; right:16px; background:rgba(255,255,255,0.2); border:none; color:white; font-size:18px; width:32px; height:32px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.15s;">
            ✕
          </button>

          <!-- Animated Green Checkmark Ring -->
          <div style="background:rgba(255,255,255,0.2); width:76px; height:76px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto; box-shadow:0 0 25px rgba(255,255,255,0.3);">
            <div style="background:#ffffff; width:58px; height:58px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#15803d; font-size:32px; font-weight:900;">
              ✓
            </div>
          </div>

          <h2 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; margin:0 0 6px 0; color:#ffffff;">
            Payment Completed!
          </h2>
          <p style="font-size:15px; color:#dcfce7; margin:0; line-height:1.4;">
            Funds Secured in National Bio-Escrow Vault • Official PDF Receipt Ready
          </p>
        </div>

        <!-- Order & Receipt Content Body -->
        <div style="padding:24px 28px;">
          
          <!-- Key Payment Transaction Box -->
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:16px; padding:18px 20px; margin-bottom:20px;">
            
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:12px;">
              <div>
                <span style="font-size:12px; color:#64748b; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Order Reference</span>
                <strong style="font-size:17px; color:#0f172a; display:block; font-family:'Outfit', sans-serif;">#${order.id}</strong>
              </div>
              <div style="text-align:right;">
                <span style="font-size:12px; color:#64748b; text-transform:uppercase; font-weight:700; letter-spacing:0.5px;">Amount Paid</span>
                <strong style="font-size:22px; color:#16a34a; font-family:'Outfit', sans-serif; display:block;">${formatINR(order.totalAmount)}</strong>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:13px; color:#475569;">
              <div>
                <span style="color:#64748b; font-size:11.5px; display:block;">Biomass Commodity:</span>
                <strong style="color:#0f172a;">${order.listingTitle}</strong> (${order.quantity} ${order.unit})
              </div>
              <div>
                <span style="color:#64748b; font-size:11.5px; display:block;">Payment Method:</span>
                <strong style="color:#0f172a;">${order.paymentMethod || "Razorpay UPI"}</strong>
              </div>
              <div>
                <span style="color:#64748b; font-size:11.5px; display:block;">Transaction Ref:</span>
                <code style="font-size:11px; color:#0284c7; font-weight:700;">${order.transactionId}</code>
              </div>
              <div>
                <span style="color:#64748b; font-size:11.5px; display:block;">Escrow Vault Status:</span>
                <span style="color:#16a34a; font-weight:800; font-size:12px;">● Locked & Protected</span>
              </div>
            </div>

          </div>

          <!-- Primary Action: Download/Print Payment PDF Receipt -->
          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            
            <button id="btn-download-payment-pdf" data-id="${order.id}" style="width:100%; background:linear-gradient(135deg, #15803d 0%, #16a34a 100%); color:white; border:none; padding:15px; border-radius:12px; font-size:16px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 14px rgba(22,163,74,0.35); transition:all 0.15s ease;">
              <span style="font-size:20px;">📄</span> Download Payment Receipt (PDF)
            </button>

            <button id="btn-download-esg-from-success" data-id="${order.id}" style="width:100%; background:#f0fdf4; border:1.5px solid #86efac; color:#15803d; padding:12px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px; transition:all 0.15s ease;">
              <span>🌱</span> Generate ESG Green Compliance Certificate
            </button>

            <a href="#orders/${order.id}" id="link-track-order-success" style="width:100%; background:#f8fafc; border:1.5px solid #cbd5e1; color:#334155; padding:12px; border-radius:12px; font-size:14px; font-weight:700; text-decoration:none; display:flex; align-items:center; justify-content:center; gap:6px; box-sizing:border-box;">
              <span>🚚</span> Track Shipment & Live GPS →
            </a>

          </div>

          <!-- Bottom Security Note -->
          <div style="text-align:center; font-size:12px; color:#64748b; line-height:1.4;">
            🔒 Certified under National Circular Bioeconomy Exchange Guidelines. A copy of this tax invoice has also been sent to your registered company profile.
          </div>

        </div>

      </div>

    </div>
  `;
}
