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
  const recommendedListings = getRecommendedListingsForBuyer(currentUser, allListings, 6);

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
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 style="font-family:'Outfit', sans-serif; font-size:32px; font-weight:800; color:#0f172a; margin:0;">
                🏭 ${currentUser.companyName || "AgroFeed Biomass Refineries"}
              </h1>
              <span style="background:#e0f2fe; color:#0284c7; font-size:13px; font-weight:800; padding:3px 10px; border-radius:12px;">Verified Industrial Buyer</span>
            </div>
            <p style="font-size:15px; color:#64748b; margin-top:4px;">
              ${currentUser.name} • ${currentUser.industry || "Bio-Pellet & Bio-CNG Refinery"} • 📍 ${currentUser.location}
            </p>
          </div>
          <a href="#marketplace" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:17px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            <span>+</span> Source More Biomass
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

        <!-- ==================================================== -->
        <!-- SUBTAB: OVERVIEW -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "overview"
            ? `
          <!-- Procurement Chart & Active Shipments Grid -->
          <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:24px; margin-bottom:32px;" class="dashboard-charts-grid">
            
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin:0;">
                  📊 Monthly Procurement Spend (₹)
                </h3>
                <span style="font-size:14px; color:#16a34a; font-weight:700;">FY 2026</span>
              </div>
              <div style="height:240px; position:relative;">
                <canvas id="buyer-spending-chart"></canvas>
              </div>
            </div>

            <!-- Active Shipments Card -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin:0;">
                  🚚 Active Shipments (${activeOrders.length})
                </h3>
                <a href="#buyer-orders" style="font-size:14px; color:#16a34a; font-weight:700; text-decoration:none;">View all</a>
              </div>

              <div style="display:flex; flex-direction:column; gap:12px;">
                ${
                  activeOrders.length === 0
                    ? `<p style="font-size:15px; color:#64748b; text-align:center; padding:30px 0;">No active shipments in transit.</p>`
                    : activeOrders.slice(0, 3).map(
                        o => `
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px;">
                      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <strong style="font-size:15px; color:#0f172a;">${o.id}</strong>
                        <span style="background:#dbeafe; color:#1d4ed8; font-size:12px; font-weight:700; padding:2px 6px; border-radius:4px;">${o.status}</span>
                      </div>
                      <p style="font-size:14px; color:#475569; margin:0 0 4px 0;">${o.listingTitle} (${o.quantity} ${o.unit})</p>
                      <span style="font-size:13px; color:#16a34a; font-weight:600;">📍 ${o.logistics?.currentLocation || "In Transit"}</span>
                    </div>
                  `
                      ).join("")
                }
              </div>
            </div>

          </div>

          <!-- AI Smart Recommended Waste Feed for this Buyer -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:21px;">✨</span>
                  <h3 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin:0;">
                    Smart AI Feed: Matched for ${currentUser.industry || "Your Plant"}
                  </h3>
                </div>
                <p style="font-size:14px; color:#64748b; margin-top:2px;">
                  Ranked by proximity distance, moisture specifications, and price suitability
                </p>
              </div>
              <a href="#buyer-recommendations" style="color:#16a34a; font-size:15px; font-weight:700; text-decoration:none;">Explore all →</a>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px;">
              ${recommendedListings.slice(0, 3)
                .map(
                  l => `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                      <span style="background:#f0fdf4; color:#16a34a; font-size:13px; font-weight:800; padding:2px 8px; border-radius:10px;">${l.categoryName}</span>
                      <span style="background:#dcfce7; color:#15803d; font-size:12px; font-weight:800; padding:2px 6px; border-radius:10px;">${l.matchScore}% Match</span>
                    </div>
                    <h4 style="font-size:17px; font-weight:700; color:#0f172a; margin-bottom:6px;">
                      <a href="#waste/${l.id}" style="color:inherit; text-decoration:none;">${l.title}</a>
                    </h4>
                    <p style="font-size:14px; color:#64748b; margin:0 0 10px 0;">📍 ${l.location} (${l.distanceKm} km)</p>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:10px;">
                    <strong style="font-size:19px; color:#16a34a;">${formatINR(l.price)} / Ton</strong>
                    <a href="#waste/${l.id}" style="background:#16a34a; color:white; padding:6px 12px; border-radius:6px; font-size:14px; font-weight:700; text-decoration:none;">Buy</a>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: ORDERS -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "orders"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:23px; font-weight:800; color:#0f172a; margin:0;">
                  🚚 Active Procurement Orders & Escrow Handshake
                </h2>
                <p style="font-size:15px; color:#64748b; margin:4px 0 0 0;">
                  Live GPS dispatch status, digital weighbridge inspection, and release of escrow milestone payments.
                </p>
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:16px;">
              ${
                orders.length > 0
                  ? orders
                      .map(
                        o => `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                  <div style="flex:1; min-width:260px;">
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
                      <span style="font-family:'Outfit', sans-serif; font-size:19px; font-weight:800; color:#0f172a;">Order #${o.id}</span>
                      <span style="background:${o.status === "Completed" ? "#dcfce7" : "#dbeafe"}; color:${o.status === "Completed" ? "#15803d" : "#1d4ed8"}; font-size:13px; font-weight:800; padding:2px 8px; border-radius:6px;">
                        ${o.status}
                      </span>
                    </div>
                    <p style="font-size:15px; color:#334155; margin:0 0 6px 0; font-weight:600;">
                      ${o.listingTitle} (${o.quantity} ${o.unit})
                    </p>
                    <div style="display:flex; gap:16px; font-size:14px; color:#64748b; flex-wrap:wrap;">
                      <span>🧑‍🌾 Farmer: <strong>${o.seller?.name || "Verified FPO"}</strong></span>
                      <span>🚛 Logistics: <strong>${o.logistics?.carrier || "Kisan Freight"} (${o.logistics?.vehicleNumber || "TN-38-AG-4921"})</strong></span>
                      <span>🔒 Escrow: <strong style="color:#16a34a;">${o.paymentStatus || "Secured"}</strong></span>
                    </div>
                  </div>

                  <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <span style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:800; color:#16a34a;">${formatINR(o.totalAmount)}</span>
                    <div style="display:flex; gap:8px;">
                      <button class="btn-view-esg-cert-order" data-id="${o.id}" style="background:#f0fdf4; border:1.5px solid #86efac; color:#15803d; padding:6px 12px; border-radius:6px; font-size:14px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                        🌱 ESG Cert
                      </button>
                      ${
                        o.status !== "Completed"
                          ? `
                        <button class="btn-buyer-confirm-delivery" data-id="${o.id}" style="background:#16a34a; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:14px; font-weight:700; cursor:pointer;">
                          Confirm Delivery & Release Escrow
                        </button>
                      `
                          : ""
                      }
                      <a href="#orders/${o.id}" style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:6px 12px; border-radius:6px; font-size:14px; font-weight:700; text-decoration:none;">
                        Track Details →
                      </a>
                    </div>
                  </div>
                </div>
              `
                      )
                      .join("")
                  : `
                <div style="padding:40px; text-align:center; color:#64748b;">
                  <p style="font-size:18px; font-weight:600;">No procurement orders placed yet.</p>
                  <a href="#marketplace" style="background:#16a34a; color:white; padding:8px 16px; border-radius:8px; font-size:15px; font-weight:700; text-decoration:none;">Browse Marketplace</a>
                </div>
              `
              }
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: ESG COMPLIANCE HUB (ENTERPRISE B2B) -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "esg"
            ? `
          <div>
            <!-- ESG Header & Action Bar -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px 28px; box-shadow:0 2px 10px rgba(15,61,33,0.04); margin-bottom:28px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
              <div>
                <div style="display:inline-flex; align-items:center; gap:6px; background:#dcfce7; color:#15803d; font-size:12.5px; font-weight:800; padding:3px 12px; border-radius:12px; margin-bottom:6px;">
                  <span>🌱</span> SEBI BRSR Core • Scope 3 Decarbonization Standard
                </div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin:0;">
                  Enterprise ESG & Decarbonization Audit Desk
                </h2>
                <p style="font-size:14px; color:#64748b; margin:4px 0 0 0; max-width:680px;">
                  Audited environmental accounting for agricultural biomass feedstock procured in lieu of open-field stubble burning, compliant with ISO 14064-2 and CPCB air quality directives.
                </p>
              </div>

              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button id="btn-export-esg-csv" style="background:#ffffff; border:1.5px solid #cbd5e1; color:#334155; padding:9px 16px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                  📊 Export BRSR Audit (CSV)
                </button>
                <button id="btn-print-consolidated-esg" style="background:linear-gradient(135deg, #15803d, #16a34a); color:white; border:none; padding:9px 18px; border-radius:10px; font-size:14px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(22,163,74,0.35);">
                  🖨️ Consolidated Annual ESG Certificate
                </button>
              </div>
            </div>

            <!-- 4 Verified Decarbonization KPI Cards -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:28px;">
              ${renderStatCard({
                title: "Certified CO₂e Mitigated",
                value: `${(totalTonsProcured * 1.48).toFixed(1)} Tons`,
                subtitle: "Stubble burning eliminated",
                icon: "☁️",
                color: "green",
                trend: { isPositive: true, text: "Scope 3 Offset" }
              })}

              ${renderStatCard({
                title: "Fossil Coal Displaced",
                value: `${(totalTonsProcured * 0.65).toFixed(1)} Tons`,
                subtitle: "Thermal boiler fuel replaced",
                icon: "⚡",
                color: "blue"
              })}

              ${renderStatCard({
                title: "PM2.5 Smog Prevented",
                value: `${(totalTonsProcured * 3.8).toFixed(0)} kg`,
                subtitle: "Toxic smoke particles avoided",
                icon: "💨",
                color: "purple"
              })}

              ${renderStatCard({
                title: "Tree Absorption Equiv.",
                value: `${Math.round((totalTonsProcured * 1.48 * 1000) / 22).toLocaleString("en-IN")}`,
                subtitle: "Preserved tree equivalent",
                icon: "🌲",
                color: "amber"
              })}
            </div>

            <!-- Certified Procurement Batches Table -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04); margin-bottom:28px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; gap:10px;">
                <div>
                  <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0;">
                    📜 Certified Sustainable Biomass Batches (${orders.length})
                  </h3>
                  <span style="font-size:13px; color:#64748b;">Each batch possesses an encrypted digital verification certificate ready for ESG audit submission.</span>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table style="width:100%; border-collapse:collapse; font-size:14px; text-align:left;">
                  <thead>
                    <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; color:#475569; font-weight:700;">
                      <th style="padding:12px 16px;">Certificate ID</th>
                      <th style="padding:12px 16px;">Biomass Feedstock</th>
                      <th style="padding:12px 16px;">Rural Producer Origin</th>
                      <th style="padding:12px 16px;">Weight</th>
                      <th style="padding:12px 16px;">CO₂e Abated</th>
                      <th style="padding:12px 16px;">Compliance Status</th>
                      <th style="padding:12px 16px; text-align:right;">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${orders
                      .map(o => {
                        const q = parseFloat(o.quantity) || 1;
                        const co2 = (q * 1.48).toFixed(2);
                        const cleanId = (o.id || "AGW-1001").replace(/[^a-zA-Z0-9]/g, "");
                        return `
                        <tr style="border-bottom:1px solid #f1f5f9; transition:background 0.15s;">
                          <td style="padding:14px 16px;">
                            <code style="font-family:monospace; font-weight:800; color:#14532d; background:#f0fdf4; padding:3px 8px; border-radius:6px; border:1px solid #bbf7d0;">
                              ESG-BRSR-${cleanId}
                            </code>
                            <div style="font-size:11px; color:#64748b; margin-top:2px;">Order #${o.id}</div>
                          </td>
                          <td style="padding:14px 16px;">
                            <strong style="color:#0f172a;">${o.listingTitle}</strong>
                            <div style="font-size:12px; color:#64748b;">Category: ${o.category}</div>
                          </td>
                          <td style="padding:14px 16px;">
                            <span style="font-weight:600; color:#334155;">${o.seller?.name || "Farmer"}</span>
                            <div style="font-size:12px; color:#64748b;">${o.seller?.farmName || "Farm gate"}</div>
                          </td>
                          <td style="padding:14px 16px; font-weight:800; color:#0f172a;">
                            ${o.quantity} ${o.unit}
                          </td>
                          <td style="padding:14px 16px;">
                            <span style="background:#dcfce7; color:#15803d; font-weight:800; font-size:13px; padding:2px 8px; border-radius:6px;">
                              ${co2} Tons
                            </span>
                          </td>
                          <td style="padding:14px 16px;">
                            <span style="display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:800; color:#16a34a;">
                              <span>●</span> Verified & Audit Ready
                            </span>
                          </td>
                          <td style="padding:14px 16px; text-align:right;">
                            <button class="btn-view-esg-cert-order" data-id="${o.id}" style="background:#16a34a; color:white; border:none; padding:7px 14px; border-radius:8px; font-size:13px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(22,163,74,0.25);">
                              <span>🌱</span> View & Print
                            </button>
                          </td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- SEBI BRSR Core Audit Methodology Callout Box -->
            <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:18px; padding:22px 26px; display:flex; gap:20px; align-items:flex-start;">
              <div style="background:#16a34a; color:white; width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0;">
                ⚖️
              </div>
              <div style="font-size:14px; color:#14532d; line-height:1.6;">
                <h4 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:800; margin:0 0 4px 0; color:#0f3d21;">
                  Regulatory Accreditation & Decarbonization Methodology
                </h4>
                <p style="margin:0 0 6px 0;">
                  Under the <strong>Securities and Exchange Board of India (SEBI) BRSR Core mandate</strong>, top 1,000 listed entities and their value-chain partners must report verified Scope 3 circular economy metrics. 
                  Biomass feedstocks aggregated via this exchange are certified non-fossil inputs, ensuring compliance with <strong>ISO 14064-2 GHG Project Accounting</strong> and the <strong>Central Pollution Control Board (CPCB) stubble burning abatement targets</strong>.
                </p>
                <div style="display:flex; gap:16px; font-size:12px; font-weight:700; color:#166534;">
                  <span>✓ 100% Traceability to Farm Gate</span>
                  <span>✓ Weighbridge Reconciled</span>
                  <span>✓ 0% Double Counting Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: RECOMMENDATIONS -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "recommendations"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:23px; font-weight:800; color:#0f172a; margin:0;">
                  ✨ AI Circular Bio-Match Feed
                </h2>
                <p style="font-size:15px; color:#64748b; margin:4px 0 0 0;">
                  Algorithmically scored agricultural residues matched for ${currentUser.companyName || "Your Industry"}.
                </p>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
              ${recommendedListings
                .map(
                  l => `
                <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between; transition:all 0.2s;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                      <span style="background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; font-size:13px; font-weight:800; padding:3px 8px; border-radius:8px;">
                        ${l.categoryName}
                      </span>
                      <span style="background:linear-gradient(135deg, #22c55e, #16a34a); color:white; font-size:13px; font-weight:800; padding:3px 8px; border-radius:8px;">
                        ⚡ ${l.matchScore}% Match
                      </span>
                    </div>

                    <h3 style="font-size:19px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                      <a href="#waste/${l.id}" style="color:inherit; text-decoration:none;">${l.title}</a>
                    </h3>

                    <p style="font-size:14px; color:#475569; margin:0 0 12px 0;">
                      ${l.description ? l.description.slice(0, 90) + "..." : "High quality dry agricultural residue with guaranteed moisture grade."}
                    </p>

                    <div style="display:flex; flex-direction:column; gap:4px; font-size:14px; color:#64748b; margin-bottom:14px; background:#ffffff; padding:10px; border-radius:8px; border:1px solid #e2ece2;">
                      <span>📍 <strong>Location:</strong> ${l.location} (${l.distanceKm} km away)</span>
                      <span>⚖️ <strong>Available:</strong> ${l.quantity} ${l.unit}</span>
                      <span>🔬 <strong>Moisture:</strong> ${l.moisture || "12%"} (${l.qualityGrade || "Grade A"})</span>
                    </div>
                  </div>

                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:12px;">
                    <div>
                      <span style="font-size:12px; color:#64748b; display:block;">Unit Price</span>
                      <strong style="font-size:21px; color:#16a34a;">${formatINR(l.price)}</strong>
                    </div>
                    <a href="#waste/${l.id}" style="background:#16a34a; color:white; padding:8px 16px; border-radius:8px; font-size:15px; font-weight:800; text-decoration:none; box-shadow:0 4px 10px rgba(22,163,74,0.25);">
                      Procure Batch →
                    </a>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: SAVED LISTINGS -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "favorites" || activeSubtab === "saved"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:23px; font-weight:800; color:#0f172a; margin:0;">
                  ⭐ Bookmarked & Saved Biomass Batches
                </h2>
                <p style="font-size:15px; color:#64748b; margin:4px 0 0 0;">
                  Quick access to listings shortlisted for your upcoming production cycles.
                </p>
              </div>
              <a href="#marketplace" style="background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; padding:8px 16px; border-radius:8px; font-size:15px; font-weight:700; text-decoration:none;">+ Browse More</a>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
              ${allListings.slice(0, 4)
                .map(
                  l => `
                <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                      <span style="background:#f0fdf4; color:#15803d; font-size:13px; font-weight:800; padding:3px 8px; border-radius:8px;">${l.categoryName}</span>
                      <span style="color:#eab308; font-size:19px;">★ Saved</span>
                    </div>
                    <h3 style="font-size:19px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">
                      <a href="#waste/${l.id}" style="color:inherit; text-decoration:none;">${l.title}</a>
                    </h3>
                    <p style="font-size:14px; color:#64748b; margin:0 0 10px 0;">📍 ${l.location} • Seller: <strong>${l.seller?.name || "Farmer"}</strong></p>
                    <div style="font-size:14px; color:#334155; background:#ffffff; padding:8px 12px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:12px;">
                      <span>Available: <strong>${l.quantity} ${l.unit}</strong></span> | <span>Moisture: <strong>${l.moisture || "12%"}</strong></span>
                    </div>
                  </div>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #e2e8f0; padding-top:12px;">
                    <strong style="font-size:21px; color:#16a34a;">${formatINR(l.price)} / Ton</strong>
                    <a href="#waste/${l.id}" style="background:#16a34a; color:white; padding:8px 16px; border-radius:8px; font-size:15px; font-weight:800; text-decoration:none;">Buy Now →</a>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: CHAT (FARMER MESSAGES) -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "chat"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; box-shadow:0 2px 10px rgba(15,61,33,0.04); height:650px; display:grid; grid-template-columns:320px 1fr; overflow:hidden;">
            <!-- Left Inbox -->
            <div style="border-right:1px solid #e2ece2; display:flex; flex-direction:column; background:#ffffff;">
              <div style="padding:16px; border-bottom:1px solid #f0f6f0;">
                <h3 style="font-family:'Outfit', sans-serif; font-size:19px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">💬 Farmer Messages</h3>
                <input type="text" placeholder="Search conversations..." style="width:100%; padding:8px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:15px; outline:none; box-sizing:border-box;" />
              </div>
              <div style="flex-grow:1; overflow-y:auto; padding:6px 0;">
                <div style="padding:14px 16px; border-bottom:1px solid #f1f5f9; background:#f0fdf4; cursor:pointer;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:17px; color:#0f172a;">Selvam Ramasamy (Farmer)</strong>
                    <span style="font-size:13px; color:#16a34a; font-weight:700;">10:45 AM</span>
                  </div>
                  <p style="font-size:14px; color:#64748b; margin:0;">Yes, our front-end tractor loader team will be on-site...</p>
                  <span style="font-size:13px; color:#16a34a; font-weight:700; display:block; margin-top:4px;">🌾 Pollachi FPO, Tamil Nadu</span>
                </div>
              </div>
            </div>

            <!-- Right Active Stream -->
            <div style="display:flex; flex-direction:column; background:#f8fafc;">
              <div style="background:#ffffff; border-bottom:1px solid #e2ece2; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:38px; height:38px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; display:flex; align-items:center; justify-content:center;">RP</div>
                  <div>
                    <h4 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;">Selvam Ramasamy (Pollachi FPO)</h4>
                    <span style="font-size:13px; color:#16a34a; font-weight:700;">● Online • Verified Producer</span>
                  </div>
                </div>
                <a href="#orders/AGW-1001" style="background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; font-size:13px; font-weight:700; padding:4px 10px; border-radius:6px; text-decoration:none;">View Active Batch #AGW-1001</a>
              </div>

              <div id="main-chat-messages" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
                <div style="align-self:flex-end; max-width:70%; background:#0284c7; color:white; padding:10px 14px; border-radius:12px 12px 2px 12px;">
                  <p style="font-size:15px; margin:0 0 4px 0;">Vanakkam Selvam avargale! Could you confirm if all 12.5 tons are round machine baled?</p>
                  <span style="font-size:12px; color:#bae6fd;">10:30 AM</span>
                </div>
                <div style="align-self:flex-start; max-width:70%; background:#ffffff; border:1px solid #e2e8f0; padding:10px 14px; border-radius:12px 12px 12px 2px;">
                  <p style="font-size:15px; color:#0f172a; margin:0 0 4px 0;">Vanakkam Senthil avargale! Yes, all 12.5 tons are round machine baled at 11% moisture in our elevated shed.</p>
                  <span style="font-size:12px; color:#94a3b8;">10:35 AM</span>
                </div>
              </div>

              <form id="main-chat-form" data-conv-id="conv-1" style="background:#ffffff; border-top:1px solid #e2ece2; padding:12px 16px; display:flex; gap:10px;">
                <input type="text" id="main-chat-input" placeholder="Type message to farmer..." required style="flex-grow:1; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:10px; font-size:17px; outline:none;" />
                <button type="submit" style="background:#0284c7; color:white; border:none; padding:0 18px; border-radius:10px; font-size:17px; font-weight:700; cursor:pointer;">Send →</button>
              </form>
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: COMPANY PROFILE -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "profile"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:28px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #f1f5f9; padding-bottom:16px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:25px; font-weight:800; color:#0f172a; margin:0;">
                  🏭 Industrial Enterprise & Bio-Procurement Profile
                </h2>
                <p style="font-size:15px; color:#64748b; margin:4px 0 0 0;">
                  Manage plant capacity, boiler fuel specifications, GSTIN, and weighbridge delivery points.
                </p>
              </div>
              <span style="background:#e0f2fe; border:1.5px solid #7dd3fc; color:#0369a1; font-size:14px; font-weight:800; padding:6px 14px; border-radius:20px; display:inline-flex; align-items:center; gap:6px;">
                <span>✓</span> Verified Corporate Buyer
              </span>
            </div>

            <form id="profile-form" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
              <div>
                <label style="display:block; font-size:15px; font-weight:700; color:#334155; margin-bottom:6px;">Authorized Procurement Officer</label>
                <input type="text" id="profile-name" value="${currentUser.name}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:17px; outline:none; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:15px; font-weight:700; color:#334155; margin-bottom:6px;">Company / Refinery Entity</label>
                <input type="text" id="profile-company" value="${currentUser.companyName || 'Kongu AgriFeed Bio-Industries Ltd'}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:17px; outline:none; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:15px; font-weight:700; color:#334155; margin-bottom:6px;">Industry Type & Primary Application</label>
                <input type="text" value="${currentUser.industry || 'Bio-CNG & Renewable Biomass Power'}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:17px; outline:none; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:15px; font-weight:700; color:#334155; margin-bottom:6px;">Plant Delivery Hub / Weighbridge</label>
                <input type="text" id="profile-location" value="${currentUser.location || 'SIDCO Industrial Estate, Coimbatore, Tamil Nadu'}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:17px; outline:none; box-sizing:border-box;" />
              </div>

              <div style="grid-column:span 2; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h4 style="font-size:17px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">🏢 Corporate Verification & Tax Status</h4>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:15px;">
                  <div><strong>GSTIN:</strong> 33AAACK9481Q1Z4 (Active)</div>
                  <div><strong>CPCB Compliance:</strong> BIO-POWER-REG-2026-992</div>
                  <div><strong>Monthly Capacity:</strong> 2,400 Metric Tons</div>
                </div>
              </div>

              <div style="grid-column:span 2;">
                <button type="submit" style="background:#0284c7; color:white; border:none; padding:12px 24px; border-radius:8px; font-size:17px; font-weight:800; cursor:pointer;">
                  Update Company Profile →
                </button>
              </div>
            </form>
          </div>
        `
            : ""
        }

      </main>
    </div>
  `;
}

