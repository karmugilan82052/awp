# 🌾 Intelligent Agricultural Waste Utilization, Matching and Value Optimization System (AgriWaste Intelligence)

> **Platform Version:** 2.0 (AgriWaste Intelligence Engine)  
> **Repository:** `Agricultural Waste Marketplace / AWP`  
> **Status:** Production-Ready & Tested (24/24 Automated Tests Passed)

---

## 1. Project Title & Overview

- **Project Title:** Intelligent Agricultural Waste Utilization, Matching and Value Optimization System
- **Short Name:** **AgriWaste Intelligence**
- **Core Focus:** Transforming raw agricultural crop residue trading into an intelligent, data-driven bio-economy platform. The system evaluates waste quality, calculates multi-factor suitability (WSS), identifies high-value commercial application pathways, matches waste with registered industrial buyers, aggregates supply across neighboring farms, optimizes monetary utilization value, and quantifies environmental carbon avoidance.

---

## 2. Problem Statement & Motivation

Millions of tons of agricultural crop residues (paddy straw, sugarcane bagasse, cotton stalks, wheat straw, groundnut shells) are lost to open-field stubble burning or low-value disposal each harvest season in India. Primary challenges include:
1. **Lack of Waste Quality Standardization:** Buyers face uncertainty regarding moisture content, contamination, storage condition, and freshness.
2. **Sub-optimal Monetization:** Farmers sell raw waste at low spot prices without knowing high-value utilization pathways (e.g., mushroom beds, molded tableware, tree-free paper, bio-CNG).
3. **Quantity Mismatch & Fragmented Supply:** Industrial buyers require bulk volumes (e.g. 100–1,000 Tons) while individual smallholder farmers offer small batches (e.g. 2–10 Tons).
4. **Distance & Freight Logistics Barriers:** Biomass transport cost can quickly exceed feedstock value without spatial-distance compatibility scoring.

---

## 3. Existing System vs. Proposed System

| Dimension | Existing System (Basic Marketplace) | Proposed System (**AgriWaste Intelligence**) |
| :--- | :--- | :--- |
| **Transaction Model** | Simple buy/sell listing catalog | Decision pipeline optimizing quality, suitability, value, and matching |
| **Quality Assessment** | Textual user input | Normalized Quality Score (0–100) & Grade Classification (Poor, Average, Good, Excellent) |
| **Suitability Evaluation** | None | Multi-Factor Waste Suitability Score (WSS: 0–100) |
| **Application Pathways** | Generic category listing | Deterministic Waste-to-Application Recommendation Engine with "Recommended Best Use" |
| **Buyer Matching** | Manual search filtering | Weighted Buyer-Waste Compatibility Matching Engine (0–100% Score) |
| **Supply Pooling** | Single farmer transactions | Multi-Farmer Supply Aggregation Algorithm (clustering neighboring farm volumes) |
| **Monetization** | Raw listing price | Value Optimization Engine calculating direct sale vs. utilization value (+% uplift) |
| **Impact Tracking** | Basic tonnage counter | IPCC/CPCB-calibrated CO₂e greenhouse gas avoidance & tree equivalent metrics |

---

## 4. End-to-End Decision Pipeline Architecture

```
FARMER WASTE LISTING & ADVANCED SPECIFICATIONS
           │
           ▼
[ WASTE CHARACTERISTIC ANALYSIS ]
  • Moisture Level (%)
  • Harvest Age (Days)
  • Contamination (Low/Med/High)
  • Storage Condition & Processing State
           │
           ▼
[ QUALITY NORMALIZATION ENGINE ] ──► Quality Score (0–100) & Grade
           │
           ▼
[ MULTI-FACTOR SUITABILITY CALCULATOR ] ──► Waste Suitability Score (WSS: 0–100)
           │
           ▼
[ APPLICATION RECOMMENDATION ENGINE ] ──► Ranked Commercial Uses & "Recommended Best Use"
           │
           ▼
[ BUYER-WASTE MATCHING ENGINE ] ──► Buyer Match Score (0–100%) for Registered Buyers
           │
           ▼
[ MULTI-FARMER SUPPLY AGGREGATION ] ──► Aggregated Supply Pools for Bulk Buyer Orders
           │
           ▼
[ VALUE OPTIMIZATION ENGINE ] ──► Direct Sale vs. Potential Utilization Value (+% Uplift)
           │
           ▼
[ ENVIRONMENTAL IMPACT ENGINE ] ──► Estimated CO₂e Avoidance & Trees Equivalent
           │
           ▼
MARKETPLACE ESCROW TRANSACTION & REVENUE SETTLEMENT
```

