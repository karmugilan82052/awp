/**
 * Navbar Component with Role Switcher, Cart Counter, Notifications Badge, and AI Assistant Trigger
 */

import { store } from "../store/state.js";

export function renderNavbar(currentPath = "/") {
  const currentRole = store.getCurrentRole();
  const currentUser = store.getCurrentUser();
  const cart = store.getCart();
  const notifications = store.getNotifications();
  const unreadNotifsCount = notifications.filter(n => n.unread).length;
  const cartItemsCount = cart.reduce((sum, item) => sum + 1, 0);

  const isFarmer = currentRole === "farmer";
  const isBuyer = currentRole === "buyer";
  const isAdmin = currentRole === "admin";

  return `
    <header class="main-header" style="position:sticky; top:0; z-index:1000; background:rgba(255, 255, 255, 0.96); backdrop-filter:blur(12px); border-bottom:1px solid #e2ece2; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
      <div class="container" style="max-width:1380px; margin:0 auto; padding:0 20px; height:74px; display:flex; align-items:center; justify-content:space-between; gap:16px;">
        
        <!-- Logo -->
        <a href="#/" class="brand-logo" style="display:flex; align-items:center; gap:12px; text-decoration:none;">
          <div style="background:linear-gradient(135deg, #16a34a, #15803d); width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:22px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            🌾
          </div>
          <div>
            <span style="font-family:'Outfit', sans-serif; font-weight:800; font-size:20px; color:#0f3d21; letter-spacing:-0.5px; display:block; line-height:1.1;">AgriWaste</span>
            <span style="font-size:11px; font-weight:600; color:#16a34a; letter-spacing:0.5px; text-transform:uppercase;">Circular Bio-Exchange</span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="desktop-nav" style="display:flex; align-items:center; gap:6px;">
          <a href="#/" class="nav-link ${currentPath === "/" ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:600; color:${currentPath === "/" ? "#16a34a" : "#334155"}; transition:all 0.2s;">Home</a>
          <a href="#marketplace" class="nav-link ${currentPath.startsWith("/marketplace") ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:600; color:${currentPath.startsWith("/marketplace") ? "#16a34a" : "#334155"}; transition:all 0.2s;">Marketplace</a>
          
          <a href="#sell-waste" class="nav-link ${currentPath === "/sell-waste" ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:600; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; gap:6px;">
            <span>+</span> Sell Agri Waste
          </a>

          <a href="#sustainability" class="nav-link ${currentPath === "/sustainability" ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:600; color:${currentPath === "/sustainability" ? "#16a34a" : "#334155"};">🌱 Impact</a>
          <a href="#orders" class="nav-link ${currentPath.startsWith("/orders") ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:600; color:${currentPath.startsWith("/orders") ? "#16a34a" : "#334155"};">Orders</a>

          <!-- Role-Specific Dashboard Link -->
          ${
            isFarmer
              ? `<a href="#farmer-dashboard" class="nav-link ${currentPath.startsWith("/farmer") ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:700; color:#15803d; background:#dcfce7;">Farmer Hub</a>`
              : isBuyer
              ? `<a href="#buyer-dashboard" class="nav-link ${currentPath.startsWith("/buyer") ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:700; color:#0284c7; background:#e0f2fe;">Buyer Hub</a>`
              : `<a href="#admin-dashboard" class="nav-link ${currentPath.startsWith("/admin") ? "active" : ""}" style="padding:8px 14px; border-radius:8px; font-size:14px; font-weight:700; color:#7c3aed; background:#f3e8ff;">Admin Console</a>`
          }
        </nav>

        <!-- Right Utilities: AI Bot, Notifications, Cart, Role Switcher -->
        <div style="display:flex; align-items:center; gap:10px;">

          <!-- AI Smart Assistant Button -->
          <button id="btn-open-ai-assistant" class="btn-ai-glow" style="display:flex; align-items:center; gap:6px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; padding:7px 12px; border-radius:20px; font-size:12px; font-weight:700; cursor:pointer; box-shadow:0 0 15px rgba(16,185,129,0.35);">
            <span>✨</span> AI Assistant
          </button>

          <!-- Chat Inbox -->
          <a href="#chat" title="Messages" style="position:relative; width:40px; height:40px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:18px; text-decoration:none;">
            💬
          </a>

          <!-- Notifications Bell -->
          <button id="btn-toggle-notifications" title="Notifications" style="position:relative; width:40px; height:40px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:18px; cursor:pointer;">
            🔔
            ${
              unreadNotifsCount > 0
                ? `<span style="position:absolute; top:-4px; right:-4px; background:#dc2626; color:white; font-size:10px; font-weight:800; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white;">${unreadNotifsCount}</span>`
                : ""
            }
          </button>

          <!-- Shopping Cart -->
          <a href="#cart" title="Shopping Cart" style="position:relative; width:40px; height:40px; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:18px; text-decoration:none;">
            🛒
            ${
              cartItemsCount > 0
                ? `<span style="position:absolute; top:-4px; right:-4px; background:#16a34a; color:white; font-size:10px; font-weight:800; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white;">${cartItemsCount}</span>`
                : ""
            }
          </a>

          <!-- 1-Click Role Switcher Demo Dropdown -->
          <div class="role-switcher-wrapper" style="position:relative;">
            <button id="btn-role-dropdown" style="display:flex; align-items:center; gap:8px; padding:6px 12px; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:10px; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif;">
              <div style="width:28px; height:28px; border-radius:50%; background:${isFarmer ? "#16a34a" : isBuyer ? "#0284c7" : "#7c3aed"}; color:white; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800;">
                ${currentUser.avatar || "U"}
              </div>
              <div style="text-align:left;">
                <span style="display:block; font-size:12px; font-weight:700; color:#0f172a; line-height:1.2;">${currentUser.name.split(" ")[0]}</span>
                <span style="display:block; font-size:10px; font-weight:600; color:${isFarmer ? "#16a34a" : isBuyer ? "#0284c7" : "#7c3aed"}; text-transform:uppercase;">${currentRole}</span>
              </div>
              <span style="font-size:10px; color:#64748b;">▼</span>
            </button>

            <!-- Dropdown Menu -->
            <div id="role-dropdown-menu" style="display:none; position:absolute; right:0; top:calc(100% + 8px); width:240px; background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.12); padding:8px; z-index:1100;">
              <div style="padding:8px 10px; border-bottom:1px solid #f1f5f9; margin-bottom:6px;">
                <p style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Quick 1-Click Role Switch</p>
              </div>
              <button class="role-select-option" data-role="farmer" style="width:100%; text-align:left; padding:8px 10px; border:none; background:${isFarmer ? "#f0fdf4" : "transparent"}; color:${isFarmer ? "#16a34a" : "#334155"}; font-weight:600; font-size:13px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                <span>🧑‍🌾</span> Farmer (Ramesh Patel)
              </button>
              <button class="role-select-option" data-role="buyer" style="width:100%; text-align:left; padding:8px 10px; border:none; background:${isBuyer ? "#f0fdf4" : "transparent"}; color:${isBuyer ? "#0284c7" : "#334155"}; font-weight:600; font-size:13px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                <span>🏭</span> Buyer (AgroFeed Ltd)
              </button>
              <button class="role-select-option" data-role="admin" style="width:100%; text-align:left; padding:8px 10px; border:none; background:${isAdmin ? "#f0fdf4" : "transparent"}; color:${isAdmin ? "#7c3aed" : "#334155"}; font-weight:600; font-size:13px; border-radius:6px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                <span>🛡️</span> Admin (Central Console)
              </button>
              <div style="border-top:1px solid #f1f5f9; margin-top:6px; padding-top:6px;">
                <a href="#profile" style="display:block; padding:8px 10px; font-size:13px; color:#334155; text-decoration:none; font-weight:500; border-radius:6px;">👤 My Profile & Farm Details</a>
                <a href="#login" style="display:block; padding:8px 10px; font-size:13px; color:#dc2626; text-decoration:none; font-weight:500; border-radius:6px;">🚪 Sign Out</a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  `;
}
