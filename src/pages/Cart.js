/**
 * Procurement Cart Page Component
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";

export function renderCartPage() {
  const calc = store.getCartCalculations();
  const items = calc.items;

  if (items.length === 0) {
    return `
      <div class="page-cart" style="padding:80px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:80vh; text-align:center;">
        <div class="container" style="max-width:600px; margin:0 auto; background:#ffffff; border:1px solid #e2ece2; border-radius:20px; padding:50px 30px; box-shadow:0 4px 15px rgba(15,61,33,0.04);">
          <div style="font-size:54px; margin-bottom:16px;">🛒</div>
          <h2 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin-bottom:8px;">Your Procurement Cart is Empty</h2>
          <p style="font-size:14px; color:#64748b; margin-bottom:28px; line-height:1.6;">
            Explore our national agricultural residue marketplace to find high-grade crop straw, bagasse, and organic biomass.
          </p>
          <a href="#marketplace" style="background:#16a34a; color:white; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none; display:inline-block; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            Browse Marketplace →
          </a>
        </div>
      </div>
    `;
  }

  return `
    <div class="page-cart" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1180px; margin:0 auto;">
        
        <div style="margin-bottom:28px;">
          <h1 style="font-family:'Outfit', sans-serif; font-size:30px; font-weight:800; color:#0f172a; margin:0;">
            Procurement Cart & Order Summary
          </h1>
          <p style="font-size:14px; color:#64748b; margin-top:4px;">
            Review your biomass quantities, automated freight calculations, and proceed to secured escrow checkout.
          </p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 380px; gap:32px; align-items:start;" class="cart-layout-grid">
          
          <!-- Left: Cart Items List -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:12px; border-bottom:1px solid #f0f6f0;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                Selected Waste Lots (${items.length})
              </h3>
              <button id="btn-clear-cart" style="background:none; border:none; color:#dc2626; font-size:12px; font-weight:700; cursor:pointer;">
                Clear Cart
              </button>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
              ${items
                .map(
                  item => `
                <div class="cart-item-row" style="display:flex; gap:16px; align-items:center; padding-bottom:20px; border-bottom:1px solid #f1f5f9;">
                  <img src="${item.image}" alt="${item.listingTitle}" style="width:100px; height:80px; border-radius:10px; object-fit:cover; flex-shrink:0;" />
                  
                  <div style="flex-grow:1;">
                    <span style="font-size:11px; font-weight:700; color:#16a34a; background:#f0fdf4; padding:2px 8px; border-radius:4px;">${item.categoryName}</span>
                    <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:4px 0;">
                      <a href="#waste/${item.listingId}" style="color:inherit; text-decoration:none;">${item.listingTitle}</a>
                    </h4>
                    <p style="font-size:12px; color:#64748b; margin:0;">
                      📍 ${item.location} • Seller: ${item.seller?.name || "Farmer"}
                    </p>
                    <div style="font-size:13px; color:#16a34a; font-weight:700; margin-top:4px;">
                      ${formatINR(item.unitPrice)} / ${item.unit.slice(0, -1)}
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
                    <button class="btn-cart-qty-dec" data-id="${item.listingId}" style="width:30px; height:30px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; cursor:pointer;">-</button>
                    <span style="font-weight:700; font-size:14px; min-width:50px; text-align:center;">${item.quantity} ${item.unit}</span>
                    <button class="btn-cart-qty-inc" data-id="${item.listingId}" style="width:30px; height:30px; border-radius:6px; border:1px solid #cbd5e1; background:#ffffff; font-weight:700; cursor:pointer;">+</button>
                  </div>

                  <!-- Subtotal & Remove -->
                  <div style="text-align:right; min-width:110px; flex-shrink:0;">
                    <span style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#0f172a; display:block;">
                      ${formatINR(item.quantity * item.unitPrice)}
                    </span>
                    <button class="btn-cart-remove" data-id="${item.listingId}" style="background:none; border:none; color:#94a3b8; font-size:12px; cursor:pointer; margin-top:4px;">
                      Remove 🗑️
                    </button>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>

            <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
              <a href="#marketplace" style="color:#16a34a; font-size:13px; font-weight:700; text-decoration:none;">
                ← Add More Waste Lots
              </a>
              <span style="font-size:12px; color:#64748b;">Total Biomass Weight: <strong>${calc.totalTons} Tons</strong></span>
            </div>

          </div>

          <!-- Right: Order Cost Breakdown & Checkout Action -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 4px 15px rgba(15,61,33,0.06); position:sticky; top:90px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px; border-bottom:1px solid #f0f6f0; padding-bottom:10px;">
              Cost & Freight Breakdown
            </h3>

            <div style="display:flex; flex-direction:column; gap:12px; font-size:14px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>Crop Biomass Subtotal:</span>
                <strong style="color:#0f172a;">${formatINR(calc.subtotal)}</strong>
              </div>

              <div style="display:flex; justify-content:space-between; color:#475569;">
                <div>
                  <span>Logistics & Freight:</span>
                  <span style="font-size:11px; color:#64748b; display:block;">(Dedicated Truck Tipper)</span>
                </div>
                <strong style="color:#0f172a;">${formatINR(calc.transportationFee)}</strong>
              </div>

              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>Platform Commission (2%):</span>
                <strong style="color:#0f172a;">${formatINR(calc.platformFee)}</strong>
              </div>

              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>GST Tax (5% on Bio-Freight):</span>
                <strong style="color:#0f172a;">${formatINR(calc.taxGst)}</strong>
              </div>

              <div style="display:flex; justify-content:space-between; padding-top:14px; border-top:2px solid #e2e8f0; font-size:18px;">
                <span style="font-weight:800; color:#0f172a;">Total Amount:</span>
                <strong style="font-family:'Outfit', sans-serif; font-size:24px; font-weight:800; color:#16a34a;">${formatINR(calc.totalAmount)}</strong>
              </div>
            </div>

            <a href="#checkout" style="display:block; text-align:center; background:#16a34a; color:white; padding:14px; border-radius:10px; font-size:15px; font-weight:800; text-decoration:none; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
              Proceed to Secure Escrow Checkout →
            </a>

            <div style="margin-top:16px; font-size:11px; color:#64748b; text-align:center; line-height:1.5;">
              🔒 100% Escrow Protection: Payment is released to the seller only after weighbridge inspection at your facility.
            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
