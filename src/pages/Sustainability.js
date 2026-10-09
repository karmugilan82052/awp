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
          <div style="display:inline-flex; align-items:center; gap:6px; background:#dcfce7; color:#15803d; font-size:12px; font-weight:800; padding:4px 14px; border-radius:20px; margin-bottom:10px;">
            <span>🌱</span> National Circular Bioeconomy Accounting
          </div>
          <h1 style="font-family:'Outfit', sans-serif; font-size:36px; font-weight:800; color:#0f172a; margin:0;">
            Sustainability & Carbon Burning Mitigation Hub
          </h1>
          <p style="font-size:15px; color:#64748b; max-width:700px; margin:8px auto 0 auto; line-height:1.6;">
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

        <!-- Interactive Environmental Impact Analytics Grid -->
        <div style="display:grid; grid-template-columns:1.3fr 1fr; gap:28px; margin-bottom:40px;" class="sustainability-charts-grid">
          
          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                🔥 Stubble Burning Incidents Avoided (Monthly)
              </h3>
              <span style="font-size:12px; color:#16a34a; font-weight:700;">Northern & Southern Agri Belts</span>
            </div>
            <div style="height:260px; position:relative;">
              <canvas id="sustainability-burning-chart"></canvas>
            </div>
          </div>

          <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:24px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h3 style="font-family:'Outfit', sans-serif; font-size:18px; font-weight:700; color:#0f172a; margin:0;">
                ♻️ Bio-Product Transformation Split
              </h3>
              <span style="font-size:12px; color:#64748b;">Industrial Destination</span>
            </div>
            <div style="height:260px; position:relative;">
              <canvas id="sustainability-split-chart"></canvas>
            </div>
          </div>

        </div>

        <!-- State-Wise Environmental Mitigation Leaderboard -->
        <div style="background:#ffffff; border:1px solid #e2ece2; border-radius:18px; padding:28px; box-shadow:0 2px 10px rgba(15,61,33,0.04);">
          <h3 style="font-family:'Outfit', sans-serif; font-size:20px; font-weight:700; color:#0f172a; margin-bottom:8px;">
            🇮🇳 State-wise Agricultural Waste Valorization Leaderboard
          </h3>
          <p style="font-size:13px; color:#64748b; margin-bottom:20px;">
            Top states leading the transition to clean biomass exchange and zero open burning:
          </p>

          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px;">
            
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:16px; color:#14532d;">1. Punjab & Haryana</strong>
                <span style="font-size:11px; background:#16a34a; color:white; font-weight:800; padding:2px 8px; border-radius:10px;">Leader</span>
              </div>
              <span style="font-size:22px; font-weight:800; color:#16a34a; display:block;">9,450 Tons</span>
              <p style="font-size:12px; color:#4b6354; margin:4px 0 0 0;">Paddy straw & wheat bhusa redirected to bio-pellets and bio-CNG.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:16px; color:#0f172a;">2. Maharashtra</strong>
                <span style="font-size:11px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#2</span>
              </div>
              <span style="font-size:22px; font-weight:800; color:#0f172a; display:block;">6,800 Tons</span>
              <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">Sugarcane bagasse & cotton stalk supplied to boiler cogeneration.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:16px; color:#0f172a;">3. Tamil Nadu & Kerala</strong>
                <span style="font-size:11px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#3</span>
              </div>
              <span style="font-size:22px; font-weight:800; color:#0f172a; display:block;">5,600 Tons</span>
              <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">Coconut shells & banana pseudo-stems for activated carbon & eco-fiber.</p>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <strong style="font-size:16px; color:#0f172a;">4. Gujarat & Rajasthan</strong>
                <span style="font-size:11px; background:#e2e8f0; color:#475569; font-weight:800; padding:2px 8px; border-radius:10px;">#4</span>
              </div>
              <span style="font-size:22px; font-weight:800; color:#0f172a; display:block;">4,100 Tons</span>
              <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">Groundnut shells & mustard straw utilized for briquettes & bio-coal.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}
