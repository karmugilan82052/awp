/**
 * Navbar Component with Role Switcher, Cart Counter, Notifications Badge, and AI Assistant Trigger
 */

import { store } from "../store/state.js";

export function renderNavbar(currentPath = "/") {
  const isLoggedIn = store.isLoggedIn();
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
        <a href="#/" class="brand-logo" style="display:flex; align-items:center; gap:14px; text-decoration:none;">
          <div style="background:linear-gradient(135deg, #16a34a, #15803d); width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            🌾
          </div>
          <div>
            <span style="font-family:'Outfit', sans-serif; font-weight:800; font-size:23px; color:#0f3d21; letter-spacing:-0.5px; display:block; line-height:1.1;">AgriWaste</span>
            <span style="font-size:12.5px; font-weight:700; color:#16a34a; letter-spacing:0.5px; text-transform:uppercase;">Circular Bio-Exchange</span>
          </div>
        </a>

        <!-- Desktop Navigation Links (Only 4 core options) -->
        <nav class="desktop-nav" style="display:flex; align-items:center; gap:8px;">
          <a href="#/" class="nav-link ${currentPath === "/" ? "active" : ""}" style="padding:9px 16px; border-radius:8px; font-size:16px; font-weight:700; color:${currentPath === "/" ? "#16a34a" : "#334155"}; transition:all 0.2s; text-decoration:none !important; font-family:'Plus Jakarta Sans', sans-serif;">Home</a>
          <a href="#marketplace" class="nav-link ${currentPath.startsWith("/marketplace") ? "active" : ""}" style="padding:9px 16px; border-radius:8px; font-size:16px; font-weight:700; color:${currentPath.startsWith("/marketplace") ? "#16a34a" : "#334155"}; transition:all 0.2s; text-decoration:none !important; font-family:'Plus Jakarta Sans', sans-serif;">Marketplace</a>
          
          <a href="#sell-waste" class="nav-link ${currentPath === "/sell-waste" ? "active" : ""}" style="padding:9px 16px; border-radius:8px; font-size:16px; font-weight:700; color:#16a34a; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; gap:6px; text-decoration:none !important; font-family:'Plus Jakarta Sans', sans-serif;">
            <span>+</span> Sell Agri Waste
          </a>

          <a href="#sustainability" class="nav-link ${currentPath === "/sustainability" ? "active" : ""}" style="padding:9px 16px; border-radius:8px; font-size:16px; font-weight:700; color:${currentPath === "/sustainability" ? "#16a34a" : "#334155"}; text-decoration:none !important; font-family:'Plus Jakarta Sans', sans-serif;">🌱 Impact</a>
        </nav>

        <!-- Right Utilities -->
        <div style="display:flex; align-items:center; gap:12px;">

          <!-- AI Smart Assistant Button -->
          <button id="btn-open-ai-assistant" class="btn-ai-glow" style="display:flex; align-items:center; gap:8px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; padding:9px 15px; border-radius:20px; font-size:14px; font-weight:700; cursor:pointer; box-shadow:0 0 15px rgba(16,185,129,0.35);">
            <span style="font-size:16px;">✨</span> AI Assistant
          </button>

          ${
            isLoggedIn && currentUser
              ? `
            <!-- Chat Inbox -->
            <a href="#chat" title="Messages" style="position:relative; width:44px; height:44px; border-radius:10px; background:#f8fafc; border:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:20px; text-decoration:none;">
              💬
            </a>

            <!-- Notifications Bell -->
            <button id="btn-toggle-notifications" title="Notifications" style="position:relative; width:44px; height:44px; border-radius:10px; background:#f8fafc; border:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:20px; cursor:pointer;">
              🔔
              ${
                unreadNotifsCount > 0
                  ? `<span style="position:absolute; top:-5px; right:-5px; background:#dc2626; color:white; font-size:11px; font-weight:800; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white;">${unreadNotifsCount}</span>`
                  : ""
              }
            </button>

            <!-- Shopping Cart (Buyer only) -->
            ${
              isBuyer
                ? `
              <a href="#cart" title="Shopping Cart" style="position:relative; width:44px; height:44px; border-radius:10px; background:#f8fafc; border:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:center; color:#334155; font-size:20px; text-decoration:none;">
                🛒
                ${
                  cartItemsCount > 0
                    ? `<span style="position:absolute; top:-5px; right:-5px; background:#16a34a; color:white; font-size:11px; font-weight:800; width:20px; height:20px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white;">${cartItemsCount}</span>`
                    : ""
                }
              </a>
            `
                : ""
            }

            <!-- User Profile Dropdown Menu -->
            <div class="role-switcher-wrapper" style="position:relative;">
              <button id="btn-role-dropdown" style="display:flex; align-items:center; gap:10px; padding:8px 14px; background:#f1f5f9; border:1.5px solid #cbd5e1; border-radius:12px; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif;">
                <div style="width:34px; height:34px; border-radius:50%; background:${isFarmer ? "#16a34a" : isBuyer ? "#0284c7" : "#7c3aed"}; color:white; display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:800; font-family:'Outfit', sans-serif; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                  ${currentUser.avatar || "U"}
                </div>
                <div style="text-align:left; font-family:'Plus Jakarta Sans', sans-serif;">
                  <span style="display:block; font-size:14px; font-weight:800; color:#0f172a; line-height:1.2; font-family:'Plus Jakarta Sans', sans-serif;">${currentUser.name.split(" ")[0]}</span>
                  <span style="display:block; font-size:12px; font-weight:700; color:${isFarmer ? "#16a34a" : isBuyer ? "#0284c7" : "#7c3aed"}; text-transform:uppercase; font-family:'Plus Jakarta Sans', sans-serif;">${currentRole}</span>
                </div>
                <span style="font-size:12px; color:#64748b; margin-left:2px;">▼</span>
              </button>

              <!-- Dropdown Menu -->
              <div id="role-dropdown-menu" style="display:none; position:absolute; right:0; top:calc(100% + 8px); width:260px; background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; box-shadow:0 12px 36px rgba(0,0,0,0.15); padding:10px; z-index:1100; font-family:'Plus Jakarta Sans', sans-serif;">
                <!-- User Info Header -->
                <div style="padding:10px 12px; background:#f8fafc; border-radius:10px; margin-bottom:8px; border:1px solid #f1f5f9;">
                  <p style="font-size:14.5px; font-weight:800; color:#0f172a; margin:0 0 2px 0;">${currentUser.name}</p>
                  <p style="font-size:12.5px; color:#64748b; margin:0 0 6px 0;">${currentUser.email || "user@agriwaste.in"}</p>
                  <span style="display:inline-block; font-size:11.5px; font-weight:800; padding:2px 8px; border-radius:12px; background:${isFarmer ? "#dcfce7" : isBuyer ? "#dbeafe" : "#f3e8ff"}; color:${isFarmer ? "#15803d" : isBuyer ? "#1d4ed8" : "#6b21a8"}; text-transform:uppercase;">
                    ${isFarmer ? "🧑‍🌾 Verified Farmer" : isBuyer ? "🏭 Verified Buyer" : "🛡️ System Admin"}
                  </span>
                </div>

                <!-- Menu Links -->
                <div style="display:flex; flex-direction:column; gap:4px;">
                  <a href="${isFarmer ? "#farmer-profile" : isBuyer ? "#buyer-profile" : "#profile"}" style="display:flex; align-items:center; gap:10px; padding:10px 12px; font-size:14.5px; color:#334155; text-decoration:none !important; font-weight:700; border-radius:8px; transition:background 0.15s ease;" onmouseover="this.style.background='#f0fdf4'; this.style.color='#16a34a';" onmouseout="this.style.background='transparent'; this.style.color='#334155';">
                    <span style="font-size:18px;">👤</span> My Profile & KYC
                  </a>
                  <a href="${isFarmer ? "#farmer-dashboard" : isBuyer ? "#buyer-dashboard" : "#admin-dashboard"}" style="display:flex; align-items:center; gap:10px; padding:10px 12px; font-size:14.5px; color:#334155; text-decoration:none !important; font-weight:700; border-radius:8px; transition:background 0.15s ease;" onmouseover="this.style.background='#f0fdf4'; this.style.color='#16a34a';" onmouseout="this.style.background='transparent'; this.style.color='#334155';">
                    <span style="font-size:18px;">📊</span> Dashboard Hub
                  </a>
                </div>

                <!-- Sign Out -->
                <div style="border-top:1.5px solid #f1f5f9; margin-top:8px; padding-top:6px;">
                  <a href="#login" id="btn-user-signout" style="display:flex; align-items:center; gap:10px; padding:10px 12px; font-size:14.5px; color:#dc2626; text-decoration:none !important; font-weight:700; border-radius:8px; transition:background 0.15s ease;" onmouseover="this.style.background='#fee2e2';" onmouseout="this.style.background='transparent';">
                    <span style="font-size:18px;">🚪</span> Sign Out
                  </a>
                </div>
              </div>
            </div>
          `
              : `
            <!-- Public Guest Sign In / Register Buttons -->
            <a href="#login" style="padding:9px 18px; border-radius:10px; font-size:15px; font-weight:700; color:#15803d; background:#f0fdf4; border:1.5px solid #bbf7d0; text-decoration:none !important; transition:all 0.2s;">
              Sign In
            </a>
            <a href="#register" style="padding:9px 18px; border-radius:10px; font-size:15px; font-weight:800; color:white; background:#16a34a; text-decoration:none !important; box-shadow:0 4px 12px rgba(22,163,74,0.3); transition:all 0.2s;">
              Register
            </a>
          `
          }

        </div>

      </div>
    </header>
  `;
}
