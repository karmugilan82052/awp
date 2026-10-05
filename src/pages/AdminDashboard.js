/**
 * Administrator Console & Platform Moderation Component
 */

import { store } from "../store/state.js";
import { formatINR } from "../utils/formatters.js";
import { renderStatCard } from "../components/StatCard.js";
import { renderSidebar } from "../components/Sidebar.js";
import { INITIAL_CATEGORIES } from "../store/initialData.js";
import { exportToCSV } from "../services/exportService.js";

export function renderAdminDashboardPage(activeSubtab = "overview") {
  const users = store.getUsers();
  const farmers = users.filter(u => u.role === "farmer");
  const buyers = users.filter(u => u.role === "buyer");
  const listings = store.getListings({ includeAllStatuses: true });
  const pendingListings = listings.filter(l => l.status === "Pending Approval");
  const orders = store.getOrders();
  const complaints = store.getComplaints();
  const sustainability = store.getSustainabilityMetrics();

  let totalPlatformRevenue = 0;
  orders.forEach(o => {
    totalPlatformRevenue += o.platformFee || 0;
  });

  return `
    <div class="page-admin-dashboard" style="display:flex; background:#f7faf7; min-height:85vh; font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- Sidebar -->
      ${renderSidebar(activeSubtab, "admin")}

      <!-- Main Content -->
      <main style="flex-grow:1; padding:32px 30px; overflow-x:hidden;">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px; flex-wrap:wrap; gap:16px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
                🛡️ Platform Administrator Console
              </h1>
              <span style="background:#f3e8ff; color:#7c3aed; font-size:11px; font-weight:800; padding:3px 10px; border-radius:12px;">Super Admin</span>
            </div>
            <p style="font-size:13px; color:#64748b; margin-top:4px;">
              National AgriWaste Exchange Governance, Escrow Settlement, and Quality Moderation
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="btn-export-admin-csv" style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:9px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
              📑 Export CSV Reports
            </button>
            <button id="btn-reset-demo-state" style="background:#fee2e2; border:1px solid #fecaca; color:#dc2626; padding:9px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
              🔄 Reset Demo Data
            </button>
          </div>
        </div>

        <!-- 4 Platform Metric Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:18px; margin-bottom:24px;">
          ${renderStatCard({
            title: "Total Platform Farmers",
            value: `${farmers.length}`,
            subtitle: "Verified Indian FPOs",
            icon: "🧑‍🌾",
            color: "green"
          })}

          ${renderStatCard({
            title: "Industrial Buyers",
            value: `${buyers.length}`,
            subtitle: "Biomass & Bio-CNG Refiners",
            icon: "🏭",
            color: "blue"
          })}

          ${renderStatCard({
            title: "Platform Revenue",
            value: formatINR(totalPlatformRevenue || 452000),
            subtitle: "2% Commission on Escrow",
            icon: "💰",
            color: "purple"
          })}

          ${renderStatCard({
            title: "Pending Approvals",
            value: `${pendingListings.length}`,
            subtitle: "Awaiting Moderation",
            icon: "⏳",
            color: "amber"
          })}

          ${renderStatCard({
            title: "Dispute Tickets",
            value: `${complaints.filter(c => c.status !== "Resolved").length}`,
            subtitle: "Open Arbitration Cases",
            icon: "🛡️",
            color: "red"
          })}
        </div>

        <!-- AGRIWASTE INTELLIGENCE ANALYTICS ADMIN SECTION -->
        ${(() => {
          const intel = store.getPlatformIntelligenceMetrics();

          return `
            <div style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius:18px; padding:24px; margin-bottom:32px; color:#ffffff; box-shadow:0 6px 20px rgba(15,23,42,0.12);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-size:24px;">🧠</span>
                  <div>
                    <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#ffffff; margin:0;">
                      AGRIWASTE INTELLIGENCE PLATFORM ANALYTICS
                    </h3>
                    <p style="font-size:12px; color:#94a3b8; margin:2px 0 0 0;">
                      National biomass suitability index, value optimization, and environmental impact mitigation metrics.
                    </p>
                  </div>
                </div>
                <a href="#intelligence" style="background:#10b981; hover:background:#059669; color:#ffffff; padding:8px 16px; border-radius:10px; font-size:12px; font-weight:700; text-decoration:none;">
                  View Intelligence Engine →
                </a>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:14px;">
                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Listings Analyzed</div>
                  <div style="font-size:22px; font-weight:800; color:#ffffff; margin-top:2px;">${intel.totalListingsAnalyzed} Listings</div>
                  <div style="font-size:10px; color:#34d399;">100% Quality Evaluated</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Avg Suitability (WSS)</div>
                  <div style="font-size:22px; font-weight:800; color:#34d399; margin-top:2px;">${intel.avgSuitabilityScore}/100</div>
                  <div style="font-size:10px; color:#cbd5e1;">Suitable Platform Index</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Top Recommended App</div>
                  <div style="font-size:13px; font-weight:800; color:#60a5fa; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${intel.mostRecommendedApp}</div>
                  <div style="font-size:10px; color:#cbd5e1;">Highest Value Pathway</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">Supply Aggregations</div>
                  <div style="font-size:22px; font-weight:800; color:#f59e0b; margin-top:2px;">${intel.activeAggregationOpportunities} Clusters</div>
                  <div style="font-size:10px; color:#cbd5e1;">Multi-Farmer Pools</div>
                </div>

                <div style="background:rgba(255,255,255,0.06); padding:14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08);">
                  <div style="font-size:11px; color:#94a3b8; font-weight:600;">CO₂e Avoided</div>
                  <div style="font-size:22px; font-weight:800; color:#a7f3d0; margin-top:2px;">${intel.totalCO2AvoidedTons} Tons</div>
                  <div style="font-size:10px; color:#34d399;">Open Burning Mitigation</div>
                </div>
              </div>
            </div>
          `;
        })()}

        <!-- Tab Navigation for Admin Views -->
        <div style="display:flex; gap:8px; margin-bottom:24px; border-bottom:1px solid #e2ece2; padding-bottom:12px; overflow-x:auto;">
          <a href="#admin-dashboard" class="admin-tab-btn ${activeSubtab === "overview" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "overview" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "overview" ? "#ffffff" : "#475569"};">Overview Analytics</a>
          
          <a href="#admin-listings" class="admin-tab-btn ${activeSubtab === "listings" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "listings" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "listings" ? "#ffffff" : "#475569"};">Listing Moderation (${listings.length})</a>
          
          <a href="#admin-users" class="admin-tab-btn ${activeSubtab === "users" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "users" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "users" ? "#ffffff" : "#475569"};">User KYC Verification (${users.length})</a>
          
          <a href="#admin-orders" class="admin-tab-btn ${activeSubtab === "orders" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "orders" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "orders" ? "#ffffff" : "#475569"};">Orders & Escrow (${orders.length})</a>
          
          <a href="#admin-complaints" class="admin-tab-btn ${activeSubtab === "complaints" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "complaints" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "complaints" ? "#ffffff" : "#475569"};">Dispute Arbitration (${complaints.length})</a>
          
          <a href="#admin-categories" class="admin-tab-btn ${activeSubtab === "categories" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "categories" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "categories" ? "#ffffff" : "#475569"};">Category Manager</a>

          <a href="#admin-reports" class="admin-tab-btn ${activeSubtab === "reports" ? "active" : ""}" style="padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; background:${
    activeSubtab === "reports" ? "#16a34a" : "transparent"
  }; color:${activeSubtab === "reports" ? "#ffffff" : "#475569"};">Reports & Exports</a>
        </div>

        <!-- CONDITIONAL SUBTAB VIEWS -->
        ${
          activeSubtab === "overview"
            ? `
          <!-- Analytics Charts -->
          <div style="display:grid; grid-template-columns:1.4fr 1fr; gap:24px; margin-bottom:32px;" class="dashboard-charts-grid">
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:16px;">
                📈 National Exchange Monthly Trading Volume (Tons)
              </h3>
              <div style="height:250px; position:relative;">
                <canvas id="admin-volume-chart"></canvas>
              </div>
            </div>

            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:16px;">
                🇮🇳 State Leaderboard by Biomass Traded
              </h3>
              <div style="height:250px; position:relative;">
                <canvas id="admin-state-chart"></canvas>
              </div>
            </div>
          </div>
        `
            : ""
        }

        ${
          activeSubtab === "listings" || activeSubtab === "overview"
            ? `
          <!-- Listings Moderation Table -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:32px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                Listing Moderation Queue
              </h3>
              <span style="font-size:12px; color:#64748b;">Review and approve new farmer submissions</span>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#64748b;">
                    <th style="padding:12px 16px;">Listing Title</th>
                    <th style="padding:12px 16px;">Farmer / Seller</th>
                    <th style="padding:12px 16px;">Location</th>
                    <th style="padding:12px 16px;">Qty</th>
                    <th style="padding:12px 16px;">Price</th>
                    <th style="padding:12px 16px;">Status</th>
                    <th style="padding:12px 16px; text-align:right;">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${listings.slice(0, 10)
                    .map(
                      l => `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:12px 16px; font-weight:700;">
                        <a href="#waste/${l.id}" style="color:#0f172a; text-decoration:none;">${l.title}</a>
                      </td>
                      <td style="padding:12px 16px;">${l.seller?.name || "Farmer"}</td>
                      <td style="padding:12px 16px; color:#64748b;">${l.location}</td>
                      <td style="padding:12px 16px; font-weight:600;">${l.quantity} ${l.unit}</td>
                      <td style="padding:12px 16px; font-weight:700; color:#16a34a;">${formatINR(l.price)}</td>
                      <td style="padding:12px 16px;">
                        <span style="background:${l.status === "Approved" ? "#dcfce7" : "#fef3c7"}; color:${
                        l.status === "Approved" ? "#15803d" : "#b45309"
                      }; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">
                          ${l.status}
                        </span>
                      </td>
                      <td style="padding:12px 16px; text-align:right;">
                        <button class="btn-admin-approve" data-id="${l.id}" style="background:#16a34a; color:white; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; margin-right:6px;">Approve</button>
                        <button class="btn-admin-reject" data-id="${l.id}" style="background:#fee2e2; color:#dc2626; border:1px solid #fecaca; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">Reject</button>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        `
            : ""
        }

        ${
          activeSubtab === "users"
            ? `
          <!-- Users Moderation Table -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:32px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                User KYC & Verification Management
              </h3>
              <span style="font-size:12px; color:#64748b;">Verify Aadhaar, GSTIN, and land certificates</span>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#64748b;">
                    <th style="padding:12px 16px;">User Name</th>
                    <th style="padding:12px 16px;">Role</th>
                    <th style="padding:12px 16px;">Organization / Farm</th>
                    <th style="padding:12px 16px;">Location</th>
                    <th style="padding:12px 16px;">KYC Status</th>
                    <th style="padding:12px 16px; text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${users
                    .map(
                      u => `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:12px 16px; font-weight:700; color:#0f172a;">${u.name}</td>
                      <td style="padding:12px 16px;">
                        <span style="background:${u.role === "farmer" ? "#dcfce7" : u.role === "buyer" ? "#e0f2fe" : "#f3e8ff"}; color:${
                        u.role === "farmer" ? "#15803d" : u.role === "buyer" ? "#0284c7" : "#7c3aed"
                      }; font-size:11px; font-weight:800; padding:3px 8px; border-radius:10px; text-transform:uppercase;">
                          ${u.role}
                        </span>
                      </td>
                      <td style="padding:12px 16px; color:#475569;">${u.companyName || u.farmName || "Individual Producer"}</td>
                      <td style="padding:12px 16px; color:#64748b;">${u.location}</td>
                      <td style="padding:12px 16px;">
                        <span style="color:#16a34a; font-weight:700;">✓ Verified</span>
                      </td>
                      <td style="padding:12px 16px; text-align:right;">
                        <button class="btn-toggle-suspend" data-id="${u.id}" style="background:${
                        u.isSuspended ? "#dcfce7" : "#fee2e2"
                      }; color:${u.isSuspended ? "#15803d" : "#dc2626"}; border:none; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">
                          ${u.isSuspended ? "Activate" : "Suspend"}
                        </button>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        `
            : ""
        }

        ${
          activeSubtab === "complaints"
            ? `
          <!-- Dispute Arbitration Desk -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#dc2626; margin:0;">
                🛡️ Dispute Arbitration Desk
              </h3>
              <span style="font-size:12px; color:#64748b;">Escrow dispute arbitration cases</span>
            </div>

            <div style="display:flex; flex-direction:column; gap:16px;">
              ${complaints
                .map(
                  c => `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div>
                      <strong style="font-size:15px; color:#0f172a;">Case #${c.id}</strong>
                      <span style="color:#64748b; font-size:12px; margin-left:8px;">Order: <a href="#orders/${c.orderId}" style="color:#16a34a; font-weight:700;">#${c.orderId}</a></span>
                    </div>
                    <span style="background:${c.status === "Resolved" ? "#dcfce7" : "#fee2e2"}; color:${
                    c.status === "Resolved" ? "#15803d" : "#dc2626"
                  }; font-size:11px; font-weight:800; padding:3px 10px; border-radius:10px;">
                      ${c.status}
                    </span>
                  </div>

                  <p style="font-size:13px; color:#334155; margin-bottom:10px;"><strong>Issue:</strong> ${c.complaintType} - ${c.description}</p>
                  
                  <div style="background:#ffffff; padding:10px 14px; border-radius:8px; border:1px solid #e2ece2; font-size:12px; color:#475569; margin-bottom:12px;">
                    <strong>Admin Arbitration Note:</strong> ${c.adminResponse || "Under review by arbitration panel."}
                  </div>

                  ${
                    c.status !== "Resolved"
                      ? `
                    <button class="btn-resolve-dispute" data-id="${c.id}" style="background:#16a34a; color:white; border:none; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                      Mark Dispute as Arbitrated & Resolved
                    </button>
                  `
                      : ""
                  }
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          activeSubtab === "categories"
            ? `
          <!-- Category Manager -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                Category & Waste-to-Product Rules Manager
              </h3>
              <button id="btn-add-new-category" style="background:#16a34a; color:white; border:none; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
                + Add New Waste Category
              </button>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px;">
              ${INITIAL_CATEGORIES.map(
                cat => `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                  <strong style="font-size:15px; color:#0f172a; display:block; margin-bottom:4px;">${cat.name}</strong>
                  <span style="font-size:11px; color:#16a34a; font-weight:700; display:block; margin-bottom:8px;">${cat.group} • ${cat.count}</span>
                  <p style="font-size:12px; color:#64748b; margin:0 0 10px 0;">${cat.description}</p>
                  <span style="font-size:11px; color:#334155; font-weight:600;">Top Uses: ${(cat.applications || []).map(a => a.name).slice(0, 2).join(", ")}</span>
                </div>
              `
              ).join("")}
            </div>
          </div>
        `
            : ""
        }

        ${
          activeSubtab === "reports"
            ? `
          <!-- Reports Export Center -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
              📑 National Platform Audit & Tax Reports
            </h3>
            <p style="font-size:13px; color:#64748b; margin-bottom:24px;">
              Generate and download standardized spreadsheet audit logs for circular economy compliance and tax reporting.
            </p>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:20px;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px;">
                <strong style="font-size:15px; color:#0f172a; display:block; margin-bottom:6px;">Farmers Registry Report</strong>
                <p style="font-size:12px; color:#64748b; margin-bottom:14px;">Complete directory of registered FPOs, farm locations, and Aadhaar KYC.</p>
                <button class="btn-export-specific-report" data-type="farmers" style="background:#16a34a; color:white; border:none; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">Download CSV</button>
              </div>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px;">
                <strong style="font-size:15px; color:#0f172a; display:block; margin-bottom:6px;">Buyer Procurement & Escrow Log</strong>
                <p style="font-size:12px; color:#64748b; margin-bottom:14px;">Industrial purchases, GST tax collection, and freight reconciliation.</p>
                <button class="btn-export-specific-report" data-type="orders" style="background:#16a34a; color:white; border:none; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">Download CSV</button>
              </div>

              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:20px;">
                <strong style="font-size:15px; color:#0f172a; display:block; margin-bottom:6px;">Sustainability & Carbon Credits</strong>
                <p style="font-size:12px; color:#64748b; margin-bottom:14px;">Tons of open burning avoided, CO₂ mitigation metrics by district.</p>
                <button class="btn-export-specific-report" data-type="sustainability" style="background:#16a34a; color:white; border:none; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">Download CSV</button>
              </div>
            </div>
          </div>
        `
            : ""
        }

      </main>
    </div>
  `;
}