---

## 5. Mathematical Formulas & Algorithms

### 5.1 Waste Quality Score ($Q$)
Calculates a normalized score ($0 \text{ to } 100$) based on five physical parameters:

$$Q = 0.25 \times \text{Moisture} + 0.25 \times \text{Contamination} + 0.20 \times \text{Age} + 0.15 \times \text{Storage} + 0.15 \times \text{Processing}$$

- **Moisture Score:** 100 for $\le 14\%$, 80 for $15\text{--}20\%$, 60 for $21\text{--}30\%$, 35 for $>30\%$.
- **Contamination Score:** 100 for Low (clean), 70 for Medium, 35 for High.
- **Harvest Age Score:** 100 for $\le 7\text{ days}$, 85 for $8\text{--}15\text{ days}$, 65 for $16\text{--}30\text{ days}$, 40 for $>30\text{ days}$.
- **Storage Score:** 100 for Covered Shed / Silo, 85 for Machine Baled, 70 for Open Shed, 45 for Open Air.
- **Processing Score:** 100 for Baled / Pelletized, 85 for Chopped, 65 for Raw.

**Quality Grade Mapping:**
- $80 \text{--} 100$: **Excellent**
- $60 \text{--} 79$: **Good**
- $40 \text{--} 59$: **Average**
- $0 \text{--} 39$: **Poor**

---

### 5.2 Waste Suitability Score ($WSS$)
Multi-factor suitability score ($0 \text{ to } 100$):

$$WSS = 0.25 \times Q + 0.20 \times Qty + 0.20 \times AC + 0.15 \times S + 0.10 \times F + 0.10 \times L$$

Where:
- $Q$: Normalized Quality Score ($0\text{--}100$)
- $Qty$: Batch Quantity Score ($0\text{--}100$) based on volume suitability
- $AC$: Application Compatibility Score ($0\text{--}100$)
- $S$: Storage Condition Score ($0\text{--}100$)
- $F$: Freshness Score ($0\text{--}100$)
- $L$: Location / Accessibility Score ($0\text{--}100$)

**WSS Category Classification:**
- $80 \text{--} 100$: **Highly Suitable**
- $60 \text{--} 79$: **Suitable**
- $40 \text{--} 59$: **Moderate**
- $0 \text{--} 39$: **Low Suitability**

---

### 5.3 Buyer-Waste Match Score
Calculates buyer-specific compatibility percentage ($0 \text{ to } 100\%$):

$$\text{Buyer Match Score} = 0.30 \times \text{WasteCompat} + 0.25 \times \text{QtyCompat} + 0.20 \times \text{QualCompat} + 0.15 \times \text{DistCompat} + 0.10 \times \text{PriceCompat}$$

Where:
- $\text{WasteCompat}$: Category & crop match ($100\%$ for exact category, $95\%$ for crop match)
- $\text{QtyCompat}$: Ratio of listing quantity to buyer required volume
- $\text{QualCompat}$: Listing Quality Score ($Q$)
- $\text{DistCompat}$: Haversine road distance compatibility score
- $\text{PriceCompat}$: Price competitiveness ratio against buyer maximum budget

---

### 5.4 Multi-Farmer Supply Aggregation Algorithm (`findAggregatedSupply`)
1. Filter active farmer listings by waste category (e.g. Paddy Straw).
2. Group listings by geographic cluster (state/district proximity).
3. Compute cumulative tonnage: $\sum \text{Quantity}_i$.
4. Check if cumulative tonnage meets or exceeds buyer target volume ($V_{\text{target}}$).
5. If $\sum \text{Quantity}_i \ge 0.70 \times V_{\text{target}}$, construct an Aggregated Supply Pool.
6. Calculate average quality score: $\bar{Q} = \frac{\sum Q_i}{N}$.
7. Compute Cluster Aggregation Score and output participating farmer list.

