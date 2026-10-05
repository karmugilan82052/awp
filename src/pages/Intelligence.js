/**
 * AgriWaste Intelligence Page Component
 * Renders full intelligence analytics, suitability scoring matrix, buyer matching,
 * multi-farmer supply aggregation, and dynamic value optimization.
 */

import { store } from "../store/state.js";
import { formatINR, formatNumber } from "../utils/formatters.js";
import {
  calculateQualityScore,
  calculateSuitabilityScore,
  determineRecommendedApplications,
  estimateWasteValue,
  calculateEnvironmentalImpact
} from "../lib/server/wasteIntelligence.ts";

export function renderIntelligencePage(params = {}) {
  const activeTab = params.tab || "all";
  const enrichedListings = store.getEnrichedListings();
  const aggregationOpportunities = store.getAggregatedSupplyOpportunities();
  const platformMetrics = store.getPlatformIntelligenceMetrics();

  // Filter listings based on params
  let filtered = [...enrichedListings];
  if (params.category && params.category !== "all") {
    filtered = filtered.filter(l => l.category === params.category);
  }
  if (params.minWss) {
    const minWssVal = parseFloat(params.minWss);
    filtered = filtered.filter(l => l.suitability.wssScore >= minWssVal);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      l =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        (l.recommendations[0]?.application_name || "").toLowerCase().includes(q)
    );
  }

  return `
    <div class="page-container py-8 bg-slate-50 min-h-screen">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- 1. HERO HEADER BANNER -->
        <div class="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 rounded-3xl text-white p-8 md:p-10 shadow-xl mb-10 relative overflow-hidden">
          <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <svg class="w-96 h-96" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <div class="relative z-10 max-w-3xl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-400/30">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Patent-Oriented Technical Architecture
            </div>
            
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
              AgriWaste Intelligence Engine
            </h1>
            
            <p class="text-emerald-100 text-base sm:text-lg leading-relaxed mb-6">
              Multi-Factor Suitability Scoring (WSS), Application Recommendation, Buyer Compatibility Matching, Multi-Farmer Supply Aggregation, and Value Optimization.
            </p>
            
            <!-- Technical Pipeline Visual -->
            <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 bg-emerald-950/40 backdrop-blur-md p-3 rounded-2xl border border-emerald-400/20 text-center text-xs font-medium text-emerald-200">
              <div class="p-1">1. Characteristics</div>
              <div class="p-1">2. Quality Score</div>
              <div class="p-1">3. WSS Score</div>
              <div class="p-1">4. Application</div>
              <div class="p-1">5. Buyer Match</div>
              <div class="p-1">6. Aggregation</div>
              <div class="p-1">7. Value Uplift</div>
              <div class="p-1">8. Transaction</div>
            </div>
          </div>
        </div>

        <!-- 2. PLATFORM INTELLIGENCE METRICS CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div class="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-bold">
              🧠
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500 uppercase">Avg Suitability (WSS)</div>
              <div class="text-2xl font-extrabold text-slate-900 mt-1">${platformMetrics.avgSuitabilityScore}/100</div>
              <div class="text-xs text-emerald-600 font-medium mt-0.5">Suitable Platform Index</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div class="w-13 h-13 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold">
              🤝
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500 uppercase">Aggregated Supply</div>
              <div class="text-2xl font-extrabold text-slate-900 mt-1">${platformMetrics.activeAggregationOpportunities} Clusters</div>
              <div class="text-xs text-blue-600 font-medium mt-0.5">Multi-Farmer Pools</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div class="w-13 h-13 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
              📈
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500 uppercase">Est. Value Uplift</div>
              <div class="text-2xl font-extrabold text-slate-900 mt-1">₹${(platformMetrics.totalValueUpliftRs / 100000).toFixed(2)} Lakhs</div>
              <div class="text-xs text-amber-600 font-medium mt-0.5">Via Optimal Utilization</div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-4">
            <div class="w-13 h-13 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl font-bold">
              🌱
            </div>
            <div>
              <div class="text-xs font-medium text-slate-500 uppercase">Est. CO₂e Avoided</div>
              <div class="text-2xl font-extrabold text-slate-900 mt-1">${platformMetrics.totalCO2AvoidedTons} Tons</div>
              <div class="text-xs text-teal-600 font-medium mt-0.5">Open Burning Mitigation</div>
            </div>
          </div>
        </div>

        <!-- 3. NAVIGATION TABS & FILTER BAR -->
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div class="flex flex-wrap gap-2 w-full md:w-auto">
            <button class="btn-intel-tab px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-tab="all">
              ⚡ All Waste Listings (${filtered.length})
            </button>
            <button class="btn-intel-tab px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'aggregation' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-tab="aggregation">
              🤝 Multi-Farmer Supply Aggregation (${aggregationOpportunities.length})
            </button>
            <button class="btn-intel-tab px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'calculator' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}" data-tab="calculator">
              🧮 Interactive WSS Calculator
            </button>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <input 
              type="text" 
              id="intel-search-input" 
              placeholder="Search by waste, location, or recommended use..." 
              value="${params.search || ''}" 
              class="px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
            />
            <button id="btn-intel-search" class="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800">
              Filter
            </button>
          </div>
        </div>

        <!-- 4. TAB CONTENTS -->
        
        ${activeTab === 'calculator' ? renderInteractiveCalculator() : ''}
        ${activeTab === 'aggregation' ? renderAggregationView(aggregationOpportunities) : ''}
        ${activeTab === 'all' || activeTab === '' ? renderListingsGrid(filtered) : ''}

      </div>
    </div>
  `;
}

