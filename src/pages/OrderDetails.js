/**
 * OrderDetails Page Component with Interactive Tracking and Dispute/Review Triggers
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";
import { renderOrderTimeline } from "../components/OrderTimeline.js";

export function renderOrderDetailsPage(orderId) {
  const order = store.getOrderById(orderId);
  const currentRole = store.getCurrentRole();

  if (!order) {
    return `
      <div style="padding:80px 20px; text-align:center; font-family:'Plus Jakarta Sans', sans-serif;">
        <h2 style="font-family:'Outfit', sans-serif; font-size:24px; color:#0f172a; margin-bottom:12px;">Order Not Found</h2>
        <p style="color:#64748b; margin-bottom:20px;">The requested order ID '${orderId}' does not exist.</p>
        <a href="#orders" style="background:#16a34a; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-weight:700;">Back to Orders</a>
      </div>
    `;
  }

  const isFarmer = currentRole === "farmer";
  const isBuyer = currentRole === "buyer";
  const isAdmin = currentRole === "admin";

  return `
    <div class="page-order-details" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1100px; margin:0 auto;">
        
        <!-- Breadcrumbs & Header -->
        <div style="margin-bottom:24px;">
          <div style="font-size:12px; color:#64748b; margin-bottom:6px;">
            <a href="#orders" style="color:#16a34a; text-decoration:none;">Orders</a> / <span style="color:#0f172a; font-weight:600;">#${order.id}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:flex-end; flex-wrap:wrap; gap:16px;">
            <div>
              <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
                Order Tracking: #${order.id}
              </h1>
              <p style="font-size:13px; color:#64748b; margin-top:4px;">
                Placed on ${order.createdAt} • Transaction ID: <code>${order.transactionId}</code>
              </p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button id="btn-print-tax-invoice" data-id="${order.id}" style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:9px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                🖨️ Print Tax Invoice
              </button>
              <button id="btn-open-dispute-modal" data-id="${order.id}" style="background:#fef2f2; border:1px solid #fecaca; color:#dc2626; padding:9px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
                🛡️ Raise Dispute
              </button>
            </div>
          </div>
        </div>

        <!-- 9-Stage Visual Fulfillment Timeline -->
        ${renderOrderTimeline(order)}

        <!-- Interactive Simulation Controls for Demonstration -->
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:16px 20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <strong style="font-size:13px; color:#14532d;">🎮 Live Order Lifecycle Simulator:</strong>
            <span style="font-size:12px; color:#16a34a; margin-left:6px;">Advance order status to test platform workflows:</span>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="Seller Accepted" style="background:#ffffff; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">1. Accept</button>
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="Pickup Scheduled" style="background:#ffffff; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">2. Schedule</button>
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="Waste Collected" style="background:#ffffff; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">3. Collect</button>
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="In Transit" style="background:#ffffff; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">4. In Transit</button>
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="Delivered" style="background:#ffffff; border:1px solid #cbd5e1; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">5. Deliver</button>
            <button class="btn-advance-status" data-order-id="${order.id}" data-status="Completed" style="background:#16a34a; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">6. Complete & Review</button>
          </div>
        </div>

        <!-- 2-Column Details Layout -->
        <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:24px;" class="order-details-grid">
          
          <!-- Left: Order Items, Parties, Delivery Location -->
          <div>
            
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:14px;">
                Waste Line Item
              </h3>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <h4 style="font-size:16px; font-weight:700; color:#0f172a; margin-bottom:4px;">
                    <a href="#waste/${order.listingId}" style="color:inherit; text-decoration:none;">${order.listingTitle}</a>
                  </h4>
                  <span style="font-size:12px; color:#64748b;">Category: ${order.category} • Rate: ${formatINR(order.unitPrice)} / ${order.unit.slice(0, -1)}</span>
                </div>
                <div style="text-align:right;">
                  <span style="font-size:16px; font-weight:800; color:#0f172a;">${order.quantity} ${order.unit}</span>
                  <span style="font-size:13px; font-weight:700; color:#16a34a; display:block;">${formatINR(order.subtotal)}</span>
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
              <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:18px;">
                <span style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase;">Seller / Producer</span>
                <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:4px 0;">${order.seller.name}</h4>
                <p style="font-size:12px; color:#475569; margin:0 0 6px 0;">${order.seller.farmName}</p>
                <p style="font-size:12px; color:#64748b; margin:0;">📍 ${order.seller.pickupAddress}</p>
              </div>

              <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:18px;">
                <span style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase;">Buyer / Processor</span>
                <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin:4px 0;">${order.buyer.name}</h4>
                <p style="font-size:12px; color:#475569; margin:0 0 6px 0;">${order.buyer.company}</p>
                <p style="font-size:12px; color:#64748b; margin:0;">📍 ${order.buyer.deliveryAddress}</p>
              </div>
            </div>

          </div>

          <!-- Right: Payment & Escrow Status -->
          <div>
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:14px; border-bottom:1px solid #f0f6f0; padding-bottom:8px;">
                Financial Summary
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px; font-size:13px; color:#475569; margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between;"><span>Biomass Subtotal:</span> <strong>${formatINR(order.subtotal)}</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Logistics & Freight:</span> <strong>${formatINR(order.transportationFee)}</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>Platform Fee (2%):</span> <strong>${formatINR(order.platformFee)}</strong></div>
                <div style="display:flex; justify-content:space-between;"><span>GST Tax:</span> <strong>${formatINR(order.taxGst)}</strong></div>
                <div style="display:flex; justify-content:space-between; font-size:16px; border-top:2px solid #e2e8f0; padding-top:10px; color:#0f172a;">
                  <span style="font-weight:800;">Total Escrow Amount:</span>
                  <strong style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#16a34a;">${formatINR(order.totalAmount)}</strong>
                </div>
              </div>

              <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0; font-size:12px; color:#475569;">
                <div style="margin-bottom:4px;"><strong>Payment Method:</strong> ${order.paymentMethod}</div>
                <div style="margin-bottom:4px;"><strong>Payment Status:</strong> <span style="color:#16a34a; font-weight:700;">${order.paymentStatus}</span></div>
                <div><strong>Transaction:</strong> <code>${order.transactionId}</code></div>
              </div>

              <!-- Buyer Review Action Trigger if Completed -->
              ${
                order.status === "Completed"
                  ? `
                <div style="margin-top:16px;">
                  <button id="btn-open-review-modal" data-order-id="${order.id}" data-seller-id="${order.seller.id}" data-seller-name="${order.seller.name}" style="width:100%; background:#eab308; color:#0f172a; border:none; padding:12px; border-radius:10px; font-size:14px; font-weight:800; cursor:pointer;">
                    ★ Rate & Review Seller (5 Stars)
                  </button>
                </div>
              `
                  : ""
              }

            </div>
          </div>

        </div>

      </div>
    </div>
  `;
}
