/**
 * Orders List Page Component
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";

export function renderOrdersPage(searchParams = {}) {
  const currentRole = store.getCurrentRole();
  const filterStatus = searchParams.status || "all";
  const orders = store.getOrders({ status: filterStatus });

  return `
    <div class="page-orders" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1200px; margin:0 auto;">
        
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:28px; flex-wrap:wrap; gap:16px;">
          <div>
            <h1 style="font-family:'Outfit', sans-serif; font-size:30px; font-weight:800; color:#0f172a; margin:0;">
              ${currentRole === "farmer" ? "Incoming Buyer Orders" : currentRole === "buyer" ? "My Procurement Orders" : "Platform Orders & Escrow"}
            </h1>
            <p style="font-size:14px; color:#64748b; margin-top:4px;">
              Track live shipments, view logistics waybills, download tax invoices, and manage dispute resolution.
            </p>
          </div>
          <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none;">
            + Browse Waste Marketplace
          </a>
        </div>

        <!-- Status Filter Tabs -->
        <div style="display:flex; gap:8px; margin-bottom:24px; overflow-x:auto; padding-bottom:4px;">
          <a href="#orders" class="tab-btn ${filterStatus === "all" ? "active" : ""}" style="padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; background:${
    filterStatus === "all" ? "#16a34a" : "#ffffff"
  }; color:${filterStatus === "all" ? "#ffffff" : "#475569"}; border:1px solid #cbd5e1;">All Orders</a>
          
          <a href="#orders?status=In Transit" class="tab-btn ${filterStatus === "In Transit" ? "active" : ""}" style="padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; background:${
    filterStatus === "In Transit" ? "#16a34a" : "#ffffff"
  }; color:${filterStatus === "In Transit" ? "#ffffff" : "#475569"}; border:1px solid #cbd5e1;">🚚 In Transit</a>
          
          <a href="#orders?status=Pickup Scheduled" class="tab-btn ${filterStatus === "Pickup Scheduled" ? "active" : ""}" style="padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; background:${
    filterStatus === "Pickup Scheduled" ? "#16a34a" : "#ffffff"
  }; color:${filterStatus === "Pickup Scheduled" ? "#ffffff" : "#475569"}; border:1px solid #cbd5e1;">📅 Pickup Scheduled</a>
          
          <a href="#orders?status=Payment Confirmed" class="tab-btn ${filterStatus === "Payment Confirmed" ? "active" : ""}" style="padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; background:${
    filterStatus === "Payment Confirmed" ? "#16a34a" : "#ffffff"
  }; color:${filterStatus === "Payment Confirmed" ? "#ffffff" : "#475569"}; border:1px solid #cbd5e1;">💳 Confirmed (Escrow)</a>
          
          <a href="#orders?status=Completed" class="tab-btn ${filterStatus === "Completed" ? "active" : ""}" style="padding:8px 16px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; background:${
    filterStatus === "Completed" ? "#16a34a" : "#ffffff"
  }; color:${filterStatus === "Completed" ? "#ffffff" : "#475569"}; border:1px solid #cbd5e1;">✓ Completed</a>
        </div>

        <!-- Orders Table / Cards -->
        ${
          orders.length === 0
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:60px 20px; text-align:center;">
            <div style="font-size:48px; margin-bottom:12px;">📦</div>
            <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin-bottom:6px;">No Orders Found</h3>
            <p style="font-size:14px; color:#64748b; margin-bottom:20px;">There are no active orders matching this filter status.</p>
            <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:8px; font-weight:700; text-decoration:none;">Explore Marketplace</a>
          </div>
        `
            : `
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${orders
              .map(
                order => `
              <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:20px; box-shadow:0 2px 8px rgba(15,61,33,0.04); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                
                <div>
                  <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                    <span style="font-family:'Outfit', sans-serif; font-weight:800; font-size:16px; color:#0f172a;">${order.id}</span>
                    <span style="background:${
                      order.status === "Completed"
                        ? "#dcfce7"
                        : order.status === "In Transit"
                        ? "#dbeafe"
                        : order.status === "Cancelled"
                        ? "#fee2e2"
                        : "#fef3c7"
                    }; color:${
                  order.status === "Completed"
                    ? "#15803d"
                    : order.status === "In Transit"
                    ? "#1d4ed8"
                    : order.status === "Cancelled"
                    ? "#dc2626"
                    : "#b45309"
                }; font-size:11px; font-weight:700; padding:3px 10px; border-radius:12px;">
                      ${order.status}
                    </span>
                    <span style="font-size:12px; color:#64748b;">${order.createdAt}</span>
                  </div>

                  <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:4px;">
                    ${order.listingTitle}
                  </h3>

                  <div style="font-size:13px; color:#475569; display:flex; flex-wrap:wrap; gap:16px;">
                    <span><strong>Quantity:</strong> ${order.quantity} ${order.unit}</span>
                    <span><strong>Seller:</strong> ${order.seller.name}</span>
                    <span><strong>Buyer:</strong> ${order.buyer.company || order.buyer.name}</span>
                    <span><strong>Payment:</strong> <span style="color:#16a34a; font-weight:600;">${order.paymentStatus}</span></span>
                  </div>
                </div>

                <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                  <span style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; color:#16a34a;">
                    ${formatINR(order.totalAmount)}
                  </span>
                  <a href="#orders/${order.id}" style="background:#16a34a; color:white; padding:8px 18px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; display:inline-block;">
                    Track & Manage Order →
                  </a>
                </div>

              </div>
            `
              )
              .join("")}
          </div>
        `
        }

      </div>
    </div>
  `;
}
