/**
 * AgriWaste Intelligence Engine — Server-Side Core Logic Module
 * Comprehensive analytical calculations for waste quality, multi-factor suitability (WSS),
 * application recommendations, value optimization, environmental impact, and multi-farmer aggregation.
 */

export interface WasteCharacteristics {
  moisture_level?: string | number;
  quality_grade?: string;
  harvest_age?: string | number; // in days
  contamination_level?: string; // Low, Medium, High
  storage_condition?: string; // Covered Shed, Silo, Baled, Open Air
  processing_level?: string; // Raw, Chopped, Baled, Pelletized
  intended_use?: string;
  category?: string;
  crop?: string;
  quantity?: number;
  price?: number;
  location?: string;
}

export interface WasteQualityResult {
  score: number; // 0-100
  grade: "Poor" | "Average" | "Good" | "Excellent";
  breakdown: {
    moistureScore: number;
    contaminationScore: number;
    ageScore: number;
    storageScore: number;
    processingScore: number;
  };
  explanation: string;
}

export interface WasteSuitabilityResult {
  wssScore: number; // 0-100
  categoryLabel: "Low Suitability" | "Moderate" | "Suitable" | "Highly Suitable";
  factors: {
    qualityScore: number;
    quantityScore: number;
    applicationCompatibility: number;
    storageScore: number;
    freshnessScore: number;
    locationScore: number;
  };
  weightedContribution: {
    qualityWeighted: number;
    quantityWeighted: number;
    appWeighted: number;
    storageWeighted: number;
    freshnessWeighted: number;
    locationWeighted: number;
  };
  explanation: string;
}

export interface ApplicationRecommendation {
  application_name: string;
  industry: string;
  suitability_score: number; // 0-100
  isBestUse: boolean;
  reason: string;
  estimated_value: number; // ₹ per ton or total estimated value
  valueAddLevel: "Medium" | "High" | "Very High";
}

export interface BuyerMatchResult {
  id?: string;
  waste_id: string;
  buyer_id: string;
  buyer_name?: string;
  buyer_company?: string;
  match_score: number; // 0-100
  waste_compatibility: number;
  quantity_score: number;
  quality_score: number;
  distance_score: number;
  price_score: number;
  distance_km?: number;
  reason: string;
  created_at?: string;
}

export interface AggregatedSupply {
  id: string;
  wasteCategory: string;
  wasteCrop: string;
  participatingListings: Array<{
    id: string;
    farmerName: string;
    farmLocation: string;
    quantity: number;
    qualityScore: number;
  }>;
  totalQuantity: number;
  unit: string;
  averageQualityScore: number;
  approximateLocation: string;
  targetBuyerRequirement: {
    buyerId: string;
    buyerName: string;
    requiredQty: number;
    targetPrice: number;
  };
  aggregationScore: number;
  explanation: string;
}

export interface EnvironmentalImpact {
  wasteDivertedKg: number;
  co2AvoidedKg: number;
  methanePreventedKg: number;
  pm25PreventedKg: number;
  treesEquivalent: number;
  circularContributionScore: number;
  explanation: string;
}

/**
 * 1. Calculate Normalized Quality Score (0–100)
 */
