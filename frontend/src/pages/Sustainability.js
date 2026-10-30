/**
 * Sustainability & Carbon Offset Analytics Page Component
 */

import { store } from "../store/state.js";
import { renderStatCard } from "../components/StatCard.js";

export function renderSustainabilityPage() {
  const s = store.getSustainabilityMetrics();

  return `
    <div class="page-sustainability" style="padding:40px 20px; font-family:'Plus Jakarta Sans', sans-serif; background:#f7faf7; min-height:85vh;">
      <div class="container" style="max-width:1200px; margin:0 auto;">
        
        <!-- Header -->
        <div style="text-align:center; margin-bottom:40px;">
          <div style="display:inline-flex; align-items:center; gap:6px; background:#dcfce7; color:#15803d; font-size:14px; font-weight:800; padding:4px 14px; border-radius:20px; margin-bottom:10px;">
            <span>🌱</span> National Circular Bioeconomy Accounting
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:41px; font-weight:800; color:#0f172a; margin:0;">
            Sustainability & Carbon Burning Mitigation Hub
          </h1>
          <p style="font-size:18px; color:#64748b; max-width:700px; margin:8px auto 0 auto; line-height:1.6;">
            Quantifying the environmental and economic impact of redirecting agricultural residues from open field burning to industrial bio-energy, paper, and compost products.
          </p>
        </div>

        <!-- 4 Hero Stat Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px; margin-bottom:40px;">
          ${renderStatCard({
            title: "Total Agricultural Waste Reused",
            value: `${s.totalWasteReusedTons.toLocaleString("en-IN")} Tons`,
            subtitle: "100% Monetized & Upcycled",
            icon: "🌾",
            color: "green"
          })}

          ${renderStatCard({
            title: "CO₂ Equivalent Mitigated",
            value: `${s.co2EmissionsAvoidedTons.toLocaleString("en-IN")} Tons`,
            subtitle: "Open Field Stubble Burning Avoided",
            icon: "☁️",
            color: "blue"
          })}

          ${renderStatCard({
            title: "Tree Absorption Equivalent",
            value: `${s.treesEquivalentSaved.toLocaleString("en-IN")}`,
            subtitle: "Annual Carbon Absorption Impact",
            icon: "🌲",
            color: "purple"
          })}

          ${renderStatCard({
            title: "Kisan Income Generated",
            value: "₹7.85 Crore+",
            subtitle: "Direct Bank Transfer Escrow",
            icon: "💰",
            color: "amber"
          })}
        </div>

        <!-- Enterprise ESG Green Compliance Certificate Feature Banner -->
        <div style="background:linear-gradient(135deg, #092c17 0%, #14532d 55%, #15803d 100%); border-radius:20px; padding:28px 34px; margin-bottom:40px; color:white; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; box-shadow:0 10px 25px rgba(20,83,45,0.25);">
          <div style="max-width:700px;">
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.18); backdrop-filter:blur(6px); color:#dcfce7; font-size:12px; font-weight:800; padding:3px 12px; border-radius:20px; margin-bottom:8px;">
              <span>📜</span> SEBI BRSR Core Mandate & Carbon Audit Standard
            </div>
            <h2 style="font-family:'Outfit', sans-serif; font-size:26px; font-weight:800; margin:0 0 8px 0; color:#ffffff;">
              Enterprise B2B ESG Green Compliance & Decarbonization Certificates
            </h2>
            <p style="font-size:15px; color:#dcfce7; line-height:1.6; margin:0;">
              Every agricultural biomass order on our platform automatically generates a tamper-proof, auditable <strong>ESG Compliance Certificate (PDF/Print)</strong> documenting verified CO₂e stubble burning avoidance, thermal coal replacement, and direct rural farmer DBT disbursements.
            </p>
          </div>

          <div style="display:flex; gap:12px; flex-wrap:wrap;">
            <button id="btn-preview-sample-esg" style="background:#ffffff; color:#14532d; border:none; padding:12px 22px; border-radius:12px; font-size:15px; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:8px; box-shadow:0 4px 14px rgba(0,0,0,0.2); transition:all 0.15s ease;">
              <span>🌱</span> Preview Sample ESG Certificate
            </button>
            <a href="#buyer-esg" style="background:rgba(255,255,255,0.15); border:1.5px solid rgba(255,255,255,0.3); color:white; text-decoration:none; padding:12px 20px; border-radius:12px; font-size:15px; font-weight:700; display:flex; align-items:center; gap:6px;">
              <span>🏭</span> Buyer ESG Hub →
            </a>
          </div>
        </div>

        <!-- Interactive Environmental Impact Analytics Grid -->
        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:28px; margin-bottom:40px;" class="sustainability-charts-grid">
          
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin:0;">
                🔥 Stubble Burning Incidents Avoided (Monthly)
              </h3>
              <span style="font-size:14px; color:#16a34a; font-weight:700;">Northern & Southern Agri Belts</span>
            </div>
            <div style="height:260px; position:relative;">
              <canvas id="sustainability-burning-chart"></canvas>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:21px; font-weight:700; color:#0f172a; margin:0;">
                ♻️ Bio-Product Transformation Split
              </h3>
              <span style="font-size:14px; color:#64748b;">Industrial Destination</span>
            </div>
            <div style="height:260px; position:relative;">
              <canvas id="sustainability-split-chart"></canvas>
            </div>
          </div>

        </div>

        <!-- State-Wise Environmental Mitigation Leaderboard -->
        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:28px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
          <h3 style="font-family:'Outfit', sans-serif; font-size:23px; font-weight:700; color:#0f172a; margin-bottom:8px;">
            🇮🇳 State-wise Agricultural Waste Valorization Leaderboard
          </h3>
          <p style="font-size:15px; color:#64748b; margin-bottom:20px;">
            Top states leading the transition to clean biomass exchange and zero open burning:
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
            
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:19px; color:#14532d;">1. Cauvery Delta (Thanjavur & Tiruvarur)</strong>
                <span style="font-size:13px; background:#16a34a; color:white; font-weight:800; padding:2px 8px; border-radius:10px;">Leader</span>
              </div>
              <span style="font-size:25px; font-weight:800; color:#16a34a; display:block;">9,450 Tons</span>
              <p style="font-size:14px; color:#4b6354; margin:4px 0 0 0;">Paddy straw and rice husk redirected to bio-pellets and bio-CNG.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:19px; color:#0f172a;">2. Kongu Region (Coimbatore, Erode & Tiruppur)</strong>
                <span style="font-size:13px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#2</span>
              </div>
              <span style="font-size:25px; font-weight:800; color:#0f172a; display:block;">6,800 Tons</span>
              <p style="font-size:14px; color:#64748b; margin:4px 0 0 0;">Coconut coir pith, bagasse & cotton stalks supplied to boilers.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:19px; color:#0f172a;">3. Southern Belt (Madurai, Theni & Dindigul)</strong>
                <span style="font-size:13px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#3</span>
              </div>
              <span style="font-size:25px; font-weight:800; color:#0f172a; display:block;">5,600 Tons</span>
              <p style="font-size:14px; color:#64748b; margin:4px 0 0 0;">Banana pseudo-stems, compost & manure for organic farming.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:19px; color:#0f172a;">4. Coastal & Industrial Zone (Thoothukudi & Cuddalore)</strong>
                <span style="font-size:13px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#4</span>
              </div>
              <span style="font-size:25px; font-weight:800; color:#0f172a; display:block;">4,100 Tons</span>
              <p style="font-size:14px; color:#64748b; margin:4px 0 0 0;">Coconut shells for activated carbon and groundnut shells for bio-coal.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}
