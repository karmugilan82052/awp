/**
 * Dashboard Sidebar Component for Farmer, Buyer, and Admin views
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
      { id: "chat", label: "Buyer Inquiries", icon: "💬", link: "#chat" },
      { id: "profile", label: "Farm Profile & KYC", icon: "🚜", link: "#profile" }
    ];
  } else if (isBuyer) {
    items = [
      { id: "overview", label: "Buyer Overview", icon: "📊", link: "#buyer-dashboard" },
      { id: "orders", label: "Active Orders", icon: "🚚", link: "#buyer-orders" },
      { id: "recommendations", label: "AI Recommendations", icon: "✨", link: "#buyer-recommendations" },
      { id: "favorites", label: "Saved Listings", icon: "⭐", link: "#marketplace" },
      { id: "chat", label: "Farmer Messages", icon: "💬", link: "#chat" },
      { id: "profile", label: "Company Profile", icon: "🏭", link: "#profile" }
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
    <aside style="width:260px; background:#ffffff; border-right:1px solid #e2ece2; padding:24px 16px; min-height:calc(100vh - 74px); display:flex; flex-direction:column; gap:8px;">
      <div style="padding:0 8px 16px 8px; margin-bottom:8px; border-bottom:1px solid #f0f6f0;">
        <span style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
          ${isFarmer ? "Farmer Dashboard" : isBuyer ? "Procurement Hub" : "Administrator"}
        </span>
      </div>

      <nav style="display:flex; flex-direction:column; gap:4px; flex-grow:1;">
        ${items
          .map(
            item => `
          <a href="${item.link}" class="sidebar-link ${activeTab === item.id ? "active" : ""}" style="display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; font-size:14px; font-weight:600; text-decoration:none; color:${
              activeTab === item.id ? "#16a34a" : "#475569"
            }; background:${activeTab === item.id ? "#f0fdf4" : "transparent"}; transition:all 0.15s;">
            <span style="font-size:18px;">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `
          )
          .join("")}
      </nav>

      <div style="margin-top:auto; padding:12px; background:#f8fafc; border-radius:12px; border:1px solid #e2e8f0; font-size:12px; color:#64748b;">
        <p style="font-weight:700; color:#1e293b; margin-bottom:4px;">National Bio-Support</p>
        <p style="margin-bottom:8px;">Toll-free Kisan Helpline: 1800-419-AGRI</p>
        <a href="#sell-waste" style="display:block; text-align:center; background:#16a34a; color:white; padding:6px 10px; border-radius:6px; font-weight:700; text-decoration:none;">+ Add Listing</a>
      </div>
    </aside>
  `;
}