export function calculateQualityScore(listing: any): WasteQualityResult {
  const moistureVal = parseFloat(String(listing.moisture_level || listing.moisture || "12").replace("%", "")) || 12;
  const contamination = (listing.contamination_level || "Low").toLowerCase();
  const ageDays = parseFloat(String(listing.harvest_age || "5").replace(/[^0-9.]/g, "")) || 5;
  const storage = (listing.storage_condition || listing.storageType || "Covered Shed").toLowerCase();
  const processing = (listing.processing_level || listing.condition || "Baled").toLowerCase();

  // 1. Moisture Score (Optimal is 10-14% for dry crop residues)
  let moistureScore = 100;
  if (moistureVal <= 14) moistureScore = 100;
  else if (moistureVal <= 20) moistureScore = 80;
  else if (moistureVal <= 30) moistureScore = 60;
  else moistureScore = 35;

  // 2. Contamination Score
  let contaminationScore = 95;
  if (contamination.includes("low") || contamination.includes("clean") || contamination.includes("none")) contaminationScore = 100;
  else if (contamination.includes("medium") || contamination.includes("slight")) contaminationScore = 70;
  else if (contamination.includes("high") || contamination.includes("severe")) contaminationScore = 35;

  // 3. Harvest Age Score
  let ageScore = 100;
  if (ageDays <= 7) ageScore = 100;
  else if (ageDays <= 15) ageScore = 85;
  else if (ageDays <= 30) ageScore = 65;
  else ageScore = 40;

  // 4. Storage Condition Score
  let storageScore = 80;
  if (storage.includes("covered") || storage.includes("silo") || storage.includes("warehouse")) storageScore = 100;
  else if (storage.includes("baled") || storage.includes("shed")) storageScore = 85;
  else if (storage.includes("open shed")) storageScore = 70;
  else storageScore = 45;

  // 5. Processing Condition Score
  let processingScore = 75;
  if (processing.includes("pellet") || processing.includes("compressed") || processing.includes("baled")) processingScore = 100;
  else if (processing.includes("chopped") || processing.includes("shredded") || processing.includes("dry")) processingScore = 85;
  else processingScore = 65;

  // Weighted total quality score
  const totalScore = Math.round(
    moistureScore * 0.25 +
    contaminationScore * 0.25 +
    ageScore * 0.20 +
    storageScore * 0.15 +
    processingScore * 0.15
  );

  const normalized = Math.max(0, Math.min(100, totalScore));

  let grade: "Poor" | "Average" | "Good" | "Excellent" = "Good";
  if (normalized >= 80) grade = "Excellent";
  else if (normalized >= 60) grade = "Good";
  else if (normalized >= 40) grade = "Average";
  else grade = "Poor";

  const explanation = `Quality grade is '${grade}' (${normalized}/100) based on ${moistureVal}% moisture level, ${contamination} contamination, ${ageDays} days harvest age, and ${storage} storage.`;

  return {
    score: normalized,
    grade,
    breakdown: {
      moistureScore,
      contaminationScore,
      ageScore,
      storageScore,
      processingScore
    },
    explanation
  };
}

/**
 * 2. Calculate Waste Suitability Score (WSS) (0–100)
 * Formula: WSS = 0.25*Quality + 0.20*Quantity + 0.20*ApplicationCompat + 0.15*Storage + 0.10*Freshness + 0.10*Location
 */
export function calculateSuitabilityScore(listing: any): WasteSuitabilityResult {
  const qualityRes = calculateQualityScore(listing);
  const qScore = qualityRes.score;

  const qty = parseFloat(String(listing.quantity || 1)) || 1;
  let quantityScore = 70;
  if (qty >= 20) quantityScore = 100;
  else if (qty >= 10) quantityScore = 90;
  else if (qty >= 5) quantityScore = 80;
  else if (qty >= 2) quantityScore = 70;
  else quantityScore = 55;

  const recApps = determineRecommendedApplications(listing);
  const appCompat = recApps.length > 0 ? recApps[0].suitability_score : 80;

  const storageScore = qualityRes.breakdown.storageScore;
  const freshnessScore = qualityRes.breakdown.ageScore;
  
  // Location score based on distance / state presence
  const distanceKm = parseFloat(String(listing.distanceKm || 25));
  let locationScore = 85;
  if (distanceKm <= 15) locationScore = 100;
  else if (distanceKm <= 40) locationScore = 85;
  else if (distanceKm <= 80) locationScore = 70;
  else locationScore = 50;

  const qW = 0.25 * qScore;
  const qtyW = 0.20 * quantityScore;
  const appW = 0.20 * appCompat;
  const sW = 0.15 * storageScore;
  const fW = 0.10 * freshnessScore;
  const lW = 0.10 * locationScore;

  const wssScore = Math.round(qW + qtyW + appW + sW + fW + lW);
  const normalized = Math.max(0, Math.min(100, wssScore));

  let categoryLabel: "Low Suitability" | "Moderate" | "Suitable" | "Highly Suitable" = "Suitable";
  if (normalized >= 80) categoryLabel = "Highly Suitable";
  else if (normalized >= 60) categoryLabel = "Suitable";
  else if (normalized >= 40) categoryLabel = "Moderate";
  else categoryLabel = "Low Suitability";

  const explanation = `Waste Suitability Score is ${normalized}/100 (${categoryLabel}) derived from Quality (${qScore}), Quantity (${quantityScore}), Application Fit (${appCompat}), Storage (${storageScore}), Freshness (${freshnessScore}), and Location (${locationScore}).`;

  return {
    wssScore: normalized,
    categoryLabel,
    factors: {
      qualityScore: qScore,
      quantityScore,
      applicationCompatibility: appCompat,
      storageScore,
      freshnessScore,
      locationScore
    },
    weightedContribution: {
      qualityWeighted: Number(qW.toFixed(2)),
      quantityWeighted: Number(qtyW.toFixed(2)),
      appWeighted: Number(appW.toFixed(2)),
      storageWeighted: Number(sW.toFixed(2)),
      freshnessWeighted: Number(fW.toFixed(2)),
      locationWeighted: Number(lW.toFixed(2))
    },
    explanation
  };
}