---

### 5.5 Value Optimization Engine (`estimateWasteValue`)
- **Direct Sale Value:** $\text{Quantity} \times \text{Listing Price}$
- **Potential Utilization Value:** $\text{Quantity} \times (\text{Listing Price} \times \text{ValueMultiplier}_{\text{app}})$
  - Mushroom Cultivation: $1.45\times$
  - Molded Eco-Tableware: $1.60\times$
  - Cellulosic Bio-Ethanol: $1.50\times$
  - Composting / Bio-fertilizer: $1.30\times$
  - Biomass Fuel: $1.15\text{--}1.25\times$
- **Value Uplift ($\%$):** $\frac{\text{Potential Value} - \text{Direct Sale Value}}{\text{Direct Sale Value}} \times 100$

---

### 5.6 Environmental Impact Calculation (`calculateEnvironmentalImpact`)
Based on CPCB & IPCC emission factors for avoiding open-field stubble burning:
- $\text{CO}_2\text{e Avoided (kg)} = \text{Waste Tonnage (kg)} \times 1.35$
- $\text{Methane Prevented (kg)} = \text{Waste Tonnage (kg)} \times 0.004$
- $\text{PM2.5 Prevented (kg)} = \text{Waste Tonnage (kg)} \times 0.009$
- $\text{Trees Equivalent} = \lfloor \frac{\text{CO}_2\text{e Avoided (kg)}}{20} \rfloor$

---

## 6. Database Changes & Schemas

The following database tables/schemas were safely added without modifying existing user/order structures:

### `waste_recommendations`
- `id`: String (PK)
- `waste_id`: String (FK -> `waste_listings`)
- `application_name`: String
- `suitability_score`: Number (0–100)
- `reason`: String
- `estimated_value`: Number
- `created_at`: Date

### `buyer_matches`
- `id`: String (PK)
- `waste_id`: String (FK -> `waste_listings`)
- `buyer_id`: String (FK -> `users`)
- `match_score`: Number (0–100)
- `waste_compatibility`: Number
- `quantity_score`: Number
- `quality_score`: Number
- `distance_score`: Number
- `price_score`: Number
- `created_at`: Date

### `aggregated_supplies`
- `id`: String (PK)
- `wasteCategory`: String
- `participatingListingIds`: Array of Strings
- `totalQuantity`: Number
- `averageQualityScore`: Number
- `approximateLocation`: String
- `buyerId`: String
- `aggregationScore`: Number
- `createdAt`: Date

### `environmental_impact`
- `id`: String (PK)
- `waste_id`: String (FK -> `waste_listings`)
- `wasteDivertedKg`: Number
- `co2AvoidedKg`: Number
- `methanePreventedKg`: Number
- `pm25PreventedKg`: Number
- `treesEquivalent`: Number
- `created_at`: Date

---

## 7. Implementation & Code Modules

| File Path | Description / Role |
| :--- | :--- |
| `src/lib/server/wasteIntelligence.ts` | Core Intelligence Module containing functions for quality score, WSS, application recommendations, value optimization, environmental impact, and supply aggregation. |
| `src/lib/server/buyerMatching.ts` | Buyer Matching Module for ranking listings against buyer profile requirements. |
| `src/routes/intelligence/+page.server.ts` | SvelteKit server load function for the waste intelligence route. |
| `src/routes/intelligence/+page.svelte` | SvelteKit page component for waste intelligence analysis. |
| `src/pages/Intelligence.js` | SPA Router client page for `#intelligence` with interactive tabs, calculator, and aggregation viewer. |
| `src/pages/SellWaste.js` | Updated listing form with optional **Advanced Waste Information** section (Harvest age, contamination, processing level, intended use). |
| `src/components/WasteCard.js` | Updated card component featuring WSS score badge, recommended best use, best buyer match %, and "View Intelligence" button. |
| `src/pages/WasteDetails.js` | Updated waste detail view featuring the **AgriWaste Intelligence Matrix** card. |
| `src/pages/FarmerDashboard.js` | Added **WASTE INTELLIGENCE ANALYTICS** card with average WSS, CO₂e avoided, and "Analyze My Waste" button. |
| `src/pages/BuyerDashboard.js` | Added **Ranked Waste Matches** feed ordered by Buyer Match Score. |
| `src/pages/AdminDashboard.js` | Added **AGRIWASTE INTELLIGENCE PLATFORM ANALYTICS** executive panel. |
| `backend/src/server.js` | Express REST API endpoints for `/api/intelligence/*`. |
| `backend/tests/api.test.js` | Comprehensive automated test suite validating all 24 system and intelligence checks. |

