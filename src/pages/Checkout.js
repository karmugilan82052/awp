/**
 * Checkout Page Component with Mock Multi-Method Payment Gateway & Confetti
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";

export function renderCheckoutPage() {
  const calc = store.getCartCalculations();
  const currentUser = store.getCurrentUser();

  if (calc.items.length === 0) {
    return `
      <div style="padding:80px 20px; text-align:center; font-family:'Plus Jakarta Sans', sans-serif;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:24px; color:#0f172a; margin-bottom:12px;">No Active Items to Checkout</h2>
        <p style="color:#64748b; margin-bottom:20px;">Please add agricultural waste listings to your cart before checking out.</p>
        <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:700;">Explore Marketplace</a>
      </div>
    `;
  }

  return `
    <div class="page-checkout" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1100px; margin:0 auto;">
        
        <div style="margin-bottom:28px;">
          <div style="font-size:12px; color:#64748b; margin-bottom:6px;">
            <a href="#cart" style="color:#16a34a; text-decoration:none;">Cart</a> / <span style="color:#0f172a; font-weight:600;">Checkout</span>
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:30px; font-weight:800; color:#0f172a; margin:0;">
            Secure Escrow Checkout & Dispatch Setup
          </h1>
          <p style="font-size:14px; color:#64748b; margin-top:4px;">
            Funds will remain safely held in National Bio-Escrow until physical delivery and moisture testing at your plant.
          </p>
        </div>

        <form id="checkout-form" style="display:grid; grid-template-columns:1fr 400px; gap:32px; align-items:start;" class="checkout-layout-grid">
          
          <!-- Left Column: Delivery Details & Payment Method Selection -->
          <div>
            
            <!-- Delivery & Logistics Details -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
                1. Industrial Delivery / Pickup Destination
              </h3>

              <div style="margin-bottom:16px;">
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Receiving Plant / Company Name *</label>
                <input type="text" id="input-checkout-company" required value="${currentUser.companyName || currentUser.farmName || currentUser.name}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>

              <div style="margin-bottom:16px;">
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Delivery Warehouse / Plant Address *</label>
                <textarea id="input-checkout-address" rows="3" required style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;">${currentUser.location || "Plot 42, SIDCO Industrial Estate, Kurichi, Coimbatore, Tamil Nadu - 641021"}</textarea>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
                <div>
                  <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Contact Phone *</label>
                  <input type="text" id="input-checkout-phone" required value="${currentUser.phone || "+91 98450 67890"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
                </div>
                <div>
                  <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">GSTIN (Optional for Tax Credit)</label>
                  <input type="text" id="input-checkout-gst" value="${currentUser.gstin || "33AAACA9876C1Z4"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
                </div>
              </div>

            </div>

            <!-- Payment Method Gateway -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
                2. Select Escrow Payment Gateway
              </h3>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:20px;">
                
                <label class="payment-method-option active" style="border:2px solid #16a34a; background:#f0fdf4; border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer;">
                  <input type="radio" name="payment-method" value="UPI (Google Pay / PhonePe)" checked style="display:none;" />
                  <span style="font-size:24px; display:block; margin-bottom:4px;">📱</span>
                  <span style="font-size:12px; font-weight:700; color:#0f172a; display:block;">UPI QR</span>
                </label>

                <label class="payment-method-option" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer;">
                  <input type="radio" name="payment-method" value="Credit / Corporate Card" style="display:none;" />
                  <span style="font-size:24px; display:block; margin-bottom:4px;">💳</span>
                  <span style="font-size:12px; font-weight:700; color:#0f172a; display:block;">Cards</span>
                </label>

                <label class="payment-method-option" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer;">
                  <input type="radio" name="payment-method" value="HDFC / SBI Net Banking" style="display:none;" />
                  <span style="font-size:24px; display:block; margin-bottom:4px;">🏦</span>
                  <span style="font-size:12px; font-weight:700; color:#0f172a; display:block;">NetBanking</span>
                </label>

                <label class="payment-method-option" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer;">
                  <input type="radio" name="payment-method" value="AgroPay Bio-Wallet" style="display:none;" />
                  <span style="font-size:24px; display:block; margin-bottom:4px;">👛</span>
                  <span style="font-size:12px; font-weight:700; color:#0f172a; display:block;">AgroWallet</span>
                </label>

                <label class="payment-method-option" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:12px; padding:12px 8px; text-align:center; cursor:pointer;">
                  <input type="radio" name="payment-method" value="Cash on Delivery (Weighbridge)" style="display:none;" />
                  <span style="font-size:24px; display:block; margin-bottom:4px;">🤝</span>
                  <span style="font-size:12px; font-weight:700; color:#0f172a; display:block;">Weighbridge</span>
                </label>

              </div>

              <!-- Payment Details Display Area -->
              <div id="payment-method-details" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; text-align:center;">
                <div style="background:#ffffff; padding:16px; border-radius:12px; display:inline-block; border:1px solid #cbd5e1; margin-bottom:10px;">
                  <div style="font-size:64px; line-height:1;">🏁</div>
                  <span style="font-size:11px; font-weight:700; color:#16a34a; display:block; margin-top:6px;">Scan with any UPI App</span>
                </div>
                <p style="font-size:13px; color:#475569; margin:0;">
                  UPI ID: <strong>agriwaste.escrow@icici</strong> • Total: <strong style="color:#16a34a;">${formatINR(calc.totalAmount)}</strong>
                </p>
              </div>

            </div>

          </div>

          <!-- Right Column: Order Review & Instant Pay -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 4px 15px rgba(15,61,33,0.06); position:sticky; top:90px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px; border-bottom:1px solid #f0f6f0; padding-bottom:10px;">
              Order Summary (${calc.items.length} lots)
            </h3>

            <div style="max-height:220px; overflow-y:auto; margin-bottom:16px; display:flex; flex-direction:column; gap:10px;">
              ${calc.items
                .map(
                  i => `
                <div style="display:flex; justify-content:space-between; font-size:13px;">
                  <div>
                    <strong style="color:#0f172a; display:block;">${i.listingTitle}</strong>
                    <span style="color:#64748b; font-size:11px;">${i.quantity} ${i.unit} × ${formatINR(i.unitPrice)}</span>
                  </div>
                  <strong style="color:#0f172a;">${formatINR(i.quantity * i.unitPrice)}</strong>
                </div>
              `
                )
                .join("")}
            </div>

            <div style="border-top:1px solid #f0f6f0; padding-top:12px; display:flex; flex-direction:column; gap:8px; font-size:13px; color:#475569; margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between;"><span>Subtotal:</span> <strong>${formatINR(calc.subtotal)}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Logistics Freight:</span> <strong>${formatINR(calc.transportationFee)}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>Platform Fee (2%):</span> <strong>${formatINR(calc.platformFee)}</strong></div>
              <div style="display:flex; justify-content:space-between;"><span>GST Tax (5%):</span> <strong>${formatINR(calc.taxGst)}</strong></div>
              <div style="display:flex; justify-content:space-between; font-size:18px; border-top:2px solid #e2e8f0; padding-top:10px; color:#0f172a;">
                <span style="font-weight:800;">Total Payable:</span>
                <strong style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:800; color:#16a34a;">${formatINR(calc.totalAmount)}</strong>
              </div>
            </div>

            <button type="submit" id="btn-confirm-order" style="width:100%; background:#16a34a; color:white; border:none; padding:15px; border-radius:10px; font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 4px 15px rgba(22,163,74,0.35);">
              🔒 Authorize Escrow Payment (${formatINR(calc.totalAmount)})
            </button>

            <div style="margin-top:16px; font-size:11px; color:#64748b; text-align:center; line-height:1.4;">
              By completing this order, you agree to the National AgriWaste Circular Procurement Terms & 3-Day Inspection Policy.
            </div>
          </div>

        </form>

      </div>
    </div>
  `;
}
