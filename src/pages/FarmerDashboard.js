/**
 * Farmer Dashboard Component with Revenue Charts, Order Management, and Listing Controls
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";
import { renderStatCard } from "../components/StatCard.js";
import { renderSidebar } from "../components/Sidebar.js";

export function renderFarmerDashboardPage(activeSubtab = "overview") {
  const currentUser = store.getCurrentUser();
  const allListings = store.getListings({ includeAllStatuses: true });
  const farmerListings = allListings.filter(l => l.seller?.id === currentUser.id);
  const orders = store.getOrders();
  const pendingOrders = orders.filter(o => o.status === "Payment Confirmed" || o.status === "Order Placed");
  const completedOrders = orders.filter(o => o.status === "Completed");

  let totalTonsSold = 0;
  let totalEarnings = 0;
  orders.forEach(o => {
    totalTonsSold += o.quantity || 0;
    totalEarnings += o.subtotal || 0;
  });

  return `
    <div class="page-farmer-dashboard" style="display:flex; background:#f7faf7; min-height:85vh; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Sidebar -->
      ${renderSidebar(activeSubtab, "farmer")}

      <!-- Main Dashboard Content -->
      <main style="flex-grow:1; padding:32px 30px; overflow-x:hidden;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; flex-wrap:wrap; gap:16px;">
          <div>
            <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
              🌾 Welcome back, ${currentUser.name}
            </h1>
            <p style="font-size:13px; color:#64748b; margin-top:4px;">
              ${currentUser.farmName || "GreenFarm Agro"} • KYC Verified Producer • 📍 ${currentUser.location}
            </p>
          </div>
          <a href="#sell-waste" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            <span>+</span> Add New Waste Listing
          </a>
        </div>

        <!-- 4 Key Stat Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:24px;">
          ${renderStatCard({
            title: "Total Sales Earnings",
            value: formatINR(totalEarnings || 284500),
            subtitle: "100% Escrow Secured",
            icon: "💰",
            color: "green",
            trend: { isPositive: true, text: "+18.4% this month" }
          })}

          ${renderStatCard({
            title: "Biomass Sold",
            value: `${totalTonsSold || 48} Tons`,
            subtitle: "Zero open burning",
            icon: "🌾",
            color: "amber",
            trend: { isPositive: true, text: "12 Tons in transit" }
          })}

          ${renderStatCard({
            title: "Active Waste Listings",
            value: `${farmerListings.length}`,
            subtitle: "Live in national catalog",
            icon: "📋",
            color: "blue"
          })}

          ${renderStatCard({
            title: "Pending Orders",
            value: `${pendingOrders.length}`,
            subtitle: "Awaiting dispatch action",
            icon: "📦",
            color: "purple"
          })}
        </div>

        <!-- WASTE INTELLIGENCE OVERVIEW CARD -->
        ${(() => {
          const intelMetrics = store.getPlatformIntelligenceMetrics();
          const aggregations = store.getAggregatedSupplyOpportunities();
          const farmerWssAvg = 88;

          return `
            <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius:18px; padding:24px; margin-bottom:32px; color:#ffffff; box-shadow:0 6px 20px rgba(15,23,42,0.12);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:24px;">🧠</span>
                  <div>
                    <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#ffffff; margin:0;">
                      WASTE INTELLIGENCE ANALYTICS
                    </h3>
                    <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">
                      Automated quality normalization, suitability scoring, and buyer matching for your crop residue.
                    </p>
                  </div>
                </div>
                <a href="#intelligence" style="background:#16a34a; hover:background:#15803d; color:#ffffff; padding:10px 20px; border-radius:10px; font-size:13px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
                  <span>🔍</span> Analyze My Waste →
                </a>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(160px, 1fr)); gap:12px;">
                <div style="background:rgba(255,255,255,0.06); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Avg Suitability (WSS)</div>
                  <div style="font-size:20px; font-weight:800; color:#34d399; margin-top:2px;">${farmerWssAvg}/100</div>
                  <div style="font-size:10px; color:#cbd5e1;">Highly Suitable</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Recommended Applications</div>
                  <div style="font-size:13px; font-weight:800; color:#60a5fa; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Mushroom & Biofuel</div>
                  <div style="font-size:10px; color:#cbd5e1;">High Value Add</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Aggregated Supply</div>
                  <div style="font-size:20px; font-weight:800; color:#f59e0b; margin-top:2px;">${aggregations.length} Pools</div>
                  <div style="font-size:10px; color:#cbd5e1;">Multi-Farmer Clusters</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">CO₂e Burning Avoided</div>
                  <div style="font-size:20px; font-weight:800; color:#a7f3d0; margin-top:2px;">64.8 Tons</div>
                  <div style="font-size:10px; color:#34d399;">~3,240 Trees Equivalent</div>
                </div>
              </div>
            </div>
          `;
        })()}

        <!-- Charts Section (Recharts / Chart.js Canvas) -->
        <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:24px; margin-bottom:32px;" class="dashboard-charts-grid">
          
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin:0;">
                📈 Monthly Biomass Revenue (₹)
              </h3>
              <span style="font-size:12px; color:#16a34a; font-weight:700;">FY 2026 Trend</span>
            </div>
            <div style="height:240px; position:relative;">
              <canvas id="farmer-revenue-chart"></canvas>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin:0;">
                🥧 Crop Residue Volume Breakdown
              </h3>
              <span style="font-size:12px; color:#64748b;">By Crop Type</span>
            </div>
            <div style="height:240px; position:relative;">
              <canvas id="farmer-category-chart"></canvas>
            </div>
          </div>

        </div>

        <!-- My Listings Management Table -->
        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:32px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <div>
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                My Agricultural Waste Listings
              </h3>
              <span style="font-size:12px; color:#64748b;">Manage pricing, available tons, and publishing status</span>
            </div>
            <a href="#sell-waste" style="background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; text-decoration:none;">+ Add Listing</a>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#64748b;">
                  <th style="padding:12px 16px;">Waste Title</th>
                  <th style="padding:12px 16px;">Category</th>
                  <th style="padding:12px 16px;">Available Qty</th>
                  <th style="padding:12px 16px;">Unit Price</th>
                  <th style="padding:12px 16px;">Status</th>
                  <th style="padding:12px 16px; text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${farmerListings
                  .map(
                    l => `
                  <tr style="border-bottom:1px solid #f1f5f9;">
                    <td style="padding:14px 16px; font-weight:700; color:#0f172a;">
                      <a href="#waste/${l.id}" style="color:inherit; text-decoration:none;">${l.title}</a>
                    </td>
                    <td style="padding:14px 16px; color:#16a34a;">${l.categoryName}</td>
                    <td style="padding:14px 16px; font-weight:600;">${l.quantity} ${l.unit}</td>
                    <td style="padding:14px 16px; font-weight:700; color:#0f172a;">${formatINR(l.price)} / Ton</td>
                    <td style="padding:14px 16px;">
                      <span style="background:${l.status === "Approved" ? "#dcfce7" : "#fef3c7"}; color:${
                      l.status === "Approved" ? "#15803d" : "#b45309"
                    }; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700;">
                        ${l.status}
                      </span>
                    </td>
                    <td style="padding:14px 16px; text-align:right;">
                      <a href="#waste/${l.id}" style="color:#16a34a; font-weight:700; text-decoration:none; margin-right:12px;">View</a>
                      <button class="btn-delete-listing" data-id="${l.id}" style="background:none; border:none; color:#dc2626; font-size:12px; font-weight:600; cursor:pointer;">Delete</button>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Incoming Orders -->
        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
              Recent Buyer Orders & Shipments
            </h3>
            <a href="#orders" style="color:#16a34a; font-size:13px; font-weight:700; text-decoration:none;">View all orders →</a>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${orders.slice(0, 4)
              .map(
                o => `
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <strong style="font-size:14px; color:#0f172a;">${o.id}</strong>
                    <span style="background:#dbeafe; color:#1d4ed8; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px;">${o.status}</span>
                  </div>
                  <p style="font-size:12px; color:#475569; margin:0;">
                    ${o.listingTitle} • Buyer: <strong>${o.buyer.name}</strong> (${o.quantity} ${o.unit})
                  </p>
                </div>
                <div style="text-align:right;">
                  <strong style="font-size:16px; color:#16a34a; display:block;">${formatINR(o.totalAmount)}</strong>
                  <a href="#orders/${o.id}" style="font-size:12px; color:#16a34a; font-weight:700; text-decoration:none;">Track Dispatch →</a>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

      </main>
    </div>
  `;
}
