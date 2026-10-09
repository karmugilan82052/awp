/**
 * Automated Test Suite for Smart Agri Waste Marketplace System
 */

import { generateToken } from "../src/middleware/auth.js";
import { classifyAgriWasteImage, getAIAssistantResponse } from "../../src/services/aiService.js";
import { getRecommendedBuyersForListing } from "../../src/services/recommendationEngine.js";
import { calculateDistanceKm } from "../../src/utils/helpers.js";
import { INITIAL_LISTINGS } from "../../src/store/initialData.js";

async function runTests() {
  console.log("=========================================");
  console.log("🧪 STARTING AGRIWASTE SYSTEM TEST SUITE");
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
    // Distance between Coimbatore (11.0168, 76.9558) and Pollachi (10.6586, 77.0084) is ~40 km
    const dist = calculateDistanceKm(11.0168, 76.9558, 10.6586, 77.0084);
    assert(dist >= 35 && dist <= 48, `Haversine Distance Calculation (${dist} km)`);
  } catch (e) {
    assert(false, `Haversine Distance - Error: ${e.message}`);
  }

  // 5. Test Smart Buyer Recommendation Engine
  try {
    const sampleListing = INITIAL_LISTINGS[0];
    const recs = getRecommendedBuyersForListing(sampleListing, 3);
    assert(Array.isArray(recs) && recs.length === 3, "Smart Recommendation Engine Count");
    assert(recs[0].matchScore >= recs[1].matchScore, "Smart Recommendation Ranking Order");
    assert(recs[0].matchScore > 70, "Smart Recommendation Compatibility Score > 70%");
  } catch (e) {
    assert(false, `Recommendation Engine - Error: ${e.message}`);
  }

  // 6. Test Seed Dataset Integrity
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
