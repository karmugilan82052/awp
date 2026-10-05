/**
 * Express REST API Server for Smart Agri Waste Marketplace
 */

import express from "express";
import cors from "cors";
import { generateToken, authenticateToken, authorizeRoles } from "./middleware/auth.js";
import {
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COMPLAINTS,
  SUSTAINABILITY_METRICS
} from "../../src/store/initialData.js";
import { classifyAgriWasteImage, getAIAssistantResponse } from "../../src/services/aiService.js";
import { getRecommendedBuyersForListing } from "../../src/services/recommendationEngine.js";
import {
  calculateQualityScore,
  calculateSuitabilityScore,
  determineRecommendedApplications,
  estimateWasteValue,
  calculateEnvironmentalImpact,
  findAggregatedSupply
} from "../../src/lib/server/wasteIntelligence.ts";
import { findTopMatchesForListing, findTopListingsForBuyer, calculateBuyerMatchScore } from "../../src/lib/server/buyerMatching.ts";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database instances
let dbUsers = [...INITIAL_USERS];
let dbListings = [...INITIAL_LISTINGS];
let dbOrders = [...INITIAL_ORDERS];
let dbReviews = [...INITIAL_REVIEWS];
let dbComplaints = [...INITIAL_COMPLAINTS];
let dbCategories = [...INITIAL_CATEGORIES];

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, phone, farmName, location } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required" });
  }

  const existing = dbUsers.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const newUser = {
    id: `usr-${role || "farmer"}-${Date.now()}`,
    name,
    email,
    role: (role || "farmer").toLowerCase(),
    phone: phone || "+91 98765 43210",
    farmName: farmName || name,
    location: location || "India",
    verified: { phone: true, email: true, identity: true, gst: true },
    memberSince: "August 2026",
    rating: 5.0,
    reviewsCount: 0
  };

  dbUsers.push(newUser);
  const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: newUser
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, role } = req.body;
  let user = null;

  if (email) {
    user = dbUsers.find(u => u.email === email);
  } else if (role) {
    user = dbUsers.find(u => u.role === role.toLowerCase());
  }

  if (!user) {
    user = dbUsers[0]; // Demo fallback
  }

  const token = generateToken({ id: user.id, email: user.email, role: user.role });
  res.json({
    success: true,
    message: "Login successful",
    token,
    user
  });
});

app.get("/api/users/profile", authenticateToken, (req, res) => {
  const user = dbUsers.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

// ==========================================
// 2. WASTE LISTINGS
// ==========================================
app.get("/api/waste", (req, res) => {
  const { category, search, state, maxPrice, minQty } = req.query;
  let result = [...dbListings];

  if (category && category !== "all") {
    result = result.filter(l => l.category === category);
  }
  if (state && state !== "all") {
    result = result.filter(l => l.state === state);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(l => l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q));
  }
  if (maxPrice) {
    result = result.filter(l => l.price <= parseFloat(maxPrice));
  }
  if (minQty) {
    result = result.filter(l => l.quantity >= parseFloat(minQty));
  }

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});

app.get("/api/waste/:id", (req, res) => {
  const listing = dbListings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
  res.json({ success: true, data: listing });
});

app.post("/api/waste", authenticateToken, (req, res) => {
  const newListing = {
    id: `LST-${Date.now()}`,
    ...req.body,
    status: "Approved",
    isApproved: true,
    createdAt: new Date().toISOString().split("T")[0]
  };
  dbListings.unshift(newListing);
  res.status(201).json({ success: true, message: "Listing created", data: newListing });
});

app.put("/api/waste/:id", authenticateToken, (req, res) => {
  const idx = dbListings.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Listing not found" });

  dbListings[idx] = { ...dbListings[idx], ...req.body };
  res.json({ success: true, message: "Listing updated", data: dbListings[idx] });
});

app.delete("/api/waste/:id", authenticateToken, (req, res) => {
  dbListings = dbListings.filter(l => l.id !== req.params.id);
  res.json({ success: true, message: "Listing deleted" });
});

// ==========================================
// 3. CATEGORIES
// ==========================================
app.get("/api/categories", (req, res) => {
  res.json({ success: true, count: dbCategories.length, data: dbCategories });
});

// ==========================================
// 4. ORDERS & ESCROW
// ==========================================
app.get("/api/orders", authenticateToken, (req, res) => {
  res.json({ success: true, count: dbOrders.length, data: dbOrders });
});

app.get("/api/orders/:id", authenticateToken, (req, res) => {
  const order = dbOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, data: order });
});

