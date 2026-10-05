/**
 * Automated Test Suite for Smart Agri Waste Marketplace & AgriWaste Intelligence System
 */

import { generateToken } from "../src/middleware/auth.js";
import { classifyAgriWasteImage, getAIAssistantResponse } from "../../src/services/aiService.js";
import { getRecommendedBuyersForListing } from "../../src/services/recommendationEngine.js";
import { calculateDistanceKm } from "../../src/utils/helpers.js";
import { INITIAL_LISTINGS, INITIAL_USERS } from "../../src/store/initialData.js";
import {
  calculateQualityScore,
  calculateSuitabilityScore,
  determineRecommendedApplications,
  estimateWasteValue,
  calculateEnvironmentalImpact,
  findAggregatedSupply,
  calculateBuyerMatchScore
} from "../../src/lib/server/wasteIntelligence.ts";
import { findTopMatchesForListing } from "../../src/lib/server/buyerMatching.ts";

async function runTests() {
  console.log("=========================================");
  console.log("🧪 STARTING AGRIWASTE SYSTEM & INTELLIGENCE TEST SUITE");
  console.log("=========================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Test JWT Authentication
  try {
    const token = generateToken({ id: "usr-farmer-1", role: "farmer" });
    assert(token && typeof token === "string" && token.length > 20, "JWT Token Generation");
  } catch (e) {
    assert(false, `JWT Token Generation - Error: ${e.message}`);
  }

  // 2. Test AI Waste Classification
  try {
    const aiResult = await classifyAgriWasteImage("https://example.com/paddy_straw.jpg");
    assert(aiResult.success === true, "AI Classifier Execution");
    assert(aiResult.categoryId === "paddy-straw", "AI Classifier Category Match");
    assert(aiResult.confidence && aiResult.confidence.includes("%"), "AI Confidence Score Output");
    assert(aiResult.suggestedPrice > 0, "AI Recommended Market Price Calculation");
  } catch (e) {
    assert(false, `AI Classifier - Error: ${e.message}`);
  }

  // 3. Test AI Assistant Query Intent
  try {
    const resStraw = getAIAssistantResponse("Where can I sell paddy straw?");
    assert(resStraw.text.includes("Paddy Straw Insights"), "AI Assistant Query Intent Match (Paddy)");

    const resBagasse = getAIAssistantResponse("What can sugarcane bagasse be used for?");
    assert(resBagasse.text.includes("Sugarcane Bagasse Insights"), "AI Assistant Query Intent Match (Bagasse)");
  } catch (e) {
    assert(false, `AI Assistant - Error: ${e.message}`);
  }

  // 4. Test Haversine Distance Calculation
  try {
    const dist = calculateDistanceKm(11.0168, 76.9558, 10.6586, 77.0084);
    assert(dist >= 35 && dist <= 48, `Haversine Distance Calculation (${dist} km)`);
  } catch (e) {
    assert(false, `Haversine Distance - Error: ${e.message}`);
  }

  // 5. Test Waste Intelligence Engine - Quality Score
  try {
    const sampleListing = {
      category: "paddy-straw",
      moisture: "12%",
      contamination_level: "Low",
      harvest_age: "5",
      storage_condition: "Covered Shed",
      processing_level: "Baled"
    };
    const qRes = calculateQualityScore(sampleListing);
    assert(qRes.score >= 80, `Quality Score Normalization (Score: ${qRes.score}/100)`);
    assert(qRes.grade === "Excellent", `Quality Grade Classification (${qRes.grade})`);
  } catch (e) {
    assert(false, `Quality Score Calculation - Error: ${e.message}`);
  }

  // 6. Test Waste Suitability Score (WSS) Formula
  try {
    const sampleListing = {
      category: "paddy-straw",
      quantity: 15,
      moisture: "10%",
      contamination_level: "Low",
      harvest_age: "3",
      storage_condition: "Covered Shed",
      distanceKm: 20
    };
    const wssRes = calculateSuitabilityScore(sampleListing);
    assert(wssRes.wssScore >= 80 && wssRes.wssScore <= 100, `Multi-Factor WSS Calculation (${wssRes.wssScore}/100)`);
    assert(wssRes.categoryLabel === "Highly Suitable", `WSS Category Label (${wssRes.categoryLabel})`);
  } catch (e) {
    assert(false, `WSS Calculation - Error: ${e.message}`);
  }

  // 7. Test Application Recommendation Engine
  try {
    const listing = { category: "paddy-straw", price: 2500, moisture: "12%" };
    const recs = determineRecommendedApplications(listing);
    assert(Array.isArray(recs) && recs.length >= 3, "Application Recommendation Engine Output");
    assert(recs[0].isBestUse === true, "Recommended Best Use Identification");
    assert(recs[0].application_name === "Mushroom Cultivation", `Top Application Match (${recs[0].application_name})`);
  } catch (e) {
    assert(false, `Application Recommendation - Error: ${e.message}`);
  }

  // 8. Test Buyer Match Score
  try {
    const listing = { id: "LST-1001", category: "paddy-straw", crop: "paddy", quantity: 12, price: 2800, distanceKm: 25 };
    const buyerReq = { id: "usr-buyer-1", companyName: "ABC Mushroom Farm", preferredCategory: "paddy-straw", requiredQty: 10, maxPrice: 3500 };
    const matchRes = calculateBuyerMatchScore(listing, buyerReq);
    assert(matchRes.match_score >= 80, `Buyer Match Score Calculation (${matchRes.match_score}%)`);
    assert(matchRes.buyer_company === "ABC Mushroom Farm", "Buyer Company Name In Match Result");
  } catch (e) {
    assert(false, `Buyer Match Score - Error: ${e.message}`);
  }

  // 9. Test Multi-Farmer Supply Aggregation
  try {
    const sampleListings = [
      { id: "LST-1", seller: { name: "Farmer A" }, category: "paddy-straw", crop: "paddy-straw", quantity: 300, state: "Tamil Nadu", location: "Erode" },
      { id: "LST-2", seller: { name: "Farmer B" }, category: "paddy-straw", crop: "paddy-straw", quantity: 450, state: "Tamil Nadu", location: "Erode" },
      { id: "LST-3", seller: { name: "Farmer C" }, category: "paddy-straw", crop: "paddy-straw", quantity: 250, state: "Tamil Nadu", location: "Erode" }
    ];
    const buyerReq = { id: "usr-buyer-1", companyName: "ABC Mushroom Farm", preferredCategory: "paddy-straw", requiredQty: 1000, maxPrice: 3500 };

    const aggs = findAggregatedSupply(sampleListings, buyerReq);
    assert(aggs.length > 0, "Multi-Farmer Supply Aggregation Cluster Creation");
    assert(aggs[0].totalQuantity === 1000, `Aggregated Quantity Sum (Expected 1000, Found ${aggs[0].totalQuantity})`);
    assert(aggs[0].participatingListings.length === 3, "Participating Farmers Count in Cluster");
  } catch (e) {
    assert(false, `Supply Aggregation - Error: ${e.message}`);
  }

  // 10. Test Value Optimization & Environmental Impact
  try {
    const listing = { quantity: 10, price: 2000, category: "paddy-straw" };
    const valOpt = estimateWasteValue(listing);
    assert(valOpt.potentialUtilizationValue > valOpt.currentSaleValue, `Value Uplift Calculation (Direct: ₹${valOpt.currentSaleValue}, Utilization: ₹${valOpt.potentialUtilizationValue})`);

    const env = calculateEnvironmentalImpact(10, "paddy-straw");
    assert(env.co2AvoidedKg > 0, `CO2e Avoidance Calculation (${env.co2AvoidedKg} kg CO2e)`);
    assert(env.treesEquivalent > 0, `Trees Equivalent Calculation (${env.treesEquivalent} trees)`);
  } catch (e) {
    assert(false, `Value & Environmental Impact - Error: ${e.message}`);
  }

  // 11. Test Seed Dataset Integrity
  try {
    assert(INITIAL_LISTINGS.length >= 50, `Initial Waste Listings Count (Found ${INITIAL_LISTINGS.length}, Target >= 50)`);
  } catch (e) {
    assert(false, `Dataset Integrity - Error: ${e.message}`);
  }

  console.log("\n=========================================");
  console.log(`📊 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("=========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
