/**
 * Login Page Component - Modern, Clean & High-Legibility Design
 */

import { store } from "../store/state.js";

export function renderLoginPage() {
  const currentRole = store.getCurrentRole() || "farmer";

  return `
    <div class="page-login" style="min-height:calc(100vh - 74px); background:linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; box-sizing:border-box; position:relative; overflow:hidden;">
      
      <!-- Ambient Glow Elements -->
      <div style="position:absolute; top:-100px; left:20%; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0) 70%); filter:blur(40px); pointer-events:none; z-index:0;"></div>
      <div style="position:absolute; bottom:-100px; right:20%; width:450px; height:450px; border-radius:50%; background:radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%); filter:blur(50px); pointer-events:none; z-index:0;"></div>

      <!-- Centered Sleek Login Card -->
      <div style="position:relative; z-index:2; background:#ffffff; border-radius:24px; width:100%; max-width:540px; box-shadow:0 20px 50px rgba(15,61,33,0.08), 0 0 0 1.5px rgba(22,163,74,0.12); padding:44px 40px; box-sizing:border-box;">
        
        <!-- Brand & Title Header -->
        <div style="text-align:center; margin-bottom:28px;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, #16a34a 0%, #15803d 100%); color:white; font-size:32px; box-shadow:0 8px 20px rgba(22,163,74,0.3); margin-bottom:16px;">
            🌾
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:30px; font-weight:800; color:#0f172a; margin:0 0 6px 0; letter-spacing:-0.5px;">
            Welcome to AgriWaste
          </h1>
          <p style="font-size:15px; color:#64748b; margin:0; font-weight:500;">
            Sign in to access your bio-residue marketplace portal
          </p>
        </div>

        <!-- Role Selector Segmented Tabs -->
        <div style="margin-bottom:24px;">
          <label style="display:block; font-size:14px; font-weight:800; color:#334155; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
            Select Account Role
          </label>
          
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px;" id="login-role-selector">
            <!-- Farmer Role Button -->
            <button type="button" class="btn-role-tab ${currentRole === 'farmer' ? 'active-role-card' : ''}" data-role="farmer" data-email="ramesh@greenfarmagro.in" data-phone="+91 98765 43210" data-name="Ramesh Patel" data-entity="Sangrur FPO, Punjab" style="background:${currentRole === 'farmer' ? '#f0fdf4' : '#ffffff'}; border:${currentRole === 'farmer' ? '2px solid #16a34a' : '1.5px solid #e2e8f0'}; border-radius:14px; padding:12px 8px; text-align:center; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentRole === 'farmer' ? '0 4px 12px rgba(22,163,74,0.12)' : 'none'};">
              <span style="font-size:24px; display:block; margin-bottom:4px;">🧑‍🌾</span>
              <span style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${currentRole === 'farmer' ? '#15803d' : '#334155'}; display:block;">Farmer</span>
              <span style="font-size:12px; color:#16a34a; font-weight:700;">Seller / FPO</span>
            </button>

            <!-- Buyer Role Button -->
            <button type="button" class="btn-role-tab ${currentRole === 'buyer' ? 'active-role-card' : ''}" data-role="buyer" data-email="procure@agrofeed.in" data-phone="+91 98111 22334" data-name="Rajesh Sharma" data-entity="AgroFeed Ltd, Haryana" style="background:${currentRole === 'buyer' ? '#f0f9ff' : '#ffffff'}; border:${currentRole === 'buyer' ? '2px solid #0284c7' : '1.5px solid #e2e8f0'}; border-radius:14px; padding:12px 8px; text-align:center; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentRole === 'buyer' ? '0 4px 12px rgba(2,132,199,0.12)' : 'none'};">
              <span style="font-size:24px; display:block; margin-bottom:4px;">🏭</span>
              <span style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${currentRole === 'buyer' ? '#0284c7' : '#334155'}; display:block;">Buyer</span>
              <span style="font-size:12px; color:#0284c7; font-weight:700;">Bio-Refiner</span>
            </button>

            <!-- Admin Role Button -->
            <button type="button" class="btn-role-tab ${currentRole === 'admin' ? 'active-role-card' : ''}" data-role="admin" data-email="admin@agriwaste.gov.in" data-phone="+91 99000 11223" data-name="Dr. Amit Verma" data-entity="National Bio-Auditor" style="background:${currentRole === 'admin' ? '#faf5ff' : '#ffffff'}; border:${currentRole === 'admin' ? '2px solid #7c3aed' : '1.5px solid #e2e8f0'}; border-radius:14px; padding:12px 8px; text-align:center; cursor:pointer; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow:${currentRole === 'admin' ? '0 4px 12px rgba(124,58,237,0.12)' : 'none'};">
              <span style="font-size:24px; display:block; margin-bottom:4px;">🛡️</span>
              <span style="font-family:'Outfit', sans-serif; font-size:15px; font-weight:800; color:${currentRole === 'admin' ? '#7c3aed' : '#334155'}; display:block;">Admin</span>
              <span style="font-size:12px; color:#7c3aed; font-weight:700;">Auditor</span>
            </button>
          </div>
        </div>

        <!-- Authentication Form -->
        <form id="login-form">
          <!-- Email / Identifier Field -->
          <div style="margin-bottom:18px;">
            <label style="display:block; font-size:14.5px; font-weight:700; color:#1e293b; margin-bottom:8px;">
              Email Address / User ID
            </label>
            <div style="position:relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px; color:#64748b;">✉️</span>
              <input type="email" id="login-email" required value="ramesh@greenfarmagro.in" placeholder="name@domain.com" style="width:100%; padding:14px 16px 14px 48px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; transition:border-color 0.2s; box-sizing:border-box;" />
            </div>
          </div>

          <!-- Password Field -->
          <div style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <label style="font-size:14.5px; font-weight:700; color:#1e293b;">Password</label>
              <a href="#forgot-password" id="btn-forgot-pwd" style="font-size:13.5px; color:#16a34a; font-weight:700; text-decoration:none !important;">Forgot password?</a>
            </div>
            <div style="position:relative;">
              <span style="position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:18px; color:#64748b;">🔒</span>
              <input type="password" id="login-password" required value="AgriWaste@2026" style="width:100%; padding:14px 48px 14px 48px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; transition:border-color 0.2s; box-sizing:border-box;" />
              <button type="button" id="btn-toggle-pwd" style="position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:20px; color:#64748b; padding:4px;" title="Show/Hide Password">
                👁️
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:14px; color:#475569; cursor:pointer; font-weight:600;">
              <input type="checkbox" id="chk-remember-me" checked style="accent-color:#16a34a; width:18px; height:18px; cursor:pointer;" />
              Remember me on this device
            </label>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="btn-login-submit" style="width:100%; background:linear-gradient(135deg, #16a34a 0%, #15803d 100%); color:white; border:none; padding:15px; border-radius:12px; font-size:17px; font-weight:800; cursor:pointer; box-shadow:0 6px 18px rgba(22,163,74,0.3); font-family:'Plus Jakarta Sans', sans-serif; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s;">
            <span id="btn-login-text">Sign In to Dashboard</span>
            <span style="font-size:20px;">→</span>
          </button>
        </form>

        <!-- Card Footer -->
        <div style="margin-top:28px; padding-top:20px; border-top:1.5px solid #f1f5f9; text-align:center;">
          <p style="font-size:15px; color:#64748b; margin:0 0 16px 0;">
            Don't have an account? 
            <a href="#register" style="color:#16a34a; font-weight:800; text-decoration:none !important; margin-left:4px;">
              Register Now →
            </a>
          </p>

          <div style="display:flex; align-items:center; justify-content:center; gap:16px; font-size:12.5px; color:#94a3b8; font-weight:600;">
            <span>🔒 256-Bit SSL Encrypted</span>
            <span>•</span>
            <span>⚡ Escrow Protected</span>
          </div>
        </div>

      </div>

      <!-- Platform Copyright Note -->
      <div style="position:relative; z-index:2; margin-top:24px; font-size:13.5px; color:#64748b; text-align:center; font-weight:500;">
        AgriWaste Circular Bio-Exchange Platform © 2026
      </div>

    </div>
  `;
}

