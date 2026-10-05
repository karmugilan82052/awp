/**
 * Register Page Component for Multi-Role Onboarding
 */

export function renderRegisterPage() {
  return `
    <div class="page-register" style="padding:50px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh; display:flex; align-items:center; justify-content:center;">
      <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:24px; padding:40px; width:100%; max-width:540px; box-shadow:0 10px 35px rgba(15,61,33,0.06);">
        
        <div style="text-align:center; margin-bottom:28px;">
          <div style="background:#16a34a; width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:24px; margin:0 auto 12px auto;">
            🌾
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; color:#0f172a; margin:0;">
            Create Your Account
          </h1>
          <p style="font-size:13px; color:#64748b; margin-top:4px;">
            Join 12,000+ verified Indian farmers and industrial bio-refineries
          </p>
        </div>

        <form id="register-form">
          
          <!-- Role Selector -->
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:8px;">Choose Account Role *</label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <label class="role-radio active" style="border:2px solid #16a34a; background:#f0fdf4; border-radius:12px; padding:12px; cursor:pointer; text-align:center;">
                <input type="radio" name="register-role" value="farmer" checked style="display:none;" />
                <span style="font-size:24px; display:block;">🧑‍🌾</span>
                <strong style="font-size:13px; color:#0f172a; display:block; margin-top:4px;">Farmer / FPO</strong>
                <span style="font-size:11px; color:#15803d;">Sell crop residue</span>
              </label>

              <label class="role-radio" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:12px; padding:12px; cursor:pointer; text-align:center;">
                <input type="radio" name="register-role" value="buyer" style="display:none;" />
                <span style="font-size:24px; display:block;">🏭</span>
                <strong style="font-size:13px; color:#0f172a; display:block; margin-top:4px;">Industrial Buyer</strong>
                <span style="font-size:11px; color:#64748b;">Source bulk biomass</span>
              </label>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Full Name *</label>
            <input type="text" id="reg-name" required placeholder="e.g. Gurpreet Singh" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Farm Name / Enterprise Name *</label>
            <input type="text" id="reg-company" required placeholder="e.g. Punjab Agro Bio FPO" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Email Address *</label>
              <input type="email" id="reg-email" required placeholder="name@domain.in" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
            </div>
            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Mobile (OTP) *</label>
              <input type="text" id="reg-phone" required placeholder="+91 98765 43210" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">State & District *</label>
            <input type="text" id="reg-location" required placeholder="e.g. Ludhiana, Punjab" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
          </div>

          <button type="submit" style="width:100%; background:#16a34a; color:white; border:none; padding:12px; border-radius:10px; font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
            Complete Free Registration →
          </button>
        </form>

        <p style="text-align:center; font-size:13px; color:#64748b; margin-top:20px;">
          Already registered? <a href="#login" style="color:#16a34a; font-weight:700; text-decoration:none;">Sign In</a>
        </p>

      </div>
    </div>
  `;
}