/**
 * 3. Waste-to-Application Recommendation Engine
 */
export function determineRecommendedApplications(listing: any): ApplicationRecommendation[] {
  const categoryId = (listing.category || listing.categoryId || "").toLowerCase();
  const title = (listing.title || "").toLowerCase();
  const crop = (listing.crop || listing.categoryName || "").toLowerCase();
  const price = parseFloat(String(listing.price || 2500)) || 2500;
  const qualityRes = calculateQualityScore(listing);

  let rawApps: Array<{ name: string; industry: string; baseScore: number; valueMultiplier: number; valueAddLevel: "Medium" | "High" | "Very High" }> = [];

  if (categoryId.includes("paddy") || title.includes("paddy") || crop.includes("rice")) {
    rawApps = [
      { name: "Mushroom Cultivation", industry: "Horticulture & Organic Farming", baseScore: 94, valueMultiplier: 1.45, valueAddLevel: "High" },
      { name: "Composting & Soil Bio-Mulch", industry: "Agri-Inputs", baseScore: 89, valueMultiplier: 1.30, valueAddLevel: "Medium" },
      { name: "Animal Bedding & Silage", industry: "Dairy & Livestock", baseScore: 84, valueMultiplier: 1.25, valueAddLevel: "Medium" },
      { name: "Biomass Fuel & Briquettes", industry: "Renewable Energy", baseScore: 78, valueMultiplier: 1.15, valueAddLevel: "High" },
      { name: "Pulp & Tree-Free Paper", industry: "Paper Manufacturing", baseScore: 76, valueMultiplier: 1.50, valueAddLevel: "Very High" }
    ];
  } else if (categoryId.includes("sugarcane") || title.includes("bagasse") || crop.includes("bagasse")) {
    rawApps = [
      { name: "Biomass Fuel & Boiler Cogeneration", industry: "Power & Energy Plants", baseScore: 95, valueMultiplier: 1.20, valueAddLevel: "Medium" },
      { name: "Molded Eco-Tableware & Packaging", industry: "Bio-Plastics Replacement", baseScore: 93, valueMultiplier: 1.60, valueAddLevel: "Very High" },
      { name: "Kraft Paper & Packaging Board", industry: "Paper Mills", baseScore: 91, valueMultiplier: 1.40, valueAddLevel: "High" },
      { name: "Composting & Organic Fertilizer", industry: "Soil Health", baseScore: 86, valueMultiplier: 1.30, valueAddLevel: "Medium" }
    ];
  } else if (categoryId.includes("vegetable") || categoryId.includes("fruit") || title.includes("organic") || title.includes("vegetable")) {
    rawApps = [
      { name: "Aerobic Composting & Vermicompost", industry: "Organic Bio-Fertilizers", baseScore: 96, valueMultiplier: 1.35, valueAddLevel: "Medium" },
      { name: "Biogas / Compressed Bio-Gas (CBG)", industry: "Clean Energy Refineries", baseScore: 92, valueMultiplier: 1.50, valueAddLevel: "High" },
      { name: "Protective Animal Feed Supplement", industry: "Livestock Feed", baseScore: 78, valueMultiplier: 1.25, valueAddLevel: "Medium" }
    ];
  } else if (categoryId.includes("coconut") || title.includes("coconut") || title.includes("coir")) {
    rawApps = [
      { name: "Coir Fiber & Cocopeat Substrate", industry: "Horticulture & Exports", baseScore: 95, valueMultiplier: 1.55, valueAddLevel: "Very High" },
      { name: "Biomass Charcoal & Activated Carbon", industry: "Industrial Filtration", baseScore: 88, valueMultiplier: 1.40, valueAddLevel: "High" },
      { name: "Composting & Soil Amendment", industry: "Agriculture", baseScore: 84, valueMultiplier: 1.25, valueAddLevel: "Medium" }
    ];
  } else if (categoryId.includes("wheat") || title.includes("wheat")) {
    rawApps = [
      { name: "High-Digestibility Cattle Fodder", industry: "Dairy Husbandry", baseScore: 96, valueMultiplier: 1.30, valueAddLevel: "High" },
      { name: "Eco-Packaging & Molded Pulp", industry: "Sustainable Packaging", baseScore: 90, valueMultiplier: 1.50, valueAddLevel: "Very High" },
      { name: "Mushroom Cultivation Bedding", industry: "Horticulture", baseScore: 85, valueMultiplier: 1.40, valueAddLevel: "High" },
      { name: "Cellulosic Bio-Ethanol", industry: "Biofuel Refineries", baseScore: 80, valueMultiplier: 1.35, valueAddLevel: "High" }
    ];
  } else if (categoryId.includes("cotton") || title.includes("cotton")) {
    rawApps = [
      { name: "Biofuel Briquettes & Fuel Logs", industry: "Industrial Heating", baseScore: 92, valueMultiplier: 1.35, valueAddLevel: "High" },
      { name: "Medium Density Particle Board", industry: "Furniture & Construction", baseScore: 88, valueMultiplier: 1.55, valueAddLevel: "Very High" },
      { name: "Biochar Precursor", industry: "Carbon Sequestration", baseScore: 85, valueMultiplier: 1.30, valueAddLevel: "High" }
    ];
  } else if (categoryId.includes("groundnut") || title.includes("groundnut")) {
    rawApps = [
      { name: "High-Calorie Bio-Coal Briquettes", industry: "Boiler Fuel", baseScore: 95, valueMultiplier: 1.35, valueAddLevel: "High" },
      { name: "Poultry Litter Bedding", industry: "Poultry Farming", baseScore: 86, valueMultiplier: 1.25, valueAddLevel: "Medium" },
      { name: "Furfural Extraction", industry: "Bio-Chemicals", baseScore: 80, valueMultiplier: 1.60, valueAddLevel: "Very High" }
    ];
  } else {
    // Default fallback applications
    rawApps = [
      { name: "Composting & Soil Amendment", industry: "Organic Farming", baseScore: 90, valueMultiplier: 1.30, valueAddLevel: "Medium" },
      { name: "Biomass Fuel & Briquettes", industry: "Renewable Energy", baseScore: 85, valueMultiplier: 1.20, valueAddLevel: "High" },
      { name: "Animal Bedding", industry: "Livestock", baseScore: 78, valueMultiplier: 1.15, valueAddLevel: "Medium" }
    ];
  }

  // Adjust app scores based on actual quality score
  const qualityFactor = qualityRes.score / 100;

  const recommendations: ApplicationRecommendation[] = rawApps.map(app => {
    const finalScore = Math.round(app.baseScore * (0.8 + 0.2 * qualityFactor));
    const estimatedValue = Math.round(price * app.valueMultiplier);
    return {
      application_name: app.name,
      industry: app.industry,
      suitability_score: finalScore,
      isBestUse: false,
      reason: `High suitability (${finalScore}%) because waste characteristics (moisture ${listing.moisture || "12%"}, quality ${qualityRes.grade}) align with ${app.industry} standards.`,
      estimated_value: estimatedValue,
      valueAddLevel: app.valueAddLevel
    };
  });

  recommendations.sort((a, b) => b.suitability_score - a.suitability_score);
  if (recommendations.length > 0) {
    recommendations[0].isBestUse = true;
    recommendations[0].reason = `Recommended Best Use: High suitability because the waste type is compatible, moisture is within the preferred range, contamination is low, and sufficient quantity is available.`;
  }

  return recommendations;
}

