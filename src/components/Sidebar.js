/**
 * Dashboard Sidebar Component for Farmer, Buyer, and Admin views
 * Maintains In-Dashboard Navigation without redirecting to external standalone pages
 */

export function renderSidebar(activeTab = "overview", role = "farmer") {
  const isFarmer = role === "farmer";
  const isBuyer = role === "buyer";
  const isAdmin = role === "admin";

  let items = [];

  if (isFarmer) {
    items = [
      { id: "overview", label: "Farmer Overview", icon: "📊", link: "#farmer-dashboard" },
      { id: "listings", label: "My Waste Listings", icon: "🌾", link: "#farmer-listings" },
      { id: "orders", label: "Incoming Orders", icon: "📦", link: "#farmer-orders" },
      { id: "earnings", label: "Earnings & Payouts", icon: "💰", link: "#farmer-earnings" },
      { id: "chat", label: "Buyer Inquiries", icon: "💬", link: "#farmer-chat" },
      { id: "profile", label: "Farm Profile & KYC", icon: "🚜", link: "#farmer-profile" }
    ];
  } else if (isBuyer) {
    items = [
      { id: "overview", label: "Buyer Overview", icon: "📊", link: "#buyer-dashboard" },
      { id: "orders", label: "Active Orders", icon: "🚚", link: "#buyer-orders" },
      { id: "recommendations", label: "AI Recommendations", icon: "✨", link: "#buyer-recommendations" },
      { id: "favorites", label: "Saved Listings", icon: "⭐", link: "#buyer-saved" },
      { id: "chat", label: "Farmer Messages", icon: "💬", link: "#buyer-chat" },
      { id: "profile", label: "Company Profile", icon: "🏭", link: "#buyer-profile" }
    ];
  } else {
    // Admin
    items = [
      { id: "overview", label: "System Overview", icon: "📈", link: "#admin-dashboard" },
      { id: "listings", label: "Listing Approvals", icon: "✅", link: "#admin-listings" },
      { id: "users", label: "User Verification", icon: "👥", link: "#admin-users" },
      { id: "orders", label: "Orders & Escrow", icon: "📦", link: "#admin-orders" },
      { id: "complaints", label: "Dispute Arbitration", icon: "🛡️", link: "#admin-complaints" },
      { id: "categories", label: "Category Manager", icon: "🗂️", link: "#admin-categories" },
      { id: "reports", label: "Reports & Analytics", icon: "📑", link: "#admin-reports" }
    ];
  }

  return `
    <aside style="width:310px; background:#ffffff; border-right:1.5px solid #e2ece2; padding:28px 20px; min-height:calc(100vh - 74px); display:flex; flex-direction:column; gap:14px; flex-shrink:0;">
      <div style="padding:0 8px 16px 8px; margin-bottom:6px; border-bottom:1.5px solid #f0f6f0;">
        <span style="font-size:15px; font-weight:800; color:#334155; text-transform:uppercase; letter-spacing:0.8px;">
          ${isFarmer ? "🧑‍🌾 Farmer Dashboard" : isBuyer ? "🏭 Procurement Hub" : "🛡️ Admin Console"}
        </span>
      </div>

      <nav style="display:flex; flex-direction:column; gap:8px; flex-grow:1;">
        ${items
          .map(
            item => `
          <a href="${item.link}" class="sidebar-link ${activeTab === item.id ? "active" : ""}" style="display:flex; align-items:center; gap:16px; padding:14px 18px; border-radius:12px; font-size:17.5px; font-weight:700; text-decoration:none; color:${
              activeTab === item.id ? "#15803d" : "#334155"
            }; background:${activeTab === item.id ? "#f0fdf4" : "transparent"}; border:${
              activeTab === item.id ? "1.5px solid #bbf7d0" : "1.5px solid transparent"
            }; transition:all 0.15s ease;">
            <span style="font-size:24px; line-height:1;">${item.icon}</span>
            <span style="line-height:1.2;">${item.label}</span>
          </a>
        `
          )
          .join("")}
      </nav>

      <div style="margin-top:auto; padding:18px; background:#f8fafc; border-radius:14px; border:1.5px solid #e2e8f0; font-size:14.5px; color:#475569;">
        <p style="font-weight:800; color:#0f172a; font-size:15.5px; margin-bottom:4px;">National Bio-Support</p>
        <p style="margin-bottom:14px; font-size:14px; color:#64748b; line-height:1.4;">Toll-free Kisan Helpline: <br><strong style="color:#16a34a; font-size:16px;">1800-419-AGRI</strong></p>
        <a href="#sell-waste" style="display:block; text-align:center; background:#16a34a; color:white; padding:12px 16px; border-radius:10px; font-weight:800; font-size:15.5px; text-decoration:none; box-shadow:0 4px 10px rgba(22,163,74,0.25);">+ Add New Listing</a>
      </div>
    </aside>
  `;
}
