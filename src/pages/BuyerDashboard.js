/**
 * Buyer Dashboard Component with Procurement Analytics and AI Recommendations Feed
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";
import { renderStatCard } from "../components/StatCard.js";
import { renderSidebar } from "../components/Sidebar.js";
import { getRecommendedListingsForBuyer } from "../services/recommendationEngine.js";

export function renderBuyerDashboardPage(activeSubtab = "overview") {
  const currentUser = store.getCurrentUser();
  const allListings = store.getListings();
  const orders = store.getOrders();
  const activeOrders = orders.filter(o => o.status === "In Transit" || o.status === "Pickup Scheduled" || o.status === "Payment Confirmed");
  const recommendedListings = getRecommendedListingsForBuyer(currentUser, allListings, 4);

  let totalTonsProcured = 0;
  let totalSpend = 0;
  orders.forEach(o => {
    totalTonsProcured += o.quantity || 0;
    totalSpend += o.totalAmount || 0;
  });

  return `
    <div class="page-buyer-dashboard" style="display:flex; background:#f7faf7; min-height:85vh; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Sidebar -->
      ${renderSidebar(activeSubtab, "buyer")}

      <!-- Main Content -->
      <main style="flex-grow:1; padding:32px 30px; overflow-x:hidden;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; flex-wrap:wrap; gap:16px;">
          <div>
            <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
              🏭 Industrial Procurement Hub
            </h1>
            <p style="font-size:13px; color:#64748b; margin-top:4px;">
              ${currentUser.companyName || "AgroFeed & Biomass Industries"} • ${currentUser.industry || "Animal Feed & Bio-Pellets"} • 📍 ${currentUser.location}
            </p>
          </div>
          <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none;">
            + Source More Biomass
          </a>
        </div>

        <!-- 4 Stat Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:32px;">
          ${renderStatCard({
            title: "Total Procurement Spend",
            value: formatINR(totalSpend || 785000),
            subtitle: "Escrow Verified",
            icon: "💳",
            color: "blue",
            trend: { isPositive: true, text: "100% Tax Compliant" }
          })}

          ${renderStatCard({
            title: "Total Waste Purchased",
            value: `${totalTonsProcured || 68.5} Tons`,
            subtitle: "Converted to green products",
            icon: "🌾",
            color: "green"
          })}

          ${renderStatCard({
            title: "Active In-Transit Orders",
            value: `${activeOrders.length}`,
            subtitle: "Live GPS Tracking",
            icon: "🚚",
            color: "amber"
          })}

          ${renderStatCard({
            title: "Carbon Offset Mitigated",
            value: "48.2 Tons",
            subtitle: "CO₂ Equivalent",
            icon: "🌱",
            color: "purple"
          })}
        </div>

        <!-- Procurement Chart & Active Shipments Grid -->
        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:24px; margin-bottom:32px;" class="dashboard-charts-grid">
          
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin:0;">
                📊 Monthly Procurement Spend (₹)
              </h3>
              <span style="font-size:12px; color:#16a34a; font-weight:700;">FY 2026</span>
            </div>
            <div style="height:240px; position:relative;">
              <canvas id="buyer-spending-chart"></canvas>
            </div>
          </div>

          <!-- Active Shipments Card -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin:0;">
                🚚 Active Shipments (${activeOrders.length})
              </h3>
              <a href="#orders" style="font-size:12px; color:#16a34a; font-weight:700; text-decoration:none;">View all</a>
            </div>

            <div style="display:flex; flex-direction:column; gap:12px;">
              ${
                activeOrders.length === 0
                  ? `<p style="font-size:13px; color:#64748b; text-align:center; padding:30px 0;">No active shipments in transit.</p>`
                  : activeOrders.slice(0, 3).map(
                      o => `
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <strong style="font-size:13px; color:#0f172a;">${o.id}</strong>
                      <span style="background:#dbeafe; color:#1d4ed8; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px;">${o.status}</span>
                    </div>
                    <p style="font-size:12px; color:#475569; margin:0 0 4px 0;">${o.listingTitle} (${o.quantity} ${o.unit})</p>
                    <span style="font-size:11px; color:#16a34a; font-weight:600;">📍 ${o.logistics?.currentLocation || "In Transit"}</span>
                  </div>
                `
                    ).join("")
              }
            </div>
          </div>

        </div>

        <!-- AI Smart Recommended Waste Feed for this Buyer -->
        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:20px;">🧠</span>
                <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#0f172a; margin:0;">
                  AgriWaste Intelligence: Ranked Waste Matches
                </h3>
              </div>
              <p style="font-size:12px; color:#64748b; margin-top:2px;">
                Ranked for ${currentUser.companyName || currentUser.name} by Buyer Match Score (Waste 30%, Quantity 25%, Quality 20%, Distance 15%, Price 10%)
              </p>
            </div>
            <a href="#intelligence" style="color:#16a34a; font-size:13px; font-weight:700; text-decoration:none;">Open Full Intelligence Engine →</a>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:16px;">
            ${(() => {
              const matches = store.getBuyerMatchesForBuyer(currentUser.id);
              if (matches.length === 0) return `<p style="font-size:13px; color:#64748b;">No active matching waste listings currently available.</p>`;

              return matches.slice(0, 4).map(m => {
                const listing = store.getListingById(m.waste_id);
                if (!listing) return '';
                const intel = store.getListingIntelligence(listing.id);

                return `
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="background:#f0fdf4; color:#16a34a; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px; border:1px solid #bbf7d0;">${listing.categoryName}</span>
                        <span style="background:#0f172a; color:#ffffff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:10px;">${m.match_score}% Match</span>
                      </div>
                      <h4 style="font-size:15px; font-weight:700; color:#0f172a; margin-bottom:4px; line-height:1.3;">
                        <a href="#waste/${listing.id}" style="color:inherit; text-decoration:none;">${listing.title}</a>
                      </h4>
                      <p style="font-size:12px; color:#64748b; margin:0 0 8px 0;">📍 ${listing.location} (${m.distance_km || 25} km)</p>
                      
                      <div style="font-size:11px; color:#334155; background:#ffffff; padding:8px 10px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:10px; line-height:1.4;">
                        <strong>Suitability WSS:</strong> ${intel?.suitability?.wssScore || 88}/100<br/>
                        <strong>Rec Use:</strong> ${intel?.recommendations?.[0]?.application_name || 'Composting'}
                      </div>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:10px;">
                      <div>
                        <span style="font-size:10px; color:#64748b; display:block;">Price per Ton</span>
                        <strong style="font-size:16px; color:#16a34a;">${formatINR(listing.price)}</strong>
                      </div>
                      <div style="display:flex; gap:6px;">
                        <a href="#waste/${listing.id}" style="background:#16a34a; color:white; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; text-decoration:none;">Procure</a>
                      </div>
                    </div>
                  </div>
                `;
              }).join('');
            })()}
          </div>
        </div>

      </main>
    </div>
  `;
}