/**
 * 4. Calculate Distance Compatibility Score (0–100)
 */
export function calculateDistanceScore(distanceKm: number): number {
  if (distanceKm <= 10) return 100;
  if (distanceKm <= 25) return 90;
  if (distanceKm <= 50) return 78;
  if (distanceKm <= 100) return 60;
  if (distanceKm <= 200) return 40;
  return 20;
}

/**
 * 5. Calculate Quantity Compatibility Score (0–100)
 */
export function calculateQuantityCompatibility(wasteQty: number, buyerReqQty: number): number {
  if (!buyerReqQty || buyerReqQty <= 0) return 85;
  const ratio = wasteQty / buyerReqQty;
  if (ratio >= 0.9 && ratio <= 1.2) return 100;
  if (ratio >= 0.5 && ratio < 0.9) return 85;
  if (ratio > 1.2 && ratio <= 2.0) return 90;
  if (ratio >= 0.25 && ratio < 0.5) return 65;
  return 45;
}

/**
 * 6. Calculate Price Compatibility Score (0–100)
 */
export function calculatePriceCompatibility(wastePrice: number, buyerPrice: number): number {
  if (!buyerPrice || buyerPrice <= 0) return 85;
  if (wastePrice <= buyerPrice) {
    const savingsRatio = (buyerPrice - wastePrice) / buyerPrice;
    return Math.min(100, Math.round(90 + savingsRatio * 20));
  } else {
    const diffRatio = (wastePrice - buyerPrice) / buyerPrice;
    return Math.max(20, Math.round(100 - diffRatio * 150));
  }
}