app.post("/api/orders", authenticateToken, (req, res) => {
  const orderId = `AGW-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder = {
    id: orderId,
    ...req.body,
    status: "Payment Confirmed",
    statusStep: 2,
    createdAt: new Date().toLocaleString("en-IN")
  };
  dbOrders.unshift(newOrder);
  res.status(201).json({ success: true, message: "Order placed & secured in escrow", data: newOrder });
});

app.put("/api/orders/:id/status", authenticateToken, (req, res) => {
  const order = dbOrders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });

  order.status = req.body.status;
  res.json({ success: true, message: "Order status updated", data: order });
});

// ==========================================
// 5. REVIEWS & DISPUTES
// ==========================================
app.get("/api/reviews", (req, res) => {
  res.json({ success: true, count: dbReviews.length, data: dbReviews });
});

app.post("/api/reviews", authenticateToken, (req, res) => {
  const newRev = {
    id: `REV-${Date.now()}`,
    ...req.body,
    date: new Date().toLocaleDateString("en-IN")
  };
  dbReviews.unshift(newRev);
  res.status(201).json({ success: true, message: "Review posted", data: newRev });
});

app.get("/api/complaints", authenticateToken, (req, res) => {
  res.json({ success: true, count: dbComplaints.length, data: dbComplaints });
});

app.post("/api/complaints", authenticateToken, (req, res) => {
  const newCmp = {
    id: `CMP-${Date.now()}`,
    ...req.body,
    status: "Open",
    createdAt: new Date().toISOString().split("T")[0]
  };
  dbComplaints.unshift(newCmp);
  res.status(201).json({ success: true, message: "Dispute ticket opened", data: newCmp });
});

// ==========================================
// 6. AI CLASSIFIER & RECOMMENDATIONS
// ==========================================
app.post("/api/ai/classify", async (req, res) => {
  const { imageUrl } = req.body;
  const result = await classifyAgriWasteImage(imageUrl || "paddy-straw");
  res.json({ success: true, data: result });
});

app.get("/api/recommendations/:wasteId", (req, res) => {
  const listing = dbListings.find(l => l.id === req.params.wasteId) || dbListings[0];
  const recommendations = getRecommendedBuyersForListing(listing, 5);
  res.json({ success: true, data: recommendations });
});

// ==========================================
// 6.5 AGRIWASTE INTELLIGENCE ENGINE API ENDPOINTS
// ==========================================
app.get("/api/intelligence/listings", (req, res) => {
  const buyerProfiles = dbUsers.filter(u => u.role === "buyer");
  const enriched = dbListings.map(listing => {
    const quality = calculateQualityScore(listing);
    const suitability = calculateSuitabilityScore(listing);
    const recommendations = determineRecommendedApplications(listing);
    const buyerMatches = findTopMatchesForListing(listing, buyerProfiles, 3);
    const valueOpt = estimateWasteValue(listing);
    const envImpact = calculateEnvironmentalImpact(listing.quantity || 1, listing.category);

    return {
      ...listing,
      quality,
      suitability,
      recommendations,
      buyerMatches,
      valueOpt,
      envImpact
    };
  });

  res.json({ success: true, count: enriched.length, data: enriched });
});

app.get("/api/intelligence/waste/:id", (req, res) => {
  const listing = dbListings.find(l => l.id === req.params.id);
  if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });

  const buyerProfiles = dbUsers.filter(u => u.role === "buyer");
  const quality = calculateQualityScore(listing);
  const suitability = calculateSuitabilityScore(listing);
  const recommendations = determineRecommendedApplications(listing);
  const buyerMatches = findTopMatchesForListing(listing, buyerProfiles, 5);
  const valueOpt = estimateWasteValue(listing);
  const envImpact = calculateEnvironmentalImpact(listing.quantity || 1, listing.category);

  res.json({
    success: true,
    data: {
      listing,
      quality,
      suitability,
      recommendations,
      buyerMatches,
      valueOpt,
      envImpact
    }
  });
});

app.post("/api/intelligence/analyze", (req, res) => {
  const listingData = req.body || {};
  const quality = calculateQualityScore(listingData);
  const suitability = calculateSuitabilityScore(listingData);
  const recommendations = determineRecommendedApplications(listingData);
  const valueOpt = estimateWasteValue(listingData);
  const envImpact = calculateEnvironmentalImpact(listingData.quantity || 1, listingData.category);

  res.json({
    success: true,
    data: {
      quality,
      suitability,
      recommendations,
      valueOpt,
      envImpact
    }
  });
});

app.get("/api/intelligence/aggregated-supply", (req, res) => {
  const buyerProfiles = dbUsers.filter(u => u.role === "buyer");
  const buyerReqs = buyerProfiles.map(b => ({
    id: b.id,
    name: b.name,
    companyName: b.companyName || b.farmName || b.name,
    preferredCategory: b.preferredCategory || "paddy-straw",
    requiredQty: b.requiredQty || 10,
    maxPrice: b.maxPrice || 3500
  }));

  const aggregated = findAggregatedSupply(dbListings, buyerReqs);
  res.json({ success: true, count: aggregated.length, data: aggregated });
});

app.get("/api/intelligence/buyer-matches/:buyerId", (req, res) => {
  const buyer = dbUsers.find(u => u.id === req.params.buyerId) || dbUsers.find(u => u.role === "buyer");
  if (!buyer) return res.status(404).json({ success: false, message: "Buyer profile not found" });

  const topListings = findTopListingsForBuyer(buyer, dbListings, 10);
  res.json({ success: true, buyerId: buyer.id, buyerName: buyer.name, data: topListings });
});

// ==========================================
// 7. ADMIN DASHBOARD & ANALYTICS
// ==========================================
app.get("/api/admin/dashboard", authenticateToken, (req, res) => {
  res.json({
    success: true,
    metrics: {
      totalFarmers: dbUsers.filter(u => u.role === "farmer").length,
      totalBuyers: dbUsers.filter(u => u.role === "buyer").length,
      totalListings: dbListings.length,
      totalOrders: dbOrders.length,
      sustainability: SUSTAINABILITY_METRICS
    }
  });
});

// Start Server if run directly
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🌾 AgriWaste REST API Server running on port ${PORT}`);
  });
}

export default app;
