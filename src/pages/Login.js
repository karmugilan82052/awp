/**
 * Login Page Component with 1-Click Demo Logins
 */

import { store } from "../store/state.js";

export function renderLoginPage() {
  return `
    <div class="page-login" style="padding:60px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh; display:flex; align-items:center; justify-content:center;">
      <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:24px; padding:40px; width:100%; max-width:480px; box-shadow:0 10px 35px rgba(15,61,33,0.06);">
        
        <div style="text-align:center; margin-bottom:28px;">
          <div style="background:#16a34a; width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; margin:0 auto 12px auto;">
            🌾
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin:0;">
            Sign in to AgriWaste
          </h1>
          <p style="font-size:13px; color:#64748b; margin-top:4px;">
            National Bio-Exchange & Circular Procurement Platform
          </p>
        </div>

        <!-- 1-Click Instant Demo Login Selector -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:24px;">
          <span style="display:block; font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase; margin-bottom:10px; text-align:center;">
            ⚡ Quick 1-Click Evaluation Logins
          </span>

          <div style="display:flex; flex-direction:column; gap:8px;">
            <button class="btn-demo-login" data-role="farmer" style="background:#ffffff; border:1px solid #cbd5e1; padding:9px 12px; border-radius:8px; font-size:13px; font-weight:700; color:#15803d; cursor:pointer; text-align:left; display:flex; justify-content:space-between; align-items:center;">
              <span>🧑‍🌾 Login as Farmer (Ramesh Patel)</span>
              <span style="font-size:11px; background:#dcfce7; padding:2px 6px; border-radius:4px;">Demo</span>
            </button>

            <button class="btn-demo-login" data-role="buyer" style="background:#ffffff; border:1px solid #cbd5e1; padding:9px 12px; border-radius:8px; font-size:13px; font-weight:700; color:#0284c7; cursor:pointer; text-align:left; display:flex; justify-content:space-between; align-items:center;">
              <span>🏭 Login as Buyer (AgroFeed Ltd)</span>
              <span style="font-size:11px; background:#e0f2fe; padding:2px 6px; border-radius:4px;">Demo</span>
            </button>

            <button class="btn-demo-login" data-role="admin" style="background:#ffffff; border:1px solid #cbd5e1; padding:9px 12px; border-radius:8px; font-size:13px; font-weight:700; color:#7c3aed; cursor:pointer; text-align:left; display:flex; justify-content:space-between; align-items:center;">
              <span>🛡️ Login as Admin (Super Admin)</span>
              <span style="font-size:11px; background:#f3e8ff; padding:2px 6px; border-radius:4px;">Demo</span>
            </button>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
          <div style="flex-grow:1; height:1px; background:#e2e8f0;"></div>
          <span style="font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase;">Or Email & Password</span>
          <div style="flex-grow:1; height:1px; background:#e2e8f0;"></div>
        </div>

        <!-- Form -->
        <form id="login-form">
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Email Address</label>
            <input type="email" id="login-email" required value="ramesh@greenfarmagro.in" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
          </div>

          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <label style="font-size:13px; font-weight:700; color:#334155;">Password</label>
              <a href="#forgot-password" style="font-size:12px; color:#16a34a; font-weight:600; text-decoration:none;">Forgot password?</a>
            </div>
            <input type="password" id="login-password" required value="AgriWaste@2026" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
          </div>

          <button type="submit" style="width:100%; background:#16a34a; color:white; border:none; padding:12px; border-radius:10px; font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            Sign In to Account →
          </button>
        </form>

        <p style="text-align:center; font-size:13px; color:#64748b; margin-top:24px;">
          Don't have an account yet? <a href="#register" style="color:#16a34a; font-weight:700; text-decoration:none;">Register as Farmer or Buyer</a>
        </p>

      </div>
    </div>
  `;
}