function renderListingsGrid(listings) {
  if (listings.length === 0) {
    return `
      <div class="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div class="text-4xl mb-3">🔍</div>
        <h3 class="text-lg font-bold text-slate-800">No Waste Listings Found</h3>
        <p class="text-sm text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
      </div>
    `;
  }

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${listings.map(item => {
        const bestApp = item.recommendations[0];
        const topBuyerMatch = item.buyerMatches[0];
        const wssColor = item.suitability.wssScore >= 80 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                         item.suitability.wssScore >= 60 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300';
        
        const qGradeColor = item.quality.grade === 'Excellent' ? 'bg-emerald-500' :
                            item.quality.grade === 'Good' ? 'bg-green-500' : 'bg-amber-500';

        return `
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            
            <!-- Card Header -->
            <div class="p-5 border-b border-slate-100">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${wssColor} border mb-2">
                    WSS: ${item.suitability.wssScore}/100 • ${item.suitability.categoryLabel}
                  </span>
                  <h3 class="font-bold text-slate-900 text-lg leading-snug">${item.title}</h3>
                  <p class="text-xs text-slate-500 mt-1 font-medium">📍 ${item.location} • ⚖️ ${item.quantity} ${item.unit || 'Tons'}</p>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400 font-medium">Listing Price</div>
                  <div class="text-lg font-extrabold text-slate-900">₹${item.price.toLocaleString('en-IN')}</div>
                  <div class="text-[10px] text-slate-500">Per ${item.unit || 'Ton'}</div>
                </div>
              </div>
            </div>

            <!-- Card Body / Intelligence Summary -->
            <div class="p-5 flex-1 space-y-4">
              
              <!-- Quality Score & Breakdown -->
              <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div class="flex justify-between items-center text-xs mb-1.5">
                  <span class="font-semibold text-slate-700">Quality Score: ${item.quality.score}/100</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold text-white ${qGradeColor}">${item.quality.grade}</span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div class="${qGradeColor} h-full rounded-full" style="width: ${item.quality.score}%"></div>
                </div>
                <div class="text-[11px] text-slate-500 mt-2 line-clamp-1">
                  💧 Moisture: ${item.moisture || '12%'} | Contamination: ${item.contamination_level || 'Low'}
                </div>
              </div>

              <!-- Recommended Best Application -->
              <div class="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/60">
                <div class="flex items-center justify-between text-xs mb-1">
                  <span class="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>🌟</span> Recommended Best Use
                  </span>
                  <span class="font-extrabold text-emerald-700">${bestApp?.suitability_score || 90}% Match</span>
                </div>
                <div class="text-sm font-extrabold text-emerald-950">${bestApp?.application_name || 'Composting'}</div>
                <div class="text-[11px] text-emerald-800 mt-1 line-clamp-2">${bestApp?.reason || ''}</div>
              </div>

              <!-- Top Buyer Match -->
              ${topBuyerMatch ? `
                <div class="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200/60">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span class="font-bold text-blue-900 flex items-center gap-1.5">
                      <span>🏭</span> Top Buyer Match
                    </span>
                    <span class="font-extrabold text-blue-700">${topBuyerMatch.match_score}% Match</span>
                  </div>
                  <div class="text-xs font-bold text-blue-950">${topBuyerMatch.buyer_company}</div>
                  <div class="text-[11px] text-blue-800 mt-0.5">Dist: ${topBuyerMatch.distance_km || 25} km • Qty Match: ${topBuyerMatch.quantity_score}%</div>
                </div>
              ` : ''}

              <!-- Value Optimization Comparison -->
              <div class="flex items-center justify-between bg-amber-50/80 p-3 rounded-xl border border-amber-200/70 text-xs">
                <div>
                  <div class="text-slate-500 font-medium">Direct Marketplace:</div>
                  <div class="font-bold text-slate-800">₹${item.valueOpt.currentSaleValue.toLocaleString('en-IN')}</div>
                </div>
                <div class="text-right">
                  <div class="text-amber-800 font-semibold">Est. Utilization Value:</div>
                  <div class="font-extrabold text-emerald-700 text-sm">
                    ₹${item.valueOpt.potentialUtilizationValue.toLocaleString('en-IN')}
                    <span class="text-[10px] font-bold text-emerald-600 block">(+${item.valueOpt.roiIncreasePercent}%)</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Card Actions -->
            <div class="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              <a href="#waste/${item.id}" class="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2.5 rounded-xl transition-all">
                Full Intelligence Matrix
              </a>
              <button class="btn-quick-add-cart bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all" data-id="${item.id}">
                Procure
              </button>
            </div>

          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderAggregationView(opportunities) {
  if (opportunities.length === 0) {
    return `
      <div class="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <div class="text-4xl mb-3">🤝</div>
        <h3 class="text-lg font-bold text-slate-800">No Aggregation Clusters Detected</h3>
        <p class="text-sm text-slate-500 mt-1">Currently all individual listings meet small scale requirements or are dispersed.</p>
      </div>
    `;
  }

  return `
    <div class="space-y-6">
      <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
        <h2 class="text-xl font-bold text-emerald-950 flex items-center gap-2">
          <span>🤝</span> Multi-Farmer Supply Aggregation Engine
        </h2>
        <p class="text-sm text-emerald-800 mt-1">
          Automatically groups smaller neighboring farm listings of identical crop residue types into high-tonnage bulk supply clusters to fulfill large industrial buyer requirements.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${opportunities.map(agg => `
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-4">
                <div>
                  <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full border border-blue-200 mb-2">
                    Cluster Aggregation Score: ${agg.aggregationScore}/100
                  </span>
                  <h3 class="text-xl font-extrabold text-slate-900">${agg.wasteCrop || agg.wasteCategory}</h3>
                  <p class="text-xs text-slate-500 font-medium">📍 ${agg.approximateLocation}</p>
                </div>
                <div class="text-right bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  <div class="text-xs text-emerald-800 font-medium">Aggregated Supply</div>
                  <div class="text-xl font-black text-emerald-700">${agg.totalQuantity} ${agg.unit}</div>
                </div>
              </div>

              <!-- Target Buyer Requirement -->
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-xs space-y-2">
                <div class="flex justify-between font-semibold">
                  <span class="text-slate-600">Target Industrial Buyer:</span>
                  <span class="text-slate-900">${agg.targetBuyerRequirement.buyerName}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Buyer Target Volume:</span>
                  <span class="font-bold text-slate-800">${agg.targetBuyerRequirement.requiredQty} ${agg.unit}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-500">Average Cluster Quality:</span>
                  <span class="font-bold text-emerald-700">${agg.averageQualityScore}/100</span>
                </div>
              </div>

              <!-- Participating Farmers -->
              <div class="mb-4">
                <div class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Participating Farm Listings (${agg.participatingListings.length}):
                </div>
                <div class="space-y-2">
                  ${agg.participatingListings.map(farmer => `
                    <div class="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg text-xs border border-slate-100">
                      <div>
                        <span class="font-bold text-slate-800">${farmer.farmerName}</span>
                        <span class="text-slate-500 block text-[11px]">${farmer.farmLocation}</span>
                      </div>
                      <div class="text-right">
                        <span class="font-extrabold text-emerald-700">${farmer.quantity} ${agg.unit}</span>
                        <span class="text-slate-400 block text-[10px]">Quality: ${farmer.qualityScore}/100</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <p class="text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 leading-relaxed italic mb-4">
                "${agg.explanation}"
              </p>
            </div>

            <button class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md">
              Initiate Bulk Aggregated Order Escrow
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInteractiveCalculator() {
  return `
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto">
      <div class="border-b border-slate-100 pb-4 mb-6">
        <h2 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <span>🧮</span> Interactive Waste Intelligence Calculator
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Input custom agricultural waste specifications to test deterministic scoring, WSS, application suitability, and value optimization.
        </p>
      </div>

      <form id="calc-intel-form" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Waste Category / Type</label>
          <select id="calc-cat" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="paddy-straw">Paddy / Rice Straw</option>
            <option value="sugarcane-bagasse">Sugarcane Bagasse</option>
            <option value="wheat-straw">Wheat Straw</option>
            <option value="cotton-stalk">Cotton Stalks</option>
            <option value="groundnut-shell">Groundnut Shells</option>
            <option value="vegetable-waste">Vegetable Market Waste</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Quantity (Tons)</label>
          <input type="number" id="calc-qty" value="15" min="1" step="0.5" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Moisture Level (%)</label>
          <input type="number" id="calc-moisture" value="12" min="1" max="80" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Contamination Level</label>
          <select id="calc-contamination" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="Low">Low (< 2% soil/foreign matter)</option>
            <option value="Medium">Medium (2-5% soil/dust)</option>
            <option value="High">High (> 5% foreign debris)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Harvest Age (Days)</label>
          <input type="number" id="calc-age" value="5" min="1" max="180" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Storage Condition</label>
          <select id="calc-storage" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
            <option value="Covered Shed">Covered Dry Shed</option>
            <option value="Baled">Machine Baled & Tarpaulin Covered</option>
            <option value="Open Shed">Open Shed</option>
            <option value="Open Air">Open Air Field Stacking</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2">Expected Sale Price (₹ / Ton)</label>
          <input type="number" id="calc-price" value="2500" min="500" step="100" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"/>
        </div>

        <div class="flex items-end">
          <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md">
            Calculate Intelligence Scores
          </button>
        </div>
      </form>

      <!-- Calculator Results Box -->
      <div id="calc-results-output" class="bg-slate-50 p-6 rounded-2xl border border-slate-200 hidden">
        <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <span>📊</span> Calculation Output Breakdown
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-4 rounded-xl border border-slate-200">
            <div class="text-xs text-slate-500">Quality Score</div>
            <div id="res-quality-score" class="text-2xl font-black text-emerald-600">--</div>
            <div id="res-quality-grade" class="text-xs font-bold text-slate-700 mt-1">--</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200">
            <div class="text-xs text-slate-500">Suitability Score (WSS)</div>
            <div id="res-wss-score" class="text-2xl font-black text-blue-600">--</div>
            <div id="res-wss-label" class="text-xs font-bold text-slate-700 mt-1">--</div>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200">
            <div class="text-xs text-slate-500">Est. Value Uplift</div>
            <div id="res-value-uplift" class="text-2xl font-black text-amber-600">--</div>
            <div id="res-recommended-app" class="text-xs font-bold text-slate-700 mt-1">--</div>
          </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-700">
          <div id="res-quality-explanation"></div>
          <div id="res-wss-explanation"></div>
          <div id="res-env-explanation"></div>
        </div>
      </div>

    </div>
  `;
}