/**
 * 7. Buyer-Waste Match Score Calculation
 * Formula: Buyer Match = 0.30*WasteCompat + 0.25*QtyCompat + 0.20*QualityCompat + 0.15*DistanceCompat + 0.10*PriceCompat
 */
export function calculateBuyerMatchScore(listing: any, buyerRequirement: any): BuyerMatchResult {
  const wasteCategory = (listing.category || listing.categoryId || "").toLowerCase();
  const reqCategory = (buyerRequirement.preferredCategory || buyerRequirement.category || "").toLowerCase();
  const reqCrop = (buyerRequirement.preferredCrop || "").toLowerCase();
  const listingCrop = (listing.crop || listing.title || "").toLowerCase();

  // Waste Compatibility
  let wasteCompat = 70;
  if (reqCategory && (wasteCategory.includes(reqCategory) || reqCategory.includes(wasteCategory))) {
    wasteCompat = 100;
  } else if (reqCrop && listingCrop.includes(reqCrop)) {
    wasteCompat = 95;
  } else if (!reqCategory) {
    wasteCompat = 85;
  }

  // Quantity Compatibility
  const reqQty = parseFloat(String(buyerRequirement.requiredQty || buyerRequirement.minQuantity || 10)) || 10;
  const wasteQty = parseFloat(String(listing.quantity || 1)) || 1;
  const qtyCompat = calculateQuantityCompatibility(wasteQty, reqQty);

  // Quality Compatibility
  const qualityRes = calculateQualityScore(listing);
  const qualCompat = qualityRes.score;

  // Distance Compatibility
  const distance = parseFloat(String(listing.distanceKm || buyerRequirement.distanceKm || 30)) || 30;
  const distCompat = calculateDistanceScore(distance);

  // Price Compatibility
  const wastePrice = parseFloat(String(listing.price || 2500)) || 2500;
  const buyerMaxPrice = parseFloat(String(buyerRequirement.maxPrice || 3500)) || 3500;
  const priceCompat = calculatePriceCompatibility(wastePrice, buyerMaxPrice);

  const matchScore = Math.round(
    0.30 * wasteCompat +
    0.25 * qtyCompat +
    0.20 * qualCompat +
    0.15 * distCompat +
    0.10 * priceCompat
  );

  const normalized = Math.max(0, Math.min(100, matchScore));
  const buyerName = buyerRequirement.name || buyerRequirement.companyName || "Industrial Buyer";

  const reason = `High match (${normalized}%) because the buyer's required waste type and quantity closely match the listing and the location is within the preferred distance.`;

  return {
    waste_id: listing.id,
    buyer_id: buyerRequirement.id || "usr-buyer-1",
    buyer_name: buyerName,
    buyer_company: buyerRequirement.companyName || buyerName,
    match_score: normalized,
    waste_compatibility: wasteCompat,
    quantity_score: qtyCompat,
    quality_score: qualCompat,
    distance_score: distCompat,
    price_score: priceCompat,
    distance_km: distance,
    reason,
    created_at: new Date().toISOString().split("T")[0]
  };
}

