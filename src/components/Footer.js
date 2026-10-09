/**
 * Footer Component with Sustainability Highlights & Quick Links
 */

export function renderFooter() {
  return `
    <footer style="background:#092c17; color:#dcfce7; padding:60px 0 30px 0; margin-top:auto; border-top:4px solid #16a34a;">
      <div class="container" style="max-width:1380px; margin:0 auto; padding:0 20px;">
        
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:40px; margin-bottom:50px;">
          
          <!-- Column 1: Brand & Mission -->
          <div>
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
              <div style="background:#16a34a; width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:20px;">🌾</div>
              <span style="font-family:'Outfit', sans-serif; font-weight:800; font-size:22px; color:#ffffff;">AgriWaste</span>
            </div>
            <p style="font-size:14px; line-height:1.7; color:#a7f3d0; margin-bottom:20px;">
              Empowering Indian farmers and industrial bio-refiners to eliminate crop burning, valorize agricultural residues, and fuel the national circular bioeconomy.
            </p>
            <div style="display:flex; gap:12px;">
              <span style="background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:8px; font-size:12px; font-weight:600;">🇮🇳 Made for Indian Agriculture</span>
              <span style="background:rgba(255,255,255,0.1); padding:8px 12px; border-radius:8px; font-size:12px; font-weight:600;">🌱 Zero Burning</span>
            </div>
          </div>

          <!-- Column 2: Key Waste Categories -->
          <div>
            <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#ffffff; margin-bottom:18px; border-left:3px solid #4ade80; padding-left:10px;">
              Agri Waste Categories
            </h4>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px; font-size:14px;">
              <li><a href="#marketplace?category=paddy-straw" style="color:#a7f3d0; text-decoration:none;">Paddy & Rice Straw Bales</a></li>
              <li><a href="#marketplace?category=sugarcane-bagasse" style="color:#a7f3d0; text-decoration:none;">Sugarcane Bagasse Biomass</a></li>
              <li><a href="#marketplace?category=coconut-husk-shell" style="color:#a7f3d0; text-decoration:none;">Coconut Husk & Coir Shells</a></li>
              <li><a href="#marketplace?category=wheat-straw" style="color:#a7f3d0; text-decoration:none;">Wheat Straw (Bhusa / Turi)</a></li>
              <li><a href="#marketplace?category=animal-manure" style="color:#a7f3d0; text-decoration:none;">Cow Dung & Bio-Gas Slurry</a></li>
              <li><a href="#marketplace?category=groundnut-shell" style="color:#a7f3d0; text-decoration:none;">Groundnut Shells & Briquettes</a></li>
            </ul>
          </div>

          <!-- Column 3: Platform & Dashboards -->
          <div>
            <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#ffffff; margin-bottom:18px; border-left:3px solid #4ade80; padding-left:10px;">
              Platform Navigation
            </h4>
            <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:10px; font-size:14px;">
              <li><a href="#marketplace" style="color:#a7f3d0; text-decoration:none;">Browse All 50+ Listings</a></li>
              <li><a href="#sell-waste" style="color:#a7f3d0; text-decoration:none;">Sell Agricultural Waste</a></li>
              <li><a href="#sustainability" style="color:#a7f3d0; text-decoration:none;">Sustainability & Carbon Offset</a></li>
              <li><a href="#farmer-dashboard" style="color:#a7f3d0; text-decoration:none;">Farmer Hub & Earnings</a></li>
              <li><a href="#buyer-dashboard" style="color:#a7f3d0; text-decoration:none;">Industrial Procurement Hub</a></li>
              <li><a href="#admin-dashboard" style="color:#a7f3d0; text-decoration:none;">Administrator Console</a></li>
            </ul>
          </div>

          <!-- Column 4: National Impact Summary -->
          <div>
            <h4 style="font-family:'Outfit', sans-serif; font-size:16px; font-weight:700; color:#ffffff; margin-bottom:18px; border-left:3px solid #4ade80; padding-left:10px;">
              National Impact
            </h4>
            <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
              <div style="margin-bottom:12px;">
                <span style="font-size:22px; font-weight:800; color:#4ade80; display:block;">28,450+ Tons</span>
                <span style="font-size:12px; color:#a7f3d0;">Agri Waste Reused & Monetized</span>
              </div>
              <div>
                <span style="font-size:22px; font-weight:800; color:#fbbf24; display:block;">19,800+ Tons</span>
                <span style="font-size:12px; color:#a7f3d0;">CO₂ Open Burning Mitigated</span>
              </div>
            </div>
          </div>

        </div>

        <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:24px; display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; font-size:13px; color:#86efac;">
          <p>© 2026 AgriWaste Circular Bio-Exchange Ltd. All rights reserved.</p>
          <div style="display:flex; gap:20px;">
            <a href="#terms" style="color:#86efac; text-decoration:none;">Terms of Service</a>
            <a href="#privacy" style="color:#86efac; text-decoration:none;">Privacy Policy</a>
            <a href="#security" style="color:#86efac; text-decoration:none;">Escrow Security</a>
          </div>
        </div>

      </div>
    </footer>
  `;
}
