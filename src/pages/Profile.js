/**
 * User Profile & KYC Verification Page Component
 */

import { store } from "../store/state.js";

export function renderProfilePage() {
  const currentUser = store.getCurrentUser();
  const currentRole = store.getCurrentRole();

  return `
    <div class="page-profile" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:860px; margin:0 auto;">
        
        <div style="margin-bottom:28px;">
          <h1 style="font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; color:#0f172a; margin:0;">
            User Profile & KYC Verification
          </h1>
          <p style="font-size:14px; color:#64748b; margin-top:4px;">
            Manage your personal credentials, farm location coordinates, GST compliance, and escrow bank payouts.
          </p>
        </div>

        <form id="profile-form" style="background:#ffffff; border:1px solid #e2ece2; border-radius:20px; padding:32px; box-shadow:0 4px 15px rgba(15,61,33,0.05);">
          
          <!-- Avatar & Header Banner -->
          <div style="display:flex; align-items:center; gap:20px; margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid #f0f6f0;">
            <div style="width:72px; height:72px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:28px; display:flex; align-items:center; justify-content:center; border:3px solid #bbf7d0;">
              ${currentUser.avatar || "U"}
            </div>
            <div>
              <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; color:#0f172a; margin:0;">
                ${currentUser.name}
              </h2>
              <span style="background:${
                currentRole === "farmer" ? "#dcfce7" : currentRole === "buyer" ? "#e0f2fe" : "#f3e8ff"
              }; color:${
    currentRole === "farmer" ? "#15803d" : currentRole === "buyer" ? "#0284c7" : "#7c3aed"
  }; font-size:11px; font-weight:800; padding:3px 10px; border-radius:12px; text-transform:uppercase;">
                ${currentRole} Role
              </span>
              <span style="font-size:12px; color:#64748b; margin-left:8px;">Member since ${currentUser.memberSince || "2024"}</span>
            </div>
          </div>

          <!-- Basic Info -->
          <div style="margin-bottom:28px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:14px;">
              Personal & Business Information
            </h3>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Full Name *</label>
                <input type="text" id="profile-name" required value="${currentUser.name}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Farm Name / Company Organization *</label>
                <input type="text" id="profile-company" required value="${currentUser.companyName || currentUser.farmName || ""}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Email Address *</label>
                <input type="email" id="profile-email" required value="${currentUser.email || "user@agriwaste.in"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Phone Number *</label>
                <input type="text" id="profile-phone" required value="${currentUser.phone || "+91 98765 43210"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
            </div>
          </div>

          <!-- Location & Address -->
          <div style="margin-bottom:28px; border-top:1px solid #f0f6f0; padding-top:20px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:14px;">
              Address & Farm Gate Coordinates
            </h3>

            <div style="margin-bottom:16px;">
              <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Full Pickup / Delivery Address *</label>
              <textarea id="profile-location" rows="2" required style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;">${currentUser.location}</textarea>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">District *</label>
                <input type="text" id="profile-district" value="${currentUser.district || "Coimbatore"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">State *</label>
                <input type="text" id="profile-state" value="${currentUser.state || "Tamil Nadu"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Pincode *</label>
                <input type="text" id="profile-pincode" value="${currentUser.pincode || "642001"}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
            </div>
          </div>

          <!-- Escrow Bank Account Payouts -->
          <div style="margin-bottom:28px; border-top:1px solid #f0f6f0; padding-top:20px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:17px; font-weight:700; color:#0f172a; margin-bottom:14px;">
              🏦 Bank Settlement Account for Escrow Payouts
            </h3>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Account Holder Name</label>
                <input type="text" value="${currentUser.name}" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Bank Name</label>
                <input type="text" value="State Bank of India (SBI)" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Account Number</label>
                <input type="text" value="••••••••••••4829" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">IFSC Code</label>
                <input type="text" value="SBIN0001234" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid #f0f6f0; padding-top:20px;">
            <button type="submit" style="background:#16a34a; color:white; border:none; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;">
              Save Profile Changes
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