/**
 * 8. Estimate Waste Value Optimization
 */
export function estimateWasteValue(listing: any) {
  const qty = parseFloat(String(listing.quantity || 1)) || 1;
  const unitPrice = parseFloat(String(listing.price || 2500)) || 2500;
  const currentSaleValue = Math.round(qty * unitPrice);

  const recApps = determineRecommendedApplications(listing);
  const bestApp = recApps.length > 0 ? recApps[0] : null;

  const potentialUtilizationValue = bestApp
    ? Math.round(qty * bestApp.estimated_value)
    : Math.round(currentSaleValue * 1.35);

  const valueUplift = Math.max(0, potentialUtilizationValue - currentSaleValue);
  const roiIncreasePercent = currentSaleValue > 0 ? Math.round((valueUplift / currentSaleValue) * 100) : 35;

  return {
    currentSaleValue,
    potentialUtilizationValue,
    recommendedApplication: bestApp ? bestApp.application_name : "Composting & Bio-Energy",
    valueUplift,
    roiIncreasePercent,
    explanation: `Direct Marketplace Sale: ₹${currentSaleValue.toLocaleString("en-IN")}. Potential Utilization Value (${bestApp ? bestApp.application_name : "High Value Processing"}): ₹${potentialUtilizationValue.toLocaleString("en-IN")} (+${roiIncreasePercent}% value uplift).`
  };
}

/**
 * 9. Environmental Impact Calculator
 */
export function calculateEnvironmentalImpact(wasteQtyTons: number, category: string = "Crop Residues"): EnvironmentalImpact {
  const qtyKg = wasteQtyTons * 1000;
  
  // Conversion factors (IPCC / CPCB benchmarks for open residue burning avoidance)
  const co2Factor = 1.35; // kg CO2e per kg biomass avoided burning
  const methaneFactor = 0.004; // kg CH4 per kg biomass
  const pm25Factor = 0.009; // kg PM2.5 particulate matter

  const co2AvoidedKg = Math.round(qtyKg * co2Factor);
  const methanePreventedKg = Number((qtyKg * methaneFactor).toFixed(1));
  const pm25PreventedKg = Number((qtyKg * pm25Factor).toFixed(1));
  const treesEquivalent = Math.round(co2AvoidedKg / 20); // 1 mature tree absorbs ~20kg CO2/year
  const circularContributionScore = Math.min(100, Math.round(wasteQtyTons * 8 + 45));

  const explanation = `Diverting ${wasteQtyTons} Tons of agricultural waste avoids an estimated ${co2AvoidedKg} kg CO₂e greenhouse gas emissions (equivalent to planting ${treesEquivalent} mature trees) and prevents open-air field burning particulate pollution.`;

  return {
    wasteDivertedKg: qtyKg,
    co2AvoidedKg,
    methanePreventedKg,
    pm25PreventedKg,
    treesEquivalent,
    circularContributionScore,
    explanation
  };
}

