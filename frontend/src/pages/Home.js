/**
 * Home Landing Page Component
 */

import { store } from "../store/state.js";
import { INITIAL_CATEGORIES } from "../store/initialData.js";
import { renderWasteCard } from "../components/WasteCard.js";
import { formatINR } from "../utils/formatters.js";

export function renderHomePage() {
  const listings = store.getListings();
  const featuredListings = listings.filter(l => l.featured).slice(0, 4);
  const sustainability = store.getSustainabilityMetrics();

  return `
    <div class="page-home" style="font-family:'Plus Jakarta Sans', sans-serif;">
      
      <!-- HERO SECTION -->
      <section class="hero-section" style="background:linear-gradient(135deg, #092c17 0%, #15502c 50%, #15803d 100%); color:#ffffff; padding:80px 20px 100px 20px; position:relative; overflow:hidden;">
        
        <!-- Subtle Glow & Pattern Overlay -->
        <div style="position:absolute; top:-100px; right:-100px; width:450px; height:450px; background:radial-gradient(circle, rgba(74,222,128,0.25) 0%, rgba(0,0,0,0) 70%); border-radius:50%; pointer-events:none;"></div>
        <div style="position:absolute; bottom:-120px; left:-100px; width:400px; height:400px; background:radial-gradient(circle, rgba(234,179,8,0.2) 0%, rgba(0,0,0,0) 70%); border-radius:50%; pointer-events:none;"></div>

        <div class="container" style="max-width:1280px; margin:0 auto; position:relative; z-index:2; text-align:center;">
          
          <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(255, 255, 255, 0.12); backdrop-filter:blur(8px); border:1px solid rgba(255,255,255,0.25); padding:6px 16px; border-radius:30px; font-size:15px; font-weight:700; color:#86efac; margin-bottom:24px;">
            <span>🌱</span> Tamil Nadu Circular Bio-Exchange Platform • தமிழ்நாடு
          </div>

          <h1 style="font-family:'Outfit', sans-serif; font-size:clamp(36px, 5.2vw, 62px); font-weight:800; line-height:1.2; margin:0 auto 22px auto; max-width:980px; letter-spacing:-0.5px; color:#ffffff;">
            Turn Agricultural Waste Into<br/>
            <span style="background:linear-gradient(90deg, #4ade80, #facc15); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">High-Value Revenue</span>
          </h1>

          <p style="font-size:clamp(19px, 2.2vw, 23px); color:#dcfce7; max-width:820px; margin:0 auto 36px auto; line-height:1.6; font-weight:400;">
            Connecting Tamil Nadu farmers with biomass power plants, bio-CNG refiners, composters, and packaging industries. End crop residue burning, secure escrow payouts, and monetize every ton.
          </p>

          <!-- Quick Search Box -->
          <div class="hero-search-bar" style="max-width:880px; margin:0 auto 30px auto; background:#ffffff; border-radius:20px; padding:8px 12px; display:flex; align-items:center; gap:12px; box-shadow:0 18px 45px rgba(0,0,0,0.32); border:1px solid rgba(255,255,255,0.4);">
            <div style="display:flex; align-items:center; gap:10px; flex:1; min-width:0; padding-left:12px;">
              <span style="font-size:22px; color:#16a34a; line-height:1; user-select:none;">🔍</span>
              <input 
                type="search" 
                id="hero-search-input" 
                name="q_biomass_crop_search"
                autocomplete="one-time-code" 
                autocorrect="off" 
                autocapitalize="off" 
                spellcheck="false" 
                placeholder="Search crop residues, paddy straw, bagasse, husks..." 
                style="width:100%; border:none; outline:none; font-size:18px; font-family:'Plus Jakarta Sans', sans-serif; color:#0f172a; background:transparent; padding:10px 0;" 
              />
            </div>
            
            <div style="height:36px; width:1.5px; background:#e2e8f0; flex-shrink:0;"></div>

            <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
              <span style="font-size:20px; color:#64748b; line-height:1; padding-left:8px; user-select:none;">📍</span>
              <select 
                id="hero-state-select" 
                name="tamil_district_filter"
                style="border:none; padding:10px 14px 10px 2px; font-size:16.5px; font-weight:600; color:#334155; outline:none; background:#ffffff; font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer; min-width:225px; border-radius:8px;"
              >
                <option value="all">All Tamil Nadu Districts</option>
                <option value="Thanjavur">Thanjavur (Cauvery Delta)</option>
                <option value="Coimbatore">Coimbatore & Pollachi</option>
                <option value="Madurai">Madurai & Theni</option>
                <option value="Tiruppur">Tiruppur & Kangeyam</option>
                <option value="Erode">Erode & Bhavani</option>
                <option value="Salem">Salem & Attur</option>
                <option value="Tiruchirappalli">Tiruchirappalli (Trichy)</option>
                <option value="Tirunelveli">Tirunelveli & Tenkasi</option>
                <option value="Thoothukudi">Thoothukudi (Tuticorin)</option>
                <option value="Cuddalore">Cuddalore & Villupuram</option>
                <option value="Dindigul">Dindigul & Palani</option>
                <option value="Thiruvarur">Thiruvarur Delta</option>
                <option value="Namakkal">Namakkal Agro</option>
              </select>
            </div>

            <button 
              id="btn-hero-search" 
              type="button"
              style="background:linear-gradient(135deg, #16a34a, #15803d); color:white; border:none; padding:14px 30px; border-radius:14px; font-size:18px; font-weight:800; cursor:pointer; font-family:'Plus Jakarta Sans', sans-serif; display:inline-flex; align-items:center; justify-content:center; gap:8px; flex-shrink:0; box-shadow:0 4px 14px rgba(22,163,74,0.35); transition:all 0.2s;"
            >
              Search Waste
            </button>
          </div>

          <!-- Hero Action Buttons -->
          <div style="display:flex; justify-content:center; align-items:center; gap:16px; flex-wrap:wrap; margin-top:10px;">
            <a href="#sell-waste" style="background:#22c55e; color:#052e16; padding:15px 30px; border-radius:12px; font-size:18.5px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 15px rgba(34,197,94,0.35);">
              <span>🧑‍🌾</span> Sell Agricultural Waste
            </a>
            <a href="#marketplace" style="background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); color:white; border:1px solid rgba(255,255,255,0.3); padding:15px 30px; border-radius:12px; font-size:18.5px; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
              <span>🏭</span> Explore 50+ Listings
            </a>
          </div>

        </div>

      </section>

      <!-- LIVE NATIONAL METRICS COUNTER -->
      <section style="background:#ffffff; border-bottom:1px solid #e2ece2; padding:30px 20px; box-shadow:0 4px 12px rgba(15,61,33,0.03);">
        <div class="container" style="max-width:1280px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:24px; text-align:center;">
          
          <div>
            <span style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#16a34a; display:block;">${sustainability.totalWasteReusedTons.toLocaleString("en-IN")}+</span>
            <span style="font-size:15px; font-weight:600; color:#64748b;">Tons Biomass Reused</span>
          </div>

          <div>
            <span style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#0284c7; display:block;">${sustainability.farmersBenefited.toLocaleString("en-IN")}+</span>
            <span style="font-size:15px; font-weight:600; color:#64748b;">Registered Farmers</span>
          </div>

          <div>
            <span style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#d97706; display:block;">${sustainability.businessesConnected.toLocaleString("en-IN")}+</span>
            <span style="font-size:15px; font-weight:600; color:#64748b;">Industrial Buyers</span>
          </div>

          <div>
            <span style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#9333ea; display:block;">${sustainability.co2EmissionsAvoidedTons.toLocaleString("en-IN")}+</span>
            <span style="font-size:15px; font-weight:600; color:#64748b;">Tons CO₂ Burning Mitigated</span>
          </div>

          <div>
            <span style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#15803d; display:block;">₹7.85 Cr+</span>
            <span style="font-size:15px; font-weight:600; color:#64748b;">Farmer Earnings Created</span>
          </div>

        </div>
      </section>

      <!-- AGRICULTURAL WASTE CATEGORIES -->
      <section style="padding:70px 20px; background:#f7faf7;">
        <div class="container" style="max-width:1280px; margin:0 auto;">
          
          <div style="text-align:center; margin-bottom:40px;">
            <span style="font-size:14px; font-weight:800; color:#16a34a; text-transform:uppercase; letter-spacing:1px;">Categorized Residues</span>
            <h2 style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#0f172a; margin-top:6px;">
              Agricultural Waste Categories
            </h2>
            <p style="font-size:18px; color:#64748b; max-width:600px; margin:8px auto 0 auto;">
              Browse available crop residues, woody biomass, animal manure, and processing husks.
            </p>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:20px;">
            ${INITIAL_CATEGORIES.slice(0, 8)
              .map(
                cat => `
              <a href="#marketplace?category=${cat.id}" style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:18px; text-decoration:none; color:inherit; display:flex; gap:16px; align-items:center; box-shadow:0 2px 8px rgba(15,61,33,0.04); transition:all 0.2s;" class="category-card">
                <img src="${cat.image}" alt="${cat.name}" onerror="this.onerror=null; this.src='/images/waste/paddy-straw.jpg';" style="width:64px; height:64px; border-radius:12px; object-fit:cover; flex-shrink:0;" />
                <div>
                  <h4 style="font-family:'Outfit', sans-serif; font-size:19px; font-weight:700; color:#0f172a; margin-bottom:4px;">${cat.name}</h4>
                  <span style="font-size:14px; color:#16a34a; font-weight:700; display:block;">${cat.count} Available</span>
                  <span style="font-size:13px; color:#64748b;">${cat.listingsCount} Listings</span>
                </div>
              </a>
            `
              )
              .join("")}
          </div>

          <div style="text-align:center; margin-top:30px;">
            <a href="#marketplace" style="display:inline-block; background:#ffffff; border:1px solid #16a34a; color:#16a34a; padding:10px 24px; border-radius:10px; font-size:17px; font-weight:700; text-decoration:none;">
              View All 12 Categories →
            </a>
          </div>

        </div>
      </section>

      <!-- FEATURED LISTINGS SECTION -->
      <section style="padding:70px 20px; background:#ffffff;">
        <div class="container" style="max-width:1280px; margin:0 auto;">
          
          <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:36px; flex-wrap:wrap; gap:16px;">
            <div>
              <span style="font-size:14px; font-weight:800; color:#16a34a; text-transform:uppercase; letter-spacing:1px;">Verified Supply</span>
              <h2 style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#0f172a; margin-top:4px;">
                Featured Waste Listings
              </h2>
            </div>
            <a href="#marketplace" style="color:#16a34a; font-weight:700; font-size:17px; text-decoration:none;">
              Browse all 50+ listings →
            </a>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:24px;">
            ${featuredListings.map(l => renderWasteCard(l)).join("")}
          </div>

        </div>
      </section>

      <!-- 5-STEP HOW IT WORKS -->
      <section style="padding:80px 20px; background:#092c17; color:#ffffff;">
        <div class="container" style="max-width:1280px; margin:0 auto;">
          
          <div style="text-align:center; margin-bottom:50px;">
            <span style="font-size:14px; font-weight:800; color:#86efac; text-transform:uppercase; letter-spacing:1px;">Fulfillment Process</span>
            <h2 style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#ffffff; margin-top:6px;">
              How AgriWaste Marketplace Works
            </h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
            
            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:#16a34a; color:white; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">1</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">Farmer Lists Waste</h4>
              <p style="font-size:15px; color:#a7f3d0; line-height:1.5;">Farmer uploads photos. AI auto-detects waste category, recommends pricing & tons.</p>
            </div>

            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:#16a34a; color:white; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">2</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">Buyer Discovers</h4>
              <p style="font-size:15px; color:#a7f3d0; line-height:1.5;">Biomass, feed, or bio-CNG industries filter by distance, moisture, and quality grade.</p>
            </div>

            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:#16a34a; color:white; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">3</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">Escrow Order Placed</h4>
              <p style="font-size:15px; color:#a7f3d0; line-height:1.5;">Buyer places order with upfront escrow deposit (UPI, Card, NetBanking). Funds secured.</p>
            </div>

            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:#16a34a; color:white; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">4</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">Farm Pickup & Transit</h4>
              <p style="font-size:15px; color:#a7f3d0; line-height:1.5;">Transporter truck weighs and loads at the farm gate with real-time GPS tracking.</p>
            </div>

            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:16px; padding:24px; text-align:center;">
              <div style="width:48px; height:48px; border-radius:50%; background:#16a34a; color:white; font-size:23px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px auto;">5</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; margin-bottom:8px;">Payout & Upcycling</h4>
              <p style="font-size:15px; color:#a7f3d0; line-height:1.5;">Farmer receives bank payout instantly; waste is converted to pellets, paper, or Bio-CNG.</p>
            </div>

          </div>

        </div>
      </section>

      <!-- WASTE TO PRODUCT SPOTLIGHT -->
      <section style="padding:70px 20px; background:#f7faf7;">
        <div class="container" style="max-width:1280px; margin:0 auto;">
          
          <div style="text-align:center; margin-bottom:40px;">
            <span style="font-size:14px; font-weight:800; color:#16a34a; text-transform:uppercase; letter-spacing:1px;">Circular Bio-Economy</span>
            <h2 style="font-family:'Outfit', sans-serif; font-size:37px; font-weight:800; color:#0f172a; margin-top:6px;">
              Smart Waste-to-Product Pathways
            </h2>
          </div>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
            
            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="font-size:37px; margin-bottom:12px;">🌾 ➔ ⚡</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin-bottom:8px;">Paddy Straw ➔ Biomass Energy</h4>
              <p style="font-size:15px; color:#475569; line-height:1.5; margin-bottom:12px;">High-density pellets and briquettes replacement for fossil coal in thermal boilers and gasifiers.</p>
              <span style="background:#f0fdf4; color:#16a34a; font-size:13px; font-weight:700; padding:4px 10px; border-radius:6px;">4,200 kcal/kg Calorific Value</span>
            </div>

            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="font-size:37px; margin-bottom:12px;">🥥 ➔ 💧</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin-bottom:8px;">Coconut Shell ➔ Activated Carbon</h4>
              <p style="font-size:15px; color:#475569; line-height:1.5; margin-bottom:12px;">High surface area microporous carbon for industrial water, air purification, and gold recovery.</p>
              <span style="background:#f0fdf4; color:#16a34a; font-size:13px; font-weight:700; padding:4px 10px; border-radius:6px;">Fixed Carbon > 72%</span>
            </div>

            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="font-size:37px; margin-bottom:12px;">🌿 ➔ 🍽️</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin-bottom:8px;">Sugarcane Bagasse ➔ Tableware</h4>
              <p style="font-size:15px; color:#475569; line-height:1.5; margin-bottom:12px;">Compostable food trays, cups, and bowls replacing single-use plastic with 100% natural fiber.</p>
              <span style="background:#f0fdf4; color:#16a34a; font-size:13px; font-weight:700; padding:4px 10px; border-radius:6px;">90-Day Biodegradable</span>
            </div>

            <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:16px; padding:24px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
              <div style="font-size:37px; margin-bottom:12px;">🐄 ➔ ⛽</div>
              <h4 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin-bottom:8px;">Cow Dung ➔ Compressed Bio-Gas (CBG)</h4>
              <p style="font-size:15px; color:#475569; line-height:1.5; margin-bottom:12px;">Clean vehicular green fuel and fermented organic slurry under the national SATAT initiative.</p>
              <span style="background:#f0fdf4; color:#16a34a; font-size:13px; font-weight:700; padding:4px 10px; border-radius:6px;">Methane Content > 90%</span>
            </div>

          </div>

        </div>
      </section>

      <!-- CTA CALLOUT -->
      <section style="padding:60px 20px; background:#ffffff;">
        <div class="container" style="max-width:1280px; margin:0 auto; background:linear-gradient(135deg, #15803d, #0f3d21); border-radius:24px; padding:50px 30px; text-align:center; color:white;">
          <h2 style="font-family:'Outfit', sans-serif; font-size:clamp(30px, 4.5vw, 44px); font-weight:800; margin-bottom:14px;">
            Ready to Monetize Your Agricultural Waste?
          </h2>
          <p style="font-size:19px; color:#dcfce7; max-width:650px; margin:0 auto 28px auto;">
            List your crop residues in under 2 minutes with AI Auto-Classification. Connect with verified buyers across India.
          </p>
          <a href="#sell-waste" style="background:#facc15; color:#0f172a; padding:14px 32px; border-radius:12px; font-size:18px; font-weight:800; text-decoration:none; display:inline-block; box-shadow:0 4px 15px rgba(250,204,21,0.4);">
            List Waste for Free Today →
          </a>
        </div>
      </section>

    </div>
  `;
}
