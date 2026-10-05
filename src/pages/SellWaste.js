/**
 * SellWaste Listing Creation Wizard Component with AI Classification Trigger
 */

import { INITIAL_CATEGORIES } from "../store/initialData.js";
import { renderImageUploader } from "../components/ImageUploader.js";

export function renderSellWastePage() {
  return `
    <div class="page-sell-waste" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:860px; margin:0 auto;">
        
        <!-- Header -->
        <div style="text-align:center; margin-bottom:32px;">
          <div style="display:inline-flex; align-items:center; gap:6px; background:#dcfce7; color:#15803d; font-size:12px; font-weight:800; padding:4px 12px; border-radius:20px; margin-bottom:8px;">
            <span>✨</span> Powered by AI Classification
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:32px; font-weight:800; color:#0f172a; margin:0;">
            List Your Agricultural Waste for Sale
          </h1>
          <p style="font-size:14px; color:#64748b; margin-top:6px;">
            Connect with 500+ verified industrial biomass, bio-CNG, paper, and animal feed buyers across India.
          </p>
        </div>

        <!-- Listing Form Card -->
        <form id="sell-waste-form" style="background:#ffffff; border:1px solid #e2ece2; border-radius:20px; padding:32px; box-shadow:0 4px 15px rgba(15,61,33,0.05);">
          
          <!-- Section 1: Photos & AI Auto-Detection -->
          <div style="margin-bottom:30px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:12px;">
              1. Waste Photos & AI Smart Detection
            </h3>
            ${renderImageUploader()}
          </div>

          <!-- Section 2: Waste Details -->
          <div style="margin-bottom:30px; border-top:1px solid #f0f6f0; padding-top:24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
              2. Crop Residue & Category
            </h3>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Listing Title *</label>
                <input type="text" id="input-listing-title" required placeholder="e.g. Dry Paddy Straw Bales (Round M/C)" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Waste Category *</label>
                <select id="input-listing-category" required style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif; background:#ffffff;">
                  ${INITIAL_CATEGORIES.map(
                    c => `
                    <option value="${c.id}">${c.name} (${c.group})</option>
                  `
                  ).join("")}
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Available Quantity *</label>
                <input type="number" id="input-listing-qty" min="0.5" step="0.5" required value="10" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Unit *</label>
                <select id="input-listing-unit" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif; background:#ffffff;">
                  <option value="Tons">Tons (Metric)</option>
                  <option value="Quintals">Quintals</option>
                  <option value="Kilograms">Kilograms</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Expected Price / Ton (₹) *</label>
                <input type="number" id="input-listing-price" min="500" step="100" required value="4200" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif;" />
              </div>
            </div>

          </div>

          <!-- Section 3: Biomass Specifications -->
          <div style="margin-bottom:30px; border-top:1px solid #f0f6f0; padding-top:24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
              3. Quality & Storage Specifications
            </h3>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Moisture Level</label>
                <input type="text" id="input-listing-moisture" value="12%" placeholder="e.g. 10% - 14%" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Quality Grade</label>
                <select id="input-listing-grade" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; background:#ffffff;">
                  <option value="Grade A (Golden Dry)">Grade A (Golden Dry / Clean)</option>
                  <option value="Commercial Standard">Commercial Standard</option>
                  <option value="Export Quality">Export Quality</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Packaging Type</label>
                <select id="input-listing-pkg" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; background:#ffffff;">
                  <option value="Machine Baled (25kg Bales)">Machine Baled (25kg Bales)</option>
                  <option value="Loose Bulk Tipper Load">Loose Bulk Tipper Load</option>
                  <option value="Gunny Bags / PP Sacks (50kg)">Gunny Bags / PP Sacks (50kg)</option>
                  <option value="Jumbo Bulk Bags (500kg)">Jumbo Bulk Bags (500kg)</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Loading Assistance Available?</label>
                <select id="input-listing-loading" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; background:#ffffff;">
                  <option value="Yes (Tractor Front-End Loader)">Yes (Tractor Front-End Loader)</option>
                  <option value="Yes (Manual Labour Team)">Yes (Manual Labour Team)</option>
                  <option value="No (Buyer Truck Loading Required)">No (Buyer Truck Loading Required)</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Storage Facility</label>
                <select id="input-listing-storage" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; background:#ffffff;">
                  <option value="Covered Elevated Shed">Covered Elevated Shed</option>
                  <option value="Enclosed Warehouse Godown">Enclosed Warehouse Godown</option>
                  <option value="Open Yard with Tarpaulin Cover">Open Yard with Tarpaulin Cover</option>
                </select>
              </div>
            </div>

          </div>

          <!-- Section 3.5: Advanced Waste Information (AgriWaste Intelligence) -->
          <div style="margin-bottom:30px; border-top:1px solid #f0f6f0; padding-top:24px; background:#f8fafc; padding:20px; border-radius:12px; border:1px border-slate-200;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#0f172a; margin:0; display:flex; align-items:center; gap:6px;">
                <span>🧠</span> Advanced Waste Information (Optional)
              </h3>
              <span style="font-size:11px; font-weight:700; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:12px;">Enhances WSS & Buyer Match</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:12px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Harvest Age (Days)</label>
                <input type="number" id="input-listing-age" min="1" max="365" value="5" placeholder="e.g. 5" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" />
              </div>

              <div>
                <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Contamination Level</label>
                <select id="input-listing-contamination" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#ffffff;">
                  <option value="Low">Low (Clean / Dust Free)</option>
                  <option value="Medium">Medium (Slight Dust)</option>
                  <option value="High">High (Debris Present)</option>
                </select>
              </div>

              <div>
                <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Processing Level</label>
                <select id="input-listing-processing" style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#ffffff;">
                  <option value="Baled">Baled & Compressed</option>
                  <option value="Chopped">Chopped / Shredded</option>
                  <option value="Raw">Raw / Unprocessed</option>
                  <option value="Pelletized">Pelletized</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Intended Use / Preferred Application</label>
              <input type="text" id="input-listing-intended-use" placeholder="e.g. Mushroom cultivation, Composting, Biomass fuel..." style="width:100%; padding:8px 12px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" />
            </div>
          </div>

          <!-- Section 4: Farm Location -->
          <div style="margin-bottom:30px; border-top:1px solid #f0f6f0; padding-top:24px;">
            <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin-bottom:16px;">
              4. Farm Pickup Location
            </h3>

            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">State *</label>
                <input type="text" id="input-listing-state" required value="Tamil Nadu" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">District *</label>
                <input type="text" id="input-listing-district" required value="Coimbatore" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>

              <div>
                <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Pincode *</label>
                <input type="text" id="input-listing-pincode" required value="642001" style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px;" />
              </div>
            </div>

            <div>
              <label style="display:block; font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Detailed Description & Special Notes</label>
              <textarea id="input-listing-desc" rows="3" placeholder="Provide additional details regarding bale density, road accessibility for 10-wheel trucks, weighbridge distance, etc..." style="width:100%; padding:10px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; font-family:'Plus Jakarta Sans', sans-serif; outline:none;"></textarea>
            </div>

          </div>

          <!-- Submit Button -->
          <div style="border-top:1px solid #f0f6f0; padding-top:24px; display:flex; justify-content:flex-end; gap:16px;">
            <a href="#marketplace" style="padding:12px 24px; border:1px solid #cbd5e1; border-radius:10px; font-size:14px; font-weight:700; color:#475569; text-decoration:none;">
              Cancel
            </a>
            <button type="submit" id="btn-submit-listing" style="background:#16a34a; color:white; border:none; padding:12px 32px; border-radius:10px; font-size:15px; font-weight:800; cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,0.3);">
              Publish Agricultural Waste Listing →
            </button>
          </div>

        </form>

      </div>
    </div>
  `;
}