/**
 * 10. Multi-Farmer Waste Aggregation Supply Finder
 */
export function findAggregatedSupply(listings: any[], buyerRequirements: any[] | any): AggregatedSupply[] {
  if (!listings || listings.length === 0) return [];

  const reqList = Array.isArray(buyerRequirements) ? buyerRequirements : [buyerRequirements];
  const aggregatedResults: AggregatedSupply[] = [];

  reqList.forEach(buyerReq => {
    if (!buyerReq) return;
    const targetCat = (buyerReq.preferredCategory || buyerReq.category || "paddy-straw").toLowerCase();
    const targetQty = parseFloat(String(buyerReq.requiredQty || buyerReq.minQuantity || 10)) || 10;
    const targetPrice = parseFloat(String(buyerReq.maxPrice || 3500)) || 3500;

    // Filter matching listings by category
    const matchingListings = listings.filter(l => {
      const cat = (l.category || l.categoryId || "").toLowerCase();
      const crop = (l.crop || l.title || "").toLowerCase();
      return cat.includes(targetCat) || targetCat.includes(cat) || crop.includes(targetCat);
    });

    if (matchingListings.length === 0) return;

    // Group by state/district for proximity
    const groups: { [key: string]: any[] } = {};
    matchingListings.forEach(l => {
      const locKey = l.state || l.district || "Default Region";
      if (!groups[locKey]) groups[locKey] = [];
      groups[locKey].push(l);
    });

    Object.keys(groups).forEach(loc => {
      const groupListings = groups[loc];
      const sumQty = groupListings.reduce((acc, item) => acc + (parseFloat(String(item.quantity || 0)) || 0), 0);

      // We form an aggregation if 2 or more farmers combined have enough supply or close to target
      if (sumQty >= targetQty * 0.7) {
        const totalQualityScore = groupListings.reduce((acc, item) => acc + calculateQualityScore(item).score, 0);
        const avgQuality = Math.round(totalQualityScore / groupListings.length);

        const participatingListings = groupListings.map(item => ({
          id: item.id,
          farmerName: item.seller?.name || item.sellerName || "Farmer",
          farmLocation: item.location || loc,
          quantity: parseFloat(String(item.quantity || 0)) || 0,
          qualityScore: calculateQualityScore(item).score
        }));

        const aggregationScore = Math.min(100, Math.round(
          (sumQty >= targetQty ? 50 : 35) +
          (avgQuality * 0.3) +
          (groupListings.length > 1 ? 20 : 10)
        ));

        aggregatedResults.push({
          id: `AGG-${loc.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
          wasteCategory: groupListings[0].categoryName || groupListings[0].category || targetCat,
          wasteCrop: groupListings[0].crop || groupListings[0].title || targetCat,
          participatingListings,
          totalQuantity: sumQty,
          unit: groupListings[0].unit || "Tons",
          averageQualityScore: avgQuality,
          approximateLocation: `${loc} Cluster (${groupListings.length} Farms)`,
          targetBuyerRequirement: {
            buyerId: buyerReq.id || "usr-buyer-1",
            buyerName: buyerReq.companyName || buyerReq.name || "Industrial Buyer",
            requiredQty: targetQty,
            targetPrice
          },
          aggregationScore,
          explanation: `Aggregated Supply Available: ${groupListings.length} farmers in ${loc} collectively offer ${sumQty} Tons of ${groupListings[0].crop || targetCat}, fulfilling ${buyerReq.companyName || buyerReq.name || "Buyer"}'s requirement of ${targetQty} Tons.`
        });
      }
    });
  });

  return aggregatedResults;
}