---

## 8. Verification & Automated Test Results

The system was verified by executing the expanded test suite:

```bash
node backend/tests/api.test.js
```

### Test Summary:
```
=========================================
🧪 STARTING AGRIWASTE SYSTEM & INTELLIGENCE TEST SUITE
=========================================

✅ PASS: JWT Token Generation
✅ PASS: AI Classifier Execution
✅ PASS: AI Classifier Category Match
✅ PASS: AI Confidence Score Output
✅ PASS: AI Recommended Market Price Calculation
✅ PASS: AI Assistant Query Intent Match (Paddy)
✅ PASS: AI Assistant Query Intent Match (Bagasse)
✅ PASS: Haversine Distance Calculation (40 km)
✅ PASS: Quality Score Normalization (Score: 100/100)
✅ PASS: Quality Grade Classification (Excellent)
✅ PASS: Multi-Factor WSS Calculation (95/100)
✅ PASS: WSS Category Label (Highly Suitable)
✅ PASS: Application Recommendation Engine Output
✅ PASS: Recommended Best Use Identification
✅ PASS: Top Application Match (Mushroom Cultivation)
✅ PASS: Buyer Match Score Calculation (98%)
✅ PASS: Buyer Company Name In Match Result
✅ PASS: Multi-Farmer Supply Aggregation Cluster Creation
✅ PASS: Aggregated Quantity Sum (Expected 1000, Found 1000)
✅ PASS: Participating Farmers Count in Cluster
✅ PASS: Value Uplift Calculation (Direct: ₹20000, Utilization: ₹29000)
✅ PASS: CO2e Avoidance Calculation (13500 kg CO2e)
✅ PASS: Trees Equivalent Calculation (675 trees)
✅ PASS: Initial Waste Listings Count (Found 51, Target >= 50)

=========================================
📊 TEST SUMMARY: 24 Passed, 0 Failed
=========================================
```

Vite production build verification:
```bash
npx vite build
# Result: dist/assets/index-C_pkIOYk.js (404.09 kB) — built in 567ms with zero errors.
```

---

## 9. Patent-Oriented Technical Contribution

The AgriWaste Intelligence system establishes a distinctive, non-obvious technical framework suitable for novelty evaluation:

1. **Integrated Waste Characteristics Normalization Engine:** Converting heterogeneous agricultural residue inputs (varying moisture, contamination, harvest age, storage condition) into a standardized 0–100 Quality Score.
2. **Multi-Factor Weighted Suitability Algorithm ($WSS$):** A multi-criteria mathematical scoring framework integrating physical quality, batch volume, industrial application compatibility, storage state, freshness, and geographic accessibility into a single normalized index.
3. **Deterministic Waste-to-Application Mapping with Value Optimization:** Automated calculation of alternative industrial transformation pathways (e.g. bio-packaging vs. biomass boiler fuel) with monetary value uplift estimation.
4. **Spatial-Quantity Supply Aggregation Clustering:** Automated detection and grouping of fragmented neighboring farm listings to satisfy high-volume industrial buyer procurement requirements.
5. **Multi-Criteria Buyer-Waste Compatibility Scoring:** A transparent 5-weighted matching algorithm pairing real registered buyers with optimal waste listings based on distance, quantity, quality, price, and category fit.
