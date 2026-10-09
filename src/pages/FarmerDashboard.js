/**
 * Farmer Dashboard Component with Revenue Charts, Order Management, Listings, and Payouts
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
            <div style="display:flex; align-items:center; gap:8px;">
              <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
                🌾 ${currentUser.name}
              </h1>
              <span style="background:#dcfce7; color:#15803d; font-size:11px; font-weight:800; padding:3px 10px; border-radius:12px;">KYC Verified FPO</span>
            </div>
            <p style="font-size:13px; color:#64748b; margin-top:4px;">
              ${currentUser.farmName || "GreenFarm Agro"} • 📍 ${currentUser.location} • Active Bio-Supplier
            </p>
          </div>
          <div style="display:flex; gap:10px;">
            <a href="#sell-waste" style="background:#16a34a; color:white; padding:10px 20px; border-radius:10px; font-size:14px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
              <span>+</span> Add New Waste Listing
            </a>
          </div>
        </div>

        <!-- 4 Key Stat Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-bottom:32px;">
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

        <!-- ==================================================== -->
        <!-- SUBTAB: OVERVIEW -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "overview"
            ? `
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

          <!-- My Listings Management Quick Table -->
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; margin-bottom:32px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
              <div>
                <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                  My Agricultural Waste Listings (${farmerListings.length})
                </h3>
                <span style="font-size:12px; color:#64748b;">Manage pricing, available tons, and publishing status</span>
              </div>
              <a href="#farmer-listings" style="background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a; padding:6px 14px; border-radius:8px; font-size:12px; font-weight:700; text-decoration:none;">View All Listings →</a>
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
                  ${farmerListings.slice(0, 5)
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
              <a href="#farmer-orders" style="color:#16a34a; font-size:13px; font-weight:700; text-decoration:none;">View all orders →</a>
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
                      ${o.listingTitle} • Buyer: <strong>${o.buyer?.name || "Industrial Buyer"}</strong> (${o.quantity} ${o.unit})
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
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: LISTINGS -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "listings"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0;">
                  🌾 My Agricultural Waste Inventory (${farmerListings.length} Active)
                </h2>
                <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">
                  Full control over your bio-waste inventory, baled stocks, moisture grades, and unit pricing.
                </p>
              </div>
              <a href="#sell-waste" style="background:#16a34a; color:white; padding:9px 18px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                <span>+</span> Post New Batch
              </a>
            </div>

            <div style="overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; text-align:left; color:#64748b;">
                    <th style="padding:12px 16px;">Listing Title</th>
                    <th style="padding:12px 16px;">Crop Category</th>
                    <th style="padding:12px 16px;">Available Tons</th>
                    <th style="padding:12px 16px;">Price / MT</th>
                    <th style="padding:12px 16px;">Quality & Moisture</th>
                    <th style="padding:12px 16px;">Status</th>
                    <th style="padding:12px 16px; text-align:right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${
                    farmerListings.length > 0
                      ? farmerListings
                          .map(
                            l => `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:14px 16px; font-weight:700; color:#0f172a;">
                        <div style="display:flex; align-items:center; gap:10px;">
                          <div style="width:36px; height:36px; border-radius:6px; background:#f0fdf4; display:flex; align-items:center; justify-content:center; font-size:18px;">🌱</div>
                          <div>
                            <a href="#waste/${l.id}" style="color:inherit; text-decoration:none;">${l.title}</a>
                            <span style="display:block; font-size:11px; color:#64748b; font-weight:400;">ID: ${l.id}</span>
                          </div>
                        </div>
                      </td>
                      <td style="padding:14px 16px; color:#16a34a; font-weight:600;">${l.categoryName}</td>
                      <td style="padding:14px 16px; font-weight:700;">${l.quantity} ${l.unit}</td>
                      <td style="padding:14px 16px; font-weight:800; color:#0f172a;">${formatINR(l.price)}</td>
                      <td style="padding:14px 16px;">
                        <span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:600; color:#334155;">${l.qualityGrade || "Grade A"} • ${l.moisture || "12% MC"}</span>
                      </td>
                      <td style="padding:14px 16px;">
                        <span style="background:${l.status === "Approved" ? "#dcfce7" : "#fef3c7"}; color:${
                              l.status === "Approved" ? "#15803d" : "#b45309"
                            }; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700;">
                          ${l.status}
                        </span>
                      </td>
                      <td style="padding:14px 16px; text-align:right;">
                        <a href="#waste/${l.id}" style="color:#16a34a; font-weight:700; text-decoration:none; margin-right:12px;">View</a>
                        <button class="btn-delete-listing" data-id="${l.id}" style="background:#fee2e2; color:#dc2626; border:1px solid #fecaca; padding:4px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">Delete</button>
                      </td>
                    </tr>
                  `
                          )
                          .join("")
                      : `
                    <tr>
                      <td colspan="7" style="padding:40px; text-align:center; color:#64748b;">
                        <p style="font-size:16px; font-weight:700; margin-bottom:8px;">No waste listings found</p>
                        <a href="#sell-waste" style="background:#16a34a; color:white; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; text-decoration:none;">+ Create First Listing</a>
                      </td>
                    </tr>
                  `
                  }
                </tbody>
              </table>
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
                <h2 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:800; color:#0f172a; margin:0;">
                  📦 Incoming Buyer Orders & Dispatch Management
                </h2>
                <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">
                  Accept orders, schedule weighbridge pickups, and monitor bank escrow release status.
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
                      <span style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:800; color:#0f172a;">Order #${o.id}</span>
                      <span style="background:${o.status === "Completed" ? "#dcfce7" : "#dbeafe"}; color:${o.status === "Completed" ? "#15803d" : "#1d4ed8"}; font-size:11px; font-weight:800; padding:2px 8px; border-radius:6px;">
                        ${o.status}
                      </span>
                    </div>
                    <p style="font-size:13px; color:#334155; margin:0 0 6px 0; font-weight:600;">
                      ${o.listingTitle} (${o.quantity} ${o.unit})
                    </p>
                    <div style="display:flex; gap:16px; font-size:12px; color:#64748b;">
                      <span>🏢 Buyer: <strong>${o.buyer?.name || "Industrial Buyer"}</strong></span>
                      <span>📅 Date: ${o.createdAt || "Recent"}</span>
                      <span>🔒 Escrow: <strong style="color:#16a34a;">${o.paymentStatus || "Protected"}</strong></span>
                    </div>
                  </div>

                  <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <span style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:800; color:#16a34a;">${formatINR(o.totalAmount)}</span>
                    <div style="display:flex; gap:8px;">
                      ${
                        o.status !== "Completed" && o.status !== "Delivered"
                          ? `
                        <button class="btn-farmer-accept-order" data-id="${o.id}" style="background:#16a34a; color:white; border:none; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                          Mark Baled & Ready
                        </button>
                      `
                          : ""
                      }
                      <a href="#orders/${o.id}" style="background:#ffffff; border:1px solid #cbd5e1; color:#334155; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; text-decoration:none;">
                        View Slip →
                      </a>
                    </div>
                  </div>
                </div>
              `
                      )
                      .join("")
                  : `
                <div style="padding:40px; text-align:center; color:#64748b;">
                  <p style="font-size:15px; font-weight:600;">No orders received yet.</p>
                </div>
              `
              }
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: EARNINGS -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "earnings"
            ? `
          <div style="display:grid; grid-template-columns:1fr 1.5fr; gap:24px; margin-bottom:32px;">
            
            <!-- Bank Escrow Wallet Card -->
            <div style="background:linear-gradient(135deg, #052e16 0%, #15803d 100%); color:#ffffff; border-radius:18px; padding:24px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 10px 25px rgba(22,163,74,0.2);">
              <div>
                <span style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.6px; color:#86efac;">
                  Direct Escrow Balance
                </span>
                <h2 style="font-family:'Outfit', sans-serif; font-size:32px; font-weight:800; margin:8px 0 4px 0; color:#ffffff;">
                  ${formatINR(totalEarnings || 284500)}
                </h2>
                <p style="font-size:12px; color:#bbf7d0; margin:0;">
                  Protected by RBI-Compliant Escrow Settlement Handshake
                </p>
              </div>

              <div style="margin:20px 0; background:rgba(255,255,255,0.1); border-radius:12px; padding:12px 14px; border:1px solid rgba(255,255,255,0.18);">
                <span style="font-size:10px; text-transform:uppercase; color:#86efac; font-weight:700;">Linked Kisan Bank Account</span>
                <p style="margin:4px 0 0 0; font-size:13px; font-weight:700;">
                  State Bank of India (SBI) • A/C •••• 6842
                </p>
                <span style="font-size:11px; color:#dcfce7;">IFSC: SBIN0001423 • Verified DBT Active ✔</span>
              </div>

              <button id="btn-request-payout" style="width:100%; background:#ffffff; color:#15803d; border:none; padding:12px; border-radius:10px; font-size:14px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                Withdraw Funds to Bank Account →
              </button>
            </div>

            <!-- Escrow Ledger History -->
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0 0 16px 0;">
                📜 Escrow Settlement & Payout Ledger
              </h3>
              
              <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:13px; color:#0f172a;">Settlement #SET-9482 (Order #AGW-1001)</strong>
                    <span style="display:block; font-size:11px; color:#64748b;">12.5 MT Paddy Straw • UTR: SBI948102948102</span>
                  </div>
                  <span style="font-weight:800; color:#16a34a; font-size:14px;">+ ₹37,500</span>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:13px; color:#0f172a;">Settlement #SET-9471 (Order #AGW-1002)</strong>
                    <span style="display:block; font-size:11px; color:#64748b;">18.0 MT Sugarcane Bagasse • UTR: HDFC882710293810</span>
                  </div>
                  <span style="font-weight:800; color:#16a34a; font-size:14px;">+ ₹55,800</span>
                </div>

                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="font-size:13px; color:#0f172a;">Settlement #SET-9460 (Order #AGW-1003)</strong>
                    <span style="display:block; font-size:11px; color:#64748b;">6.0 MT Cotton Stalk • UTR: ICIC773619283719</span>
                  </div>
                  <span style="font-weight:800; color:#16a34a; font-size:14px;">+ ₹25,200</span>
            </div>

          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: CHAT (BUYER INQUIRIES) -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "chat"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; box-shadow:0 2px 10px rgba(15,61,33,0.04); height:650px; display:grid; grid-template-columns:320px 1fr; overflow:hidden;">
            <!-- Left Inbox -->
            <div style="border-right:1px solid #e2ece2; display:flex; flex-direction:column; background:#ffffff;">
              <div style="padding:16px; border-bottom:1px solid #f0f6f0;">
                <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:800; color:#0f172a; margin:0 0 6px 0;">💬 Buyer Inquiries</h3>
                <input type="text" placeholder="Search chats..." style="width:100%; padding:8px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px; outline:none; box-sizing:border-box;" />
              </div>
              <div style="flex-grow:1; overflow-y:auto; padding:6px 0;">
                <div style="padding:14px 16px; border-bottom:1px solid #f1f5f9; background:#f0fdf4; cursor:pointer;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:14px; color:#0f172a;">AgroFeed Refineries</strong>
                    <span style="font-size:11px; color:#16a34a; font-weight:700;">10:45 AM</span>
                  </div>
                  <p style="font-size:12px; color:#64748b; margin:0;">Yes, our front-end tractor loader team will be on-site...</p>
                  <span style="font-size:11px; color:#16a34a; font-weight:700; display:block; margin-top:4px;">🌾 Paddy Straw (12.5 MT)</span>
                </div>
                <div style="padding:14px 16px; border-bottom:1px solid #f1f5f9; cursor:pointer;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="font-size:14px; color:#0f172a;">Punjab Bio-Power Co.</strong>
                    <span style="font-size:11px; color:#94a3b8;">Yesterday</span>
                  </div>
                  <p style="font-size:12px; color:#64748b; margin:0;">Inquiry regarding moisture level in batch #LST-1002</p>
                </div>
              </div>
            </div>

            <!-- Right Active Stream -->
            <div style="display:flex; flex-direction:column; background:#f8fafc;">
              <div style="background:#ffffff; border-bottom:1px solid #e2ece2; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:38px; height:38px; border-radius:50%; background:#e0f2fe; color:#0284c7; font-weight:800; display:flex; align-items:center; justify-content:center;">AF</div>
                  <div>
                    <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Rajesh Sharma (AgroFeed Ltd)</h4>
                    <span style="font-size:11px; color:#16a34a; font-weight:700;">● Online • Industrial Buyer</span>
                  </div>
                </div>
                <span style="background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; font-size:11px; font-weight:700; padding:4px 10px; border-radius:6px;">Order #AGW-1001 Active</span>
              </div>

              <div id="main-chat-messages" style="flex-grow:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">
                <div style="align-self:flex-start; max-width:70%; background:#ffffff; border:1px solid #e2e8f0; padding:10px 14px; border-radius:12px 12px 12px 2px;">
                  <p style="font-size:13px; color:#0f172a; margin:0 0 4px 0;">Namaste Ramesh ji! Could you confirm if all 12.5 tons are round machine baled?</p>
                  <span style="font-size:10px; color:#94a3b8;">10:30 AM</span>
                </div>
                <div style="align-self:flex-end; max-width:70%; background:#16a34a; color:white; padding:10px 14px; border-radius:12px 12px 2px 12px;">
                  <p style="font-size:13px; margin:0 0 4px 0;">Namaste Rajesh ji! Yes, all 12.5 tons are round machine baled at 11% moisture in our elevated shed.</p>
                  <span style="font-size:10px; color:#dcfce7;">10:35 AM</span>
                </div>
              </div>

              <form id="main-chat-form" data-conv-id="conv-1" style="background:#ffffff; border-top:1px solid #e2ece2; padding:12px 16px; display:flex; gap:10px;">
                <input type="text" id="main-chat-input" placeholder="Type your message to buyer..." required style="flex-grow:1; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:10px; font-size:14px; outline:none;" />
                <button type="submit" style="background:#16a34a; color:white; border:none; padding:0 18px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">Send →</button>
              </form>
            </div>
          </div>
        `
            : ""
        }

        <!-- ==================================================== -->
        <!-- SUBTAB: PROFILE & KYC -->
        <!-- ==================================================== -->
        ${
          activeSubtab === "profile"
            ? `
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:28px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; border-bottom:1px solid #f1f5f9; padding-bottom:16px;">
              <div>
                <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; color:#0f172a; margin:0;">
                  🚜 Farm Profile & Government KYC Verification
                </h2>
                <p style="font-size:13px; color:#64748b; margin:4px 0 0 0;">
                  Manage verified FPO details, land records, and direct escrow bank accounts.
                </p>
              </div>
              <span style="background:#dcfce7; border:1.5px solid #86efac; color:#15803d; font-size:12px; font-weight:800; padding:6px 14px; border-radius:20px; display:inline-flex; align-items:center; gap:6px;">
                <span>✓</span> 100% Aadhaar & Land KYC Verified
              </span>
            </div>

            <form id="profile-form" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Farmer / Signatory Name</label>
                <input type="text" id="profile-name" value="${currentUser.name}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Farm Name / FPO Enterprise</label>
                <input type="text" id="profile-company" value="${currentUser.farmName || currentUser.name}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Primary Contact Phone (Linked to Aadhaar)</label>
                <input type="text" disabled value="${currentUser.phone || '+91 98765 43210'}" style="width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; background:#f8fafc; border-radius:8px; font-size:14px; color:#64748b; box-sizing:border-box;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Operational State & District</label>
                <input type="text" id="profile-location" value="${currentUser.location || 'Sangrur, Punjab'}" style="width:100%; padding:10px 14px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none; box-sizing:border-box;" />
              </div>

              <div style="grid-column:span 2; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
                <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:0 0 8px 0;">🏛️ Verified Indian Government Credentials</h4>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; font-size:13px;">
                  <div><strong>Kisan Credit Card:</strong> •••• 9482 (Active)</div>
                  <div><strong>Land Khata No:</strong> PB-SNG-40291 (42 Acres)</div>
                  <div><strong>e-NAM Mandi ID:</strong> ENAM-PB-10492</div>
                </div>
              </div>

              <div style="grid-column:span 2;">
                <button type="submit" style="background:#16a34a; color:white; border:none; padding:12px 24px; border-radius:8px; font-size:14px; font-weight:800; cursor:pointer;">
                  Save Profile Details →
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

