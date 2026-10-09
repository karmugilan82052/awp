/**
 * Register Page Component - Clean, Modern & High-Legibility Design
 */

export function renderRegisterPage() {
  return `
    <div class="page-register" style="min-height:calc(100vh - 74px); background:linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0fdf4 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; box-sizing:border-box; position:relative; overflow:hidden;">
      
      <!-- Ambient Glow Elements -->
      <div style="position:absolute; top:-100px; left:20%; width:400px; height:400px; border-radius:50%; background:radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0) 70%); filter:blur(40px); pointer-events:none; z-index:0;"></div>
      <div style="position:absolute; bottom:-100px; right:20%; width:450px; height:450px; border-radius:50%; background:radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%); filter:blur(50px); pointer-events:none; z-index:0;"></div>

      <!-- Centered Sleek Register Card -->
      <div style="position:relative; z-index:2; background:#ffffff; border-radius:24px; width:100%; max-width:600px; box-shadow:0 20px 50px rgba(15,61,33,0.08), 0 0 0 1.5px rgba(22,163,74,0.12); padding:44px 40px; box-sizing:border-box;">
        
        <!-- Brand & Title Header -->
        <div style="text-align:center; margin-bottom:28px;">
          <div style="display:inline-flex; align-items:center; justify-content:center; width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, #16a34a 0%, #15803d 100%); color:white; font-size:32px; box-shadow:0 8px 20px rgba(22,163,74,0.3); margin-bottom:16px;">
            🌾
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:30px; font-weight:800; color:#0f172a; margin:0 0 6px 0; letter-spacing:-0.5px;">
            Create Your Account
          </h1>
          <p style="font-size:15px; color:#64748b; margin:0; font-weight:500;">
            Join the verified circular bio-exchange network
          </p>
        </div>

        <form id="register-form">
          <!-- Role Selection -->
          <div style="margin-bottom:20px;">
            <label style="display:block; font-size:14px; font-weight:800; color:#334155; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
              Select Account Role *
            </label>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <label class="role-radio active" style="border:2px solid #16a34a; background:#f0fdf4; border-radius:14px; padding:14px 12px; cursor:pointer; text-align:center; transition:all 0.2s; display:block;">
                <input type="radio" name="register-role" value="farmer" checked style="display:none;" />
                <span style="font-size:26px; display:block; margin-bottom:4px;">🧑‍🌾</span>
                <strong style="font-size:16px; color:#15803d; display:block; font-family:'Outfit', sans-serif;">Farmer / Producer</strong>
                <span style="font-size:12.5px; color:#16a34a; font-weight:600;">Monetize & Sell Waste</span>
              </label>

              <label class="role-radio" style="border:2px solid #e2e8f0; background:#ffffff; border-radius:14px; padding:14px 12px; cursor:pointer; text-align:center; transition:all 0.2s; display:block;">
                <input type="radio" name="register-role" value="buyer" style="display:none;" />
                <span style="font-size:26px; display:block; margin-bottom:4px;">🏭</span>
                <strong style="font-size:16px; color:#0284c7; display:block; font-family:'Outfit', sans-serif;">Industrial Buyer</strong>
                <span style="font-size:12.5px; color:#0284c7; font-weight:600;">Procure Biomass</span>
              </label>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:14.5px; font-weight:700; color:#334155; margin-bottom:6px;">Full Name *</label>
            <input type="text" id="reg-name" required placeholder="e.g. Gurpreet Singh" style="width:100%; padding:14px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; box-sizing:border-box;" />
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:14.5px; font-weight:700; color:#334155; margin-bottom:6px;">Farm / Enterprise Name *</label>
            <input type="text" id="reg-company" required placeholder="e.g. Punjab Bio Agro Producer Co." style="width:100%; padding:14px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; box-sizing:border-box;" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div>
              <label style="display:block; font-size:14.5px; font-weight:700; color:#334155; margin-bottom:6px;">Official Email *</label>
              <input type="email" id="reg-email" required placeholder="name@domain.in" style="width:100%; padding:14px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; box-sizing:border-box;" />
            </div>
            <div>
              <label style="display:block; font-size:14.5px; font-weight:700; color:#334155; margin-bottom:6px;">Mobile Number *</label>
              <input type="text" id="reg-phone" required placeholder="+91 98765 43210" style="width:100%; padding:14px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; box-sizing:border-box;" />
            </div>
          </div>

          <div style="margin-bottom:24px;">
            <label style="display:block; font-size:14.5px; font-weight:700; color:#334155; margin-bottom:6px;">Location (State & District) *</label>
            <input type="text" id="reg-location" required placeholder="e.g. Ludhiana, Punjab" style="width:100%; padding:14px 16px; border:1.5px solid #cbd5e1; border-radius:12px; font-size:16px; font-family:'Plus Jakarta Sans', sans-serif; outline:none; box-sizing:border-box;" />
          </div>

          <button type="submit" style="width:100%; background:linear-gradient(135deg, #16a34a, #15803d); color:white; border:none; padding:15px; border-radius:12px; font-size:17px; font-weight:800; cursor:pointer; box-shadow:0 6px 18px rgba(22,163,74,0.3); font-family:'Plus Jakarta Sans', sans-serif; display:flex; align-items:center; justify-content:center; gap:10px;">
            <span>Complete Registration</span>
            <span style="font-size:20px;">→</span>
          </button>
        </form>

        <div style="margin-top:28px; padding-top:20px; border-top:1.5px solid #f1f5f9; text-align:center;">
          <p style="font-size:15px; color:#64748b; margin:0;">
            Already have an active account? 
            <a href="#login" style="color:#16a34a; font-weight:800; text-decoration:none !important; margin-left:4px;">
              Sign In to Portal →
            </a>
          </p>
        </div>

      </div>

      <!-- Platform Copyright Note -->
      <div style="position:relative; z-index:2; margin-top:24px; font-size:13.5px; color:#64748b; text-align:center; font-weight:500;">
        AgriWaste Circular Bio-Exchange Platform © 2026
      </div>

    </div>
  `;
}
